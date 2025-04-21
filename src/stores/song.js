import { defineStore } from 'pinia'
import { api } from '@/services/api'

export const useSongStore = defineStore('song', {
    state: () => ({
        songs: [],
        loading: false,
        error: null,
        pagination: {
            currentPage: 1,
            totalPages: 1,
            totalItems: 0
        }
    }),

    actions: {
        async createSong(artistId, songData) {
            this.loading = true
            this.error = null
            try {
                const response = await api.post(`/artists/${artistId}/songs`, songData)
                this.songs.push(response.data)
                return response.data
            } catch (err) {
                this.error = err.response?.data?.error || 'Error creating song'
                throw err
            } finally {
                this.loading = false
            }
        },

        async fetchSongsByArtist(artistId, page=1) {
            // console.log("HERE")
            // console.log(artistId)
            this.loading = true
            this.error = null
            this.songs = []
            try {
                console.log("Making api request")
                const response = await api.get(`/artists/${artistId}/songs`, {
                    params: { page }
                });
                console.log(response)
                this.songs = response.data.songs
                this.pagination = {
                    currentPage: response.data.meta.current_page,
                    totalPages: response.data.meta.total_pages,
                    totalItems: response.data.meta.total_count
                }
            } catch (err) {
                this.error = err.response?.data?.error || 'Error fetching songs'
            } finally {
                this.loading = false
            }
        },

        async deleteSong(songId) {
            this.loading = true
            this.error = null
            try {
                await api.delete(`/songs/${songId}`)
                this.songs = this.songs.filter(song => song.id !== songId)
                return true
            } catch (err) {
                this.error = err.response?.data?.error
                throw err
            } finally {
                this.loading = false
            }
        },

        async getSongById(songId) {
            this.loading = true
            this.error = null
            try {
                const response = await api.get(`/songs/${songId}`)
                return response.data
            } catch (err) {
                this.error = err.response?.data?.error || 'Error fetching song'
                throw err
            } finally {
                this.loading = false
            }
        },

        async updateSong(songId, updatedData){
            this.loading = true
            this.error = null
            try{
                const response = await api.put(`/songs/${songId}`, updatedData)
                const index = this.songs.findIndex(song => song.id === songId)
                if (index !== -1) this.songs[index] = response.data
                return response.data
            }catch (err){
                this.error = err.response?.data?.error || "Error Updating Song"
                throw err
            }finally{
                this.loading = false
            }
        }
    }
})
