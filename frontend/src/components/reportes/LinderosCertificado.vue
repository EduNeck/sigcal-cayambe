<template>
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
          <p class="text-h10 font-weight-bold text-center">
            Gobierno Autónomo Descentralizado Intercultural y Plurinacional del Municipio de Cayambe
          </p>
        </v-col>
        <v-col cols="2"></v-col>
      </v-row>

      <!-- Título del certificado -->
      <v-card-title class="text-center text-h10 font-weight-bold justify-center">
        Certificado de Linderos
      </v-card-title>

      <v-card-text>
        <v-form @submit.prevent="buscarDatos" class="form-certificado">

          <!-- BLOQUE 1: Introducción -->
          <v-sheet class="pa-4 mb-1 texto-certificado" color="grey-lighten-4" rounded>
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
            class="mb-2 texto-certificado"
            density="compact"
          />

          <v-row dense class="campos-compactos">
            <v-col cols="12" md="6">
              <v-text-field label="Contribuyente" v-model="datos.contribuyente" readonly class="texto-certificado" density="compact"/>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field label="Cédula" v-model="datos.cedula" readonly class="texto-certificado" density="compact"/>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field label="Dirección del Predio" v-model="datos.direccion_predio" readonly class="texto-certificado" density="compact"/>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field label="Avalúo" v-model="datos.avaluo" readonly class="texto-certificado" density="compact"/>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field label="Parroquia" v-model="datos.parroquia" readonly class="texto-certificado" density="compact"/>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field label="Superficie (m²)" v-model="datos.superficie_m2" readonly class="texto-certificado" density="compact"/>
            </v-col>
          </v-row>

          <!-- BLOQUE 2.1: Linderos -->
          <v-divider class="my-4" />
          <h4 class="text-center text-h7 font-weight-bold texto-certificado mb-2">Detalle de Linderos</h4>
          <v-table class="texto-certificado" density="compact">
            <thead>
              <tr>
                <th class="text-left">Clave Lindero</th>
                <th class="text-left">Longitud (m)</th>
                <th class="text-left">Nombres</th>
                <th class="text-left">Orientación</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in linderos" :key="index">
                <td>{{ item.clave_lindero }}</td>
                <td>{{ item.longitud }}</td>
                <td>{{ item.nombres }}</td>
                <td>{{ item.cardinalidad }}</td>
              </tr>
              <tr v-if="linderos.length === 0">
                <td colspan="4" class="text-center">No se encontraron linderos relacionados.</td>
              </tr>
            </tbody>
          </v-table>

          <!-- BLOQUE 3: Introducción -->
          <v-sheet class="pa-4 mb-1 texto-certificado" color="grey-lighten-4" rounded>
            <p class="text-justify texto-certificado">
              Se remite toda la documentación legal a este expediente de la Dirección de Planificación, si se comprobare que ha presentado datos falsos o representaciones gráficas erróneas de cauquier clase el GADIP-Municipal revocará el presente informe de Certificación de Áreas y Linderos. El Área y Linderos es de Exclusiva responsabilidad del Propietario y Proyectista que suscribe los Planos y demas documentos.

              Particular que comunico a usted para los fines pertinenetes
            </p>
          </v-sheet>

          <!-- BLOQUE 4: Firmas -->
          <v-divider class="my-6" />
          <div class="text-center mt-10 texto-certificado">

            <v-row class="justify-center align-center mb-6">
              <v-col cols="6" class="text-center">
                <div style="min-height: 60px;"></div>
                <p class="font-weight-bold" style="margin-bottom:0;">______________________________</p>
                <p class="font-weight-bold" style="margin-bottom:0;">Jefe de Avalúos y Catastros Urbanos</p>
                <p style="margin-top:0;">GAD CAYAMBE</p>
              </v-col>
              <v-col cols="6" class="text-center">
                <div style="min-height: 60px;"></div>
                <p class="font-weight-bold" style="margin-bottom:0;">______________________________</p>
                <p class="font-weight-bold" style="margin-bottom:0;">Director de Avalúos y Catastros</p>
                <p style="margin-top:0;">GAD CAYAMBE</p>
              </v-col>
            </v-row>
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
import API_BASE_URL from '@/config/apiConfig';

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
const linderos = ref([])

const buscarDatos = async () => {
  if (!claveCatastral.value) return;
  try {
    console.log('Llamando a', `${API_BASE_URL}/predios-avaluo`, 'con clave_catastral:', claveCatastral.value);
    const response = await axios.get(`${API_BASE_URL}/predios-avaluo`, {
      params: { clave_catastral: claveCatastral.value }
    });
    console.log('Respuesta de predios-avaluo:', response.data);
    if (response.data && response.data.length > 0) {
      const predio = response.data[0];
      datos.value.contribuyente = predio.nombres || '';
      datos.value.cedula = predio.numero_documento_ciudadano || '';
      datos.value.direccion_predio = predio.direccion_principal || '';
      datos.value.avaluo = predio.avaluo_predio_porcentual || '';
      datos.value.parroquia = predio.nombre_parroquia || '';
      datos.value.superficie_m2 = predio.area_terreno || '';
    } else {
      limpiarFormulario();
      alert('No se encontraron datos para la clave catastral ingresada');
    }

    // Nueva llamada al servicio de linderos
    console.log('Llamando a', `${API_BASE_URL}/certificado-linderos`, 'con clave_catastral:', claveCatastral.value);

    const responseLinderos = await axios.get(`${API_BASE_URL}/certificado-linderos/${claveCatastral.value}`);
    console.log('Respuesta de certificado-linderos:', responseLinderos.data);
    linderos.value = responseLinderos.data || [];

  } catch (error) {
    console.error('Error al consultar datos:', error);
    alert('No se pudo obtener la información del predio');
  }
}

const limpiarFormulario = () => {
  console.log('Limpiando formulario');
  claveCatastral.value = ''
  datos.value = {
    contribuyente: '',
    cedula: '',
    direccion_predio: '',
    avaluo: '',
    parroquia: '',
    superficie_m2: ''
  }
  linderos.value = []
}

const generarPDF = () => {
  console.log('Generando PDF del certificado');
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
  padding: 0px;
  display: block;
  margin: 0 auto;
}

.texto-certificado {
  font-size: 0.68rem;
  line-height: 1.4;
}

.titulo-certificado {
  padding: 0 0 0 0;        
  font-size: 0.75rem;           
  font-weight: bold;            
  text-align: center;           
  justify-content: center;      
  display: flex;                
  line-height: 0.5;             
}


.subtitulo-certificado {
  font-size: 0.2rem ;
  font-weight: 600;
  text-align: center;
}

.campos-compactos > .v-col {
  padding-top: 0px ;
  padding-bottom: 0px ;
  padding-left: 0px ;
  padding-right: 0px ;
}

.form-certificado {
  font-size: 0.68rem;
}

@media print {
  .no-print {
    display: none ;
  }
  .texto-certificado {
    font-size: 0.85rem ;
  }
  .titulo-certificado {
    font-size: 0.68rem ;
  }
  .subtitulo-certificado {
    font-size: 0.68rem ;
  }
}
</style>
