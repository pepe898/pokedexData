const mongoose = require("mongoose");
const { Schema } = mongoose;
const pokemonSchema = new Schema(
  {
    name: String,
    hp: Number,
    type: String,
    description: String,
    type_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Type",}
    },

  { timestamps: true }
);
module.exports = mongoose.model("Pokemon", pokemonSchema);