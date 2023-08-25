import { BookingStatus, BookingType, IBooking } from '@enterslash/enterus/types';
import { Schema, model } from 'mongoose';

const bookingSchema = new Schema<IBooking>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    service: {
      type: Schema.Types.ObjectId,
      ref: 'Service',
    },
    provider: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    payId: {
      type: String,
    },
    date: {
      start: Date,
      end: Date,
      mode: {
        type: String,
        enum: BookingType,
      },
    },
    location: {
      type: {
        name: String,
        lat: Number,
        lng: Number,
      },
      required: true,
    },
    status: {
      type: String,
      enum: BookingStatus,
      default: BookingStatus.PENDING,
    },
    priceInputs: {
      type: [
        {
          name: String,
          value: String,
        },
      ],
    },
    images: {
      type: [String],
    },
    price: {
      amount: Number,
      acceptedByUser: Boolean,
      acceptedByProvider: Boolean,
    },
  },
  {
    timestamps: true,
  }
);

const Booking = model('Booking', bookingSchema);

export default Booking;
