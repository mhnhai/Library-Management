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
              <p class="col-md-9">Title: {{ b.title }} - Author: {{ b.author }}</p>
            </div>
          </div>
          <p>Ngày mượn: {{cart.borrowed_date}}</p>
          <p>Ngày trả: {{cart.return_date}}</p>
          <p>Hạn trả: {{cart.due_date}}</p>
          <div>
            Trạng thái:
            <span :class="getStatusClass(cart.status)">{{ getStatusLabel(cart.status) }}</span>
          </div>

          <div>
            <button
                class="btn btn-outline-success float-end"
                @click="changeToReturn('returned')"
                :disabled="cart.status !== 'borrowed'">
              Đã trả
            </button>
            <button
                class="btn btn-outline-info float-end"
                @click="changeToBorrow('borrowed')"
                :disabled="cart.status !== 'added'">
              Đã mượn
            </button>

          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import BorrowService from "@/services/borrow.service.js";
import BookService from "@/services/book.service.js";
function getCurrentDate() {
  const today = new Date();
  const day = today.getDate();
  const month = today.getMonth() + 1;
  const year = today.getFullYear();
  return `${day}/${month}/${year}`;
}

function getDueDate() {
  const today = new Date();
  let dueDay = today.getDate() + 14;
  let dueMonth = today.getMonth() + 1;
  let dueYear = today.getFullYear();

  // Kiểm tra nếu ngày vượt quá số ngày trong tháng
  const daysInMonth = new Date(dueYear, dueMonth, 0).getDate();
  if (dueDay > daysInMonth) {
    dueDay -= daysInMonth;
    dueMonth++;
    if (dueMonth > 12) {
      dueMonth = 1;
      dueYear++;
    }
  }

  return `${dueDay}/${dueMonth}/${dueYear}`;
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
      if(confirm("Xác nhận đã mượn sách?"))

      try {
        const currentDate = getCurrentDate();
        const dueDate = getDueDate();
        const updatedCart = {
          ...this.cart,
          status: newStatus,
          borrowed_date: currentDate,
          due_date: dueDate,
        }
        for (const book of this.cart.book) {
          const bookData = await BookService.get(book._id);
          bookData.amount--;
          await BookService.update(book._id, bookData);
        }

        await BorrowService.update(updatedCart._id, updatedCart);
        // Update the local cart data
        const index = this.localCarts.findIndex(c => c._id === updatedCart._id);
        if (index !== -1) {
          this.localCarts[index] = updatedCart;
        }
        // Emit an event to inform the parent component of the update
        this.$emit('update:cart', updatedCart);
      } catch (error) {
        console.error("Error updating cart status:", error);
        // Handle error appropriately
      }
    },
    async changeToReturn(newStatus) {
        if(confirm("Xác nhận đã trả sách?"))
        try {
          const currentDate = getCurrentDate();
          const updatedCart = {
            ...this.cart,
            status: newStatus,
            return_date: currentDate,
          }
          for (const book of this.cart.book) {
            const bookData = await BookService.get(book._id);
            bookData.amount++;
            await BookService.update(book._id, bookData);
          }
          await BorrowService.update(updatedCart._id, updatedCart);
          // Update the local cart data
          const index = this.localCarts.findIndex(c => c._id === updatedCart._id);
          if (index !== -1) {
            this.localCarts[index] = updatedCart;
          }
          // Emit an event to inform the parent component of the update
          this.$emit('update:cart', updatedCart);
        } catch (error) {
          console.error("Error updating cart status:", error);
          // Handle error appropriately
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

<style scoped>
.modal-body {
  max-height: 500px;
  overflow-y: auto;
}
</style>