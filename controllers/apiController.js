const Account = require("../model/Account");
const Category = require("../model/Category");
const Trans = require("../model/Trans");

module.exports = {
  overview: async (req, res) => {
    try {
      // const totalIncome = "hello json"
      // res.status(200).json({ message })
      // const totaBalance = await Account.aggregate([{ $match: { "balance": { "$in": ['Debit'] } } }, {
      //     $group:
      //         { _id: null, "total": { $sum: "$balance" } }
      // }])

      const totaBalance = await Account.aggregate([
        { $match: {} },
        {
          $group: { _id: null, total: { $sum: "$balance" } },
        },
      ]);

      //EXPENSE
      const idExpense = await Category.find({ ctgType: "Expense" }).select(
        "_id"
      );
      const Expense = await Trans.find(
        {
          categoryId: { $in: idExpense },
        },
        {
          ammount: 1,
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

      //MENAMPILKAN HASIL QUERY KEDALAM JSON
      res.status(200).json({
        //TOTALBALANCE
        totaBalance: totaBalance[0].total,
        sumExpense,
        sumIncome,
        account,
      });
    } catch (error) {
      console.log(error);
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

      // res.status(200).json({ category: category.ctgType });
      if (category.ctgType === "Expense" || category.ctgType === "Income") {
        await Trans.create({
          transDate,
          transDesc,
          ammount,
          operator,
          accountId,
          categoryId,
          userId,
        });
        return res.status(200).json({ message: "Success Submit" });
      }
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  },
};
