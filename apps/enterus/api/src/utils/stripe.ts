import StripeSDK from 'stripe';

export const stripe = new StripeSDK(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2022-11-15',
});