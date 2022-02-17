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

//* Socket
const http = require("http");
const server = http.createServer(app);

const socketIO = require("socket.io");
const URL = process.env.PORT
  ? "https://bolsa-chat.herokuapp.com"
  : "http://localhost:3000";
console.log("Url", URL);
const io = socketIO(server, {
  cors: {
    origin: "*",
  },
});

const cors = require("cors")
app.use(cors()) 

io.on("connection", (socket) => {
  console.log("client connected: ", socket.id);

  socket.join("root");

  socket.on("disconnect", (reason) => {
    console.log(reason);
  });
});

server.listen(5000, (err) => {
  if (err) console.log(err);
  console.log("Server running on Port 5000");
});

setInterval(() => {
  io.emit("time", Date.now());
}, 500);

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
          io.to(channel).emit("log", result);
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
app.listen(app.get("port"), () => {
  console.log(`Listening on ${app.get("port")}`);
});
