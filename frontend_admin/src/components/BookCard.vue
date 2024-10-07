<script>
export default {
    props: {
        book: { type: Object, required: true },
    },
};
</script>
<template>
    <div>
        <!-- title, author, category, language -->
        <div class="p-1">
            <strong>Tên:</strong>
            {{ book.title }}
        </div>
        <div class="p-1">
            <strong>Tác giả:</strong>
            {{ book.author }}
        </div>
        <div class="p-1">
            <strong>Thể loại:</strong>
            {{ book.category }}
        </div>
        <div class="p-1">
            <strong>Ngôn ngữ:</strong>
            {{ book.language }}
        </div>
        <img v-if="book.imageUrl" :src="book.imageUrl" alt="Uploaded Image" style="height: 200px; width: 100px;" />

    </div>
</template>