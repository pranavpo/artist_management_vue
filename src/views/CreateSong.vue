<template>
    <div class="max-w-md mx-auto mt-10 bg-white shadow-md rounded-lg p-6">
        <h2 class="text-2xl font-bold mb-6 text-center text-gray-800">Create Song</h2>
        <form @submit.prevent="submitSong" class="space-y-4">

            <!-- Song Title -->
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Song Title</label>
                <input type="text" v-model="form.title"
                    class="w-full border px-3 py-2 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
                    placeholder="Enter song title" required />
            </div>

            <!-- Album Name -->
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Album Name</label>
                <input type="text" v-model="form.album_name"
                    class="w-full border px-3 py-2 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
                    placeholder="Enter album name" required />
            </div>

            <!-- Genre -->
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

            <!-- Artist ID (This will be taken from URL params, hidden but included in the form data) -->
            <input type="hidden" v-model="form.artist_id" />

            <button type="submit"
                class="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-150">
                Create Song
            </button>
        </form>

        <p v-if="error" class="text-center text-red-600 mt-4">{{ error }}</p>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';
import { useSongStore } from '@/stores/song'
import { useAuthStore } from '@/stores/auth'

const songStore = useSongStore()
const authStore = useAuthStore()
const route = useRoute();
const router = useRouter();

const form = ref({
    title: '',
    album_name: '',
    genre: '',
    artist_id: route.params.artist_id, // Get artist_id from the URL params
});

const error = ref('');

const submitSong = async () => {
    try {
        const artistId = authStore.user?.artist?.id;

        if (!artistId) {
            error.value = 'Artist ID not found.';
            return;
        }

        const song = await songStore.createSong(artistId, {
            ...form.value,
            artist_id: artistId
        });

        router.push({
            path: '/view-songs',
            query: { success: 'Song created successfully!' }
        })
    } catch (err) {
        error.value = songStore.error || 'An error occurred while creating the song.';
    }
};
</script>