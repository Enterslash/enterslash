import { IUser } from "@enterslash/enterus/types";

export const fullName = (user: Partial<Pick<IUser, 'firstName' | 'lastName' | 'email'>>) => {
    if (user?.firstName && user?.lastName) {
        return `${user?.firstName} ${user?.lastName}`;
    } else if (user?.email) {
        return user?.email.split('@')[0];
    } else {
        return ''
    }
}