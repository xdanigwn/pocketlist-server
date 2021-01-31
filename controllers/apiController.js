const Account = require("../model/Account");
const Category = require("../model/Category");
const Trans = require("../model/Trans");

module.exports = {
  overview: async (req, res) => {
    try {

      const totaBalance = await Account.aggregate([
        { $match: {} },
        {
          $group: { _id: null, total: { $sum: "$balance" } },
        },
      ]);

      //EXPENSE
      const idExpense = await Category.find({ ctgType: "Expense" }).select("_id");
      const Expense = await Trans.find(
        {
          categoryId: { $in: idExpense },
        },
        {
          ammount: 1, // FUNGSI SORT
        }
      );
      let sumExpense = 0;
      for (i = 0; i < Expense.length; i++) {
        sumExpense = sumExpense + Expense[i].ammount;
      }
      //INCOME
      const idIncome = await Category.find({ ctgType: "Income" }).select("_id");
      const Income = await Trans.find(
        {
          categoryId: { $in: idIncome },
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

      const account = await Account.find().select(
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

      //MENAMPILKAN HASIL QUERY KEDALAM JSON
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
      console.log(error);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  accountDropDown: async (req, res) => {
  try {

    const { id } = req.params;
    const accTransfer = await Account.find({ _id: {$ne:id} }).select(
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
      
      const trans = await Trans.find({ accountId: id })
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

          // await Trans.create({
          //   transDate,
          //   transDesc,
          //   ammount,
          //   operator : "-",
          //   accountId,
          //   categoryId, // KATEGORI PASTI TRANSFER
          //   // toAccount,
          //   userId,
          // });

          // await Trans.create({
          //   transDate,
          //   transDesc,
          //   ammount,
          //   operator : "+",
          //   accountId,
          //   categoryId, // KATEGORI PASTI TRANSFER
          //   // toAccount,
          //   userId,
          // });

          // const accountDec = await Account.findOne({ _id: accountId });
          // accountDec.balance -= parseInt(ammount);
          // console.log(accountDec);
          // await accountDec.save();

          // await Trans.create({
          //   transDate,
          //   transDesc,
          //   ammount,
          //   operator : "+",
          //   accountId = toAccount,
          //   categoryId, // KATEGORI PASTI TRANSFER
          //   // toAccount,
          //   userId,
          // });

          // const accountInc = await Account.findOne({ _id: toAccount });
          // accountInc.balance += parseInt(ammount);
          // console.log(accountInc);
          // await accountInc.save();

          return res.status(200).json({ message: accountIdTo });
        }
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  },
};
