<template>
  <v-container class="main-container">
    <!-- Encabezado con logo y título -->
    <v-card class="mb-4 py-2 header-card" elevation="3">
      <div class="header-accent-line"></div>
      <v-card-text class="py-1">
        <v-row align="center" justify="center">
          <v-col cols="12" sm="3" class="text-center">
            <img src="@/assets/logo_trasparente.png" alt="Logo de Cayambe" height="60" class="logo-shadow" />
          </v-col>
          <v-col cols="12" sm="9" class="text-center text-sm-left">
            <h1 class="text-h5 font-weight-bold title-text">CREAR INFORME DE COMPATIBILIDAD DE USO DE SUELO</h1>
            <h2 class="text-caption text-wrap subtitle-text">Gobierno Autónomo Descentralizado Intercultural y Plurinacional del Municipio de Cayambe</h2>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <!-- Estado de carga principal -->
    <div v-if="cargando" class="d-flex justify-center align-center my-8">
      <v-progress-circular indeterminate color="primary" :size="64" :width="6" class="mr-4"></v-progress-circular>
      <span class="text-body-1 font-weight-medium">Procesando datos del certificado...</span>
    </div>

    <!-- Estado de error principal -->
    <v-alert
      v-if="error"
      type="error"
      border="left"
      prominent
      elevation="2"
      class="my-4"
    >
      <template v-slot:prepend>
        <v-icon large color="error">mdi-alert-circle-outline</v-icon>
      </template>
      <div class="d-flex flex-column">
        <strong class="text-h6 mb-1">Ocurrió un error</strong>
        <span>{{ error }}</span>
        <v-btn 
          color="error" 
          text 
          class="mt-2 px-0" 
          @click="reintentar"
        >
          <v-icon left>mdi-refresh</v-icon>
          Reintentar
        </v-btn>
      </div>
    </v-alert>

    <!-- Formulario de creación de ICUS -->
    <v-form ref="form" v-model="formularioValido" @submit.prevent="guardarIcus" v-if="!cargando && !error">
      <v-row>
        <!-- Columna izquierda: Datos del predio -->
        <v-col cols="12" lg="6">
          <v-card outlined class="pa-4 mb-4">
            <v-card-title class="text-h6 font-weight-bold pb-2 primary--text">
              <v-icon left class="mr-2">mdi-home-city-outline</v-icon>
              DATOS DEL PREDIO
            </v-card-title>
            
            <v-divider class="mb-4"></v-divider>
            
            <v-row dense>
              <v-col cols="12" sm="6" class="mb-2">
                <v-text-field
                  v-model="formData.clave_catastral"
                  label="Clave Catastral"
                  outlined
                  dense
                  readonly
                  hint="Clave catastral del predio"
                ></v-text-field>
              </v-col>
              
              <v-col cols="12" sm="6" class="mb-2">
                <v-text-field
                  v-model="formData.clave_anterior"
                  label="Clave Anterior"
                  outlined
                  dense
                  readonly
                  hint="Clave catastral anterior"
                ></v-text-field>
              </v-col>
              
              <v-col cols="12" sm="6" class="mb-2">
                <v-text-field
                  v-model="formData.parroquia"
                  label="Parroquia"
                  outlined
                  dense
                  readonly
                  hint="Parroquia del predio"
                ></v-text-field>
              </v-col>
              
              <v-col cols="12" sm="6" class="mb-2">
                <v-text-field
                  v-model="formData.sector"
                  label="Sector"
                  outlined
                  dense
                  readonly
                  hint="Sector del predio"
                ></v-text-field>
              </v-col>
            </v-row>
            
            <v-divider class="my-3"></v-divider>
            
            <v-card-title class="subtitle-1 font-weight-medium pb-2 primary--text">
              <v-icon left small class="mr-2">mdi-ruler-square</v-icon>
              ÁREAS
            </v-card-title>
            
            <v-row dense>
              <v-col cols="12" sm="4" class="mb-2">
                <v-text-field
                  v-model="formData.area_escritura"
                  label="Área Escritura"
                  outlined
                  dense
                  readonly
                  suffix="m²"
                  hint="Área según escritura"
                ></v-text-field>
              </v-col>
              
              <v-col cols="12" sm="4" class="mb-2">
                <v-text-field
                  v-model="formData.area_grafica"
                  label="Área Gráfica"
                  outlined
                  dense
                  readonly
                  suffix="m²"
                  hint="Área gráfica"
                ></v-text-field>
              </v-col>
              
              <v-col cols="12" sm="4" class="mb-2">
                <v-text-field
                  v-model="formData.area_construccion"
                  label="Área Construcción"
                  outlined
                  dense
                  readonly
                  suffix="m²"
                  hint="Área de construcción"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-card>
          
          <v-card outlined class="pa-4 mb-4">
            <v-card-title class="text-h6 font-weight-bold pb-2 primary--text">
              <v-icon left class="mr-2">mdi-account-outline</v-icon>
              DATOS DEL TITULAR
            </v-card-title>
            
            <v-divider class="mb-4"></v-divider>
            
            <v-row dense>
              <v-col cols="12" class="mb-2">
                <v-text-field
                  v-model="formData.propietario"
                  label="Nombre Completo"
                  outlined
                  dense
                  readonly
                  hint="Nombre completo del titular"
                ></v-text-field>
              </v-col>
              
              <v-col cols="12" sm="6" class="mb-2">
                <v-text-field
                  v-model="formData.numero_documento"
                  label="Documento de Identidad"
                  outlined
                  dense
                  readonly
                  hint="Documento de identidad del titular"
                ></v-text-field>
              </v-col>
              
              <v-col cols="12" sm="6" class="mb-2">
                <v-select
                  v-model="formData.derechos_acciones"
                  :items="['SI', 'NO']"
                  label="¿Derechos y acciones?"
                  outlined
                  dense
                  hint="Indica si el predio está en derechos y acciones"
                ></v-select>
              </v-col>
            </v-row>
          </v-card>
        </v-col>
        
        <!-- Columna derecha: Datos de compatibilidad -->
        <v-col cols="12" lg="6">
          <v-card outlined class="pa-4 mb-4">
            <v-card-title class="text-h6 font-weight-bold pb-2 primary--text">
              <v-icon left class="mr-2">mdi-map-marker-outline</v-icon>
              DATOS DE USO DE SUELO
            </v-card-title>
            
            <v-divider class="mb-4"></v-divider>
            
            <v-row dense>
              <v-col cols="12" sm="3" class="mb-2">
                <v-text-field
                  v-model="formData.id_suelo"
                  label="Código Uso"
                  outlined
                  dense
                  readonly
                  hint="Código de uso de suelo"
                ></v-text-field>
              </v-col>
              
              <v-col cols="12" sm="9" class="mb-2">
                <v-text-field
                  v-model="formData.uso_suelo"
                  label="Uso de Suelo"
                  outlined
                  dense
                  readonly
                  hint="Descripción del uso de suelo"
                ></v-text-field>
              </v-col>
            </v-row>
            
            <v-divider class="my-3"></v-divider>
            
            <v-card-title class="subtitle-1 font-weight-medium pb-2 primary--text">
              <v-icon left small class="mr-2">mdi-tag-multiple-outline</v-icon>
              ACTIVIDAD Y TIPOLOGÍA
            </v-card-title>
            
            <v-row dense>
              <v-col cols="12" sm="3" class="mb-2">
                <v-text-field
                  v-model="formData.id_actividad"
                  label="Código Act."
                  outlined
                  dense
                  readonly
                  hint="Código de actividad"
                ></v-text-field>
              </v-col>
              
              <v-col cols="12" sm="9" class="mb-2">
                <v-text-field
                  v-model="formData.actividad"
                  label="Actividad"
                  outlined
                  dense
                  readonly
                  hint="Descripción de la actividad"
                ></v-text-field>
              </v-col>
              
              <v-col cols="12" sm="3" class="mb-2">
                <v-text-field
                  v-model="formData.id_tipologia"
                  label="Código Tip."
                  outlined
                  dense
                  readonly
                  hint="Código de tipología"
                ></v-text-field>
              </v-col>
              
              <v-col cols="12" sm="9" class="mb-2">
                <v-text-field
                  v-model="formData.tipologia"
                  label="Tipología"
                  outlined
                  dense
                  readonly
                  hint="Descripción de la tipología"
                ></v-text-field>
              </v-col>
            </v-row>
            
            <v-divider class="my-3"></v-divider>
            
            <v-card-title class="subtitle-1 font-weight-medium pb-2 primary--text">
              <v-icon left small class="mr-2">mdi-check-circle-outline</v-icon>
              RESULTADO DE COMPATIBILIDAD
            </v-card-title>
            
            <v-row>
              <v-col cols="12" class="mb-2">
                <v-select
                  v-model="formData.compatibilidad"
                  :items="['COMPATIBLE', 'CONDICIONADO', 'NO COMPATIBLE → PROHIBIDO']"
                  label="Resultado de compatibilidad"
                  outlined
                  dense
                  required
                  :rules="[v => !!v || 'Este campo es obligatorio']"
                  hint="Resultado de la evaluación de compatibilidad"
                  :menu-props="{ offsetY: true }"
                  :item-color="getCompatibilidadColor(formData.compatibilidad)"
                >
                  <template v-slot:selection="{ item }">
                    <v-chip
                      :color="getCompatibilidadColor(item)"
                      text-color="white"
                      small
                      class="font-weight-bold"
                      label
                    >
                      {{ item }}
                    </v-chip>
                  </template>
                  <template v-slot:item="{ item }">
                    <v-chip
                      :color="getCompatibilidadColor(item)"
                      text-color="white"
                      small
                      class="font-weight-bold mr-2"
                      label
                    >
                      {{ item }}
                    </v-chip>
                  </template>
                </v-select>
              </v-col>
              
              <v-col cols="12" class="mb-2">
                <v-textarea
                  v-model="formData.resultado_informe"
                  label="Informe de Resultados"
                  outlined
                  dense
                  required
                  :rules="[v => !!v || 'Este campo es obligatorio']"
                  hint="Descripción detallada del resultado del informe"
                  rows="4"
                  counter="500"
                  maxlength="500"
                ></v-textarea>
              </v-col>
            </v-row>
          </v-card>
          
          <v-card outlined class="pa-4 mb-4">
            <v-card-title class="text-h6 font-weight-bold pb-2 primary--text">
              <v-icon left class="mr-2">mdi-text-box-outline</v-icon>
              NOTAS ADICIONALES
            </v-card-title>
            
            <v-divider class="mb-4"></v-divider>
            
            <v-row>
              <v-col cols="12" class="mb-2">
                <v-textarea
                  v-model="formData.notas"
                  label="Notas"
                  outlined
                  dense
                  hint="Notas o aclaraciones adicionales para el informe"
                  rows="3"
                  counter="300"
                  maxlength="300"
                ></v-textarea>
              </v-col>
            </v-row>
          </v-card>
        </v-col>
      </v-row>
      
      <!-- Botones de acción -->
      <v-card outlined class="pa-4 mb-4">
        <v-row>
          <v-col cols="12" class="d-flex justify-end">
            <v-btn
              color="error"
              text
              @click="cancelar"
              :disabled="cargando"
              class="mr-4"
            >
              <v-icon left>mdi-cancel</v-icon>
              Cancelar
            </v-btn>
            
            <v-btn
              color="success"
              type="submit"
              :loading="cargando"
              :disabled="!formularioValido || cargando"
              depressed
            >
              <v-icon left>mdi-content-save</v-icon>
              Guardar ICUS
            </v-btn>
          </v-col>
        </v-row>
      </v-card>
    </v-form>
    
    <!-- Snackbar para alertas -->
    <v-snackbar
      v-model="snackbar.show"
      :color="snackbar.color"
      :timeout="snackbar.timeout"
      top
    >
      {{ snackbar.text }}
      <template v-slot:action="{ attrs }">
        <v-btn
          text
          v-bind="attrs"
          @click="snackbar.show = false"
        >
          Cerrar
        </v-btn>
      </template>
    </v-snackbar>

    <!-- Diálogo de confirmación -->
    <v-dialog v-model="confirmarDialogo" max-width="500px">
      <v-card>
        <v-card-title class="headline primary--text">
          <v-icon left color="primary" class="mr-2">mdi-check-circle</v-icon>
          ICUS Creado Exitosamente
        </v-card-title>
        <v-card-text class="pa-4 mt-4">
          <p>Se ha guardado correctamente el Informe de Compatibilidad de Uso de Suelo con ID <strong>#{{ idIcusCreado }}</strong>.</p>
          <p>¿Qué deseas hacer a continuación?</p>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn 
            color="primary" 
            text 
            @click="irAListado"
          >
            <v-icon left>mdi-format-list-bulleted</v-icon>
            Volver al Listado
          </v-btn>
          <v-btn 
            color="success" 
            depressed 
            @click="verReporte"
          >
            <v-icon left>mdi-file-document-outline</v-icon>
            Ver Reporte ICUS
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import { ref, reactive, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import axios from 'axios';
import API_BASE_URL from '@/config/apiConfig';

export default {
  name: 'CrearIcus',
  
  setup() {
    const router = useRouter();
    const route = useRoute();
    
    // Referencias
    const form = ref(null);
    
    // Estado
    const cargando = ref(false);
    const error = ref(null);
    const formularioValido = ref(false);
    const confirmarDialogo = ref(false);
    const idIcusCreado = ref(null);
    
    // Datos del formulario
    const formData = reactive({
      // Datos del predio
      clave_catastral: '',
      clave_anterior: '',
      parroquia: '',
      nombre_parroquia: '',
      id_par: '',
      sector: '',
      area_escritura: '',
      area_grafica: '',
      area_gis: '',
      area_construccion: '',
      frente: '',
      
      // Datos del titular
      propietario: '',
      numero_documento: '',
      derechos_acciones: 'NO',
      ph: 'NO',
      
      // Datos de uso de suelo
      id_suelo: '',
      uso_suelo: '',
      
      // Datos de actividad y tipología
      id_actividad: '',
      actividad: '',
      id_tipologia: '',
      tipologia: '',
      
      // Datos de compatibilidad
      compatibilidad: '',
      resultado_informe: '',
      notas: '',
      
      // Datos adicionales
      fecha: new Date().toISOString().split('T')[0],
      usuario: localStorage.getItem('user') || 'SISTEMA',
      id_predio: null,
    });
    
    // Estado para el snackbar
    const snackbar = reactive({
      show: false,
      text: '',
      color: 'info',
      timeout: 5000
    });
    
    // Cargar datos del query param
    const cargarDatosTitular = () => {
      try {
        // Intentar obtener y parsear los datos del titular
        if (route.query.datosTitular) {
          const datosTitular = JSON.parse(route.query.datosTitular);
          
          console.log('📄 Datos del titular cargados:', datosTitular);
          
          // Datos del predio
          formData.clave_catastral = datosTitular.clave_catastral || '';
          formData.clave_anterior = datosTitular.clave_anterior || '';
          formData.parroquia = datosTitular.parroquia || '';
          formData.nombre_parroquia = datosTitular.parroquia || datosTitular.nombre_parroquia || '';
          formData.id_par = datosTitular.id_par || '';
          formData.sector = datosTitular.sector || '';
          formData.area_escritura = datosTitular.area_escritura || '';
          formData.area_grafica = datosTitular.area_grafica || datosTitular.area_gis || '';
          formData.area_gis = datosTitular.area_gis || datosTitular.area_grafica || '';
          formData.area_construccion = datosTitular.area_construccion || '0';
          formData.frente = datosTitular.frente || '';
          
          // Datos del titular
          formData.propietario = datosTitular.propietario || datosTitular.nombres || '';
          formData.numero_documento = datosTitular.numero_documento || datosTitular.ci || '';
          formData.derechos_acciones = datosTitular.derechos_acciones === 'SI' ? 'SI' : 'NO';
          formData.ph = datosTitular.ph === 'SI' ? 'SI' : 'NO';
          
          // ID de predio si existe
          formData.id_predio = datosTitular.id || datosTitular.id_predio || null;
        }
        
        // Intentar obtener y parsear los datos PUGS
        if (route.query.datosPugs) {
          const datosPugs = JSON.parse(route.query.datosPugs);
          
          console.log('🌎 Datos PUGS cargados:', datosPugs);
          
          // Datos de uso de suelo
          formData.id_suelo = datosPugs.id_suelo || '';
          formData.uso_suelo = datosPugs.uso_suelo || '';
          
          // Datos de actividad y tipología
          formData.id_actividad = datosPugs.id_actividad || '';
          formData.actividad = datosPugs.actividad || '';
          formData.id_tipologia = datosPugs.id_tipologia || '';
          formData.tipologia = datosPugs.tipologia || '';
          
          // Datos de compatibilidad
          if (datosPugs.compatibilidad) {
            let compatibilidad = datosPugs.compatibilidad.toUpperCase();
            
            if (compatibilidad.includes('NO COMPATIBLE')) {
              formData.compatibilidad = 'NO COMPATIBLE → PROHIBIDO';
            } else if (compatibilidad.includes('CONDICION')) {
              formData.compatibilidad = 'CONDICIONADO';
            } else if (compatibilidad.includes('COMPATIBLE')) {
              formData.compatibilidad = 'COMPATIBLE';
            }
            
            // Generar un texto de resultado predeterminado
            generarTextoResultado();
          }
        }
        
        // Verificar si se proporcionó una clave catastral directamente
        if (route.query.claveCatastral && !formData.clave_catastral) {
          formData.clave_catastral = route.query.claveCatastral;
        }
        
        // Si falta la fecha, establecer la fecha actual
        if (!formData.fecha) {
          formData.fecha = new Date().toISOString().split('T')[0];
        }
      } catch (err) {
        console.error('❌ Error al procesar los datos de entrada:', err);
        error.value = 'Error al procesar los datos proporcionados. Por favor, inténtelo nuevamente.';
      }
    };
    
    // Generar texto de resultado predeterminado basado en la compatibilidad
    const generarTextoResultado = () => {
      if (!formData.resultado_informe) {
        const actividad = formData.actividad || 'No especificada';
        const tipologia = formData.tipologia || 'No especificada';
        const uso = formData.uso_suelo || 'No especificado';
        
        if (formData.compatibilidad === 'COMPATIBLE') {
          formData.resultado_informe = `Se determina que la actividad "${actividad}" con tipología "${tipologia}", ES COMPATIBLE con el uso de suelo "${uso}" en la zona especificada. El propietario puede desarrollar esta actividad cumpliendo con la normativa vigente.`;
        } else if (formData.compatibilidad === 'CONDICIONADO') {
          formData.resultado_informe = `Se determina que la actividad "${actividad}" con tipología "${tipologia}", ES CONDICIONADA para el uso de suelo "${uso}". El propietario deberá cumplir con requisitos adicionales establecidos por la Dirección de Planificación antes de desarrollar esta actividad.`;
        } else if (formData.compatibilidad === 'NO COMPATIBLE → PROHIBIDO') {
          formData.resultado_informe = `Se determina que la actividad "${actividad}" con tipología "${tipologia}", NO ES COMPATIBLE con el uso de suelo "${uso}" en la zona especificada. El propietario NO puede desarrollar esta actividad en este predio según la normativa vigente.`;
        }
      }
    };
    
    // Método para guardar el ICUS
    const guardarIcus = async () => {
      try {
        if (!form.value.validate()) {
          showSnackbar('Por favor, complete todos los campos obligatorios', 'warning');
          return;
        }
        
        cargando.value = true;
        error.value = null;
        
        // Preparar los datos para guardar
        const datosGuardar = {
          ...formData
        };
        
        console.log('💾 Guardando datos del ICUS:', datosGuardar);
        
        // Realizar la petición POST al backend
        const response = await axios.post(`${API_BASE_URL}/icus/crearIcus`, datosGuardar);
        
        console.log('✅ Respuesta del servidor:', response.data);
        
        // Actualizar el estado de la interfaz
        idIcusCreado.value = response.data.id;
        confirmarDialogo.value = true;
        
        showSnackbar('ICUS creado exitosamente', 'success');
      } catch (err) {
        console.error('❌ Error al guardar el ICUS:', err);
        let errorMsg = 'Ocurrió un error al guardar el ICUS';
        
        if (err.response) {
          errorMsg += `: ${err.response.data.message || err.response.statusText}`;
        }
        
        error.value = errorMsg;
        showSnackbar(errorMsg, 'error');
      } finally {
        cargando.value = false;
      }
    };
    
    // Método para reintentar después de un error
    const reintentar = () => {
      error.value = null;
      cargarDatosTitular();
    };
    
    // Método para cancelar y volver al listado
    const cancelar = () => {
      router.push('/busqueda-icus');
    };
    
    // Método para ir al listado después de crear
    const irAListado = () => {
      router.push('/busqueda-icus');
    };
    
    // Método para ver el reporte del ICUS
    const verReporte = () => {
      router.push({
        name: 'ReporteIcus',
        params: { id: idIcusCreado.value }
      });
    };
    
    // Método para obtener color según el tipo de compatibilidad
    const getCompatibilidadColor = (compatibilidad) => {
      if (!compatibilidad) return 'grey';
      
      const comp = compatibilidad.toLowerCase();
      if (comp.includes('no compatible')) return 'error';
      if (comp.includes('condicion')) return 'warning';
      if (comp.includes('compatible')) return 'success';
      return 'grey';
    };
    
    // Método para mostrar snackbar
    const showSnackbar = (text, color = 'info', timeout = 5000) => {
      snackbar.text = text;
      snackbar.color = color;
      snackbar.timeout = timeout;
      snackbar.show = true;
    };
    
    // Inicialización del componente
    onMounted(() => {
      cargarDatosTitular();
    });
    
    return {
      form,
      formData,
      cargando,
      error,
      formularioValido,
      snackbar,
      confirmarDialogo,
      idIcusCreado,
      guardarIcus,
      reintentar,
      cancelar,
      irAListado,
      verReporte,
      getCompatibilidadColor,
      generarTextoResultado
    };
  }
};
</script>

<style scoped>
/* Container styles */
.main-container {
  background: linear-gradient(135deg, #f5f7fa 0%, #ebf0f6 100%);
  min-height: calc(100vh - 56px);
  padding: 20px 16px;
  border-radius: 8px;
}

/* Header card styles */
.header-card {
  background: linear-gradient(to right, #ffffff, #f8f9fa);
  border-radius: 8px;
  position: relative;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(39, 110, 144, 0.08) !important;
  border: 1px solid #e0e0e0;
}

.header-accent-line {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(to right, #276E90, #4C7031);
}

.title-text {
  line-height: 1.2;
  margin-bottom: 4px;
  color: #276E90;
  text-shadow: 0 1px 0 rgba(255, 255, 255, 0.7);
}

.subtitle-text {
  line-height: 1.2;
  color: rgba(0, 0, 0, 0.7);
}

.logo-shadow {
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
}

/* Responsive styles */
@media (max-width: 600px) {
  .main-container {
    padding: 10px 8px;
  }
  
  .title-text {
    font-size: 1.2rem !important;
  }
  
  .subtitle-text {
    font-size: 0.7rem !important;
  }
}
</style>
