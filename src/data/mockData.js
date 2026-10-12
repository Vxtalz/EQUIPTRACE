export const CURRENT_STUDENT = {
  id: '2025-001',
  name: 'Juan Dela Cruz',
  course: 'BS Physical Education',
  yearLevel: '3rd Year',
  email: 'juan.delacruz@university.edu.ph',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
};

export const INITIAL_EQUIPMENT_LIST = [
  {
    id: 'PE-015',
    name: 'Spalding Official Basketball',
    category: 'PE & Sports',
    condition: 'Excellent',
    available: 8,
    total: 12,
    location: 'Sports Complex Room 102',
    image: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=400&q=80',
    description: 'Regulation size 7 composite leather basketball suitable for indoor court play.',
  },
  {
    id: 'PE-008',
    name: 'Mikasa Tournament Volleyball',
    category: 'PE & Sports',
    condition: 'Good',
    available: 5,
    total: 10,
    location: 'Gymnasium Locker B',
    image: 'https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?auto=format&fit=crop&w=400&q=80',
    description: 'Official synthetic leather volleyball for indoor training.',
  },
  {
    id: 'PE-022',
    name: 'Yonex Badminton Racket Set',
    category: 'PE & Sports',
    condition: 'Very Good',
    available: 6,
    total: 8,
    location: 'Sports Complex Room 102',
    image: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&w=400&q=80',
    description: 'Pair of lightweight graphite rackets with carrying case and shuttlecocks.',
  },
  {
    id: 'IT-005',
    name: 'Epson 1080p HD Projector',
    category: 'Tech & AV',
    condition: 'Excellent',
    available: 2,
    total: 4,
    location: 'Media Equipment Center',
    image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=400&q=80',
    description: 'High brightness 3400-lumen HDMI projector for presentations and classroom lectures.',
  },
  {
    id: 'IT-012',
    name: 'Heavy Duty 20m Extension Reel',
    category: 'Tech & AV',
    condition: 'Good',
    available: 7,
    total: 10,
    location: 'AV Storage Depot',
    image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=400&q=80',
    description: '4-socket power cord reel with surge protection.',
  },
  {
    id: 'LAB-03',
    name: 'Digital Vernier Caliper Set',
    category: 'Laboratory',
    condition: 'New',
    available: 14,
    total: 15,
    location: 'Engineering Lab 304',
    image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=400&q=80',
    description: 'Stainless steel high precision digital measurement caliper.',
  },
];

export const INITIAL_BORROWINGS = [];

export const INITIAL_HISTORY = [
  {
    id: 'HIST-8821',
    equipmentId: 'PE-008',
    name: 'Mikasa Tournament Volleyball',
    borrowedDate: '2026-10-02 10:30 AM',
    returnedDate: '2026-10-02 04:15 PM',
    status: 'Returned on time',
    category: 'PE & Sports',
  },
  {
    id: 'HIST-7704',
    equipmentId: 'IT-012',
    name: 'Heavy Duty 20m Extension Reel',
    borrowedDate: '2026-09-28 08:00 AM',
    returnedDate: '2026-09-28 05:00 PM',
    status: 'Returned on time',
    category: 'Tech & AV',
  },
];

export const INITIAL_NOTIFICATIONS = [
  {
    id: 1,
    title: 'Welcome to EQUIPTRACE',
    message: 'Your account is ready! Use your QR scanner to quickly borrow physical equipment.',
    time: '2 hours ago',
    unread: true,
  },
  {
    id: 2,
    title: 'Policy Update',
    message: 'All PE equipment must be returned before 5:00 PM on the same day.',
    time: '1 day ago',
    unread: false,
  },
];
