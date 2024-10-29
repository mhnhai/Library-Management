<template>
  <div class="page">
    <div class="d-flex flex-wrap g-3 bg-body border border-black rounded">
      <div class="container text-center">
        <h3 class="m-3">Giỏ mượn của bạn</h3>
        <hr>
      </div>
      <div class="container">
        <div class="p-2" v-for="(book, index) in books" :key="index">
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
  data() {
    return {
      books: [],
      account: null,
    };
  },
  methods: {
    loadBorrowCart() {
      const borrowCartData = localStorage.getItem('borrowCart');
      if (borrowCartData) {
        this.books = JSON.parse(borrowCartData);
      }
    },
    deleteBook(index) {
      this.books.splice(index, 1);
      // Cập nhật lại localStorage sau khi xóa
      localStorage.setItem('borrowCart', JSON.stringify(this.books));
    },
    async borrow() {
      try {
        // Tạo đối tượng mượn sách mới
        const borrowData = {
          account: this.account._id,
          book: this.books,
          status: "added",
          amount: this.books.length
        };

        // Gọi API để tạo phiếu mượn
        await BorrowService.create(borrowData);

        // Xóa giỏ mượn trong localStorage
        localStorage.removeItem('borrowCart');

        // Reset books array
        this.books = [];

        // Có thể thêm thông báo thành công ở đây
        alert("Đặt mượn thành công!");

      } catch (error) {
        console.error("Error while borrowing:", error);
        alert("Có lỗi xảy ra khi đặt mượn!");
      }
    }
  },
  created() {
    // Load account từ localStorage
    const accountData = localStorage.getItem("account");
    if (accountData) {
      this.account = JSON.parse(accountData);
    }

    // Load giỏ mượn từ localStorage
    this.loadBorrowCart();
  }
};
</script>

<style scoped>
.page {
  text-align: left;
  max-width: max-content;
}
</style>