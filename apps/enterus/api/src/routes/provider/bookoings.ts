import router from "express"
import { confirmBooking, getAllBookings, handleBooking, setBookingPrice } from "../../controllers/provider/booking";
import { userAuthorization } from "../../middleware/authorization";

const providerBookingRouter = router.Router();

providerBookingRouter.get("/bookings", getAllBookings);
providerBookingRouter.post("/booking/:bookingId/confirm", userAuthorization, confirmBooking);
providerBookingRouter.put("/booking/:bookingId/price", setBookingPrice);
providerBookingRouter.put("/booking/:bookingId/:status", handleBooking);

export default providerBookingRouter;
