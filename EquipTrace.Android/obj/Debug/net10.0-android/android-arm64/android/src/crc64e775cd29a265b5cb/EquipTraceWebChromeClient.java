package crc64e775cd29a265b5cb;


public class EquipTraceWebChromeClient
	extends android.webkit.WebChromeClient
	implements
		mono.android.IGCUserPeer
{
/** @hide */
	public static final String __md_methods;
	static {
		__md_methods = 
			"n_onPermissionRequest:(Landroid/webkit/PermissionRequest;)V:GetOnPermissionRequest_Landroid_webkit_PermissionRequest_Handler\n" +
			"";
		mono.android.Runtime.register ("EquipTrace.Android.EquipTraceWebChromeClient, EquipTrace.Android", EquipTraceWebChromeClient.class, __md_methods);
	}

	public EquipTraceWebChromeClient ()
	{
		super ();
		if (getClass () == EquipTraceWebChromeClient.class) {
			mono.android.TypeManager.Activate ("EquipTrace.Android.EquipTraceWebChromeClient, EquipTrace.Android", "", this, new java.lang.Object[] {  });
		}
	}

	public EquipTraceWebChromeClient (android.app.Activity p0)
	{
		super ();
		if (getClass () == EquipTraceWebChromeClient.class) {
			mono.android.TypeManager.Activate ("EquipTrace.Android.EquipTraceWebChromeClient, EquipTrace.Android", "Android.App.Activity, Mono.Android", this, new java.lang.Object[] { p0 });
		}
	}

	public void onPermissionRequest (android.webkit.PermissionRequest p0)
	{
		n_onPermissionRequest (p0);
	}

	private native void n_onPermissionRequest (android.webkit.PermissionRequest p0);

	private java.util.ArrayList refList;
	public void monodroidAddReference (java.lang.Object obj)
	{
		if (refList == null)
			refList = new java.util.ArrayList ();
		refList.add (obj);
	}

	public void monodroidClearReferences ()
	{
		if (refList != null)
			refList.clear ();
	}
}
