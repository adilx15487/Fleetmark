// ── Mock Data for Fleetmark Admin Dashboard ──

// Stats
export const dashboardStats = {
  totalBuses: { value: 42, change: +8.2, label: 'Total Buses' },
  activeRoutes: { value: 25, change: +12.5, label: 'Active Routes' },
  totalUsers: { value: 1_284, change: +5.3, label: 'Total Users' },
  todayReservations: { value: 387, change: -2.1, label: "Today's Reservations" },
};

// Daily reservations (last 30 days)
export const dailyReservations = Array.from({ length: 30 }, (_, i) => {
  const d = new Date();
  d.setDate(d.getDate() - 29 + i);
  return {
    date: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    reservations: Math.floor(200 + Math.random() * 250),
  };
});

// Bus capacity donut
export const capacityData = [
  { name: 'Available', value: 38, fill: '#22C55E' },
  { name: 'Reserved', value: 52, fill: '#3B82F6' },
  { name: 'Overcapacity', value: 10, fill: '#EF4444' },
];

// Recent activity
export interface Activity {
  id: string;
  user: string;
  route: string;
  bus: string;
  seat: string;
  status: 'Confirmed' | 'Pending' | 'Cancelled';
  time: string;
}

export const recentActivities: Activity[] = [
  { id: 'A001', user: 'Ahmed Benali', route: 'Route A — Campus Express', bus: 'Bus 07', seat: '14A', status: 'Confirmed', time: '2 min ago' },
  { id: 'A002', user: 'Sara Oufkir', route: 'Route B — Downtown Loop', bus: 'Bus 12', seat: '8C', status: 'Pending', time: '5 min ago' },
  { id: 'A003', user: 'Youssef El Amrani', route: 'Route C — Industrial Zone', bus: 'Bus 03', seat: '22B', status: 'Confirmed', time: '8 min ago' },
  { id: 'A004', user: 'Fatima Zahra', route: 'Route A — Campus Express', bus: 'Bus 07', seat: '6D', status: 'Cancelled', time: '12 min ago' },
  { id: 'A005', user: 'Omar Tazi', route: 'Route D — Airport Shuttle', bus: 'Bus 19', seat: '3A', status: 'Confirmed', time: '18 min ago' },
  { id: 'A006', user: 'Leila Mansouri', route: 'Route B — Downtown Loop', bus: 'Bus 12', seat: '11B', status: 'Pending', time: '25 min ago' },
  { id: 'A007', user: 'Karim Idrissi', route: 'Route E — Medical Campus', bus: 'Bus 05', seat: '17C', status: 'Confirmed', time: '30 min ago' },
  { id: 'A008', user: 'Nadia Chraibi', route: 'Route C — Industrial Zone', bus: 'Bus 03', seat: '9A', status: 'Cancelled', time: '45 min ago' },
];

// Buses
export interface Bus {
  id: string;
  name: string;
  plateNumber: string;
  capacity: number;
  assignedRoute: string;
  driver: string;
  status: 'Active' | 'Inactive' | 'Maintenance';
}

export const buses: Bus[] = [
  { id: 'BUS-001', name: 'Campus Cruiser', plateNumber: 'A-1234-BC', capacity: 48, assignedRoute: 'Route A', driver: 'Hassan Moukhtari', status: 'Active' },
  { id: 'BUS-002', name: 'City Runner', plateNumber: 'B-5678-DE', capacity: 36, assignedRoute: 'Route B', driver: 'Khalid Bennani', status: 'Active' },
  { id: 'BUS-003', name: 'Express Line', plateNumber: 'C-9012-FG', capacity: 52, assignedRoute: 'Route C', driver: 'Rachid Alami', status: 'Maintenance' },
  { id: 'BUS-004', name: 'Shuttle Pro', plateNumber: 'D-3456-HI', capacity: 24, assignedRoute: 'Route D', driver: 'Mustapha Ziani', status: 'Active' },
  { id: 'BUS-005', name: 'MedExpress', plateNumber: 'E-7890-JK', capacity: 40, assignedRoute: 'Route E', driver: 'Driss Fassi', status: 'Active' },
  { id: 'BUS-006', name: 'Night Liner', plateNumber: 'F-2345-LM', capacity: 32, assignedRoute: 'Unassigned', driver: 'Unassigned', status: 'Inactive' },
  { id: 'BUS-007', name: 'Green Transit', plateNumber: 'G-6789-NO', capacity: 44, assignedRoute: 'Route A', driver: 'Yassine Hajji', status: 'Active' },
  { id: 'BUS-008', name: 'Metro Link', plateNumber: 'H-0123-PQ', capacity: 50, assignedRoute: 'Route F', driver: 'Amine Bouazza', status: 'Maintenance' },
];

// Routes
export interface Stop {
  name: string;
  arrivalTime: string;
}

export interface Route {
  id: string;
  name: string;
  stops: Stop[];
  assignedBus: string;
  startTime: string;
  endTime: string;
  status: 'Active' | 'Inactive';
}

export const routes: Route[] = [
  {
    id: 'RT-001', name: 'Route A — Campus Express',
    stops: [
      { name: 'Main Gate', arrivalTime: '07:30' },
      { name: 'Library', arrivalTime: '07:40' },
      { name: 'Science Labs', arrivalTime: '07:50' },
      { name: 'Dormitory Block', arrivalTime: '08:00' },
    ],
    assignedBus: 'Bus 07', startTime: '07:30', endTime: '08:00', status: 'Active',
  },
  {
    id: 'RT-002', name: 'Route B — Downtown Loop',
    stops: [
      { name: 'City Center', arrivalTime: '08:00' },
      { name: 'Business Park', arrivalTime: '08:15' },
      { name: 'Shopping Mall', arrivalTime: '08:30' },
      { name: 'Railway Station', arrivalTime: '08:45' },
    ],
    assignedBus: 'Bus 12', startTime: '08:00', endTime: '08:45', status: 'Active',
  },
  {
    id: 'RT-003', name: 'Route C — Industrial Zone',
    stops: [
      { name: 'Factory Gate', arrivalTime: '06:00' },
      { name: 'Warehouse District', arrivalTime: '06:15' },
      { name: 'Admin Building', arrivalTime: '06:30' },
    ],
    assignedBus: 'Bus 03', startTime: '06:00', endTime: '06:30', status: 'Active',
  },
  {
    id: 'RT-004', name: 'Route D — Airport Shuttle',
    stops: [
      { name: 'Terminal 1', arrivalTime: '05:00' },
      { name: 'Terminal 2', arrivalTime: '05:10' },
      { name: 'Hotel District', arrivalTime: '05:30' },
      { name: 'Convention Center', arrivalTime: '05:45' },
    ],
    assignedBus: 'Bus 19', startTime: '05:00', endTime: '05:45', status: 'Active',
  },
  {
    id: 'RT-005', name: 'Route E — Medical Campus',
    stops: [
      { name: 'Hospital Main', arrivalTime: '07:00' },
      { name: 'Clinic Block', arrivalTime: '07:10' },
      { name: 'Research Center', arrivalTime: '07:25' },
    ],
    assignedBus: 'Bus 05', startTime: '07:00', endTime: '07:25', status: 'Inactive',
  },
];

// Users
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'Admin' | 'Passenger' | 'Driver';
  organization: string;
  status: 'Active' | 'Inactive';
  joinedDate: string;
}

export const users: User[] = [
  { id: 'U-001', name: 'Adil Bourji', email: 'adil@fleetmark.com', role: 'Admin', organization: 'Fleetmark HQ', status: 'Active', joinedDate: 'Jan 5, 2025' },
  { id: 'U-002', name: 'Ahmed Benali', email: 'ahmed.b@university.edu', role: 'Passenger', organization: 'State University', status: 'Active', joinedDate: 'Feb 12, 2025' },
  { id: 'U-003', name: 'Hassan Moukhtari', email: 'hassan.m@fleetmark.com', role: 'Driver', organization: 'Fleetmark HQ', status: 'Active', joinedDate: 'Jan 20, 2025' },
  { id: 'U-004', name: 'Sara Oufkir', email: 'sara.o@enterprise.com', role: 'Passenger', organization: 'TechCorp Inc.', status: 'Active', joinedDate: 'Mar 3, 2025' },
  { id: 'U-005', name: 'Khalid Bennani', email: 'khalid.b@fleetmark.com', role: 'Driver', organization: 'Fleetmark HQ', status: 'Active', joinedDate: 'Jan 15, 2025' },
  { id: 'U-006', name: 'Fatima Zahra', email: 'fatima.z@school.edu', role: 'Passenger', organization: 'National School', status: 'Inactive', joinedDate: 'Apr 1, 2025' },
  { id: 'U-007', name: 'Youssef El Amrani', email: 'youssef.e@university.edu', role: 'Passenger', organization: 'State University', status: 'Active', joinedDate: 'Feb 28, 2025' },
  { id: 'U-008', name: 'Leila Mansouri', email: 'leila.m@enterprise.com', role: 'Passenger', organization: 'TechCorp Inc.', status: 'Active', joinedDate: 'Mar 15, 2025' },
  { id: 'U-009', name: 'Rachid Alami', email: 'rachid.a@fleetmark.com', role: 'Driver', organization: 'Fleetmark HQ', status: 'Active', joinedDate: 'Jan 10, 2025' },
  { id: 'U-010', name: 'Mohamed Lahrech', email: 'mohamed@fleetmark.com', role: 'Admin', organization: 'Fleetmark HQ', status: 'Active', joinedDate: 'Jan 5, 2025' },
];

// Schedule
export interface ScheduleSlot {
  id: string;
  route: string;
  bus: string;
  time: string;
  color: string;
}

export interface DaySchedule {
  day: string;
  date: string;
  slots: ScheduleSlot[];
}

export const weeklySchedule: DaySchedule[] = [
  {
    day: 'Monday', date: 'Feb 16',
    slots: [
      { id: 'S1', route: 'Route A', bus: 'Bus 07', time: '07:30 - 08:00', color: 'bg-primary-500' },
      { id: 'S2', route: 'Route B', bus: 'Bus 12', time: '08:00 - 08:45', color: 'bg-accent-500' },
      { id: 'S3', route: 'Route C', bus: 'Bus 03', time: '06:00 - 06:30', color: 'bg-emerald-500' },
      { id: 'S4', route: 'Route D', bus: 'Bus 19', time: '05:00 - 05:45', color: 'bg-amber-500' },
    ],
  },
  {
    day: 'Tuesday', date: 'Feb 17',
    slots: [
      { id: 'S5', route: 'Route A', bus: 'Bus 07', time: '07:30 - 08:00', color: 'bg-primary-500' },
      { id: 'S6', route: 'Route B', bus: 'Bus 12', time: '08:00 - 08:45', color: 'bg-accent-500' },
      { id: 'S7', route: 'Route E', bus: 'Bus 05', time: '07:00 - 07:25', color: 'bg-rose-500' },
    ],
  },
  {
    day: 'Wednesday', date: 'Feb 18',
    slots: [
      { id: 'S8', route: 'Route A', bus: 'Bus 07', time: '07:30 - 08:00', color: 'bg-primary-500' },
      { id: 'S9', route: 'Route C', bus: 'Bus 03', time: '06:00 - 06:30', color: 'bg-emerald-500' },
      { id: 'S10', route: 'Route D', bus: 'Bus 19', time: '05:00 - 05:45', color: 'bg-amber-500' },
    ],
  },
  {
    day: 'Thursday', date: 'Feb 19',
    slots: [
      { id: 'S11', route: 'Route A', bus: 'Bus 07', time: '07:30 - 08:00', color: 'bg-primary-500' },
      { id: 'S12', route: 'Route B', bus: 'Bus 12', time: '08:00 - 08:45', color: 'bg-accent-500' },
      { id: 'S13', route: 'Route E', bus: 'Bus 05', time: '07:00 - 07:25', color: 'bg-rose-500' },
      { id: 'S14', route: 'Route C', bus: 'Bus 03', time: '06:00 - 06:30', color: 'bg-emerald-500' },
    ],
  },
  {
    day: 'Friday', date: 'Feb 20',
    slots: [
      { id: 'S15', route: 'Route A', bus: 'Bus 07', time: '07:30 - 08:00', color: 'bg-primary-500' },
      { id: 'S16', route: 'Route D', bus: 'Bus 19', time: '05:00 - 05:45', color: 'bg-amber-500' },
    ],
  },
  {
    day: 'Saturday', date: 'Feb 21',
    slots: [
      { id: 'S17', route: 'Route B', bus: 'Bus 12', time: '09:00 - 09:45', color: 'bg-accent-500' },
    ],
  },
  {
    day: 'Sunday', date: 'Feb 22',
    slots: [],
  },
];

// Reports
export const ridesPerRoute = [
  { route: 'Route A', rides: 1245 },
  { route: 'Route B', rides: 987 },
  { route: 'Route C', rides: 756 },
  { route: 'Route D', rides: 643 },
  { route: 'Route E', rides: 421 },
];

export const weeklyRidership = [
  { week: 'Week 1', riders: 1850 },
  { week: 'Week 2', riders: 2100 },
  { week: 'Week 3', riders: 1920 },
  { week: 'Week 4', riders: 2350 },
  { week: 'Week 5', riders: 2180 },
  { week: 'Week 6', riders: 2500 },
];

export const reportStats = {
  totalRides: 4_052,
  averageOccupancy: 78,
  mostUsedRoute: 'Route A — Campus Express',
  peakHours: '7:30 AM - 8:30 AM',
};

// Notifications
export interface Notification {
  id: string;
  icon: 'info' | 'success' | 'warning' | 'alert';
  title: string;
  message: string;
  time: string;
  status: 'Read' | 'Unread';
  type: 'received' | 'sent';
}

export const notifications: Notification[] = [
  { id: 'N-001', icon: 'success', title: 'Route A Updated', message: 'Route A schedule has been updated for next week.', time: '5 min ago', status: 'Unread', type: 'received' },
  { id: 'N-002', icon: 'warning', title: 'Bus 03 Maintenance', message: 'Bus 03 is scheduled for maintenance on Feb 20.', time: '1 hour ago', status: 'Unread', type: 'received' },
  { id: 'N-003', icon: 'info', title: 'New User Registered', message: 'Leila Mansouri registered as a Passenger.', time: '2 hours ago', status: 'Read', type: 'received' },
  { id: 'N-004', icon: 'alert', title: 'Overcapacity Alert', message: 'Route B bus is at 110% capacity for tomorrow.', time: '3 hours ago', status: 'Unread', type: 'received' },
  { id: 'N-005', icon: 'info', title: 'Schedule Published', message: 'You published the weekly schedule for Feb 16-22.', time: '5 hours ago', status: 'Read', type: 'sent' },
  { id: 'N-006', icon: 'success', title: 'Report Generated', message: 'Monthly ridership report has been generated.', time: 'Yesterday', status: 'Read', type: 'received' },
  { id: 'N-007', icon: 'warning', title: 'Driver Unavailable', message: 'Driver Rachid Alami reported sick leave for Feb 19.', time: 'Yesterday', status: 'Read', type: 'received' },
  { id: 'N-008', icon: 'info', title: 'System Update', message: 'Fleetmark v2.1 deployed with new features.', time: '2 days ago', status: 'Read', type: 'sent' },
];
