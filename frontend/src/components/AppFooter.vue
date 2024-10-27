<!-- src/components/FooterComponent.vue -->
<template>
  <footer class="bg-dark text-white text-center py-3 mt-auto">
    <div class="container">
      <p class="mb-1">© 2024 My Website. All rights reserved.</p>
      <nav class="d-flex justify-content-center text-decoration-none">
        <router-link class="nav-link mx-1" :to="{ name: 'client' }">
          Giới thiệu
        </router-link>
        <span>|</span>
        <router-link class="nav-link mx-1" :to="{ name: 'client' }">
          Chính sách
        </router-link>
        <span>|</span>
        <router-link class="nav-link mx-1" :to="{ name: 'client' }">
          Liên hệ
        </router-link>
      </nav>
    </div>
  </footer>
</template>