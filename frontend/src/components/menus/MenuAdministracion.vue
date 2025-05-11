<template>
  <v-app>
    <!-- Barra superior -->
    <v-app-bar color="primary" dark elevation="2" class="justify-center" prominent>
      <v-app-bar-title class="text-center text-uppercase">ADMINISTRACIÓN</v-app-bar-title>
    </v-app-bar>

    <!-- Espaciado para evitar que la barra tape el contenido -->
    <div style="height: 64px;"></div>

    <!-- Menú principal -->
    <v-main>
      <div class="d-flex justify-center align-center flex-wrap gap-3">
        <!-- Seguridad -->
        <v-menu>
          <template v-slot:activator="{ props }">
            <v-btn
              append-icon="mdi-shield-account"
              variant="tonal"
              color="primary"
              v-bind="props"
              class="custom-list-item"
            >
              Seguridad
            </v-btn>
          </template>
          <v-list>
            <v-list-item
              v-for="(item, index) in items_seg"
              :key="index"
              @click="navigateTo(item.route)"
            >
              <v-list-item-title>{{ item.title }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>

        <!-- Catálogo -->
        <v-menu>
          <template v-slot:activator="{ props }">
            <v-btn
              append-icon="mdi-book-open"
              variant="tonal"
              color="primary"
              v-bind="props"
              class="custom-list-item"
            >
              Catálogo
            </v-btn>
          </template>
          <v-list>
            <v-list-item title="En desarrollo"></v-list-item>
          </v-list>
        </v-menu>

        <!-- Auditoría -->
        <v-menu>
          <template v-slot:activator="{ props }">
            <v-btn
              append-icon="mdi-file-chart"
              variant="tonal"
              color="primary"
              v-bind="props"
              class="custom-list-item"
            >
              Auditoría
            </v-btn>
          </template>
          <v-list>
            <v-list-item title="En desarrollo"></v-list-item>
          </v-list>
        </v-menu>

        <!-- Salir -->
        <v-btn
          append-icon="mdi-exit-to-app"
          variant="tonal"
          class="salir-btn custom-list-item"
          @click="$router.push('/menu-ingreso')"
        >
          SALIR
        </v-btn>
      </div>
    </v-main>
  </v-app>
</template>

<script>
export default {
  name: 'MenuAdministracion',
  data() {
    return {
      items_seg: [
        { title: 'Ingreso Usuarios', route: '/ingreso-usuarios' },
        { title: 'Listado Usuarios', route: '/listado-usuarios' },
        { title: 'Gestion de Roles', route: '/gestion-roles' },
      ]
    };
  },
  methods: {
    navigateTo(route) {
      this.$router.push(route);
    }
  }
};
</script>

<style scoped>
.custom-list-item {
  margin: 0.5rem;
  min-width: 180px;
  text-transform: uppercase;
  font-weight: 500;
  letter-spacing: 1px;
}

.salir-btn {
  background-color: #922b21 !important;
  color: white !important;
}

.salir-btn:hover {
  background-color: #7b1e17 !important;
}
</style>
