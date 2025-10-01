<template>
  <v-container>
    <!-- Banner superior para URBANO/RURAL -->
    <div :class="['tipo-predio-banner', colorClaseBarra]">
      <div class="banner-title">
        {{ tituloPredio }}
      </div>
    </div>

    <!-- Franja de información de la clave catastral -->
    <div :class="['clave-catastral-banner', colorClaseBanner]" style="display: flex; justify-content: space-between; align-items: center;">
      <div class="d-flex align-center">
        <span class="font-weight-bold mr-2">Clave Catastral:</span>
        <span>{{ getClaveCatastral || 'Sin clave catastral asignada' }}</span>
      </div>
      
      <!-- Menú desplegable -->
      <div class="menu-dropdown">
        <v-menu offset-y>
          <template v-slot:activator="{ props }">
            <v-btn
              v-bind="props"
              icon
              variant="text"
              color="white"
            >
              <v-icon>mdi-menu</v-icon>
            </v-btn>
          </template>
          <v-list class="menu-list">
            <template v-for="(menu, i) in menus" :key="i">
              <v-list-subheader class="menu-subheader">{{ menu.titulo }}</v-list-subheader>
              <v-list-item
                v-for="(item, index) in menu.items"
                :key="index"
                @click="confirmNavigation(item.route, item.title)"
                class="menu-item"
              >
                <template v-slot:prepend>
                  <v-icon class="mr-2">mdi-arrow-right-circle</v-icon>
                </template>
                <v-list-item-title>{{ item.title }}</v-list-item-title>
              </v-list-item>
              <v-divider class="my-2"></v-divider>
            </template>
          </v-list>
        </v-menu>
      </div>
    </div>
    
    <!-- Snackbar para confirmación de navegación -->
    <v-snackbar
      v-model="snackbar.show"
      :timeout="8000"
      :color="snackbar.color"
      location="top"
    >
      {{ snackbar.text }}
      <template v-slot:actions>
        <v-btn
          variant="text"
          color="white"
          @click="executeNavigation"
        >
          CONTINUAR
        </v-btn>
        <v-btn
          variant="text"
          color="white"
          @click="snackbar.show = false"
        >
          CANCELAR
        </v-btn>
      </template>
    </v-snackbar>

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
        Titulación / Legal
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
      snackbar: {
        show: false,
        text: '',
        color: 'info',
        pendingRoute: null,
        destinationName: ''
      },
      menus: [
        {
          titulo: 'VISOR',
          items: [
            { title: 'Geo Visor', route: '/visor-geo-local' },
          ]
        },
        {
          titulo: 'GESTIÓN CATASTRAL',
          items: [
            { title: 'Ingreso Predio', route: '/ficha-predial?new=true' },
            { title: 'Búsqueda Predio', route: '/busqueda-predios-urb' },            
            { title: 'Anexo Documental', route: '/gestion-documental' },
            { title: 'Listado Documental', route: '/listado-documental' },
            { title: 'Ciudadanos', route: '/busqueda-ciudadanos' }
          ]
        },
        {
          titulo: 'REPORTES',
          items: [
            { title: 'Genera Certificado', route: '/genera-certificados' },
          ]
        },
        {
          titulo: 'VALORACIÓN',
          items: [
            { title: 'Genera Valoración', route: '/genera-valoracion' },
            { title: 'Valores Comerciales', route: '/valores-comerciales' },
            { title: 'Factores Suelo', route: '/valoracion-suelo-factores' },
            { title: 'Factores Piso', route: '/valoracion-piso-factores' },
            { title: 'Mejoras Obras', route: '/valoracion-mejoras' },
            { title: 'Resultado Predio', route: '/valoracion-resultados' },
            { title: 'Patrimonio', route: '/valoracion-patrimonio' },
            { title: 'Fitto Corvini', route: '/fito-corvini' }
          ]
        },
        {
          titulo: 'CEM',
          items: [
            { title: 'Proyectos Cem', route: '/proyecto-cem' },            
            { title: 'Predios Proyecto', route: '/predios-proyecto-cem' },
            { title: 'Tipo Proyectos', route: '/tipo-proyecto-cem' },            
            { title: 'Alcance Obra', route: '/alcance-obra-cem' },            
          ]
        },
        {
          titulo: 'CONTROL',
          items: [
            { title: 'Predios Digitados', route: '/control-predios-digitadosusuario' },
            { title: 'Sin Foto', route: '/control-predios-sinfoto' },
            { title: 'Sin Geometría', route: '/control-predios-singeo' },
            { title: 'No Digitados', route: '/control-predios-nodigitados' },
            { title: 'Geo Inválidas', route: '/control-predios-geoinvalidas' },
            { title: 'Bloques Sin Geo', route: '/control-bloques-singeo' },
            { title: 'Bloques No Digitados', route: '/control-bloques-nodigitados' },
            { title: 'Bloques Inválidos', route: '/control-bloques-geoinvalidas' },
            { title: 'Sin Servicios', route: '/control-predios-sinservicios' },
            { title: 'Sin Uso', route: '/control-predios-sinuso' },
            { title: 'Sin Tenencia', route: '/control-predios-sintenencia' },
            { title: 'Sin Vías', route: '/control-predios-sinvias' },
            { title: 'PH sin Ficha Madre', route: '/control-ph-sinfm' },
            { title: 'Exceso Participación', route: '/control-porcentaje-exedente' },
            { title: 'Alicuotas Inválidas', route: '/control-inconcistencia-alicuotas' }
          ]
        }
      ]
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
    },
    tituloPredio() {
      return this.getTipoPredio === 1 ? 'URBANO' : 'RURAL';
    },
    colorClaseBarra() {
      return this.getTipoPredio === 1 ? 'urbano-barra' : 'rural-barra';
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
      if (this.getClaveCatastral) {
        this.confirmNavigation('/menu-predial', 'Menú Predial');
      } else {
        // Limpieza completa como en FormIdentificacion
        this.$store.dispatch('resetClaveCatastral');
        this.$store.dispatch('resetIdPredio');
        // Limpiar ids adicionales si es necesario
        this.$store.dispatch('resetIdTenencia', null);
        this.$store.dispatch('resetIdVia', null);
        this.$store.dispatch('resetIdBloque', null);
        this.$store.dispatch('resetIdMejora', null);
        this.$store.dispatch('resetIdFoto', null);
        this.$router.push('/menu-predial');
      }
    },
    salirMenuIngreso() {
      if (this.getClaveCatastral) {
        this.confirmNavigation('/menu-ingreso', 'Menú Ingreso');
      } else {
        // Limpieza completa como en FormIdentificacion
        this.$store.dispatch('resetClaveCatastral');
        this.$store.dispatch('resetIdPredio');
        // Limpiar ids adicionales si es necesario
        this.$store.dispatch('resetIdTenencia', null);
        this.$store.dispatch('resetIdVia', null);
        this.$store.dispatch('resetIdBloque', null);
        this.$store.dispatch('resetIdMejora', null);
        this.$store.dispatch('resetIdFoto', null);
        this.$router.push('/menu-ingreso');
      }
    },
    confirmNavigation(route, destinationName) {
      // Confirmar antes de navegar si estamos en modo edición
      if (this.getClaveCatastral) {
        this.snackbar.text = `¿Está seguro que desea navegar a "${destinationName}"? Los cambios no guardados se perderán.`;
        this.snackbar.color = 'warning';
        this.snackbar.pendingRoute = route;
        this.snackbar.destinationName = destinationName;
        this.snackbar.show = true;
      } else {
        // Si no hay clave catastral activa, navegamos directamente
        this.$router.push(route);
      }
    },
    
    executeNavigation() {
      // Ejecutar la navegación pendiente
      if (this.snackbar.pendingRoute) {
        const route = this.snackbar.pendingRoute;
        // Realizar limpieza completa como en navegaMenuPrincipal
        this.$store.dispatch('resetIdTenencia', null);
        this.$store.dispatch('resetIdVia', null);
        this.$store.dispatch('resetIdBloque', null);
        this.$store.dispatch('resetIdMejora', null);
        this.$store.dispatch('resetIdFoto', null);
        this.$store.dispatch('resetClaveCatastral');
        this.$store.dispatch('resetIdPredio');
        this.$router.push(route);
        this.snackbar.show = false;
        this.snackbar.pendingRoute = null;
      }
    },
    
    navigateTo(route) {
      // Método de compatibilidad con el código anterior
      this.confirmNavigation(route, route.replace('/', '').toUpperCase());
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
  border-radius: 0;
  padding: 10px 20px;
  margin-bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  color: #fff;
  border-top: 1px solid rgba(255, 255, 255, 0.2);
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

.menu-dropdown {
  margin-right: 10px;
}

.menu-list {
  min-width: 280px;
  max-height: 70vh;
  overflow-y: auto;
  padding: 0;
  background-color: #f5f5f5;
}

.menu-subheader {
  background-color: #eaeaea;
  font-weight: bold;
  font-size: 0.9rem;
  padding: 8px 16px;
  color: #333;
}

.menu-item {
  padding-left: 24px;
}

.menu-item:hover {
  background-color: #e0e0e0;
}

/* Estilos para el Snackbar */
:deep(.v-snackbar__content) {
  font-size: 1rem;
  padding: 12px;
  align-items: center;
}

:deep(.v-snackbar__actions) {
  margin-left: 12px;
  padding-left: 0;
  display: flex;
  gap: 8px;
}

/* Estilos para el banner superior de tipo de predio */
.tipo-predio-banner {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 50px;
  margin-bottom: 0;
  border-radius: 10px 10px 0 0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.banner-title {
  text-align: center;
  color: #ffffff;
  text-transform: uppercase;
  font-weight: 700;
  letter-spacing: 2px;
  font-size: 1.5rem;
}

/* Colores para el banner de tipo */
.urbano-barra {
  background-color: #276E90 !important;
}

.rural-barra {
  background-color: #668A4C !important;
}
</style>


