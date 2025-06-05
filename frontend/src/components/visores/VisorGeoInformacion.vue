<template>
    <v-container class="container">
      <!-- Foto -->
      <v-card class="block-color elevation-4 info-card">
        <v-card-title class="centered-title">FOTO DEL PREDIO</v-card-title>
        <v-card-text class="d-flex justify-center">
          <v-img
            :src="fotoRecuperadaUrl"
            class="custom-img"
            max-width="200"
            contain
          >
            <template v-slot:placeholder>
              <v-row class="fill-height ma-0" align="center" justify="center">
                <v-progress-circular indeterminate color="grey lighten-5" />
              </v-row>
            </template>
          </v-img>
        </v-card-text>
      </v-card>
  
      <!-- Características -->
      <v-card class="block-color elevation-4 info-card mt-3">
        <v-card-title class="centered-title">CARACTERÍSTICAS DEL PREDIO</v-card-title>
        <v-card-text>
          <v-row dense>
            <v-col cols="12" sm="6" class="pa-1" v-for="(valor, etiqueta) in seccionUno" :key="etiqueta">
              <div class="dato-etiqueta">{{ etiqueta }}:</div>
              <div class="dato-valor">{{ valor || '—' }}</div>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
  
      <!-- Avalúo -->
      <v-card class="block-color elevation-4 info-card mt-3">
        <v-card-title class="centered-title">AVALÚO Y MEDIDAS</v-card-title>
        <v-card-text>
          <v-row dense>
            <v-col cols="12" sm="6" class="pa-1" v-for="(valor, etiqueta) in seccionDos" :key="etiqueta">
              <div class="dato-etiqueta">{{ etiqueta }}:</div>
              <div class="dato-valor">{{ valor || '—' }}</div>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
  
      <!-- Botón salir -->
      <v-row justify="center" class="mt-3">
        <v-btn class="btn-salir" color="grey" variant="tonal" @click="salir">Salir</v-btn>
      </v-row>
    </v-container>
  </template>
  
  <script>
  import axios from 'axios';
  import API_BASE_URL from '@/config/apiConfig';
  
  export default {
    name: 'VisorGeoInformacion',
    props: {
      idPredio: {
        type: [Number, String],
        required: false,
        default: null
      }
    },
    data() {
      return {
        datos: {},
        fotoRecuperadaUrl: '',
        idPredioLocal: this.idPredio || 60620 // valor por defecto si no se pasa prop
      };
    },
    computed: {
      seccionUno() {
        return {
          'Tipo de Predio': this.datos.tipo_predio,
          'Clave Catastral': this.datos.clave_catastral,
          'Clave Catastral Anterior': this.datos.clave_catastral_anterior,
          'Régimen de Propiedad': this.datos.regimen_propiedad,
          'Alicuota': this.datos.alicuota,
          'Sector': this.datos.sector,
          'Eje Principal': this.datos.eje_principal,
          'Eje Secundario': this.datos.eje_secundario,
          'Uso': this.datos.uso,
          'Agua': this.datos.agua,
          'Sanitarias': this.datos.sanitarias,
          'Energía': this.datos.energia
        };
      },
      seccionDos() {
        return {
          'Año de Valoración': this.datos.anio_valoracion,
          'Área Gráfica': this.datos.area_grafica,
          'Valor del Suelo': this.datos.valor_suelo,
          'Área Construida': this.datos.area_construida,
          'Valor de Construcciones': this.datos.valor_construcciones,
          'Valor Adicionales': this.datos.valor_adicionales,
          'Valor del Predio': this.datos.valor_predio
        };
      }
    },
    created() {
      // Permitir que el id_predio se pase por prop, por parámetro de ruta o por query string
      let id = this.idPredio;
      if (!id && this.$route) {
        if (this.$route.params && this.$route.params.idPredio) {
          id = this.$route.params.idPredio;
        } else if (this.$route.query && this.$route.query.id_predio) {
          id = this.$route.query.id_predio;
        }
      }
      this.idPredioLocal = id || 60620;
      this.obtenerDatosPredio();
      this.recuperaFotos(this.idPredioLocal);
    },
    methods: {
      async obtenerDatosPredio() {
        try {
          const response = await axios.get(`${API_BASE_URL}/datos_visor_predio/${this.idPredioLocal}`);
          this.datos = response.data;
        } catch (error) {
          console.error('Error al obtener los datos del predio:', error);
        }
      },
  
      async recuperaFotos(idPredio) {
        try {
          const response = await axios.get(`${API_BASE_URL}/fotos_by_idPredio/${idPredio}`);
          const data = response.data;
          if (data.length > 0 && data[0].foto) {
            const foto = data[0].foto;
            this.fotoRecuperadaUrl = typeof foto === "string"
              ? `data:image/png;base64,${foto}`
              : URL.createObjectURL(new Blob([new Uint8Array(foto.data)], { type: 'image/png' }));
          } else {
            // En Vite/Vue3 usa import para imágenes estáticas
            this.fotoRecuperadaUrl = new URL('@/assets/sin-foto.png', import.meta.url).href;
          }
        } catch (error) {
          console.error('Error al recuperar la foto:', error);
          this.fotoRecuperadaUrl = new URL('@/assets/sin-foto.png', import.meta.url).href;
        }
      },
  
      salir() {
        this.$router.push('/menu-predial');
      }
    }
  };
  </script>
  
  <style scoped>
  .container {
    background-color: #114358;
    padding: 1.5rem;
  }
  
  .block-color {
    background-color: #F1ECE7;
    border-radius: 8px;
    padding: 0.5rem 1rem;
  }
  
  .info-card {
    max-width: 600px;
    margin: 0 auto;
  }
  
  .centered-title {
    background-color: #276E90;
    color: #F1ECE7;
    text-align: center;
    font-weight: bold;
    font-size: 0.95rem;
    padding: 6px;
  }
  
  .dato-etiqueta {
    font-weight: bold;
    color: #276E90;
    font-size: 0.75rem;
  }
  
  .dato-valor {
    color: #114358;
    font-size: 0.85rem;
  }
  
  .custom-img {
    border: 2px solid #276E90;
    border-radius: 4px;
    box-shadow: 2px 2px 8px #999;
    max-height: 200px;
  }
  
  .btn-salir {
    font-size: 0.8rem;
  }
  </style>
