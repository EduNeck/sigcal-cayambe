export default [
    { path: '/busquedaCertCatasUrb', component: () => import('@/components/reportes/BusquedaCertificadoCatastral.vue'), meta: { requiresAuth: true } },
    { path: '/busquedaCertCatasRur', component: () => import('@/components/reportes/BusquedaCertificadoCatastralRur.vue'), meta: { requiresAuth: true } },
    { path: '/busquedaCertPlusvalia', component: () => import('@/components/reportes/BusquedaCertificadoPlusvalia.vue'), meta: { requiresAuth: true } },
    { path: '/certificadoCatastralRur', component: () => import('@/components/reportes/CertificadoCatastralRur.vue'), meta: { requiresAuth: true } },
    { path: '/certificadoCatastral', component: () => import('@/components/reportes/CertificadoCatastralUrb.vue'), meta: { requiresAuth: true } },    
    { path: '/certificadoPlusvalia', component: () => import('@/components/reportes/CertificadoPlusvaliaUrb.vue'), meta: { requiresAuth: true } },
    { path: '/impresion-ficha', component: () => import('@/components/reportes/FichaPredialUrbana.vue'), meta: { requiresAuth: true } },
    { path: '/linderos-certificado', component: () => import('@/components/reportes/LinderosCertificado.vue'), meta: { requiresAuth: false } },
  ];
