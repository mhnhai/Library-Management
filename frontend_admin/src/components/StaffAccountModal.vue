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

              <Field name="fullname" type="text" class="form-control" v-model="accountLocal.fullname" disabled/>

              <ErrorMessage name="fullname" class="error-feedback" />
            </div>
            <div class="form-group">
              <label for="gender">Giới tính</label>
              <div class="col-md-4">
                <select name="gender" class="form-select" v-model="accountLocal.gender" disabled>
                  <option value="male" selected>Nam</option>
                  <option value="female">Nữ</option>
                </select>
              </div>
            </div>
            <div class="form-group">
              <label for="phone">Số điện thoại</label>
              <Field name="phone" type="text" class="form-control" v-model="accountLocal.phone" disabled/>
              <ErrorMessage name="phone" class="error-feedback" />
            </div>

            <div class="form-group">
              <label for="address">Địa chỉ</label>
              <Field name="address" type="text" class="form-control" v-model="accountLocal.address" disabled/>
              <ErrorMessage name="address" class="error-feedback" />
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
import AuthService from "@/services/auth.service.js";
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
      username: yup.string().required("Tên tài khoản không được để trống.")
          .min(3, "Tên tài khoản phải có ít nhất 3 ký tự.")
          .max(30, "Tên tài khoản không được quá 30 ký tự."),
      email: yup.string().required("Email không được để trống.")
          .email("Email không hợp lệ."),
      password: yup.string().required("Mật khẩu không được để trống.")
          .min(6, "Mật khẩu phải có ít nhất 6 ký tự."),
      role: yup.string().required("Vai trò không được để trống.")
          .oneOf(['user', 'admin' , 'librarian'], "Vai trò không hợp lệ."),
    });

    return {
      accountLocal: { ...this.account },
      accountFormSchema,
      accountList: [],
      isAdmin: false,
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