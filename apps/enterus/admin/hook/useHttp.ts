import { Dispatch, SetStateAction, useState } from "react";
import { Error } from "@enterslash/enterus/types";
import { toast } from 'react-toastify';

interface HookReturnType<T, E> {
    data: T | null;
    setData: Dispatch<SetStateAction<T | null>>
    loading: boolean;
    error: Error<E> | null;
    request: () => Promise<T>;
    customRequest: (fn: any) => Promise<T>
}

export function useHttp<T = null, E = null>(callApi?: () => Promise<T>): HookReturnType<T, E> {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error<E> | null>(null);
    const [data, setData] = useState<T | null>(null);
    const toggleLoading = () => {
        setLoading(prev => !prev);
    }

    const request = (): Promise<T> => {
        setData(null);
        setError(null);
        // eslint-disable-next-line no-async-promise-executor
        return new Promise(async (resolve, reject) => {
            try {
                if (callApi) {
                    toggleLoading();
                    const res = await callApi();
                    setData(res);
                    resolve(res);
                    toggleLoading();
                }
            } catch (error: any) {
                if (typeof error === "string") {
                    toast.error(error);
                } else {
                    setError(error);
                }
                toggleLoading();
                reject(error);
            }
        })
    }

    const customRequest = (fn: any): Promise<T> => {
        setData(null);
        setError(null);
        // eslint-disable-next-line no-async-promise-executor
        return new Promise(async (resolve, reject) => {
            try {
                toggleLoading();
                const res = await fn();
                setData(res);
                resolve(res);
                toggleLoading();
            } catch (error: any) {
                if (typeof error === "string") {
                    toast.error(error);
                } else {
                    setError(error);
                }
                toggleLoading();
                reject(error);
            }
        })
    }

    return { data, loading, error, request, customRequest, setData }
}
