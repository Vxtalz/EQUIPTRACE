import React, { useState, useMemo } from 'react';

export default function BorrowingTrendChart({
  title = 'Borrowing trend',
  transactions = [],
  borrowings = [],
  history = [],
}) {
  const [timeRange, setTimeRange] = useState('30D'); // '7D' | '30D'
  const [activePointIndex, setActivePointIndex] = useState(null);

  // Generate dataset for every single day leading up to Today (e.g. Oct 19, 2026)
  const data = useMemo(() => {
    const numDays = timeRange === '7D' ? 7 : 30;
    const result = [];
    const now = new Date();

    const allRecords = [
      ...(borrowings || []),
      ...(transactions || []),
      ...(history || []),
    ];

    for (let i = numDays - 1; i >= 0; i--) {
      const targetDate = new Date(now);
      targetDate.setDate(now.getDate() - i);

      const monthName = targetDate.toLocaleDateString('en-US', { month: 'short' });
      const dayNum = targetDate.getDate();
      const year = targetDate.getFullYear();
      const monthNum = targetDate.getMonth() + 1;

      const dateLabel = `${monthName} ${dayNum}`; // e.g. "Oct 19"
      const fullDate = i === 0 ? `Today (${monthName} ${dayNum})` : `${monthName} ${dayNum}, ${year}`;

      const slashPattern = `${monthNum}/${dayNum}/${year}`;
      const isoPattern = `${year}-${String(monthNum).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
      const shortSlash = `${monthNum}/${dayNum}`;

      // Count borrows that occurred on this specific day
      let dayCount = 0;
      allRecords.forEach((item) => {
        const itemDateStr = (item.borrowedDate || item.date || item.requestedDate || '').toString();
        const matchesDate =
          itemDateStr.includes(dateLabel) ||
          itemDateStr.includes(slashPattern) ||
          itemDateStr.includes(isoPattern) ||
          (itemDateStr.includes(shortSlash) && !itemDateStr.includes(`${monthNum}/${dayNum}0`));

        if (matchesDate) {
          dayCount++;
        }
      });

      // If it's today and active borrowings exist
      if (i === 0 && dayCount === 0 && (borrowings || []).length > 0) {
        dayCount = (borrowings || []).length;
      }

      result.push({
        label: dateLabel,
        fullDate,
        value: dayCount,
        isToday: i === 0,
      });
    }

    return result;
  }, [timeRange, borrowings, transactions, history]);

  // Chart Dimensions
  const svgWidth = 320;
  const svgHeight = 130;
  const padLeft = 32;
  const padRight = 16;
  const padTop = 15;
  const padBottom = 28;

  const chartW = svgWidth - padLeft - padRight;
  const chartH = svgHeight - padTop - padBottom;

  const { minY, maxY, tick1, tick2, tick3 } = useMemo(() => {
    const vals = data.map((d) => d.value);
    const maxVal = Math.max(...vals, 0);
    const low = 0;
    const high = Math.max(5, Math.ceil(maxVal * 1.25));
    return {
      minY: low,
      maxY: high,
      tick1: Math.round(high * 0.33),
      tick2: Math.round(high * 0.66),
      tick3: high,
    };
  }, [data]);

  const points = useMemo(() => {
    return data.map((d, index) => {
      const x = padLeft + (index / (data.length - 1)) * chartW;
      const normalizedY = maxY === minY ? 0 : Math.min(1, Math.max(0, (d.value - minY) / (maxY - minY)));
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
  const highestValue = Math.max(...data.map((d) => d.value));
  const totalBorrows = data.reduce((a, b) => a + b.value, 0);
  const averageValue = (totalBorrows / data.length).toFixed(1);

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
              {activePoint.value} {activePoint.value === 1 ? 'borrow' : 'borrows'}
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
          <line x1={padLeft} y1={padTop + (1 - (tick3 - minY) / (maxY - minY)) * chartH} x2={svgWidth - padRight} y2={padTop + (1 - (tick3 - minY) / (maxY - minY)) * chartH} stroke="#F1F5F9" strokeWidth="1" />
          <line x1={padLeft} y1={padTop + (1 - (tick2 - minY) / (maxY - minY)) * chartH} x2={svgWidth - padRight} y2={padTop + (1 - (tick2 - minY) / (maxY - minY)) * chartH} stroke="#F1F5F9" strokeWidth="1" />
          <line x1={padLeft} y1={padTop + (1 - (tick1 - minY) / (maxY - minY)) * chartH} x2={svgWidth - padRight} y2={padTop + (1 - (tick1 - minY) / (maxY - minY)) * chartH} stroke="#F1F5F9" strokeWidth="1" />

          {/* Y-Axis Labels */}
          <text x="6" y={padTop + (1 - (tick3 - minY) / (maxY - minY)) * chartH + 3} fontSize="8.5" fill="#94A3B8" fontWeight="600">{tick3}</text>
          <text x="6" y={padTop + (1 - (tick2 - minY) / (maxY - minY)) * chartH + 3} fontSize="8.5" fill="#94A3B8" fontWeight="600">{tick2}</text>
          <text x="6" y={padTop + (1 - (tick1 - minY) / (maxY - minY)) * chartH + 3} fontSize="8.5" fill="#94A3B8" fontWeight="600">{tick1}</text>

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
              <text x={padLeft} y={svgHeight - 6} fontSize="8" fill="#94A3B8" fontWeight="600">{data[0]?.label}</text>
              <text x={padLeft + chartW * 0.32} y={svgHeight - 6} fontSize="8" fill="#94A3B8" fontWeight="600">{data[10]?.label}</text>
              <text x={padLeft + chartW * 0.65} y={svgHeight - 6} fontSize="8" fill="#94A3B8" fontWeight="600">{data[20]?.label}</text>
              <text x={padLeft + chartW - 24} y={svgHeight - 6} fontSize="8" fill="#94A3B8" fontWeight="600">Today</text>
            </>
          ) : (
            <>
              <text x={padLeft} y={svgHeight - 6} fontSize="8" fill="#94A3B8" fontWeight="600">{data[0]?.label}</text>
              <text x={padLeft + chartW * 0.33} y={svgHeight - 6} fontSize="8" fill="#94A3B8" fontWeight="600">{data[2]?.label}</text>
              <text x={padLeft + chartW * 0.66} y={svgHeight - 6} fontSize="8" fill="#94A3B8" fontWeight="600">{data[4]?.label}</text>
              <text x={padLeft + chartW - 20} y={svgHeight - 6} fontSize="8" fill="#94A3B8" fontWeight="600">Today</text>
            </>
          )}
        </svg>
      </div>

      {/* Summary Footer */}
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
          <strong style={{ color: '#0F1E36' }}>{highestValue} {highestValue === 1 ? 'borrow' : 'borrows'}</strong>
        </div>
        <div>
          <span>Avg: </span>
          <strong style={{ color: '#0F1E36' }}>{averageValue} / day</strong>
        </div>
        <div style={{ color: totalBorrows > 0 ? '#15803D' : '#94A3B8', fontWeight: '700' }}>
          {totalBorrows > 0 ? '↑ Active' : 'No activity'}
        </div>
      </div>
    </div>
  );
}
