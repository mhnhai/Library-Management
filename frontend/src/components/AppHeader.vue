<template>
    <nav class="navbar navbar-expand navbar-dark bg-dark justify-content-between">
        <router-link class="nav-link" :to="{ name: 'client' }"><img src="@/assets/img/logo.png"></router-link>
        <div class="navbar-nav">
            <!-- Hiển thị thông tin tài khoản nếu đã đăng nhập -->
            <div class="nav-item" v-if="account">
                <li class="dropdown">
                    <a class="nav-link dropdown-toggle" data-bs-toggle="dropdown" href="#" role="button"
                        aria-expanded="false">
                        {{ account ? account.username : 'Dropdown' }}
                    </a>
                    <ul class="dropdown-menu">
                        <li>
                            <router-link class="dropdown-item btn btn-light"
                                :to="{ name: 'account', params: { id: account._id } }">
                                Thông tin cá nhân
                            </router-link>
                        </li>
                        <li>
                          <router-link class="dropdown-item btn btn-light"
                                       :to="{ name: 'history', params: { id: account._id } }">
                            Lịch sử mượn sách
                          </router-link>
                        </li>
                        <li><a class="dropdown-item btn btn-light" href="#">Something else here</a></li>
                        <li>
                            <hr class="dropdown-divider">
                        </li>
                        <li><a class="dropdown-item btn btn-light" href="#" @click="logout">Đăng xuất</a></li>
                    </ul>
                </li>
            </div>
            <div class="nav-item" v-else>
                <!-- Hiển thị đăng nhập nếu chưa có tài khoản -->
                <router-link class="nav-link" :to="{ name: 'signin' }">Đăng nhập</router-link>
            </div>
            <div class="nav-item">
                <router-link :to="{ name: 'admin' }" class="nav-link">
                    <i class="fa-solid fa-book-bookmark"></i>
                </router-link>
            </div>
            <div class="nav-item" v-if="account">
                <router-link :to="{ name: 'cart' }" class="nav-link">
                    <i class="fa-solid fa-cart-shopping position-relative">
                        <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                            {{ amount }}
                        </span>
                    </i>
                </router-link>
            </div>
        </div>
    </nav>
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
          this.$router.push({ name: "signin" })

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