const express = require("express");
const cors = require("cors");
const libraryBook = require("./app/routes/book.route");
const librarySignin = require("./app/routes/signin.route");
const libraryUpload = require("./app/routes/upload.route")
const libraryAuthor = require('./app/routes/author.route');
const libraryBorrow = require('./app/routes/borrow.route');
const libraryPublisher= require('./app/routes/publisher.route');
const ApiError = require("./app/api-error");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.json({ message: "Welcome to library management application." });
});
app.use("/api/books",libraryBook);
app.use("/api/signin", librarySignin);
app.use("/api/upload", libraryUpload)
app.use("/api/author", libraryAuthor)
app.use("/api/borrow", libraryBorrow)
app.use("/api/publisher", libraryPublisher)
//handle 404 response
app.use((req, res, next) => {
	return next(new ApiError(404, "Resource not found"));
});


// define error-handling middleware last, after other app.use() and routes calls
app.use((err, req, res, next) => {
    return res.status(err.statusCode || 500).json({
        message: err.message || "Internal Server Error",
    });
});

module.exports = app;