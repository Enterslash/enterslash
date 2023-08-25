import express from 'express';
import * as Yup from 'yup';
import { parseYupError } from '../../utils/helper';
import { failed } from '../../utils/response';
import { Platforms } from '@enterslash/enterus/types';

const app = express();
app.use(express.json());

const loginSchema = Yup.object().shape({
    email: Yup.string()
        .email('Invalid email')
        .required('Email is required'),
    password: Yup.string()
        .min(6, 'Password must be at least 6 characters')
        .required('Password is required'),
    platform: Yup.string().oneOf(Object.values(Platforms)).required('Platform is required'),
});

export const loginValidator = async (req, res, next) => {
    try {
        await loginSchema.validate(req.body, { abortEarly: false })
        next();
    } catch (error) {
        const err = parseYupError(error);
        res.status(400).json(failed({ issue: err }));
    }
}

const registrationSchema = Yup.object().shape({
    username: Yup.string().required('Username is required'),
    email: Yup.string()
        .email('Invalid email')
        .required('Email is required'),
    password: Yup.string()
        .min(6, 'Password must be at least 6 characters')
        .required('Password is required'),
});

export const registrationValidator = async (req, res, next) => {
    try {
        await registrationSchema.validate(req.body, { abortEarly: false })
        next();
    } catch (error) {
        const err = parseYupError(error);
        res.status(400).json(failed({ issue: err }));
    }
}