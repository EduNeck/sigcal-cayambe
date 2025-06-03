¿<template>
  <v-layout class="overflow-visible" style="height: 56px;">
    <v-bottom-navigation active class="no-print">
      <v-btn @click="buscarDatos">
        <v-icon>mdi-magnify</v-icon>
        Buscar
      </v-btn>
      <v-btn @click="limpiarFormulario">
        <v-icon>mdi-broom</v-icon>
        Limpiar
      </v-btn>
      <v-btn @click="generarPDF">
        <v-icon>mdi-printer</v-icon>
        PDF
      </v-btn>
    </v-bottom-navigation>
  </v-layout>

  <v-container class="pdf-wrapper" fluid>
    <div id="certificado" class="a4-container" ref="pdfRef">
      <!-- Encabezado con logo y título institucional -->
      <v-row class="align-center justify-center mb-6">
        <v-col cols="2" class="d-flex align-center justify-center">
          <img :src="logo" class="logo"/>
        </v-col>
        <v-col cols="8">
          <p class="text-h6 font-weight-bold text-center">
            Gobierno Autónomo Descentralizado Intercultural y Plurinacional del Municipio de Cayambe
          </p>
        </v-col>
        <v-col cols="2"></v-col>
      </v-row>

      <!-- Título del certificado -->
      <v-card-title class="text-center text-h6 font-weight-bold justify-center">
        Certificado de Linderos
      </v-card-title>

      <v-card-text>
        <v-form @submit.prevent="buscarDatos" class="form-certificado">

          <!-- BLOQUE 1: Introducción -->
          <v-sheet class="pa-4 mb-6 texto-certificado" color="grey-lighten-4" rounded>
            <p class="text-justify texto-certificado">
              La Jefatura de Avalúvos y Catastros Urbanos tiene a bien certificar, el informe de áreas y linderos, de acuerdo al Art. 98 de la Primera Reforma a la Ordenanza de Administración y Control del Territorio del cantón CAYAMBE, y en concordancia con los Art. 139 y 196 del COOTAD tiene a bien manifestar que la propiedad con los antecedentes mencionados y en correlación con los Registros Catastrales, se le emite la siguiente certificación de Linderos:
            </p>
          </v-sheet>

          <!-- BLOQUE 2: Datos -->
          <v-text-field
            label="Clave Catastral"
            v-model="claveCatastral"
            :rules="[v => !!v || 'Campo requerido']"
            required
            class="mb-6 texto-certificado"
          />

          <v-row dense>
            <v-col cols="12" md="6">
              <v-text-field
                label="Contribuyente"
                v-model="datos.contribuyente"
                readonly
                class="texto-certificado"
              />
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                label="Cédula"
                v-model="datos.cedula"
                readonly
                class="texto-certificado"
              />
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                label="Dirección del Predio"
                v-model="datos.direccion_predio"
                readonly
                class="texto-certificado"
              />
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                label="Avalúo"
                v-model="datos.avaluo"
                readonly
                class="texto-certificado"
              />
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                label="Parroquia"
                v-model="datos.parroquia"
                readonly
                class="texto-certificado"
              />
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                label="Superficie (m²)"
                v-model="datos.superficie_m2"
                readonly
                class="texto-certificado"
              />
            </v-col>
          </v-row>


          <!-- BLOQUE 3: Firma -->
          <v-divider class="my-6" />
          <div class="text-center mt-10 texto-certificado">
            <p>Atentamente,</p>
            <br /><br />
            <p class="font-weight-bold">JEFATURA DE AVALÚOS Y CATASTROS URBANOS</p>
            <p>GAD CAYAMBE</p>
          </div>

        </v-form>
      </v-card-text>
    </div>
  </v-container>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'
import html2pdf from 'html2pdf.js'
import logo from '@/assets/logo_ventana.png'

const claveCatastral = ref('')
const pdfRef = ref(null)
const datos = ref({
  contribuyente: '',
  cedula: '',
  direccion_predio: '',
  avaluo: '',
  parroquia: '',
  superficie_m2: ''
})

const buscarDatos = async () => {
  if (!claveCatastral.value) return;
  try {
    // Llama al nuevo servicio filtrando por clave_catastral
    const response = await axios.get(`/api/predios-avaluo`, {
      params: { clave_catastral: claveCatastral.value }
    });
    console.log('Respuesta de /api/predios-avaluo:', response.data);
    // Si hay resultados, toma el primero (o ajusta según tu lógica)
    if (response.data && response.data.length > 0) {
      const predio = response.data[0];
      console.log('Primer predio encontrado:', predio);
      datos.value.contribuyente = predio.nombres || '';
      datos.value.cedula = predio.numero_documento_ciudadano || '';
      datos.value.direccion_predio = predio.direccion_principal || '';
      datos.value.avaluo = predio.avaluo_predio_porcentual || '';
      datos.value.parroquia = predio.nombre_parroquia || '';
      datos.value.superficie_m2 = predio.area_terreno || '';
    } else {
      // Limpia los datos si no hay resultados
      limpiarFormulario();
      console.log('No se encontraron datos para la clave catastral ingresada');
      alert('No se encontraron datos para la clave catastral ingresada');
    }
  } catch (error) {
    console.error('Error al consultar datos:', error);
    alert('No se pudo obtener la información del predio');
  }
}

const limpiarFormulario = () => {
  claveCatastral.value = ''
  datos.value = {
    contribuyente: '',
    cedula: '',
    direccion_predio: '',
    avaluo: '',
    parroquia: '',
    superficie_m2: ''
  }
}

const generarPDF = () => {
  const element = pdfRef.value?.$el || pdfRef.value
  html2pdf()
    .from(element)
    .set({
      margin: 0,
      filename: `certificado_linderos_${claveCatastral.value || 'predio'}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 3 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    })
    .save()
}
</script>

<style scoped>
.pdf-wrapper {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  min-height: 100vh;
  background-color: #b9b6b6;
  padding: 20px;
}

.a4-container {
  width: 210mm;
  max-height: 297mm;
  padding: 10mm;
  box-sizing: border-box;
  background: white;
  overflow: hidden;
  margin: 5px auto;
  box-shadow: 0 0 10px rgba(20, 199, 50, 0.1);
}

.logo {
  max-width: 40px;
  min-width: 40px;
  width: 100%;
  height: auto;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  padding: 4px;
  display: block;
  margin: 0 auto;
}

.texto-certificado {
  font-size: 0.75rem;
  line-height: 1.5;
}

.titulo-certificado {
  font-size: 0.85rem !important;
  font-weight: bold;
  text-align: center;
}

.subtitulo-certificado {
  font-size: 1.15rem !important;
  font-weight: 600;
  text-align: center;
}

.form-certificado {
  font-size: 1.08rem;
}

@media print {
  .no-print {
    display: none !important;
  }
  .texto-certificado {
    font-size: 0.85rem !important;
  }
  .titulo-certificado {
    font-size: 0.85rem !important;
  }
  .subtitulo-certificado {
    font-size: 0.85rem !important;
  }
}
</style>
