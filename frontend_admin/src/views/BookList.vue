<template>
  <div class="container">
    <div class="row mb-3">
      <div class="col">
        <h2>Danh sách sách</h2>
      </div>
    </div>
    <div class="row mb-3">
      <div class="col-auto">
        <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#addBookModal">
          Thêm sách mới
        </button>
        <!-- Modal for adding a new book -->
        <BookModal :book="{}" id="addBookModal" @submit:book="addBook"/>
      </div>
      <div class="col-auto">
        <button class="btn btn-danger" @click="removeAllBooks">
          <i class="fas fa-trash"></i> Xóa tất cả
        </button>
      </div>
    </div>
    <ul class="list-group col-auto overflow-y-scroll" style=" max-height: 100vh;">
      <li class="list-group-item" v-for="(book, index) in books" :key="book._id">
        {{ book.title }}
        <button type="button" class="btn btn-sm btn-outline-primary float-end" data-bs-toggle="modal" :data-bs-target="'#bookModal' + index">
          Chỉnh sửa
        </button>
        <BookModal
            :book="book"
            :id="'bookModal' + index"
            @submit:book="updateBook"
            @delete:book="deleteBook"/>
      </li>
    </ul>
  </div>
</template>

<script>
import BookModal from "@/components/BookModal.vue";
import BookService from "@/services/book.service.js";

export default {
  components: {
    BookModal,
  },
  data() {
    return {
      books: [],
    };
  },
  methods: {
    async getBooks() {
      try {
        this.books = await BookService.getAll();
      } catch (error) {
        console.error("Error fetching books:", error);
        // Handle error appropriately
      }
    },
    updateBook(updatedBook) {
      const index = this.books.findIndex(book => book._id === updatedBook._id);
      if (index !== -1) {
        this.books[index] = updatedBook;
        this.books = [...this.books]; // Trigger reactivity
      }
    },
    addBook(newBook) {
      this.books.push(newBook);
      this.books = [...this.books]; // Trigger reactivity
    },
    deleteBook(deleteBook) {

      const index = this.books.indexOf(deleteBook);
      this.books.splice(index, 1);
      this.books = [...this.books];

    },
    async removeAllBooks() {
      if (confirm("Bạn muốn xóa tất cả Liên hệ?")) {
        try {
          this.books.length = 0;
          await BookService.deleteAll();
        } catch (error) {
          console.log(error);
        }
      }
    },
  },
  created() {
    this.getBooks();
  }
};
</script>