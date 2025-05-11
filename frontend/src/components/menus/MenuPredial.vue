<template>
  <!-- Barra superior -->
  <v-app-bar :class="barraClase" :elevation="2" class="d-flex justify-center">
    <v-app-bar-title class="text-center text-white text-uppercase">
      {{ tituloPredio }}
    </v-app-bar-title>
  </v-app-bar>

  <!-- Menú principal -->
  <div class="d-flex justify-center align-center mt-10 flex-wrap gap-3">
    <!-- Menús desplegables -->
    <v-menu v-for="(menu, i) in menus" :key="i">
      <template v-slot:activator="{ props }">
        <v-btn
          append-icon="mdi-folder"
          color="white"
          v-bind="props"
          variant="tonal"
          class="custom-list-item"
          :class="botonClase"
        >
          {{ menu.titulo }}
        </v-btn>
        <v-divider vertical></v-divider>
      </template>
      <v-list>
        <v-list-item
          v-for="(item, index) in menu.items"
          :key="index"
          @click="navigateTo(item.route)"
        >
          <v-list-item-title>{{ item.title }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>

    <!-- Botón salir -->
    <v-btn
      append-icon="mdi-close"
      variant="tonal"
      class="salir-btn custom-list-item"
      @click="$router.push('/menu-ingreso')"
    >
      SALIR
    </v-btn>
  </div>

  <!-- Imagen decorativa -->
  <v-col cols="12">
    <v-img
      :src="logo"
      class="my-4 centered-image"
      contain
      height="200"
    />
  </v-col>
</template>

<script>
import { mapGetters } from 'vuex';
import logo from '@/assets/logo_trasparente.png';

export default {
  name: 'MenuPredial',
  data() {
    return {
      logo: logo,
      menus: [
        {
          titulo: 'VISOR',
          items: [
            { title: 'Geo Visor', route: '/visor-geo-local' },
            { title: 'Visor Información', route: '/visor-geo-informacion' }
          ]
        },
        {
          titulo: 'GESTIÓN CATASTRAL',
          items: [
            { title: 'Ingreso Predio', route: '/ficha-predial' },
            { title: 'Búsqueda Predio', route: '/busqueda-predios-urb' },
            //{ title: 'Listado Predios', route: '/listado-predios-urb' },
            { title: 'Gestión Documental', route: '/gestion-documental' },
            { title: 'Ciudadanos', route: '/busqueda-ciudadanos' }
          ]
        },
        {
          titulo: 'REPORTES',
          items: [
            { title: 'Certificado Catastral', route: '/busquedaCertCatasUrb' },
            { title: 'Certificado Plusvalía', route: '/busquedaCertPlusvalia' },
            { title: 'Ficha Predial', route: '/fichaPredialUrbana' }
          ]
        },
        {
          titulo: 'VALORACIÓN',
          items: [
            { title: 'Genera Valoración', route: '/genera-valoracion' },
            { title: 'Certificado Catastral', route: '/genera-certificado' },
            { title: 'PDF Catastral', route: '/certificado-catastral' },
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

  methods: {
    navigateTo(route) {
      this.$router.push(route);
    }
  },


  computed: {
    ...mapGetters(['getTipoPredio']),
    tituloPredio() {      
      return this.getTipoPredio === 1 ? 'URBANO' : 'RURAL';
    },
    barraClase() {      
      return this.getTipoPredio === 1 ? 'urbano-barra' : 'rural-barra';
    },
    botonClase() {      
      return this.getTipoPredio === 1 ? 'urbano-boton' : 'rural-boton';
    }
  }

};

</script>

<style scoped>
.centered-image {
  max-width: 100%;
  object-fit: contain;
}

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

/* Colores urbanos */
.urbano-barra {
  background-color: #276E90 !important;
}
.urbano-boton {
  background-color: #276E90 !important;
}
.urbano-boton:hover {
  background-color: #114358 !important;
}

/* Colores rurales */
.rural-barra {
  background-color: #668A4C !important;
}
.rural-boton {
  background-color: #668A4C !important;
}
.rural-boton:hover {
  background-color: #324b21 !important;
}
</style>
