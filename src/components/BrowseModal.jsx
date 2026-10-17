import React, { useState } from 'react';
import { X, Search, Filter, QrCode } from 'lucide-react';

export default function BrowseModal({ equipmentList = [], onClose, onSelectEquipment }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'PE & Sports'];

  const filteredItems = equipmentList.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

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
          height: '92%',
          borderTopLeftRadius: '24px',
          borderTopRightRadius: '24px',
          padding: '24px 20px 20px 20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          boxShadow: '0 -10px 30px rgba(0,0,0,0.2)',
          overscrollBehavior: 'contain',
          touchAction: 'auto',
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#0F1E36' }}>
              Browse Equipment
            </h3>
            <span style={{ fontSize: '0.8rem', color: '#64748B' }}>
              Select an item to view details or borrow
            </span>
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

        {/* Search Input */}
        <div style={{ position: 'relative', width: '100%' }}>
          <div style={{
            position: 'absolute',
            left: '14px',
            top: '50%',
            transform: 'translateY(-50%)',
            color: '#94A3B8'
          }}>
            <Search size={18} />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search equipment name or ID..."
            style={{
              width: '100%',
              height: '46px',
              paddingLeft: '42px',
              paddingRight: '14px',
              borderRadius: '12px',
              border: '1px solid #E2E8F0',
              outline: 'none',
              fontSize: '0.9rem',
              color: '#0F1E36',
              fontFamily: 'inherit',
              backgroundColor: '#F8FAFC'
            }}
          />
        </div>

        {/* Category Pills */}
        <div 
          className="hover-scroll-container"
          onWheel={(e) => {
            if (e.deltaY !== 0) {
              e.currentTarget.scrollLeft += e.deltaY * 0.7;
            }
          }}
        >
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              style={{
                padding: '6px 14px',
                borderRadius: '9999px',
                border: 'none',
                backgroundColor: selectedCategory === cat ? '#1D61E7' : '#F1F5F9',
                color: selectedCategory === cat ? '#FFFFFF' : '#64748B',
                fontSize: '0.8rem',
                fontWeight: '700',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.2s ease',
                fontFamily: 'inherit'
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Equipment List Container */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          paddingRight: '2px'
        }}>
          {filteredItems.length === 0 ? (
            <p style={{ textAlign: 'center', color: '#94A3B8', marginTop: '40px', fontSize: '0.9rem' }}>
              No equipment found matching your search.
            </p>
          ) : (
            filteredItems.map((item) => (
              <div
                key={item.id}
                onClick={() => onSelectEquipment(item)}
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '14px',
                  border: '1px solid #E2E8F0',
                  padding: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  cursor: 'pointer',
                  transition: 'transform 0.15s ease, box-shadow 0.15s ease'
                }}
              >
                <img
                  src={item.image}
                  alt={item.name}
                  style={{
                    width: '60px',
                    height: '60px',
                    borderRadius: '10px',
                    objectFit: 'cover'
                  }}
                />
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{
                      fontSize: '0.7rem',
                      fontWeight: '700',
                      color: '#1D61E7',
                      backgroundColor: '#EEF4FF',
                      padding: '2px 6px',
                      borderRadius: '4px'
                    }}>
                      {item.id}
                    </span>
                    <span style={{ fontSize: '0.725rem', color: '#64748B' }}>{item.category}</span>
                  </div>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: '700', color: '#0F1E36', marginTop: '3px' }}>
                    {item.name}
                  </h4>
                  <span style={{ fontSize: '0.75rem', color: '#15803D', fontWeight: '600' }}>
                    {item.available} units available
                  </span>
                </div>
                <button
                  type="button"
                  style={{
                    backgroundColor: '#EEF4FF',
                    color: '#1D61E7',
                    border: 'none',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    fontWeight: '700',
                    fontSize: '0.8rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontFamily: 'inherit'
                  }}
                >
                  <QrCode size={14} />
                  Borrow
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
