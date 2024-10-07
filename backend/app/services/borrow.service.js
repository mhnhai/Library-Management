const { ObjectId } = require("mongodb");
class BorrowService {
    constructor (client) {
        this.borrow = client.db().collection("borrows");
    }
    // Định nghĩa các phương thức truy xuất CSDL sử dụng monggodb API
    extractConactData (payload) {
        const borrow = {
            book: payload.book, //sach muon
            account: payload.account, //nguoi muon
            status: payload.status, // tinh trang muon (dang them vao gio hang: adding, da xong gio hang-> den muon sach: added ,dang muon: borrowing, da tra: borrowed)
            amount: payload.amount, // so luong sach trong
            borrowed_date: payload.borrowed_date, //ngay muon sach
            return_date: payload.return_date,
        };
        // Remove undefined fields
        Object.keys(borrow).forEach(
            (key) => {borrow[key] === undefined && delete borrow[key]}
        );
        return borrow;
    }

    async create(payload){
        const borrow = this.extractConactData(payload);
        const result = await this.borrow.findOneAndUpdate(
            borrow,
            {$set: {} },
            { returnDocument: 'after', upsert: true }
        );
        return result;
    }

    async find(filter){
        const cursor = await this.borrow.find(filter);
        return await cursor.toArray();
    }
    async findByTitle(name){
        return await this.find({
            name: { $regex: new RegExp(name), $options: 'i' },
        });
    }

    async update(id, payload){
        const filter = {
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        };
        const update = this.extractConactData(payload);
        const result = await this.borrow.findOneAndUpdate(
            filter,
            { $set: update},
            {returnDocument: 'after'}
        );
        return result;
    }
    // Xoa 1 san pham

    async delete(id){
        const result = await this.borrow.findOneAndDelete({
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        });
        return result;
    }
    // Xoa tat ca san pham
    async deleteAll(){
        const result = await this.borrow.deleteMany({});
        return result.deletedCount;
    }
}

module.exports = BorrowService;