<template>
  <div v-if="account" class="page">
    <h4 class="d-flex justify-content-center">Đăng nhập</h4>
    <SignInForm :account="account" @submit:account="loginAccount"/>
    <p>{{ message }}</p>
    <div class="nav-item d-flex justify-content-center">
      <p>Bạn chưa có tài khoản?&nbsp;
      <router-link :to="{ name: 'signup' }"> Tạo tài khoản ngay </router-link>
      </p>
    </div>
  </div>
</template>

<script>
import AuthService from "@/services/auth.service.js";
import SignInForm from "@/components/SignInForm.vue";
import {toast} from "vue3-toastify";

export default {
  components: {
    SignInForm,
  },
  props: {
    id: { type: String, required: true },
  },
  data() {
    return {
      account: {},
      message: "",
    };
  },
  methods: {
        async loginAccount(data) {
          try {
            // Gọi hàm login từ AuthService để kiểm tra đăng nhập
            const account = await AuthService.login(data);

            // Đăng nhập thành công, lưu thông báo và điều hướng dựa trên vai trò
            toast("Đăng nhập thành công.", {
              "type": "default",
              "theme": "light",
              "pauseOnHover": false,
              "dangerouslyHTMLString": true,
              "autoClose": 1000,
              "limit":1
            });
            setTimeout(() => {
              this.$router.push({ name: "client" })}, 2000);
            this.$emit('login', account);

          } catch (error) {
            this.message = error.message || "Có lỗi xảy ra khi đăng nhập, vui lòng thử lại";
          }
        },
      },
};
</script>

<style scoped>
.page {
  max-width: 400px;
  min-height: 100vh;
  margin: auto;
}
</style>
