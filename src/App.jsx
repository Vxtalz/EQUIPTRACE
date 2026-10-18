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
  const [adminRequests, setAdminRequests] = useState([]);
  const [adminRecentTx, setAdminRecentTx] = useState([]);
  const [adminEquipment, setAdminEquipment] = useState([]);
  const [adminReturnApprovals, setAdminReturnApprovals] = useState([]);
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
        setAdminRequests(rows);
        // Recompute KPIs from live equipment
        setAdminKpis((prev) => ({ ...prev }));
      });
      unsubRefs.current.push(unsubReq);

      const unsubTx = subscribeTransactions((rows) => setAdminRecentTx(rows));
      unsubRefs.current.push(unsubTx);

      const unsubReturns = subscribeReturnApprovals((rows) => setAdminReturnApprovals(rows));
      unsubRefs.current.push(unsubReturns);

      // Subscribe to all notifications for Admin
      const unsubNotif = subscribeNotifications(null, (rows) => setNotifications(rows));
      unsubRefs.current.push(unsubNotif);
    }
  }

  // Recompute admin KPIs whenever equipment changes
  useEffect(() => {
    if (userRole !== 'Admin' || adminEquipment.length === 0) return;
    const total     = adminEquipment.reduce((s, e) => s + (Number(e.total) || 0), 0);
    const available = adminEquipment.reduce((s, e) => s + (Number(e.available) || 0), 0);
    setAdminKpis({
      totalEquipment: total,
      available,
      borrowed: total - available,
      overdue: adminEquipment.filter((e) => e.status === 'Overdue').length,
    });
  }, [adminEquipment, userRole]);

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
    if (!authUser) return;

    const borrowId = `BORROW-${Math.floor(1000 + Math.random() * 9000)}`;
    const returnDate = borrowDetails.returnDate || new Date().toISOString().split('T')[0];
    const returnTime = borrowDetails.returnTime || '17:00';
    const purpose = borrowDetails.purpose || 'PE Class Activity';
    const formattedReturnBy = borrowDetails.formattedReturnBy || 'Today, 5:00 PM';

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
      studentId:          authUser.uid,
      studentNumber:      student.id || '2025-001',
      studentName:        student.name || 'Student',
      studentCourse:      student.course || '',
      studentYearLevel:   student.yearLevel || '',
      status:             'Pending Approval',
    };

    const borrowingDocId = await addBorrowing(borrowRecord);

    // 2. Submit formal Request into the Admin 'requests' collection
    const reqRecord = {
      id:                 `REQ-${Date.now()}`,
      borrowingDocId:     borrowingDocId || '',
      borrowId:           borrowId,
      studentId:          student.id || authUser.email?.split('@')[0] || '2025-001',
      studentUid:         authUser.uid,
      studentName:        student.name || 'Student',
      studentCourse:      student.course || '',
      studentYearLevel:   student.yearLevel || '',
      studentInitials:    (student.name || 'Student')
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

    await addRequest(reqRecord);

    // 3. Student Notification
    const notifPayload = {
      studentId: authUser.uid,
      title:     'Borrow Request Submitted',
      message:   `Your request for ${equipment.name} (${equipment.id}) was sent. Due by ${formattedReturnBy}.`,
      time:      'Just now',
    };
    await addNotification(notifPayload);

    // 4. Admin Push Notification in database
    await addNotification({
      studentId: 'admin',
      title:     'New Borrow Request',
      message:   `${student.name || 'Student'} requested ${equipment.name} (${equipment.id}). Due ${formattedReturnBy}.`,
      time:      'Just now',
      category:  'request',
    });

    // Trigger Phone Status Bar Push Banner
    triggerPushBanner(notifPayload);
    try { confetti({ particleCount: 60, spread: 60, origin: { y: 0.7 } }); } catch (e) {}
  };

  // ── Student: Submit Return (enters 'Return Pending') ────────────────────────
  const handleReturnEquipment = async (borrowId) => {
    const item = borrowings.find((b) => b.borrowId === borrowId);
    if (!item) return;

    // Enter Return Pending status in Firestore
    await submitReturnPending(item);

    const pendingNotif = {
      studentId: authUser.uid,
      title: 'Return Submitted',
      message: `You handed in ${item.name}. Status is now "Return Pending" awaiting admin physical inspection.`,
      time: 'Just now',
    };
    await addNotification(pendingNotif);
    triggerPushBanner(pendingNotif);

    triggerToast(`Submitted return for ${item.name}. Awaiting admin approval.`);
  };

  // ── Admin: Return Approval Workflow Handlers ──────────────────────────────────
  const handleApproveReturn = async (approvalData) => {
    const adminName = student?.name || authUser?.displayName || authUser?.email?.split('@')[0] || 'Administrator';
    const adminUid = authUser?.uid || '';

    // If initiated directly from the Borrowed tab without a pre-existing return_approvals doc
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

    triggerToast(`Approved return of ${approvalData.equipmentName} (${approvalData.condition})`);
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
      studentInitials:  req.studentInitials || req.studentName?.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase(),
      equipment:        `${req.equipmentName} ${req.equipmentCode || ''}`,
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
      studentInitials:  req.studentInitials || req.studentName?.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase(),
      equipment:        `${req.equipmentName} ${req.equipmentCode || ''}`,
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
              equipmentList={adminEquipment}
              onOpenAddModal={() => setShowAddEquipmentModal(true)}
              onOpenNotifications={() => setShowNotifications(true)}
              onOpenSettings={() => setCurrentTab('more')}
              unreadCount={unreadNotifCount}
            />
          )}
          {currentTab === 'requests' && (
            <AdminRequests
              requests={adminRequests}
              onApproveRequest={handleApproveAdminRequest}
              onRejectRequest={handleRejectAdminRequest}
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
              equipmentList={adminEquipment}
              transactions={adminRecentTx}
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
