/*
 * ============================================================
 * TEACHER DASHBOARD
 * Christ Convent English Academy ERP
 * ============================================================
 *
 * Firebase collections used:
 *
 * users
 * employees
 * students
 * classes
 * subjects
 * timetables
 * attendanceSettings
 * examinations
 *
 * ============================================================
 */


/*
 * ============================================================
 * FIREBASE IMPORTS
 * ============================================================
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
 * ============================================================
 * GLOBAL VARIABLES
 * ============================================================
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
 * ============================================================
 * CONTENT AREA
 * ============================================================
 */

const contentArea =
    document.getElementById("content-area");


/*
 * ============================================================
 * AUTHENTICATION
 * ============================================================
 */

onAuthStateChanged(auth, async (user) => {

    if (!user) {

        window.location.href =
            "./login-page.html";

        return;
    }


    currentUser = user;


    try {

        await loadTeacherInformation();

        await loadTeacherDashboard();

    }
    catch (error) {

        console.error(
            "Teacher Dashboard Error:",
            error
        );

        alert(
            "Unable to load Teacher Dashboard.\n\n" +
            error.message
        );

    }

});


/*
 * ============================================================
 * LOAD TEACHER INFORMATION
 * ============================================================
 */

async function loadTeacherInformation() {

    if (!currentUser) {
        return;
    }


    /*
     * --------------------------------------------------------
     * LOAD USER DOCUMENT
     * users/{UID}
     * --------------------------------------------------------
     */

    try {

        const userRef =
            doc(
                db,
                "users",
                currentUser.uid
            );


        const userSnapshot =
            await getDoc(userRef);


        if (userSnapshot.exists()) {

            currentUserData =
                userSnapshot.data();

        }

    }
    catch (error) {

        console.log(
            "User document could not be loaded:",
            error
        );

    }


    /*
     * --------------------------------------------------------
     * LOAD EMPLOYEE USING EMAIL
     * --------------------------------------------------------
     */

    const employeeQuery =
        query(
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

    }


    /*
     * --------------------------------------------------------
     * SECURITY CHECK
     * --------------------------------------------------------
     */

    if (
        currentUserData &&
        currentUserData.Role &&
        currentUserData.Role !== "Teacher"
    ) {

        console.warn(
            "Current account role:",
            currentUserData.Role
        );

    }


    /*
     * --------------------------------------------------------
     * LOAD TEACHER DATA
     * --------------------------------------------------------
     */

    await loadTeacherSubjects();

    await loadTeacherClasses();

    await loadTeacherStudents();

    await loadTeacherTimetable();

    await loadTeacherExaminations();

    await loadAttendanceSettings();

}


/*
 * ============================================================
 * LOAD TEACHER SUBJECTS
 * ============================================================
 */

async function loadTeacherSubjects() {

    teacherSubjects = [];


    if (!currentEmployee) {
        return;
    }


    const teacherName =
        currentEmployee.Name;


    const subjectsQuery =
        query(
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


/*
 * ============================================================
 * LOAD TEACHER CLASSES
 * ============================================================
 */

async function loadTeacherClasses() {

    teacherClasses = [];


    if (!currentEmployee) {
        return;
    }


    const teacherName =
        currentEmployee.Name;


    const classesQuery =
        query(
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
     * --------------------------------------------------------
     * ALSO FIND CLASSES FROM SUBJECT ASSIGNMENTS
     * --------------------------------------------------------
     */

    teacherSubjects.forEach((subject) => {

        const className =
            subject.ClassName;


        if (!className) {
            return;
        }


        const alreadyExists =
            teacherClasses.some(
                (classItem) =>
                    classItem.ClassName ===
                    className
            );


        if (!alreadyExists) {

            teacherClasses.push({

                ClassName: className,

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


/*
 * ============================================================
 * LOAD TEACHER STUDENTS
 * ============================================================
 */

async function loadTeacherStudents() {

    teacherStudents = [];


    if (
        !teacherClasses ||
        teacherClasses.length === 0
    ) {

        return;

    }


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
                            String(
                                classItem.ClassName ||
                                ""
                            )
                            .trim()
                            .toLowerCase();


                        const studentClass =
                            String(
                                student.Class ||
                                ""
                            )
                            .trim()
                            .toLowerCase();


                        return (
                            className ===
                            studentClass
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


/*
 * ============================================================
 * LOAD TIMETABLE
 * ============================================================
 */

async function loadTeacherTimetable() {

    teacherTimetables = [];


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


            /*
             * ------------------------------------------------
             * Current Admin timetable structure contains:
             *
             * ClassName
             * Section
             * Period1
             * Period2
             * Period3
             * Period4
             * Period5
             * Period6
             * ------------------------------------------------
             */


            const belongsToTeacherClass =
                teacherClasses.some(
                    (classItem) => {

                        const sameClass =
                            String(
                                classItem.ClassName ||
                                ""
                            )
                            .trim()
                            .toLowerCase()
                            ===
                            String(
                                timetable.ClassName ||
                                ""
                            )
                            .trim()
                            .toLowerCase();


                        const timetableSection =
                            String(
                                timetable.Section ||
                                ""
                            )
                            .trim()
                            .toLowerCase();


                        const classSection =
                            String(
                                classItem.Section ||
                                ""
                            )
                            .trim()
                            .toLowerCase();


                        /*
                         * If section isn't available,
                         * match by class only.
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


/*
 * ============================================================
 * LOAD EXAMINATIONS
 * ============================================================
 */

async function loadTeacherExaminations() {

    teacherExaminations = [];


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
                            String(
                                classItem.ClassName ||
                                ""
                            )
                            .trim()
                            .toLowerCase()
                            ===
                            String(
                                exam.ClassName ||
                                ""
                            )
                            .trim()
                            .toLowerCase()
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


/*
 * ============================================================
 * LOAD ATTENDANCE SETTINGS
 * ============================================================
 */

async function loadAttendanceSettings() {

    attendanceSettings = null;


    const snapshot =
        await getDocs(
            collection(
                db,
                "attendanceSettings"
            )
        );


    if (!snapshot.empty) {

        /*
         * Admin currently creates settings
         * using addDoc(), so there can be
         * multiple records.
         *
         * For now we use the newest returned
         * record.
         */

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


/*
 * ============================================================
 * LOAD TEACHER DASHBOARD
 * ============================================================
 */

async function loadTeacherDashboard() {

    if (!contentArea) {

        console.error(
            "content-area element not found."
        );

        return;

    }


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


    const employeeID =
        currentEmployee?.EmployeeID ||
        "Not Available";


    const totalClasses =
        teacherClasses.length;


    const totalSubjects =
        teacherSubjects.length;


    const totalStudents =
        teacherStudents.length;


    const totalExaminations =
        teacherExaminations.length;


    contentArea.innerHTML = `

        <!-- =====================================================
             WELCOME
        ====================================================== -->

        <div class="welcome-card">

            <h1>
                Welcome Back, ${escapeHTML(teacherName)}!
            </h1>

            <p>
                ${escapeHTML(designation)}
                -
                ${escapeHTML(department)}
            </p>

        </div>


        <!-- =====================================================
             TEACHER PROFILE
        ====================================================== -->

        <div class="recent-activities">

            <h2>Teacher Profile</h2>

            <div class="teacher-profile-grid">

                <div>
                    <strong>Name</strong>
                    <p>
                        ${escapeHTML(teacherName)}
                    </p>
                </div>

                <div>
                    <strong>Employee ID</strong>
                    <p>
                        ${escapeHTML(employeeID)}
                    </p>
                </div>

                <div>
                    <strong>Email</strong>
                    <p>
                        ${escapeHTML(
                            currentUser.email ||
                            "Not Available"
                        )}
                    </p>
                </div>

                <div>
                    <strong>Department</strong>
                    <p>
                        ${escapeHTML(department)}
                    </p>
                </div>

                <div>
                    <strong>Designation</strong>
                    <p>
                        ${escapeHTML(designation)}
                    </p>
                </div>

                <div>
                    <strong>Status</strong>
                    <p>
                        ${escapeHTML(
                            currentEmployee?.Status ||
                            currentUserData?.Status ||
                            "Active"
                        )}
                    </p>
                </div>

            </div>

        </div>


        <!-- =====================================================
             STATISTICS
        ====================================================== -->

        <div class="cards-container">

            <div class="card">

                <h3>
                    My Classes
                </h3>

                <h1>
                    ${totalClasses}
                </h1>

            </div>


            <div class="card">

                <h3>
                    My Subjects
                </h3>

                <h1>
                    ${totalSubjects}
                </h1>

            </div>


            <div class="card">

                <h3>
                    Students
                </h3>

                <h1>
                    ${totalStudents}
                </h1>

            </div>


            <div class="card">

                <h3>
                    Examinations
                </h3>

                <h1>
                    ${totalExaminations}
                </h1>

            </div>

        </div>


        <!-- =====================================================
             MY SUBJECTS
        ====================================================== -->

        <div class="recent-activities">

            <h2>
                My Subjects
            </h2>

            <div
                id="teacher-subjects-container"
            >

                ${renderSubjects()}

            </div>

        </div>


        <!-- =====================================================
             MY CLASSES
        ====================================================== -->

        <div class="recent-activities">

            <h2>
                My Classes
            </h2>

            <div
                id="teacher-classes-container"
            >

                ${renderClasses()}

            </div>

        </div>


        <!-- =====================================================
             TODAY'S SCHEDULE
        ====================================================== -->

        <div class="recent-activities">

            <h2>
                My Timetable
            </h2>

            <div
                id="teacher-timetable-container"
            >

                ${renderTimetable()}

            </div>

        </div>


        <!-- =====================================================
             ATTENDANCE SETTINGS
        ====================================================== -->

        <div class="recent-activities">

            <h2>
                Attendance Information
            </h2>

            ${renderAttendanceSettings()}

        </div>


        <!-- =====================================================
             EXAMINATIONS
        ====================================================== -->

        <div class="recent-activities">

            <h2>
                Upcoming / Assigned Examinations
            </h2>

            <div
                id="teacher-examinations-container"
            >

                ${renderExaminations()}

            </div>

        </div>


        <!-- =====================================================
             REFRESH
        ====================================================== -->

        <div class="quick-actions">

            <h2>
                Dashboard Actions
            </h2>

            <div class="action-buttons">

                <button
                    id="refresh-teacher-dashboard"
                >
                    Refresh Dashboard
                </button>


                <button
                    id="teacher-logout-button"
                >
                    Logout
                </button>

            </div>

        </div>

    `;


    initializeTeacherDashboardButtons();

}


/*
 * ============================================================
 * RENDER SUBJECTS
 * ============================================================
 */

function renderSubjects() {

    if (
        teacherSubjects.length === 0
    ) {

        return `
            <p>
                No subjects have been assigned to you yet.
            </p>
        `;

    }


    let html = `

        <div class="teacher-subject-list">

    `;


    teacherSubjects.forEach(
        (subject) => {

            html += `

                <div class="content-card">

                    <h3>
                        ${escapeHTML(
                            subject.SubjectName ||
                            "Unnamed Subject"
                        )}
                    </h3>

                    <p>
                        <strong>
                            Subject Code:
                        </strong>

                        ${escapeHTML(
                            subject.SubjectCode ||
                            "N/A"
                        )}
                    </p>

                    <p>
                        <strong>
                            Class:
                        </strong>

                        ${escapeHTML(
                            subject.ClassName ||
                            "N/A"
                        )}
                    </p>

                    <p>
                        <strong>
                            Status:
                        </strong>

                        ${escapeHTML(
                            subject.Status ||
                            "Active"
                        )}
                    </p>

                </div>

            `;

        }
    );


    html += `
        </div>
    `;


    return html;

}


/*
 * ============================================================
 * RENDER CLASSES
 * ============================================================
 */

function renderClasses() {

    if (
        teacherClasses.length === 0
    ) {

        return `
            <p>
                No classes have been assigned to you yet.
            </p>
        `;

    }


    let html = `

        <div class="teacher-class-list">

    `;


    teacherClasses.forEach(
        (classItem) => {

            const students =
                teacherStudents.filter(
                    (student) => {

                        return (
                            String(
                                student.Class ||
                                ""
                            )
                            .trim()
                            .toLowerCase()
                            ===
                            String(
                                classItem.ClassName ||
                                ""
                            )
                            .trim()
                            .toLowerCase()
                        );

                    }
                );


            html += `

                <div class="content-card">

                    <h3>
                        Class
                        ${escapeHTML(
                            classItem.ClassName ||
                            "N/A"
                        )}

                        ${
                            classItem.Section
                            ? "- " +
                              escapeHTML(
                                  classItem.Section
                              )
                            : ""
                        }

                    </h3>

                    <p>
                        <strong>
                            Academic Session:
                        </strong>

                        ${escapeHTML(
                            classItem.AcademicSession ||
                            "N/A"
                        )}
                    </p>

                    <p>
                        <strong>
                            Students:
                        </strong>

                        ${students.length}
                    </p>

                    <p>
                        <strong>
                            Status:
                        </strong>

                        ${escapeHTML(
                            classItem.Status ||
                            "Active"
                        )}
                    </p>

                </div>

            `;

        }
    );


    html += `
        </div>
    `;


    return html;

}


/*
 * ============================================================
 * RENDER TIMETABLE
 * ============================================================
 */

function renderTimetable() {

    if (
        teacherTimetables.length === 0
    ) {

        return `
            <p>
                No timetable has been assigned
                to your classes yet.
            </p>
        `;

    }


    let html = "";


    teacherTimetables.forEach(
        (timetable) => {

            html += `

                <div class="content-card">

                    <h3>

                        ${escapeHTML(
                            timetable.ClassName ||
                            "Class"
                        )}

                        ${
                            timetable.Section
                            ? "- " +
                              escapeHTML(
                                  timetable.Section
                              )
                            : ""
                        }

                    </h3>


                    <div class="timetable-list">

                        <p>
                            <strong>
                                Period 1:
                            </strong>

                            ${escapeHTML(
                                timetable.Period1 ||
                                "Free"
                            )}
                        </p>


                        <p>
                            <strong>
                                Period 2:
                            </strong>

                            ${escapeHTML(
                                timetable.Period2 ||
                                "Free"
                            )}
                        </p>


                        <p>
                            <strong>
                                Period 3:
                            </strong>

                            ${escapeHTML(
                                timetable.Period3 ||
                                "Free"
                            )}
                        </p>


                        <p>
                            <strong>
                                Period 4:
                            </strong>

                            ${escapeHTML(
                                timetable.Period4 ||
                                "Free"
                            )}
                        </p>


                        <p>
                            <strong>
                                Period 5:
                            </strong>

                            ${escapeHTML(
                                timetable.Period5 ||
                                "Free"
                            )}
                        </p>


                        <p>
                            <strong>
                                Period 6:
                            </strong>

                            ${escapeHTML(
                                timetable.Period6 ||
                                "Free"
                            )}
                        </p>

                    </div>

                </div>

            `;

        }
    );


    return html;

}


/*
 * ============================================================
 * RENDER ATTENDANCE SETTINGS
 * ============================================================
 */

function renderAttendanceSettings() {

    if (!attendanceSettings) {

        return `
            <p>
                Attendance settings have not
                been configured yet.
            </p>
        `;

    }


    return `

        <div class="content-card">

            <p>

                <strong>
                    Working Days:
                </strong>

                ${escapeHTML(
                    attendanceSettings.WorkingDays ||
                    "Not Set"
                )}

            </p>


            <p>

                <strong>
                    Minimum Attendance:
                </strong>

                ${escapeHTML(
                    attendanceSettings.MinimumAttendance ||
                    "Not Set"
                )}%

            </p>


            <p>

                <strong>
                    Attendance Lock Date:
                </strong>

                ${escapeHTML(
                    attendanceSettings.AttendanceLockDate ||
                    "Not Set"
                )}

            </p>

        </div>

    `;

}


/*
 * ============================================================
 * RENDER EXAMINATIONS
 * ============================================================
 */

function renderExaminations() {

    if (
        teacherExaminations.length === 0
    ) {

        return `
            <p>
                No examinations are currently
                assigned to your classes.
            </p>
        `;

    }


    let html = `

        <div class="teacher-examination-list">

    `;


    teacherExaminations.forEach(
        (exam) => {

            html += `

                <div class="content-card">

                    <h3>
                        ${escapeHTML(
                            exam.ExamName ||
                            "Examination"
                        )}
                    </h3>


                    <p>

                        <strong>
                            Type:
                        </strong>

                        ${escapeHTML(
                            exam.ExamType ||
                            "N/A"
                        )}

                    </p>


                    <p>

                        <strong>
                            Class:
                        </strong>

                        ${escapeHTML(
                            exam.ClassName ||
                            "N/A"
                        )}

                    </p>


                    <p>

                        <strong>
                            Maximum Marks:
                        </strong>

                        ${escapeHTML(
                            exam.MaximumMarks ||
                            "N/A"
                        )}

                    </p>


                    <p>

                        <strong>
                            Passing Marks:
                        </strong>

                        ${escapeHTML(
                            exam.PassingMarks ||
                            "N/A"
                        )}

                    </p>

                </div>

            `;

        }
    );


    html += `
        </div>
    `;


    return html;

}


/*
 * ============================================================
 * DASHBOARD BUTTONS
 * ============================================================
 */

function initializeTeacherDashboardButtons() {


    /*
     * --------------------------------------------------------
     * REFRESH
     * --------------------------------------------------------
     */

    const refreshButton =
        document.getElementById(
            "refresh-teacher-dashboard"
        );


    if (refreshButton) {

        refreshButton.addEventListener(
            "click",
            async () => {

                refreshButton.disabled = true;

                refreshButton.innerText =
                    "Refreshing...";


                try {

                    await loadTeacherInformation();

                    await loadTeacherDashboard();

                }
                catch (error) {

                    console.error(error);

                    alert(
                        error.message
                    );

                }


                refreshButton.disabled = false;

                refreshButton.innerText =
                    "Refresh Dashboard";

            }
        );

    }


    /*
     * --------------------------------------------------------
     * LOGOUT
     * --------------------------------------------------------
     */

    const logoutButton =
        document.getElementById(
            "teacher-logout-button"
        );


    if (logoutButton) {

        logoutButton.addEventListener(
            "click",
            logoutTeacher
        );

    }

}


/*
 * ============================================================
 * LOGOUT
 * ============================================================
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
 * ============================================================
 * HTML ESCAPE
 *
 * Prevents Firestore values from being directly
 * interpreted as HTML.
 * ============================================================
 */

function escapeHTML(value) {

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
 * ============================================================
 * GLOBAL FUNCTIONS
 * ============================================================
 */

window.loadTeacherDashboard =
    loadTeacherDashboard;


/*
 * ============================================================
 * INITIAL LOG
 * ============================================================
 */

console.log(
    "Teacher Dashboard JS Loaded Successfully."
);