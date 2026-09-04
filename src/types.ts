export interface Facility {
  id: string;
  name: string;
  room: string;
  level: string;
  iconName: 'Brain' | 'Rocket' | 'Cpu' | 'Lightbulb' | 'BookOpen' | 'Coffee' | 'Activity' | 'Shield';
  description?: string;
}

export interface FloorRoom {
  roomNumber: string;
  name: string;
  type: 'lab' | 'classroom' | 'office' | 'facility' | 'restroom' | 'stairs';
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface FloorPlan {
  levelNumber: number;
  levelName: string;
  description: string;
  rooms: FloorRoom[];
}

export interface Building {
  id: string;
  name: string;
  shortName: string;
  subtitle: string;
  badge?: string;
  badgeVariant?: 'primary' | 'lavender' | 'amber' | 'green' | 'blue';
  category: 'academic' | 'admin' | 'lab' | 'hostel' | 'sports' | 'amenity';
  liveStatus: string;
  isOpen: boolean;
  distanceMeters: number;
  walkMinutes: number;
  levels: string;
  totalFloors: number;
  description: string;
  imageUrl: string;
  thumbnailUrl: string;
  mapX: number; // percentage on map (0 - 100)
  mapY: number; // percentage on map (0 - 100)
  facilities: Facility[];
  floorPlans?: FloorPlan[];
  contactPerson?: string;
  phoneExtension?: string;
  blockTag?: string; // e.g., 'Block A', 'Block B', 'Admin Block'
  blockCode?: 'A' | 'B' | 'C' | 'D' | 'E' | 'Admin' | 'Library';
}

export interface NearbyCard {
  id: string;
  name: string;
  subtitle: string;
  badge: string;
  badgeVariant: 'blue' | 'amber' | 'green';
  distance: string;
  walkTime: string;
  imageUrl: string;
  buildingId: string;
}

export interface NavigationStep {
  stepIndex: number;
  instruction: string;
  distance: string;
  iconType: 'straight' | 'turn-left' | 'turn-right' | 'elevator' | 'stairs' | 'arrive';
  landmarkNote?: string;
}

export interface EmergencyContact {
  title: string;
  phone: string;
  role: string;
  availableHours: string;
  icon: 'ambulance' | 'shield' | 'flame' | 'phone';
}

export type DayOfWeek =
  | 'Monday'
  | 'Tuesday'
  | 'Wednesday'
  | 'Thursday'
  | 'Friday'
  | 'Saturday';

export interface ClassScheduleItem {
  id: string;
  subjectName: string;
  courseCode: string;
  day: DayOfWeek;
  startTime: string;
  endTime: string;
  buildingId: string;
  buildingName: string;
  room: string;
  facultyName?: string;
  color?: string;
}

export type NotificationCategory = 'closure' | 'event' | 'schedule' | 'advisory';

export interface CampusNotification {
  id: string;
  title: string;
  body: string;
  category: NotificationCategory;
  priority: 'urgent' | 'high' | 'normal';
  timestamp: number;
  timeFormatted: string;
  buildingId?: string;
  buildingName?: string;
  locationTag?: string;
  actionLabel?: string;
  read: boolean;
  source: 'location_proximity' | 'schedule_conflict' | 'campus_broadcast' | 'simulated';
}

export type TabType = 'explore' | 'navigate' | 'schedule' | 'directory' | 'freshers';
