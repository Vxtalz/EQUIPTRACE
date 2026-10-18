import React, { useState } from 'react';
import { Bell, CheckCircle2, XCircle, Settings } from 'lucide-react';
import equiptraceLogo from '../../assets/equiptrace-logo.png';

export default function AdminRequests({
  requests = [],
  onApproveRequest,
  onRejectRequest,
  onOpenNotifications,
  onOpenSettings,
  unreadCount = 0,
}) {
  const [filterTab, setFilterTab] = useState('Pending'); // 'Pending' | 'Approved' | 'Rejected'

  const pendingList = requests.filter(r => r.status === 'Pending');
  const approvedList = requests.filter(r => r.status === 'Approved');
  const rejectedList = requests.filter(r => r.status === 'Rejected');

  const getDisplayedList = () => {
    if (filterTab === 'Pending') return pendingList;
    if (filterTab === 'Approved') return approvedList;
    if (filterTab === 'Rejected') return rejectedList;
    return [];
  };

  const currentList = getDisplayedList();

  return (
    <div className="admin-requests animate-fade-in" style={{
      display: 'flex',
      flexDirection: 'column',
      padding: '16px 20px 24px 20px',
      backgroundColor: '#F8FAFC',
      minHeight: '100%',
      gap: '16px'
    }}>
      {/* Header Bar matching Screenshot 5 */}
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
            Borrowing requests
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

      {/* Filter Tabs matching Screenshot 5 */}
      <div style={{
        display: 'flex',
        gap: '10px',
        marginBottom: '6px'
      }}>
        <button
          type="button"
          onClick={() => setFilterTab('Pending')}
          style={{
            padding: '8px 20px',
            borderRadius: '9999px',
            border: 'none',
            backgroundColor: filterTab === 'Pending' ? '#1D61E7' : '#FFFFFF',
            color: filterTab === 'Pending' ? '#FFFFFF' : '#64748B',
            border: filterTab === 'Pending' ? 'none' : '1px solid #E2E8F0',
            fontWeight: '700',
            fontSize: '0.875rem',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            fontFamily: 'inherit'
          }}
        >
          Pending ({pendingList.length})
        </button>

        <button
          type="button"
          onClick={() => setFilterTab('Approved')}
          style={{
            padding: '8px 20px',
            borderRadius: '9999px',
            border: 'none',
            backgroundColor: filterTab === 'Approved' ? '#1D61E7' : '#FFFFFF',
            color: filterTab === 'Approved' ? '#FFFFFF' : '#64748B',
            border: filterTab === 'Approved' ? 'none' : '1px solid #E2E8F0',
            fontWeight: '700',
            fontSize: '0.875rem',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            fontFamily: 'inherit'
          }}
        >
          Approved
        </button>

        <button
          type="button"
          onClick={() => setFilterTab('Rejected')}
          style={{
            padding: '8px 20px',
            borderRadius: '9999px',
            border: 'none',
            backgroundColor: filterTab === 'Rejected' ? '#1D61E7' : '#FFFFFF',
            color: filterTab === 'Rejected' ? '#FFFFFF' : '#64748B',
            border: filterTab === 'Rejected' ? 'none' : '1px solid #E2E8F0',
            fontWeight: '700',
            fontSize: '0.875rem',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            fontFamily: 'inherit'
          }}
        >
          Rejected
        </button>
      </div>

      {/* Requests Cards List matching Screenshot 5 */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {currentList.length === 0 ? (
          <p style={{ fontSize: '0.9rem', color: '#94A3B8', textAlign: 'center', marginTop: '30px' }}>
            No {filterTab.toLowerCase()} borrowing requests.
          </p>
        ) : (
          currentList.map((req) => (
            <div
              key={req.id}
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '18px',
                padding: '18px',
                border: '1px solid #E2E8F0',
                display: 'flex',
                flexDirection: 'column',
                gap: '14px',
                boxShadow: '0 2px 8px rgba(13, 26, 48, 0.03)'
              }}
            >
              {/* Top Row: Student Avatar & Name */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  backgroundColor: '#1D61E7',
                  color: '#FFFFFF',
                  fontWeight: '800',
                  fontSize: '0.9rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {req.studentInitials}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <h4 style={{ fontSize: '1.05rem', fontWeight: '800', color: '#0F1E36', margin: 0 }}>
                    {req.studentName}
                  </h4>
                  {(req.studentId || req.studentCourse || req.studentYear) && (
                    <span style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: '600', marginTop: '2px' }}>
                      {req.studentId ? `ID: ${req.studentId}` : ''}
                      {req.studentId && (req.studentCourse || req.studentYear) ? ' · ' : ''}
                      {[req.studentCourse, req.studentYear].filter(Boolean).join(' ')}
                    </span>
                  )}
                </div>
              </div>

              {/* Equipment & Details Grid */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '12px',
                fontSize: '0.825rem'
              }}>
                <div>
                  <span style={{ color: '#94A3B8', display: 'block' }}>Equipment</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
                    <span style={{ fontSize: '1.1rem' }}>{req.icon || '📦'}</span>
                    <span style={{ color: '#0F1E36', fontWeight: '800' }}>{req.equipmentName}</span>
                    <span style={{ color: '#64748B', fontWeight: '500' }}>{req.equipmentCode}</span>
                  </div>
                </div>

                <div>
                  <span style={{ color: '#94A3B8', display: 'block' }}>Requested</span>
                  <span style={{ color: '#0F1E36', fontWeight: '600', display: 'block', marginTop: '2px' }}>
                    {req.requestedDate}
                  </span>
                </div>

                <div>
                  <span style={{ color: '#94A3B8', display: 'block' }}>Return by</span>
                  <span style={{ color: '#0F1E36', fontWeight: '600', display: 'block', marginTop: '2px' }}>
                    {req.returnBy}
                  </span>
                </div>

                {req.purpose && (
                  <div>
                    <span style={{ color: '#94A3B8', display: 'block' }}>Purpose</span>
                    <span style={{ color: '#0F1E36', fontWeight: '600', display: 'block', marginTop: '2px' }}>
                      {req.purpose}
                    </span>
                  </div>
                )}

                <div>
                  <span style={{ color: '#94A3B8', display: 'block' }}>Status</span>
                  {req.status === 'Pending' && (
                    <span style={{
                      fontSize: '0.725rem',
                      fontWeight: '700',
                      color: '#B45309',
                      backgroundColor: '#FEF3C7',
                      padding: '2px 8px',
                      borderRadius: '9999px',
                      display: 'inline-block',
                      marginTop: '2px'
                    }}>
                      Pending
                    </span>
                  )}
                  {req.status === 'Approved' && (
                    <span style={{
                      fontSize: '0.725rem',
                      fontWeight: '700',
                      color: '#15803D',
                      backgroundColor: '#DCFCE7',
                      padding: '2px 8px',
                      borderRadius: '9999px',
                      display: 'inline-block',
                      marginTop: '2px'
                    }}>
                      Approved
                    </span>
                  )}
                  {req.status === 'Rejected' && (
                    <span style={{
                      fontSize: '0.725rem',
                      fontWeight: '700',
                      color: '#DC2626',
                      backgroundColor: '#FEE2E2',
                      padding: '2px 8px',
                      borderRadius: '9999px',
                      display: 'inline-block',
                      marginTop: '2px'
                    }}>
                      Rejected
                    </span>
                  )}
                </div>
              </div>

              {/* Action Buttons for Pending items matching Screenshot 5 */}
              {req.status === 'Pending' && (
                <div style={{ display: 'flex', gap: '12px', marginTop: '4px' }}>
                  <button
                    type="button"
                    onClick={() => onApproveRequest(req.id)}
                    style={{
                      flex: 1,
                      height: '46px',
                      borderRadius: '12px',
                      border: 'none',
                      backgroundColor: '#1D61E7',
                      color: '#FFFFFF',
                      fontWeight: '700',
                      fontSize: '0.9rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                      boxShadow: '0 4px 10px rgba(29, 97, 231, 0.25)',
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
                      height: '46px',
                      borderRadius: '12px',
                      border: '1px solid #E2E8F0',
                      backgroundColor: '#FFFFFF',
                      color: '#0F1E36',
                      fontWeight: '700',
                      fontSize: '0.9rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                      fontFamily: 'inherit'
                    }}
                  >
                    Reject
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Clearance spacer for floating bottom navigation bar */}
      <div style={{ height: '96px', flexShrink: 0, minHeight: '96px' }} />
    </div>
  );
}
