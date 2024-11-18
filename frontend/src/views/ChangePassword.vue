<template>
  <div v-if="account" class="page">
    <h4>Đổi mật khẩu</h4>
    <ChangePasswordForm :account="account" @submit:account="updateAccount" />
    <p>{{ message }}</p>
  </div>
</template>
<script>
import AccountService from "@/services/signin.service";
import ChangePasswordForm from "@/components/ChangePasswordForm.vue";
import {toast} from "vue3-toastify";
export default {
  components: {
    ChangePasswordForm,
  },
  props: {
    id: { type: String, required: true },
  },
  data() {
    return {
      account: null,
      message: "",
    };
  },
  methods: {
    async getAccount(id) {
      try {
        this.account = await AccountService.get(id);
      } catch (error) {
        console.log(error);
        // Chuyển sang trang NotFound đồng thời giữ cho URL không đổi
        this.$router.push({
          name: "notfound",
          params: {
            pathMatch: this.$route.path.split("/").slice(1)
          },
          query: this.$route.query,
          hash: this.$route.hash,
        });
      }
    },
    async checkPassword(data) {
      return (data.oldPassword === this.account.password);
    },
    async updateAccount(data) {
      if(await this.checkPassword(data) === false){
        toast("Mật khẩu cũ không đúng. Vui lòng nhập lại.", {
          "type": "error",
          "pauseOnHover": false,
          "dangerouslyHTMLString": true,
          "limit":1
        });
      }
      else if(confirm("Xác nhận cập nhật mật khẩu?"))
        try {
          await AccountService.update(this.account._id, data);
          alert('Cập nhật thành công.');
          this.$router.push({ name: "client" });
        } catch (error) {
          console.log(error);
        }
    },
  },
  created() {
    this.getAccount(this.id);
    this.message = "";
  },
};
</script>