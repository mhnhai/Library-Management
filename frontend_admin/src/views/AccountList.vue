<template>
  <div class="container">
    <div class="row mb-3">
      <div class="col">
        <h2>Danh sách tài khoản</h2>
      </div>
    </div>
    <div class="row mb-3">
      <div class="col-auto">
        <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#addAccountModal">
          Thêm tài khoản mới
        </button>
        <!-- Modal for adding a new account -->
        <AccountModal :account="{}" id="addAccountModal" @account-updated="addAccount"/>
      </div>
      <div class="col-auto">
        <button class="btn btn-danger" @click="removeAllAccounts">
          <i class="fas fa-trash"></i> Xóa tất cả
        </button>
      </div>
    </div>
    <ul class="list-group col-auto overflow-y-scroll" style=" max-height: 100vh;">
      <li class="list-group-item" v-for="(account, index) in accounts" :key="account._id">
        {{ account.username }}
        <button type="button" class="btn btn-sm btn-outline-primary float-end" data-bs-toggle="modal" :data-bs-target="'#accountModal' + index">
          Chỉnh sửa
        </button>
        <AccountModal :account="account" :id="'accountModal' + index" @account-updated="updateAccount"  @account-deleted="deleteAccount"/>
      </li>
    </ul>
  </div>
</template>

<script>
import AccountModal from "@/components/AccountModal.vue";
import SignInService from "@/services/signin.service.js";

export default {
  components: {
    AccountModal,
  },
  data() {
    return {
      accounts: [],
    };
  },
  methods: {
    async getAccounts() {
      try {
        this.accounts = await SignInService.getAll();
      } catch (error) {
        console.error("Error fetching accounts:", error);
        // Handle error appropriately
      }
    },
    updateAccount(updatedAccount) {
      const index = this.accounts.findIndex(account => account._id === updatedAccount._id);
      if (index !== -1) {
        this.accounts[index] = updatedAccount;
        this.accounts = [...this.accounts]; // Trigger reactivity
      }
    },
    addAccount(newAccount) {
      this.accounts.push(newAccount);
      this.accounts = [...this.accounts]; // Trigger reactivity
    },
    deleteAccount(deleteAccount) {

      const index = this.accounts.indexOf(deleteAccount);
      this.accounts.splice(index, 1);
      this.accounts = [...this.accounts];

    },
    async removeAllAccounts() {
      if (confirm("Bạn muốn xóa tất cả Liên hệ?")) {
        try {
          this.accounts.length = 0;
          await SignInService.deleteAll();
        } catch (error) {
          console.log(error);
        }
      }
    },
  },
  created() {
    this.getAccounts();
  }
};
</script>