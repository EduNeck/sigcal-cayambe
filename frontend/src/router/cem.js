export default [
    { path: '/tipo-proyecto-cem', 
      component: () => import('@/components/cem/TipoProyectoCem.vue'), 
      meta: { requiresAuth: true } },
    
    { path: '/proyecto-cem', 
      component: () => import('@/components/cem/ProyectoCem.vue'), 
      meta: { requiresAuth: true } },

    { path: '/alcance-obra-cem',
      component: () => import('@/components/cem/AlcanceObraCem.vue'),
      meta: { requiresAuth: true } },

    { path: '/predios-proyecto-cem',
      component: () => import('@/components/cem/PrediosProyectoCem.vue'),
      meta: { requiresAuth: true } },

  ];