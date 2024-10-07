<template>
  <Form @submit="submitBook" :validation-schema="bookFormSchema" class="row g-3">
        <!-- title, author, category, language -->
        <div class="form-group col-md-6">
            <label for="title">Tiêu đề</label>

            <Field name="title" type="text" class="form-control" v-model="bookLocal.title" />

            <ErrorMessage name="title" class="error-feedback" />
        </div>
        <div class="form-group col-md-6">
            <label for="author">Tác giả</label>

            <Field name="author" type="text" class="form-control" v-model="bookLocal.author" />

            <ErrorMessage name="email" class="error-feedback" />
        </div>

        <div class="form-group col-md-8">
            <label for="publisher">Nhà xuất bản</label>

            <Field name="publisher" type="text" class="form-control" v-model="bookLocal.publisher" />

            <ErrorMessage name="publisher" class="error-feedback" />
        </div>
        <div class="form-group col-md-4">
            <label for="publishDate">Năm xuất bản</label>

            <Field name="publishDate" type="number" class="form-control" v-model="bookLocal.publishDate" />

            <ErrorMessage name="publishDate" class="error-feedback" />
        </div>
        <div class="form-group col-md-4">
            <label for="amount">Số lượng quyển</label>

            <Field name="amount" type="number" class="form-control" v-model="bookLocal.amount" />

            <ErrorMessage name="amount" class="error-feedback" />
        </div>
        <div class="form-group col-md-4">
            <label for="category">Thể loại</label>
            <select name="category" class="form-select" v-model="bookLocal.category">
                <option>Khoa học</option>
                <option>Trinh thám</option>
                <option>...</option>
            </select>
        </div>
        <div class="form-group col-md-4">
            <label for="pages">Số trang</label>

            <Field name="pages" type="number" class="form-control" v-model="bookLocal.pages" />

            <ErrorMessage name="amount" class="error-feedback" />
        </div>

        <div class="form-group">
            <label for="description">Miêu tả sách</label>
            <textarea name="description" rows="10" cols="50" class="form-control" v-model="bookLocal.description"></textarea>
            <ErrorMessage name="description" class="error-feedback" />
        </div>
        <div class="form-group">
            <label for="imageUrl">Hình ảnh</label>
            <input type="file" name="imageUrl" @change="getUrl" />
            <img v-if="bookLocal.imageUrl" :src="bookLocal.imageUrl" alt="Uploaded Image" class="w-75 m-2" />
            <ErrorMessage name="imageUrl" class="error-feedback" />
        </div>


        <div class="form-group">
            <button class="btn btn-primary">Lưu</button>
            <button v-if="bookLocal._id" type="button" class="m-2 btn btn-danger" @click="deleteBook">
                Xóa
            </button>
            <button type="button" class="btn btn-danger" @click="Cancel">
                Thoát
            </button>
        </div>
    </Form>
</template>
<script>
import * as yup from "yup";
import { Form, Field, ErrorMessage } from "vee-validate";
export default {
    components: {
        Form,
        Field,
        ErrorMessage,
    },
    emits: ["submit:book", "delete:book", ""],
    props: {
        book: { type: Object, required: true }
    },
    data() {
        const bookFormSchema = yup.object().shape({
            title: yup
                .string()
                .required("Tên phải có giá trị.")
                .min(2, "Tên phải ít nhất 2 ký tự.")
                .max(50, "Tên có nhiều nhất 50 ký tự."),
            email: yup
                .string()
                .email("E-mail không đúng.")
                .max(50, "E-mail tối đa 50 ký tự."),
            address: yup.string().max(100, "Địa chỉ tối đa 100 ký tự."),
            phone: yup
                .string()
                .matches(
                    /((09|03|07|08|05)+([0-9]{8})\b)/g,
                    "Số điện thoại không hợp lệ."
                ),
        });
        return {
            // Chúng ta sẽ không muốn hiệu chỉnh props, nên tạo biến cục bộ
            // bookLocal để liên kết với các input trên form
            bookLocal: this.book,
            bookFormSchema,
        };
    },
    methods: {
        submitBook() {
            this.$emit("submit:book", this.bookLocal);

        },
        deleteBook() {
            this.$emit("delete:book", this.bookLocal.id);
        },
        Cancel() {
            const reply = window.confirm('You have unsaved changes! Do you want to leave?')

            if (!reply) {
                // stay on the page if
                // user clicks 'Cancel'
                return false
            }
            else this.$router.push({ name: "admin" });
        },
        async getUrl(){
            const file = event.target.files[0];
            if (!file) return;
            try {
                // Giả sử bạn có một API để upload ảnh và nhận URL trả về
                const formData = new FormData();
                formData.append('coverImage', file);
                console.log(formData)
                const response = await fetch('/api/upload', {
                    method: 'POST',
                    body: formData,
                });

                const result = await response.json();
                if (response.ok) {
                    // Giả sử kết quả trả về chứa URL của ảnh
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
<style scoped>
@import "@/assets/form.css";
</style>