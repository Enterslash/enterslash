import Subject from "../../models/Subject"

export const populateSubjects = async () => {
    const subjects = [
        "BSc in EEE",
        "Bsc in CSE",
        "BSc in Textile Engineering",
        "LLB (Hons)",
        "BBA",
        "BSS (Hons) in Journalism and Media Communication",
        "BA (Hons) in English",
        "BSS (Hons) in Sociology",
        "MBA (Regular )",
        "MBA (for BBA passed students)",
        "EMBA",
        "LL.M",
    ]

    const empty = await Subject.countDocuments();
    if (!empty) {
        await Subject.insertMany(
            subjects.map((subject) => ({
                name: subject,
            }))
        );
    }
}