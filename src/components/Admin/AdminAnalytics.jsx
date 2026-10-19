import React, { useMemo } from 'react';
import { Bell, BarChart2, AlertCircle, ArrowLeftRight, Settings } from 'lucide-react';
import BorrowingTrendChart from './BorrowingTrendChart';
import equiptraceLogo from '../../assets/equiptrace-logo.png';

export default function AdminAnalytics({
  kpis = { totalEquipment: 248, available: 183, borrowed: 42, overdue: 8 },
  equipmentList = [],
  transactions = [],
  borrowings = [],
  history = [],
  requests = [],
  onOpenNotifications,
  onOpenSettings,
  unreadCount = 0,
}) {
  const total = kpis.totalEquipment || equipmentList.reduce((s, e) => s + (Number(e.total) || 4), 0) || 50;

  // Real-time active borrowings count
  const activeBorrows = (borrowings || []).filter(
    (b) =>
      b.status === 'Borrowed' ||
      b.status === 'Active' ||
      b.status === 'Return Pending' ||
      b.status === 'Pending Approval'
  ).length;

  const borrowed = kpis.borrowed !== undefined ? kpis.borrowed : activeBorrows;
  const overdue = kpis.overdue !== undefined ? kpis.overdue : (borrowings || []).filter((b) => b.status === 'Overdue').length;

  const utilization = total > 0 ? Math.round((borrowed / total) * 100) : 0;
  const overdueRate = borrowed > 0 ? Math.round((overdue / borrowed) * 100) : 0;

  // Real-time total transaction activity count strictly based on actual activity
  const realActivityCount = (transactions || []).length + (borrowings || []).length + (history || []).length;
  const txCount = realActivityCount;

  // Dynamic ranking of top borrowed equipment strictly based on actual borrowings
  const mostBorrowedData = useMemo(() => {
    const counts = {};

    const icons = {
      Basketball: '🏀',
      Volleyball: '🏐',
      'Beach Volleyball': '🏐',
      'Table Tennis': '🏓',
      'Tennis Racket': '🎾',
      Tennis: '🎾',
      Football: '⚽',
      Badminton: '🏸',
      Futsal: '⚽',
      Billiards: '🎱',
      'Sepak Takraw': '🏐',
    };

    const getEquipmentCategory = (item) => {
      const name = (item.equipmentName || item.name || item.category || '').trim();
      const n = name.toLowerCase();
      if (n.includes('beach volleyball')) return 'Beach Volleyball';
      if (n.includes('volleyball')) return 'Volleyball';
      if (n.includes('basketball')) return 'Basketball';
      if (n.includes('table tennis') || n.includes('paddle') || n.includes('ping pong')) return 'Table Tennis';
      if (n.includes('tennis')) return 'Tennis Racket';
      if (n.includes('badminton')) return 'Badminton';
      if (n.includes('football') || n.includes('soccer')) return 'Football';
      if (n.includes('futsal')) return 'Futsal';
      if (n.includes('billiard') || n.includes('pool')) return 'Billiards';
      if (n.includes('sepak') || n.includes('takraw')) return 'Sepak Takraw';
      return name || 'Sports Equipment';
    };

    // Strictly count items from active borrowings
    (borrowings || []).forEach((b) => {
      const cat = getEquipmentCategory(b);
      counts[cat] = (counts[cat] || 0) + 1;
    });

    // Strictly count items from returned history
    (history || []).forEach((h) => {
      const cat = getEquipmentCategory(h);
      counts[cat] = (counts[cat] || 0) + 1;
    });

    // Count from transactions if any unique records
    (transactions || []).forEach((t) => {
      if (t.status === 'Borrowed' || t.status === 'Returned') {
        const cat = getEquipmentCategory(t);
        const alreadyInBorrow = (borrowings || []).some(
          (b) => b.borrowId === t.id || b.id === t.equipmentId
        );
        if (!alreadyInBorrow) {
          counts[cat] = (counts[cat] || 0) + 1;
        }
      }
    });

    const entries = Object.entries(counts).filter(([_, count]) => count > 0);
    if (entries.length === 0) {
      return [];
    }

    const sorted = entries
      .map(([name, count]) => ({
        name,
        icon: icons[name] || '🏆',
        count,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 4);

    const maxCount = Math.max(...sorted.map((item) => item.count), 1);

    return sorted.map((item, index) => ({
      ...item,
      rank: index + 1,
      percentage: Math.min(95, Math.max(20, Math.round((item.count / maxCount) * 85))),
    }));
  }, [borrowings, history, transactions]);

  return (
    <div className="admin-analytics animate-fade-in" style={{
      display: 'flex',
      flexDirection: 'column',
      padding: '16px 20px 24px 20px',
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
            Analytics
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

      {/* Top Row Metric Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '14px'
      }}>
        {/* Utilization */}
        <div style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '18px',
          padding: '16px',
          border: '1px solid #E2E8F0',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 2px 8px rgba(13, 26, 48, 0.03)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <span style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: '500' }}>Utilization</span>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              backgroundColor: '#EEF4FF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <BarChart2 size={16} color="#1D61E7" />
            </div>
          </div>
          <span style={{ fontSize: '1.75rem', fontWeight: '800', color: '#0F1E36', marginTop: '6px' }}>
            {utilization}%
          </span>
          <span style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '2px' }}>
            Items currently borrowed
          </span>
        </div>

        {/* Overdue rate */}
        <div style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '18px',
          padding: '16px',
          border: '1px solid #E2E8F0',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 2px 8px rgba(13, 26, 48, 0.03)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <span style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: '500' }}>Overdue rate</span>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              backgroundColor: '#FEE2E2',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <AlertCircle size={16} color="#DC2626" />
            </div>
          </div>
          <span style={{ fontSize: '1.75rem', fontWeight: '800', color: '#0F1E36', marginTop: '6px' }}>
            {overdueRate}%
          </span>
          <span style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '2px' }}>
            Of borrowed items
          </span>
        </div>
      </div>

      {/* Second Row Card: Transactions */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '14px'
      }}>
        <div style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '18px',
          padding: '16px',
          border: '1px solid #E2E8F0',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 2px 8px rgba(13, 26, 48, 0.03)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <span style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: '500' }}>Transactions</span>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              backgroundColor: '#DCFCE7',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <ArrowLeftRight size={16} color="#15803D" />
            </div>
          </div>
          <span style={{ fontSize: '1.75rem', fontWeight: '800', color: '#0F1E36', marginTop: '6px' }}>
            {txCount}
          </span>
          <span style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '2px' }}>
            All recorded activity
          </span>
        </div>
      </div>

      {/* Interactive Borrowing Trend Chart with Live Daily Stats */}
      <BorrowingTrendChart
        title="Borrowing trend"
        transactions={transactions}
        borrowings={borrowings}
        history={history}
      />

      {/* Most borrowed equipment Section */}
      <div style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '18px',
        padding: '18px 20px',
        border: '1px solid #E2E8F0',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        boxShadow: '0 2px 8px rgba(13, 26, 48, 0.03)'
      }}>
        <h3 style={{ fontSize: '1rem', fontWeight: '800', color: '#0F1E36' }}>
          Most borrowed equipment
        </h3>

        {mostBorrowedData.length === 0 ? (
          <div style={{
            padding: '24px 16px',
            textAlign: 'center',
            color: '#64748B',
            fontSize: '0.875rem',
            backgroundColor: '#F8FAFC',
            borderRadius: '12px',
            border: '1px dashed #CBD5E1',
          }}>
            No equipment borrowed yet. Borrowed items will appear here.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {mostBorrowedData.map((item) => (
              <div key={item.name} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: '700', color: '#94A3B8', width: '12px' }}>
                  {item.rank}
                </span>
                <span style={{ fontSize: '1.2rem' }}>{item.icon}</span>
                <span style={{ fontSize: '0.9rem', fontWeight: '800', color: '#0F1E36', width: '100px' }}>
                  {item.name}
                </span>
                <div style={{ flex: 1, height: '8px', borderRadius: '9999px', backgroundColor: '#F1F5F9', overflow: 'hidden' }}>
                  <div
                    style={{
                      width: `${item.percentage}%`,
                      height: '100%',
                      backgroundColor: '#1D61E7',
                      borderRadius: '9999px',
                      transition: 'width 0.4s ease',
                    }}
                  />
                </div>
                <span style={{ fontSize: '0.85rem', fontWeight: '700', color: '#64748B', width: '20px', textAlign: 'right' }}>
                  {item.count}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Clearance spacer for floating bottom navigation bar */}
      <div style={{ height: '96px', flexShrink: 0, minHeight: '96px' }} />
    </div>
  );
}
