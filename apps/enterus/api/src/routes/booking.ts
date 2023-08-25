import router from 'express';
import {
  bookService,
  getMyBookings,
  getSingleBooking,
  handleBookingPrice,
  handleBookingStatus,
} from '../controllers/booking';
import { userAuthorization } from '../middleware/authorization';
import { parseFile } from '../middleware/fileParser';
import { bookingValidator } from '../middleware/validation/bookingValidator';

const bookingRouter = router.Router();

bookingRouter.get('/bookings', userAuthorization, getMyBookings);
bookingRouter.get('/booking/:bookingId', getSingleBooking);
bookingRouter.put(
  '/booking/:bookingId/price/:status',
  userAuthorization,
  handleBookingPrice
);
bookingRouter.put(
  '/booking/:bookingId/:status',
  userAuthorization,
  handleBookingStatus
);
bookingRouter.post(
  '/service/:id/book',
  [userAuthorization, parseFile, bookingValidator],
  bookService
);

export default bookingRouter;
