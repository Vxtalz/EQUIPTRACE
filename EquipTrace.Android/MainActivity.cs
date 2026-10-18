using Android.App;
using Android.OS;
using Android.Webkit;
using Android.Views;
using Android.Content.PM;

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

    protected override void OnCreate(Bundle? savedInstanceState)
    {
        base.OnCreate(savedInstanceState);

        if (Build.VERSION.SdkInt >= BuildVersionCodes.Lollipop)
        {
            Window?.AddFlags(WindowManagerFlags.DrawsSystemBarBackgrounds);
#pragma warning disable CA1422
            Window?.SetStatusBarColor(global::Android.Graphics.Color.ParseColor("#0F1E36"));
#pragma warning restore CA1422
        }

        _webView = new WebView(this);
        _webView.LayoutParameters = new ViewGroup.LayoutParams(
            ViewGroup.LayoutParams.MatchParent,
            ViewGroup.LayoutParams.MatchParent);

        var settings = _webView.Settings;
        settings.JavaScriptEnabled = true;
        settings.DomStorageEnabled = true;
        settings.DatabaseEnabled = true;
        settings.AllowFileAccess = true;
        settings.AllowContentAccess = true;
        settings.AllowFileAccessFromFileURLs = true;
        settings.AllowUniversalAccessFromFileURLs = true;
        settings.MediaPlaybackRequiresUserGesture = false;

        settings.SetSupportZoom(false);
        settings.BuiltInZoomControls = false;
        settings.DisplayZoomControls = false;

        _webView.SetWebViewClient(new EquipTraceWebViewClient());
        _webView.SetWebChromeClient(new EquipTraceWebChromeClient(this));

        SetContentView(_webView);

        _webView.LoadUrl("file:///android_asset/www/index.html");
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
        if (url.StartsWith("file:///android_asset/") || url.Contains("localhost"))
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
}