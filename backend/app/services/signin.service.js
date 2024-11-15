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
            email: payload.email,
            fullname: payload.fullname,
            birthdate: payload.birthdate,
            gender: payload.gender,
            address: payload.address,
            phone: payload.phone,
            role: payload.role, //  user, librarian, admin

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

    async findById(id){
        return await this.signin.findOne({
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        });
    }
    
    async find(filter){
        const cursor = await this.signin.find(filter);
        return await cursor.toArray();
    }

    async findByName(username){
        return await this.find({
            username: { $regex: new RegExp(username), $options: 'i' },
        });
    }

    async delete(id){
        const result = await this.signin.findOneAndDelete({
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        });
        return result;
    }
    // Xoa tat ca san pham
    async deleteAll(){
        const result = await this.signin.deleteMany({});
        return result.deletedCount;
    }
    
    async update(id, payload){
        const filter = {
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        };
        const update = this.extractConactData(payload);
        const result = await this.signin.findOneAndUpdate(
            filter,
            { $set: update},
            {returnDocument: 'after'}
        );
        return result;
    }
}

module.exports = SigninService;