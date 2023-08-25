import express from 'express';
import * as Yup from 'yup';
import { parseYupError } from '../../utils/helper';
import { failed } from '../../utils/response';

const app = express();
app.use(express.json());

const providerRequestSchema = Yup.object().shape({
    idType: Yup.string().required('Status is required'),
    frontImage: Yup.mixed().required('Front image is required'),
    backImage: Yup.mixed().required('Back image is required'),
});

export const providerRequestValidator = async (req, res, next) => {
    try {
        await providerRequestSchema.validate({ ...req.body, ...req.files }, { abortEarly: false })
        next();
    } catch (error) {
        const err = parseYupError(error);
        res.status(400).json(failed({ issue: err }));
    }
}