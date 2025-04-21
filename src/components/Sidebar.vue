<template>
    <div class="w-48 bg-gray-800 text-white flex flex-col min-h-screen">
        <ul class="flex-1 p-4 overflow-y-auto">
            <li v-for="item in menuitems" :key="item.name" class="mb-2">
                <router-link :to="item.route" class="block p-2 hover:bg-gray-700 rounded">
                    {{ item.name }}
                </router-link>
            </li>
        </ul>

        <div class="p-4 border-t border-gray-700">
            <button @click="logout" class="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded text-left px-4">
                Logout
            </button>
        </div>
    </div>
</template>

<script setup>
import { sidebarItems } from '../constants/sidebarItems'
import { useAuthStore } from '@/stores/auth'
import { computed } from 'vue'

const authStore = useAuthStore()

const menuitems = computed(() => {
    const role = authStore.userRole
    if (role === 'artist') {
        const artistId = authStore.user?.id
        return sidebarItems.artist(artistId)
    }
    return sidebarItems[role] || []
})

function logout() {
    authStore.logout()
}
</script>

<style scoped>
/* No custom CSS needed with Tailwind */
</style>
