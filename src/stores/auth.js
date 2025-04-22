import { defineStore } from 'pinia'
import router from '@/router'
import { authService } from '@/services/authService'

export const useAuthStore = defineStore('auth', {
    state: () => ({
        user: null,
        token: localStorage.getItem('token') || null,
        loading: false,
        error: null
    }),

    getters: {
        isAuthenticated: (state) => !!state.token,
        userRole: (state) => state.user?.role || null,
        isSuperAdmin: (state) => state.user?.role === 'super_admin',
        isArtistManager: (state) => state.user?.role === 'artist_manager',
        isArtist: (state) => state.user?.role === "artist",
        artistId: (state) => state.user?.artist?.id || null // Add this getter
    },

    actions: {
        async login(credentials) {
            this.loading = true
            this.error = null

            try {
                const response = await authService.login(credentials)
                this.token = response.token
                localStorage.setItem('token', response.token)
                await this.fetchCurrentUser()

                if (this.user.role === 'super_admin' || this.user.role === 'artist_manager' || this.user.role === 'artist') {
                    router.push('/dashboard')
                }
            } catch (error) {
                this.token = null
                localStorage.removeItem('token')
                this.error = error.response?.data?.error || 'Login Failed'
                console.error('Login Error:', error)
            } finally {
                this.loading = false
            }
        },

        async fetchCurrentUser() {
            console.log("Fetching current user")
            try {
                if (!this.token) {
                    this.user = null
                    this.token = null
                    localStorage.removeItem('token')
                    return
                }

                const payload = JSON.parse(atob(this.token.split('.')[1]))
                const userId = payload.user_id
                const response = await authService.getUser(userId)
                this.user = response.user
                if (response.artist) {
                    this.user.artist = response.artist
                }
            } catch (error) {
                console.error('Error fetching current user:', error)
                this.logout(false)
            }
        },

        logout(redirect = true) {
            this.user = null
            this.token = null
            localStorage.removeItem('token')
            if (redirect) {
                router.push('/')
            }
        },

        handle404Error() {
            this.logout()
        },

        async register(userData) {
            this.loading = true
            this.error = null

            try {
                await authService.register(userData)
                router.push({
                    path: '/login',
                    query: { success: 'Registration successful! Please log in.' }
                })
            } catch (error) {
                this.error = error.response?.data?.error || 'Registration failed'
                throw error
            } finally {
                this.loading = false
            }
        }
    }
})
