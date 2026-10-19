import React, { useState } from 'react';
import {
  Bell,
  Search,
  Plus,
  Settings,
  X,
  SlidersHorizontal,
  RotateCcw
} from 'lucide-react';
import equiptraceLogo from '../../assets/equiptrace-logo.png';
import { CATEGORY_IMAGES, getSportImage } from '../../data/mockData';

export default function AdminEquipment({
  equipmentList = [],
  onOpenAddModal,
  onOpenNotifications,
  onOpenSettings,
  unreadCount = 0,
}) {
  const [filter, setFilter] = useState('All'); // 'All' | 'Available' | 'Borrowed' | 'Overdue'
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilterModal, setShowFilterModal] = useState(false);

  const filteredItems = equipmentList.filter((item) => {
    const matchesFilter = filter === 'All' || item.status === filter;
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      (item.name || '').toLowerCase().includes(q) ||
      (item.code || '').toLowerCase().includes(q) ||
      (item.id || '').toLowerCase().includes(q) ||
      (item.category || '').toLowerCase().includes(q);
    return matchesFilter && matchesSearch;
  });

  const isFilterActive = filter !== 'All';

  const handleResetFilters = () => {
    setFilter('All');
    setSearchQuery('');
    setShowFilterModal(false);
  };

  return (
    <div className="admin-equipment animate-fade-in" style={{
      display: 'flex',
      flexDirection: 'column',
      padding: '16px 20px 108px 20px',
      backgroundColor: '#F8FAFC',
      minHeight: '100%',
      gap: '16px'
    }}>
      {/* Top Header Bar */}
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
            Equipment
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

      {/* ── Search Bar & Filter Button Control ── */}
      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
        {/* Search Input */}
        <div style={{
          position: 'relative',
          flex: 1,
          display: 'flex',
          alignItems: 'center'
        }}>
          <Search
            size={16}
            color="#64748B"
            style={{ position: 'absolute', left: '12px', pointerEvents: 'none' }}
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by ID, name, or sport..."
            style={{
              width: '100%',
              height: '42px',
              padding: '0 34px 0 36px',
              borderRadius: '12px',
              border: '1px solid #E2E8F0',
              backgroundColor: '#FFFFFF',
              fontSize: '0.825rem',
              color: '#0F1E36',
              outline: 'none',
              fontFamily: 'inherit',
              boxShadow: '0 2px 6px rgba(15, 23, 42, 0.03)',
              transition: 'border-color 0.15s ease'
            }}
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              aria-label="Clear search"
              style={{
                position: 'absolute',
                right: '10px',
                background: '#E2E8F0',
                border: 'none',
                borderRadius: '50%',
                width: '20px',
                height: '20px',
                color: '#475569',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 0
              }}
            >
              <X size={12} strokeWidth={2.5} />
            </button>
          )}
        </div>

        {/* Filter Button */}
        <button
          type="button"
          onClick={() => setShowFilterModal(true)}
          style={{
            height: '42px',
            padding: '0 14px',
            borderRadius: '12px',
            border: isFilterActive ? '1.5px solid #1D61E7' : '1px solid #E2E8F0',
            backgroundColor: isFilterActive ? '#EEF4FF' : '#FFFFFF',
            color: isFilterActive ? '#1D61E7' : '#0F1E36',
            fontWeight: '700',
            fontSize: '0.825rem',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            cursor: 'pointer',
            flexShrink: 0,
            boxShadow: '0 2px 6px rgba(15, 23, 42, 0.03)',
            transition: 'all 0.15s ease'
          }}
        >
          <SlidersHorizontal size={16} strokeWidth={2.2} />
          <span>Filter</span>
          {isFilterActive && (
            <span style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              backgroundColor: '#1D61E7'
            }} />
          )}
        </button>
      </div>

      {/* ── Active Filters Summary Bar ── */}
      {(isFilterActive || searchQuery) && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '8px 12px',
          backgroundColor: '#F1F5F9',
          borderRadius: '12px',
          fontSize: '0.75rem',
          border: '1px solid #E2E8F0'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
            <span style={{ color: '#64748B', fontWeight: '500' }}>Active:</span>
            {filter !== 'All' && (
              <span style={{
                backgroundColor: '#FFFFFF',
                padding: '2px 8px',
                borderRadius: '6px',
                fontWeight: '700',
                color: '#1D61E7',
                border: '1px solid #CBD5E1'
              }}>
                {filter}
              </span>
            )}
            {searchQuery && (
              <span style={{
                backgroundColor: '#FFFFFF',
                padding: '2px 8px',
                borderRadius: '6px',
                fontWeight: '700',
                color: '#0F1E36',
                border: '1px solid #CBD5E1'
              }}>
                "{searchQuery}"
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={handleResetFilters}
            style={{
              background: 'none',
              border: 'none',
              color: '#DC2626',
              fontWeight: '700',
              cursor: 'pointer',
              fontSize: '0.75rem',
              padding: '2px 4px',
              display: 'flex',
              alignItems: 'center',
              gap: '3px'
            }}
          >
            <RotateCcw size={11} />
            <span>Reset</span>
          </button>
        </div>
      )}

      {/* Primary Add Equipment Button */}
      <button
        type="button"
        onClick={onOpenAddModal}
        style={{
          width: '100%',
          height: '46px',
          backgroundColor: '#1D61E7',
          color: '#FFFFFF',
          border: 'none',
          borderRadius: '9999px',
          fontSize: '0.95rem',
          fontWeight: '700',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          boxShadow: '0 4px 14px rgba(29, 97, 231, 0.3)',
          fontFamily: 'inherit',
          transition: 'all 0.2s ease',
          flexShrink: 0
        }}
      >
        <Plus size={20} strokeWidth={2.6} />
        Add equipment
      </button>

      {/* Equipment List Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginTop: '4px' }}>
        {filteredItems.length === 0 ? (
          <div style={{
            padding: '36px 16px',
            textAlign: 'center',
            backgroundColor: '#FFFFFF',
            borderRadius: '18px',
            border: '1px dashed #CBD5E1',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '8px'
          }}>
            <Search size={26} color="#94A3B8" />
            <p style={{ fontSize: '0.9rem', fontWeight: '800', color: '#0F1E36', margin: 0 }}>
              No matching equipment found.
            </p>
            <p style={{ fontSize: '0.78rem', color: '#64748B', margin: 0 }}>
              Try adjusting your search query or filter selection.
            </p>
            {(searchQuery || isFilterActive) && (
              <button
                type="button"
                onClick={handleResetFilters}
                style={{
                  marginTop: '6px',
                  padding: '7px 16px',
                  backgroundColor: '#EEF4FF',
                  color: '#1D61E7',
                  border: '1px solid #BFDBFE',
                  borderRadius: '9999px',
                  fontSize: '0.8rem',
                  fontWeight: '700',
                  cursor: 'pointer'
                }}
              >
                Clear filter & search
              </button>
            )}
          </div>
        ) : (
          filteredItems.map((item) => (
            <div
              key={item.id}
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '18px',
                padding: '16px',
                border: '1px solid #E2E8F0',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                boxShadow: '0 2px 6px rgba(13, 26, 48, 0.02)'
              }}
            >
              {/* Header Title + Sport Image */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '12px',
                  backgroundColor: '#F1F5F9',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden',
                  flexShrink: 0,
                }}>
                  <img
                    src={getSportImage(item)}
                    alt={item.name}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'contain',
                      backgroundColor: '#F8FAFC',
                      padding: '2px',
                    }}
                    onError={(e) => {
                      e.currentTarget.src = getSportImage(item);
                    }}
                  />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <h4 style={{ fontSize: '1rem', fontWeight: '800', color: '#0F1E36', margin: 0 }}>
                    {item.name}
                  </h4>
                  <span style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: '500', marginTop: '2px' }}>
                    {item.code || item.id}
                  </span>
                </div>
              </div>

              {/* Info Grid 2x2 */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '10px',
                fontSize: '0.825rem'
              }}>
                <div>
                  <span style={{ color: '#94A3B8', display: 'block' }}>Location</span>
                  <span style={{ color: '#0F1E36', fontWeight: '600', display: 'block', marginTop: '2px' }}>
                    {item.location || 'Storage Room'}
                  </span>
                </div>
                <div>
                  <span style={{ color: '#94A3B8', display: 'block' }}>Condition</span>
                  <span style={{ color: '#0F1E36', fontWeight: '600', display: 'block', marginTop: '2px' }}>
                    {item.condition || 'Good'}
                  </span>
                </div>
                <div>
                  <span style={{ color: '#94A3B8', display: 'block' }}>Available / Total</span>
                  <span style={{ color: '#0F1E36', fontWeight: '800', display: 'block', marginTop: '2px' }}>
                    {item.available} / {item.total}
                  </span>
                </div>
                <div>
                  <span style={{ color: '#94A3B8', display: 'block' }}>Status</span>
                  {item.status === 'Available' && (
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
                      Available
                    </span>
                  )}
                  {item.status === 'Overdue' && (
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
                      Overdue
                    </span>
                  )}
                  {item.status === 'Borrowed' && (
                    <span style={{
                      fontSize: '0.725rem',
                      fontWeight: '700',
                      color: '#1D61E7',
                      backgroundColor: '#EEF4FF',
                      padding: '2px 8px',
                      borderRadius: '9999px',
                      display: 'inline-block',
                      marginTop: '2px'
                    }}>
                      Borrowed
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* ── Filter Bottom Sheet / Modal (Contains All, Available, Borrowed, Overdue) ── */}
      {showFilterModal && (
        <div
          onClick={() => setShowFilterModal(false)}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.65)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'center',
            backdropFilter: 'blur(3px)',
            animation: 'fadeIn 0.2s ease'
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '100%',
              maxWidth: '480px',
              backgroundColor: '#FFFFFF',
              borderTopLeftRadius: '24px',
              borderTopRightRadius: '24px',
              padding: '20px 22px 28px 22px',
              display: 'flex',
              flexDirection: 'column',
              gap: '18px',
              boxShadow: '0 -10px 40px rgba(0,0,0,0.25)',
              maxHeight: '85vh',
              overflowY: 'auto'
            }}
          >
            {/* Modal Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h4 style={{ fontSize: '1.05rem', fontWeight: '800', color: '#0F1E36', margin: 0 }}>
                  Filter Equipment
                </h4>
                <p style={{ fontSize: '0.78rem', color: '#64748B', margin: '2px 0 0 0' }}>
                  Filter equipment inventory by availability status
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowFilterModal(false)}
                style={{
                  background: '#F1F5F9',
                  border: 'none',
                  borderRadius: '50%',
                  width: '32px',
                  height: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: '#64748B'
                }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Filter Section: Equipment Status (All, Available, Borrowed, Overdue) */}
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: '700', color: '#0F1E36', display: 'block', marginBottom: '8px' }}>
                Equipment Status
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                {['All', 'Available', 'Borrowed', 'Overdue'].map((opt) => {
                  const isSel = filter === opt;
                  return (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setFilter(opt)}
                      style={{
                        padding: '12px 14px',
                        borderRadius: '12px',
                        border: isSel ? '2px solid #1D61E7' : '1px solid #E2E8F0',
                        backgroundColor: isSel ? '#EEF4FF' : '#FFFFFF',
                        color: isSel ? '#1D61E7' : '#0F1E36',
                        fontWeight: isSel ? '800' : '600',
                        fontSize: '0.85rem',
                        cursor: 'pointer',
                        textAlign: 'center'
                      }}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Modal Actions */}
            <div style={{ display: 'flex', gap: '10px', marginTop: '6px' }}>
              <button
                type="button"
                onClick={handleResetFilters}
                style={{
                  flex: 1,
                  padding: '12px 16px',
                  borderRadius: '12px',
                  border: '1px solid #E2E8F0',
                  backgroundColor: '#FFFFFF',
                  color: '#64748B',
                  fontWeight: '700',
                  fontSize: '0.85rem',
                  cursor: 'pointer'
                }}
              >
                Reset All
              </button>
              <button
                type="button"
                onClick={() => setShowFilterModal(false)}
                style={{
                  flex: 1.5,
                  padding: '12px 16px',
                  borderRadius: '12px',
                  border: 'none',
                  backgroundColor: '#1D61E7',
                  color: '#FFFFFF',
                  fontWeight: '700',
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(29, 97, 231, 0.35)'
                }}
              >
                Apply Filters ({filteredItems.length})
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Clearance spacer for floating bottom navigation bar */}
      <div style={{ height: '96px', flexShrink: 0, minHeight: '96px' }} />
    </div>
  );
}
