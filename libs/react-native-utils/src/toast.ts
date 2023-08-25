import Toast from 'react-native-toast-message';

type ToastType = 'success' | 'error';
export const showAlert = (message: string, type: ToastType = 'success') => {
    Toast.hide();
    setTimeout(() => {
        Toast.show({
            type,
            text1: message,
            position: 'top',
            visibilityTime: 5000,
        });
    }, 100);
};