<template>
    <nav class="navbar navbar-expand navbar-dark bg-dark justify-content-around">
        <router-link class="nav-link" :to="{ name: 'client' }"><img src="@/assets/img/logo.png"></router-link>
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
import InputSearch from './InputSearch.vue';
import BorrowService from '@/services/borrow.service';
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
            amount: 0,
            borrowedList: [],
            book: null,
        };
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
    methods: {
        async findCart(account) {
            try {
                let i = this.borrowedList.findIndex(cart => (cart.account._id === account._id && cart.status === "adding"));
                return i;
            } catch (error) {
                console.error("Error in checkBookInCart:", error);
                return false;
            }
        },
        async getBorrow() {
            try {
                this.borrowedList = await BorrowService.getAll();
                let indexCart = await this.findCart(this.account);
                if(indexCart) {
                  this.amount = this.borrowedList[indexCart].amount;
                }
            } catch (error) {
                console.log("loi")
            }
        },
    },
    created() {
        // Lấy thông tin tài khoản từ localStorage
        this.getBorrow()
        const accountData = localStorage.getItem("account");
        if (accountData) {
            this.account = JSON.parse(accountData); // Chuyển đổi chuỗi JSON thành đối tượng
        }
    },

};
</script>