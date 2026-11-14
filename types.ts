export type CourseName =
    | "Advanced Internet Programming"
    | "Network Security"
    | "Operating Systems";

export type Student = {
    id: number;
    name: string;
};

export type Enrollment = {
    id: number;
    studentId: number;
    courseName: CourseName;
};