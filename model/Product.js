const mongosee = require("mongoose");
const {ObjectId} = mongoose.Schema;

const productSchema = new mongoose.Schema({
    productName: { type: String },
    cost : { type : Number},
    price : { type : Number },
    qty : { type : Number },
    status : { type : String },
    accountId : [{
        _id : {
            type : ObjectId, 
            ref = "Account"
        }
    }],
    productCategoryId : [{
        _id : {
            type : ObjectId, 
            ref = "productCategory"
        },
        productCategoryName : {
            type : String
        },
    }],
  
});
module.exports = mongoose.model('Product', productSchema)