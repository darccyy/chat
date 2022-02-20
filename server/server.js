// Modules
const path = require("path");
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const { MongoClient } = require("mongodb");
require("dotenv").config();

// Database
const dbUri = `mongodb+srv://${process.env.DBUSER}:${process.env.DBPASS}@cluster0.zrsr5.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const dbClient = new MongoClient(dbUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

dbClient.connect((err) => {
  if (err) {
    throw err;
  }
  console.log("Connected to MongoDB");
});

// Use body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Access static files
const staticFiles = express.static(path.join(__dirname, "../client/build"));
app.use(staticFiles);

// Start router
const router = express.Router();

//! Auth

const axios = require("axios");

const clientID = "ad9b5577e89e3e1ba247";
//! Move to .env
const clientSecret = process.env.AUTHSECRET;

router.get("/api/home", (req, res) => {
  // The req.query object has the query params that were sent to this route.
  const requestToken = req.query.code;
  console.log("requestToken", requestToken);

  axios({
    method: "post",
    url: `https://github.com/login/oauth/access_token?client_id=${clientID}&client_secret=${clientSecret}&code=${requestToken}`,
    // Set the content type header, so that we get the response in JSON
    headers: {
      accept: "application/json",
    },
  }).then((response, err) => {
    if (response.error) {
      console.log(response.error);
      res.status(500).send(response.error);
      return;
    }

    const accessToken = response.data.access_token;
    console.log(response.data);

    // redirect the user to the home page, along with the access token
    console.log("accessToken", accessToken);
    res.json({accessToken});
  });
});

//! Test
router.get("/api/test", (req, res) => {
  res.status(200).send("Hello World");
});

// Get Log
router.get("/api/log/get", (req, res) => {
  var { channel } = req.query;
  console.log("GET", channel);

  const collection = dbClient.db(channel).collection("messages");
  collection.find({}).toArray(function (err, result) {
    if (err) {
      console.error(err);
      res.status(500).send(err);
    } else {
      res.json(result);
    }
  });
});

// Post message
router.get("/api/log/post", (req, res) => {
  var { channel, content } = req.query;
  console.log("POST", channel, content);

  const collection = dbClient.db(channel).collection("messages");
  collection
    .insertOne({
      channel,
      content,
      time: Date.now(),
    })
    .then(() => {
      res.sendStatus(200);
      const collection = dbClient.db(channel).collection("messages");
      collection.find({}).toArray(function (err, result) {
        if (err) {
          console.error(err);
          res.status(500).send(err);
        } else {
          console.log("POST POST");
          // const fs = require("fs");
          // fs.writeFileSync(__dirname + "/output.json", JSON.stringify(decircleJSON(io), null, 2));
          collection.find({}).toArray(function (err, result) {
            if (err) {
              console.error(err);
              // res.status(500).send(err);
            } else {
              // res.json(result);
              console.log("Socket response", channel);
              io.of("/chat").to(channel).emit("test", "Hello World!");
              io.of("/chat").to(channel).emit("refresh", { log: result });
            }
          });
        }
      });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send(err);
    });
});

// Clear messages (Test)
router.get("/api/log/clear", (req, res) => {
  var { channel } = req.query;
  console.log("CLEAR", channel);

  const collection = dbClient.db(channel).collection("messages");
  collection.drop((error, delOK) => {
    if (error) {
      console.error(error);
      res.sendStatus(500);
    }
    if (delOK) {
      res.sendStatus(200);
    }
  });
});

// Use router
app.use(router);

// Any routes not picked up by the server api will be handled by the react router
app.use("/*", staticFiles);

// Start server
app.set("port", process.env.PORT || 3001);
const server = app.listen(app.get("port"), () => {
  console.log(`Listening on ${app.get("port")}`);
});

// Socket
const cors = require("cors");
app.use(
  cors({
    origin: "*",
  })
);

const io = require("socket.io")(server);
var app_socket = io.of("/chat");
app_socket.on("connection", function (socket, data) {
  console.log("Client connected");

  socket.on("disconnect", function () {
    console.log("Client disconnected");
  });

  socket.on("join", function (room) {
    socket.join(room);
  });
});
