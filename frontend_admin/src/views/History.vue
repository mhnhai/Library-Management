<template>
  <div v-if="account" class="page">
    <h4>Lịch sử mượn sách</h4>
    <div class="container container-fluid">
      <div class="row p-2" v-for="(book, index) in books" :key="books._id">
        <div class="row">
          <div class="row">
            <img class="col-3" v-if="book.imageUrl" :src="book.imageUrl" style="width: 150px; height: 180px;" />
            <div class="col-3">
              <p class="col-md-6 fw-bold">{{ book.title }}</p>
            </div>
          </div>
        </div>
      </div>
      <div class="d-flex justify-content-center p-3">
        <p v-if="books.length<0" class="p-3">
          Bạn chưa mượn sách nào cả.
        </p>
        <div v-else>
        </div>
      </div>
    </div>
    <p>{{ message }}</p>
  </div>
</template>
<script>
import BorrowService from "@/services/borrow.service";
export default {
  data() {
    return {
      indexCart: -1,
      books: [],
      searchText: "",
      borrowedList: [],
      account: null,
      book: null,
      carts: [],
    };
  },
  methods: {
    async getAllBorrow() {
      try {
        this.borrowedList = await BorrowService.getAll();
        // Lọc các đối tượng có account.id trùng với id của tài khoản hiện tại
        const userId = this.account._id; // Lấy id của account hiện tại từ localStorage
        // Lọc các sách dựa trên account._id
        for (let i = 0; i < this.borrowedList.length; i++) {
          if(this.borrowedList[i].account._id === userId && this.borrowedList[i].status === "added") {
            for (let j = 0; j < this.borrowedList[i].amount; j++) {
              this.books.push(this.borrowedList[i].book[i]);
            }
          }
        }
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
  },
  created() {
    this.getAllBorrow();
    const accountData = localStorage.getItem("account");
    if (accountData) {
      this.account = JSON.parse(accountData); // Chuyển đổi chuỗi JSON thành đối tượng
    }
  }
};
</script>