<template> 
    <div v-if="account" class="page">
        <h4>Thông tin cá nhân</h4>
        <SignUpForm :account="account" @submit:account="updateAccount" @delete:account="deleteAccount" />
        <p>{{ message }}</p>
    </div> 
</template>
<script>
import SignUpForm from "@/components/SignUpForm.vue";
import AccountService from "@/services/signin.service";
export default {
    components: {
        SignUpForm,
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
        async updateAccount(data) {
            if(confirm("Xác nhận cập nhật thông tin?"))
            try {
                await AccountService.update(this.account._id, data);
                alert('Cập nhật thành công.');
                this.$router.push({ name: "client" });
            } catch (error) {
                console.log(error);
            }
        },
        async deleteAccount() {
            if (confirm("Bạn muốn xóa tài khoản này?")) {
                try {
                    await AccountService.delete(this.account._id);
                    this.$router.push({ name: "client" });
                } catch (error) {
                    console.log(error);
                }
            }
        },
    },
    created() {
        this.getAccount(this.id);
        this.message = "";
    },
};
</script>