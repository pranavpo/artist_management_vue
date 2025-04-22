<template>
    <div class="w-60 bg-gray-900 text-white flex flex-col min-h-screen shadow-lg">
        <ul class="flex-1 p-4 space-y-2 overflow-y-auto">
            <li v-for="item in menuitems" :key="item.name">
                <router-link :to="item.route"
                    class="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-700 transition duration-150">
                    <span class="w-5 h-5 bg-gray-600 rounded-full flex items-center justify-center text-xs">🔹</span>
                    <span class="font-medium">{{ item.name }}</span>
                </router-link>
            </li>
        </ul>
        <div class="p-4 border-t border-gray-700">
            <button @click="logout"
                class="w-full bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg font-semibold transition duration-150">
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
        const artistId = authStore.artistId
        return sidebarItems.artist(artistId)
    }
    return sidebarItems[role] || []
})

function logout() {
    authStore.logout()
}
</script>