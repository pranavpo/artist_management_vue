<template>
    <div class="max-w-md mx-auto mt-10 bg-white shadow-md rounded-lg p-6">
        <h2 class="text-2xl font-bold mb-6 text-center text-gray-800">Edit Song</h2>
        <form @submit.prevent="updateSong" class="space-y-4">
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Song Title</label>
                <input type="text" v-model="form.title"
                    class="w-full border px-3 py-2 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
                    placeholder="Enter song title" required />
            </div>

            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Album Name</label>
                <input type="text" v-model="form.album_name"
                    class="w-full border px-3 py-2 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
                    placeholder="Enter album name" required />
            </div>

            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Genre</label>
                <select v-model="form.genre"
                    class="w-full border px-3 py-2 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
                    required>
                    <option value="rock">Rock</option>
                    <option value="rnb">R&B</option>
                    <option value="jazz">Jazz</option>
                    <option value="classic">Classical</option>
                    <option value="country">Country</option>
                </select>
            </div>

            <button type="submit"
                class="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-150">
                Update Song
            </button>
        </form>

        <p v-if="error" class="text-center text-red-600 mt-4">{{ error }}</p>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useSongStore } from '@/stores/song'

const route = useRoute()
const router = useRouter()
const songStore = useSongStore()

const form = ref({
    title: '',
    album_name: '',
    genre: '',
    artist_id: ''
})

const error = ref('')

onMounted(async () => {
    try {
        const song = await songStore.getSongById(route.params.id)
        form.value = {
            title: song.title,
            album_name: song.album_name,
            genre: song.genre,
            artist_id: song.artist_id
        }
    } catch (err) {
        error.value = songStore.error || 'Failed to load song.'
    }
})

const updateSong = async () => {
    try {
        await songStore.updateSong(route.params.id, form.value)
        const currentPage = route.query.page || 1
        router.push({
            path: `/artists/${form.value.artist_id}/view-songs`,
            query: {page:currentPage, success: 'Song updated successfully!' }
        })
    } catch (err) {
        error.value = songStore.error || 'Failed to update song.'
    }
}
</script>
