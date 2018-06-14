function main()
{

    var signin=new Vue({
        el: '#signin',
        data: {
            show: true,
            password: '',
            userid: '',
            auth:''
        },
        methods: {
            signin: function (event) {
                var url = "http://localhost:8000/auth/signin";
                fetch(url,{
                    method: 'POST',
                    body: JSON.stringify({
                        userID: this.userid,
                        password: this.password
                    }),
                    headers: {
                        'content-type': 'application/json' //Tell the server what format we're using
                    }
                })
                    .then((resp) => resp.json()) // Transform the data into json
            .then(function(responseData) {
                    console.log(responseData.message);
                    if(responseData.message==="success")
                    {
                        signin.auth=responseData.authToken;
                        signin.show=false;
                        signinerror.showerrorsign=false;
                        search.showsearch=true;
                        switcher.showswitch=true;
                        switcher.picked='searchpick';
                        result.showresult=true;
                    }
                    else
                    {
                        signinerror.showerrorsign=true;
                    }
                });
            }
        }
    })
    var signinerror=new Vue({
        el: '#Singinerror',
        data:{
            showerrorsign:false
        }
    })

    var switcher=new Vue({
        el: '#switch',
        data: {
            showswitch: false,
            picked:'searchpick'
        },
        methods: {
            switchTosearch: function (event) {
                search.showsearch=true;
                add.showadd=false;
            },
            switchToadd: function (event) {
                search.showsearch=false;
                add.showadd=true;
            }
        }
    })

    var search=new Vue({
        el: '#search',
        data: {
            showsearch: false,
            QuestionContains: '',
            Cattitle:'',
            airdate:'',
            dvalue:'',
            anstxt:'',
            shownum:'',
            auth:' '
        },
        methods: {
            search: function (event) {
                var url = "http://localhost:8000/questions?auth="+signin.auth;

                if(this.QuestionContains!=='')
                    url=url+"&questText="+this.QuestionContains;
                if(this.Cattitle!=='')
                    url=url+"&categoryTitle="+this.Cattitle;
                if(this.airdate!=='')
                    url=url+"&airDate="+this.airdate;
                if(this.dvalue!=='')
                    url=url+"&dollarValue="+this.dvalue;
                if(this.anstxt!=='')
                    url=url+"&answerText="+this.anstxt;
                if(this.shownum!=='')
                    url=url+"&showNumber="+this.shownum;
                fetch(url,{
                    method: 'GET',
                })
                .then((resp) => resp.json())
                .then(function(responseData) {
                    if(responseData.message==="too_many_results")
                    {
                        alert("too many results please narrow your search");
                        result.items=[];
                        return;
                    }
                    if(responseData.message==="invalid_data"){
                        alert("no result found");
                        result.items=[];
                        return;
                    }
                    result.items=responseData;
                    if(responseData.length==0)
                        result.items=[];
                });
            }
        }
    })


    var add=new Vue({
        el: '#add',
        data: {
            showadd: false,
            Questiontext: '',
            airdateadd:'',
            dvalueadd:'',
            anstxtadd:'',
            shownumadd:'',
            auth:' ',
            selected:'1 HISTORY'
        },
        created: function () {
            var url = "http://localhost:8000/getlist?auth=pass"+signin.auth;
            fetch(url,{
                method: 'GET',
            })
                .then((resp) => resp.json())
            .then(function(responseData) {
                var data=[];
                data=responseData;
                var arr=[];
                for(var i=0;i<data.length;i++) {
                    arr[i] = new Object();
                    arr[i].text = data[i].CategoryCode + " " + data[i].CategoryTitle;
                    arr[i].value = data[i].CategoryCode + " " + data[i].CategoryTitle;
                }
                add.options=arr;
            });
        },
        methods: {
            save: function (event) {
                adderror.showadderror=false;
                var url = "http://localhost:8000/questionadd?auth="+signin.auth;
                fetch(url,{
                    method: 'POST',
                    body: JSON.stringify({
                        categoryTitle:this.selected.substring(this.selected.indexOf(' ')+1),
                        categoryCode:this.selected.substring(0,this.selected.indexOf(' ')),
                        airDate:this.airdateadd,
                        questText:this.Questiontext,
                        answerText:this.anstxtadd,
                        showNumber:this.shownumadd,
                        dollarValue:this.dvalueadd
                    }),
                    headers: {
                        'content-type': 'application/json' //Tell the server what format we're using
                    }
                })
                    .then((resp) => resp.json()) // Transform the data into json
            .then(function(responseData) {
                    if(responseData.message==="success")
                    {
                        switcher.switchTosearch();
                        switcher.picked="searchpick";
                    }
                    else
                    {
                        adderror.msg=responseData.message;
                        adderror.showadderror=true;
                    }
                });
                
            },
            cancel: function (event) {
                switcher.switchTosearch();
                switcher.picked="searchpick";
            }
        }

    })
    var adderror=new Vue({
        el: '#Adderror',
        data:{
            showadderror:false,
            msg:' ',
        }
    })

    Vue.component('result-list', {
        template: '\
    <li class="resultpane">\
      <label class="resultlabel2">Air Date: {{ airdate }}</label>\
      <br>\
      <label id="qtext">Question Text {{ questiontext }}</label>\
      <label id="atext">Answer Text {{answertext}}</label>\
      <br>\
      <label class="resultlabel1">Category Title {{ categorytitle }}</label>\
      <br>\
      <label class="resultlabel3">Dollar Value {{ dollarvalue }}</label>\
      <br>\
      <label class="resultlabel1">Show Number {{ shownumber }}</label>\
      <br>\
      <button v-on:click="check()">Delete</button>\
      <div v-if="showfinopt">\
      <label>Do you want to delete this Question</label>\
      <button v-on:click="checkfinal()">Delete</button>\
      <button v-on:click="cancel()">Cancel</button>\
      </div>\
      </li>\
      ',
        data: function () {
            return {
                showfinopt: false
            }
        },
        methods:{
            check: function()
            {
                this.showfinopt=true;
            },
            checkfinal: function()
            {
                this.showfinopt=false;
                var url = "http://localhost:8000/delete?auth="+signin.auth+"&Questiontext="+this.questiontext;
                fetch(url,{
                    method: 'GET',
                })
                .then((resp) => resp.json())
                .then(function(responseData) {
                search.search();
            });
            },
            cancel: function()
            {
                this.showfinopt=false;
            }
        },
        props: ['airdate','answertext','categorytitle','dollarvalue','questiontext','shownumber']
    })
    var result=new Vue({
        el: '#result',
        data: {
            showresult:false,
            items:[]
        },
        methods:{
            check: function (event) {
            }
        }
    })
}