<template>
  <div v-if="book" class="page-detail">
    <div class="detail-book col g-3">
      <div class="row bg-white py-2 rounded-3">
        <img class="col-md-6" v-if="book.imageUrl" :src="book.imageUrl" style="width: 30vh; height: 50vh;" />
        <div class="col">
          <h3 class="col-md-10"><strong>Tiêu đề:</strong> {{ book.title }}</h3>
          <p class="col-md-3"><strong>Tác giả:</strong> {{ book.author }}</p>
          <p class="col-md-3"><strong>Thể loại:</strong> {{ book.category }}</p>
          <p class="col-md-4"><strong>Năm xuất bản:</strong> {{ book.publishDate }}</p>
          <p class="col-md-6"><strong>Nhà xuất bản:</strong> {{ book.publisher }}</p>
          <p class="col-md-3"><strong>Số trang:</strong> {{ book.pages }}</p>
          <div class="col-md-3 mt-3">
            <button v-if="book.amount > 0" type="button" class="btn btn-outline-secondary"
                    @click="addToBorrow()">Mượn sách</button>
            <button v-else class="btn btn-secondary disabled">Đã hết sách</button>
          </div>
        </div>
      </div>
      <div class="row bg-white py-2 rounded-3 mt-3" style="white-space: pre-line;">
        <div>
          {{ book.description }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import BookService from "@/services/book.service";
import {toast} from "vue3-toastify";

export default {
  props: {
    id: { type: String, required: true },
  },
  data() {
    return {
      book: null,
      account: null,
    };
  },
  methods: {
    async getBook(id) {
      try {
        this.book = await BookService.get(id);
      } catch (error) {
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

    getCartFromStorage() {
      const cartData = localStorage.getItem('borrowCart');
      if (!cartData) return null;

      try {
        return JSON.parse(cartData);
      } catch (error) {
        console.error("Error parsing borrowCart from localStorage:", error);
        return null;
      }
    },


    saveCartToStorage(cart) {
      localStorage.setItem('borrowCart', JSON.stringify(cart));
    },

    async addToBorrow() {
      try {
        if (!this.account) {
          alert("Bạn chưa đăng nhập tài khoản.");
          return;
        }

        // Lấy giỏ hàng từ localStorage, nếu chưa có thì tạo mới giỏ hàng
        let cart = this.getCartFromStorage();
        if (!cart) {
          cart = {
            book: [],          // Đảm bảo book luôn là một mảng rỗng khi khởi tạo
            account: this.account,
            status: "adding",
            amount: 0
          };
        }

        // Đảm bảo `cart.book` tồn tại và là một mảng
        cart.book = cart.book || [];

        // Kiểm tra số lượng sách trong giỏ
        if (cart.amount >= 3) {
          alert("Bạn chỉ có thể thêm tối đa 3 quyển sách vào giỏ hàng.");
          return;
        }

        // Kiểm tra sách đã có trong giỏ chưa
        const bookExists = cart.book.some(b => b._id === this.book._id);
        if (bookExists) {
          alert("Đã có sẵn sách trong giỏ hàng của bạn.");
          return;
        }

        // Thêm sách vào giỏ
        cart.book.push(this.book);
        cart.amount += 1;

        // Lưu giỏ hàng vào localStorage
        this.saveCartToStorage(cart);
        //Toast thông báo
        return toast("Đã thêm sách vào giỏ.", {
          "type": "success",
          "pauseOnHover": false,
          "dangerouslyHTMLString": true,
        });
      } catch (error) {
        console.error("Lỗi khi thêm sách vào giỏ hàng:", error);
        alert("Đã xảy ra lỗi khi thêm sách vào giỏ hàng. Vui lòng thử lại sau.");
      }
    }

  },
  created() {
    this.getBook(this.id);
    const accountData = localStorage.getItem("account");
    if (accountData) {
      this.account = JSON.parse(accountData);
    }
  },
};
</script>