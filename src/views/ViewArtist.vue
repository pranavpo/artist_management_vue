<template>
    <div>
        <h2 class="text-2xl font-bold mb-6">Artists</h2>

        <div class="overflow-x-auto">
            <table class="min-w-full bg-white shadow rounded-lg table-auto">
                <thead class="bg-gray-100 text-left">
                    <tr>
                        <th class="px-4 py-3">First Name</th>
                        <th class="px-4 py-3">Last Name</th>
                        <th class="px-4 py-3">Email</th>
                        <th class="px-4 py-3">Address</th>
                        <th class="px-4 py-3">Gender</th>
                        <th class="px-4 py-3">Phone</th>
                        <th class="px-4 py-3">DOB</th>
                        <th class="px-4 py-3">First Release Year</th>
                        <th class="px-4 py-3">Number Of Albums Released</th>
                        <th class="px-4 py-3">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="artist in artists" :key="artist.user?.id || artist.id" class="border-t">
                        <td class="px-4 py-4 whitespace-normal break-words max-w-[150px]">
                            {{ artist.user?.first_name || 'N/A' }}
                        </td>
                        <td class="px-4 py-4 whitespace-normal break-words max-w-[150px]">
                            {{ artist.user?.last_name || 'N/A' }}
                        </td>
                        <td class="px-4 py-4 whitespace-normal break-words max-w-[150px]">
                            {{ artist.user?.email || 'N/A' }}
                        </td>
                        <td class="px-4 py-4 whitespace-normal break-words max-w-[150px]">
                            {{ artist.user?.address || 'N/A' }}
                        </td>
                        <td class="px-4 py-4 whitespace-normal break-words max-w-[150px] capitalize">
                            {{ artist.user?.gender || 'N/A' }}
                        </td>
                        <td class="px-4 py-4 whitespace-normal break-words max-w-[150px]">
                            {{ artist.user?.phone || 'N/A' }}
                        </td>
                        <td class="px-4 py-4 whitespace-normal break-words max-w-[150px]">
                            {{ artist.user?.dob || 'N/A' }}
                        </td>
                        <td class="px-4 py-4 whitespace-normal break-words max-w-[150px]">
                            {{ artist.first_released_year || 'N/A' }}
                        </td>
                        <td class="px-4 py-4 whitespace-normal break-words max-w-[150px]">
                            {{ artist.number_of_albums_released || 'N/A' }}
                        </td>
                        <td class="px-4 py-4 flex gap-2">
                            <button class="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                                @click="artist.user && editArtist(artist.user)">
                                Edit
                            </button>
                            <button class="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                                @click="artist.user && deleteArtist(artist.user.id)">
                                Delete
                            </button>
                            <button class="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                                @click="artist.user && goToSongs(artist.user.id)">
                                Songs
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <p v-if="artists.length === 0" class="text-gray-500 mt-4 text-center">
            No artists found.
        </p>
    </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useUserStore } from '@/stores/user'
import { useRoute, useRouter } from 'vue-router'
import { useToast } from 'vue-toast-notification'
import { useAuthStore } from '@/stores/auth'
import Swal from 'sweetalert2'

const userStore = useUserStore()
const route = useRoute()
const toast = useToast()
const authStore = useAuthStore()
const router = useRouter()

onMounted(async () => {
    await userStore.fetchArtists()

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

const artists = computed(() => userStore.artists)

const editArtist = (user) => {
    router.push({ name: 'EditUser', params: { id: user.id } })
}

const goToSongs = (artistId) => {
    router.push({ name: 'ViewSongs', params: { id: artistId } })
}

const deleteArtist = async (id) => {
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
        await userStore.deleteUser(id)
        await userStore.fetchArtists()
        toast.success('User deleted successfully', { position: 'top-right' })
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