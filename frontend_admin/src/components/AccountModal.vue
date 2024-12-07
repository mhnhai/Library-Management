<template>
  <div class="modal fade" :id="id" tabindex="-1" aria-labelledby="accountModalLabel" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="accountModalLabel">{{ account._id ? 'Chỉnh sửa tài khoản' : 'Thêm tài khoản mới' }}</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <Form @submit="submitAccount" :validation-schema="accountFormSchema" class="row g-3">
            <!-- username -->
            <div class="form-group">
              <label for="fullname">Họ và tên</label>

              <Field name="fullname" type="text" class="form-control" v-model="accountLocal.fullname" />

              <ErrorMessage name="fullname" class="error-feedback" />
            </div>
            <div class="form-group">
              <label for="username">Tên tài khoản</label>
              <Field name="username" type="text" class="form-control" v-model="accountLocal.username" disabled v-if="accountLocal._id"/>
              <Field name="username" type="text" class="form-control" v-model="accountLocal.username" v-else/>

              <ErrorMessage name="username" class="error-feedback" />
            </div>
            <div class="form-group">
              <label for="email">Email</label>

              <Field name="email" type="email" class="form-control" v-model="accountLocal.email" />

              <ErrorMessage name="email" class="error-feedback" />
            </div>
            <div class="form-group">

              <label for="password">Mật khẩu</label>

              <Field name="password" type="password" class="form-control" v-model="accountLocal.password" />

              <ErrorMessage name="password" class="error-feedback" />
            </div>
            <div class="form-group">
              <label for="gender">Giới tính</label>
              <div class="col-md-4">
                <select name="gender" class="form-select" v-model="accountLocal.gender">
                  <option value="male" selected>Nam</option>
                  <option value="female">Nữ</option>
                </select>
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
            <!-- role -->
            <div class="col-12">
              <label for="role" class="form-label">Vai trò</label>
              <Field name="role" as="select" class="form-select" v-model="accountLocal.role" >
                <option value="user">Người dùng</option>
                <option value="librarian">Nhân viên thủ thư</option>
                <option value="admin">Quản trị viên</option>
              </Field>
              <ErrorMessage name="role" class="text-danger" />
            </div>

            <div class="col-12 text-end">
              <button type="submit" class="btn btn-primary">{{ accountLocal._id ? 'Cập nhật' : 'Thêm mới' }}</button>
              <button v-if="accountLocal._id" type="button" class="btn btn-danger" data-bs-dismiss="modal" @click="deleteAccount">Xóa</button>
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
import AccountService from "@/services/signin.service.js";
export default {
  components: {
    Form,
    Field,
    ErrorMessage,
  },
  props: {
    account: { type: Object, required: true },
    id: { type: String, required: true }
  },
  emits: ["submit:account", "delete:account"],
  data() {
    const accountFormSchema = yup.object().shape({
      fullname: yup.string().required("Nhập họ và tên."),
      username: yup
          .string()
          .required("Nhập tên tài khoản.")
          .min(2, "Tên phải ít nhất 6 ký tự.")
          .max(50, "Tên có nhiều nhất 50 ký tự."),
      email: yup
          .string()
          .required("Nhập email.")
          .email("E-mail không đúng.")
          .max(50, "E-mail tối đa 50 ký tự."),
      phone:yup
          .string()
          .required("Nhập số điện thoại")
          .min(10,"Nhập đúng 10 số")
          .max(10,"Nhập đúng 10 số")
      ,
      gender: yup
          .string()
          .required("Vui lòng chọn giới tính")
          .notOneOf([""], 'Vui lòng chọn giới tính'),
      birthdate:yup
          .string()
          .required("Nhập ngày sinh")
      ,
      password: yup
          .string()
          .required("Nhập mật khẩu.")
          .min(8, "Mật khẩu phải ít nhất 8 ký tự."),
      password2: yup
          .string()
          .required("Nhập lại mật khẩu")
          .oneOf([yup.ref('password')], 'Mật khẩu không trùng khớp'),
      address: yup
          .string()
          .required("Nhập vào địa chỉ"),
    });
    return {
      accountLocal: { ...this.account },
      accountFormSchema,
      accountList: [],
    };
  },
  methods: {
    async submitAccount() {
      try {
        this.accountList = await AccountService.getAll();
        const found = this.accountList.find(acc => acc.username === this.accountLocal.username);

        if (found && (!this.accountLocal._id || found._id !== this.accountLocal._id)) {
          alert('Tên tài khoản đã tồn tại, vui lòng chọn tên khác.');
          return;
        }
        if (this.accountLocal._id) {
          await AccountService.update(this.accountLocal._id, this.accountLocal);
          alert('Tài khoản đã được cập nhật thành công.');
          this.$emit('submit:account', this.accountLocal);
        } else {
          const createdAccount = await AccountService.create(this.accountLocal);
          alert('Tài khoản mới đã được thêm thành công.');
          this.$emit('submit:account', createdAccount);
          this.accountLocal = {};
        }
      } catch (error) {
        console.log(error);
      }
    },
    async deleteAccount() {
      if (confirm("Bạn muốn xóa tài khoản này?")) {
        try {
          await AccountService.delete(this.accountLocal._id);
          alert('Tài khoản đã được xóa thành công.');
          this.$emit('delete:account', this.accountLocal);
        } catch (error) {
          console.log(error);
        }
      }
    },
  },
};
</script>
<style scoped>
@import "@/assets/form.css";
</style>