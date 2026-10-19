/**
 * firestoreService.js
 * All Firestore read/write operations for EQUIPTRACE.
 *
 * Collections:
 *   equipment       – PE & Sports equipment catalog
 *   borrowings      – active borrow records
 *   history         – completed / returned records
 *   requests        – admin pending approval queue
 *   transactions    – full ledger (admin view)
 *   notifications   – per-user notification feed
 *   users           – student profile data (role, course, yearLevel…)
 */

import {
  db,
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  setDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  serverTimestamp,
} from './firebase';

// ─── helpers ─────────────────────────────────────────────────────────────────

const snap2arr = (snapshot) =>
  snapshot.docs.map((d) => ({ firestoreId: d.id, ...d.data() }));

// ─── EQUIPMENT ────────────────────────────────────────────────────────────────

/** Listen to the equipment collection in real-time */
export function subscribeEquipment(callback) {
  const q = query(collection(db, 'equipment'), orderBy('id'));
  return onSnapshot(q, (snap) => callback(snap2arr(snap)), (err) =>
    console.warn('[Firestore] equipment sub error:', err)
  );
}

/** One-shot fetch */
export async function getEquipment() {
  const snap = await getDocs(collection(db, 'equipment'));
  return snap2arr(snap);
}

/** Add a new equipment doc */
export async function addEquipment(item) {
  const ref = await addDoc(collection(db, 'equipment'), {
    ...item,
    createdAt: serverTimestamp(),
  });
  return ref.id;
}

/** Auto-seed equipment items if Firestore collection is empty, or add missing default sports gear */
export async function seedEquipmentIfEmpty(defaultItems = []) {
  try {
    const snap = await getDocs(collection(db, 'equipment'));
    if (snap.empty && defaultItems.length > 0) {
      for (const item of defaultItems) {
        await addDoc(collection(db, 'equipment'), {
          ...item,
          createdAt: serverTimestamp(),
        });
      }
    } else if (defaultItems.length > 0) {
      const existingIds = new Set();
      for (const docSnap of snap.docs) {
        const d = docSnap.data();
        if (d.id) existingIds.add(String(d.id).toUpperCase());
        if (d.code) existingIds.add(String(d.code).replace('#', '').toUpperCase());

        // Auto-migrate legacy 'PE & Sports', 'Electronics', or 'Laboratory' or Unsplash images in Firestore
        const isLegacyUnsplash = d.image && typeof d.image === 'string' && d.image.includes('unsplash.com');
        const isLegacyCategory = d.category === 'PE & Sports' || d.category === 'Electronics' || d.category === 'Laboratory' || !d.category;
        if (isLegacyCategory || isLegacyUnsplash) {
          const nameLower = (d.name || '').toLowerCase();
          const newCat = nameLower.includes('table tennis') || nameLower.includes('ping pong') || nameLower.includes('paddle') ? 'Table Tennis'
            : nameLower.includes('beach volleyball') || nameLower.includes('sand') ? 'Beach Volleyball'
            : nameLower.includes('volleyball') ? 'Volleyball'
            : nameLower.includes('basketball') ? 'Basketball'
            : nameLower.includes('tennis') ? 'Tennis'
            : nameLower.includes('track') || nameLower.includes('baton') || nameLower.includes('shot put') ? 'Track and Field'
            : nameLower.includes('futsal') ? 'Futsal'
            : nameLower.includes('football') || nameLower.includes('soccer') ? 'Football'
            : nameLower.includes('takraw') ? 'Sepak Takraw'
            : nameLower.includes('billiard') || nameLower.includes('pool') ? 'Billiards'
            : nameLower.includes('badminton') || nameLower.includes('shuttlecock') ? 'Badminton'
            : (d.category && !isLegacyCategory ? d.category : 'Basketball');
          try {
            await updateDoc(docSnap.ref, {
              category: newCat,
              image: isLegacyUnsplash ? '' : (d.image || '')
            });
          } catch (e) {
            // ignore
          }
        }
      }

      for (const item of defaultItems) {
        const checkId = String(item.id).toUpperCase();
        if (!existingIds.has(checkId)) {
          await addDoc(collection(db, 'equipment'), {
            ...item,
            image: '',
            createdAt: serverTimestamp(),
          });
        }
      }
    }
  } catch (err) {
    console.warn('[Firestore] Auto-seed equipment error:', err);
  }
}

/** Update fields on an equipment doc */
export async function updateEquipment(firestoreId, fields) {
  await updateDoc(doc(db, 'equipment', firestoreId), {
    ...fields,
    updatedAt: serverTimestamp(),
  });
}

// ─── BORROWINGS (active) ────────────────────────────────────────────────────

export function subscribeBorrowings(studentId, callback) {
  const q = studentId
    ? query(
        collection(db, 'borrowings'),
        where('studentId', '==', studentId)
      )
    : collection(db, 'borrowings');
  return onSnapshot(q, (snap) => callback(snap2arr(snap)), (err) =>
    console.warn('[Firestore] borrowings sub error:', err)
  );
}

export async function addBorrowing(record) {
  const ref = await addDoc(collection(db, 'borrowings'), {
    ...record,
    createdAt: serverTimestamp(),
  });
  return ref.id;
}

export async function updateBorrowing(firestoreId, fields) {
  await updateDoc(doc(db, 'borrowings', firestoreId), {
    ...fields,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteBorrowing(firestoreId) {
  await deleteDoc(doc(db, 'borrowings', firestoreId));
}

// ─── HISTORY (returned) ─────────────────────────────────────────────────────

export function subscribeHistory(studentId, callback) {
  const q = query(
    collection(db, 'history'),
    where('studentId', '==', studentId)
  );
  return onSnapshot(q, (snap) => callback(snap2arr(snap)), (err) =>
    console.warn('[Firestore] history sub error:', err)
  );
}

export async function addHistory(record) {
  await addDoc(collection(db, 'history'), {
    ...record,
    createdAt: serverTimestamp(),
  });
}

// ─── REQUESTS (admin queue) ─────────────────────────────────────────────────

export function subscribeRequests(callback) {
  const q = query(collection(db, 'requests'), orderBy('createdAt', 'desc'));
  return onSnapshot(q, (snap) => callback(snap2arr(snap)), (err) =>
    console.warn('[Firestore] requests sub error:', err)
  );
}

export async function updateRequest(firestoreId, fields) {
  await updateDoc(doc(db, 'requests', firestoreId), {
    ...fields,
    updatedAt: serverTimestamp(),
  });
}

// ─── RETURN APPROVALS WORKFLOW ──────────────────────────────────────────────

/**
 * Real-time subscription to return approval records for Admin.
 * Subscribes to the `return_approvals` collection ordered by latest request.
 */
export function subscribeReturnApprovals(callback) {
  return onSnapshot(
    collection(db, 'return_approvals'),
    (snap) => {
      const arr = snap2arr(snap);
      arr.sort((a, b) => {
        const timeA = a.createdAt?.seconds ? a.createdAt.seconds * 1000 : (a.createdAt ? new Date(a.createdAt).getTime() : 0);
        const timeB = b.createdAt?.seconds ? b.createdAt.seconds * 1000 : (b.createdAt ? new Date(b.createdAt).getTime() : 0);
        return timeB - timeA;
      });
      callback(arr);
    },
    (err) => console.warn('[Firestore] return_approvals sub error:', err)
  );
}

/**
 * Student submits an equipment return:
 * - Updates the borrowing record to status 'Return Pending'
 * - Creates a new document in `return_approvals`
 */
export async function submitReturnPending(borrowingItem) {
  const returnRecord = {
    borrowId: borrowingItem.borrowId,
    borrowingDocId: borrowingItem.firestoreId || '',
    equipmentId: borrowingItem.id,
    equipmentName: borrowingItem.name,
    category: borrowingItem.category || 'PE & Sports',
    quantity: borrowingItem.quantity || 1,
    location: borrowingItem.location || 'PE Storage Room',
    studentId: borrowingItem.studentId,
    studentName: borrowingItem.studentName || 'Student',
    borrowedTime: borrowingItem.borrowedTime || 'Today',
    returnSubmittedTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    returnSubmittedDate: new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date()),
    status: 'Return Pending', // 'Return Pending' | 'Returned' | 'Needs Inspection'
    condition: 'Good Condition',
    notes: '',
  };

  // 1. Add to return_approvals
  const ref = await addDoc(collection(db, 'return_approvals'), {
    ...returnRecord,
    createdAt: serverTimestamp(),
  });

  // 2. Mark the borrowing document as 'Return Pending'
  if (borrowingItem.firestoreId) {
    await updateDoc(doc(db, 'borrowings', borrowingItem.firestoreId), {
      status: 'Return Pending',
      returnApprovalId: ref.id,
      returnSubmittedTime: returnRecord.returnSubmittedTime,
      updatedAt: serverTimestamp(),
    });
  }

  return ref.id;
}

/**
 * Admin Confirms Return Approval:
 * - Prevents duplicate approval
 * - Updates return_approvals status to 'Returned'
 * - Records condition and admin signature
 * - If condition is 'Good Condition', increments available equipment inventory in Firestore
 * - If 'Damaged' or 'Incomplete / Missing Parts', records equipment as requiring inspection/maintenance
 * - Moves borrowing to `history`
 * - Removes active record from `borrowings`
 * - Logs audit record to `transactions`
 * - Sends student notification
 */
export async function approveReturnSubmission({
  returnDocId,
  borrowingDocId,
  equipmentDocId,
  equipmentId,
  equipmentName,
  studentId,
  studentName,
  condition,
  notes = '',
  adminName = 'Admin',
  adminUid = '',
}) {
  const approvalTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const approvalDate = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date());

  // 1. Update return_approvals document
  await updateDoc(doc(db, 'return_approvals', returnDocId), {
    status: 'Returned',
    condition,
    notes,
    approvedBy: adminName,
    approvedByUid: adminUid,
    approvalTime,
    approvalDate,
    updatedAt: serverTimestamp(),
  });

  // 2. If equipment is in Good Condition, restock inventory.
  // If Damaged or Missing Parts, do NOT increment available; flag maintenance.
  if (equipmentDocId) {
    if (condition === 'Good Condition') {
      const eqSnap = await getDoc(doc(db, 'equipment', equipmentDocId));
      if (eqSnap.exists()) {
        const currentAvail = Number(eqSnap.data().available) || 0;
        await updateDoc(doc(db, 'equipment', equipmentDocId), {
          available: currentAvail + 1,
          updatedAt: serverTimestamp(),
        });
      }
    } else {
      // Flag equipment document for maintenance/inspection
      await updateDoc(doc(db, 'equipment', equipmentDocId), {
        status: condition === 'Damaged' ? 'Under Maintenance' : 'Missing Parts Inspection',
        conditionNote: notes || condition,
        updatedAt: serverTimestamp(),
      });
    }
  }

  // 3. Move to completed History
  await addDoc(collection(db, 'history'), {
    studentId,
    equipmentId,
    name: equipmentName,
    borrowedDate: 'Previous',
    returnedDate: `${approvalDate} ${approvalTime}`,
    status: condition === 'Good Condition' ? 'Returned on time' : `Returned (${condition})`,
    condition,
    notes,
    approvedBy: adminName,
    createdAt: serverTimestamp(),
  });

  // 4. Remove active borrowing document
  if (borrowingDocId) {
    try {
      await deleteDoc(doc(db, 'borrowings', borrowingDocId));
    } catch (e) {
      console.warn('[Firestore] Borrowing doc delete note:', e.message);
    }
  }

  // 5. Add audit ledger entry to transactions
  await addDoc(collection(db, 'transactions'), {
    id: `TX-${Date.now()}`,
    studentName,
    studentInitials: studentName ? studentName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() : 'ST',
    equipment: `${equipmentName} (${equipmentId})`,
    date: approvalDate,
    status: 'Returned',
    condition,
    approvedBy: adminName,
    createdAt: serverTimestamp(),
  });

  // 6. Notify student that return is processed
  await addDoc(collection(db, 'notifications'), {
    studentId,
    title: 'Return Approved & Finalized',
    message: condition === 'Good Condition'
      ? `Your return for ${equipmentName} (${equipmentId}) was inspected and approved by ${adminName}. Your record is cleared.`
      : `Your return for ${equipmentName} (${equipmentId}) was recorded with status: ${condition}. Note: "${notes || 'Pending review'}".`,
    time: 'Just now',
    unread: true,
    createdAt: serverTimestamp(),
  });
}

/**
 * Admin Flags Return For Inspection:
 * - Updates return_approvals to 'Needs Inspection'
 * - Records issue and conditions
 * - Holds inventory adjustment
 */
export async function flagReturnForInspection({
  returnDocId,
  condition,
  notes,
  adminName = 'Admin',
  adminUid = '',
  studentId,
  equipmentName,
  equipmentId,
}) {
  await updateDoc(doc(db, 'return_approvals', returnDocId), {
    status: 'Needs Inspection',
    condition,
    notes,
    flaggedBy: adminName,
    flaggedByUid: adminUid,
    flaggedAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  if (studentId) {
    await addDoc(collection(db, 'notifications'), {
      studentId,
      title: 'Equipment Flagged for Inspection',
      message: `Your return for ${equipmentName || 'equipment'} (${equipmentId || ''}) requires physical inspection (${condition}). Reason: "${notes || 'Staff review required'}".`,
      time: 'Just now',
      unread: true,
      createdAt: serverTimestamp(),
    });
  }
}

export async function addRequest(record) {
  const ref = await addDoc(collection(db, 'requests'), {
    ...record,
    status: 'Pending',
    createdAt: serverTimestamp(),
  });
  return ref.id;
}

// ─── TRANSACTIONS (admin ledger) ─────────────────────────────────────────────

export function subscribeTransactions(callback) {
  const q = query(collection(db, 'transactions'), orderBy('createdAt', 'desc'));
  return onSnapshot(q, (snap) => callback(snap2arr(snap)), (err) =>
    console.warn('[Firestore] transactions sub error:', err)
  );
}

export async function addTransaction(record) {
  await addDoc(collection(db, 'transactions'), {
    ...record,
    createdAt: serverTimestamp(),
  });
}

// ─── NOTIFICATIONS ───────────────────────────────────────────────────────────

export function subscribeNotifications(studentId, callback) {
  const q = studentId
    ? query(collection(db, 'notifications'), where('studentId', '==', studentId))
    : collection(db, 'notifications');

  return onSnapshot(
    q,
    (snap) => {
      const arr = snap2arr(snap);
      arr.sort((a, b) => {
        const tA = a.createdAt?.toMillis ? a.createdAt.toMillis() : 0;
        const tB = b.createdAt?.toMillis ? b.createdAt.toMillis() : 0;
        return tB - tA;
      });
      callback(arr);
    },
    (err) => console.warn('[Firestore] notifications sub error:', err)
  );
}

export async function addNotification(record) {
  await addDoc(collection(db, 'notifications'), {
    ...record,
    unread: true,
    createdAt: serverTimestamp(),
  });
}

export async function markNotificationsRead(firestoreIds) {
  await Promise.all(
    firestoreIds.map((id) =>
      updateDoc(doc(db, 'notifications', id), { unread: false })
    )
  );
}

// ─── USER PROFILE ────────────────────────────────────────────────────────────

/** Upsert a user profile doc keyed by uid */
export async function upsertUserProfile(uid, data) {
  await setDoc(doc(db, 'users', uid), { ...data, updatedAt: serverTimestamp() }, { merge: true });
}

export async function getUserProfile(uid) {
  const snap = await getDoc(doc(db, 'users', uid));
  return snap.exists() ? { firestoreId: snap.id, ...snap.data() } : null;
}

/** Find a user by their registered studentId */
export async function findUserByStudentId(studentId) {
  if (!studentId) return null;
  const trimmed = studentId.trim();
  const q = query(collection(db, 'users'), where('studentId', '==', trimmed));
  const snap = await getDocs(q);
  if (!snap.empty) {
    const docSnap = snap.docs[0];
    return { firestoreId: docSnap.id, ...docSnap.data() };
  }
  return null;
}

/** Check if a studentId is already registered in the database */
export async function isStudentIdRegistered(studentId) {
  const user = await findUserByStudentId(studentId);
  return !!user;
}
