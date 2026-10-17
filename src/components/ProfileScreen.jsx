import React from 'react';
import { ArrowLeft, User, Shield, HelpCircle, LogOut, CheckCircle, Clock } from 'lucide-react';

export default function ProfileScreen({
  student,
  activeCount,
  historyCount,
  onBack,
  onLogout
}) {
  return (
    <div className="profile-screen animate-fade-in" style={{
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100%',
      backgroundColor: '#FFFFFF',
      padding: '16px 20px 24px 20px',
      gap: '20px'
    }}>
      {/* Header Bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        paddingTop: '4px'
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
          letterSpacing: '-0.3px'
        }}>
          Student Profile
        </h2>
      </div>

      {/* Student ID Card Header */}
      <div style={{
        background: 'linear-gradient(135deg, #1D61E7 0%, #1551CA 100%)',
        borderRadius: '20px',
        padding: '20px',
        color: '#FFFFFF',
        boxShadow: '0 8px 20px rgba(29, 97, 231, 0.25)',
        position: 'relative',
        overflow: 'hidden'
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

        <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
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
            fontSize: '1.4rem',
            boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
          }}>
            {student?.name?.charAt(0) || 'J'}
          </div>
          <div>
            <span style={{
              fontSize: '0.75rem',
              fontWeight: '700',
              backgroundColor: 'rgba(255,255,255,0.2)',
              padding: '2px 8px',
              borderRadius: '9999px',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              Verified Student
            </span>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '800', marginTop: '4px' }}>
              {student?.name || 'Juan Dela Cruz'}
            </h3>
            <p style={{ fontSize: '0.825rem', color: '#D8E5FF', marginTop: '2px' }}>
              ID: {student?.id || '2025-001'} • {student?.course || 'BS Physical Education'}
            </p>
          </div>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
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
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <h4 style={{ fontSize: '0.85rem', fontWeight: '700', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          Account Details
        </h4>

        <div style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '14px',
          border: '1px solid #E2E8F0',
          padding: '14px 16px',
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: '0.875rem'
        }}>
          <span style={{ color: '#64748B' }}>Email Address</span>
          <span style={{ color: '#0F1E36', fontWeight: '600' }}>{student?.email}</span>
        </div>

        <div style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '14px',
          border: '1px solid #E2E8F0',
          padding: '14px 16px',
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: '0.875rem'
        }}>
          <span style={{ color: '#64748B' }}>Year Level</span>
          <span style={{ color: '#0F1E36', fontWeight: '600' }}>{student?.yearLevel}</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <button
          type="button"
          onClick={onLogout}
          style={{
            width: '100%',
            height: '50px',
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

      {/* Clearance spacer for floating bottom navigation bar */}
      <div style={{ height: '96px', flexShrink: 0, minHeight: '96px' }} />
    </div>
  );
}
