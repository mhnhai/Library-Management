const express = require("express");
const router = express.Router();
const { upload, uploadImage, getImage, getAllImages, deleteImage, deleteAllImages } = require("../middlewares/upload");

// Route để upload ảnh
router.post("/", upload, uploadImage);

// Các route khác
router.get("/:filename", getImage);
router.get("/", getAllImages);
router.delete("/:filename", deleteImage);
router.delete("/", deleteAllImages);
module.exports = router;
