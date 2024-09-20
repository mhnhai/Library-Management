const express = require("express");
const borrow = require("../controllers/borrow.controller");

const router = express.Router();

router.route("/")
    .get(borrow.findAll)
    .post(borrow.create)
    .delete(borrow.deleteAll);

router.route("/:id")
    .get(borrow.findOne)
    .put(borrow.update)
    .delete(borrow.delete);
    
module.exports = router;