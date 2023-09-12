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

export const roomIdToTitle = (roomId: string) => {
    if (!roomId) return '';
    const [batch, subject, section, course, code] = roomId.split('-');
    return `${course.toUpperCase()}-${code}`;
};

export const randomBackground = (name: string) => {
    return 'https://source.boringavatars.com/bauhaus/30/' + name
}