<template>
  <div class="container">
    <div class="row mb-3">
      <div class="col">
        <h2>Danh sách sách</h2>
      </div>
    </div>

    <!-- Search and Filter Section -->
    <div class="row mb-3">
      <div class="col-md-6">
        <div class="input-group">
          <input
              type="text"
              class="form-control"
              v-model="searchText"
              placeholder="Tìm kiếm theo tựa sách hoặc tác giả..."
          >
        </div>
      </div>
    </div>

    <div class="row mb-3">
      <div class="col-auto">
        <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#addBookModal">
          Thêm sách mới
        </button>
        <BookModal :book="{}" id="addBookModal" @submit:book="addBook"/>
      </div>
      <div class="col-auto">
        <button class="btn btn-danger" @click="removeAllBooks">
          <i class="fas fa-trash"></i> Xóa tất cả
        </button>
      </div>
    </div>

    <div class="row mb-2" v-if="searchText">
      <div class="col">
        <small class="text-muted">
          Tìm thấy {{ filteredBooks.length }} kết quả
        </small>
      </div>
    </div>

    <ul class="list-group col-auto overflow-y-scroll" style="max-height: 100vh;">
      <li class="list-group-item" v-for="(book, index) in filteredBooks" :key="book._id">
        {{ book.title }}
        <button
            type="button"
            class="btn btn-sm btn-outline-primary float-end"
            data-bs-toggle="modal"
            :data-bs-target="'#bookModal' + index"
        >
          Chỉnh sửa
        </button>
        <BookModal
            :book="book"
            :id="'bookModal' + index"
            @submit:book="updateBook"
            @delete:book="deleteBook"
        />
      </li>
      <li class="list-group-item text-center text-muted" v-if="filteredBooks.length === 0">
        Không tìm thấy sách nào
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
      searchText: "",
      selectedAuthor: "",
      selectedPublisher: "",
    };
  },
  computed: {
    // Get unique authors for filter dropdown
    uniqueAuthors() {
      return [...new Set(this.books.map(book => book.author))].sort();
    },

    // Get unique publishers for filter dropdown
    uniquePublishers() {
      return [...new Set(this.books.map(book => book.publisher))].sort();
    },

    // Filter books based on search text and selected filters
    filteredBooks() {
      return this.books.filter(book => {
        // Search text filter
        const searchTerm = this.searchText.toLowerCase().trim();
        const matchesSearch = !searchTerm ||
            book.title?.toLowerCase().includes(searchTerm) ||
            book.author?.toLowerCase().includes(searchTerm);

        // Author filter
        const matchesAuthor = !this.selectedAuthor ||
            book.author === this.selectedAuthor;

        // Publisher filter
        const matchesPublisher = !this.selectedPublisher ||
            book.publisher === this.selectedPublisher;

        return matchesSearch && matchesAuthor && matchesPublisher;
      });
    }
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
      const index = this.books.findIndex(book => book._id === deleteBook._id);
      if (index !== -1) {
        this.books.splice(index, 1);
        this.books = [...this.books]; // Trigger reactivity
      }
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

<style scoped>
.input-group {
  margin-bottom: 10px;
}

@media (min-width: 768px) {
  .input-group {
    margin-bottom: 0;
  }
}
</style>