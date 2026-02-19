// ── Mock Data for Fleetmark Driver Dashboard ──

// Driver profile
export const driverProfile = {
  id: 'D-001',
  name: 'Karim El Amrani',
  initials: 'KA',
  email: 'karim.a@fleetmark.io',
  phone: '+212 6 55 44 33 22',
  licenseNumber: 'DL-2024-MAR-08821',
  yearsOfExperience: 8,
  assignedBus: 'Bus 07 — Campus Cruiser',
  assignedRoute: 'Route A — Campus Express',
  avatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=Karim&backgroundColor=c0aede&top=shortHair',
};

// Driver stats
export const driverStats = {
  assignedRoute: { value: 'Route A', subtext: '12 stops', label: 'Assigned Route' },
  passengersToday: { value: 34, label: 'Passengers Today' },
  nextDeparture: { value: '10:30 AM', subtext: 'in 42 min', label: 'Next Departure' },
  busInfo: { value: 'Bus 07', subtext: 'FL-1234-AB · 44 seats', label: 'Bus Info' },
};

// Current shift
export const currentShift = {
  status: 'on-duty' as 'on-duty' | 'off-duty',
  startTime: '06:00 AM',
  endTime: '02:00 PM',
  routeName: 'Route A — Campus Express',
};

// Trips for today
export interface Trip {
  id: string;
  departureTime: string;
  route: string;
  stops: number;
  passengers: number;
  status: 'Completed' | 'In Progress' | 'Upcoming';
}

export const todaysTrips: Trip[] = [
  { id: 'T-001', departureTime: '06:30 AM', route: 'Campus Express', stops: 12, passengers: 38, status: 'Completed' },
  { id: 'T-002', departureTime: '07:30 AM', route: 'Campus Express', stops: 12, passengers: 42, status: 'Completed' },
  { id: 'T-003', departureTime: '08:30 AM', route: 'Campus Express', stops: 12, passengers: 44, status: 'Completed' },
  { id: 'T-004', departureTime: '09:30 AM', route: 'Campus Express', stops: 12, passengers: 34, status: 'In Progress' },
  { id: 'T-005', departureTime: '10:30 AM', route: 'Campus Express', stops: 12, passengers: 29, status: 'Upcoming' },
  { id: 'T-006', departureTime: '11:30 AM', route: 'Campus Express', stops: 12, passengers: 18, status: 'Upcoming' },
  { id: 'T-007', departureTime: '12:30 PM', route: 'Campus Express', stops: 12, passengers: 12, status: 'Upcoming' },
  { id: 'T-008', departureTime: '01:30 PM', route: 'Campus Express', stops: 12, passengers: 0, status: 'Upcoming' },
];

// Route details
export interface RouteStop {
  id: string;
  name: string;
  estimatedArrival: string;
  passengerCount: number;
  status: 'completed' | 'current' | 'upcoming';
}

export const driverRouteInfo = {
  name: 'Route A — Campus Express',
  status: 'Active' as const,
  totalDistance: '18.5 km',
  totalStops: 12,
  estimatedDuration: '55 min',
  assignedBus: 'Bus 07 — Campus Cruiser',
};

export const routeStops: RouteStop[] = [
  { id: 'S-01', name: 'Central Station', estimatedArrival: '06:30 AM', passengerCount: 8, status: 'completed' },
  { id: 'S-02', name: 'City Hall', estimatedArrival: '06:35 AM', passengerCount: 5, status: 'completed' },
  { id: 'S-03', name: 'Main Square', estimatedArrival: '06:40 AM', passengerCount: 6, status: 'completed' },
  { id: 'S-04', name: 'Library', estimatedArrival: '06:45 AM', passengerCount: 3, status: 'completed' },
  { id: 'S-05', name: 'Sports Complex', estimatedArrival: '06:50 AM', passengerCount: 4, status: 'completed' },
  { id: 'S-06', name: 'Residence Hall A', estimatedArrival: '06:55 AM', passengerCount: 7, status: 'current' },
  { id: 'S-07', name: 'Residence Hall B', estimatedArrival: '07:00 AM', passengerCount: 3, status: 'upcoming' },
  { id: 'S-08', name: 'Science Building', estimatedArrival: '07:05 AM', passengerCount: 5, status: 'upcoming' },
  { id: 'S-09', name: 'Engineering Block', estimatedArrival: '07:10 AM', passengerCount: 4, status: 'upcoming' },
  { id: 'S-10', name: 'Medical Faculty', estimatedArrival: '07:15 AM', passengerCount: 2, status: 'upcoming' },
  { id: 'S-11', name: 'Admin Building', estimatedArrival: '07:20 AM', passengerCount: 1, status: 'upcoming' },
  { id: 'S-12', name: 'Campus Gate', estimatedArrival: '07:25 AM', passengerCount: 0, status: 'upcoming' },
];

// Passengers for the driver's route
export interface RoutePassenger {
  id: string;
  name: string;
  initials: string;
  seat: string;
  stop: string;
  status: 'Confirmed' | 'Pending' | 'Cancelled';
  avatar?: string;
}

export const routePassengers: RoutePassenger[] = [
  { id: 'P-01', name: 'Ahmed Benali', initials: 'AB', seat: '1A', stop: 'Central Station', status: 'Confirmed', avatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=Ahmed&backgroundColor=b6e3f4' },
  { id: 'P-02', name: 'Sara Idrissi', initials: 'SI', seat: '1B', stop: 'Central Station', status: 'Confirmed', avatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=Sara&backgroundColor=ffd5dc' },
  { id: 'P-03', name: 'Youssef Tazi', initials: 'YT', seat: '2A', stop: 'City Hall', status: 'Confirmed' },
  { id: 'P-04', name: 'Fatima Zahra', initials: 'FZ', seat: '2B', stop: 'City Hall', status: 'Pending' },
  { id: 'P-05', name: 'Omar Meknassi', initials: 'OM', seat: '3A', stop: 'Main Square', status: 'Confirmed', avatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=Omar&backgroundColor=c0aede' },
  { id: 'P-06', name: 'Laila Bennani', initials: 'LB', seat: '3B', stop: 'Main Square', status: 'Cancelled' },
  { id: 'P-07', name: 'Hassan Ouazzani', initials: 'HO', seat: '4A', stop: 'Library', status: 'Confirmed' },
  { id: 'P-08', name: 'Nadia Chraibi', initials: 'NC', seat: '4B', stop: 'Sports Complex', status: 'Confirmed', avatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=Nadia&backgroundColor=ffd5dc' },
  { id: 'P-09', name: 'Rachid Fassi', initials: 'RF', seat: '5A', stop: 'Residence Hall A', status: 'Pending' },
  { id: 'P-10', name: 'Amina Kadiri', initials: 'AK', seat: '5B', stop: 'Residence Hall A', status: 'Confirmed' },
  { id: 'P-11', name: 'Mouad Sebti', initials: 'MS', seat: '6A', stop: 'Residence Hall B', status: 'Confirmed', avatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=Mouad&backgroundColor=b6e3f4' },
  { id: 'P-12', name: 'Zineb Alaoui', initials: 'ZA', seat: '6B', stop: 'Science Building', status: 'Confirmed' },
  { id: 'P-13', name: 'Hamza Bouazza', initials: 'HB', seat: '7A', stop: 'Science Building', status: 'Pending' },
  { id: 'P-14', name: 'Kenza Rhali', initials: 'KR', seat: '7B', stop: 'Engineering Block', status: 'Confirmed', avatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=Kenza&backgroundColor=ffd5dc' },
  { id: 'P-15', name: 'Adil Bourji', initials: 'AB', seat: '8A', stop: 'Engineering Block', status: 'Confirmed' },
  { id: 'P-16', name: 'Salma Naciri', initials: 'SN', seat: '8B', stop: 'Medical Faculty', status: 'Cancelled' },
  { id: 'P-17', name: 'Badr Mansouri', initials: 'BM', seat: '9A', stop: 'Medical Faculty', status: 'Confirmed' },
  { id: 'P-18', name: 'Houda Talbi', initials: 'HT', seat: '9B', stop: 'Admin Building', status: 'Confirmed', avatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=Houda&backgroundColor=c0aede' },
];

// Driver notifications
export interface DriverNotification {
  id: string;
  type: 'new_passenger' | 'cancellation' | 'route_change' | 'schedule_update' | 'maintenance';
  title: string;
  message: string;
  time: string;
  read: boolean;
}

export const driverNotifications: DriverNotification[] = [
  { id: 'DN-01', type: 'new_passenger', title: 'New Reservation', message: 'Ahmed Benali reserved seat 1A for the 07:30 AM trip.', time: '5 min ago', read: false },
  { id: 'DN-02', type: 'cancellation', title: 'Passenger Cancelled', message: 'Laila Bennani cancelled her reservation for seat 3B.', time: '18 min ago', read: false },
  { id: 'DN-03', type: 'route_change', title: 'Route Adjustment', message: 'Admin updated Route A — "Main Square" stop moved 200m north.', time: '1 hr ago', read: false },
  { id: 'DN-04', type: 'schedule_update', title: 'Schedule Change', message: 'Your shift on Feb 21 has been extended to 03:00 PM.', time: '2 hrs ago', read: true },
  { id: 'DN-05', type: 'maintenance', title: 'Maintenance Alert', message: 'Bus 07 is due for oil change on Feb 25. Contact fleet manager.', time: '3 hrs ago', read: true },
  { id: 'DN-06', type: 'new_passenger', title: 'New Reservation', message: 'Fatima Zahra reserved seat 2B for the 08:30 AM trip.', time: '5 hrs ago', read: true },
  { id: 'DN-07', type: 'schedule_update', title: 'Trip Added', message: 'An extra trip at 01:30 PM was added to your schedule today.', time: 'Yesterday', read: true },
  { id: 'DN-08', type: 'maintenance', title: 'Tire Inspection', message: 'Bus 07 passed tire inspection. Report available in admin portal.', time: 'Yesterday', read: true },
];
