const User = require("../models/User");
const bcrypt = require('bcrypt');

exports.list = async (req, res) => {
  try {
    const users = await User.find({});
    res.render("users", { users: users });
  } catch (e) {
    res.status(404).send({ message: "Could not list users" });
  }
};
exports.delete = async (req, res) => {
  const id = req.params.id;
  try {
    await User.findByIdAndRemove(id);
    res.redirect("/users");
  } catch (e) {
    res.status(404).send({
      message: `could not delete  record ${id}.`,
    });
  }
};
exports.create = async (req, res) => {
  try {
    const user = new User({ email: req.body.email, password: req.body.password, Game: req.body.game, Years_played: req.body.years_played });
    await user.save();
    console.log(user)
    res.redirect('/login')
  } catch (e) {
    if (e.errors) {
      console.log(e.errors);
      res.render('create-user', { errors: e.errors })
      return;
    }
    return res.status(400).send({
      message: JSON.parse(e),
    });
  }
};
exports.login = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      res.render('login-user', { errors: { email: { message: 'email not found' } } })
      return;
    }
    const match = await bcrypt.compare(req.body.password, user.password);
    if (match) {
      
      req.session.userID = user._id;
      console.log(req.session.userID);
      res.redirect('/pokemons');
      
      return
      console.log('authenticated');
    }
    res.render('login-user', { errors: { password: { message: 'password does not match' } } })
  } catch (e) {
    console.log(e);
  }
}

