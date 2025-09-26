<template>
  <v-container>
    <!-- Franja de información de la clave catastral -->
    <div :class="['clave-catastral-banner', colorClaseBanner]">
      <div class="d-flex align-center">
        <span class="font-weight-bold mr-2">Clave Catastral:</span>
        <span>{{ getClaveCatastral || 'Sin clave catastral asignada' }}</span>
      </div>
    </div>

    <v-tabs
      v-model="tab"
      :class="['custom-tab', colorClaseTabs]"
      centered
      grow
      bg-color="#f0f0f0"
      color="#ff5722"
      slider-color="#ff5722"
    >
      <v-tab :ripple="{ class: 'orange--text' }">
        <v-icon left>mdi-card-account-details</v-icon>
        Identificación
      </v-tab>
      <v-tab :ripple="{ class: 'orange--text' }">
        <v-icon left>mdi-file-document</v-icon>
        Titulacion / Legal
      </v-tab>
      <v-tab :ripple="{ class: 'orange--text' }">
        <v-icon left>mdi-home-city</v-icon>
        Características
      </v-tab>
      <v-tab v-if="getTipoPredio === 2" :ripple="{ class: 'orange--text' }">
        <v-icon left>mdi-nature</v-icon>
        Características Rurales
      </v-tab>
      <v-tab :ripple="{ class: 'orange--text' }">
        <v-icon left>mdi-road-variant</v-icon>
        Vías
      </v-tab>
      <v-tab :ripple="{ class: 'orange--text' }">
        <v-icon left>mdi-office-building</v-icon>
        Bloques
      </v-tab>
      <v-tab :ripple="{ class: 'orange--text' }">
        <v-icon left>mdi-hammer</v-icon>
        Mejoras
      </v-tab>
      <v-tab :ripple="{ class: 'orange--text' }">
        <v-icon left>mdi-map-marker-radius</v-icon>
        Colindantes
      </v-tab>
      <v-tab :ripple="{ class: 'orange--text' }">
        <v-icon left>mdi-text-box</v-icon>
        Observaciones
      </v-tab>
      <v-tab :ripple="{ class: 'orange--text' }">
        <v-icon left>mdi-camera</v-icon>
        Foto Fachada
      </v-tab>
      <v-tab :ripple="{ class: 'orange--text' }">
        <v-icon left>mdi-exit-to-app</v-icon>
        Salir
      </v-tab>
    </v-tabs>

    <v-window v-model="tab" class="no-margin">
      <v-window-item><FormIdentificacion/></v-window-item>
      <v-window-item><VentanaTenencia/></v-window-item>
      <v-window-item><TabCaracteristicas/></v-window-item>
      <v-window-item v-if="getTipoPredio === 2"><CaracteristicasRurales/></v-window-item>
      <v-window-item><VentanaVias/></v-window-item>
      <v-window-item><VentanaBloques/></v-window-item>
      <v-window-item><VentanaMejoras/></v-window-item>
      <v-window-item><GeoLinderos/></v-window-item>
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
import GeoLinderos from '../geo/GeoLinderos.vue';
import { mapGetters, mapActions } from 'vuex';

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
    CaracteristicasRurales,
    GeoLinderos
  },
  computed: {            
    ...mapGetters(['getTipoPredio', 'getClaveCatastral']),
    colorClaseTabs() {
      return this.getTipoPredio === 1 ? 'urbano-color' : 'rural-color';
    },
    colorClaseBanner() {
      return this.getTipoPredio === 1 ? 'urbano-banner' : 'rural-banner';
    }
  },
  watch: {
    getTipoPredio(newVal) {
      if (newVal !== 2 && this.tab === 3) {
        this.tab = 0;
      }
    },
    tab() {
      // Cuando cambia la pestaña, aplicamos los estilos
      this.$nextTick(() => {
        this.aplicarEstilosTab();
      });
    }
  },
  mounted() {
    const idPredio = this.$route.query.id_predio;
    if (idPredio) {
      console.log('✅ ID de predio recibido:', idPredio);
    } else {
      console.warn('⚠️ No se recibió id_predio en la URL');
    }
    
    // Aplicamos los estilos directamente mediante JavaScript después del montaje
    this.$nextTick(() => {
      this.aplicarEstilosTab();
    });
  },
  
  beforeDestroy() {
    // Limpiar clave catastral al destruir el componente
    this.$store.dispatch('resetClaveCatastral');
  },
  methods: {
    salirMenuPredial() {
      this.$store.dispatch('resetClaveCatastral');
      this.$store.dispatch('resetIdPredio');
      this.$router.push('/menu-predial');
    },
    salirMenuIngreso() {
      this.$store.dispatch('resetClaveCatastral');
      this.$store.dispatch('resetIdPredio');
      this.$router.push('/menu-ingreso');
    },
    aplicarEstilosTab() {
      // Esperar a que el DOM se actualice
      setTimeout(() => {
        const tabs = document.querySelectorAll('.v-tab');
        const activeIndex = this.tab;
        
        // Limpiamos estilos de todas las pestañas
        tabs.forEach((tab, index) => {
          tab.style.backgroundColor = '';
          tab.style.color = '';
          tab.style.fontWeight = '';
          tab.style.boxShadow = '';
        });
        
        // Aplicamos estilos a la pestaña activa
        if (tabs[activeIndex]) {
          tabs[activeIndex].style.backgroundColor = '#ff5722';
          tabs[activeIndex].style.color = 'white';
          tabs[activeIndex].style.fontWeight = '700';
          tabs[activeIndex].style.boxShadow = '0 4px 8px rgba(255, 87, 34, 0.4)';
        }
      }, 50); // Pequeño retraso para asegurarnos de que el DOM esté listo
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
  display: flex;
  gap: 8px;
  align-items: center;
}

.custom-tab .v-tab:hover {
  background-color: #f0f0f0;
  color: #000 !important;
}

/* Estilo para tab activa con mayor especificidad */
:deep(.custom-tab .v-tab--selected) {
  background-color: #ff5722 !important;
  color: white !important;
  font-weight: 700 !important;
  box-shadow: 0 4px 8px rgba(255, 87, 34, 0.4) !important;
}

.custom-tab :deep(.v-tab--selected) {
  background-color: #ff5722 !important;
  color: white !important;
  font-weight: 700 !important;
  box-shadow: 0 4px 8px rgba(255, 87, 34, 0.4) !important;
}

/* Mantener la clase original por si acaso */
.custom-tab .v-tab.v-tab--active {
  background-color: #ff5722 !important;
  color: white !important;
  font-weight: 700 !important;
  box-shadow: 0 4px 8px rgba(255, 87, 34, 0.4) !important;
}

/* Estilo para la clase personalizada tab-activo */
.tab-activo {
  background-color: #ff5722 !important;
  color: white !important;
  font-weight: 700 !important;
  box-shadow: 0 4px 8px rgba(255, 87, 34, 0.4) !important;
}

.v-window.no-margin {
  margin-top: 0;
}

.urbano-color {
  border: 2px solid #276E90;
}

.rural-color {
  border: 2px solid #668A4C;
}

.clave-catastral-banner {
  border-radius: 10px 10px 0 0;
  padding: 10px 20px;
  margin-bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  color: #fff;
}

.urbano-banner {
  background-color: #114358;
  border-bottom: 2px solid #114358;
}

.rural-banner {
  background-color: #668A4C;
  border-bottom: 2px solid #668A4C;
}

.custom-tab {
  margin-bottom: 0;
  border-radius: 0 0 10px 10px;
}
</style>


