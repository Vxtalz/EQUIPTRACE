using Android.App;
using Android.OS;
using Android.Webkit;
using Android.Views;
using Android.Content.PM;
using System.Net;
using System.IO;
using System.Threading;
using System.Threading.Tasks;

namespace EquipTrace.Android;

[Activity(
    Label = "EquipTrace",
    Theme = "@android:style/Theme.DeviceDefault.NoActionBar",
    MainLauncher = true,
    Exported = true,
    ConfigurationChanges = ConfigChanges.ScreenSize | ConfigChanges.Orientation | ConfigChanges.KeyboardHidden,
    HardwareAccelerated = true)]
public class MainActivity : Activity
{
    private WebView? _webView;
    private EquipTraceWebChromeClient? _webChromeClient;
    private HttpListener? _httpListener;
    private readonly int _port = 8844;
    private CancellationTokenSource? _cts;

    protected override void OnCreate(Bundle? savedInstanceState)
    {
        base.OnCreate(savedInstanceState);

        if (Build.VERSION.SdkInt >= BuildVersionCodes.M)
        {
            Window?.AddFlags(WindowManagerFlags.DrawsSystemBarBackgrounds);
#pragma warning disable CA1422
            Window?.SetStatusBarColor(global::Android.Graphics.Color.White);
            if (Window?.DecorView != null)
            {
                Window.DecorView.SystemUiFlags = SystemUiFlags.LightStatusBar;
            }
#pragma warning restore CA1422

            // Proactively request camera and media access so QR scanning and gallery uploads work immediately
            var perms = new System.Collections.Generic.List<string> { global::Android.Manifest.Permission.Camera };
            if (Build.VERSION.SdkInt >= BuildVersionCodes.Tiramisu)
            {
                perms.Add(global::Android.Manifest.Permission.ReadMediaImages);
            }
            else
            {
                perms.Add(global::Android.Manifest.Permission.ReadExternalStorage);
            }

            var needed = perms.Where(p => CheckSelfPermission(p) != global::Android.Content.PM.Permission.Granted).ToArray();
            if (needed.Length > 0)
            {
                RequestPermissions(needed, 1001);
            }
        }
        else if (Build.VERSION.SdkInt >= BuildVersionCodes.Lollipop)
        {
            Window?.AddFlags(WindowManagerFlags.DrawsSystemBarBackgrounds);
#pragma warning disable CA1422
            Window?.SetStatusBarColor(global::Android.Graphics.Color.White);
#pragma warning restore CA1422
        }

        StartLocalWebServer();

        _webView = new WebView(this);
        _webView.LayoutParameters = new ViewGroup.LayoutParams(
            ViewGroup.LayoutParams.MatchParent,
            ViewGroup.LayoutParams.MatchParent);

        // Disable scrollbars and bounce effects for a clean, true native app feel
        _webView.HorizontalScrollBarEnabled = false;
        _webView.VerticalScrollBarEnabled = false;
        _webView.ScrollBarStyle = ScrollbarStyles.OutsideOverlay;
        _webView.OverScrollMode = OverScrollMode.Never;

        var settings = _webView.Settings;
        settings.JavaScriptEnabled = true;
        settings.DomStorageEnabled = true;
        settings.DatabaseEnabled = true;
        settings.AllowFileAccess = true;
        settings.AllowContentAccess = true;
        settings.MediaPlaybackRequiresUserGesture = false;

        settings.UseWideViewPort = true;
        settings.LoadWithOverviewMode = true;
        settings.SetSupportZoom(false);
        settings.BuiltInZoomControls = false;
        settings.DisplayZoomControls = false;

        _webChromeClient = new EquipTraceWebChromeClient(this);
        _webView.SetWebViewClient(new EquipTraceWebViewClient());
        _webView.SetWebChromeClient(_webChromeClient);

        SetContentView(_webView);

        _webView.LoadUrl($"http://127.0.0.1:{_port}/index.html");
    }

    protected override void OnActivityResult(int requestCode, Result resultCode, global::Android.Content.Intent? data)
    {
        base.OnActivityResult(requestCode, resultCode, data);

        if (requestCode == EquipTraceWebChromeClient.FILECHOOSER_RESULTCODE)
        {
            var callback = _webChromeClient?.FilePathCallback;
            if (callback != null)
            {
                global::Android.Net.Uri[]? results = null;
                if (resultCode == Result.Ok && data != null)
                {
                    if (data.ClipData != null)
                    {
                        var count = data.ClipData.ItemCount;
                        results = new global::Android.Net.Uri[count];
                        for (int i = 0; i < count; i++)
                        {
                            results[i] = data.ClipData.GetItemAt(i).Uri!;
                        }
                    }
                    else if (data.Data != null)
                    {
                        results = new global::Android.Net.Uri[] { data.Data };
                    }
                }
                callback.OnReceiveValue(results);
                _webChromeClient!.FilePathCallback = null;
            }
        }
    }

    private void StartLocalWebServer()
    {
        try
        {
            _cts = new CancellationTokenSource();
            _httpListener = new HttpListener();
            _httpListener.Prefixes.Add($"http://127.0.0.1:{_port}/");
            _httpListener.Start();

            Task.Run(async () =>
            {
                while (_httpListener != null && _httpListener.IsListening && !_cts.Token.IsCancellationRequested)
                {
                    try
                    {
                        var context = await _httpListener.GetContextAsync();
                        ProcessRequest(context);
                    }
                    catch
                    {
                        break;
                    }
                }
            }, _cts.Token);
        }
        catch (System.Exception ex)
        {
            global::Android.Util.Log.Error("EquipTrace", "Local web server error: " + ex.Message);
        }
    }

    private void ProcessRequest(HttpListenerContext context)
    {
        try
        {
            var rawPath = System.Uri.UnescapeDataString(context.Request.Url?.AbsolutePath.TrimStart('/') ?? string.Empty);
            if (string.IsNullOrEmpty(rawPath) || rawPath == "/")
            {
                rawPath = "index.html";
            }

            var assetPath = "www/" + rawPath;
            Stream? assetStream = null;
            try
            {
                assetStream = Assets?.Open(assetPath);
            }
            catch (System.Exception ex)
            {
                global::Android.Util.Log.Warn("EquipTrace", $"Asset '{assetPath}' not found: {ex.Message}");
            }

            if (assetStream != null)
            {
                using (assetStream)
                {
                    var ext = Path.GetExtension(rawPath).ToLowerInvariant();
                    var contentType = ext switch
                    {
                        ".html" => "text/html; charset=utf-8",
                        ".js" or ".mjs" => "application/javascript; charset=utf-8",
                        ".css" => "text/css; charset=utf-8",
                        ".png" => "image/png",
                        ".jpg" or ".jpeg" => "image/jpeg",
                        ".svg" => "image/svg+xml",
                        ".json" => "application/json; charset=utf-8",
                        ".woff" => "font/woff",
                        ".woff2" => "font/woff2",
                        ".ttf" => "font/ttf",
                        ".ico" => "image/x-icon",
                        _ => "application/octet-stream"
                    };

                    context.Response.ContentType = contentType;
                    context.Response.StatusCode = (int)HttpStatusCode.OK;
                    context.Response.Headers.Add("Access-Control-Allow-Origin", "*");
                    assetStream.CopyTo(context.Response.OutputStream);
                }
            }
            else
            {
                // Only fallback to index.html for extensionless SPA routes (e.g., /admin, /dashboard)
                if (!Path.HasExtension(rawPath))
                {
                    using var fallback = Assets?.Open("www/index.html");
                    if (fallback != null)
                    {
                        context.Response.ContentType = "text/html; charset=utf-8";
                        context.Response.StatusCode = (int)HttpStatusCode.OK;
                        context.Response.Headers.Add("Access-Control-Allow-Origin", "*");
                        fallback.CopyTo(context.Response.OutputStream);
                        return;
                    }
                }

                context.Response.StatusCode = (int)HttpStatusCode.NotFound;
            }
        }
        catch (System.Exception ex)
        {
            global::Android.Util.Log.Error("EquipTrace", $"ProcessRequest exception: {ex}");
            try { context.Response.StatusCode = (int)HttpStatusCode.InternalServerError; } catch { }
        }
        finally
        {
            try { context.Response.Close(); } catch { }
        }
    }

    protected override void OnDestroy()
    {
        base.OnDestroy();
        try
        {
            _cts?.Cancel();
            _httpListener?.Stop();
            _httpListener?.Close();
        }
        catch { }
    }

    public override bool OnKeyDown(Keycode keyCode, KeyEvent? e)
    {
        if (keyCode == Keycode.Back && _webView != null && _webView.CanGoBack())
        {
            _webView.GoBack();
            return true;
        }
        return base.OnKeyDown(keyCode, e);
    }
}

public class EquipTraceWebViewClient : WebViewClient
{
    public override bool ShouldOverrideUrlLoading(WebView? view, IWebResourceRequest? request)
    {
        var url = request?.Url?.ToString() ?? string.Empty;
        if (url.Contains("127.0.0.1") || url.Contains("localhost"))
        {
            return false;
        }

        try
        {
            var intent = new global::Android.Content.Intent(
                global::Android.Content.Intent.ActionView,
                global::Android.Net.Uri.Parse(url));
            view?.Context?.StartActivity(intent);
            return true;
        }
        catch
        {
            return false;
        }
    }
}

public class EquipTraceWebChromeClient : WebChromeClient
{
    private readonly Activity _activity;
    public IValueCallback? FilePathCallback { get; set; }
    public static readonly int FILECHOOSER_RESULTCODE = 1002;

    public EquipTraceWebChromeClient(Activity activity)
    {
        _activity = activity;
    }

    public override void OnPermissionRequest(PermissionRequest? request)
    {
        if (request != null)
        {
            _activity.RunOnUiThread(() =>
            {
                request.Grant(request.GetResources());
            });
        }
    }

    public override bool OnShowFileChooser(WebView? webView, IValueCallback? filePathCallback, FileChooserParams? fileChooserParams)
    {
        if (FilePathCallback != null)
        {
            FilePathCallback.OnReceiveValue(null);
            FilePathCallback = null;
        }

        FilePathCallback = filePathCallback;

        try
        {
            var intent = fileChooserParams?.CreateIntent();
            if (intent == null)
            {
                intent = new global::Android.Content.Intent(global::Android.Content.Intent.ActionGetContent);
                intent.AddCategory(global::Android.Content.Intent.CategoryOpenable);
                intent.SetType("image/*");
            }
            _activity.StartActivityForResult(global::Android.Content.Intent.CreateChooser(intent, "Select QR Code Image"), FILECHOOSER_RESULTCODE);
            return true;
        }
        catch (System.Exception ex)
        {
            global::Android.Util.Log.Error("EquipTrace", $"OnShowFileChooser error: {ex}");
            FilePathCallback?.OnReceiveValue(null);
            FilePathCallback = null;
            return false;
        }
    }

    public override bool OnConsoleMessage(ConsoleMessage? consoleMessage)
    {
        if (consoleMessage != null)
        {
            var msg = $"[{consoleMessage.InvokeMessageLevel()}] {consoleMessage.Message()} ({consoleMessage.SourceId()}:{consoleMessage.LineNumber()})";
            global::Android.Util.Log.Info("EquipTraceJS", msg);
        }
        return base.OnConsoleMessage(consoleMessage);
    }
}