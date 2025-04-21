<!-- views/ViewSongs.vue -->
<template>
    <div class="p-6 max-w-6xl mx-auto">
        <h2 class="text-2xl font-bold mb-6">Your Songs</h2>

        <div class="overflow-x-auto">
            <table class="min-w-full bg-white shadow rounded-lg table-auto">
                <thead class="bg-gray-100 text-left">
                    <tr>
                        <th class="px-4 py-3">Title</th>
                        <th class="px-4 py-3">Genre</th>
                        <th class="px-4 py-3">Album</th>
                        <th class="px-4 py-3">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="song in songStore.songs" :key="song.id" class="border-t">
                        <td class="px-4 py-4 break-words max-w-[200px]">{{ song.title }}</td>
                        <td class="px-4 py-4 capitalize">{{ song.genre }}</td>
                        <td class="px-4 py-4">{{ song.album_name || 'N/A' }}</td>
                        <td class="px-4 py-4 flex gap-2">
                            <button class="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                                @click="editSong(song.id)">
                                Edit
                            </button>
                            <button class="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                                @click="deleteSong(song.id)">
                                Delete
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>

            <div v-if="songStore.songs.length === 0" class="text-gray-500 mt-4 text-center">
                No songs found.
            </div>
        </div>

        <!-- <p v-if="songStore.error" class="text-red-600 mt-4">{{ songStore.error }}</p> -->
    </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useToast } from 'vue-toast-notification'
import { useAuthStore } from '@/stores/auth'
import { useSongStore } from '@/stores/song'
import Swal from 'sweetalert2'

const route = useRoute()
const router = useRouter()
const toast = useToast()
const authStore = useAuthStore()
const songStore = useSongStore()

onMounted(() => {
    const artistId = route.params.id
    if (artistId) {
        songStore.fetchSongsByArtist(artistId)
    }

    const successMessage = route.query.success
    if (successMessage) {
        toast.open({
            message: successMessage,
            type: 'success',
            duration: 3000,
            position: 'top-right',
        })
    }

    router.replace({ query: { ...route.query, success: undefined } })
})

const deleteSong = async (id) => {
    const result = await Swal.fire({
        title: 'Are you sure?',
        text: 'This action cannot be undone!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Yes, delete it!',
    })

    if (result.isConfirmed) {
        try {
            await songStore.deleteSong(id)
            toast.success('Song deleted successfully', { position: 'top-right' })
        } catch (error) {
            const errorMsg = songStore.error || 'Failed to delete song'
            toast.error(errorMsg, { position: 'top-right' })
        }
    }
}
</script>

<style scoped>
.table-auto {
    table-layout: auto;
    width: 100%;
    font-size: 0.875rem;
}

@media (max-width: 768px) {
    table {
        font-size: 0.875rem;
    }

    th,
    td {
        padding: 8px;
    }
}
</style>
