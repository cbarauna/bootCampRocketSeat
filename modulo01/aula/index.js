const express = require("express");
const server = express();
server.use(express.json());

const users = ["User1", "User2", "User3"];

function checkUsersExists(req, res, next) {
  if (!req.body.name) {
    return res.status(400).json({ error: "User name is required!" });
  }
  return next();
}

function checkUsersInArray(req, res, next) {
  const user = users[req.params.index]
  if (!user) {
    return res.status(400).json({ error: "User does not exists" });
  }
  req.user = user
  return next();
}

server.get("/users", (req, res) => {
  return res.json(users);
});

server.get("/users/:index", checkUsersInArray, (req, res) => {
  return res.json(req.user);
});

server.post("/users", checkUsersExists, (req, res) => {
  const { name } = req.body;
  users.push(name);
  return res.json(users);
});

server.put("/users/:index", checkUsersExists, checkUsersInArray, (req, res) => {
  const { name } = req.body;
  const { index } = req.params;
  users[index] = name;

  return res.json(users);
});

server.delete("/users/:index", checkUsersInArray, (req, res) => {
  const { index } = req.params;
  users.splice(index, 1);
  return res.send();
});

server.listen(3000);
