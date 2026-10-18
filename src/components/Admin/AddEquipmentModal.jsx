import React, { useState } from 'react';
import { X, Package } from 'lucide-react';
import { CATEGORY_IMAGES, SPORTS_CATEGORIES } from '../../data/mockData';

const DEFAULT_CATEGORY_ICONS = {
  'Basketball': '🏀',
  'Volleyball': '🏐',
  'Tennis': '🎾',
  'Table Tennis': '🏓',
  'Track and Field': '🏃',
  'Football': '⚽',
  'Sepak Takraw': '🏐',
  'Beach Volleyball': '🏐',
  'Billiards': '🎱',
  'Badminton': '🏸',
  'Futsal': '⚽',
};

export default function AddEquipmentModal({ onClose, onAddEquipment }) {
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [category, setCategory] = useState('Basketball');
  const [location, setLocation] = useState('PE Storage Room');
  const [condition, setCondition] = useState('Good');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !code.trim()) return;

    const formattedCode = code.startsWith('#') ? code.trim() : `#${code.trim()}`;
    const cleanId = code.replace('#', '').trim();

    onAddEquipment({
      id: cleanId,
      name: name.trim(),
      code: formattedCode,
      category,
      location: location.trim() || 'PE Storage Room',
      condition,
      status: 'Available',
      available: 5,
      total: 5,
      image: CATEGORY_IMAGES[category] || '',
      icon: DEFAULT_CATEGORY_ICONS[category] || '📦',
      description: `${condition} condition ${category} gear stored at ${location.trim() || 'PE Storage Room'}.`,
    });

    onClose();
  };

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget && onClose) onClose();
      }}
      style={{
        position: 'absolute',
        inset: 0,
        backgroundColor: 'rgba(15, 30, 54, 0.65)',
        zIndex: 100,
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
        backdropFilter: 'blur(4px)',
        animation: 'fadeIn 0.2s ease',
        overscrollBehavior: 'contain',
        touchAction: 'none',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: '#FFFFFF',
          width: '100%',
          maxHeight: '90%',
          borderTopLeftRadius: '24px',
          borderTopRightRadius: '24px',
          padding: '24px 20px 28px 20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          boxShadow: '0 -10px 30px rgba(0,0,0,0.2)',
          overflowY: 'auto',
          overscrollBehavior: 'contain',
          touchAction: 'auto',
          boxSizing: 'border-box',
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Package size={22} color="#1D61E7" />
            <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#0F1E36', margin: 0 }}>
              Add New Equipment
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

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: '700', color: '#475569', marginBottom: '4px', display: 'block' }}>
              Item Name <span style={{ color: '#EF4444' }}>*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Badminton Racket Set"
              required
              style={{
                width: '100%',
                height: '44px',
                padding: '0 14px',
                borderRadius: '10px',
                border: '1px solid #CBD5E1',
                fontSize: '0.9rem',
                outline: 'none',
                fontFamily: 'inherit',
                boxSizing: 'border-box',
              }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: '700', color: '#475569', marginBottom: '4px', display: 'block' }}>
                Equipment ID Code <span style={{ color: '#EF4444' }}>*</span>
              </label>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="e.g. #PE-030"
                required
                style={{
                  width: '100%',
                  height: '44px',
                  padding: '0 14px',
                  borderRadius: '10px',
                  border: '1px solid #CBD5E1',
                  fontSize: '0.9rem',
                  outline: 'none',
                  fontFamily: 'inherit',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: '700', color: '#475569', marginBottom: '4px', display: 'block' }}>
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                style={{
                  width: '100%',
                  height: '44px',
                  padding: '0 10px',
                  borderRadius: '10px',
                  border: '1px solid #CBD5E1',
                  fontSize: '0.85rem',
                  outline: 'none',
                  fontFamily: 'inherit',
                  backgroundColor: '#FFFFFF',
                  color: '#0F1E36',
                  boxSizing: 'border-box',
                }}
              >
                {SPORTS_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: '700', color: '#475569', marginBottom: '4px', display: 'block' }}>
                Storage Location
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. PE Storage Room"
                style={{
                  width: '100%',
                  height: '44px',
                  padding: '0 14px',
                  borderRadius: '10px',
                  border: '1px solid #CBD5E1',
                  fontSize: '0.85rem',
                  outline: 'none',
                  fontFamily: 'inherit',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: '700', color: '#475569', marginBottom: '4px', display: 'block' }}>
                Condition
              </label>
              <select
                value={condition}
                onChange={(e) => setCondition(e.target.value)}
                style={{
                  width: '100%',
                  height: '44px',
                  padding: '0 10px',
                  borderRadius: '10px',
                  border: '1px solid #CBD5E1',
                  fontSize: '0.85rem',
                  outline: 'none',
                  fontFamily: 'inherit',
                  backgroundColor: '#FFFFFF',
                  color: '#0F1E36',
                  boxSizing: 'border-box',
                }}
              >
                <option value="Good">Good</option>
                <option value="Excellent">Excellent</option>
                <option value="Fair">Fair</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            style={{
              width: '100%',
              height: '48px',
              backgroundColor: '#1D61E7',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '12px',
              fontSize: '0.95rem',
              fontWeight: '700',
              cursor: 'pointer',
              marginTop: '6px',
              boxShadow: '0 4px 12px rgba(29, 97, 231, 0.25)',
              fontFamily: 'inherit'
            }}
          >
            Save Equipment
          </button>
        </form>
      </div>
    </div>
  );
}
