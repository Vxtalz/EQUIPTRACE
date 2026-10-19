import React, { useState } from 'react';
import {
  X,
  Check,
  MapPin,
  Clock,
  Calendar,
  User,
  ShieldCheck,
  Tag,
  FileText,
} from 'lucide-react';
import { CATEGORY_IMAGES, getSportImage } from '../data/mockData';

export default function EquipmentDetailModal({
  equipment,
  student,
  onClose,
  onConfirmBorrow,
  onNavigate,
}) {
  const todayStr = new Date().toISOString().split('T')[0];

  const [returnDate, setReturnDate] = useState(todayStr);
  const [returnTime, setReturnTime] = useState('17:00');
  const [purpose, setPurpose] = useState('PE Class Activity');
  const [agreed, setAgreed] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (!equipment) return null;

  // Format return schedule label
  const formatReturnBy = () => {
    const isToday = returnDate === todayStr;
    const [h, m] = returnTime.split(':');
    const hourNum = parseInt(h, 10);
    const ampm = hourNum >= 12 ? 'PM' : 'AM';
    const displayHour = hourNum % 12 || 12;
    const timeFormatted = `${displayHour}:${m} ${ampm}`;

    if (isToday) {
      return `Today before ${timeFormatted}`;
    }
    const [year, month, day] = returnDate.split('-');
    const dateFormatted = `${month}/${day}/${year}`;
    return `${dateFormatted} before ${timeFormatted}`;
  };

  const handleConfirm = async () => {
    if (!agreed || submitting) return;
    setSubmitting(true);

    try {
      const formattedReturnBy = formatReturnBy();
      if (onConfirmBorrow) {
        await onConfirmBorrow(equipment, {
          returnDate,
          returnTime,
          purpose: purpose.trim() || 'PE Class Activity',
          formattedReturnBy,
        });
      }
    } catch (err) {
      console.error('Borrow error:', err);
    } finally {
      // Transition directly to the "Request sent" screen (Image 3)
      setSubmitted(true);
      setSubmitting(false);
    }
  };

  // ─────────────────────────────────────────────────────────────────────────────
  // SUCCESS SCREEN: Matches Image 3 ("Request sent")
  // ─────────────────────────────────────────────────────────────────────────────
  if (submitted) {
    return (
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: '#FFFFFF',
          zIndex: 160,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '44px 24px 32px 24px',
          animation: 'fadeIn 0.25s ease',
          boxSizing: 'border-box',
        }}
      >
        <div
          style={{
            width: '100%',
            maxWidth: '380px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
          }}
        >
          {/* Big Green Check Circle */}
          <div
            style={{
              width: '84px',
              height: '84px',
              borderRadius: '50%',
              backgroundColor: '#DCFCE7',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#16A34A',
              marginBottom: '22px',
              boxShadow: '0 8px 20px rgba(34, 197, 94, 0.18)',
            }}
          >
            <Check size={42} strokeWidth={3} />
          </div>

          {/* Heading */}
          <h2
            style={{
              fontSize: '1.7rem',
              fontWeight: '800',
              color: '#0F1E36',
              letterSpacing: '-0.4px',
              marginBottom: '10px',
              lineHeight: '1.2',
            }}
          >
            Request sent
          </h2>

          {/* Subtitle */}
          <p
            style={{
              fontSize: '0.925rem',
              color: '#64748B',
              lineHeight: '1.45',
              maxWidth: '300px',
              margin: '0 auto 36px auto',
            }}
          >
            The PE office will review it. You'll get a notification once it's approved.
          </p>

          {/* Primary Action Button: View my borrowings */}
          <button
            type="button"
            onClick={() => {
              if (onClose) onClose();
              if (onNavigate) onNavigate('borrowings');
            }}
            style={{
              width: '100%',
              height: '52px',
              backgroundColor: '#1D61E7',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '14px',
              fontSize: '1rem',
              fontWeight: '700',
              cursor: 'pointer',
              marginBottom: '12px',
              boxShadow: '0 4px 14px rgba(29, 97, 231, 0.3)',
              transition: 'all 0.15s ease',
              fontFamily: 'inherit',
            }}
          >
            View my borrowings
          </button>

          {/* Secondary Action Button: Back to home */}
          <button
            type="button"
            onClick={() => {
              if (onClose) onClose();
              if (onNavigate) onNavigate('home');
            }}
            style={{
              width: '100%',
              height: '52px',
              backgroundColor: '#EEF4FF',
              color: '#1D61E7',
              border: 'none',
              borderRadius: '14px',
              fontSize: '1rem',
              fontWeight: '700',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
              fontFamily: 'inherit',
            }}
          >
            Back to home
          </button>
        </div>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // BORROW DETAILS MODAL: Matches Image 1 & Image 2
  // ─────────────────────────────────────────────────────────────────────────────
  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget && onClose) onClose();
      }}
      style={{
        position: 'absolute',
        inset: 0,
        backgroundColor: 'rgba(15, 30, 54, 0.65)',
        zIndex: 150,
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
        backdropFilter: 'blur(4px)',
        animation: 'fadeIn 0.2s ease',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: '#FFFFFF',
          width: '100%',
          maxWidth: '520px',
          borderTopLeftRadius: '24px',
          borderTopRightRadius: '24px',
          padding: '24px 20px 32px 20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          boxShadow: '0 -10px 30px rgba(0,0,0,0.2)',
          maxHeight: '92%',
          overflowY: 'auto',
          boxSizing: 'border-box',
        }}
      >
        {/* Top Header Row with Code & Close button */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span
            style={{
              fontSize: '0.8rem',
              fontWeight: '800',
              color: '#1D61E7',
              backgroundColor: '#EEF4FF',
              padding: '4px 10px',
              borderRadius: '8px',
            }}
          >
            {equipment.id}
          </span>
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
              cursor: 'pointer',
            }}
          >
            <X size={18} color="#64748B" />
          </button>
        </div>

        {/* Equipment Image & Title */}
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <img
            src={getSportImage(equipment)}
            alt={equipment.name}
            style={{
              width: '80px',
              height: '80px',
              borderRadius: '16px',
              objectFit: 'contain',
              backgroundColor: '#F8FAFC',
              padding: '6px',
              border: '1px solid #E2E8F0',
              boxShadow: '0 4px 12px rgba(0,0,0,0.04)',
              flexShrink: 0,
            }}
            onError={(e) => {
              e.currentTarget.src = getSportImage(equipment);
            }}
          />
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: '#0F1E36', lineHeight: '1.2', margin: 0 }}>
              {equipment.name}
            </h3>
            <span style={{ fontSize: '0.825rem', color: '#64748B', marginTop: '4px' }}>
              Category: {equipment.category}
            </span>
          </div>
        </div>

        {/* Equipment Status & Location Grid */}
        <div
          style={{
            backgroundColor: '#F8FAFC',
            borderRadius: '14px',
            padding: '14px',
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '12px',
            border: '1px solid #E2E8F0',
          }}
        >
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

        {/* ── CARD 1: WHO IS BORROWING (Borrower Profile) ── */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '14px',
            padding: '12px 14px',
            border: '1px solid #E2E8F0',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
          }}
        >
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '50%',
              backgroundColor: '#EEF4FF',
              color: '#1D61E7',
              fontWeight: '800',
              fontSize: '1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            {(student?.name || 'S').trim().charAt(0).toUpperCase()}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <span style={{ fontSize: '0.72rem', color: '#64748B', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Borrower Details
            </span>
            <h4 style={{ fontSize: '0.95rem', fontWeight: '800', color: '#0F1E36', margin: '2px 0 0 0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {student?.name || 'Juan Dela Cruz'}
            </h4>
            <p style={{ fontSize: '0.78rem', color: '#64748B', margin: '2px 0 0 0' }}>
              ID: <strong style={{ color: '#1D61E7' }}>{student?.id || '2025-001'}</strong> • {student?.course || 'BS Physical Education'}
            </p>
          </div>
        </div>

        {/* ── CARD 2: EXPECTED RETURN SCHEDULE (Matching Image 2) ── */}
        <div
          style={{
            backgroundColor: '#F8FAFC',
            borderRadius: '16px',
            padding: '14px 16px',
            border: '1px solid #E2E8F0',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Calendar size={16} color="#1D61E7" />
            <h4 style={{ fontSize: '0.88rem', fontWeight: '800', color: '#0F1E36', margin: 0 }}>
              Expected Return Schedule
            </h4>
          </div>

          {/* Date & Time Row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            {/* Expected Return Date */}
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', color: '#475569', marginBottom: '4px' }}>
                Return Date <span style={{ color: '#EF4444' }}>*</span>
              </label>
              <input
                type="date"
                value={returnDate}
                min={todayStr}
                onChange={(e) => setReturnDate(e.target.value)}
                style={{
                  width: '100%',
                  height: '42px',
                  padding: '0 10px',
                  borderRadius: '10px',
                  border: '1px solid #CBD5E1',
                  backgroundColor: '#FFFFFF',
                  fontSize: '0.85rem',
                  fontFamily: 'inherit',
                  color: '#0F1E36',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
                required
              />
            </div>

            {/* Expected Return Time */}
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', color: '#475569', marginBottom: '4px' }}>
                Return Time <span style={{ color: '#EF4444' }}>*</span>
              </label>
              <input
                type="time"
                value={returnTime}
                onChange={(e) => setReturnTime(e.target.value)}
                style={{
                  width: '100%',
                  height: '42px',
                  padding: '0 10px',
                  borderRadius: '10px',
                  border: '1px solid #CBD5E1',
                  backgroundColor: '#FFFFFF',
                  fontSize: '0.85rem',
                  fontFamily: 'inherit',
                  color: '#0F1E36',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
                required
              />
            </div>
          </div>

          {/* Purpose of Borrowing */}
          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', color: '#475569', marginBottom: '4px' }}>
              Purpose
            </label>
            <input
              type="text"
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              placeholder="e.g. PE Class, Tournament, Practice"
              style={{
                width: '100%',
                height: '40px',
                padding: '0 12px',
                borderRadius: '10px',
                border: '1px solid #CBD5E1',
                backgroundColor: '#FFFFFF',
                fontSize: '0.85rem',
                fontFamily: 'inherit',
                color: '#0F1E36',
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
          </div>

          {/* Return Policy Notice Box */}
          <div
            style={{
              backgroundColor: '#EFF6FF',
              border: '1px solid #BFDBFE',
              borderRadius: '10px',
              padding: '10px 12px',
              display: 'flex',
              gap: '8px',
              alignItems: 'flex-start',
            }}
          >
            <Clock size={16} color="#1D61E7" style={{ marginTop: '2px', flexShrink: 0 }} />
            <p style={{ fontSize: '0.78rem', color: '#1E40AF', margin: 0, lineHeight: '1.4' }}>
              Return due by <strong>{formatReturnBy()}</strong> at {equipment.location}.
            </p>
          </div>
        </div>

        {/* Accountability Checkbox */}
        <label
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            fontSize: '0.825rem',
            color: '#475569',
            cursor: 'pointer',
          }}
        >
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
          disabled={!agreed || submitting}
          onClick={handleConfirm}
          style={{
            width: '100%',
            minHeight: '58px',
            height: '58px',
            padding: '0 24px',
            backgroundColor: agreed && !submitting ? '#1D61E7' : '#94A3B8',
            color: '#FFFFFF',
            border: 'none',
            borderRadius: '16px',
            fontSize: '1.05rem',
            fontWeight: '800',
            cursor: agreed && !submitting ? 'pointer' : 'not-allowed',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            boxShadow: agreed ? '0 6px 18px rgba(29, 97, 231, 0.35)' : 'none',
            fontFamily: 'inherit',
            transition: 'all 0.15s ease',
            touchAction: 'manipulation',
            WebkitTapHighlightColor: 'transparent',
          }}
        >
          <Check size={22} strokeWidth={2.8} />
          {submitting ? 'Submitting Request...' : 'Confirm Borrowing'}
        </button>
      </div>
    </div>
  );
}
