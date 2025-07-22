<template>
  <v-container>
    <v-card class="mx-auto my-6" max-width="700">
      <v-card-title>
        <v-icon class="mr-2">mdi-magnify</v-icon>
        Consulta Registro de la Propiedad
      </v-card-title>

      <v-card-text>
        <v-form @submit.prevent="consultar">
          <v-select
            v-model="form.op"
            :items="tiposBusqueda"
            label="Seleccione"
            item-title="label"
            item-value="value"
            required
            prepend-icon="mdi-format-list-bulleted"
          />

          <v-text-field
            v-model="form.param"
            :label="etiquetaCampo"
            :prepend-icon="iconoCampo"
            required
            clearable
          />

          <v-btn type="submit" color="primary" block>
            Consultar
          </v-btn>
        </v-form>
      </v-card-text>
    </v-card>

    <v-alert v-if="mensaje" type="info" class="my-4">
      {{ mensaje }}
    </v-alert>

    <v-card v-if="respuesta" class="my-4">
      <v-card-title>
        <v-icon class="mr-2">mdi-file-document-outline</v-icon>
        Resultado de la Consulta
      </v-card-title>
      <v-card-text>
        <!-- Lista de Predios -->
        <div v-if="respuesta.listapredio && respuesta.listapredio.length > 0" class="mb-4">
          <v-card variant="outlined" class="mb-3">
            <v-card-title class="text-h6 bg-blue-grey-lighten-4">
              <v-icon class="mr-2">mdi-home-city</v-icon>
              Información del Predio
            </v-card-title>
            <v-card-text>
              <div v-for="(predio, index) in respuesta.listapredio" :key="`predio-${index}`">
                <v-row>
                  <v-col cols="12" md="6">
                    <strong>Clave Catastral:</strong> {{ predio.clavecatastral || 'N/A' }}
                  </v-col>
                  <v-col cols="12" md="6">
                    <strong>Nombre del Predio:</strong> {{ predio.nombrepredio || 'N/A' }}
                  </v-col>
                  <v-col cols="12" md="6">
                    <strong>Dirección:</strong> {{ predio.direccion || 'N/A' }}
                  </v-col>
                  <v-col cols="12" md="6">
                    <strong>Área:</strong> {{ predio.area || 'N/A' }}
                  </v-col>
                </v-row>
                <v-divider v-if="index < respuesta.listapredio.length - 1" class="my-3"></v-divider>
              </div>
            </v-card-text>
          </v-card>
        </div>

        <!-- Lista de Alcabalas y Plusvalía -->
        <div v-if="respuesta.listalcabalaplusva && respuesta.listalcabalaplusva.length > 0" class="mb-4">
          <v-card variant="outlined" class="mb-3">
            <v-card-title class="text-h6 bg-green-lighten-4">
              <v-icon class="mr-2">mdi-currency-usd</v-icon>
              Alcabalas y Plusvalía
            </v-card-title>
            <v-card-text>
              <div v-for="(alcabala, index) in respuesta.listalcabalaplusva" :key="`alcabala-${index}`">
                <v-row>
                  <v-col cols="12" md="4">
                    <strong>Tipo:</strong> {{ alcabala.tipo || 'N/A' }}
                  </v-col>
                  <v-col cols="12" md="4">
                    <strong>Fecha:</strong> {{ formatearFecha(alcabala.fecha) }}
                  </v-col>
                  <v-col cols="12" md="4">
                    <strong>Valor:</strong> {{ formatearMoneda(alcabala.valor) }}
                  </v-col>
                  <v-col cols="12">
                    <strong>Observaciones:</strong> {{ alcabala.observaciones || 'N/A' }}
                  </v-col>
                </v-row>
                <v-divider v-if="index < respuesta.listalcabalaplusva.length - 1" class="my-3"></v-divider>
              </div>
            </v-card-text>
          </v-card>
        </div>

        <!-- Lista de Datos de Inscripción -->
        <div v-if="respuesta.listaDatosInscripcion && respuesta.listaDatosInscripcion.length > 0" class="mb-4">
          <v-card variant="outlined" class="mb-3">
            <v-card-title class="text-h6 bg-orange-lighten-4">
              <v-icon class="mr-2">mdi-clipboard-text</v-icon>
              Datos de Inscripción
            </v-card-title>
            <v-card-text>
              <div v-for="(inscripcion, index) in respuesta.listaDatosInscripcion" :key="`inscripcion-${index}`">
                <v-row>
                  <v-col cols="12" md="6">
                    <strong>Número de Inscripción:</strong> {{ inscripcion.numeroinscripcion || 'N/A' }}
                  </v-col>
                  <v-col cols="12" md="6">
                    <strong>Fecha de Inscripción:</strong> {{ formatearFecha(inscripcion.fechainscripcion) }}
                  </v-col>
                  <v-col cols="12" md="6">
                    <strong>Tomo:</strong> {{ inscripcion.tomo || 'N/A' }}
                  </v-col>
                  <v-col cols="12" md="6">
                    <strong>Folio:</strong> {{ inscripcion.folio || 'N/A' }}
                  </v-col>
                  <v-col cols="12">
                    <strong>Acto Jurídico:</strong> {{ inscripcion.actojuridico || 'N/A' }}
                  </v-col>
                </v-row>
                <v-divider v-if="index < respuesta.listaDatosInscripcion.length - 1" class="my-3"></v-divider>
              </div>
            </v-card-text>
          </v-card>
        </div>

        <!-- Lista de Comparecientes -->
        <div v-if="respuesta.listacomparecientes && respuesta.listacomparecientes.length > 0" class="mb-4">
          <v-card variant="outlined" class="mb-3">
            <v-card-title class="text-h6 bg-purple-lighten-4">
              <v-icon class="mr-2">mdi-account-group</v-icon>
              Comparecientes
            </v-card-title>
            <v-card-text>
              <div v-for="(compareciente, index) in respuesta.listacomparecientes" :key="`compareciente-${index}`">
                <v-row>
                  <v-col cols="12" md="6">
                    <strong>Nombres:</strong> {{ compareciente.nombres || 'N/A' }}
                  </v-col>
                  <v-col cols="12" md="6">
                    <strong>Apellidos:</strong> {{ compareciente.apellidos || 'N/A' }}
                  </v-col>
                  <v-col cols="12" md="6">
                    <strong>Cédula/RUC:</strong> {{ compareciente.cedula || 'N/A' }}
                  </v-col>
                  <v-col cols="12" md="6">
                    <strong>Tipo:</strong> {{ compareciente.tipo || 'N/A' }}
                  </v-col>
                  <v-col cols="12" md="6">
                    <strong>Porcentaje:</strong> {{ compareciente.porcentaje || 'N/A' }}%
                  </v-col>
                  <v-col cols="12" md="6">
                    <strong>Estado Civil:</strong> {{ compareciente.estadocivil || 'N/A' }}
                  </v-col>
                </v-row>
                <v-divider v-if="index < respuesta.listacomparecientes.length - 1" class="my-3"></v-divider>
              </div>
            </v-card-text>
          </v-card>
        </div>

        <!-- Sin datos -->
        <div v-if="!tieneAlgunDato" class="text-center py-4">
          <v-icon size="48" color="grey">mdi-information-outline</v-icon>
          <p class="text-grey mt-2">No se encontraron datos para mostrar</p>
        </div>

        <!-- Botón para ver JSON raw (opcional) -->
        <v-expansion-panels class="mt-4">
          <v-expansion-panel>
            <v-expansion-panel-title>
              <v-icon class="mr-2">mdi-code-json</v-icon>
              Ver datos JSON completos
            </v-expansion-panel-title>
            <v-expansion-panel-text>
              <pre class="text-caption">{{ JSON.stringify(respuesta, null, 2) }}</pre>
            </v-expansion-panel-text>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
import axios from 'axios';
import API_BASE_URL from '@/config/apiConfig';

export default {
  name: 'ConsultaWsRegistro',
  data() {
    return {
      form: {
        op: 1, // Cambiar default a cédula (primera opción)
        param: '',
      },
      mensaje: '',
      respuesta: null,
      tiposBusqueda: [
        { value: 1, label: 'Cédula / RUC' },
        { value: 2, label: 'Nombres' },
        { value: 3, label: 'Clave catastral' },
      ],
    };
  },
  computed: {
    etiquetaCampo() {
      switch (this.form.op) {
        case 1: return 'Ingrese cédula o RUC';
        case 2: return 'Ingrese nombres';
        case 3: return 'Ingrese clave catastral';
        default: return 'Ingrese valor';
      }
    },
    iconoCampo() {
      switch (this.form.op) {
        case 1: return 'mdi-card-account-details';
        case 2: return 'mdi-account';
        case 3: return 'mdi-home';
        default: return 'mdi-text';
      }
    },
    tieneAlgunDato() {
      if (!this.respuesta) return false;
      return (
        (this.respuesta.listapredio && this.respuesta.listapredio.length > 0) ||
        (this.respuesta.listalcabalaplusva && this.respuesta.listalcabalaplusva.length > 0) ||
        (this.respuesta.listaDatosInscripcion && this.respuesta.listaDatosInscripcion.length > 0) ||
        (this.respuesta.listacomparecientes && this.respuesta.listacomparecientes.length > 0)
      );
    },
  },
  methods: {
    async consultar() {
      // Validación básica únicamente
      if (!this.form.param || this.form.param.trim() === '') {
        this.mensaje = 'Debe ingresar un valor para buscar.';
        return;
      }

      this.mensaje = '';
      this.respuesta = null;

      try {
        const payload = {
          op: this.form.op,
          param: this.form.param.trim()
        };
        
        console.log('Enviando payload:', payload);
        console.log('URL destino:', `${API_BASE_URL}/consulta-rp`);

        const response = await axios.post(`${API_BASE_URL}/consulta-rp`, payload, {
          headers: {
            'Content-Type': 'application/json'
          },
          timeout: 30000 // 30 segundos igual que el backend
        });

        console.log('Respuesta completa:', response);
        console.log('Datos de respuesta:', response.data);

        // Simplificar la validación de respuesta
        if (response.data && Object.keys(response.data).length > 0) {
          this.respuesta = response.data;
          this.mensaje = 'Consulta realizada exitosamente.';
        } else {
          this.mensaje = 'No se encontraron resultados para los criterios de búsqueda.';
        }
      } catch (error) {
        console.error('Error completo:', error);
        
        if (error.response) {
          // El servidor respondió con un código de estado de error
          console.error('Datos del error:', error.response.data);
          console.error('Estado del error:', error.response.status);
          console.error('Headers del error:', error.response.headers);
          
          switch (error.response.status) {
            case 400:
              this.mensaje = `Error en la petición (400): ${error.response.data?.message || 'Datos inválidos'} - Verifique los parámetros enviados.`;
              break;
            case 404:
              this.mensaje = 'Servicio no encontrado (404). Verifique la URL del endpoint.';
              break;
            case 500:
              this.mensaje = 'Error interno del servidor (500). Contacte al administrador.';
              break;
            default:
              this.mensaje = `Error del servidor (${error.response.status}): ${error.response.data?.message || 'Error desconocido'}`;
          }
        } else if (error.request) {
          // La petición se hizo pero no se recibió respuesta
          console.error('No se recibió respuesta:', error.request);
          this.mensaje = 'No se pudo conectar con el servidor. Verifique su conexión.';
        } else {
          // Algo pasó al configurar la petición
          console.error('Error de configuración:', error.message);
          this.mensaje = `Error de configuración: ${error.message}`;
        }
      }
    },
    
    // Métodos auxiliares para formatear datos
    formatearFecha(fecha) {
      if (!fecha) return 'N/A';
      try {
        const date = new Date(fecha);
        return date.toLocaleDateString('es-EC', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });
      } catch (error) {
        return fecha; // Devolver original si no se puede formatear
      }
    },
    
    formatearMoneda(valor) {
      if (!valor || valor === 0) return 'N/A';
      try {
        return new Intl.NumberFormat('es-EC', {
          style: 'currency',
          currency: 'USD'
        }).format(valor);
      } catch (error) {
        return `$${valor}`; // Fallback simple
      }
    },
  },
};
</script>
