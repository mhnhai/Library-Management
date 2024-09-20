const { ObjectId } = require("mongodb");

class AuthorService {
    constructor (client) {
        this.author = client.db().collection("author");
    }
    // Định nghĩa các phương thức truy xuất CSDL sử dụng monggodb API
    extractConactData (payload) {
        const author = {
            name: payload.name,
            bday: payload.bday
        };
        // Remove undefined fields
        Object.keys(author).forEach(
            (key) => {author[key] === undefined && delete author[key]}
        );
        return author;
    }

    async create(payload){
        const author = this.extractConactData(payload);

        const result = await this.author.findOneAndUpdate(
            author,
        {$set: {} },
        { returnDocument: 'after', upsert: true }
        );
        return result;
    }
    
    async find(filter){
        const cursor = await this.author.find(filter);
        return await cursor.toArray();
    }

    async findByName(name){
        return await this.find({
            name: { $regex: new RegExp(name), $options: 'i' },
        });
    }

    async delete(id){
        const result = await this.author.findOneAndDelete({
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        });
        return result;
    }
    // Xoa tat ca san pham
    async deleteAll(){
        const result = await this.author.deleteMany({});
        return result.deletedCount;
    }
    
    async update(id, payload){
        const filter = {
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        };
        const update = this.extractConactData(payload);
        const result = await this.author.findOneAndUpdate(
            filter,
            { $set: update},
            {returnDocument: 'after'}
        );
        return result;
    }
}

module.exports = AuthorService;