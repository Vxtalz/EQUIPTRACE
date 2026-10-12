export const INITIAL_ADMIN_KPIS = {
  totalEquipment: 248,
  available: 183,
  borrowed: 42,
  overdue: 8,
};

export const INITIAL_ADMIN_PENDING_REQUESTS = [
  {
    id: 'REQ-101',
    studentName: 'Maria Santos',
    studentInitials: 'MS',
    equipmentName: 'Volleyball',
    equipmentCode: '#PE-007',
    icon: '🏐',
    requestedDate: 'Sep 29, 2026',
    returnBy: 'Oct 2, 2026 · 10:00 AM',
    status: 'Pending',
  },
  {
    id: 'REQ-102',
    studentName: 'Luis Reyes',
    studentInitials: 'LR',
    equipmentName: 'Projector',
    equipmentCode: '#PE-015',
    icon: '📽️',
    requestedDate: 'Sep 29, 2026',
    returnBy: 'Oct 1, 2026 · 2:00 PM',
    status: 'Pending',
  }
];

export const INITIAL_ADMIN_RECENT_TRANSACTIONS = [
  {
    id: 'TX-201',
    studentName: 'Carlos Reyes',
    studentInitials: 'CR',
    equipment: 'Tennis Racket #PE-012',
    date: 'Sep 24, 2026',
    status: 'Overdue', // red badge
  },
  {
    id: 'TX-202',
    studentName: 'Maria Santos',
    studentInitials: 'MS',
    equipment: 'Laptop #PE-018',
    date: 'Sep 26, 2026',
    status: 'Borrowed', // light blue badge
  },
  {
    id: 'TX-203',
    studentName: 'Juan Dela Cruz',
    studentInitials: 'JD',
    equipment: 'Volleyball #PE-007',
    date: 'Sep 17, 2026',
    status: 'Returned', // green badge
  },
];

export const INITIAL_ADMIN_EQUIPMENT_LIST = [
  {
    id: 'PE-023',
    name: 'Basketball',
    code: '#PE-023',
    category: 'Basketball',
    location: 'PE Storage Room',
    condition: 'Good',
    status: 'Available',
    icon: '🏀',
  },
  {
    id: 'PE-007',
    name: 'Volleyball',
    code: '#PE-007',
    category: 'Volleyball',
    location: 'PE Storage Room',
    condition: 'Good',
    status: 'Available',
    icon: '🏐',
  },
  {
    id: 'PE-012',
    name: 'Tennis Racket',
    code: '#PE-012',
    category: 'Tennis',
    location: 'Sports Office',
    condition: 'Fair',
    status: 'Overdue',
    icon: '🎾',
  },
  {
    id: 'PE-015',
    name: 'Projector',
    code: '#PE-015',
    category: 'Electronics',
    location: 'Media Center',
    condition: 'Excellent',
    status: 'Available',
    icon: '📽️',
  },
  {
    id: 'PE-018',
    name: 'Laptop',
    code: '#PE-018',
    category: 'Electronics',
    location: 'IT Storage',
    condition: 'Good',
    status: 'Borrowed',
    icon: '💻',
  },
];
