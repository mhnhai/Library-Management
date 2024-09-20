<script>
export default {
    props: {
        books: { type: Array, default: [] },
        activeIndex: { type: Number, default: -1 },
    },
    emits: ["update:activeIndex"],
    methods: {
        updateActiveIndex(index) {
            this.$emit("update:activeIndex", index);
        },
        goToBookDetail(bookId) {
            // Assuming you're using Vue Router for navigation
            this.$router.push({ name: 'bookdetails', params: { id: bookId } });
        }
    }
};
</script>
<template>
    <div class="d-flex flex-wrap g-3">
        <div class="p-2" v-for="(book, index) in books" :key="book._id" :class="{ active: index === activeIndex }"
            style="flex: 0 1 150px;">
            <!-- Image with click event to navigate to book detail -->
            <router-link :to="`/book/${book._id}`">
                <img v-if="book.imageUrl" :src="book.imageUrl" style="width: 150px; height: 250px;" />
            </router-link>
        </div>
    </div>
</template>
