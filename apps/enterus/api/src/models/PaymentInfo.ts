import { IPaymentInfoModel } from "@enterslash/enterus/types";
import { Schema, model } from "mongoose";

const paymentInfoSchema = new Schema<IPaymentInfoModel>(
  {
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    stripeCustomerId: {
        type: String,
    },
  },
  {
    timestamps: true,
  }
);

const PaymentInfo = model("PaymentInfo", paymentInfoSchema);

export default PaymentInfo;
