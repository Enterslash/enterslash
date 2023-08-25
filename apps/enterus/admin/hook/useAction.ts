import { removeLocal } from "@enterslash/utils";
import { useAuthStore } from "../store/authStore";

export function useAction() {
    const { setAuthenticated } = useAuthStore();

    const logout = () => {
        removeLocal("token");
        setAuthenticated(false);
    };

    return {
        logout
    }
}
