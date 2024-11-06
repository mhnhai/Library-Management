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
          Chỉnh sửa
        </button>
        <CartModal :cart="cart" :id="'cartModal' + index" @cart-updated="updateCart"/>
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
    };
  },
  computed: {
    reversedCarts() {
      return [...this.carts].reverse();
    },
    filteredCarts() {
      const searchTerm = this.searchText.toLowerCase().trim();
      if (!searchTerm) {
        return this.reversedCarts;
      }

      return this.reversedCarts.filter(cart => {
        const fullName = cart.account.fullname?.toLowerCase() || '';
        const phone = cart.account.phone?.toLowerCase() || '';

        return fullName.includes(searchTerm) ||
            phone.includes(searchTerm);
      });
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