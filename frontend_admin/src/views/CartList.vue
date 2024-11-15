<template>
  <div class="container">
    <div class="row mb-3">
      <div class="col">
        <h2>Danh sách giỏ mượn</h2>
      </div>
    </div>


    <!--  thanh tìm kiếm -->
    <div class="row mb-3">
      <div class="col-md-6">
        <div class="input-group">
          <input
              type="text"
              class="form-control"
              v-model="searchText"
              placeholder="Tìm kiếm theo tên hoặc số điện thoại..."
          >
        </div>
      </div>
      <div class="col-5 d-flex align-items-center">
        <label for="statusFilter" class="me-2">Lọc theo trạng thái:</label>
        <select id="statusFilter" v-model="filterStatus" class="form-select w-auto">
          <option value="all">Tất cả</option>
          <option value="cancelled">Đã hủy</option>
          <option value="added">Đã thêm vào giỏ</option>
          <option value="borrowed">Đã mượn</option>
          <option value="returned">Đã trả</option>
        </select>
      </div>
    </div>


    <ul class="list-group col-auto overflow-y-scroll" style="max-height: 100vh;">
      <li class="list-group-item" v-for="(cart, index) in filteredCarts" :key="cart._id">
        Người mượn: {{ cart.account.fullname }}
        <span :class="getStatusClass(cart.status)">{{ getStatusLabel(cart.status) }}</span>
        <button
            type="button"
            class="btn btn-sm btn-outline-primary float-end"
            data-bs-toggle="modal"
            :data-bs-target="'#cartModal' + index"
        >
          Cập nhật trạng thái
        </button>
        <CartModal :cart="cart" :id="'cartModal' + index" @update:cart="updateCart"/>
      </li>
    </ul>
  </div>
</template>

<script>
import BorrowService from "@/services/borrow.service";
import CartModal from "@/components/CartModal.vue";

export default {
  components: {
    CartModal,
  },
  data() {
    return {
      indexCart: -1,
      books: [],
      searchText: "",
      carts: [],
      account: null,
      book: null,
      filterStatus: "all",
    };
  },
  computed: {
    reversedCarts() {
      return [...this.carts].reverse();
    },
    filteredCarts() {
      // Bước 1: Lọc theo trạng thái trước
      let filtered = this.reversedCarts;
      if (this.filterStatus !== "all") {
        filtered = filtered.filter(cart => cart.status === this.filterStatus);
      }

      // Bước 2: Tìm kiếm theo text
      const searchTerm = this.searchText.toLowerCase().trim();
      if (searchTerm) {
        filtered = filtered.filter(cart => {
          const fullName = cart.account.fullname?.toLowerCase() || '';
          const phone = cart.account.phone?.toLowerCase() || '';
          return fullName.includes(searchTerm) || phone.includes(searchTerm);
        });
      }

      return filtered;
    }
  },
  methods: {
    async getBorrow() {
      try {
        this.carts = await BorrowService.getAll();
      } catch (error) {
        console.error("Error fetching borrows:", error);
        // Handle error appropriately
      }
    },
    updateCart(updatedCart) {
      const index = this.carts.findIndex(cart => cart._id === updatedCart._id);
      if (index !== -1) {
        this.carts[index] = updatedCart;
        this.carts = [...this.carts]; // Trigger reactivity
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
    this.getBorrow();
  }
};
</script>