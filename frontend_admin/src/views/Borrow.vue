<template>
  <div class="page">
    <div class="d-flex flex-wrap g-3 bg-body border border-black rounded">
      <div class="container text-center">
        <h3 class="m-3">Giỏ mượn của bạn</h3>
        <hr>
      </div>
      <div class="container">
        <div class="p-2" v-for="(book, index) in books" :key="book._id">
          <div class="row pt-3">
            <img class="col-3" v-if="book.imageUrl" :src="book.imageUrl" style="width: 150px; height: 180px;" />
            <div class="col-7">
              <p class="col-xl-12 fw-bold">{{ book.title }}</p>
              <button class="btn btn-outline-dark col-5" @click="deleteBook(index)">
                <i class="fa-regular fa-trash-can fa-flip-horizontal"></i>
                Xóa
              </button>
            </div>
          </div>
        </div>
        <div class="d-flex justify-content-center p-3">
          <button v-if="books.length>0" class="btn btn-primary" @click="borrow()">
            Đặt mượn ngay
          </button>
          <div v-else>
            Giỏ mượn của bạn đang trống, hãy thêm sách vào giỏ.
          </div>
        </div>
      </div>

    </div>

  </div>
</template>
<script>
import BorrowService from "@/services/borrow.service";
export default {
  // Đoạn mã xử lý đầy đủ sẽ trình bày bên dưới
  data() {
    return {
      indexCart: -1,
      books: [],
      searchText: "",
      borrowedList: [],
      account: null,
      book: null,
    };
  },
  methods: {
    async getBorrow() {
      try {
        this.borrowedList = await BorrowService.getAll();
        await this.findIndexCart(this.account);
        this.books = this.borrowedList[this.indexCart].book;
      } catch (error) {
        // Chuyển sang trang NotFound đồng thời giữ cho URL không đổi
      }
    },
    async deleteBook(index) {
      this.borrowedList[this.indexCart].book.splice(index,1);
      this.borrowedList[this.indexCart].amount -=1;
      await BorrowService.update(this.borrowedList[this.indexCart]._id, this.borrowedList[this.indexCart]);
      window.location.reload();
    },
    async findIndexCart(account) {
      try {
        this.indexCart = this.borrowedList.findIndex(cart => (cart.account._id === account._id && cart.status === "adding"));
      } catch (error) {
        console.error("Error in findIndexCart:", error);
        return false;
      }
    },
    async borrow(){
      this.borrowedList[this.indexCart].status = "added";
      await BorrowService.update(this.borrowedList[this.indexCart]._id, this.borrowedList[this.indexCart]);
      window.location.reload();
    }

  },
  created() {
    this.getBorrow();
    const accountData = localStorage.getItem("account");
    if (accountData) {
      this.account = JSON.parse(accountData); // Chuyển đổi chuỗi JSON thành đối tượng
    }
  }
};
</script>
<style scoped>
.page {
  text-align: left;
  max-width: max-content;
}
</style>