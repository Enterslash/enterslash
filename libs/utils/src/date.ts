
import { endOfMonth, endOfWeek, format, parseISO, startOfMonth, startOfWeek, differenceInDays } from 'date-fns'

const parse = (date: string | Date) => {
    date = (date instanceof Date) ? date : parseISO(date as unknown as string);
    return date
}

export const formatDate = (date?: string | Date | null, formatStr?: string) => {
    if (!date) return '';
    return format(parse(date), formatStr || 'yyyy-MM-dd hh:mm a');
}

export const startOfThisMonth = () => {
    return startOfMonth(new Date());
}

export const endOfThisMonth = () => {
    return endOfMonth(new Date());
}

export const startOfThisWeek = () => {
    return startOfWeek(new Date());
}

export const endOfThisWeek = () => {
    return endOfWeek(new Date());
}

export const diffInDays = (date1: string | Date, date2: string | Date) => {
    return differenceInDays(parse(date1), parse(date2));
}