import { defineStore } from 'pinia'
import { api } from '@/services/api'

export const useUserStore = defineStore('user', {
    state: () => ({
        users: [],
        artistManagers: [],
        artists: [],
        loading: false,
        error: null,
        pagination: {
            artists: {
                currentPage: 1,
                totalPages: 1,
                totalItems: 0
            },
            artistManagers: {
                currentPage: 1,
                totalPages: 1,
                totalItems: 0
            }
        }
    }),
    actions: {
        async createUser(userData) {
            this.loading = true
            try {
                const response = await api.post('/users', userData)
                if (userData.role === 'artist_manager') {
                    this.artistManagers.push(response.data.user)
                } else if (userData.role === 'artist') {
                    this.artists.push(response.data.user)
                }
            } catch (error) {
                this.error = error.response?.data?.error || "Failed to create user"
                console.error('Error creating user: ', error)
                throw error
            } finally {
                this.loading = false
            }
        },

        async fetchArtistManagers(page = 1) {
            this.loading = true
            try {
                const response = await api.get('/artist-managers', {
                    params: { page }
                })
                this.artistManagers = response.data.artist_managers
                this.pagination.artistManagers = {
                    currentPage: response.data.meta.current_page,
                    totalPages: response.data.meta.total_pages,
                    totalItems: response.data.meta.total_count
                }
            } catch (error) {
                this.error = error.response?.data?.error || 'Error fetching artist managers'
            } finally {
                this.loading = false
            }
        },

        async fetchArtists(page = 1) {
            this.loading = true
            try {
                const response = await api.get('/artists', {
                    params: { page }
                })
                this.artists = response.data.artists
                this.pagination.artists = {
                    currentPage: response.data.meta.current_page,
                    totalPages: response.data.meta.total_pages,
                    totalItems: response.data.meta.total_count
                }
            } catch (error) {
                this.error = error.response?.data?.error || 'Error fetching artists'
            } finally {
                this.loading = false
            }
        },

        async deleteUser(id) {
            this.loading = true
            try {
                await api.delete(`/users/${id}`)
            } catch (error) {
                this.error = error.response?.data?.error || 'Error deleting user'
                throw error
            } finally {
                this.loading = false
            }
        }
    }
})