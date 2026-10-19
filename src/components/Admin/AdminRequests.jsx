import React, { useState, useMemo } from 'react';
import {
  Bell,
  Settings,
  Search,
  X,
  SlidersHorizontal,
  RotateCcw,
  CheckCircle2,
  Clock
} from 'lucide-react';
import equiptraceLogo from '../../assets/equiptrace-logo.png';

export default function AdminRequests({
  requests = [],
  returnApprovals = [],
  borrowings = [],
  history = [],
  transactions = [],
  equipmentList = [],
  onApproveRequest,
  onRejectRequest,
  onApproveReturn,
  onOpenNotifications,
  onOpenSettings,
  unreadCount = 0,
}) {
  // ── Search & Filter State ──────────────────────────────────────────────────
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All'); // 'All' | 'Borrowed' | 'Returned' | 'Overdue' | 'Pending'
  const [dateFilter, setDateFilter] = useState('All Time'); // 'All Time' | 'Today' | 'Last 7 Days' | 'Last 30 Days'
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [actionLoadingId, setActionLoadingId] = useState(null);

  // Parse request date for chronological sorting and date filtering
  const parseItemDate = (item) => {
    if (!item) return new Date(0);
    if (item.createdAt) {
      if (typeof item.createdAt.toDate === 'function') return item.createdAt.toDate();
      if (item.createdAt.seconds) return new Date(item.createdAt.seconds * 1000);
      const d = new Date(item.createdAt);
      if (!isNaN(d.getTime())) return d;
    }
    if (item.returnSubmittedDate) {
      const d = new Date(String(item.returnSubmittedDate).replace(/·/g, ' ').trim());
      if (!isNaN(d.getTime())) return d;
    }
    if (item.requestedDate) {
      const sanitized = String(item.requestedDate).replace(/·/g, ' ').replace(/\s+/g, ' ').trim();
      const d = new Date(sanitized);
      if (!isNaN(d.getTime())) return d;
    }
    if (item.date) {
      const sanitized = String(item.date).replace(/·/g, ' ').replace(/\s+/g, ' ').trim();
      const d = new Date(sanitized);
      if (!isNaN(d.getTime())) return d;
    }
    if (item.borrowedDate && item.borrowedDate !== 'Previous') {
      const d = new Date(item.borrowedDate);
      if (!isNaN(d.getTime())) return d;
    }
    if (typeof item.id === 'string') {
      const match = item.id.match(/\d{10,}/);
      if (match) {
        const num = parseInt(match[0], 10);
        if (!isNaN(num)) return new Date(num);
      }
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

    // 'Pending' matches both borrow requests ('pending') and return requests ('return pending')
    if (f === 'pending') {
      return s.includes('pending');
    }
    // 'Borrowed' matches active borrowings, approved borrow requests, and borrowed status
    if (f === 'borrowed') {
      return s === 'borrowed' || s === 'active' || s === 'approved';
    }
    // 'Returned' matches returned items
    if (f === 'returned') {
      return s.includes('returned');
    }
    // 'Overdue' matches overdue items
    if (f === 'overdue') {
      return s === 'overdue';
    }
    return s === f;
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setStatusFilter('All');
    setDateFilter('All Time');
    setShowFilterModal(false);
  };

  const isFilterActive = statusFilter !== 'All' || dateFilter !== 'All Time';

  // ── Unified requests, returns, borrowings, and history dataset ───────────────
  const allUnifiedItems = useMemo(() => {
    const list = [];
    const seenKeys = new Set();

    // 1. Pending & historical Borrow Requests
    requests.forEach((r) => {
      const key = `req-${r.id || r.firestoreId}`;
      seenKeys.add(key);
      list.push({
        id: r.id || `REQ-${r.firestoreId}`,
        type: 'borrow_request',
        studentName: r.studentName || 'Student',
        studentId: r.studentId || '',
        studentInitials: r.studentInitials || (r.studentName ? r.studentName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() : 'ST'),
        studentCourse: r.studentCourse,
        studentYear: r.studentYear,
        equipmentName: r.equipmentName || 'Equipment Item',
        equipmentCode: r.equipmentCode || r.equipmentId || '',
        equipmentId: r.equipmentId || r.equipmentCode || '',
        icon: r.icon || '📦',
        requestedDate: r.requestedDate || r.date || 'Today',
        returnBy: r.returnBy || 'Pending scheduling',
        purpose: r.purpose || '',
        status: r.status || 'Pending',
        rawItem: r,
      });
    });

    // 2. Return Approvals (both 'Return Pending' and 'Returned')
    returnApprovals.forEach((ret) => {
      const key = `ret-${ret.id || ret.firestoreId || ret.borrowId}`;
      if (!seenKeys.has(key)) {
        seenKeys.add(key);
        const isPending = ret.status === 'Return Pending';
        list.push({
          id: ret.id || `RET-${ret.firestoreId || ret.borrowId}`,
          type: 'return_submission',
          studentName: ret.studentName || 'Student',
          studentId: ret.studentId || '',
          studentInitials: ret.studentName ? ret.studentName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() : 'ST',
          studentCourse: ret.studentCourse,
          studentYear: ret.studentYear,
          equipmentName: ret.equipmentName || ret.name || 'Equipment Item',
          equipmentCode: ret.equipmentId || ret.equipmentCode || '',
          equipmentId: ret.equipmentId || '',
          icon: ret.icon || '📦',
          requestedDate: ret.returnSubmittedDate || ret.borrowedTime || 'Today',
          returnBy: isPending ? `Handed in · ${ret.returnSubmittedTime || 'Awaiting Inspection'}` : `Returned · ${ret.approvalDate || ret.returnSubmittedDate || 'Completed'}`,
          purpose: ret.notes || ret.condition || 'Equipment Return',
          status: isPending ? 'Return Pending' : 'Returned',
          rawItem: ret,
        });
      }
    });

    // 3. Active & Return Pending Borrowings from borrowings list
    borrowings.forEach((b) => {
      const key = `borrow-${b.borrowId || b.firestoreId}`;
      if (!seenKeys.has(key)) {
        seenKeys.add(key);
        const isReturnPending = b.status === 'Return Pending';
        const isOverdue = b.status === 'Overdue';
        list.push({
          id: b.borrowId || `BORROW-${b.firestoreId}`,
          type: isReturnPending ? 'return_submission' : 'borrowing',
          studentName: b.studentName || 'Student',
          studentId: b.studentId || '',
          studentInitials: b.studentName ? b.studentName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() : 'ST',
          equipmentName: b.name || b.equipmentName || 'Equipment Item',
          equipmentCode: b.id || b.equipmentId || '',
          equipmentId: b.id || b.equipmentId || '',
          icon: b.icon || '📦',
          requestedDate: b.borrowedTime || 'Today',
          returnBy: isReturnPending ? `Handed in · ${b.returnSubmittedTime || 'Awaiting Inspection'}` : (b.returnBy || 'Today before 5:00 PM'),
          purpose: b.purpose || 'Active Borrowing',
          status: isReturnPending ? 'Return Pending' : (isOverdue ? 'Overdue' : 'Borrowed'),
          rawItem: b,
        });
      }
    });

    // 4. Completed Returns from history
    history.forEach((h) => {
      const key = `hist-${h.id || h.firestoreId || `${h.studentId}-${h.equipmentId}-${h.returnedDate}`}`;
      if (!seenKeys.has(key)) {
        seenKeys.add(key);
        list.push({
          id: h.id || `HIST-${Date.now()}`,
          type: 'history',
          studentName: h.studentName || 'Student',
          studentId: h.studentId || '',
          studentInitials: h.studentName ? h.studentName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() : 'ST',
          equipmentName: h.name || h.equipmentName || 'Equipment Item',
          equipmentCode: h.equipmentId || '',
          equipmentId: h.equipmentId || '',
          icon: h.icon || '📦',
          requestedDate: h.borrowedDate || 'Previous',
          returnBy: `Returned · ${h.returnedDate || 'Completed'}`,
          purpose: h.notes || h.condition || 'Returned Equipment',
          status: 'Returned',
          rawItem: h,
        });
      }
    });

    // 5. Additional Returned transactions from transactions ledger
    transactions.forEach((tx) => {
      if (tx.status === 'Returned') {
        const key = `tx-${tx.id}`;
        if (!seenKeys.has(key)) {
          seenKeys.add(key);
          list.push({
            id: tx.id,
            type: 'transaction',
            studentName: tx.studentName || 'Student',
            studentId: tx.studentId || '',
            studentInitials: tx.studentInitials || 'ST',
            equipmentName: tx.equipmentName || tx.equipment || 'Equipment Item',
            equipmentCode: tx.equipmentId || '',
            equipmentId: tx.equipmentId || '',
            icon: '📦',
            requestedDate: tx.date || 'Recent',
            returnBy: `Returned · ${tx.date || 'Completed'}`,
            purpose: 'Return Transaction Log',
            status: 'Returned',
            rawItem: tx,
          });
        }
      }
    });

    return list;
  }, [requests, returnApprovals, borrowings, history, transactions]);

  // 1. Sort all items chronologically by newest first
  const sortedItems = useMemo(() => {
    return [...allUnifiedItems].sort((a, b) => {
      const dateA = parseItemDate(a).getTime();
      const dateB = parseItemDate(b).getTime();
      if (dateB !== dateA) return dateB - dateA;
      return String(b.id || '').localeCompare(String(a.id || ''));
    });
  }, [allUnifiedItems]);

  // 2. Filter by Search Query, Status, and Date Range combined
  const filteredItems = useMemo(() => {
    return sortedItems.filter((item) => {
      // Search matching (student name, student ID, equipment name, equipment code)
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const nameMatch = (item.studentName || '').toLowerCase().includes(q);
        const idMatch = (item.studentId || '').toLowerCase().includes(q);
        const equipMatch = (item.equipmentName || '').toLowerCase().includes(q);
        const codeMatch = (item.equipmentCode || item.equipmentId || '').toLowerCase().includes(q);
        if (!nameMatch && !idMatch && !equipMatch && !codeMatch) {
          return false;
        }
      }

      // Status filter matching
      if (!isStatusMatch(item.status, statusFilter)) {
        return false;
      }

      // Date range filter matching
      if (!isDateInRange(parseItemDate(item), dateFilter)) {
        return false;
      }

      return true;
    });
  }, [sortedItems, searchQuery, statusFilter, dateFilter]);

  // Handle Approve Return directly from the Requests card
  const handleApproveReturnClick = async (item) => {
    setActionLoadingId(item.id);
    try {
      const raw = item.rawItem || item;
      const eqMatch = equipmentList.find(
        (eq) => (eq.id || '').toUpperCase() === (item.equipmentId || item.equipmentCode || '').toUpperCase()
      );

      if (onApproveReturn) {
        await onApproveReturn({
          returnDocId: raw.firestoreId || raw.returnApprovalId || raw.id,
          borrowingDocId: raw.borrowingDocId || raw.firestoreId || '',
          equipmentDocId: eqMatch?.firestoreId || '',
          equipmentId: item.equipmentId || item.equipmentCode || '',
          equipmentName: item.equipmentName || '',
          studentId: item.studentId || '',
          studentName: item.studentName || 'Student',
          condition: raw.condition || 'Good Condition',
          notes: raw.notes || '',
          borrowId: raw.borrowId || item.id,
        });
      }
    } finally {
      setActionLoadingId(null);
    }
  };

  // Status badge styling helper
  const renderStatusBadge = (status) => {
    const s = (status || '').toLowerCase();
    let bg = '#EEF4FF';
    let text = '#1D61E7';
    let label = status || 'Borrowed';

    if (s === 'return pending') {
      bg = '#FEF3C7';
      text = '#B45309';
      label = 'Return Pending';
    } else if (s === 'pending') {
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
    } else if (s === 'approved' || s === 'borrowed' || s === 'active') {
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

      {/* ── Search Bar & Filter Control ── */}
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

      {/* ── Unified Requests / Returns Cards List ── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
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
              No matching borrowing requests or returns found.
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
          filteredItems.map((item) => {
            const isReturnPending = item.status === 'Return Pending';
            const isBorrowPending = item.status === 'Pending';
            const isReturned = (item.status || '').toLowerCase().includes('returned');
            const isLoading = actionLoadingId === item.id;

            return (
              <div
                key={item.id}
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
                      backgroundColor: isReturnPending ? '#F59E0B' : '#1D61E7',
                      color: '#FFFFFF',
                      fontWeight: '800',
                      fontSize: '0.9rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}>
                      {item.studentInitials}
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <h4 style={{ fontSize: '1.05rem', fontWeight: '800', color: '#0F1E36', margin: 0 }}>
                        {item.studentName}
                      </h4>
                      {(item.studentId || item.studentCourse || item.studentYear) && (
                        <span style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: '600', marginTop: '2px' }}>
                          {item.studentId ? `ID: ${item.studentId}` : ''}
                          {item.studentId && (item.studentCourse || item.studentYear) ? ' · ' : ''}
                          {[item.studentCourse, item.studentYear].filter(Boolean).join(' ')}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div>
                    {renderStatusBadge(item.status)}
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
                      <span style={{ fontSize: '1.1rem' }}>{item.icon || '📦'}</span>
                      <span style={{ color: '#0F1E36', fontWeight: '800' }}>{item.equipmentName}</span>
                      <span style={{ color: '#64748B', fontWeight: '500' }}>
                        {item.equipmentCode ? `#${item.equipmentCode.replace('#', '')}` : ''}
                      </span>
                    </div>
                  </div>

                  <div>
                    <span style={{ color: '#94A3B8', display: 'block' }}>
                      {isReturnPending || isReturned ? 'Date / Time' : 'Requested'}
                    </span>
                    <span style={{ color: '#0F1E36', fontWeight: '600', display: 'block', marginTop: '2px' }}>
                      {item.requestedDate}
                    </span>
                  </div>

                  <div>
                    <span style={{ color: '#94A3B8', display: 'block' }}>
                      {isReturnPending ? 'Return Progress' : (isReturned ? 'Status Detail' : 'Return by')}
                    </span>
                    <span style={{ color: '#0F1E36', fontWeight: '600', display: 'block', marginTop: '2px' }}>
                      {item.returnBy}
                    </span>
                  </div>

                  {item.purpose && (
                    <div>
                      <span style={{ color: '#94A3B8', display: 'block' }}>
                        {isReturnPending || isReturned ? 'Condition / Notes' : 'Purpose'}
                      </span>
                      <span style={{ color: '#0F1E36', fontWeight: '600', display: 'block', marginTop: '2px' }}>
                        {item.purpose}
                      </span>
                    </div>
                  )}
                </div>

                {/* Action Buttons for Borrow Requests (Pending) */}
                {isBorrowPending && (
                  <div style={{ display: 'flex', gap: '12px', marginTop: '4px' }}>
                    <button
                      type="button"
                      onClick={() => onApproveRequest(item.id)}
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
                      Approve Borrow
                    </button>
                    <button
                      type="button"
                      onClick={() => onRejectRequest(item.id)}
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

                {/* Action Button for Return Submissions (Return Pending) */}
                {isReturnPending && (
                  <div style={{ marginTop: '4px' }}>
                    <button
                      type="button"
                      disabled={isLoading}
                      onClick={() => handleApproveReturnClick(item)}
                      style={{
                        width: '100%',
                        height: '46px',
                        borderRadius: '12px',
                        border: 'none',
                        backgroundColor: '#15803D',
                        color: '#FFFFFF',
                        fontWeight: '700',
                        fontSize: '0.9rem',
                        cursor: isLoading ? 'not-allowed' : 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        boxShadow: '0 4px 10px rgba(21, 128, 61, 0.25)',
                        fontFamily: 'inherit',
                        opacity: isLoading ? 0.7 : 1
                      }}
                    >
                      <CheckCircle2 size={18} />
                      <span>{isLoading ? 'Confirming Return...' : 'Confirm & Approve Return'}</span>
                    </button>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* ── Filter Bottom Sheet / Modal ── */}
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
