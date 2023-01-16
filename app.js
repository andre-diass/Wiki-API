//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');
const { log } = require("console");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

//connect to DB
mongoose.set("strictQuery", true);
mongoose.connect('mongodb://127.0.0.1:27017/wikiDB'); 

//create article schema
const articleSchema = new mongoose.Schema({
    title: String,
    content: String
});

//create article model
const Article = mongoose.model("Article" , articleSchema);


//routes
///////////////////////////////requests targetting all articles/////////////////////////////////
app.route('/articles')
  .get(function(req, res) {
   
    Article.find({} , (err, results) => {
        if(!err) {
            res.send(results)
        } else{
            console.log(err);
        }
    })
  })
  .post(function(req, res) {
    const titleName = req.body.title;
    const contentBody = req.body.content;
    
    const newArticle = new Article ({
        title: titleName,
        content: contentBody
    }); 
    
    newArticle.save((err) => {
    if(!err){
        res.send("saved new document to DB");
    }else {
        console.log(err);
    }
});


  })
  .delete(function(req, res) {
    
    Article.deleteMany((err) => {
        if(!err) {
            console.log("deleted items from DB");
        }else{
            console.log(err);
        }
    });
  });

///////////////////////////////requests targetting a specific article/////////////////////////////////










//TODO

app.listen(3000, function() {
  console.log("Server started on port 3000");
});