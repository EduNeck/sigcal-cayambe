<template>
  <!-- Barra superior -->
  <v-app-bar :class="['menu-app-bar', barraClase]">
    <v-app-bar-title class="menu-app-bar-title">
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
          ]
        },
        {
          titulo: 'GESTIÓN CATASTRAL',
          items: [
            { title: 'Ingreso Predio', route: '/ficha-predial' },
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

  methods: {
    navigateTo(route) {
      this.$router.push(route);
    }
  },
  mounted() {
    console.log('Tipo de predio activo:', this.getTipoPredio);
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
.menu-app-bar {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 64px;
  padding: 0 16px;

}

.menu-app-bar-title {
  text-align: center;
  color: #ffffff;
  text-transform: uppercase;
  font-weight: 700;
  letter-spacing: 2px;
  font-size: 1.5rem;
  width: 100%;
}

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
  background-color: #922b21 ;
  color: white ;
}

.salir-btn:hover {
  background-color: #7b1e17 ;
}

/* Colores urbanos */
.urbano-barra {
  background-color: #276E90 !important;
}
.urbano-boton {
  background-color: #276E90;
}
.urbano-boton:hover {
  background-color: #114358;
}

/* Colores rurales */
.rural-barra {
  background-color: #668A4C !important;
}
.rural-boton {
  background-color: #668A4C;
}
.rural-boton:hover {
  background-color: #324b21;
}
</style>
