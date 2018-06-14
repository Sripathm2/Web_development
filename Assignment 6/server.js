var express = require('express');
var bodyParser = require('body-parser');
var sqlite3 = require('sqlite3').verbose();
var port = process.env.PORT || 8000;
var db = new sqlite3.Database('Jeopardy.db');
var cors = require('cors');
var app = express();
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
			return res.status(500).json(
				{message: "Internal server error"});
		}
		else {
			if(result.length>0&&result[0].UserPassword==password)
				return res.status(200).json({message: "success"});
				return res.status(401).json({message: "invalid_credentials"});
			
		}
	});
});

app.get('/questions', function(req, res) {
	var {categoryTitle,airDate,questText,dollarValue,answerText,showNumber} = req.query;
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
    if(dollarValue!=null)
    {
    	currentQuery=currentQuery.replace("Questions.DollarValue IS NOT NULL"," Questions.DollarValue = \"$"+dollarValue+"\"");
    	
    }
    if(airDate!=null)
    {
    	currentQuery=currentQuery.replace(" Questions.AirDate IS Not NULL","  Questions.AirDate = \""+getdate(airDate)+"\"");
    }
    if(questText!=null)
    {
    	currentQuery=currentQuery.replace("Questions.QuestionText IS NOT NULL","lower(Questions.QuestionText) LIKE \"%"+questText.toLowerCase()+"%\"");
    }
    if(answerText!=null)
    {
    	currentQuery=currentQuery.replace("Questions.AnswerText IS Not NULL","lower(Questions.AnswerText) LIKE \"%"+answerText.toLowerCase()+"%\"");
    }
    if(showNumber!=null)
    {
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
			return res.status(200).json(rows.length);
		}
	});
});
function getdate(date)
{
	var date1=date.split("-");
	var date3=date1[1]+"/"+date1[2]+"/"+date1[0].substring(2);
	return date3;
}
