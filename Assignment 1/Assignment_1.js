var ch_amt;
var sa_tax;
var tip1;
function takeinput()				
{
  var ctr=0;
  if(tryparse(check_amt.value,2)&& parseFloat(document.getElementById("check_amt").value)>0)
  {
    ch_amt=parseFloat(document.getElementById("check_amt").value);
  }
  else {
        ctr=ctr+1;
        document.getElementById("check_amt").focus();
        alert("Attn:\nThe Check amount has to be a positive number with at most of two decimal places.");
  }
  if(tryparse(sale_tax.value,2)&& parseFloat(document.getElementById("sale_tax").value)>0)
  {
    sa_tax=parseFloat(document.getElementById("sale_tax").value);
  }
  else {
        ctr=ctr+1;
	document.getElementById("sale_tax").focus();
        alert("Attn:\nThe Sale tax percentage has to be a positive number with at most of two decimal places.");
  }
  if(tryparse(tip.value,2)&& parseFloat(document.getElementById("tip").value)>0)
  {
    tip1=parseFloat(document.getElementById("tip").value);
  }
  else {
        ctr=ctr+1;
	document.getElementById("tip").focus();
        alert("Attn:\nThe Tip percentage has to be a positive number with at most of two decimal places.");
  }

  if(ctr==0)
    return true;
  return false;
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

function pretax()
{
  if(takeinput())
  {
    var b_amt=(ch_amt*100)/(100+sa_tax);
    b_amt=Math.round(b_amt*100)/100;
    document.getElementById("sale_tax_out").value=Math.round((ch_amt-b_amt)*100)/100;
    document.getElementById("tip_out").value=Math.round(((b_amt*tip1)/100)*100)/100;
  }
}
function posttax()
{
  if(takeinput())
  {
    var b_amt=(ch_amt*100)/(100+sa_tax);
    b_amt=Math.round(b_amt*100)/100;
    document.getElementById("sale_tax_out").value=Math.round((ch_amt-b_amt)*100)/100;
    document.getElementById("tip_out").value=Math.round(((ch_amt*tip1)/100)*100)/100;
  }
}
