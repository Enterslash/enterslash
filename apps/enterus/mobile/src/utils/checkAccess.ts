import { UserType } from "@enterslash/enterus/types";
import { useUserStore } from "../store/userStore";

export const checkAccess = (access?: UserType | UserType[]) => {
    const user  = useUserStore.getState().user;
    if (access) {
        if (Array.isArray(access)) {
            return user?.userType?.some((type) => access.includes(type));
        } else {
            return user?.userType?.includes(access);
        }
    }
}