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
          <button v-if="cart.amount>0" class="btn btn-primary" @click="borrow()">
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
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";

export default {
  data() {
    return {
      cart: [],
      books:[],
      account: null,
    };
  },
  methods: {
    loadBorrowCart() {
      const borrowCartData = localStorage.getItem('borrowCart');
      if (borrowCartData) {
        this.cart = JSON.parse(borrowCartData);
        this.books = this.cart.book;
      }
    },
    deleteBook(index) {
      // Loại bỏ sách tại chỉ mục index và tạo mảng mới
      this.cart.book = this.books.filter((_, i) => i !== index);
      this.cart.amount--;
      this.books = this.cart.book;

      // Cập nhật lại localStorage sau khi xóa
      localStorage.setItem('borrowCart', JSON.stringify(this.cart));
    },

    async borrow() {
      try {
        // Tạo đối tượng mượn sách mới
        const borrowData = {
          account: this.account,
          book: this.cart.book,
          status: "added",
          amount: this.cart.amount
        };

        // Gọi API để tạo phiếu mượn
        await BorrowService.create(borrowData);

        // Xóa giỏ mượn trong localStorage
        localStorage.removeItem('borrowCart');

        // Reset trạng thái của giỏ mượn và danh sách sách
        this.books = [];
        this.cart = { book: [], amount: 0 };
        // Toast thông báo
        return toast("Đặt mượn thành công.", {
          "type": "success",
          "pauseOnHover": false,
          "dangerouslyHTMLString": true,
        });

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