<template>
  <div class="modal fade" :id="id" tabindex="-1" aria-labelledby="bookModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="bookModalLabel">{{ book._id ? 'Chỉnh sửa sách' : 'Thêm sách mới' }}</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <Form @submit="submitBook" :validation-schema="bookFormSchema" class="row g-3">
            <!-- title, author -->
            <div class="col-md-6">
              <label for="title" class="form-label">Tiêu đề</label>
              <Field name="title" type="text" class="form-control" v-model="bookLocal.title" />
              <ErrorMessage name="title" class="text-danger" />
            </div>
            <div class="col-md-6">
              <label for="author" class="form-label">Tác giả</label>
              <Field name="author" type="text" class="form-control" v-model="bookLocal.author" />
              <ErrorMessage name="author" class="text-danger" />
            </div>

            <!-- publisher, publishDate -->
            <div class="col-md-8">
              <label for="publisher" class="form-label">Nhà xuất bản</label>
              <Field name="publisher" type="text" class="form-control" v-model="bookLocal.publisher" />
              <ErrorMessage name="publisher" class="text-danger" />
            </div>
            <div class="col-md-4">
              <label for="publishDate" class="form-label">Năm xuất bản</label>
              <Field name="publishDate" type="number" class="form-control" v-model="bookLocal.publishDate" />
              <ErrorMessage name="publishDate" class="text-danger" />
            </div>

            <!-- amount, category, pages -->
            <div class="col-md-4">
              <label for="amount" class="form-label">Số lượng quyển</label>
              <Field name="amount" type="number" class="form-control" v-model="bookLocal.amount" />
              <ErrorMessage name="amount" class="text-danger" />
            </div>
            <div class="col-md-4">
              <label for="category" class="form-label">Thể loại</label>
              <select name="category" class="form-select" v-model="bookLocal.category">
                <option>Khoa học</option>
                <option>Trinh thám</option>
                <option>...</option>
              </select>
            </div>
            <div class="col-md-4">
              <label for="pages" class="form-label">Số trang</label>
              <Field name="pages" type="number" class="form-control" v-model="bookLocal.pages" />
              <ErrorMessage name="pages" class="text-danger" />
            </div>

            <!-- description -->
            <div class="col-12">
              <label for="description" class="form-label">Miêu tả sách</label>
              <textarea name="description" rows="5" class="form-control" v-model="bookLocal.description"></textarea>
              <ErrorMessage name="description" class="text-danger" />
            </div>

            <!-- imageUrl -->
            <div class="col-12">
              <label for="imageUrl" class="form-label">Hình ảnh</label>
              <input type="file" name="imageUrl" @change="getUrl" class="form-control" />
              <img v-if="bookLocal.imageUrl" :src="bookLocal.imageUrl" alt="Uploaded Image" class="img-thumbnail mt-2" />
              <ErrorMessage name="imageUrl" class="text-danger" />
            </div>
            <div class="col-12 text-end">
              <button type="submit" class="btn btn-primary">{{ book._id ? 'Cập nhật' : 'Thêm mới' }}</button>
              <button v-if="book._id" type="button" class="btn btn-danger" @click="deleteBook">Xóa</button>
            </div>
          </Form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import * as yup from "yup";
import { Form, Field, ErrorMessage } from "vee-validate";
import BookService from "@/services/book.service.js";

export default {
  components: {
    Form,
    Field,
    ErrorMessage,
  },
  props: {
    book: { type: Object, required: true },
    id: { type: String, required: true }
  },
  emits: ["submit:book", "delete:book"],
  data() {
    const bookFormSchema = yup.object().shape({
      title: yup.string().required("Tên phải có giá trị.")
          .min(2, "Tên phải ít nhất 2 ký tự.")
          .max(50, "Tên có nhiều nhất 50 ký tự."),
      author: yup.string().required("Tác giả không được để trống.")
          .min(2, "Tên tác giả phải ít nhất 2 ký tự.")
          .max(50, "Tên tác giả có nhiều nhất 50 ký tự."),
      publisher: yup.string().required("Nhà xuất bản không được để trống."),
      publishDate: yup.number().required("Năm xuất bản không được để trống.")
          .min(1800, "Năm xuất bản không hợp lệ.")
          .max(new Date().getFullYear(), "Năm xuất bản không được vượt quá năm hiện tại."),
      amount: yup.number().required("Số lượng không được để trống.")
          .min(0, "Số lượng không được âm."),
      pages: yup.number().required("Số trang không được để trống.")
          .min(1, "Số trang phải lớn hơn 0."),
    });

    return {
      bookLocal: { ...this.book },
      bookFormSchema,
    };
  },
  methods: {
    async submitBook() {
      try {
        if (this.bookLocal._id) {
          await BookService.update(this.bookLocal._id, this.bookLocal);
          alert('Sách đã được cập nhật thành công.');
        } else {
          await BookService.create(this.bookLocal);
          alert('Sách mới đã được thêm thành công.');
        }
        window.location.reload();
      } catch (error) {
        console.log(error);
      }
    },
    async deleteBook() {
      if (confirm("Bạn muốn xóa sách này?")) {
        try {
          await BookService.delete(this.bookLocal._id);
          alert('Sách đã được xóa thành công.');
          window.location.reload();
        } catch (error) {
          console.log(error);
        }
      }
    },
    async getUrl(event) {
      const file = event.target.files[0];
      if (!file) return;
      try {
        const formData = new FormData();
        formData.append('coverImage', file);
        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        const result = await response.json();
        if (response.ok) {
          this.bookLocal.imageUrl = result.fileUrl;
        } else {
          console.error('Upload failed:', result.message);
        }
      } catch (error) {
        console.error('Error uploading image:', error);
      }
    }
  },
};
</script>
