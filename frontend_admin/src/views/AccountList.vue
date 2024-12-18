<template>
  <div class="container">
    <div class="row mb-3">
      <div class="col">
        <h2>Danh sách tài khoản</h2>
      </div>
    </div>

    <!-- thanh tìm kiếm -->
    <div class="row mb-3">
      <div class="col-md-6">
        <div class="input-group">
          <input
              type="text"
              class="form-control"
              v-model="searchText"
              placeholder="Tìm kiếm theo tên hoặc số điện thoại..."
          >
        </div>
      </div>
    </div>
    <div class="row mb-3" :hidden="!isAdmin">
      <div class="col-auto">
        <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#addAccountModal">
          Thêm tài khoản mới
        </button>
        <!-- Modal for adding a new account -->
        <AccountModal :account="{}" id="addAccountModal" @submit:account="addAccount"/>
      </div>
      <div class="col-auto">
        <button class="btn btn-danger" @click="removeAllAccounts">
          <i class="fas fa-trash"></i> Xóa tất cả
        </button>
      </div>
    </div>


    <div class="row mb-2" v-if="searchText">
      <div class="col">
        <small class="text-muted">
          Tìm thấy {{ filteredAccounts.length }} kết quả
        </small>
      </div>
    </div>

    <ul class="list-group col-auto overflow-y-scroll" style=" max-height: 100vh;">
      <li class="list-group-item" v-for="(account, index) in filteredAccounts" :key="account._id">
        {{ account.fullname }}
        <button type="button" class="btn btn-sm btn-outline-primary float-end" data-bs-toggle="modal" :data-bs-target="'#accountModal' + index">
          Xem chi tiết
        </button>
        <AccountModal v-if="isAdmin" :account="account" :id="'accountModal' + index" @submit:account="updateAccount"  @delete:account="deleteAccount"/>
        <StaffAccountModal v-else :account="account" :id="'accountModal' + index"></StaffAccountModal>
      </li>
      <li class="list-group-item text-center text-muted" v-if="filteredAccounts.length === 0">
        Không tìm thấy tài khoản nào
      </li>
    </ul>
  </div>
</template>

<script>
import AccountModal from "@/components/AccountModal.vue";
import SignInService from "@/services/signin.service.js";
import AuthService from "@/services/auth.service.js";
import StaffAccountModal from "@/components/StaffAccountModal.vue";
export default {
  components: {
    StaffAccountModal,
    AccountModal,
  },
  data() {
    return {
      accounts: [],
      searchText: "",
      isAdmin: false,
    };
  },
  computed:{
    reversedAccounts() {
        return [...this.accounts].reverse();
    },
    filteredAccounts() {
      const searchTerm = this.searchText.toLowerCase().trim();
      if (!searchTerm) {
        return this.reversedAccounts;
      }

      return this.reversedAccounts.filter(account => {
        const fullName = account.fullname?.toLowerCase() || '';
        const phone = account.phone?.toLowerCase() || '';

        return fullName.includes(searchTerm) ||
            phone.includes(searchTerm);
      });
    }
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
      const index = this.accounts.findIndex(account => account._id === deleteAccount._id);
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
    this.isAdmin = AuthService.isAdmin();
  }
};
</script>