export const semester = [
    "1st",
    "2nd",
    "3rd",
    "4th",
    "5th",
    "6th",
    "7th",
    "8th",
    "9th",
    "10th",
    "11th",
    "12th"
]

const sectionNumber = Array.from({ length: 30 }).map((_, i) => i)

export const section = [
    ...sectionNumber.map((i) => ({
        label: `D${i + 1}`,
        value: `d${i + 1}`,
    })),
    ...sectionNumber.map((i) => ({
        label: `E${i + 1}`,
        value: `e${i + 1}`,
    })),
]

export const subject = [
    {
        label: "BSc in EEE",
        value: "bsc-in-eee"
    },
    {
        label: "Bsc in CSE",
        value: "bsc-in-cse"
    },
    {
        label: "BSc in Textile Engineering",
        value: "bsc-in-textile-engineering"
    },
    {
        label: "LLB (Hons)",
        value: "llb-hons"
    },
    {
        label: "BBA",
        value: "bba"
    },
    {
        label: "BSS (Hons) in Journalism and Media Communication",
        value: "bss-hons-in-journalism-and-media-communication"
    },
    {
        label: "BA (Hons) in English",
        value: "ba-hons-in-english"
    },
    {
        label: "BSS (Hons) in Sociology",
        value: "bss-hons-in-sociology"
    },
    {
        label: "MBA (Regular )",
        value: "mba-regular"
    },
    {
        label: "MBA (for BBA passed students)",
        value: "mba-for-bba-passed-students"
    },
    {
        label: "EMBA",
        value: "emba"
    },
    {
        label: "LL.M",
        value: "llm"
    }
]