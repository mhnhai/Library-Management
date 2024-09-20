const SigninService = require("../services/signin.service");
const MongoDB = require("../utils/mongodb.util");
const ApiError = require("../api-error");

exports.create = async (req, res,next) => {
    try {
        const signinService = new SigninService(MongoDB.client);
        const document = await signinService.create(req.body);
        return res.send(document);
    } catch (error) {
        return next(
            new ApiError (500, "An error occurred while creating the account")
        );
    }
}

exports.delete = async (req, res, next) => {
    try {
        const signinService = new SigninService(MongoDB.client);
        const document = await signinService.delete(req.params.id);
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

exports.findOne = async (req, res, next) => {
    try {
        const signinService = new SigninService(MongoDB.client);
        const document = await signinService.findById(req.params.id);
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

exports.findAll = async (req, res, next) =>{
    let documents = [];
    try {
        const signinService = new SigninService(MongoDB.client);
        const { username } = req.query;
        if (username) {
            documents = await signinService.findByName(username);
        } else {
            documents = await signinService.find({});
        }
    } catch (error) {
        return next(
            new ApiError(500, "An error occurred while retrieving account")
        );
    }

    return res.send (documents) ;
};

exports.deleteAll = async(req, res, next) => {
    try {
        const signinService = new SigninService(MongoDB.client);
        const deletedCount = await signinService.deleteAll();
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
        const signinService = new SigninService(MongoDB.client);
        const document = await signinService.update(req.params.id, req.body);
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