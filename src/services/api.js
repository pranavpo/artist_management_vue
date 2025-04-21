import axios from 'axios'
import { useAuthStore } from '@/stores/auth'

export const api = axios.create({
    baseURL: "http://127.0.0.1:3000",
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    }
})

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token')
        if(token){
            config.headers['Authorization'] = `Bearer ${token}`
        }
        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)

api.interceptors.response.use(
    (response) => {
        return response
    },
    (error) => {
        if(error.response && error.response.status === 401){
            const authStore = useAuthStore()
            authStore.handle404Error()
        }
        return Promise.reject(error)
    }
)