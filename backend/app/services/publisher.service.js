const { ObjectId } = require("mongodb");

class PublisherService {
    constructor (client) {
        this.publisher = client.db().collection("publisher");
    }
    // Định nghĩa các phương thức truy xuất CSDL sử dụng monggodb API
    extractConactData (payload) {
        const publisher = {
            name: payload.name,
        };
        // Remove undefined fields
        Object.keys(publisher).forEach(
            (key) => {publisher[key] === undefined && delete publisher[key]}
        );
        return publisher;
    }

    async create(payload){
        const publisher = this.extractConactData(payload);

        const result = await this.publisher.findOneAndUpdate(
            publisher,
        {$set: {} },
        { returnDocument: 'after', upsert: true }
        );
        return result;
    }
    
    async find(filter){
        const cursor = await this.publisher.find(filter);
        return await cursor.toArray();
    }

    async findByName(name){
        return await this.find({
            name: { $regex: new RegExp(name), $options: 'i' },
        });
    }

    async delete(id){
        const result = await this.publisher.findOneAndDelete({
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        });
        return result;
    }
    // Xoa tat ca san pham
    async deleteAll(){
        const result = await this.publisher.deleteMany({});
        return result.deletedCount;
    }
    
    async update(id, payload){
        const filter = {
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        };
        const update = this.extractConactData(payload);
        const result = await this.publisher.findOneAndUpdate(
            filter,
            { $set: update},
            {returnDocument: 'after'}
        );
        return result;
    }
}

module.exports = PublisherService;