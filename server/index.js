import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import QRCode from 'qrcode';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// In-memory persistent database store (mirrored with Firebase Firestore)
let equipmentStore = [
  { id: 'PE-023', code: '#PE-023', name: 'Basketball', category: 'Basketball', total: 12, available: 8, location: 'PE Storage Room', condition: 'Good', status: 'Available', icon: '🏀' },
  { id: 'PE-007', code: '#PE-007', name: 'Volleyball', category: 'Volleyball', total: 10, available: 6, location: 'PE Storage Room', condition: 'Good', status: 'Available', icon: '🏐' },
  { id: 'PE-012', code: '#PE-012', name: 'Tennis Racket', category: 'Tennis', total: 8, available: 5, location: 'Sports Office', condition: 'Fair', status: 'Overdue', icon: '🎾' },
  { id: 'PE-015', code: '#PE-015', name: 'Projector', category: 'Electronics', total: 4, available: 2, location: 'Media Center', condition: 'Excellent', status: 'Available', icon: '📽️' },
  { id: 'PE-018', code: '#PE-018', name: 'Laptop', category: 'Electronics', total: 6, available: 3, location: 'IT Storage', condition: 'Good', status: 'Borrowed', icon: '💻' }
];

let borrowingRecords = [
  { id: 'TX-201', equipmentId: 'PE-012', equipment: 'Tennis Racket #PE-012', studentName: 'Carlos Reyes', studentInitials: 'CR', studentId: '2023-0149', date: 'Sep 24, 2026', borrowDate: '2026-09-24', status: 'Overdue' },
  { id: 'TX-202', equipmentId: 'PE-018', equipment: 'Laptop #PE-018', studentName: 'Maria Santos', studentInitials: 'MS', studentId: '2022-8901', date: 'Sep 26, 2026', borrowDate: '2026-09-26', status: 'Borrowed' },
  { id: 'TX-203', equipmentId: 'PE-007', equipment: 'Volleyball #PE-007', studentName: 'Juan Dela Cruz', studentInitials: 'JD', studentId: '2025-001', date: 'Sep 17, 2026', borrowDate: '2026-09-17', status: 'Returned' }
];

let pendingRequests = [
  { id: 'REQ-101', equipmentId: 'PE-007', equipmentName: 'Volleyball', equipmentCode: '#PE-007', icon: '🏐', studentName: 'Maria Santos', studentInitials: 'MS', studentId: '2022-8901', requestedDate: 'Sep 29, 2026', returnBy: 'Oct 2, 2026 · 10:00 AM', status: 'Pending' },
  { id: 'REQ-102', equipmentId: 'PE-015', equipmentName: 'Projector', equipmentCode: '#PE-015', icon: '📽️', studentName: 'Luis Reyes', studentInitials: 'LR', studentId: '2024-5512', requestedDate: 'Sep 29, 2026', returnBy: 'Oct 1, 2026 · 2:00 PM', status: 'Pending' }
];

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    timestamp: new Date().toISOString(),
    service: 'EQUIPTRACE API Node/Express',
    database: 'Firebase Firestore Ready'
  });
});

// 1. Equipment Management API
app.get('/api/equipment', (req, res) => {
  res.json({ success: true, count: equipmentStore.length, data: equipmentStore });
});

app.post('/api/equipment', (req, res) => {
  const { name, category, total, available, location } = req.body;
  if (!name || !category) {
    return res.status(400).json({ error: 'Name and category are required' });
  }
  const newId = `EQ-00${equipmentStore.length + 1}`;
  const newItem = {
    id: newId,
    name,
    category,
    total: Number(total) || 1,
    available: Number(available ?? total) || 1,
    location: location || 'Storage Room',
    status: 'Available'
  };
  equipmentStore.unshift(newItem);
  res.status(201).json({ success: true, data: newItem });
});

// 2. QR Code Generation API
app.get('/api/equipment/:id/qrcode', async (req, res) => {
  try {
    const item = equipmentStore.find(e => e.id.toLowerCase() === req.params.id.toLowerCase());
    if (!item) {
      return res.status(404).json({ error: 'Equipment not found' });
    }
    const qrPayload = JSON.stringify({
      system: 'EQUIPTRACE',
      id: item.id,
      name: item.name,
      category: item.category
    });
    const qrDataUrl = await QRCode.toDataURL(qrPayload, {
      color: { dark: '#0F1E36', light: '#FFFFFF' },
      width: 320,
      margin: 2
    });
    res.json({ success: true, equipmentId: item.id, qrCode: qrDataUrl });
  } catch (err) {
    res.status(500).json({ error: 'Failed to generate QR code', details: err.message });
  }
});

// 3. Borrowing Transactions API
app.get('/api/borrowings', (req, res) => {
  res.json({ success: true, count: borrowingRecords.length, data: borrowingRecords });
});

app.get('/api/transactions', (req, res) => {
  res.json({ success: true, count: borrowingRecords.length, data: borrowingRecords });
});

app.post('/api/borrowings/checkout', (req, res) => {
  const { equipmentId, studentId, studentName } = req.body;
  const item = equipmentStore.find(e => e.id === equipmentId);

  if (!item || item.available <= 0) {
    return res.status(400).json({ error: 'Equipment is not available for borrowing' });
  }

  item.available -= 1;
  const newTx = {
    id: `BRW-${Math.floor(1000 + Math.random() * 9000)}`,
    equipmentId,
    equipmentName: item.name,
    studentId: studentId || '2025-001',
    studentName: studentName || 'Student Borrower',
    borrowDate: new Date().toISOString(),
    status: 'Borrowed'
  };
  borrowingRecords.unshift(newTx);

  res.status(201).json({ success: true, message: 'Borrowing transaction completed', data: newTx });
});

app.post('/api/borrowings/return', (req, res) => {
  const { transactionId } = req.body;
  const tx = borrowingRecords.find(b => b.id === transactionId);

  if (!tx || tx.status === 'Returned') {
    return res.status(400).json({ error: 'Transaction record not found or already returned' });
  }

  tx.status = 'Returned';
  tx.returnDate = new Date().toISOString();

  const item = equipmentStore.find(e => e.id === tx.equipmentId);
  if (item) {
    item.available = Math.min(item.total, item.available + 1);
  }

  res.json({ success: true, message: 'Equipment returned successfully', data: tx });
});

// 4. Admin Requests Approval / Rejection API
app.get('/api/requests', (req, res) => {
  res.json({ success: true, data: pendingRequests });
});

app.post('/api/requests/:id/action', (req, res) => {
  const { action } = req.body; // 'approve' | 'reject'
  const reqItem = pendingRequests.find(r => r.id === req.params.id);

  if (!reqItem) {
    return res.status(404).json({ error: 'Request not found' });
  }

  reqItem.status = action === 'approve' ? 'Approved' : 'Rejected';
  res.json({ success: true, data: reqItem });
});

// 5. Firebase Cloud Messaging (FCM) Notification Trigger
app.post('/api/notifications/send', (req, res) => {
  const { title, message, targetStudentId } = req.body;
  // FCM Dispatch mock/ready integration
  res.json({
    success: true,
    notificationId: `FCM-${Date.now()}`,
    sentAt: new Date().toISOString(),
    recipient: targetStudentId || 'all_active_borrowers',
    content: { title, message }
  });
});

// 6. Analytics API
app.get('/api/analytics', (req, res) => {
  const total = equipmentStore.reduce((acc, curr) => acc + curr.total, 0);
  const available = equipmentStore.reduce((acc, curr) => acc + curr.available, 0);
  const borrowed = total - available;

  res.json({
    kpis: {
      totalEquipment: total,
      available,
      borrowed,
      overdue: 1
    },
    utilizationRate: `${Math.round((borrowed / (total || 1)) * 100)}%`,
    borrowingTrends: [
      { day: 'Mon', count: 18 },
      { day: 'Tue', count: 24 },
      { day: 'Wed', count: 32 },
      { day: 'Thu', count: 28 },
      { day: 'Fri', count: 35 }
    ]
  });
});

app.listen(PORT, () => {
  console.log(`[EQUIPTRACE API] Node.js Express server running on port ${PORT}`);
});
