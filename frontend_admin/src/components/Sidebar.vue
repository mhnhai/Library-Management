<template>
    <div class="d-flex flex-column flex-shrink-0 p-3 bg-light text-white" style="width: 35vh; height: 100vh;">
      <a href="/" class="d-flex align-items-center mb-3 mb-md-0 me-md-auto link-dark text-decoration-none">
        <span class="fs-4 text-white">Quản lý hệ thống</span>
      </a>
      <hr>
      <div class="navbar-nav flex-column mb-auto">
        <div class="nav-item">
          <router-link :to="{ name: 'book' }" class="nav-link" :class="{ 'active': isActive('book') }">
            <i class="fa-solid fa-book-bookmark"></i>
            <strong> Sách</strong>
          </router-link>
        </div>
        <div class="nav-item">
          <router-link :to="{ name: 'cart' }" class="nav-link" :class="{ 'active': isActive('cart') }">
            <i class="fa-solid fa-cart-shopping"></i>
            <strong> Giỏ hàng</strong>
          </router-link>
        </div>
        <div class="nav-item">
          <router-link :to="{ name: 'account' }" class="nav-link" :class="{ 'active': isActive('account') }">
            <i class="fa-regular fa-user"></i>
            <strong> Tài khoản</strong>
          </router-link>
        </div>
        </div>
        <hr>
        <div class="nav-item" v-if="account">
          
            <p class="dropdown-toggle px-2 text-white" data-bs-toggle="dropdown" role="button"
               aria-expanded="false">
              {{ account ? account.username : 'Dropdown' }}
            </p>
            <ul class="dropdown-menu">
              <li>
                <router-link class="dropdown-item btn btn-light"
                             :to="{ name: '', params: { id: account._id } }">
                  Thông tin cá nhân
                </router-link>
              </li>
              <li>
                <hr class="dropdown-divider">
              </li>
              <li><a class="dropdown-item btn btn-light" href="#" @click="logout">Đăng xuất</a></li>
            </ul>
        </div>
        <div v-else>

        </div>
    </div>
</template>
<script>
import AuthService from "@/services/auth.service.js";
export default {
// Đoạn mã xử lý đầy đủ sẽ trình bày bên dưới
  data() {
    return {
      account: null,
    };
  },
  methods: {
    checkAccount() {
      const accountData = localStorage.getItem("account");
      this.account = accountData ? JSON.parse(accountData) : null;
    },
    async logout(){
      await AuthService.logout();
      this.$router.push({ name: "login" })

    },
    isActive(routeName) {
      return this.$route.name === routeName;
    }
  },
  created() {
    // Lấy thông tin tài khoản từ localStorage
    this.checkAccount();
  },
  watch: {
    $route() {
  this.checkAccount(); // Kiểm tra trạng thái mỗi khi route thay đổi
  },
  }

};
</script>

<style scoped>
.bg-light {
  background-color: #000000 !important;
}

.nav-link {
  color: white;
  transition: all 0.3s;
  border-radius: 8px;
  margin-bottom: 5px;
  padding: 10px 15px;
}

.nav-link:hover, .nav-link.active {
  background-color: #1e853c;
  color: white;
  transform: translateX(5px);
}

.dropdown-toggle, .dropdown-item {
  color: #333;
}

.navbar-nav {
  padding: 0 10px;
}
</style>