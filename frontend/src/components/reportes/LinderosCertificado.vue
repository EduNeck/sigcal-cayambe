<template>
  <v-layout class="overflow-visible">
    <v-app-bar flat color="primary" class="no-print px-2" elevation="3">
      <v-toolbar-title class="text-white text-h6 font-weight-light">Certificado de Linderos</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn 
        color="white" 
        variant="text" 
        @click="buscarDatos"
        prepend-icon="mdi-magnify">
        Buscar
      </v-btn>
      <v-btn 
        color="white" 
        variant="text" 
        @click="limpiarFormulario"
        prepend-icon="mdi-broom">
        Limpiar
      </v-btn>
      <v-btn 
        color="white" 
        variant="outlined" 
        class="ml-2" 
        @click="generarPDF"
        prepend-icon="mdi-printer">
        PDF
      </v-btn>
    </v-app-bar>
  </v-layout>

  <v-container class="pdf-wrapper modern-bg" fluid>
    <div id="certificado" class="a4-container modern-document" ref="pdfRef">
      <!-- Encabezado con logo y título institucional -->
      <v-card flat class="header-card mb-6">
        <v-row class="align-center justify-center">
          <v-col cols="2" class="d-flex align-center justify-center">
            <div class="logo-container">
              <img :src="logo" class="logo" />
            </div>
          </v-col>
          <v-col cols="8">
            <div class="header-text">
              <h3 class="header-title">
                Gobierno Autónomo Descentralizado
              </h3>
              <h4 class="header-subtitle">
                Intercultural y Plurinacional del Municipio de Cayambe
              </h4>
            </div>
          </v-col>
          <v-col cols="2"></v-col>
        </v-row>
      </v-card>

      <!-- Título del certificado -->
      <v-card flat color="primary" class="certificate-title-card mb-6">
        <v-card-title class="text-center text-white">
          Certificado de Linderos
        </v-card-title>
      </v-card>

      <v-card-text>
        <v-form @submit.prevent="buscarDatos" class="form-certificado">

          <!-- BLOQUE 1: Introducción -->
          <v-card flat class="intro-card mb-4" variant="outlined">
            <v-card-text class="text-justify modern-text">
              <p>La Jefatura de Avalúvos y Catastros Urbanos tiene a bien certificar, el informe de áreas y linderos, de acuerdo al Art. 98 de la Primera Reforma a la Ordenanza de Administración y Control del Territorio del cantón CAYAMBE, y en concordancia con los Art. 139 y 196 del COOTAD tiene a bien manifestar que la propiedad con los antecedentes mencionados y en correlación con los Registros Catastrales, se le emite la siguiente certificación de Linderos:</p>
            </v-card-text>
          </v-card>

          <!-- BLOQUE 2: Datos -->
          <v-card flat class="mb-6 data-card" variant="outlined">
            <v-card-title class="py-2 px-4 bg-primary-lighten-5 subtitle-section">
              <v-icon icon="mdi-home-search" class="mr-2" />
              Información del Predio
            </v-card-title>
            <v-card-text class="pa-4">
              <v-row>
                <v-col cols="12">
                  <v-text-field
                    label="Clave Catastral"
                    v-model="claveCatastral"
                    :rules="[v => !!v || 'Campo requerido']"
                    required
                    class="modern-input"
                    variant="outlined"
                    density="comfortable"
                    bg-color="surface"
                    readonly-if="!!route.query.clave_catastral"
                    prepend-inner-icon="mdi-key-variant"
                  />
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
          
          <v-card flat class="mb-6 data-card" variant="outlined">
            <v-card-title class="py-2 px-4 bg-primary-lighten-5 subtitle-section">
              <v-icon icon="mdi-account-details" class="mr-2" />
              Datos del Propietario y Predio
            </v-card-title>
            <v-card-text class="pa-4">
              <v-row dense>
                <v-col cols="12" md="6">
                  <v-text-field 
                    label="Contribuyente" 
                    v-model="datos.contribuyente" 
                    readonly 
                    variant="outlined"
                    class="modern-input" 
                    prepend-inner-icon="mdi-account"
                    density="comfortable"/>
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field 
                    label="Cédula" 
                    v-model="datos.cedula" 
                    readonly 
                    variant="outlined"
                    class="modern-input"
                    prepend-inner-icon="mdi-card-account-details"
                    density="comfortable"/>
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field 
                    label="Dirección del Predio" 
                    v-model="datos.direccion_predio" 
                    readonly 
                    variant="outlined"
                    class="modern-input"
                    prepend-inner-icon="mdi-map-marker"
                    density="comfortable"/>
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field 
                    label="Avalúo" 
                    v-model="datos.avaluo" 
                    readonly 
                    variant="outlined"
                    class="modern-input"
                    prepend-inner-icon="mdi-cash"
                    density="comfortable"/>
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field 
                    label="Parroquia" 
                    v-model="datos.parroquia" 
                    readonly 
                    variant="outlined"
                    class="modern-input"
                    prepend-inner-icon="mdi-city"
                    density="comfortable"/>
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field 
                    label="Superficie (m²)" 
                    v-model="datos.superficie_m2" 
                    readonly 
                    variant="outlined"
                    class="modern-input"
                    prepend-inner-icon="mdi-ruler-square"
                    density="comfortable"/>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>

          <!-- BLOQUE 2.1: Linderos -->
          <v-card flat class="mb-6 linderos-card" variant="outlined">
            <v-card-title class="py-2 px-4 bg-primary-lighten-5 subtitle-section no-break">
              <v-icon icon="mdi-map" class="mr-2" />
              Detalle de Linderos ({{ linderos.length }} registros)
            </v-card-title>
            <v-card-text class="pa-0">
              <div class="table-responsive">
                <table class="modern-table">
                  <thead>
                    <tr>
                      <th class="text-left" width="20%">Clave Lindero</th>
                      <th class="text-left" width="20%">Longitud (m)</th>
                      <th class="text-left" width="40%">Nombres</th>
                      <th class="text-left" width="20%">Orientación</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(item, index) in linderos" :key="index" class="lindero-row">
                      <td>
                        <span class="table-data">{{ item.clave_lindero || '' }}</span>
                      </td>
                      <td>
                        <span class="table-data">{{ item.longitud || '' }} m</span>
                      </td>
                      <td>
                        <span class="table-data">{{ item.nombres || '' }}</span>
                      </td>
                      <td>
                        <span class="table-data">{{ item.cardinalidad || '' }}</span>
                      </td>
                    </tr>
                    <tr v-if="linderos.length === 0">
                      <td colspan="4" class="text-center pa-4">
                        <v-alert type="info" variant="tonal" density="compact" icon="mdi-information">
                          No se encontraron linderos relacionados.
                        </v-alert>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </v-card-text>
          </v-card>



          <!-- BLOQUE 3: Clausula -->
          <v-card flat class="mb-6 clausula-card" variant="outlined">
            <v-card-title class="py-2 px-4 bg-primary-lighten-5 subtitle-section">
              <v-icon icon="mdi-gavel" class="mr-2" />
              Cláusula Legal
            </v-card-title>
            <v-card-text class="pa-4 text-justify modern-text">
              <p>
                Se remite toda la documentación legal a este expediente de la Dirección de Planificación, si se comprobare que ha presentado datos falsos o representaciones gráficas erróneas de cualquier clase el GADIP-Municipal revocará el presente informe de Certificación de Áreas y Linderos. El Área y Linderos es de exclusiva responsabilidad del Propietario y Proyectista que suscribe los Planos y demás documentos.
              </p>
              <p>
                Particular que comunico a usted para los fines pertinentes.
              </p>
            </v-card-text>
          </v-card>

          <!-- BLOQUE 4: Firmas -->
          <div class="page-break-before"></div>
          <v-card flat class="mb-6 firmas-card no-break" variant="outlined">
            <v-card-title class="py-2 px-4 bg-primary-lighten-5 subtitle-section">
              <v-icon icon="mdi-account-check" class="mr-2" />
              Firma de Responsabilidad
            </v-card-title>
            <v-card-text class="pa-4">
              <v-row class="justify-center align-center">
                <v-col cols="12" class="text-center">
                  <div class="firma-container">
                    <div class="linea-firma"></div>
                    <p class="mt-2 firma-text">{{ nombreUsuario }}</p>
                    <p class="cargo-text">{{ cargoUsuario }}</p>
                    <p class="cargo-text">GAD CAYAMBE</p>
                  </div>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-form>
      </v-card-text>
    </div>
    
    <!-- Alertas -->
    <v-snackbar v-model="snackbarErrorPush" :timeout="3000" color="error" rounded="pill">
      {{ snackbarError }}
    </v-snackbar>
    <v-snackbar v-model="snackbarOkPush" :timeout="3000" color="success">
      {{ snackbarOk }}
    </v-snackbar>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'
import html2pdf from 'html2pdf.js'
import logo from '@/assets/logo_ventana.png'
import API_BASE_URL from '@/config/apiConfig';

const route = useRoute();
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
const snackbarErrorPush = ref(false)
const snackbarError = ref('')
const snackbarOkPush = ref(false)
const snackbarOk = ref('')
const nombreUsuario = ref('Usuario del Sistema')
const cargoUsuario = ref('Analista de Catastros')

// Función para obtener información del usuario actual desde sessionStorage o localStorage
const obtenerInformacionUsuario = () => {
  try {
    // Intenta obtener datos del usuario de sessionStorage (preferido) o localStorage
    let userData = sessionStorage.getItem('userData') || localStorage.getItem('userData');
    
    if (userData) {
      const user = JSON.parse(userData);
      nombreUsuario.value = user.nombre || user.username || 'Usuario del Sistema';
      cargoUsuario.value = user.cargo || user.role || 'Analista de Catastros';
    } else {
      // Si no hay datos en storage, usar valores por defecto
      nombreUsuario.value = 'Usuario del Sistema';
      cargoUsuario.value = 'Analista de Catastros';
    }
  } catch (error) {
    console.error('Error al obtener datos del usuario:', error);
    nombreUsuario.value = 'Usuario del Sistema';
    cargoUsuario.value = 'Analista de Catastros';
  }
};

// Cargar datos desde la URL si están disponibles
onMounted(() => {
  // Obtener información del usuario
  obtenerInformacionUsuario();
  
  // Si hay datos en la URL, los cargamos
  if (route.query && route.query.clave_catastral) {
    claveCatastral.value = route.query.clave_catastral;
    
    // Llenar datos básicos con la información recibida por query params
    datos.value = {
      contribuyente: route.query.propietario || '',
      cedula: route.query.numero_documento || '',
      direccion_predio: route.query.direccion_principal || '',
      avaluo: route.query.avaluo_total || '',
      parroquia: route.query.nombre_parroquia || '',
      superficie_m2: route.query.area_suelo || ''
    };
    
    // Buscar los linderos automáticamente
    buscarDatosDeLinderos();
  }
});

const buscarDatos = async () => {
  if (!claveCatastral.value) {
    snackbarError.value = 'Ingrese una clave catastral válida';
    snackbarErrorPush.value = true;
    return;
  }
  
  try {
    const response = await axios.get(`${API_BASE_URL}/predios-avaluo`, {
      params: { clave_catastral: claveCatastral.value }
    });
    if (response.data && response.data.length > 0) {
      const predio = response.data[0];
      datos.value = {
        contribuyente: predio.nombres || '',
        cedula: predio.numero_documento_ciudadano || '',
        direccion_predio: predio.direccion_principal || '',
        avaluo: predio.avaluo_predio_porcentual || '',
        parroquia: predio.nombre_parroquia || '',
        superficie_m2: predio.area_terreno || ''
      }
      snackbarOk.value = 'Datos del predio cargados correctamente';
      snackbarOkPush.value = true;
    } else {
      limpiarFormulario();
      snackbarError.value = 'No se encontraron datos para la clave catastral ingresada';
      snackbarErrorPush.value = true;
    }
    
    await buscarDatosDeLinderos();
  } catch (error) {
    console.error('Error al consultar datos:', error);
    snackbarError.value = 'No se pudo obtener la información del predio';
    snackbarErrorPush.value = true;
  }
}

const buscarDatosDeLinderos = async () => {
  try {
    if (!claveCatastral.value) {
      console.log('No hay clave catastral, no se pueden cargar los linderos');
      return;
    }
    
    console.log(`Cargando linderos para la clave catastral: ${claveCatastral.value}`);
    
    // Intentamos primero con geo_linderos_by_clave (igual que GeoLinderos.vue)
    try {
      const response = await axios.get(`${API_BASE_URL}/geo_linderos_by_clave/${claveCatastral.value}`);
      if (response.data && response.data.length > 0) {
        console.log(`Cargados ${response.data.length} linderos geográficos`);
        linderos.value = response.data;
        return;
      }
    } catch (geoError) {
      console.log('No se encontraron linderos geográficos, intentando con certificado-linderos:', geoError);
    }
    
    // Si no hay resultados, intentamos con la ruta certificado-linderos
    const responseLinderos = await axios.get(`${API_BASE_URL}/certificado-linderos/${claveCatastral.value}`);
    if (responseLinderos.data && responseLinderos.data.length > 0) {
      console.log(`Cargados ${responseLinderos.data.length} linderos de certificado`);
      linderos.value = responseLinderos.data || [];
    } else {
      console.log('No se encontraron linderos para el certificado');
      linderos.value = [];
    }
  } catch (error) {
    console.error('Error al consultar linderos:', error);
    linderos.value = [];
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
  linderos.value = []
}

// Actualiza los linderos en el backend antes de generar el PDF
const actualizaLinderos = async () => {
  try {
    if (!claveCatastral.value || !linderos.value.length) return;
    
    console.log('Actualizando linderos antes de generar PDF...');
    
    for (const item of linderos.value) {
      const linderoActualizado = {
        clave: claveCatastral.value,
        longitud: item.longitud || null,
        clave_lindero: item.clave_lindero || null,
        nombres: item.nombres || null,
        cardinalidad: item.cardinalidad || null,
        ord: item.ord || null
      };
      
      try {
        // Primero intentamos actualizar como geo_lindero (igual que en GeoLinderos.vue)
        if (item.id) {
          await axios.put(`${API_BASE_URL}/actualiza_geo_lindero/${item.id}`, linderoActualizado);
          console.log(`Lindero ${item.id} actualizado como geo_lindero`);
        } else {
          // Si no hay ID, intentamos con la API actualiza-linderos
          await axios.put(`${API_BASE_URL}/actualiza-linderos/${claveCatastral.value}?id=${item.id}`, item);
          console.log(`Lindero actualizado mediante actualiza-linderos`);
        }
      } catch (itemError) {
        console.warn(`Error al actualizar lindero ${item.id || 'sin ID'}:`, itemError);
      }
    }
    
    console.log('Linderos actualizados correctamente');
  } catch (error) {
    console.error('Error general al actualizar linderos:', error);
    alert('No se pudo actualizar la información de linderos');
  }
}

const generarPDF = async () => {
  if (!claveCatastral.value) {
    snackbarError.value = 'Ingrese una clave catastral válida antes de generar el PDF';
    snackbarErrorPush.value = true;
    return;
  }
  
  try {
    // Primero actualizamos los linderos
    await actualizaLinderos();
    
    // Generar el PDF
    const element = pdfRef.value?.$el || pdfRef.value
    html2pdf()
      .from(element)
      .set({
        margin: 5,
        filename: `certificado_linderos_${claveCatastral.value || 'predio'}.pdf`,
        image: { type: 'jpeg', quality: 1 },
        html2canvas: { 
          scale: 3,
          logging: true,
          useCORS: true,
          windowHeight: element.scrollHeight + 20
        },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
        pagebreak: { mode: ['avoid-all', 'css', 'legacy'], before: '.page-break-before', after: '.page-break-after', avoid: '.no-break' }
      })
      .toPdf()
      .get('pdf')
      .then(pdf => {
        const totalPages = pdf.internal.getNumberOfPages();
        for (let i = 1; i <= totalPages; i++) {
          pdf.setPage(i);
          pdf.setFontSize(8);
          pdf.text(`Página ${i} de ${totalPages}`, pdf.internal.pageSize.getWidth() - 40, pdf.internal.pageSize.getHeight() - 10);
        }
      })
      .save()
      .then(() => {
        snackbarOk.value = 'PDF generado correctamente';
        snackbarOkPush.value = true;
      })
      .catch(error => {
        console.error('Error al guardar el PDF:', error);
        snackbarError.value = 'Error al generar el PDF';
        snackbarErrorPush.value = true;
      });
  } catch (error) {
    console.error('Error en el proceso de generación de PDF:', error);
    snackbarError.value = 'Error en el proceso de generación de PDF';
    snackbarErrorPush.value = true;
  }
}
</script>

<style scoped>
.pdf-wrapper {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  min-height: 100vh;
  background-color: #f5f5f5;
  padding: 20px;
  font-family: 'Roboto', sans-serif;
}

.modern-bg {
  background: linear-gradient(135deg, #f5f5f5 0%, #e0e0e0 100%);
}

.a4-container {
  width: 210mm;
  min-height: 297mm;
  height: auto;
  padding: 10mm;
  background: white;
  margin: 5px auto;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  page-break-inside: avoid;
}

.modern-document {
  border-radius: 8px;
  overflow: visible;
}

.header-card {
  background: white;
  padding: 16px;
  border-bottom: 1px solid #eaeaea;
}

.logo-container {
  background: white;
  border-radius: 50%;
  padding: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.logo {
  max-width: 48px;
  min-width: 48px;
  width: 100%;
  height: auto;
  padding: 0;
  margin: 0 auto;
  display: block;
}

.header-title {
  font-size: 1rem;
  font-weight: 600;
  text-align: center;
  margin-bottom: 4px;
  line-height: 1.2;
  color: #333;
}

.header-subtitle {
  font-size: 0.85rem;
  font-weight: 400;
  text-align: center;
  margin: 0;
  color: #666;
}

.certificate-title-card {
  border-radius: 4px;
  overflow: hidden;
}

.modern-text {
  font-size: 0.85rem !important;
  line-height: 1.6 !important;
  color: #424242;
}

.subtitle-section {
  font-size: 0.9rem;
  font-weight: 500;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.modern-input .v-field__input {
  font-size: 0.85rem !important;
  color: #333 !important;
}

.modern-input .v-field__prepend-inner {
  color: var(--v-primary-base) !important;
}

.table-responsive {
  width: 100%;
  overflow-x: auto;
}

.modern-table {
  border-collapse: collapse;
  width: 100%;
  table-layout: fixed;
  page-break-inside: auto;
}

.modern-table thead {
  display: table-header-group;
}

.modern-table tbody {
  page-break-inside: auto;
}

.modern-table tr {
  page-break-inside: avoid;
  page-break-after: auto;
}

.modern-table th {
  font-size: 0.85rem !important;
  font-weight: 600 !important;
  padding: 12px !important;
  background-color: #f5f5f5 !important;
  color: #333;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.modern-table td {
  padding: 12px !important;
  border: 1px solid #eaeaea !important;
  vertical-align: middle;
}

.lindero-row {
  height: 48px;
}

.table-data {
  display: block;
  font-size: 0.85rem;
  padding: 4px 8px;
  white-space: normal;
  overflow-wrap: break-word;
  word-wrap: break-word;
  word-break: break-word;
}

.modern-table-input {
  font-size: 0.85rem !important;
  color: #333 !important;
  border: none !important;
}

.firma-container {
  margin-top: 60px;
  padding-top: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 300px;
  margin-left: auto;
  margin-right: auto;
}

.linea-firma {
  width: 200px;
  border-bottom: 1px solid black;
  margin-bottom: 5px;
}

.firma-text {
  font-size: 13px;
  font-weight: bold;
  margin-bottom: 0;
  text-transform: uppercase;
}

.cargo-text {
  font-size: 12px;
  margin: 2px 0;
}

.intro-card, .data-card, .linderos-card, .clausula-card, .firmas-card {
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
}

/* Clases para control de paginación */
.no-break {
  page-break-inside: avoid;
}

.page-break-before {
  page-break-before: always;
}

.page-break-after {
  page-break-after: always;
}

@page {
  size: A4 portrait;
  margin: 0;
}

@media print {
  html, body {
    width: 210mm;
    height: auto;
    margin: 0;
    padding: 0;
  }
  
  .no-print {
    display: none !important;
  }
  
  .pdf-wrapper {
    padding: 0 !important;
    margin: 0 !important;
    background-color: white !important;
    background: none !important;
    min-height: auto !important;
  }
  
  .a4-container {
    box-shadow: none !important;
    padding: 10mm !important;
    margin: 0 !important;
    width: 210mm !important;
    min-height: auto !important;
    height: auto !important;
    border-radius: 0 !important;
    overflow: visible !important;
    page-break-inside: auto !important;
  }
  
  .header-card, .certificate-title-card, .intro-card, 
  .data-card, .linderos-card, .clausula-card, .firmas-card {
    box-shadow: none !important;
    border: none !important;
    page-break-inside: avoid !important;
    margin-bottom: 10mm !important;
  }
  
  .modern-text {
    font-size: 0.9rem !important;
    color: black !important;
  }
  
  .modern-input .v-field__input {
    font-size: 0.85rem !important;
    color: black !important;
  }
  
  .modern-table {
    page-break-inside: auto !important;
    width: 100% !important;
  }
  
  .modern-table thead {
    display: table-header-group !important;
  }
  
  .modern-table tr {
    page-break-inside: avoid !important;
    page-break-after: auto !important;
  }
  
  .modern-table th {
    font-size: 0.85rem !important;
    background-color: #f5f5f5 !important;
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }
  
  .modern-table-input {
    font-size: 0.85rem !important;
    color: black !important;
  }
  
  .firma-text, .cargo-text {
    color: black !important;
    font-size: 12px !important;
  }
  
  /* Evitar saltos de página en lugares inapropiados */
  .firmas-card {
    page-break-before: auto !important;
  }
  
  /* Ajustes adicionales para las firmas en impresión */
  .firma-container {
    margin-top: 40px !important;
  }
  
  .linea-firma {
    border-bottom: 1px solid black !important;
  }
  
  /* Asegurar que los colores se impriman */
  * {
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }
}
</style>
