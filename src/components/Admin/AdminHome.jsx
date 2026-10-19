import React, { useMemo } from 'react';
import {
  Bell,
  Package,
  Check,
  User,
  AlertCircle,
  Settings,
  Clock,
  ArrowRight
} from 'lucide-react';
import BorrowingTrendChart from './BorrowingTrendChart';
import equiptraceLogo from '../../assets/equiptrace-logo.png';

export default function AdminHome({
  kpis,
  pendingRequests = [],
  recentTransactions = [],
  onApproveRequest,
  onRejectRequest,
  onNavigateTab,
  onOpenNotifications,
  onOpenSettings,
  unreadCount = 0,
}) {
  const pendingItems = pendingRequests.filter(r => r.status === 'Pending');
  const pendingCount = pendingItems.length;

  // Parse transaction date for sorting
  const parseTxDate = (tx) => {
    if (!tx) return new Date(0);
    if (tx.createdAt) {
      if (typeof tx.createdAt.toDate === 'function') return tx.createdAt.toDate();
      if (tx.createdAt.seconds) return new Date(tx.createdAt.seconds * 1000);
      const d = new Date(tx.createdAt);
      if (!isNaN(d.getTime())) return d;
    }
    if (tx.timestamp) {
      const d = new Date(tx.timestamp);
      if (!isNaN(d.getTime())) return d;
    }
    if (tx.date) {
      const sanitized = String(tx.date).replace(/·/g, ' ').replace(/\s+/g, ' ').trim();
      const d = new Date(sanitized);
      if (!isNaN(d.getTime())) return d;
    }
    if (typeof tx.id === 'string' && tx.id.startsWith('TX-')) {
      const num = parseInt(tx.id.replace('TX-', ''), 10);
      if (!isNaN(num) && num > 1000000000) return new Date(num);
    }
    return new Date(0);
  };

  // 1. Sort the entire dataset by latest transaction date and time first
  const sortedTransactions = useMemo(() => {
    return [...recentTransactions].sort((a, b) => {
      const dateA = parseTxDate(a).getTime();
      const dateB = parseTxDate(b).getTime();
      if (dateB !== dateA) return dateB - dateA;
      return String(b.id || '').localeCompare(String(a.id || ''));
    });
  }, [recentTransactions]);

  // 2. Take a maximum of 5 recent transactions only for the Home dashboard
  const displayedTransactions = useMemo(() => {
    return sortedTransactions.slice(0, 5);
  }, [sortedTransactions]);

  // Status badge styling helper
  const renderStatusBadge = (status) => {
    const s = (status || '').toLowerCase();
    let bg = '#EEF4FF';
    let text = '#1D61E7';
    let label = status || 'Borrowed';

    if (s === 'overdue' || s === 'rejected') {
      bg = '#FEE2E2';
      text = '#DC2626';
    } else if (s.includes('returned') || s === 'approved') {
      bg = '#DCFCE7';
      text = '#15803D';
    }

    return (
      <span style={{
        fontSize: '0.725rem',
        fontWeight: '700',
        color: text,
        backgroundColor: bg,
        padding: '3px 10px',
        borderRadius: '9999px',
        display: 'inline-block'
      }}>
        {label}
      </span>
    );
  };

  return (
    <div className="admin-home animate-fade-in" style={{
      display: 'flex',
      flexDirection: 'column',
      padding: '16px 20px 24px 20px',
      backgroundColor: '#F8FAFC',
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <img
            src={equiptraceLogo}
            alt="EquipTrace"
            style={{
              height: '38px',
              objectFit: 'contain',
              display: 'block'
            }}
          />
          <span style={{
            fontSize: '1.2rem',
            fontWeight: '800',
            color: '#0F1E36',
            letterSpacing: '-0.3px',
            borderLeft: '2px solid #CBD5E1',
            paddingLeft: '12px',
            lineHeight: '1.2'
          }}>
            Overview
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
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
              justifyContent: 'center',
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
                border: '2px solid #FFFFFF',
              }} />
            )}
          </button>

          <button
            type="button"
            onClick={onOpenSettings}
            style={{
              position: 'relative',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '6px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            aria-label="Settings & More"
            title="Settings & More"
          >
            <Settings size={24} color="#1D61E7" strokeWidth={2.2} />
          </button>
        </div>
      </div>

      {/* KPI Cards 2x2 Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '14px'
      }}>
        {/* Total Equipment */}
        <div style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '18px',
          padding: '16px',
          border: '1px solid #E2E8F0',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 2px 8px rgba(13, 26, 48, 0.03)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <span style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: '500' }}>Total equipment</span>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              backgroundColor: '#EEF4FF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Package size={16} color="#1D61E7" />
            </div>
          </div>
          <span style={{ fontSize: '1.75rem', fontWeight: '800', color: '#0F1E36', marginTop: '6px' }}>
            {kpis?.totalEquipment || 248}
          </span>
          <span style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '2px' }}>
            All registered items
          </span>
        </div>

        {/* Available */}
        <div style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '18px',
          padding: '16px',
          border: '1px solid #E2E8F0',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 2px 8px rgba(13, 26, 48, 0.03)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <span style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: '500' }}>Available</span>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              backgroundColor: '#DCFCE7',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Check size={16} color="#15803D" />
            </div>
          </div>
          <span style={{ fontSize: '1.75rem', fontWeight: '800', color: '#0F1E36', marginTop: '6px' }}>
            {kpis?.available || 183}
          </span>
          <span style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '2px' }}>
            74% ready to borrow
          </span>
        </div>

        {/* Borrowed */}
        <div style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '18px',
          padding: '16px',
          border: '1px solid #E2E8F0',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 2px 8px rgba(13, 26, 48, 0.03)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <span style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: '500' }}>Borrowed</span>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              backgroundColor: '#F3E8FF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <User size={16} color="#7E22CE" />
            </div>
          </div>
          <span style={{ fontSize: '1.75rem', fontWeight: '800', color: '#0F1E36', marginTop: '6px' }}>
            {kpis?.borrowed || 42}
          </span>
          <span style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '2px' }}>
            Currently with students
          </span>
        </div>

        {/* Overdue */}
        <div style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '18px',
          padding: '16px',
          border: '1px solid #E2E8F0',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 2px 8px rgba(13, 26, 48, 0.03)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <span style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: '500' }}>Overdue</span>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              backgroundColor: '#FEE2E2',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <AlertCircle size={16} color="#DC2626" />
            </div>
          </div>
          <span style={{ fontSize: '1.75rem', fontWeight: '800', color: '#0F1E36', marginTop: '6px' }}>
            {kpis?.overdue || 8}
          </span>
          <span style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '2px' }}>
            Needs follow-up
          </span>
        </div>
      </div>

      {/* Interactive Borrowing Activity Chart */}
      <BorrowingTrendChart title="Borrowing activity" transactions={recentTransactions} />

      {/* Pending Requests Card Section */}
      <div style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '18px',
        padding: '18px 20px',
        border: '1px solid #E2E8F0',
        display: 'flex',
        flexDirection: 'column',
        gap: '14px',
        boxShadow: '0 2px 8px rgba(13, 26, 48, 0.03)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: '800', color: '#0F1E36' }}>
            Pending requests
          </h3>
          <span style={{ fontSize: '0.8rem', color: '#1D61E7', fontWeight: '700' }}>
            Pending ({pendingCount})
          </span>
        </div>

        {pendingItems.length === 0 ? (
          <p style={{ fontSize: '0.85rem', color: '#94A3B8', textAlign: 'center', margin: '12px 0' }}>No pending requests.</p>
        ) : (
          pendingItems.map((req) => (
            <div
              key={req.id}
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
                paddingBottom: '12px',
                borderBottom: '1px solid #F1F5F9'
              }}
            >
              <div>
                <h4 style={{ fontSize: '0.95rem', fontWeight: '800', color: '#0F1E36' }}>
                  {req.studentName}
                </h4>
                <p style={{ fontSize: '0.8rem', color: '#64748B', marginTop: '2px' }}>
                  {req.equipmentName} {req.equipmentCode} • {req.requestedDate}
                </p>
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => onApproveRequest(req.id)}
                  style={{
                    flex: 1,
                    padding: '8px 16px',
                    borderRadius: '10px',
                    border: 'none',
                    backgroundColor: '#1D61E7',
                    color: '#FFFFFF',
                    fontWeight: '700',
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    fontFamily: 'inherit'
                  }}
                >
                  Approve
                </button>
                <button
                  type="button"
                  onClick={() => onRejectRequest(req.id)}
                  style={{
                    flex: 1,
                    padding: '8px 16px',
                    borderRadius: '10px',
                    border: '1px solid #E2E8F0',
                    backgroundColor: '#FFFFFF',
                    color: '#0F1E36',
                    fontWeight: '600',
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    fontFamily: 'inherit'
                  }}
                >
                  Reject
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* ── Recent Transactions Card Section (Max 5, Search & Filters, View All) ── */}
      <div style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '18px',
        padding: '18px 20px',
        border: '1px solid #E2E8F0',
        display: 'flex',
        flexDirection: 'column',
        gap: '14px',
        boxShadow: '0 2px 8px rgba(13, 26, 48, 0.03)'
      }}>
        {/* Header with Title and View All Link */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h3 style={{ fontSize: '1rem', fontWeight: '800', color: '#0F1E36', margin: 0 }}>
              Recent transactions
            </h3>
            <span style={{ fontSize: '0.75rem', color: '#64748B', display: 'block', marginTop: '2px' }}>
              Showing latest {displayedTransactions.length} of {recentTransactions.length}
            </span>
          </div>

          <button
            type="button"
            onClick={() => onNavigateTab('requests')}
            style={{
              background: 'none',
              border: 'none',
              color: '#1D61E7',
              fontSize: '0.825rem',
              fontWeight: '700',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              padding: '4px'
            }}
          >
            <span>View all</span>
            <ArrowRight size={14} />
          </button>
        </div>

        {/* ── Transactions List (Max 5 Displayed) ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {displayedTransactions.length === 0 ? (
            <div style={{
              padding: '24px 16px',
              textAlign: 'center',
              backgroundColor: '#F8FAFC',
              borderRadius: '14px',
              border: '1px dashed #CBD5E1'
            }}>
              <p style={{ fontSize: '0.85rem', color: '#94A3B8', margin: 0 }}>
                No recent transactions recorded.
              </p>
            </div>
          ) : (
            displayedTransactions.map((tx) => {
              const initials = tx.studentInitials ||
                (tx.studentName ? tx.studentName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() : 'ST');
              const equipText = tx.equipmentName
                ? `${tx.equipmentName} ${tx.equipmentId ? `#${tx.equipmentId.replace('#', '')}` : ''}`
                : tx.equipment || 'Equipment Item';

              return (
                <div
                  key={tx.id}
                  style={{
                    backgroundColor: '#F8FAFC',
                    borderRadius: '14px',
                    padding: '12px 14px',
                    border: '1px solid #E2E8F0',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px'
                  }}
                >
                  {/* Student Info Row */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{
                        width: '34px',
                        height: '34px',
                        borderRadius: '50%',
                        backgroundColor: '#1D61E7',
                        color: '#FFFFFF',
                        fontWeight: '800',
                        fontSize: '0.8rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}>
                        {initials}
                      </div>
                      <div>
                        <h4 style={{ fontSize: '0.925rem', fontWeight: '800', color: '#0F1E36', margin: 0 }}>
                          {tx.studentName}
                        </h4>
                        {tx.studentId && (
                          <span style={{ fontSize: '0.725rem', color: '#64748B', display: 'block', marginTop: '1px' }}>
                            ID: {tx.studentId}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Status Badge */}
                    <div>
                      {renderStatusBadge(tx.status)}
                    </div>
                  </div>

                  {/* Details Grid: Equipment & Date */}
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1.2fr 1fr',
                    gap: '8px',
                    fontSize: '0.8rem',
                    backgroundColor: '#FFFFFF',
                    padding: '8px 10px',
                    borderRadius: '10px',
                    border: '1px solid #F1F5F9'
                  }}>
                    <div>
                      <span style={{ color: '#94A3B8', fontSize: '0.7rem', display: 'block' }}>Equipment</span>
                      <span style={{ color: '#0F1E36', fontWeight: '700', fontSize: '0.8rem', display: 'block' }}>
                        {equipText}
                      </span>
                    </div>
                    <div>
                      <span style={{ color: '#94A3B8', fontSize: '0.7rem', display: 'block' }}>Date</span>
                      <span style={{ color: '#0F1E36', fontWeight: '600', fontSize: '0.8rem', display: 'block' }}>
                        {tx.date}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* View All Prompt when more than 5 records exist */}
        {recentTransactions.length > 5 && (
          <button
            type="button"
            onClick={() => onNavigateTab('requests')}
            style={{
              width: '100%',
              padding: '10px',
              backgroundColor: '#EEF4FF',
              color: '#1D61E7',
              border: '1px solid #BFDBFE',
              borderRadius: '12px',
              fontWeight: '700',
              fontSize: '0.8rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              marginTop: '4px'
            }}
          >
            <span>View all {recentTransactions.length} records in Requests</span>
            <ArrowRight size={14} />
          </button>
        )}
      </div>

      {/* Clearance spacer for floating bottom navigation bar */}
      <div style={{ height: '96px', flexShrink: 0, minHeight: '96px' }} />
    </div>
  );
}
