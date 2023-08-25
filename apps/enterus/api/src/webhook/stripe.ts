import router from "express"
import StripeSDK from 'stripe';
import { stripe } from "../utils/stripe";
import { logger } from "../middleware/logger/logger";
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
const stripeHookRouter = router.Router();

stripeHookRouter.post("/", (req, res) => {
    const sig = req.headers['stripe-signature'];

    let event;
    try {
        event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    } catch (err) {
        res.status(400).send(`Webhook Error: ${err.message}`);
        return;
    }

    switch (event.type) {
        case 'payment_intent.amount_capturable_updated':
            handle_payment_intent_amount_capturable_updated(event.data.object);
            break;
        default:
            logger.error(`Unhandled event type ${event.type}`);
    }

    res.send();
});

const handle_payment_intent_amount_capturable_updated = async (paymentIntent: StripeSDK.PaymentIntent) => {
    if (paymentIntent.amount_capturable > 0) {
        await stripe.paymentIntents.capture(paymentIntent.id);
    }
}

export default stripeHookRouter;
