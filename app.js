const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
var urlencodedParser = bodyParser.urlencoded({extended: false});
const app = express();
app.set("views", "./views");
app.set("view engine", "pug");

const dataFile = "./data/userdata.json";
let userData = { users: [] };

let editing;

const PORT = process.env.PORT || 3001;

fs.readFile(dataFile, "utf8", (e, data) => {
   if (data) {
      userData = JSON.parse(data);
   } else {
      userData = { users: [] };
   }
   // userData.clear = true;
   if (userData.clear == true) {
      fs.writeFile(dataFile, "", (e) => {
         console.log("Cleared JSON");
      });
   }
});


app.use(express.static("public"));

app.get("/users", (req, res) => {
   // let allUsers = db.find({});
   // console.log(allUsers);
   res.render("users", {users: userData.users, userCount: userData.users.length});
});

app.get("/", (req, res) => {
   res.render("index");
});

app.get("/addUser", (req, res) => {
   res.render("addUser");
});

app.get("/edit/:uid/:name/:age/:email", (req, res) => {
   editing = { id: req.params.uid, name: req.params.name, age: parseFloat(req.params.age), email: req.params.email };
   res.render("editUser", editing);
});

app.get("/delete/:id", (req, res) => {
   for (let a = 0; a < userData.users.length; a++) {
      if ("" + userData.users[a].id == "" + req.params.id) {
         userData.users.splice(a, 1);
      }
   }
   res.render("users", {users: userData.users, userCount: userData.users.length});
});

app.post("/editExisting", urlencodedParser, (req, res) => {
   for (let a = 0; a < userData.users.length; a++) {
      if (userData.users[a].name == editing.name && userData.users[a].id == editing.id) {
         userData.users[a] = {
            name: req.body.userName,
            email: req.body.email,
            age: req.body.age,
            id: editing.id
         };
      }
   }
   // console.log("updated users");
   // console.log(userData.users);
   addNewUser(null, null, null, null, true);
   res.render("users", {users: userData.users, userCount: userData.users.length});
});

app.post("/newUser", urlencodedParser, (req, res) => {
   addNewUser(userData.users.length, req.body.userName, req.body.email, req.body.age);
   res.render("users", {users: userData.users, userCount: userData.users.length});
});

function addNewUser(id = "NO_ID", name = "NO_NAME", email = "NO_EMAIL", age = "NO_AGE", overwrite = false) {
   if (overwrite) {

   } else {
      userData.users.push({ id: id, name: name, email: email, age: age });
   }
   fs.writeFile(dataFile, JSON.stringify(userData), () => {
      console.log("Write complete");
   });
}

app.listen(PORT, () => {
   console.log(`Listening on port ${PORT}`);
});