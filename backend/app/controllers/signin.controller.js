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

