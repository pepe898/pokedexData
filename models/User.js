const mongoose = require("mongoose");
const { Schema } = mongoose;
const bcrypt = require('bcrypt');
const userSchema = new Schema(
  {
    email: { type: String, required: [true, 'Email is required'], unique: true },
    password: { type: String, required: [true, 'Password is required'] },
    Game: String,
    Years_played: { type: Number, required: [true, 'You must have played pokemon before'], min: [2, "You must be have played for at least two years if you want to call yourself a pokemon trainer."] },
  },
  { timestamps: true }
);
userSchema.pre('save', async function (next) {
  console.log(this.password);
  try {
      const hash = await bcrypt.hash(this.password, 10);
      this.password = hash;
      next();
  } catch (e) {
      throw Error('could not hash password');
  }
})
module.exports = mongoose.model("User", userSchema);