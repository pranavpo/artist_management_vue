<template>
    <div class="max-w-md mx-auto mt-10 bg-white shadow-md rounded-lg p-6">
        <h2 class="text-2xl font-bold mb-6 text-center text-gray-800">Register Artist</h2>
        <form @submit.prevent="submitArtist" class="space-y-4">

            <!-- Name -->
            <div class="grid grid-cols-2 gap-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                    <input v-model="form.first_name" type="text" placeholder="John"
                        class="w-full border px-3 py-2 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
                        required />
                </div>

                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                    <input v-model="form.last_name" type="text" placeholder="Doe"
                        class="w-full border px-3 py-2 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
                        required />
                </div>
            </div>

            <!-- Email & Phone -->
            <div class="grid grid-cols-2 gap-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input v-model="form.email" type="email" placeholder="john@example.com"
                        class="w-full border px-3 py-2 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
                        required />
                </div>

                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                    <input v-model="form.phone" type="tel" placeholder="1234567890"
                        class="w-full border px-3 py-2 rounded-md focus:outline-none focus:ring focus:ring-blue-500" />
                </div>
            </div>

            <!-- DOB & Gender -->
            <div class="grid grid-cols-2 gap-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                    <input v-model="form.dob" type="date"
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
                <input v-model="form.address" type="text" placeholder="123 Main St"
                    class="w-full border px-3 py-2 rounded-md focus:outline-none focus:ring focus:ring-blue-500" />
            </div>

            <!-- Password -->
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input v-model="form.password" type="password" placeholder="Enter password"
                    class="w-full border px-3 py-2 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
                    required />
            </div>

            <!-- Artist Fields -->
            <div class="grid grid-cols-2 gap-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">First Released Year</label>
                    <input v-model="form.first_released_year" type="number" placeholder="2000"
                        class="w-full border px-3 py-2 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
                        required />
                </div>

                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Albums Released</label>
                    <input v-model="form.number_of_albums_released" type="number" placeholder="5"
                        class="w-full border px-3 py-2 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
                        required />
                </div>
            </div>

            <button type="submit"
                class="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-150">
                Register
            </button>
        </form>

        <p v-if="error" class="text-center text-red-600 mt-4">{{ error }}</p>
    </div>
</template>

<script setup>
import { reactive, computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const authStore = useAuthStore()
const userStore = useUserStore()

const form = reactive({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    phone: '',
    dob: '',
    gender: 'm',
    address: '',
    role: 'artist',
    first_released_year: null,
    number_of_albums_released: null,
})

const error = ref('')

const submitArtist = async () => {
    error.value = ''

    try {
        const artistData = {
            ...form
        }

        if (!form.first_released_year || !form.number_of_albums_released) {
            error.value = 'First released year and number of albums released are required for artists.'
            return
        }

        await authStore.register(artistData)

        router.push({
            path: '/',
            query: { success: 'Artist registered successfully! Please log in.' }
        })

    } catch (err) {
        let errorMessages = []
        for (const field in err.response.data) {
            if (err.response.data.hasOwnProperty(field)) {
                errorMessages.push(...err.response.data[field])
            }
        }
        error.value = errorMessages.join('\n')
    }
}
</script>