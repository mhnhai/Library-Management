<template>
  <div v-if="account" class="page">
    <h4>Lịch sử mượn sách</h4>
    <!-- Dropdown chọn trạng thái để lọc giỏ hàng -->
    <div class="d-flex align-items-center mb-4">
      <label for="statusFilter" class="me-2">Lọc theo trạng thái:</label>
      <select id="statusFilter" v-model="filterStatus" class="form-select w-auto">
        <option value="all">Tất cả</option>
        <option value="cancelled">Đã hủy</option>
        <option value="added">Đã thêm vào giỏ</option>
        <option value="borrowed">Đã mượn</option>
        <option value="returned">Đã trả</option>
      </select>
    </div>

    <div class="container container-fluid">
      <!-- Danh sách giỏ hàng sau khi áp dụng bộ lọc -->
      <div v-for="(cart, index) in filteredCarts" :key="cart._id" class="row mb-4 bg-white border rounded">
        <div class="d-flex align-items-center p-3">
          <div class="col-5">
            <h5>{{ cart.book[0]?.title }}</h5>
            <span :class="getStatusClass(cart.status)">{{ getStatusLabel(cart.status) }}</span>
          </div>
          <div class="col-5 text-end">
            <button type="button" class="btn btn-sm btn-outline-primary float-end" data-bs-toggle="modal" :data-bs-target="'#CartDetailModal' + index">Chi tiết giỏ hàng</button>
            <!-- Modal chi tiết giỏ hàng -->
            <CartDetailModal :cart="cart" :id="'CartDetailModal' + index" @cart-updated="updateCart"/>
          </div>
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
        this.borrowedList = [...this.borrowedList].reverse()
      } catch (error) {
        console.error("Lỗi khi lấy danh sách mượn:", error);
        this.$router.push({name: "notfound"});
      }
    },
    updateCart(updatedCart) {
      const index = this.borrowedList.findIndex(cart => cart._id === updatedCart._id);
      if (index !== -1) {
        this.borrowedList[index] = updatedCart;
        this.borrowedList = [...this.borrowedList]; // Trigger reactivity
      }
    },
    getStatusLabel(status) {
      const statusLabels = {
        cancelled: "Đã hủy",
        added: "Đã thêm vào giỏ",
        borrowed: "Đã mượn",
        returned: "Đã trả",
      };
      return statusLabels[status] || status;
    },
    getStatusClass(status) {
      const statusClasses = {
        cancelled: "badge bg-danger",
        added: "badge bg-warning text-dark",
        borrowed: "badge bg-info text-dark",
        returned: "badge bg-success",
      };
      return statusClasses[status] || "badge bg-secondary";
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