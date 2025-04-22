import { createRouter, createWebHistory } from 'vue-router'
import Login from '../views/Login.vue'
import { useAuthStore } from '@/stores/auth'
import CreateUser from '../views/CreateUser.vue'
import ViewArtistManager from '../views/ViewArtistManager.vue'
import ViewArtist from '../views/ViewArtist.vue'
import CreateSong from '../views/CreateSong.vue'
import EditUser from '../views/EditUser.vue'
// import { createServerModuleRunner } from 'vite'
import Dashboard from '../views/Dashboard.vue'
import ViewSongs from '../views/ViewSongs.vue'
import EditSong from '../views/EditSong.vue'
import RegisterArtist from '../views/RegisterArtist.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Login',
      component: Login
    },
    {
      path: '/register-artist',
      name: 'RegisterArtist',
      component: RegisterArtist
    },
    {
      path: '/dashboard',
      component: Dashboard,
      meta: { requiresAuth: true },
      redirect: to => {
        const authStore = useAuthStore()
        // Redirect based on role
        if (authStore.isArtist) return '/create-song'
        if (authStore.isSuperAdmin || authStore.isArtistManager) return '/create-user'
        return '/create-user'
      },
      children: [
        {
          path: '/create-user',
          name: 'CreateUser',
          component: CreateUser,
          meta: { requiresAuth: true, roles: ['super_admin', 'artist_manager'] }
        },
        {
          path: '/view-artist-managers',
          name: 'ViewArtistManagers',
          component: ViewArtistManager,
          meta: { requiresAuth: true, roles: ['super_admin'] }
        },
        {
          path: '/view-artists',
          name: 'ViewArtists',
          component: ViewArtist,
          meta: { requiresAuth: true, roles: ['super_admin', 'artist_manager'] }
        },
        {
          path: '/edit-user/:id',
          name: 'EditUser',
          component: EditUser,
          meta: { requiresAuth: true, roles: ['super_admin', 'artist_manager'] }
        },
        {
          path: '/create-song',
          name: 'CreateSong',
          component: CreateSong,
          meta: { requiresAuth: true, roles: ['artist'] }
        },
        {
          path: '/artists/:id/view-songs',
          name: 'ViewSongs',
          component: ViewSongs,
          meta: { requiresAuth: true, roles: ['super_admin', 'artist_manager', 'artist'] }
        },
        {
          path: '/edit-song/:id',
          name: 'EditSong',
          component: EditSong,
          meta: { requiresAuth: true, roles: ['artist'] }
        }
      ]
    }
  ],
})

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()

  if (authStore.token && !authStore.user) {
    await authStore.fetchCurrentUser()
  }

  const isLoggedIn = !!authStore.token

  if (to.meta.requiresAuth && !isLoggedIn) {
    return next('/')
  }

  if (to.meta.roles && !to.meta.roles.includes(authStore.userRole)) {
    return next('/dashboard')
  }

  if (to.path === '/' && isLoggedIn) {
    return next('/dashboard')
  }

  next()
})

export default router
