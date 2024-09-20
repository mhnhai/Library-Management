<template>
    <nav class="navbar navbar-expand navbar-dark bg-dark justify-content-around">
        <a href="/" class="nav-link"><img src="@/assets/img/logo.png"></a>        <div class="col-md-6">
        </div>
        <div class="navbar-nav">
            <div class="nav-item">
                <router-link :to="{ name: 'admin' }" class="nav-link">

                    <i class="fa-solid fa-book-bookmark"></i>
                </router-link>
            </div>
            <div class="nav-item">
                <router-link :to="{ name: 'signin' }" class="nav-link">
                    <i class="fa-solid fa-right-to-bracket"></i>
                </router-link>
            </div>
        </div>
    </nav>
</template>
<script>
export default {
    // Đoạn mã xử lý đầy đủ sẽ trình bày bên dưới
    data() {
        return {
            books: [],
            activeIndex: -1,
            searchText: "",
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