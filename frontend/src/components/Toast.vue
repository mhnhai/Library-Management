<template>
  <div
      class="toast-container position-fixed bottom-0 end-0 p-3"
      style="z-index: 11"
  >
    <div
        class="toast"
        role="alert"
        aria-live="assertive"
        aria-atomic="true"
        :class="{ show: isVisible }"
    >
      <div class="toast-header">
        <strong class="me-auto">{{ title }}</strong>
        <button
            type="button"
            class="btn-close"
            data-bs-dismiss="toast"
            aria-label="Close"
            @click="closeToast"
        ></button>
      </div>
      <div class="toast-body">
        {{ message }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: 'Thông báo'
    },
    message: {
      type: String,
      required: true
    },
    duration: {
      type: Number,
      default: 3000
    }
  },
  data() {
    return {
      isVisible: false
    };
  },
  methods: {
    showToast() {
      this.isVisible = true;
      setTimeout(() => {
        this.isVisible = false;
      }, this.duration);
    },
    closeToast() {
      this.isVisible = false;
    }
  },
  mounted() {
    this.showToast();
  }
};
</script>

<style scoped>
.toast {
  transition: opacity 0.5s ease-in-out;
}
</style>

<!-- App.vue -->
<!--<template>-->
<!--  <div id="app">-->
<!--    <button class="btn btn-primary" @click="showToast">Hiển thị Toast</button>-->
<!--    &lt;!&ndash; Component Toast &ndash;&gt;-->
<!--    <Toast ref="toastComponent" :message="'Xin chào! Đây là thông báo.'" />-->
<!--  </div>-->
<!--</template>-->

<!--<script>-->
<!--import Toast from '@/components/Toast.vue';-->

<!--export default {-->
<!--  components: {-->
<!--    Toast-->
<!--  },-->
<!--  methods: {-->
<!--    showToast() {-->
<!--      // Gọi phương thức showToast từ Toast component-->
<!--      this.$refs.toastComponent.showToast();-->
<!--    }-->
<!--  }-->
<!--};-->
<!--</script>-->

