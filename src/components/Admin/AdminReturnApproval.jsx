import React, { useState } from 'react';
import {
  RotateCcw,
  Search,
  CheckCircle2,
  AlertTriangle,
  Clock,
  User,
  ShieldCheck,
  ChevronRight,
  Filter,
  PackageCheck,
  X,
  FileText,
  AlertCircle,
  HelpCircle,
  Bell,
  Settings,
} from 'lucide-react';
import equiptraceLogo from '../../assets/equiptrace-logo.png';

export default function AdminReturnApproval({
  returnApprovals = [],
  borrowings = [],
  adminRequests = [],
  equipmentList = [],
  onApproveReturn,
  onFlagInspection,
  adminUser,
  onOpenNotifications,
  onOpenSettings,
  unreadCount = 0,
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTab, setFilterTab] = useState('Return Pending'); // 'All' | 'Return Pending' | 'Needs Inspection' | 'Returned' | 'Borrowed'

  // Selected item for inspection modal
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedCondition, setSelectedCondition] = useState('Good Condition');
  const [inspectionNotes, setInspectionNotes] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  // Confirmation modal
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmActionType, setConfirmActionType] = useState('approve'); // 'approve' | 'flag'

  // Merge active borrowings from borrowings collection + any active approved requests
  const activeBorrowedItems = [];
  const seenIds = new Set();

  borrowings
    .filter((b) => b.status === 'Active' || b.status === 'Borrowed' || !b.status)
    .forEach((b) => {
      const bKey = b.borrowId || b.id || b.firestoreId;
      seenIds.add(bKey);
      seenIds.add(b.id);
      activeBorrowedItems.push({
        ...b,
        id: b.borrowId || b.id,
        borrowingDocId: b.firestoreId || '',
        equipmentId: b.id,
        equipmentName: b.name,
        studentName: b.studentName || 'Student',
        studentId: b.studentId || '2025-001',
        status: 'Borrowed',
        returnSubmittedTime: 'With student',
        returnSubmittedDate: b.borrowedTime || 'Active',
        condition: 'In Use',
      });
    });

  // Also include any approved requests from requests queue that haven't been returned yet
  adminRequests
    .filter((r) => r.status === 'Approved')
    .forEach((r) => {
      const rKey = r.borrowId || r.id || r.firestoreId;
      const alreadyReturned = returnApprovals.some(
        (ret) => ret.borrowId === r.borrowId || (r.borrowingDocId && ret.borrowingDocId === r.borrowingDocId)
      );
      if (!seenIds.has(rKey) && !alreadyReturned) {
        seenIds.add(rKey);
        activeBorrowedItems.push({
          id: r.borrowId || r.id,
          borrowId: r.borrowId || r.id,
          borrowingDocId: r.borrowingDocId || '',
          equipmentId: r.equipmentId || r.equipmentCode?.replace('#', '') || 'PE-023',
          equipmentName: r.equipmentName,
          category: r.category || 'PE & Sports',
          studentId: r.studentId || r.studentUid || '2025-001',
          studentName: r.studentName || 'Student',
          status: 'Borrowed',
          returnSubmittedTime: 'With student',
          returnSubmittedDate: r.requestedDate || 'Active',
          condition: 'In Use',
        });
      }
    });

  const allItems = [...returnApprovals, ...activeBorrowedItems];

  // Filtering
  const filteredList = allItems.filter((item) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      (item.studentName || '').toLowerCase().includes(q) ||
      (item.equipmentName || '').toLowerCase().includes(q) ||
      (item.equipmentId || '').toLowerCase().includes(q) ||
      (item.borrowId || '').toLowerCase().includes(q);

    const matchesFilter = filterTab === 'All' ? true : item.status === filterTab;
    return matchesSearch && matchesFilter;
  });

  // Badge count for pending
  const pendingCount = returnApprovals.filter((r) => r.status === 'Return Pending').length;
  const inspectionCount = returnApprovals.filter((r) => r.status === 'Needs Inspection').length;

  const handleOpenInspect = (item) => {
    setSelectedItem(item);
    setSelectedCondition(item.condition || 'Good Condition');
    setInspectionNotes(item.notes || '');
  };

  const handleInitiateApprove = () => {
    setConfirmActionType('approve');
    setShowConfirmModal(true);
  };

  const handleInitiateFlag = () => {
    setConfirmActionType('flag');
    setShowConfirmModal(true);
  };

  const handleFinalizeAction = async () => {
    if (!selectedItem) return;
    setActionLoading(true);

    try {
      const eqMatch = equipmentList.find(
        (eq) => eq.id.toUpperCase() === (selectedItem.equipmentId || '').toUpperCase()
      );

      if (confirmActionType === 'approve') {
        await onApproveReturn({
          returnDocId: selectedItem.firestoreId,
          borrowingDocId: selectedItem.borrowingDocId,
          equipmentDocId: eqMatch?.firestoreId || '',
          equipmentId: selectedItem.equipmentId,
          equipmentName: selectedItem.equipmentName,
          studentId: selectedItem.studentId,
          studentName: selectedItem.studentName,
          condition: selectedCondition,
          notes: inspectionNotes,
        });
      } else {
        await onFlagInspection({
          returnDocId: selectedItem.firestoreId,
          condition: selectedCondition,
          notes: inspectionNotes,
          studentId: selectedItem.studentId,
          equipmentName: selectedItem.equipmentName,
          equipmentId: selectedItem.equipmentId,
        });
      }

      setShowConfirmModal(false);
      setSelectedItem(null);
    } catch (err) {
      console.error('Return approval error:', err);
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Return Pending':
        return {
          bg: '#FEF3C7',
          color: '#B45309',
          border: '#FDE68A',
          label: 'Return Pending',
          icon: Clock,
        };
      case 'Needs Inspection':
        return {
          bg: '#FEE2E2',
          color: '#DC2626',
          border: '#FECACA',
          label: 'Needs Inspection',
          icon: AlertTriangle,
        };
      case 'Returned':
        return {
          bg: '#DCFCE7',
          color: '#15803D',
          border: '#BBF7D0',
          label: 'Returned',
          icon: CheckCircle2,
        };
      case 'Borrowed':
      default:
        return {
          bg: '#EFF6FF',
          color: '#1D61E7',
          border: '#BFDBFE',
          label: 'Borrowed',
          icon: Clock,
        };
    }
  };

  return (
    <div
      className="admin-return-approval animate-fade-in"
      style={{
        display: 'flex',
        flexDirection: 'column',
        padding: '16px 20px 28px 20px',
        backgroundColor: '#F8FAFC',
        minHeight: '100%',
        gap: '16px',
      }}
    >
      {/* Top Header */}
      <div style={{ paddingTop: '4px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0 }}>
            <img
              src={equiptraceLogo}
              alt="EquipTrace"
              style={{
                height: '38px',
                objectFit: 'contain',
                display: 'block',
                flexShrink: 0,
              }}
            />
            <div style={{ borderLeft: '2px solid #CBD5E1', paddingLeft: '12px', minWidth: 0 }}>
              <h2 style={{ fontSize: '1.2rem', fontWeight: '800', color: '#0F1E36', letterSpacing: '-0.3px', margin: 0, lineHeight: '1.2' }}>
                Return Approval
              </h2>
              <p style={{ fontSize: '0.78rem', color: '#64748B', fontWeight: '500', margin: '2px 0 0 0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                Verify physical condition and finalize returns
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
            {pendingCount > 0 && (
              <span
                style={{
                  backgroundColor: '#EF4444',
                  color: '#FFFFFF',
                  fontSize: '0.75rem',
                  fontWeight: '800',
                  padding: '4px 10px',
                  borderRadius: '9999px',
                  boxShadow: '0 2px 6px rgba(239,68,68,0.3)',
                  whiteSpace: 'nowrap',
                  flexShrink: 0,
                  display: 'inline-flex',
                  alignItems: 'center',
                  lineHeight: '1',
                }}
              >
                {pendingCount} Pending
              </span>
            )}

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
                <span
                  style={{
                    position: 'absolute',
                    top: '5px',
                    right: '5px',
                    width: '10px',
                    height: '10px',
                    borderRadius: '50%',
                    backgroundColor: '#EF4444',
                    border: '2px solid #FFFFFF',
                  }}
                />
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
      </div>

      {/* Search Input */}
      <div style={{ position: 'relative' }}>
        <Search
          size={18}
          color="#94A3B8"
          style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }}
        />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by student, equipment, or ID..."
          style={{
            width: '100%',
            height: '46px',
            borderRadius: '14px',
            border: '1px solid #E2E8F0',
            paddingLeft: '42px',
            paddingRight: '14px',
            fontSize: '0.9rem',
            outline: 'none',
            backgroundColor: '#FFFFFF',
            fontFamily: 'inherit',
            boxShadow: '0 2px 6px rgba(0,0,0,0.02)',
          }}
        />
      </div>

      {/* Filter Tabs */}
      <div
        className="hover-scroll-container"
        style={{ minHeight: '48px', flexShrink: 0 }}
        onWheel={(e) => {
          if (e.deltaY !== 0) {
            e.currentTarget.scrollLeft += e.deltaY * 0.7;
          }
        }}
      >
        {[
          { key: 'Return Pending', label: `Pending (${pendingCount})` },
          { key: 'Needs Inspection', label: `Inspection (${inspectionCount})` },
          { key: 'Returned', label: 'Returned' },
          { key: 'Borrowed', label: `Borrowed (${activeBorrowedItems.length})` },
          { key: 'All', label: 'All Records' },
        ].map((tab) => {
          const isActive = filterTab === tab.key;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => setFilterTab(tab.key)}
              className={`filter-pill-btn ${isActive ? 'active' : 'inactive'}`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* List of Return Records */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {filteredList.length === 0 ? (
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '18px',
              padding: '36px 20px',
              textAlign: 'center',
              border: '1px solid #E2E8F0',
            }}
          >
            <div
              style={{
                width: '54px',
                height: '54px',
                borderRadius: '50%',
                backgroundColor: '#EFF6FF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 12px auto',
              }}
            >
              <PackageCheck size={26} color="#1D61E7" />
            </div>
            <h4 style={{ fontSize: '1rem', fontWeight: '800', color: '#0F1E36' }}>
              {filterTab === 'Borrowed'
                ? 'No Borrowed Items'
                : filterTab === 'Return Pending'
                ? 'No Pending Returns'
                : filterTab === 'Needs Inspection'
                ? 'No Items Needing Inspection'
                : filterTab === 'Returned'
                ? 'No Returned Items'
                : 'No Records Found'}
            </h4>
            <p style={{ fontSize: '0.8rem', color: '#64748B', marginTop: '4px' }}>
              {filterTab === 'Return Pending'
                ? 'All handed-in gear has been inspected and cleared.'
                : filterTab === 'Borrowed'
                ? 'There are currently no active borrowed items.'
                : 'No equipment matches the selected search and filter.'}
            </p>
          </div>
        ) : (
          filteredList.map((item, idx) => {
            const badge = getStatusBadge(item.status);
            const BadgeIcon = badge.icon;
            const isPending = item.status === 'Return Pending';
            const isInspection = item.status === 'Needs Inspection';

            return (
              <div
                key={item.firestoreId || item.borrowId || idx}
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '18px',
                  padding: '16px 18px',
                  border: isPending ? '1.5px solid #FCD34D' : '1px solid #E2E8F0',
                  boxShadow: isPending
                    ? '0 4px 14px rgba(245,158,11,0.1)'
                    : '0 2px 8px rgba(13,26,48,0.03)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                  position: 'relative',
                  overflow: 'hidden',
                  boxSizing: 'border-box',
                  width: '100%',
                }}
              >
                {/* Header Row: Student & Status Badge */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: '10px',
                  width: '100%',
                  minWidth: 0,
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    minWidth: 0,
                    flex: 1,
                  }}>
                    <div
                      style={{
                        width: '38px',
                        height: '38px',
                        borderRadius: '50%',
                        backgroundColor: '#EEF4FF',
                        color: '#1D61E7',
                        fontWeight: '800',
                        fontSize: '0.85rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      {item.studentName
                        ? item.studentName.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
                        : 'ST'}
                    </div>
                    <div style={{ minWidth: 0, flex: 1 }}>
                      <h4 style={{
                        fontSize: '0.95rem',
                        fontWeight: '800',
                        color: '#0F1E36',
                        lineHeight: '1.2',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        margin: 0,
                      }}>
                        {item.studentName}
                      </h4>
                      <span style={{
                        fontSize: '0.75rem',
                        color: '#64748B',
                        display: 'block',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        marginTop: '2px',
                      }}>
                        ID: {item.studentId?.length > 14 && !item.studentId.includes('-')
                          ? `${item.studentId.slice(0, 8)}...`
                          : item.studentId || 'N/A'}
                        {(item.studentCourse || item.studentYear) && ` · ${[item.studentCourse, item.studentYear].filter(Boolean).join(' ')}`}
                      </span>
                    </div>
                  </div>

                  <span
                    style={{
                      fontSize: '0.72rem',
                      fontWeight: '800',
                      backgroundColor: badge.bg,
                      color: badge.color,
                      border: `1px solid ${badge.border}`,
                      padding: '4px 10px',
                      borderRadius: '9999px',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      flexShrink: 0,
                      whiteSpace: 'nowrap',
                    }}
                  >
                    <BadgeIcon size={12} strokeWidth={2.5} style={{ flexShrink: 0 }} />
                    <span style={{ whiteSpace: 'nowrap' }}>{badge.label}</span>
                  </span>
                </div>

                {/* Equipment Row */}
                <div
                  style={{
                    backgroundColor: '#F8FAFC',
                    borderRadius: '12px',
                    padding: '12px 14px',
                    border: '1px solid #F1F5F9',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '6px',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.88rem', fontWeight: '800', color: '#0F1E36' }}>
                      {item.equipmentName}
                    </span>
                    <span
                      style={{
                        fontSize: '0.75rem',
                        fontWeight: '800',
                        backgroundColor: '#EEF4FF',
                        color: '#1D61E7',
                        padding: '2px 8px',
                        borderRadius: '6px',
                      }}
                    >
                      {item.equipmentId}
                    </span>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '0.78rem' }}>
                    <div>
                      <span style={{ color: '#94A3B8' }}>Category:</span>{' '}
                      <strong style={{ color: '#475569' }}>{item.category || 'PE & Sports'}</strong>
                    </div>
                    <div>
                      <span style={{ color: '#94A3B8' }}>Quantity:</span>{' '}
                      <strong style={{ color: '#475569' }}>{item.quantity || 1} unit</strong>
                    </div>
                    <div>
                      <span style={{ color: '#94A3B8' }}>Borrowed:</span>{' '}
                      <strong style={{ color: '#475569' }}>{item.borrowedTime || 'Today'}</strong>
                    </div>
                    <div>
                      <span style={{ color: '#94A3B8' }}>{item.status === 'Borrowed' ? 'Return Due:' : 'Handed in:'}</span>{' '}
                      <strong style={{ color: '#0F1E36' }}>{item.status === 'Borrowed' ? (item.returnBy || 'Today before 5:00 PM') : (item.returnSubmittedTime || 'Active')}</strong>
                    </div>
                  </div>

                  {item.notes && (
                    <div style={{ fontSize: '0.75rem', color: '#DC2626', backgroundColor: '#FEF2F2', padding: '6px 10px', borderRadius: '8px', marginTop: '2px' }}>
                      <strong>Note:</strong> {item.notes}
                    </div>
                  )}
                </div>

                {/* Action button if pending or needs inspection */}
                {(isPending || isInspection) && (
                  <button
                    type="button"
                    onClick={() => handleOpenInspect(item)}
                    style={{
                      width: '100%',
                      height: '44px',
                      backgroundColor: '#1D61E7',
                      color: '#FFFFFF',
                      border: 'none',
                      borderRadius: '12px',
                      fontSize: '0.88rem',
                      fontWeight: '700',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      boxShadow: '0 4px 12px rgba(29,97,231,0.25)',
                      fontFamily: 'inherit',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <ShieldCheck size={18} />
                    Inspect & Approve Return
                  </button>
                )}


                {item.status === 'Returned' && (
                  <div style={{ fontSize: '0.75rem', color: '#15803D', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <CheckCircle2 size={14} />
                    <span>Approved by {item.approvedBy || 'Admin'} · {item.approvalTime || item.approvalDate}</span>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Clearance spacer for floating bottom navigation bar */}
      <div style={{ height: '96px', flexShrink: 0, minHeight: '96px' }} />

      {/* ── Inspect & Condition Assessment Modal ── */}
      {selectedItem && !showConfirmModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 100,
            backgroundColor: 'rgba(15,30,54,0.65)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'center',
            animation: 'fadeIn 0.2s ease',
          }}
        >
          <div
            style={{
              backgroundColor: '#FFFFFF',
              width: '100%',
              maxWidth: '430px',
              borderTopLeftRadius: '24px',
              borderTopRightRadius: '24px',
              padding: '24px 20px 32px 20px',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
              maxHeight: '90vh',
              overflowY: 'auto',
              boxShadow: '0 -10px 30px rgba(0,0,0,0.2)',
            }}
          >
            {/* Modal Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: '#0F1E36' }}>
                  Inspect Equipment Return
                </h3>
                <p style={{ fontSize: '0.78rem', color: '#64748B', marginTop: '2px' }}>
                  Verify physical condition before approving return
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedItem(null)}
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
                  color: '#64748B',
                }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Summary Box */}
            <div
              style={{
                backgroundColor: '#F8FAFC',
                borderRadius: '14px',
                padding: '14px',
                border: '1px solid #E2E8F0',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.9rem', fontWeight: '800', color: '#0F1E36' }}>
                  {selectedItem.equipmentName}
                </span>
                <span style={{ fontSize: '0.78rem', fontWeight: '800', color: '#1D61E7', backgroundColor: '#EEF4FF', padding: '2px 8px', borderRadius: '6px' }}>
                  {selectedItem.equipmentId}
                </span>
              </div>
              <div style={{ fontSize: '0.8rem', color: '#64748B', display: 'flex', justifyContent: 'space-between' }}>
                <span>Student: <strong style={{ color: '#0F1E36' }}>{selectedItem.studentName}</strong></span>
                <span>Qty: <strong style={{ color: '#0F1E36' }}>{selectedItem.quantity || 1}</strong></span>
              </div>
              <div style={{ fontSize: '0.78rem', color: '#64748B' }}>
                Submitted: <strong style={{ color: '#0F1E36' }}>{selectedItem.returnSubmittedDate || 'Today'} · {selectedItem.returnSubmittedTime}</strong>
              </div>
            </div>

            {/* Condition Selector */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: '800', color: '#0F1E36' }}>
                Recorded Physical Condition:
              </label>

              {[
                {
                  id: 'Good Condition',
                  title: 'Good Condition',
                  desc: 'Clean, undamaged, and ready for immediate restocking.',
                  color: '#15803D',
                  bg: '#DCFCE7',
                },
                {
                  id: 'Damaged',
                  title: 'Damaged',
                  desc: 'Equipment has tears, deflation, or structural wear. Do not restock.',
                  color: '#DC2626',
                  bg: '#FEE2E2',
                },
                {
                  id: 'Incomplete / Missing Parts',
                  title: 'Incomplete / Missing Parts',
                  desc: 'Missing accessories (shuttlecock, racket case, ball pump, etc.).',
                  color: '#D97706',
                  bg: '#FEF3C7',
                },
              ].map((cond) => {
                const isSelected = selectedCondition === cond.id;
                return (
                  <div
                    key={cond.id}
                    onClick={() => setSelectedCondition(cond.id)}
                    style={{
                      padding: '12px 14px',
                      borderRadius: '12px',
                      border: isSelected ? `2px solid ${cond.color}` : '1px solid #E2E8F0',
                      backgroundColor: isSelected ? cond.bg : '#FFFFFF',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <div
                      style={{
                        width: '18px',
                        height: '18px',
                        borderRadius: '50%',
                        border: isSelected ? `5px solid ${cond.color}` : '2px solid #CBD5E1',
                        backgroundColor: '#FFFFFF',
                        flexShrink: 0,
                      }}
                    />
                    <div style={{ flex: 1 }}>
                      <h5 style={{ fontSize: '0.88rem', fontWeight: '800', color: '#0F1E36', margin: 0 }}>
                        {cond.title}
                      </h5>
                      <p style={{ fontSize: '0.74rem', color: '#64748B', margin: '2px 0 0 0' }}>
                        {cond.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Inspection Notes */}
            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: '700', color: '#64748B', display: 'block', marginBottom: '6px' }}>
                Inspection Remarks / Damage Notes (Optional):
              </label>
              <textarea
                value={inspectionNotes}
                onChange={(e) => setInspectionNotes(e.target.value)}
                placeholder="e.g. Scuffed surface, verified grip tape intact..."
                rows={2}
                style={{
                  width: '100%',
                  borderRadius: '12px',
                  border: '1px solid #E2E8F0',
                  padding: '10px 12px',
                  fontSize: '0.85rem',
                  outline: 'none',
                  fontFamily: 'inherit',
                  backgroundColor: '#F8FAFC',
                }}
              />
            </div>

            {/* Dual Actions: Confirm Return vs Flag For Inspection */}
            <div style={{ display: 'flex', gap: '10px', marginTop: '4px' }}>
              <button
                type="button"
                onClick={handleInitiateFlag}
                style={{
                  flex: 1,
                  height: '48px',
                  backgroundColor: '#FEF3C7',
                  color: '#B45309',
                  border: '1px solid #FDE68A',
                  borderRadius: '14px',
                  fontSize: '0.86rem',
                  fontWeight: '700',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  fontFamily: 'inherit',
                }}
              >
                <AlertTriangle size={16} />
                Flag for Inspection
              </button>

              <button
                type="button"
                onClick={handleInitiateApprove}
                style={{
                  flex: 1.2,
                  height: '48px',
                  backgroundColor: '#1D61E7',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '14px',
                  fontSize: '0.88rem',
                  fontWeight: '800',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  boxShadow: '0 4px 14px rgba(29,97,231,0.3)',
                  fontFamily: 'inherit',
                }}
              >
                <CheckCircle2 size={18} />
                Confirm Return
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Summary Confirmation Dialog ── */}
      {showConfirmModal && selectedItem && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 110,
            backgroundColor: 'rgba(15,30,54,0.65)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
            animation: 'fadeIn 0.2s ease',
          }}
        >
          <div
            style={{
              backgroundColor: '#FFFFFF',
              width: '100%',
              maxWidth: '350px',
              borderRadius: '22px',
              padding: '24px 20px',
              display: 'flex',
              flexDirection: 'column',
              gap: '14px',
              boxShadow: '0 20px 50px rgba(0,0,0,0.3)',
              textAlign: 'center',
            }}
          >
            <div
              style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                backgroundColor: confirmActionType === 'approve' ? '#DCFCE7' : '#FEF3C7',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto',
              }}
            >
              {confirmActionType === 'approve' ? (
                <CheckCircle2 size={28} color="#15803D" strokeWidth={2.5} />
              ) : (
                <AlertTriangle size={28} color="#D97706" strokeWidth={2.5} />
              )}
            </div>

            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#0F1E36' }}>
                {confirmActionType === 'approve' ? 'Finalize Return Approval?' : 'Hold Return for Inspection?'}
              </h3>
              <p style={{ fontSize: '0.8rem', color: '#64748B', marginTop: '4px', lineHeight: '1.4' }}>
                {confirmActionType === 'approve'
                  ? `You are confirming the physical return of ${selectedItem.equipmentName}.`
                  : `This return will be placed on hold under Needs Inspection.`}
              </p>
            </div>

            {/* Condition summary pill */}
            <div
              style={{
                backgroundColor: '#F8FAFC',
                borderRadius: '12px',
                padding: '12px',
                border: '1px solid #E2E8F0',
                textAlign: 'left',
                fontSize: '0.78rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '4px',
              }}
            >
              <div><strong>Student:</strong> {selectedItem.studentName}</div>
              <div><strong>Equipment:</strong> {selectedItem.equipmentName} ({selectedItem.equipmentId})</div>
              <div><strong>Recorded Condition:</strong> <span style={{ color: selectedCondition === 'Good Condition' ? '#15803D' : '#DC2626', fontWeight: '700' }}>{selectedCondition}</span></div>
              <div>
                <strong>Inventory Impact:</strong>{' '}
                {selectedCondition === 'Good Condition' && confirmActionType === 'approve'
                  ? '+1 Available in Stock'
                  : 'No restock (Held for maintenance/parts)'}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px', marginTop: '4px' }}>
              <button
                type="button"
                disabled={actionLoading}
                onClick={() => setShowConfirmModal(false)}
                style={{
                  flex: 1,
                  height: '46px',
                  backgroundColor: '#F1F5F9',
                  color: '#0F1E36',
                  border: 'none',
                  borderRadius: '12px',
                  fontSize: '0.88rem',
                  fontWeight: '700',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                }}
              >
                Back
              </button>

              <button
                type="button"
                disabled={actionLoading}
                onClick={handleFinalizeAction}
                style={{
                  flex: 1.2,
                  height: '46px',
                  backgroundColor: confirmActionType === 'approve' ? '#1D61E7' : '#D97706',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '12px',
                  fontSize: '0.88rem',
                  fontWeight: '800',
                  cursor: actionLoading ? 'not-allowed' : 'pointer',
                  fontFamily: 'inherit',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                }}
              >
                {actionLoading ? 'Saving…' : confirmActionType === 'approve' ? 'Yes, Confirm' : 'Yes, Flag'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
