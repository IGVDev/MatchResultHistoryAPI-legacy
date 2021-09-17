const express = require("express");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt-nodejs");
const cors = require("cors");
const knex = require("knex");
const _ = require("underscore");
const app = express();
const { Client } = require("pg");

const register = require("./Controllers/register");
const signIn = require("./Controllers/signin");
const matchLoad = require("./Controllers/matchload");
const profile = require("./Controllers/profile");
const standings = require("./Controllers/standings");

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

client.connect();

client.query(
  "SELECT table_schema,table_name FROM information_schema.tables;",
  (err, res) => {
    if (err) throw err;
    for (let row of res.rows) {
      console.log(JSON.stringify(row));
    }
    client.end();
  }
);

app.use(bodyParser.json());
app.use(cors());

app.get("/", (req, res) => {
  return res.json("IT'S ALIVE"), res.send("this is working");
});
app.get("/standings", (req, res) => {
  standings.handleStandingsGet(req, res, db);
});
app.get("/profile/:id", (req, res) => {
  profile.handleProfileGet(req, res, db);
});
app.post("/signin", (req, res) => {
  signIn.handleSignin(req, res, db, bcrypt);
});
app.post("/register", (req, res) => {
  register.handleRegister(req, res, db, bcrypt);
});
app.post("/matchload", (req, res) => {
  matchLoad.handleMatchLoad(req, res, db);
});

app.listen(process.env.PORT || 3001, () => {
  console.log("It is alive!");
});

/*

/profile/:userId --> GET = user

*/
