<template>
    <div>
        <h2 class="text-2xl font-bold mb-6">Artist Managers</h2>

        <div class="overflow-x-auto">
            <table class="min-w-full bg-white shadow rounded-lg">
                <thead class="bg-gray-100 text-left">
                    <tr>
                        <th class="px-6 py-3">First Name</th>
                        <th class="px-6 py-3">Last Name</th>
                        <th class="px-6 py-3">Email</th>
                        <th class="px-6 py-3">Address</th>
                        <th class="px-6 py-3">Gender</th>
                        <th class="px-6 py-3">Phone</th>
                        <th class="px-6 py-3">DOB</th>
                        <th class="px-6 py-3">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="user in artistManagers" :key="user.id" class="border-t">
                        <td class="px-6 py-4">{{ user.first_name }}</td>
                        <td class="px-6 py-4">{{ user.last_name }}</td>
                        <td class="px-6 py-4">{{ user.email }}</td>
                        <td class="px-6 py-4">{{ user.address }}</td>
                        <td class="px-6 py-4 capitalize">{{ user.gender }}</td>
                        <td class="px-6 py-4">{{ user.phone }}</td>
                        <td class = "px-6 py-4">{{ user.dob }}</td>
                        <td class="px-6 py-4 flex gap-2">
                            <button class="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                                @click="editArtistManager(user)">
                                Edit
                            </button>
                            <button class="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                                @click="deleteUser(user.id)">
                                Delete
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <p v-if="artistManagers.length === 0" class="text-gray-500 mt-4 text-center">No artist managers found.</p>
    </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useUserStore } from '@/stores/user'
import { useRoute, useRouter } from 'vue-router'
import { useToast } from 'vue-toast-notification'
import Swal from 'sweetalert2'

const userStore = useUserStore()
const route = useRoute()
const toast = useToast()
const router = useRouter()

onMounted(async () => {
    await userStore.fetchArtistManagers()

    const successMessage = route.query.success
    if (successMessage) {
        toast.open({
            message: successMessage,
            type: 'success',
            duration: 3000,
            position: 'top-right',
        })
    }
    router.replace({query: {...route.query, success:undefined}})
})

const artistManagers = computed(() => userStore.artistManagers)

const editArtistManager = (user) => {
    // Redirect to edit page or show modal
    // console.log(user)
    router.push({ name: 'EditUser', params: { id: user.id } })
}

const deleteUser = async (id) => {
    const result = await Swal.fire({
        title: 'Are you sure?',
        text: "This action cannot be undone!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Yes, delete it!'
    })

    if (result.isConfirmed) {
        await userStore.deleteUser(id)
        await userStore.fetchArtistManagers()
        toast.success('User deleted successfully', { position: 'top-right' })
    }
}
</script>
