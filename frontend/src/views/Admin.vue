<!-- ProductCarousel.vue -->
<template>
  <div class="carousel-container">
    <div class="carousel-wrapper">
      <transition name="chunk">
        <div class="products-chunk" :key="currentChunkIndex">
          <div v-for="product in currentChunk"
               :key="product.id"
               class="product-item">
            <img :src="product.image" :alt="product.name">
            <h3>{{ product.name }}</h3>
            <p>{{ product.price }}</p>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ProductCarousel',
  data() {
    return {
      products: [
        { id: 1, name: 'Product 1', price: '$100', image: '/product1.jpg' },
        { id: 2, name: 'Product 2', price: '$200', image: '/product2.jpg' },
        { id: 3, name: 'Product 3', price: '$300', image: '/product3.jpg' },
        { id: 4, name: 'Product 4', price: '$400', image: '/product4.jpg' },
        { id: 5, name: 'Product 5', price: '$500', image: '/product5.jpg' },
        { id: 6, name: 'Product 6', price: '$600', image: '/product6.jpg' },
        { id: 7, name: 'Product 7', price: '$700', image: '/product7.jpg' },
        { id: 8, name: 'Product 8', price: '$800', image: '/product8.jpg' },
        { id: 9, name: 'Product 9', price: '$900', image: '/product9.jpg' },
      ],
      currentChunkIndex: 0,
      chunkSize: 3,
      autoPlayInterval: null
    }
  },
  computed: {
    chunks() {
      const chunks = [];
      for (let i = 0; i < this.products.length; i += this.chunkSize) {
        chunks.push(this.products.slice(i, i + this.chunkSize));
      }
      return chunks;
    },
    currentChunk() {
      return this.chunks[this.currentChunkIndex];
    },
    totalChunks() {
      return this.chunks.length;
    }
  },
  methods: {
    slideNext() {
      this.currentChunkIndex = (this.currentChunkIndex + 1) % this.totalChunks;
    },
    slidePrev() {
      this.currentChunkIndex = (this.currentChunkIndex - 1 + this.totalChunks) % this.totalChunks;
    },
    startAutoPlay() {
      this.autoPlayInterval = setInterval(() => {
        this.slideNext();
      }, 3000);
    },
    stopAutoPlay() {
      if (this.autoPlayInterval) {
        clearInterval(this.autoPlayInterval);
      }
    }
  },
  mounted() {
    this.startAutoPlay();
  },
  beforeDestroy() {
    this.stopAutoPlay();
  }
}
</script>

<style scoped>
.carousel-container {
  width: 100%;
  padding: 20px;
  overflow: hidden;
}

.carousel-wrapper {
  position: relative;
  height: 300px; /* Điều chỉnh chiều cao phù hợp với nội dung */
}

.products-chunk {
  display: flex;
  justify-content: space-between;
  gap: 20px;
  position: absolute;
  width: 100%;
}

.product-item {
  width: calc(33.333% - 14px);
  padding: 10px;
  border: 1px solid #eee;
  border-radius: 8px;
  text-align: center;
  background: white;
}

.product-item img {
  width: 100%;
  height: auto;
  object-fit: cover;
}

/* Animation cho chunk đang hiển thị */
.chunk-enter-active,
.chunk-leave-active {
  transition: all 0.5s ease-in-out;
}

.chunk-enter-from {
  transform: translateX(100%);
}

.chunk-leave-to {
  transform: translateX(-100%);
}

/* Đảm bảo chunk mới luôn nằm trên cùng */
.chunk-enter-active {
  z-index: 1;
}

</style>