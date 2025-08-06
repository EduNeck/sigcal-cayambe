// router/administracion.js
export default [
  {
    path: '/catalogo-barrios-vias',
    name: 'CatalogoBarriosVias',
    component: () => import('@/components/admin/CatalogoBarriosVias.vue'),
    meta: { 
      requiresAuth: true,
      title: 'Catálogo Barrios y Vías'
    }
  }
];
