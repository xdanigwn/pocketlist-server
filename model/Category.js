const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const CategorySchema = new mongoose.Schema({
  ctgName: { type: String },
  ctgType: { type: String },
  ctgImageUrl: { type: String },
});
module.exports = mongoose.model("Category", CategorySchema);
