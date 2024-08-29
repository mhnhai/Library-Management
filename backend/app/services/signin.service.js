const { ObjectId } = require("mongodb");

class SigninService {
    constructor (client) {
        this.signin = client.db().collection("signin");
    }
    // Định nghĩa các phương thức truy xuất CSDL sử dụng monggodb API
    extractConactData (payload) {
        const signin = {
            username: payload.username,
            password: payload.password,
            phone: payload.phone,
            role: payload.role, // admin, user
        };
        // Remove undefined fields
        Object.keys(signin).forEach(
            (key) => {signin[key] === undefined && delete signin[key]}
        );
        return signin;
    }

    async create(payload){
        const signin = this.extractConactData(payload);

        const result = await this.signin.findOneAndUpdate(
            signin,
        {$set: {} },
        { returnDocument: 'after', upsert: true }
        );
        return result;
    }
    
    async find(filter){
        const cursor = await this.signin.find(filter);
        return await cursor.toArray();
    }

    async findByName(name){
        return await this.find({
            name: { $regex: new RegExp(name), $options: 'i' },
        });
    }
}

module.exports = SigninService;