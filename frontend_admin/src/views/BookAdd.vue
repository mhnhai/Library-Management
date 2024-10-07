<template>
    <div v-if="book" class="page">
        <h4>Thêm mới sách</h4>
        <BookForm :book="book" @submit:book="uploadBook" />
        <p>{{ message }}</p>
    </div>
</template>
<script>
import BookForm from "@/components/BookForm.vue";
import BookService from "@/services/book.service";
export default {
    components: {
        BookForm,
    },
    props: {
        id: { type: String, required: true },
    },
    data() {
        return {
            book: {},
            message: "",
        };
    },
    methods: {
        async uploadBook(data) {
            try {

                await BookService.create(data)
                this.message = "Thêm mới liên hệ thành công";
            } catch (error) {
                console.log(error);
            }
        }
    }
}
</script>