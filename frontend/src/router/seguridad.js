export default [
    { path: '/ingreso-usuarios', component: () => import('@/components/seguridad/IngresoUsuario.vue'), meta: { requiresAuth: true } },
    { path: '/listado-usuarios', component: () => import('@/components/seguridad/ListadoUsuario.vue'), meta: { requiresAuth: true } },
    { path: '/gestion-roles', component: () => import('@/components/seguridad/GestionRoles.vue'), meta: { requiresAuth: true } },
  ];
