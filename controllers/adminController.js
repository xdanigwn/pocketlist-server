const Category = require("../model/Category");
const User = require("../model/User");
const Account = require("../model/Account");
const Trans = require("../model/Trans");
const fs = require("fs-extra");
const path = require("path");
const bcrypt = require("bcryptjs");
const moment = require('moment');

module.exports = {
  viewLogin: async (req, res) => {
    try {
      const alertMessage = req.flash("alertMessage");
      const alertStatus = req.flash("alertStatus");
      const alert = { message: alertMessage, status: alertStatus };
 
      if (req.session.userSession == null || req.session.userSession == undefined) {
        res.render("index", {
          alert,
          title: "Pocketlist - Login"
        });
      } else {
        res.redirect("/admin/dashboard");
      }

    } catch (error) {
      res.redirect("/admin/login");
    }
  },

  actionLogin: async (req, res) => {
    try {
      const { username, password } = req.body;
      const user = await User.findOne({ userName: username });
      if (!user) {
        req.flash("alertMessage", "Username tidak ada!");
        req.flash("alertStatus", "danger");
        res.redirect("/admin/login");
      }
      const isPasswordMatch = await bcrypt.compare(password, user.pass);
      if (!isPasswordMatch) {
        req.flash("alertMessage", "Password yang ada masukan salah!");
        req.flash("alertStatus", "danger");
        res.redirect("/admin/login");
      }

      req.session.userSession = {
        id: user.id,
        username: user.userName,
        fullName: user.fullName
      }
      res.redirect("/admin/dashboard");
    } catch (error) {
      res.redirect("/admin/login");
    }
  },

  actionLogout: (req, res) => {
    req.session.destroy();
    res.redirect("/admin/login");
  },

  viewDashboard: async (req, res) => {
    try {
      const userCount = await User.find();
      const accountCount = await Account.find();
      res.render("admin/dashboard/view_dashboard", {
        title: "Pocketlist - Dashboard",
        userSession: req.session.userSession,
        userCount,
        accountCount
      });
    } catch (error) {
      res.redirect("/admin/dashboard");
    }
  },

  // CATEGORY
  viewCategory: async (req, res) => {
    try {
      const category = await Category.find();
      const alertMessage = req.flash("alertMessage");
      const alertStatus = req.flash("alertStatus");
      const alert = { message: alertMessage, status: alertStatus };
      res.render("admin/category/view_category", {
        category,
        alert,
        userSession: req.session.userSession
      });
    } catch (error) {
      res.redirect("/admin/category");
    }
  },

  addCategory: async (req, res) => {
    try {
      const { ctgName, ctgType } = req.body;
      // const { ctgName } = req.body;
      // console.log(ctgName)
      // console.log(ctgName);
      // console.log(ctgType);
      await Category.create({
        ctgName,
        ctgType,
        ctgImageUrl: `images/${req.file.filename}`,
      });
      req.flash("alertMessage", "Success Add Category");
      req.flash("alertStatus", "primary");
      res.redirect("/admin/category");
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/admin/category");
    }
  },

  editCategory: async (req, res) => {
    try {
      const { id, ctgName, ctgType } = req.body;
      const category = await Category.findOne({ _id: id });
      // console.log(req.file);
      if (req.file == undefined) {
        category.ctgName = ctgName;
        category.ctgType = ctgType;
        await category.save();
        req.flash("alertMessage", "Success Update Category");
        req.flash("alertStatus", "primary");
        res.redirect("/admin/category");
      } else {
        await fs.unlink(path.join(`public/${category.ctgImageUrl}`));
        category.ctgName = ctgName;
        category.ctgType = ctgType;
        category.ctgImageUrl = `images/${req.file.filename}`;
        await category.save();
        req.flash("alertMessage", "Success Update Category dan Update Foto");
        req.flash("alertStatus", "primary");
        res.redirect("/admin/category");
      }
    } catch (error) {
      res.redirect("/admin/category");
    }
  },

  deleteCategory: async (req, res) => {
    const { id } = req.params;
    const category = await Category.findOne({ _id: id });
    await fs.unlink(path.join(`public/${category.ctgImageUrl}`));
    await category.remove();
    req.flash("alertMessage", "Success Delete Category");
    req.flash("alertStatus", "primary");
    res.redirect("/admin/category");
  },

  // USER
  viewUser: async (req, res) => {
    try {
      const user = await User.find();
      const alertMessage = req.flash("alertMessage");
      const alertStatus = req.flash("alertStatus");
      const alert = { message: alertMessage, status: alertStatus };
      res.render("admin/user/view_user", {
        user,
        alert,
        userSession: req.session.userSession
      });
    } catch (error) {
      res.redirect("/admin/user");
    }
  },

  addUser: async (req, res) => {
    try {
      const { fullName, userName, pass, role } = req.body;
      await User.create({
        fullName,
        userName,
        pass,
        role,
      });
      req.flash("alertMessage", "Success Add User");
      req.flash("alertStatus", "primary");
      res.redirect("/admin/user");
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/admin/user");
    }
  },

  editUser: async (req, res) => {
    try {
      const { id, fullName, userName, pass, role } = req.body;
      const user = await User.findOne({ _id: id });
      // console.log(fullName);
      user.fullName = fullName;
      user.userName = userName;
      user.pass = pass;
      user.role = role;

      await user.save();
      req.flash("alertMessage", "Success Update User");
      req.flash("alertStatus", "primary");
      res.redirect("/admin/user");
    } catch (error) {
      res.redirect("/admin/user");
    }
  },

  deleteUser: async (req, res) => {
    const { id } = req.params;
    const user = await User.findOne({ _id: id });
    await user.remove();
    req.flash("alertMessage", "Success Delete User");
    req.flash("alertStatus", "primary");
    res.redirect("/admin/user");
  },

  // ACCOUNT
  viewAccount: async (req, res) => {
    try {
      const account = await Account.find()
        .populate({ path: "userId", select: "id userName" })
        .sort({ accName:1 } );
      const user = await User.find();
      console.log(account);
      const alertMessage = req.flash("alertMessage");
      const alertStatus = req.flash("alertStatus");
      const alert = { message: alertMessage, status: alertStatus };
      res.render("admin/account/view_account", {
        account,
        alert,
        user,
        userSession: req.session.userSession
      });
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/admin/account");
    }
  },

  addAccount: async (req, res) => {
    try {
      const { userId, accName, accType, balance } = req.body;
      const user = await User.findOne({ _id: userId });
      // MEMBUAT RELASI 
      // CREATE DATA ACCOUNT + ARRAY ID USER
      const newItem = {
        userId: user._id,
        accName,
        accType,
        balance,
        accImageUrl: `images/${req.file.filename}`
      };
      const account = await Account.create(newItem)

      // ISI ARRAY DATA USER DENGAN ID ACCOUNT
      user.accountId.push({ _id: account._id });
      await user.save();

      req.flash("alertMessage", "Success Add Account");
      req.flash("alertStatus", "primary");
      res.redirect("/admin/account");
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/admin/account");
    }
  },

  editAccount: async (req, res) => {
    try {
      const { id, accName, accType, balance, userId } = req.body;
      const account = await Account.findOne({ _id: id });
      // console.log(req.file);
      if (req.file == undefined) {
        account.accName = accName;
        account.accType = accType;
        account.balance = balance;
        account.userId = userId

        console.log(account.userId);
        await account.save();
        req.flash("alertMessage", "Success Update Account");
        req.flash("alertStatus", "primary");
        res.redirect("/admin/account");
      } else {
        await fs.unlink(path.join(`public/${account.accImageUrl}`));
        account.accName = accName;
        account.accType = accType;
        account.balance = balance;
        account.userId = userId
        account.accImageUrl = `images/${req.file.filename}`;
        await account.save();
        req.flash("alertMessage", "Success Update Account dan Update Foto");
        req.flash("alertStatus", "primary");
        res.redirect("/admin/account");
      }
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/admin/account");
    }
  },

  deleteAccount: async (req, res) => {
    const { id } = req.params;
    //MENGHAPUS ACCOUNT DI COLECT ACCOUNT DAN GAMBAR
    const account = await Account.findOne({ _id: id });
    await fs.unlink(path.join(`public/${account.accImageUrl}`));
    await account.remove();

    // MENGHAPUS ACCOUNT DI COLECT USER
    // CARI DOCUMENT DENGAN ACCOUNT ID YG DIDELETE. PULL DENGAN KEY _ID. SAVE 
    const user = await User.findOne({ accountId: id });
    user.accountId.pull({ _id: id });
    await user.save();

    req.flash("alertMessage", "Success Delete Category");
    req.flash("alertStatus", "primary");
    res.redirect("/admin/account");
  },

  // ACCOUNT
  viewTrans: async (req, res) => {
    try {
      const trans = await Trans.find()
        .populate("accountId")
        .populate("categoryId")
        .populate("userId")
      console.log(trans);

      const alertMessage = req.flash("alertMessage");
      const alertStatus = req.flash("alertStatus");
      const alert = { message: alertMessage, status: alertStatus };
      res.render("admin/trans/view_trans", {
        trans,
        alert,
        userSession: req.session.userSession,
        moment: moment
      });
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/admin/trans");
    }
  },

  deleteTrans: async (req, res) => {
    const { id } = req.params;
    //MENGHAPUS ACCOUNT DI COLECT ACCOUNT DAN GAMBAR
    const trans = await Trans.findOne({ _id: id });
    await trans.remove();

    req.flash("alertMessage", "Success Delete Trans");
    req.flash("alertStatus", "primary");
    res.redirect("/admin/trans");
  },
};
