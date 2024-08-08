const express = require("express");
const db = require("./config/db");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const Admin = require("./models/adminModel");
require('dotenv').config();

const Router = require("./routers/adminRoutes");

const app = express();

app.set("view engine", "ejs");

app.use(session({
    secret: process.env.SESSION_SECRET || 'defaultSecret',
    resave: false,
    saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

passport.use(new LocalStrategy(
    async (username, password, done) => {
        try {
            const admin = await Admin.findOne({ username });
            if (!admin) {
                return done(null, false, { message: 'Incorrect username.' });
            }
            const isMatch = await bcrypt.compare(password, admin.password);
            if (!isMatch) {
                return done(null, false, { message: 'Incorrect password.' });
            }
            return done(null, admin);
        } catch (err) {
            return done(err);
        }
    }
));

passport.serializeUser((admin, done) => {
    done(null, admin.id);
});

passport.deserializeUser((id, done) => {
    Admin.findById(id, (err, admin) => {
        done(err, admin);
    });
});

app.use(Router);

app.listen(7890, () => {
    console.log("Server Started");
});
