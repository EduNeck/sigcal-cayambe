export default [
    { path: '/ciudadano', 
      component: () => import('@/components/parametrizacion/CatastroCiudadano.vue'), 
      meta: { requiresAuth: true } },
    { path: '/listado-ciudadanos', 
      component: () => import('@/components/parametrizacion/ListadoCiudadano.vue'), 
      meta: { requiresAuth: true } },
    { path: '/busqueda-ciudadanos', 
      component: () => import('@/components/parametrizacion/BusquedaCiudadano.vue'), 
      meta: { requiresAuth: true } },    
    { path: '/catalogo-sistema',
      component: () => import('@/components/parametrizacion/CatalogoDominios.vue'), 
      meta: { requiresAuth: true } },
  ];
  