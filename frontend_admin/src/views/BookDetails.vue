<template>
    <div v-if="book" class="page-detail">
        <div class="detail-book col g-3">
            <div class="row">
                <img class="col-md-6" v-if="book.imageUrl" :src="book.imageUrl" style="width: 30vh; height: 50vh;" />
                <div class="col">
                    <p class="col-md-3"><strong>Tác giả:</strong> {{ book.author }}</p>
                    <p class="col-md-3"><strong>Thể loại:</strong> {{ book.category }}</p>
                    <p class="col-md-4"><strong>Năm xuất bản:</strong> {{ book.publishDate }}</p>
                    <p class="col-md-4"><strong>Nhà xuất bản:</strong> {{ book.publisher }}</p>
                    <p class="col-md-3"><strong>Số trang:</strong> {{ book.pages }}</p>
                    <p class="col-md-3"><strong>Thể loại:</strong> {{ book.category }}</p>
                    <p class="col-md-3"><strong>Thể loại:</strong> {{ book.category }}</p>
                    <p class="col-md-3"><strong>Thể loại:</strong> {{ book.category }}</p>
                    <!-- <div class="col-md-6 d-inline">
                        <button v-on:click="counter -= 1" type="button" class="btn btn-outline-dark"><i
                                class="fa-solid fa-minus"></i></button>
                        <div class="d-inline p-3">
                            {{ counter }}
                        </div>
                        <button v-on:click="counter += 1" type="button" class="btn btn-outline-dark"><i
                                class="fa-solid fa-plus"></i></button>
                    </div> -->
                    <div class="col-md-3 mt-3">
                        <button v-if="book.amount > 0" type="button" class="btn btn-outline-secondary"
                            @click="addToBorrow()">Mượn sách</button>
                        <button v-else class="btn btn-secondary disabled">Đã hết sách</button>
                    </div>
                </div>
            </div>

            <hr>
            <p class="col-md-12"> {{ book.description }}</p>
        </div>
    </div>


</template>
<script>
import BookService from "@/services/book.service";
import BorrowService from "@/services/borrow.service";
import toast from "bootstrap/js/src/toast.js";
export default {
    props: {
        id: { type: String, required: true },
    },
    data() {
        return {
            borrowedList: [],
            book: null,
            amount: null,
            account: null,
        };
    },
    methods: {
        async getBook(id) {
            try {
                this.book = await BookService.get(id);
            } catch (error) {
                // Chuyển sang trang NotFound đồng thời giữ cho URL không đổi
                this.$router.push({
                    name: "notfound",
                    params: {
                        pathMatch: this.$route.path.split("/").slice(1)
                    },
                    query: this.$route.query,
                    hash: this.$route.hash,
                });
            }
        },
        async getBorrow() {
            try {
                this.borrowedList = await BorrowService.getAll();
            } catch (error) {
                // Chuyển sang trang NotFound đồng thời giữ cho URL không đổi
                this.$router.push({
                    name: "notfound",
                    params: {
                        pathMatch: this.$route.path.split("/").slice(1)
                    },
                    query: this.$route.query,
                    hash: this.$route.hash,
                });
            }
        },
        async checkCart(account) {
            try {
              let a = this.borrowedList.some(cart => (cart.account._id === account._id && cart.status === "adding"));
              return a;
            } catch (error) {
                console.error("Error in checkCart:", error);
                return false;
            }
        },
        async findIndexCart(account) {
            try {
                let index = this.borrowedList.findIndex(cart => (cart.account._id === account._id && cart.status === "adding"));
                return index;
            } catch (error) {
                console.error("Error in checkBookInCart:", error);
                return false;
            }
        },
        async checkBookInCart(book) {
            try {
                let check = this.borrowedList.some(cart => cart.book.some(cartBook => cartBook._id === book._id && cart.account._id === this.account._id && cart.status === "adding"));
                return check;

            } catch (error) {
                console.error("Error in checkBookInCart:", error);
                return false;
            }
        },
        async addToBorrow() {
            try {
                const hasCart = await this.checkCart(this.account);
                console.log(hasCart)
                if (hasCart) // co gio hang chua xong
                {
                    let foundIndex = await this.findIndexCart(this.account);
                    this.amount = this.borrowedList[foundIndex].amount;
                    if (this.amount === 3) {
                        alert("Bạn chỉ có thể thêm tối đa 3 quyển sách vào giỏ hàng.");
                    }
                    else {
                        const hasBookInCart = await this.checkBookInCart(this.book);
                        console.log(hasBookInCart)
                        if (!hasBookInCart) { // chua co sach
                            let object = this.book;
                            this.borrowedList[foundIndex].book.push(object);
                            this.borrowedList[foundIndex].amount += 1;
                            window.location.reload();
                        }
                        else { // co sach
                            alert("Đã có sẳn sách trong giỏ hàng của bạn.")
                            // let foundBookIndex = this.findIndexBook(foundIndex, this.book);
                            // console.log(foundBookIndex)
                            // this.borrowedList[foundIndex].bookList[foundBookIndex].amount += this.counter;
                            // console.log(this.borrowedList[foundIndex].bookList[foundBookIndex].amount)
                        }
                        await BorrowService.update(this.borrowedList[foundIndex]._id, this.borrowedList[foundIndex]);
                    }
                }
                else{ // chua co gio hang
                  let newCart = {
                    book: [],
                    account: this.account,
                    status: "adding",
                    amount: 0
                  };
                  this.borrowedBook = await BorrowService.create(newCart)
              }
            } catch (error) {
                console.log("loi")
            }
        }
    },
    created() {
        this.getBook(this.id);
        this.getBorrow();
        const accountData = localStorage.getItem("account");
        if (accountData) {
            this.account = JSON.parse(accountData); // Chuyển đổi chuỗi JSON thành đối tượng
        }

    },
};
</script>
