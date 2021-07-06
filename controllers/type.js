const Type = require("../models/Type");

exports.list = async (req, res) => {
  try {
    console.log(req.query)
    const message = req.query.message;
    const types = await Type.find({});
    res.render("types", { types: types, message: message });
  } catch (e) {
    res.status(404).send({ message: "could not list types" });
  }
};

exports.delete = async (req, res) => {
  const id = req.params.id;

  try {

    await Type.findByIdAndRemove(id);
    res.redirect("/types");
  } catch (e) {
    res.status(404).send({
      message: `could not delete  record ${id}.`,
    });
  }
};


exports.create = async (req, res) => {

  try {
    const type = new Type({ name: req.body.name});
    await type.save();
    res.redirect('/types')
  } catch (e) {
    if (e.errors) {
      console.log(e.errors);
      res.render('create-type', { errors: e.errors })
      return;
    }
    return res.status(400).send({
      message: JSON.parse(e),
    });
  }
}

exports.edit = async (req, res) => {
  const id = req.params.id;
  try {
    const type = await Type.findById(id);
    res.render('update-type', { type: type, id: id });
  } catch (e) {
    res.status(404).send({
      message: `could find type ${id}.`,
    });
  }
};

exports.update = async (req, res) => {
  const id = req.params.id;
  try {
    const type = await Type.updateOne({ _id: id }, req.body);
    res.redirect('/types');
  } catch (e) {
    res.status(404).send({
      message: `could find type ${id}.`,
    });
  }
};