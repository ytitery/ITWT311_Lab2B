import { getStudents, getEnrollments, setAll, addStudent } from "./dataLayer.js";
const STUDENTS_KEY = "itwt311_students";
const ENROLLMENTS_KEY = "itwt311_enrollments";
export function saveState() {
    localStorage.setItem(STUDENTS_KEY, JSON.stringify(getStudents()));
    localStorage.setItem(ENROLLMENTS_KEY, JSON.stringify(getEnrollments()));
}
export function loadState() {
    const sData = localStorage.getItem(STUDENTS_KEY);
    const eData = localStorage.getItem(ENROLLMENTS_KEY);
    if (sData && eData) {
        setAll(JSON.parse(sData), JSON.parse(eData));
    }
    else {
        addStudent("Maryam Zuhair");
        addStudent("Ahmed Ali");
        addStudent("Sara Omar");
        saveState();
    }
}
