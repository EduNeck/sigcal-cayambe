<template>
  <div class="pagina-fondo">
    <!-- Pantalla de carga -->
    <div v-if="loading" class="loading-container">
      <v-progress-circular
        indeterminate
        color="primary"
        size="64"
      ></v-progress-circular>
      <p class="mt-4">Cargando datos del informe...</p>
    </div>
    
    <!-- Mensaje de error -->
    <div v-else-if="error" class="error-container">
      <v-alert
        type="error"
        prominent
        border-color="error"
        elevation="2"
        class="error-alert"
      >
        <v-icon large class="mr-3">mdi-alert-circle</v-icon>
        <div>
          <h3>Error al cargar el informe</h3>
          <p>{{ error }}</p>
          <v-btn
            color="primary"
            class="mt-3"
            @click="volverABusqueda"
          >
            Volver a la búsqueda
          </v-btn>
        </div>
      </v-alert>
    </div>

    <!-- Advertencia de datos incompletos -->
    <div v-else-if="datosTitular && (!datosTitular.clave_catastral || !datosTitular.nombres)" class="datos-incompletos-container">
      <v-alert
        type="warning"
        prominent
        border-color="warning"
        elevation="2"
      >
        <v-icon large class="mr-3">mdi-alert</v-icon>
        <div>
          <h3>Datos incompletos del predio</h3>
          <p>El predio seleccionado no tiene todos los datos necesarios para generar un informe completo.</p>
          <v-btn
            color="primary"
            class="mt-3"
            @click="volverABusqueda"
          >
            Volver a la búsqueda
          </v-btn>
        </div>
      </v-alert>
    </div>
    
    <!-- Contenido del informe -->
    <div v-else id="reporteIRM" class="reporte-a4">
      <!-- CABECERA -->
        <header class="reporte-header">
            <div class="header-top">
                <img src="../assets/logo_ventana.png" alt="Logo Municipio" class="logo-municipio" />
                <div class="titulo-municipio">
                <h2>INFORME DE REGULACIÓN MUNICIPAL</h2>
                <p class="entidad">Gobierno Autónomo Descentralizado Intercultural y Plurinacional del Municipio de Cayambe</p>
                </div>
            </div>
        </header>


      <!-- CUERPO DEL REPORTE -->
      <main class="reporte-body">
        <!-- INFORMACION CERTIFICADO -->
        <section class="seccion">
          <v-row>
            <v-col cols="6">
              <p><strong>FECHA:</strong> {{ fechaActual }}</p>
            </v-col>
            <v-col cols="6" class="text-end">
              <p><strong>IRM N°:</strong> {{ numeroIRM }}</p>
            </v-col>
          </v-row>
        </section>  
        <!-- INFORMACION CERTIFICADO -->
        <section class="seccion">
          <v-row>
            <v-col cols="6">
              <p>
                <strong>INFORMACIÓN PREDIAL {{ datosTitular.derechos === 'SI' ? 'EN DERECHOS Y ACCIONES' : 'EN UNIPROPIEDAD' }}</strong> 
                {{ datosTitular.tipo_predio || 'URBANO' }}
              </p>
            </v-col>
            <v-col cols="6" class="text-end">
              <p><strong> *IMPLANTACIÓN GRÁFICA DEL LOTE</strong></p>
            </v-col>
          </v-row>
        </section>            

        <!-- DATOS DEL TITULAR -->
        <section class="seccion">
          <h3>DATOS DEL TITULAR DE DOMINIO</h3>
          <p><strong>C.C./R.U.C:</strong> {{ datosTitular.numero_documento || 'No especificado' }}</p>
          <p><strong>Nombre o razón social:</strong> {{ datosTitular.nombres || 'No especificado' }}</p>
          <p v-if="datosTitular.representante"><strong>Representante legal:</strong> {{ datosTitular.representante }}</p>
        </section>

        <!-- DATOS DEL PREDIO -->
        <section class="seccion">
            <v-row>
                <v-col cols="6">
                    <h3>DATOS DEL PREDIO</h3>
                    <p><strong>Clave catastral:</strong> {{ datosTitular.clave_catastral || 'No especificada' }}</p>
                    <p v-if="datosTitular.clave_catastral_anterior"><strong>Clave catastral anterior:</strong> {{ datosTitular.clave_catastral_anterior }}</p>
                    <p><strong>En derechos y acciones:</strong> {{ datosTitular.derechos === 'SI' ? 'SÍ' : 'NO' }}</p>
                    <p><strong>Área de construcción:</strong> {{ valorFormateado.areaConstruida }} m²</p>
                    <h3>DATOS DEL LOTE</h3>
                    <p><strong>Área según escritura:</strong> {{ valorFormateado.areaEscritura }} m²</p>
                    <p><strong>Área gráfica:</strong> {{ valorFormateado.areaGrafica }} m²</p>
                    <p><strong>Frente:</strong> {{ valorFormateado.frente }} m</p>
                    <p><strong>Tiene construcción:</strong> {{ datosTitular.tiene_construccion === 'SI' ? 'SÍ' : 'NO' }}</p>
                    <p><strong>Parroquia:</strong> {{ datosTitular.parroquia || 'No especificada' }}</p>
                    <p><strong>Barrio/Sector:</strong> {{ datosTitular.sector || 'No especificado' }}</p>
                </v-col>
                <v-col cols="6" class="croquis-container">
                    <!-- Mostrar indicador de carga mientras se genera el croquis -->
                    <div v-if="croquisLoading" class="croquis-loading">
                      <v-progress-circular indeterminate color="primary" size="32"></v-progress-circular>
                      <p class="mt-2">Generando croquis...</p>
                    </div>
                    
                    <!-- Mostrar mensaje de error si no se pudo generar el croquis -->
                    <div v-else-if="croquisError" class="croquis-error">
                      <v-icon color="error" size="48">mdi-map-marker-off</v-icon>
                      <p class="mt-2">{{ croquisError }}</p>
                    </div>
                    
                    <!-- Mostrar croquis si está disponible -->
                    <img v-else-if="croquisUrl" :src="croquisUrl" alt="Croquis del predio" class="croquis-implantacion" @error="croquisError = 'Error al cargar la imagen del croquis'" />
                    
                    <!-- Mostrar imagen por defecto si no hay croquis -->
                    <img v-else src="../assets/sin-croquis.png" alt="Sin Croquis" class="croquis-implantacion" />
                </v-col>
            </v-row>
        </section>

        <!-- NOTAS IRM -->
        <section class="seccion">
          <h3>NOTAS IRM</h3>
          <p>- PREDIO SIN ACCESO CATASTRADO</p>
        </section>

        <!-- REGULACIONES -->
        <section class="seccion">
          <h3>REGULACIONES Y ZONIFICACIÓN</h3>
          <p><strong>Zona:</strong> (C3) C2003-80</p>
          <p><strong>Altura máxima:</strong> 9 m</p>
          <p><strong>Número de pisos:</strong> 3</p>
          <p><strong>Frontal:</strong> 3 m</p>
          <p><strong>Lateral 1:</strong> 0 m</p>
          <p><strong>Lateral 2:</strong> 0 m</p>
          <p><strong>Posterior:</strong> 3 m</p>
          <p><strong>Entre bloques:</strong> 6 m</p>
          <p><strong>Forma de ocupación del suelo:</strong> (C) CONTINUA</p>
          <p><strong>Lote mínimo:</strong> 200 m²</p>
          <p><strong>Frente mínimo:</strong> 10 m</p>
          <p><strong>COS PB:</strong> 80.00%</p>
          <p><strong>COS TOTAL:</strong> 240.00%</p>
          <p><strong>Clasificación de suelo:</strong> (SU) SUELO URBANO NO CONSOLIDADO</p>
          <p><strong>Uso de suelo:</strong> (R2A) RESIDENCIAL 2A</p>
        </section>

        <!-- SERVICIOS BÁSICOS -->
        <section class="seccion">
          <h3>COBERTURA DE SERVICIOS BÁSICOS</h3>
          <p><strong>Abastecimiento de agua:</strong> No tiene</p>
          <p><strong>Alcantarillado:</strong> No tiene</p>
          <p><strong>Energía eléctrica:</strong> No tiene</p>
          <p><strong>Otros:</strong> Transporte público</p>
        </section>

        <!-- NOTAS FINALES -->
        <section class="seccion texto-legal">
          <h3>NOTAS</h3>
          <ul>
            <li>Los datos están referidos al Plan de Uso y Ocupación del Suelo vigente.</li>
            <li>La información consta en los archivos catastrales del GAD.</li>
            <li>Este informe no representa título legal alguno.</li>
            <li>No autoriza trabajos de construcción ni fraccionamientos.</li>
            <li>Validez de 2 años a partir de su emisión.</li>
            <li>Volado a calle máximo 60 cm.</li>
            <li>Radio de curvatura en esquinas: 3,00 m.</li>
            <li>Predios colindantes a Panamericana E35-E28: acera de 2.50 m desde cuneta.</li>
          </ul>
        </section>
      </main>

      <!-- PIE DE PÁGINA -->
      <footer class="reporte-footer">
        <p>Gobierno Autónomo Descentralizado Intercultural y Plurinacional del Municipio de Cayambe</p>
        <p>Dirección de Planificación y Ordenamiento Territorial</p>
      </footer>
    </div>
    
    <!-- Botones de acción flotantes -->
    <div class="floating-actions no-print">
      <v-btn
        color="primary"
        fab
        @click="imprimirInforme"
        title="Imprimir informe"
      >
        <v-icon>mdi-printer</v-icon>
      </v-btn>
      <v-btn
        color="secondary"
        fab
        class="mt-2"
        @click="volverABusqueda"
        title="Volver a la búsqueda"
      >
        <v-icon>mdi-arrow-left</v-icon>
      </v-btn>
    </div>

    <!-- Snackbar para notificaciones -->
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
  </div>
</template>

<script>
import { ref, reactive, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import format from 'date-fns/format';
import es from 'date-fns/locale/es';
import datosTitularService from '@/services/datosTitularService';
import { generarUrlCroquis, verificarPredioTieneCoordenadas } from '@/utils/croquisUtils';

export default {
  name: 'ReporteIRM',
  setup() {
    const route = useRoute();
    const router = useRouter();
    const datosTitular = ref({});
    const fechaActual = ref(format(new Date(), "dd 'de' MMMM 'de' yyyy, HH:mm:ss", { locale: es }));
    const numeroIRM = ref(generateIRMNumber());
    const loading = ref(false);
    const error = ref(null);
    const croquisUrl = ref('');
    const croquisLoading = ref(false);
    const croquisError = ref(null);
    
    // Estado para el snackbar
    const snackbar = reactive({
      show: false,
      text: '',
      color: 'info',
      timeout: 3000
    });
    
    // Valores formateados para los campos numéricos
    const valorFormateado = computed(() => ({
      areaEscritura: formatearNumero(datosTitular.value?.area_escritura || 0),
      areaGrafica: formatearNumero(datosTitular.value?.area_grafica || 0),
      areaConstruida: formatearNumero(datosTitular.value?.area_construida || 0),
      frente: formatearNumero(datosTitular.value?.frente || 0),
    }));

    // Generar un número de IRM único basado en la fecha
    function generateIRMNumber() {
      const year = new Date().getFullYear();
      // Último número de 5 dígitos basado en timestamp (será único)
      const unique = Math.floor(10000 + Math.random() * 90000);
      return `IRM-${year}-${unique}`;
    }
    
    // Formatear números para mostrar con 2 decimales
    function formatearNumero(valor) {
      if (valor === null || valor === undefined) return '0.00';
      return parseFloat(valor).toFixed(2);
    }

    // Método para mostrar notificaciones con snackbar
    const mostrarSnackbar = (texto, color = 'info', timeout = 3000) => {
      snackbar.text = texto;
      snackbar.color = color;
      snackbar.timeout = timeout;
      snackbar.show = true;
    };

    // Función para cargar el croquis del predio
    const cargarCroquisPredio = async (claveCatastral) => {
      if (!claveCatastral) return;
      
      croquisLoading.value = true;
      croquisError.value = null;
      
      try {
        const url = await generarUrlCroquis(claveCatastral);
        croquisUrl.value = url;
        
        if (!url) {
          console.warn('No se pudo generar la URL del croquis para la clave catastral:', claveCatastral);
          croquisError.value = 'No se pudo generar el croquis del predio';
        }
      } catch (err) {
        console.error('Error al cargar el croquis del predio:', err);
        croquisError.value = 'Error al cargar el croquis del predio';
      } finally {
        croquisLoading.value = false;
      }
    };
    
    // Función para cargar datos del titular por clave catastral
    const cargarDatosPorClaveCatastral = async (claveCatastral) => {
      loading.value = true;
      error.value = null;
      
      try {
        const response = await datosTitularService.busquedaAvanzada({
          claveCatastral: claveCatastral,
          nombres: '',
          numeroDocumento: ''
        });
        
        if (response.data && response.data.data && response.data.data.length > 0) {
          datosTitular.value = response.data.data[0];
          console.log('Datos del titular cargados por clave catastral:', datosTitular.value);
          mostrarSnackbar(`Informe generado para la clave catastral: ${claveCatastral}`, 'success');
          
          // Una vez cargados los datos, cargamos el croquis
          await cargarCroquisPredio(claveCatastral);
        } else {
          console.warn('No se encontraron datos para la clave catastral:', claveCatastral);
          error.value = `No se encontraron datos para la clave catastral: ${claveCatastral}`;
          mostrarSnackbar(`No se encontraron datos para la clave catastral: ${claveCatastral}`, 'error');
        }
      } catch (err) {
        console.error('Error al cargar datos del titular por clave catastral:', err);
        error.value = 'Error al cargar los datos del titular. Por favor, intente nuevamente.';
        mostrarSnackbar('Error al cargar los datos del titular', 'error');
      } finally {
        loading.value = false;
      }
    };

    onMounted(() => {
      // Primero verificamos si recibimos la clave catastral como parámetro
      const claveCatastral = route.params.claveCatastral;
      const filtro = route.query.filtro;
      
      if (filtro === 'claveCatastral' && claveCatastral) {
        // Decodificamos la clave catastral y cargamos los datos
        const decodedClaveCatastral = decodeURIComponent(claveCatastral);
        cargarDatosPorClaveCatastral(decodedClaveCatastral);
      } 
      // Si no hay clave catastral o hubo un error al cargarla, intentamos usar los datos del titular de la query
      else if (route.query.datosTitular) {
        try {
          datosTitular.value = JSON.parse(route.query.datosTitular);
          console.log('Datos del titular recibidos de query:', datosTitular.value);
        } catch (error) {
          console.error('Error al parsear datos del titular:', error);
          mostrarSnackbar('Error al cargar los datos del informe', 'error');
          error.value = 'Error al procesar los datos del informe';
        }
      } else {
        // Si no tenemos ninguna forma de obtener los datos, mostramos un error
        error.value = 'No se proporcionaron parámetros para generar el informe';
        mostrarSnackbar('No se proporcionaron datos para generar el informe', 'warning');
      }
    });

    // Función para imprimir el informe
    const imprimirInforme = () => {
      if (!datosTitular.value || !datosTitular.value.clave_catastral) {
        mostrarSnackbar('No hay datos válidos para imprimir', 'warning');
        return;
      }
      
      window.print();
      mostrarSnackbar('Impresión iniciada', 'success');
    };
    
    // Función para volver a la pantalla de búsqueda
    const volverABusqueda = () => {
      // Primero intentamos volver atrás en el historial
      // Esto mantiene los filtros de búsqueda anteriores si llegamos desde la búsqueda
      if (window.history.length > 1) {
        window.history.back();
      } else {
        // Si no hay historial, navegamos directamente a la página de búsqueda
        router.push({ name: 'BusquedaTitular' });
      }
    };
    
    return {
      datosTitular,
      fechaActual,
      numeroIRM,
      loading,
      error,
      snackbar,
      valorFormateado,
      formatearNumero,
      imprimirInforme,
      volverABusqueda,
      mostrarSnackbar,
      croquisUrl,
      croquisLoading,
      croquisError
    };
  }
}
</script>

<style scoped>
/* Fondo gris fuera del reporte */
.pagina-fondo {
  background-color: #f0f0f0;
  padding: 20px;
  min-height: 100vh;
  display: flex;
  justify-content: center;
}

/* Contenedor del reporte */
.reporte-a4 {
  background: white;
  width: 210mm;
  min-height: 297mm;
  padding: 20mm;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  font-family: 'Arial', sans-serif;
  font-size: 13px;
  color: #000;
}

/* Cabecera */
.reporte-header {
  margin-bottom: 15px;
}

.header-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo-municipio {
  width: 60px;
  height: auto;
}

.croquis-container {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 280px;
}

.croquis-implantacion {
  width: 100%;
  height: 280px;
  object-fit: contain;
  border: 1px solid #ddd;
}

.croquis-loading, .croquis-error {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 280px;
  background-color: #f9f9f9;
  border: 1px dashed #ccc;
  text-align: center;
  color: #666;
}

.titulo-municipio {
  flex: 1;
  text-align: center;
  padding: 0 10px;
}

.titulo-municipio h2 {
  margin: 0;
  font-size: 16px;
}

.titulo-municipio .entidad {
  font-size: 12px;
  margin-top: 4px;
}

.reporte-info {
  text-align: right;
  font-size: 12px;
  min-width: 120px;
}
/* Secciones */
.seccion {
  margin-bottom: 15px;
}

.seccion h3 {
  font-size: 14px;
  margin-bottom: 6px;
  border-bottom: 1px solid #ccc;
}

.seccion p {
  margin: 2px 0;
}

ul {
  margin: 0;
  padding-left: 16px;
}

ul li {
  font-size: 12px;
  margin-bottom: 4px;
}

/* Pie de página */
.reporte-footer {
  text-align: center;
  font-size: 12px;
  border-top: 1px solid #ccc;
  padding-top: 10px;
  margin-top: 20px;
}

/* Estilos para los botones flotantes */
.floating-actions {
  position: fixed;
  bottom: 20px;
  right: 20px;
  display: flex;
  flex-direction: column;
  z-index: 100;
}

.floating-actions .v-btn {
  box-shadow: 0 3px 5px rgba(0, 0, 0, 0.2);
}

/* Loading Container */
.loading-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 80vh;
  text-align: center;
  color: #276E90;
  font-size: 1.2em;
}

/* Error Container */
.error-container, .datos-incompletos-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 60vh;
  padding: 20px;
}

.error-alert {
  max-width: 600px;
  width: 100%;
}

/* Estilos para impresión */
@media print {
  .pagina-fondo {
    background-color: white !important;
    padding: 0 !important;
  }

  .reporte-a4 {
    box-shadow: none;
    width: auto;
    min-height: auto;
    padding: 0;
    margin: 0;
  }

  .reporte-footer,
  .reporte-header {
    position: fixed;
    left: 0;
    right: 0;
  }

  .reporte-header {
    top: 0;
  }

  .reporte-footer {
    bottom: 0;
  }

  .reporte-body {
    margin-top: 100px;
    margin-bottom: 80px;
  }
  
  .no-print {
    display: none !important;
  }
}
</style>
