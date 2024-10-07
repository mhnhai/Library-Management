<template>
  <div>
    <!-- Button to trigger modal -->
    <button type="button" class="btn btn-primary" @click="showModal">
      {{ buttonText }}
    </button>

    <!-- Modal -->
    <div class="modal fade" id="bookModal" tabindex="-1" aria-labelledby="bookModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="bookModalLabel">{{ modalTitle }}</h5>
            <button type="button" class="btn-close" @click="hideModal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <BookForm
                :book="book"
                @submit:book="handleSubmit"
                @delete:book="handleDelete"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import BookForm from '../BookForm.vue';
import { Modal } from 'bootstrap';

export default {
  name: 'BookModal',
  components: {
    BookForm
  },
  props: {
    book: {
      type: Object,
      default: () => ({
        title: '',
        author: '',
        publisher: '',
        publishDate: null,
        amount: null,
        category: '',
        pages: null,
        description: '',
        imageUrl: ''
      })
    },
    buttonText: {
      type: String,
      default: 'Thêm sách mới'
    },
    modalTitle: {
      type: String,
      default: 'Thông tin sách'
    }
  },
  data() {
    return {
      modal: null
    };
  },
  mounted() {
    this.modal = new Modal(document.getElementById('bookModal'));
  },
  methods: {
    showModal() {
      this.modal.show();
    },
    hideModal() {
      this.modal.hide();
    },
    handleSubmit(book) {
      this.$emit('submit:book', book);
      this.hideModal();
    },
    handleDelete(bookId) {
      this.$emit('delete:book', bookId);
      this.hideModal();
    }
  }
};
</script>

<style scoped>
/* Thêm styles tùy chỉnh nếu cần */
</style>