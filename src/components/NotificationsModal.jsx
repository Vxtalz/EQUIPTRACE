import React from 'react';
import { X, Bell, Check, Clock, AlertTriangle, CheckCheck } from 'lucide-react';

export default function NotificationsModal({
  notifications = [],
  onClose,
  onClearUnread,
  onMarkSingleRead,
}) {
  const hasUnread = notifications.some((n) => n.unread);
  const unreadCount = notifications.filter((n) => n.unread).length;

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget && onClose) onClose();
      }}
      style={{
        position: 'absolute',
        inset: 0,
        backgroundColor: 'rgba(15, 30, 54, 0.65)',
        zIndex: 100,
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
        backdropFilter: 'blur(4px)',
        animation: 'fadeIn 0.2s ease',
        overscrollBehavior: 'contain',
        touchAction: 'none',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: '#FFFFFF',
          width: '100%',
          maxHeight: '85%',
          borderTopLeftRadius: '24px',
          borderTopRightRadius: '24px',
          padding: '24px 20px 24px 20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          boxShadow: '0 -10px 30px rgba(0,0,0,0.2)',
          overscrollBehavior: 'contain',
          touchAction: 'auto',
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Bell size={20} color="#1D61E7" />
            <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#0F1E36' }}>
              Notifications
            </h3>
            {unreadCount > 0 && (
              <span
                style={{
                  backgroundColor: '#1D61E7',
                  color: '#FFFFFF',
                  fontSize: '0.72rem',
                  fontWeight: '800',
                  padding: '2px 8px',
                  borderRadius: '9999px',
                }}
              >
                {unreadCount}
              </span>
            )}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {hasUnread ? (
              <button
                type="button"
                onClick={onClearUnread}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#1D61E7',
                  fontSize: '0.82rem',
                  fontWeight: '700',
                  cursor: 'pointer',
                  padding: '4px 6px',
                  borderRadius: '6px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  transition: 'opacity 0.15s ease',
                  fontFamily: 'inherit'
                }}
              >
                <CheckCheck size={15} />
                Mark all read
              </button>
            ) : (
              <span
                style={{
                  color: '#94A3B8',
                  fontSize: '0.78rem',
                  fontWeight: '600',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                <Check size={14} color="#10B981" />
                All read
              </span>
            )}

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
              aria-label="Close"
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
          gap: '12px',
          maxHeight: '460px',
          overscrollBehavior: 'contain',
          WebkitOverflowScrolling: 'touch',
        }}>
          {notifications.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '36px 16px', color: '#64748B' }}>
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  backgroundColor: '#F1F5F9',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 12px auto',
                }}
              >
                <Bell size={22} color="#94A3B8" />
              </div>
              <h4 style={{ fontSize: '0.95rem', fontWeight: '700', color: '#0F1E36', marginBottom: '4px' }}>
                All caught up!
              </h4>
              <p style={{ fontSize: '0.8rem', color: '#94A3B8' }}>
                No notifications right now.
              </p>
            </div>
          ) : (
            notifications.map((notif, idx) => {
              const isUnread = !!notif.unread;
              return (
                <div
                  key={notif.firestoreId || notif.id || idx}
                  onClick={() => {
                    if (isUnread && onMarkSingleRead) {
                      onMarkSingleRead(notif.firestoreId || notif.id);
                    }
                  }}
                  style={{
                    backgroundColor: isUnread ? '#EEF4FF' : '#F8FAFC',
                    borderRadius: '14px',
                    padding: '14px 16px',
                    border: isUnread ? '1px solid #BFDBFE' : '1px solid #E2E8F0',
                    display: 'flex',
                    gap: '12px',
                    alignItems: 'flex-start',
                    cursor: isUnread ? 'pointer' : 'default',
                    transition: 'all 0.18s ease',
                    position: 'relative',
                  }}
                >
                  <div style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '10px',
                    backgroundColor: isUnread ? '#1D61E7' : '#E2E8F0',
                    color: isUnread ? '#FFFFFF' : '#64748B',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <Bell size={18} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <h4 style={{ fontSize: '0.925rem', fontWeight: '700', color: '#0F1E36' }}>
                        {notif.title}
                      </h4>
                      <span style={{ fontSize: '0.725rem', color: '#94A3B8' }}>{notif.time || 'Today'}</span>
                    </div>
                    <p style={{ fontSize: '0.8rem', color: '#475569', marginTop: '4px', lineHeight: '1.35' }}>
                      {notif.message}
                    </p>
                  </div>
                  {isUnread && (
                    <span
                      style={{
                        position: 'absolute',
                        top: '12px',
                        right: '12px',
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        backgroundColor: '#1D61E7',
                      }}
                    />
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

