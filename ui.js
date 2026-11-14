import { getStudents, getEnrollments, addStudent, removeStudent, enrollCourse, removeEnrollment, findById } from "./dataLayer.js";
import { saveState, loadState } from "./storage.js";
const msgDiv = document.querySelector("#msg");
const studentNameInput = document.querySelector("#studentNameInput");
const addStudentBtn = document.querySelector("#addStudentBtn");
const studentsListUl = document.querySelector("#studentsList");
const studentSelect = document.querySelector("#studentSelect");
const courseSelect = document.querySelector("#courseSelect");
const enrollForm = document.querySelector("#enrollForm");
const tbody = document.querySelector("#tbody");
function showMessage(text, isError = false) {
    if (!msgDiv)
        return;
    msgDiv.textContent = text;
    msgDiv.style.display = "block";
    msgDiv.className = isError ? "error" : "success";
    setTimeout(() => { if (msgDiv)
        msgDiv.style.display = "none"; }, 4000);
}
function renderStudentsList() {
    if (!studentsListUl || !studentSelect)
        return;
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
function renderEnrollments() {
    if (!tbody)
        return;
    tbody.innerHTML = "";
    getEnrollments().forEach(e => {
        const student = findById(getStudents(), e.studentId);
        const tr = document.createElement("tr");
        tr.innerHTML = `<td>${e.id}</td><td>${student ? student.name : ""}</td><td>${e.courseName}</td><td><button class="delete-btn" data-id="${e.id}">Remove</button></td>`;
        tbody.appendChild(tr);
    });
}
function updateUI() { renderStudentsList(); renderEnrollments(); }
if (addStudentBtn && studentNameInput) {
    addStudentBtn.addEventListener("click", () => {
        try {
            addStudent(studentNameInput.value);
            saveState();
            updateUI();
            studentNameInput.value = "";
            showMessage("Added successfully!");
        }
        catch (err) {
            showMessage(err.message, true);
        }
    });
}
if (enrollForm && studentSelect && courseSelect) {
    enrollForm.addEventListener("submit", (e) => {
        e.preventDefault();
        try {
            if (!studentSelect.value || !courseSelect.value)
                throw new Error("Select student and course.");
            enrollCourse(Number(studentSelect.value), courseSelect.value);
            saveState();
            updateUI();
            enrollForm.reset();
            showMessage("Enrolled successfully!");
        }
        catch (err) {
            showMessage(err.message, true);
        }
    });
}
document.addEventListener("click", (e) => {
    const target = e.target;
    if (target && target.classList.contains("delete-btn")) {
        const id = Number(target.dataset.id);
        if (target.closest("#studentsList")) {
            removeStudent(id);
        }
        else {
            removeEnrollment(id);
        }
        saveState();
        updateUI();
    }
});
document.addEventListener("DOMContentLoaded", () => { loadState(); updateUI(); });
