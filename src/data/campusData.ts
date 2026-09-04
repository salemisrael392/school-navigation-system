import { Building, NearbyCard, NavigationStep, EmergencyContact } from '../types';

export const CAMPUS_BUILDINGS: Building[] = [
  {
    id: 'srix-block-a',
    name: 'SRiX & School of Computer Science',
    shortName: 'BLOCK A • CSE & IT',
    subtitle: 'School of Computer Science & SR Innovation Exchange',
    badge: 'Center of Excellence',
    badgeVariant: 'lavender',
    category: 'academic',
    liveStatus: 'Open • In Session',
    isOpen: true,
    distanceMeters: 120,
    walkMinutes: 2,
    levels: 'G + 4 Floors',
    totalFloors: 5,
    description: 'Premier academic and research center housing Computer Science engineering, AI research facilities, and SRiX technology business incubator supported by DST Govt of India.',
    imageUrl: 'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=1000&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=400&q=80',
    mapX: 25,
    mapY: 34,
    blockTag: 'Block A',
    blockCode: 'A',
    contactPerson: 'Dr. V. Rajesh, Dean of CSE',
    phoneExtension: 'Ext. 2410',
    facilities: [
      {
        id: 'f1',
        name: 'AI & Deep Learning Lab',
        room: 'Room 204 • Level 2',
        level: 'Level 2',
        iconName: 'Brain',
        description: 'Equipped with Nvidia DGX workstation servers and high-speed compute clusters for LLM and Computer Vision research.'
      },
      {
        id: 'f2',
        name: 'SRiX Incubator Hub',
        room: 'DST Supported • Level 1',
        level: 'Level 1',
        iconName: 'Rocket',
        description: 'Technology Business Incubator fostering 40+ student and regional deep-tech startups with prototyping labs.'
      },
      {
        id: 'f3',
        name: 'Embedded IoT & Robotics',
        room: 'Room 312 • Level 3',
        level: 'Level 3',
        iconName: 'Cpu',
        description: 'Hardware testbenches, sensor interfacing, microcontrollers, ARM architecture development, and drone flight testing.'
      },
      {
        id: 'f4',
        name: 'Nest Entrepreneurship',
        room: 'Ground Floor • Block A',
        level: 'Ground Floor',
        iconName: 'Lightbulb',
        description: 'Ideation lounge, venture pitch auditorium, legal IP consultation desks, and collaborative coworking space.'
      }
    ],
    floorPlans: [
      {
        levelNumber: 0,
        levelName: 'Ground Floor',
        description: 'Main Foyer, Nest Entrepreneurship Lounge, Student Helpdesk & Cafeteria',
        rooms: [
          { roomNumber: 'G01', name: 'Main Reception & Helpdesk', type: 'office', x: 10, y: 15, width: 25, height: 30 },
          { roomNumber: 'G02', name: 'Nest Entrepreneurship Lounge', type: 'facility', x: 40, y: 15, width: 30, height: 35 },
          { roomNumber: 'G03', name: 'Makerspace Lab 1', type: 'lab', x: 75, y: 15, width: 20, height: 35 },
          { roomNumber: 'E01', name: 'High-speed Elevators', type: 'stairs', x: 40, y: 60, width: 12, height: 25 },
          { roomNumber: 'R01', name: 'Accessible Restrooms', type: 'restroom', x: 60, y: 60, width: 15, height: 25 },
          { roomNumber: 'G04', name: 'Seminar Hall 1', type: 'classroom', x: 10, y: 55, width: 25, height: 35 }
        ]
      },
      {
        levelNumber: 1,
        levelName: 'Level 1',
        description: 'SRiX Startup Co-working Space, Meeting Rooms & Boardrooms',
        rooms: [
          { roomNumber: '101', name: 'SRiX Reception & DST Office', type: 'office', x: 10, y: 15, width: 25, height: 30 },
          { roomNumber: '102', name: 'Startup Incubation Bay A', type: 'facility', x: 40, y: 15, width: 28, height: 40 },
          { roomNumber: '103', name: 'Rapid Prototyping Lab', type: 'lab', x: 72, y: 15, width: 23, height: 40 },
          { roomNumber: '104', name: 'Mentorship Cabins', type: 'office', x: 10, y: 55, width: 25, height: 35 },
          { roomNumber: 'E01', name: 'Elevators & Fire Stairs', type: 'stairs', x: 40, y: 65, width: 15, height: 25 },
          { roomNumber: 'R01', name: 'Restrooms', type: 'restroom', x: 60, y: 65, width: 15, height: 25 }
        ]
      },
      {
        levelNumber: 2,
        levelName: 'Level 2',
        description: 'AI & Machine Learning Research Labs, Data Science Faculty Cabins',
        rooms: [
          { roomNumber: '201', name: 'Department Head - CSE', type: 'office', x: 10, y: 15, width: 22, height: 30 },
          { roomNumber: '204', name: 'AI & Deep Learning Lab', type: 'lab', x: 36, y: 15, width: 34, height: 45 },
          { roomNumber: '206', name: 'Cloud Computing Lab', type: 'lab', x: 74, y: 15, width: 22, height: 45 },
          { roomNumber: '202', name: 'Smart Classroom 2A', type: 'classroom', x: 10, y: 55, width: 22, height: 35 },
          { roomNumber: 'E01', name: 'Elevators', type: 'stairs', x: 38, y: 70, width: 14, height: 20 },
          { roomNumber: 'R01', name: 'Restrooms', type: 'restroom', x: 58, y: 70, width: 14, height: 20 }
        ]
      },
      {
        levelNumber: 3,
        levelName: 'Level 3',
        description: 'Embedded Systems, IoT & Cyber Security Advanced Centers',
        rooms: [
          { roomNumber: '301', name: 'Cyber Security Operations Center', type: 'lab', x: 10, y: 15, width: 30, height: 40 },
          { roomNumber: '312', name: 'Embedded IoT & Robotics Lab', type: 'lab', x: 45, y: 15, width: 30, height: 45 },
          { roomNumber: '315', name: 'VLSI Design Suite', type: 'lab', x: 78, y: 15, width: 18, height: 45 },
          { roomNumber: '302', name: 'Classroom 3B', type: 'classroom', x: 10, y: 60, width: 25, height: 30 },
          { roomNumber: 'E01', name: 'Elevators', type: 'stairs', x: 42, y: 70, width: 14, height: 20 },
          { roomNumber: 'R01', name: 'Restrooms', type: 'restroom', x: 62, y: 70, width: 14, height: 20 }
        ]
      },
      {
        levelNumber: 4,
        levelName: 'Level 4',
        description: 'Postgraduate Research Suites, PhD Scholar Arena & Roof Deck',
        rooms: [
          { roomNumber: '401', name: 'PhD Research Scholar Arena', type: 'facility', x: 10, y: 15, width: 38, height: 50 },
          { roomNumber: '408', name: 'Advanced GPU Cluster Room', type: 'lab', x: 52, y: 15, width: 25, height: 40 },
          { roomNumber: '410', name: 'Department Council Room', type: 'office', x: 80, y: 15, width: 16, height: 40 },
          { roomNumber: 'E01', name: 'Elevators & Roof Access', type: 'stairs', x: 45, y: 70, width: 15, height: 20 },
          { roomNumber: 'R01', name: 'Restrooms', type: 'restroom', x: 65, y: 70, width: 15, height: 20 }
        ]
      }
    ]
  },
  {
    id: 'centenary-bhavan',
    name: 'Centenary Bhavan',
    shortName: 'ADMIN BLOCK',
    subtitle: 'Vice Chancellor & Admissions HQ',
    badge: 'Admin HQ',
    badgeVariant: 'blue',
    category: 'admin',
    liveStatus: 'Open • 09:00 - 17:30',
    isOpen: true,
    distanceMeters: 180,
    walkMinutes: 3,
    levels: 'G + 2 Floors',
    totalFloors: 3,
    description: 'Iconic heritage neoclassical administrative center of SR University, housing the Office of the Vice Chancellor, Registrar, Admissions Directorate, Examination Cell, and Student Accounts.',
    imageUrl: 'https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?auto=format&fit=crop&w=1000&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?auto=format&fit=crop&w=400&q=80',
    mapX: 50,
    mapY: 20,
    blockTag: 'Admin Block',
    blockCode: 'Admin',
    contactPerson: 'Registrar Office',
    phoneExtension: 'Ext. 1001',
    facilities: [
      {
        id: 'cb1',
        name: 'Admissions & Counseling Wing',
        room: 'Ground Floor • South Wing',
        level: 'Ground Floor',
        iconName: 'Shield',
        description: 'Dedicated counters for enrollment inquiries, scholarship verifications, and document submissions.'
      },
      {
        id: 'cb2',
        name: 'Vice Chancellor Secretariat',
        room: 'Level 1 • Central Suite',
        level: 'Level 1',
        iconName: 'Lightbulb',
        description: 'Executive governance offices and university syndicate conference chamber.'
      },
      {
        id: 'cb3',
        name: 'Controller of Examinations',
        room: 'Level 2 • Hall 201',
        level: 'Level 2',
        iconName: 'BookOpen',
        description: 'Transcripts, degree certifications, grade sheet verification and hall tickets issuance.'
      },
      {
        id: 'cb4',
        name: 'Fee Accounts & Cashier',
        room: 'Ground Floor • Room G-08',
        level: 'Ground Floor',
        iconName: 'Coffee',
        description: 'Student tuition fees, hostel caution deposits, and challan processing.'
      }
    ]
  },
  {
    id: 'central-library',
    name: 'Central Library',
    shortName: 'CENTRAL LIBRARY',
    subtitle: 'Learning Resource Center & Digital Catalog',
    badge: 'Open Till 9 PM',
    badgeVariant: 'amber',
    category: 'academic',
    liveStatus: 'Open Till 9:00 PM',
    isOpen: true,
    distanceMeters: 240,
    walkMinutes: 4,
    levels: 'G + 3 Floors',
    totalFloors: 4,
    description: 'State-of-the-art modern library featuring over 65,000 physical volumes, IEEE Xplore & ScienceDirect digital terminals, silent study cubicles, and multimedia conference facilities.',
    imageUrl: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=1000&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=400&q=80',
    mapX: 75,
    mapY: 34,
    blockTag: 'Library Block',
    blockCode: 'Library',
    contactPerson: 'Chief Librarian',
    phoneExtension: 'Ext. 3105',
    facilities: [
      {
        id: 'cl1',
        name: 'Digital Reference Lounge',
        room: 'Level 1 • E-Access Bay',
        level: 'Level 1',
        iconName: 'Cpu',
        description: 'High-speed computer stations with Springer, Elsevier, and IEEE academic databases.'
      },
      {
        id: 'cl2',
        name: '24/7 Reading & Discussion Hall',
        room: 'Ground Floor • East Wing',
        level: 'Ground Floor',
        iconName: 'BookOpen',
        description: 'Acoustically treated late-night reading room with uninterrupted power backup and charging ports.'
      },
      {
        id: 'cl3',
        name: 'Periodicals & Journal Archives',
        room: 'Level 2 • Stacks A-F',
        level: 'Level 2',
        iconName: 'BookOpen',
        description: 'National and international research journals, theses repository, and newspapers.'
      }
    ]
  },
  {
    id: 'block-b',
    name: 'Block B - Mechanical & Civil Engg',
    shortName: 'BLOCK B',
    subtitle: 'School of Mechanical & Civil Engineering',
    badge: 'Heavy Machinery',
    badgeVariant: 'blue',
    category: 'academic',
    liveStatus: 'Open • Labs Running',
    isOpen: true,
    distanceMeters: 220,
    walkMinutes: 3,
    levels: 'G + 3 Floors',
    totalFloors: 4,
    description: 'Specialized engineering block equipped with materials testing laboratories, wind tunnels, hydraulic machinery, CNC automation centers, and survey instrument bays.',
    imageUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1000&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=400&q=80',
    mapX: 25,
    mapY: 48,
    blockTag: 'Block B',
    blockCode: 'B',
    contactPerson: 'Prof. T. Murali, Head of Mechanical',
    phoneExtension: 'Ext. 2201',
    facilities: [
      {
        id: 'b1',
        name: 'CNC & Manufacturing Workshop',
        room: 'Ground Floor • Bay 1',
        level: 'Ground Floor',
        iconName: 'Cpu',
        description: 'Industrial lathes, 5-axis CNC vertical milling machine, and rapid tooling stations.'
      },
      {
        id: 'b2',
        name: 'Strength of Materials Lab',
        room: 'Room 105 • Level 1',
        level: 'Level 1',
        iconName: 'Shield',
        description: 'Universal Testing Machine (UTM), torsion testers, and hardness testing equipment.'
      },
      {
        id: 'b3',
        name: 'Fluid Mechanics & Hydraulics Bay',
        room: 'Ground Floor • South Bay',
        level: 'Ground Floor',
        iconName: 'Activity',
        description: 'Venturi meter testbeds, Pelton wheel and Francis turbine flow rigs.'
      }
    ]
  },
  {
    id: 'block-c',
    name: 'Block C - Electrical & Electronics Engg',
    shortName: 'BLOCK C • ECE & EEE',
    subtitle: 'School of Electrical, Electronics & Communication Engg',
    badge: 'Semiconductor Hub',
    badgeVariant: 'lavender',
    category: 'academic',
    liveStatus: 'Open • In Session',
    isOpen: true,
    distanceMeters: 190,
    walkMinutes: 3,
    levels: 'G + 3 Floors',
    totalFloors: 4,
    description: 'Advanced electronics and electrical engineering center housing VLSI chip design suites, telecommunications labs, smart power grid testbenches, and microelectronics fabrication setups.',
    imageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1000&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=400&q=80',
    mapX: 38,
    mapY: 48,
    blockTag: 'Block C',
    blockCode: 'C',
    contactPerson: 'Dr. M. Sravanthi, HOD ECE',
    phoneExtension: 'Ext. 2304',
    facilities: [
      {
        id: 'c1',
        name: 'VLSI & Circuit Simulation Suite',
        room: 'Room 304 • Level 3',
        level: 'Level 3',
        iconName: 'Cpu',
        description: 'Cadence EDA tools, FPGA development boards, and digital logic analyzers.'
      },
      {
        id: 'c2',
        name: 'Embedded Systems & DSP Lab',
        room: 'Room 201 • Level 2',
        level: 'Level 2',
        iconName: 'Brain',
        description: 'Microcontroller prototyping kits, digital signal processors, and oscilloscope benches.'
      },
      {
        id: 'c3',
        name: 'Power Systems & EV Charging Lab',
        room: 'Ground Floor • Bay 2',
        level: 'Ground Floor',
        iconName: 'Lightbulb',
        description: 'Electric vehicle battery management system testbenches and smart grid simulator.'
      }
    ]
  },
  {
    id: 'block-d',
    name: 'Block D - Sciences, Humanities & BioTech',
    shortName: 'BLOCK D • SCIENCES',
    subtitle: 'Department of Physics, Chemistry, Mathematics & Biotech',
    badge: 'Discovery Center',
    badgeVariant: 'green',
    category: 'academic',
    liveStatus: 'Open • Practical Classes',
    isOpen: true,
    distanceMeters: 260,
    walkMinutes: 4,
    levels: 'G + 3 Floors',
    totalFloors: 4,
    description: 'Dedicated foundation science and advanced biotechnology complex with analytical chemistry instrumentation, optics and photonics laboratories, and computational biology suites.',
    imageUrl: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=1000&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=400&q=80',
    mapX: 52,
    mapY: 48,
    blockTag: 'Block D',
    blockCode: 'D',
    contactPerson: 'Prof. Ramesh Chandra, Dean of Sciences',
    phoneExtension: 'Ext. 2110',
    facilities: [
      {
        id: 'd1',
        name: 'Optics, Lasers & Photonics Lab',
        room: 'Room 102 • Level 1',
        level: 'Level 1',
        iconName: 'Lightbulb',
        description: 'He-Ne laser experiments, spectrophotometers, and optical fiber transmission rigs.'
      },
      {
        id: 'd2',
        name: 'Biotechnology & Tissue Culture Lab',
        room: 'Room 205 • Level 2',
        level: 'Level 2',
        iconName: 'Shield',
        description: 'Biosafety laminar flow cabinets, PCR thermal cyclers, and refrigerated centrifuges.'
      },
      {
        id: 'd3',
        name: 'Language & Communication Skills Lab',
        room: 'Ground Floor • Room G-04',
        level: 'Ground Floor',
        iconName: 'BookOpen',
        description: 'Interactive audio-visual consoles for TOEFL/GRE preparation and corporate soft skills.'
      }
    ]
  },
  {
    id: 'block-e',
    name: 'Block E - School of Business & Architecture',
    shortName: 'BLOCK E • MBA & DESIGN',
    subtitle: 'SRU School of Business, Executive MBA & Architecture Studio',
    badge: 'Corporate Wing',
    badgeVariant: 'amber',
    category: 'academic',
    liveStatus: 'Open • Seminars Live',
    isOpen: true,
    distanceMeters: 340,
    walkMinutes: 5,
    levels: 'G + 3 Floors',
    totalFloors: 4,
    description: 'Executive business school and design architecture wing with Harvard-style tiered lecture halls, financial Bloomberg trading terminal room, moot court hall, and architectural drafting studios.',
    imageUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1000&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=400&q=80',
    mapX: 65,
    mapY: 48,
    blockTag: 'Block E',
    blockCode: 'E',
    contactPerson: 'Dr. Anita Sharma, Director of Management',
    phoneExtension: 'Ext. 2500',
    facilities: [
      {
        id: 'e1',
        name: 'Bloomberg Financial Trading Lab',
        room: 'Room 104 • Level 1',
        level: 'Level 1',
        iconName: 'Activity',
        description: 'Live global market tickers, equity analytics terminals, and algorithmic trading simulators.'
      },
      {
        id: 'e2',
        name: 'Architectural Drafting & Model Studio',
        room: 'Room 208 • Level 2',
        level: 'Level 2',
        iconName: 'Cpu',
        description: 'Precision drawing tables, 3D architectural foam cutters, and laser engraving units.'
      },
      {
        id: 'e3',
        name: 'Executive Case Study Amphitheater',
        room: 'Ground Floor • Hall E-01',
        level: 'Ground Floor',
        iconName: 'BookOpen',
        description: 'Acoustic tiered seating with interactive polling monitors and dual 4K laser projection.'
      }
    ]
  },
  {
    id: 'sports-complex',
    name: 'SRU Sports Complex',
    shortName: 'SPORTS COMPLEX',
    subtitle: 'Badminton Courts, Gymnasium & Indoor Arena',
    badge: 'Open Turf',
    badgeVariant: 'green',
    category: 'sports',
    liveStatus: 'Open Till 8:30 PM',
    isOpen: true,
    distanceMeters: 310,
    walkMinutes: 5,
    levels: 'Indoor Arena + Outdoor Grounds',
    totalFloors: 2,
    description: 'Olympic-standard wooden badminton courts, fully outfitted fitness gym, table tennis tables, outdoor synthetic basketball court, and floodlit cricket nets.',
    imageUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1000&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=400&q=80',
    mapX: 75,
    mapY: 48,
    facilities: [
      {
        id: 'sc1',
        name: 'Indoor Badminton Arena',
        room: 'Courts 1 to 4',
        level: 'Ground Floor',
        iconName: 'Activity',
        description: 'BWF certified wooden flooring courts with professional glare-free overhead LED lighting.'
      },
      {
        id: 'sc2',
        name: 'Cardio & Strength Gym',
        room: 'Level 1 • Fitness Studio',
        level: 'Level 1',
        iconName: 'Activity',
        description: 'Modern treadmills, cross-trainers, free weights, kettlebells, and certified physical trainers.'
      }
    ]
  },
  {
    id: 'hostels-mess',
    name: 'Student Hostels & Dining Hall',
    shortName: 'HOSTELS & MESS',
    subtitle: 'Boys & Girls Resident Blocks & Central Dining',
    badge: 'Resident Zone',
    badgeVariant: 'amber',
    category: 'hostel',
    liveStatus: 'Dinner 19:30 - 21:30',
    isOpen: true,
    distanceMeters: 450,
    walkMinutes: 6,
    levels: 'Blocks H1 to H4 (G + 5)',
    totalFloors: 6,
    description: 'On-campus residential quarters with Wi-Fi, 24-hour security surveillance, hygienic dining mess serving regional cuisines, reading rooms, and recreational lounges.',
    imageUrl: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=1000&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=400&q=80',
    mapX: 72,
    mapY: 62,
    facilities: [
      {
        id: 'hm1',
        name: 'Central Dining Hall',
        room: 'Mess Bay A & B',
        level: 'Ground Floor',
        iconName: 'Coffee',
        description: 'Multi-cuisine nutritious breakfast, lunch, high tea, and dinner prepared with strict hygiene standards.'
      },
      {
        id: 'hm2',
        name: 'Hostel Warden Office',
        room: 'Block H1 • Room 01',
        level: 'Ground Floor',
        iconName: 'Shield',
        description: 'Room allocations, night gate passes, maintenance requests, and resident welfare.'
      }
    ]
  },
  {
    id: 'green-quadrangle',
    name: 'Green Quadrangle Lawns',
    shortName: 'GREEN QUADRANGLE',
    subtitle: 'Central Campus Gardens & Amphitheatre',
    badge: 'Wi-Fi Zone',
    badgeVariant: 'green',
    category: 'amenity',
    liveStatus: 'Open 24/7',
    isOpen: true,
    distanceMeters: 60,
    walkMinutes: 1,
    levels: 'Open Air Ground',
    totalFloors: 1,
    description: 'The green heart of SR University featuring manicured lawns, shady neem groves, solar-powered benches, open-air discussion plazas, and campus Wi-Fi connectivity.',
    imageUrl: 'https://images.unsplash.com/photo-1519452635265-7b1fbfd1e4e0?auto=format&fit=crop&w=1000&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1519452635265-7b1fbfd1e4e0?auto=format&fit=crop&w=400&q=80',
    mapX: 50,
    mapY: 38,
    facilities: []
  },
  {
    id: 'main-gate',
    name: 'Campus Main Gate 1 & 2',
    shortName: 'MAIN GATE',
    subtitle: 'Security Post, Visitor Verification & Transit Stop',
    badge: '24/7 Security',
    badgeVariant: 'blue',
    category: 'admin',
    liveStatus: 'Active Gate',
    isOpen: true,
    distanceMeters: 520,
    walkMinutes: 7,
    levels: 'Ground Level',
    totalFloors: 1,
    description: 'Main entry boulevard on Hasanparthy Road with automated barrier gates, visitor e-pass scanning, student ID turnstiles, and university shuttle bus pick-up bays.',
    imageUrl: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1000&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=400&q=80',
    mapX: 50,
    mapY: 72,
    facilities: []
  }
];

export const POPULAR_NEARBY: NearbyCard[] = [
  {
    id: 'centenary-bhavan-card',
    name: 'Centenary Bhavan',
    subtitle: 'Vice Chancellor & Admissions HQ',
    badge: 'Admin HQ',
    badgeVariant: 'blue',
    distance: '180m',
    walkTime: '3 min walk',
    imageUrl: 'https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?auto=format&fit=crop&w=600&q=80',
    buildingId: 'centenary-bhavan'
  },
  {
    id: 'central-library-card',
    name: 'Central Library',
    subtitle: 'Digital Catalog & Reading Hall',
    badge: 'Open Till 9 PM',
    badgeVariant: 'amber',
    distance: '240m',
    walkTime: '4 min walk',
    imageUrl: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=600&q=80',
    buildingId: 'central-library'
  },
  {
    id: 'sports-complex-card',
    name: 'Sports Complex',
    subtitle: 'Badminton, Gymnasium & Turf',
    badge: 'Open Turf',
    badgeVariant: 'green',
    distance: '310m',
    walkTime: '5 min walk',
    imageUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=600&q=80',
    buildingId: 'sports-complex'
  },
  {
    id: 'canteen-card',
    name: 'Food Court & Nescafe',
    subtitle: 'South Indian, Snacks & Fresh Juice',
    badge: 'Food Hub',
    badgeVariant: 'amber',
    distance: '150m',
    walkTime: '2 min walk',
    imageUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=80',
    buildingId: 'green-quadrangle'
  }
];

export const DEFAULT_NAVIGATION_STEPS: NavigationStep[] = [
  {
    stepIndex: 1,
    instruction: 'Start at Near Block A Lawns facing North-West',
    distance: '25m',
    iconType: 'straight',
    landmarkNote: 'Keep the Green Quadrangle garden on your right'
  },
  {
    stepIndex: 2,
    instruction: 'Turn slightly right onto paved boulevard walkway',
    distance: '45m',
    iconType: 'turn-right',
    landmarkNote: 'Pass under the solar pergola shade'
  },
  {
    stepIndex: 3,
    instruction: 'Approach SRiX & School of Computer Science (Block A)',
    distance: '30m',
    iconType: 'straight',
    landmarkNote: 'Glass facade North Porch with ramp accessibility'
  },
  {
    stepIndex: 4,
    instruction: 'Take Lift A or central stairs to Level 2',
    distance: '15m',
    iconType: 'elevator',
    landmarkNote: 'Elevator bank is located directly past the main security foyer'
  },
  {
    stepIndex: 5,
    instruction: 'Arrive at AI & Deep Learning Lab (Room 204)',
    distance: '5m',
    iconType: 'arrive',
    landmarkNote: 'On the left corridor past the Dean\'s office'
  }
];

export const EMERGENCY_CONTACTS: EmergencyContact[] = [
  {
    title: 'Campus Security Main Command',
    phone: '(0870) 281-8333',
    role: '24x7 Emergency SOS Response & Patrol',
    availableHours: '24 Hours / 7 Days',
    icon: 'shield'
  },
  {
    title: 'University Health Centre & Ambulance',
    phone: '(0870) 281-8444',
    role: 'Resident Doctor, Paramedics & On-campus Ambulance',
    availableHours: '24 Hours / 7 Days',
    icon: 'ambulance'
  },
  {
    title: 'Women Safety & Anti-Harassment Cell',
    phone: '+91 94901 68000',
    role: 'Confidential Support & Rapid Response',
    availableHours: '24 Hours Helpline',
    icon: 'shield'
  },
  {
    title: 'Chief Proctor & Anti-Ragging Squad',
    phone: '(0870) 281-8555',
    role: 'Student Conduct & Disciplinary Action',
    availableHours: '08:00 AM - 10:00 PM',
    icon: 'phone'
  },
  {
    title: 'Fire Safety & Disaster Response',
    phone: '101 / Ext. 999',
    role: 'Campus Fire Hydrant & Evacuation Command',
    availableHours: '24 Hours',
    icon: 'flame'
  }
];

export const CAMPUS_NOTIFICATIONS = [
  {
    id: 'n1',
    title: 'SRiX DeepTech Hackathon 2026',
    time: 'Today • 10:30 AM',
    body: 'Registration open for 36-hour Generative AI Hackathon at Block A Auditorium.',
    category: 'Event'
  },
  {
    id: 'n2',
    title: 'Library Extended Hours for Mid-Terms',
    time: 'Yesterday',
    body: 'Central Library reading rooms will remain open until 11:30 PM starting Monday.',
    category: 'Academic'
  },
  {
    id: 'n3',
    title: 'Shuttle Bus Timings Updated',
    time: '2 days ago',
    body: 'Morning Kazipet Railway Station shuttle departs from Gate 1 at 07:45 AM and 08:30 AM.',
    category: 'Transit'
  }
];

export const FRESHERS_GUIDE_SECTIONS = [
  {
    id: 'wifi',
    title: 'Campus Wi-Fi Setup',
    icon: 'Wifi',
    summary: 'Connect to "SRU_Student_Secure"',
    steps: [
      'Select network: "SRU_Student_Secure"',
      'Security: WPA2/WPA3 Enterprise (PEAP / MSCHAPv2)',
      'Identity: Your Student Roll Number (e.g. 2403A51000)',
      'Password: Your SRU Portal Password',
      'CA Certificate: Do not validate / Trust System Cert'
    ]
  },
  {
    id: 'shuttle',
    title: 'Bus & Shuttle Schedule',
    icon: 'Bus',
    summary: 'Daily routes connecting Warangal, Hanamkonda & Kazipet',
    steps: [
      'Route 1: Hanamkonda Bus Station ⇄ SRU Gate 1 (Every 20 mins, 7:00 AM - 8:30 PM)',
      'Route 2: Kazipet Railway Junction ⇄ SRU Gate 2 (Every 30 mins)',
      'Route 3: Warangal City Centre ⇄ Campus Express (Morning 7:30 AM, Evening 5:15 PM)',
      'Shuttle tracker is available in the Transit tab'
    ]
  },
  {
    id: 'mess',
    title: 'Mess Timings & Food Stalls',
    icon: 'Utensils',
    summary: 'Daily breakfast, lunch, snacks & dinner slots',
    steps: [
      'Breakfast: 07:30 AM - 09:15 AM (Idli, Dosa, Poha, Tea/Coffee)',
      'Lunch: 12:15 PM - 02:00 PM (Rice, Dal, Curries, Curd, Sambar)',
      'Evening Snacks: 05:00 PM - 06:15 PM (Snacks & Beverages)',
      'Dinner: 07:30 PM - 09:30 PM',
      'Food Street & Nescafe kiosks open till 11:00 PM'
    ]
  },
  {
    id: 'portal',
    title: 'SRU ERP & Learning Portal',
    icon: 'GraduationCap',
    summary: 'Attendance, grades, fee receipts & timetable',
    steps: [
      'ERP Portal: portal.sru.edu.in',
      'LMS Platform: Moodle classroom accounts are assigned during orientation',
      'Minimum attendance threshold: 75% for mid-term examination eligibility'
    ]
  }
];

export const DEFAULT_CLASS_SCHEDULE = [
  {
    id: 'class-1',
    subjectName: 'Deep Learning & Neural Networks',
    courseCode: 'CS-301',
    day: 'Monday' as const,
    startTime: '09:30 AM',
    endTime: '10:30 AM',
    buildingId: 'srix-block-a',
    buildingName: 'Block A • CSE & IT',
    room: 'Room 204 • Level 2',
    facultyName: 'Dr. K. Srinivas',
    color: '#3b82f6',
  },
  {
    id: 'class-2',
    subjectName: 'AI & Deep Learning Hands-on Lab',
    courseCode: 'CS-302P',
    day: 'Monday' as const,
    startTime: '10:45 AM',
    endTime: '12:15 PM',
    buildingId: 'srix-block-a',
    buildingName: 'Block A • CSE & IT',
    room: 'Room 204 • Level 2',
    facultyName: 'Prof. Ananya Rao',
    color: '#8b5cf6',
  },
  {
    id: 'class-3',
    subjectName: 'Design Thinking & Innovation',
    courseCode: 'GE-303',
    day: 'Monday' as const,
    startTime: '01:30 PM',
    endTime: '02:30 PM',
    buildingId: 'centenary-bhavan',
    buildingName: 'Centenary Bhavan',
    room: 'Room 108 • Level 1',
    facultyName: 'Dr. M. Rajesh',
    color: '#f59e0b',
  },
  {
    id: 'class-4',
    subjectName: 'Competitive Programming Practice',
    courseCode: 'CS-310',
    day: 'Monday' as const,
    startTime: '03:00 PM',
    endTime: '04:30 PM',
    buildingId: 'central-library',
    buildingName: 'Central Library',
    room: 'Digital Reference Lounge • Level 1',
    facultyName: 'Prof. S. Varma',
    color: '#10b981',
  },
  {
    id: 'class-5',
    subjectName: 'Natural Language Processing',
    courseCode: 'CS-304',
    day: 'Tuesday' as const,
    startTime: '09:30 AM',
    endTime: '10:30 AM',
    buildingId: 'srix-block-a',
    buildingName: 'Block A • CSE & IT',
    room: 'Room 208 • Level 2',
    facultyName: 'Dr. Priya Sharma',
    color: '#3b82f6',
  },
  {
    id: 'class-6',
    subjectName: 'Embedded IoT & Robotics Workshop',
    courseCode: 'CS-305P',
    day: 'Tuesday' as const,
    startTime: '11:00 AM',
    endTime: '12:30 PM',
    buildingId: 'srix-block-a',
    buildingName: 'Block A • CSE & IT',
    room: 'Room 312 • Level 3',
    facultyName: 'Prof. R. Teja',
    color: '#06b6d4',
  },
  {
    id: 'class-7',
    subjectName: 'Badminton & Fitness Training',
    courseCode: 'PE-102',
    day: 'Tuesday' as const,
    startTime: '02:00 PM',
    endTime: '03:30 PM',
    buildingId: 'sports-complex',
    buildingName: 'SRU Sports Complex',
    room: 'Indoor Badminton Arena',
    facultyName: 'Coach D. Nayak',
    color: '#ef4444',
  },
  {
    id: 'class-8',
    subjectName: 'Cloud Computing Architecture',
    courseCode: 'CS-306',
    day: 'Wednesday' as const,
    startTime: '10:00 AM',
    endTime: '11:30 AM',
    buildingId: 'srix-block-a',
    buildingName: 'Block A • CSE & IT',
    room: 'Room 204 • Level 2',
    facultyName: 'Dr. K. Srinivas',
    color: '#3b82f6',
  },
  {
    id: 'class-9',
    subjectName: 'Startup Venture Ideation & Pitching',
    courseCode: 'ENT-301',
    day: 'Wednesday' as const,
    startTime: '01:30 PM',
    endTime: '03:00 PM',
    buildingId: 'srix-block-a',
    buildingName: 'Block A • CSE & IT',
    room: 'Nest Entrepreneurship Hub • Ground Floor',
    facultyName: 'SRiX Mentors',
    color: '#c88d3b',
  },
  {
    id: 'class-10',
    subjectName: 'Computer Vision Systems',
    courseCode: 'CS-307',
    day: 'Thursday' as const,
    startTime: '09:30 AM',
    endTime: '11:00 AM',
    buildingId: 'srix-block-a',
    buildingName: 'Block A • CSE & IT',
    room: 'Room 204 • Level 2',
    facultyName: 'Dr. Ananya Rao',
    color: '#8b5cf6',
  },
  {
    id: 'class-11',
    subjectName: 'Engineering Mechanics & CNC Workshop',
    courseCode: 'ME-101',
    day: 'Thursday' as const,
    startTime: '02:30 PM',
    endTime: '04:00 PM',
    buildingId: 'block-b',
    buildingName: 'Block B - Mech & Civil',
    room: 'Ground Floor CNC Machine Bay',
    facultyName: 'Prof. B. Mohan',
    color: '#64748b',
  },
  {
    id: 'class-12',
    subjectName: 'Cyber Security & Cryptography',
    courseCode: 'CS-308',
    day: 'Friday' as const,
    startTime: '09:30 AM',
    endTime: '10:30 AM',
    buildingId: 'srix-block-a',
    buildingName: 'Block A • CSE & IT',
    room: 'Room 302 • Level 3',
    facultyName: 'Dr. V. Murthy',
    color: '#10b981',
  },
  {
    id: 'class-13',
    subjectName: 'Capstone Project Evaluation & Seminars',
    courseCode: 'CS-399',
    day: 'Friday' as const,
    startTime: '11:00 AM',
    endTime: '12:30 PM',
    buildingId: 'centenary-bhavan',
    buildingName: 'Centenary Bhavan',
    room: 'Auditorium • Level 1',
    facultyName: 'Department Academic Council',
    color: '#f59e0b',
  },
  {
    id: 'class-14',
    subjectName: 'Guest Industry CXO Speaker Series',
    courseCode: 'SEM-101',
    day: 'Saturday' as const,
    startTime: '10:00 AM',
    endTime: '12:00 PM',
    buildingId: 'centenary-bhavan',
    buildingName: 'Centenary Bhavan',
    room: 'Main Auditorium',
    facultyName: 'Dean of Research',
    color: '#3b82f6',
  },
];
