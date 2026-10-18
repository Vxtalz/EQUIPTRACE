import React from 'react';
import { ArrowLeft, User, Shield, HelpCircle, LogOut, CheckCircle, Clock } from 'lucide-react';

export default function ProfileScreen({
  student,
  activeCount,
  historyCount,
  onBack,
  onLogout
}) {
  const initial = (student?.name || student?.id || 'S').trim().charAt(0).toUpperCase();

  return (
    <div className="profile-screen animate-fade-in" style={{
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100%',
      backgroundColor: '#FFFFFF',
      padding: '16px 20px 24px 20px',
      gap: '18px'
    }}>
      {/* Header Bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        paddingTop: '4px',
        flexShrink: 0
      }}>
        <button
          type="button"
          onClick={onBack}
          style={{
            background: 'none',
            border: 'none',
            color: '#0F1E36',
            cursor: 'pointer',
            padding: '4px',
            display: 'flex',
            alignItems: 'center'
          }}
          aria-label="Back"
        >
          <ArrowLeft size={22} color="#0F1E36" strokeWidth={2.5} />
        </button>
        <h2 style={{
          fontSize: '1.4rem',
          fontWeight: '800',
          color: '#0F1E36',
          letterSpacing: '-0.3px',
          margin: 0
        }}>
          Student Profile
        </h2>
      </div>

      {/* Student ID Card Header */}
      <div style={{
        background: 'linear-gradient(135deg, #1D61E7 0%, #1551CA 100%)',
        borderRadius: '20px',
        padding: '18px 20px',
        color: '#FFFFFF',
        boxShadow: '0 8px 20px rgba(29, 97, 231, 0.25)',
        position: 'relative',
        overflow: 'hidden',
        flexShrink: 0,
        boxSizing: 'border-box'
      }}>
        {/* Background Overlay Circles */}
        <div style={{
          position: 'absolute',
          top: '-20px',
          right: '-20px',
          width: '100px',
          height: '100px',
          borderRadius: '50%',
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          pointerEvents: 'none'
        }} />

        <div style={{ display: 'flex', gap: '14px', alignItems: 'center', position: 'relative', zIndex: 1 }}>
          <div style={{
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            backgroundColor: '#FFFFFF',
            color: '#1D61E7',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: '800',
            fontSize: '1.5rem',
            boxShadow: '0 4px 10px rgba(0,0,0,0.12)',
            flexShrink: 0
          }}>
            {initial}
          </div>
          <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <div>
              <span style={{
                display: 'inline-block',
                fontSize: '0.72rem',
                fontWeight: '700',
                backgroundColor: 'rgba(255,255,255,0.22)',
                padding: '2px 8px',
                borderRadius: '9999px',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                Verified Student
              </span>
            </div>
            <h3 style={{
              fontSize: '1.25rem',
              fontWeight: '800',
              margin: 0,
              lineHeight: 1.25,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}>
              {student?.name || student?.id || 'Juan Dela Cruz'}
            </h3>
            <p style={{
              fontSize: '0.825rem',
              color: '#D8E5FF',
              margin: 0,
              fontWeight: '500',
              lineHeight: 1.3
            }}>
              ID: {student?.id || '2025-001'} • {student?.course || 'BS Physical Education'}
            </p>
          </div>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', flexShrink: 0 }}>
        <div style={{
          backgroundColor: '#F8FAFC',
          borderRadius: '16px',
          padding: '16px',
          border: '1px solid #E2E8F0',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center'
        }}>
          <Clock size={22} color="#1D61E7" style={{ marginBottom: '6px' }} />
          <span style={{ fontSize: '1.5rem', fontWeight: '800', color: '#0F1E36' }}>{activeCount}</span>
          <span style={{ fontSize: '0.775rem', color: '#64748B', fontWeight: '600', marginTop: '2px' }}>Active Borrowed</span>
        </div>

        <div style={{
          backgroundColor: '#F8FAFC',
          borderRadius: '16px',
          padding: '16px',
          border: '1px solid #E2E8F0',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center'
        }}>
          <CheckCircle size={22} color="#15803D" style={{ marginBottom: '6px' }} />
          <span style={{ fontSize: '1.5rem', fontWeight: '800', color: '#0F1E36' }}>{historyCount}</span>
          <span style={{ fontSize: '0.775rem', color: '#64748B', fontWeight: '600', marginTop: '2px' }}>Returned History</span>
        </div>
      </div>

      {/* Account Info & Options List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flexShrink: 0 }}>
        <h4 style={{ fontSize: '0.85rem', fontWeight: '700', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          Account Details
        </h4>

        <div style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '14px',
          border: '1px solid #E2E8F0',
          padding: '12px 16px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: '0.875rem'
        }}>
          <span style={{ color: '#64748B' }}>Student ID</span>
          <span style={{ color: '#0F1E36', fontWeight: '600' }}>{student?.id || '2025-001'}</span>
        </div>

        <div style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '14px',
          border: '1px solid #E2E8F0',
          padding: '12px 16px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: '0.875rem'
        }}>
          <span style={{ color: '#64748B' }}>Email Address</span>
          <span style={{ color: '#0F1E36', fontWeight: '600' }}>{student?.email || 'student@equiptrace.edu'}</span>
        </div>

        <div style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '14px',
          border: '1px solid #E2E8F0',
          padding: '12px 16px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: '0.875rem'
        }}>
          <span style={{ color: '#64748B' }}>Program / Course</span>
          <span style={{ color: '#0F1E36', fontWeight: '600' }}>{student?.course || 'BS Physical Education'}</span>
        </div>

        <div style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '14px',
          border: '1px solid #E2E8F0',
          padding: '12px 16px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: '0.875rem'
        }}>
          <span style={{ color: '#64748B' }}>Year Level</span>
          <span style={{ color: '#0F1E36', fontWeight: '600' }}>{student?.yearLevel || '3rd Year'}</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '10px', flexShrink: 0 }}>
        <button
          type="button"
          onClick={onLogout}
          style={{
            width: '100%',
            height: '48px',
            backgroundColor: '#FEF2F2',
            color: '#DC2626',
            border: '1px solid #FCA5A5',
            borderRadius: '14px',
            fontSize: '0.925rem',
            fontWeight: '700',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            transition: 'all 0.2s ease',
            fontFamily: 'inherit'
          }}
        >
          <LogOut size={18} />
          Logout Account
        </button>
      </div>
    </div>
  );
}
