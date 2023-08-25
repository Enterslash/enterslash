import { UserType } from "@enterslash/enterus/types";
import { useAppState } from "../store/appState";

export const checkAccess = (access?: UserType | UserType[]) => {
    const user = useAppState.getState().user;
    if (access) {
        if (Array.isArray(access)) {
            return user?.userType.some((type) => access.includes(type));
        } else {
            return user?.userType.includes(access);
        }
    }
}