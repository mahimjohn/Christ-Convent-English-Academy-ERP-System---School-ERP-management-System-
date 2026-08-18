/*
============================================================
TEACHER DASHBOARD
Christ Convent English Academy ERP
Phase 1
============================================================

Responsibilities:
- Firebase authentication
- Load teacher information
- Load assigned subjects
- Load assigned classes
- Load students
- Load timetable
- Load examinations
- Load attendance settings
- Update existing HTML dashboard
- Handle refresh
- Handle logout

IMPORTANT:
This JS does NOT rebuild the dashboard HTML.
The HTML/CSS controls the UI.
This file controls the data and functionality.
============================================================
*/


/*
============================================================
FIREBASE IMPORTS
============================================================
*/

import { auth, db } from "./firebase-config.js";

import {
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

import {
    collection,
    getDocs,
    getDoc,
    doc,
    query,
    where
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";


/*
============================================================
GLOBAL VARIABLES
============================================================
*/

let currentUser = null;
let currentUserData = null;
let currentEmployee = null;

let teacherSubjects = [];
let teacherClasses = [];
let teacherStudents = [];
let teacherTimetables = [];
let teacherExaminations = [];

let attendanceSettings = null;


/*
============================================================
AUTHENTICATION
============================================================
*/

onAuthStateChanged(auth, async (user) => {

    if (!user) {

        console.warn("No authenticated teacher found.");

        window.location.href = "./login-page.html";

        return;
    }


    currentUser = user;


    console.log("Authenticated Teacher:", currentUser.email);


    try {

        await loadTeacherInformation();

        updateTeacherDashboard();

    }

    catch (error) {

        console.error(
            "Teacher Dashboard Error:",
            error
        );

        showDashboardError(error);

    }

});


/*
============================================================
LOAD TEACHER INFORMATION
============================================================
*/

async function loadTeacherInformation() {

    if (!currentUser) {
        return;
    }


    /*
    --------------------------------------------------------
    LOAD USER DOCUMENT
    users/{UID}
    --------------------------------------------------------
    */

    try {

        const userRef = doc(
            db,
            "users",
            currentUser.uid
        );


        const userSnapshot = await getDoc(userRef);


        if (userSnapshot.exists()) {

            currentUserData =
                userSnapshot.data();

            console.log(
                "Teacher User Data:",
                currentUserData
            );

        }

        else {

            console.warn(
                "User document not found."
            );

        }

    }

    catch (error) {

        console.error(
            "Unable to load user document:",
            error
        );

    }


    /*
    --------------------------------------------------------
    LOAD EMPLOYEE USING EMAIL
    --------------------------------------------------------
    */

    try {

        const employeeQuery = query(
            collection(db, "employees"),
            where(
                "Email",
                "==",
                currentUser.email
            )
        );


        const employeeSnapshot =
            await getDocs(employeeQuery);


        if (!employeeSnapshot.empty) {

            currentEmployee =
                employeeSnapshot.docs[0].data();


            console.log(
                "Teacher Employee Data:",
                currentEmployee
            );

        }

        else {

            console.warn(
                "Employee record not found for:",
                currentUser.email
            );

        }

    }

    catch (error) {

        console.error(
            "Unable to load employee:",
            error
        );

    }


    /*
    --------------------------------------------------------
    LOAD TEACHER DATA
    --------------------------------------------------------
    */

    await loadTeacherSubjects();

    await loadTeacherClasses();

    await loadTeacherStudents();

    await loadTeacherTimetable();

    await loadTeacherExaminations();

    await loadAttendanceSettings();


    console.log(
        "Teacher information loaded successfully."
    );

}


/*
============================================================
LOAD TEACHER SUBJECTS
============================================================
*/

async function loadTeacherSubjects() {

    teacherSubjects = [];


    if (!currentEmployee) {
        return;
    }


    const teacherName =
        currentEmployee.Name;


    if (!teacherName) {
        return;
    }


    try {

        const subjectsQuery = query(
            collection(db, "subjects"),
            where(
                "TeacherName",
                "==",
                teacherName
            )
        );


        const snapshot =
            await getDocs(subjectsQuery);


        snapshot.forEach((subjectDoc) => {

            teacherSubjects.push({

                id: subjectDoc.id,

                ...subjectDoc.data()

            });

        });


        console.log(
            "Teacher Subjects:",
            teacherSubjects
        );

    }

    catch (error) {

        console.error(
            "Unable to load teacher subjects:",
            error
        );

    }

}


/*
============================================================
LOAD TEACHER CLASSES
============================================================
*/

async function loadTeacherClasses() {

    teacherClasses = [];


    if (!currentEmployee) {
        return;
    }


    const teacherName =
        currentEmployee.Name;


    if (!teacherName) {
        return;
    }


    try {

        const classesQuery = query(
            collection(db, "classes"),
            where(
                "ClassTeacher",
                "==",
                teacherName
            )
        );


        const snapshot =
            await getDocs(classesQuery);


        snapshot.forEach((classDoc) => {

            teacherClasses.push({

                id: classDoc.id,

                ...classDoc.data()

            });

        });


        /*
        --------------------------------------------------------
        ALSO FIND CLASSES FROM SUBJECT ASSIGNMENTS
        --------------------------------------------------------
        */

        teacherSubjects.forEach((subject) => {

            const className =
                subject.ClassName;


            if (!className) {
                return;
            }


            const alreadyExists =
                teacherClasses.some(
                    (classItem) => {

                        return (
                            normalize(
                                classItem.ClassName
                            )
                            ===
                            normalize(
                                className
                            )
                        );

                    }
                );


            if (!alreadyExists) {

                teacherClasses.push({

                    ClassName:
                        className,

                    Section:
                        subject.Section || "",

                    Status:
                        subject.Status || "Active"

                });

            }

        });


        console.log(
            "Teacher Classes:",
            teacherClasses
        );

    }

    catch (error) {

        console.error(
            "Unable to load teacher classes:",
            error
        );

    }

}


/*
============================================================
LOAD TEACHER STUDENTS
============================================================
*/

async function loadTeacherStudents() {

    teacherStudents = [];


    if (
        !teacherClasses ||
        teacherClasses.length === 0
    ) {

        return;

    }


    try {

        const studentSnapshot =
            await getDocs(
                collection(
                    db,
                    "students"
                )
            );


        studentSnapshot.forEach(
            (studentDoc) => {

                const student =
                    studentDoc.data();


                const belongsToTeacherClass =
                    teacherClasses.some(
                        (classItem) => {

                            const className =
                                normalize(
                                    classItem.ClassName
                                );


                            const studentClass =
                                normalize(
                                    student.Class
                                );


                            return (
                                className &&
                                studentClass &&
                                className === studentClass
                            );

                        }
                    );


                if (
                    belongsToTeacherClass
                ) {

                    teacherStudents.push({

                        id:
                            studentDoc.id,

                        ...student

                    });

                }

            }
        );


        console.log(
            "Teacher Students:",
            teacherStudents
        );

    }

    catch (error) {

        console.error(
            "Unable to load students:",
            error
        );

    }

}


/*
============================================================
LOAD TEACHER TIMETABLE
============================================================
*/

async function loadTeacherTimetable() {

    teacherTimetables = [];


    try {

        const snapshot =
            await getDocs(
                collection(
                    db,
                    "timetables"
                )
            );


        snapshot.forEach(
            (timetableDoc) => {

                const timetable =
                    timetableDoc.data();


                const belongsToTeacherClass =
                    teacherClasses.some(
                        (classItem) => {

                            const sameClass =
                                normalize(
                                    classItem.ClassName
                                )
                                ===
                                normalize(
                                    timetable.ClassName
                                );


                            const timetableSection =
                                normalize(
                                    timetable.Section
                                );


                            const classSection =
                                normalize(
                                    classItem.Section
                                );


                            /*
                            If section isn't available,
                            match by class only.
                            */

                            if (
                                !timetableSection ||
                                !classSection
                            ) {

                                return sameClass;

                            }


                            return (
                                sameClass &&
                                timetableSection ===
                                classSection
                            );

                        }
                    );


                if (
                    belongsToTeacherClass
                ) {

                    teacherTimetables.push({

                        id:
                            timetableDoc.id,

                        ...timetable

                    });

                }

            }
        );


        console.log(
            "Teacher Timetables:",
            teacherTimetables
        );

    }

    catch (error) {

        console.error(
            "Unable to load timetable:",
            error
        );

    }

}


/*
============================================================
LOAD EXAMINATIONS
============================================================
*/

async function loadTeacherExaminations() {

    teacherExaminations = [];


    try {

        const snapshot =
            await getDocs(
                collection(
                    db,
                    "examinations"
                )
            );


        snapshot.forEach(
            (examDoc) => {

                const exam =
                    examDoc.data();


                const belongsToTeacherClass =
                    teacherClasses.some(
                        (classItem) => {

                            return (
                                normalize(
                                    classItem.ClassName
                                )
                                ===
                                normalize(
                                    exam.ClassName
                                )
                            );

                        }
                    );


                if (
                    belongsToTeacherClass
                ) {

                    teacherExaminations.push({

                        id:
                            examDoc.id,

                        ...exam

                    });

                }

            }
        );


        console.log(
            "Teacher Examinations:",
            teacherExaminations
        );

    }

    catch (error) {

        console.error(
            "Unable to load examinations:",
            error
        );

    }

}


/*
============================================================
LOAD ATTENDANCE SETTINGS
============================================================
*/

async function loadAttendanceSettings() {

    attendanceSettings = null;


    try {

        const snapshot =
            await getDocs(
                collection(
                    db,
                    "attendanceSettings"
                )
            );


        if (!snapshot.empty) {

            const latestDoc =
                snapshot.docs[
                    snapshot.docs.length - 1
                ];


            attendanceSettings =
                latestDoc.data();

        }


        console.log(
            "Attendance Settings:",
            attendanceSettings
        );

    }

    catch (error) {

        console.error(
            "Unable to load attendance settings:",
            error
        );

    }

}


/*
============================================================
UPDATE DASHBOARD
============================================================

IMPORTANT:
This function does NOT replace the HTML.

It only updates values inside the existing HTML.
============================================================
*/

function updateTeacherDashboard() {

    console.log(
        "Updating Teacher Dashboard..."
    );


    updateTeacherInformation();

    updateStatistics();

    updateTeacherOverview();

    updateTodaysSchedule();

    updateMyClasses();

    updateAttendanceOverview();

    updatePendingTasks();

    updateRecentActivities();

    initializeDashboardButtons();


    console.log(
        "Teacher Dashboard Updated Successfully."
    );

}


/*
============================================================
TEACHER INFORMATION
============================================================
*/

function updateTeacherInformation() {

    const teacherName =
        currentEmployee?.Name ||
        currentUserData?.Name ||
        currentUser?.displayName ||
        "Teacher";


    const designation =
        currentEmployee?.Designation ||
        currentUserData?.Role ||
        "Teacher";


    const department =
        currentEmployee?.Department ||
        currentUserData?.Department ||
        "Teaching Department";


    const academicSession =
        currentEmployee?.AcademicSession ||
        currentUserData?.AcademicSession ||
        "2026–27";


    setText(
        "teacher-welcome",
        `Welcome back, ${teacherName}!`
    );


    setText(
        "teacher-name",
        teacherName
    );


    setText(
        "teacher-designation",
        designation
    );


    setText(
        "teacher-department",
        department
    );


    setText(
        "teacher-academic-session",
        academicSession
    );


    setText(
        "assigned-classes",
        teacherClasses.length
    );


    /*
    --------------------------------------------------------
    FALLBACK FOR EXISTING HTML
    --------------------------------------------------------
    */

    const welcomeElement =
        document.querySelector(
            ".welcome-title"
        );


    if (
        welcomeElement &&
        !document.getElementById(
            "teacher-welcome"
        )
    ) {

        welcomeElement.textContent =
            `Welcome back, ${teacherName}!`;

    }

}


/*
============================================================
TEACHER OVERVIEW CARD
============================================================
*/

function updateTeacherOverview() {

    const teacherName =
        currentEmployee?.Name ||
        currentUserData?.Name ||
        currentUser?.displayName ||
        "Teacher";


    const designation =
        currentEmployee?.Designation ||
        currentUserData?.Role ||
        "Teacher";


    const department =
        currentEmployee?.Department ||
        currentUserData?.Department ||
        "Teaching Department";


    setText(
        "overview-teacher-name",
        teacherName
    );


    setText(
        "overview-designation",
        designation
    );


    setText(
        "overview-department",
        department
    );


    setText(
        "overview-classes",
        teacherClasses.length
    );


    setText(
        "overview-subjects",
        teacherSubjects.length
    );


    /*
    --------------------------------------------------------
    CIRCLE
    --------------------------------------------------------
    */

    setText(
        "overview-assigned-classes",
        teacherClasses.length
    );

}


/*
============================================================
QUICK STATISTICS
============================================================
*/

function updateStatistics() {

    const totalStudents =
        teacherStudents.length;


    const totalClasses =
        teacherClasses.length;


    const totalSubjects =
        teacherSubjects.length;


    const todaysClasses =
        getTodaysClasses().length;


    const attendancePending =
        calculateAttendancePending();


    setText(
        "total-students",
        totalStudents
    );


    setText(
        "classes-assigned",
        totalClasses
    );


    setText(
        "subjects-assigned",
        totalSubjects
    );


    setText(
        "todays-classes",
        todaysClasses
    );


    setText(
        "attendance-pending",
        attendancePending
    );


    /*
    --------------------------------------------------------
    OPTIONAL SUBTEXTS
    --------------------------------------------------------
    */

    setText(
        "students-subtext",
        "Across assigned classes"
    );


    setText(
        "classes-subtext",
        "Active classes"
    );


    setText(
        "subjects-subtext",
        getSubjectNames()
    );


    setText(
        "today-classes-subtext",
        `${todaysClasses} scheduled`
    );


    setText(
        "attendance-pending-subtext",
        attendancePending > 0
            ? "Requires attention"
            : "All attendance complete"
    );

}


/*
============================================================
TODAY'S SCHEDULE
============================================================
*/

function updateTodaysSchedule() {

    const container =
        document.getElementById(
            "today-schedule"
        );


    if (!container) {

        console.warn(
            "today-schedule element not found."
        );

        return;

    }


    const todaysClasses =
        getTodaysClasses();


    if (
        todaysClasses.length === 0
    ) {

        container.innerHTML = `

            <div class="empty-state">

                <i class="fa-solid fa-calendar-xmark"></i>

                <p>
                    No classes scheduled for today.
                </p>

            </div>

        `;

        return;

    }


    let html = "";


    todaysClasses.forEach(
        (item, index) => {

            const className =
                item.className ||
                "Class";


            const subject =
                item.subject ||
                "Subject";


            const room =
                item.room ||
                "Room not assigned";


            const time =
                item.time ||
                `Period ${index + 1}`;


            const completed =
                item.completed;


            html += `

                <div class="schedule-item">

                    <div class="schedule-time">

                        <strong>
                            ${escapeHTML(time)}
                        </strong>

                    </div>


                    <div class="schedule-line">

                        <span></span>

                    </div>


                    <div class="schedule-details">

                        <small>
                            PERIOD ${index + 1}
                        </small>

                        <h3>
                            ${escapeHTML(subject)}
                        </h3>

                        <p>
                            ${escapeHTML(className)}
                            &nbsp; • &nbsp;
                            ${escapeHTML(room)}
                        </p>

                    </div>


                    <div class="schedule-status">

                        ${
                            completed

                            ?

                            `
                            <span class="status-completed">
                                <i class="fa-solid fa-circle-check"></i>
                                Completed
                            </span>
                            `

                            :

                            `
                            <span class="status-pending">
                                <i class="fa-solid fa-clock"></i>
                                Pending
                            </span>
                            `
                        }

                    </div>


                    <div class="schedule-action">

                        ${
                            completed

                            ?

                            `
                            <button
                                class="schedule-view-btn"
                                data-index="${index}"
                            >
                                View
                            </button>
                            `

                            :

                            `
                            <button
                                class="schedule-attendance-btn"
                                data-index="${index}"
                            >
                                Attendance
                            </button>
                            `
                        }

                    </div>

                </div>

            `;

        }
    );


    container.innerHTML = html;


    /*
    --------------------------------------------------------
    ATTACH BUTTON EVENTS
    --------------------------------------------------------
    */

    container
        .querySelectorAll(
            ".schedule-view-btn"
        )
        .forEach(
            (button) => {

                button.addEventListener(
                    "click",
                    () => {

                        const index =
                            Number(
                                button.dataset.index
                            );


                        const selected =
                            todaysClasses[index];


                        console.log(
                            "Selected class:",
                            selected
                        );

                    }
                );

            }
        );


    container
        .querySelectorAll(
            ".schedule-attendance-btn"
        )
        .forEach(
            (button) => {

                button.addEventListener(
                    "click",
                    () => {

                        const index =
                            Number(
                                button.dataset.index
                            );


                        const selected =
                            todaysClasses[index];


                        handleAttendance(
                            selected
                        );

                    }
                );

            }
        );

}


/*
============================================================
MY CLASSES
============================================================
*/

function updateMyClasses() {

    const container =
        document.getElementById(
            "classes-container"
        );


    if (!container) {

        console.warn(
            "classes-container element not found."
        );

        return;

    }


    if (
        teacherClasses.length === 0
    ) {

        container.innerHTML = `

            <div class="empty-state">

                <i class="fa-solid fa-users"></i>

                <p>
                    No classes assigned yet.
                </p>

            </div>

        `;

        return;

    }


    let html = "";


    teacherClasses.forEach(
        (classItem) => {

            const className =
                classItem.ClassName ||
                "Class";


            const section =
                classItem.Section ||
                "";


            const students =
                teacherStudents.filter(
                    (student) => {

                        return (
                            normalize(
                                student.Class
                            )
                            ===
                            normalize(
                                className
                            )
                        );

                    }
                );


            const classSubjects =
                teacherSubjects.filter(
                    (subject) => {

                        return (
                            normalize(
                                subject.ClassName
                            )
                            ===
                            normalize(
                                className
                            )
                        );

                    }
                );


            const attendance =
                calculateClassAttendance(
                    students
                );


            html += `

                <div class="teacher-class-card">

                    <div class="class-card-header">

                        <div>

                            <span class="class-badge">
                                ${escapeHTML(
                                    section ||
                                    className
                                )}
                            </span>

                        </div>


                        <span class="attendance-badge">

                            ${attendance}%

                        </span>

                    </div>


                    <h3>
                        ${escapeHTML(className)}
                        ${
                            section
                                ? ` - ${escapeHTML(section)}`
                                : ""
                        }
                    </h3>


                    <p class="class-subject">

                        ${
                            classSubjects.length > 0

                            ?

                            escapeHTML(
                                classSubjects
                                    .map(
                                        subject =>
                                            subject.SubjectName ||
                                            "Subject"
                                    )
                                    .join(" • ")
                            )

                            :

                            "No subject information"
                        }

                    </p>


                    <p class="subject-code">

                        ${
                            classSubjects.length > 0

                            ?

                            escapeHTML(
                                classSubjects
                                    .map(
                                        subject =>
                                            subject.SubjectCode ||
                                            ""
                                    )
                                    .filter(Boolean)
                                    .join(" • ")
                            )

                            :

                            ""
                        }

                    </p>


                    <div class="class-students">

                        <span>
                            Students
                        </span>

                        <strong>
                            ${students.length}
                        </strong>

                    </div>


                    <div class="class-actions">

                        <button
                            class="class-action-btn"
                            data-class="${escapeAttribute(
                                className
                            )}"
                        >

                            <i class="fa-solid fa-calendar-check"></i>

                            Attendance

                        </button>


                        <button
                            class="class-action-btn"
                            data-class="${escapeAttribute(
                                className
                            )}"
                        >

                            <i class="fa-solid fa-pen"></i>

                            Assignments

                        </button>


                        <button
                            class="class-action-btn"
                            data-class="${escapeAttribute(
                                className
                            )}"
                        >

                            <i class="fa-solid fa-chart-column"></i>

                            Marks

                        </button>


                        <button
                            class="class-action-btn"
                            data-class="${escapeAttribute(
                                className
                            )}"
                        >

                            <i class="fa-solid fa-users"></i>

                            Students

                        </button>

                    </div>

                </div>

            `;

        }
    );


    container.innerHTML = html;


    /*
    --------------------------------------------------------
    CLASS BUTTONS
    --------------------------------------------------------
    */

    container
        .querySelectorAll(
            ".class-action-btn"
        )
        .forEach(
            (button) => {

                button.addEventListener(
                    "click",
                    () => {

                        const className =
                            button.dataset.class;


                        console.log(
                            "Class action:",
                            className,
                            button.innerText.trim()
                        );


                        alert(
                            `${button.innerText.trim()} for ${className} will be connected in the next module.`
                        );

                    }
                );

            }
        );

}


/*
============================================================
ATTENDANCE OVERVIEW
============================================================
*/

function updateAttendanceOverview() {

    const container =
        document.getElementById(
            "attendance-overview"
        );


    if (!container) {
        return;
    }


    const totalStudents =
        teacherStudents.length;


    const averageAttendance =
        calculateOverallAttendance();


    const belowThreshold =
        calculateStudentsBelowThreshold();


    const pending =
        calculateAttendancePending();


    container.innerHTML = `

        <div class="attendance-overview-grid">

            <div class="attendance-stat">

                <span>
                    Today's Attendance
                </span>

                <strong>
                    ${
                        pending === 0
                            ? "Complete"
                            : "Pending"
                    }
                </strong>

            </div>


            <div class="attendance-stat">

                <span>
                    Pending Attendance
                </span>

                <strong>
                    ${pending}
                </strong>

            </div>


            <div class="attendance-stat">

                <span>
                    Average Attendance
                </span>

                <strong>
                    ${averageAttendance}%
                </strong>

            </div>


            <div class="attendance-stat">

                <span>
                    Below Threshold
                </span>

                <strong>
                    ${belowThreshold}
                </strong>

            </div>

        </div>

    `;


    setText(
        "attendance-average",
        `${averageAttendance}%`
    );


    setText(
        "students-below-threshold",
        belowThreshold
    );


    setText(
        "attendance-pending-count",
        pending
    );

}


/*
============================================================
PENDING TASKS
============================================================
*/

function updatePendingTasks() {

    const container =
        document.getElementById(
            "pending-tasks"
        );


    if (!container) {
        return;
    }


    const attendancePending =
        calculateAttendancePending();


    const assignmentsPending =
        0;


    const marksPending =
        teacherExaminations.length;


    const leaveRequests =
        0;


    container.innerHTML = `

        <div class="pending-task-list">

            <div class="pending-task">

                <div class="pending-task-icon attendance">
                    <i class="fa-solid fa-calendar-check"></i>
                </div>

                <div>

                    <strong>
                        Attendance
                    </strong>

                    <p>
                        ${attendancePending}
                        pending
                    </p>

                </div>

            </div>


            <div class="pending-task">

                <div class="pending-task-icon assignments">
                    <i class="fa-solid fa-file-pen"></i>
                </div>

                <div>

                    <strong>
                        Assignments
                    </strong>

                    <p>
                        ${assignmentsPending}
                        to evaluate
                    </p>

                </div>

            </div>


            <div class="pending-task">

                <div class="pending-task-icon marks">
                    <i class="fa-solid fa-chart-column"></i>
                </div>

                <div>

                    <strong>
                        Marks
                    </strong>

                    <p>
                        ${marksPending}
                        examinations
                    </p>

                </div>

            </div>


            <div class="pending-task">

                <div class="pending-task-icon leave">
                    <i class="fa-solid fa-envelope-open-text"></i>
                </div>

                <div>

                    <strong>
                        Leave Requests
                    </strong>

                    <p>
                        ${leaveRequests}
                        pending
                    </p>

                </div>

            </div>

        </div>

    `;

}


/*
============================================================
RECENT ACTIVITIES
============================================================
*/

function updateRecentActivities() {

    const container =
        document.getElementById(
            "recent-activities"
        );


    if (!container) {
        return;
    }


    container.innerHTML = `

        <div class="activity-list">

            <div class="activity-item">

                <div class="activity-icon">
                    <i class="fa-solid fa-right-to-bracket"></i>
                </div>

                <div>

                    <strong>
                        Teacher dashboard loaded
                    </strong>

                    <p>
                        Your academic information has been loaded successfully.
                    </p>

                </div>

            </div>


            ${
                teacherClasses.length > 0

                ?

                `
                <div class="activity-item">

                    <div class="activity-icon">
                        <i class="fa-solid fa-users"></i>
                    </div>

                    <div>

                        <strong>
                            Classes loaded
                        </strong>

                        <p>
                            ${teacherClasses.length}
                            assigned class(es) found.
                        </p>

                    </div>

                </div>
                `

                :

                ""
            }


            ${
                teacherSubjects.length > 0

                ?

                `
                <div class="activity-item">

                    <div class="activity-icon">
                        <i class="fa-solid fa-book"></i>
                    </div>

                    <div>

                        <strong>
                            Subjects loaded
                        </strong>

                        <p>
                            ${teacherSubjects.length}
                            assigned subject(s) found.
                        </p>

                    </div>

                </div>
                `

                :

                ""
            }

        </div>

    `;

}


/*
============================================================
TODAY'S CLASSES
============================================================
*/

function getTodaysClasses() {

    const result = [];


    /*
    --------------------------------------------------------
    CURRENT DAY
    --------------------------------------------------------
    */

    const today =
        new Date();


    const dayName =
        today
            .toLocaleDateString(
                "en-US",
                {
                    weekday: "long"
                }
            );


    const dayShort =
        today
            .toLocaleDateString(
                "en-US",
                {
                    weekday: "short"
                }
            );


    teacherTimetables.forEach(
        (timetable) => {

            /*
            ------------------------------------------------
            Common possible day fields
            ------------------------------------------------
            */

            const timetableDay =
                timetable.Day ||
                timetable.day ||
                timetable.WeekDay ||
                timetable.weekday ||
                timetable.DayName ||
                "";


            /*
            If timetable has a day and it doesn't
            match today, skip it.
            */

            if (
                timetableDay &&
                normalize(timetableDay) !==
                normalize(dayName) &&
                normalize(timetableDay) !==
                normalize(dayShort)
            ) {

                return;

            }


            /*
            ------------------------------------------------
            PERIODS
            ------------------------------------------------
            */

            for (
                let i = 1;
                i <= 6;
                i++
            ) {

                const periodValue =
                    timetable[
                        `Period${i}`
                    ];


                if (!periodValue) {
                    continue;
                }


                const parsed =
                    parseTimetablePeriod(
                        periodValue
                    );


                result.push({

                    className:
                        timetable.ClassName ||
                        "Class",

                    section:
                        timetable.Section ||
                        "",

                    subject:
                        parsed.subject ||
                        periodValue,

                    time:
                        parsed.time ||
                        `Period ${i}`,

                    room:
                        parsed.room ||
                        timetable.Room ||
                        "Room not assigned",

                    completed:
                        false,

                    period:
                        i

                });

            }

        }
    );


    return result;

}


/*
============================================================
PARSE TIMETABLE PERIOD
============================================================
*/

function parseTimetablePeriod(
    value
) {

    const text =
        String(value || "").trim();


    if (!text) {

        return {

            subject: "",
            time: "",
            room: ""

        };

    }


    /*
    Example possible value:

    Mathematics
    09:00 AM - 09:40 AM
    Room 8-A
    */


    const timeMatch =
        text.match(
            /(\d{1,2}:\d{2}\s*(?:AM|PM)?\s*[-–]\s*\d{1,2}:\d{2}\s*(?:AM|PM)?)/i
        );


    const roomMatch =
        text.match(
            /(Room\s*[-A-Za-z0-9 ]+)/i
        );


    let subject =
        text;


    if (timeMatch) {

        subject =
            subject.replace(
                timeMatch[0],
                ""
            );

    }


    if (roomMatch) {

        subject =
            subject.replace(
                roomMatch[0],
                ""
            );

    }


    subject =
        subject
            .replace(
                /\s+/g,
                " "
            )
            .trim();


    return {

        subject:
            subject || "Subject",

        time:
            timeMatch
                ? timeMatch[0]
                : "",

        room:
            roomMatch
                ? roomMatch[0].trim()
                : ""

    };

}


/*
============================================================
ATTENDANCE PENDING
============================================================
*/

function calculateAttendancePending() {

    /*
    Phase 1:
    We determine pending attendance from today's
    timetable.

    Detailed attendance records will be connected
    in the Attendance Module.
    */

    const todaysClasses =
        getTodaysClasses();


    if (
        todaysClasses.length === 0
    ) {

        return 0;

    }


    /*
    For now, assume today's classes are
    pending until the attendance module
    provides submission data.
    */

    return todaysClasses.length;

}


/*
============================================================
OVERALL ATTENDANCE
============================================================
*/

function calculateOverallAttendance() {

    /*
    Current student documents may not yet
    contain attendance percentage.

    Therefore we only calculate when
    attendance data exists.
    */

    const values = [];


    teacherStudents.forEach(
        (student) => {

            const attendance =
                Number(
                    student.AttendancePercentage ??
                    student.Attendance ??
                    student.AttendancePercent
                );


            if (
                Number.isFinite(attendance)
            ) {

                values.push(
                    attendance
                );

            }

        }
    );


    if (
        values.length === 0
    ) {

        return 0;

    }


    const total =
        values.reduce(
            (
                sum,
                value
            ) => sum + value,
            0
        );


    return Number(
        (
            total /
            values.length
        ).toFixed(2)
    );

}


/*
============================================================
CLASS ATTENDANCE
============================================================
*/

function calculateClassAttendance(
    students
) {

    if (
        !students ||
        students.length === 0
    ) {

        return 0;

    }


    const values = [];


    students.forEach(
        (student) => {

            const attendance =
                Number(
                    student.AttendancePercentage ??
                    student.Attendance ??
                    student.AttendancePercent
                );


            if (
                Number.isFinite(attendance)
            ) {

                values.push(
                    attendance
                );

            }

        }
    );


    if (
        values.length === 0
    ) {

        return 0;

    }


    const total =
        values.reduce(
            (
                sum,
                value
            ) => sum + value,
            0
        );


    return Number(
        (
            total /
            values.length
        ).toFixed(2)
    );

}


/*
============================================================
STUDENTS BELOW ATTENDANCE THRESHOLD
============================================================
*/

function calculateStudentsBelowThreshold() {

    const threshold =
        Number(
            attendanceSettings?.MinimumAttendance ||
            75
        );


    return teacherStudents.filter(
        (student) => {

            const attendance =
                Number(
                    student.AttendancePercentage ??
                    student.Attendance ??
                    student.AttendancePercent
                );


            return (
                Number.isFinite(attendance) &&
                attendance < threshold
            );

        }
    ).length;

}


/*
============================================================
SUBJECT NAMES
============================================================
*/

function getSubjectNames() {

    const names =
        teacherSubjects
            .map(
                subject =>
                    subject.SubjectName
            )
            .filter(Boolean);


    if (
        names.length === 0
    ) {

        return "Assigned subjects";

    }


    return names.join(" • ");

}


/*
============================================================
ATTENDANCE BUTTON
============================================================
*/

function handleAttendance(
    classData
) {

    console.log(
        "Attendance selected:",
        classData
    );


    /*
    Attendance module will be connected
    here in the next stage.
    */

    alert(
        `Attendance for ${
            classData.className ||
            "this class"
        } will be opened from the Attendance Module.`
    );

}


/*
============================================================
REFRESH DASHBOARD
============================================================
*/

async function refreshTeacherDashboard() {

    console.log(
        "Refreshing Teacher Dashboard..."
    );


    try {

        await loadTeacherInformation();

        updateTeacherDashboard();


        console.log(
            "Teacher Dashboard refreshed."
        );

    }

    catch (error) {

        console.error(
            "Refresh Error:",
            error
        );


        showDashboardError(
            error
        );

    }

}


/*
============================================================
INITIALIZE DASHBOARD BUTTONS
============================================================
*/

function initializeDashboardButtons() {

    /*
    --------------------------------------------------------
    REFRESH
    --------------------------------------------------------
    */

    const refreshButton =
        document.getElementById(
            "refresh-teacher-dashboard"
        );


    if (refreshButton) {

        refreshButton.onclick =
            async () => {

                refreshButton.disabled =
                    true;


                const oldText =
                    refreshButton.innerText;


                refreshButton.innerText =
                    "Refreshing...";


                try {

                    await refreshTeacherDashboard();

                }

                finally {

                    refreshButton.disabled =
                        false;


                    refreshButton.innerText =
                        oldText ||
                        "Refresh";

                }

            };

    }


    /*
    --------------------------------------------------------
    LOGOUT
    --------------------------------------------------------
    */

    const logoutButton =
        document.getElementById(
            "teacher-logout-button"
        );


    if (logoutButton) {

        logoutButton.onclick =
            logoutTeacher;

    }

}


/*
============================================================
LOGOUT
============================================================
*/

async function logoutTeacher() {

    try {

        await signOut(auth);


        window.location.href =
            "./login-page.html";

    }

    catch (error) {

        console.error(
            "Logout Error:",
            error
        );


        alert(
            "Unable to logout.\n\n" +
            error.message
        );

    }

}


/*
============================================================
UTILITY:
SET TEXT
============================================================
*/

function setText(
    id,
    value
) {

    const element =
        document.getElementById(id);


    if (!element) {
        return;
    }


    element.textContent =
        value ?? "";

}


/*
============================================================
UTILITY:
NORMALIZE
============================================================
*/

function normalize(
    value
) {

    return String(
        value ?? ""
    )
        .trim()
        .toLowerCase();

}


/*
============================================================
UTILITY:
ESCAPE HTML
============================================================
*/

function escapeHTML(
    value
) {

    if (
        value === null ||
        value === undefined
    ) {

        return "";

    }


    return String(value)

        .replace(
            /&/g,
            "&amp;"
        )

        .replace(
            /</g,
            "&lt;"
        )

        .replace(
            />/g,
            "&gt;"
        )

        .replace(
            /"/g,
            "&quot;"
        )

        .replace(
            /'/g,
            "&#039;"
        );

}


/*
============================================================
UTILITY:
ESCAPE ATTRIBUTE
============================================================
*/

function escapeAttribute(
    value
) {

    return escapeHTML(
        value
    );

}


/*
============================================================
DASHBOARD ERROR
============================================================
*/

function showDashboardError(
    error
) {

    console.error(
        "Dashboard Error:",
        error
    );


    const errorContainer =
        document.getElementById(
            "dashboard-error"
        );


    if (errorContainer) {

        errorContainer.textContent =
            "Unable to load teacher dashboard.";

        errorContainer.style.display =
            "block";

    }

}


/*
============================================================
GLOBAL FUNCTIONS
============================================================
*/

window.loadTeacherDashboard =
    updateTeacherDashboard;


window.refreshTeacherDashboard =
    refreshTeacherDashboard;


window.logoutTeacher =
    logoutTeacher;


/*
============================================================
INITIAL LOG
============================================================
*/

console.log(
    "Teacher Dashboard JS Loaded Successfully."
);