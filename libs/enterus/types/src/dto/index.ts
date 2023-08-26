export * from './auth';
export * from './profile';
export * from './message'
export * from './app'
export * from './user'
export * from './log'

export type DTO<T, U extends {
    [x in keyof T]?: Partial<U[x]> extends Partial<T[x]> ? DTO<T[x], Partial<T[x]>> : any;
}> = U;

export type Select<T> = {
    [x in keyof T]: T[x] extends object ? Select<Partial<T[x]>> | 1 | 0 : 0 | 1 | Object;
};