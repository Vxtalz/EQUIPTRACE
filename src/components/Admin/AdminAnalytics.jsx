import React from 'react';
import { Menu, Bell, BarChart2, AlertCircle, ArrowLeftRight } from 'lucide-react';

export default function AdminAnalytics({
  kpis = { totalEquipment: 248, available: 183, borrowed: 42, overdue: 8 },
  equipmentList = [],
  transactions = []
}) {
  const total = kpis.totalEquipment || equipmentList.length || 1;
  const borrowed = kpis.borrowed || 0;
  const overdue = kpis.overdue || 0;
  const utilization = Math.round((borrowed / total) * 100);
  const overdueRate = borrowed > 0 ? Math.round((overdue / borrowed) * 100) : 0;
  const txCount = transactions.length || 5;

  return (
    <div className="admin-analytics animate-fade-in" style={{
      display: 'flex',
      flexDirection: 'column',
      padding: '16px 20px 24px 20px',
      backgroundColor: '#F8FAFC',
      minHeight: '100%',
      gap: '16px'
    }}>
      {/* Top Header Bar matching Screenshot 1 */}
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
            Analytics
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

      {/* Top Row Metric Cards matching Screenshot 1 */}
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

      {/* Second Row Card: Transactions matching Screenshot 1 */}
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

      {/* Borrowing trend Chart Section matching Screenshot 1 */}
      <div style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '18px',
        padding: '18px 20px',
        border: '1px solid #E2E8F0',
        display: 'flex',
        flexDirection: 'column',
        gap: '14px',
        boxShadow: '0 2px 8px rgba(13, 26, 48, 0.03)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: '800', color: '#0F1E36' }}>
            Borrowing trend
          </h3>
          <span style={{ fontSize: '0.775rem', color: '#64748B', fontWeight: '600' }}>
            Last 30 days
          </span>
        </div>

        {/* SVG Area Chart */}
        <div style={{ width: '100%', height: '140px', position: 'relative' }}>
          <svg viewBox="0 0 300 120" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
            <line x1="25" y1="20" x2="295" y2="20" stroke="#F1F5F9" strokeWidth="1" />
            <line x1="25" y1="50" x2="295" y2="50" stroke="#F1F5F9" strokeWidth="1" />
            <line x1="25" y1="80" x2="295" y2="80" stroke="#F1F5F9" strokeWidth="1" />

            <text x="5" y="24" fontSize="8" fill="#94A3B8">40</text>
            <text x="5" y="54" fontSize="8" fill="#94A3B8">30</text>
            <text x="5" y="84" fontSize="8" fill="#94A3B8">20</text>

            <defs>
              <linearGradient id="analyticsGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#1D61E7" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#1D61E7" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            <path
              d="M 25 80 L 50 72 L 75 76 L 100 60 L 125 68 L 150 55 L 175 60 L 200 45 L 225 50 L 250 38 L 275 44 L 295 30 L 295 95 L 25 95 Z"
              fill="url(#analyticsGradient)"
            />

            <path
              d="M 25 80 L 50 72 L 75 76 L 100 60 L 125 68 L 150 55 L 175 60 L 200 45 L 225 50 L 250 38 L 275 44 L 295 30"
              fill="none"
              stroke="#1D61E7"
              strokeWidth="2.5"
              strokeLinecap="round"
            />

            <text x="35" y="112" fontSize="9" fill="#94A3B8">Sep 1</text>
            <text x="110" y="112" fontSize="9" fill="#94A3B8">Sep 11</text>
            <text x="185" y="112" fontSize="9" fill="#94A3B8">Sep 21</text>
            <text x="260" y="112" fontSize="9" fill="#94A3B8">Sep 30</text>
          </svg>
        </div>
      </div>

      {/* Most borrowed equipment Section matching Screenshot 1 */}
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

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Item 1 */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: '700', color: '#94A3B8', width: '12px' }}>1</span>
            <span style={{ fontSize: '1.2rem' }}>🏀</span>
            <span style={{ fontSize: '0.9rem', fontWeight: '800', color: '#0F1E36', width: '100px' }}>
              Basketball
            </span>
            <div style={{ flex: 1, height: '8px', borderRadius: '9999px', backgroundColor: '#F1F5F9', overflow: 'hidden' }}>
              <div style={{ width: '85%', height: '100%', backgroundColor: '#1D61E7', borderRadius: '9999px' }} />
            </div>
            <span style={{ fontSize: '0.85rem', fontWeight: '700', color: '#64748B', width: '20px', textAlign: 'right' }}>
              18
            </span>
          </div>

          {/* Item 2 */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: '700', color: '#94A3B8', width: '12px' }}>2</span>
            <span style={{ fontSize: '1.2rem' }}>🏐</span>
            <span style={{ fontSize: '0.9rem', fontWeight: '800', color: '#0F1E36', width: '100px' }}>
              Volleyball
            </span>
            <div style={{ flex: 1, height: '8px', borderRadius: '9999px', backgroundColor: '#F1F5F9', overflow: 'hidden' }}>
              <div style={{ width: '55%', height: '100%', backgroundColor: '#1D61E7', borderRadius: '9999px' }} />
            </div>
            <span style={{ fontSize: '0.85rem', fontWeight: '700', color: '#64748B', width: '20px', textAlign: 'right' }}>
              12
            </span>
          </div>

          {/* Item 3 */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: '700', color: '#94A3B8', width: '12px' }}>3</span>
            <span style={{ fontSize: '1.2rem' }}>📽️</span>
            <span style={{ fontSize: '0.9rem', fontWeight: '800', color: '#0F1E36', width: '100px' }}>
              Projector
            </span>
            <div style={{ flex: 1, height: '8px', borderRadius: '9999px', backgroundColor: '#F1F5F9', overflow: 'hidden' }}>
              <div style={{ width: '40%', height: '100%', backgroundColor: '#1D61E7', borderRadius: '9999px' }} />
            </div>
            <span style={{ fontSize: '0.85rem', fontWeight: '700', color: '#64748B', width: '20px', textAlign: 'right' }}>
              9
            </span>
          </div>

          {/* Item 4 */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: '700', color: '#94A3B8', width: '12px' }}>4</span>
            <span style={{ fontSize: '1.2rem' }}>🎾</span>
            <span style={{ fontSize: '0.9rem', fontWeight: '800', color: '#0F1E36', width: '100px' }}>
              Tennis Racket
            </span>
            <div style={{ flex: 1, height: '8px', borderRadius: '9999px', backgroundColor: '#F1F5F9', overflow: 'hidden' }}>
              <div style={{ width: '30%', height: '100%', backgroundColor: '#1D61E7', borderRadius: '9999px' }} />
            </div>
            <span style={{ fontSize: '0.85rem', fontWeight: '700', color: '#64748B', width: '20px', textAlign: 'right' }}>
              7
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
