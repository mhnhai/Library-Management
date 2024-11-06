<template>
  <div class="modal fade" :id="id" tabindex="-1" role="dialog" aria-labelledby="cartModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="cartModalLabel">Chi tiết giỏ hàng</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <div v-if="cart" class="container">
            <div>
              <div class="row pt-3" v-for="(b, idx) in cart.book" :key="idx">
                <img class="col-4" v-if="b.imageUrl" :src="b.imageUrl" alt="Uploaded Image" style="height: 200px; width: 150px;" />
                <p class="col-md-auto">Tựa đề: {{ b.title }}</p>
                <p class="col-md-auto">Tác giả: {{ b.author }}</p>
                <hr>
              </div>
            </div>
            <div class="dates-container text-start">
              <p>Ngày mượn: {{cart.borrowed_date}}</p>
              <p>Ngày trả: {{cart.return_date}}</p>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button
              class="btn btn-outline-danger"
              @click="changeToCancel('cancelled')"
              :disabled="cart.status !== 'added'">
            Hủy mượn
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import BorrowService from "@/services/borrow.service.js";

export default {
  props: {
    cart: {
      type: Object,
      required: true,
    },
    id: { type: String, required: true }
  },
  data() {
    return {
      localCarts: [],
    }
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
    async changeToCancel(newStatus) {
      if(confirm("Xác nhận hủy mượn sách?"))
      try {
        const updatedCart = {
          ...this.cart,
          status: newStatus,
        }
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