import React, { useState } from 'react';
import { Menu, Bell, ArrowLeftRight, ShieldCheck, Sun, ChevronRight, Layers } from 'lucide-react';
import BorrowingPoliciesModal from './BorrowingPoliciesModal';
import SystemArchitectureModal from './SystemArchitectureModal';

export default function AdminMore({ onLogout }) {
  const [showPolicyModal, setShowPolicyModal] = useState(false);
  const [showArchModal, setShowArchModal] = useState(false);

  return (
    <div className="admin-more animate-fade-in" style={{
      display: 'flex',
      flexDirection: 'column',
      padding: '16px 20px 24px 20px',
      backgroundColor: '#F8FAFC',
      minHeight: '100%',
      gap: '16px'
    }}>
      {/* Top Header Bar matching Screenshot 2 */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: '4px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '38px',
            height: '38px',
            borderRadius: '50%',
            backgroundColor: '#1D61E7',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 10px rgba(29, 97, 231, 0.2)'
          }}>
            <Menu size={20} color="#FFFFFF" strokeWidth={2.5} />
          </div>
          <span style={{
            fontSize: '1.3rem',
            fontWeight: '800',
            color: '#0F1E36',
            letterSpacing: '-0.3px'
          }}>
            More
          </span>
        </div>

        <button
          type="button"
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
        >
          <Bell size={24} color="#1D61E7" strokeWidth={2.2} />
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
        </button>
      </div>

      {/* Admin Profile Card matching Screenshot 2 */}
      <div style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '18px',
        padding: '16px 20px',
        border: '1px solid #E2E8F0',
        display: 'flex',
        alignItems: 'center',
        gap: '14px',
        boxShadow: '0 2px 8px rgba(13, 26, 48, 0.03)'
      }}>
        <div style={{
          width: '50px',
          height: '50px',
          borderRadius: '50%',
          backgroundColor: '#1D61E7',
          color: '#FFFFFF',
          fontWeight: '800',
          fontSize: '1.1rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 10px rgba(29, 97, 231, 0.25)'
        }}>
          PE
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#0F1E36' }}>
            Admin
          </h3>
          <span style={{ fontSize: '0.85rem', color: '#64748B', fontWeight: '500', marginTop: '2px' }}>
            PE Office
          </span>
        </div>
      </div>

      {/* Menu Container Card matching Screenshot 2 */}
      <div style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '18px',
        border: '1px solid #E2E8F0',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 2px 8px rgba(13, 26, 48, 0.03)',
        overflow: 'hidden'
      }}>
        {/* Row 1: Transactions */}
        <div
          style={{
            padding: '16px 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid #F1F5F9',
            cursor: 'pointer'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '12px',
              backgroundColor: '#EEF4FF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <ArrowLeftRight size={20} color="#1D61E7" />
            </div>
            <div>
              <h4 style={{ fontSize: '0.95rem', fontWeight: '800', color: '#0F1E36' }}>
                Transactions
              </h4>
              <p style={{ fontSize: '0.8rem', color: '#64748B', marginTop: '2px' }}>
                Every borrow and return
              </p>
            </div>
          </div>
          <ChevronRight size={20} color="#64748B" />
        </div>

        {/* Row 2: Borrowing Policies & Penalties (replaces Notifications per user prompt) */}
        <div
          onClick={() => setShowPolicyModal(true)}
          style={{
            padding: '16px 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid #F1F5F9',
            cursor: 'pointer'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '12px',
              backgroundColor: '#EEF4FF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <ShieldCheck size={20} color="#1D61E7" />
            </div>
            <div>
              <h4 style={{ fontSize: '0.95rem', fontWeight: '800', color: '#0F1E36' }}>
                Borrowing Policies & Penalties
              </h4>
              <p style={{ fontSize: '0.8rem', color: '#64748B', marginTop: '2px' }}>
                Rules & accountability terms
              </p>
            </div>
          </div>
          <ChevronRight size={20} color="#64748B" />
        </div>

        {/* Row 3: Settings */}
        <div
          style={{
            padding: '16px 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid #F1F5F9',
            cursor: 'pointer'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '12px',
              backgroundColor: '#EEF4FF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Sun size={20} color="#1D61E7" />
            </div>
            <div>
              <h4 style={{ fontSize: '0.95rem', fontWeight: '800', color: '#0F1E36' }}>
                Settings
              </h4>
              <p style={{ fontSize: '0.8rem', color: '#64748B', marginTop: '2px' }}>
                Preferences
              </p>
            </div>
          </div>
          <ChevronRight size={20} color="#64748B" />
        </div>

        {/* Row 4: System Architecture & Tech Stack */}
        <div
          onClick={() => setShowArchModal(true)}
          style={{
            padding: '16px 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            cursor: 'pointer'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '12px',
              backgroundColor: '#ECFDF5',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Layers size={20} color="#10B981" />
            </div>
            <div>
              <h4 style={{ fontSize: '0.95rem', fontWeight: '800', color: '#0F1E36' }}>
                System Architecture
              </h4>
              <p style={{ fontSize: '0.8rem', color: '#64748B', marginTop: '2px' }}>
                Backend, DB, QR, FCM & Stack
              </p>
            </div>
          </div>
          <ChevronRight size={20} color="#64748B" />
        </div>
      </div>

      {/* Switch to Desktop View Button matching Screenshot 2 */}
      <button
        type="button"
        style={{
          width: '100%',
          height: '50px',
          backgroundColor: '#FFFFFF',
          color: '#0F1E36',
          border: '1px solid #E2E8F0',
          borderRadius: '14px',
          fontSize: '0.925rem',
          fontWeight: '700',
          cursor: 'pointer',
          marginTop: '6px',
          fontFamily: 'inherit',
          boxShadow: '0 2px 6px rgba(13, 26, 48, 0.02)'
        }}
      >
        Switch to desktop view
      </button>

      {/* Log out Button matching Screenshot 2 */}
      <button
        type="button"
        onClick={onLogout}
        style={{
          width: '100%',
          height: '50px',
          backgroundColor: '#FEE2E2',
          color: '#EF4444',
          border: 'none',
          borderRadius: '14px',
          fontSize: '0.95rem',
          fontWeight: '700',
          cursor: 'pointer',
          fontFamily: 'inherit'
        }}
      >
        Log out
      </button>

      {/* Borrowing Policies Modal */}
      {showPolicyModal && (
        <BorrowingPoliciesModal onClose={() => setShowPolicyModal(false)} />
      )}

      {/* System Architecture Modal */}
      {showArchModal && (
        <SystemArchitectureModal onClose={() => setShowArchModal(false)} />
      )}
    </div>
  );
}
