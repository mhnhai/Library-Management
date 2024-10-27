const { ObjectId } = require("mongodb");
class BookService {
    constructor (client) {
        this.book = client.db().collection("books");
    }
    // Định nghĩa các phương thức truy xuất CSDL sử dụng monggodb API
    extractConactData (payload) {
        const book = {
            title: payload.title, //tieu de
            ISBN: payload.ISBN, //ma sach
            price: payload.price, // gia tien
            amount: payload.amount, // so quyen
            author: payload.author, //tac gia
            publishDate: payload.publishDate, //nam xuat ban
            publisher: payload.publisher, // nha xuat ban
            category: payload.category, //the loai
            pages: payload.pages, // so trang
            imageUrl: payload.imageUrl, // bia sach
            description: payload.description
        };
        // Remove undefined fields
        Object.keys(book).forEach(
            (key) => {book[key] === undefined && delete book[key]}
        );
        return book;
    }

    async create(payload){
        const book = this.extractConactData(payload);
        const result = await this.book.findOneAndUpdate(
            book,
            {$set: {} },
            { returnDocument: 'after', upsert: true }
        );
        return result;
    }

    async find(filter){
        const cursor = await this.book.find(filter);
        return await cursor.toArray();
    }
    async findByTitle(title){
        return await this.find({
            title: { $regex: new RegExp(title), $options: 'i' },
        });
    }
    async findByAuthor(author){
        return await this.find({
            author: { $regex: new RegExp(author), $options: 'i' },
        });
    }
    async findByCategory(category){
        return await this.find({
            category: { $regex: new RegExp(category), $options: 'i' },
        });
    }
    async findByLanguage(language){
        return await this.find({
            language: { $regex: new RegExp(language), $options: 'i' },
        });
    }

    async findById(id){
        return await this.book.findOne({
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        });
    }

    async update(id, payload){
        const filter = {
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        };
        const update = this.extractConactData(payload);
        const result = await this.book.findOneAndUpdate(
            filter,
            { $set: update},
            {returnDocument: 'after'}
        );
        return result;
    }
    // Xoa 1 san pham

    async delete(id){
        const result = await this.book.findOneAndDelete({
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        });
        return result;
    }
    // Xoa tat ca san pham
    async deleteAll(){
        const result = await this.book.deleteMany({});
        return result.deletedCount;
    }
}

module.exports = BookService;