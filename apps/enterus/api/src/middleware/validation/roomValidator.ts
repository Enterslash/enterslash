import express from 'express';
import * as Yup from 'yup';
import { parseYupError } from '../../utils/helper';
import { failed } from '../../utils/response';

const app = express();
app.use(express.json());

// batch: '',
// subject: '',
// section: '',
// course: '',
// code: '',

const roomSchema = Yup.object().shape({
    batch: Yup.string().required('Batch is required'),
    subject: Yup.string().required('Subject is required'),
    section: Yup.string().required('Section is required'),
    course: Yup.string().required('Course is required'),
    code: Yup.string().required('Code is required'),
});

export const roomValidator = async (req, res, next) => {
    try {
        await roomSchema.validate({ ...req.body, ...req.files }, { abortEarly: false })
        next();
    } catch (error) {
        const err = parseYupError(error);
        res.status(400).json(failed({ issue: err }));
    }
}