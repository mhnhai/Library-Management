<template>
  <div class="modal fade" :id="id" tabindex="-1" aria-labelledby="publisherModalLabel" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="publisherModalLabel">{{ publisher._id ? 'Chỉnh sửa nhà xuất bản' : 'Thêm nhà xuất bản mới' }}</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <Form @submit="submitPublisher" :validation-schema="publisherFormSchema" class="row g-3">
            <!-- name -->
            <div class="col-12">
              <label for="name" class="form-label">Tên nhà xuất bản</label>
              <Field name="name" type="text" class="form-control" v-model="publisherLocal.name" />
              <ErrorMessage name="name" class="text-danger" />
            </div>

            <!-- address -->
            <div class="col-12">
              <label for="address" class="form-label">Địa chỉ</label>
              <Field name="address" type="address" class="form-control" v-model="publisherLocal.address" />
              <ErrorMessage name="address" class="text-danger" />
            </div>

            <div class="col-12 text-end">
              <button type="submit" class="btn btn-primary">{{ publisher._id ? 'Cập nhật' : 'Thêm mới' }}</button>
              <button v-if="publisher._id" type="button" class="btn btn-danger" data-bs-dismiss="modal" @click="deletePublisher">Xóa</button>
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
import PublisherService from "@/services/publisher.service.js";

export default {
  components: {
    Form,
    Field,
    ErrorMessage,
  },
  props: {
    publisher: { type: Object, required: true },
    id: { type: String, required: true }
  },
  emits: ["submit:publisher", "delete:publisher"],
  data() {
    const publisherFormSchema = yup.object().shape({
      name: yup.string().required("Tên không được để trống.")
          .min(3, "Tên nhà xuất bản phải có ít nhất 3 ký tự."),
      address: yup.string().required("Địa chỉ không được để trống.")
    });

    return {
      publisherLocal: { ...this.publisher },
      publisherFormSchema,
      publisherList: [],
    };
  },
  methods: {
    async submitPublisher() {
      try {
        this.publisherList = await PublisherService.getAll();
        const found = this.publisherList.find(publisher => publisher.name === this.publisherLocal.name);

        if (found && (!this.publisherLocal._id || found._id !== this.publisherLocal._id)) {
          alert('Tên nhà xuất bản đã tồn tại, vui lòng chọn tên khác.');
          return;
        }
        if (this.publisherLocal._id) {
          await PublisherService.update(this.publisherLocal._id, this.publisherLocal);
          alert('Nhà xuất bản đã được cập nhật thành công.');
          this.$emit('submit:publisher', this.publisherLocal);
        } else {
          const createdPublisher = await PublisherService.create(this.publisherLocal);
          alert('Nhà xuất bản mới đã được thêm thành công.');
          this.$emit('submit:publisher', createdPublisher);
        }
        this.publisherLocal = {};
      } catch (error) {
        console.log(error);
      }
    },
    async deletePublisher() {
      if (confirm("Bạn muốn xóa nhà xuất bản này?")) {
        try {
          await PublisherService.delete(this.publisherLocal._id);
          alert('Nhà xuất bản đã được xóa thành công.');
          this.$emit('delete:publisher', this.publisherLocal);
          // window.location.reload();
        } catch (error) {
          console.log(error);
        }
      }
    },
  },
};
</script>