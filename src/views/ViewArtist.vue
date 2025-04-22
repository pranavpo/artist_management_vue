<template>
    <div>
        <div class="flex justify-between items-center mb-6 w-full">

            <h2 class="text-2xl font-bold whitespace-nowrap">Artists</h2>

            <div v-if="isUploading"
                class="text-gray-700 text-sm font-medium text-center w-full absolute left-1/2 transform -translate-x-1/2">
                File is being uploaded...
            </div>

            <div class="flex gap-2 ml-auto">
                <button v-if="canUploadDownload" @click="downloadArtists"
                    class="bg-indigo-500 text-white px-4 py-2 rounded hover:bg-indigo-600">
                    Download Artists
                </button>
                <button v-if="canUploadDownload" @click="triggerUpload"
                    class="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600">
                    Upload Artists
                </button>
                <input ref="fileInputRef" type="file" accept=".csv" class="hidden" @change="uploadCSV" />
            </div>
        </div>

        <!-- <div class="flex gap-2">

        </div> -->

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
                                @click="artist.user && goToSongs(artist.id)">
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

        <pagination-component v-if="artists.length > 0" :current-page="pagination.currentPage"
            :total-pages="pagination.totalPages" @page-change="handlePageChange" />
    </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useUserStore } from '@/stores/user'
import { useRoute, useRouter } from 'vue-router'
import { useToast } from 'vue-toast-notification'
import { useAuthStore } from '@/stores/auth'
import Swal from 'sweetalert2'
import PaginationComponent from '@/components/PaginationComponent.vue'
import { api } from '@/services/api'

const userStore = useUserStore()
const route = useRoute()
const toast = useToast()
const authStore = useAuthStore()
const router = useRouter()
const currentPage = ref(1)

onMounted(async () => {
    const page = parseInt(route.query.page) || 1
    currentPage.value = page

    await userStore.fetchArtists(page)

    const successMessage = route.query.success
    if (successMessage) {
        toast.open({
            message: successMessage,
            type: 'success',
            duration: 3000,
            position: 'top-right',
        })
    }

    router.replace({
        query: {
            ...route.query,
            success: undefined,
            page: page
        }
    })
})

const artists = computed(() => userStore.artists)
const pagination = computed(() => userStore.pagination.artists)

const handlePageChange = async (page) => {
    currentPage.value = page
    await userStore.fetchArtists(page)
    router.replace({
        query: {
            ...route.query,
            page: page
        }
    })
    window.scrollTo(0, 0)
}

const editArtist = (user) => {
    const currentPage = route.query.page || 1
    router.push({ name: 'EditUser', params: { id: user.id }, query: { page: currentPage } })
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
        await userStore.fetchArtists(currentPage.value)
        toast.success('User deleted successfully', { position: 'top-right' })
    }
}

const downloadArtists = async () => {
    if (!canUploadDownload.value) {
        toast.error('Access denied')
        return
    }

    try {
        const response = await api.get('/artists/download', {
            responseType: 'blob'
        })

        const blob = new Blob([response.data], { type: 'text/csv' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = 'artists.csv'
        a.click()
        URL.revokeObjectURL(url)
    } catch (err) {
        toast.error('Download failed')
        console.error(err)
    }
}

const fileInputRef = ref(null)
const isUploading = ref(false)

const triggerUpload = () => {
    if (!canUploadDownload.value) {
        toast.error('Access denied')
        return
    }
    fileInputRef.value.click()
}

const uploadCSV = async (event) => {
    const file = event.target.files[0]
    if (!file) return

    const formData = new FormData()
    formData.append('file', file)

    isUploading.value = true

    try {
        const response = await api.post('/artists/upload', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        })
        const message = response.data.message || 'Upload successful'
        toast.open({
            message: message,
            type: 'success',
            duration: 3000,
            position: 'top-right',
        })
        await userStore.fetchArtists(currentPage.value)
    } catch (err) {
        const errorMsg = err.response?.data?.error || 'Upload failed'
        toast.error(errorMsg)
        console.error(err)
    } finally {
        isUploading.value = false
    }
}

const canUploadDownload = computed(() => {
    const role = authStore.user?.role
    return role === 'super_admin' || role === 'artist_manager'
})
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