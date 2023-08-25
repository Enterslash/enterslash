import { GetStripeCardSheetInfo, GetStripePaySheetInfo, InitializePayment } from "@enterslash/enterus/types";
import $api from "./client";

export const get_stripe_sheet_info = (): Promise<GetStripeCardSheetInfo> => {
    return $api.get('/payment/stripe/cards');
}

export const initialize_payment_sheet_info = (data: InitializePayment): Promise<GetStripePaySheetInfo> => {
    return $api.post('/payment/stripe/pay-init', data);
}