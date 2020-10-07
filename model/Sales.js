const mongosee = require("mongoose");
const { ObjectId } = mongoose.Schema;

const salesSchema = new mongoose.Schema({
    salesDate: { type: Date },
    qtySales : { type : Number },
    totalSales : { type : Number },
    accountId : [{
        _id : {
            type : ObjectId, 
            ref = "Account"
        }
    }],
    productId : [{
        _id : {
            type : ObjectId, 
            ref = "Trans"
        },
        cost : {
            type : Number
        },
        price : {
            type : Number
        }
    }]
});
module.exports = mongoose.model('Sales', salesSchema)