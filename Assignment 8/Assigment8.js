
function main(){
var app = new Vue({
  el: '#app',
  data: {
    amt: ' ',
    tax: '7',
    tip: '18',
    a: "a",
    b: "b",
    pick: 'a',
    errortip: ' ',
    errorsalestax: ' ',
    errorcheckamt: ' '
  },
  computed: {
    taxamt: function () {
        this.errortip=" ";
        this.errorsalestax=" ";
        this.errorcheckamt=" ";

        if(!tryParse(this.amt,2)||parseFloat(this.amt)<0){
            this.errorcheckamt="Check Amount is required and must be a valid number > zero.";
            return " ";
        }

        if(!tryParse(this.tax,2)||parseFloat(this.tax)<0){
            this.errorsalestax="Sales Tax Percent is required and must be a valid number > zero.";
            return " ";
        }

        if(!tryParse(this.tip,2)||parseFloat(this.tip)<0){
            this.errortip="Tip Percent is required and must be a valid number > zero.";
            return " ";
        }

        return  (parseFloat(this.amt) - (parseFloat(this.amt) / (1 + (parseFloat(this.tax) / 100)))).toFixed(2);
    },
    tipamt: function () {
        this.errortip=" ";
        this.errorsalestax=" ";
        this.errorcheckamt=" ";

        if(!tryParse(this.amt,2)||parseFloat(this.amt)<0){
            this.errorcheckamt="Check Amount is required and must be a valid number > zero.";
            return " ";
        }

        if(!tryParse(this.tax,2)||parseFloat(this.tax)<0){
            this.errorsalestax="Sales Tax Percent is required and must be a valid number > zero.";
            return " ";
        }

        if(!tryParse(this.tip,2)||parseFloat(this.tip)<0){
            this.errortip="Tip Percent is required and must be a valid number > zero.";
            return " ";
        }
        if(this.pick===this.a)
            return ((parseFloat(this.amt) - (parseFloat(this.amt) - (parseFloat(this.amt) / (1 + (parseFloat(this.tax) / 100))))) * (parseFloat(this.tip) / 100)).toFixed(2);
        else
             return ((parseFloat(this.amt) * (parseFloat(this.tip))/ 100)).toFixed(2);
    }
  }
})
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
