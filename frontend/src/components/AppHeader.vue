<template>
    <nav class="navbar navbar-expand navbar-dark bg-dark justify-content-around">
        <a href="/" class="nav-link"><img src="@/assets/img/logo.png"></a>
        <div class="col-md-6">
            <!-- <InputSearch v-model="searchText" /> -->
        </div>
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
                            <!-- <router-link class="dropdown-item" :to="`/account/${account._id}`">
                                Thong tin 
                            </router-link> -->
                            <router-link class="dropdown-item btn btn-light" :to="{ name: 'account', params: { id: account._id } }">
                                Thông tin cá nhân
                            </router-link>
                        </li>
                        <li><a class="dropdown-item btn btn-light" href="#">Another action</a></li>
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
        </div>
    </nav>
</template>
<script>
import InputSearch from './InputSearch.vue';
export default {
    
    components: {
        InputSearch,
    },
    // Đoạn mã xử lý đầy đủ sẽ trình bày bên dưới
    data() {
        return {
            account: null,
            books: [],
            activeIndex: -1,
            searchText: "",
        };
    },
    created() {
        // Lấy thông tin tài khoản từ localStorage
        const accountData = localStorage.getItem("account");
        if (accountData) {
            this.account = JSON.parse(accountData); // Chuyển đổi chuỗi JSON thành đối tượng
        }
    },
    watch: {
        // Giám sát các thay đổi của biến searchText.
        // Bỏ chọn phần tử đang được chọn trong danh sách.
        searchText() {
            this.activeIndex = -1;
        },
    },
    computed: {
        // Chuyển các đối tượng book thành chuỗi để tiện cho tìm kiếm.
        bookStrings() {
            return this.books.map((book) => {
                const { title, author, category, languague } = book;
                return [title, author, category, languague].join("");
            });
        },
        logout() {
            localStorage.removeItem("account"); // Xóa tài khoản khỏi localStorage
            this.account = null; // Xóa thông tin tài khoản trong component
            this.$router.push({ name: 'signin' }); // Chuyển hướng đến trang đăng nhập
        },

        // Trả về các book có chứa thông tin cần tìm kiếm.
        filteredBooks() {
            if (!this.searchText) return this.books;
            return this.books.filter((_book, index) =>
                this.bookStrings[index].includes(this.searchText)
            );
        },
        activeBook() {
            if (this.activeIndex < 0) return null;
            return this.filteredBooks[this.activeIndex];
        },
        filteredBooksCount() {
            return this.filteredBooks.length;
        },
    },
};
</script>