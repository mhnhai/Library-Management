<script>
import AppHeader from "@/components/AppHeader.vue";
import AppFooter from "@/components/AppFooter.vue";
export default {
  components: {
    AppHeader,
    AppFooter
  },
};
</script>
<template>
  <div id="app" class="bg-dark-subtle bg-gradient">
    <AppHeader class="fixed-top"/>
    <div class="container mt-3 content pt-5">
      <router-view />
    </div>
    <AppFooter />

  </div>
</template>
<style>

.page {
  max-width: 1000px;
  min-height: 175vh;
  margin: auto;
  font-family: Bitter, serif;
}
.page-detail{
  max-width: 1000px;
  min-height: 100vh;
  margin: auto;
}
</style>