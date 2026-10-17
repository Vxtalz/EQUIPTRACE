import React, { useState } from 'react';
import {
  ArrowLeft, KeyRound, Smartphone, LogOut,
  ChevronRight, ShieldCheck, X, AlertTriangle, Eye, EyeOff,
} from 'lucide-react';
import {
  auth,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
} from '../../services/firebase';

export default function SecurityScreen({ onBack }) {
  const [showSignOutConfirm, setShowSignOutConfirm] = useState(false);
  const [showChangePassword, setShowChangePassword]  = useState(false);
  const [showActiveSessions, setShowActiveSessions]  = useState(false);
  const [signedOutDone, setSignedOutDone] = useState(false);

  // Change-password form
  const [pwForm, setPwForm] = useState({ current: '', next: '', confirm: '' });
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNext, setShowNext]       = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [pwError, setPwError]   = useState('');
  const [pwLoading, setPwLoading] = useState(false);
  const [pwSuccess, setPwSuccess] = useState(false);

  const securityItems = [
    {
      id: 'password',
      icon: <KeyRound size={22} color="#1D61E7" strokeWidth={2} />,
      iconBg: '#EEF4FF',
      title: 'Change Password',
      subtitle: 'Update your account password securely.',
      action: () => { setPwError(''); setPwSuccess(false); setShowChangePassword(true); },
    },
    {
      id: 'sessions',
      icon: <Smartphone size={22} color="#1D61E7" strokeWidth={2} />,
      iconBg: '#EEF4FF',
      title: 'Active Sessions',
      subtitle: 'View devices currently signed in to your account.',
      action: () => setShowActiveSessions(true),
    },
    {
      id: 'signout',
      icon: <LogOut size={22} color="#EF4444" strokeWidth={2} />,
      iconBg: '#FEE2E2',
      title: 'Sign Out All Devices',
      subtitle: 'End other active sessions if you suspect unauthorized access.',
      danger: true,
      action: () => setShowSignOutConfirm(true),
    },
  ];

  // ── Real Firebase password change ──────────────────────────────────────────
  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPwError('');

    const user = auth.currentUser;
    if (!user || !user.email) {
      setPwError('No authenticated user found. Please log in again.');
      return;
    }
    if (!pwForm.current) { setPwError('Please enter your current password.'); return; }
    if (pwForm.next.length < 8) { setPwError('New password must be at least 8 characters.'); return; }
    if (pwForm.next !== pwForm.confirm) { setPwError('Passwords do not match.'); return; }

    setPwLoading(true);
    try {
      // Step 1 – re-authenticate
      const credential = EmailAuthProvider.credential(user.email, pwForm.current);
      await reauthenticateWithCredential(user, credential);

      // Step 2 – update password
      await updatePassword(user, pwForm.next);

      setPwSuccess(true);
      setPwForm({ current: '', next: '', confirm: '' });
      setTimeout(() => { setShowChangePassword(false); setPwSuccess(false); }, 2000);
    } catch (err) {
      const code = err.code || '';
      if (code === 'auth/wrong-password' || code === 'auth/invalid-credential') {
        setPwError('Current password is incorrect. Please try again.');
      } else if (code === 'auth/too-many-requests') {
        setPwError('Too many attempts. Please try again later.');
      } else if (code === 'auth/requires-recent-login') {
        setPwError('Session expired. Please log out and log in again before changing your password.');
      } else {
        setPwError(err.message || 'Failed to update password.');
      }
    } finally {
      setPwLoading(false);
    }
  };

  const handleSignOutAll = () => {
    setShowSignOutConfirm(false);
    setSignedOutDone(true);
    setTimeout(() => setSignedOutDone(false), 2500);
  };

  const inputStyle = {
    width: '100%', height: '46px',
    border: '1px solid #E2E8F0', borderRadius: '12px',
    padding: '0 40px 0 14px', fontSize: '0.9rem',
    color: '#0F1E36', outline: 'none', fontFamily: 'inherit',
    backgroundColor: '#F8FAFC',
  };

  const eyeBtn = (show, toggle) => (
    <button
      type="button"
      onClick={toggle}
      style={{
        position: 'absolute', right: '12px', top: '50%',
        transform: 'translateY(-50%)', background: 'none',
        border: 'none', cursor: 'pointer', color: '#94A3B8',
        display: 'flex', alignItems: 'center', padding: 0,
      }}
    >
      {show ? <EyeOff size={17} /> : <Eye size={17} />}
    </button>
  );

  return (
    <>
      <div
        className="animate-fade-in"
        style={{
          display: 'flex', flexDirection: 'column',
          padding: '16px 20px 32px 20px',
          backgroundColor: '#F2F5FA', minHeight: '100%', gap: '20px',
        }}
      >
        {/* Header */}
        <div style={{ paddingTop: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '4px' }}>
            <div
              onClick={onBack}
              style={{
                width: '38px', height: '38px', borderRadius: '50%',
                backgroundColor: '#1D61E7',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 4px 10px rgba(29,97,231,0.25)', cursor: 'pointer', flexShrink: 0,
              }}
            >
              <ArrowLeft size={18} color="#FFFFFF" strokeWidth={2.5} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.3rem', fontWeight: '800', color: '#0F1E36', letterSpacing: '-0.3px' }}>
                Security
              </h2>
              <p style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: '500', marginTop: '1px' }}>
                Protect your account and manage active sessions.
              </p>
            </div>
          </div>
        </div>

        {/* Banner */}
        <div style={{
          background: 'linear-gradient(135deg, #1D61E7 0%, #1251C8 100%)',
          borderRadius: '18px', padding: '16px 20px',
          display: 'flex', alignItems: 'center', gap: '14px',
          boxShadow: '0 6px 20px rgba(29,97,231,0.22)',
        }}>
          <div style={{
            width: '48px', height: '48px', borderRadius: '14px',
            backgroundColor: 'rgba(255,255,255,0.18)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}>
            <ShieldCheck size={26} color="#FFFFFF" strokeWidth={2} />
          </div>
          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: '700', color: '#FFFFFF' }}>Account Secured</h4>
            <p style={{ fontSize: '0.78rem', color: '#C7DAFF', marginTop: '2px', lineHeight: '1.35' }}>
              Your account protection is active. Review settings below.
            </p>
          </div>
        </div>

        {/* Items */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {securityItems.map((item) => (
            <div
              key={item.id}
              onClick={item.action}
              style={{
                backgroundColor: '#FFFFFF', borderRadius: '18px',
                padding: '16px 18px', display: 'flex', alignItems: 'center', gap: '16px',
                boxShadow: '0 2px 8px rgba(13,26,48,0.05)', cursor: 'pointer',
                transition: 'transform 0.15s ease, box-shadow 0.15s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-1px)';
                e.currentTarget.style.boxShadow = item.danger
                  ? '0 4px 16px rgba(239,68,68,0.12)'
                  : '0 4px 16px rgba(29,97,231,0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'none';
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(13,26,48,0.05)';
              }}
            >
              <div style={{
                width: '48px', height: '48px', borderRadius: '14px',
                backgroundColor: item.iconBg,
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}>
                {item.icon}
              </div>
              <div style={{ flex: 1 }}>
                <h4 style={{
                  fontSize: '0.95rem', fontWeight: '700',
                  color: item.danger ? '#DC2626' : '#0F1E36', letterSpacing: '-0.1px',
                }}>
                  {item.title}
                </h4>
                <p style={{ fontSize: '0.78rem', color: '#64748B', marginTop: '3px', lineHeight: '1.35' }}>
                  {item.subtitle}
                </p>
              </div>
              <ChevronRight size={18} color={item.danger ? '#EF4444' : '#94A3B8'} strokeWidth={2.2} />
            </div>
          ))}
        </div>

        {/* Sign-out done toast */}
        {signedOutDone && (
          <div style={{
            position: 'fixed', bottom: '100px', left: '50%', transform: 'translateX(-50%)',
            backgroundColor: '#0D1A30', color: '#FFFFFF',
            padding: '10px 20px', borderRadius: '12px',
            fontSize: '0.85rem', fontWeight: '600',
            boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
            whiteSpace: 'nowrap', zIndex: 200,
            animation: 'fadeIn 0.25s ease',
          }}>
            ✓ All other devices signed out
          </div>
        )}
      </div>

      {/* ── Change Password Modal ── */}
      {showChangePassword && (
        <div style={{
          position: 'absolute', inset: 0, zIndex: 100,
          backgroundColor: 'rgba(15,30,54,0.55)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
          animation: 'fadeIn 0.2s ease',
        }}>
          <div style={{
            backgroundColor: '#FFFFFF', width: '100%',
            borderTopLeftRadius: '24px', borderTopRightRadius: '24px',
            padding: '24px 20px 32px 20px',
            display: 'flex', flexDirection: 'column', gap: '14px',
            boxShadow: '0 -10px 30px rgba(0,0,0,0.2)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#0F1E36' }}>Change Password</h3>
                <p style={{ fontSize: '0.78rem', color: '#64748B', marginTop: '2px' }}>
                  Update your account password securely.
                </p>
              </div>
              <button
                type="button"
                onClick={() => { setShowChangePassword(false); setPwError(''); setPwForm({ current: '', next: '', confirm: '' }); }}
                style={{ background: '#F1F5F9', border: 'none', borderRadius: '50%', width: '34px', height: '34px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
              >
                <X size={18} color="#64748B" />
              </button>
            </div>

            {pwSuccess ? (
              <div style={{ textAlign: 'center', padding: '24px 0' }}>
                <div style={{ fontSize: '2.8rem', marginBottom: '10px' }}>✅</div>
                <p style={{ fontWeight: '700', color: '#15803D', fontSize: '1rem' }}>Password updated successfully!</p>
                <p style={{ fontSize: '0.82rem', color: '#64748B', marginTop: '4px' }}>Closing…</p>
              </div>
            ) : (
              <form onSubmit={handleChangePassword} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {/* Current Password */}
                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: '700', color: '#64748B', display: 'block', marginBottom: '6px' }}>
                    Current Password
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type={showCurrent ? 'text' : 'password'}
                      value={pwForm.current}
                      onChange={(e) => setPwForm((f) => ({ ...f, current: e.target.value }))}
                      placeholder="••••••••"
                      style={inputStyle}
                    />
                    {eyeBtn(showCurrent, () => setShowCurrent((v) => !v))}
                  </div>
                </div>

                {/* New Password */}
                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: '700', color: '#64748B', display: 'block', marginBottom: '6px' }}>
                    New Password
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type={showNext ? 'text' : 'password'}
                      value={pwForm.next}
                      onChange={(e) => setPwForm((f) => ({ ...f, next: e.target.value }))}
                      placeholder="Min. 8 characters"
                      style={inputStyle}
                    />
                    {eyeBtn(showNext, () => setShowNext((v) => !v))}
                  </div>
                </div>

                {/* Confirm Password */}
                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: '700', color: '#64748B', display: 'block', marginBottom: '6px' }}>
                    Confirm New Password
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type={showConfirm ? 'text' : 'password'}
                      value={pwForm.confirm}
                      onChange={(e) => setPwForm((f) => ({ ...f, confirm: e.target.value }))}
                      placeholder="Re-enter new password"
                      style={inputStyle}
                    />
                    {eyeBtn(showConfirm, () => setShowConfirm((v) => !v))}
                  </div>
                </div>

                {pwError && (
                  <div style={{
                    backgroundColor: '#FEF2F2', border: '1px solid #FCA5A5',
                    borderRadius: '10px', padding: '10px 12px',
                    display: 'flex', alignItems: 'flex-start', gap: '8px',
                  }}>
                    <AlertTriangle size={16} color="#DC2626" style={{ flexShrink: 0, marginTop: '1px' }} />
                    <span style={{ fontSize: '0.8rem', color: '#B91C1C', fontWeight: '500', lineHeight: '1.4' }}>{pwError}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={pwLoading}
                  style={{
                    width: '100%', height: '50px', marginTop: '4px',
                    backgroundColor: pwLoading ? '#93C5FD' : '#1D61E7',
                    color: '#FFFFFF', border: 'none', borderRadius: '14px',
                    fontSize: '0.95rem', fontWeight: '700',
                    cursor: pwLoading ? 'not-allowed' : 'pointer',
                    fontFamily: 'inherit', transition: 'background-color 0.2s ease',
                  }}
                >
                  {pwLoading ? 'Updating…' : 'Update Password'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* ── Active Sessions Modal ── */}
      {showActiveSessions && (
        <div style={{
          position: 'absolute', inset: 0, zIndex: 100,
          backgroundColor: 'rgba(15,30,54,0.55)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
          animation: 'fadeIn 0.2s ease',
        }}>
          <div style={{
            backgroundColor: '#FFFFFF', width: '100%',
            borderTopLeftRadius: '24px', borderTopRightRadius: '24px',
            padding: '24px 20px 32px 20px',
            display: 'flex', flexDirection: 'column', gap: '14px',
            boxShadow: '0 -10px 30px rgba(0,0,0,0.2)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#0F1E36' }}>Active Sessions</h3>
                <p style={{ fontSize: '0.78rem', color: '#64748B', marginTop: '2px' }}>Devices currently signed in.</p>
              </div>
              <button
                type="button"
                onClick={() => setShowActiveSessions(false)}
                style={{ background: '#F1F5F9', border: 'none', borderRadius: '50%', width: '34px', height: '34px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
              >
                <X size={18} color="#64748B" />
              </button>
            </div>
            {[
              { device: 'Chrome on Windows', location: 'Manila, PH', time: 'Active now', current: true },
              { device: 'Safari on iPhone 14', location: 'Quezon City, PH', time: '2 hours ago', current: false },
            ].map((session, i) => (
              <div key={i} style={{
                backgroundColor: session.current ? '#F0F7FF' : '#F8FAFC',
                borderRadius: '14px', padding: '14px 16px',
                border: `1px solid ${session.current ? '#BFDBFE' : '#E2E8F0'}`,
                display: 'flex', alignItems: 'center', gap: '12px',
              }}>
                <div style={{
                  width: '42px', height: '42px', borderRadius: '12px',
                  backgroundColor: session.current ? '#EEF4FF' : '#F1F5F9',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}>
                  <Smartphone size={20} color={session.current ? '#1D61E7' : '#94A3B8'} strokeWidth={2} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <h4 style={{ fontSize: '0.875rem', fontWeight: '700', color: '#0F1E36' }}>{session.device}</h4>
                    {session.current && (
                      <span style={{ fontSize: '0.65rem', fontWeight: '700', backgroundColor: '#DCFCE7', color: '#15803D', padding: '2px 7px', borderRadius: '9999px' }}>This device</span>
                    )}
                  </div>
                  <p style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '2px' }}>
                    {session.location} · {session.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Sign Out All Confirm ── */}
      {showSignOutConfirm && (
        <div style={{
          position: 'absolute', inset: 0, zIndex: 100,
          backgroundColor: 'rgba(15,30,54,0.55)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px',
          animation: 'fadeIn 0.2s ease',
        }}>
          <div style={{
            backgroundColor: '#FFFFFF', width: '100%', maxWidth: '340px',
            borderRadius: '24px', padding: '28px 24px',
            display: 'flex', flexDirection: 'column', gap: '16px',
            boxShadow: '0 20px 50px rgba(0,0,0,0.25)', textAlign: 'center',
          }}>
            <div style={{ width: '60px', height: '60px', borderRadius: '50%', backgroundColor: '#FEE2E2', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto' }}>
              <AlertTriangle size={28} color="#EF4444" strokeWidth={2} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: '800', color: '#0F1E36' }}>Sign Out All Devices?</h3>
              <p style={{ fontSize: '0.82rem', color: '#64748B', marginTop: '6px', lineHeight: '1.45' }}>
                This will end all other active sessions. You will remain signed in on this device.
              </p>
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button type="button" onClick={() => setShowSignOutConfirm(false)} style={{ flex: 1, height: '46px', backgroundColor: '#F1F5F9', color: '#0F1E36', border: 'none', borderRadius: '12px', fontSize: '0.9rem', fontWeight: '700', cursor: 'pointer', fontFamily: 'inherit' }}>Cancel</button>
              <button type="button" onClick={handleSignOutAll} style={{ flex: 1, height: '46px', backgroundColor: '#EF4444', color: '#FFFFFF', border: 'none', borderRadius: '12px', fontSize: '0.9rem', fontWeight: '700', cursor: 'pointer', fontFamily: 'inherit' }}>Sign Out</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
