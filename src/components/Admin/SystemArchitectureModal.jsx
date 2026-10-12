import React from 'react';
import { X, Server, Database, KeyRound, QrCode, BellRing, BarChart3, CheckCircle2 } from 'lucide-react';

export default function SystemArchitectureModal({ onClose }) {
  const stackItems = [
    {
      title: 'Backend',
      tech: 'Node.js + Express.js',
      description: 'Handles requests, borrowing transactions, authentication verification, and core system logic.',
      icon: Server,
      color: '#10B981',
      badge: 'Active Express Server'
    },
    {
      title: 'Database',
      tech: 'Firebase Firestore',
      description: 'Stores equipment records, registered users, real-time borrowing logs, and chronological history.',
      icon: Database,
      color: '#F59E0B',
      badge: 'Firestore SDK Ready'
    },
    {
      title: 'Authentication',
      tech: 'Firebase Authentication',
      description: 'Manages student and PE staff login, role claims, token validation, and account credentials.',
      icon: KeyRound,
      color: '#3B82F6',
      badge: 'Auth Integrated'
    },
    {
      title: 'QR Code',
      tech: 'QR Code library / API',
      description: 'Identifies equipment instantly through scanner camera and server-side QR generation.',
      icon: QrCode,
      color: '#8B5CF6',
      badge: 'Scanner & Generator'
    },
    {
      title: 'Notifications',
      tech: 'Firebase Cloud Messaging (FCM)',
      description: 'Dispatches real-time borrowing confirmations, return reminders, and overdue alerts.',
      icon: BellRing,
      color: '#EC4899',
      badge: 'FCM Ready'
    },
    {
      title: 'Analytics',
      tech: 'Firebase / Custom Dashboard',
      description: 'Displays borrowing velocity trends, overdue return patterns, and equipment utilization metrics.',
      icon: BarChart3,
      color: '#1D61E7',
      badge: 'Live Metrics'
    }
  ];

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(15, 23, 42, 0.65)',
      backdropFilter: 'blur(5px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      padding: '16px'
    }}>
      <div style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '24px',
        width: '100%',
        maxWidth: '480px',
        maxHeight: '90vh',
        overflowY: 'auto',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.25)',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Header */}
        <div style={{
          padding: '20px 24px',
          borderBottom: '1px solid #E2E8F0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'sticky',
          top: 0,
          backgroundColor: '#FFFFFF',
          zIndex: 10,
          borderTopLeftRadius: '24px',
          borderTopRightRadius: '24px'
        }}>
          <div>
            <span style={{
              fontSize: '0.75rem',
              fontWeight: '700',
              color: '#1D61E7',
              textTransform: 'uppercase',
              letterSpacing: '0.8px'
            }}>
              System Specifications
            </span>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#0F1E36', marginTop: '2px' }}>
              Architecture & Stack
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{
              background: '#F1F5F9',
              border: 'none',
              borderRadius: '50%',
              width: '36px',
              height: '36px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
          >
            <X size={18} color="#475569" />
          </button>
        </div>

        {/* Content Body */}
        <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {stackItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                style={{
                  padding: '14px 16px',
                  borderRadius: '16px',
                  backgroundColor: '#F8FAFC',
                  border: '1px solid #E2E8F0',
                  display: 'flex',
                  gap: '14px',
                  alignItems: 'flex-start'
                }}
              >
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '12px',
                  backgroundColor: `${item.color}15`,
                  color: item.color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  marginTop: '2px'
                }}>
                  <Icon size={22} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2px' }}>
                    <h3 style={{ fontSize: '0.95rem', fontWeight: '800', color: '#0F1E36' }}>
                      {item.title}
                    </h3>
                    <span style={{
                      fontSize: '0.7rem',
                      fontWeight: '700',
                      backgroundColor: '#EEF2FF',
                      color: '#4F46E5',
                      padding: '2px 8px',
                      borderRadius: '8px'
                    }}>
                      {item.badge}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.85rem', fontWeight: '700', color: '#1D61E7', marginBottom: '4px' }}>
                    {item.tech}
                  </div>
                  <p style={{ fontSize: '0.8rem', color: '#64748B', lineHeight: '1.45', margin: 0 }}>
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div style={{
          padding: '16px 24px',
          borderTop: '1px solid #E2E8F0',
          backgroundColor: '#FFFFFF',
          display: 'flex',
          justifyContent: 'flex-end',
          borderBottomLeftRadius: '24px',
          borderBottomRightRadius: '24px'
        }}>
          <button
            type="button"
            onClick={onClose}
            style={{
              backgroundColor: '#1D61E7',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '12px',
              padding: '10px 22px',
              fontWeight: '700',
              fontSize: '0.9rem',
              cursor: 'pointer'
            }}
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
