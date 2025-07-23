// router/geo.js
export default [
  {
    path: '/geo-linderos',
    name: 'GeoLinderos',
    component: () => import('@/components/geo/GeoLinderos.vue'),
    meta: { requiresAuth: true }
  }
];
