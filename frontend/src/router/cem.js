export default [
    { path: '/tipo-proyecto-cem', 
      component: () => import('@/components/cem/TipoProyectoCem.vue'), 
      meta: { requiresAuth: true } },
    
    { path: '/proyecto-cem', 
      component: () => import('@/components/cem/ProyectoCem.vue'), 
      meta: { requiresAuth: true } },    

  ];