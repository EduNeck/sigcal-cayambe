<template>
  <v-window v-model="window" show-arrows>
    <!-- Botón anterior -->
    <template #prev="{ props }">
      <v-btn v-bind="props" icon>
        <v-icon color="red">mdi-chevron-left</v-icon>
      </v-btn>
    </template>

    <!-- Botón siguiente con tooltip "Nuevos Registros" solo cuando está en listado-tenencia -->
    <template #next="{ props }">
      <v-tooltip v-if="window === 'listado-tenencia'" text="Nuevos Registros" location="top">
        <template #activator="{ props: tooltipProps }">
          <v-btn
            v-bind="{ ...props, ...tooltipProps }"
            icon
          >
            <v-icon color="red">mdi-chevron-right</v-icon>
          </v-btn>
        </template>
      </v-tooltip>
      <v-btn
        v-else
        v-bind="props"
        icon
      >
        <v-icon color="red">mdi-chevron-right</v-icon>
      </v-btn>
    </template>

    <!-- Contenido -->
    <v-window-item value="listado-tenencia">
      <TabListadoTenencia @navigateToTenencia="navigateToTenencia" />
    </v-window-item>
    <v-window-item :key="tabRegistrosKey" value="tab-registros">
      <TabRegistros />
    </v-window-item>    
    <v-window-item :key="tabTenenciaKey" value="tab-tenencia">
      <TabTenencia />
    </v-window-item>
  </v-window>
</template>

<script>
import TabListadoTenencia from './ListadoTenencia.vue';
import TabTenencia from './FormTenencia.vue';
import TabRegistros from './GridTenencia.vue';
import { mapGetters } from 'vuex';

export default {
  name: 'VentanaTenencia',
  data() {
    return {
      window: 'listado-tenencia',
      tabTenenciaKey: 0,
      tabRegistrosKey: 0,
    };
  },
  components: {
    TabListadoTenencia,
    TabTenencia,
    TabRegistros,
  },
  computed: {
    ...mapGetters(['getIdPredio']),
  },
  methods: {
    toggleTabTenencia() {
      this.window = this.window === 'listado-tenencia' ? 'tab-registros' : 'tab-tenencia';
    },
    navigateToTenencia() {
      this.tabTenenciaKey += 1;
      this.window = 'tab-tenencia';
    },
    navigateToRegistrosMultiples() {
      this.tabRegistrosKey += 1;
      this.window = 'tab-registros';      
    },
  },
};
</script>

<style scoped>
.v-window__controls .v-btn .v-icon {
  color: white !important;
  background: linear-gradient(145deg, #ff5722, #ff9800);
  border-radius: 50%;
  width: 42px;
  height: 42px;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.3);
  font-size: 24px;
  transition: transform 0.2s ease, background-color 0.2s ease;
}

.v-window__controls .v-btn:hover .v-icon {
  transform: scale(1.1);
  background-color: #e53935;
}
</style>
