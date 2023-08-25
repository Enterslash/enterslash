import { Document } from 'mongoose';

export interface ICategory {
    name: string
}

export interface ICategoryModel extends ICategory, Document { }