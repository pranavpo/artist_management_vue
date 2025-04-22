<template>
    <div class="min-h-screen flex items-center justify-center bg-gray-100">
        <div class="w-full max-w-sm bg-white p-6 rounded-lg shadow">
            <h2 class="text-2xl font-bold text-center text-gray-800 mb-6">Login</h2>

            <form @submit.prevent="handleLogin" class="space-y-4">
                <div>
                    <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
                    <input id="email" type="email" v-model="email" required
                        class="mt-1 w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-500 focus:border-blue-500"
                        placeholder="you@example.com" />
                </div>

                <div>
                    <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
                    <input id="password" type="password" v-model="password" required
                        class="mt-1 w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-500 focus:border-blue-500"
                        placeholder="••••••••" />
                </div>

                <button type="submit" :disabled="authStore.loading"
                    class="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition duration-150">
                    <span v-if="authStore.loading">Signing in...</span>
                    <span v-else>Sign In</span>
                </button>

                <p v-if="authStore.error" class="text-sm text-red-600 text-center mt-2">
                    {{ authStore.error }}
                </p>
            </form>

            <p class="text-sm text-center mt-4">
                Don't have an account?
                <router-link to="/register-artist" class="text-blue-600 hover:underline">
                    Register as Artist
                </router-link>
            </p>
        </div>
    </div>
</template>


<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRoute, useRouter } from 'vue-router'
import { useToast } from 'vue-toast-notification'

const authStore = useAuthStore()
const email = ref('')
const password = ref('')
const route = useRoute()
const router = useRouter()
const toast = useToast()
// console.log(email)

onMounted(() => {
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
            success: undefined,
        } 
    })
})

const handleLogin = async () => {
    await authStore.login({
        email: email.value,
        password: password.value
    })
}
</script>