<template>
  <div class="modal fade" id="cartModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="exampleModalLabel">Cart Information</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <h6>Tài khoản mượn: {{ cart.account.username }}</h6>
          <div>
            <div class="row pt-3" v-for="(b, idx) in cart.book" :key="idx">
              <img class="col-4" v-if="b.imageUrl" :src="b.imageUrl" alt="Uploaded Image" style="height: 200px; width: 100px;" />
              <p class="col-md-auto">Title: {{ b.title }} - Author: {{ b.author }}</p>
            </div>
          </div>
          <p>Ngày mượn: {{cart.borrowed_date}}</p>
          <p>Ngày trả: {{cart.return_date}}</p>
          <h6 class="pt-3">Current Status: {{ cart.status }}</h6>

          <div>
            <button
                class="btn btn-primary"
                @click="changeToBorrow('borrowing')"
                :disabled="cart.status !== 'added'">
              Mark as Borrowing
            </button>
            <button
                class="btn btn-primary"
                @click="changeToReturn('borrowed')"
                :disabled="cart.status !== 'borrowing'">
              Mark as Borrowed
            </button>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import BorrowService from "@/services/borrow.service.js";

function getCurrentDate() {
  const today = new Date();
  const day = today.getDate();
  const month = today.getMonth() + 1;
  const year = today.getFullYear();
  return `${day}/${month}/${year}`;
}

export default {
  props: {
    cart: {
      type: Object,
      required: true
    },
  },
  data() {
    return {
      localCarts: [],
    };
  },
  methods: {
    async getBorrow() {
      try {
        this.localCarts = await BorrowService.getAll();
      } catch (error) {
        console.error("Error fetching borrows:", error);
        // Handle error appropriately
      }
    },
    async changeToBorrow(newStatus) {
      const currentDate = getCurrentDate();
        const updatedCart = {
          ...this.cart,
          status: newStatus,
          borrowed_date: currentDate,
        }
      try {
        await BorrowService.update(updatedCart._id, updatedCart);
        // Update the local cart data
        const index = this.localCarts.findIndex(c => c._id === updatedCart._id);
        if (index !== -1) {
          this.localCarts[index] = updatedCart;
        }
        // Emit an event to inform the parent component of the update
        this.$emit('cart-updated', updatedCart);
      } catch (error) {
        console.error("Error updating cart status:", error);
        // Handle error appropriately
      }
    },
    async changeToReturn(newStatus) {
      const currentDate = getCurrentDate();
      const updatedCart = {
        ...this.cart,
        status: newStatus,
        return_date: currentDate,
      }
      try {
        await BorrowService.update(updatedCart._id, updatedCart);
        // Update the local cart data
        const index = this.localCarts.findIndex(c => c._id === updatedCart._id);
        if (index !== -1) {
          this.localCarts[index] = updatedCart;
        }
        // Emit an event to inform the parent component of the update
        this.$emit('cart-updated', updatedCart);
      } catch (error) {
        console.error("Error updating cart status:", error);
        // Handle error appropriately
      }
    },

  },
  created() {
    this.getBorrow();
  }
};
</script>

<style scoped>
.modal-body {
  max-height: 500px;
  overflow-y: auto;
}
</style>