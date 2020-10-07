const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const accountSchema = new mongoose.Schema({
  accName: { type: String },
  accType: { type: String },
  balance: { type: Number },
  accImageUrl: { type: String },
  userId: {
    type: ObjectId,
    ref: 'User'
  },
});
module.exports = mongoose.model("Account", accountSchema);
