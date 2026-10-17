import React from 'react';
import { Bell, Package, Check, User, AlertCircle } from 'lucide-react';
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
  unreadCount = 0,
}) {
  const pendingItems = pendingRequests.filter(r => r.status === 'Pending');
  const pendingCount = pendingItems.length;

  return (
    <div className="admin-home animate-fade-in" style={{
      display: 'flex',
      flexDirection: 'column',
      padding: '16px 20px 24px 20px',
      backgroundColor: '#F8FAFC',
      minHeight: '100%',
      gap: '20px'
    }}>
      {/* Top Header Bar matching Screenshot 2 & 3 */}
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

      {/* KPI Cards 2x2 Grid matching Image 2 */}
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

      {/* Pending Requests Card Section matching Image 2 */}
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

      {/* Recent Transactions Card Section matching Image 3 */}
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
            Recent transactions
          </h3>
          <button
            type="button"
            onClick={() => onNavigateTab('requests')}
            style={{
              background: 'none',
              border: 'none',
              color: '#1D61E7',
              fontSize: '0.825rem',
              fontWeight: '700',
              cursor: 'pointer'
            }}
          >
            View all
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {recentTransactions.map((tx) => (
            <div
              key={tx.id}
              style={{
                backgroundColor: '#F8FAFC',
                borderRadius: '14px',
                padding: '14px',
                border: '1px solid #E2E8F0',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px'
              }}
            >
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
                  justifyContent: 'center'
                }}>
                  {tx.studentInitials}
                </div>
                <h4 style={{ fontSize: '0.95rem', fontWeight: '800', color: '#0F1E36' }}>
                  {tx.studentName}
                </h4>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '0.8rem' }}>
                <div>
                  <span style={{ color: '#94A3B8', display: 'block' }}>Equipment</span>
                  <span style={{ color: '#0F1E36', fontWeight: '600' }}>{tx.equipment}</span>
                </div>
                <div>
                  <span style={{ color: '#94A3B8', display: 'block' }}>Date</span>
                  <span style={{ color: '#0F1E36', fontWeight: '600' }}>{tx.date}</span>
                </div>
              </div>

              <div>
                <span style={{ color: '#94A3B8', fontSize: '0.75rem', display: 'block', marginBottom: '4px' }}>Status</span>
                {(tx.status === 'Overdue') && (
                  <span style={{
                    fontSize: '0.725rem',
                    fontWeight: '700',
                    color: '#DC2626',
                    backgroundColor: '#FEE2E2',
                    padding: '3px 10px',
                    borderRadius: '9999px',
                    display: 'inline-block'
                  }}>
                    Overdue
                  </span>
                )}
                {(tx.status === 'Borrowed') && (
                  <span style={{
                    fontSize: '0.725rem',
                    fontWeight: '700',
                    color: '#1D61E7',
                    backgroundColor: '#EEF4FF',
                    padding: '3px 10px',
                    borderRadius: '9999px',
                    display: 'inline-block'
                  }}>
                    Borrowed
                  </span>
                )}
                {(tx.status === 'Returned') && (
                  <span style={{
                    fontSize: '0.725rem',
                    fontWeight: '700',
                    color: '#15803D',
                    backgroundColor: '#DCFCE7',
                    padding: '3px 10px',
                    borderRadius: '9999px',
                    display: 'inline-block'
                  }}>
                    Returned
                  </span>
                )}
                {(tx.status === 'Rejected') && (
                  <span style={{
                    fontSize: '0.725rem',
                    fontWeight: '700',
                    color: '#DC2626',
                    backgroundColor: '#FEE2E2',
                    padding: '3px 10px',
                    borderRadius: '9999px',
                    display: 'inline-block'
                  }}>
                    Rejected
                  </span>
                )}
                {(tx.status === 'Approved') && (
                  <span style={{
                    fontSize: '0.725rem',
                    fontWeight: '700',
                    color: '#15803D',
                    backgroundColor: '#DCFCE7',
                    padding: '3px 10px',
                    borderRadius: '9999px',
                    display: 'inline-block'
                  }}>
                    Approved
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Clearance spacer for floating bottom navigation bar */}
      <div style={{ height: '96px', flexShrink: 0, minHeight: '96px' }} />
    </div>
  );
}
