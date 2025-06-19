<template>
  <v-container>
    <v-tabs
      v-model="tab"
      :class="['custom-tab', colorClaseTabs]"
      centered
      grow
    >
      <v-tab>Identificación</v-tab>
      <v-tab>Legal</v-tab>
      <v-tab>Características</v-tab>
      <v-tab v-if="getTipoPredio === 2">Características Rurales</v-tab>
      <v-tab>Vías</v-tab>
      <v-tab>Bloques</v-tab>
      <v-tab>Mejoras</v-tab>
      <v-tab>Observaciones</v-tab>
      <v-tab>Foto Fachada</v-tab>
      <v-tab>Salir</v-tab>
    </v-tabs>

    <v-window v-model="tab">
      <v-window-item><FormIdentificacion/></v-window-item>
      <v-window-item><VentanaTenencia/></v-window-item>
      <v-window-item><TabCaracteristicas/></v-window-item>
      <v-window-item v-if="getTipoPredio === 2"><CaracteristicasRurales/></v-window-item>
      <v-window-item><VentanaVias/></v-window-item>
      <v-window-item><VentanaBloques/></v-window-item>
      <v-window-item><VentanaMejoras/></v-window-item>
      <v-window-item><TabObservaciones/></v-window-item>
      <v-window-item><TabFotoPredio/></v-window-item>
      <v-window-item>
        <div class="d-flex flex-column align-center justify-center" style="height: 200px; gap: 16px;">
          <v-btn color="#808b96" append-icon="mdi-exit-to-app" @click="salirMenuPredial">
            Salir al menú predial
          </v-btn>
          <v-btn color="#808b96" append-icon="mdi-exit-to-app" @click="salirMenuIngreso">
            Salir al menú ingreso
          </v-btn>
        </div>
      </v-window-item>
    </v-window>
  </v-container>
</template>

<script>
import FormIdentificacion from './FormIdentificacion.vue';
import VentanaTenencia from './VentanaTenencia.vue';
import TabCaracteristicas from './FormCaracteristicas.vue';
import VentanaVias from './VentanaVias.vue';
import VentanaBloques from './VentanaBloques.vue';
import VentanaMejoras from './VentanaMejoras.vue';
import TabObservaciones from './FormObservaciones.vue';
import TabFotoPredio from './FormFotoPredio.vue';
import CaracteristicasRurales from './FormCaracteristicasRurales.vue';
import { mapGetters } from 'vuex';

export default {
  name: 'TabFichaPredial',
  data() {
    return {
      tab: 0,
    };
  },
  components: {
    FormIdentificacion,
    VentanaTenencia,
    TabCaracteristicas,
    VentanaVias,
    VentanaBloques,
    VentanaMejoras,
    TabObservaciones,
    TabFotoPredio,
    CaracteristicasRurales
  },
  computed: {            
    ...mapGetters(['getTipoPredio']),
    colorClaseTabs() {
      return this.getTipoPredio === 1 ? 'urbano-color' : 'rural-color';
    }
  },
  watch: {
    getTipoPredio(newVal) {
      if (newVal !== 2 && this.tab === 3) {
        this.tab = 0;
      }
    }
  },
  mounted() {
    const idPredio = this.$route.query.id_predio;
    if (idPredio) {
      console.log('✅ ID de predio recibido:', idPredio);
    } else {
      console.warn('⚠️ No se recibió id_predio en la URL');
    }
  },
  methods: {
    salirMenuPredial() {
      this.$router.push('/menu-predial');
    },
    salirMenuIngreso() {
      this.$router.push('/menu-ingreso');
    }
  }
};
</script>

<style scoped>
.custom-tab {
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  padding: 4px;
  margin-bottom: 16px;
  justify-content: center;
}

.custom-tab .v-tab {
  font-weight: 600;
  text-transform: none;
  color: #444 !important;
  transition: background-color 0.3s, color 0.3s;
  border-radius: 8px;
  min-width: 120px;
  justify-content: center;
}

.custom-tab .v-tab:hover {
  background-color: #f0f0f0;
  color: #000 !important;
}

.custom-tab .v-tab.v-tab--active {
  background-color: #1976d2 !important;
  color: white !important;
}

.v-window {
  margin-top: 16px;
}

.urbano-color {
  border: 2px solid #276E90;
}

.rural-color {
  border: 2px solid #668A4C;
}
</style>


