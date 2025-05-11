export default [
    { path: '/visor-geo', component: () => import('@/components/visores/VisorGeo.vue'), meta: { requiresAuth: true } },
    { path: '/visor-geo-local', component: () => import('@/components/visores/VisorGeoLocal.vue'), meta: { requiresAuth: true } },
    { path: '/visor-geo-informacion', component: () => import('@/components/visores/VisorGeoInformacion.vue'), meta: { requiresAuth: true } },
];
