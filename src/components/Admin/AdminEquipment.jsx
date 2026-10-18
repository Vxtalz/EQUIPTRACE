import React, { useState } from 'react';
import { Bell, Search, Plus, Settings } from 'lucide-react';
import equiptraceLogo from '../../assets/equiptrace-logo.png';

export default function AdminEquipment({
  equipmentList = [],
  onOpenAddModal,
  onOpenNotifications,
  onOpenSettings,
  unreadCount = 0,
}) {
  const [filter, setFilter] = useState('All'); // 'All' | 'Available' | 'Borrowed' | 'Overdue'
  const [searchQuery, setSearchQuery] = useState('');

  const filteredItems = equipmentList.filter((item) => {
    const matchesFilter = filter === 'All' || item.status === filter;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="admin-equipment animate-fade-in" style={{
      display: 'flex',
      flexDirection: 'column',
      padding: '16px 20px 108px 20px',
      backgroundColor: '#F8FAFC',
      minHeight: '100%',
      gap: '16px'
    }}>
      {/* Top Header Bar matching Screenshot 4 */}
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

      {/* Filter Tabs matching Screenshot 4 */}
      <div 
        className="hover-scroll-container"
        style={{ minHeight: '48px', flexShrink: 0 }}
        onWheel={(e) => {
          if (e.deltaY !== 0) {
            e.currentTarget.scrollLeft += e.deltaY * 0.7;
          }
        }}
      >
        {['All', 'Available', 'Borrowed', 'Overdue'].map((tab) => {
          const isActive = filter === tab;
          return (
            <button
              key={tab}
              type="button"
              onClick={() => setFilter(tab)}
              className={`filter-pill-btn ${isActive ? 'active' : 'inactive'}`}
              style={{ padding: '8px 18px', fontSize: '0.85rem' }}
            >
              {tab}
            </button>
          );
        })}
      </div>

      {/* Search Bar matching Screenshot 4 */}
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
          placeholder="Search by ID or name"
          style={{
            width: '100%',
            height: '48px',
            paddingLeft: '44px',
            paddingRight: '16px',
            borderRadius: '14px',
            border: '1px solid #E2E8F0',
            backgroundColor: '#FFFFFF',
            fontSize: '0.9rem',
            color: '#0F1E36',
            outline: 'none',
            fontFamily: 'inherit'
          }}
        />
      </div>

      {/* Primary Add Equipment Button matching Screenshot 4 */}
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

      {/* Equipment List Cards matching Image 4 */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginTop: '4px' }}>
        {filteredItems.map((item) => (
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
            {/* Header Title + Emoji Container */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '44px',
                height: '44px',
                borderRadius: '12px',
                backgroundColor: '#F1F5F9',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.4rem'
              }}>
                {item.icon || '📦'}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <h4 style={{ fontSize: '1rem', fontWeight: '800', color: '#0F1E36' }}>
                  {item.name}
                </h4>
                <span style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: '500' }}>
                  {item.code}
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
                <span style={{ color: '#94A3B8', display: 'block' }}>Category</span>
                <span style={{ color: '#0F1E36', fontWeight: '600' }}>{item.category}</span>
              </div>
              <div>
                <span style={{ color: '#94A3B8', display: 'block' }}>Location</span>
                <span style={{ color: '#0F1E36', fontWeight: '600' }}>{item.location}</span>
              </div>
              <div>
                <span style={{ color: '#94A3B8', display: 'block' }}>Condition</span>
                <span style={{ color: '#0F1E36', fontWeight: '600' }}>{item.condition}</span>
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
        ))}
      </div>

      {/* Clearance spacer for floating bottom navigation bar */}
      <div style={{ height: '96px', flexShrink: 0, minHeight: '96px' }} />
    </div>
  );
}
