const express = require("express");
const loggedin = require("../controllers/loggedin")
const logout = require("../controllers/logout")
const router = express.Router();

router.get("/", loggedin, (req, res) => {
    if(req.user){
        res.render("index", {status: "loggedin", user: req.user});
    } else {
        res.render("index", {status: "no", user:"nothing"});
    }
})

router.get("/profile", loggedin, (req, res) => {
    if(req.user){
        res.render("profile", {status: "loggedin", user: req.user});
    } else {
        res.render("profile", {status: "no", user:"nothing"});
    }
})

router.get("/register", (req, res) => {
    res.sendFile("register.html", {root:"./public"});
})

router.get("/login", loggedin, (req, res) => {
    res.sendFile("login.html", {root:"./public/"});
})

router.get("/index", (req, res) => {
    res.sendFile("index.ejs", {root:"./views/"});
})

router.get("/logout", logout)
module.exports = router;