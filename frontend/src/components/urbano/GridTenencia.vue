<template>
  <v-container :class="['container', tipoClaseContainer]">
    <v-row justify="center">
      <v-col cols="12" class="text-center">
        <h3 class="titulo-pantalla">Registro de Tenencias</h3>
      </v-col>

      <v-col cols="12">
        <div class="d-flex align-center mb-2">
            <h4 class="mr-4" style="color: white;">Porcentaje de participación: </h4>
          <v-progress-linear
            :color="porcentajeOcupado >= 100 ? 'red' : (porcentajeOcupado >= 90 ? 'orange' : 'success')"
            height="20"
            :value="porcentajeOcupado"
            striped
          >
            <template v-slot:default>
              <span class="progress-text">{{ porcentajeOcupado.toFixed(2) }}% ocupado / {{ porcentajeDisponible.toFixed(2) }}% disponible</span>
            </template>
          </v-progress-linear>
        </div>
      </v-col>

      <v-col cols="12" class="d-flex justify-center align-center">
        <v-btn :class="tipoClaseBtn" icon @click="agregarFila" :disabled="porcentajeDisponible <= 0" class="mx-2">
          <v-icon>mdi-plus</v-icon>
        </v-btn>
        <v-btn :class="tipoClaseBtn" prepend-icon="mdi-content-save" @click="guardarTenencias" class="mx-2">
          Guardar
        </v-btn>
      </v-col>

      <v-col cols="12">
        <v-data-table 
          :headers="headers" 
          :items="filas" 
          item-value="id_propietario" 
          dense 
          class="elevation-1 custom-data-table"
          :class="getTipoPredio === 1 ? 'urbano-table' : 'rural-table'"
        >

          <template v-slot:item.id_propietario="{ item }">
            <v-autocomplete
              v-model="item.id_propietario"
              :items="ciudadanos"
              :item-title="ciudadanoLabel"
              item-value="id_ciudadano"
              label="Seleccione propietario"
              dense
              :rules="[rules.required]"
              style="min-width: 300px"
            />
          </template>

          <template v-slot:item.porcentaje_participacion="{ item }">
            <v-text-field
              v-model.number="item.porcentaje_participacion"
              type="number"
              placeholder="%"
              :rules="[rules.required, rules.porcentaje]"
              dense
              style="max-width: 120px"
              @blur="validarPorcentajeTotal(item)"
            />
          </template>

          <template v-slot:item.representante="{ item }">
            <div>
              <v-checkbox 
                v-model="item.representante" 
                :true-value="1" 
                :false-value="2" 
                :disabled="representanteDisabled && item.representante !== 1"
              />
              <div v-if="representanteExiste" 
                   :class="['text-caption', {'text-error': representanteDisabled, 'text-info': !representanteDisabled}]"
                   :style="{
                     color: representanteDisabled ? 'red' : 'blue', 
                     fontSize: '11px',
                     marginTop: '-10px'
                   }">
                {{ representanteMensaje }}
              </div>
            </div>
          </template>

          <template v-slot:item.acciones="{ item, index }">
            <v-btn color="red" icon @click="eliminarFila(index)">
              <v-icon>mdi-delete</v-icon>
            </v-btn>
          </template>

        </v-data-table>

        <v-snackbar v-model="snackbarError" :timeout="3000" color="error" rounded="pill">
          {{ mensajeError }}
        </v-snackbar>

        <v-snackbar v-model="snackbarOk" :timeout="3000" color="success" rounded="pill">
          {{ mensajeOk }}
        </v-snackbar>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import axios from 'axios';
import API_BASE_URL from '@/config/apiConfig';
import { mapGetters } from 'vuex';
import useTenenciaEvents from '@/composables/useTenenciaEvents';

export default {
  setup() {
    const { emitTenenciaUpdated, onTenenciaUpdated } = useTenenciaEvents();
    
    return {
      emitTenenciaUpdated,
      onTenenciaUpdated
    };
  },
  data() {
    return {
      filas: [],
      mensajeError: '',
      snackbarError: false,
      snackbarOk: false,
      mensajeOk: '',
      ciudadanos: [],
      porcentajeOcupado: 0,
      porcentajeDisponible: 100,
      representanteExiste: false,
      representanteDisabled: false,
      representanteMensaje: '',
      verificandoRepresentante: false,
      headers: [
        { title: 'Propietario', value: 'id_propietario', class: 'white--text' },
        { title: 'Participación (%)', value: 'porcentaje_participacion', class: 'white--text' },
        { title: 'Representante', value: 'representante', class: 'white--text' },
        { title: 'Acciones', value: 'acciones', sortable: false, class: 'white--text' }
      ],
      rules: {
        required: v => !!v || 'Requerido',
        porcentaje: v => (v >= 0 && v <= 100) || 'Debe estar entre 0 y 100'
      }
    };
  },
  computed: {
    ...mapGetters(['getIdPredio', 'getTipoPredio']),
    tipoClaseContainer() {
      return this.getTipoPredio === 1 ? 'urbano-container' : 'rural-container';
    },
    tipoClaseBtn() {
      return this.getTipoPredio === 1 ? 'urbano-btn' : 'rural-btn';
    }
  },
  methods: {
    // Método para verificar si ya existe un representante para este predio
    async verificarRepresentanteExistente() {
      if (!this.getIdPredio) return;
      
      this.verificandoRepresentante = true;
      try {
        const response = await axios.get(`${API_BASE_URL}/representante/${this.getIdPredio}`);
        
        // Verificamos si hay algún registro con representante=1
        const representantesConValor1 = response.data.filter(r => r.representante === 1);
        
        if (representantesConValor1.length > 0) {
          console.log('Representantes encontrados con valor 1:', representantesConValor1);
          
          // Si hay otro registro que es representante, mostramos mensaje y deshabilitamos
          this.representanteExiste = true;
          this.representanteDisabled = true;
          this.representanteMensaje = 'Ya existe un representante seleccionado';
          
          // Asegurarnos que ninguna fila tenga representante marcado como 1
          this.filas.forEach(fila => {
            if (fila.representante === 1) {
              fila.representante = 2;
            }
          });
        } else {
          // No hay representantes, permitir seleccionar y mostrar mensaje informativo
          this.representanteExiste = true;
          this.representanteDisabled = false;
          this.representanteMensaje = 'No existe representante asignado';
        }
      } catch (error) {
        if (error.response && error.response.status === 404) {
          // La API devolvió un 404, lo que significa que no hay representantes
          this.representanteExiste = true;
          this.representanteDisabled = false;
          this.representanteMensaje = 'No existe representante asignado';
        } else {
          console.error('Error al verificar representantes:', error);
          // En caso de otro tipo de error, permitimos la selección por defecto
          this.representanteExiste = true;
          this.representanteDisabled = false;
          this.representanteMensaje = 'No existe representante asignado';
        }
      } finally {
        this.verificandoRepresentante = false;
      }
    },

    async cargarCiudadanos() {
      try {
        const res = await axios.get(`${API_BASE_URL}/ciudadano_tenencia`);
        this.ciudadanos = res.data;
      } catch (error) {
        console.error('Error cargando ciudadanos:', error);
      }
    },
    
    async cargarPorcentajeAcumulado() {
      try {
        const res = await axios.get(`${API_BASE_URL}/porcentaje_acumulado_predio/${this.getIdPredio}`);
        this.porcentajeOcupado = parseFloat(res.data.porcentaje_acumulado);
        this.porcentajeDisponible = Math.max(0, 100 - this.porcentajeOcupado);
        console.log(`Porcentaje ocupado: ${this.porcentajeOcupado}%, disponible: ${this.porcentajeDisponible}%`);
      } catch (error) {
        console.error('Error cargando porcentaje acumulado:', error);
        this.mensajeError = 'Error al cargar el porcentaje ocupado';
        this.snackbarError = true;
      }
    },
    ciudadanoLabel(ciudadano) {
    if (!ciudadano) return '';
    return `${ciudadano.nombres} - ${ciudadano.numero_documento}`;
    },
    async agregarFila() {
      // Recargar el porcentaje acumulado para tener el dato más reciente
      await this.cargarPorcentajeAcumulado();
      
      // Verificar si ya existe un representante
      await this.verificarRepresentanteExistente();
      
      // Verificar si hay porcentaje disponible
      if (this.porcentajeDisponible <= 0) {
        this.mensajeError = 'No hay porcentaje disponible. Ya se ha asignado el 100% de participación.';
        this.snackbarError = true;
        return;
      }
      
      this.filas.push({
        id_predio: this.getIdPredio,
        id_propietario: null,
        porcentaje_participacion: Math.min(this.porcentajeDisponible, 100).toFixed(2),
        representante: 2
      });
    },
    eliminarFila(index) {
      this.filas.splice(index, 1);
    },
    async guardarTenencias() {
      this.mensajeError = '';
      this.snackbarError = false;
      this.snackbarOk = false;

      // Verificar que la suma de todos los porcentajes sea exactamente 100%
      if (!await this.verificarPorcentajeTotal()) {
        return;
      }

      if (this.filas.some(f => !f.id_propietario || f.porcentaje_participacion === null)) {
        this.mensajeError = 'Complete todos los campos requeridos.';
        this.snackbarError = true;
        return;
      }
      
      // Verificar si hay más de un representante seleccionado en las filas
      const representantesSeleccionados = this.filas.filter(f => f.representante === 1);
      if (representantesSeleccionados.length > 1) {
        this.mensajeError = 'Solo puede seleccionar un representante';
        this.snackbarError = true;
        return;
      }
      
      // Verificar si ya existe un representante y si se está intentando agregar otro
      if (this.representanteDisabled && representantesSeleccionados.length > 0) {
        this.mensajeError = 'Ya existe un representante asignado. No puede agregar otro.';
        this.snackbarError = true;
        return;
      }

      try {
        await axios.post(`${API_BASE_URL}/inserta_varias_tenencias`, this.filas);
        this.mensajeOk = '✅ Tenencias guardadas con éxito';
        this.snackbarOk = true;
        this.filas = [];
        
        // Recargar el porcentaje acumulado después de guardar
        await this.cargarPorcentajeAcumulado();
        
        // Verificar nuevamente el estado del representante
        await this.verificarRepresentanteExistente();
        
        // Emitir evento para notificar a otros componentes
        this.emitTenenciaUpdated();
      } catch (error) {
        this.mensajeError = 'Error al guardar: ' + (error.response?.data?.message || error.message);
        this.snackbarError = true;
      }
    },
    formatDecimal(value) {
      if (value === null || value === undefined || value === '') return '';
      const num = Number(value);
      if (isNaN(num)) return '';
      return num.toFixed(2);
    },
    
    // Validar porcentaje total cuando un usuario introduce un valor
    async validarPorcentajeTotal(item) {
      // Recargar el porcentaje acumulado para tener el dato más reciente
      await this.cargarPorcentajeAcumulado();
      
      // Formatear el valor primero
      item.porcentaje_participacion = this.formatDecimal(item.porcentaje_participacion);
      
      // Calcular el porcentaje total de todas las filas actuales
      const porcentajeTotalActual = this.filas.reduce((sum, f) => sum + Number(f.porcentaje_participacion || 0), 0);
      
      // Calcular el porcentaje total (ya ocupado + actual)
      const porcentajeTotal = this.porcentajeOcupado + porcentajeTotalActual;
      
      // Validar que no exceda el 100%
      if (porcentajeTotal > 100) {
        const excedente = porcentajeTotal - 100;
        this.mensajeError = `El total de participación (${porcentajeTotal.toFixed(2)}%) excedería el 100% por ${excedente.toFixed(2)}%. 
                            Ya existe un ${this.porcentajeOcupado.toFixed(2)}% ocupado. Disponible: ${this.porcentajeDisponible.toFixed(2)}%.`;
        this.snackbarError = true;
        
        // Ajustar automáticamente el valor al máximo disponible
        if (Number(item.porcentaje_participacion) > this.porcentajeDisponible) {
          item.porcentaje_participacion = this.porcentajeDisponible.toFixed(2);
        }
      } else if (porcentajeTotal === 100) {
        this.mensajeOk = `¡Perfecto! Con esta asignación se completa el 100% de participación.`;
        this.snackbarOk = true;
      } else {
        this.mensajeOk = `Aún queda ${(100 - porcentajeTotal).toFixed(2)}% disponible para asignar.`;
        this.snackbarOk = true;
      }
      
      return item.porcentaje_participacion;
    },
    
    // Método para verificar el porcentaje total antes de guardar
    async verificarPorcentajeTotal() {
      // Recargar el porcentaje acumulado para tener el dato más reciente
      await this.cargarPorcentajeAcumulado();
      
      // Calcular el porcentaje total de las filas actuales
      const porcentajeTotalActual = this.filas.reduce((sum, f) => sum + Number(f.porcentaje_participacion || 0), 0);
      
      // Calcular el porcentaje total (ya ocupado + actual)
      const porcentajeTotal = this.porcentajeOcupado + porcentajeTotalActual;
      
      if (porcentajeTotal < 100) {
        this.mensajeError = `El total de participación (${porcentajeTotal.toFixed(2)}%) no alcanza el 100%. 
                           Ya existe un ${this.porcentajeOcupado.toFixed(2)}% ocupado y está agregando ${porcentajeTotalActual.toFixed(2)}%. 
                           Aún faltan ${(100 - porcentajeTotal).toFixed(2)}%.`;
        this.snackbarError = true;
        return false;
      } else if (porcentajeTotal > 100) {
        this.mensajeError = `El total de participación (${porcentajeTotal.toFixed(2)}%) excedería el 100% por ${(porcentajeTotal - 100).toFixed(2)}%. 
                           Ya existe un ${this.porcentajeOcupado.toFixed(2)}% ocupado. Disponible: ${this.porcentajeDisponible.toFixed(2)}%. 
                           Ajuste los valores.`;
        this.snackbarError = true;
        return false;
      }
      
      return true;
    }
  },
  async mounted() {
    await this.cargarCiudadanos();
    if (this.getIdPredio) {
      await this.cargarPorcentajeAcumulado();
      // Verificar si ya existe un representante
      await this.verificarRepresentanteExistente();
    }
    
    // Configurar listener para actualizar cuando cambian las tenencias en otros componentes
    this.onTenenciaUpdated(async () => {
      console.log('🏠 GridTenencia: Evento de tenencia actualizada detectado');
      if (this.getIdPredio) {
        await this.cargarPorcentajeAcumulado();
        // Verificar si ya existe un representante
        await this.verificarRepresentanteExistente();
      }
    });
  }
};
</script>

<style scoped>
.titulo-pantalla {
  color: #F1ECE7;
}

.urbano-container {
  background-color: #114358;
}
.rural-container {
  background-color: #668A4C;
}

.urbano-btn {
  background-color: #276E90;
  color: #ffffff;
}
.rural-btn {
  background-color: #4C7031;
  color: #ffffff;
}

.v-data-table {
  background: #f9f9f9;
}

.urbano-table :deep(th) {
  background-color: #276E90 !important;
  color: white !important;
}

.rural-table :deep(th) {
  background-color: #4C7031 !important;
  color: white !important;
}

.progress-text {
  font-weight: bold;
  color: white;
  text-shadow: 1px 1px 1px rgba(0,0,0,0.5);
}

/* Asegurarse de que los encabezados de la tabla se muestren en blanco */
:deep(.v-data-table-header th) {
  color: white !important;
}

/* Estilo específico para la columna de Participación */
:deep(.v-data-table-header th.text-start:nth-child(2)) {
  color: white !important;
  font-weight: bold !important;
}
</style>
