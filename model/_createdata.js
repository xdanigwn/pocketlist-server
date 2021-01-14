const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

mongoose.connect(
    "mongodb://danigwn:pocketlist90@cluster0-shard-00-01.2amoj.mongodb.net:27017/pocketlist?authSource=admin&replicaSet=atlas-x92bub-shard-0&readPreference=primary&appname=MongoDB%20Compass&ssl=true",
    {
      useNewUrlParser: true,
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    }
  );
  
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

const Transfer = mongoose.model('Transfer', transferSchema)
await Transfer.save();