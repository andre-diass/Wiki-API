//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const { log } = require("console");

const app = express();

app.set("view engine", "ejs");

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(express.static("public"));

//connect to DB
mongoose.set("strictQuery", true);
mongoose.connect("mongodb://127.0.0.1:27017/wikiDB");

//create article schema
const articleSchema = new mongoose.Schema({
  title: String,
  content: String,
});

//create article model
const Article = mongoose.model("Article", articleSchema);

//routes
///////////////////////////////requests targeting all articles/////////////////////////////////
app
  .route("/articles")
  .get(function (req, res) {
    Article.find({}, (err, results) => {
      if (!err) {
        res.send(results);
      } else {
        console.log(err);
      }
    });
  })
  .post(function (req, res) {
    const titleName = req.body.title;
    const contentBody = req.body.content;

    const newArticle = new Article({
      title: titleName,
      content: contentBody,
    });

    newArticle.save((err) => {
      if (!err) {
        res.send("saved new document to DB");
      } else {
        console.log(err);
      }
    });
  })
  .delete(function (req, res) {
    Article.deleteMany((err) => {
      if (!err) {
        console.log("deleted items from DB");
      } else {
        console.log(err);
      }
    });
  });

///////////////////////////////requests targeting a specific article/////////////////////////////////

app
  .route("/articles/:articleTitle")

  .get(function (req, res) {
    Article.findOne({ title: req.params.articleTitle }, (err, foundArticle) => {
      if (foundArticle) {
        res.send(foundArticle);
      } else {
        res.send("no articles found");
      }
    });
  })

  .put((req, res) => {
    Article.findOneAndUpdate(
      { title: req.params.articleTitle },
      { title: req.body.title, content: req.body.content },
      { overwrite: true },
      (err) => {
        if (!err) {
          res.send("Seccessfully updated article.");
        }
      }
    );
  })
  .patch((req, res) => {
    Article.findOneAndUpdate(
      { title: req.params.articleTitle },
      { title: req.body.title, content: req.body.content },
      (err) => {
        if (!err) {
          res.send("Seccessfully updated article.");
        }
      }
    );
  })
  .delete((req, res) => {
    Article.deleteOne({ title: req.params.articleTitle }, (err) => {
      if ("err") {
        res.send("deleted item from the database");
      } else {
        res.send(err);
      }
    });
  });

app.listen(3000, function () {
  console.log("Server started on port 3000");
});
