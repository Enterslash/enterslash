import { showAlert } from '@enterslash/react-native-utils';
import { useState } from 'react';
import { useAppStore } from '../store/appStore';
import { Error } from '@enterslash/enterus/types';

interface RequestParams {
    globalLoading?: boolean;
}

export function useHttp<T = null, E = null>(callApi?: () => Promise<T>) {
    const { toggleLoader } = useAppStore();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error<E>>(null);
    const [data, setData] = useState<T>(null);

    const request = (arg?: RequestParams): Promise<T> => {
        const toggleLoading = () => {
            if (arg?.globalLoading) {
                toggleLoader();
            } else {
                setLoading((prev) => !prev);
            }
        };
        setData(null);
        setError(null);
        return new Promise((resolve, reject) => {
            (async () => {
                try {
                    if (callApi) {
                        toggleLoading();
                        const res = await callApi();
                        setData(res);
                        toggleLoading();
                        resolve(res);
                    }
                } catch (error) {
                    if (typeof error === 'string') {
                        showAlert(error, 'error');
                    } else {
                        setError(error);
                    }
                    toggleLoading();
                    reject(error);
                }
            })()
        });
    };

    const customRequest = (fn: any, arg?: RequestParams): Promise<T> => {
        const toggleLoading = () => {
            if (arg?.globalLoading) {
                toggleLoader();
            } else {
                setLoading((prev) => !prev);
            }
        };
        setData(null);
        setError(null);
        return new Promise((resolve, reject) => {
            (async () => {
                try {
                    toggleLoading();
                    const res = await fn();
                    setData(res);
                    resolve(res);
                    toggleLoading();
                } catch (error: any) {
                    if (typeof error === "string") {
                        showAlert(error);
                    } else {
                        setError(error);
                    }
                    toggleLoading();
                    reject(error);
                }
            })();
        })
    }

    return { data, loading, error, request, customRequest, setData };
}
