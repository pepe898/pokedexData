const Pokemon = require("../models/Pokemon");
const bodyParser = require("body-parser");
const Type = require("../models/Type");

exports.list = async (req, res) => {
  const perPage = 10;
  const limit = parseInt(req.query.limit) || 10; // Make sure to parse the limit to number
  const page = parseInt(req.query.page) || 1;
  const message = req.query.message;


  try {
    const pokemons = await Pokemon.find({}).skip((perPage * page) - perPage).limit(limit);
    const count = await Pokemon.find({}).count();
    const numberOfPages = Math.ceil(count / perPage);

    res.render("pokemons", {
      pokemons: pokemons,
      numberOfPages: numberOfPages,
      currentPage: page,
      message: message
    });
  } catch (e) {
    res.status(404).send({ message: "could not list pokemons" });
  }
};
exports.create = async (req, res) => {   
  const pokemon = new Pokemon({ name: req.body.name, hp: req.body.hp, type: req.body.type, description: req.body.description, attack: req.body.attack, defense: req.body.defense, height: req.body.height, spattack: req.body.spattack, spdefense: req.body.spdefense, speed: req.body.speed, weight: req.body.we });
  try {
   await pokemon.save();
   res.redirect('/pokemons')
 } catch (e) {
   return res.status(400).send({
     message: JSON.parse(e),
   });  
 }
}
exports.createView = async (req, res) => {
  try {
    const types = await Type.find({});
    res.render("create-pokemon", {
      type:types,
      errors:{}
    });

  } catch (e) {
    res.status(404).send({
      message: `could not generate create data`,
    });
  }
}

exports.delete = async (req, res) => {
  const id = req.params.id;
  try {
    await Pokemon.findByIdAndRemove(id);
    res.redirect("/pokemons");
  } catch (e) {
    res.status(404).send({
      message: `could not delete  record ${id}.`,
    });
  }
};


exports.edit = async (req, res) => {
  const id = req.params.id;
  try {
    const pokemon = await Pokemon.findById(id);
    const types = await Type.find({});
    res.render('update-pokemon', { pokemon: pokemon, type: types, id: id, errors:{} });
  } catch (e) {
    res.status(404).send({
      message: `could find Pokemon ${id}.`,
    });
  }
};

exports.update = async (req, res) => {
  const id = req.params.id;
  try {
    const pokemon = await Pokemon.updateOne({ _id: id }, req.body);
    res.redirect('/pokemons');
  } catch (e) {
    res.status(404).send({
      message: `could find pokemon ${id}.`,
    });
  }
};


