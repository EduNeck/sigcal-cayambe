export default [        
      // Validaciones
      { path: '/control-alicuotas-a', component: () => import('@/components/validaciones/AlicuotasA.vue'), meta: { requiresAuth: true } },
      { path: '/control-alicuotas-b', component: () => import('@/components/validaciones/AlicuotasB.vue'), meta: { requiresAuth: true } },
      { path: '/control-bloques-geoinvalidas', component: () => import('@/components/validaciones/BloquesGeoInvalidas.vue'), meta: { requiresAuth: true } },
      { path: '/control-bloques-nodigitados', component: () => import('@/components/validaciones/BloquesNoDigitados.vue'), meta: { requiresAuth: true } },
      { path: '/control-bloques-singeo', component: () => import('@/components/validaciones/BloquesSinGeo.vue'), meta: { requiresAuth: true } },
      { path: '/control-inconcistencia-alicuotas', component: () => import('@/components/validaciones/InconsistenciaAlicuotas.vue'), meta: { requiresAuth: true } },
      { path: '/control-ph-sinfm', component: () => import('@/components/validaciones/PrediosPhSInFichaM.vue'), meta: { requiresAuth: true } },
      { path: '/control-porcentaje-exedente', component: () => import('@/components/validaciones/PrediosPorcentajeExedente.vue'), meta: { requiresAuth: true } },
      { path: '/control-predios-sinfoto', component: () => import('@/components/validaciones/PrediosSinFoto.vue'), meta: { requiresAuth: true } },
      { path: '/control-predios-singeo', component: () => import('@/components/validaciones/PrediosSinGeo.vue'), meta: { requiresAuth: true } },
      { path: '/control-predios-sinservicios', component: () => import('@/components/validaciones/PrediosSinServicios.vue'), meta: { requiresAuth: true } },
      { path: '/control-predios-sintenencia', component: () => import('@/components/validaciones/PrediosSinTenencia.vue'), meta: { requiresAuth: true } },
      { path: '/control-predios-sinuso', component: () => import('@/components/validaciones/PrediosSinUso.vue'), meta: { requiresAuth: true } },
      { path: '/control-predios-sinvias', component: () => import('@/components/validaciones/PrediosSinVias.vue'), meta: { requiresAuth: true } },
      { path: '/control-predios-nodigitados', component: () => import('@/components/validaciones/PrediosNoDigitados.vue'), meta: { requiresAuth: true } },      
      { path: '/control-predios-geoinvalidas', component: () => import('@/components/validaciones/PrediosGeoInvalidas.vue'), meta: { requiresAuth: true } },      
      { path: '/control-predios-digitadosusuario', component: () => import('@/components/validaciones/PrediosDigitadosUsuario.vue'), meta: { requiresAuth: true } },

]