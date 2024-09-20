const express = require("express");
const signin = require("../controllers/signin.controller");

const router = express.Router();

router.route("/")
    .get(signin.findAll)
    .post(signin.create)
    .delete(signin.deleteAll);

router.route("/:id")
    .get(signin.findOne)
    .put(signin.update)
    .delete(signin.delete);
module.exports = router;