var express = require("express");
var mongojs = require("mongojs");
// Require request and cheerio. This makes the scraping possible
var request = require("request");
var cheerio = require("cheerio");

// Initialize Express
var app = express();

// Database configuration
var databaseUrl = "steamed";
var collections = ["articles"];

// Hook mongojs configuration to the db variable
var db = mongojs(databaseUrl, collections);
db.on("error", function(error) {
  console.log("Database Error:", error);
});

// Main route (simple Hello World Message)
app.get("/", function(req, res) {
  res.send("Hello world");
});

// TODO: make two more routes

// Route 1
// =======
app.get("/all", function(req, res) {
  // Query: In our database, go to the animals collection, then "find" everything
  db.articles.find({}, function(error, found) {
    // Log any errors if the server encounters one
    if (error) {
      console.log(error);
    }
    // Otherwise, send the result of this query to the browser
    else {
      res.json(found);
    }
  });
});
// This route will retrieve all of the data
// from the scrapedData collection as a json (this will be populated
// by the data you scrape using the next route)

// Route 2
// =======
app.get("/scrape",function (req,res){
  request("https://steamed.kotaku.com/", function(error, response, html) {
  
    var $ = cheerio.load(html);
  
    $("h1.headline").each(function(i, element) {
  
      var link = $(element).children().attr("href");
      var title = $(element).children().text();
      var content =$(element).closest(".post-item-frontpage").children(".item__content").children(".excerpt").children().text();
  
      // Save these results in an object that we'll push into the results array we defined earlier
      db.articles.insert({
        title: title,
        link: link,
        content:content
      });
    });
  console.log("finished updating db");
  //res.redirect("/all");
  });
  
})
// When you visit this route, the server will
// scrape data from the site of your choice, and save it to
// MongoDB.
// TIP: Think back to how you pushed website data
// into an empty array in the last class. How do you
// push it into a MongoDB collection instead?

/* -/-/-/-/-/-/-/-/-/-/-/-/- */

// Listen on port 3000
app.listen(8080, function() {
  console.log("App running on port 8080!");
});