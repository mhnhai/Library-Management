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
      </div>
    </div>
  </div>
</template>

<script>
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
      isVisible: false
    }
  },
  methods: {
    showModal() {
      this.isVisible = true;
      document.body.classList.add('modal-open');
    },
    hideModal() {
      this.isVisible = false;
      document.body.classList.remove('modal-open');
    }
  },
  beforeUnmount() {
    // Cleanup when component is destroyed
    document.body.classList.remove('modal-open');
  }
};
</script>