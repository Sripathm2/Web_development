"use strict";
var gMode;
var gIndex;
var gEntry;
var gCurrentEmployeeID;
var gEntries;
var ctr=0;
var gotresponse=0;
var cur_url="";
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
       var modal=document.getElementById('ModalSignIn');
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
    btnRefresh.onclick = btnRefresh_onclick;

    txtDescContains.value = sessionStorageGet("txtDescContains", "");
    txtDateFrom.value     = sessionStorageGet("txtDateFrom", "");
    txtDateThrough.value  = sessionStorageGet("txtDateThrough", "");
    chkShowCurrEmp.value  = sessionStorageGet("chkShowCurrEmp", false);

    getEntries();
}
function btnSignIn_click() {
    signinEmployee(txtEmployeeID.value, txtPassword.value);
}
function signinEmployee(employeeID, password) {

    var url = "http://cs390-hw5.herokuapp.com/";
    fetch(url+"auth/login",{
     method: 'POST',
     body: JSON.stringify({
     employeeID: employeeID,
     password: password
     }),
     headers: {
       'content-type': 'application/json' //Tell the server what format we're using
    }
    })
    .then((resp) => resp.json()) // Transform the data into json
    .then(function(responseData) {
        console.log(responseData.message);
        if(responseData.message==="success")
          gotresponse=1;
        else 
          gotresponse=-1;
         Signinfinal()
    });
}
function Signinfinal(){
    if (gotresponse==-1) {
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
function getEntries() {

    var url = "http://cs390-hw5.herokuapp.com/";
    fetch(url+"timelogs",{
     method: 'GET',
     })
    .then((resp) => resp.json()) // Transform the data into json
    .then(function(responseData) {
        console.log(responseData.message);
        gEntries =[];
        gEntries=responseData;
            displayEntries();
    });
}
function displayEntries() {

    var totalHoursWorked = 0;

    for (var i = 0; i < gEntries.length; i++) {

        var entry = gEntries[i];
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
        col2.innerHTML = entry.DateWorked.substring(0,10);
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
    lblTotalHoursWorked.innerHTML = "Total Hours Worked: " + totalHoursWorked.toFixed(2).toString();
}
function row_ondblclick() {
    edit(this.Index);
}
function edit(val){
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
    
    gEntry = gEntries[val];
    gIndex=val;
    txtEmployeeIDEdit.value  = gEntry.EmployeeID;
    txtHoursWorked.value = gEntry.HoursWorked;
    txtDateWorked.value  = gEntry.DateWorked.substring(0,10);
    chkBillable.checked  = gEntry.Billable;
    txtDescription.value = gEntry.Description;
}
function btnRefresh_onclick() {
    cur_url="";
    divEntriesList.innerHTML = "";
    sessionStorageSet("txtDescContains", txtDescContains.value);
    sessionStorageSet("txtDateFrom"    , txtDateFrom.value);
    sessionStorageSet("txtDateThrough" , txtDateThrough.value);
    sessionStorageSet("chkShowCurrEmp" , chkShowCurrEmp.value);
    var url = "http://cs390-hw5.herokuapp.com/timelogs";
    
    if (txtDescContains.value != "") {
        url+="?descContains="+txtDescContains.value;
        cur_url+="&descContains="+txtDescContains.value;
    }
    if(chkShowCurrEmp.checked === true){
        if(url.indexOf('?')==-1){
            url+="?forEmployeeID="+gCurrentEmployeeID;
            cur_url+="&forEmployeeID="+gCurrentEmployeeID;
        }
        else{
            url+="&forEmployeeID="+gCurrentEmployeeID;
            cur_url+="&forEmployeeID="+gCurrentEmployeeID;

        }
    }
    if (validDate(txtDateFrom.value)) {
       if(url.indexOf('?')==-1){
            url+="?dateFrom="+txtDateFrom.value;
            cur_url+="&dateFrom="+txtDateFrom.value;

       }
        else{
            url+="&dateFrom="+txtDateFrom.value;
            cur_url+="&dateFrom="+txtDateFrom.value;
        }
    }
     if (validDate(txtDateThrough.value)) {
        if(url.indexOf('?')==-1){
            url+="?dateTo="+txtDateThrough.value;
            cur_url+="&dateTo="+txtDateThrough.value;
        }
        else{
            url+="&dateTo="+txtDateThrough.value;
            cur_url+="&dateTo="+txtDateThrough.value;
        }
    }
    fetch(url,{
     method: 'GET',
     })
    .then((resp) => resp.json()) // Transform the data into json
    .then(function(responseData){
        console.log(responseData.message);
        gEntries =[];
        gEntries=responseData;
            displayEntries();
    });
}
function sort(val){
    document.getElementById("col0").innerHTML="Employee ID";
    document.getElementById("col1").innerHTML="Date";
    document.getElementById("col2").innerHTML="Hours";
    document.getElementById("col3").innerHTML="Description";
    if(val==0){
        if(!sessionStorageGet("sortval0",false)){
            var url = "http://cs390-hw5.herokuapp.com/";
            fetch(url+"timelogs?sortBy=EmployeeID&orderBy=asc"+cur_url,{
            method: 'GET',
             })
            .then((resp) => resp.json()) 
            .then(function(responseData) {
                console.log(responseData.message);
                gEntries =[];
                gEntries=responseData;
                displayEntries();
                document.getElementById("col0").innerHTML="Employee ID\u2193";
             });
            sessionStorageSet("sortval0",true);
            
        }
        else
        {
            var url = "http://cs390-hw5.herokuapp.com/";
            fetch(url+"timelogs?sortBy=EmployeeID&orderBy=desc"+cur_url,{
            method: 'GET',
             })
            .then((resp) => resp.json()) 
            .then(function(responseData) {
                console.log(responseData.message);
                gEntries =[];
                gEntries=responseData;
                displayEntries();
                document.getElementById("col0").innerHTML="Employee ID\u2191";
             });
            sessionStorage.removeItem("sortval0");
        }
    }
    if(val==1){
        if(!sessionStorageGet("sortval1",false)){
            var url = "http://cs390-hw5.herokuapp.com/";
            fetch(url+"timelogs?sortBy=DateWorked&orderBy=asc"+cur_url,{
            method: 'GET',
             })
            .then((resp) => resp.json()) 
            .then(function(responseData) {
                console.log(responseData.message);
                gEntries =[];
                gEntries=responseData;
                displayEntries();
                document.getElementById("col1").innerHTML="Date\u2193";
             });
            sessionStorageSet("sortval1",true);
            
        }
        else
        {
            var url = "http://cs390-hw5.herokuapp.com/";
            fetch(url+"timelogs?sortBy=DateWorked&orderBy=desc"+cur_url,{
            method: 'GET',
             })
            .then((resp) => resp.json()) 
            .then(function(responseData) {
                console.log(responseData.message);
                gEntries =[];
                gEntries=responseData;
                displayEntries();
                document.getElementById("col1").innerHTML="Date\u2191";
             });
            sessionStorage.removeItem("sortval1");
        }
    }
    if(val==2){
       if(!sessionStorageGet("sortval2",false)){
            var url = "http://cs390-hw5.herokuapp.com/";
            fetch(url+"timelogs?sortBy=HoursWorked&orderBy=asc"+cur_url,{
            method: 'GET',
             })
            .then((resp) => resp.json()) 
            .then(function(responseData) {
                console.log(responseData.message);
                gEntries =[];
                gEntries=responseData;
                displayEntries();
                document.getElementById("col2").innerHTML="Hours\u2193";
             });
            sessionStorageSet("sortval2",true);
            
        }
        else
        {
            var url = "http://cs390-hw5.herokuapp.com/";
            fetch(url+"timelogs?sortBy=HoursWorked&orderBy=desc"+cur_url,{
            method: 'GET',
             })
            .then((resp) => resp.json()) 
            .then(function(responseData) {
                console.log(responseData.message);
                gEntries =[];
                gEntries=responseData;
                displayEntries();
                document.getElementById("col2").innerHTML="Hours\u2191";
             });
            sessionStorage.removeItem("sortval2");
        }
    }
    if(val==3){
       if(!sessionStorageGet("sortval3",false)){
            var url = "http://cs390-hw5.herokuapp.com/";
            fetch(url+"timelogs?sortBy=Description&orderBy=asc"+cur_url,{
            method: 'GET',
             })
            .then((resp) => resp.json()) 
            .then(function(responseData) {
                console.log(responseData.message);
                gEntries =[];
                gEntries=responseData;
                displayEntries();
                document.getElementById("col3").innerHTML="Description\u2193";
             });
            sessionStorageSet("sortval3",true);
            
        }
        else
        {
            var url = "http://cs390-hw5.herokuapp.com/";
            fetch(url+"timelogs?sortBy=Description&orderBy=desc"+cur_url,{
            method: 'GET',
             })
            .then((resp) => resp.json()) 
            .then(function(responseData) {
                console.log(responseData.message);
                gEntries =[];
                gEntries=responseData;
                displayEntries();
                document.getElementById("col3").innerHTML="Description\u2191";
             });
            sessionStorage.removeItem("sortval3");
        }
    }
    
    divEntriesList.innerHTML = "";
}
function validDate(dateString) {

    var date = new Date(dateString);

    if (date === "Invalid Date") {
        return false;
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
function end(){
    document.getElementById('Modalcommon').style.display = "none";
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
function checkedit(val){
        document.getElementById('ModalEdit').style.display = "none";
        return;
}
