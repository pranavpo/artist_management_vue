<template>
    <div class="max-w-md mx-auto mt-10 bg-white shadow-md rounded-lg p-6">
        <h2 class="text-2xl font-bold mb-6 text-center text-gray-800">Edit User</h2>

        <form @submit.prevent="updateUser" class="space-y-4" v-if="form">
            <!-- Name Fields -->
            <div class="grid grid-cols-2 gap-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                    <input type="text" v-model="form.first_name"
                        class="w-full border px-3 py-2 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
                        required />
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                    <input type="text" v-model="form.last_name"
                        class="w-full border px-3 py-2 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
                        required />
                </div>
            </div>

            <!-- Email & Phone -->
            <div class="grid grid-cols-2 gap-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input type="email" v-model="form.email"
                        class="w-full border px-3 py-2 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
                        required />
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                    <input type="tel" v-model="form.phone"
                        class="w-full border px-3 py-2 rounded-md focus:outline-none focus:ring focus:ring-blue-500" />
                </div>
            </div>

            <!-- DOB & Gender -->
            <div class="grid grid-cols-2 gap-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                    <input type="date" v-model="form.dob"
                        class="w-full border px-3 py-2 rounded-md focus:outline-none focus:ring focus:ring-blue-500" />
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                    <select v-model="form.gender"
                        class="w-full border px-3 py-2 rounded-md focus:outline-none focus:ring focus:ring-blue-500">
                        <option value="m">Male</option>
                        <option value="f">Female</option>
                        <option value="o">Other</option>
                    </select>
                </div>
            </div>

            <!-- Address -->
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Address</label>
                <input type="text" v-model="form.address"
                    class="w-full border px-3 py-2 rounded-md focus:outline-none focus:ring focus:ring-blue-500" />
            </div>

            <!-- Role -->
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Role</label>
                <select v-model="form.role"
                    class="w-full border px-3 py-2 rounded-md focus:outline-none focus:ring focus:ring-blue-500 bg-white disabled:bg-gray-100 disabled:cursor-not-allowed"
                    :disabled="isArtistManager">
                    <option value="super_admin">Super Admin</option>
                    <option value="artist_manager">Artist Manager</option>
                    <option value="artist">Artist</option>
                </select>
            </div>

            <div v-if="form.role === 'artist'" class="grid grid-cols-2 gap-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">First Released Year</label>
                    <input type="number" v-model="form.first_released_year"
                        class="w-full border px-3 py-2 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
                        placeholder="2000" required />
                </div>

                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Albums Released</label>
                    <input type="number" v-model="form.number_of_albums_released"
                        class="w-full border px-3 py-2 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
                        placeholder="5" required />
                </div>
            </div>

            <button type="submit"
                class="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-150">
                Update User
            </button>
        </form>

        <p v-if="error" class="text-center text-red-600 mt-4">{{ error }}</p>
    </div>
</template>

<script setup>
import { ref, onMounted, reactive, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { api } from '@/services/api'

const route = useRoute()
const router = useRouter()
const userId = route.params.id
const user = ref(null)
const form = ref(null)
const error = ref(null)
const authStore = useAuthStore()

const isArtistManager = computed(() => authStore.userRole === 'artist_manager')
const isSuperAdmin = computed(() => authStore.userRole === 'super_admin')

onMounted(async () => {
    try {
        const response = await api.get(`/users/${userId}`)
        user.value = response.data
        form.value = {
            first_name: user.value.user.first_name,
            last_name: user.value.user.last_name,
            email: user.value.user.email,
            phone: user.value.user.phone || '',
            dob: user.value.user.dob || '',
            gender: user.value.user.gender || '',
            address: user.value.user.address || '',
            role: user.value.user.role,
            first_released_year: user.value.artist?.first_released_year || null,
            number_of_albums_released: user.value.artist?.number_of_albums_released || null
        }
    } catch (err) {
        error.value = "Failed to load user data."
        console.error(err)
    }
})

const updateUser = async () => {
    try {
        const payload = { ...form.value }

        if (form.value.role !== 'artist') {
            delete payload.first_released_year
            delete payload.number_of_albums_released
        }
        const currentPage = route.query.page || 1
        await api.put(`/users/${userId}`, payload)
        router.push({
            path: form.value.role === 'artist' ? '/view-artists' : '/view-artist-managers',
            query: { 
                success: `${form.value.role.replace('_', ' ')} updated successfully!`,
                page: currentPage
            }
        })
    } catch (err) {
        let errorMessages = [];
        for (const field in err.response.data) {
            if (err.response.data.hasOwnProperty(field)) {
                errorMessages.push(...err.response.data[field]);
            }
        }
        error.value = errorMessages.join('\n');
    }
}
</script>