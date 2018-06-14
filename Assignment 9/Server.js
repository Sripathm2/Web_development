var express = require('express');
var bodyParser = require('body-parser');
var sqlite3 = require('sqlite3').verbose();
var uuidv1 = require('uuid/v1');
var port = process.env.PORT || 8000;
var db = new sqlite3.Database('Jeopardy.db');
var cors = require('cors');
var app = express();
var ctr=0;
app.use(cors());
app.use(bodyParser.urlencoded({
    extended:true
}));
app.use(bodyParser.json());
var server = app.listen(port, function() {
    console.log(`App listening on port ${port}`);
});

app.post('/auth/signin', function(req, res) {
    var {userID,password} = req.body;
    var params = [];
    if(userID==null||password==null||userID.length<1||password.length<1)
    {
        return res.status(400).json(
            {message: "invalid_data"});
    }
    var currentQuery = "SELECT * FROM Users WHERE lower(UserID) = \""+userID.toLowerCase()+"\"";
    db.all(currentQuery, params, function(err, result) {
        if(err) {
            return res.status(500).json({message: "Internal server error"});
        }
        else {
            if(result.length>0&&result[0].UserPassword==password){
                var AuthToken=uuidv1();
                var start = Date.now();
                var currentQuery1="UPDATE users SET AuthToken= \""+AuthToken+"\",AuthTokenIssued="+start.toString()+" WHERE lower(UserID) = \""+userID.toLowerCase()+"\"";
                db.run(currentQuery1, params, function(err1, result) {
                    if(err1) {
                        return res.status(500).json({message: "Internal server error2"});
                    }
                    else {
                        return res.status(200).json({message: "success",authToken:AuthToken});
                    }
                });
            }
            else{

                return res.status(401).json({message: "invalid_credentials"});
            }
        }
    });
});

app.get('/questions', function(req, res) {
    var {auth,categoryTitle,airDate,questText,dollarValue,answerText,showNumber} = req.query;
    var params1 = [];
    if(auth==null)
        return res.status(400).json({message: "unauthorized access"});
    var currentQuery1 = "SELECT * FROM Users WHERE AuthToken = \""+auth+"\"";
    db.all(currentQuery1, params1, function(err, result) {
        if(err) {
            return res.status(400).json({message: "unauthorized access"});
        }
        else {
            if(result.length==0)
                return res.status(400).json({message: "unauthorized access"});
            var  end=new Date();
            var totaltime=end-result[0].AuthTokenIssued;
            if((totaltime/60000)>60){
                return res.status(400).json({message:"auth token expired"});
            }
            else {
                var params = [];
                var currentQuery = "SELECT Categories.CategoryTitle, Questions.AirDate, Questions.QuestionText, Questions.DollarValue, Questions.AnswerText, Questions.ShowNumber FROM Questions,Categories"+
                    " WHERE Categories.CategoryTitle IS NOT NULL AND Categories.CategoryCode = Questions.CategoryCode"+
                    " AND Questions.DollarValue IS NOT NULL"+
                    " And Questions.QuestionText IS NOT NULL"+
                    " And Questions.AirDate IS Not NULL"+
                    " AND Questions.AnswerText IS Not NULL"+
                    " And Questions.ShowNumber IS Not NULL"+
                    " ORDER bY AirDate DESC";
                if(categoryTitle!=null){
                    currentQuery=currentQuery.replace("Categories.CategoryTitle IS NOT NULL","lower(Categories.CategoryTitle) = \""+categoryTitle.toLowerCase()+"\"");
                }
                if(dollarValue!=null){
                    currentQuery=currentQuery.replace("Questions.DollarValue IS NOT NULL"," Questions.DollarValue = "+dollarValue);
                }
                if(airDate!=null){
                    currentQuery=currentQuery.replace(" Questions.AirDate IS Not NULL","  Questions.AirDate = \""+airDate+"\"");
                }
                if(questText!=null){
                    currentQuery=currentQuery.replace("Questions.QuestionText IS NOT NULL","lower(Questions.QuestionText) LIKE \"%"+questText.toLowerCase()+"%\"");
                }
                if(answerText!=null){
                    currentQuery=currentQuery.replace("Questions.AnswerText IS Not NULL","lower(Questions.AnswerText) LIKE \"%"+answerText.toLowerCase()+"%\"");
                }
                if(showNumber!=null){
                    currentQuery=currentQuery.replace("Questions.ShowNumber IS Not NULL","Questions.ShowNumber = \""+showNumber+"\"");
                }
                db.all(currentQuery, params, function(err, rows) {
                    if(err) {
                        return res.status(500).json({message: "Internal server error"});
                    }
                    else {
                        if(rows.length==0)
                            return res.status(400).json({message: "invalid_data"});
                        if(rows.length>5000)
                            return res.status(400).json({message: "too_many_results"});
                        return res.status(200).json(rows);
                    }
                });
            }
        }
    });
});

app.post('/questionadd', function(req, res) {
    var {categoryCode,categoryTitle,airDate,questText,dollarValue,answerText,showNumber} = req.body;
    var {auth}=req.query;
    var params1 = [];
    if(auth==null)
        return res.status(400).json({message: "unauthorized access"});
    console.log(auth);
    var currentQuery1 = "SELECT * FROM Users WHERE AuthToken = \""+auth+"\"";
    db.all(currentQuery1, params1, function(err, result) {
        if(err) {
            return res.status(400).json({message: "unauthorized access"});
        }
        else {
            if(result.length==0)
                return res.status(400).json({message: "unauthorized access"});
            var  end=new Date();
            var totaltime=end-result[0].AuthTokenIssued;
            if((totaltime/60000)>60){
                return res.status(400).json({message:"auth token expired"});
            }
            else {
                var params = [];
                if(categoryCode==null||categoryCode.length<1){
                    return res.status(400).json({message: "categoryCode cannot be null"});
                }
                if(categoryTitle==null||categoryTitle.length<1){
                    return res.status(400).json({message: "categoryTitle cannot be null"});
                }
                if(airDate==null||airDate.length<1){
                    return res.status(400).json({message: "airDate cannot be null"});
                }
                if(questText==null||questText.length<1){
                    return res.status(400).json({message: "questText cannot be null"});
                }
                if(answerText==null||answerText.length<1){
                    return res.status(400).json({message: "answerText cannot be null"});
                }
                if(showNumber==null||isNaN(showNumber)||parseFloat(showNumber)<1||!tryParse(showNumber,0)){
                    return res.status(400).json({message: "showNumber has to be a valid Integer greater than 0"});
                }
                if(dollarValue==null||isNaN(dollarValue)||parseFloat(dollarValue)<100||parseFloat(dollarValue)>2000||!tryParse(dollarValue,0)||(parseFloat(dollarValue)!=100&&parseFloat(dollarValue)%200!=0)){
                    return res.status(400).json({message: "dollarValue has to be a valid number in even multiples of 100 from 100 to 2000"});
                }
                var currentQuery="SELECT * FROM  Categories WHERE lower(CategoryTitle) = \""+categoryTitle.toLowerCase()+"\" OR lower(CategoryCode)=\""+categoryCode.toLowerCase()+"\"";
                db.all(currentQuery, params, function(err, rows) {
                    if(err) {
                        return res.status(500).json({message: "Internal server error"});
                    }
                    else {
                        if(rows.length!=1&&rows.length!=0){
                            return res.status(400).json({message: "Invalid CategoryTitle or CategoryCode"});
                        }
                        if(rows.length!=0){
                            if(rows[0].CategoryTitle!=categoryTitle)
                                return res.status(400).json({message: "Invalid CategoryTitle"});
                            if(rows[0].CategoryCode!=categoryCode)
                                return res.status(400).json({message: "Invalid CategoryCode"});
                        }
                        if(rows.length==0)
                            var ctr=true;
                        var params2=[];
                        var currentQuery2 = "INSERT OR IGNORE INTO Categories VALUES ('"+categoryCode+"','"+categoryTitle+"')";
                        db.run(currentQuery2, params, function(err, result) {
                            if(err) {
                                return res.status(500).json({message: "Internal server error"});
                            }
                            else {
                                var params3=[];
                                var currentQuery3 = "INSERT into Questions (ShowNumber,AirDate,CategoryCode,DollarValue,QuestionText,AnswerText) VALUES ("+parseFloat(showNumber)+",\""+airDate+"\",\""+categoryCode+"\","+dollarValue+",\""+questText+"\",\""+answerText+"\")";
                                db.run(currentQuery3, params, function(err, result) {
                                    if(err) {
                                        if(ctr){
                                            var params4=[];
                                            var currentQuery4 = "DELETE FROM Categories WHERE CategoryCode=\""+categoryCode+"\";";
                                            db.run(currentQuery4, params, function(err, result) {
                                                return res.status(500).json({message: "Internal server error"});
                                            });
                                        }
                                        return res.status(500).json({message: "Internal server error"});
                                    }
                                    else {
                                        return res.status(200).json({message: "success"});
                                    }
                                });
                            }
                        });
                    }
                });
            }
        }
    });
});

app.get('/delete', function(req, res) {
    var {auth,Questiontext} = req.query;
    var params1 = [];
    if(auth==null)
        return res.status(400).json({message: "unauthorized access"});
    var currentQuery1 = "SELECT * FROM Users WHERE AuthToken = \""+auth+"\"";
    db.all(currentQuery1, params1, function(err, result) {
        if(err) {
            return res.status(400).json({message: "unauthorized access"});
        }
        else {
            if(result.length==0)
                return res.status(400).json({message: "unauthorized access"});
            var  end=new Date();
            var totaltime=end-result[0].AuthTokenIssued;
            if((totaltime/60000)>60){
                return res.status(400).json({message:"auth token expired"});
            }
            else {
                var params = [];
                if(Questiontext==null||Questiontext.length<1){
                    return res.status(400).json({message: "Questiontext cannot be null"});
                }
                console.log(Questiontext);
                var currentQuery="DELETE FROM Questions WHERE QuestionText=\""+Questiontext+"\";";
                db.all(currentQuery, params, function(err, rows) {
                    if(err) {
                        return res.status(500).json({message: "Internal server error"});
                    }
                    else {
                        return res.status(200).json({message: "success"});
                    }
                });
            }
        }
    });
});

app.get('/getlist', function(req, res) {
    var {auth} = req.query;
    var params1 = [];
    if(auth==null)
        return res.status(400).json({message: "unauthorized access"});
    var currentQuery1 = "SELECT * FROM Users WHERE AuthToken = \""+auth+"\"";
    db.all(currentQuery1, params1, function(err, result) {
        if(err) {
            return res.status(400).json({message: "unauthorized access"});
        }
        else {
                var params = [];
                var currentQuery="select * from Categories;";
                db.all(currentQuery, params, function(err, rows) {
                    if(err) {
                        return res.status(500).json({message: "Internal server error"});
                    }
                    else {
                        return res.status(200).json(rows);
                    }
                });
        }
    });
});



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