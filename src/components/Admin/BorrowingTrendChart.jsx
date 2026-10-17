import React, { useState, useMemo } from 'react';

export default function BorrowingTrendChart({
  title = 'Borrowing trend',
  transactions = []
}) {
  const [timeRange, setTimeRange] = useState('30D'); // '7D' | '30D'
  const [activePointIndex, setActivePointIndex] = useState(null);

  // Generate dataset based on time range and real transactions
  const data = useMemo(() => {
    // Additional borrows today from transactions
    const extraTodayBorrows = transactions.filter(t => t.status === 'Borrowed' || t.status === 'Approved').length;

    if (timeRange === '7D') {
      return [
        { label: 'Oct 6', fullDate: 'Oct 6, 2026', value: 19 },
        { label: 'Oct 7', fullDate: 'Oct 7, 2026', value: 24 },
        { label: 'Oct 8', fullDate: 'Oct 8, 2026', value: 22 },
        { label: 'Oct 9', fullDate: 'Oct 9, 2026', value: 28 },
        { label: 'Oct 10', fullDate: 'Oct 10, 2026', value: 25 },
        { label: 'Oct 11', fullDate: 'Oct 11, 2026', value: 31 },
        { label: 'Oct 12', fullDate: 'Today (Oct 12)', value: 33 + extraTodayBorrows },
      ];
    }

    // 30 Days dataset closely matching the screenshot trend
    return [
      { label: 'Sep 1', fullDate: 'Sep 1, 2026', value: 20 },
      { label: 'Sep 4', fullDate: 'Sep 4, 2026', value: 23 },
      { label: 'Sep 8', fullDate: 'Sep 8, 2026', value: 21 },
      { label: 'Sep 11', fullDate: 'Sep 11, 2026', value: 27 },
      { label: 'Sep 14', fullDate: 'Sep 14, 2026', value: 24 },
      { label: 'Sep 18', fullDate: 'Sep 18, 2026', value: 29 },
      { label: 'Sep 21', fullDate: 'Sep 21, 2026', value: 27 },
      { label: 'Sep 24', fullDate: 'Sep 24, 2026', value: 32 },
      { label: 'Sep 27', fullDate: 'Sep 27, 2026', value: 30 },
      { label: 'Sep 29', fullDate: 'Sep 29, 2026', value: 34 },
      { label: 'Sep 30', fullDate: 'Sep 30, 2026', value: 32 },
      { label: 'Oct 12', fullDate: 'Today (Oct 12)', value: 37 + extraTodayBorrows },
    ];
  }, [timeRange, transactions]);

  // Chart Dimensions
  const svgWidth = 320;
  const svgHeight = 130;
  const padLeft = 32;
  const padRight = 16;
  const padTop = 15;
  const padBottom = 28;

  const chartW = svgWidth - padLeft - padRight;
  const chartH = svgHeight - padTop - padBottom;

  const minY = 10;
  const maxY = 45;

  const points = useMemo(() => {
    return data.map((d, index) => {
      const x = padLeft + (index / (data.length - 1)) * chartW;
      const normalizedY = (d.value - minY) / (maxY - minY);
      const y = padTop + (1 - normalizedY) * chartH;
      return { ...d, x, y };
    });
  }, [data, chartW, chartH, padLeft, padTop, minY, maxY]);

  // SVG Line and Area path strings
  const linePath = useMemo(() => {
    if (points.length === 0) return '';
    return points.reduce((acc, pt, idx) => {
      return idx === 0 ? `M ${pt.x} ${pt.y}` : `${acc} L ${pt.x} ${pt.y}`;
    }, '');
  }, [points]);

  const areaPath = useMemo(() => {
    if (points.length === 0) return '';
    const bottomY = padTop + chartH;
    const firstX = points[0].x;
    const lastX = points[points.length - 1].x;
    return `${linePath} L ${lastX} ${bottomY} L ${firstX} ${bottomY} Z`;
  }, [linePath, points, padTop, chartH]);

  const activePoint = activePointIndex !== null ? points[activePointIndex] : null;

  const handlePointerMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const scaleX = svgWidth / rect.width;
    const adjustedX = mouseX * scaleX;

    // Find closest point by X coordinate
    let closestIdx = 0;
    let minDiff = Infinity;
    points.forEach((pt, idx) => {
      const diff = Math.abs(pt.x - adjustedX);
      if (diff < minDiff) {
        minDiff = diff;
        closestIdx = idx;
      }
    });

    setActivePointIndex(closestIdx);
  };

  const handlePointerLeave = () => {
    setActivePointIndex(null);
  };

  // Stats calculation
  const highestValue = Math.max(...data.map(d => d.value));
  const averageValue = Math.round(data.reduce((a, b) => a + b.value, 0) / data.length);

  return (
    <div style={{
      backgroundColor: '#FFFFFF',
      borderRadius: '18px',
      padding: '18px 20px',
      border: '1px solid #E2E8F0',
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
      boxShadow: '0 2px 8px rgba(13, 26, 48, 0.03)'
    }}>
      {/* Header with Title and Interactive Range Switcher */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: '800', color: '#0F1E36', margin: 0 }}>
          {title}
        </h3>

        <div style={{
          display: 'flex',
          backgroundColor: '#F1F5F9',
          borderRadius: '9999px',
          padding: '2px',
          gap: '2px'
        }}>
          <button
            type="button"
            onClick={() => setTimeRange('7D')}
            style={{
              border: 'none',
              background: timeRange === '7D' ? '#FFFFFF' : 'transparent',
              color: timeRange === '7D' ? '#1D61E7' : '#64748B',
              fontSize: '0.725rem',
              fontWeight: '700',
              padding: '3px 10px',
              borderRadius: '9999px',
              cursor: 'pointer',
              boxShadow: timeRange === '7D' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
              transition: 'all 0.15s ease'
            }}
          >
            7 days
          </button>
          <button
            type="button"
            onClick={() => setTimeRange('30D')}
            style={{
              border: 'none',
              background: timeRange === '30D' ? '#FFFFFF' : 'transparent',
              color: timeRange === '30D' ? '#1D61E7' : '#64748B',
              fontSize: '0.725rem',
              fontWeight: '700',
              padding: '3px 10px',
              borderRadius: '9999px',
              cursor: 'pointer',
              boxShadow: timeRange === '30D' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
              transition: 'all 0.15s ease'
            }}
          >
            Last 30 days
          </button>
        </div>
      </div>

      {/* SVG Chart Container */}
      <div
        style={{
          width: '100%',
          height: '140px',
          position: 'relative',
          userSelect: 'none',
          cursor: 'crosshair',
          touchAction: 'none'
        }}
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
        onPointerDown={handlePointerMove}
      >
        {/* Floating Tooltip */}
        {activePoint && (
          <div
            style={{
              position: 'absolute',
              left: `${(activePoint.x / svgWidth) * 100}%`,
              top: `${Math.max(0, (activePoint.y / svgHeight) * 100 - 32)}%`,
              transform: 'translate(-50%, -100%)',
              backgroundColor: '#0F1E36',
              color: '#FFFFFF',
              padding: '5px 10px',
              borderRadius: '8px',
              fontSize: '0.725rem',
              fontWeight: '700',
              whiteSpace: 'nowrap',
              pointerEvents: 'none',
              zIndex: 10,
              boxShadow: '0 4px 12px rgba(15, 30, 54, 0.25)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '2px'
            }}
          >
            <span>{activePoint.fullDate}</span>
            <span style={{ color: '#60A5FA', fontSize: '0.8rem', fontWeight: '800' }}>
              {activePoint.value} borrows
            </span>
            <div style={{
              position: 'absolute',
              bottom: '-4px',
              left: '50%',
              transform: 'translateX(-50%)',
              width: 0,
              height: 0,
              borderLeft: '4px solid transparent',
              borderRight: '4px solid transparent',
              borderTop: '4px solid #0F1E36'
            }} />
          </div>
        )}

        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          style={{ width: '100%', height: '100%', overflow: 'visible' }}
        >
          {/* Horizontal Grid lines */}
          <line x1={padLeft} y1={padTop + (1 - (40 - minY) / (maxY - minY)) * chartH} x2={svgWidth - padRight} y2={padTop + (1 - (40 - minY) / (maxY - minY)) * chartH} stroke="#F1F5F9" strokeWidth="1" />
          <line x1={padLeft} y1={padTop + (1 - (30 - minY) / (maxY - minY)) * chartH} x2={svgWidth - padRight} y2={padTop + (1 - (30 - minY) / (maxY - minY)) * chartH} stroke="#F1F5F9" strokeWidth="1" />
          <line x1={padLeft} y1={padTop + (1 - (20 - minY) / (maxY - minY)) * chartH} x2={svgWidth - padRight} y2={padTop + (1 - (20 - minY) / (maxY - minY)) * chartH} stroke="#F1F5F9" strokeWidth="1" />

          {/* Y-Axis Labels */}
          <text x="6" y={padTop + (1 - (40 - minY) / (maxY - minY)) * chartH + 3} fontSize="8.5" fill="#94A3B8" fontWeight="600">40</text>
          <text x="6" y={padTop + (1 - (30 - minY) / (maxY - minY)) * chartH + 3} fontSize="8.5" fill="#94A3B8" fontWeight="600">30</text>
          <text x="6" y={padTop + (1 - (20 - minY) / (maxY - minY)) * chartH + 3} fontSize="8.5" fill="#94A3B8" fontWeight="600">20</text>

          {/* Gradient Definition */}
          <defs>
            <linearGradient id="borrowChartGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#1D61E7" stopOpacity="0.28" />
              <stop offset="100%" stopColor="#1D61E7" stopOpacity="0.0" />
            </linearGradient>
            <filter id="shadowFilter" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#1D61E7" floodOpacity="0.3" />
            </filter>
          </defs>

          {/* Area Fill */}
          <path d={areaPath} fill="url(#borrowChartGradient)" />

          {/* Line Path */}
          <path
            d={linePath}
            fill="none"
            stroke="#1D61E7"
            strokeWidth="2.75"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Interactive Guide Line when active */}
          {activePoint && (
            <line
              x1={activePoint.x}
              y1={padTop}
              x2={activePoint.x}
              y2={padTop + chartH}
              stroke="#1D61E7"
              strokeWidth="1.2"
              strokeDasharray="3 3"
              opacity="0.8"
            />
          )}

          {/* Data Points */}
          {points.map((pt, idx) => {
            const isHovered = activePointIndex === idx;
            return (
              <circle
                key={idx}
                cx={pt.x}
                cy={pt.y}
                r={isHovered ? 5.5 : 2.5}
                fill="#FFFFFF"
                stroke="#1D61E7"
                strokeWidth={isHovered ? 3 : 2}
                style={{
                  transition: 'r 0.15s ease, stroke-width 0.15s ease',
                  cursor: 'pointer'
                }}
              />
            );
          })}

          {/* X-Axis Labels */}
          {timeRange === '30D' ? (
            <>
              <text x={padLeft + 4} y={svgHeight - 6} fontSize="8.5" fill="#94A3B8" fontWeight="600">Sep 1</text>
              <text x={padLeft + chartW * 0.3} y={svgHeight - 6} fontSize="8.5" fill="#94A3B8" fontWeight="600">Sep 11</text>
              <text x={padLeft + chartW * 0.62} y={svgHeight - 6} fontSize="8.5" fill="#94A3B8" fontWeight="600">Sep 21</text>
              <text x={padLeft + chartW - 24} y={svgHeight - 6} fontSize="8.5" fill="#94A3B8" fontWeight="600">Sep 30</text>
            </>
          ) : (
            <>
              <text x={padLeft} y={svgHeight - 6} fontSize="8.5" fill="#94A3B8" fontWeight="600">Oct 6</text>
              <text x={padLeft + chartW * 0.33} y={svgHeight - 6} fontSize="8.5" fill="#94A3B8" fontWeight="600">Oct 8</text>
              <text x={padLeft + chartW * 0.66} y={svgHeight - 6} fontSize="8.5" fill="#94A3B8" fontWeight="600">Oct 10</text>
              <text x={padLeft + chartW - 20} y={svgHeight - 6} fontSize="8.5" fill="#94A3B8" fontWeight="600">Today</text>
            </>
          )}
        </svg>
      </div>

      {/* Summary Footer Pills */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: '6px',
        borderTop: '1px solid #F1F5F9',
        fontSize: '0.75rem',
        color: '#64748B'
      }}>
        <div>
          <span>Peak: </span>
          <strong style={{ color: '#0F1E36' }}>{highestValue} borrows</strong>
        </div>
        <div>
          <span>Avg: </span>
          <strong style={{ color: '#0F1E36' }}>{averageValue} / day</strong>
        </div>
        <div style={{ color: '#15803D', fontWeight: '700' }}>
          ↑ +18% trend
        </div>
      </div>
    </div>
  );
}
