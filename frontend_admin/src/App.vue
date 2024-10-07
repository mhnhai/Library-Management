<script>
import Sidebar from "@/components/Sidebar.vue";
export default {
  components: {
    Sidebar,

  },
};
</script>
<template>
  <div id="app" class="row">
    <Sidebar class="col-3"/>
    <div class="col-9 mt-3">
      <router-view />
    </div>
  </div>
</template>
<style>
.page {
  max-width: 1000px;
  min-height: 100vh;
  margin: auto;
  font-family: Bitter, serif;
}

</style>