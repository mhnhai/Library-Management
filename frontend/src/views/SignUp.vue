<template>
  <div v-if="account" class="page">
    <h4>Tạo tài khoản</h4>
    <SignUpForm :account="account" @submit:account="uploadAccount" />
    <p>{{ message }}</p>
  </div>
</template>
<script>
import SignUpForm from "@/components/SignUpForm.vue";
import SignInService from "@/services/signin.service";
export default {
  components: {
    SignUpForm,
  },
  props: {
    id: { type: String, required: true },
  },
  data() {
    return {
      account: {"role":"user"},  // mac dinh la user
      message: "",
    };
  },
  methods: {
    async uploadAccount(data) {
      try {
        // this.accounts = await SignInService.getAll();

        await SignInService.create(data)
        this.$router.push({ name: "signin" })
      } catch (error) {
        console.log(error);
      }
    }
  }
}
</script>
<style>
.page {
  max-width: 400px;
  min-height: 100vh;
  margin: auto;
}
</style>