import React from 'react';
import { X, ShieldAlert, Clock, AlertTriangle, CheckCircle } from 'lucide-react';

export default function BorrowingPoliciesModal({ onClose }) {
  return (
    <div style={{
      position: 'absolute',
      inset: 0,
      backgroundColor: 'rgba(15, 30, 54, 0.65)',
      zIndex: 90,
      display: 'flex',
      alignItems: 'flex-end',
      justifyContent: 'center',
      backdropFilter: 'blur(4px)',
      animation: 'fadeIn 0.2s ease'
    }}>
      <div style={{
        backgroundColor: '#FFFFFF',
        width: '100%',
        maxHeight: '90%',
        borderTopLeftRadius: '24px',
        borderTopRightRadius: '24px',
        padding: '24px 20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        boxShadow: '0 -10px 30px rgba(0,0,0,0.2)',
        overflowY: 'auto'
      }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ShieldAlert size={22} color="#1D61E7" />
            <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: '#0F1E36' }}>
              Borrowing Policies & Penalties
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{
              background: '#F1F5F9',
              border: 'none',
              borderRadius: '50%',
              width: '34px',
              height: '34px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
          >
            <X size={18} color="#64748B" />
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '0.85rem' }}>
          {/* Policy 1 */}
          <div style={{ backgroundColor: '#F8FAFC', padding: '14px', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#1D61E7', fontWeight: '700', marginBottom: '4px' }}>
              <Clock size={16} />
              <span>Standard Borrowing Period</span>
            </div>
            <p style={{ color: '#475569' }}>
              Equipment must be returned by 5:00 PM on the agreed return date. Same-day PE loans must be returned before PE class ends.
            </p>
          </div>

          {/* Policy 2 */}
          <div style={{ backgroundColor: '#FEF2F2', padding: '14px', borderRadius: '12px', border: '1px solid #FCA5A5' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#DC2626', fontWeight: '700', marginBottom: '4px' }}>
              <AlertTriangle size={16} />
              <span>Overdue Fines & Penalties</span>
            </div>
            <p style={{ color: '#991B1B' }}>
              Overdue items incur a fine of ₱50 per day. Borrowing privileges will be suspended after 3 consecutive overdue infractions.
            </p>
          </div>

          {/* Policy 3 */}
          <div style={{ backgroundColor: '#ECFDF5', padding: '14px', borderRadius: '12px', border: '1px solid #6EE7B7' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#059669', fontWeight: '700', marginBottom: '4px' }}>
              <CheckCircle size={16} />
              <span>Damaged or Lost Gear</span>
            </div>
            <p style={{ color: '#065F46' }}>
              Students are held accountable for any damage or loss during the borrowing period. Replacement cost or repair fees will apply.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          style={{
            width: '100%',
            height: '46px',
            backgroundColor: '#1D61E7',
            color: '#FFFFFF',
            border: 'none',
            borderRadius: '12px',
            fontSize: '0.9rem',
            fontWeight: '700',
            cursor: 'pointer',
            marginTop: '8px',
            fontFamily: 'inherit'
          }}
        >
          Close Policy Guide
        </button>
      </div>
    </div>
  );
}
