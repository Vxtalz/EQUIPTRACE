import React, { useState } from 'react';
import {
  ArrowLeft,
  User,
  Bell,
  Shield,
  Info,
  LogOut,
  ChevronRight,
  ArrowLeftRight,
  Layers,
  Search,
} from 'lucide-react';
import SecurityScreen from './SecurityScreen';
import SystemArchitectureModal from './SystemArchitectureModal';
import AccountProfileScreen from './AccountProfileScreen';
import NotificationsSettingsScreen from './NotificationsSettingsScreen';
import AboutScreen from './AboutScreen';

export default function AdminMore({
  onLogout,
  onBack,
  onNavigate,
  transactions = [],
  notifications = [],
  onClearUnread,
  onSendTestNotification,
  student,
  user,
}) {
  const [activeSubScreen, setActiveSubScreen] = useState(null);
  const [showArchModal, setShowArchModal] = useState(false);
  const [showTransactionsModal, setShowTransactionsModal] = useState(false);
  const [txSearch, setTxSearch] = useState('');
  const [txFilter, setTxFilter] = useState('All');

  const settingsItems = [
    {
      id: 'account',
      icon: <User size={22} color="#1D61E7" strokeWidth={2} />,
      iconBg: '#EEF4FF',
      title: 'Account & Profile',
      subtitle: 'Manage your personal details, institutional ID, and office.',
      action: () => setActiveSubScreen('account'),
    },
    {
      id: 'transactions',
      icon: <ArrowLeftRight size={22} color="#1D61E7" strokeWidth={2} />,
      iconBg: '#EEF4FF',
      title: 'Transactions',
      subtitle: 'Audit log of all equipment borrows, returns, and approvals.',
      action: () => setShowTransactionsModal(true),
    },
    {
      id: 'architecture',
      icon: <Layers size={22} color="#10B981" strokeWidth={2} />,
      iconBg: '#ECFDF5',
      title: 'System Architecture',
      subtitle: 'Review backend, database, QR scanner, FCM & tech stack.',
      action: () => setShowArchModal(true),
    },
    {
      id: 'security',
      icon: <Shield size={22} color="#1D61E7" strokeWidth={2} />,
      iconBg: '#EEF4FF',
      title: 'Security',
      subtitle: 'Password updates, active sessions, and multi-device access.',
      action: () => setActiveSubScreen('security'),
    },
    {
      id: 'notifications',
      icon: <Bell size={22} color="#1D61E7" strokeWidth={2} />,
      iconBg: '#EEF4FF',
      title: 'Notifications',
      subtitle: 'Push alert settings, phone banner notifications & feed.',
      action: () => setActiveSubScreen('notifications'),
    },
    {
      id: 'about',
      icon: <Info size={22} color="#1D61E7" strokeWidth={2} />,
      iconBg: '#EEF4FF',
      title: 'About EQUIPTRACE',
      subtitle: 'View app version, policies, and get support.',
      action: () => setActiveSubScreen('about'),
    },
  ];

  // ── Sub-screen router ──
  if (activeSubScreen === 'account') {
    return (
      <AccountProfileScreen
        user={user}
        student={student}
        onBack={() => setActiveSubScreen(null)}
      />
    );
  }

  if (activeSubScreen === 'notifications') {
    return (
      <NotificationsSettingsScreen
        notifications={notifications}
        onClearUnread={onClearUnread}
        onSendTestNotification={onSendTestNotification}
        onBack={() => setActiveSubScreen(null)}
      />
    );
  }

  if (activeSubScreen === 'security') {
    return <SecurityScreen onBack={() => setActiveSubScreen(null)} />;
  }

  if (activeSubScreen === 'about') {
    return <AboutScreen onBack={() => setActiveSubScreen(null)} />;
  }

  // Filtered transactions for the modal
  const filteredTx = transactions.filter((t) => {
    const matchesSearch =
      (t.studentName || '').toLowerCase().includes(txSearch.toLowerCase()) ||
      (t.equipment || '').toLowerCase().includes(txSearch.toLowerCase()) ||
      (t.id || '').toLowerCase().includes(txSearch.toLowerCase());
    const matchesFilter = txFilter === 'All' || t.status === txFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div
      className="admin-more animate-fade-in"
      style={{
        display: 'flex',
        flexDirection: 'column',
        padding: '16px 20px 32px 20px',
        backgroundColor: '#F2F5FA',
        minHeight: '100%',
        gap: '20px',
      }}
    >
      {/* Header */}
      <div style={{ paddingTop: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '4px' }}>
          <button
            type="button"
            onClick={onBack || (() => onNavigate?.('home'))}
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '50%',
              backgroundColor: '#1D61E7',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 10px rgba(29,97,231,0.25)',
              cursor: 'pointer',
              flexShrink: 0,
              transition: 'transform 0.15s ease',
            }}
            aria-label="Back to Overview"
          >
            <ArrowLeft size={18} color="#FFFFFF" strokeWidth={2.5} />
          </button>
          <div>
            <h2
              style={{
                fontSize: '1.3rem',
                fontWeight: '800',
                color: '#0F1E36',
                letterSpacing: '-0.3px',
              }}
            >
              Settings
            </h2>
            <p style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: '500', marginTop: '1px' }}>
              Manage your account and app preferences
            </p>
          </div>
        </div>
      </div>

      {/* Settings Items */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {settingsItems.map((item) => (
          <div
            key={item.id}
            onClick={item.action}
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '18px',
              padding: '16px 18px',
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              boxShadow: '0 2px 8px rgba(13,26,48,0.05)',
              cursor: 'pointer',
              transition: 'transform 0.15s ease, box-shadow 0.15s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-1px)';
              e.currentTarget.style.boxShadow = '0 4px 16px rgba(29,97,231,0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'none';
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(13,26,48,0.05)';
            }}
          >
            {/* Icon Box */}
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '14px',
                backgroundColor: item.iconBg,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              {item.icon}
            </div>

            {/* Text */}
            <div style={{ flex: 1 }}>
              <h4
                style={{
                  fontSize: '0.95rem',
                  fontWeight: '700',
                  color: '#0F1E36',
                  letterSpacing: '-0.1px',
                }}
              >
                {item.title}
              </h4>
              <p
                style={{
                  fontSize: '0.78rem',
                  color: '#64748B',
                  marginTop: '3px',
                  fontWeight: '400',
                  lineHeight: '1.35',
                }}
              >
                {item.subtitle}
              </p>
            </div>

            <ChevronRight size={18} color="#94A3B8" strokeWidth={2.2} />
          </div>
        ))}
      </div>

      {/* Log Out Button */}
      <div style={{ marginTop: 'auto' }}>
        <button
          type="button"
          onClick={onLogout}
          style={{
            width: '100%',
            height: '52px',
            backgroundColor: '#FEE2E2',
            color: '#EF4444',
            border: 'none',
            borderRadius: '16px',
            fontSize: '0.95rem',
            fontWeight: '700',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            fontFamily: 'inherit',
            transition: 'background-color 0.2s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#FECACA';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#FEE2E2';
          }}
        >
          <LogOut size={18} strokeWidth={2.2} />
          Log out
        </button>
      </div>

      {/* Clearance spacer for floating bottom navigation bar */}
      <div style={{ height: '96px', flexShrink: 0, minHeight: '96px' }} />

      {/* ── System Architecture Modal ── */}
      {showArchModal && (
        <SystemArchitectureModal onClose={() => setShowArchModal(false)} />
      )}

      {/* ── Transactions Modal ── */}
      {showTransactionsModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 100,
            backgroundColor: 'rgba(15,30,54,0.6)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'center',
            animation: 'fadeIn 0.2s ease',
          }}
        >
          <div
            style={{
              backgroundColor: '#FFFFFF',
              width: '100%',
              maxWidth: '430px',
              borderTopLeftRadius: '24px',
              borderTopRightRadius: '24px',
              padding: '24px 20px 32px 20px',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
              maxHeight: '85vh',
              overflowY: 'auto',
              boxShadow: '0 -10px 30px rgba(0,0,0,0.2)',
            }}
          >
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: '#0F1E36' }}>
                  Transactions Log
                </h3>
                <p style={{ fontSize: '0.8rem', color: '#64748B', marginTop: '2px' }}>
                  Complete audit trail of all borrowing events
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowTransactionsModal(false)}
                style={{
                  background: '#F1F5F9',
                  border: 'none',
                  borderRadius: '50%',
                  width: '34px',
                  height: '34px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  fontWeight: '700',
                  color: '#64748B',
                }}
              >
                ✕
              </button>
            </div>

            {/* Search Input */}
            <div style={{ position: 'relative' }}>
              <Search
                size={16}
                color="#94A3B8"
                style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }}
              />
              <input
                type="text"
                value={txSearch}
                onChange={(e) => setTxSearch(e.target.value)}
                placeholder="Search student, equipment, or ID..."
                style={{
                  width: '100%',
                  height: '42px',
                  borderRadius: '12px',
                  border: '1px solid #E2E8F0',
                  paddingLeft: '38px',
                  paddingRight: '12px',
                  fontSize: '0.85rem',
                  outline: 'none',
                  backgroundColor: '#F8FAFC',
                  fontFamily: 'inherit',
                }}
              />
            </div>

            {/* Status Filter Pills */}
            <div
              className="hover-scroll-container"
              onWheel={(e) => {
                if (e.deltaY !== 0) {
                  e.currentTarget.scrollLeft += e.deltaY * 0.7;
                }
              }}
            >
              {['All', 'Borrowed', 'Returned', 'Approved', 'Rejected', 'Overdue'].map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setTxFilter(cat)}
                  style={{
                    padding: '6px 14px',
                    borderRadius: '20px',
                    border: 'none',
                    fontSize: '0.78rem',
                    fontWeight: '700',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    backgroundColor: txFilter === cat ? '#1D61E7' : '#F1F5F9',
                    color: txFilter === cat ? '#FFFFFF' : '#64748B',
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {filteredTx.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '30px 0', color: '#94A3B8', fontSize: '0.85rem' }}>
                  No transactions match your search.
                </div>
              ) : (
                filteredTx.map((tx, idx) => (
                  <div
                    key={tx.id || idx}
                    style={{
                      backgroundColor: '#F8FAFC',
                      borderRadius: '14px',
                      padding: '14px 16px',
                      border: '1px solid #E2E8F0',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '8px',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div
                          style={{
                            width: '34px',
                            height: '34px',
                            borderRadius: '50%',
                            backgroundColor: '#1D61E7',
                            color: '#FFFFFF',
                            fontWeight: '800',
                            fontSize: '0.78rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          {tx.studentInitials || 'ST'}
                        </div>
                        <div>
                          <h4 style={{ fontSize: '0.9rem', fontWeight: '800', color: '#0F1E36' }}>
                            {tx.studentName}
                          </h4>
                          <span style={{ fontSize: '0.72rem', color: '#94A3B8' }}>{tx.date}</span>
                        </div>
                      </div>

                      {/* Status Badge */}
                      <span
                        style={{
                          fontSize: '0.72rem',
                          fontWeight: '700',
                          padding: '3px 10px',
                          borderRadius: '9999px',
                          backgroundColor:
                            tx.status === 'Returned' || tx.status === 'Approved'
                              ? '#DCFCE7'
                              : tx.status === 'Overdue' || tx.status === 'Rejected'
                              ? '#FEE2E2'
                              : '#EEF4FF',
                          color:
                            tx.status === 'Returned' || tx.status === 'Approved'
                              ? '#15803D'
                              : tx.status === 'Overdue' || tx.status === 'Rejected'
                              ? '#DC2626'
                              : '#1D61E7',
                        }}
                      >
                        {tx.status}
                      </span>
                    </div>

                    <div style={{ fontSize: '0.8rem', color: '#475569', display: 'flex', justifyContent: 'space-between' }}>
                      <span>Equipment: <strong style={{ color: '#0F1E36' }}>{tx.equipment}</strong></span>
                      {tx.id && <span style={{ color: '#94A3B8', fontSize: '0.72rem' }}>{tx.id}</span>}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
