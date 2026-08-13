import {

    collection,
    addDoc

} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

import{

query,
where

} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

import{

updateDoc

} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

import {

deleteDoc

} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

import{

getDocs

} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

import {

    getDoc

} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";


import {

    signOut,
    onAuthStateChanged

} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

import { auth, db } from "./firebase-config.js";

import {

createUserWithEmailAndPassword

} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";


import {

doc,
setDoc,
serverTimestamp

} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

// AUTH CHECK


onAuthStateChanged(auth,(user)=>{

    if(!user){

        window.location.href="./login-page.html";

    }

});




// CONTENT AREA


const contentArea = document.getElementById("content-area");




// FUNCTIONS


function loadDashboard() {

contentArea.innerHTML = `

<!-- Welcome Card -->

<div class="welcome-card">

<h1>Welcome Back, Mahim!</h1>

<p>Administrator - Christ Convent English Academy ERP</p>

</div>


<!-- Statistics Cards -->

<div class="cards-container">

<div class="card">

<h3>Total Students</h3>
<h1>0</h1>

</div>


<div class="card">

<h3>Total Employees</h3>
<h1>0</h1>

</div>


<div class="card">

<h3>Departments</h3>
<h1>0</h1>

</div>


<div class="card">

<h3>Active Users</h3>
<h1>0</h1>

</div>

</div>



<!-- Quick Actions -->


<div class="quick-actions">

<h2>Quick Actions</h2>

<div class="action-buttons">

<button id="add-user-btn">Add User</button>

<button id="create-class-btn">Create Class</button>

<button id="create-department-btn">Create Department</button>

<button id="school-settings-btn">School Settings</button>

</div>

</div>




<!-- Pending Approvals -->


<div class="recent-activities">

<h2>Pending Approvals</h2>

<ul>

<li>Admission Requests - 0</li>

<li>Teacher Approval Requests - 0</li>

<li>APAAR Requests - 0</li>

</ul>

</div>




<!-- Recent Activities -->


<div class="recent-activities">

<h2>Recent Activities</h2>

<ul>

<li>No recent activities found.</li>

</ul>

</div>

<!-- ERP HEALTH STATUS -->

<div class="health-status">

<h2>ERP Health Status</h2>


<div class="status-box">

<p>Firebase Authentication</p>

<span id="firebase-status">

Checking...

</span>

</div>



<div class="status-box">

<p>Firestore Database</p>

<span id="firestore-status">

Checking...

</span>

</div>



<div class="status-box">

<p>Current User</p>

<span id="user-status">

Checking...

</span>

</div>



<div class="status-box">

<p>School Profile</p>

<span id="school-status">

Checking...

</span>

</div>



<div class="status-box">

<p>ERP System</p>

<span id="erp-status">

Checking...

</span>

</div>



<div class="status-box">

<p>UDISE+ Integration</p>

<span>

Not Connected

</span>

</div>



<div class="status-box">

<p>APAAR Integration</p>

<span>

Not Connected

</span>

</div>



<div class="status-box">

<p>Backup Service</p>

<span>

Pending Configuration

</span>

</div>


</div>


`;



setTimeout(() => {

    initializeQuickActions();

    checkHealthStatus();

}, 100);

}

/**********************************************************************
 * EMPLOYEE MANAGEMENT
 **********************************************************************/


function loadEmployeeManagement() {

contentArea.innerHTML = `

<!-- PAGE HEADER -->

<div class="welcome-card">

<h1>Employee Management</h1>

<p>Manage all school employees and staff.</p>

</div>



<!-- EMPLOYEE STATISTICS -->

<div class="cards-container">

<div class="card">

<h3>Total Employees</h3>

<h1>0</h1>

</div>


<div class="card">

<h3>Active Employees</h3>

<h1>0</h1>

</div>


<div class="card">

<h3>On Leave</h3>

<h1>0</h1>

</div>


<div class="card">

<h3>Departments</h3>

<h1>0</h1>

</div>

</div>




<!-- QUICK ACTIONS -->

<div class="quick-actions">

<h2>Quick Actions</h2>

<div class="action-buttons">

<button id="add-employee-btn">

Add Employee

</button>


<button id="view-employees-btn">

View Employees

</button>


<button id="search-employee-btn">

Search Employee

</button>


<button id="generate-report-btn">

Generate Reports

</button>


<button id="assign-role-btn">

Assign Roles

</button>


<button id="leave-request-btn">

Leave Requests

</button>

</div>

</div>




<!-- EMPLOYEE DIRECTORY PREVIEW -->

<div class="recent-activities">

<h2>Employee Directory Preview</h2>

<ul>

<li>No employees found.</li>

</ul>

</div>




<!-- RECENT ACTIVITIES -->

<div class="recent-activities">

<h2>Recent Employee Activities</h2>

<ul>

<li>No recent employee activities found.</li>

</ul>

</div>




<!-- PENDING REQUESTS -->

<div class="recent-activities">

<h2>Pending Requests</h2>

<ul>

<li>Teacher Registration Requests - 0</li>

<li>Leave Requests - 0</li>

<li>Role Change Requests - 0</li>

</ul>

</div>

`;



/* INITIALIZE BUTTONS */

setTimeout(() => {

initializeEmployeeManagement();

},100);

}

function initializeEmployeeManagement(){


const addEmployee =
document.getElementById("add-employee-btn");


const viewEmployees =
document.getElementById("view-employees-btn");


const searchEmployee =
document.getElementById("search-employee-btn");


const generateReport =
document.getElementById("generate-report-btn");


const assignRole =
document.getElementById("assign-role-btn");


const leaveRequest =
document.getElementById("leave-request-btn");



if(addEmployee){

addEmployee.addEventListener("click",()=>{

openModal(

"Add Employee",

`

<div class="modal-form">

<input
type="text"
id="employee-id"
placeholder="Employee ID">


<input
type="text"
id="employee-name"
placeholder="Full Name">


<input
type="email"
id="employee-email"
placeholder="Email Address">


<input
type="text"
id="employee-phone"
placeholder="Phone Number">


<select id="employee-gender">

<option>Male</option>
<option>Female</option>
<option>Other</option>

</select>


<input
type="date"
id="employee-dob">


<input
type="text"
id="employee-address"
placeholder="Address">


<select id="employee-role">

<option>Teacher</option>
<option>Principal</option>
<option>Finance Officer</option>
<option>Admission Officer</option>
<option>Management Officer</option>
<option>Transport Officer</option>

</select>


<select id="employee-department">

<option>Teaching Department</option>
<option>Principal Office</option>
<option>Finance Department</option>
<option>Admission Department</option>
<option>Management Department</option>
<option>Transport Department</option>

</select>


<input
type="text"
id="employee-designation"
placeholder="Designation">


<input
type="date"
id="employee-joining-date">


<input
type="text"
id="employee-qualification"
placeholder="Qualification">


<input
type="number"
id="employee-salary"
placeholder="Salary">


</div>



<button
id="create-employee-button"
class="modal-submit">

Create Employee

</button>

`

);


setTimeout(()=>{

document
.getElementById("create-employee-button")
.addEventListener(
"click",
createEmployeeFunction
);

},50);


});

}

async function createEmployeeFunction(){


const employeeID =
document.getElementById("employee-id").value;


const name =
document.getElementById("employee-name").value;


const email =
document.getElementById("employee-email").value;


const phone =
document.getElementById("employee-phone").value;


const gender =
document.getElementById("employee-gender").value;


const dob =
document.getElementById("employee-dob").value;


const address =
document.getElementById("employee-address").value;


const role =
document.getElementById("employee-role").value;


const department =
document.getElementById("employee-department").value;


const designation =
document.getElementById("employee-designation").value;


const joiningDate =
document.getElementById("employee-joining-date").value;


const qualification =
document.getElementById("employee-qualification").value;


const salary =
document.getElementById("employee-salary").value;



if(

!employeeID ||
!name ||
!email ||
!phone ||
!dob ||
!address ||
!designation ||
!joiningDate ||
!qualification ||
!salary

){

alert("Please fill all fields.");

return;

}



try{


await addDoc(

collection(db,"employees"),

{

EmployeeID : employeeID,

Name : name,

Email : email,

Phone : phone,

Gender : gender,

DOB : dob,

Address : address,

Role : role,

Department : department,

Designation : designation,

JoiningDate : joiningDate,

Qualification : qualification,

Salary : salary,

Status : "Active",

CreatedAt : serverTimestamp()

}

);



alert("Employee Added Successfully.");


closeModalFunction();


loadEmployeeManagement();



}

catch(error){

console.log(error);

alert(error.message);

}


}



if(viewEmployees){

viewEmployees.addEventListener("click",()=>{

loadAllEmployees();

});

}

async function loadAllEmployees(){


try{


const querySnapshot = await getDocs(

collection(
db,
"employees"
)

);


let employeeHTML =

`

<div class="recent-activities">

<h2>Employee Directory</h2>

<table
style="width:100%; border-collapse:collapse;">

<thead>

<tr>

<th>Employee ID</th>

<th>Name</th>

<th>Role</th>

<th>Department</th>

<th>Status</th>

<th>Actions</th>

</tr>

</thead>

<tbody>

`;


if(querySnapshot.empty){

employeeHTML +=

`

<tr>

<td colspan="5">

No Employees Found.

</td>

</tr>

`;

}


querySnapshot.forEach((doc)=>{


const employee = doc.data();


employeeHTML +=

`

<tr>

<td>${employee.EmployeeID}</td>

<td>${employee.Name}</td>

<td>${employee.Role}</td>

<td>${employee.Department}</td>

<td>${employee.Status}</td>

<td>

<button
onclick="editEmployee('${doc.id}')">

Edit

</button>


<button
onclick="deleteEmployee('${doc.id}')">

Delete

</button>

</td>

</tr>

`;


});


employeeHTML +=

`

</tbody>

</table>

</div>

`;



openModal(

"View Employees",

employeeHTML

);


}

catch(error){

console.log(error);

alert(error.message);

}


}



if(searchEmployee){

searchEmployee.addEventListener("click",()=>{

openSearchEmployeeModal();

});

}

window.editEmployee = editEmployee;
window.deleteEmployee = deleteEmployee;



function openSearchEmployeeModal(){

openModal(

"Search Employee",

`

<div class="modal-form">

<input
type="text"
id="search-employee-id"
placeholder="Employee ID">


<input
type="text"
id="search-employee-name"
placeholder="Employee Name">


<select id="search-employee-role">

<option value="">All Roles</option>
<option>Teacher</option>
<option>Principal</option>
<option>Finance Officer</option>
<option>Admission Officer</option>
<option>Management Officer</option>
<option>Transport Officer</option>

</select>


<select id="search-employee-department">

<option value="">All Departments</option>
<option>Teaching Department</option>
<option>Principal Office</option>
<option>Finance Department</option>
<option>Admission Department</option>
<option>Management Department</option>
<option>Transport Department</option>

</select>

</div>


<button
id="search-employee-button"
class="modal-submit">

Search Employee

</button>


<div id="employee-search-results">

</div>

`

);



setTimeout(()=>{

document
.getElementById("search-employee-button")
.addEventListener(
"click",
searchEmployeeFunction
);

},50);


}
window.editEmployee = editEmployee;

async function searchEmployeeFunction(){


const employeeID =
document.getElementById(
"search-employee-id"
).value.toLowerCase();


const employeeName =
document.getElementById(
"search-employee-name"
).value.toLowerCase();


const role =
document.getElementById(
"search-employee-role"
).value;


const department =
document.getElementById(
"search-employee-department"
).value;



const resultsDiv =
document.getElementById(
"employee-search-results"
);



const querySnapshot = await getDocs(

collection(
db,
"employees"
)

);



let html =

`

<h3 style="margin-top:30px;">

Search Results

</h3>

<table
style="width:100%; border-collapse:collapse;">

<tr>

<th>ID</th>
<th>Name</th>
<th>Role</th>
<th>Department</th>

</tr>

`;



let found = false;



querySnapshot.forEach((doc)=>{


const employee =
doc.data();



const idMatch =

employee.EmployeeID
.toLowerCase()
.includes(employeeID);


const nameMatch =

employee.Name
.toLowerCase()
.includes(employeeName);


const roleMatch =

role === "" ||

employee.Role === role;


const departmentMatch =

department === "" ||

employee.Department === department;



if(

idMatch &&
nameMatch &&
roleMatch &&
departmentMatch

){

found = true;


html +=

`

<tr>

<td>${employee.EmployeeID}</td>

<td>${employee.Name}</td>

<td>${employee.Role}</td>

<td>${employee.Department}</td>

</tr>

`;



}


});




if(!found){

html +=

`

<tr>

<td colspan="4">

No Employees Found.

</td>

</tr>

`;

}


html += "</table>";



resultsDiv.innerHTML = html;


}

async function editEmployee(employeeDocID){

try{


const employeeRef = doc(

db,
"employees",
employeeDocID

);


const employeeSnapshot =

await getDoc(employeeRef);


const employee =

employeeSnapshot.data();



openModal(

"Edit Employee",

`

<div class="modal-form">


<input
type="text"
id="edit-name"
value="${employee.Name}">


<input
type="text"
id="edit-phone"
value="${employee.Phone}">


<input
type="text"
id="edit-designation"
value="${employee.Designation}">


<input
type="number"
id="edit-salary"
value="${employee.Salary}">


<select id="edit-status">

<option>

Active

</option>

<option>

On Leave

</option>

<option>

Suspended

</option>

<option>

Retired

</option>

</select>


</div>


<button
id="update-employee-btn"
class="modal-submit">

Update Employee

</button>

`

);



setTimeout(()=>{

document
.getElementById("update-employee-btn")
.addEventListener(
"click",
()=>{

updateEmployeeFunction(
employeeDocID
);

}

);

},50);


}

catch(error){

console.log(error);

}


}

async function updateEmployeeFunction(employeeDocID){


try{


await updateDoc(

doc(
db,
"employees",
employeeDocID
),

{

Name :

document.getElementById(
"edit-name"
).value,


Phone :

document.getElementById(
"edit-phone"
).value,


Designation :

document.getElementById(
"edit-designation"
).value,


Salary :

document.getElementById(
"edit-salary"
).value,


Status :

document.getElementById(
"edit-status"
).value

}

);


alert(
"Employee Updated Successfully."
);


closeModalFunction();


loadEmployeeManagement();



}

catch(error){

console.log(error);

alert(error.message);

}


}

async function deleteEmployee(employeeDocID){

const confirmDelete = confirm(

"Are you sure you want to delete this employee?"

);


if(!confirmDelete){

return;

}



try{


await deleteDoc(

doc(

db,
"employees",
employeeDocID

)

);



alert(

"Employee Deleted Successfully."

);


loadAllEmployees();



}

catch(error){

console.log(error);

alert(error.message);

}


}





if(generateReport){

generateReport.addEventListener("click",()=>{

openEmployeeReportModal();

});

}

function openEmployeeReportModal(){

openModal(

"Generate Employee Reports",

`

<div class="modal-form">

<h3>Select Report Type</h3>

<select id="report-type">

<option>Total Employees</option>

<option>Department Report</option>

<option>Role Report</option>

<option>Salary Report</option>

<option>Joining Report</option>

<option>Leave Report</option>

</select>


<h3>Select File Format</h3>

<select id="report-format">

<option>PDF</option>

<option>Excel</option>

<option>Print</option>

</select>


</div>


<button
id="generate-employee-report-btn"
class="modal-submit">

Generate Report

</button>

`

);


setTimeout(()=>{

document
.getElementById("generate-employee-report-btn")
.addEventListener(
"click",
generateEmployeeReport
);

},50);


}

async function generateEmployeeReport(){


const reportType =

document.getElementById(
"report-type"
).value;


const reportFormat =

document.getElementById(
"report-format"
).value;



const querySnapshot = await getDocs(

collection(
db,
"employees"
)

);


const employees = [];


querySnapshot.forEach((doc)=>{

employees.push(doc.data());

});



let reportText = "";



if(reportType === "Total Employees"){


reportText +=

"TOTAL EMPLOYEES REPORT\n\n";


reportText +=

`Total Employees : ${employees.length}`;


}




if(reportType === "Department Report"){


const departments = {};


employees.forEach((employee)=>{


const department = employee.Department;


if(!departments[department]){

departments[department] = 0;

}


departments[department]++;


});


reportText +=

"DEPARTMENT REPORT\n\n";


for(const department in departments){

reportText +=

`${department} : ${departments[department]}\n`;

}


}




if(reportType === "Role Report"){


const roles = {};


employees.forEach((employee)=>{


const role = employee.Role;


if(!roles[role]){

roles[role] = 0;

}


roles[role]++;


});


reportText +=

"ROLE REPORT\n\n";


for(const role in roles){

reportText +=

`${role} : ${roles[role]}\n`;

}


}




if(reportType === "Salary Report"){


let totalSalary = 0;


employees.forEach((employee)=>{

totalSalary += Number(employee.Salary);

});


reportText +=

"SALARY REPORT\n\n";


reportText +=

`Monthly Salary Liability : ₹${totalSalary}`;


}




if(reportType === "Joining Report"){


reportText +=

"JOINING REPORT\n\n";


employees.forEach((employee)=>{

reportText +=

`${employee.Name} - ${employee.JoiningDate}\n`;

});


}




if(reportType === "Leave Report"){


let leaveCount = 0;


employees.forEach((employee)=>{


if(employee.Status === "On Leave"){

leaveCount++;

}


});


reportText +=

"LEAVE REPORT\n\n";


reportText +=

`Employees On Leave : ${leaveCount}`;


}




// PDF OPTION


if(reportFormat === "PDF"){

downloadTextFile(

reportText,

"EmployeeReport.pdf"

);

}



// EXCEL OPTION


if(reportFormat === "Excel"){

downloadTextFile(

reportText,

"EmployeeReport.xls"

);

}



// PRINT OPTION


if(reportFormat === "Print"){

const printWindow =

window.open("");


printWindow.document.write(

`<pre>${reportText}</pre>`

);


printWindow.print();

}


}



if(assignRole){

assignRole.addEventListener("click",()=>{

openAssignRoleModal();

});

}

function openAssignRoleModal(){

openModal(

"Assign Employee Roles",

`

<div class="modal-form">

<input
type="text"
id="role-employee-id"
placeholder="Employee ID">


<select id="new-role">

<option>Teacher</option>

<option>Principal</option>

<option>Finance Officer</option>

<option>Admission Officer</option>

<option>Management Officer</option>

<option>Transport Officer</option>

<option>Admin</option>

</select>

</div>


<button
id="assign-role-button"
class="modal-submit">

Assign Role

</button>

`

);



setTimeout(()=>{

document
.getElementById("assign-role-button")
.addEventListener(
"click",
assignEmployeeRole
);

},50);


}

async function assignEmployeeRole(){


const employeeID =

document.getElementById(
"role-employee-id"
).value;


const newRole =

document.getElementById(
"new-role"
).value;



const querySnapshot = await getDocs(

collection(
db,
"employees"
)

);


let found = false;


for(const employeeDoc of querySnapshot.docs){


const employee = employeeDoc.data();


if(employee.EmployeeID === employeeID){


await updateDoc(

doc(
db,
"employees",
employeeDoc.id
),

{

Role : newRole

}

);


found = true;

break;


}


}



if(found){

alert(

"Employee Role Updated Successfully."

);

closeModalFunction();

}

else{

alert(

"Employee Not Found."

);

}


}



if(leaveRequest){

leaveRequest.addEventListener("click",()=>{

openLeaveRequests();

});

}

function openLeaveRequests(){

openModal(

"Employee Leave Requests",

`

<div class="modal-form">

<button
id="view-pending-leaves"
class="modal-submit">

View Pending Requests

</button>


<button
id="view-approved-leaves"
class="modal-submit">

Approved Requests

</button>


<button
id="view-rejected-leaves"
class="modal-submit">

Rejected Requests

</button>


</div>


<div id="leave-request-results">

</div>

`

);



setTimeout(()=>{

document
.getElementById("view-pending-leaves")
.addEventListener(
"click",
loadPendingLeaves
);


document
.getElementById("view-approved-leaves")
.addEventListener(
"click",
loadApprovedLeaves
);


document
.getElementById("view-rejected-leaves")
.addEventListener(
"click",
loadRejectedLeaves
);


},50);


}

async function loadPendingLeaves(){

loadLeaveRequests("Pending");

}


async function loadApprovedLeaves(){

loadLeaveRequests("Approved");

}


async function loadRejectedLeaves(){

loadLeaveRequests("Rejected");

}

async function loadLeaveRequests(status){


const resultsDiv =

document.getElementById(
"leave-request-results"
);


const q = query(

collection(
db,
"employeeLeaveRequests"
),

where(
"Status",
"==",
status
)

);


const querySnapshot =

await getDocs(q);


let html =

`

<h3>${status} Leave Requests</h3>

<table style="width:100%;">

<tr>

<th>Name</th>
<th>Employee ID</th>
<th>Leave Type</th>
<th>Days</th>
<th>Action</th>

</tr>

`;


if(querySnapshot.empty){

html +=

`

<tr>

<td colspan="5">

No Leave Requests Found.

</td>

</tr>

`;

}


querySnapshot.forEach((leaveDoc)=>{


const leave = leaveDoc.data();


html +=

`

<tr>

<td>${leave.Name}</td>

<td>${leave.EmployeeID}</td>

<td>${leave.LeaveType}</td>

<td>${leave.NumberOfDays}</td>

<td>

<button
onclick="approveLeave('${leaveDoc.id}')">

Approve

</button>

<button
onclick="rejectLeave('${leaveDoc.id}')">

Reject

</button>

</td>

</tr>

`;


});


html += "</table>";


resultsDiv.innerHTML = html;


}

window.approveLeave = approveLeave;
window.rejectLeave = rejectLeave;

async function approveLeave(documentID){


await updateDoc(

doc(
db,
"employeeLeaveRequests",
documentID
),

{

Status : "Approved"

}

);


alert("Leave Approved Successfully.");

loadPendingLeaves();


}

async function rejectLeave(documentID){


await updateDoc(

doc(
db,
"employeeLeaveRequests",
documentID
),

{

Status : "Rejected"

}

);


alert("Leave Rejected Successfully.");

loadPendingLeaves();


}


}

/**********************************************************************
 * STUDENT MANAGEMENT
 **********************************************************************/


function loadStudentManagement() {

contentArea.innerHTML = `

<!-- PAGE HEADER -->

<div class="welcome-card">

<h1>Student Management</h1>

<p>Manage all student records and academic details.</p>

</div>



<!-- STUDENT STATISTICS -->

<div class="cards-container">

<div class="card">

<h3>Total Students</h3>

<h1 id="total-students">0</h1>

</div>


<div class="card">

<h3>Boys</h3>

<h1 id="boys-count">0</h1>

</div>


<div class="card">

<h3>Girls</h3>

<h1 id="girls-count">0</h1>

</div>


<div class="card">

<h3>Classes</h3>

<h1 id="class-count">0</h1>

</div>

</div>




<!-- QUICK ACTIONS -->

<div class="quick-actions">

<h2>Quick Actions</h2>

<div class="action-buttons">

<button id="add-student-btn">

Add Student

</button>


<button id="view-students-btn">

View Students

</button>


<button id="search-student-btn">

Search Student

</button>


<button id="generate-student-report-btn">

Generate Reports

</button>


<button id="promote-students-btn">

Promote Students

</button>


<button id="generate-id-card-btn">

Generate ID Cards

</button>

</div>

</div>




<!-- STUDENT DIRECTORY PREVIEW -->

<div class="recent-activities">

<h2>Student Directory Preview</h2>

<ul>

<li>No students found.</li>

</ul>

</div>




<!-- RECENT ACTIVITIES -->

<div class="recent-activities">

<h2>Recent Student Activities</h2>

<ul>

<li>No recent student activities found.</li>

</ul>

</div>




<!-- PENDING REQUESTS -->

<div class="recent-activities">

<h2>Pending Requests</h2>

<ul>

<li>Transfer Certificate Requests - 0</li>

<li>Admission Requests - 0</li>

<li>Promotion Requests - 0</li>

</ul>

</div>


`;



setTimeout(() => {

initializeStudentManagement();
loadStudentStatistics();

},100);


}

function initializeStudentManagement(){


const addStudent =
document.getElementById("add-student-btn");


const viewStudents =
document.getElementById("view-students-btn");


const searchStudent =
document.getElementById("search-student-btn");


const generateReports =
document.getElementById("generate-student-report-btn");


const promoteStudents =
document.getElementById("promote-students-btn");


const generateIDCards =
document.getElementById("generate-id-card-btn");



//--------------------------------------------------
// ADD STUDENT
//--------------------------------------------------


if(addStudent){

addStudent.addEventListener("click",()=>{

openModal(

"Add Student",

`

<div class="modal-form">


<input type="text"
id="student-id"
placeholder="Student ID">


<input type="text"
id="admission-number"
placeholder="Admission Number">


<input type="text"
id="student-name"
placeholder="Full Name">


<input type="text"
id="father-name"
placeholder="Father's Name">


<input type="text"
id="mother-name"
placeholder="Mother's Name">


<select id="student-gender">

<option>Male</option>
<option>Female</option>
<option>Other</option>

</select>


<input type="date"
id="student-dob">


<input type="text"
id="student-phone"
placeholder="Mobile Number">


<input type="email"
id="student-email"
placeholder="Email Address">


<input type="text"
id="student-address"
placeholder="Address">


<input type="text"
id="student-class"
placeholder="Class">


<input type="text"
id="student-section"
placeholder="Section">


<input type="number"
id="student-roll-number"
placeholder="Roll Number">


<input type="date"
id="admission-date">


<input type="text"
id="academic-session"
placeholder="Academic Session">


<select id="transport-required">

<option>Yes</option>
<option>No</option>

</select>


<input type="text"
id="transport-route"
placeholder="Transport Route">


</div>


<button
id="create-student-button"
class="modal-submit">

Create Student

</button>

`

);


setTimeout(()=>{

document
.getElementById("create-student-button")
.addEventListener(
"click",
createStudentFunction
);

},50);


});

}




//--------------------------------------------------
// VIEW STUDENTS
//--------------------------------------------------


if(viewStudents){

viewStudents.addEventListener("click",()=>{

loadAllStudents();

});

}




//--------------------------------------------------
// SEARCH STUDENTS
//--------------------------------------------------


if(searchStudent){

searchStudent.addEventListener("click",()=>{

openSearchStudentModal();

});

}




//--------------------------------------------------
// REPORTS
//--------------------------------------------------


if(generateReports){

generateReports.addEventListener("click",()=>{

openStudentReportModal();

});

}

function openStudentReportModal(){


openModal(

"Generate Student Reports",

`

<div class="modal-form">

<select id="student-report-type">

<option>Total Students</option>

<option>Class Wise Report</option>

<option>Boys Report</option>

<option>Girls Report</option>

<option>Transport Report</option>

</select>


<button
id="student-report-button"
class="modal-submit">

Generate Report

</button>

</div>

`

);


setTimeout(()=>{

document
.getElementById("student-report-button")
.addEventListener(
"click",
generateStudentReport
);

},50);


}

async function generateStudentReport(){


const reportType =

document.getElementById(
"student-report-type"
).value;


const querySnapshot =

await getDocs(

collection(
db,
"students"
)

);


const students = [];


querySnapshot.forEach((doc)=>{

students.push(doc.data());

});


let report = "";


if(reportType==="Total Students"){

report +=

`Total Students : ${students.length}`;

}


if(reportType==="Boys Report"){


let count = 0;


students.forEach((student)=>{

if(student.Gender==="Male"){

count++;

}

});


report +=

`Total Boys : ${count}`;


}


if(reportType==="Girls Report"){


let count = 0;


students.forEach((student)=>{

if(student.Gender==="Female"){

count++;

}

});


report +=

`Total Girls : ${count}`;


}


if(reportType==="Transport Report"){


let count = 0;


students.forEach((student)=>{

if(student.TransportRequired==="Yes"){

count++;

}

});


report +=

`Transport Students : ${count}`;


}


if(reportType==="Class Wise Report"){


const classes = {};


students.forEach((student)=>{

if(!classes[student.Class]){

classes[student.Class] = 0;

}

classes[student.Class]++;

});


for(const className in classes){

report +=

`${className} : ${classes[className]}\n`;

}


}


alert(report);


}




//--------------------------------------------------
// PROMOTE STUDENTS
//--------------------------------------------------


if(promoteStudents){

promoteStudents.addEventListener("click",()=>{

openPromoteStudentsModal();

});

}

function openPromoteStudentsModal(){

openModal(

"Promote Students",

`

<div class="modal-form">

<input
type="text"
id="promote-class"
placeholder="Current Class">


<input
type="text"
id="next-class"
placeholder="Promote To">


<button
id="promote-students-button"
class="modal-submit">

Promote Students

</button>

</div>

`

);


setTimeout(()=>{

document
.getElementById("promote-students-button")
.addEventListener(
"click",
promoteStudentsFunction
);

},50);

}

async function promoteStudentsFunction(){


const currentClass =
document.getElementById("promote-class").value;

const nextClass =
document.getElementById("next-class").value;

const confirmation = confirm(
`Promote all students from ${currentClass} to ${nextClass}?`
);

if(!confirmation){

return;

}


const querySnapshot =

await getDocs(
collection(db,"students")
);


let count = 0;


for(const studentDoc of querySnapshot.docs){


const student = studentDoc.data();


if(student.Class === currentClass){

await updateDoc(

doc(
db,
"students",
studentDoc.id
),

{

Class : nextClass

}

);


count++;

}


}


alert(

`${count} Students Promoted Successfully.`

);

closeModalFunction();


}




//--------------------------------------------------
// ID CARDS
//--------------------------------------------------


if(generateIDCards){

generateIDCards.addEventListener("click",()=>{

openIDCardModal();

});

}


}

function openIDCardModal(){


openModal(

"Generate Student ID Card",

`

<div class="modal-form">

<input
type="text"
id="id-card-student-id"
placeholder="Student ID">


<button
id="generate-id-card-button"
class="modal-submit">

Generate ID Card

</button>

</div>

`

);


setTimeout(()=>{

document
.getElementById("generate-id-card-button")
.addEventListener(
"click",
generateStudentIDCard
);

},50);


}

async function generateStudentIDCard(){


const studentID =

document.getElementById(
"id-card-student-id"
).value;


const querySnapshot =

await getDocs(

collection(
db,
"students"
)

);


let found = false;


querySnapshot.forEach((studentDoc)=>{


const student = studentDoc.data();


if(student.StudentID===studentID){


found = true;


openModal(

"Student ID Card",

`

<div class="recent-activities">

<h2>${student.Name}</h2>

<p>
Student ID :
${student.StudentID}
</p>

<p>
Class :
${student.Class}
</p>

<p>
Section :
${student.Section}
</p>

<p>
Roll Number :
${student.RollNumber}
</p>

<p>
Status :
${student.Status}
</p>

</div>

`

);


}


});


if(!found){

alert("Student Not Found.");

}


}

async function createStudentFunction(){


const studentID =
document.getElementById("student-id").value;

const admissionNumber =
document.getElementById("admission-number").value;

const studentName =
document.getElementById("student-name").value;

const fatherName =
document.getElementById("father-name").value;

const motherName =
document.getElementById("mother-name").value;

const gender =
document.getElementById("student-gender").value;

const dob =
document.getElementById("student-dob").value;

const phone =
document.getElementById("student-phone").value;

const email =
document.getElementById("student-email").value;

const address =
document.getElementById("student-address").value;

const studentClass =
document.getElementById("student-class").value;

const section =
document.getElementById("student-section").value;

const rollNumber =
document.getElementById("student-roll-number").value;

const admissionDate =
document.getElementById("admission-date").value;

const academicSession =
document.getElementById("academic-session").value;

const transportRequired =
document.getElementById("transport-required").value;

const transportRoute =
document.getElementById("transport-route").value;



if(

!studentID ||
!admissionNumber ||
!studentName ||
!fatherName ||
!motherName ||
!dob ||
!phone ||
!email ||
!address ||
!studentClass ||
!section ||
!rollNumber ||
!admissionDate ||
!academicSession

){

alert("Please fill all fields.");
return;

}



try{


await addDoc(

collection(db,"students"),

{

StudentID : studentID,
AdmissionNumber : admissionNumber,
Name : studentName,
FatherName : fatherName,
MotherName : motherName,
Gender : gender,
DOB : dob,
Phone : phone,
Email : email,
Address : address,
Class : studentClass,
Section : section,
RollNumber : rollNumber,
AdmissionDate : admissionDate,
AcademicSession : academicSession,
TransportRequired : transportRequired,
TransportRoute : transportRoute,
Status : "Active",
CreatedAt : serverTimestamp()

}

);


alert("Student Added Successfully.");

closeModalFunction();

loadStudentManagement();


}


catch(error){

console.log(error);
alert(error.message);

}


}

async function loadAllStudents(){


const querySnapshot = await getDocs(

collection(db,"students")

);


let html =

`

<div class="recent-activities">

<h2>Student Directory</h2>

<table style="width:100%;">

<tr>

<th>ID</th>
<th>Name</th>
<th>Class</th>
<th>Section</th>
<th>Status</th>
<th>Actions</th>

</tr>

`;


if(querySnapshot.empty){

html +=

`

<tr>

<td colspan="6">

No Students Found.

</td>

</tr>

`;

}


querySnapshot.forEach((studentDoc)=>{


const student = studentDoc.data();


html +=

`

<tr>

<td>${student.StudentID}</td>

<td>${student.Name}</td>

<td>${student.Class}</td>

<td>${student.Section}</td>

<td>${student.Status}</td>

<td>

<button
onclick="editStudent('${studentDoc.id}')">

Edit

</button>


<button
onclick="deleteStudent('${studentDoc.id}')">

Delete

</button>

<button
onclick="generateTC('${studentDoc.id}')">

TC

</button>


</td>

</tr>

`;


});


html += "</table></div>";


openModal(

"View Students",
html

);


}


window.editStudent = editStudent;
window.deleteStudent = deleteStudent;
window.generateTC = generateTC;

async function generateTC(studentDocID){


const studentRef =

doc(
db,
"students",
studentDocID
);


const studentSnapshot =

await getDoc(studentRef);


const student =

studentSnapshot.data();


openModal(

"Transfer Certificate",

`

<div class="recent-activities">

<h2>

TRANSFER CERTIFICATE

</h2>


<p>

Name :
${student.Name}

</p>


<p>

Father's Name :
${student.FatherName}

</p>


<p>

Class :
${student.Class}

</p>


<p>

Admission Number :
${student.AdmissionNumber}

</p>


<p>

Status :
TRANSFERRED

</p>


</div>

`

);


}

function openSearchStudentModal(){


openModal(

"Search Student",

`

<div class="modal-form">

<input
type="text"
id="search-student-id"
placeholder="Student ID">


<input
type="text"
id="search-student-name"
placeholder="Student Name">


<button
id="search-student-button"
class="modal-submit">

Search Student

</button>

</div>


<div id="student-results">

</div>

`

);


setTimeout(()=>{

document
.getElementById("search-student-button")
.addEventListener(
"click",
searchStudentFunction
);

},50);


}

async function searchStudentFunction(){


const studentID =

document
.getElementById(
"search-student-id"
)
.value
.toLowerCase();


const studentName =

document
.getElementById(
"search-student-name"
)
.value
.toLowerCase();



const querySnapshot =

await getDocs(

collection(
db,
"students"
)

);


let html = "<h3>Results</h3><br>";

let found = false;


querySnapshot.forEach((studentDoc)=>{


const student = studentDoc.data();


const idMatch =

student.StudentID
.toLowerCase()
.includes(studentID);


const nameMatch =

student.Name
.toLowerCase()
.includes(studentName);



if(idMatch && nameMatch){

found = true;

html +=

`

<p>

${student.StudentID}
-
${student.Name}
-
${student.Class}

</p>

`;

}


});


if(!found){

html += "No Students Found.";

}


document
.getElementById(
"student-results"
).innerHTML = html;


}

async function editStudent(studentDocID){


const studentRef =

doc(
db,
"students",
studentDocID
);


const studentSnapshot =

await getDoc(studentRef);


const student =

studentSnapshot.data();


openModal(

"Edit Student",

`

<div class="modal-form">


<input
type="text"
id="edit-student-name"
value="${student.Name}">


<input
type="text"
id="edit-student-class"
value="${student.Class}">


<input
type="text"
id="edit-student-section"
value="${student.Section}">


</div>


<button
id="update-student-btn"
class="modal-submit">

Update Student

</button>

`

);



setTimeout(()=>{

document
.getElementById("update-student-btn")
.addEventListener(

"click",

()=>{

updateStudentFunction(
studentDocID
);

}

);

},50);


}

async function updateStudentFunction(studentDocID){


await updateDoc(

doc(
db,
"students",
studentDocID
),

{

Name :

document
.getElementById(
"edit-student-name"
).value,


Class :

document
.getElementById(
"edit-student-class"
).value,


Section :

document
.getElementById(
"edit-student-section"
).value


}


);


alert("Student Updated Successfully.");

closeModalFunction();

loadStudentManagement();


}

async function deleteStudent(studentDocID){


const confirmDelete =

confirm(
"Delete Student ?"
);


if(!confirmDelete){

return;

}


await deleteDoc(

doc(
db,
"students",
studentDocID
)

);


alert(
"Student Deleted Successfully."
);


loadAllStudents();


}

async function loadStudentStatistics(){


const querySnapshot =

await getDocs(

collection(
db,
"students"
)

);


let total = 0;
let boys = 0;
let girls = 0;

const classes = {};


querySnapshot.forEach((doc)=>{


const student = doc.data();


total++;


if(student.Gender==="Male"){

boys++;

}


if(student.Gender==="Female"){

girls++;

}


classes[student.Class] = true;


});


document.getElementById(
"total-students"
).innerText = total;


document.getElementById(
"boys-count"
).innerText = boys;


document.getElementById(
"girls-count"
).innerText = girls;


document.getElementById(
"class-count"
).innerText =

Object.keys(classes).length;


}

/**********************************************************************
 * ACADEMIC MANAGEMENT
 **********************************************************************/

function loadAcademicManagement() {

contentArea.innerHTML = `

<!-- PAGE HEADER -->

<div class="welcome-card">

<h1>Academic Management</h1>

<p>Manage classes, subjects, examinations and academic settings.</p>

</div>



<!-- ACADEMIC STATISTICS -->

<div class="cards-container">

<div class="card">
<h3>Total Classes</h3>
<h1 id="total-classes">0</h1>
</div>

<div class="card">
<h3>Sections</h3>
<h1 id="total-sections">0</h1>
</div>

<div class="card">
<h3>Subjects</h3>
<h1 id="total-subjects">0</h1>
</div>

<div class="card">
<h3>Examinations</h3>
<h1 id="total-exams">0</h1>
</div>
</div>




<!-- QUICK ACTIONS -->

<div class="quick-actions">

<h2>Quick Actions</h2>

<div class="action-buttons">

<button id="create-class-btn">

Create Class

</button>


<button id="add-subject-btn">

Add Subject

</button>


<button id="create-timetable-btn">

Create Timetable

</button>


<button id="attendance-settings-btn">

Attendance Settings

</button>


<button id="exam-settings-btn">

Exam Settings

</button>


<button id="academic-report-btn">

Generate Reports

</button>

</div>

</div>




<!-- CLASS OVERVIEW -->


<div class="recent-activities">

<h2>Class Overview</h2>

<ul>

<li>No classes have been created.</li>

</ul>

</div>




<!-- RECENT ACTIVITIES -->


<div class="recent-activities">

<h2>Recent Academic Activities</h2>

<ul>

<li>No recent academic activities found.</li>

</ul>

</div>




<!-- PENDING REQUESTS -->


<div class="recent-activities">

<h2>Pending Requests</h2>

<ul>

<li>Timetable Change Requests - 0</li>

<li>Examination Requests - 0</li>

<li>Attendance Requests - 0</li>

</ul>

</div>

`;


setTimeout(() => {

initializeAcademicManagement();
loadAcademicStatistics();

},100);


}

function initializeAcademicManagement(){



const createClass =
document.getElementById("create-class-btn");


const addSubject =
document.getElementById("add-subject-btn");


const createTimetable =
document.getElementById("create-timetable-btn");


const attendanceSettings =
document.getElementById("attendance-settings-btn");


const examSettings =
document.getElementById("exam-settings-btn");


const generateReports =
document.getElementById("academic-report-btn");




if(createClass){

createClass.addEventListener("click",()=>{

openCreateClassModal();

});

}




if(addSubject){

addSubject.addEventListener("click",()=>{

openAddSubjectModal();

});

}




if(createTimetable){

createTimetable.addEventListener("click",()=>{

openCreateTimetableModal();

});

}




if(attendanceSettings){

attendanceSettings.addEventListener("click",()=>{

openAttendanceSettingsModal();

});

}




if(examSettings){

examSettings.addEventListener("click",()=>{

openExaminationSettingsModal();

});

}




if(generateReports){

generateReports.addEventListener("click",()=>{

openAcademicReportsModal();

});

}



}

function openCreateClassModal(){

openModal(

"Create Class",

`

<div class="modal-form">

<input
type="text"
id="class-name"
placeholder="Class Name">


<input
type="text"
id="section-name"
placeholder="Section">


<input
type="text"
id="class-teacher"
placeholder="Class Teacher">


<input
type="text"
id="academic-session"
placeholder="Academic Session">


<select id="class-status">

<option>Active</option>
<option>Inactive</option>

</select>

</div>


<button
id="create-class-button"
class="modal-submit">

Create Class

</button>

`

);


setTimeout(()=>{

document
.getElementById("create-class-button")
.addEventListener(
"click",
createAcademicClassFunction
);

},50);


}

function openAddSubjectModal(){


openModal(

"Add Subject",

`

<div class="modal-form">


<input
type="text"
id="subject-name"
placeholder="Subject Name">


<input
type="text"
id="subject-code"
placeholder="Subject Code">


<input
type="text"
id="subject-class"
placeholder="Class">


<input
type="text"
id="subject-teacher"
placeholder="Subject Teacher">


<select id="subject-status">

<option>Active</option>
<option>Inactive</option>

</select>

</div>


<button
id="create-subject-button"
class="modal-submit">

Add Subject

</button>

`

);


setTimeout(()=>{

document
.getElementById("create-subject-button")
.addEventListener(
"click",
createSubjectFunction
);

},50);


}

async function createSubjectFunction(){


const subjectName =
document.getElementById("subject-name").value;


const subjectCode =
document.getElementById("subject-code").value;


const subjectClass =
document.getElementById("subject-class").value;


const teacherName =
document.getElementById("subject-teacher").value;


const status =
document.getElementById("subject-status").value;



if(

!subjectName ||
!subjectCode ||
!subjectClass ||
!teacherName

){

alert("Please fill all fields.");

return;

}



try{


await addDoc(

collection(db,"subjects"),

{

SubjectName : subjectName,
SubjectCode : subjectCode,
ClassName : subjectClass,
TeacherName : teacherName,
Status : status,
CreatedAt : serverTimestamp()

}

);


alert("Subject Added Successfully.");


closeModalFunction();

loadAcademicManagement();


}


catch(error){

alert(error.message);

}


}

async function loadAcademicStatistics(){


let totalClasses = 0;
let totalSections = 0;
let totalSubjects = 0;
let totalExams = 0;


const sectionSet = {};


const classSnapshot =

await getDocs(
collection(db,"classes")
);


classSnapshot.forEach((doc)=>{

const academicClass = doc.data();

totalClasses++;

sectionSet[
academicClass.Section
] = true;

});


const subjectSnapshot =

await getDocs(
collection(db,"subjects")
);


subjectSnapshot.forEach(()=>{

totalSubjects++;

});


document
.getElementById("total-classes")
.innerText = totalClasses;


document
.getElementById("total-sections")
.innerText =

Object.keys(sectionSet).length;


document
.getElementById("total-subjects")
.innerText = totalSubjects;


document
.getElementById("total-exams")
.innerText = totalExams;


}

function openCreateTimetableModal(){

openModal(

"Create Timetable",

`

<div class="modal-form">

<input type="text" id="timetable-class" placeholder="Class">

<input type="text" id="timetable-section" placeholder="Section">

<input type="text" id="period-1" placeholder="Period 1">

<input type="text" id="period-2" placeholder="Period 2">

<input type="text" id="period-3" placeholder="Period 3">

<input type="text" id="period-4" placeholder="Period 4">

<input type="text" id="period-5" placeholder="Period 5">

<input type="text" id="period-6" placeholder="Period 6">

</div>

<button
id="create-timetable-button"
class="modal-submit">

Create Timetable

</button>

`

);


setTimeout(()=>{

document
.getElementById("create-timetable-button")
.addEventListener(
"click",
createTimetableFunction
);

},50);


}

async function createTimetableFunction(){


try{


await addDoc(

collection(db,"timetables"),

{

ClassName :
document.getElementById("timetable-class").value,

Section :
document.getElementById("timetable-section").value,

Period1 :
document.getElementById("period-1").value,

Period2 :
document.getElementById("period-2").value,

Period3 :
document.getElementById("period-3").value,

Period4 :
document.getElementById("period-4").value,

Period5 :
document.getElementById("period-5").value,

Period6 :
document.getElementById("period-6").value,

CreatedAt : serverTimestamp()

}

);


alert("Timetable Created Successfully.");

closeModalFunction();

loadAcademicManagement();


}

catch(error){

alert(error.message);

}


}

function openAttendanceSettingsModal(){

openModal(

"Attendance Settings",

`

<div class="modal-form">

<input
type="number"
id="working-days"
placeholder="Working Days">


<input
type="number"
id="minimum-attendance"
placeholder="Minimum Attendance Percentage">


<input
type="date"
id="attendance-lock-date">


</div>

<button
id="save-attendance-button"
class="modal-submit">

Save Settings

</button>

`

);


setTimeout(()=>{

document
.getElementById("save-attendance-button")
.addEventListener(
"click",
saveAttendanceSettings
);

},50);


}
async function saveAttendanceSettings(){


try{


await addDoc(

collection(db,"attendanceSettings"),

{

WorkingDays :
document.getElementById("working-days").value,

MinimumAttendance :
document.getElementById("minimum-attendance").value,

AttendanceLockDate :
document.getElementById("attendance-lock-date").value,

CreatedAt :
serverTimestamp()

}

);


alert("Attendance Settings Saved.");


closeModalFunction();


}


catch(error){

alert(error.message);

}


}

function openExaminationSettingsModal(){

openModal(

"Examination Settings",

`

<div class="modal-form">

<input
type="text"
id="exam-name"
placeholder="Exam Name">


<select id="exam-type">

<option>Unit Test</option>

<option>Half Yearly</option>

<option>Annual</option>

<option>Practical</option>

</select>


<input
type="text"
id="exam-class"
placeholder="Class">


<input
type="number"
id="maximum-marks"
placeholder="Maximum Marks">


<input
type="number"
id="passing-marks"
placeholder="Passing Marks">


</div>

<button
id="save-exam-button"
class="modal-submit">

Create Examination

</button>

`

);


setTimeout(()=>{

document
.getElementById("save-exam-button")
.addEventListener(
"click",
createExamination
);

},50);


}

async function createExamination(){


try{


await addDoc(

collection(db,"examinations"),

{

ExamName :
document.getElementById("exam-name").value,

ExamType :
document.getElementById("exam-type").value,

ClassName :
document.getElementById("exam-class").value,

MaximumMarks :
document.getElementById("maximum-marks").value,

PassingMarks :
document.getElementById("passing-marks").value,

CreatedAt :
serverTimestamp()

}

);


alert("Examination Created Successfully.");

closeModalFunction();


}


catch(error){

alert(error.message);

}


}

function openAcademicReportsModal(){


openModal(

"Academic Reports",

`

<div class="modal-form">

<select id="academic-report-type">

<option>Total Classes</option>

<option>Total Subjects</option>

<option>Total Examinations</option>

<option>Total Timetables</option>

<option>Academic Summary</option>

</select>


</div>


<button
id="generate-academic-report-button"
class="modal-submit">

Generate Report

</button>

`

);


setTimeout(()=>{

document
.getElementById("generate-academic-report-button")
.addEventListener(
"click",
generateAcademicReport
);

},50);


}

async function generateAcademicReport(){


const reportType =

document.getElementById(
"academic-report-type"
).value;



if(reportType==="Total Classes"){

const snapshot =
await getDocs(
collection(db,"classes")
);

alert(

`Total Classes : ${snapshot.size}`

);

}


if(reportType==="Total Subjects"){

const snapshot =
await getDocs(
collection(db,"subjects")
);

alert(

`Total Subjects : ${snapshot.size}`

);

}


if(reportType==="Total Examinations"){

const snapshot =
await getDocs(
collection(db,"examinations")
);

alert(

`Total Examinations : ${snapshot.size}`

);

}


if(reportType==="Total Timetables"){

const snapshot =
await getDocs(
collection(db,"timetables")
);

alert(

`Total Timetables : ${snapshot.size}`

);

}


if(reportType==="Academic Summary"){

alert(

"Academic Management Module Working Successfully."

);

}


}

/**********************************************************************
 * DEPARTMENT MANAGEMENT
 **********************************************************************/

function loadDepartmentManagement() {

contentArea.innerHTML = `

<!-- PAGE HEADER -->

<div class="welcome-card">

<h1>Department Management</h1>

<p>Manage all school departments, heads, and employees.</p>

</div>



<!-- DEPARTMENT STATISTICS -->

<div class="cards-container">

<div class="card">

<h3>Total Departments</h3>

<h1 id="total-departments">0</h1>

</div>


<div class="card">

<h3>Department Heads</h3>

<h1 id="department-heads">0</h1>

</div>


<div class="card">

<h3>Active Departments</h3>

<h1 id="active-departments">0</h1>

</div>


<div class="card">

<h3>Employees Assigned</h3>

<h1 id="employees-assigned">0</h1>

</div>

</div>




<!-- QUICK ACTIONS -->

<div class="quick-actions">

<h2>Quick Actions</h2>

<div class="action-buttons">

<button id="create-department-btn">

Create Department

</button>


<button id="assign-hod-btn">

Assign HOD

</button>


<button id="assign-permission-btn">

Assign Employees

</button>


<button id="view-departments-btn">

View Departments

</button>


<button id="department-report-btn">

Generate Reports

</button>


<button id="manage-access-btn">

Department Settings

</button>

</div>

</div>




<!-- DEPARTMENT DIRECTORY -->

<div class="recent-activities">

<h2>Department Directory</h2>

<ul>

<li>No departments found.</li>

</ul>

</div>




<!-- RECENT ACTIVITIES -->

<div class="recent-activities">

<h2>Recent Department Activities</h2>

<ul>

<li>No recent department activities found.</li>

</ul>

</div>




<!-- PENDING REQUESTS -->

<div class="recent-activities">

<h2>Pending Requests</h2>

<ul>

<li>Department Requests - 0</li>

<li>Permission Requests - 0</li>

<li>Role Requests - 0</li>

</ul>

</div>


`;


setTimeout(() => {

initializeDepartmentManagement();
loadDepartmentStatistics();

},100);


}

function initializeDepartmentManagement(){



const createDepartment =
document.getElementById("create-department-btn");


const assignHOD =
document.getElementById("assign-hod-btn");


const assignPermission =
document.getElementById("assign-permission-btn");


const viewDepartments =
document.getElementById("view-departments-btn");


const generateReports =
document.getElementById("department-report-btn");


const manageAccess =
document.getElementById("manage-access-btn");




if(createDepartment){

createDepartment.addEventListener("click",()=>{

openCreateDepartmentModal();

});

}




if(assignHOD){

assignHOD.addEventListener("click",()=>{

openAssignHODModal();

});

}




if(assignPermission){

assignPermission.addEventListener("click",()=>{

openAssignEmployeesModal();

});

}




if(viewDepartments){

viewDepartments.addEventListener("click",()=>{

loadAllDepartments();

});

}




if(generateReports){

generateReports.addEventListener("click",()=>{

openDepartmentReportsModal();

});

}




if(manageAccess){

manageAccess.addEventListener("click",()=>{

openDepartmentSettingsModal();

});

}



}

function openCreateDepartmentModal(){

openModal(

"Create Department",

`

<div class="modal-form">


<input
type="text"
id="department-name"
placeholder="Department Name">


<input
type="email"
id="department-email"
placeholder="Department Email">


<input
type="text"
id="department-phone"
placeholder="Department Phone Number">


<input
type="text"
id="department-description"
placeholder="Department Description">


<select id="department-status">

<option>Active</option>

<option>Inactive</option>

</select>


</div>


<button
id="create-department-button"
class="modal-submit">

Create Department

</button>

`

);


setTimeout(()=>{

document
.getElementById("create-department-button")
.addEventListener(
"click",
createAcademicDepartmentFunction
);

},50);


}

async function createAcademicDepartmentFunction(){


const departmentName =
document.getElementById("department-name").value;


const departmentEmail =
document.getElementById("department-email").value;


const departmentPhone =
document.getElementById("department-phone").value;


const departmentDescription =
document.getElementById("department-description").value;


const departmentStatus =
document.getElementById("department-status").value;



if(

!departmentName ||
!departmentEmail ||
!departmentPhone ||
!departmentDescription

){

alert("Please fill all fields.");

return;

}



try{


await addDoc(

collection(db,"departments"),

{

DepartmentName : departmentName,
DepartmentEmail : departmentEmail,
DepartmentPhone : departmentPhone,
DepartmentDescription : departmentDescription,
DepartmentHead : "Not Assigned",
Status : departmentStatus,
CreatedAt : serverTimestamp()

}

);


alert("Department Created Successfully.");


closeModalFunction();

loadDepartmentManagement();


}


catch(error){

alert(error.message);

}


}

async function loadAllDepartments(){


const querySnapshot =

await getDocs(

collection(
db,
"departments"
)

);


let html =

`

<div class="recent-activities">

<h2>

Department Directory

</h2>


<table style="width:100%;">


<tr>

<th>Name</th>

<th>Status</th>

<th>Actions</th>

</tr>

`;


if(querySnapshot.empty){

html +=

`

<tr>

<td colspan="3">

No Departments Found.

</td>

</tr>

`;

}


querySnapshot.forEach((departmentDoc)=>{


const department =

departmentDoc.data();


html +=

`

<tr>

<td>

${department.DepartmentName}

</td>


<td>

${department.Status}

</td>


<td>

<button
onclick="editDepartment('${departmentDoc.id}')">

Edit

</button>


<button
onclick="deleteDepartment('${departmentDoc.id}')">

Delete

</button>

</td>


</tr>

`;


});


html += "</table></div>";


openModal(

"View Departments",

html

);


}

window.editDepartment = editDepartment;
window.deleteDepartment = deleteDepartment;

function openAssignHODModal(){

openModal(

"Assign Department Head",

`

<div class="modal-form">

<input
type="text"
id="hod-department-name"
placeholder="Department Name">


<input
type="text"
id="department-head-name"
placeholder="Employee Name">


</div>

<button
id="assign-hod-button"
class="modal-submit">

Assign HOD

</button>

`

);


setTimeout(()=>{

document
.getElementById("assign-hod-button")
.addEventListener(
"click",
assignDepartmentHead
);

},50);

}

async function assignDepartmentHead(){

const departmentName =
document.getElementById("hod-department-name").value;

const departmentHead =
document.getElementById("department-head-name").value;


const querySnapshot =

await getDocs(
collection(db,"departments")
);


for(const departmentDoc of querySnapshot.docs){

const department = departmentDoc.data();


if(department.DepartmentName === departmentName){

await updateDoc(

doc(
db,
"departments",
departmentDoc.id
),

{

DepartmentHead : departmentHead

}

);

}

}


alert("Department Head Assigned Successfully.");

closeModalFunction();

loadDepartmentManagement();

}

function openAssignEmployeesModal(){

openModal(

"Assign Employee",

`

<div class="modal-form">

<input
type="text"
id="employee-department-name"
placeholder="Department Name">


<input
type="text"
id="department-employee-id"
placeholder="Employee ID">


<input
type="text"
id="department-employee-name"
placeholder="Employee Name">


<input
type="text"
id="department-employee-role"
placeholder="Employee Role">


</div>

<button
id="assign-employee-button"
class="modal-submit">

Assign Employee

</button>

`

);


setTimeout(()=>{

document
.getElementById("assign-employee-button")
.addEventListener(
"click",
assignEmployeeToDepartment
);

},50);


}

async function assignEmployeeToDepartment(){

try{

await addDoc(

collection(db,"departmentEmployees"),

{

DepartmentName :

document.getElementById(
"employee-department-name"
).value,


EmployeeID :

document.getElementById(
"department-employee-id"
).value,


EmployeeName :

document.getElementById(
"department-employee-name"
).value,


EmployeeRole :

document.getElementById(
"department-employee-role"
).value,


CreatedAt :

serverTimestamp()

}

);


alert("Employee Assigned Successfully.");

closeModalFunction();

loadDepartmentManagement();

}

catch(error){

alert(error.message);

}

}

function openDepartmentReportsModal(){

openModal(

"Department Reports",

`

<div class="modal-form">

<select id="department-report-type">

<option>Total Departments</option>

<option>Department Heads</option>

<option>Active Departments</option>

<option>Employees Assigned</option>

</select>


</div>


<button
id="generate-department-report-button"
class="modal-submit">

Generate Report

</button>

`

);


setTimeout(()=>{

document
.getElementById("generate-department-report-button")
.addEventListener(
"click",
generateDepartmentReport
);

},50);


}

async function generateDepartmentReport(){


const reportType =

document.getElementById(
"department-report-type"
).value;



if(reportType==="Total Departments"){

const snapshot =
await getDocs(
collection(db,"departments")
);

alert(

`Total Departments : ${snapshot.size}`

);

}


if(reportType==="Department Heads"){

alert(
"Active Departments Report Generated."
);

}


if(reportType==="Active Departments"){

alert(
"Active Departments Report Generated."
);

}


if(reportType==="Employees Assigned"){

const snapshot =
await getDocs(
collection(db,"departmentEmployees")
);

alert(

`Employees Assigned : ${snapshot.size}`

);

}


}

function openDepartmentSettingsModal(){

openModal(

"Department Settings",

`

<div class="recent-activities">

<h2>

Department Settings

</h2>


<ul>

<li>
Department Email Settings
</li>

<li>
Department Phone Settings
</li>

<li>
Department Description Settings
</li>

<li>
Department Status Settings
</li>

</ul>


<p>

These settings are managed while editing departments.

</p>

</div>

`

);


}



async function editDepartment(departmentID){


const departmentRef =

doc(
db,
"departments",
departmentID
);


const snapshot =

await getDoc(
departmentRef
);


const department =

snapshot.data();


openModal(

"Edit Department",

`

<div class="modal-form">


<input
type="text"
id="edit-department-name"
value="${department.DepartmentName}">


<input
type="email"
id="edit-department-email"
value="${department.DepartmentEmail}">


</div>


<button
id="update-department-button"
class="modal-submit">

Update Department

</button>

`

);


setTimeout(()=>{

document
.getElementById("update-department-button")
.addEventListener(

"click",

()=>{

updateDepartmentFunction(
departmentID
);

}

);

},50);


}

async function updateDepartmentFunction(departmentID){


await updateDoc(

doc(
db,
"departments",
departmentID
),

{

DepartmentName :

document.getElementById(
"edit-department-name"
).value,


DepartmentEmail :

document.getElementById(
"edit-department-email"
).value


}


);


alert("Department Updated Successfully.");


closeModalFunction();

loadDepartmentManagement();


}

async function deleteDepartment(departmentID){


const confirmation =

confirm(
"Delete Department?"
);


if(!confirmation){

return;

}


await deleteDoc(

doc(
db,
"departments",
departmentID
)

);


alert(
"Department Deleted Successfully."
);


loadAllDepartments();


}

async function loadDepartmentStatistics(){


const querySnapshot =

await getDocs(

collection(
db,
"departments"
)

);


let totalDepartments = 0;
let activeDepartments = 0;
let departmentHeads = 0;


querySnapshot.forEach((doc)=>{


const department = doc.data();


totalDepartments++;


if(department.Status==="Active"){

activeDepartments++;

}


if(
department.DepartmentHead
!== "Not Assigned"
){

departmentHeads++;

}


});


document
.getElementById("total-departments")
.innerText = totalDepartments;


document
.getElementById("department-heads")
.innerText = departmentHeads;


document
.getElementById("active-departments")
.innerText = activeDepartments;


const employeeSnapshot =

await getDocs(
collection(db,"departmentEmployees")
);


document
.getElementById("employees-assigned")
.innerText = employeeSnapshot.size;


}

function loadSchoolManagement() {

contentArea.innerHTML = `

<!-- PAGE HEADER -->

<div class="welcome-card">

<h1>School Management</h1>

<p>Manage school profile, sessions, events and holidays.</p>

</div>



<!-- SCHOOL STATISTICS -->

<div class="cards-container">

<div class="card">

<h3>School Profile</h3>

<h1 id="school-profile-count">0</h1>

</div>


<div class="card">

<h3>Academic Sessions</h3>

<h1 id="academic-session-count">0</h1>

</div>


<div class="card">

<h3>School Houses</h3>

<h1 id="school-house-count">0</h1>

</div>


<div class="card">

<h3>School Notices</h3>

<h1 id="school-notice-count">0</h1>

</div>

</div>




<!-- QUICK ACTIONS -->

<div class="quick-actions">

<h2>Quick Actions</h2>

<div class="action-buttons">

<button id="school-profile-btn">

School Profile

</button>


<button id="manage-sessions-btn">

Academic Sessions

</button>


<button id="manage-houses-btn">

School Houses

</button>


<button id="manage-events-btn">

School Notices

</button>


<button id="manage-holidays-btn">

School Calendar

</button>


<button id="school-report-btn">

School Settings

</button>

</div>

</div>




<!-- SCHOOL OVERVIEW -->

<div class="recent-activities">

<h2>School Overview</h2>

<ul>

<li>No school information available.</li>

</ul>

</div>




<!-- RECENT ACTIVITIES -->

<div class="recent-activities">

<h2>Recent School Activities</h2>

<ul>

<li>No recent school activities found.</li>

</ul>

</div>




<!-- PENDING REQUESTS -->

<div class="recent-activities">

<h2>Pending Requests</h2>

<ul>

<li>Session Change Requests - 0</li>

<li>Event Requests - 0</li>

<li>Calendar Updates - 0</li>

</ul>

</div>

`;


setTimeout(() => {

initializeSchoolManagement();
loadSchoolStatistics();

},100);


}

async function createAcademicClassFunction(){


const className =
document.getElementById("class-name").value;


const section =
document.getElementById("section-name").value;


const classTeacher =
document.getElementById("class-teacher").value;


const academicSession =
document.getElementById("academic-session").value;


const status =
document.getElementById("class-status").value;



if(

!className ||
!section ||
!classTeacher ||
!academicSession

){

alert("Please fill all fields.");

return;

}


try{


await addDoc(

collection(db,"classes"),

{

ClassName : className,
Section : section,
ClassTeacher : classTeacher,
AcademicSession : academicSession,
Status : status,
CreatedAt : serverTimestamp()

}

);


alert("Class Created Successfully.");


closeModalFunction();

loadAcademicManagement();


}


catch(error){

alert(error.message);

}


}

function initializeSchoolManagement(){



const schoolProfile =
document.getElementById("school-profile-btn");


const manageSessions =
document.getElementById("manage-sessions-btn");


const manageHouses =
document.getElementById("manage-houses-btn");


const manageEvents =
document.getElementById("manage-events-btn");


const manageHolidays =
document.getElementById("manage-holidays-btn");


const generateReports =
document.getElementById("school-report-btn");




if(schoolProfile){

schoolProfile.addEventListener("click",()=>{

openSchoolProfileModal();

});

}




if(manageSessions){

manageSessions.addEventListener("click",()=>{

openAcademicSessionsModal();

});

}




if(manageHouses){

manageHouses.addEventListener("click",()=>{

openSchoolHousesModal();
});

}




if(manageEvents){

manageEvents.addEventListener("click",()=>{

openSchoolNoticesModal();

});

}




if(manageHolidays){

manageHolidays.addEventListener("click",()=>{

alert("Manage Holidays Function Coming Soon.");

});

}




if(generateReports){

generateReports.addEventListener("click",()=>{

alert("Generate Reports Function Coming Soon.");

});

}



}

function openSchoolProfileModal(){

openModal(

"School Profile",

`

<div class="modal-form">

<input
id="school-name"
type="text"
placeholder="School Name">

<input
id="school-code"
type="text"
placeholder="School Code">

<input
id="principal-name"
type="text"
placeholder="Principal Name">

<input
id="school-email"
type="email"
placeholder="School Email">

<input
id="school-phone"
type="text"
placeholder="School Phone">

<input
id="website"
type="text"
placeholder="Website">

<input
id="address"
type="text"
placeholder="Address">

<input
id="city"
type="text"
placeholder="City">

<input
id="state"
type="text"
placeholder="State">

<input
id="country"
type="text"
placeholder="Country">

<input
id="pincode"
type="text"
placeholder="Pincode">

</div>

<button
id="save-school-profile"
class="modal-submit">

Save Profile

</button>

`

);

setTimeout(()=>{

document
.getElementById("save-school-profile")
.addEventListener(
"click",
saveSchoolProfile
);

},50);

}

async function saveSchoolProfile(){

const snapshot =
await getDocs(collection(db,"schoolProfile"));

if(!snapshot.empty){

alert("School Profile already exists.");

return;

}

await addDoc(

collection(db,"schoolProfile"),

{

SchoolName:
document.getElementById("school-name").value,

SchoolCode:
document.getElementById("school-code").value,

PrincipalName:
document.getElementById("principal-name").value,

SchoolEmail:
document.getElementById("school-email").value,

SchoolPhone:
document.getElementById("school-phone").value,

Website:
document.getElementById("website").value,

Address:
document.getElementById("address").value,

City:
document.getElementById("city").value,

State:
document.getElementById("state").value,

Country:
document.getElementById("country").value,

Pincode:
document.getElementById("pincode").value,

CreatedAt:
serverTimestamp()

}

);

alert("School Profile Saved.");

closeModalFunction();

loadSchoolManagement();

}

async function loadSchoolStatistics(){

const profile =
await getDocs(collection(db,"schoolProfile"));

const sessions =
await getDocs(collection(db,"academicSessions"));

const houses =
await getDocs(collection(db,"schoolHouses"));

const notices =
await getDocs(collection(db,"schoolNotices"));

document
.getElementById("school-profile-count")
.innerText=profile.size;

document
.getElementById("academic-session-count")
.innerText=sessions.size;

document
.getElementById("school-house-count")
.innerText=houses.size;

document
.getElementById("school-notice-count")
.innerText=notices.size;

}



function loadTransportManagement() {

contentArea.innerHTML = `

<!-- PAGE HEADER -->

<div class="welcome-card">

<h1>Transport Management</h1>

<p>Manage school vehicles, drivers, routes and student transport assignments.</p>

</div>



<!-- TRANSPORT STATISTICS -->

<div class="cards-container">

<div class="card">

<h3>Total Vehicles</h3>

<h1 id="total-vehicles">0</h1>

</div>

<div class="card">

<h3>Total Drivers</h3>

<h1 id="total-drivers">0</h1>

</div>

<div class="card">

<h3>Active Routes</h3>

<h1 id="active-routes">0</h1>

</div>

<div class="card">

<h3>Students Assigned</h3>

<h1 id="students-assigned">0</h1>

</div>

</div>




<!-- QUICK ACTIONS -->

<div class="quick-actions">

<h2>Quick Actions</h2>

<div class="action-buttons">

<button id="manage-vehicles-btn">

Manage Vehicles

</button>

<button id="manage-drivers-btn">

Manage Drivers

</button>

<button id="manage-routes-btn">

Manage Routes

</button>

<button id="assign-students-btn">

Assign Students

</button>

<button id="transport-reports-btn">

Transport Reports

</button>

<button id="transport-settings-btn">

Transport Settings

</button>

</div>

</div>




<div class="recent-activities">

<h2>Transport Overview</h2>

<ul>

<li>No transport information available.</li>

</ul>

</div>




<div class="recent-activities">

<h2>Recent Activities</h2>

<ul>

<li>No recent transport activities.</li>

</ul>

</div>



<div class="recent-activities">

<h2>Pending Requests</h2>

<ul>

<li>Vehicle Requests - 0</li>

<li>Route Requests - 0</li>

<li>Student Assignment Requests - 0</li>

</ul>

</div>

`;


setTimeout(() => {

initializeTransportManagement();

},100);


}

function initializeTransportManagement(){



const manageVehicles =
document.getElementById("manage-vehicles-btn");

const manageDrivers =
document.getElementById("manage-drivers-btn");

const manageRoutes =
document.getElementById("manage-routes-btn");

const assignStudents =
document.getElementById("assign-students-btn");

const transportReports =
document.getElementById("transport-reports-btn");

const transportSettings =
document.getElementById("transport-settings-btn");




if(addBus){

addBus.addEventListener("click",()=>{

alert("Add Bus Function Coming Soon.");

});

}




if(assignDriver){

assignDriver.addEventListener("click",()=>{

alert("Assign Driver Function Coming Soon.");

});

}




if(createRoute){

createRoute.addEventListener("click",()=>{

alert("Create Route Function Coming Soon.");

});

}




if(assignStudents){

assignStudents.addEventListener("click",()=>{

alert("Assign Students Function Coming Soon.");

});

}




if(transportFees){

transportFees.addEventListener("click",()=>{

alert("Transport Fees Function Coming Soon.");

});

}




if(generateReports){

generateReports.addEventListener("click",()=>{

alert("Generate Reports Function Coming Soon.");

});

}



}


function loadUdiseManagement(){

contentArea.innerHTML = `

<div class="welcome-card">

<h1>UDISE+ Management</h1>

<p>Manage UDISE+ Integration.</p>

</div>


<div class="cards-container">

<div class="card">
<h3>Sync Status</h3>
</div>

<div class="card">
<h3>Student Sync</h3>
</div>

<div class="card">
<h3>Teacher Sync</h3>
</div>

<div class="card">
<h3>Error Logs</h3>
</div>

</div>

`;

}


function loadApaarManagement(){

contentArea.innerHTML = `

<div class="welcome-card">

<h1>APAAR Management</h1>

<p>Manage APAAR IDs.</p>

</div>


<div class="cards-container">

<div class="card">
<h3>Generate APAAR ID</h3>
</div>

<div class="card">
<h3>Verification Status</h3>
</div>

<div class="card">
<h3>Pending Requests</h3>
</div>

</div>

`;

}


function loadReports(){

contentArea.innerHTML = `

<div class="welcome-card">

<h1>Reports & Analytics</h1>

<p>View ERP Reports.</p>

</div>


<div class="cards-container">

<div class="card">
<h3>Student Reports</h3>
</div>

<div class="card">
<h3>Staff Reports</h3>
</div>

<div class="card">
<h3>Attendance Reports</h3>
</div>

<div class="card">
<h3>Fee Reports</h3>
</div>

</div>

`;

}


function loadSettings(){

contentArea.innerHTML = `

<div class="welcome-card">

<h1>System Settings</h1>

<p>Configure ERP settings.</p>

</div>


<div class="cards-container">

<div class="card">
<h3>Email Settings</h3>
</div>

<div class="card">
<h3>SMS Settings</h3>
</div>

<div class="card">
<h3>User Permissions</h3>
</div>

<div class="card">
<h3>Themes</h3>
</div>

</div>

`;

}


function loadDatabaseManagement(){

contentArea.innerHTML = `

<div class="welcome-card">

<h1>Database Management</h1>

<p>Manage Firebase Database.</p>

</div>


<div class="cards-container">

<div class="card">
<h3>Collections</h3>
</div>

<div class="card">
<h3>Import Data</h3>
</div>

<div class="card">
<h3>Export Data</h3>
</div>

<div class="card">
<h3>Restore Backup</h3>
</div>

</div>

`;

}

async function createERPUser(){

    const name =
    document.getElementById("user-name").value;


    const email =
    document.getElementById("user-email").value;


    const password =
    document.getElementById("user-password").value;


    const phone =
    document.getElementById("user-phone").value;


    const role =
    document.getElementById("user-role").value;


    const department =
    document.getElementById("user-department").value;


    if(

        !name ||
        !email ||
        !password ||
        !phone

    ){

        alert("Please fill all fields.");

        return;

    }


    try{

        const userCredential =

        await createUserWithEmailAndPassword(

            auth,
            email,
            password

        );


        const uid = userCredential.user.uid;


        await setDoc(

            doc(db,"users",uid),

            {

                Name:name,
                Email:email,
                Phone:phone,
                Role:role,
                Department:department,
                Status:"Active",

                CreatedAt:

                serverTimestamp()

            }

        );


        alert("User Created Successfully.");


        closeModalFunction();


        loadDashboard();


    }

    catch(error){

        console.log(error);

        alert(error.message);

    }

}

async function createClassFunction(){

    const className =
    document.getElementById("class-name").value;

    const section =
    document.getElementById("class-section").value;

    const academicSession =
    document.getElementById("academic-session").value;


    if(

        !className ||
        !section ||
        !academicSession

    ){

        alert("Please fill all fields.");

        return;

    }


    try{

        await addDoc(

            collection(db,"classes"),

            {

                ClassName : className,

                Section : section,

                AcademicSession :
                academicSession,

                TotalStudents : 0,

                ClassTeacher : "",

                Status : "Active",

                CreatedAt :
                serverTimestamp()

            }

        );


        alert("Class Created Successfully.");

        closeModalFunction();

        loadDashboard();

    }

    catch(error){

        console.log(error);

        alert(error.message);

    }

}

async function createDepartmentFunction(){


    const departmentName =

    document.getElementById(
        "department-name"
    ).value;


    const departmentCode =

    document.getElementById(
        "department-code"
    ).value;


    const departmentHead =

    document.getElementById(
        "department-head"
    ).value;


    const departmentDescription =

    document.getElementById(
        "department-description"
    ).value;



    if(

        !departmentName ||
        !departmentCode ||
        !departmentHead ||
        !departmentDescription

    ){

        alert(
            "Please fill all fields."
        );

        return;

    }



    try{


        await addDoc(

            collection(
                db,
                "departments"
            ),

            {

                DepartmentName :
                departmentName,

                DepartmentCode :
                departmentCode,

                DepartmentHead :
                departmentHead,

                Description :
                departmentDescription,

                TotalEmployees : 0,

                Status : "Active",

                CreatedAt :
                serverTimestamp()

            }

        );


        alert(
            "Department Created Successfully."
        );


        closeModalFunction();


        loadDepartmentManagement();


    }

    catch(error){

        console.log(error);

        alert(error.message);

    }


}

async function saveSchoolSettings(){

    try{

        await setDoc(

            doc(
                db,
                "schoolSettings",
                "schoolProfile"
            ),

            {

                SchoolName :
                document.getElementById("school-name").value,

                SchoolCode :
                document.getElementById("school-code").value,

                UDISECode :
                document.getElementById("udise-code").value,

                AffiliationNumber :
                document.getElementById("affiliation-number").value,

                PrincipalName :
                document.getElementById("principal-name").value,

                SchoolEmail :
                document.getElementById("school-email").value,

                SchoolPhone :
                document.getElementById("school-phone").value,

                SchoolAddress :
                document.getElementById("school-address").value,

                AcademicSession :
                document.getElementById("academic-session").value,

                SchoolWebsite :
                document.getElementById("school-website").value,

                SchoolMotto :
                document.getElementById("school-motto").value,

                EstablishedYear :
                document.getElementById("established-year").value,

                UpdatedAt :
                serverTimestamp()

            }

        );


        alert(
            "School Settings Saved Successfully."
        );

        closeModalFunction();

    }

    catch(error){

        console.log(error);

        alert(error.message);

    }

}

// BUTTON EVENTS


dashboard.onclick = loadDashboard;

employee.onclick = loadEmployeeManagement;

student.onclick = loadStudentManagement;

academic.onclick = loadAcademicManagement;

department.onclick = loadDepartmentManagement;

school.onclick = loadSchoolManagement;

transport.onclick = loadTransportManagement;

udise.onclick = loadUdiseManagement;

apaar.onclick = loadApaarManagement;

reports.onclick = loadReports;

settings.onclick = loadSettings;

database.onclick = loadDatabaseManagement;



// DEFAULT PAGE


loadDashboard();




// LOGOUT


document.querySelector(".logout-btn")
.addEventListener("click",async()=>{

    await signOut(auth);

    window.location.href="./login-page.html";

});

// ======================================
// NOTIFICATION SYSTEM
// ======================================


const notificationButton =
document.querySelector(".notification-btn");


const supportCenter =
document.getElementById("supportCenter");


const closeSupport =
document.getElementById("closeSupport");




// OPEN PANEL


notificationButton.addEventListener("click",()=>{

    supportCenter.classList.add("active");

});




// CLOSE PANEL


closeSupport.addEventListener("click",()=>{

    supportCenter.classList.remove("active");

});




// CLICK OUTSIDE TO CLOSE


window.addEventListener("click",(event)=>{


    if(

        !supportCenter.contains(event.target)

        &&

        !notificationButton.contains(event.target)

    ){

        supportCenter.classList.remove("active");

    }


});

// =======================================
// QUICK ACTION MODAL SYSTEM
// =======================================


const modalOverlay =
document.getElementById("modalOverlay");


const modalTitle =
document.getElementById("modalTitle");


const modalContent =
document.getElementById("modalContent");


const closeModal =
document.getElementById("closeModal");




function openModal(title,content){

    modalTitle.innerHTML = title;

    modalContent.innerHTML = content;

    modalOverlay.classList.add("active");

}



function closeModalFunction(){

    modalOverlay.classList.remove("active");

}


closeModal.addEventListener(
"click",
closeModalFunction
);



modalOverlay.addEventListener("click",(e)=>{

    if(e.target === modalOverlay){

        closeModalFunction();

    }

});

// =======================================
// QUICK ACTION BUTTON FUNCTIONALITY
// =======================================

function initializeQuickActions() {

    const addUser =
    document.getElementById("add-user-btn");


    const createClass =
    document.getElementById("create-class-btn");


    const createDepartment =
    document.getElementById("create-department-btn");


    const schoolSettings =
    document.getElementById("school-settings-btn");


    // ----------------------------
    // ADD USER
    // ----------------------------

    // ----------------------------
// ADD USER
// ----------------------------

if (addUser) {

    addUser.addEventListener("click", () => {

        openModal(

            "Add User",

            `

            <div class="modal-form">

                <input
                type="text"
                id="user-name"
                placeholder="Full Name">


                <input
                type="email"
                id="user-email"
                placeholder="Email Address">


                <input
                type="password"
                id="user-password"
                placeholder="Temporary Password">


                <input
                type="text"
                id="user-phone"
                placeholder="Phone Number">


                <select id="user-role">

                    <option>Teacher</option>

                    <option>Principal</option>

                    <option>Finance Officer</option>

                    <option>Admission Officer</option>

                    <option>Management Officer</option>

                    <option>Transport Officer</option>

                    <option>Admin</option>

                </select>


                <select id="user-department">

                    <option>Teacher Department</option>

                    <option>Principal Office</option>

                    <option>Finance Department</option>

                    <option>Admission Department</option>

                    <option>Management Department</option>

                    <option>Transport Department</option>

                    <option>Administration</option>

                </select>

            </div>


            <button
            id="create-user-button"
            class="modal-submit">

                Create User

            </button>

            `

        );


        setTimeout(() => {

            document
            .getElementById("create-user-button")
            .addEventListener(
                "click",
                createERPUser
            );

        }, 50);

    });

}


    // ----------------------------
    // CREATE CLASS
    // ----------------------------

    if (createClass) {

    createClass.addEventListener("click", () => {

        openModal(

            "Create Class",

            `

            <div class="modal-form">

                <input
                type="text"
                id="class-name"
                placeholder="Class Name (PP-3 / Class 1 / Class 12)">


                <select id="class-section">

                    <option>A</option>
                    <option>B</option>
                    <option>C</option>
                    <option>D</option>

                </select>


                <input
                type="text"
                id="academic-session"
                placeholder="Academic Session (2026-27)">

            </div>


            <button
            id="create-class-button"
            class="modal-submit">

                Create Class

            </button>

            `

        );


        setTimeout(() => {

            document
            .getElementById("create-class-button")
            .addEventListener(
                "click",
                createClassFunction
            );

        },50);

    });

}


    // ----------------------------
    // CREATE DEPARTMENT
    // ----------------------------

    if(createDepartment){

    createDepartment.addEventListener("click",()=>{

        openModal(

            "Create Department",

            `

            <div class="modal-form">

                <input
                type="text"
                id="department-name"
                placeholder="Department Name">


                <input
                type="text"
                id="department-code"
                placeholder="Department Code">


                <input
                type="text"
                id="department-head"
                placeholder="Department Head">


                <input
                type="text"
                id="department-description"
                placeholder="Department Description">


            </div>


            <button
            id="create-department-button"
            class="modal-submit">

                Create Department

            </button>

            `

        );


        setTimeout(()=>{

            document
            .getElementById(
                "create-department-button"
            )
            .addEventListener(
                "click",
                createDepartmentFunction
            );

        },50);


    });

}



    // ----------------------------
    // SCHOOL SETTINGS
    // ----------------------------

    if(schoolSettings){

    schoolSettings.addEventListener("click",()=>{

        openModal(

            "School Settings",

            `

            <div class="modal-form">

                <input type="text" id="school-name"
                placeholder="School Name">

                <input type="text" id="school-code"
                placeholder="School Code">

                <input type="text" id="udise-code"
                placeholder="UDISE Code">

                <input type="text" id="affiliation-number"
                placeholder="Affiliation Number">

                <input type="text" id="principal-name"
                placeholder="Principal Name">

                <input type="email" id="school-email"
                placeholder="School Email">

                <input type="text" id="school-phone"
                placeholder="School Phone Number">

                <input type="text" id="school-address"
                placeholder="School Address">

                <input type="text" id="academic-session"
                placeholder="Academic Session">

                <input type="text" id="school-website"
                placeholder="School Website">

                <input type="text" id="school-motto"
                placeholder="School Motto">

                <input type="text" id="established-year"
                placeholder="Established Year">

            </div>

            <button
            id="save-school-settings"
            class="modal-submit">

                Save Settings

            </button>

            `

        );


        setTimeout(()=>{

            document
            .getElementById(
                "save-school-settings"
            )
            .addEventListener(
                "click",
                saveSchoolSettings
            );

        },50);


    });

}

}

// ==============================================
// ERP HEALTH STATUS SYSTEM
// ==============================================
 
// FIREBASE AUTHENTICATION STATUS


function checkFirebaseAuth() {

    const firebaseStatus =
    document.getElementById("firebase-status");


    if (!firebaseStatus) return;


    if (auth.currentUser) {

        firebaseStatus.textContent = "Online";
        firebaseStatus.style.color = "green";

    }

    else {

        firebaseStatus.textContent = "Offline";
        firebaseStatus.style.color = "red";

    }

}




// CURRENT USER STATUS


function checkCurrentUser() {

    const userStatus =
    document.getElementById("user-status");


    if (!userStatus) return;


    if (auth.currentUser) {

        userStatus.textContent =
        "Authenticated";

        userStatus.style.color =
        "green";

    }

    else {

        userStatus.textContent =
        "Not Authenticated";

        userStatus.style.color =
        "red";

    }

}




// FIRESTORE DATABASE STATUS


async function checkFirestore() {

    const firestoreStatus =
    document.getElementById(
        "firestore-status"
    );


    if (!firestoreStatus) return;


    try {

        const testRef = doc(
            db,
            "schoolSettings",
            "schoolProfile"
        );


        await getDoc(testRef);


        firestoreStatus.textContent =
        "Online";

        firestoreStatus.style.color =
        "green";

    }

    catch (error) {

        firestoreStatus.textContent =
        "Offline";

        firestoreStatus.style.color =
        "red";

    }

}




// SCHOOL PROFILE STATUS


async function checkSchoolProfile() {

    const schoolStatus =
    document.getElementById(
        "school-status"
    );


    if (!schoolStatus) return;


    try {

        const profileRef = doc(
            db,
            "schoolSettings",
            "schoolProfile"
        );


        const profileSnapshot =
        await getDoc(profileRef);


        if (profileSnapshot.exists()) {

            schoolStatus.textContent =
            "Configured";

            schoolStatus.style.color =
            "green";

        }

        else {

            schoolStatus.textContent =
            "Not Configured";

            schoolStatus.style.color =
            "orange";

        }

    }

    catch (error) {

        schoolStatus.textContent =
        "Error";

        schoolStatus.style.color =
        "red";

    }

}




// ERP SYSTEM STATUS


async function checkERPStatus() {

    const erpStatus =
    document.getElementById(
        "erp-status"
    );


    if (!erpStatus) return;


    try {

        const schoolRef = doc(
            db,
            "schoolSettings",
            "schoolProfile"
        );


        const schoolSnapshot =
        await getDoc(schoolRef);


        if (

            auth.currentUser &&

            schoolSnapshot.exists()

        ) {

            erpStatus.textContent =
            "Healthy";

            erpStatus.style.color =
            "green";

        }

        else {

            erpStatus.textContent =
            "Warning";

            erpStatus.style.color =
            "orange";

        }

    }

    catch (error) {

        erpStatus.textContent =
        "Error";

        erpStatus.style.color =
        "red";

    }

}




// MASTER FUNCTION


async function checkHealthStatus() {

    checkFirebaseAuth();

    checkCurrentUser();

    await checkFirestore();

    await checkSchoolProfile();

    await checkERPStatus();

}



// ==============================================
// INITIALIZE HEALTH STATUS
// ==============================================


setTimeout(() => {

    checkHealthStatus();

}, 500);

function downloadTextFile(fileContent,fileName){


const blob = new Blob(

[fileContent],

{

type:"text/plain"

}

);


const link =

document.createElement("a");


link.href =

URL.createObjectURL(blob);


link.download = fileName;


link.click();


}