import React, { useState } from 'react';
import { X, Check, MapPin, Info, ShieldCheck, Clock } from 'lucide-react';

export default function EquipmentDetailModal({ equipment, onClose, onConfirmBorrow }) {
  const [agreed, setAgreed] = useState(true);

  if (!equipment) return null;

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
        borderTopLeftRadius: '24px',
        borderTopRightRadius: '24px',
        padding: '24px 20px 28px 20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        boxShadow: '0 -10px 30px rgba(0,0,0,0.2)',
        maxHeight: '90%',
        overflowY: 'auto'
      }}>
        {/* Top Header Row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{
            fontSize: '0.8rem',
            fontWeight: '800',
            color: '#1D61E7',
            backgroundColor: '#EEF4FF',
            padding: '4px 10px',
            borderRadius: '8px'
          }}>
            {equipment.id}
          </span>
          <button
            type="button"
            onClick={onClose}
            style={{
              background: '#F1F5F9',
              border: 'none',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
          >
            <X size={18} color="#64748B" />
          </button>
        </div>

        {/* Image & Title */}
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <img
            src={equipment.image}
            alt={equipment.name}
            style={{
              width: '80px',
              height: '80px',
              borderRadius: '16px',
              objectFit: 'cover',
              boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
            }}
          />
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: '#0F1E36', lineHeight: '1.2' }}>
              {equipment.name}
            </h3>
            <span style={{ fontSize: '0.825rem', color: '#64748B', marginTop: '4px' }}>
              Category: {equipment.category}
            </span>
          </div>
        </div>

        {/* Info Grid */}
        <div style={{
          backgroundColor: '#F8FAFC',
          borderRadius: '14px',
          padding: '14px',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '12px',
          border: '1px solid #E2E8F0'
        }}>
          <div>
            <span style={{ fontSize: '0.75rem', color: '#64748B', display: 'block' }}>Availability</span>
            <span style={{ fontSize: '0.9rem', fontWeight: '700', color: '#15803D' }}>
              {equipment.available} of {equipment.total} available
            </span>
          </div>
          <div>
            <span style={{ fontSize: '0.75rem', color: '#64748B', display: 'block' }}>Condition</span>
            <span style={{ fontSize: '0.9rem', fontWeight: '700', color: '#0F1E36' }}>
              {equipment.condition}
            </span>
          </div>
          <div style={{ gridColumn: 'span 2', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <MapPin size={14} color="#1D61E7" />
            <span style={{ fontSize: '0.8rem', color: '#64748B' }}>
              Pickup: <strong style={{ color: '#0F1E36' }}>{equipment.location}</strong>
            </span>
          </div>
        </div>

        {/* Return Policy Notice */}
        <div style={{
          backgroundColor: '#EFF6FF',
          border: '1px solid #BFDBFE',
          borderRadius: '12px',
          padding: '12px',
          display: 'flex',
          gap: '10px',
          alignItems: 'flex-start'
        }}>
          <Clock size={18} color="#1D61E7" style={{ marginTop: '2px', flexShrink: 0 }} />
          <p style={{ fontSize: '0.8rem', color: '#1E40AF', lineHeight: '1.4' }}>
            Return due today before <strong>5:00 PM</strong> at {equipment.location}.
          </p>
        </div>

        {/* Confirm Checkbox */}
        <label style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          fontSize: '0.825rem',
          color: '#475569',
          cursor: 'pointer'
        }}>
          <input
            type="checkbox"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            style={{ width: '16px', height: '16px', accentColor: '#1D61E7' }}
          />
          I accept accountability for the borrowed equipment.
        </label>

        {/* Confirm Button */}
        <button
          type="button"
          disabled={!agreed}
          onClick={() => onConfirmBorrow(equipment)}
          style={{
            width: '100%',
            height: '50px',
            backgroundColor: agreed ? '#1D61E7' : '#94A3B8',
            color: '#FFFFFF',
            border: 'none',
            borderRadius: '14px',
            fontSize: '1rem',
            fontWeight: '700',
            cursor: agreed ? 'pointer' : 'not-allowed',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            boxShadow: agreed ? '0 4px 14px rgba(29, 97, 231, 0.3)' : 'none',
            fontFamily: 'inherit'
          }}
        >
          <Check size={20} />
          Confirm Borrowing
        </button>
      </div>
    </div>
  );
}
