export default [

  { path: '/certificado-catastral', component: () => import('@/components/valoracion/CertificadoCatastral.vue'), meta: { requiresAuth: true } },
  { path: '/fito-corvini', component: () => import('@/components/valoracion/FitoCorvini.vue'), meta: { requiresAuth:  true } },
  { path: '/genera-certificado', component: () => import('@/components/valoracion/GeneraCertificado.vue'), meta: { requiresAuth: true } },
  { path: '/genera-valoracion', component: () => import('@/components/valoracion/GeneraValoracion.vue'), meta: { requiresAuth: true } },
  { path: '/valoracion-mejoras', component: () => import('@/components/valoracion/ValoracionMejoras.vue'), meta: { requiresAuth: true } },
  { path: '/valoracion-patrimonio', component: () => import('@/components/valoracion/ValoracionPatrimonio.vue'), meta: { requiresAuth: true  } },
  { path: '/valoracion-piso-factores', component: () => import('@/components/valoracion/ValoracionPisoFactores.vue'), meta: { requiresAuth: true } },
  { path: '/valoracion-resultados', component: () => import('@/components/valoracion/ValoracionResultados.vue'), meta: { requiresAuth: true } },
  { path: '/valoracion-suelo-factores', component: () => import('@/components/valoracion/ValoracionSueloFactores.vue'), meta: { requiresAuth: true } },    
  { path: '/valores-comerciales', component: () => import('@/components/valoracion/ValoresComercialesPeritaje.vue'), meta: { requiresAuth: true } },       
];

