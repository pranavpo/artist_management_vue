<template>
  <div class="max-w-md mx-auto mt-10 bg-white shadow-md rounded-lg p-6">
    <h2 class="text-2xl font-bold mb-6 text-center text-gray-800">Create User</h2>
    <form @submit.prevent="submitUser" class="space-y-4">

      <!-- Name Fields -->
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">First Name</label>
          <input type="text" v-model="form.first_name"
            class="w-full border px-3 py-2 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
            placeholder="John" required />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
          <input type="text" v-model="form.last_name"
            class="w-full border px-3 py-2 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
            placeholder="Doe" required />
        </div>
      </div>

      <!-- Email & Phone -->
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input type="email" v-model="form.email"
            class="w-full border px-3 py-2 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
            placeholder="john@example.com" required />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Phone</label>
          <input type="tel" v-model="form.phone"
            class="w-full border px-3 py-2 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
            placeholder="1234567890" />
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
          class="w-full border px-3 py-2 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
          placeholder="123 Main St" />
      </div>

      <!-- Password & Role -->
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <input type="password" v-model="form.password"
            class="w-full border px-3 py-2 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
            placeholder="Enter password" required />
        </div>

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
      </div>

      <!-- Artist-specific Fields -->
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
            class="w-full border px-3 py-2 rounded-md focus:outline-none focus:ring focus:ring-blue-500" placeholder="5"
            required />
        </div>
      </div>

      <button type="submit"
        class="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-150">
        Create User
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

const isArtistManager = computed(() => authStore.userRole === 'artist_manager')
const isSuperAdmin = computed(() => authStore.userRole === 'super_admin')
const canCreateArtist = computed(() => isSuperAdmin.value || isArtistManager.value)

const submitUser = async () => {
  error.value = ''

  try {
    const userData = {
      ...form
    }

    if (form.role === 'artist') {
      if (!form.first_released_year || !form.number_of_albums_released) {
        error.value = 'First released year and number of albums released are required for artists.'
        return
      }
    } else {
      delete userData.first_released_year
      delete userData.number_of_albums_released
    }

    await userStore.createUser(userData)
    if (userData.role === 'artist_manager') {
      router.push({
        path: '/view-artist-managers',
        query: { success: 'Artist Manager created successfully!' }
      })
    } else if (userData.role === 'artist') {
      router.push({
        path: '/view-artists',
        query: { success: 'Artist created successfully!' }
      })
    }
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
