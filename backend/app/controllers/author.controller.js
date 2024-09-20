const AuthorService = require("../services/author.service");
const MongoDB = require("../utils/mongodb.util");
const ApiError = require("../api-error");

exports.create = async (req, res,next) => {
    try {
        const authorService = new AuthorService(MongoDB.client);
        const document = await authorService.create(req.body);
        return res.send(document);
    } catch (error) {
        return next(
            new ApiError (500, "An error occurred while creating the account")
        );
    }
}

exports.findAll = async (req, res, next) =>{
    let documents = [];
    try {
        const authorService = new AuthorService(MongoDB.client);
        const { name } = req.query;
        if (name) {
            documents = await authorService.findByName(name);
        } else {
            documents = await authorService.find({});
        }
    } catch (error) {
        return next(
            new ApiError(500, "An error occurred while retrieving account")
        );
    }

    return res.send (documents) ;
};

exports.findOne = async (req, res, next) => {
    try {
        const authorService = new AuthorService(MongoDB.client);
        const document = await authorService.findById(req.params.id);
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

exports.deleteAll = async(req, res, next) => {
    try {
        const authorService = new AuthorService(MongoDB.client);
        const deletedCount = await authorService.deleteAll();
        return res.send({message: `${deletedCount} accounts was deleted successfully`});
    } catch (error) {
        return next(
            new ApiError(
                500, 
                `Error occurred while removing with all books`
            )
        );
    }
};

exports.update = async(req, res, next) => {
    if(Object.keys(req.body).length === 0){
        return next(new ApiError(400, "Data to update can not be empty"));
    }
    try {
        const authorService = new AuthorService(MongoDB.client);
        const document = await authorService.update(req.params.id, req.body);
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

exports.delete = async (req, res, next) => {
    try {
        const authorService = new AuthorService(MongoDB.client);
        const document = await authorService.delete(req.params.id);
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

