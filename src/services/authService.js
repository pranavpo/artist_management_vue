import { api } from './api'

export const authService = {
    async login(credentials) {
        const response = await api.post('/login', credentials)
        console.log(response.data)
        return response.data
    },

    async getUser(userId) {
        try {
            const response = await api.get(`/users/${userId}`)
            return response.data
        }catch(error){
            console.error("Error in getUser: ",error)
            throw error
        }
        
    }
}