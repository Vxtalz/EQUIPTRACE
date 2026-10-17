import React, { useState } from 'react';
import {
  ArrowLeft,
  Bell,
  CheckCircle,
  Clock,
  AlertTriangle,
  Smartphone,
  ShieldCheck,
  Send,
  Sliders,
} from 'lucide-react';

export default function NotificationsSettingsScreen({
  notifications = [],
  onBack,
  onClearUnread,
  onSendTestNotification,
}) {
  const [prefs, setPrefs] = useState({
    pushBanner: true,
    dueReminders: true,
    approvalAlerts: true,
    overdueWarning: true,
  });

  const [testSent, setTestSent] = useState(false);

  const togglePref = (key) => {
    setPrefs((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleTriggerTest = () => {
    if (onSendTestNotification) {
      onSendTestNotification({
        title: 'EQUIPTRACE Push Alert',
        message: 'Your equipment request for Basketball (PE-015) was approved!',
        time: 'Just now',
      });
    }
    setTestSent(true);
    setTimeout(() => setTestSent(false), 3000);
  };

  return (
    <div
      className="notifications-settings-screen animate-fade-in"
      style={{
        display: 'flex',
        flexDirection: 'column',
        padding: '16px 20px 32px 20px',
        backgroundColor: '#F8FAFC',
        minHeight: '100%',
        gap: '18px',
      }}
    >
      {/* Header */}
      <div style={{ paddingTop: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              onClick={onBack}
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                backgroundColor: '#1D61E7',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 10px rgba(29,97,231,0.25)',
                cursor: 'pointer',
                flexShrink: 0,
              }}
            >
              <ArrowLeft size={18} color="#FFFFFF" strokeWidth={2.5} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#0F1E36', letterSpacing: '-0.3px' }}>
                Notifications
              </h2>
              <p style={{ fontSize: '0.78rem', color: '#64748B', fontWeight: '500', marginTop: '1px' }}>
                Preferences and real-time phone alerts
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Test Alert Banner Button */}
      <div
        style={{
          background: 'linear-gradient(135deg, #1D61E7 0%, #1551CA 100%)',
          borderRadius: '18px',
          padding: '16px 18px',
          color: '#FFFFFF',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          boxShadow: '0 8px 20px rgba(29,97,231,0.22)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              backgroundColor: 'rgba(255,255,255,0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <Smartphone size={22} color="#FFFFFF" />
          </div>
          <div style={{ flex: 1 }}>
            <h4 style={{ fontSize: '0.95rem', fontWeight: '800', color: '#FFFFFF' }}>
              Live Phone Push Banners
            </h4>
            <p style={{ fontSize: '0.75rem', color: '#BFDBFE', marginTop: '2px' }}>
              Notifications drop down from the phone's top status bar in real-time.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleTriggerTest}
          style={{
            width: '100%',
            height: '42px',
            backgroundColor: '#FFFFFF',
            color: '#1D61E7',
            border: 'none',
            borderRadius: '12px',
            fontSize: '0.85rem',
            fontWeight: '800',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            fontFamily: 'inherit',
          }}
        >
          <Send size={15} />
          {testSent ? '✓ Banner Sent to Phone Bar!' : 'Test Notification Banner'}
        </button>
      </div>

      {/* Preferences Section */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <h3 style={{ fontSize: '0.9rem', fontWeight: '800', color: '#0F1E36', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Sliders size={16} color="#1D61E7" />
          Notification Preferences
        </h3>

        <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', border: '1px solid #E2E8F0', overflow: 'hidden' }}>
          {[
            {
              key: 'pushBanner',
              title: 'Push Banners on Phone Bar',
              desc: 'Slide-down alert card at top of mobile frame',
            },
            {
              key: 'dueReminders',
              title: 'Equipment Due Reminders',
              desc: 'Alerts 30 mins before 5:00 PM return deadline',
            },
            {
              key: 'approvalAlerts',
              title: 'Borrow Request Status',
              desc: 'Instant alert when equipment is approved or rejected',
            },
            {
              key: 'overdueWarning',
              title: 'Overdue Warnings',
              desc: 'Daily notices for unreturned PE gear',
            },
          ].map((item, idx, arr) => (
            <div
              key={item.key}
              onClick={() => togglePref(item.key)}
              style={{
                padding: '14px 18px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderBottom: idx < arr.length - 1 ? '1px solid #F1F5F9' : 'none',
                cursor: 'pointer',
              }}
            >
              <div style={{ flex: 1, paddingRight: '12px' }}>
                <h4 style={{ fontSize: '0.88rem', fontWeight: '700', color: '#0F1E36' }}>{item.title}</h4>
                <p style={{ fontSize: '0.74rem', color: '#64748B', marginTop: '2px' }}>{item.desc}</p>
              </div>

              {/* iOS style toggle */}
              <div
                style={{
                  width: '44px',
                  height: '24px',
                  borderRadius: '12px',
                  backgroundColor: prefs[item.key] ? '#1D61E7' : '#E2E8F0',
                  position: 'relative',
                  transition: 'background-color 0.2s ease',
                  flexShrink: 0,
                }}
              >
                <div
                  style={{
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    backgroundColor: '#FFFFFF',
                    position: 'absolute',
                    top: '2px',
                    left: prefs[item.key] ? '22px' : '2px',
                    transition: 'left 0.2s ease',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Feed in Settings */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '4px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ fontSize: '0.9rem', fontWeight: '800', color: '#0F1E36', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Bell size={16} color="#1D61E7" />
            Recent Alerts Feed ({notifications.length})
          </h3>
          {onClearUnread && (
            <button
              type="button"
              onClick={onClearUnread}
              style={{
                background: 'none',
                border: 'none',
                color: '#1D61E7',
                fontSize: '0.78rem',
                fontWeight: '700',
                cursor: 'pointer',
              }}
            >
              Mark all read
            </button>
          )}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {notifications.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '24px 0', color: '#94A3B8', fontSize: '0.85rem' }}>
              No notifications yet.
            </div>
          ) : (
            notifications.slice(0, 5).map((n, i) => (
              <div
                key={n.firestoreId || i}
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '14px',
                  padding: '12px 14px',
                  border: '1px solid #E2E8F0',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '12px',
                }}
              >
                <div
                  style={{
                    width: '34px',
                    height: '34px',
                    borderRadius: '10px',
                    backgroundColor: '#EEF4FF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    marginTop: '2px',
                  }}
                >
                  <Bell size={16} color="#1D61E7" />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h5 style={{ fontSize: '0.85rem', fontWeight: '800', color: '#0F1E36' }}>{n.title}</h5>
                    <span style={{ fontSize: '0.7rem', color: '#94A3B8' }}>{n.time || 'Today'}</span>
                  </div>
                  <p style={{ fontSize: '0.76rem', color: '#64748B', marginTop: '3px', lineHeight: '1.35' }}>
                    {n.message}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
