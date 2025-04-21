import {defineStore} from 'pinia'
import {api} from '@/services/api'

export const useUserStore = defineStore('user',{
    state: () => ({
        users: [],
        artistManagers: [],
        artists: [],
        loading: false,
        error: null
    }),

    actions: {
        async createUser(userData) {
            this.loading = true
            try{
                const response = await api.post('/users',userData)

                if(userData.role === 'artist_manager'){
                    this.artistManagers.push(response.data.user)
                }else if(userData.role === 'artist'){
                    this.artists.push(response.data.user)
                }
            }catch (error){
                this.error = error.response?.data?.error || "Failed to create user"
                console.error('Error creating user: ',error)
                throw error
            }finally {
                this.loading = false
            }
        },

        async fetchArtistManagers(){
            this.loading = true
            try{
                const response = await api.get('/artist-managers')
                this.artistManagers = response.data
                // console.log(this.artistManagers)
            }catch(error){
                this.error = error.response?.data?.error || 'Error fetching artist managers'
            }finally{
                this.loading = false
            }
        },

        async fetchArtists(){
            this.loading = true
            try{
                const response = await api.get('/artists')
                this.artists = response.data
                console.log(this.artists)
            }catch(error){
                this.error = error.response?.data?.error || 'Error fetching artists'
            }finally{
                this.loading = false
            }
        },

        async deleteUser(id){
            this.loading = true
            try{
                const response = await api.delete(`/users/${id}`)
            }catch(error){
                this.error = error.response?.data?.error || 'Error deleting artists'
            }finally{
                this.loading = false
            }
        }
        
    }
})