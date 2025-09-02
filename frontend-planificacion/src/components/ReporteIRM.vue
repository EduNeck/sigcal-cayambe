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
                <div class="qr-container" v-if="qrCode">
                  <img :src="qrCode" alt="Código QR de verificación" class="qr-image" />
                  <p class="qr-text">Verificación</p>
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
            <v-col cols="12">
              <p>
                <strong>INFORMACIÓN PREDIAL {{ datosTitular.derechos === 'SI' ? 'EN DERECHOS Y ACCIONES' : 'EN UNIPROPIEDAD' }}</strong> 
                {{ datosTitular.tipo_predio || 'URBANO' }}
              </p>
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
                <v-col cols="6">
                    <!-- Columna de información adicional o espacio en blanco -->
                    <div class="info-adicional">
                      <p><strong>NOTA:</strong> Este documento es únicamente informativo.</p>
                      <p>Los datos mostrados corresponden a la información registrada en el sistema catastral.</p>
                    </div>
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
          
          <div v-if="regulacionesLoading" class="loading-info">
            <p>Cargando información de regulaciones...</p>
          </div>
          
          <div v-else-if="regulacionesError" class="error-info">
            <p class="text-error">{{ regulacionesError }}</p>
          </div>
          
          <div v-else-if="regulaciones.length === 0" class="sin-regulaciones">
            <p>No se encontraron regulaciones para este predio.</p>
          </div>
          
          <div v-else>
            <!-- Para cada set de regulaciones mostramos una tarjeta -->
            <div v-for="(reg, index) in regulaciones" :key="index" class="regulacion-card">
              <h4>Regulación {{ index + 1 }}</h4>
              
              <div class="regulaciones-layout">
                <v-row>
                  <!-- PRIMERA COLUMNA: ZONA -->
                  <v-col cols="12" md="5" class="regulaciones-columna">
                    <h5>ZONA</h5>
                    <v-table density="compact" class="regulaciones-table">
                      <tbody>
                        <tr>
                          <td class="text-left font-weight-bold" width="40%">Zona:</td>
                          <td class="text-left">{{ reg.codigo }} {{ reg.zona }}</td>
                        </tr>
                        <tr>
                          <td class="text-left font-weight-bold">Lote mínimo:</td>
                          <td class="text-left">{{ reg.loteMinimo }} m²</td>
                        </tr>
                        <tr>
                          <td class="text-left font-weight-bold">Frente mínimo:</td>
                          <td class="text-left">{{ reg.frenteMinimo }} m</td>
                        </tr>
                        <tr>
                          <td class="text-left font-weight-bold">COS PB:</td>
                          <td class="text-left">{{ reg.cosPb }}%</td>
                        </tr>
                        <tr>
                          <td class="text-left font-weight-bold">COS TOTAL:</td>
                          <td class="text-left">{{ reg.cosTotal }}%</td>
                        </tr>
                        <tr>
                          <td class="text-left font-weight-bold">Forma de ocupación:</td>
                          <td class="text-left">({{ reg.formaOcupacion?.codigo }}) {{ reg.formaOcupacion?.nombre }}</td>
                        </tr>
                        <tr>
                          <td class="text-left font-weight-bold">Clasificación de suelo:</td>
                          <td class="text-left">({{ reg.clasificacionSuelo?.codigo }}) {{ reg.clasificacionSuelo?.nombre }}</td>
                        </tr>
                        <tr>
                          <td class="text-left font-weight-bold">Uso de suelo:</td>
                          <td class="text-left">({{ reg.usoSuelo?.codigo }}) {{ reg.usoSuelo?.nombre }}</td>
                        </tr>
                      </tbody>
                    </v-table>
                  </v-col>
                  
                  <!-- SEGUNDA COLUMNA: PISOS -->
                  <v-col cols="12" md="3" class="regulaciones-columna">
                    <h5>PISOS</h5>
                    <v-table density="compact" class="regulaciones-table">
                      <tbody>
                        <tr>
                          <td class="text-left font-weight-bold">Altura máxima:</td>
                          <td class="text-left">{{ reg.alturaMaxima }} m</td>
                        </tr>
                        <tr>
                          <td class="text-left font-weight-bold">Número de pisos:</td>
                          <td class="text-left">{{ reg.numeroPisos }}</td>
                        </tr>
                      </tbody>
                    </v-table>
                  </v-col>
                  
                  <!-- TERCERA COLUMNA: RETIROS -->
                  <v-col cols="12" md="4" class="regulaciones-columna">
                    <h5>RETIROS</h5>
                    <v-table density="compact" class="regulaciones-table">
                      <tbody>
                        <tr>
                          <td class="text-left font-weight-bold">Frontal:</td>
                          <td class="text-left">{{ reg.retiroFrontal }} m</td>
                        </tr>
                        <tr>
                          <td class="text-left font-weight-bold">Lateral 1:</td>
                          <td class="text-left">{{ reg.retiroLateral1 }} m</td>
                        </tr>
                        <tr>
                          <td class="text-left font-weight-bold">Lateral 2:</td>
                          <td class="text-left">{{ reg.retiroLateral2 }} m</td>
                        </tr>
                        <tr>
                          <td class="text-left font-weight-bold">Posterior:</td>
                          <td class="text-left">{{ reg.retiroPosterior }} m</td>
                        </tr>
                        <tr>
                          <td class="text-left font-weight-bold">Entre bloques:</td>
                          <td class="text-left">{{ reg.distanciaEntreBloques }} m</td>
                        </tr>
                      </tbody>
                    </v-table>
                  </v-col>
                </v-row>
                
                <!-- Observaciones -->
                <v-row v-if="reg.observaciones" class="mt-2">
                  <v-col cols="12">
                    <v-table density="compact" class="regulaciones-table">
                      <tbody>
                        <tr>
                          <td class="text-left font-weight-bold" width="20%">Observaciones:</td>
                          <td class="text-left">{{ reg.observaciones }}</td>
                        </tr>
                      </tbody>
                    </v-table>
                  </v-col>
                </v-row>
              </div>
            </div>
          </div>
        </section>

        <!-- SERVICIOS BÁSICOS -->
        <section class="seccion">
          <h3>COBERTURA DE SERVICIOS BÁSICOS</h3>
          <p><strong>Abastecimiento de agua:</strong> {{ datosTitular.agua || 'No tiene' }}</p>
          <p><strong>Alcantarillado:</strong> {{ datosTitular.alcantarillado || 'No tiene' }}</p>
          <p><strong>Energía eléctrica:</strong> {{ datosTitular.energia_electrica || 'No tiene' }}</p>
          <p><strong>Otros:</strong> Transporte público</p>
        </section>

        <!-- NOTAS FINALES -->
        <section class="seccion texto-legal">
          <h3>NOTAS</h3>
          <div class="nota-informativa">
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
          </div>
        </section>
      </main>

      <!-- PIE DE PÁGINA -->
      <footer class="reporte-footer">
        <p>Gobierno Autónomo Descentralizado Intercultural y Plurinacional del Municipio de Cayambe</p>
        <p>Dirección de Planificación y Ordenamiento Territorial</p>
        <div class="pagina-info">Página <span class="pagina-num"></span></div>
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
import irmService from '@/services/irmService';
import qrService from '@/services/qrService';
import axios from 'axios';
import { useAuth } from '@/composables/useAuth';
import API_BASE_URL from '@/config/apiConfig';

export default {
  name: 'ReporteIRM',
  setup() {
    const route = useRoute();
    const router = useRouter();
    const { user } = useAuth();
    const datosTitular = ref({});
    const fechaActual = ref(format(new Date(), "dd 'de' MMMM 'de' yyyy, HH:mm:ss", { locale: es }));
    const fechaActualCorta = ref(format(new Date(), "yyyy-MM-dd", { locale: es }));
    const numeroIRM = ref(generateIRMNumber());
    const loading = ref(false);
    const error = ref(null);
    const regulaciones = ref([]);
    const regulacionesLoading = ref(false);
    const regulacionesError = ref(null);
    const qrCode = ref(null);
    const certificadoGuardado = ref(false);
    const idCertificado = ref(null);
    
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

    // Función para cargar datos de regulaciones PUGS
    const cargarDatosRegulaciones = async (claveCatastral) => {
      if (!claveCatastral) return;
      
      regulacionesLoading.value = true;
      regulacionesError.value = null;
      
      try {
        console.log('Consultando datos de regulaciones PUGS para:', claveCatastral);
        
        const response = await axios.get(`${API_BASE_URL}/datos-pugs/${claveCatastral}`);
        
        if (response.data && response.data.success && response.data.data.length > 0) {
          console.log('Datos PUGS recibidos:', response.data.data);
          
          // Ahora guardamos todos los registros recibidos
          regulaciones.value = response.data.data.map(datosPugs => ({
            codigo: datosPugs.red || 'No especificado',
            zona: datosPugs.zon || 'No especificado',
            loteMinimo: datosPugs.lmi || 0,
            frenteMinimo: datosPugs.fmi || 0,
            cosPb: datosPugs.cop || 0,
            cosTotal: datosPugs.cot || 0,
            alturaMaxima: datosPugs.atp || 0,
            numeroPisos: datosPugs.npi || 0,
            retiroFrontal: datosPugs.rfe || 0,
            retiroLateral1: datosPugs.rle1 || 0,
            retiroLateral2: datosPugs.rle2 || 0,
            retiroPosterior: datosPugs.rpe || 0,
            distanciaEntreBloques: datosPugs.reb || 0,
            observaciones: datosPugs.txt || '',
            clasificacionSuelo: {
              codigo: datosPugs.csc || 'No especificado',
              nombre: datosPugs.csn || 'No especificado'
            },
            formaOcupacion: {
              codigo: datosPugs.foc || 'No especificado',
              nombre: datosPugs.fon || 'No especificado'
            },
            usoSuelo: {
              codigo: datosPugs.usc || 'No especificado',
              nombre: datosPugs.usn || 'No especificado'
            },
            fcode: datosPugs.fcode || 'No especificado'
          }));
          
          console.log('Regulaciones mapeadas:', regulaciones.value);
        } else {
          console.warn('No se encontraron datos PUGS para la clave catastral:', claveCatastral);
          regulacionesError.value = 'No se encontraron datos de regulaciones para este predio';
        }
      } catch (err) {
        console.error('Error al cargar datos PUGS:', err);
        regulacionesError.value = 'Error al cargar datos de regulaciones';
      } finally {
        regulacionesLoading.value = false;
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
          
          // Una vez cargados los datos del titular, cargamos los datos de regulaciones
          await cargarDatosRegulaciones(claveCatastral);
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

    onMounted(async () => {
      // Variable para controlar si ya iniciamos el proceso de guardado
      let procesoGuardadoIniciado = false;

      try {
        // Primero verificamos si recibimos la clave catastral como parámetro
        const claveCatastral = route.params.claveCatastral;
        const filtro = route.query.filtro;
        
        if (filtro === 'claveCatastral' && claveCatastral) {
          // Decodificamos la clave catastral y cargamos los datos
          const decodedClaveCatastral = decodeURIComponent(claveCatastral);
          await cargarDatosPorClaveCatastral(decodedClaveCatastral);
          
          // Verificamos si tenemos los datos necesarios
          if (datosTitular.value && datosTitular.value.clave_catastral) {
            // Generar QR después de cargar los datos
            await generarQR();
            
            // Solo guardar si no hemos iniciado el proceso de guardado
            if (!procesoGuardadoIniciado && !certificadoGuardado.value) {
              console.log('Iniciando proceso de guardado desde clave catastral');
              procesoGuardadoIniciado = true;
              await guardarIRM();
            }
          }
        } 
        // Si no hay clave catastral o hubo un error al cargarla, intentamos usar los datos del titular de la query
        else if (route.query.datosTitular && !procesoGuardadoIniciado) {
          try {
            datosTitular.value = JSON.parse(route.query.datosTitular);
            console.log('Datos del titular recibidos de query:', datosTitular.value);
            
            // Obtener regulaciones para este titular si tenemos clave catastral
            if (datosTitular.value.clave_catastral) {
              await cargarDatosRegulaciones(datosTitular.value.clave_catastral);
              
              // Generar QR después de cargar los datos
              await generarQR();
              
              // Solo guardar si no hemos iniciado el proceso de guardado
              if (!procesoGuardadoIniciado && !certificadoGuardado.value) {
                console.log('Iniciando proceso de guardado desde datos en query');
                procesoGuardadoIniciado = true;
                await guardarIRM();
              }
            }
          } catch (error) {
            console.error('Error al parsear datos del titular:', error);
            mostrarSnackbar('Error al cargar los datos del informe', 'error');
            error.value = 'Error al procesar los datos del informe';
          }
        } else {
          // Si no tenemos ninguna forma de obtener los datos, mostramos un error
          if (!procesoGuardadoIniciado && !certificadoGuardado.value) {
            error.value = 'No se proporcionaron parámetros para generar el informe';
            mostrarSnackbar('No se proporcionaron datos para generar el informe', 'warning');
          }
        }
      } catch (err) {
        console.error('Error en onMounted:', err);
        error.value = 'Error al inicializar el informe';
        mostrarSnackbar('Error al inicializar el informe', 'error');
      }
    });

    // Función para generar el código QR
    const generarQR = async () => {
      try {
        // Si ya tenemos un QR generado, no lo generamos de nuevo
        if (qrCode.value) {
          console.log('QR ya generado anteriormente, reutilizando');
          return;
        }
        
        console.log('Generando nuevo código QR');
        
        // Formato de fecha para el QR: YYYY-MM-DD HH:mm:ss
        const fechaHoraQR = format(new Date(), "yyyy-MM-dd HH:mm:ss");
        
        // Datos para el QR
        const datosQR = {
          numeroInforme: numeroIRM.value,
          fechaHora: fechaHoraQR,
          idPredio: datosTitular.value?.id_predio || '',
          claveCatastral: datosTitular.value?.clave_catastral || '',
          idPropietario: datosTitular.value?.id_ciudadano || '',
          nombrePropietario: datosTitular.value?.nombres || '',
          usuarioId: user?.id || '',
          nombreUsuario: user?.nombre || ''
        };
        
        // Generar el QR
        const qrDataUrl = await qrService.generarQRIRM(datosQR);
        qrCode.value = qrDataUrl;
        console.log('Código QR generado exitosamente');
      } catch (err) {
        console.error('Error al generar el código QR:', err);
        mostrarSnackbar('Error al generar el código QR', 'error');
      }
    };
    
    // Variable para controlar si hay una operación de guardado en curso
    const guardadoEnProgreso = ref(false);
    
    // Función para guardar el IRM en la base de datos
    const guardarIRM = async () => {
      // Si ya está guardado, no lo guardamos de nuevo
      if (certificadoGuardado.value) return idCertificado.value;
      
      // Si hay una operación de guardado en curso, esperamos y devolvemos el resultado
      if (guardadoEnProgreso.value) {
        console.log('Guardado ya en progreso, esperando...');
        // Esperar a que termine el guardado actual
        let intentos = 0;
        while (guardadoEnProgreso.value && intentos < 20) {
          await new Promise(resolve => setTimeout(resolve, 500)); // Esperar 500ms
          intentos++;
        }
        
        // Si se completó correctamente, devolver el ID
        if (certificadoGuardado.value) {
          console.log('Guardado completado por otra operación, ID:', idCertificado.value);
          return idCertificado.value;
        }
      }
      
      try {
        // Marcar que estamos iniciando el proceso de guardado
        guardadoEnProgreso.value = true;
        loading.value = true;
        
        // Verificar si hay token
        const token = localStorage.getItem('token');
        if (!token) {
          console.error('No hay token de autenticación disponible');
          mostrarSnackbar('Error de autenticación: No hay sesión activa', 'error');
          return null;
        }
        
        console.log('Token disponible para guardar IRM:', token.substring(0, 15) + '...');
        
        // Preparar los datos del IRM principal
        const datosIRM = {
          fecha: fechaActualCorta.value,
          tipo: 'IRM',
          tipo_predio: datosTitular.value?.tipo_predio || 'URBANO',
          id_ciudadano: datosTitular.value?.id_ciudadano || null,
          numero_documento: datosTitular.value?.numero_documento || '',
          clave_catastral: datosTitular.value?.clave_catastral || '',
          clave_anterior: datosTitular.value?.clave_catastral_anterior || '',
          derechos_acciones: datosTitular.value?.derechos || 'NO',
          area_construccion: datosTitular.value?.area_construida || 0,
          area_escritura: datosTitular.value?.area_escritura || 0,
          area_grafica: datosTitular.value?.area_grafica || 0,
          frente: datosTitular.value?.frente || 0,
          tiene_construccion: datosTitular.value?.tiene_construccion || 'NO',
          parroquia: datosTitular.value?.parroquia || '',
          barrio_sector: datosTitular.value?.sector || '',
          notas_irm: 'PREDIO SIN ACCESO CATASTRADO',
          agua: datosTitular.value?.agua || 'S/D',
          energia_electrica: datosTitular.value?.energia_electrica || 'S/D',
          alcantarillado: datosTitular.value?.alcantarillado || 'S/D',
          otros: 'Transporte público',
          usuario: user?.nombre || 'Usuario del sistema',
          fecha_reporte: format(new Date(), "yyyy-MM-dd HH:mm:ss", { locale: es }),
          
          // Incluir las regulaciones
          regulaciones: regulaciones.value.map(reg => ({
            zona: `${reg.codigo} ${reg.zona}`,
            lote_minimo: reg.loteMinimo || 0,
            frente_minimo: reg.frenteMinimo || 0,
            cos_pb: reg.cosPb || 0,
            cos_total: reg.cosTotal || 0,
            forma_ocupacion: `(${reg.formaOcupacion?.codigo}) ${reg.formaOcupacion?.nombre}`,
            clasificacion_suelo: `(${reg.clasificacionSuelo?.codigo}) ${reg.clasificacionSuelo?.nombre}`,
            uso_suelo: `(${reg.usoSuelo?.codigo}) ${reg.usoSuelo?.nombre}`,
            altura_maxima: reg.alturaMaxima || 0,
            numero_pisos: reg.numeroPisos || 0,
            frontal: reg.retiroFrontal || 0,
            lateral_1: reg.retiroLateral1 || 0,
            lateral_2: reg.retiroLateral2 || 0,
            posterior: reg.retiroPosterior || 0,
            entre_bloques: reg.distanciaEntreBloques || 0
          }))
        };
        
        console.log('Enviando datos para guardar IRM:', JSON.stringify(datosIRM).substring(0, 200) + '...');
        
        // Enviar los datos al backend
        const response = await irmService.crearIRM(datosIRM);
        
        if (response.data && response.data.success) {
          idCertificado.value = response.data.data.id_irm;
          certificadoGuardado.value = true;
          mostrarSnackbar('Informe guardado exitosamente', 'success');
          console.log('IRM guardado con ID:', idCertificado.value);
          return idCertificado.value;
        } else {
          throw new Error(response.data?.message || 'Error al guardar el informe');
        }
      } catch (err) {
        console.error('Error al guardar el IRM:', err);
        
        let mensajeError = 'Error al guardar el informe';
        
        // Manejar errores específicos
        if (err.response) {
          console.log('Error de respuesta:', err.response.status, err.response.data);
          
          if (err.response.status === 401) {
            mensajeError = 'Su sesión ha expirado. Por favor inicie sesión nuevamente.';
          } else if (err.response.status === 403) {
            mensajeError = 'No tiene permisos para realizar esta acción.';
          } else if (err.response.data && err.response.data.message) {
            mensajeError = err.response.data.message;
          }
        }
        
        mostrarSnackbar(mensajeError, 'error');
        return null;
      } finally {
        loading.value = false;
        guardadoEnProgreso.value = false;
      }
    };
    
    // Función para imprimir el informe
    const imprimirInforme = async () => {
      if (!datosTitular.value || !datosTitular.value.clave_catastral) {
        mostrarSnackbar('No hay datos válidos para imprimir', 'warning');
        return;
      }
      
      try {
        // Primero generamos el QR si no existe
        if (!qrCode.value) {
          await generarQR();
        }
        
        // Luego guardamos el IRM en la base de datos si no está guardado
        // Solo intentamos guardar una vez y esperamos que termine el proceso completo
        if (!certificadoGuardado.value) {
          console.log('Guardando IRM antes de imprimir');
          await guardarIRM();
        } else {
          console.log('IRM ya está guardado, ID:', idCertificado.value);
        }
        
        // Agregar estilo para numeración de páginas justo antes de imprimir
        const style = document.createElement('style');
        style.innerHTML = `
          @page {
            size: A4;
            margin: 20mm;
            counter-increment: page;
          }
          @media print {
            body {
              counter-reset: page;
            }
          }
        `;
        document.head.appendChild(style);
        
        window.print();
        
        // Eliminar el estilo después de imprimir
        setTimeout(() => {
          document.head.removeChild(style);
        }, 1000);
        
        mostrarSnackbar('Impresión iniciada', 'success');
      } catch (err) {
        console.error('Error al preparar la impresión:', err);
        mostrarSnackbar('Error al preparar la impresión', 'error');
      }
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
      regulaciones,
      regulacionesLoading,
      regulacionesError,
      qrCode,
      generarQR,
      guardarIRM,
      certificadoGuardado,
      idCertificado,
      guardadoEnProgreso
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

.qr-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 80px;
}

.qr-image {
  width: 80px;
  height: 80px;
}

.qr-text {
  font-size: 10px;
  margin-top: 2px;
  text-align: center;
}

.info-adicional {
  min-height: 280px;
  background-color: #f9f9f9;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
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
  position: relative;
}

.pagina-info {
  font-size: 10px;
  color: #666;
  margin-top: 5px;
  display: none;
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
    height: 100px;
    padding-bottom: 30px;
  }

  .reporte-footer {
    bottom: 0;
    height: 80px;
  }

  .reporte-body {
    margin-top: 130px;
    margin-bottom: 100px;
    position: relative;
  }
  
  .no-print {
    display: none !important;
  }
}

/* Estilos para las tarjetas de regulaciones */
.regulacion-card {
  margin-bottom: 20px;
  padding: 15px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  background-color: #f9f9f9;
}

.regulacion-card h4 {
  margin-top: 0;
  margin-bottom: 15px;
  padding-bottom: 5px;
  border-bottom: 1px solid #ddd;
  font-size: 14px;
  color: #276E90;
}

.regulacion-card h5 {
  margin-top: 0;
  margin-bottom: 10px;
  font-size: 13px;
  font-weight: bold;
  text-align: center;
  background-color: #e8f4f8;
  padding: 5px;
  border-radius: 4px 4px 0 0;
  color: #276E90;
}

.regulaciones-layout {
  width: 100%;
}

.regulaciones-columna {
  padding: 0 5px;
}

.regulaciones-table {
  margin-bottom: 10px;
  background-color: white !important;
  border: 1px solid #e0e0e0;
  font-size: 12px;
}

.sin-regulaciones {
  padding: 20px;
  text-align: center;
  background-color: #f9f9f9;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
}

@media print {
  .regulacion-card {
    break-inside: avoid;
    page-break-inside: avoid;
    border: 1px solid #ccc;
    margin-bottom: 15px;
  }
  
  .regulaciones-layout {
    display: flex;
    flex-wrap: wrap;
  }
  
  .regulaciones-columna {
    flex: 1;
    min-width: 30%;
    margin-bottom: 10px;
  }
  
  .regulaciones-table {
    font-size: 10px;
  }
  
  .regulacion-card h5 {
    font-size: 11px;
  }
}

/* Estilo para las notas informativas */
.nota-informativa {
  font-size: 11px;
  background-color: #f9f9f9;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 12px;
  color: #555;
}

.nota-informativa ul {
  margin: 0;
  padding-left: 16px;
}

.nota-informativa li {
  margin-bottom: 3px;
  line-height: 1.3;
}

@media print {
  .nota-informativa {
    font-size: 9px;
    background-color: transparent;
    border: 1px solid #eee;
  }
  
  .pagina-info {
    display: block;
    position: absolute;
    bottom: 5px;
    right: 10px;
  }
  
  /* CSS para numeración de páginas */
  .pagina-num:after {
    content: counter(page);
  }
  
  /* Esto agrega un salto de página antes de cada regulacion-card excepto la primera */
  .regulacion-card:not(:first-child) {
    break-before: page;
  }
}
</style>
