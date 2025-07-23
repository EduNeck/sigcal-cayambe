<template>
  <v-container>
    <!-- FORMULARIO DE CONSULTA -->
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
            prepend-icon="mdi-format-list-bulleted"
            required
          />
          <v-text-field
            v-model="form.param"
            :label="etiquetaCampo"
            :prepend-icon="iconoCampo"
            required
            clearable
          />
          <v-btn type="submit" color="primary" block>Consultar</v-btn>
        </v-form>
      </v-card-text>
    </v-card>

    <!-- ALERTA -->
    <v-alert v-if="mensaje" type="info" class="my-4">
      {{ mensaje }}
    </v-alert>

    <!-- TABLA DE RESULTADOS -->
    <v-data-table
      v-if="respuesta.length"
      :items="respuesta"
      :headers="cabecera"
      items-per-page="10"
      class="elevation-1 my-4"
      dense
    >
      <template #item.CUANTIA="{ item }">
        {{ formatearMoneda(item.CUANTIA) }}
      </template>
      <template #item.acciones="{ item }">
        <v-btn icon @click="verDetalle(item)">
          <v-icon>mdi-eye</v-icon>
        </v-btn>
      </template>
    </v-data-table>

    <!-- DIALOGO DETALLE -->
    <v-dialog v-model="dialogo" max-width="900">
      <v-card>
        <v-card-title>
          <v-icon class="mr-2">mdi-file-document-outline</v-icon>
          Detalle del Trámite {{ seleccionado.NUMERO_TRAMITE || '' }}
          <v-spacer />
          <v-btn icon @click="dialogo = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-divider />
        <v-card-text>
          <v-row dense>
            <v-col cols="12" md="6">
              <v-text-field label="Número de Identificación" :model-value="seleccionado.NUM_IDENTIFICACION" readonly variant="outlined" dense />
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field label="Nombres" :model-value="seleccionado.NOMBRES" readonly variant="outlined" dense />
            </v-col>

            <v-col cols="12" md="6">
              <v-text-field label="Número de Trámite" :model-value="seleccionado.NUMERO_TRAMITE" readonly variant="outlined" dense />
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field label="Tipo Documento" :model-value="seleccionado.TIP_DOCUMENTO" readonly variant="outlined" dense />
            </v-col>

            <v-col cols="12" md="6">
              <v-text-field label="Comparece" :model-value="seleccionado.CALI_COMPARECE" readonly variant="outlined" dense />
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field label="Folio" :model-value="seleccionado.NUM_FOLIO" readonly variant="outlined" dense />
            </v-col>

            <v-col cols="12" md="6">
              <v-text-field label="Número de Inscripción" :model-value="seleccionado.NUM_INSCRPCION" readonly variant="outlined" dense />
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field label="Repertorio" :model-value="seleccionado.NUM_REPERTORIO" readonly variant="outlined" dense />
            </v-col>

            <v-col cols="12" md="6">
              <v-text-field label="Fecha Inscripción" :model-value="seleccionado.FECHA_INSCRIPCION" readonly variant="outlined" dense />
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field label="Tipo Bien" :model-value="seleccionado.TIP_BIEN" readonly variant="outlined" dense />
            </v-col>

            <v-col cols="12" md="6">
              <v-text-field label="Sector" :model-value="seleccionado.SECTOR" readonly variant="outlined" dense />
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field label="Contrato" :model-value="seleccionado.ACTO_CONTRATO" readonly variant="outlined" dense />
            </v-col>

            <v-col cols="12" md="6">
              <v-text-field label="Cuantía" :model-value="formatearMoneda(seleccionado.CUANTIA)" readonly variant="outlined" dense />
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field label="Fecha Escritura" :model-value="seleccionado.FECHA_ESCRITURA" readonly variant="outlined" dense />
            </v-col>

            <v-col cols="12" md="6">
              <v-text-field label="Notaría" :model-value="seleccionado.NOTARIA" readonly variant="outlined" dense />
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field label="Cantón Notaría" :model-value="seleccionado.CANTON_NOTARIA" readonly variant="outlined" dense />
            </v-col>

            <v-col cols="12" md="6">
              <v-text-field label="Parroquia" :model-value="seleccionado.PARROQUIA" readonly variant="outlined" dense />
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field label="Tipo de Superficie" :model-value="seleccionado.TIPO_SUPERFICIE" readonly variant="outlined" dense />
            </v-col>

            <v-col cols="12" md="6">
              <v-text-field label="Superficie Actual" :model-value="seleccionado.SUP_ACTUAL" readonly variant="outlined" dense />
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field label="Superficie Original" :model-value="seleccionado.SUP_ORIGINAL" readonly variant="outlined" dense />
            </v-col>

            <v-col cols="12">
              <v-text-field label="Estado Inscripción" :model-value="seleccionado.ESTADO_INSCRIPCION" readonly variant="outlined" dense />
            </v-col>

            <v-col cols="12">
              <v-textarea label="Descripción del Bien" :model-value="seleccionado.DESCRIP_BIEN" readonly variant="outlined" dense auto-grow />
            </v-col>

            <v-col cols="12">
              <v-textarea label="Linderos" :model-value="formatearLinderos(seleccionado.LINDEROS)" readonly variant="outlined" dense auto-grow />
            </v-col>

            <v-col cols="12">
              <v-textarea label="Comparecientes" :model-value="formatearComparecientesTexto(seleccionado.COMPARECIENTES)" readonly variant="outlined" dense auto-grow />
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions class="px-4 pb-4">
          <v-spacer />
          <v-btn color="success" variant="elevated" @click="sincronizarDatos" prepend-icon="mdi-sync">
            Sincronizar
          </v-btn>
          <v-btn color="grey" variant="outlined" @click="dialogo = false">
            Cerrar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- OVERLAY DE CARGA -->
    <v-overlay :model-value="cargando" class="align-center justify-center" persistent>
      <v-card class="pa-4" color="primary" dark>
        <v-progress-circular indeterminate color="white" size="40" class="mr-3" />
        Cargando resultados, por favor espere...
      </v-card>
    </v-overlay>
  </v-container>
</template>

<script>
import axios from 'axios';
import API_BASE_URL from '@/config/apiConfig';

export default {
  data() {
    return {
      form: { op: 1, param: '' },
      mensaje: '',
      respuesta: [],
      dialogo: false,
      seleccionado: {},
      cargando: false,
      tiposBusqueda: [
        { value: 1, label: 'Cédula / RUC' },
        { value: 2, label: 'Nombres' },
        { value: 3, label: 'Clave catastral' },
      ],
      cabecera: [
        { title: 'Trámite', key: 'NUMERO_TRAMITE' },
        { title: 'Identificación', key: 'NUM_IDENTIFICACION' },
        { title: 'Nombres', key: 'NOMBRES' },
        { title: 'Comparece', key: 'CALI_COMPARECE' },
        { title: 'Contrato', key: 'ACTO_CONTRATO' },
        { title: 'Cuantía', key: 'CUANTIA' },
        { title: 'Ver', key: 'acciones', sortable: false },
      ]
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
    }
  },
  methods: {
    async consultar() {
      if (!this.form.param.trim()) {
        this.mensaje = 'Debe ingresar un valor para buscar.';
        return;
      }

      this.mensaje = '';
      this.respuesta = [];
      this.cargando = true;

      try {
        const payload = {
          op: this.form.op,
          param: this.form.param.trim()
        };

        const { data } = await axios.post(`${API_BASE_URL}/consulta-rp`, payload, {
          headers: { 'Content-Type': 'application/json' },
          timeout: 30000
        });

        if (data && Array.isArray(data.results)) {
          this.respuesta = data.results;
          this.mensaje = `Consulta realizada exitosamente. Se encontraron ${this.respuesta.length} resultado(s).`;
        } else {
          this.respuesta = [];
          this.mensaje = 'No se encontraron resultados para los criterios de búsqueda.';
        }
      } catch (error) {
        console.error(error);
        this.mensaje = 'Ocurrió un error al consultar el servicio.';
      } finally {
        this.cargando = false;
      }
    },

    verDetalle(item) {
      this.seleccionado = item;
      this.dialogo = true;
    },

    formatearMoneda(valor) {
      if (!valor || valor === 0) return 'N/A';
      try {
        return new Intl.NumberFormat('es-EC', {
          style: 'currency',
          currency: 'USD'
        }).format(valor);
      } catch {
        return `$${valor}`;
      }
    },

    formatearLinderos(linderos) {
      if (!linderos) return 'N/A';
      return linderos.split('|').map(l => {
        const partes = l.split(':');
        return partes.length >= 2 ? `${partes[0].trim()}: ${partes.slice(1).join(':').trim()}` : l.trim();
      }).join('\n\n');
    },

    formatearComparecientesTexto(comparecientes) {
      if (!comparecientes) return 'N/A';
      return comparecientes.split('|').map(comp => {
        const partes = comp.split('/');
        return partes.length >= 3
          ? `• ${partes[0].trim()}: ${partes[2].trim()} (${partes[1].trim()})`
          : `• ${comp.trim()}`;
      }).join('\n');
    },

    sincronizarDatos() {
      console.log('=== DEBUG SINCRONIZACIÓN ===');
      console.log('Objeto seleccionado completo:', this.seleccionado);
      console.log('FECHA_INSCRIPCION raw:', this.seleccionado.FECHA_INSCRIPCION);
      console.log('Tipo de FECHA_INSCRIPCION:', typeof this.seleccionado.FECHA_INSCRIPCION);

      // Preparar los datos para sincronizar con el formulario de tenencia
      const fechaFormateada = this.formatearFechaParaFormulario(this.seleccionado.FECHA_INSCRIPCION);
      
      const datosSincronizacion = {
        fecha_inscripcion: fechaFormateada,
        repertorio: this.seleccionado.NUM_REPERTORIO || '',
        folio: this.seleccionado.NUM_FOLIO || '',
        numero_registro: this.seleccionado.NUM_INSCRPCION || ''
      };

      console.log('Fecha después de formatear:', fechaFormateada);
      console.log('Datos completos para sincronización:', datosSincronizacion);

      // Emitir evento al componente padre
      this.$emit('sincronizar-datos', datosSincronizacion);

      // Cerrar el diálogo
      this.dialogo = false;
    },

    formatearFechaParaFormulario(fecha) {
      console.log('=== FORMATEAR FECHA ===');
      console.log('Fecha recibida:', fecha);
      console.log('Tipo:', typeof fecha);
      
      if (!fecha) {
        console.log('Fecha vacía, retornando cadena vacía');
        return '';
      }
      
      // Convertir a string si es necesario
      const fechaStr = String(fecha).trim();
      console.log('Fecha como string:', fechaStr);
      
      try {
        // Si la fecha viene en formato ISO (2023-12-31T00:00:00.000Z)
        if (fechaStr.includes('T')) {
          const resultado = fechaStr.split('T')[0];
          console.log('Formato ISO detectado, resultado:', resultado);
          return resultado;
        }
        
        // Si la fecha viene en formato DD/MM/YYYY, convertir a YYYY-MM-DD
        if (fechaStr.includes('/')) {
          const partes = fechaStr.split('/');
          console.log('Formato DD/MM/YYYY detectado, partes:', partes);
          if (partes.length === 3) {
            const dia = partes[0].padStart(2, '0');
            const mes = partes[1].padStart(2, '0');
            const anio = partes[2];
            const resultado = `${anio}-${mes}-${dia}`;
            console.log('Resultado conversión DD/MM/YYYY:', resultado);
            return resultado;
          }
        }
        
        // Si la fecha viene en formato DD-MM-YYYY, convertir a YYYY-MM-DD
        if (fechaStr.includes('-') && !fechaStr.startsWith('20')) {
          const partes = fechaStr.split('-');
          console.log('Formato DD-MM-YYYY detectado, partes:', partes);
          if (partes.length === 3 && partes[2].length === 4) {
            const dia = partes[0].padStart(2, '0');
            const mes = partes[1].padStart(2, '0');
            const anio = partes[2];
            const resultado = `${anio}-${mes}-${dia}`;
            console.log('Resultado conversión DD-MM-YYYY:', resultado);
            return resultado;
          }
        }
        
        // Intentar usar Date para formatear fechas complejas
        const fechaObj = new Date(fechaStr);
        if (!isNaN(fechaObj.getTime())) {
          const resultado = fechaObj.toISOString().split('T')[0];
          console.log('Conversión usando Date object:', resultado);
          return resultado;
        }
        
        // Si ya está en formato YYYY-MM-DD, devolverla tal como está
        console.log('Devolviendo fecha sin cambios:', fechaStr);
        return fechaStr;
      } catch (error) {
        console.error('Error al formatear fecha:', error);
        console.log('Retornando fecha original por error:', fechaStr);
        return fechaStr;
      }
    }
  }
};
</script>
