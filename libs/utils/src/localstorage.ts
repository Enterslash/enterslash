export const STORAGE = {
    TOKEN: "token",
    USER: "user",
}

export const setLocal = (key: string, data: any, isTemporary = false) => {
    let dataToStore = data;
    if (typeof data === "object") {
        dataToStore = JSON.stringify(data);
    }
    if (!isTemporary) {
        localStorage.setItem(key, dataToStore);
    } else {
        sessionStorage.setItem(key, dataToStore);
    }
};
export const getLocal = (key: string | string, isTemporary = false) => {
    let dataToReturn = localStorage.getItem(key);
    if (isTemporary) {
        dataToReturn = sessionStorage.getItem(key);
    }
    if (!dataToReturn) return null;
    try {
        return JSON.parse(dataToReturn);
    } catch (error) {
        return dataToReturn;
    }
};
export const removeLocal = (key: string, isTemporary = false) => {
    if (!isTemporary) {
        localStorage.removeItem(key);
    } else {
        sessionStorage.removeItem(key);
    }
};
