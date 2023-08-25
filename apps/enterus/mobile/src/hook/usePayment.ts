import { PresentPaymentSheetResult, useStripe } from '@stripe/stripe-react-native';
import { useHttp } from './useHttp';
import { get_stripe_sheet_info, initialize_payment_sheet_info } from '@enterslash/enterus/http-client';
import { GetStripeCardSheetInfo, InitializePayment } from '@enterslash/enterus/types';
import { useAppStore } from '../store/appStore';

type PresentPaymentSheetResultDTO = PresentPaymentSheetResult & {
    id: string;
}

type Props = {
    openCardSheet: () => void,
    openPaySheet: (data: InitializePayment) => Promise<PresentPaymentSheetResultDTO>;
}

export default function usePayment(): Props {
    const { initPaymentSheet, presentPaymentSheet } = useStripe();
    const { toggleLoader } = useAppStore();

    const { data: cardSheetData, request: getStripeSheetInfo } = useHttp<GetStripeCardSheetInfo>(() => {
        return get_stripe_sheet_info();
    });

    const openCardSheet = async () => {
        if (!cardSheetData) {
            toggleLoader(true)
            try {
                const {
                    setupIntent,
                    ephemeralKey,
                    customer,
                } = await getStripeSheetInfo();
                await initPaymentSheet({
                    merchantDisplayName: "Enterus",
                    customerId: customer,
                    customerEphemeralKeySecret: ephemeralKey,
                    setupIntentClientSecret: setupIntent
                });
                toggleLoader(false)
            } catch (error) {
                console.log(error);
                toggleLoader(false)
            }
        }
        presentPaymentSheet();
    }

    const openPaySheet = async (data: InitializePayment) => {
        // eslint-disable-next-line no-async-promise-executor
        return new Promise<PresentPaymentSheetResultDTO>(async (resolve, reject) => {
            try {
                const {
                    paymentIntentSecret,
                    paymentIntentId,
                    ephemeralKey,
                    customer,
                } = await initialize_payment_sheet_info({
                    amount: data.amount,
                    bookingId: data.bookingId,
                });
                await initPaymentSheet({
                    merchantDisplayName: "Enterus",
                    customerId: customer,
                    customerEphemeralKeySecret: ephemeralKey,
                    paymentIntentClientSecret: paymentIntentSecret,
                });
                const res = (await presentPaymentSheet()) as PresentPaymentSheetResultDTO;
                if (res.error) {
                    reject(res.error)
                } else {
                    res.id = paymentIntentId
                    resolve(res)
                }
            } catch (error) {
                console.log(error);
                reject(error)
            }
        })
    }

    return {
        openCardSheet,
        openPaySheet,
    }
}