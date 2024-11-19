<template>
  <div class="container">
    <div class="row mb-3">
      <div class="col">
        <h2>Danh sách nhà xuất bản</h2>
      </div>
    </div>

    <!-- Search bar -->
    <div class="row mb-3">
      <div class="col-md-6">
        <div class="input-group">
          <input
              type="text"
              class="form-control"
              v-model="searchText"
              placeholder="Tìm kiếm tên nhà xuất bản..."
          >
        </div>
      </div>
    </div>

    <div class="row mb-3">
      <div class="col-auto">
        <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#addPublisherModal">
          Thêm nhà xuất bản mới
        </button>
        <PublisherModal :publisher="{}" id="addPublisherModal" @submit:publisher="addPublisher"/>
      </div>
      <div class="col-auto">
        <button class="btn btn-danger" @click="removeAllPublishers">
          <i class="fas fa-trash"></i> Xóa tất cả
        </button>
      </div>
    </div>

    <!-- Show result count -->
    <div class="row mb-2" v-if="searchText">
      <div class="col">
        <small class="text-muted">
          Tìm thấy {{ filteredPublishers.length }} kết quả
        </small>
      </div>
    </div>

    <ul class="list-group col-auto overflow-y-scroll" style="max-height: 100vh;">
      <li class="list-group-item" v-for="(publisher, index) in filteredPublishers" :key="publisher._id">
        {{ publisher.name }}
        <button
            type="button"
            class="btn btn-sm btn-outline-primary float-end"
            data-bs-toggle="modal"
            :data-bs-target="'#publisherModal' + index"
        >
          Xem chi tiết
        </button>
        <PublisherModal
            :publisher="publisher"
            :id="'publisherModal' + index"
            @submit:publisher="updatePublisher"
            @delete:publisher="deletePublisher"
        />
      </li>
      <!-- Show message when no results found -->
      <li class="list-group-item text-center text-muted" v-if="filteredPublishers.length === 0">
        Không tìm thấy nhà xuất bản nào
      </li>
    </ul>
  </div>
</template>

<script>
import PublisherModal from "@/components/PublisherModal.vue";
import PublisherService from "@/services/publisher.service.js";

export default {
  components: {
    PublisherModal,
  },
  data() {
    return {
      publishers: [],
      searchText: "",
    };
  },
  computed: {
    filteredPublishers() {
      const searchTerm = this.searchText.toLowerCase().trim();
      if (!searchTerm) {
        return this.publishers;
      }

      return this.publishers.filter(publisher => {
        return publisher.name?.toLowerCase().includes(searchTerm);
      });
    }
  },
  methods: {
    async getPublishers() {
      try {
        this.publishers = await PublisherService.getAll();
      } catch (error) {
        console.error("Error fetching publishers:", error);
        // Handle error appropriately
      }
    },
    updatePublisher(updatedPublisher) {
      const index = this.publishers.findIndex(publisher => publisher._id === updatedPublisher._id);
      if (index !== -1) {
        this.publishers[index] = updatedPublisher;
        this.publishers = [...this.publishers]; // Trigger reactivity
      }
    },
    addPublisher(newPublisher) {
      this.publishers.push(newPublisher);
      this.publishers = [...this.publishers]; // Trigger reactivity
    },
    deletePublisher(deletePublisher) {
      const index = this.publishers.findIndex(publisher => publisher._id === deletePublisher._id);
      this.publishers.splice(index, 1);
      this.publishers = [...this.publishers];
    },
    async removeAllPublishers() {
      if (confirm("Bạn muốn xóa tất cả Liên hệ?")) {
        try {
          this.publishers.length = 0;
          await PublisherService.deleteAll();
        } catch (error) {
          console.log(error);
        }
      }
    },
  },
  created() {
    this.getPublishers();
  }
};
</script>

<style scoped>
.input-group {
  margin-bottom: 10px;
}

@media (min-width: 768px) {
  .input-group {
    margin-bottom: 0;
  }
}
</style>