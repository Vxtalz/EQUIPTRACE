import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import MobileFrameWrapper from './components/MobileFrameWrapper';
import LoginScreen from './components/LoginScreen';
import HomeScreen from './components/HomeScreen';
import ScanScreen from './components/ScanScreen';
import BorrowingsScreen from './components/BorrowingsScreen';
import ProfileScreen from './components/ProfileScreen';
import BrowseModal from './components/BrowseModal';
import EquipmentDetailModal from './components/EquipmentDetailModal';
import NotificationsModal from './components/NotificationsModal';

// Admin Components
import AdminHome from './components/Admin/AdminHome';
import AdminEquipment from './components/Admin/AdminEquipment';
import AdminRequests from './components/Admin/AdminRequests';
import AdminAnalytics from './components/Admin/AdminAnalytics';
import AdminMore from './components/Admin/AdminMore';
import AddEquipmentModal from './components/Admin/AddEquipmentModal';

import {
  CURRENT_STUDENT,
  INITIAL_EQUIPMENT_LIST,
  INITIAL_BORROWINGS,
  INITIAL_HISTORY,
  INITIAL_NOTIFICATIONS
} from './data/mockData';

import {
  INITIAL_ADMIN_KPIS,
  INITIAL_ADMIN_PENDING_REQUESTS,
  INITIAL_ADMIN_RECENT_TRANSACTIONS,
  INITIAL_ADMIN_EQUIPMENT_LIST
} from './data/adminMockData';

import { api } from './services/api';
import { db } from './services/firebase';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState('Student'); // 'Student' | 'Admin'
  const [currentTab, setCurrentTab] = useState('home'); // Student: home|scan|borrowings|profile. Admin: home|equipment|requests|analytics|more

  // Student State
  const [student, setStudent] = useState(CURRENT_STUDENT);
  const [equipmentList, setEquipmentList] = useState(INITIAL_EQUIPMENT_LIST);
  const [borrowings, setBorrowings] = useState(INITIAL_BORROWINGS);
  const [history, setHistory] = useState(INITIAL_HISTORY);
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);

  // Admin State
  const [adminKpis, setAdminKpis] = useState(INITIAL_ADMIN_KPIS);
  const [adminRequests, setAdminRequests] = useState(INITIAL_ADMIN_PENDING_REQUESTS);
  const [adminRecentTx, setAdminRecentTx] = useState(INITIAL_ADMIN_RECENT_TRANSACTIONS);
  const [adminEquipment, setAdminEquipment] = useState(INITIAL_ADMIN_EQUIPMENT_LIST);

  // Modals & Popups
  const [scannedEquipment, setScannedEquipment] = useState(null);
  const [showBrowse, setShowBrowse] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showAddEquipmentModal, setShowAddEquipmentModal] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Sync with Backend / Firebase on launch
  useEffect(() => {
    async function initData() {
      const serverEquipment = await api.getEquipment();
      if (serverEquipment && serverEquipment.length > 0) {
        setEquipmentList(prev => {
          return serverEquipment.map((item, idx) => ({
            ...item,
            image: prev[idx % prev.length]?.image || 'https://images.unsplash.com/photo-1519766304817-4f37bda74a29?w=300'
          }));
        });
        setAdminEquipment(serverEquipment);
      }

      const serverRequests = await api.getRequests();
      if (serverRequests && serverRequests.length > 0) {
        setAdminRequests(serverRequests);
      }

      const serverTransactions = await api.getTransactions();
      if (serverTransactions && serverTransactions.length > 0) {
        setAdminRecentTx(serverTransactions);
      }

      const analyticsData = await api.getAnalytics();
      if (analyticsData && analyticsData.kpis) {
        setAdminKpis(analyticsData.kpis);
      }
    }
    initData();
  }, []);

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage('');
    }, 3500);
  };

  const handleLogin = ({ role, studentId }) => {
    setUserRole(role);
    setIsLoggedIn(true);
    setCurrentTab('home');

    if (role === 'Student') {
      setStudent({
        ...CURRENT_STUDENT,
        id: studentId || '2025-001'
      });
      triggerToast(`Welcome Student, ${student.name}!`);
    } else {
      triggerToast('Logged in as Admin');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    triggerToast('Logged out successfully');
  };

  // Student Actions
  const handleScanEquipment = (equipment) => {
    setScannedEquipment(equipment);
  };

  const handleConfirmBorrow = async (equipment) => {
    const newBorrowing = {
      borrowId: `BORROW-${Math.floor(1000 + Math.random() * 9000)}`,
      id: equipment.id,
      name: equipment.name,
      category: equipment.category,
      image: equipment.image,
      location: equipment.location,
      borrowedTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    // Call API Checkout Endpoint
    await api.checkoutEquipment({
      equipmentId: equipment.id,
      studentId: student.id,
      studentName: student.name
    });

    setBorrowings([newBorrowing, ...borrowings]);
    setEquipmentList(equipmentList.map(item =>
      item.id === equipment.id ? { ...item, available: Math.max(0, item.available - 1) } : item
    ));

    setNotifications([
      {
        id: Date.now(),
        title: 'Equipment Borrowed',
        message: `You borrowed ${equipment.name} (${equipment.id}). Due today at 5:00 PM.`,
        time: 'Just now',
        unread: true,
      },
      ...notifications
    ]);

    setScannedEquipment(null);
    setShowBrowse(false);
    setCurrentTab('borrowings');

    try {
      confetti({ particleCount: 60, spread: 60, origin: { y: 0.7 } });
    } catch (e) {}

    triggerToast(`Successfully borrowed ${equipment.name}!`);
  };

  const handleReturnEquipment = async (borrowId) => {
    const itemToReturn = borrowings.find(b => b.borrowId === borrowId);
    if (!itemToReturn) return;

    // Call API Return Endpoint
    await api.returnEquipment(borrowId);

    setBorrowings(borrowings.filter(b => b.borrowId !== borrowId));
    setEquipmentList(equipmentList.map(item =>
      item.id === itemToReturn.id ? { ...item, available: item.available + 1 } : item
    ));

    const historyItem = {
      id: `HIST-${Math.floor(1000 + Math.random() * 9000)}`,
      equipmentId: itemToReturn.id,
      name: itemToReturn.name,
      borrowedDate: 'Today',
      returnedDate: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'Returned on time',
      category: itemToReturn.category,
    };
    setHistory([historyItem, ...history]);

    triggerToast(`Returned ${itemToReturn.name}. Thank you!`);
  };

  // Admin Actions
  const handleApproveAdminRequest = async (reqId) => {
    await api.handleRequestAction(reqId, 'approve');

    setAdminRequests(adminRequests.map(req =>
      req.id === reqId ? { ...req, status: 'Approved' } : req
    ));

    setAdminKpis(prev => ({
      ...prev,
      available: prev.available - 1,
      borrowed: prev.borrowed + 1
    }));

    triggerToast('Request Approved successfully');
  };

  const handleRejectAdminRequest = async (reqId) => {
    await api.handleRequestAction(reqId, 'reject');

    setAdminRequests(adminRequests.map(req =>
      req.id === reqId ? { ...req, status: 'Rejected' } : req
    ));

    triggerToast('Request Rejected');
  };

  const handleAddAdminEquipment = async (newItem) => {
    await api.addEquipment(newItem);

    setAdminEquipment([newItem, ...adminEquipment]);
    setAdminKpis(prev => ({
      ...prev,
      totalEquipment: prev.totalEquipment + 1,
      available: prev.available + 1
    }));
    triggerToast(`Added ${newItem.name} to inventory!`);
  };

  const pendingRequestsCount = adminRequests.filter(r => r.status === 'Pending').length;

  return (
    <MobileFrameWrapper
      currentTab={currentTab}
      onNavigate={(tab) => setCurrentTab(tab)}
      showBottomNav={isLoggedIn}
      userRole={userRole}
      darkStatusBar={userRole === 'Student' && currentTab === 'scan' && isLoggedIn}
      pendingRequestsCount={pendingRequestsCount}
    >
      {/* Toast Alert */}
      {toastMessage && (
        <div className="toast-container">
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Screen Routing */}
      {!isLoggedIn ? (
        <LoginScreen onLogin={handleLogin} />
      ) : userRole === 'Student' ? (
        /* Student UI Views */
        <>
          {currentTab === 'home' && (
            <HomeScreen
              student={student}
              unreadCount={notifications.filter(n => n.unread).length}
              onNavigate={(tab) => setCurrentTab(tab)}
              onOpenNotifications={() => setShowNotifications(true)}
              onOpenBrowse={() => setShowBrowse(true)}
            />
          )}

          {currentTab === 'scan' && (
            <ScanScreen
              onBack={() => setCurrentTab('home')}
              onScanEquipment={handleScanEquipment}
              equipmentList={equipmentList}
            />
          )}

          {currentTab === 'borrowings' && (
            <BorrowingsScreen
              onBack={() => setCurrentTab('home')}
              borrowings={borrowings}
              history={history}
              onReturnEquipment={handleReturnEquipment}
            />
          )}

          {currentTab === 'profile' && (
            <ProfileScreen
              student={student}
              activeCount={borrowings.length}
              historyCount={history.length}
              onBack={() => setCurrentTab('home')}
              onLogout={handleLogout}
            />
          )}

          {scannedEquipment && (
            <EquipmentDetailModal
              equipment={scannedEquipment}
              onClose={() => setScannedEquipment(null)}
              onConfirmBorrow={handleConfirmBorrow}
            />
          )}

          {showBrowse && (
            <BrowseModal
              equipmentList={equipmentList}
              onClose={() => setShowBrowse(false)}
              onSelectEquipment={(item) => setScannedEquipment(item)}
            />
          )}

          {showNotifications && (
            <NotificationsModal
              notifications={notifications}
              onClose={() => setShowNotifications(false)}
              onClearUnread={() => setNotifications(notifications.map(n => ({ ...n, unread: false })))}
            />
          )}
        </>
      ) : (
        /* Admin UI Views matching Images 2, 3, 4, 5 */
        <>
          {currentTab === 'home' && (
            <AdminHome
              kpis={adminKpis}
              pendingRequests={adminRequests}
              recentTransactions={adminRecentTx}
              onApproveRequest={handleApproveAdminRequest}
              onRejectRequest={handleRejectAdminRequest}
              onNavigateTab={(tab) => setCurrentTab(tab)}
            />
          )}

          {currentTab === 'equipment' && (
            <AdminEquipment
              equipmentList={adminEquipment}
              onOpenAddModal={() => setShowAddEquipmentModal(true)}
            />
          )}

          {currentTab === 'requests' && (
            <AdminRequests
              requests={adminRequests}
              onApproveRequest={handleApproveAdminRequest}
              onRejectRequest={handleRejectAdminRequest}
            />
          )}

          {currentTab === 'analytics' && (
            <AdminAnalytics
              kpis={adminKpis}
              equipmentList={adminEquipment}
              transactions={adminRecentTx}
            />
          )}

          {currentTab === 'more' && (
            <AdminMore onLogout={handleLogout} />
          )}

          {showAddEquipmentModal && (
            <AddEquipmentModal
              onClose={() => setShowAddEquipmentModal(false)}
              onAddEquipment={handleAddAdminEquipment}
            />
          )}
        </>
      )}
    </MobileFrameWrapper>
  );
}
