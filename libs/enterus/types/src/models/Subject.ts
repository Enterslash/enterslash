import { Document } from 'mongoose';

export interface ISubject {
    name: string,
}

export interface ISubjectModel extends ISubject, Document { }