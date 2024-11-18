//To show proper elements according to policies
export const claimReq = {
    adminOnly : (c: any) => c.role == "Admin",
    adminOrTeacher : (c: any) => c.role == "Admin" || c.role == "Teacher",
    femaleAndTeacher : (c: any) => c.role == "Teacher" && c.gender == "Female",
    hasLibraryId : (c: any) => c.libraryID != null,
    femaleAndBelow10 : (c: any) => c.gender == "Female" && parseInt(c.age) < 10
}