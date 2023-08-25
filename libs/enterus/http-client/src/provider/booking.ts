import { BookingStatus, GetProviderBookingsDTO, GetProviderServiceDTO, SetBookingPriceDTO } from "@enterslash/enterus/types";
import $api from "../client";

export const get_bookings = (
    skip?: number,
    limit?: number,
    tab?: number
): Promise<GetProviderBookingsDTO[]> => {
    return $api.get(`/provider/bookings`, { params: { skip, limit, tab } });
};

export const update_booking_status = (bookingId: string, status: BookingStatus): Promise<GetProviderBookingsDTO> => {
    return $api.put(`/provider/booking/${bookingId}/${status}`);
}

export const complete_booking = (bookingId: string): Promise<GetProviderBookingsDTO> => {
    return $api.post(`/provider/booking/${bookingId}/confirm`);
}

export const set_booking_price = (bookingId: string, data: SetBookingPriceDTO): Promise<string> => {
    return $api.put(`/provider/booking/${bookingId}/price`, data);
}
