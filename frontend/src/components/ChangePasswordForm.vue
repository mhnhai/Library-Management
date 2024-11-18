<template>
  <Form @submit="submitPassword" :validation-schema="accountFormSchema">
    <div class="form-group">

      <label for="password">Nhập mật khẩu cũ</label>

      <Field name="old-password" type="password" class="form-control" v-model="formData.oldPassword" />

      <ErrorMessage name="old-password" class="error-feedback" />
    </div>
    <div class="form-group">

      <label for="password">Nhập mật khẩu mới</label>

      <Field name="password" type="password" class="form-control" v-model="formData.password" />

      <ErrorMessage name="password" class="error-feedback" />
    </div>
    <div class="form-group">
      <label for="password">Xác nhận lại mật khẩu mới</label>

      <Field name="password2" type="password" class="form-control" />

      <ErrorMessage name="password2" class="error-feedback" />
    </div>
    <div class="form-group d-flex justify-content-center mt-3">
      <button class="ml-2 btn btn-secondary">
        Cập nhật mật khẩu
      </button>
    </div>
  </Form>
</template>
<script>
import * as yup from "yup";
import {Form, Field, ErrorMessage} from "vee-validate";

export default {
  components: {
    Form,
    Field,
    ErrorMessage,
  },
  emits: ["submit:account"],

  data() {
    const accountFormSchema = yup.object().shape({
      password: yup
          .string()
          .required("Nhập mật khẩu.")
          .min(8, "Mật khẩu phải ít nhất 8 ký tự."),
      password2: yup
          .string()
          .required("Nhập lại mật khẩu")
          .oneOf([yup.ref('password')], 'Mật khẩu không trùng khớp'),
    });
    return {
      formData: {
        oldPassword: '',
        password: '',
      },
      accountFormSchema,
    };
  },
  methods: {
    submitPassword() {
      this.$emit("submit:account", this.formData);
    },
  },
};
</script>
<style scoped>
@import "@/assets/form.css";
</style>