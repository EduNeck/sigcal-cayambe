<template>
  <v-app-bar color="#BDBDBD" :elevation="1" class="d-flex justify-center">
    <v-app-bar-title class="text-center">
      {{ getTipoPredio === 1 ? 'URBANO' : 'RURAL' }}
    </v-app-bar-title>
  </v-app-bar>

  <v-container class="container fill-height">
    <v-row justify="center">
      <v-col cols="12" class="text-center">
        <h2 class="titulo-pantalla">Genera Certificados</h2>
      </v-col>

      <v-col cols="12" class="d-flex justify-center flex-wrap">
        <v-btn class="btn_app mx-2" append-icon="mdi-check" color="success" @click="enviarFormulario">Generar</v-btn>
        <v-btn class="btn_app mx-2" append-icon="mdi-broom" color="warning" @click="limpiarCampos">Limpiar</v-btn>
        <v-btn class="btn_app mx-2" append-icon="mdi-magnify" color="primary" @click="cargarDatosPorClave">Buscar</v-btn>
        <v-btn class="btn_app mx-2" append-icon="mdi-close" color="error" @click="navigateToMenu">Salir</v-btn>
      </v-col>

      <v-col cols="12" md="8">
        <v-form ref="form" v-model="valid" lazy-validation>

          <!-- Bloque Certificados -->
          <v-card class="pa-4 neutral-card mb-4">
            <h3 class="seccion-titulo">Certificados</h3>
            <v-row>
              <v-col cols="12" class="d-flex align-center">
                <v-checkbox
                  v-model="form.certificadoPlusvalia"
                  label="Certificado de Plusvalía"
                  color="primary"
                  hide-details
                  class="ma-0 pa-0"
                  :style="'margin-top: 0px;'"
                />
              </v-col>
            </v-row>
          </v-card>

          <!--  Bloque 1: Identificación -->
          <v-card class="pa-4 neutral-card mb-4">
            <h3 class="seccion-titulo"> Datos del Predio</h3>
            <v-row class="align-center">
              <!-- Se elimina el checkbox de aquí -->
              <v-col cols="12">
                <v-row>
                  <v-col cols="6">
                    <v-text-field
                      v-model="form.claveCatastral"
                      label="Clave Catastral"
                      :rules="[v => !!v || 'Clave Catastral es requerida']"
                      required
                      class="white-text-field"
                      @keyup.enter="cargarDatosPorClave"
                      @blur="cargarDatosPorClave"
                    >
                      <template v-slot:append-inner>
                        <v-icon v-if="claveStatus === 'ok'" color="green">mdi-check-circle</v-icon>
                        <v-icon v-else-if="claveStatus === 'fail'" color="red">mdi-close-circle</v-icon>
                      </template>
                    </v-text-field>
                    <div v-if="claveStatus === 'fail'" class="mensaje-error-clave">
                      No se encontraron registros asociados a la clave catastral ingresada.
                    </div>
                  </v-col>
                  <v-col cols="6">
                    <v-text-field
                      v-if="propietariosList.length <= 1"
                      v-model="form.propietarios"
                      label="Propietarios"
                      :rules="[v => !!v || 'Propietarios es requerido']"
                      required
                      class="white-text-field"
                    />
                    <v-select
                      v-else
                      v-model="selectedPropietario"
                      :items="propietariosList"
                      :item-title="item => `${item.nombres} - ${item.numero_documento} (${item.porcentaje_participacion}%)`"
                      item-value="id_tenencia"
                      label="Seleccione Propietario"
                      :rules="[v => !!v || 'Seleccione un propietario']"
                      required
                      class="white-text-field"
                      @update:model-value="onPropietarioChange"
                    />
                    <div v-if="showSinValoracion" class="mensaje-error-clave">
                      Predio sin valoración.
                    </div>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
          </v-card>

          <!--  Bloque 2: Avalúos y Áreas en 3 columnas -->
          <v-card class="pa-4 neutral-card mb-4">
            <h3 class="seccion-titulo">Valoraciones y Áreas</h3>
            <v-row>
              <v-col cols="12" md="4">
                <v-text-field
                  v-model.number="form.avaluoSuelo"
                  label="Avalúo Suelo"
                  type="number"
                  :rules="[v => !!v || 'Requerido']"
                  required
                  class="white-text-field"
                  readonly
                />
                <v-text-field
                  v-model.number="form.avaluoTotal"
                  label="Avalúo Total"
                  type="number"
                  :rules="[v => !!v || 'Requerido']"
                  required
                  class="white-text-field destacado-avaluo"
                  readonly
                />
              </v-col>

              <v-col cols="12" md="4">
                <v-text-field
                  v-model.number="form.avaluoConstruccion"
                  label="Avalúo Construcción"
                  type="number"
                  :rules="[v => !!v || 'Requerido']"
                  required
                  class="white-text-field"
                  readonly
                />
                <v-text-field
                  v-model.number="form.areasSuelo"
                  label="Áreas Suelo (m²)"
                  type="number"
                  :rules="[v => !!v || 'Requerido']"
                  required
                  class="white-text-field"
                  readonly
                />
              </v-col>

              <v-col cols="12" md="4">
                <v-text-field
                  v-model.number="form.areasConstruccion"
                  label="Áreas Construcción (m²)"
                  type="number"
                  :rules="[v => !!v || 'Requerido']"
                  required
                  class="white-text-field"
                  readonly
                />
              </v-col>
            </v-row>
          </v-card>

          <!-- Bloque 3: Trámite -->
          <v-card class="pa-4 neutral-card">
            <h3 class="seccion-titulo">Información del Trámite</h3>
            <v-select
              v-model="form.tipoTramite"
              :items="tipoTramites"
              item-text="descripcion"
              item-value="descripcion"
              label="Tipo Trámite"
              :rules="[v => !!v || 'Tipo Trámite es requerido']"
              required
              class="white-text-field"
            />
            <v-text-field
              v-model.number="form.cuantias"
              label="Cuantías"
              type="number"
              :rules="[v => !!v || 'Cuantías es requerida']"
              required
              class="white-text-field"
            />
          </v-card>

        </v-form>
      </v-col>
    </v-row>

    <v-snackbar v-model="snackbarErrorPush" :timeout="3000" color="error" rounded="pill">
      {{ snackbarError }}
    </v-snackbar>
    <v-snackbar v-model="snackbarOkPush" :timeout="3000" color="success" rounded="pill">
      {{ snackbarOk }}
    </v-snackbar>
    <v-snackbar v-model="snackbarNotaPush" :timeout="3000" color="info" rounded="pill">
      {{ snackbarNota }}
    </v-snackbar>
  </v-container>
</template>

<script>
import axios from 'axios';
import API_BASE_URL from '@/config/apiConfig';
import { mapGetters } from 'vuex';

export default {
  name: 'GeneraCertificados',
  data() {
    return {
      valid: false,
      form: {
        claveCatastral: '',
        propietarios: '',
        avaluoSuelo: '',
        avaluoConstruccion: '',
        avaluoTotal: '',
        areasConstruccion: '',
        areasSuelo: '',
        tipoTramite: '',
        cuantias: '',
        certificadoPlusvalia: false
      },
      snackbarErrorPush: false,
      snackbarError: '',
      snackbarOkPush: false,
      snackbarOk: '',
      snackbarNotaPush: false,
      snackbarNota: '',
      tipoTramites: [],
      propietariosList: [],
      selectedPropietario: null,
      claveStatus: null, // 
      showSinValoracion: false
    };
  },
  computed: {
    ...mapGetters(['getTipoPredio'])
  },
  async mounted() {
    try {
      this.tipoTramites = await this.cargaCatalogo(94, 0);
    } catch (error) {
      console.error('Error al cargar tipo de trámites:', error);
    }
  },
  methods: {
    enviarFormulario() {
      if (this.$refs.form.validate()) {
        this.snackbarOk = 'Certificado generado correctamente';
        this.snackbarOkPush = true;
      } else {
        this.snackbarNota = 'Formulario inválido';
        this.snackbarNotaPush = true;
      }
    },
    navigateToMenu() {
      this.$router.push('/menu-predial');
    },
    async cargarDatosPorClave() {
      const clave = this.form.claveCatastral;
      if (!clave) {
        this.claveStatus = null;
        return;
      }
      try {
        const response = await axios.get(`${API_BASE_URL}/certificado_detalle_by_clave/${encodeURIComponent(clave)}`);
        const data = response.data || [];
        this.propietariosList = data.map(item => ({
          ...item,
          label: `${item.nombres} - ${item.numero_documento}`
        }));
        if (this.propietariosList.length === 0) {
          this.claveStatus = 'fail';
          this.snackbarError = 'No se encontraron registros asociados a la clave catastral ingresada.';
          this.snackbarErrorPush = true;
          this.form.propietarios = '';
          this.form.avaluoSuelo = '';
          this.form.avaluoConstruccion = '';
          this.form.avaluoTotal = '';
          this.form.areasConstruccion = '';
          this.form.areasSuelo = '';
          this.form.cuantias = '';
          this.selectedPropietario = null;
          return;
        }
        this.claveStatus = 'ok';
        if (this.propietariosList.length === 1) {
          const propietario = this.propietariosList[0];
          this.form.propietarios = propietario.nombres || '';
          this.form.avaluoSuelo = propietario.valor_suelo_porcentual || '';
          this.form.avaluoConstruccion = propietario.valor_construcciones_porcentual || '';
          this.form.avaluoTotal = propietario.avaluo_predio_porcentual || '';
          this.form.areasConstruccion = propietario.area_construcciones_porcentual || '';
          this.form.areasSuelo = propietario.area_suelo_porcentual || '';
          this.form.cuantias = propietario.avaluo_predio_porcentual || '';
          this.selectedPropietario = propietario.id_tenencia;
        } else {
          this.form.propietarios = '';
          this.selectedPropietario = null;
        }
      } catch (error) {
        this.claveStatus = 'fail';
        this.snackbarError = 'No se pudo cargar la información del predio';
        this.snackbarErrorPush = true;
        console.error('Error al cargar datos por clave catastral:', error);
      }
    },
    onPropietarioChange(id_tenencia) {
      const propietario = this.propietariosList.find(p => p.id_tenencia === id_tenencia);
      if (propietario) {
        this.form.propietarios = propietario.nombres || '';
        this.form.avaluoSuelo = propietario.valor_suelo_porcentual || '';
        this.form.avaluoConstruccion = propietario.valor_construcciones_porcentual || '';
        this.form.avaluoTotal = propietario.avaluo_predio_porcentual || '';
        this.form.areasConstruccion = propietario.area_construcciones_porcentual || '';
        this.form.areasSuelo = propietario.area_suelo_porcentual || '';
        this.form.cuantias = propietario.avaluo_predio_porcentual || '';
        // Mostrar mensaje si no hay datos de valoración
        if (
          (!this.form.avaluoSuelo || Number(this.form.avaluoSuelo) === 0) &&
          (!this.form.avaluoConstruccion || Number(this.form.avaluoConstruccion) === 0) &&
          (!this.form.avaluoTotal || Number(this.form.avaluoTotal) === 0) &&
          (!this.form.areasConstruccion || Number(this.form.areasConstruccion) === 0) &&
          (!this.form.areasSuelo || Number(this.form.areasSuelo) === 0)
        ) {
          this.showSinValoracion = true;
        } else {
          this.showSinValoracion = false;
        }
      }
    },
    async cargaCatalogo(id_tipo_atributo, tipo) {
      try {
        const response = await axios.get(`${API_BASE_URL}/catalogo/${id_tipo_atributo}/${tipo}`);
        if (Array.isArray(response.data)) {
          const uniqueData = response.data.filter((item, index, self) =>
            index === self.findIndex((t) => t.id === item.id)
          );
          return uniqueData.map(item => ({
            ...item,
            tipoNombre: item.descripcion,
            title: item.descripcion
          }));
        } else {
          throw new Error('La respuesta de la API no es un array');
        }
      } catch (error) {
        console.error('Error fetching catalogo:', error);
        return [];
      }
    },
    limpiarCampos() {
      this.form = {
        claveCatastral: '',
        propietarios: '',
        avaluoSuelo: '',
        avaluoConstruccion: '',
        avaluoTotal: '',
        areasConstruccion: '',
        areasSuelo: '',
        tipoTramite: '',
        cuantias: '',
        certificadoPlusvalia: false
      };
      this.propietariosList = [];
      this.selectedPropietario = null;
      this.claveStatus = null;
      this.snackbarError = '';
      this.snackbarOk = '';
      this.snackbarNota = '';
      this.snackbarErrorPush = false;
      this.snackbarOkPush = false;
      this.snackbarNotaPush = false;
    }
  }
};
</script>

<style scoped>
.titulo-pantalla {
  font-size: 2rem;
  color: #333333;
}

.seccion-titulo {
  font-weight: bold;
  font-size: 1.2rem;
  margin-bottom: 1rem;
  color: #4A4A4A;
}

.container {
  background-color: #E8E8E8;
}

.btn_app {
  background-color: #8C8C8C;
  color: #FFFFFF;
}

.v-btn {
  margin-top: 20px;
}

.white-text-field .v-input__control {
  background-color: #FFFFFF ;
}

.white-text-field .v-input__slot {
  background-color: #FFFFFF ;
}

.neutral-card {
  background-color: #F7F6F2;
  border: 1px solid #D6D6D6;
}

.destacado-avaluo {
  background-color: #fffbe6 ;
  border: 2px solid rgb(107, 103, 93) ;
  border-radius: 6px;
}
.destacado-avaluo input {
  font-size: 1.3rem;
  font-weight: bold;
  color: rgb(107, 103, 93) ;
  background-color: #fffbe6 ;
}

.mensaje-error-clave {
  color: #c0392b;
  font-size: 0.95rem;
  margin-top: -12px;
  margin-bottom: 10px;
  margin-left: 8px;
  display: flex;
  align-items: center;
  gap: 4px;
}
</style>
