import { createWebHistory, createRouter } from 'vue-router'
import { routes } from 'vue-router/auto-routes'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    // Si on revient en arrière (bouton retour), restaure la position
    if (savedPosition) {
      return savedPosition
    }
    // Sinon (navigation normale), on remonte en haut
    return { top: 0 }
  }
})

export default router
