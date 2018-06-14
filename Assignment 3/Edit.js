var ith;
var data=[];
var num;
function checklog()
{
		if(!localStorage.getItem("login")==true)
		window.location.href = "SignIn.html";
}
function load()
{
	checklog();
	ith=Number(localStorage.getItem("ithpos"));
    data=JSON.parse(localStorage.getItem("DATA"));
	num=Number(localStorage.getItem("size"));
	if(ith!=-1)
		num=ith;
    if(ith!=-1)
    {
    	document.getElementById("EmpID").value=data[num].empid;
		document.getElementById("Desc").value=data[num].desc;
		document.getElementById("HRwork").value=parseFloat(data[num].hrtime);
		document.getElementById("date").value=turndate(data[num].date);
		document.getElementById("bill").checked=data[num].billable;
    }
    else
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
	document.getElementById("date").value = today;
    }
    if(ith==-1&&data==null)
    {
    	data=[];
    	num=0;
    }
}
function savedata()
{
		if(document.getElementById("EmpID").value.length<1)
		{
			alert("Attn:\nThe Employee ID cannot be empty.");
			return;
		}
		if(document.getElementById("Desc").value.length<20)
		{
			alert("Attn:\nThe description cannot be less than 20 characters.");
			return;
		}
		if(!tryparse(document.getElementById("HRwork").value,2)||!parseFloat(document.getElementById("HRwork").value)>0||parseFloat(document.getElementById("HRwork").value)%0.25!=0||parseFloat(document.getElementById("HRwork").value)>4){
			alert("Attn:\nThe number of hours should be valid, greater than 0 ,less than 4 and should be in integral increments of 0.25");
			return;
		}
		if(!checkdate(document.getElementById("date").value))
		{
			alert("Attn:\nThe date has to be valid");
			return;	
		}
		data[num]=new Object();
		data[num].empid=document.getElementById("EmpID").value;
		data[num].desc=document.getElementById("Desc").value;
		data[num].date=datechange(document.getElementById("date").value);
		data[num].hrtime=parseFloat(document.getElementById("HRwork").value);
		data[num].valid=true;
		data[num].delete=false;
		data[num].billable=document.getElementById("bill").checked;
		if(!data[num].billable)
			data[num].billable=false;
		if (typeof(Storage) !== "undefined") {
			if(num==0)
				localStorage.setItem("size","0");
            if(ith==-1){
            	var ptr=Number(localStorage.getItem("size"))+1;
            	localStorage.removeItem("size");
            	localStorage.setItem("size", ptr);
		}
			localStorage.removeItem("DATA");
			localStorage.setItem("DATA", JSON.stringify(data));
		} else {
			alert("Unable to store data!");
		}
		window.location.href = "Main.html";
}
function tryparse(val,dec)
{
		var ctr=0;
		for(var i=0;i<val.length;i++)
		{
			if(i!=0&&val.charAt(i)=='-'){
				return false;
			}
			if(val.charAt(i)!='.'&&(!val.charAt(i)>47&&!val.charAt(i)<58)){
				return false;
			}
			if(val.charAt(i)=='.'&&ctr!=0){
				return false;
			}
			if(val.charAt(i)=='.'){
				ctr=1;
				continue;
			}
			if(ctr==1){
				dec--;
			}
			if(dec<0){
				return false;
			}
		}
		return true;
}
function checkdate(datestr)
{

		if(datestr.length>10)
			return false;
		return true;
}
function datechange(datestr)
{
	return datestr.substring(5,7)+"/"+datestr.substring(8)+"/"+datestr.substring(0,4);
}
function deletedata()
{
	if(ith!=-1)
		data[ith].delete=true;
	if (typeof(Storage) !== "undefined") {
			localStorage.removeItem("DATA");
			localStorage.setItem("DATA", JSON.stringify(data));
		} else {
			alert("Unable to store data!");
		}
	window.location.href = "Main.html";
}
function turndate(val)
{
	var ret=val.substring(6)+"-"+val.substring(0,2)+"-"+val.substring(3,5);
	return ret;
}