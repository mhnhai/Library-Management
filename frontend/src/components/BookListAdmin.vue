<template>
  <div class="carousel-container">
    <div
        class="carousel"
        :style="{ transform: `translateX(-${currentIndex * (100 / chunkSize)}%)` }"
    >
      <div
          v-for="product in products"
          :key="product.id"
          class="product"
      >
        <h4>{{ product.name }}</h4>
        <p>{{ product.description }}</p>
      </div>
    </div>
    <button @click="prevChunk" class="btn prev">Previous</button>
    <button @click="nextChunk" class="btn next">Next</button>
  </div>
</template>
<script>
export default {
  data() {
    return {
      products: [
        { id: 1, name: 'Product 1', description: 'Description of Product 1' },
        { id: 2, name: 'Product 2', description: 'Description of Product 2' },
        { id: 3, name: 'Product 3', description: 'Description of Product 3' },
        { id: 4, name: 'Product 4', description: 'Description of Product 4' },
        { id: 5, name: 'Product 5', description: 'Description of Product 5' },
        { id: 6, name: 'Product 6', description: 'Description of Product 6' },
        // Thêm sản phẩm tùy ý
      ],
      chunkSize: 3,
      currentIndex: 0,
    };
  },
  methods: {
    nextChunk() {
      this.currentIndex++;
      if (this.currentIndex >= Math.ceil(this.products.length / this.chunkSize)) {
        this.currentIndex = 0; // Quay lại đầu nếu đã hết sản phẩm
      }
    },
    prevChunk() {
      this.currentIndex--;
      if (this.currentIndex < 0) {
        this.currentIndex = Math.ceil(this.products.length / this.chunkSize) - 1;
      }
    },
  },
  mounted() {
    setInterval(this.nextChunk, 3000); // Tự động chuyển mỗi 3 giây
  },
};
</script>
<style scoped>
.carousel-container {
  width: 80%;
  overflow: hidden;
  position: relative;
  margin: auto;
}

.carousel {
  display: flex;
  transition: transform 0.5s ease-in-out;
  width: calc(100% * 2); /* Đủ để chứa nhiều sản phẩm trong hàng */
}

.product {
  min-width: calc(100% / 3); /* Hiển thị 3 sản phẩm mỗi lần */
  flex: 1;
  padding: 20px;
  box-sizing: border-box;
  text-align: center;
  background-color: #f5f5f5;
  margin: 10px;
  border: 1px solid #ccc;
  transition: all 0.3s ease-in-out;
}

.product:hover {
  transform: scale(1.05);
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);
}

.btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background-color: #333;
  color: #fff;
  border: none;
  cursor: pointer;
  padding: 10px;
  opacity: 0.7;
  z-index: 10;
}

.btn:hover {
  background-color: #555;
  opacity: 1;
}

.btn.next {
  right: 10px;
}

.btn.prev {
  left: 10px;
}
</style>
