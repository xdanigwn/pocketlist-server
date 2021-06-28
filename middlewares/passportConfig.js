const User = require("../model/User");
const bcrypt = require("bcryptjs");
const localStrategy = require("passport-local").Strategy;

module.exports = function (passport) {
  passport.use(
    new localStrategy((username, password, done) => {
      User.findOne({ userName: username }, async (err, user) => {

        // return done(null, user, user.pass);
        if (err) throw err;
        if (!user) return done(null, false);

        // await bcrypt.compare(pass, existingUser.pass)
        const isMatch = await bcrypt.compare(password, user.pass);
        if(isMatch) {
            return done(null, user);
        }else{
            return done(null, false);
        }
      });
    })
  );

  passport.serializeUser((user, cb) => {
    cb(null, user.id);
  });
  passport.deserializeUser((id, cb) => {
    User.findOne({ _id: id }, (err, user) => {
      const userInformation = {
        username: user._id,
        fullname: user.fullName
      };
      cb(err, userInformation);
    });
  });
};