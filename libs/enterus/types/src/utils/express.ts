import { Request } from 'express'
import { IUserModel } from '../models'


export interface IRequest<B = null, U = null, Q = any> extends Omit<Request, 'params' | 'query'> {
    body: B
    params: U,
    query: (null extends Q ? {} : Q) & {
        limit: number
        skip: number
    }
}

export interface IAuthRequest<B = null, U = null, Q = null> extends IRequest<B, U, Q> {
    user: IUserModel
    session: string
}

export interface IFileRequest<B = null, U = null, Q = null> extends IAuthRequest<B, U, Q> {
    files?: B
}

export interface WithPagination<T> {
    data: T[]
    total: number
}

export type Error<E> = {
    [x in keyof E]: Object extends E[x] ? Error<E[x]> : string;
} & { [x in string]: string }
