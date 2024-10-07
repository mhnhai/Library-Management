<script>
import BookModal from "@/components/BookModal.vue";
import BookService from "@/services/book.service.js";
export default {
  components: {
    BookModal,
  },
  data() {
    return {
      indexBook: -1,
      searchText: "",
      books: [],
      account: null,
      book: null,
    };
  },
  methods: {
    async getBorrow() {
      try {
        this.books = await BookService.getAll();
      } catch (error) {
        console.error("Error fetching borrows:", error);
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
  },
  created() {
    this.getBorrow();
  }
};
</script>
<template>
    <ul class="list-group">
        <li class="list-group-item" v-for="(book, index) in books" :key="book._id"
            :class="book">
            {{ book.title }}
          <button type="button" class="btn btn-primary" data-bs-toggle="modal" :data-bs-target="'#bookModal' + index">
            Launch demo modal
          </button>
          <BookModal :book="book" :id="'bookModal' + index" @book-updated="updateBook"/>
        </li>
    </ul>
</template>