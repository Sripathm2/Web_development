var Empidarr = ["Emp1", "Emp2", "Emp3","Emp4","Emp5"];
var pswdarr = ["Emp1", "Emp2", "Emp3","Emp4","Emp5"];
function mainSignIn()
{
	if(localStorage.getItem("savelogin")==true)
	{
		document.getElementById("EmpID").value =localStorage.getItem("loginid");
		document.getElementById("pswd").focus();
	}
}
function Sign()
{
	if(document.getElementById("EmpID").value.length<1)
	{
		alert("Attn:\nThe Employee ID cannot be empty.");
		return;
	}
	if(document.getElementById("pswd").value.length<1)
	{
		alert("Attn:\nThe Password cannot be empty.");
		return;
	}
	empid=document.getElementById("EmpID").value;
	emppswd=document.getElementById("pswd").value;
	var ctr=checksignin(empid,emppswd);
	if(ctr==0)
	{
		alert("Attn:\nIncorrect Employee ID and/or password.");
		return;
	}
	var store=document.getElementById("remem").checked;
	if (typeof(Storage) !== "undefined") {
		if(store){
			localStorage.removeItem("savelogin");
			localStorage.setItem("savelogin", true);
		}
		else
		{
			localStorage.removeItem("savelogin");
			localStorage.setItem("savelogin", false);
		}
		localStorage.removeItem("loginid");
		localStorage.setItem("loginid", empid);
		localStorage.removeItem("login");
		localStorage.setItem("login",true);
	} else {
		alert("Unable to store data!");
	}
	window.location.href = "Main.html";
}
function checksignin(empid,emppswd)
{
	for(var i=0;i<Empidarr.length;i++)
	{
		if(empid.toUpperCase()===Empidarr[i].toUpperCase()&&emppswd===pswdarr[i])
			return 1;
	}
	return 0;
}
