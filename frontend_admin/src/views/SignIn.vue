<template>
  <div v-if="account" class="page">
    <h4 class="d-flex justify-content-center">Đăng nhập</h4>
    <SignInForm :account="account" @submit:account="loginAccount" />
    <p>{{ message }}</p>
    <div class="nav-item d-flex justify-content-center">
      <param>Bạn chưa có tài khoản?&nbsp;
      <router-link :to="{ name: 'signup' }">
        Tạo tài khoản ngay
      </router-link>
      </param>
    </div>
  </div>
</template>
<script>
import SignInForm from "@/components/SignInForm.vue";
import SignInService from "@/services/signin.service";
export default {
  components: {
    SignInForm,
  },
  props: {
    id: { type: String, required: true },
  },
  data() {
    return {
      accounts: [{}],
      account: {},
      message: "",
    };
  },
  methods: {
    async loginAccount(data) {
      try {
        this.accounts = await SignInService.getAll();

        const flag = this.accounts.find(
          acc => acc.username === data.username && acc.password === data.password
        );
        if (flag == null) this.message = "Đăng nhập thất bại, sai tài khoản hoặc mật khẩu";
        else {
          localStorage.setItem("account", JSON.stringify(flag));
          this.message = "Đăng nhập thành công";
          if(flag.role == "user")
              // this.$router.push({ name: "client" });
            window.location.href = "/"
          else if(flag.role == "admin")
            // this.$router.push({ name: "client" });

          window.location.href = "/admin"
        }


      } catch (error) {
        console.log(error);
      }
    },
  }
}
</script>
<style>
.page {
  max-width: 400px;
  min-height: 100vh;
  margin: auto;
}
</style>