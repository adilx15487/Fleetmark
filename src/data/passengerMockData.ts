// ── Mock Data for Fleetmark Passenger Dashboard ──

// Passenger profile
export const passengerProfile = {
  id: 'U-002',
  name: 'Ahmed Benali',
  initials: 'AB',
  email: 'ahmed.b@university.edu',
  phone: '+212 6 12 34 56 78',
  organizationType: 'University' as const,
  organizationName: 'State University',
  defaultRoute: 'Route A — Campus Express',
  avatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=Ahmed&backgroundColor=b6e3f4&top=shortHair',
};

// Stats
export const passengerStats = {
  totalRides: { value: 47, label: 'Total Rides Taken' },
  upcomingReservations: { value: 3, label: 'Upcoming Reservations' },
  cancelledRides: { value: 2, label: 'Cancelled Rides' },
  favoriteRoute: { value: 'Route A', label: 'Favorite Route' },
};

// Next ride
export const nextRide = {
  route: 'Route A — Campus Express',
  departureTime: '07:30 AM',
  seat: '14A',
  bus: 'Bus 07 — Campus Cruiser',
  date: 'Tomorrow, Feb 20',
  stop: 'Main Gate',
};

// Reservations
export interface Reservation {
  id: string;
  route: string;
  bus: string;
  seat: string;
  date: string;
  departureTime: string;
  stop: string;
  status: 'Confirmed' | 'Pending' | 'Completed' | 'Cancelled';
  rating?: number;
}

export const passengerReservations: Reservation[] = [
  { id: 'R-001', route: 'Route A — Campus Express', bus: 'Bus 07', seat: '14A', date: 'Feb 20, 2026', departureTime: '07:30 AM', stop: 'Main Gate', status: 'Confirmed' },
  { id: 'R-002', route: 'Route B — Downtown Loop', bus: 'Bus 12', seat: '8C', date: 'Feb 21, 2026', departureTime: '08:00 AM', stop: 'City Center', status: 'Pending' },
  { id: 'R-003', route: 'Route A — Campus Express', bus: 'Bus 07', seat: '6D', date: 'Feb 22, 2026', departureTime: '07:30 AM', stop: 'Library', status: 'Confirmed' },
  { id: 'R-004', route: 'Route D — Airport Shuttle', bus: 'Bus 19', seat: '3A', date: 'Feb 18, 2026', departureTime: '05:00 AM', stop: 'Terminal 1', status: 'Completed', rating: 5 },
  { id: 'R-005', route: 'Route A — Campus Express', bus: 'Bus 07', seat: '10B', date: 'Feb 17, 2026', departureTime: '07:30 AM', stop: 'Science Labs', status: 'Completed', rating: 4 },
  { id: 'R-006', route: 'Route C — Industrial Zone', bus: 'Bus 03', seat: '22B', date: 'Feb 16, 2026', departureTime: '06:00 AM', stop: 'Factory Gate', status: 'Completed' },
  { id: 'R-007', route: 'Route B — Downtown Loop', bus: 'Bus 12', seat: '11B', date: 'Feb 15, 2026', departureTime: '08:00 AM', stop: 'Business Park', status: 'Cancelled' },
  { id: 'R-008', route: 'Route A — Campus Express', bus: 'Bus 07', seat: '2A', date: 'Feb 14, 2026', departureTime: '07:30 AM', stop: 'Dormitory Block', status: 'Completed', rating: 5 },
  { id: 'R-009', route: 'Route E — Medical Campus', bus: 'Bus 05', seat: '17C', date: 'Feb 13, 2026', departureTime: '07:00 AM', stop: 'Hospital Main', status: 'Cancelled' },
  { id: 'R-010', route: 'Route A — Campus Express', bus: 'Bus 07', seat: '14A', date: 'Feb 12, 2026', departureTime: '07:30 AM', stop: 'Main Gate', status: 'Completed', rating: 4 },
];

// Browsable routes for passenger
export interface AvailableRoute {
  id: string;
  name: string;
  stops: string[];
  departureTimes: string[];
  availableSeats: number;
  totalSeats: number;
  status: 'Active' | 'Inactive';
  assignedBus: string;
  organization: 'University' | 'Enterprise' | 'School';
}

export const availableRoutes: AvailableRoute[] = [
  { id: 'RT-001', name: 'Route A — Campus Express', stops: ['Main Gate', 'Library', 'Science Labs', 'Dormitory Block'], departureTimes: ['07:30 AM', '12:00 PM', '05:30 PM'], availableSeats: 18, totalSeats: 48, status: 'Active', assignedBus: 'Bus 07', organization: 'University' },
  { id: 'RT-002', name: 'Route B — Downtown Loop', stops: ['City Center', 'Business Park', 'Shopping Mall', 'Railway Station'], departureTimes: ['08:00 AM', '01:00 PM', '06:00 PM'], availableSeats: 12, totalSeats: 36, status: 'Active', assignedBus: 'Bus 12', organization: 'Enterprise' },
  { id: 'RT-003', name: 'Route C — Industrial Zone', stops: ['Factory Gate', 'Warehouse District', 'Admin Building'], departureTimes: ['06:00 AM', '02:00 PM'], availableSeats: 30, totalSeats: 52, status: 'Active', assignedBus: 'Bus 03', organization: 'Enterprise' },
  { id: 'RT-004', name: 'Route D — Airport Shuttle', stops: ['Terminal 1', 'Terminal 2', 'Hotel District', 'Convention Center'], departureTimes: ['05:00 AM', '11:00 AM', '05:00 PM', '10:00 PM'], availableSeats: 8, totalSeats: 24, status: 'Active', assignedBus: 'Bus 19', organization: 'Enterprise' },
  { id: 'RT-005', name: 'Route E — Medical Campus', stops: ['Hospital Main', 'Clinic Block', 'Research Center'], departureTimes: ['07:00 AM', '12:30 PM'], availableSeats: 22, totalSeats: 40, status: 'Inactive', assignedBus: 'Bus 05', organization: 'University' },
  { id: 'RT-006', name: 'Route F — School Morning', stops: ['Hay Riad', 'Agdal Center', 'National School Gate'], departureTimes: ['07:00 AM'], availableSeats: 15, totalSeats: 44, status: 'Active', assignedBus: 'Bus 09', organization: 'School' },
];

// Seat map for reservation flow
export type SeatStatus = 'available' | 'reserved' | 'selected';

export interface Seat {
  id: string;
  row: number;
  col: 'A' | 'B' | 'C' | 'D';
  status: SeatStatus;
}

export const generateSeatMap = (): Seat[] => {
  const seats: Seat[] = [];
  const cols: Seat['col'][] = ['A', 'B', 'C', 'D'];
  for (let row = 1; row <= 12; row++) {
    for (const col of cols) {
      seats.push({
        id: `${row}${col}`,
        row,
        col,
        status: Math.random() > 0.35 ? 'available' : 'reserved',
      });
    }
  }
  return seats;
};

// Passenger notifications
export interface PassengerNotification {
  id: string;
  type: 'reservation' | 'route_change' | 'delay' | 'cancellation' | 'system';
  title: string;
  message: string;
  time: string;
  read: boolean;
}

export const passengerNotifications: PassengerNotification[] = [
  { id: 'PN-001', type: 'reservation', title: 'Reservation Confirmed', message: 'Your seat 14A on Route A — Campus Express for Feb 20 has been confirmed.', time: '10 min ago', read: false },
  { id: 'PN-002', type: 'delay', title: 'Bus 12 Delayed', message: 'Bus 12 on Route B is running 15 minutes late due to traffic.', time: '1 hour ago', read: false },
  { id: 'PN-003', type: 'route_change', title: 'Route A Schedule Updated', message: 'Route A has added a new 5:30 PM departure time starting next week.', time: '3 hours ago', read: false },
  { id: 'PN-004', type: 'reservation', title: 'Reservation Confirmed', message: 'Your seat 6D on Route A for Feb 22 has been confirmed.', time: '5 hours ago', read: true },
  { id: 'PN-005', type: 'cancellation', title: 'Ride Cancelled', message: 'Your reservation R-007 on Route B for Feb 15 has been cancelled per your request.', time: 'Yesterday', read: true },
  { id: 'PN-006', type: 'system', title: 'Welcome to Fleetmark!', message: 'Your account has been set up. Start reserving seats on your favorite routes.', time: '3 days ago', read: true },
  { id: 'PN-007', type: 'delay', title: 'Bus 03 Maintenance', message: 'Bus 03 on Route C will be unavailable on Feb 25 for scheduled maintenance.', time: '4 days ago', read: true },
  { id: 'PN-008', type: 'route_change', title: 'New Route Available', message: 'Route F — School Morning is now available for reservations.', time: '1 week ago', read: true },
];
