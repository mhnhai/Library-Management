<template>
  <div class="container">
    <div class="row mb-3">
      <div class="col">
        <h2>Danh sách nhà xuất bản</h2>
      </div>
    </div>
    <div class="row mb-3">
      <div class="col-auto">
        <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#addPublisherModal">
          Thêm nhà xuất bản mới
        </button>
        <!-- Modal for adding a new publisher -->
        <PublisherModal :publisher="{}" id="addPublisherModal" @publisher-updated="addPublisher"/>
      </div>
      <div class="col-auto">
        <button class="btn btn-danger" @click="removeAllPublishers">
          <i class="fas fa-trash"></i> Xóa tất cả
        </button>
      </div>
    </div>
    <ul class="list-group col-auto overflow-y-scroll" style=" max-height: 100vh;">
      <li class="list-group-item" v-for="(publisher, index) in publishers" :key="publisher._id">
        {{ publisher.name }}
        <button type="button" class="btn btn-sm btn-outline-primary float-end" data-bs-toggle="modal" :data-bs-target="'#publisherModal' + index">
          Chỉnh sửa
        </button>
        <PublisherModal :publisher="publisher" :id="'publisherModal' + index" @publisher-updated="updatePublisher"  @publisher-deleted="deletePublisher"/>
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
    };
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

      const index = this.publishers.indexOf(deletePublisher);
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