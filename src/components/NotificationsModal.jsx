import React from 'react';
import { X, Bell, Check, Clock, AlertTriangle } from 'lucide-react';

export default function NotificationsModal({ notifications = [], onClose, onClearUnread }) {
  return (
    <div style={{
      position: 'absolute',
      inset: 0,
      backgroundColor: 'rgba(15, 30, 54, 0.65)',
      zIndex: 90,
      display: 'flex',
      alignItems: 'flex-end',
      justifyContent: 'center',
      backdropFilter: 'blur(4px)',
      animation: 'fadeIn 0.2s ease'
    }}>
      <div style={{
        backgroundColor: '#FFFFFF',
        width: '100%',
        maxHeight: '80%',
        borderTopLeftRadius: '24px',
        borderTopRightRadius: '24px',
        padding: '24px 20px 24px 20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        boxShadow: '0 -10px 30px rgba(0,0,0,0.2)'
      }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Bell size={20} color="#1D61E7" />
            <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#0F1E36' }}>
              Notifications
            </h3>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              type="button"
              onClick={onClearUnread}
              style={{
                background: 'none',
                border: 'none',
                color: '#1D61E7',
                fontSize: '0.8rem',
                fontWeight: '700',
                cursor: 'pointer'
              }}
            >
              Mark all read
            </button>
            <button
              type="button"
              onClick={onClose}
              style={{
                background: '#F1F5F9',
                border: 'none',
                borderRadius: '50%',
                width: '32px',
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
            >
              <X size={18} color="#64748B" />
            </button>
          </div>
        </div>

        {/* Notifications List */}
        <div style={{
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px'
        }}>
          {notifications.map((notif) => (
            <div
              key={notif.id}
              style={{
                backgroundColor: notif.unread ? '#EEF4FF' : '#F8FAFC',
                borderRadius: '14px',
                padding: '14px 16px',
                border: notif.unread ? '1px solid #BFDBFE' : '1px solid #E2E8F0',
                display: 'flex',
                gap: '12px',
                alignItems: 'flex-start'
              }}
            >
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                backgroundColor: notif.unread ? '#1D61E7' : '#E2E8F0',
                color: notif.unread ? '#FFFFFF' : '#64748B',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <Bell size={18} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h4 style={{ fontSize: '0.925rem', fontWeight: '700', color: '#0F1E36' }}>
                    {notif.title}
                  </h4>
                  <span style={{ fontSize: '0.725rem', color: '#94A3B8' }}>{notif.time}</span>
                </div>
                <p style={{ fontSize: '0.8rem', color: '#475569', marginTop: '4px', lineHeight: '1.35' }}>
                  {notif.message}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
