// Modules
const path = require("path");
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const { MongoClient } = require("mongodb");
require("dotenv").config();

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

//! Test
router.get("/api/test", (req, res) => {
  res.status(200).send("Hello World");
});

// Database stuff
router.get("/api/log/get", (req, res) => {
  var { channel } = req.query;
  console.log(channel);

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

router.get("/api/log/post", (req, res) => {
  var { channel, content } = req.query;
  console.log(channel, content);

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
              io.of("/chat").to("root").emit("test", "Hello World!");
              io.of("/chat").to("root").emit("refresh", { log: result });
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

router.get("/api/log/clear", (req, res) => {
  var { channel, content } = req.query;
  console.log(channel, content);
  console.log(`ALL MESSAGES DELETED`);

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

// any routes not picked up by the server api will be handled by the react router
app.use("/*", staticFiles);

// Start server
app.set("port", process.env.PORT || 3001);
const server = app.listen(app.get("port"), () => {
  console.log(`Listening on ${app.get("port")}`);
});

//* Socket

const cors = require("cors");
app.use(
  cors({
    origin: "*",
  })
);

// Socket

const io = require("socket.io")(server);
var app_socket = io.of("/chat");
app_socket.on("connection", function (socket, data) {
  console.log("Client connected");

  socket.on("disconnect", function () {
    console.log("Client disconnected");
  });

  socket.join("root");
});

//! TEST
function decircleJSON(object) {
  var cache = [];
  return JSON.parse(
    JSON.stringify(object, (key, val) => {
      if (typeof val === "object" && val !== null) {
        if (cache.includes(val)) {
          return;
        }
        cache.push(val);
      }
      return val;
    })
  );
}
