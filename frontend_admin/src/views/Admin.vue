<template>
    <div class="row container">
        <div class="col-md-12">
              <InputSearch v-model="searchText" />
        </div>
        <div class="column-gap-md-3">
            <BookList />
        </div>
    </div>
</template>
<script>
import BookCard from "@/components/BookCard.vue";
import InputSearch from "@/components/InputSearch.vue";
import BookList from "@/views/BookList.vue";
import BookService from "@/services/book.service";
import BookModal from "@/components/BookModal.vue";
import CartModal from "@/components/CartModal.vue";
export default {
    components: {
      CartModal,
        BookCard,
        InputSearch,
        BookList,
        BookModal
    },
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
                return [title, author, category, languague].join("").toLowerCase();
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
    methods: {
        async retrieveBooks() {
            try {
                this.books = await BookService.getAll();
            } catch (error) {
                console.log(error);
            }
        },
        refreshList() {
            this.retrieveBooks();
            this.activeIndex = -1;
        },
        async removeAllBooks() {
            if (confirm("Bạn muốn xóa tất cả Liên hệ?")) {
                try {
                    await BookService.deleteAll();
                    this.refreshList();
                } catch (error) {
                    console.log(error);
                }
            }
        },
        goToAddBook() {
            this.$router.push({ name: "book.add" });
        },
    },
    mounted() {
        this.refreshList();
    },

};
</script>
<style scoped>
.page {
    text-align: left;
    max-width: max-content;
}
</style>