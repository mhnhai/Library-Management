<template>
  <div v-if="account" class="page">
    <h4>Lịch sử mượn sách</h4>
    <!-- Dropdown chọn trạng thái để lọc giỏ hàng -->
    <div class="d-flex align-items-center mb-4">
      <label for="statusFilter" class="me-2">Lọc theo trạng thái:</label>
      <select id="statusFilter" v-model="filterStatus" class="form-select w-auto">
        <option value="all">Tất cả</option>
        <option value="added">Đã thêm vào giỏ</option>
        <option value="borrowing">Đang mượn</option>
        <option value="borrowed">Đã mượn</option>
      </select>
    </div>

    <div class="container container-fluid">
      <!-- Danh sách giỏ hàng sau khi áp dụng bộ lọc -->
      <div v-for="(cart, index) in filteredCarts" :key="cart._id" class="row mb-4">
        <div class="col-8">
          <h5>{{ cart.book[0]?.title }}</h5>
          <p>Trạng thái: {{ getStatusLabel(cart.status) }}</p>
        </div>
        <div class="col-4 text-end">
          <button type="button" class="btn btn-sm btn-outline-primary float-end" data-bs-toggle="modal" :data-bs-target="'#CartDetailModal' + index">Chi tiết giỏ hàng</button>

          <!-- Modal chi tiết giỏ hàng -->
          <CartDetailModal :cart="cart" :id="'CartDetailModal' + index" />

        </div>
      </div>
    </div>

  </div>
</template>

<script>
import CartDetailModal from "@/components/CartDetailModal.vue";
import BorrowService from "@/services/borrow.service";

export default {
  components: {
    CartDetailModal,
  },
  data() {
    return {
      account: null,
      borrowedList: [],
      filterStatus: "all", // Trạng thái lọc mặc định là "all" (tất cả)
    };
  },
  computed: {
    filteredCarts() {
      // Lọc danh sách giỏ hàng dựa trên filterStatus
      if (this.filterStatus === "all") {
        return this.borrowedList;
      }
      return this.borrowedList.filter(cart => cart.status === this.filterStatus);
    },
  },
  methods: {
    async getAllBorrow() {
      try {
        this.borrowedList = await BorrowService.getAll();
        const userId = this.account._id;
        // Lọc các giỏ hàng thuộc về tài khoản hiện tại
        this.borrowedList = this.borrowedList.filter(cart => cart.account._id === userId);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách mượn:", error);
        this.$router.push({name: "notfound"});
      }
    },
    getStatusLabel(status) {
      const statusLabels = {
        added: "Đã thêm vào giỏ",
        borrowing: "Đang mượn",
        borrowed: "Đã mượn",
      };
      return statusLabels[status] || status;
    },
  },
  created() {
    const accountData = localStorage.getItem("account");
    if (accountData) {
      this.account = JSON.parse(accountData);
      this.getAllBorrow();
    }
  },
};
</script>

<style scoped>
.page {
  max-width: 100%;
}
</style>
