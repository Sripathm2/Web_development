var data=[];
var num=0;
function getdata()
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

	var totalHrs=0;
	data=JSON.parse(localStorage.getItem("DATA"));;
	num=Number(localStorage.size);
	if(data!=null){
		var table = document.getElementById("table");
		while(table.rows.length > 1) {
			table.deleteRow(1);
		}
		for(var i=0;i<data.length;i++)
		{
			if(data[i].enable==false)
				continue;
			var table = document.getElementById("table1");
			var row = table.insertRow(1);
			var cell1 = row.insertCell(0);
			var cell2 = row.insertCell(1);
			var cell3 = row.insertCell(2);
			var cell4 = row.insertCell(3);
			row.insertCell(4);
			cell1.innerHTML = data[i].empid;
			cell2.innerHTML = data[i].date;
			cell3.innerHTML = data[i].hrtime;
			cell4.innerHTML = data[i].desc;
			totalHrs=totalHrs+Number(data[i].hrtime);
			var butt = document.createElement('input');
			butt.setAttribute('type','button');
			butt.setAttribute('value','Delete');
			butt.setAttribute('onclick',"deleterow("+i+")");
			row.cells[4].appendChild(butt);
		}
		for(var i=data.length-1;i>-1;i--)
		{
			if(data[i].enable==true){
				document.getElementById("EmpID").value=data[i].empid;
				break;
			}
			
		}
	}
	else
	{
		data=[];
		num=0;
	}
	document.getElementById("totalhrsworked").innerHTML = "Total Hours worked:"+totalHrs;
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
		data[num].enable=true;
		data[num].billable=document.getElementById("bill").checked;
		if(!data[num].billable)
			data[num].billable=false;
		if (typeof(Storage) !== "undefined") {
			if(num==0)
				localStorage.setItem("size","0");
			localStorage.size=Number(localStorage.size)+1;
			localStorage.removeItem("DATA");
			localStorage.setItem("DATA", JSON.stringify(data));
		} else {
			alert("Unable to store data!");
		}
		location.reload();
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
function deleterow(value)
{
	if (confirm("Comfirm: You want to delete this entry?") == false) {
    	location.reload();
    	return;
	}
	data[value].enable=false;
	localStorage.removeItem("DATA");
	localStorage.setItem("DATA", JSON.stringify(data));
	location.reload();
}