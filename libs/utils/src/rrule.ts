import { IBooking } from '@enterslash/enterus/types';
import { RRule } from 'rrule';

export const WEEKS = {
    'MO': RRule.MO.weekday,
    'TU': RRule.TU.weekday,
    'WE': RRule.WE.weekday,
    'TH': RRule.TH.weekday,
    'FR': RRule.FR.weekday,
    'SA': RRule.SA.weekday,
    'SU': RRule.SU.weekday
};

// export const getNextDate = (date: IBooking["date"]) => {
//     const end = date?.end
//     const start = date?.start
//     const frequency = date?.frequency

//     if (frequency) {
//         const rruleObj = RRule.fromString(frequency);
//         const rule = new RRule({
//             byweekday: rruleObj.options.byweekday,
//             dtstart: new Date(start),
//             until: new Date(end),
//         });
        
//         return rule.after(new Date(), true)
//     } else {
//         return start;
//     }
// }