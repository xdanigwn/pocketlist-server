const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  fullName: { type: String },
  userName: { type: String },
  pass: { type: String },
  role: { type: String },
  accountId: [{
    type: ObjectId,
    ref: "Account"
  }],
});

//HASH PASSWORD SAAT DISIMPAN
userSchema.pre('save', async function (next) {
  const user = this
  if (user.isModified('pass')) {
    user.pass = await bcrypt.hash(user.pass, 8);
  }
})
module.exports = mongoose.model("User", userSchema);
