import React, { useState } from 'react';
import { Menu, Bell, Search, Plus } from 'lucide-react';

export default function AdminEquipment({
  equipmentList = [],
  onOpenAddModal
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
      padding: '16px 20px 24px 20px',
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
            Equipment
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

      {/* Filter Tabs matching Screenshot 4 */}
      <div style={{
        display: 'flex',
        gap: '8px',
        overflowX: 'auto',
        paddingBottom: '2px'
      }}>
        {['All', 'Available', 'Borrowed', 'Overdue'].map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setFilter(tab)}
            style={{
              padding: '8px 18px',
              borderRadius: '9999px',
              border: 'none',
              backgroundColor: filter === tab ? '#1D61E7' : '#FFFFFF',
              color: filter === tab ? '#FFFFFF' : '#64748B',
              border: filter === tab ? 'none' : '1px solid #E2E8F0',
              fontWeight: '700',
              fontSize: '0.85rem',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              fontFamily: 'inherit',
              whiteSpace: 'nowrap'
            }}
          >
            {tab}
          </button>
        ))}
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
          height: '48px',
          backgroundColor: '#1D61E7',
          color: '#FFFFFF',
          border: 'none',
          borderRadius: '14px',
          fontSize: '0.95rem',
          fontWeight: '700',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '6px',
          boxShadow: '0 4px 12px rgba(29, 97, 231, 0.25)',
          fontFamily: 'inherit'
        }}
      >
        <Plus size={20} strokeWidth={2.5} />
        + Add equipment
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
    </div>
  );
}
