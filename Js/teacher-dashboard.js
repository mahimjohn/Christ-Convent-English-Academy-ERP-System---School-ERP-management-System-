/*
 * ============================================================
 * CCEA ERP - TEACHER DASHBOARD
 * PHASE 1
 * ============================================================
 *
 * CURRENT FIRESTORE COLLECTIONS USED:
 *
 * users
 * classes
 *
 * FUTURE COLLECTIONS:
 *
 * subjects
 * students
 * timetables
 * attendance
 * assignments
 * marks
 * leaveRequests
 *
 * ============================================================
 */


/* ============================================================
   FIREBASE IMPORTS
   ============================================================ */

import { auth, db } from "./firebase-config.js";

import {
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

import {
    collection,
    getDoc,
    getDocs,
    doc
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";


/* ============================================================
   GLOBAL STATE
   ============================================================ */

let currentUser = null;
let currentUserData = null;

let teacherClasses = [];

const CURRENT_ACADEMIC_SESSION = "2026–27";


/* ============================================================
   UTILITY FUNCTIONS
   ============================================================ */

function normalize(value) {

    return String(value ?? "")
        .trim()
        .toLowerCase();

}


function escapeHTML(value) {

    if (value === null || value === undefined) {
        return "";
    }

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


function getTeacherName() {

    return (
        currentUserData?.Name ||
        currentUser?.displayName ||
        "Teacher"
    );

}


function getTeacherDesignation() {

    return (
        currentUserData?.Designation ||
        currentUserData?.Role ||
        "Teacher"
    );

}


function getTeacherDepartment() {

    return (
        currentUserData?.Department ||
        "Teacher Department"
    );

}


function getAcademicSession() {

    return (
        currentUserData?.AcademicSession ||
        CURRENT_ACADEMIC_SESSION
    );

}


function getClassDisplayName(classData) {

    const className =
        classData?.ClassName || "";

    const section =
        classData?.Section || "";

    if (className && section) {

        return `Class ${className}-${section}`;

    }

    if (className) {

        return `Class ${className}`;

    }

    return "Class";

}


/* ============================================================
   AUTHENTICATION + ROLE PROTECTION
   ============================================================ */

onAuthStateChanged(auth, async (user) => {

    if (!user) {

        console.warn(
            "No authenticated user found."
        );

        window.location.href =
            "./login-page.html";

        return;
    }


    currentUser = user;


    console.log(
        "Authenticated User:",
        currentUser.email
    );


    try {

        /*
         * --------------------------------------------------------
         * LOAD USER DOCUMENT
         * --------------------------------------------------------
         */

        const userRef = doc(
            db,
            "users",
            currentUser.uid
        );


        const userSnapshot =
            await getDoc(userRef);


        if (!userSnapshot.exists()) {

            console.error(
                "User document does not exist."
            );

            await signOut(auth);

            window.location.href =
                "./login-page.html";

            return;

        }


        currentUserData =
            userSnapshot.data();


        console.log(
            "Authenticated User Data:",
            currentUserData
        );


        /*
         * --------------------------------------------------------
         * ROLE CHECK
         * --------------------------------------------------------
         */

        const role =
            String(
                currentUserData.Role || ""
            )
            .trim()
            .toLowerCase();


        console.log(
            "User Role:",
            role
        );


        /*
         * --------------------------------------------------------
         * TEACHER ONLY
         * --------------------------------------------------------
         */

        if (role !== "teacher") {

            console.warn(
                "Unauthorized access to Teacher Dashboard."
            );


            /*
             * Admin
             */

            if (role === "admin") {

                window.location.href =
                    "./dashboard.html";

                return;

            }


            /*
             * Principal
             */

            if (role === "principal") {

                window.location.href =
                    "./principal-dashboard.html";

                return;

            }


            /*
             * Finance
             */

            if (role === "finance") {

                window.location.href =
                    "./fees-dashboard.html";

                return;

            }


            /*
             * Admission
             */

            if (role === "admission") {

                window.location.href =
                    "./admission-dashboard.html";

                return;

            }


            /*
             * Unknown role
             */

            alert(
                "You are not authorized to access the Teacher Dashboard."
            );


            await signOut(auth);


            window.location.href =
                "./login-page.html";


            return;

        }


        /*
         * --------------------------------------------------------
         * USER IS ACTUALLY A TEACHER
         * --------------------------------------------------------
         */

        console.log(
            "Teacher authentication successful."
        );


        /*
         * Load teacher-specific data
         */

        await loadTeacherClasses();


        /*
         * Update dashboard

         */

        updateTeacherDashboard();


        initializeSidebar();

        initializeTopbar();

        initializeDashboardButtons();


        console.log(
            "Teacher Dashboard Loaded Successfully."
        );

    }
    catch (error) {

        console.error(
            "Teacher Dashboard Error:",
            error
        );

        showDashboardError();

    }

});


/* ============================================================
   LOAD TEACHER PROFILE
   ============================================================ */

async function loadTeacherProfile() {

    if (!currentUser) {
        return;
    }


    try {

        const userRef = doc(
            db,
            "users",
            currentUser.uid
        );


        const userSnapshot =
            await getDoc(userRef);


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
                "Teacher users document not found:",
                currentUser.uid
            );


            currentUserData = {

                Name:
                    currentUser.displayName ||
                    "Teacher",

                Email:
                    currentUser.email ||
                    "",

                Role:
                    "Teacher",

                Department:
                    "Teacher Department"

            };

        }

    }
    catch (error) {

        console.error(
            "Unable to load teacher profile:",
            error
        );


        currentUserData = {

            Name:
                currentUser.displayName ||
                "Teacher",

            Email:
                currentUser.email ||
                "",

            Role:
                "Teacher",

            Department:
                "Teacher Department"

        };

    }

}


/* ============================================================
   LOAD TEACHER CLASSES
   ============================================================ */

async function loadTeacherClasses() {

    teacherClasses = [];


    try {

        const snapshot =
            await getDocs(
                collection(
                    db,
                    "classes"
                )
            );


        const teacherName =
            normalize(
                getTeacherName()
            );


        snapshot.forEach(
            (classDoc) => {

                const classData =
                    classDoc.data();


                const classTeacher =
                    normalize(
                        classData.ClassTeacher
                    );


                /*
                 * ------------------------------------------------
                 * CURRENT DATABASE STRUCTURE
                 *
                 * classes document:
                 *
                 * ClassName
                 * Section
                 * ClassTeacher
                 * AcademicSession
                 * Status
                 * ------------------------------------------------
                 */


                if (
                    classTeacher &&
                    classTeacher === teacherName
                ) {

                    teacherClasses.push({

                        id:
                            classDoc.id,

                        ...classData

                    });

                }

            }
        );


        console.log(
            "Teacher Classes:",
            teacherClasses
        );


        /*
         * --------------------------------------------------------
         * IMPORTANT DEBUG INFORMATION
         * --------------------------------------------------------
         */

        if (
            teacherClasses.length === 0 &&
            snapshot.size > 0
        ) {

            console.warn(
                "No class is currently assigned to:",
                getTeacherName()
            );


            console.warn(
                "Check the ClassTeacher field in Firestore."
            );

        }

    }
    catch (error) {

        console.error(
            "Unable to load teacher classes:",
            error
        );

    }

}


/* ============================================================
   UPDATE ENTIRE DASHBOARD
   ============================================================ */

function updateTeacherDashboard() {

    updateTopbarProfile();

    updatePageHeader();

    updateTeacherOverview();

    updateStatistics();

    updateTodaySchedule();

    updateMyClasses();

    updateAttendanceOverview();

    updatePendingTasks();

    updateRecentActivities();

}


/* ============================================================
   TOPBAR PROFILE
   ============================================================ */

function updateTopbarProfile() {

    const teacherName =
        getTeacherName();

    const designation =
        getTeacherDesignation();


    const profile =
        document.querySelector(
            ".teacher-profile"
        );


    if (!profile) {
        return;
    }


    const nameElement =
        profile.querySelector(
            ".teacher-profile-info strong"
        );


    const roleElement =
        profile.querySelector(
            ".teacher-profile-info span"
        );


    const avatar =
        profile.querySelector(
            ".teacher-avatar"
        );


    if (nameElement) {

        nameElement.textContent =
            teacherName;

    }


    if (roleElement) {

        roleElement.textContent =
            designation;

    }


    if (avatar) {

        avatar.textContent =
            getInitials(
                teacherName
            );

    }

}


/* ============================================================
   INITIALS
   ============================================================ */

function getInitials(name) {

    const parts =
        String(name || "Teacher")
            .trim()
            .split(/\s+/)
            .filter(Boolean);


    if (parts.length === 1) {

        return parts[0]
            .substring(0, 2)
            .toUpperCase();

    }


    return (
        parts[0][0] +
        parts[parts.length - 1][0]
    ).toUpperCase();

}


/* ============================================================
   PAGE HEADER
   ============================================================ */

function updatePageHeader() {

    const pageHeader =
        document.querySelector(
            ".page-header"
        );


    if (!pageHeader) {
        return;
    }


    const heading =
        pageHeader.querySelector(
            "h1"
        );


    const session =
        pageHeader.querySelector(
            ".academic-session strong"
        );


    if (heading) {

        heading.textContent =
            `Welcome back, ${getTeacherName()}!`;

    }


    if (session) {

        session.textContent =
            getAcademicSession();

    }

}


/* ============================================================
   TEACHER OVERVIEW
   ============================================================ */

function updateTeacherOverview() {

    const overview =
        document.querySelector(
            ".teacher-overview"
        );


    if (!overview) {
        return;
    }


    const teacherName =
        overview.querySelector(
            ".overview-text h2"
        );


    const designation =
        overview.querySelector(
            ".overview-designation"
        );


    const meta =
        overview.querySelectorAll(
            ".overview-meta-item strong"
        );


    const circle =
        overview.querySelector(
            ".circle-number"
        );


    if (teacherName) {

        teacherName.textContent =
            getTeacherName();

    }


    if (designation) {

        designation.textContent =
            getTeacherDesignation() +
            " • " +
            getTeacherDepartment();

    }


    /*
     * Classes
     */

    if (meta[0]) {

        meta[0].textContent =
            teacherClasses.length;

    }


    /*
     * Subjects
     *
     * Subjects collection has not been created yet.
     */

    if (meta[1]) {

        meta[1].textContent =
            "0";

    }


    /*
     * Class Teacher
     */

    if (meta[2]) {

        if (teacherClasses.length > 0) {

            meta[2].textContent =
                getClassDisplayName(
                    teacherClasses[0]
                );

        }
        else {

            meta[2].textContent =
                "Not Assigned";

        }

    }


    /*
     * Circle
     */

    if (circle) {

        circle.textContent =
            teacherClasses.length;

    }

}


/* ============================================================
   QUICK STATISTICS
   ============================================================ */

function updateStatistics() {

    const statistics =
        document.querySelectorAll(
            ".statistics-grid .stat-card"
        );


    if (!statistics.length) {
        return;
    }


    /*
     * ----------------------------------------------------------
     * TOTAL STUDENTS
     *
     * Students collection doesn't exist yet.
     * ----------------------------------------------------------
     */

    updateStatCard(
        statistics[0],
        "0",
        "Student records not created yet"
    );


    /*
     * ----------------------------------------------------------
     * CLASSES
     * ----------------------------------------------------------
     */

    updateStatCard(
        statistics[1],
        String(
            teacherClasses.length
        ),
        teacherClasses.length === 1
            ? "1 active class"
            : `${teacherClasses.length} active classes`
    );


    /*
     * ----------------------------------------------------------
     * SUBJECTS
     * ----------------------------------------------------------
     */

    updateStatCard(
        statistics[2],
        "0",
        "Subject records not created yet"
    );


    /*
     * ----------------------------------------------------------
     * TODAY'S CLASSES
     *
     * Timetable collection doesn't exist yet.
     * ----------------------------------------------------------
     */

    updateStatCard(
        statistics[3],
        "0",
        "Timetable not configured"
    );


    /*
     * ----------------------------------------------------------
     * ATTENDANCE
     *
     * Attendance collection doesn't exist yet.
     * ----------------------------------------------------------
     */

    updateStatCard(
        statistics[4],
        "0",
        "Attendance not configured"
    );

}


/* ============================================================
   UPDATE STAT CARD
   ============================================================ */

function updateStatCard(
    card,
    value,
    subtext
) {

    if (!card) {
        return;
    }


    const valueElement =
        card.querySelector(
            ".stat-content strong"
        );


    const subtextElement =
        card.querySelector(
            ".stat-content small"
        );


    if (valueElement) {

        valueElement.textContent =
            value;

    }


    if (subtextElement) {

        subtextElement.textContent =
            subtext;

    }

}


/* ============================================================
   TODAY'S SCHEDULE
   ============================================================ */

function updateTodaySchedule() {

    const sections =
        document.querySelectorAll(
            ".dashboard-section"
        );


    let scheduleSection = null;


    sections.forEach(
        (section) => {

            const heading =
                section.querySelector(
                    ".section-heading h2"
                );


            if (
                heading &&
                normalize(
                    heading.textContent
                ) ===
                "today's schedule"
            ) {

                scheduleSection =
                    section;

            }

        }
    );


    if (!scheduleSection) {
        return;
    }


    const container =
        scheduleSection.querySelector(
            ".schedule-container"
        );


    if (!container) {
        return;
    }


    /*
     * No timetable collection exists yet.
     *
     * Therefore we MUST NOT display fake
     * timetable information.
     */

    container.innerHTML = `

        <div class="schedule-item">

            <div class="schedule-time">
                <strong>--:--</strong>
                <span>--:--</span>
            </div>


            <div class="schedule-line">
                <span></span>
            </div>


            <div class="schedule-details">

                <div class="schedule-type">
                    TODAY
                </div>

                <h3>
                    No classes scheduled
                </h3>

                <p>
                    Timetable has not been configured yet.
                </p>

            </div>


            <div class="schedule-status upcoming">

                <span class="status-dot"></span>

                Not Configured

            </div>


            <button
                class="schedule-action"
                type="button"
                disabled>

                View

            </button>

        </div>

    `;

}


/* ============================================================
   MY CLASSES
   ============================================================ */

function updateMyClasses() {

    const containers =
        document.querySelectorAll(
            ".classes-grid"
        );


    if (!containers.length) {
        return;
    }


    /*
     * Use the first classes grid on the page.
     */

    const container =
        containers[0];


    if (
        teacherClasses.length === 0
    ) {

        container.innerHTML = `

            <div class="empty-state">

                <i class="fa-solid fa-school"></i>

                <h3>
                    No classes assigned
                </h3>

                <p>
                    No class is currently assigned
                    to ${escapeHTML(
                        getTeacherName()
                    )}.
                </p>

            </div>

        `;

        return;

    }


    container.innerHTML =
        teacherClasses
            .map(
                (classData) =>
                    createClassCard(
                        classData
                    )
            )
            .join("");


    initializeClassButtons();

}


/* ============================================================
   CREATE CLASS CARD
   ============================================================ */

function createClassCard(
    classData
) {

    const className =
        getClassDisplayName(
            classData
        );


    const status =
        classData.Status ||
        "Active";


    const academicSession =
        classData.AcademicSession ||
        getAcademicSession();


    return `

        <article
            class="class-card"
            data-class-id="${escapeHTML(
                classData.id
            )}">

            <div class="class-card-top">

                <span class="class-type">

                    CLASS TEACHER

                </span>


                <span class="attendance-good">

                    --

                </span>

            </div>


            <div class="class-course">

                ${escapeHTML(
                    className
                )}

            </div>


            <h3>

                Class Teacher

            </h3>


            <p class="subject-code">

                ${escapeHTML(
                    academicSession
                )}

            </p>


            <div class="class-divider"></div>


            <div class="class-student-info">

                <div>

                    <span>
                        Students Enrolled
                    </span>

                    <strong>
                        0
                    </strong>

                </div>


                <div class="student-avatars">

                    <span>--</span>

                </div>

            </div>


            <div class="class-actions">

                <button
                    type="button"
                    data-action="attendance">

                    <span>✓</span>

                    Attendance

                </button>


                <button
                    type="button"
                    data-action="assignments">

                    <span>▤</span>

                    Assignments

                </button>


                <button
                    type="button"
                    data-action="marks">

                    <span>▥</span>

                    Marks

                </button>


                <button
                    type="button"
                    data-action="students">

                    <span>♙</span>

                    Students

                </button>

            </div>

        </article>

    `;

}


/* ============================================================
   CLASS BUTTONS
   ============================================================ */

function initializeClassButtons() {

    document
        .querySelectorAll(
            ".class-card .class-actions button"
        )
        .forEach(
            (button) => {

                button.addEventListener(
                    "click",
                    () => {

                        const action =
                            button.dataset.action;


                        const card =
                            button.closest(
                                ".class-card"
                            );


                        const classId =
                            card?.dataset.classId;


                        handleClassAction(
                            action,
                            classId
                        );

                    }
                );

            }
        );

}


/* ============================================================
   CLASS ACTION HANDLER
   ============================================================ */

function handleClassAction(
    action,
    classId
) {

    const classData =
        teacherClasses.find(
            (item) =>
                item.id === classId
        );


    const className =
        classData
            ? getClassDisplayName(
                classData
            )
            : "selected class";


    /*
     * These modules will be implemented later.
     */

    switch (action) {

        case "attendance":

            alert(
                `Attendance Management for ${className} will be available in the Attendance module.`
            );

            break;


        case "assignments":

            alert(
                `Assignments for ${className} will be available after the Assignments module is created.`
            );

            break;


        case "marks":

            alert(
                `Marks management for ${className} will be available after the Marks module is created.`
            );

            break;


        case "students":

            alert(
                `Student records for ${className} will be available after the Students collection is created.`
            );

            break;

    }

}


/* ============================================================
   ATTENDANCE OVERVIEW
   ============================================================ */

function updateAttendanceOverview() {

    const panels =
        document.querySelectorAll(
            ".dashboard-panel"
        );


    if (!panels.length) {
        return;
    }


    /*
     * First panel = Attendance Overview
     */

    const attendancePanel =
        panels[0];


    if (!attendancePanel) {
        return;
    }


    const average =
        attendancePanel.querySelector(
            ".attendance-circle strong"
        );


    if (average) {

        average.textContent =
            "N/A";

    }


    const details =
        attendancePanel.querySelectorAll(
            ".attendance-detail"
        );


    if (details[0]) {

        const value =
            details[0].querySelector(
                "span:last-child"
            );

        if (value) {

            value.textContent =
                "Not Available";

        }

    }


    if (details[1]) {

        const value =
            details[1].querySelector(
                "span:last-child"
            );

        if (value) {

            value.textContent =
                "0 classes";

        }

    }


    if (details[2]) {

        const value =
            details[2].querySelector(
                "span:last-child"
            );

        if (value) {

            value.textContent =
                "0 students";

        }

    }

}


/* ============================================================
   PENDING TASKS
   ============================================================ */

function updatePendingTasks() {

    const panels =
        document.querySelectorAll(
            ".dashboard-panel"
        );


    if (panels.length < 2) {
        return;
    }


    const panel =
        panels[1];


    const count =
        panel.querySelector(
            ".task-count"
        );


    if (count) {

        count.textContent =
            "0";

    }


    const taskList =
        panel.querySelector(
            ".task-list"
        );


    if (!taskList) {
        return;
    }


    taskList.innerHTML = `

        <div class="task-item">

            <span class="task-icon purple">
                ✓
            </span>

            <div class="task-content">

                <strong>
                    No pending tasks
                </strong>

                <span>
                    Academic work modules are not configured yet.
                </span>

            </div>

        </div>

    `;

}


/* ============================================================
   RECENT ACTIVITIES
   ============================================================ */

function updateRecentActivities() {

    const sections =
        document.querySelectorAll(
            ".dashboard-section"
        );


    let activityPanel = null;


    sections.forEach(
        (section) => {

            const heading =
                section.querySelector(
                    ".section-heading h2"
                );


            if (
                heading &&
                normalize(
                    heading.textContent
                ) ===
                "recent activities"
            ) {

                activityPanel =
                    section.querySelector(
                        ".activity-panel"
                    );

            }

        }
    );


    if (!activityPanel) {
        return;
    }


    activityPanel.innerHTML = `

        <div class="activity-item">

            <div class="activity-icon purple">
                <i class="fa-solid fa-user-check"></i>
            </div>


            <div class="activity-content">

                <strong>
                    Teacher dashboard loaded
                </strong>

                <p>
                    Your teacher profile was successfully
                    loaded from Firebase.
                </p>

                <span>
                    Just now
                </span>

            </div>

        </div>


        ${
            teacherClasses.length > 0
                ? `
                    <div class="activity-item">

                        <div class="activity-icon green">
                            <i class="fa-solid fa-school"></i>
                        </div>

                        <div class="activity-content">

                            <strong>
                                Class assignment found
                            </strong>

                            <p>
                                ${teacherClasses.length}
                                class${
                                    teacherClasses.length === 1
                                        ? ""
                                        : "es"
                                }
                                assigned to you.
                            </p>

                            <span>
                                Just now
                            </span>

                        </div>

                    </div>
                `
                : `
                    <div class="activity-item">

                        <div class="activity-icon orange">
                            <i class="fa-solid fa-circle-info"></i>
                        </div>

                        <div class="activity-content">

                            <strong>
                                No class assignment found
                            </strong>

                            <p>
                                Assign a class to this teacher
                                in the Firestore classes collection.
                            </p>

                            <span>
                                Just now
                            </span>

                        </div>

                    </div>
                `
        }

    `;

}


/* ============================================================
   SIDEBAR
   ============================================================ */

function initializeSidebar() {

    const sidebar =
        document.getElementById(
            "sidebar"
        );


    const toggle =
        document.getElementById(
            "sidebarToggle"
        );


    if (
        !sidebar ||
        !toggle
    ) {

        return;

    }


    toggle.addEventListener(
        "click",
        () => {

            sidebar.classList.toggle(
                "collapsed"
            );

        }
    );


    /*
     * Navigation active state
     */

    document
        .querySelectorAll(
            ".nav-item"
        )
        .forEach(
            (item) => {

                item.addEventListener(
                    "click",
                    (event) => {

                        event.preventDefault();


                        document
                            .querySelectorAll(
                                ".nav-item"
                            )
                            .forEach(
                                (nav) =>
                                    nav.classList.remove(
                                        "active"
                                    )
                            );


                        item.classList.add(
                            "active"
                        );

                    }
                );

            }
        );

}


/* ============================================================
   TOPBAR
   ============================================================ */

function initializeTopbar() {

    /*
     * Notification button
     */

    const notificationButton =
        document.querySelector(
            ".topbar-action .fa-bell"
        )?.closest(
            ".topbar-action"
        );


    if (notificationButton) {

        notificationButton.addEventListener(
            "click",
            () => {

                alert(
                    "Notifications module will be available soon."
                );

            }
        );

    }


    /*
     * Messages button
     */

    const messageButton =
        document.querySelector(
            ".topbar-action .fa-envelope"
        )?.closest(
            ".topbar-action"
        );


    if (messageButton) {

        messageButton.addEventListener(
            "click",
            () => {

                alert(
                    "Messages module will be available soon."
                );

            }
        );

    }


    /*
     * Profile
     */

    const profile =
        document.querySelector(
            ".teacher-profile"
        );


    if (profile) {

        profile.addEventListener(
            "click",
            () => {

                alert(
                    `Logged in as ${getTeacherName()}\n\nEmail: ${
                        currentUser?.email || "Not available"
                    }`
                );

            }
        );

    }

}


/* ============================================================
   DASHBOARD BUTTONS
   ============================================================ */

function initializeDashboardButtons() {

    /*
     * View timetable buttons
     */

    document
        .querySelectorAll(
            ".outline-button"
        )
        .forEach(
            (button) => {

                const text =
                    normalize(
                        button.textContent
                    );


                if (
                    text.includes(
                        "view timetable"
                    )
                ) {

                    button.addEventListener(
                        "click",
                        () => {

                            alert(
                                "Timetable module will be available after the timetable collection is created."
                            );

                        }
                    );

                }

            }
        );


    /*
     * Attendance management button
     */

    document
        .querySelectorAll(
            ".primary-full-button"
        )
        .forEach(
            (button) => {

                button.addEventListener(
                    "click",
                    () => {

                        alert(
                            "Attendance Management will be implemented next."
                        );

                    }
                );

            }
        );

}


/* ============================================================
   ERROR DISPLAY
   ============================================================ */

function showDashboardError() {

    const content =
        document.querySelector(
            ".content-area"
        );


    if (!content) {
        return;
    }


    const existing =
        document.getElementById(
            "dashboard-error"
        );


    if (existing) {

        existing.remove();

    }


    const error =
        document.createElement(
            "div"
        );


    error.id =
        "dashboard-error";


    error.textContent =
        "Unable to load teacher dashboard. Please refresh the page.";


    error.style.cssText = `
        margin: 20px;
        padding: 16px 20px;
        border-radius: 12px;
        background: #fff0f0;
        color: #a11;
        border: 1px solid #f0b5b5;
        font-weight: 600;
    `;


    content.prepend(
        error
    );

}


/* ============================================================
   LOGOUT
   ============================================================ */

async function logoutTeacher() {

    try {

        await signOut(auth);

        window.location.href =
            "./login-page.html";

    }
    catch (error) {

        console.error(
            "Logout failed:",
            error
        );

    }

}


/* ============================================================
   GLOBAL FUNCTIONS
   ============================================================ */

window.logoutTeacher =
    logoutTeacher;


window.refreshTeacherDashboard =
    async function () {

        await loadTeacherProfile();

        await loadTeacherClasses();

        updateTeacherDashboard();

    };


/* ============================================================
   INITIAL LOG
   ============================================================ */

console.log(
    "Teacher Dashboard JS Loaded Successfully."
);