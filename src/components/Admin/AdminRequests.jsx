import React, { useState, useMemo } from 'react';
import {
  Bell,
  Settings,
  Search,
  X,
  SlidersHorizontal,
  RotateCcw
} from 'lucide-react';
import equiptraceLogo from '../../assets/equiptrace-logo.png';

export default function AdminRequests({
  requests = [],
  onApproveRequest,
  onRejectRequest,
  onOpenNotifications,
  onOpenSettings,
  unreadCount = 0,
}) {
  // ── Search & Filter State ──────────────────────────────────────────────────
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All'); // 'All' | 'Borrowed' | 'Returned' | 'Overdue' | 'Pending'
  const [dateFilter, setDateFilter] = useState('All Time'); // 'All Time' | 'Today' | 'Last 7 Days' | 'Last 30 Days'
  const [showFilterModal, setShowFilterModal] = useState(false);

  // Parse request date for chronological sorting and date filtering
  const parseReqDate = (req) => {
    if (!req) return new Date(0);
    if (req.createdAt) {
      if (typeof req.createdAt.toDate === 'function') return req.createdAt.toDate();
      if (req.createdAt.seconds) return new Date(req.createdAt.seconds * 1000);
      const d = new Date(req.createdAt);
      if (!isNaN(d.getTime())) return d;
    }
    if (req.requestedDate) {
      const sanitized = String(req.requestedDate).replace(/·/g, ' ').replace(/\s+/g, ' ').trim();
      const d = new Date(sanitized);
      if (!isNaN(d.getTime())) return d;
    }
    if (req.date) {
      const sanitized = String(req.date).replace(/·/g, ' ').replace(/\s+/g, ' ').trim();
      const d = new Date(sanitized);
      if (!isNaN(d.getTime())) return d;
    }
    if (typeof req.id === 'string' && req.id.startsWith('REQ-')) {
      const num = parseInt(req.id.replace('REQ-', ''), 10);
      if (!isNaN(num) && num > 1000000000) return new Date(num);
    }
    return new Date(0);
  };

  const isDateInRange = (d, range) => {
    if (range === 'All Time') return true;
    if (!d || isNaN(d.getTime()) || d.getTime() === 0) return true;
    const now = new Date();
    if (range === 'Today') {
      return (
        d.getFullYear() === now.getFullYear() &&
        d.getMonth() === now.getMonth() &&
        d.getDate() === now.getDate()
      );
    }
    if (range === 'Last 7 Days') {
      const past = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7);
      return d >= past;
    }
    if (range === 'Last 30 Days') {
      const past = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 30);
      return d >= past;
    }
    return true;
  };

  const isStatusMatch = (status, filter) => {
    if (filter === 'All') return true;
    const s = (status || '').toLowerCase();
    const f = filter.toLowerCase();
    if (f === 'borrowed') return s === 'borrowed' || s === 'approved';
    if (f === 'returned') return s.includes('returned');
    if (f === 'overdue') return s === 'overdue';
    if (f === 'pending') return s === 'pending';
    return s === f;
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setStatusFilter('All');
    setDateFilter('All Time');
    setShowFilterModal(false);
  };

  const isFilterActive = statusFilter !== 'All' || dateFilter !== 'All Time';

  // 1. Sort requests by newest first
  const sortedRequests = useMemo(() => {
    return [...requests].sort((a, b) => {
      const dateA = parseReqDate(a).getTime();
      const dateB = parseReqDate(b).getTime();
      if (dateB !== dateA) return dateB - dateA;
      return String(b.id || '').localeCompare(String(a.id || ''));
    });
  }, [requests]);

  // 2. Filter requests by Search Query and Filters combined
  const filteredRequests = useMemo(() => {
    return sortedRequests.filter((req) => {
      // Search matching (student name, student ID, equipment name, equipment code)
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const nameMatch = (req.studentName || '').toLowerCase().includes(q);
        const idMatch = (req.studentId || '').toLowerCase().includes(q);
        const equipMatch = (req.equipmentName || '').toLowerCase().includes(q);
        const codeMatch = (req.equipmentCode || req.equipmentId || '').toLowerCase().includes(q);
        if (!nameMatch && !idMatch && !equipMatch && !codeMatch) {
          return false;
        }
      }

      // Status filter matching
      if (!isStatusMatch(req.status, statusFilter)) {
        return false;
      }

      // Date range filter matching
      if (!isDateInRange(parseReqDate(req), dateFilter)) {
        return false;
      }

      return true;
    });
  }, [sortedRequests, searchQuery, statusFilter, dateFilter]);

  // Status badge styling helper
  const renderStatusBadge = (status) => {
    const s = (status || '').toLowerCase();
    let bg = '#EEF4FF';
    let text = '#1D61E7';
    let label = status || 'Borrowed';

    if (s === 'pending') {
      bg = '#FEF3C7';
      text = '#B45309';
      label = 'Pending';
    } else if (s === 'overdue') {
      bg = '#FEE2E2';
      text = '#DC2626';
      label = 'Overdue';
    } else if (s === 'rejected') {
      bg = '#FEE2E2';
      text = '#DC2626';
      label = 'Rejected';
    } else if (s.includes('returned')) {
      bg = '#DCFCE7';
      text = '#15803D';
      label = 'Returned';
    } else if (s === 'approved' || s === 'borrowed') {
      bg = '#EEF4FF';
      text = '#1D61E7';
      label = s === 'approved' ? 'Approved' : 'Borrowed';
    }

    return (
      <span style={{
        fontSize: '0.725rem',
        fontWeight: '700',
        color: text,
        backgroundColor: bg,
        padding: '3px 10px',
        borderRadius: '9999px',
        display: 'inline-block'
      }}>
        {label}
      </span>
    );
  };

  return (
    <div className="admin-requests animate-fade-in" style={{
      display: 'flex',
      flexDirection: 'column',
      padding: '16px 20px 24px 20px',
      backgroundColor: '#F8FAFC',
      minHeight: '100%',
      gap: '16px'
    }}>
      {/* Header Bar */}
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
            Borrowing requests
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

      {/* ── Search Bar & Filter Control (Replaces old Pending/Approved/Rejected buttons) ── */}
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
            placeholder="Search student name or ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
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
            {statusFilter !== 'All' && (
              <span style={{
                backgroundColor: '#FFFFFF',
                padding: '2px 8px',
                borderRadius: '6px',
                fontWeight: '700',
                color: '#1D61E7',
                border: '1px solid #CBD5E1'
              }}>
                {statusFilter}
              </span>
            )}
            {dateFilter !== 'All Time' && (
              <span style={{
                backgroundColor: '#FFFFFF',
                padding: '2px 8px',
                borderRadius: '6px',
                fontWeight: '700',
                color: '#1D61E7',
                border: '1px solid #CBD5E1'
              }}>
                {dateFilter}
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

      {/* ── Requests Cards List ── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {filteredRequests.length === 0 ? (
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
              No matching borrowing requests found.
            </p>
            <p style={{ fontSize: '0.78rem', color: '#64748B', margin: 0 }}>
              Try adjusting your search terms or filter selections.
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
                Clear search & filters
              </button>
            )}
          </div>
        ) : (
          filteredRequests.map((req) => (
            <div
              key={req.id}
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '18px',
                padding: '18px',
                border: '1px solid #E2E8F0',
                display: 'flex',
                flexDirection: 'column',
                gap: '14px',
                boxShadow: '0 2px 8px rgba(13, 26, 48, 0.03)'
              }}
            >
              {/* Top Row: Student Avatar, Name, Student ID & Status Badge */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    backgroundColor: '#1D61E7',
                    color: '#FFFFFF',
                    fontWeight: '800',
                    fontSize: '0.9rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    {req.studentInitials || (req.studentName ? req.studentName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() : 'ST')}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <h4 style={{ fontSize: '1.05rem', fontWeight: '800', color: '#0F1E36', margin: 0 }}>
                      {req.studentName}
                    </h4>
                    {(req.studentId || req.studentCourse || req.studentYear) && (
                      <span style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: '600', marginTop: '2px' }}>
                        {req.studentId ? `ID: ${req.studentId}` : ''}
                        {req.studentId && (req.studentCourse || req.studentYear) ? ' · ' : ''}
                        {[req.studentCourse, req.studentYear].filter(Boolean).join(' ')}
                      </span>
                    )}
                  </div>
                </div>

                {/* Status Badge */}
                <div>
                  {renderStatusBadge(req.status)}
                </div>
              </div>

              {/* Equipment & Details Grid */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '12px',
                fontSize: '0.825rem'
              }}>
                <div>
                  <span style={{ color: '#94A3B8', display: 'block' }}>Equipment</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
                    <span style={{ fontSize: '1.1rem' }}>{req.icon || '📦'}</span>
                    <span style={{ color: '#0F1E36', fontWeight: '800' }}>{req.equipmentName}</span>
                    <span style={{ color: '#64748B', fontWeight: '500' }}>{req.equipmentCode || req.equipmentId || ''}</span>
                  </div>
                </div>

                <div>
                  <span style={{ color: '#94A3B8', display: 'block' }}>Requested</span>
                  <span style={{ color: '#0F1E36', fontWeight: '600', display: 'block', marginTop: '2px' }}>
                    {req.requestedDate || req.date}
                  </span>
                </div>

                <div>
                  <span style={{ color: '#94A3B8', display: 'block' }}>Return by</span>
                  <span style={{ color: '#0F1E36', fontWeight: '600', display: 'block', marginTop: '2px' }}>
                    {req.returnBy || 'Pending scheduling'}
                  </span>
                </div>

                {req.purpose && (
                  <div>
                    <span style={{ color: '#94A3B8', display: 'block' }}>Purpose</span>
                    <span style={{ color: '#0F1E36', fontWeight: '600', display: 'block', marginTop: '2px' }}>
                      {req.purpose}
                    </span>
                  </div>
                )}
              </div>

              {/* Action Buttons for Pending items */}
              {req.status === 'Pending' && (
                <div style={{ display: 'flex', gap: '12px', marginTop: '4px' }}>
                  <button
                    type="button"
                    onClick={() => onApproveRequest(req.id)}
                    style={{
                      flex: 1,
                      height: '46px',
                      borderRadius: '12px',
                      border: 'none',
                      backgroundColor: '#1D61E7',
                      color: '#FFFFFF',
                      fontWeight: '700',
                      fontSize: '0.9rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                      boxShadow: '0 4px 10px rgba(29, 97, 231, 0.25)',
                      fontFamily: 'inherit'
                    }}
                  >
                    Approve
                  </button>
                  <button
                    type="button"
                    onClick={() => onRejectRequest(req.id)}
                    style={{
                      flex: 1,
                      height: '46px',
                      borderRadius: '12px',
                      border: '1px solid #E2E8F0',
                      backgroundColor: '#FFFFFF',
                      color: '#0F1E36',
                      fontWeight: '700',
                      fontSize: '0.9rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                      fontFamily: 'inherit'
                    }}
                  >
                    Reject
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* ── Filter Bottom Sheet / Modal (Contains All, Borrowed, Returned, Overdue, and Date Range) ── */}
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
                  Filter Requests
                </h4>
                <p style={{ fontSize: '0.78rem', color: '#64748B', margin: '2px 0 0 0' }}>
                  Filter requests by status and date range
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

            {/* Filter Section 1: Request Status (All, Borrowed, Returned, Overdue, Pending) */}
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: '700', color: '#0F1E36', display: 'block', marginBottom: '8px' }}>
                Request Status
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                {['All', 'Borrowed', 'Returned', 'Overdue', 'Pending'].map((opt) => {
                  const isSel = statusFilter === opt;
                  return (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setStatusFilter(opt)}
                      style={{
                        padding: '10px 12px',
                        borderRadius: '12px',
                        border: isSel ? '2px solid #1D61E7' : '1px solid #E2E8F0',
                        backgroundColor: isSel ? '#EEF4FF' : '#FFFFFF',
                        color: isSel ? '#1D61E7' : '#0F1E36',
                        fontWeight: isSel ? '800' : '600',
                        fontSize: '0.825rem',
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

            {/* Filter Section 2: Date Range */}
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: '700', color: '#0F1E36', display: 'block', marginBottom: '8px' }}>
                Date Range
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                {['All Time', 'Today', 'Last 7 Days', 'Last 30 Days'].map((range) => {
                  const isSel = dateFilter === range;
                  return (
                    <button
                      key={range}
                      type="button"
                      onClick={() => setDateFilter(range)}
                      style={{
                        padding: '10px 12px',
                        borderRadius: '12px',
                        border: isSel ? '2px solid #1D61E7' : '1px solid #E2E8F0',
                        backgroundColor: isSel ? '#EEF4FF' : '#FFFFFF',
                        color: isSel ? '#1D61E7' : '#0F1E36',
                        fontWeight: isSel ? '800' : '600',
                        fontSize: '0.825rem',
                        cursor: 'pointer',
                        textAlign: 'center'
                      }}
                    >
                      {range}
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
                Apply Filters ({filteredRequests.length})
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
