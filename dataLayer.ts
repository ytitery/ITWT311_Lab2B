import type { Student, Enrollment, CourseName } from "./types.js";

export class EnrollmentError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "EnrollmentError";
    }
}

class IdGenerator {
    private count = 0;
    next(): number {
        this.count += 1;
        return this.count;
    }
}

const studentIdGen = new IdGenerator();
const enrollmentIdGen = new IdGenerator();

let students: Student[] = [];
let enrollments: Enrollment[] = [];

export function findById<T extends { id: number }>(items: T[], id: number): T | undefined {
    return items.find(item => item.id === id);
}

export function getStudents(): Student[] { return students; }
export function getEnrollments(): Enrollment[] { return enrollments; }

export function setAll(newStudents: Student[], newEnrollments: Enrollment[]): void {
    students = newStudents;
    enrollments = newEnrollments;
    if (students.length > 0) {
        const maxId = Math.max(...students.map(s => s.id));
        for (let i = 0; i < maxId; i++) studentIdGen.next();
    }
    if (enrollments.length > 0) {
        const maxId = Math.max(...enrollments.map(e => e.id));
        for (let i = 0; i < maxId; i++) enrollmentIdGen.next();
    }
}

export function addStudent(name: string): Student {
    if (!name || name.trim() === "") throw new EnrollmentError("Student name cannot be empty.");
    const newStudent: Student = { id: studentIdGen.next(), name: name.trim() };
    students.push(newStudent);
    return newStudent;
}

export function removeStudent(studentId: number): void {
    if (!findById(students, studentId)) throw new EnrollmentError(`Student not found.`);
    students = students.filter(s => s.id !== studentId);
    enrollments = enrollments.filter(e => e.studentId !== studentId);
}

export function enrollCourse(studentId: number, courseName: CourseName): void {
    if (!findById(students, studentId)) throw new EnrollmentError("Student not found");
    if (enrollments.some(e => e.studentId === studentId && e.courseName === courseName)) {
        throw new EnrollmentError("This student is already enrolled in this course.");
    }
    enrollments.push({ id: enrollmentIdGen.next(), studentId, courseName });
}

export function removeEnrollment(enrollId: number): void {
    if (!findById(enrollments, enrollId)) throw new EnrollmentError("Enrollment not found.");
    enrollments = enrollments.filter(e => e.id !== enrollId);
}