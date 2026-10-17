import React from 'react';
import { Bell, QrCode, Search, FileText } from 'lucide-react';
import equiptraceLogo from '../assets/equiptrace-logo.png';

export default function HomeScreen({
  student,
  unreadCount,
  onNavigate,
  onOpenNotifications,
  onOpenBrowse
}) {
  return (
    <div className="home-screen animate-fade-in" style={{
      display: 'flex',
      flexDirection: 'column',
      padding: '16px 20px 24px 20px',
      backgroundColor: '#FFFFFF',
      minHeight: '100%',
      gap: '20px'
    }}>
      {/* Top Header Bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: '4px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <img
            src={equiptraceLogo}
            alt="EquipTrace"
            style={{
              height: '40px',
              objectFit: 'contain',
              display: 'block'
            }}
          />
        </div>

        {/* Notifications Icon Button */}
        <button
          type="button"
          onClick={onOpenNotifications}
          style={{
            position: 'relative',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '6px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          aria-label="Notifications"
        >
          <Bell size={24} color="#1D61E7" strokeWidth={2.2} />
          {unreadCount > 0 && (
            <span style={{
              position: 'absolute',
              top: '5px',
              right: '5px',
              width: '10px',
              height: '10px',
              borderRadius: '50%',
              backgroundColor: '#EF4444',
              border: '2px solid #FFFFFF'
            }} />
          )}
        </button>
      </div>

      {/* Welcome Greeting */}
      <div style={{ marginTop: '4px' }}>
        <h2 style={{
          fontSize: '1.75rem',
          fontWeight: '800',
          color: '#0F1E36',
          letterSpacing: '-0.5px',
          lineHeight: '1.2'
        }}>
          Hello, {student?.name?.split(' ')[0] || 'Juan'}!
        </h2>
        <p style={{
          fontSize: '0.9rem',
          color: '#64748B',
          marginTop: '6px',
          fontWeight: '500'
        }}>
          Ready to borrow some equipment?
        </p>
      </div>

      {/* Main Feature Action Banner (Scan QR Code) */}
      <div
        onClick={() => onNavigate('scan')}
        style={{
          backgroundColor: '#1D61E7',
          borderRadius: '20px',
          padding: '20px 22px',
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          cursor: 'pointer',
          boxShadow: '0 8px 24px rgba(29, 97, 231, 0.25)',
          transition: 'transform 0.15s ease, box-shadow 0.15s ease'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-2px)';
          e.currentTarget.style.boxShadow = '0 12px 28px rgba(29, 97, 231, 0.35)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'none';
          e.currentTarget.style.boxShadow = '0 8px 24px rgba(29, 97, 231, 0.25)';
        }}
      >
        <div style={{
          width: '56px',
          height: '56px',
          borderRadius: '14px',
          backgroundColor: '#3B82F6',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0
        }}>
          <QrCode size={30} color="#FFFFFF" strokeWidth={2.2} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{
            color: '#FFFFFF',
            fontSize: '1.15rem',
            fontWeight: '700',
            letterSpacing: '-0.2px'
          }}>
            Scan QR Code
          </span>
          <span style={{
            color: '#D8E5FF',
            fontSize: '0.825rem',
            marginTop: '3px',
            fontWeight: '400',
            lineHeight: '1.3'
          }}>
            Scan the equipment's QR code to borrow.
          </span>
        </div>
      </div>

      {/* Secondary Cards List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {/* Browse Equipment Card */}
        <div
          onClick={onOpenBrowse}
          style={{
            backgroundColor: '#F2F6FD',
            borderRadius: '18px',
            padding: '18px 20px',
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            cursor: 'pointer',
            transition: 'background-color 0.2s ease, transform 0.15s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#E9F1FE';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#F2F6FD';
          }}
        >
          <div style={{
            width: '52px',
            height: '52px',
            borderRadius: '14px',
            backgroundColor: '#EEF4FF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            <Search size={24} color="#1D61E7" strokeWidth={2.2} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{
              color: '#0F1E36',
              fontSize: '1.05rem',
              fontWeight: '700',
              letterSpacing: '-0.2px'
            }}>
              Browse Equipment
            </span>
            <span style={{
              color: '#64748B',
              fontSize: '0.825rem',
              marginTop: '3px',
              fontWeight: '400'
            }}>
              View available equipment.
            </span>
          </div>
        </div>

        {/* My Borrowings Card */}
        <div
          onClick={() => onNavigate('borrowings')}
          style={{
            backgroundColor: '#F2F6FD',
            borderRadius: '18px',
            padding: '18px 20px',
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            cursor: 'pointer',
            transition: 'background-color 0.2s ease, transform 0.15s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#E9F1FE';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#F2F6FD';
          }}
        >
          <div style={{
            width: '52px',
            height: '52px',
            borderRadius: '14px',
            backgroundColor: '#EEF4FF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            <FileText size={24} color="#1D61E7" strokeWidth={2.2} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{
              color: '#0F1E36',
              fontSize: '1.05rem',
              fontWeight: '700',
              letterSpacing: '-0.2px'
            }}>
              My Borrowings
            </span>
            <span style={{
              color: '#64748B',
              fontSize: '0.825rem',
              marginTop: '3px',
              fontWeight: '400'
            }}>
              View your current and past borrowings.
            </span>
          </div>
        </div>

        {/* Notifications Card */}
        <div
          onClick={onOpenNotifications}
          style={{
            backgroundColor: '#F2F6FD',
            borderRadius: '18px',
            padding: '18px 20px',
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            cursor: 'pointer',
            transition: 'background-color 0.2s ease, transform 0.15s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#E9F1FE';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#F2F6FD';
          }}
        >
          <div style={{
            width: '52px',
            height: '52px',
            borderRadius: '14px',
            backgroundColor: '#EEF4FF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            <Bell size={24} color="#1D61E7" strokeWidth={2.2} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{
              color: '#0F1E36',
              fontSize: '1.05rem',
              fontWeight: '700',
              letterSpacing: '-0.2px'
            }}>
              Notifications
            </span>
            <span style={{
              color: '#64748B',
              fontSize: '0.825rem',
              marginTop: '3px',
              fontWeight: '400'
            }}>
              Check your latest updates.
            </span>
          </div>
        </div>
      </div>

      {/* Clearance spacer for floating bottom navigation bar */}
      <div style={{ height: '96px', flexShrink: 0, minHeight: '96px' }} />
    </div>
  );
}
