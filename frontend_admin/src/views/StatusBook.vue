<template>
    <div class="page row">
        <div class="col-md-10">
            <InputSearch v-model="searchText" />
        </div>
        <div class="col mt-lg-3 col-md-auto">

            <BookList v-if="filteredBooksCount > 0" :books="filteredBooks"
                v-model:activeIndex="activeIndex" />
            <p v-else>Không có liên hệ nào.</p>
            <div class="mt-3 justify-content-around align-items-center">
                <button class="btn btn-sm btn-primary m-3" @click="refreshList()">
                    <i class="fas fa-redo"></i> Làm mới
                </button>
                <button class="btn btn-sm btn-success m-3" @click="goToAddBook">
                    <i class="fas fa-plus"></i> Thêm mới
                </button>
                <button class="btn btn-sm btn-danger m-3" @click="removeAllBooks">
                    <i class="fas fa-trash"></i> Xóa tất cả
                </button>
            </div>
        </div>
        <div class="col col-md-6">
            <div v-if="activeBook">
                <h4>
                    Chi tiết sách
                    <i class="fas fa-book"></i>
                </h4>
                <BookCard :book="activeBook" />
                <router-link :to="{
                    name: 'book.edit',
                    params: { id: activeBook._id },
                }">
                    <span class="mt-2 badge text-bg-light">
                        <i class="fas fa-edit"></i> Hiệu chỉnh</span>
                </router-link>
            </div>
        </div>
    </div>
</template>
<script>
import BookCard from "@/components/BookCard.vue";
import InputSearch from "@/components/InputSearch.vue";
import BookList from "@/views/BookList.vue";
import BookService from "@/services/book.service";
export default {
    components: {
        BookCard,
        InputSearch,
        BookList,
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