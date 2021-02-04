const express = require("express");
const bodyParser = require("body-parser");
var urlencodedParser = bodyParser.urlencoded({extended: false});
const app = express();
app.set("views", "./views");
app.set("view engine", "pug");

const PORT = process.env.PORT || 3001;

const userSchema = new mongoose.Schema({
   userId: String,
   name: String,
   email: String,
   age: Number
});

app.get("/users", (req, res) => {
   let allUsers = db.find({});
   console.log(allUsers);
   res.render("users", { userCount: allUsers.length || 0 });
});

app.get("/", (req, res) => {
   res.render("index");
});

app.get("/addUser", (req, res) => {
   res.render("addUser");
});

app.post("/newUser", urlencodedParser, (req, res) => {
   console.log(req.body.userName);
   addNewUser(Math.random().toString(16).substring(0, 5), req.body.userName);
   res.send("tanks u");
});

function addNewUser(id = Math.random().toString(16).substring(0, 5), name = "Bull Dozer", email = "a@a.com", age = 3) {
   
   console.log("Write complete");
}

app.listen(PORT, () => {
   console.log(`Listening on port ${PORT}`);
});