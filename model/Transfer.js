const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const transferSchema = new mongoose.Schema({
    accFrom:{
        type: ObjectId,
        ref: 'Account'
    },
    accTo: {
        type: ObjectId,
        ref: 'Account'
    },
    transId: {
        type: ObjectId,
        ref: "Trans"
    }
});
module.exports = mongoose.model('Transfer', transferSchema)
