var express = require("express");
var bodyParser = require("body-parser");
//var mongojs = require("mongojs");
// Require request and cheerio. This makes the scraping possible
var request = require("request");
var cheerio = require("cheerio");
var mongoose = require("mongoose");
var logger = require("morgan");
// Initialize Express
var app = express();
var PORT = process.env.PORT || 8080;
// Database configuration
//var databaseUrl = "steamed";
//var collections = ["articles"];
var db = require("./models");
// Hook mongojs configuration to the db variable // switching to mongoose
// var db = mongojs(databaseUrl, collections);
// db.on("error", function(error) {
//   console.log("Database Error:", error);
// });
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/steamed2"; //for connecting to heroku, instert this var 2 lines down
mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI, {
  useMongoClient: true
});

app.use(logger("dev"));
// Use body-parser for handling form submissions
app.use(bodyParser.urlencoded({ extended: false }));
// Use express.static to serve the public folder as a static directory
app.use(express.static("public"));


// Main route (simple Hello World Message)
app.get("/", function(req, res) {
  res.send("Hello world");
});

// TODO: make two more routes

// Route 1 retrieve data
// =======
app.get("/articles", function(req, res) {
  //old mongojs code
  // Query: In our database, go to the animals collection, then "find" everything
  // db.articles.find({}, function(error, found) {
  //   // Log any errors if the server encounters one
  //   if (error) {
  //     console.log(error);
  //   }
  //   // Otherwise, send the result of this query to the browser
  //   else {
  //     res.json(found);
  //   }
  //});
  //new mongoose code
  db.Article
    .find({})
    .then(function(doc) {
      // If we were able to successfully find Articles, send them back to the client
      res.json(doc);
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});
app.get("/notes", function(req, res) {
 
  db.Note
    .find({})
    .then(function(doc) {
      // If we were able to successfully find Articles, send them back to the client
      res.json(doc);
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});
app.get("/articles/notes", function(req, res) {
 
  db.Article
    .find({})
    .populate("note")
    .then(function(doc) {
      // If we were able to successfully find Articles, send them back to the client
      res.json(doc);
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});

// Route 2 scrape and store data
// =======
app.get("/scrape",function (req,res){
  request("https://steamed.kotaku.com/", function(error, response, html) {
  
    var $ = cheerio.load(html);
  
    $("h1.headline").each(function(i, element) {
  
      let link = $(element).children().attr("href");
      var title = $(element).children().text();
      var content =$(element).closest(".post-item-frontpage").children(".item__content").children(".excerpt").children().text();
      let imgLink =$(element).closest(".post-item-frontpage").children(".item__content").children(".asset").children().children().children().children(".lazyload").attr("src")
      //find($('.lazyload'));
      //children(".item__content").children(".asset").children().children(".img-wrapper").children().children(".lazyloaded").attr("src");
      var result= {
        link:link,
        title:title,
        content:content,
        imgLink:imgLink
      }
      console.log(result)
      //mongoose code for db
      db.Article
        .create(result)
        .then(function(dbArticle) {
          
          // If we were able to successfully scrape and save an Article, send a message to the client
          
        })
        .catch(function(err) {
          // If an error occurred, send it to the client
          res.json(err);
        });
      
      //switching from mongojs to mongoose
      // Save these results in an object that we'll push into the results array we defined earlier
      // db.articles.insert({
      //   title: title,
      //   link: link,
      //   content:content
      // });
    });
  console.log("finished updating db");
  //res.redirect("/all");
  });
  res.redirect("/");
})
app.post("/update/:id", function(req,res){
  console.log("update route hit")
  console.log(req.body.note)
  let result={body:req.body.note}
  db.Note
        .create(result)
        .then(function(dbNote) {
          console.log("note created");
          db.Article.findOneAndUpdate(req.params.id, { $set: { note: dbNote._id } }, { new: true }, function (err, doc) {
              if (err) console.log(err);
              })
          .then(function(dbArticle){
            console.log("inside the find and update tag");
            console.log(dbArticle);
          });
          //res.json(dbNote);
          // If we were able to successfully scrape and save an Article, send a message to the client
          
        })
        .catch(function(err) {
          // If an error occurred, send it to the client
          res.json(err);
        });
  
  /*db.Article.update({ _id: req.params.id }, { $set: { note: req.body.note }}, function(){
    console.log("hit update function");
  })*/
  /*db.Article.findByIdAndUpdate(req.params.id, { $set: { note: req.body.note }}, { new: true }, function (err, Article) {
    if (err) return (err);
    console.log(Article);
    res.send(Article);
  });*/
})
app.listen(PORT, function() {
  console.log("App running on port: "+ PORT );
});