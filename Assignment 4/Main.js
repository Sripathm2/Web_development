var gMode;
var gIndex;
var gEntry;
var gCurrentEmployeeID;
var gEntries;
var ctr=0;

function body_onload() {  
    gCurrentEmployeeID = sessionStorageGet("CurrentEmployeeID", null);

    if (gCurrentEmployeeID === null) {
        btnSignIn.onclick = btnSignIn_click;
        txtEmployeeID.value = localStorageGet("EmployeeID", "");
        if(localStorageGet("Remember",false)==="true"){
            chkRemember.checked=true;
        }
        else
            chkRemember.checked=false;
        if (txtEmployeeID.value === "") {
            txtEmployeeID.focus();
        }
        else {
            txtPassword.focus();
       }
       document.getElementById('ModalSignIn').style.display = "block";
       var span = document.getElementsByClassName("close")[0];
       span.onclick = function() {
              modal.style.display = "none";
        }
        window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
        }
        return;
    }

    btnAddNew.onclick = btnAddNew_onclick;
    btnRefresh.onclick = btnRefresh_onclick;

    txtDescContains.value = sessionStorageGet("txtDescContains", "");
    txtDateFrom.value     = sessionStorageGet("txtDateFrom", "");
    txtDateThrough.value  = sessionStorageGet("txtDateThrough", "");
    chkShowCurrEmp.value  = sessionStorageGet("chkShowCurrEmp", false);

    getEntries();
    displayEntries();
}

function btnAddNew_onclick() {
	edit(-1);
}

function btnRefresh_onclick() {
	divEntriesList.innerHTML = "";
	displayEntries()

	sessionStorageSet("txtDescContains", txtDescContains.value);
	sessionStorageSet("txtDateFrom"    , txtDateFrom.value);
	sessionStorageSet("txtDateThrough" , txtDateThrough.value);
	sessionStorageSet("chkShowCurrEmp" , chkShowCurrEmp.value);
}

function row_ondblclick() {
    edit(this.Index);
}

function displayEntries() {

    var totalHoursWorked = 0;

    for (var i = 0; i < gEntries.length; i++) {

        var entry = gEntries[i];

        if (descriptionContains(entry) && dateBetween(entry) && isCurrentEmployee(entry)) {

            var row = document.createElement("div");
            var col1 = document.createElement("div");
            var col2 = document.createElement("div");
            var col3 = document.createElement("div");
            var col4 = document.createElement("div");

            row.className = "divEntriesRow";
            row.Index = i;

            col1.className = "divEntriesCol1";
            col2.className = "divEntriesCol2";
            col3.className = "divEntriesCol3";
            col4.className = "divEntriesCol4";

            col1.innerHTML = entry.EmployeeID;
            col2.innerHTML = entry.DateWorked;
            col3.innerHTML = entry.HoursWorked;
            col4.innerHTML = entry.Description;

            row.ondblclick = row_ondblclick;

            row.appendChild(col1);
            row.appendChild(col2);
            row.appendChild(col3);
            row.appendChild(col4);

            divEntriesList.appendChild(row);

            totalHoursWorked += parseFloat(entry.HoursWorked);
        }
    }

    lblTotalHoursWorked.innerHTML = "Total Hours Worked: " + totalHoursWorked.toFixed(2).toString();
}

function descriptionContains(entry) {
    if (txtDescContains.value === "") {
        return true;
    }

    var searchFor = txtDescContains.value.toLowerCase();

    if (entry.Description.toLowerCase().includes(searchFor) === true) {
        return true;
    }
    
    return false;
}

function isCurrentEmployee(entry) {

    if (chkShowCurrEmp.checked === true) {
        if (entry.EmployeeID === gCurrentEmployeeID) {
            return true;
        }
        return false;
    }
    return true;
}


function dateBetween(entry) {

	if (validDate(txtDateFrom.value)) {
	    if (new Date(txtDateFrom.value) > new Date(entry.DateWorked)) {
			return false;
		}
	}

	if (validDate(txtDateThrough.value)) {
	    if (new Date(txtDateThrough.value) < new Date(entry.DateWorked)) {
			return false;
		}
	}

	return true;
}
function btnSignIn_click() {
    if (signinEmployee(txtEmployeeID.value, txtPassword.value) === false) {
        document.getElementById("errtext").innerHTML="EmployeeID and/or Password is incorrect";
          document.getElementById("btnyes").style.display = "none";
          document.getElementById("btnno").style.display = "none";
          var modal=document.getElementById('Modalcommon').style.display = "block";
          document.getElementById("btnk").onclick = function() {end();}
          window.onclick = function(event) {
          if (event.target == modal) {
          modal.style.display = "none";
          }
        }
        return;
    }
    if (chkRemember.checked === true) {
        localStorageSet("Remember", chkRemember.checked);
        localStorageSet("EmployeeID", txtEmployeeID.value);
    }
    else {
        localStorageSet("Remember", false);
        localStorageSet("EmployeeID", "");
    }
    sessionStorageSet("CurrentEmployeeID", txtEmployeeID.value);
    location.href = "Main.html";
}
function edit(val)
{
    var modal=document.getElementById('ModalEdit');
    modal.style.display = "block";
    var span = document.getElementById('close12');
    span.onclick = function() {
        checkedit(val); 
    }
    window.onclick = function(event) { 
    if (event.target == modal) {
         modal.style.display = "none";
        }
     }
    btnSave.onclick = btnSave_onclick;
    btnDelete.onclick = btnDelete_onclick;
    if (val>-1) {
        gEntry = gEntries[val];
        gIndex=val;
        txtEmployeeIDEdit.value  = gEntry.EmployeeID;
        txtHoursWorked.value = gEntry.HoursWorked;
        txtDateWorked.value  = gEntry.DateWorked;
        chkBillable.checked  = gEntry.Billable;
        txtDescription.value = gEntry.Description;
        btnDelete.disabled = false;
    }
    else {
        txtEmployeeIDEdit.value = gCurrentEmployeeID
        txtHoursWorked.value ="";
        chkBillable.checked  = false;
        txtDescription.value = "";
        btnDelete.disabled = false;
        var date = new Date();
        txtDateWorked.valueAsDate = date;
        btnDelete.disabled = true;
    }
}

function btnSave_onclick(val) {
    if (txtEmployeeIDEdit.value === "") {

          document.getElementById("errtext").innerHTML="Employee ID is required.";
          document.getElementById("btnyes").style.display = "none";
          document.getElementById("btnno").style.display = "none";
          var modal=document.getElementById('Modalcommon').style.display = "block";
          document.getElementById("btnk").onclick = function() {end();}
          window.onclick = function(event) {
          if (event.target == modal) {
          modal.style.display = "none";
          }
        }
        txtEmployeeID.focus();
        return;
    }

    if (!validHoursWorked(txtHoursWorked.value)) {
        document.getElementById("errtext").innerHTML="Hours Worked must be a valid number greater than zero and less than 4.00, and only in fifteen-minute intervals.";
          document.getElementById("btnyes").style.display = "none";
          document.getElementById("btnno").style.display = "none";
          var modal=document.getElementById('Modalcommon').style.display = "block";
          document.getElementById("btnk").onclick = function() {end();}
          window.onclick = function(event) {
          if (event.target == modal) {
          modal.style.display = "none";
          }
        }
        txtHoursWorked.focus();
        return;
    }

    if (!validDate(txtDateWorked.value)) {
        document.getElementById("errtext").innerHTML="Date Worked is required.";
          document.getElementById("btnyes").style.display = "none";
          document.getElementById("btnno").style.display = "none";
          var modal=document.getElementById('Modalcommon').style.display = "block";
          document.getElementById("btnk").onclick = function() {end();}
          window.onclick = function(event) {
          if (event.target == modal) {
          modal.style.display = "none";
          }
        }
        txtDateWorked.focus();
        return;
    }

    if (txtDescription.value.length < 20) {
         document.getElementById("errtext").innerHTML="Description is required and must be at least 20 characters long.";
          document.getElementById("btnyes").style.display = "none";
          document.getElementById("btnno").style.display = "none";
          var modal=document.getElementById('Modalcommon').style.display = "block";
          document.getElementById("btnk").onclick = function() {end();}
          window.onclick = function(event) {
          if (event.target == modal) {
          modal.style.display = "none";
          }
        }
        txtDescription.focus();
        return;
    }
    var entry = {
        EmployeeID: txtEmployeeIDEdit.value,
        DateWorked: txtDateWorked.value,
        HoursWorked: txtHoursWorked.value,
        Billable: chkBillable.checked,
        Description: txtDescription.value
    }
    if (gEntry==null) {
        gEntries.push(entry);
    }
    else {
        gEntries[gIndex] = entry;
    }
    saveEntries();
    location.href = "Main.html";
}

function btnDelete_onclick() {

        document.getElementById("errtext").innerHTML="Are you sure you want to delete this entry?";
          document.getElementById("btnk").style.display = "none";
          var modal=document.getElementById('Modalcommon').style.display = "block";
          document.getElementById("btnno").onclick = function() {endDEL(0);}
          document.getElementById("btnyes").onclick = function() {endDEL(1);}   
 }
    
function validHoursWorked(hrs) {
    var floatHrs = parseFloat(hrs);
    if (floatHrs <= 0 || hrs > 4.00) {
        return false;
    }
    if (floatHrs * 4 === parseInt(floatHrs * 4)) {
        return true;
    }
    return false;
}
function getEntries() {

    gEntries = new Array();

    var json = localStorageGet("Entries", null);

    if (json === null) {
        return;
    }

    gEntries = JSON.parse(json);
}

function saveEntries() {

    var json = JSON.stringify(gEntries);
    localStorage.setItem("Entries", json);
}

function signinEmployee(employeeID, password) {

    var employees = new Array();

    employees.push({ EmployeeID: "user1", Password: "pass1" });
    employees.push({ EmployeeID: "user2", Password: "pass2" });
    employees.push({ EmployeeID: "user3", Password: "pass3" });
    employees.push({ EmployeeID: "user4", Password: "pass4" });
    employees.push({ EmployeeID: "user5", Password: "pass5" });

    for (var i = 0; i < employees.length; i++) {

        if (employees[i].EmployeeID.toLowerCase() === employeeID.toLowerCase() && employees[i].Password === password) {
            return true;
        }
    }

    return false;
}

function validDate(dateString) {

    var date = new Date(dateString);

    if (date === "Invalid Date") {
        return false;
    }

    return true;
}
function tryParse(stringValue, maxDecimals) {
    var char;
    var dotFound = false;
    var numberDecimals = 0;

    if (stringValue === "") {
        return false;
    }

    for (var i = 0; i < stringValue.length; i++) {

        char = stringValue.charAt(i);

        if (char === ".") {
            if (dotFound === true) {
                return false;
            }
            dotFound = true;
        }
        else if (char === "-") {
            if (i > 0) {
                return false;
            }
        }
        else if (char < "0" || char > "9") {
            return false;
        }
        else {
            if (dotFound === true) {
                numberDecimals++;
                if (numberDecimals > maxDecimals) {
                    return false;
                }
            }
        }
    }
    return true;
}

function localStorageGet(token, defaultValue) {

    var value = localStorage.getItem(token);

    if (value === null) {
        return defaultValue;
    }

    return value;
}

function localStorageSet(token, value) {
    localStorage.setItem(token, value);
}

function sessionStorageGet(token, defaultValue) {

    var value = sessionStorage.getItem(token);

    if (value === null) {
        return defaultValue;
    }

    return value;
}

function sessionStorageSet(token, value) {
    sessionStorage.setItem(token, value);
}
function closeit(){
    var modal=document.getElementById('ModalEdit');
    modal.style.display = "none";
}
function end()
{
        document.getElementById('Modalcommon').style.display = "none";
}
function endDEL(val){
    document.getElementById('Modalcommon').style.display = "none";
    if(val==1)
    {
    gEntries.splice(gIndex, 1);
        saveEntries();
        location.href = "Main.html";
    }
    else
        return;
}
function endEdit(val){
    document.getElementById('Modalcommon').style.display = "none";
    if(val==1)
    {
        location.href = "Main.html";
    }
    else
        return;
}
function checkedit(val)
{
    if(val<0)
    {
        document.getElementById('ModalEdit').style.display = "none";
        return;
    }
    if((gEntries[val].EmployeeID===txtEmployeeIDEdit.value)&&(gEntries[val].DateWorked===txtDateWorked.value)&&(gEntries[val].HoursWorked===txtHoursWorked.value)&&(gEntries[val].Description===txtDescription.value))
    {
        document.getElementById('ModalEdit').style.display = "none";
        return;
    }
    else{
        document.getElementById("errtext").innerHTML="Are you sure you want to cancel any changes?";
         document.getElementById("btnk").style.display = "none";
        var modal=document.getElementById('Modalcommon').style.display = "block";
          document.getElementById("btnno").onclick = function() {endEdit(0);}
          document.getElementById("btnyes").onclick = function() {endEdit(1);}   
    }
}
function sort(val)
{
    getEntries();
    if(val==2){
       if(!sessionStorageGet("sortval2",false)){
             gEntries.sort(function(a, b) {
            return parseFloat(a.HoursWorked) - parseFloat(b.HoursWorked);});
        sessionStorageSet("sortval2",true);
        document.getElementById("col2").innerHTML="Hours\u2193";
        }
        else
        {
            gEntries.sort(function(a, b) {
            return parseFloat(b.HoursWorked)-parseFloat(a.HoursWorked) ;});
            sessionStorage.removeItem("sortval2");
            document.getElementById("col2").innerHTML="Hours\u2191";
        }
    }
    if(val==0){
        if(!sessionStorageGet("sortval0",false)){
             gEntries.sort(function(a, b) {
            return a.EmployeeID.localeCompare(b.EmployeeID);});
        sessionStorageSet("sortval0",true);
        document.getElementById("col0").innerHTML="Employee ID\u2193";
        }
        else
        {
            gEntries.sort(function(a, b) {
            return b.EmployeeID.localeCompare(a.EmployeeID);});
            sessionStorage.removeItem("sortval0");
            document.getElementById("col0").innerHTML="Employee ID\u2191";
        }
    }
    if(val==3){
        if(!sessionStorageGet("sortval3",false)){
             gEntries.sort(function(a, b) {
            return a.Description.localeCompare(b.Description);});
        sessionStorageSet("sortval3",true);
        document.getElementById("col3").innerHTML="Description\u2193";
        }
        else
        {
            gEntries.sort(function(a, b) {
            return b.Description.localeCompare(a.Description);});
            sessionStorage.removeItem("sortval3");
            document.getElementById("col3").innerHTML="Description\u2191";
        }
    }
    if(val==1){
         if(!sessionStorageGet("sortval1",false)){
             gEntries.sort(function(a, b) {
             return new Date(a.DateWorked) - new Date(b.DateWorked);});
        sessionStorageSet("sortval1",true);
        document.getElementById("col1").innerHTML="Date\u2193";
        }
        else
        {
            gEntries.sort(function(a, b) {
            return new Date(b.DateWorked) - new Date(a.DateWorked);});
            sessionStorage.removeItem("sortval1");
            document.getElementById("col1").innerHTML="Date\u2191";
        }
    }
    saveEntries();
    getEntries();
    divEntriesList.innerHTML = "";
    displayEntries();
}