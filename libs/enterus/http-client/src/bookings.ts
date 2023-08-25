import {
  AcceptedBookingPrice,
  BookServiceDTO,
  BookingPriceStatus,
  BookingStatus,
  GetConsumerBookingsDTO,
  GetSingleBookingsDTO,
} from '@enterslash/enterus/types';
import $api from './client';
import { toFormData } from '@enterslash/utils';

export const book_service = (
  id: string,
  data: BookServiceDTO
): Promise<string> => {
  const formData = toFormData<BookServiceDTO>(data, ['images']);
  return $api.post(`/service/${id}/book`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const get_my_bookings = (
  skip?: number,
  limit?: number,
  tab?: number
): Promise<GetConsumerBookingsDTO[]> => {
  return $api.get(`/bookings`, { params: { skip, limit, tab } });
};

export const get_single_booking = (
  bookingId: string
): Promise<GetSingleBookingsDTO> => {
  return $api.get(`/booking/${bookingId}`);
};

export const accept_booking_price = (
  bookingId: string,
  data: AcceptedBookingPrice
): Promise<string> => {
  return $api.put(
    `/booking/${bookingId}/price/${BookingPriceStatus.ACCEPTED}`,
    data
  );
};

export const reject_booking_price = (bookingId: string): Promise<string> => {
  return $api.put(`/booking/${bookingId}/price/${BookingPriceStatus.REJECTED}`);
};

export const handle_booking_status = (
  bookingId: string,
  status: BookingStatus
): Promise<string> => {
  return $api.put(`/booking/${bookingId}/${status}`);
};
