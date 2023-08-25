import { MMKV } from 'react-native-mmkv'

export const storage = new MMKV()

// type StorageKeys = "TOKEN" | "FCM_TOKEN" | "DEEP_URL";

export enum StorageKeys {
    TOKEN = "TOKEN",
    FCM_TOKEN = "FCM_TOKEN",
    DEEP_URL = "DEEP_URL",
}

export const setLocalItem = (key: string, value: any) => {
    let dataToStore = value;
    if (typeof value === "object") {
        dataToStore = JSON.stringify(value);
    }
    try {
        storage.set(key, dataToStore);
    } catch (error) {
        console.log(error);
    }
}

export const getLocalItem = (key: string) => {
    let dataToReturn = storage.getString(key)
    if (!dataToReturn) return null;
    try {
        return JSON.parse(dataToReturn);
    } catch (error) {
        return dataToReturn;
    }
}

export const removeLocalItem = (key: string) => {
    storage.delete(key)
}

export const clearLocalStorage = () => {
    storage.clearAll()
}
