export class EnrollmentError extends Error {
    constructor(message) {
        super(message);
        this.name = "EnrollmentError";
    }
}
class IdGenerator {
    constructor() {
        this.count = 0;
    }
    next() {
        this.count += 1;
        return this.count;
    }
}
const studentIdGen = new IdGenerator();
const enrollmentIdGen = new IdGenerator();
let students = [];
let enrollments = [];
export function findById(items, id) {
    return items.find(item => item.id === id);
}
export function getStudents() { return students; }
export function getEnrollments() { return enrollments; }
export function setAll(newStudents, newEnrollments) {
    students = newStudents;
    enrollments = newEnrollments;
    if (students.length > 0) {
        const maxId = Math.max(...students.map(s => s.id));
        for (let i = 0; i < maxId; i++)
            studentIdGen.next();
    }
    if (enrollments.length > 0) {
        const maxId = Math.max(...enrollments.map(e => e.id));
        for (let i = 0; i < maxId; i++)
            enrollmentIdGen.next();
    }
}
export function addStudent(name) {
    if (!name || name.trim() === "")
        throw new EnrollmentError("Student name cannot be empty.");
    const newStudent = { id: studentIdGen.next(), name: name.trim() };
    students.push(newStudent);
    return newStudent;
}
export function removeStudent(studentId) {
    if (!findById(students, studentId))
        throw new EnrollmentError(`Student not found.`);
    students = students.filter(s => s.id !== studentId);
    enrollments = enrollments.filter(e => e.studentId !== studentId);
}
export function enrollCourse(studentId, courseName) {
    if (!findById(students, studentId))
        throw new EnrollmentError("Student not found");
    if (enrollments.some(e => e.studentId === studentId && e.courseName === courseName)) {
        throw new EnrollmentError("This student is already enrolled in this course.");
    }
    enrollments.push({ id: enrollmentIdGen.next(), studentId, courseName });
}
export function removeEnrollment(enrollId) {
    if (!findById(enrollments, enrollId))
        throw new EnrollmentError("Enrollment not found.");
    enrollments = enrollments.filter(e => e.id !== enrollId);
}
