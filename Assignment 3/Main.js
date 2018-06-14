var data=[];
var num=0;
function checklog()
{
	if(!localStorage.getItem("login")==true)
		window.location.href = "SignIn.html";
}
function reload()
{
	var today = new Date();
	var dd = today.getDate();
	var mm = today.getMonth()+1;
	var yyyy = today.getFullYear();
	if(dd<10) {
		dd = '0'+dd
	}	 
	if(mm<10) {
		mm = '0'+mm
	} 
	today = yyyy + '-' + mm + '-' + dd;

	checklog();
	var obj=JSON.parse(localStorage.getItem("filters"));
	if(obj!=null){
		document.getElementById("con").value=obj.con;
		document.getElementById("date1").value=obj.date1;
		document.getElementById("date2").value=obj.date2;
	if(obj.emponly)
		document.getElementById("semponly").checked=true;
	}
	data=JSON.parse(localStorage.getItem("DATA"));
	var totalHrs=0;
	if(data!=null){

		var table = document.getElementById("table");
		while(table.rows.length > 1) {
			table.deleteRow(1);
		}
		for(var i=0;i<data.length;i++)
		{
			if(data[i].valid==false||data[i].delete==true)
				continue;
			var table = document.getElementById("table1");
			var row = table.insertRow(1);
			var cell1 = row.insertCell(0);
			var cell2 = row.insertCell(1);
			var cell3 = row.insertCell(2);
			var cell4 = row.insertCell(3);
			cell1.innerHTML = data[i].empid;
			cell2.innerHTML = data[i].date;
			cell3.innerHTML = data[i].hrtime;
			cell4.innerHTML = data[i].desc;
  			cell1.setAttribute("onclick", "edit("+i+")");
  			cell2.setAttribute("onclick", "edit("+i+")");
  			cell3.setAttribute("onclick", "edit("+i+")");
  			cell4.setAttribute("onclick", "edit("+i+")");
  			totalHrs=totalHrs+Number(data[i].hrtime);
	}
	
	}
	else
	{
			data=[];
			num=0;
		}
	document.getElementById("totalhrsworked").innerHTML = "Total Hours worked:"+totalHrs;
}
function recheck()
{
	var arrobj= new Object();
	var checkcon=true;
	arrobj.con="";
	arrobj.date1=document.getElementById("date1").value;
	arrobj.date2=document.getElementById("date2").value;
    arrobj.emponly=document.getElementById("semponly").checked;
	if(document.getElementById("con").value.length>0)
		arrobj.con=document.getElementById("con").value;
	else{
		arrobj.con="";
		checkcon=false;
	}
	if(!checkdate(document.getElementById("date1").value))
	{
			alert("Attn:\nThe date has to be valid");
			return;	
	}
	if(!arrobj.emponly)
		arrobj.emponly=false;
	if (typeof(Storage) !== "undefined") {
		localStorage.removeItem("filters");
		localStorage.setItem("filters",JSON.stringify(arrobj) );
	} else {
		alert("Unable to store data!");
	}
	for(var i=0;i<data.length;i++)
	{
	if(data[i].delete==false)
		data[i].valid=true;
	}
for(var i=0;i<data.length;i++)
{
	if(arrobj.emponly&&data[i].empid.toUpperCase().indexOf(localStorage.getItem("loginid").toUpperCase())==-1){
      data[i].valid=false;
	}
	if(checkcon&&data[i].desc.indexOf(arrobj.con)==-1)
		data[i].valid=false;
	if(!dateabove(datechange(arrobj.date1),data[i].date))
		data[i].valid=false;
	if(!datebelow(datechange(arrobj.date2),data[i].date))
		data[i].valid=false;
}
if (typeof(Storage) !== "undefined") {
			localStorage.removeItem("DATA");
			localStorage.setItem("DATA", JSON.stringify(data));
		} else {
			alert("Unable to store data!");
		}
		window.location.href = "Main.html";
}
function edit(val)
{
	if (typeof(Storage) !== "undefined") {
		localStorage.removeItem("ithpos");
		localStorage.setItem("ithpos", val);
	} else {
		alert("Unable to store data!");
	}
	window.location.href = "Edit.html";
}
function datebelow(val1, val2)
{
	if(val1.length<9)
		return true;
	var ey=parseFloat(val1.substring(6));
	var cy=parseFloat(val2.substring(6));
	if(cy<=ey)
	{
		var em=parseFloat(val1.substring(0,2));
		var cm=parseFloat(val2.substring(0,2));
		if((cy==ey&&cm<=em)||(cy!=ey))
		{
			var ed=parseFloat(val1.substring(3,5));
			var cd=parseFloat(val2.substring(3,5));
			if((cy==ey&&cm==em&&cd<=ed)||(cy!=ey&&cm!=em))
				return true;
		}
	}
	return false;
}
function checkdate(datestr)
{

		if(datestr.length>10)
			return false;
		return true;
}
function dateabove(val,val2)
{	
	if(val.length<9)
		return true;
	var sy=parseFloat(val.substring(6));
	var cy=parseFloat(val2.substring(6));
	if(cy>=sy)
	{
		var sm=parseFloat(val.substring(0,2));
		var cm=parseFloat(val2.substring(0,2));
		if((cy==sy&&cm>=sm)||(cy!=sy))
		{
			var sd=parseFloat(val.substring(3,5));
			var cd=parseFloat(val2.substring(3,5));
			if((cy==sy&&cm==sm&&cd>=sd)||(cy!=sy&&cm!=sm)){
				return true;
			}
		}
	}
	return false;
}
function datechange(datestr)
{
	return datestr.substring(5,7)+"/"+datestr.substring(8)+"/"+datestr.substring(0,4);
}