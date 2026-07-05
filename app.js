const express = require("express");
const session = require("express-session");
const passport = require("passport");

const app = express();
const path = require("path");
const userRoutes = require("./routes/userRoutes");
const messageRoutes = require("./routes/messageRoutes");
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use("/messages", messageRoutes);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// SESSION setup
app.use(
  session({
    secret: "mysecretkey",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false // will become true in production with HTTPS
    }
  })
);

// PASSPORT setup
app.use(passport.initialize());
app.use(passport.session());
const methodOverride = require("method-override");

app.use(methodOverride("_method"));
app.use("/users", userRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server running");
});