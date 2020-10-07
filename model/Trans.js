const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const transSchema = new mongoose.Schema({
    transDate: { type: Date },
    transDesc: { type: String },
    ammount: { type: Number },
    operator: { type: String },
    accountId: {
        type: ObjectId,
        ref: 'Account'
    },
    categoryId: {
        type: ObjectId,
        ref: "Category"
    },
    userId: {
        type: ObjectId,
        ref: "User"
    }
});
module.exports = mongoose.model('Trans', transSchema)