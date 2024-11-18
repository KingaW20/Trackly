import { Roles } from "../constants";

//To show proper elements according to policies
export const claimReq = {
    adminOnly : (c: any) => c.role == Roles.ADMIN
    // adminOrTeacher : (c: any) => c.role == Roles.ADMIN || c.role == Roles.TEACHER,
    // femaleAndTeacher : (c: any) => c.role == Roles.TEACHER && c.gender == Values.FEMALE,
    // hasLibraryId : (c: any) => c.libraryID != null,
    // femaleAndBelow10 : (c: any) => c.gender == Values.FEMALE && parseInt(c.age) < 10
}