import React, { useState } from 'react';
import { ArrowLeft, CheckCircle2, RotateCcw, PackageCheck, Clock } from 'lucide-react';

export default function BorrowingsScreen({
  onBack,
  borrowings = [],
  history = [],
  onReturnEquipment
}) {
  const [activeTab, setActiveTab] = useState('Current'); // 'Current' | 'History'

  return (
    <div className="borrowings-screen animate-fade-in" style={{
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100%',
      backgroundColor: '#FFFFFF',
      padding: '16px 20px 24px 20px'
    }}>
      {/* Header Bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        marginBottom: '20px',
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
          My Borrowings
        </h2>
      </div>

      {/* Segmented Filter Pills (Current | History) matching Screenshot 4 & 5 */}
      <div style={{
        display: 'flex',
        gap: '10px',
        marginBottom: '24px'
      }}>
        <button
          type="button"
          onClick={() => setActiveTab('Current')}
          style={{
            padding: '8px 20px',
            borderRadius: '9999px',
            border: 'none',
            backgroundColor: activeTab === 'Current' ? '#1D61E7' : '#F2F6FD',
            color: activeTab === 'Current' ? '#FFFFFF' : '#64748B',
            fontWeight: '700',
            fontSize: '0.875rem',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            fontFamily: 'inherit'
          }}
        >
          Current
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('History')}
          style={{
            padding: '8px 20px',
            borderRadius: '9999px',
            border: 'none',
            backgroundColor: activeTab === 'History' ? '#1D61E7' : '#F2F6FD',
            color: activeTab === 'History' ? '#FFFFFF' : '#64748B',
            fontWeight: '700',
            fontSize: '0.875rem',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            fontFamily: 'inherit'
          }}
        >
          History
        </button>
      </div>

      {/* Tab Contents */}
      {activeTab === 'Current' ? (
        borrowings.length === 0 ? (
          /* Empty State matching Screenshot 4 & 5 */
          <div style={{ marginTop: '12px' }}>
            <p style={{
              fontSize: '0.9rem',
              color: '#64748B',
              lineHeight: '1.4',
              fontWeight: '400'
            }}>
              Nothing borrowed right now. Scan a QR code to start.
            </p>
          </div>
        ) : (
          /* Active Borrowings Card List */
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {borrowings.map((item) => (
              <div
                key={item.borrowId}
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '16px',
                  border: '1px solid #E2E8F0',
                  padding: '16px',
                  boxShadow: '0 4px 12px rgba(13, 26, 48, 0.05)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px'
                }}
              >
                <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
                  <img
                    src={item.image}
                    alt={item.name}
                    style={{
                      width: '64px',
                      height: '64px',
                      borderRadius: '12px',
                      objectFit: 'cover'
                    }}
                  />
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{
                        fontSize: '0.75rem',
                        fontWeight: '700',
                        color: '#1D61E7',
                        backgroundColor: '#EEF4FF',
                        padding: '2px 8px',
                        borderRadius: '6px'
                      }}>
                        {item.id}
                      </span>
                      {item.status === 'Return Pending' ? (
                        <span style={{
                          fontSize: '0.75rem',
                          fontWeight: '800',
                          color: '#B45309',
                          backgroundColor: '#FEF3C7',
                          padding: '2px 8px',
                          borderRadius: '9999px',
                          border: '1px solid #FDE68A'
                        }}>
                          Return Pending
                        </span>
                      ) : (
                        <span style={{
                          fontSize: '0.75rem',
                          fontWeight: '700',
                          color: '#15803D',
                          backgroundColor: '#DCFCE7',
                          padding: '2px 8px',
                          borderRadius: '9999px'
                        }}>
                          Active
                        </span>
                      )}
                    </div>
                    <h3 style={{
                      fontSize: '1rem',
                      fontWeight: '700',
                      color: '#0F1E36',
                      marginTop: '4px'
                    }}>
                      {item.name}
                    </h3>
                    <p style={{ fontSize: '0.775rem', color: '#64748B', marginTop: '2px' }}>
                      Borrowed: {item.borrowedTime || 'Just now'}
                    </p>
                  </div>
                </div>

                <div style={{
                  backgroundColor: item.status === 'Return Pending' ? '#FFFBEB' : '#F8FAFC',
                  borderRadius: '10px',
                  padding: '10px 12px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: '0.8rem',
                  border: item.status === 'Return Pending' ? '1px solid #FDE68A' : 'none',
                }}>
                  <span style={{ color: '#64748B', fontWeight: '500' }}>
                    {item.status === 'Return Pending' ? 'Return Status:' : 'Return Due:'}
                  </span>
                  <span style={{ color: item.status === 'Return Pending' ? '#B45309' : '#0F1E36', fontWeight: '700' }}>
                    {item.status === 'Return Pending' ? 'Handed in · Awaiting Inspection' : 'Today before 5:00 PM'}
                  </span>
                </div>

                {item.status === 'Return Pending' ? (
                  <div
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '12px',
                      backgroundColor: '#FEF3C7',
                      color: '#B45309',
                      fontWeight: '700',
                      fontSize: '0.85rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      border: '1px solid #FDE68A',
                    }}
                  >
                    <Clock size={16} />
                    Pending Admin Approval
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => onReturnEquipment(item.borrowId)}
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '12px',
                      border: '1px solid #1D61E7',
                      backgroundColor: '#EEF4FF',
                      color: '#1D61E7',
                      fontWeight: '700',
                      fontSize: '0.875rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      transition: 'all 0.2s ease',
                      fontFamily: 'inherit'
                    }}
                  >
                    <RotateCcw size={16} />
                    Return Equipment
                  </button>
                )}
              </div>
            ))}
          </div>
        )
      ) : (
        /* History Tab */
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {history.length === 0 ? (
            <p style={{ fontSize: '0.9rem', color: '#64748B' }}>No borrowing history found.</p>
          ) : (
            history.map((item) => (
              <div
                key={item.id}
                style={{
                  backgroundColor: '#F8FAFC',
                  borderRadius: '14px',
                  padding: '14px 16px',
                  border: '1px solid #E2E8F0',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{
                      fontSize: '0.725rem',
                      fontWeight: '700',
                      color: '#64748B',
                      backgroundColor: '#E2E8F0',
                      padding: '2px 6px',
                      borderRadius: '4px'
                    }}>
                      {item.equipmentId}
                    </span>
                    <h4 style={{ fontSize: '0.925rem', fontWeight: '700', color: '#0F1E36' }}>
                      {item.name}
                    </h4>
                  </div>
                  <p style={{ fontSize: '0.775rem', color: '#64748B', marginTop: '4px' }}>
                    Returned: {item.returnedDate}
                  </p>
                </div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  color: '#15803D',
                  fontSize: '0.75rem',
                  fontWeight: '700',
                  backgroundColor: '#DCFCE7',
                  padding: '4px 8px',
                  borderRadius: '9999px'
                }}>
                  <CheckCircle2 size={13} />
                  <span>{item.status}</span>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Clearance spacer for floating bottom navigation bar */}
      <div style={{ height: '96px', flexShrink: 0, minHeight: '96px' }} />
    </div>
  );
}
