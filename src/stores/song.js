import { defineStore } from 'pinia'
import { api } from '@/services/api'

export const useSongStore = defineStore('song', {
    state: () => ({
        songs: [],
        loading: false,
        error: null
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

        async fetchSongsByArtist(artistId) {
            this.loading = true
            this.error = null
            this.songs = []
            try {
                const response = await api.get(`/artists/${artistId}/songs`)
                this.songs = response.data
            } catch (err) {
                this.error = err.response?.data?.error || 'Error fetching songs'
            } finally {
                this.loading = false
            }
        },

        async deleteSong(songId){
            this.loading = true
            this.error = null
            try{
                await api.delete(`/songs/${songId}`)
                this.songs = this.songs.filter(song => song.id !== songId)
                return true
            }catch (err) {
                this.error = err.response?.data?.error
                throw err
            } finally {
                this.loading = false
            }
        }
    }
})
