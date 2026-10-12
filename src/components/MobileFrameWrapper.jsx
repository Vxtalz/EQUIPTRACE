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
  MoreHorizontal
} from 'lucide-react';

export default function MobileFrameWrapper({
  children,
  currentTab,
  onNavigate,
  showBottomNav = true,
  userRole = 'Student',
  darkStatusBar = false,
  pendingRequestsCount = 2
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
          <span>{currentTime}</span>
          <div className="status-bar-icons">
            <Signal size={14} strokeWidth={2.5} />
            <Wifi size={14} strokeWidth={2.5} />
            <Battery size={16} strokeWidth={2.5} />
          </div>
        </div>

        {/* Content Container */}
        <div className="screen-container">
          {children}
        </div>

        {/* Bottom Navigation Bar */}
        {showBottomNav && (
          <div className="bottom-nav" style={{ height: '76px', paddingBottom: '8px' }}>
            {userRole === 'Student' ? (
              /* Student Navigation Bar */
              <>
                <button
                  type="button"
                  className={`bottom-nav-item ${currentTab === 'home' ? 'active' : ''}`}
                  onClick={() => onNavigate('home')}
                >
                  <Home size={22} strokeWidth={currentTab === 'home' ? 2.5 : 2} />
                  <span>Home</span>
                </button>

                <button
                  type="button"
                  className={`bottom-nav-item ${currentTab === 'scan' ? 'active' : ''}`}
                  onClick={() => onNavigate('scan')}
                >
                  <Scan size={22} strokeWidth={currentTab === 'scan' ? 2.5 : 2} />
                  <span>Scan</span>
                </button>

                <button
                  type="button"
                  className={`bottom-nav-item ${currentTab === 'borrowings' ? 'active' : ''}`}
                  onClick={() => onNavigate('borrowings')}
                >
                  <FileText size={22} strokeWidth={currentTab === 'borrowings' ? 2.5 : 2} />
                  <span>Borrowings</span>
                </button>

                <button
                  type="button"
                  className={`bottom-nav-item ${currentTab === 'profile' ? 'active' : ''}`}
                  onClick={() => onNavigate('profile')}
                >
                  <User size={22} strokeWidth={currentTab === 'profile' ? 2.5 : 2} />
                  <span>Profile</span>
                </button>
              </>
            ) : (
              /* Admin Navigation Bar matching Images 2, 3, 4, 5 */
              <>
                <button
                  type="button"
                  className={`bottom-nav-item ${currentTab === 'home' ? 'active' : ''}`}
                  onClick={() => onNavigate('home')}
                  style={{ width: '20%' }}
                >
                  <LayoutGrid size={22} strokeWidth={currentTab === 'home' ? 2.5 : 2} />
                  <span>Home</span>
                </button>

                <button
                  type="button"
                  className={`bottom-nav-item ${currentTab === 'equipment' ? 'active' : ''}`}
                  onClick={() => onNavigate('equipment')}
                  style={{ width: '20%' }}
                >
                  <Package size={22} strokeWidth={currentTab === 'equipment' ? 2.5 : 2} />
                  <span>Equipment</span>
                </button>

                <button
                  type="button"
                  className={`bottom-nav-item ${currentTab === 'requests' ? 'active' : ''}`}
                  onClick={() => onNavigate('requests')}
                  style={{ width: '20%', position: 'relative' }}
                >
                  <ListFilter size={22} strokeWidth={currentTab === 'requests' ? 2.5 : 2} />
                  <span>Requests</span>
                  {pendingRequestsCount > 0 && (
                    <span style={{
                      position: 'absolute',
                      top: '2px',
                      right: '18px',
                      backgroundColor: '#EF4444',
                      color: '#FFFFFF',
                      fontSize: '0.65rem',
                      fontWeight: '800',
                      width: '16px',
                      height: '16px',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: '2px solid #FFFFFF'
                    }}>
                      {pendingRequestsCount}
                    </span>
                  )}
                </button>

                <button
                  type="button"
                  className={`bottom-nav-item ${currentTab === 'analytics' ? 'active' : ''}`}
                  onClick={() => onNavigate('analytics')}
                  style={{ width: '20%' }}
                >
                  <BarChart3 size={22} strokeWidth={currentTab === 'analytics' ? 2.5 : 2} />
                  <span>Analytics</span>
                </button>

                <button
                  type="button"
                  className={`bottom-nav-item ${currentTab === 'more' ? 'active' : ''}`}
                  onClick={() => onNavigate('more')}
                  style={{ width: '20%', position: 'relative' }}
                >
                  <MoreHorizontal size={22} strokeWidth={currentTab === 'more' ? 2.5 : 2} />
                  <span>More</span>
                  <span style={{
                    position: 'absolute',
                    top: '2px',
                    right: '18px',
                    backgroundColor: '#EF4444',
                    color: '#FFFFFF',
                    fontSize: '0.65rem',
                    fontWeight: '800',
                    width: '16px',
                    height: '16px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '2px solid #FFFFFF'
                  }}>
                    1
                  </span>
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
