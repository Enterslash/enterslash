type Booking = {
  date: string;
  totalBookings: number;
  earningsForDay: number;
};

export type DashboardDataDTO = {
  bookingsLast7Days: number;
  bookingsByDay: Booking[];
  totalEarnings: number;
  totalBookings: number;
  totalUser: number;
};
