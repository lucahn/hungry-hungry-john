var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");

var axios = require("axios");
var cheerio = require("cheerio");

var db = require("./models");
var PORT = process.env.PORT || 3000;
var app = express();

app.use(logger("dev"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

const dbURL = "mongodb://localhost/HW";
const moncon = mongoose.connection;

if (process.env.MONGODB_URI) {
  mongoose.connect(process.env.MONGODB_URI);
}
else {
  mongoose.connect(dbURL);
}

moncon.on("error", function(err) {
  console.log("MONGOOSE ERROR: ", err);
});

moncon.once("open", function(err) {
  console.log("MONGOOSE CONNECTED");
});


var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/HW";

// mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI);


app.get("/scrape", function(req, res) {
  axios.get("https://www.bonappetit.com/ingredient/strawberry").then(function(response) {
    var $ = cheerio.load(response.data);

    $("li.component-river-item").each(function(i, element) {
      var result = {};

      result.title = $(element).children().find("div.feature-item-content").children().children().text();
      result.author = ($(element).children().find("div.feature-item-content").find("p.feature-item-byline").text());
      let txt = ($(element).children().find("div.feature-item-content").find("p").text()).split("By");
      result.text = txt[0];
      result.link = ("https://www.bonappetit.com/" + ($(element).children().find("div.feature-item-content").children().children().attr("href")));
      let img = $(element).children().find("div.feature-item-image").children().children().children().children().attr("srcset").split(" ");
      result.image = img[0];

      console.log(result);

      db.Scrape.create(result)
      .then(function(dbScrape) {
        console.log(dbScrape);
      }).catch(function(err) {
         res.json(err);
      });
    });
    res.send("Scrape Complete");
  });
});

app.get("/whattoeat", function(req, res) {
  db.Scrape.find({})
    .then(function(dbScrape) {
      res.json(dbScrape);
    })
    .catch(function(err) {
      res.json(err);
    });
});

app.get("/whattoeat/:id", function(req, res) {
  db.Scrape.findOne({ _id: req.params.id })
    .populate("note")
    .then(function(dbScrape) {
      res.json(dbScrape);
    })
    .catch(function(err) {
      res.json(err);
    });
});

app.post("/whattoeat/:id", function(req, res) {
  db.Notes.create(req.body)
    .then(function(dbNote) {
      return db.Scrape.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
    })
    .then(function(dbScrape) {
      res.json(dbScrape);
    })
    .catch(function(err) {
      res.json(err);
    });
});

app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});
