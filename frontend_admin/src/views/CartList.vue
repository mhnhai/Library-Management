<template>
  <div class="container">
    <div class="row mb-3">
      <div class="col">
        <h2>Danh sách giỏ mượn</h2>
      </div>
    </div>
    <div class="overflow-y-scroll border border-black" style="max-height: 85vh; ">
      <div v-for="(cart, index) in reversedCarts" :key="cart._id" class="cart">
        <h3>Account: {{ cart.account.username }}</h3>
        <button type="button" class="btn btn-primary" data-bs-toggle="modal" :data-bs-target="'#cartModal' + index">
          Launch demo modal
        </button>
        <CartModal :cart="cart" :id="'cartModal' + index" @cart-updated="updateCart"/>
      </div>
    </div>
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
  },
  created() {
    this.getBorrow();
  }
};
</script>