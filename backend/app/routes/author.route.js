const express = require("express");
const author = require("../controllers/author.controller");

const router = express.Router();

router.route("/")
    .get(author.findAll)
    .post(author.create)
    .delete(author.deleteAll);

router.route("/:id")
    .get(author.findOne)
    .put(author.update)
    .delete(author.delete);
    
module.exports = router;