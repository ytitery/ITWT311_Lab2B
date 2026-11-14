import type { CourseName } from "./types.js";
import { getStudents, getEnrollments, addStudent, removeStudent, enrollCourse, removeEnrollment, findById, EnrollmentError } from "./dataLayer.js";
import { saveState, loadState } from "./storage.js";

const msgDiv = document.querySelector("#msg") as HTMLDivElement | null;
const studentNameInput = document.querySelector("#studentNameInput") as HTMLInputElement | null;
const addStudentBtn = document.querySelector("#addStudentBtn") as HTMLButtonElement | null;
const studentsListUl = document.querySelector("#studentsList") as HTMLUListElement | null;
const studentSelect = document.querySelector("#studentSelect") as HTMLSelectElement | null;
const courseSelect = document.querySelector("#courseSelect") as HTMLSelectElement | null;
const enrollForm = document.querySelector("#enrollForm") as HTMLFormElement | null;
const tbody = document.querySelector("#tbody") as HTMLTableSectionElement | null;

function showMessage(text: string, isError: boolean = false): void {
    if (!msgDiv) return;
    msgDiv.textContent = text;
    msgDiv.style.display = "block";
    msgDiv.className = isError ? "error" : "success";
    setTimeout(() => { if (msgDiv) msgDiv.style.display = "none"; }, 4000);
}

function renderStudentsList(): void {
    if (!studentsListUl || !studentSelect) return;
    studentsListUl.innerHTML = "";
    studentSelect.innerHTML = '<option value="">-- Choose a Student --</option>';
    getStudents().forEach(s => {
        const li = document.createElement("li");
        li.textContent = `ID: ${s.id} - ${s.name}`;
        const btn = document.createElement("button");
        btn.textContent = "Delete";
        btn.className = "delete-btn";
        btn.dataset.id = String(s.id);
        li.appendChild(btn);
        studentsListUl.appendChild(li);

        const opt = document.createElement("option");
        opt.value = String(s.id);
        opt.textContent = s.name;
        studentSelect.appendChild(opt);
    });
}

function renderEnrollments(): void {
    if (!tbody) return;
    tbody.innerHTML = "";
    getEnrollments().forEach(e => {
        const student = findById(getStudents(), e.studentId);
        const tr = document.createElement("tr");
        tr.innerHTML = `<td>${e.id}</td><td>${student ? student.name : ""}</td><td>${e.courseName}</td><td><button class="delete-btn" data-id="${e.id}">Remove</button></td>`;
        tbody.appendChild(tr);
    });
}

function updateUI(): void { renderStudentsList(); renderEnrollments(); }

if (addStudentBtn && studentNameInput) {
    addStudentBtn.addEventListener("click", () => {
        try {
            addStudent(studentNameInput.value);
            saveState();
            updateUI();
            studentNameInput.value = "";
            showMessage("Added successfully!");
        } catch (err: any) { showMessage(err.message, true); }
    });
}

if (enrollForm && studentSelect && courseSelect) {
    enrollForm.addEventListener("submit", (e) => {
        e.preventDefault();
        try {
            if (!studentSelect.value || !courseSelect.value) throw new Error("Select student and course.");
            enrollCourse(Number(studentSelect.value), courseSelect.value as CourseName);
            saveState();
            updateUI();
            enrollForm.reset();
            showMessage("Enrolled successfully!");
        } catch (err: any) { showMessage(err.message, true); }
    });
}

document.addEventListener("click", (e) => {
    const target = e.target as HTMLElement;
    if (target && target.classList.contains("delete-btn")) {
        const id = Number(target.dataset.id);
        if (target.closest("#studentsList")) {
            removeStudent(id);
        } else {
            removeEnrollment(id);
        }
        saveState();
        updateUI();
    }
});

document.addEventListener("DOMContentLoaded", () => { loadState(); updateUI(); });