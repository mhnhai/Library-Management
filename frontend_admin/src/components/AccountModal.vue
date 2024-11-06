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
            <div class="col-12">
              <label for="username" class="form-label">Tên tài khoản</label>
              <Field name="username" type="text" class="form-control" v-model="accountLocal.username" />
              <ErrorMessage name="username" class="text-danger" />
            </div>

            <!-- email -->
            <div class="col-12">
              <label for="email" class="form-label">Email</label>
              <Field name="email" type="email" class="form-control" v-model="accountLocal.email" />
              <ErrorMessage name="email" class="text-danger" />
            </div>

            <!-- password -->
            <div class="col-12">
              <label for="password" class="form-label">Mật khẩu</label>
              <Field name="password" type="password" class="form-control" v-model="accountLocal.password" />
              <ErrorMessage name="password" class="text-danger" />
            </div>

            <!-- role -->
            <div class="col-12">
              <label for="role" class="form-label">Vai trò</label>
              <Field name="role" as="select" class="form-select" v-model="accountLocal.role">
                <option value="user">Người dùng</option>
                <option value="admin">Quản trị viên</option>
              </Field>
              <ErrorMessage name="role" class="text-danger" />
            </div>

            <div class="col-12 text-end">
              <button type="submit" class="btn btn-primary">{{ account._id ? 'Cập nhật' : 'Thêm mới' }}</button>
              <button v-if="account._id" type="button" class="btn btn-danger" data-bs-dismiss="modal" @click="deleteAccount">Xóa</button>
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
      username: yup.string().required("Tên tài khoản không được để trống.")
          .min(3, "Tên tài khoản phải có ít nhất 3 ký tự.")
          .max(30, "Tên tài khoản không được quá 30 ký tự."),
      email: yup.string().required("Email không được để trống.")
          .email("Email không hợp lệ."),
      password: yup.string().required("Mật khẩu không được để trống.")
          .min(6, "Mật khẩu phải có ít nhất 6 ký tự."),
      role: yup.string().required("Vai trò không được để trống.")
          .oneOf(['user', 'admin'], "Vai trò không hợp lệ."),
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