import basketballImg from '../assets/sports/basketball.png';
import volleyballImg from '../assets/sports/volleyball.png';
import tennisImg from '../assets/sports/tennis.png';
import tableTennisImg from '../assets/sports/table-tennis.png';
import trackAndFieldImg from '../assets/sports/track-and-field.png';
import footballImg from '../assets/sports/football.png';
import sepakTakrawImg from '../assets/sports/sepak-takraw.png';
import beachVolleyballImg from '../assets/sports/beach-volleyball.png';
import billiardsImg from '../assets/sports/billiards.png';
import badmintonImg from '../assets/sports/badminton.png';
import futsalImg from '../assets/sports/futsal.png';

export const CURRENT_STUDENT = {
  id: '2025-001',
  name: 'Juan Dela Cruz',
  course: 'BS Physical Education',
  yearLevel: '3rd Year',
  email: 'juan.delacruz@university.edu.ph',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
};

export const SPORTS_CATEGORIES = [
  'Basketball',
  'Volleyball',
  'Tennis',
  'Table Tennis',
  'Track and Field',
  'Football',
  'Sepak Takraw',
  'Beach Volleyball',
  'Billiards',
  'Badminton',
  'Futsal',
];

export const CATEGORY_IMAGES = {
  'Basketball': basketballImg,
  'Volleyball': volleyballImg,
  'Tennis': tennisImg,
  'Table Tennis': tableTennisImg,
  'Track and Field': trackAndFieldImg,
  'Track & Field': trackAndFieldImg,
  'Football': footballImg,
  'Sepak Takraw': sepakTakrawImg,
  'Beach Volleyball': beachVolleyballImg,
  'Billiards': billiardsImg,
  'Badminton': badmintonImg,
  'Futsal': futsalImg,
};

export function getSportImage(itemOrCategory) {
  if (!itemOrCategory) return basketballImg;

  let cat = '';
  let name = '';
  if (typeof itemOrCategory === 'string') {
    cat = itemOrCategory;
  } else if (typeof itemOrCategory === 'object') {
    cat = itemOrCategory.category || '';
    name = (itemOrCategory.name || '') + ' ' + (itemOrCategory.code || '');
  }

  const combined = (cat + ' ' + name).toLowerCase();

  if (combined.includes('beach volleyball') || (combined.includes('volleyball') && combined.includes('sand'))) return beachVolleyballImg;
  if (combined.includes('table tennis') || combined.includes('ping pong') || combined.includes('paddle') || combined.includes('stiga') || combined.includes('dhs')) return tableTennisImg;
  if (combined.includes('track') || combined.includes('field') || combined.includes('baton') || combined.includes('shot put') || combined.includes('hurdle') || combined.includes('stopwatch')) return trackAndFieldImg;
  if (combined.includes('sepak') || combined.includes('takraw')) return sepakTakrawImg;
  if (combined.includes('billiard') || combined.includes('pool') || combined.includes('cue') || combined.includes('triangle')) return billiardsImg;
  if (combined.includes('badminton') || combined.includes('shuttlecock') || combined.includes('yonex')) return badmintonImg;
  if (combined.includes('futsal')) return futsalImg;
  if (combined.includes('football') || combined.includes('soccer') || combined.includes('fifa') || combined.includes('goal')) return footballImg;
  if (combined.includes('tennis')) return tennisImg;
  if (combined.includes('volleyball')) return volleyballImg;
  if (combined.includes('basketball')) return basketballImg;

  if (CATEGORY_IMAGES[cat]) return CATEGORY_IMAGES[cat];

  return basketballImg;
}

export const INITIAL_EQUIPMENT_LIST = [
  {
    id: 'PE-023',
    code: '#PE-023',
    name: 'Molten Official Basketball',
    category: 'Basketball',
    condition: 'Excellent',
    available: 10,
    total: 12,
    location: 'PE Storage Room',
    status: 'Available',
    image: CATEGORY_IMAGES['Basketball'],
    description: 'Official FIBA-approved composite leather basketball size 7.',
  },
  {
    id: 'PE-015',
    code: '#PE-015',
    name: 'Spalding Official Basketball',
    category: 'Basketball',
    condition: 'Excellent',
    available: 8,
    total: 12,
    location: 'Sports Complex Room 102',
    status: 'Available',
    image: CATEGORY_IMAGES['Basketball'],
    description: 'Regulation size 7 composite leather basketball suitable for indoor court play.',
  },
  {
    id: 'PE-008',
    code: '#PE-008',
    name: 'Mikasa Tournament Volleyball',
    category: 'Volleyball',
    condition: 'Good',
    available: 5,
    total: 10,
    location: 'Gymnasium Locker B',
    status: 'Available',
    image: CATEGORY_IMAGES['Volleyball'],
    description: 'Official synthetic leather volleyball for indoor training.',
  },
  {
    id: 'PE-007',
    code: '#PE-007',
    name: 'Mikasa Pro Volleyball',
    category: 'Volleyball',
    condition: 'Good',
    available: 7,
    total: 8,
    location: 'PE Storage Room',
    status: 'Available',
    image: CATEGORY_IMAGES['Volleyball'],
    description: 'High-performance 18-panel volleyball with dimpled surface.',
  },
  {
    id: 'PE-022',
    code: '#PE-022',
    name: 'Yonex Badminton Racket Set',
    category: 'Badminton',
    condition: 'Very Good',
    available: 6,
    total: 8,
    location: 'Sports Complex Room 102',
    status: 'Available',
    image: CATEGORY_IMAGES['Badminton'],
    description: 'Pair of lightweight graphite rackets with carrying case and shuttlecocks.',
  },
  {
    id: 'PE-012',
    code: '#PE-012',
    name: 'Wilson Pro Tennis Racket',
    category: 'Tennis',
    condition: 'Fair',
    available: 4,
    total: 6,
    location: 'Sports Office',
    status: 'Available',
    image: CATEGORY_IMAGES['Tennis'],
    description: 'Graphite composite tennis racket with synthetic gut strings.',
  },
  {
    id: 'PE-004',
    code: '#PE-004',
    name: 'Adidas FIFA Match Soccer Ball',
    category: 'Football',
    condition: 'Excellent',
    available: 6,
    total: 8,
    location: 'Field Equipment Shed',
    status: 'Available',
    image: CATEGORY_IMAGES['Football'],
    description: 'Seamless thermal-bonded match soccer ball size 5.',
  },
  {
    id: 'PE-035',
    code: '#PE-035',
    name: 'Track & Field Relay Baton Set',
    category: 'Track and Field',
    condition: 'Excellent',
    available: 8,
    total: 10,
    location: 'Track & Oval Shed',
    status: 'Available',
    image: CATEGORY_IMAGES['Track and Field'],
    description: 'Anodized aluminum competition relay batons and running stopwatch.',
  },
  {
    id: 'PE-042',
    code: '#PE-042',
    name: 'Nelco Competition Shot Put (5kg)',
    category: 'Track and Field',
    condition: 'Excellent',
    available: 6,
    total: 6,
    location: 'Field Equipment Shed',
    status: 'Available',
    image: CATEGORY_IMAGES['Track and Field'],
    description: 'Solid cast iron competition shot put sphere 5.0kg.',
  },
  {
    id: 'PE-043',
    code: '#PE-043',
    name: 'Precision Agility Ladder & Hurdle Set',
    category: 'Track and Field',
    condition: 'Good',
    available: 5,
    total: 6,
    location: 'Track & Oval Shed',
    status: 'Available',
    image: CATEGORY_IMAGES['Track and Field'],
    description: 'Adjustable 6m speed agility ladder and 6 micro-hurdles.',
  },
  {
    id: 'PE-044',
    code: '#PE-044',
    name: 'Fastime Digital Track Stopwatch',
    category: 'Track and Field',
    condition: 'Excellent',
    available: 10,
    total: 10,
    location: 'PE Faculty Office',
    status: 'Available',
    image: CATEGORY_IMAGES['Track and Field'],
    description: 'Multi-lap precision track & field digital coach stopwatch.',
  },
  {
    id: 'PE-045',
    code: '#PE-045',
    name: 'Nike Academy Football Training Ball',
    category: 'Football',
    condition: 'Very Good',
    available: 8,
    total: 10,
    location: 'Field Equipment Shed',
    status: 'Available',
    image: CATEGORY_IMAGES['Football'],
    description: 'Aerowsculpt groove technology size 5 football for team training.',
  },
  {
    id: 'PE-046',
    code: '#PE-046',
    name: 'Reusch Football Goalkeeper Gloves',
    category: 'Football',
    condition: 'Good',
    available: 4,
    total: 6,
    location: 'Field Equipment Shed',
    status: 'Available',
    image: CATEGORY_IMAGES['Football'],
    description: 'Padded latex palm goalkeeper match gloves size 9.',
  },
  {
    id: 'PE-047',
    code: '#PE-047',
    name: 'Football Scrimmage Vests (Set of 10)',
    category: 'Football',
    condition: 'Good',
    available: 5,
    total: 6,
    location: 'PE Storage Room',
    status: 'Available',
    image: CATEGORY_IMAGES['Football'],
    description: 'Breathable neon scrimmage pinnies for practice matches.',
  },
  {
    id: 'PE-036',
    code: '#PE-036',
    name: 'Marathon Sepak Takraw Ball',
    category: 'Sepak Takraw',
    condition: 'Good',
    available: 6,
    total: 8,
    location: 'PE Storage Room',
    status: 'Available',
    image: CATEGORY_IMAGES['Sepak Takraw'],
    description: 'Official tournament woven synthetic rattan sepak takraw ball.',
  },
  {
    id: 'PE-048',
    code: '#PE-048',
    name: 'Gajah Emas Synthetic Takraw Ball',
    category: 'Sepak Takraw',
    condition: 'Excellent',
    available: 7,
    total: 8,
    location: 'Gymnasium Locker B',
    status: 'Available',
    image: CATEGORY_IMAGES['Sepak Takraw'],
    description: 'Competition grade woven ball for fast court action.',
  },
  {
    id: 'PE-049',
    code: '#PE-049',
    name: 'Marathon Sepak Takraw Tournament Net',
    category: 'Sepak Takraw',
    condition: 'Very Good',
    available: 3,
    total: 4,
    location: 'PE Storage Room',
    status: 'Available',
    image: CATEGORY_IMAGES['Sepak Takraw'],
    description: 'Regulation nylon mesh net with reinforced steel cable.',
  },
  {
    id: 'PE-037',
    code: '#PE-037',
    name: 'Mikasa Beach Classic Volleyball',
    category: 'Beach Volleyball',
    condition: 'Good',
    available: 5,
    total: 6,
    location: 'Sand Court Storage',
    status: 'Available',
    image: CATEGORY_IMAGES['Beach Volleyball'],
    description: 'Soft stitched 10-panel water-resistant beach volleyball.',
  },
  {
    id: 'PE-050',
    code: '#PE-050',
    name: 'Wilson Castaway Outdoor Beach Volleyball',
    category: 'Beach Volleyball',
    condition: 'Excellent',
    available: 6,
    total: 8,
    location: 'Sand Court Storage',
    status: 'Available',
    image: CATEGORY_IMAGES['Beach Volleyball'],
    description: 'Iconic outdoor beach volleyball with 18-panel synthetic cover.',
  },
  {
    id: 'PE-051',
    code: '#PE-051',
    name: 'Beach Volleyball Sand Court Boundary Line Kit',
    category: 'Beach Volleyball',
    condition: 'Very Good',
    available: 4,
    total: 4,
    location: 'Sand Court Storage',
    status: 'Available',
    image: CATEGORY_IMAGES['Beach Volleyball'],
    description: 'Heavy duty blue webbing boundary line with corner anchors.',
  },
  {
    id: 'PE-038',
    code: '#PE-038',
    name: 'Aramith Billiards Pool Ball & Cue Set',
    category: 'Billiards',
    condition: 'Excellent',
    available: 4,
    total: 4,
    location: 'Student Activity Hall',
    status: 'Available',
    image: CATEGORY_IMAGES['Billiards'],
    description: 'Standard 16-ball phenolic billiard ball set with two 57-inch cues.',
  },
  {
    id: 'PE-052',
    code: '#PE-052',
    name: 'Two-Piece Maple Billiards Cue Stick',
    category: 'Billiards',
    condition: 'Excellent',
    available: 6,
    total: 8,
    location: 'Student Activity Hall',
    status: 'Available',
    image: CATEGORY_IMAGES['Billiards'],
    description: '19oz professional Canadian maple cue with 13mm leather tip.',
  },
  {
    id: 'PE-053',
    code: '#PE-053',
    name: 'Billiards Wooden Triangle Rack & Cue Ball',
    category: 'Billiards',
    condition: 'Good',
    available: 5,
    total: 5,
    location: 'Student Activity Hall',
    status: 'Available',
    image: CATEGORY_IMAGES['Billiards'],
    description: 'Solid wood triangle rack and regulation 2-1/4 inch cue ball.',
  },
  {
    id: 'PE-054',
    code: '#PE-054',
    name: 'Victor Champion Feather Shuttlecocks (Tube of 12)',
    category: 'Badminton',
    condition: 'Excellent',
    available: 12,
    total: 15,
    location: 'Sports Complex Room 102',
    status: 'Available',
    image: CATEGORY_IMAGES['Badminton'],
    description: 'Tournament grade duck feather shuttlecocks speed 77.',
  },
  {
    id: 'PE-055',
    code: '#PE-055',
    name: 'Yonex Astrox Smash Badminton Racket',
    category: 'Badminton',
    condition: 'Excellent',
    available: 6,
    total: 6,
    location: 'Sports Complex Room 102',
    status: 'Available',
    image: CATEGORY_IMAGES['Badminton'],
    description: 'Rotational Generator system offensive badminton racket.',
  },
  {
    id: 'PE-056',
    code: '#PE-056',
    name: 'Tournament Regulation Badminton Net Set',
    category: 'Badminton',
    condition: 'Very Good',
    available: 4,
    total: 4,
    location: 'Gymnasium Locker B',
    status: 'Available',
    image: CATEGORY_IMAGES['Badminton'],
    description: 'Official 20ft badminton net with braided nylon cord.',
  },
  {
    id: 'PE-039',
    code: '#PE-039',
    name: 'Molten Vantaggio Futsal Ball',
    category: 'Futsal',
    condition: 'Excellent',
    available: 7,
    total: 8,
    location: 'Gymnasium Locker B',
    status: 'Available',
    image: CATEGORY_IMAGES['Futsal'],
    description: 'Low-bounce regulation size 4 futsal ball for hardwood and indoor courts.',
  },
  {
    id: 'PE-057',
    code: '#PE-057',
    name: 'Select Futsal Master Low-Bounce Ball',
    category: 'Futsal',
    condition: 'Excellent',
    available: 6,
    total: 6,
    location: 'Gymnasium Locker B',
    status: 'Available',
    image: CATEGORY_IMAGES['Futsal'],
    description: 'High-visibility grain PU surface match futsal ball.',
  },
  {
    id: 'PE-058',
    code: '#PE-058',
    name: 'Futsal Goalie Knee & Elbow Protective Pads',
    category: 'Futsal',
    condition: 'Good',
    available: 5,
    total: 6,
    location: 'PE Storage Room',
    status: 'Available',
    image: CATEGORY_IMAGES['Futsal'],
    description: 'EVA foam compression support sleeves for indoor futsal keepers.',
  },
  {
    id: 'PE-031',
    code: '#PE-031',
    name: 'Stiga Pro Carbon Table Tennis Paddle Set',
    category: 'Table Tennis',
    condition: 'Excellent',
    available: 8,
    total: 10,
    location: 'Rec Hall Storage',
    status: 'Available',
    image: CATEGORY_IMAGES['Table Tennis'],
    description: 'Pair of 7-ply balsa carbon table tennis paddles with ITTF tournament rubber.',
  },
  {
    id: 'PE-064',
    code: '#PE-064',
    name: 'DHS 3-Star Table Tennis Balls (Pack of 6)',
    category: 'Table Tennis',
    condition: 'Excellent',
    available: 15,
    total: 20,
    location: 'Rec Hall Storage',
    status: 'Available',
    image: CATEGORY_IMAGES['Table Tennis'],
    description: 'Official 40+ celluloid-free 3-star tournament table tennis balls.',
  },
  {
    id: 'PE-065',
    code: '#PE-065',
    name: 'Butterfly Retractable Table Tennis Net Set',
    category: 'Table Tennis',
    condition: 'Very Good',
    available: 4,
    total: 4,
    location: 'Rec Hall Storage',
    status: 'Available',
    image: CATEGORY_IMAGES['Table Tennis'],
    description: 'Universal clamp-on adjustable spring table tennis net for any standard table.',
  },
];

export function normalizeEquipmentCategory(item) {
  if (
    item.category &&
    item.category !== 'PE & Sports' &&
    item.category !== 'Electronics' &&
    item.category !== 'Laboratory'
  ) {
    return item.category;
  }
  const n = (item.name || '').toLowerCase();
  if (n.includes('table tennis') || n.includes('ping pong') || n.includes('paddle') || n.includes('stiga') || n.includes('dhs')) return 'Table Tennis';
  if (n.includes('basketball')) return 'Basketball';
  if (n.includes('beach volleyball') || n.includes('sand')) return 'Beach Volleyball';
  if (n.includes('volleyball')) return 'Volleyball';
  if (n.includes('tennis')) return 'Tennis';
  if (n.includes('track') || n.includes('baton') || n.includes('shot put') || n.includes('hurdle') || n.includes('stopwatch')) return 'Track and Field';
  if (n.includes('futsal')) return 'Futsal';
  if (n.includes('football') || n.includes('soccer') || n.includes('fifa') || n.includes('goal')) return 'Football';
  if (n.includes('takraw')) return 'Sepak Takraw';
  if (n.includes('billiard') || n.includes('pool') || n.includes('cue') || n.includes('triangle')) return 'Billiards';
  if (n.includes('badminton') || n.includes('shuttlecock') || n.includes('racket')) return 'Badminton';
  return 'Basketball';
}

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
];

export const INITIAL_NOTIFICATIONS = [
  {
    id: 'NOTIF-1',
    title: 'Equipment Borrowed',
    message: 'You borrowed Spalding Official Basketball (PE-015). Due today at 5:00 PM.',
    time: '2 hours ago',
    unread: true,
  },
  {
    id: 'NOTIF-2',
    title: 'Reminder: Return Due Today',
    message: 'Please return your borrowed equipment before 5:00 PM at Sports Complex Room 102.',
    time: '30 mins ago',
    unread: true,
  },
];
