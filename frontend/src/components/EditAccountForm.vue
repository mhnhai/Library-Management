<template>
  <Form @submit="submitAccount" :validation-schema="accountFormSchema">
    <div class="form-group">
      <label for="fullname">Họ và tên</label>

      <Field name="fullname" type="text" class="form-control" v-model="accountLocal.fullname" />

      <ErrorMessage name="fullname" class="error-feedback" />
    </div>
    <div class="form-group">
      <label for="email">Email</label>

      <Field name="email" type="email" class="form-control" v-model="accountLocal.email" />

      <ErrorMessage name="email" class="error-feedback" />
    </div>
    <div v-if="!accountLocal._id" class="form-group">

      <label for="password">Mật khẩu</label>

      <Field name="password" type="password" class="form-control" v-model="accountLocal.password" />

      <ErrorMessage name="password" class="error-feedback" />
    </div>
    <div v-if="!accountLocal._id" class="form-group">
      <label for="password">Nhập lại mật khẩu</label>

      <Field name="password2" type="password" class="form-control" />

      <ErrorMessage name="password2" class="error-feedback" />
    </div>
    <div class="form-group">
      <label for="gender">Giới tính</label>
      <div class="col-md-5">
        <Field name="gender" as="select" class="form-select" v-model="accountLocal.gender">
          <option value="">Chọn giới tính</option>
          <option value="male">Nam</option>
          <option value="female">Nữ</option>
        </Field>
        <ErrorMessage name="gender" class="error-feedback" />
      </div>
    </div>
    <div class="form-group">
      <label for="phone">Số điện thoại</label>

      <Field name="phone" type="text" class="form-control" v-model="accountLocal.phone" />

      <ErrorMessage name="phone" class="error-feedback" />
    </div>
    <div class="form-group">
      <label for="birthdate">Sinh nhật</label>

      <Field name="birthdate" type="date" class="form-control" v-model="accountLocal.birthdate" />

      <ErrorMessage name="birthdate" class="error-feedback" />
    </div>

    <div class="form-group">
      <label for="address">Địa chỉ</label>

      <Field name="address" type="text" class="form-control" v-model="accountLocal.address" />

      <ErrorMessage name="address" class="error-feedback" />
    </div>
    <div class="form-group d-flex justify-content-center mt-3">
      <button v-if="!accountLocal._id" class="btn btn-primary btn-sm">Tạo tài khoản</button>
      <button v-if="accountLocal._id" class="ml-2 btn btn-secondary">
        Cập nhật thông tin
      </button>
      <button v-if="accountLocal._id" type="button" class="ml-2 btn btn-outline-secondary" @click="deleteAccount">
        Xóa tài khoản
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
  emits: ["submit:account", "delete:account"],
  props: {
    account: {type: Object, required: true}
  },
  data() {
    const accountFormSchema = yup.object().shape({
      fullname: yup.string().required("Nhập họ và tên."),
      email: yup
          .string()
          .required("Nhập email.")
          .email("E-mail không đúng.")
          .max(50, "E-mail tối đa 50 ký tự."),
      phone: yup
          .string()
          .required("Nhập số điện thoại")
          .min(10, "Nhập đúng 10 số")
          .max(10, "Nhập đúng 10 số")
      ,
      gender: yup
          .string()
          .required("Vui lòng chọn giới tính")
          .notOneOf([""], 'Vui lòng chọn giới tính'),
      birthdate: yup
          .string()
          .required("Nhập ngày sinh")
      ,
      // password: yup
      //     .string()
      //     .required("Nhập mật khẩu.")
      //     .min(8, "Mật khẩu phải ít nhất 8 ký tự."),
      // password2: yup
      //     .string()
      //     .required("Nhập lại mật khẩu")
      //     .oneOf([yup.ref('password')], 'Mật khẩu không trùng khớp'),
      address: yup
          .string()
          .required("Nhập vào địa chỉ"),
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