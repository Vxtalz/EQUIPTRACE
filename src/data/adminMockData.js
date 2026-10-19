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
    equipmentName: 'Table Tennis Paddle Set',
    equipmentCode: '#PE-031',
    icon: '🏓',
    requestedDate: 'Sep 29, 2026',
    returnBy: 'Oct 1, 2026 · 2:00 PM',
    status: 'Pending',
  }
];

// Dynamic date generator helper for realistic demo transactions
const getRelativeDateStr = (daysAgo) => {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(d);
};

export const INITIAL_ADMIN_RECENT_TRANSACTIONS = [
  {
    id: 'TX-201',
    studentName: 'Maria Santos',
    studentId: '2025-0089',
    studentInitials: 'MS',
    equipment: 'Badminton Racket Set #PE-022',
    equipmentName: 'Badminton Racket Set',
    equipmentId: 'PE-022',
    date: getRelativeDateStr(0), // Today
    status: 'Borrowed',
  },
  {
    id: 'TX-202',
    studentName: 'Carlos Reyes',
    studentId: '2025-0142',
    studentInitials: 'CR',
    equipment: 'Tennis Racket #PE-012',
    equipmentName: 'Tennis Racket',
    equipmentId: 'PE-012',
    date: getRelativeDateStr(2), // Last 7 Days
    status: 'Overdue',
  },
  {
    id: 'TX-203',
    studentName: 'Juan Dela Cruz',
    studentId: '2025-0012',
    studentInitials: 'JD',
    equipment: 'Volleyball #PE-007',
    equipmentName: 'Volleyball',
    equipmentId: 'PE-007',
    date: getRelativeDateStr(4), // Last 7 Days
    status: 'Returned',
  },
  {
    id: 'TX-204',
    studentName: 'Alyssa Valdez',
    studentId: '2025-0055',
    studentInitials: 'AV',
    equipment: 'Beach Volleyball #PE-041',
    equipmentName: 'Beach Volleyball',
    equipmentId: 'PE-041',
    date: getRelativeDateStr(6), // Last 7 Days
    status: 'Borrowed',
  },
  {
    id: 'TX-205',
    studentName: 'Miguel Tan',
    studentId: '2025-0118',
    studentInitials: 'MT',
    equipment: 'Basketball #PE-023',
    equipmentName: 'Basketball',
    equipmentId: 'PE-023',
    date: getRelativeDateStr(12), // Last 30 Days
    status: 'Returned',
  },
  {
    id: 'TX-206',
    studentName: 'Sofia Andres',
    studentId: '2025-0094',
    studentInitials: 'SA',
    equipment: 'Table Tennis Paddle Set #PE-031',
    equipmentName: 'Table Tennis Paddle Set',
    equipmentId: 'PE-031',
    date: getRelativeDateStr(18), // Last 30 Days
    status: 'Borrowed',
  },
  {
    id: 'TX-207',
    studentName: 'Paolo Gomez',
    studentId: '2025-0073',
    studentInitials: 'PG',
    equipment: 'Futsal Ball #PE-018',
    equipmentName: 'Futsal Ball',
    equipmentId: 'PE-018',
    date: getRelativeDateStr(26), // Last 30 Days
    status: 'Returned',
  },
  {
    id: 'TX-208',
    studentName: 'Beatrice Lim',
    studentId: '2025-0160',
    studentInitials: 'BL',
    equipment: 'Football #PE-015',
    equipmentName: 'Football',
    equipmentId: 'PE-015',
    date: getRelativeDateStr(45), // All Time
    status: 'Overdue',
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
    id: 'PE-004',
    name: 'Football Match Ball',
    code: '#PE-004',
    category: 'Football',
    location: 'Field Equipment Shed',
    condition: 'Excellent',
    status: 'Available',
    icon: '⚽',
  },
  {
    id: 'PE-022',
    name: 'Badminton Racket Set',
    code: '#PE-022',
    category: 'Badminton',
    location: 'Sports Complex Room 102',
    condition: 'Good',
    status: 'Available',
    icon: '🏸',
  },
  {
    id: 'PE-035',
    name: 'Track & Field Baton Set',
    code: '#PE-035',
    category: 'Track and Field',
    location: 'Track & Oval Shed',
    condition: 'Excellent',
    status: 'Available',
    icon: '🏃',
  },
  {
    id: 'PE-036',
    name: 'Sepak Takraw Ball',
    code: '#PE-036',
    category: 'Sepak Takraw',
    location: 'PE Storage Room',
    condition: 'Good',
    status: 'Available',
    icon: '🏐',
  },
  {
    id: 'PE-037',
    name: 'Beach Volleyball',
    code: '#PE-037',
    category: 'Beach Volleyball',
    location: 'Sand Court Storage',
    condition: 'Good',
    status: 'Available',
    icon: '🏐',
  },
  {
    id: 'PE-038',
    name: 'Billiards Pool Cue & Balls',
    code: '#PE-038',
    category: 'Billiards',
    location: 'Student Activity Hall',
    condition: 'Excellent',
    status: 'Available',
    icon: '🎱',
  },
  {
    id: 'PE-039',
    name: 'Futsal Match Ball',
    code: '#PE-039',
    category: 'Futsal',
    location: 'Gymnasium Locker B',
    condition: 'Excellent',
    status: 'Available',
    icon: '⚽',
  },
  {
    id: 'PE-031',
    name: 'Table Tennis Paddle Set',
    code: '#PE-031',
    category: 'Table Tennis',
    location: 'Rec Hall Storage',
    condition: 'Excellent',
    status: 'Available',
    icon: '🏓',
  },
];
