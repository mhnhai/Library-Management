<template>
    <div v-if="book" class="page-detail">
        <div class="detail-book col g-3">
            <div class="row">
                
                <img class="col-md-6" v-if="book.imageUrl" :src="book.imageUrl" style="width: 30vh; height: 50vh;" />
                <div class="col">
                    <p class="col-md-3"><strong>Tác giả:</strong> {{ book.author }}</p>
                    <p class="col-md-3"><strong>Thể loại:</strong> {{ book.category }}</p>
                    <p class="col-md-3"><strong>Năm xuất bản:</strong> {{ book.publishDate }}</p>
                    <p class="col-md-3"><strong>Nhà xuất bản:</strong> {{ book.publisher }}</p>
                    <p class="col-md-3"><strong>Số trang:</strong> {{ book.pages }}</p>
                    <p class="col-md-3"><strong>Thể loại:</strong> {{ book.category }}</p>
                    <p class="col-md-3"><strong>Thể loại:</strong> {{ book.category }}</p>
                    <p class="col-md-3"><strong>Thể loại:</strong> {{ book.category }}</p>
                    <div class="col-md-6 d-inline">
                        <button v-on:click="counter -= 1" type="button" class="btn btn-outline-dark"><i class="fa-solid fa-minus"></i></button>
                        <div class="d-inline p-3">
                            {{ counter }} 
                        </div>
                        <button v-on:click="counter += 1" type="button" class="btn btn-outline-dark"><i class="fa-solid fa-plus"></i></button>
                    </div>
                    <div class="col-md-3 mt-3">
                        <button v-if="book.amount > 0" type="button" class="btn btn-outline-secondary" @click="addToBorrow(book._id)">Mượn sách</button>
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
import BorrowService from "@/services/borrow.service"
export default {
    props: {
        id: { type: String, required: true },
    },
    data() {
        return {
            borrowedBook: [],
            book: null,
            counter: 1
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
        async addToBorrow(id){
            try {
                this.book = await BookService.get(id);
                let object = {"book": this.book};
                console.log("Borrowing book:", object);
                this.borrowedBook.push(object)
                console.log("Borrowing book:", this.borrowedBook);
            } catch (error){
                console.log("loi")
            }
            
        }
    },
    created() {
        this.getBook(this.id);
    },
};
</script>
