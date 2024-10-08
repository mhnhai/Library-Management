const MongoDB = require("../utils/mongodb.util");
const ApiError = require("../api-error");
const BookService = require("../services/book.service");

// Xử lý chức năng thêm một sach moi
exports.create = async (req, res,next) => {
        // req.body.img  = new Buffer(req.body.img, 'base64');

    try {
        const bookService = new BookService(MongoDB.client);
        const document = await bookService.create(req.body);
        return res.send(document);
    } catch (error) {
        return next(
            new ApiError (500, "An error occurred while creating the book")
        );
    }
}

exports.findAll = async (req, res, next) =>{
    let documents = [];
    try {
        const bookService = new BookService(MongoDB.client);
        const { title, author, category, language } = req.query; 
        if (title) {
            documents = await bookService.findByTitle(title);
        } else if(author){
            documents = await bookService.findByAuthor(author);       
        } else if(category){
            documents = await bookService.findByCategory(category);
        } else if(language){
            documents = await bookService.findByLanguage(language);
        }
        else {
            documents = await bookService.find({});
        }
    } catch (error) {
        return next(
            new ApiError(500, "An error occurred while retrieving books")
        );
    }

    return res.send (documents) ;
};

exports.findOne = async (req, res, next) => {
    try {
        const bookService = new BookService(MongoDB.client);
        const document = await bookService.findById(req.params.id);
        if (!document) {
            return next(new ApiError(404, "book not found"));
        } 
        return res.send(document);
    } catch (error) {
        return next(
            new ApiError(
                500, 
                `Error retrieving book`
            )
        );
    }
}

exports.update = async(req, res, next) => {
    if(Object.keys(req.body).length === 0){
        return next(new ApiError(400, "Data to update can not be empty"));
    }
    try {
        const bookService = new BookService(MongoDB.client);
        const document = await bookService.update(req.params.id, req.body);
        if (!document) {
            return next(new ApiError(404, "book not found"));
        } 

        return res.send({message: "book was updated successfully"});
    } catch (error) {
        return next(
            new ApiError(
                500, 
                `Error updating book with id=${req.params.id}`
            )
        );
    }
}

// Xoa 1 san pham
exports.delete = async (req, res, next) => {
    try {
        const bookService = new BookService(MongoDB.client);
        const document = await bookService.delete(req.params.id);
        if (!document) {
            return next(new ApiError(404, "book not found"));
        } 
        return res.send({message: "book was deleted successfully"});
    } catch (error) {
        return next(
            new ApiError(
                500, 
                `Error not delete book with id=${req.params.id}`
            )
        );
    }
};

exports.deleteAll = async(req, res, next) => {
    try {
        const bookService = new BookService(MongoDB.client);
        const deletedCount = await bookService.deleteAll();
        return res.send({message: `${deletedCount} books was deleted successfully`});
    } catch (error) {
        return next(
            new ApiError(
                500, 
                `Error not occurred while removing with all books`
            )
        );
    }
};

