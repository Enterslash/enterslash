import express from 'express';
import * as Yup from 'yup';
import { parseYupError } from '../../utils/helper';
import { failed } from '../../utils/response';

const app = express();
app.use(express.json());

const bookingSchema = Yup.object().shape({
    date: Yup.string().required('Date is required'),
    location: Yup.string().required('Location is required'),
    // provider: Yup.string().required('Provider Id is required'),
});

export const bookingValidator = async (req, res, next) => {
    try {
        await bookingSchema.validate({...req.body, ...req.files}, { abortEarly: false })
        next();
    } catch (error) {
        const err = parseYupError(error);
        res.status(400).json(failed({ issue: err }));
    }
}