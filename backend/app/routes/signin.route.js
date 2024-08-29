const express = require("express");
const signin = require("../controllers/signin.controller");

const router = express.Router();

router.route("/")
    .get(signin.findAll)
    .post(signin.create)

module.exports = router;