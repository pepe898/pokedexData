require("dotenv").config();
const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const chalk = require("chalk");
const bodyParser = require('body-parser');
const expressSession = require("express-session");
const User = require("./models/User");

const typeController = require("./controllers/type");
const userController = require("./controllers/user");
const homeController = require("./controllers/home");
const pokemonController = require("./controllers/pokemon");

const app = express();
app.set("view engine", "ejs");

const { PORT, MONGODB_URI } = process.env;


mongoose.connect(MONGODB_URI, { useNewUrlParser: true });
mongoose.connection.on("error", (err) => {
  console.error(err);
  console.log(
    "MongoDB connection error. Please make sure MongoDB is running.",
    chalk.red("✗")
  );
  process.exit();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.use(expressSession({ secret: 'foo barr', cookie: { expires: new Date(253402300000000) } }));

app.get("/", (req, res) => {
  res.render("index");
});
app.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`);
});


 

global.user = false;
app.use("*", async (req, res, next) => {
  
  if (req.session.userID && !global.user) {
    const user = await User.findById(req.session.userID);
    global.user = user;
  }
  next();
})

const authMiddleware = async (req, res, next) => {
  const user = await User.findById(req.session.userID);
  if (!user) {
    return res.redirect('/');
  }
  next()
}
app.get("/", homeController.list);
app.get("/logout", async (req, res) => {
  req.session.destroy();
  global.user = false;
  res.redirect('/');
})
//*************************REVIEWS CONTROLLER*************************

app.get("/create-type", authMiddleware, (req, res) => {
  res.render("create-type", { errors: {} });
});

app.post("/create-type", typeController.create);

app.get("/types", typeController.list);
app.get("/types/delete/:id", typeController.delete);
app.get("/types/update/:id", typeController.edit);
app.post("/types/update/:id", typeController.update);

app.get("/pokemons", pokemonController.list);
app.get("/pokemons/delete/:id", pokemonController.delete);
app.get("/update-pokemon/:id", pokemonController.edit);
app.post("/update-pokemon/:id", pokemonController.update)
app.get("/create-pokemon", authMiddleware, (req, res) => {
  res.render("create-pokemon", { errors: {} });
});
app.post("/create-pokemon", pokemonController.create);
app.get('/search-pokemons', (req,res)=> res.render('search-pokemons'));



//*************************USER CONTROLLER*************************

app.get("/users", userController.list);
app.get("/users/delete/:id", userController.delete);
app.get("/join", (req, res) => {
  res.render("create-user", {errors: {}});
});
app.post("/create-user", userController.create);
app.get("/login", (req, res) => {
  res.render('login-user', { errors: {} })
});
app.post("/login", userController.login);



