import express from 'express';
import * as Yup from 'yup';
import { parseYupError } from '../../utils/helper';
import { failed } from '../../utils/response';

const app = express();
app.use(express.json());

const profileSchema = Yup.object().shape({
    firstName: Yup.string().required('First Name is required'),
    lastName: Yup.string().required('Last Name is required'),
    phone: Yup.string().required('phone is required'),
    location: Yup.string().required('Location is required'),
});

export const profileValidator = async (req, res, next) => {
    try {
        await profileSchema.validate({ ...req.body, ...req.files }, { abortEarly: false })
        next();
    } catch (error) {
        const err = parseYupError(error);
        res.status(400).json(failed({ issue: err }));
    }
}