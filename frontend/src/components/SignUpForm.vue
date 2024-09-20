<template>
  <Form @submit="submitAccount" :validation-schema="accountFormSchema">
    <div class="form-group">
      <label for="username">Tên tài khoản</label>

      <Field name="username" type="text" class="form-control" v-model="accountLocal.username" />

      <ErrorMessage name="username" class="error-feedback" />
    </div>
    <div class="form-group">
      <label for="password">Mật khẩu</label>

      <Field name="password" type="password" class="form-control" v-model="accountLocal.password" />

      <ErrorMessage name="password" class="error-feedback" />
    </div>
    <div class="form-group">
      <label for="email">Email</label>

      <Field name="email" type="email" class="form-control" v-model="accountLocal.email" />

      <ErrorMessage name="email" class="error-feedback" />
    </div>
    <div class="form-group d-flex justify-content-center mt-3">
      <button v-if="!accountLocal._id" class="btn btn-primary btn-sm">Tạo tài khoản</button>
      <button v-if="accountLocal._id" class="ml-2 btn btn-secondary">
        Cập nhật thông tin
      </button>
      <button v-if="accountLocal._id" type="button" class="ml-2 btn btn-outline-secondary" @click="deleteAccount">
        Xóa
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
  emits: ["submit:account", "delete:account"],
  props: {
    account: { type: Object, required: true }
  },
  data() {
    const accountFormSchema = yup.object().shape({
      username: yup
        .string()
        .required("Tên phải có giá trị.")
        .min(2, "Tên phải ít nhất 2 ký tự.")
        .max(50, "Tên có nhiều nhất 50 ký tự."),
      email: yup
        .string()
        .email("E-mail không đúng.")
        .max(50, "E-mail tối đa 50 ký tự."),
      password: yup
        .string()
        .min(8, "Mật khẩu phải ít nhất 8 ký tự.")
    });
    return {
      // Chúng ta sẽ không muốn hiệu chỉnh props, nên tạo biến cục bộ
      // accountLocal để liên kết với các input trên form
      accountLocal: this.account,
      accountFormSchema,
    };
  },
  methods: {
    submitAccount() {
      this.$emit("submit:account", this.accountLocal);
    },
    deleteAccount() {
      this.$emit("delete:account", this.accountLocal.id);
    },
  },
};
</script>
<style scoped>
@import "@/assets/form.css";
</style>