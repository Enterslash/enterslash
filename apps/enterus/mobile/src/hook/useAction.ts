import { useNavigation } from "@react-navigation/native";
import { clearLocalStorage } from "@enterslash/react-native-utils";
import { log_out } from '@enterslash/enterus/http-client'
import { NavigationStack } from "../navigation/root";
import { useUserStore } from "../store/userStore";
import { useAuthStore } from "../store/authStore";
// import { useTourStore } from "../store/tourStore";
import { useState } from "react";
import useNotification from "antd/es/notification/useNotification";
import { useNotificationStore } from "../store/notification";
import { useMessageStore } from "../store/message";
import { Alert } from "react-native";

export function useAction() {
    const navigation = useNavigation<NavigationStack>();
    const [loader, setLoader] = useState(false);
    const { setUser } = useUserStore();
    const { setUnseenNotification } = useNotificationStore();
    const { setUnseenMessage } = useMessageStore();
    // const { clearTour } = useTourStore();
    const { setAuthenticated } = useAuthStore();

    const logout = async () => {
        return Alert.alert('Are your sure?', 'Do you want to log out from this account?', [
            {
                text: 'Yes',
                onPress: async () => {
                    try {
                        setLoader(true);
                        await log_out()
                        setLoader(false);
                        clearLocal()
                    } catch (error) {
                        clearLocal()
                        setLoader(false);
                    }
                },
            },
            {
                text: 'No',
            },
        ]);
    };


    const clearLocal = async () => {
        clearLocalStorage();
        setUnseenNotification(0);
        setUnseenMessage(0);
        setUser(null);
        // clearTour();
        setAuthenticated(false)
        navigation.reset({
            index: 0,
            routes: [{ name: 'login' }],
        });
    }

    return {
        logout,
        loader
    }
}
