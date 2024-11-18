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
      <!-- Progress bar -->
      <div class="toast-progress-container">
        <div
            class="toast-progress-bar"
            :style="{ width: `${progress}%` }"
        ></div>
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
      isVisible: false,
      progress: 100,
      progressInterval: null,
      startTime: null
    };
  },
  methods: {
    showToast() {
      this.isVisible = true;
      this.progress = 100;
      this.startTime = Date.now();

      // Cập nhật progress bar mỗi 10ms
      this.progressInterval = setInterval(() => {
        const elapsed = Date.now() - this.startTime;
        const remaining = Math.max(0, 100 - (elapsed / this.duration) * 100);
        this.progress = remaining;

        if (remaining <= 0) {
          this.closeToast();
        }
      }, 10);
    },
    closeToast() {
      this.isVisible = false;
      if (this.progressInterval) {
        clearInterval(this.progressInterval);
        this.progressInterval = null;
      }
      this.$emit('close');
    }
  },
  mounted() {
    this.showToast();
  },
  beforeDestroy() {
    if (this.progressInterval) {
      clearInterval(this.progressInterval);
    }
  }
};
</script>

<style scoped>
.toast {
  position: relative;
  transition: opacity 0.5s ease-in-out;
  opacity: 0;
  min-width: 300px;
}

.toast.show {
  opacity: 1;
}

.toast-progress-container {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 3px;
  background-color: #e9ecef;
  overflow: hidden;
}

.toast-progress-bar {
  height: 100%;
  background-color: #0d6efd;
  transition: width 10ms linear;
}
</style>