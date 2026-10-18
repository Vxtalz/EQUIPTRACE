import React, { useState, useMemo } from 'react';
import { X, Search, QrCode } from 'lucide-react';
import { SPORTS_CATEGORIES, CATEGORY_IMAGES, INITIAL_EQUIPMENT_LIST, normalizeEquipmentCategory } from '../data/mockData';

export default function BrowseModal({ equipmentList = [], onClose, onSelectEquipment }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Merge equipmentList with INITIAL_EQUIPMENT_LIST so all sports equipment is always fully populated
  const normalizedItems = useMemo(() => {
    const map = new Map();
    // 1. Start with initial catalog containing all sports
    INITIAL_EQUIPMENT_LIST.forEach((item) => {
      const key = (item.id || item.code || '').replace('#', '').trim().toUpperCase();
      map.set(key, { ...item });
    });
    // 2. Overlay live equipment from Firestore/state
    equipmentList.forEach((item) => {
      const key = (item.id || item.code || item.firestoreId || '').replace('#', '').trim().toUpperCase();
      const base = map.get(key) || {};
      map.set(key, { ...base, ...item });
    });

    return Array.from(map.values()).map((item) => {
      const category = normalizeEquipmentCategory(item);
      const isLegacyUnsplash = typeof item.image === 'string' && item.image.includes('images.unsplash.com');
      return {
        ...item,
        category,
        available: item.available !== undefined ? item.available : (item.status === 'Available' ? 5 : 0),
        image: (!item.image || isLegacyUnsplash) ? (CATEGORY_IMAGES[category] || item.image || '') : (CATEGORY_IMAGES[category] || item.image || ''),
      };
    });
  }, [equipmentList]);

  // Exclude 'PE & Sports', 'Electronics', and 'Laboratory'
  const categories = useMemo(() => {
    const fromList = normalizedItems
      .map((e) => e.category)
      .filter((cat) => Boolean(cat) && cat !== 'PE & Sports' && cat !== 'Electronics' && cat !== 'Laboratory');
    const set = new Set([...SPORTS_CATEGORIES, ...fromList]);
    return ['All', ...Array.from(set)];
  }, [normalizedItems]);

  const filteredItems = normalizedItems.filter((item) => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      item.name?.toLowerCase().includes(q) ||
      item.id?.toLowerCase().includes(q) ||
      (item.code && item.code.toLowerCase().includes(q)) ||
      item.category?.toLowerCase().includes(q);

    const matchesCategory =
      selectedCategory === 'All' ||
      item.category?.toLowerCase().trim() === selectedCategory.toLowerCase().trim();

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
          gap: '14px',
          boxShadow: '0 -10px 30px rgba(0,0,0,0.2)',
          overscrollBehavior: 'contain',
          touchAction: 'auto',
          boxSizing: 'border-box',
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#0F1E36', margin: 0 }}>
              Browse Equipment
            </h3>
            <span style={{ fontSize: '0.8rem', color: '#64748B', display: 'block', marginTop: '2px' }}>
              Select an item to view details or borrow ({filteredItems.length} available)
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
            placeholder="Search sports gear, category, or ID code..."
            style={{
              width: '100%',
              height: '46px',
              paddingLeft: '42px',
              paddingRight: '14px',
              borderRadius: '12px',
              border: '1px solid #CBD5E1',
              outline: 'none',
              fontSize: '0.9rem',
              color: '#0F1E36',
              fontFamily: 'inherit',
              backgroundColor: '#F8FAFC',
              boxSizing: 'border-box',
            }}
          />
        </div>

        {/* Category Pills with horizontal scroll */}
        <div 
          className="hover-scroll-container"
          style={{ minHeight: '40px', flexShrink: 0, paddingBottom: '4px' }}
          onWheel={(e) => {
            if (e.deltaY !== 0) {
              e.currentTarget.scrollLeft += e.deltaY * 0.7;
            }
          }}
        >
          {categories.map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                style={{
                  padding: '7px 16px',
                  borderRadius: '9999px',
                  border: isActive ? 'none' : '1px solid #E2E8F0',
                  backgroundColor: isActive ? '#1D61E7' : '#FFFFFF',
                  color: isActive ? '#FFFFFF' : '#475569',
                  fontSize: '0.8rem',
                  fontWeight: '700',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.15s ease',
                  fontFamily: 'inherit',
                  boxShadow: isActive ? '0 2px 8px rgba(29, 97, 231, 0.25)' : 'none',
                }}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Equipment List Container */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          paddingRight: '2px',
          boxSizing: 'border-box',
        }}>
          {filteredItems.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 16px', color: '#94A3B8' }}>
              <p style={{ fontSize: '1rem', fontWeight: '700', color: '#64748B', margin: '0 0 6px 0' }}>
                No equipment found
              </p>
              <p style={{ fontSize: '0.85rem', margin: 0 }}>
                No items match "{searchQuery || selectedCategory}". Try selecting another category!
              </p>
            </div>
          ) : (
            filteredItems.map((item) => {
              const isLegacyUnsplash = typeof item.image === 'string' && item.image.includes('images.unsplash.com');
              const imageSrc = (!item.image || isLegacyUnsplash)
                ? (CATEGORY_IMAGES[item.category] || item.image || CATEGORY_IMAGES['Basketball'])
                : (CATEGORY_IMAGES[item.category] || item.image || CATEGORY_IMAGES['Basketball']);
              const availableUnits = item.available !== undefined
                ? item.available
                : (item.status === 'Available' ? 5 : 0);
              const isAvailable = availableUnits > 0 && item.status !== 'Maintenance';

              return (
                <div
                  key={item.id || item.firestoreId}
                  onClick={() => onSelectEquipment(item)}
                  style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '16px',
                    border: '1px solid #E2E8F0',
                    padding: '12px 14px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '14px',
                    cursor: 'pointer',
                    transition: 'transform 0.15s ease, box-shadow 0.15s ease',
                    boxShadow: '0 2px 6px rgba(15, 30, 54, 0.03)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-1px)';
                    e.currentTarget.style.boxShadow = '0 6px 16px rgba(15, 30, 54, 0.06)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'none';
                    e.currentTarget.style.boxShadow = '0 2px 6px rgba(15, 30, 54, 0.03)';
                  }}
                >
                  <img
                    src={imageSrc}
                    alt={item.name}
                    style={{
                      width: '64px',
                      height: '64px',
                      borderRadius: '14px',
                      objectFit: 'contain',
                      backgroundColor: '#F8FAFC',
                      padding: '4px',
                      border: '1px solid #E2E8F0',
                      flexShrink: 0,
                    }}
                    onError={(e) => {
                      e.currentTarget.src = CATEGORY_IMAGES[item.category] || CATEGORY_IMAGES['Basketball'];
                    }}
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{
                        fontSize: '0.7rem',
                        fontWeight: '800',
                        color: '#1D61E7',
                        backgroundColor: '#EEF4FF',
                        padding: '2px 7px',
                        borderRadius: '6px'
                      }}>
                        {item.code || item.id}
                      </span>
                      <span style={{
                        fontSize: '0.72rem',
                        color: '#64748B',
                        fontWeight: '600',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}>
                        {item.category}
                      </span>
                    </div>
                    <h4 style={{
                      fontSize: '0.95rem',
                      fontWeight: '800',
                      color: '#0F1E36',
                      margin: '4px 0 3px 0',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}>
                      {item.name}
                    </h4>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{
                        fontSize: '0.75rem',
                        color: isAvailable ? '#15803D' : '#DC2626',
                        fontWeight: '700',
                      }}>
                        {isAvailable ? `${availableUnits} units available` : 'Currently Borrowed'}
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (isAvailable) onSelectEquipment(item);
                    }}
                    style={{
                      backgroundColor: isAvailable ? '#EEF4FF' : '#F1F5F9',
                      color: isAvailable ? '#1D61E7' : '#94A3B8',
                      border: 'none',
                      padding: '8px 14px',
                      borderRadius: '10px',
                      fontWeight: '700',
                      fontSize: '0.8rem',
                      cursor: isAvailable ? 'pointer' : 'default',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      fontFamily: 'inherit',
                      flexShrink: 0,
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <QrCode size={14} />
                    Borrow
                  </button>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
