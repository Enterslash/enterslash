import express from 'express';
import * as Yup from 'yup';
import { parseYupError } from '../../utils/helper';
import { failed } from '../../utils/response';
import { StartServiceDTO } from '@enterslash/enterus/types';

const app = express();
app.use(express.json());

const serviceRequestSchema = Yup.object().shape({
    location: Yup.object().shape({
        name: Yup.string().required(),
        lat: Yup.number().required(),
        lng: Yup.number().required(),
        range: Yup.number().required(),
    }),
    // priceInputs: Yup.array().of(Yup.object().shape({
    //     name: Yup.string().required(),
    //     value: Yup.number().required(),
    //     unite: Yup.string().required(),
    // })),
});

export const serviceRequestValidator = async (req, res, next) => {
    try {
        await serviceRequestSchema.validate({ ...req.body, ...req.files }, { abortEarly: false })
        next();
    } catch (error) {
        const err = parseYupError(error);
        res.status(400).json(failed({ issue: err }));
    }
}