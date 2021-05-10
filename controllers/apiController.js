const Account = require("../model/Account");
const Category = require("../model/Category");
const Trans = require("../model/Trans");
const User = require("../model/User");
const bcrypt = require("bcryptjs");
const jwt  = require("jsonwebtoken");
const mongoose = require('mongoose')

function cors(){
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3001")
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Max-Age", "1800");
  res.setHeader("Access-Control-Allow-Headers", "content-type");
  res.setHeader("Access-Control-Allow-Methods", "PUT, POST, GET, DELETE, PATCH, OPTIONS" ); 
}

module.exports = {
  overview: async (req, res) => {
    try {

      cors();

      idStr = req.params.id
      idObj = mongoose.Types.ObjectId(req.params.id) 
      const dateFrom = req.params.dateFrom.concat(" 00:00:00")
      const dateTo = req.params.dateTo.concat(" 23:59:59")

      // res.json(ids);
      
      // ===== NOTE : FOR "AGGREGATE" FUNCTION MUST CONVERT ID TO OBJECT. IF USE "FIND" IT'S NOT NECCESSARY  ====
      // QUERY TOTAL BALANCE
      const totaBalance = await Account.aggregate([
        { $match: { userId : idObj } },
        {
          $group: { _id: null, total: { $sum: "$balance" } },
        },
      ]);

      //EXPENSE - 2 TAHAP INQUIRY ID EXPENSE LALU FILTER
      const idExpense = await Category.find({ ctgType: "Expense" }).select("_id");
      const Expense = await Trans.find(
        {
          userId : { $in: idStr },
          categoryId: { $in: idExpense },
          transDate : { $gte : dateFrom,
                        $lt: dateTo
                      }
        },
        {
          ammount: 1, // FUNGSI SORT
        }
      );
      let sumExpense = 0;
      for (i = 0; i < Expense.length; i++) {
        sumExpense = sumExpense + Expense[i].ammount;
      }
      //INCOME - 2 TAHAP INQUIRY ID INCOME LALU FILTER
      const idIncome = await Category.find({ ctgType: "Income" }).select("_id");
      const Income = await Trans.find(
        {
          userId : { $in: idStr },
          categoryId: { $in: idIncome },
          transDate : { $gte : dateFrom,
                        $lt: dateTo
                      }
        },
        {
          ammount: 1,
        }
      );
      let sumIncome = 0;
      for (i = 0; i < Income.length; i++) {
        sumIncome = sumIncome + Income[i].ammount;
      }

      // const totalExpense = await Trans.aggregate([
      //     { $match: { categoryId: { $eq: ['categoryId', '5f6c865d4cc77023443da77d'] } } },
      //     { $group: { _id: null, sum: { $sum: "$ammount" } } }])

      const account = await Account.find({ userId : { $in: idStr }}).select(
        "accName accType balance accImageUrl"
      );

      const categoryInc = await Category.find({ ctgType: "Income" }).select(
        "ctgName ctgType ctgImageUrl"
      );

      const categoryExp = await Category.find({ ctgType: "Expense" }).select(
        "ctgName ctgType ctgImageUrl"
      );

      // const { id } = req.params;
      // const accTransfer = await Account.find({_id:{$ne:"5f6f690a9fd56b291005a358"} }).select(
      //   "accName accType accImageUrl"
      // );

      // //MENAMPILKAN HASIL QUERY KEDALAM JSON
      res.status(200).json({
        //TOTALBALANCE
        totaBalance: totaBalance[0].total,
        sumExpense,
        sumIncome,
        account,
        categoryInc,
        categoryExp
      });
    } catch (error) {
      // console.log(error);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  authCheck : async (req, res) => {
    try {
      const token = req.cookies.token; // cookie parser
      if(!token) {
          // res.render("index");
          res.json({
            status : false,
            verif_user : "",
            mytoken : token
          })
          // res.redirect("http://localhost:3001/")
          // return res.json(false) 
          
      }
      const verified = jwt.verify(token, "jwtsecret1234") //compare token with secret. if error go to catch
      res.json({
        status : true,
        verif_user : verified.user,
        mytoken : token
      })
      // req.user = verified.user;
      // console.log(req.user);
      // next(); 
    } catch (err) {
        console.log(err);
        res.json(false)
    }  
  },

  actLogin: async (req, res) => {
    try {
      // res.json({ msg : "hello"})
      const { username, pass } = req.body;
      const existingUser = await User.findOne({ userName: username });
      if (!existingUser) {
        return res.json("Username tidak ada!");
        // return res.redirect("http://localhost:3001")
      }

      const isPasswordMatch = await bcrypt.compare(pass, existingUser.pass)
      if(!isPasswordMatch){
        return res.json("Password salah!");
        // res.redirect("http://localhost:3001")
      }

      // res.render("https://app-pocketlist.herokuapp.com/");

      const token = jwt.sign (
        {
          user : existingUser._id,
        },
        "jwtsecret1234" // jwt password - next input in env
      );

      // console.log(token)
      res.cookie("token", token, {
        httpOnly : true,
        // domain : "herokuapp.com",
        // hostOnly : false
        // secure: true,
        // sameSite : 'none',
        // secure: req.secure
        
      }).send();

      // const token = req.cookies.token; // cookie parser
      // res.json(token);

      // const verified = jwt.verify(token, "jwtsecret1234") //compare token with secret. if error go to catch
      // return res.json(verified.user)
    } catch (err) {
      console.error(err) // showing error explanation
        // res.status(401).error(err);
      }
    },


    actLogout: async (req, res) => {
      try {

        res.cookie("token", "", {
          httpOnly: true,
          expires: new Date(0), // makes browser remove cookies
        }).send(); 

        res.redirect("http://localhost:3001")
      } catch (err) {
        console.error(err)
          // res.status(401).error(err);
        }
      },

  accountDropDown: async (req, res) => {
  try {

    const { idAcc } = req.params;
    const idStr = req.params.id;
    const accTransfer = await Account.find({ userId : idStr, _id: {$ne:idAcc} }).select(
      "accName accType accImageUrl"
    );

    res.status(200).json({
      accTransfer
    })
    
  } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  },

  accountDetail: async (req, res) => {
    try {
      const { id } = req.params;
      
      const trans = await Trans.find({ accountId: id})
        .populate({ path: 'categoryId', select: '_id ctgName ctgType ctgImageUrl' })
        .populate({ path: 'accountId', select: '_id balance accType accName accImageUrl' })
        .sort({ transDate:-1, _id: -1 } )

      res.status(200).json({
        trans
      })

    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  },

  balanceInfo: async (req, res) => {
    try {
      const { id } = req.params;
      
      const accDebit = await Account.find({ userId: id, accType: "Debit"})
        .sort({ balance: -1, accName:-1 } )

      const accCredit = await Account.find({ userId: id, accType: "Credit"})
        .sort({ balance: -1, accName:-1 } )

    
      let sumDebit = 0;
      for (i = 0; i < accDebit.length; i++) {
        sumDebit = sumDebit + accDebit[i].balance;
      }

      let sumCredit = 0;
      for (i = 0; i < accCredit.length; i++) {
        sumCredit = sumCredit + accCredit[i].balance;
      }

      res.status(200).json({
        accDebit,
        accCredit,
        sumDebit,
        sumCredit
      })

    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  },

  personalIncomeDetail: async (req, res) => {
    try {
      idObj = mongoose.Types.ObjectId(req.params.id) 
      
      const dateFrom = req.params.dateFrom.concat(" 00:00:00")
      const dateTo = req.params.dateTo.concat(" 23:59:59")

      // res.status(500).json({ message: dateTo });

      const trans = await Trans.aggregate([
          { 
            $lookup: { // left join
              from: Category.collection.name, 
              localField : "categoryId",
              foreignField: "_id",
              as : "transCtg"
            }      
          },
          { $unwind:"$transCtg" }, // $unwind used for getting data in object or for one record only
          {
            $match : {
              userId : idObj,
              "transCtg.ctgType" : "Income",
              "transDate" : {
                $gte : new Date(dateFrom), // HARUS DIFORMAT MENJADI NEW DATE AGAR BISA DI QUERY PADA AGGREGATE MATCH BETWEEN
                $lt : new Date(dateTo)
              },
              
          }},
          { 
            $lookup: { // left join
              from: Account.collection.name, 
              localField : "accountId",
              foreignField: "_id",
              as : "transAcc"
            }      
          },
          { $unwind:"$transAcc" }, 
          { $sort : { transDate : -1, _id: 1 } }

      ]);

      res.status(200).json({
        trans
      })

    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  },

  personalExpenseDetail: async (req, res) => {
    try {
      idObj = mongoose.Types.ObjectId(req.params.id) 

      const dateFrom = req.params.dateFrom.concat(" 00:00:00")
      const dateTo = req.params.dateTo.concat(" 23:59:59")
      
      const trans = await Trans.aggregate([
          { 
            $lookup: { // left join
              from: Category.collection.name, 
              localField : "categoryId",
              foreignField: "_id",
              as : "transCtg"
            }      
          },
          { $unwind:"$transCtg" }, // $unwind used for getting data in object or for one record only
          {
            $match : {
              userId : idObj,
              "transCtg.ctgType" : "Expense",
              "transDate" : {
                $gte : new Date(dateFrom), // HARUS DIFORMAT MENJADI NEW DATE AGAR BISA DI QUERY PADA AGGREGATE MATCH BETWEEN
                $lt : new Date(dateTo)
              },
          }},
          { 
            $lookup: { // left join
              from: Account.collection.name, 
              localField : "accountId",
              foreignField: "_id",
              as : "transAcc"
            }      
          },
          { $unwind:"$transAcc" }, 
          { $sort : { transDate : -1, _id: 1 } }
      ]);

      res.status(200).json({
        trans
      })

    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  },

  reportExpenseCategory: async (req, res) => {
    try {
      idObj = mongoose.Types.ObjectId(req.params.id) 
      
      const transexp = await Trans.aggregate([
          { 
            $lookup: { // left join
              from: Category.collection.name, 
              localField : "categoryId",
              foreignField: "_id",
              as : "transCtg"
            }      
          },
          { $unwind:"$transCtg" },
          {
            $match : {
              userId : idObj,
              "transCtg.ctgType" : "Expense"
            }
          },
          {
            $group :
              {
                _id : "$transCtg.ctgName",
                total: { $sum: "$ammount" } 
              }
          },
          
      ]);

      res.status(200).json({
        transexp
      })

    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  },

  reportIncomeCategory: async (req, res) => {
    try {
      idObj = mongoose.Types.ObjectId(req.params.id) 
      
      const transinc = await Trans.aggregate([
          { 
            $lookup: { // left join
              from: Category.collection.name, 
              localField : "categoryId",
              foreignField: "_id",
              as : "transCtg"
            }      
          },
          { $unwind:"$transCtg" },
          {
            $match : {
              userId : idObj,
              "transCtg.ctgType" : "Income"
            }
          },
          {
            $group :
              {
                _id : "$transCtg.ctgName",
                total: { $sum: "$ammount" } 
              }
          },
          
      ]);

      res.status(200).json({
        transinc
      })

    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  },


  delTrans: async (req, res) => {
    try {
      const { id } = req.params;
    
      const trans = await Trans.findOne({ _id: id })
     
      const account = await Account.findOne({ _id: trans.accountId });
      if (trans.operator === "-"){
        account.balance += parseInt(trans.ammount);
      }else{
        account.balance -= parseInt(trans.ammount);
      }
      
      await account.save();
      await trans.remove();

      return res.status(200).json({ message: "Success Delete Trans" });
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  },

  addTrans: async (req, res) => {
    try {
      const {
        transDate,
        transDesc,
        ammount,
        operator,
        accountId,
        categoryId,
        userId,
        accountIdTo
      } = req.body;

     
      const category = await Category.findOne({ _id: categoryId });
      // res.status(200).json({ category });

      //CEK KELENGKAPAN
      if (
        transDate === undefined ||
        transDesc === undefined ||
        ammount === undefined ||
        operator === undefined ||
        accountId === undefined ||
        categoryId === undefined ||
        userId === undefined
      ) {
        return res.status(405).json({ message: "Lengkapi semua field" });
      }

      // FUNGSI EXPESE / INCOME / TRANSFER
      if (category.ctgType === "Expense") {
          await Trans.create({
            transDate,
            transDesc,
            ammount,
            operator : "-",
            accountId,
            categoryId,
            userId,
          });

          const account = await Account.findOne({ _id: accountId });
          account.balance -= parseInt(ammount);
          console.log(account);

          await account.save();
          return res.status(200).json({ message: "Success Submit Trans" });
      }else if (category.ctgType === "Income") {
          await Trans.create({
            transDate,
            transDesc,
            ammount,
            operator : "+",
            accountId,
            categoryId,
            userId,
          });

          const account = await Account.findOne({ _id: accountId });
          account.balance += parseInt(ammount);
          console.log(account);
  
          await account.save();
          return res.status(200).json({ message: "Success Submit" });
        }else if (category.ctgType === "Transfer") {

          // console.log(category.ctgType);

          await Trans.create({
            transDate,
            transDesc,
            ammount,
            operator : "-",
            accountId,
            categoryId, // KATEGORI PASTI TRANSFER
            userId,
          });

          await Trans.create({
            transDate,
            transDesc,
            ammount,
            operator : "+",
            accountId : accountIdTo,
            categoryId, // KATEGORI PASTI TRANSFER
            userId,
          });

          const accountDec = await Account.findOne({ _id: accountId });
          accountDec.balance -= parseInt(ammount);
          console.log(accountDec);
          await accountDec.save();

          const accountInc = await Account.findOne({ _id: accountIdTo });
          accountInc.balance += parseInt(ammount);
          console.log(accountInc);
          await accountInc.save();

          return res.status(200).json({ message: accountIdTo });
        }
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  },
};
