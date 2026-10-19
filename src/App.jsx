import React, { useState, useEffect, useRef } from 'react';
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
import AdminReturnApproval from './components/Admin/AdminReturnApproval';
import AddEquipmentModal from './components/Admin/AddEquipmentModal';

// Firebase Auth
import { auth, onAuthStateChanged, signOut } from './services/firebase';

// Firestore Service
import {
  subscribeEquipment,
  subscribeBorrowings,
  subscribeHistory,
  subscribeRequests,
  subscribeReturnApprovals,
  subscribeTransactions,
  subscribeNotifications,
  addBorrowing,
  updateBorrowing,
  deleteBorrowing,
  addHistory,
  updateEquipment,
  addRequest,
  updateRequest,
  submitReturnPending,
  approveReturnSubmission,
  flagReturnForInspection,
  addTransaction,
  addNotification,
  markNotificationsRead,
  addEquipment as fsAddEquipment,
  seedEquipmentIfEmpty,
  getUserProfile,
  upsertUserProfile,
} from './services/firestoreService';

// Fallback mock data (used only if Firestore collections are empty on first load)
import {
  CURRENT_STUDENT,
  INITIAL_EQUIPMENT_LIST,
  INITIAL_NOTIFICATIONS,
  CATEGORY_IMAGES,
  normalizeEquipmentCategory,
  getSportImage,
} from './data/mockData';

import {
  INITIAL_ADMIN_KPIS,
  INITIAL_ADMIN_PENDING_REQUESTS,
  INITIAL_ADMIN_RECENT_TRANSACTIONS,
  INITIAL_ADMIN_RETURN_APPROVALS,
} from './data/adminMockData';

export default function App() {
  // ── Auth state ──────────────────────────────────────────────────────────────
  const [authUser, setAuthUser] = useState(null);   // Firebase user object
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState('Student');
  const [currentTab, setCurrentTab] = useState('home');
  const [authReady, setAuthReady] = useState(false); // loading until auth resolves

  // ── Student state ────────────────────────────────────────────────────────────
  const [student, setStudent] = useState(CURRENT_STUDENT);
  const [equipmentList, setEquipmentList] = useState(INITIAL_EQUIPMENT_LIST);
  const [borrowings, setBorrowings] = useState([]);
  const [history, setHistory] = useState([]);
  const [notifications, setNotifications] = useState([]);

  // ── Admin state ──────────────────────────────────────────────────────────────
  const [adminKpis, setAdminKpis] = useState(INITIAL_ADMIN_KPIS);
  const [adminRequests, setAdminRequests] = useState(INITIAL_ADMIN_PENDING_REQUESTS);
  const [adminRecentTx, setAdminRecentTx] = useState(INITIAL_ADMIN_RECENT_TRANSACTIONS);
  const [adminEquipment, setAdminEquipment] = useState(INITIAL_EQUIPMENT_LIST);
  const [adminReturnApprovals, setAdminReturnApprovals] = useState(INITIAL_ADMIN_RETURN_APPROVALS);
  const [adminDismissedReadIds, setAdminDismissedReadIds] = useState(() => new Set());

  // ── Modals ───────────────────────────────────────────────────────────────────
  const [scannedEquipment, setScannedEquipment] = useState(null);
  const [showBrowse, setShowBrowse] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showAddEquipmentModal, setShowAddEquipmentModal] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [activePushBanner, setActivePushBanner] = useState(null);

  // Keep unsubscribe refs so we can clean up on logout
  const unsubRefs = useRef([]);

  // ── Helpers ───────────────────────────────────────────────────────────────────
  const triggerPushBanner = (banner) => {
    setActivePushBanner(banner);
    setTimeout(() => {
      setActivePushBanner((current) => (current === banner ? null : current));
    }, 4500);
  };

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  const clearAllSubs = () => {
    unsubRefs.current.forEach((unsub) => { try { unsub(); } catch (e) {} });
    unsubRefs.current = [];
  };

  // ── Firebase Auth listener ────────────────────────────────────────────────────
  useEffect(() => {
    // Fallback safety timeout so app never gets stuck on splash screen
    const safetyTimer = setTimeout(() => {
      setAuthReady(true);
    }, 3500);

    const unsub = onAuthStateChanged(
      auth,
      async (user) => {
        clearTimeout(safetyTimer);
        if (user) {
          setAuthUser(user);
          setIsLoggedIn(true);
          const email = user.email || '';

          // Strictly identify Admin accounts by email pattern
          const isAdminEmail =
            email.toLowerCase().includes('@equiptrace-admin.edu') ||
            email.toLowerCase().startsWith('admin@') ||
            email.toLowerCase() === 'admin@gmail.com';

          let userRoleResolved = isAdminEmail ? 'Admin' : 'Student';

          // Safely load profile from Firestore with timeout protection
          try {
            const profile = await Promise.race([
              getUserProfile(user.uid),
              new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 3000)),
            ]);

            if (profile) {
              // Strict enforcement: Student accounts are NEVER permitted as Admin
              if (profile.role === 'Student') {
                userRoleResolved = 'Student';
              } else if (profile.role === 'Admin') {
                userRoleResolved = 'Admin';
              }

              const displayName = profile.name || (profile.firstName && profile.surname ? `${profile.firstName} ${profile.surname}` : user.displayName) || profile.studentId || user.email?.split('@')[0] || 'Student';

              setStudent({
                id: profile.studentId || user.email?.split('@')[0] || '2025-001',
                name: displayName,
                course: profile.course || 'BS Physical Education',
                yearLevel: profile.yearLevel || '3rd Year',
                email: user.email,
              });
            } else {
              const fallbackId = user.email?.split('@')[0] || '2025-001';
              setStudent((prev) => ({
                ...prev,
                id: fallbackId,
                name: prev.name && prev.name !== 'Juan Dela Cruz' ? prev.name : fallbackId,
                email: user.email,
              }));
            }
          } catch (e) {
            console.warn('[Firestore] Profile fetch skipped or timed out:', e.message);
            const fallbackId = user.email?.split('@')[0] || '2025-001';
            setStudent((prev) => ({
              ...prev,
              id: fallbackId,
              name: prev.name && prev.name !== 'Juan Dela Cruz' ? prev.name : fallbackId,
              email: user.email,
            }));
          }

          setUserRole(userRoleResolved);
          attachFirestoreListeners(user, userRoleResolved);
        } else {
          // Logged out — clean up
          localStorage.removeItem('equiptrace_role');
          setAuthUser(null);
          setIsLoggedIn(false);
          clearAllSubs();
          // Reset state
          setEquipmentList(INITIAL_EQUIPMENT_LIST);
          setBorrowings([]);
          setHistory([]);
          setNotifications([]);
          setAdminRequests([]);
          setAdminRecentTx([]);
          setAdminEquipment([]);
        }
        setAuthReady(true);
      },
      (error) => {
        console.error('[Firebase Auth Error]', error);
        clearTimeout(safetyTimer);
        setAuthReady(true);
      }
    );

    return () => {
      clearTimeout(safetyTimer);
      unsub();
    };
  }, []);

  // ── Firestore real-time subscriptions ────────────────────────────────────────
  function attachFirestoreListeners(user, role) {
    clearAllSubs();

    // Auto-seed items to Firestore database if it was just created
    seedEquipmentIfEmpty(INITIAL_EQUIPMENT_LIST);

    // Equipment (all roles)
    const unsubEq = subscribeEquipment((items) => {
      const map = new Map();
      INITIAL_EQUIPMENT_LIST.forEach((item) => {
        const key = (item.id || item.code || '').replace('#', '').trim().toUpperCase();
        map.set(key, { ...item });
      });

      items.forEach((item) => {
        const key = (item.id || item.code || item.firestoreId || '').replace('#', '').trim().toUpperCase();
        const base = map.get(key) || {};
        map.set(key, { ...base, ...item });
      });

      const enrichedItems = Array.from(map.values()).map((item) => {
        const category = normalizeEquipmentCategory(item);
        return {
          ...item,
          category,
          available: item.available !== undefined ? item.available : (item.status === 'Available' ? 5 : 0),
          total: item.total || 5,
          image: getSportImage({ ...item, category }),
        };
      });

      setEquipmentList(enrichedItems);
      if (role === 'Admin') setAdminEquipment(enrichedItems);
    });
    unsubRefs.current.push(unsubEq);

    if (role === 'Student') {
      const uid = user.uid;

      // Active borrowings
      const unsubBorrow = subscribeBorrowings(uid, (rows) => setBorrowings(rows));
      unsubRefs.current.push(unsubBorrow);

      // Return history
      const unsubHist = subscribeHistory(uid, (rows) => setHistory(rows));
      unsubRefs.current.push(unsubHist);

      // Notifications
      const unsubNotif = subscribeNotifications(uid, (rows) => setNotifications(rows));
      unsubRefs.current.push(unsubNotif);

    } else {
      // Admin
      const unsubBorrow = subscribeBorrowings(null, (rows) => setBorrowings(rows));
      unsubRefs.current.push(unsubBorrow);

      const unsubReq = subscribeRequests((rows) => {
        setAdminRequests(rows && rows.length > 0 ? rows : INITIAL_ADMIN_PENDING_REQUESTS);
        // Recompute KPIs from live equipment
        setAdminKpis((prev) => ({ ...prev }));
      });
      unsubRefs.current.push(unsubReq);

      const unsubTx = subscribeTransactions((rows) =>
        setAdminRecentTx(rows && rows.length > 0 ? rows : INITIAL_ADMIN_RECENT_TRANSACTIONS)
      );
      unsubRefs.current.push(unsubTx);

      const unsubReturns = subscribeReturnApprovals((rows) =>
        setAdminReturnApprovals(rows && rows.length > 0 ? rows : INITIAL_ADMIN_RETURN_APPROVALS)
      );
      unsubRefs.current.push(unsubReturns);

      // Subscribe to all notifications for Admin
      const unsubNotif = subscribeNotifications(null, (rows) => setNotifications(rows));
      unsubRefs.current.push(unsubNotif);
    }
  }

  // Recompute admin KPIs whenever equipment or borrowings change in real time
  useEffect(() => {
    if (userRole !== 'Admin') return;
    const eqList = adminEquipment.length > 0 ? adminEquipment : equipmentList;
    const total = eqList.reduce((s, e) => s + (Number(e.total) || 4), 0);

    const activeBorrowedCount = borrowings.filter(
      (b) =>
        b.status === 'Borrowed' ||
        b.status === 'Active' ||
        b.status === 'Return Pending' ||
        b.status === 'Pending Approval'
    ).length;

    const overdueCount = borrowings.filter((b) => b.status === 'Overdue').length;
    const available = Math.max(0, total - activeBorrowedCount);

    setAdminKpis({
      totalEquipment: total || 248,
      available,
      borrowed: activeBorrowedCount,
      overdue: overdueCount,
    });
  }, [adminEquipment, equipmentList, borrowings, userRole]);

  // ── Login callback (called by LoginScreen after Firebase Auth succeeds) ───────
  const handleLogin = async ({ role, studentId, uid, email, profileData }) => {
    localStorage.setItem('equiptrace_role', role);
    setUserRole(role);
    setIsLoggedIn(true);
    setCurrentTab('home');

    if (profileData) {
      const displayName =
        profileData.name ||
        (profileData.firstName && profileData.surname
          ? `${profileData.firstName} ${profileData.surname}`
          : profileData.studentId || studentId);

      triggerToast(role === 'Admin' ? 'Logged in as Admin' : `Welcome, ${profileData.firstName || displayName}!`);
      setStudent({
        id: profileData.studentId || studentId,
        name: displayName,
        course: profileData.course || 'BS Physical Education',
        yearLevel: profileData.yearLevel || '3rd Year',
        email: email || profileData.email,
      });
    } else {
      triggerToast(role === 'Admin' ? 'Logged in as Admin' : `Welcome, ${studentId}!`);
      setStudent((prev) => ({
        ...prev,
        id: studentId || prev.id,
        name: studentId || prev.name,
        email: email || prev.email,
      }));

      // Only upsert basic role/id if profile didn't exist yet
      if (uid) {
        await upsertUserProfile(uid, {
          studentId,
          email,
          role,
        });
      }
    }
  };

  // ── Logout ───────────────────────────────────────────────────────────────────
  const handleLogout = async () => {
    clearAllSubs();
    await signOut(auth);
    triggerToast('Logged out successfully.');
  };

  // ── Student: Borrow ──────────────────────────────────────────────────────────
  const handleScanEquipment = (equipment) => setScannedEquipment(equipment);

  const handleConfirmBorrow = async (equipment, borrowDetails = {}) => {
    const borrowId = `BORROW-${Math.floor(1000 + Math.random() * 9000)}`;
    const returnDate = borrowDetails.returnDate || new Date().toISOString().split('T')[0];
    const returnTime = borrowDetails.returnTime || '17:00';
    const purpose = borrowDetails.purpose || 'PE Class Activity';
    const formattedReturnBy = borrowDetails.formattedReturnBy || 'Today, 5:00 PM';

    const currentUid = authUser?.uid || student?.id || 'student-uid';
    const currentStudentNumber = student?.id || (authUser?.email ? authUser.email.split('@')[0] : '2025-001');
    const currentStudentName = student?.name || 'Student';

    // 1. Create Borrowing record with status 'Pending Approval'
    const borrowRecord = {
      borrowId,
      id:                 equipment.id,
      name:               equipment.name,
      category:           equipment.category,
      image:              equipment.image || '',
      location:           equipment.location || '',
      borrowedDate:       new Date().toLocaleDateString(),
      borrowedTime:       new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      expectedReturnDate: returnDate,
      expectedReturnTime: returnTime,
      returnBy:           formattedReturnBy,
      purpose:            purpose,
      studentId:          currentUid,
      studentNumber:      currentStudentNumber,
      studentName:        currentStudentName,
      studentCourse:      student?.course || '',
      studentYearLevel:   student?.yearLevel || '',
      status:             'Pending Approval',
    };

    // Optimistically update local borrowings immediately
    setBorrowings((prev) => [borrowRecord, ...prev.filter((b) => b.borrowId !== borrowId)]);

    // 2. Submit formal Request into the Admin 'requests' collection
    const reqRecord = {
      id:                 `REQ-${Date.now()}`,
      borrowingDocId:     '',
      borrowId:           borrowId,
      studentId:          currentStudentNumber,
      studentUid:         currentUid,
      studentName:        currentStudentName,
      studentCourse:      student?.course || '',
      studentYearLevel:   student?.yearLevel || '',
      studentInitials:    currentStudentName
        .split(' ')
        .map((n) => n[0])
        .join('')
        .slice(0, 2)
        .toUpperCase(),
      equipmentId:        equipment.id,
      equipmentDocId:     equipment.firestoreId || '',
      equipmentName:      equipment.name,
      equipmentCode:      equipment.code || equipment.id,
      icon:               equipment.name?.toLowerCase().includes('volley') ? '🏐' : equipment.name?.toLowerCase().includes('basket') ? '🏀' : '⚽',
      requestedDate:      new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      expectedReturnDate: returnDate,
      expectedReturnTime: returnTime,
      returnBy:           formattedReturnBy,
      purpose:            purpose,
      status:             'Pending',
    };

    // Optimistically update local adminRequests immediately
    setAdminRequests((prev) => [reqRecord, ...prev.filter((r) => r.borrowId !== borrowId)]);

    // 3. Student Notification
    const notifPayload = {
      studentId: currentUid,
      title:     'Borrow Request Submitted',
      message:   `Your request for ${equipment.name} (${equipment.id}) was sent. Due by ${formattedReturnBy}.`,
      time:      'Just now',
    };
    setNotifications((prev) => [notifPayload, ...prev]);
    triggerPushBanner(notifPayload);
    try { confetti({ particleCount: 60, spread: 60, origin: { y: 0.7 } }); } catch (e) {}

    // 4. Background persist to Firestore (does not block UI or throw)
    try {
      const borrowingDocId = await addBorrowing(borrowRecord);
      if (borrowingDocId) {
        reqRecord.borrowingDocId = borrowingDocId;
        setBorrowings((prev) =>
          prev.map((b) => (b.borrowId === borrowId ? { ...b, firestoreId: borrowingDocId } : b))
        );
      }
      await addRequest(reqRecord);
      await addNotification(notifPayload);
      await addNotification({
        studentId: 'admin',
        title:     'New Borrow Request',
        message:   `${currentStudentName} requested ${equipment.name} (${equipment.id}). Due ${formattedReturnBy}.`,
        time:      'Just now',
        category:  'request',
      });
    } catch (err) {
      console.warn('[Firestore] Background borrow sync warning (offline fallback applied):', err);
    }
  };

  // ── Student: Submit Return (enters 'Return Pending') ────────────────────────
  const handleReturnEquipment = async (borrowId) => {
    const item = borrowings.find((b) => b.borrowId === borrowId);
    if (!item) return;

    // Immediately update local borrowings optimistically
    setBorrowings((prev) =>
      prev.map((b) => (b.borrowId === borrowId ? { ...b, status: 'Return Pending' } : b))
    );

    const todayDate = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date());
    const todayTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newReturnRecord = {
      id: `RET-${Date.now()}`,
      borrowId: item.borrowId,
      borrowingDocId: item.firestoreId || '',
      equipmentId: item.id,
      equipmentName: item.name,
      category: item.category || 'PE & Sports',
      studentId: item.studentId || (student ? student.id : '2025-001'),
      studentName: item.studentName || (student ? student.name : 'Student'),
      borrowedTime: item.borrowedTime || 'Today',
      returnSubmittedTime: todayTime,
      returnSubmittedDate: todayDate,
      status: 'Return Pending',
      condition: 'Good Condition',
      notes: '',
    };

    setAdminReturnApprovals((prev) => [
      newReturnRecord,
      ...prev.filter((r) => r.borrowId !== item.borrowId),
    ]);

    // Enter Return Pending status in Firestore
    try {
      await submitReturnPending(item);
    } catch (e) {
      console.warn('submitReturnPending error:', e.message);
    }

    const pendingNotif = {
      studentId: authUser?.uid || 'all',
      title: 'Return Submitted',
      message: `You handed in ${item.name}. Status is now "Return Pending" awaiting admin physical inspection.`,
      time: 'Just now',
    };
    try {
      await addNotification(pendingNotif);
    } catch (e) {}
    triggerPushBanner(pendingNotif);

    triggerToast(`Submitted return for ${item.name}. Awaiting admin approval.`);
  };

  // ── Admin: Return Approval Workflow Handlers ──────────────────────────────────
  const handleApproveReturn = async (approvalData) => {
    const adminName = student?.name || authUser?.displayName || authUser?.email?.split('@')[0] || 'Administrator';
    const adminUid = authUser?.uid || '';
    const today = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date());

    // 1. Optimistically update local return_approvals
    setAdminReturnApprovals((prev) =>
      prev.map((r) =>
        r.firestoreId === approvalData.returnDocId || r.id === approvalData.returnDocId || r.borrowId === approvalData.borrowId
          ? { ...r, status: 'Returned', condition: approvalData.condition || 'Good Condition' }
          : r
      )
    );

    // 2. Optimistically remove from active borrowings
    setBorrowings((prev) =>
      prev.filter(
        (b) =>
          b.borrowId !== approvalData.borrowId &&
          b.firestoreId !== approvalData.borrowingDocId
      )
    );

    // 3. Optimistically add to history
    const historyItem = {
      id: `HIST-${Date.now()}`,
      studentId: approvalData.studentId,
      equipmentId: approvalData.equipmentId,
      name: approvalData.equipmentName,
      borrowedDate: 'Previous',
      returnedDate: `${today} ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
      status: approvalData.condition === 'Good Condition' ? 'Returned on time' : `Returned (${approvalData.condition})`,
      condition: approvalData.condition || 'Good Condition',
      notes: approvalData.notes || '',
      approvedBy: adminName,
    };
    setHistory((prev) => [historyItem, ...prev]);

    // 4. Optimistically add to transactions ledger
    const txItem = {
      id: `TX-${Date.now()}`,
      studentName: approvalData.studentName,
      studentId: approvalData.studentId || '',
      studentInitials: approvalData.studentName ? approvalData.studentName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() : 'ST',
      equipment: `${approvalData.equipmentName} (${approvalData.equipmentId})`,
      equipmentName: approvalData.equipmentName,
      equipmentId: approvalData.equipmentId,
      date: today,
      status: 'Returned',
    };
    setAdminRecentTx((prev) => [txItem, ...prev]);

    // 5. Optimistically update adminRequests if matching
    setAdminRequests((prev) =>
      prev.map((r) =>
        (r.studentName === approvalData.studentName && (r.equipmentName === approvalData.equipmentName || r.equipmentId === approvalData.equipmentId))
          ? { ...r, status: 'Returned' }
          : r
      )
    );

    // 6. Restock equipment count
    setAdminEquipment((prev) =>
      prev.map((eq) =>
        (eq.id || '').toUpperCase() === (approvalData.equipmentId || '').toUpperCase()
          ? { ...eq, available: (eq.available || 0) + 1 }
          : eq
      )
    );

    // 7. Persist to Firestore
    try {
      if (!approvalData.returnDocId) {
        const newReturnDocId = await submitReturnPending({
          borrowId: approvalData.borrowId || `BORROW-${Date.now()}`,
          firestoreId: approvalData.borrowingDocId,
          id: approvalData.equipmentId,
          name: approvalData.equipmentName,
          category: approvalData.category || 'PE & Sports',
          studentId: approvalData.studentId,
          studentName: approvalData.studentName,
        });
        approvalData.returnDocId = newReturnDocId;
      }

      await approveReturnSubmission({
        ...approvalData,
        adminName,
        adminUid,
      });
    } catch (err) {
      console.warn('[Approve Return Firestore]', err);
    }

    triggerToast(`Approved return of ${approvalData.equipmentName} (${approvalData.condition || 'Good Condition'})`);
  };

  const handleFlagInspection = async (flagData) => {
    const adminName = student?.name || authUser?.displayName || authUser?.email?.split('@')[0] || 'Administrator';
    const adminUid = authUser?.uid || '';

    if (!flagData.returnDocId) {
      const newReturnDocId = await submitReturnPending({
        borrowId: flagData.borrowId || `BORROW-${Date.now()}`,
        firestoreId: flagData.borrowingDocId,
        id: flagData.equipmentId,
        name: flagData.equipmentName,
        category: flagData.category || 'PE & Sports',
        studentId: flagData.studentId,
        studentName: flagData.studentName,
      });
      flagData.returnDocId = newReturnDocId;
    }

    await flagReturnForInspection({
      ...flagData,
      adminName,
      adminUid,
    });

    triggerToast(`Held ${flagData.equipmentName || 'item'} for physical inspection`);
  };

  // ── Admin: Approve Borrowing Request ──────────────────────────────────────────
  const handleApproveAdminRequest = async (reqId) => {
    const req = adminRequests.find((r) => r.id === reqId || r.firestoreId === reqId);
    if (!req) return;

    const fsId = req.firestoreId;
    if (fsId) await updateRequest(fsId, { status: 'Approved' });

    // 1. Activate or create the student's active borrowing
    let borrowingUpdated = false;
    if (req.borrowingDocId) {
      try {
        await updateBorrowing(req.borrowingDocId, { status: 'Active' });
        borrowingUpdated = true;
      } catch (e) {
        console.warn('Could not update borrowing doc:', e.message);
      }
    } else if (req.borrowId) {
      const match = borrowings.find((b) => b.borrowId === req.borrowId);
      if (match?.firestoreId) {
        try {
          await updateBorrowing(match.firestoreId, { status: 'Active' });
          borrowingUpdated = true;
        } catch (e) {
          console.warn('Could not update matching borrowing doc:', e.message);
        }
      }
    }

    // If no existing borrowing document was linked or updated, create one in Firestore now!
    if (!borrowingUpdated) {
      const newBorrowId = req.borrowId || `BORROW-${Math.floor(1000 + Math.random() * 9000)}`;
      const newDocId = await addBorrowing({
        borrowId:     newBorrowId,
        id:           req.equipmentId || req.equipmentCode?.replace('#', '') || 'PE-023',
        name:         req.equipmentName,
        category:     req.category || 'PE & Sports',
        studentId:    req.studentUid || req.studentId || '2025-001',
        studentName:  req.studentName || 'Student',
        borrowedTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        status:       'Active',
      });
      if (fsId) {
        await updateRequest(fsId, { borrowingDocId: newDocId, borrowId: newBorrowId });
      }
    }

    // 2. Decrement equipment available in Firestore
    const eq = adminEquipment.find((e) => e.id === req.equipmentId);
    if (eq?.firestoreId) {
      await updateEquipment(eq.firestoreId, { available: Math.max(0, (eq.available || 0) - 1) });
    }

    // 3. Record transaction in ledger
    const today = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date());
    await addTransaction({
      id:               `TX-${Date.now()}`,
      studentName:      req.studentName,
      studentId:        req.studentId || '',
      studentInitials:  req.studentInitials || req.studentName?.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase(),
      equipment:        `${req.equipmentName} ${req.equipmentCode || ''}`,
      equipmentName:    req.equipmentName || '',
      equipmentId:      req.equipmentCode || req.equipmentId || '',
      date:             today,
      status:           'Borrowed',
    });

    // 4. Send notification to the student
    if (req.studentUid) {
      await addNotification({
        studentId: req.studentUid,
        title:     'Borrow Request Approved!',
        message:   `Your request for ${req.equipmentName} was approved. You can pick it up at the equipment room.`,
        time:      'Just now',
      });
    }

    triggerToast(`Request for ${req.equipmentName} Approved`);
  };

  // ── Admin: Reject Borrowing Request ───────────────────────────────────────────
  const handleRejectAdminRequest = async (reqId) => {
    const req = adminRequests.find((r) => r.id === reqId || r.firestoreId === reqId);
    if (!req) return;

    const fsId = req.firestoreId;
    if (fsId) await updateRequest(fsId, { status: 'Rejected' });

    // 1. Remove the pending borrowing record from student's active list
    if (req.borrowingDocId) {
      await deleteBorrowing(req.borrowingDocId);
    } else if (req.borrowId) {
      const match = borrowings.find((b) => b.borrowId === req.borrowId);
      if (match?.firestoreId) {
        await deleteBorrowing(match.firestoreId);
      }
    }

    // 2. Record transaction in ledger
    const today = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date());
    await addTransaction({
      id:               `TX-${Date.now()}`,
      studentName:      req.studentName,
      studentId:        req.studentId || '',
      studentInitials:  req.studentInitials || req.studentName?.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase(),
      equipment:        `${req.equipmentName} ${req.equipmentCode || ''}`,
      equipmentName:    req.equipmentName || '',
      equipmentId:      req.equipmentCode || req.equipmentId || '',
      date:             today,
      status:           'Rejected',
    });

    // 3. Send notification to the student
    if (req.studentUid) {
      await addNotification({
        studentId: req.studentUid,
        title:     'Borrow Request Declined',
        message:   `Your request for ${req.equipmentName} was declined by the administrator.`,
        time:      'Just now',
      });
    }

    triggerToast(`Request for ${req.equipmentName} Rejected`);
  };

  // ── Admin: Add Equipment ──────────────────────────────────────────────────────
  const handleAddAdminEquipment = async (newItem) => {
    const finalItem = {
      ...newItem,
      available: newItem.available ?? 5,
      total: newItem.total ?? 5,
      status: newItem.status || 'Available',
      image: CATEGORY_IMAGES[newItem.category] || newItem.image || '',
    };
    await fsAddEquipment(finalItem);
    triggerToast(`Added ${newItem.name} to inventory!`);
  };

  // ── Derived Admin Notifications ──────────────────────────────────────────────
  const adminDerivedNotifications = React.useMemo(() => {
    if (userRole !== 'Admin') return [];

    const list = [];

    // 1. Pending borrow requests
    adminRequests
      .filter((r) => r.status === 'Pending')
      .forEach((r) => {
        const notifId = `req-${r.id || r.firestoreId}`;
        list.push({
          id: notifId,
          firestoreId: r.firestoreId,
          title: 'New Borrow Request',
          message: `${r.studentName || 'Student'} requested ${r.equipmentName || 'equipment'} (${r.equipmentCode || r.equipmentId || ''})`,
          time: r.date || 'Pending',
          unread: !adminDismissedReadIds.has(notifId),
          category: 'request',
        });
      });

    // 2. Returns awaiting inspection
    adminReturnApprovals
      .filter((ret) => ret.status === 'Return Pending' || ret.status === 'Needs Inspection')
      .forEach((ret) => {
        const notifId = `ret-${ret.id || ret.firestoreId}`;
        list.push({
          id: notifId,
          firestoreId: ret.firestoreId,
          title: ret.status === 'Needs Inspection' ? 'Return Flagged for Review' : 'Return Awaiting Approval',
          message: `${ret.studentName || 'Student'} returned ${ret.equipmentName || 'equipment'} (${ret.equipmentId || ''})${ret.status === 'Needs Inspection' ? ' - condition flagged' : ' - awaiting physical inspection'}`,
          time: ret.returnSubmittedTime || 'Pending',
          unread: !adminDismissedReadIds.has(notifId),
          category: 'return',
        });
      });

    // 3. Low stock inventory warnings
    adminEquipment
      .filter((eq) => Number(eq.available) === 0)
      .forEach((eq) => {
        const notifId = `low-stock-${eq.id || eq.firestoreId}`;
        list.push({
          id: notifId,
          title: 'Out of Stock Alert',
          message: `${eq.name} (${eq.code || eq.id}) has 0 available units left.`,
          time: 'Inventory alert',
          unread: !adminDismissedReadIds.has(notifId),
          category: 'inventory',
        });
      });

    // 4. Any direct Firestore notifications
    notifications.forEach((n) => {
      const notifId = n.firestoreId || n.id;
      if (!list.some((existing) => (existing.firestoreId && existing.firestoreId === n.firestoreId) || existing.id === notifId)) {
        list.push({
          ...n,
          id: notifId,
          unread: adminDismissedReadIds.has(notifId) ? false : !!n.unread,
        });
      }
    });

    return list;
  }, [userRole, adminRequests, adminReturnApprovals, adminEquipment, notifications, adminDismissedReadIds]);

  const displayNotifications = userRole === 'Admin' ? adminDerivedNotifications : notifications;
  const unreadNotifCount = displayNotifications.filter((n) => n.unread).length;

  // ── Notifications: mark read ─────────────────────────────────────────────────
  const handleClearUnread = async () => {
    if (userRole === 'Admin') {
      const allIds = adminDerivedNotifications.map((n) => n.id);
      setAdminDismissedReadIds((prev) => new Set([...prev, ...allIds]));
    }

    // 1. Instantly update UI locally
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
    triggerToast('All notifications marked as read');

    // 2. Persist to Firestore for documents that have a firestoreId
    const unreadIds = displayNotifications
      .filter((n) => n.unread && n.firestoreId)
      .map((n) => n.firestoreId);

    if (unreadIds.length > 0) {
      try {
        await markNotificationsRead(unreadIds);
      } catch (err) {
        console.warn('[Firestore] Error marking notifications as read:', err);
      }
    }
  };

  const handleMarkSingleRead = async (targetId) => {
    if (userRole === 'Admin') {
      setAdminDismissedReadIds((prev) => new Set([...prev, targetId]));
    }

    // 1. Instantly update UI locally
    setNotifications((prev) =>
      prev.map((n) => (n.firestoreId === targetId || n.id === targetId ? { ...n, unread: false } : n))
    );

    // 2. Persist to Firestore if it has a firestoreId
    const target = displayNotifications.find((n) => n.firestoreId === targetId || n.id === targetId);
    if (target?.firestoreId) {
      try {
        await markNotificationsRead([target.firestoreId]);
      } catch (err) {
        console.warn('[Firestore] Error marking single notification as read:', err);
      }
    }
  };

  const pendingRequestsCount = adminRequests.filter((r) => r.status === 'Pending').length;
  const pendingReturnsCount  = adminReturnApprovals.filter((r) => r.status === 'Return Pending').length;

  // ── Loading splash while Firebase resolves ────────────────────────────────────
  if (!authReady) {
    return (
      <div style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center',
        justifyContent: 'center', backgroundColor: '#0F172A', flexDirection: 'column', gap: '16px',
      }}>
        <div style={{
          width: '56px', height: '56px', borderRadius: '50%',
          backgroundColor: '#1D61E7', display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 8px 24px rgba(29,97,231,0.35)',
        }}>
          <span style={{ color: '#fff', fontSize: '1.4rem', fontWeight: '800' }}>E</span>
        </div>
        <span style={{ color: '#94A3B8', fontSize: '0.9rem', fontWeight: '600' }}>Loading EQUIPTRACE…</span>
      </div>
    );
  }

  const isAnyModalOpen = Boolean(
    showNotifications || showBrowse || scannedEquipment || showAddEquipmentModal
  );

  const renderModals = (
    <>
      {showBrowse && (
        <BrowseModal
          equipmentList={equipmentList}
          onClose={() => setShowBrowse(false)}
          onSelectEquipment={(item) => setScannedEquipment(item)}
        />
      )}
      {scannedEquipment && (
        <EquipmentDetailModal
          equipment={scannedEquipment}
          student={student}
          onClose={() => setScannedEquipment(null)}
          onConfirmBorrow={handleConfirmBorrow}
          onNavigate={(tab) => {
            setScannedEquipment(null);
            setShowBrowse(false);
            setCurrentTab(tab);
          }}
        />
      )}
      {showAddEquipmentModal && (
        <AddEquipmentModal
          onClose={() => setShowAddEquipmentModal(false)}
          onAddEquipment={handleAddAdminEquipment}
        />
      )}
      {showNotifications && (
        <NotificationsModal
          notifications={displayNotifications}
          onClose={() => setShowNotifications(false)}
          onClearUnread={handleClearUnread}
          onMarkSingleRead={handleMarkSingleRead}
        />
      )}
    </>
  );

  return (
    <MobileFrameWrapper
      currentTab={currentTab}
      onNavigate={(tab) => setCurrentTab(tab)}
      showBottomNav={isLoggedIn}
      userRole={userRole}
      darkStatusBar={userRole === 'Student' && currentTab === 'scan' && isLoggedIn}
      pendingRequestsCount={pendingRequestsCount}
      pendingReturnsCount={pendingReturnsCount}
      activePushBanner={activePushBanner}
      onDismissPushBanner={() => setActivePushBanner(null)}
      modals={renderModals}
      isModalOpen={isAnyModalOpen}
    >
      {/* Toast */}
      {toastMessage && (
        <div className="toast-container"><span>{toastMessage}</span></div>
      )}

      {!isLoggedIn ? (
        <LoginScreen onLogin={handleLogin} />
      ) : userRole === 'Student' ? (
        <>
          {currentTab === 'home' && (
            <HomeScreen
              student={student}
              unreadCount={unreadNotifCount}
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
              isModalOpen={isAnyModalOpen}
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
        </>
      ) : (
        <>
          {currentTab === 'home' && (
            <AdminHome
              kpis={adminKpis}
              pendingRequests={adminRequests}
              recentTransactions={adminRecentTx}
              onApproveRequest={handleApproveAdminRequest}
              onRejectRequest={handleRejectAdminRequest}
              onNavigateTab={(tab) => setCurrentTab(tab)}
              onOpenNotifications={() => setShowNotifications(true)}
              onOpenSettings={() => setCurrentTab('more')}
              unreadCount={unreadNotifCount}
            />
          )}
          {currentTab === 'equipment' && (
            <AdminEquipment
              equipmentList={adminEquipment && adminEquipment.length > 0 ? adminEquipment : equipmentList}
              borrowings={borrowings}
              transactions={adminRecentTx}
              requests={adminRequests}
              onOpenAddModal={() => setShowAddEquipmentModal(true)}
              onOpenNotifications={() => setShowNotifications(true)}
              onOpenSettings={() => setCurrentTab('more')}
              unreadCount={unreadNotifCount}
            />
          )}
          {currentTab === 'requests' && (
            <AdminRequests
              requests={adminRequests}
              returnApprovals={adminReturnApprovals}
              borrowings={borrowings}
              history={history}
              transactions={adminRecentTx}
              equipmentList={adminEquipment.length > 0 ? adminEquipment : equipmentList}
              onApproveRequest={handleApproveAdminRequest}
              onRejectRequest={handleRejectAdminRequest}
              onApproveReturn={handleApproveReturn}
              onOpenNotifications={() => setShowNotifications(true)}
              onOpenSettings={() => setCurrentTab('more')}
              unreadCount={unreadNotifCount}
            />
          )}
          {currentTab === 'return-approval' && (
            <AdminReturnApproval
              returnApprovals={adminReturnApprovals}
              borrowings={borrowings}
              adminRequests={adminRequests}
              equipmentList={adminEquipment.length > 0 ? adminEquipment : equipmentList}
              onApproveReturn={handleApproveReturn}
              onFlagInspection={handleFlagInspection}
              adminUser={authUser}
              onOpenNotifications={() => setShowNotifications(true)}
              onOpenSettings={() => setCurrentTab('more')}
              unreadCount={unreadNotifCount}
            />
          )}
          {currentTab === 'analytics' && (
            <AdminAnalytics
              kpis={adminKpis}
              equipmentList={adminEquipment && adminEquipment.length > 0 ? adminEquipment : equipmentList}
              transactions={adminRecentTx}
              borrowings={borrowings}
              history={history}
              requests={adminRequests}
              onOpenNotifications={() => setShowNotifications(true)}
              onOpenSettings={() => setCurrentTab('more')}
              unreadCount={unreadNotifCount}
            />
          )}
          {currentTab === 'more' && (
            <AdminMore
              onLogout={handleLogout}
              onBack={() => setCurrentTab('home')}
              onNavigate={(tab) => setCurrentTab(tab)}
              transactions={adminRecentTx}
              notifications={displayNotifications}
              onClearUnread={handleClearUnread}
              onSendTestNotification={triggerPushBanner}
              student={student}
              user={authUser}
            />
          )}
        </>
      )}
    </MobileFrameWrapper>
  );
}
