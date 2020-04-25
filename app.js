//jshint esversion:6

const ejs = require("ejs");
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const _ = require("lodash");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

mongoose.connect('mongodb://localhost:27017/hhsDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const playersSchema = {
  rank: Number,
  name: String,
  bio: String
}

const Player = mongoose.model("Player", playersSchema);

//////////////////////root route

app.route("/")
  .get(function(req, res) {
    res.render("home");
  });

//////////////////////route targeting all players

app.route("/players")
  .get(function(req, res) {
    Player.find({}, function(err, foundPlayers) {
      res.render("players", {
        players: foundPlayers
      });
    })
  })


//////////////////////ranking-update route

app.route("/ranking-update")
  .get(function(req, res) {
    Player.find({}, function(err, foundPlayers) {
      res.render("ranking-update", {
        players: foundPlayers
      });
    })
  })

  .put(function(req, res) {
    const thisName = req.body.playerName;
    Player.findOne({name: thisName}, function(err, foundPlayer){
      Player.updateOne(
          {rank: req.body.newRanking, name: foundPlayer, bio: req.body.newBio},
          {overwrite: true},
        function(err) {
          if (!err) {
            res.render("/ranking-update")
          } else {
            res.send(err);
          }
        })
    })

  });



app.listen(5000, function() {
  console.log("Server is running on port 5000");
});
