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
    <div class="form-group d-flex justify-content-center mt-3">
      <button class="btn w-100 btn-primary">ĐĂNG NHẬP</button>
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
        .required("Nhập vào tên tài khoản.")
        ,
      password: yup
        .string()
          .required("Nhập vào mật khẩu."),

    
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
  },
};
</script>
<style scoped>
@import "@/assets/form.css";
</style>