const express = require("express");
const register = require("./register")
const login = require("./login")
const index = require("./index")
const router = express.Router();

router.post("/register", register)
router.post("/login", login)
router.post("/index", index)

module.exports = router;