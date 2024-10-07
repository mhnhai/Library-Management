<template>

    <div class="d-flex flex-column flex-shrink-0 p-3 bg-light text-white" style="width: 35vh; height: 100vh;">
      <a href="/" class="d-flex align-items-center mb-3 mb-md-0 me-md-auto link-dark text-decoration-none">
        <span class="fs-4 text-white">Quản lý hệ thống</span>
      </a>
      <hr>
      <div class="navbar-nav flex-column mb-auto">
        <div class="nav-item">
          <router-link :to="{ name: 'admin' }" class="nav-link" :class="{ 'active': isActive('admin') }">
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
      <div class="dropdown">
        <a href="#" class="d-flex align-items-center link-dark text-decoration-none dropdown-toggle" id="dropdownUser1" data-bs-toggle="dropdown" aria-expanded="false">
          <img src="https://via.placeholder.com/40" alt="" width="32" height="32" class="rounded-circle me-2">
          <strong>{{ admin.name }}</strong>
        </a>
        <ul class="dropdown-menu text-small shadow" aria-labelledby="dropdownUser1">
          <li><a class="dropdown-item" href="#">Profile</a></li>
          <li><a class="dropdown-item" href="#">Settings</a></li>
          <li><hr class="dropdown-divider"></li>
          <li><a class="dropdown-item" href="#" @click="logout">Sign out</a></li>
        </ul>
      </div>
    </div>
</template>

<script>
export default {
  data() {
    return {
      admin: {
        name: "Admin", // Thay bằng tên Admin đăng nhập
      }
    };
  },
  methods: {
    logout() {
      // Xử lý đăng xuất
      console.log("Admin logged out");
    },
    isActive(routeName) {
      return this.$route.name === routeName;
    }
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