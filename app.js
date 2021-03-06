var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var cors = require("cors");
const methodOverride = require("method-override");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
// const passportLocal = require("passport-local").Strategy;

//import mongosee
const mongoose = require("mongoose");
mongoose.connect(
  "mongodb://danigwn:pocketlist90@cluster0-shard-00-01.2amoj.mongodb.net:27017/pocketlist?authSource=admin&replicaSet=atlas-x92bub-shard-0&readPreference=primary&appname=MongoDB%20Compass&ssl=true",
  {
    useNewUrlParser: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  }
);

// -------- ROUTE ---------- //
var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
//router admin
const adminRouter = require("./routes/admin");
//router api
const apiRouter = require("./routes/api");

// -------- EXPRESS ---------- //
var app = express();

app.use(cors({
  origin : ["http://localhost:3001", "https://app-pocketlist.herokuapp.com"] ,
  credentials : true 
}));

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(methodOverride("_method"));

// -------- SESSION  ---------- //
app.set("trust proxy", 1);
app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 1000000,
      sameSite: "none",
      secure: true 
     },
  })
);
app.use(cookieParser("keyboard cat")); // if has cookies parse it into req.cookies
app.use(passport.initialize());
app.use(passport.session());
require('./middlewares/passportConfig')(passport)

app.use(flash());

app.use(logger("dev"));
app.use(express.json()); // convert any incoming request in body to json format.


app.use(express.urlencoded({ extended: false })); 
app.use(express.static(path.join(__dirname, "public")));
app.use(
  "/sb-admin-2", 
  express.static(
    path.join(__dirname, "public/stylesheets/startbootstrap-sb-admin-2")
  )
);

app.use("/", indexRouter);
app.use("/users", usersRouter);

//admin
app.use("/admin", adminRouter);

//api
app.use("/api/v1", apiRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
