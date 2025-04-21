<template>
    <div class="flex justify-center items-center mt-6 mb-4 space-x-2">
        <button @click="changePage(currentPage - 1)"
            class="px-3 py-1 rounded border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            :disabled="currentPage === 1">
            Previous
        </button>

        <div class="flex space-x-1">
            <button v-for="page in displayedPages" :key="page" @click="changePage(page)"
                class="px-3 py-1 rounded border"
                :class="page === currentPage ? 'bg-blue-500' : 'border-gray-300 hover:bg-gray-100'">
                {{ page }}
            </button>
        </div>
        <button @click="changePage(currentPage + 1)"
            class="px-3 py-1 border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            :disabled="currentPage === totalPages">
            Next
        </button>
    </div>
</template>

<script setup>
import { computed } from 'vue'
const props = defineProps({
    currentPage: {
        type: Number,
        required: true
    },
    totalPages: {
        type: Number,
        required: true
    }
});

const emit = defineEmits(['page-change'])

const changePage = (page) => {
    if (page < 1 || page > props.totalPages) return
    emit('page-change', page)
}

const displayedPages = computed(() => {
    const pages = []
    for (let i = 1; i <= props.totalPages; i++) {
        pages.push(i)
    }
    return pages;
})


</script>