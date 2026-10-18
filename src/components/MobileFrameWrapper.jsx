import React, { useState, useEffect } from 'react';
import {
  Home,
  Scan,
  FileText,
  User,
  Wifi,
  Battery,
  Signal,
  Smartphone,
  Maximize2,
  LayoutGrid,
  Package,
  ListFilter,
  BarChart3,
  Bell,
  RotateCcw,
  Clock
} from 'lucide-react';

export default function MobileFrameWrapper({
  children,
  modals = null,
  isModalOpen = false,
  currentTab,
  onNavigate,
  showBottomNav = true,
  userRole = 'Student',
  darkStatusBar = false,
  pendingRequestsCount = 0,
  pendingReturnsCount = 0,
  activePushBanner = null,
  onDismissPushBanner,
}) {
  const [currentTime, setCurrentTime] = useState('9:41');
  const [isFullView, setIsFullView] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      const d = new Date();
      const hours = d.getHours() % 12 || 12;
      const mins = d.getMinutes().toString().padStart(2, '0');
      setCurrentTime(`${hours}:${mins}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="app-viewport-wrapper">
      {/* View Toggle Bar */}
      <div className="device-frame-toggle-bar">
        <span style={{ fontWeight: '600' }}>
          EQUIPTRACE {userRole === 'Admin' ? 'Admin UI' : 'Student UI'}
        </span>
        <button
          type="button"
          className="device-frame-toggle-btn"
          onClick={() => setIsFullView(!isFullView)}
        >
          {isFullView ? <Smartphone size={14} /> : <Maximize2 size={14} />}
          {isFullView ? 'Mobile Frame View' : 'Full Screen View'}
        </button>
      </div>

      {/* Mobile Device Shell */}
      <div className={`mobile-device-shell ${isFullView ? 'full-view' : ''}`}>
        {/* Status Bar */}
        <div className={`status-bar ${darkStatusBar ? 'dark-theme' : ''}`}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span>{currentTime}</span>
            {activePushBanner && (
              <span
                style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  backgroundColor: '#1D61E7',
                  display: 'inline-block',
                }}
              />
            )}
          </div>
          <div className="status-bar-icons">
            <Signal size={14} strokeWidth={2.5} />
            <Wifi size={14} strokeWidth={2.5} />
            <Battery size={16} strokeWidth={2.5} />
          </div>
        </div>

        {/* ── Slide-down Phone Notification Banner ── */}
        {activePushBanner && (
          <div
            onClick={onDismissPushBanner}
            style={{
              position: 'absolute',
              top: '42px',
              left: '12px',
              right: '12px',
              zIndex: 120,
              backgroundColor: 'rgba(15, 23, 42, 0.94)',
              color: '#FFFFFF',
              borderRadius: '16px',
              padding: '12px 14px',
              boxShadow: '0 12px 30px rgba(0,0,0,0.35)',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '12px',
              backdropFilter: 'blur(10px)',
              cursor: 'pointer',
              border: '1px solid rgba(255,255,255,0.12)',
              animation: 'slideDownBanner 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          >
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                backgroundColor: '#1D61E7',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                marginTop: '1px',
              }}
            >
              <Bell size={18} color="#FFFFFF" strokeWidth={2.5} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2px' }}>
                <span style={{ fontSize: '0.72rem', fontWeight: '800', color: '#93C5FD', letterSpacing: '0.3px', textTransform: 'uppercase' }}>
                  EQUIPTRACE
                </span>
                <span style={{ fontSize: '0.68rem', color: '#94A3B8' }}>now</span>
              </div>
              <h5 style={{ fontSize: '0.86rem', fontWeight: '800', color: '#FFFFFF', margin: 0, lineHeight: '1.2' }}>
                {activePushBanner.title}
              </h5>
              <p style={{ fontSize: '0.76rem', color: '#CBD5E1', margin: '3px 0 0 0', lineHeight: '1.3' }}>
                {activePushBanner.message}
              </p>
            </div>
          </div>
        )}

        {/* Content Container */}
        <div
          className={`screen-container ${showBottomNav ? 'has-floating-nav' : ''} ${isModalOpen ? 'modal-open' : ''}`}
          style={isModalOpen ? { overflow: 'hidden' } : {}}
        >
          {children}
        </div>

        {/* Floating Pill Navigation Bar (Matching Pic 2) */}
        {showBottomNav && (
          <nav className="bottom-nav-floating" aria-label="Main Navigation">
            {userRole === 'Student' ? (
              /* Student Navigation Bar */
              <>
                <button
                  type="button"
                  title="Home"
                  className={`floating-nav-btn ${currentTab === 'home' ? 'active' : ''}`}
                  onClick={() => onNavigate('home')}
                  style={{ flex: 1, maxWidth: '72px' }}
                >
                  <Home size={22} strokeWidth={currentTab === 'home' ? 2.5 : 2} />
                </button>

                <button
                  type="button"
                  title="Scan QR"
                  className={`floating-nav-btn ${currentTab === 'scan' ? 'active' : ''}`}
                  onClick={() => onNavigate('scan')}
                  style={{ flex: 1, maxWidth: '72px' }}
                >
                  <Scan size={22} strokeWidth={currentTab === 'scan' ? 2.5 : 2} />
                </button>

                <button
                  type="button"
                  title="Borrowings"
                  className={`floating-nav-btn ${currentTab === 'borrowings' ? 'active' : ''}`}
                  onClick={() => onNavigate('borrowings')}
                  style={{ flex: 1, maxWidth: '72px' }}
                >
                  <Clock size={22} strokeWidth={currentTab === 'borrowings' ? 2.5 : 2} />
                </button>

                <button
                  type="button"
                  title="Profile"
                  className={`floating-nav-btn ${currentTab === 'profile' ? 'active' : ''}`}
                  onClick={() => onNavigate('profile')}
                  style={{ flex: 1, maxWidth: '72px' }}
                >
                  <User size={22} strokeWidth={currentTab === 'profile' ? 2.5 : 2} />
                </button>
              </>
            ) : (
              /* Admin Navigation Bar matching Pic 2 */
              <>
                <button
                  type="button"
                  title="Overview"
                  className={`floating-nav-btn ${currentTab === 'home' ? 'active' : ''}`}
                  onClick={() => onNavigate('home')}
                  style={{ flex: 1, maxWidth: '64px' }}
                >
                  <LayoutGrid size={20} strokeWidth={currentTab === 'home' ? 2.5 : 2} />
                </button>

                <button
                  type="button"
                  title="Equipment Inventory"
                  className={`floating-nav-btn ${currentTab === 'equipment' ? 'active' : ''}`}
                  onClick={() => onNavigate('equipment')}
                  style={{ flex: 1, maxWidth: '64px' }}
                >
                  <Package size={20} strokeWidth={currentTab === 'equipment' ? 2.5 : 2} />
                </button>

                <button
                  type="button"
                  title="Borrow Requests"
                  className={`floating-nav-btn ${currentTab === 'requests' ? 'active' : ''}`}
                  onClick={() => onNavigate('requests')}
                  style={{ flex: 1, maxWidth: '64px', position: 'relative' }}
                >
                  <ListFilter size={20} strokeWidth={currentTab === 'requests' ? 2.5 : 2} />
                  {pendingRequestsCount > 0 && (
                    <span
                      style={{
                        position: 'absolute',
                        top: '4px',
                        right: '6px',
                        backgroundColor: '#EF4444',
                        color: '#FFFFFF',
                        fontSize: '0.62rem',
                        fontWeight: '800',
                        minWidth: '16px',
                        height: '16px',
                        borderRadius: '9999px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '0 3px',
                        border: '2px solid #FFFFFF',
                        boxShadow: '0 2px 4px rgba(239, 68, 68, 0.4)',
                      }}
                    >
                      {pendingRequestsCount}
                    </span>
                  )}
                </button>

                {/* Return Approval Tab (Directly on Admin Nav Bar) */}
                <button
                  type="button"
                  title="Return Approval"
                  className={`floating-nav-btn ${currentTab === 'return-approval' ? 'active' : ''}`}
                  onClick={() => onNavigate('return-approval')}
                  style={{ flex: 1, maxWidth: '64px', position: 'relative' }}
                >
                  <RotateCcw size={20} strokeWidth={currentTab === 'return-approval' ? 2.5 : 2} />
                  {pendingReturnsCount > 0 && (
                    <span
                      style={{
                        position: 'absolute',
                        top: '4px',
                        right: '6px',
                        backgroundColor: '#EF4444',
                        color: '#FFFFFF',
                        fontSize: '0.62rem',
                        fontWeight: '800',
                        minWidth: '16px',
                        height: '16px',
                        borderRadius: '9999px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '0 3px',
                        border: '2px solid #FFFFFF',
                        boxShadow: '0 2px 4px rgba(239, 68, 68, 0.4)',
                      }}
                    >
                      {pendingReturnsCount}
                    </span>
                  )}
                </button>

                <button
                  type="button"
                  title="Analytics"
                  className={`floating-nav-btn ${currentTab === 'analytics' ? 'active' : ''}`}
                  onClick={() => onNavigate('analytics')}
                  style={{ flex: 1, maxWidth: '64px' }}
                >
                  <BarChart3 size={20} strokeWidth={currentTab === 'analytics' ? 2.5 : 2} />
                </button>
              </>
            )}
          </nav>
        )}

        {/* ── Modals & Overlays (Pinned to device shell, immune to inner page scrolling) ── */}
        {modals}
      </div>
    </div>
  );
}
