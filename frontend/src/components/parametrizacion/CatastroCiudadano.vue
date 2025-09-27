<template>
  <v-container>
    <v-card class="pa-5" outlined>
      <v-card-title class="headline text-center grey lighten-2">Ingreso Ciudadano</v-card-title>

      <!-- BOTONES -->
      <v-row class="mb-4">
        <v-col cols="12" class="d-flex justify-center">
          <v-btn class="mx-2" color="primary" @click="nuevo">Nuevo</v-btn>
          <v-btn class="mx-2" color="success" @click="guardar" :disabled="idCiudadano !== null || !formEsValido()">Guardar</v-btn>
          <v-btn class="mx-2" color="success" @click="actualizar" :disabled="idCiudadano === null || !formEsValido()">Modificar</v-btn>
          <v-btn class="mx-2" color="error" @click="eliminar" :disabled="idCiudadano === null">Eliminar</v-btn>
          <v-btn class="mx-2" color="warning" @click="salir">Salir</v-btn>
        </v-col>
      </v-row>

      <!-- FORMULARIO -->
      <v-form ref="form" v-model="valid" lazy-validation>
        <!-- BLOQUE 1: Identificación -->
        <v-card class="mb-4" outlined>
          <v-card-title class="subtitle-1">Información de Identificación</v-card-title>
          <v-card-text>
            <v-row>
              <v-col cols="12" sm="6" md="4">
                <v-select
                  v-model="form.id_tipo_documento"
                  :items="tipoDocumentos"
                  item-text="tipoNombre"
                  item-value="id"
                  label="Tipo de Documento"
                  :rules="[v => !!v || 'Tipo de documento es obligatorio']"
                  required
                  @change="onChangeTipoDocumento"
                />
              </v-col>
              <v-col cols="12" sm="6" md="4">
                <v-select
                  v-model="form.id_tipo_persona"
                  :items="tipoPersonas"
                  item-text="tipoNombre"
                  item-value="id"
                  label="Tipo de Persona"
                  :rules="[v => !!v || 'Tipo de persona es obligatorio']"
                  required
                />
              </v-col>
              <v-col cols="12" sm="6" md="4">
                <v-select
                  v-model="form.id_personeria"
                  :items="tipoPersonerias"
                  item-text="tipoNombre"
                  item-value="id"
                  label="Personería"
                  :rules="[v => !!v || 'Personería es obligatoria']"
                  required
                />
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>

        <!-- BLOQUE 2: Datos Personales -->
        <v-card class="mb-4" outlined>
          <v-card-title class="subtitle-1">Información Personal</v-card-title>
          <v-card-text>
            <v-row>
              <v-col cols="12" sm="6" md="4">
                <v-text-field
                  ref="campoDocumento"
                  v-model="form.numero_documento"
                  label="Número de Documento"
                  :rules="[v => !!v || 'Número de documento es obligatorio']"
                  required
                  type="text"
                  @keypress="soloNumeros"
                  @input="validarFormulario"
                  :maxlength="(tipoDocumentoSeleccionado === 'CEDULA' || form.id_tipo_documento === 0 || form.id_tipo_documento === '0') ? 10 : (tipoDocumentoSeleccionado === 'RUC' ? 13 : 20)"
                  :hint="(tipoDocumentoSeleccionado === 'CEDULA' || form.id_tipo_documento === 0 || form.id_tipo_documento === '0') ? 'Debe ingresar 10 dígitos' : (tipoDocumentoSeleccionado === 'RUC' ? 'Debe ingresar 13 dígitos' : '')"
                  persistent-hint
                />
              </v-col>
              <v-col cols="12" sm="6" md="4">
                <v-text-field
                  v-model="form.nombre_principal"
                  :label="tipoDocumentoSeleccionado === 'RUC' ? 'Razón Social' : 'Nombre Principal'"
                  :rules="[v => !!v || (tipoDocumentoSeleccionado === 'RUC' ? 'Razón Social es obligatoria' : 'Nombre principal es obligatorio')]"
                  required
                  @input="(v) => { aTextoMayusculas('nombre_principal', v); updateNombres(); }"
                />
              </v-col>
              <v-col cols="12" sm="6" md="4">
                <v-text-field
                  v-model="form.apellido_primario"
                  label="Apellido Primario"
                  :rules="[v => tipoDocumentoSeleccionado === 'RUC' || !!v || 'Apellido primario es obligatorio']"
                  :required="tipoDocumentoSeleccionado !== 'RUC'"
                  @input="(v) => { aTextoMayusculas('apellido_primario', v); updateNombres(); }"
                />
              </v-col>
              <v-col cols="12" sm="6" md="4">
                <v-text-field
                  v-model="form.nombre_secundario"
                  label="Nombre Secundario"
                  :disabled="tipoDocumentoSeleccionado === 'RUC'"
                  @input="(v) => { aTextoMayusculas('nombre_secundario', v); updateNombres(); }"
                />
              </v-col>
              <v-col cols="12" sm="6" md="4">
                <v-text-field
                  v-model="form.apellido_secundario"
                  label="Apellido Secundario"
                  :disabled="tipoDocumentoSeleccionado === 'RUC'"
                  @input="(v) => { aTextoMayusculas('apellido_secundario', v); updateNombres(); }"
                />
              </v-col>
              <v-col cols="12" sm="6" md="4">
                <v-text-field
                  v-model="form.nombres"
                  :label="tipoDocumentoSeleccionado === 'RUC' ? 'Razón Social' : 'Nombres Completos'"
                  readonly
                />
              </v-col>
              <v-col cols="12" sm="6" md="4">
                <v-select
                  v-model="form.id_estado_civil"
                  :items="estadosCiviles"
                  item-text="tipoNombre"
                  item-value="id"
                  label="Estado Civil"
                  :rules="[v => tipoDocumentoSeleccionado === 'RUC' || !!v || 'Estado civil es obligatorio']"
                  :required="tipoDocumentoSeleccionado !== 'RUC'"
                  :disabled="tipoDocumentoSeleccionado === 'RUC'"
                />
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>

        <!-- BLOQUE 3: Datos Adicionales -->
        <v-card class="mb-4" outlined>
          <v-card-title class="subtitle-1">Datos Adicionales</v-card-title>
          <v-card-text>
            <v-row>
              <v-col cols="12" sm="6" md="4">
                <v-text-field
                  v-model="form.fecha_nacimiento"
                  label="Fecha de Nacimiento"
                  type="date"
                  :rules="[v => tipoDocumentoSeleccionado === 'RUC' || !!v || 'Fecha de nacimiento es obligatoria']"
                  :required="tipoDocumentoSeleccionado !== 'RUC'"
                  :disabled="tipoDocumentoSeleccionado === 'RUC'"
                />
              </v-col>
              <v-col cols="12" sm="6" md="4">
                <v-text-field 
                  v-model="form.telefono" 
                  label="Teléfono" 
                  @keypress="soloNumeros" 
                />
              </v-col>
              <v-col cols="12" sm="6" md="4">
                <v-text-field 
                  v-model="form.email" 
                  label="Email" 
                  type="email" 
                  :rules="[
                    v => !v || /.+@.+\..+/.test(v) || 'El email debe ser válido'
                  ]"
                />
              </v-col>
              <v-col cols="12" sm="6" md="4">
                <v-text-field 
                  v-model="form.direccion" 
                  label="Dirección"
                  @input="(v) => aTextoMayusculas('direccion', v)"
                />
              </v-col>
            </v-row>
            
            <!-- BLOQUE CONTROL: Información de auditoría -->
            <v-card class="mb-4 mt-6" outlined>
              <v-card-title class="subtitle-1 bg-grey-lighten-3">Control</v-card-title>
              <v-card-text>
                <v-row>
                  <v-col cols="12" sm="4">
                    <v-text-field
                      v-model="form.digitador"
                      label="Registrado por"
                      readonly
                      density="compact"
                    />
                  </v-col>
                  <v-col cols="12" sm="4">
                    <v-text-field
                      v-model="form.fecha_registro"
                      label="Fecha de Registro"
                      type="date"
                      readonly
                      density="compact"
                    />
                  </v-col>
                  <v-col cols="12" sm="4" v-if="form.fecha_actualizacion_aud">
                    <v-text-field
                      v-model="form.fecha_actualizacion_aud"
                      label="Última actualización"
                      readonly
                      density="compact"
                    />
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
          </v-card-text>
        </v-card>
      </v-form>

    </v-card>

    <!-- SNACKBARS -->
    <v-snackbar v-model="snackbarOkPush" :timeout="3000" color="success">
      {{ snackbarOK }}
      <template v-slot:actions>
        <v-btn variant="text" @click="snackbarOkPush = false">Cerrar</v-btn>
      </template>
    </v-snackbar>
    
    <v-snackbar v-model="snackbarErrorPush" :timeout="3000" color="error">
      {{ snackbarError }}
      <template v-slot:actions>
        <v-btn variant="text" @click="snackbarErrorPush = false">Cerrar</v-btn>
      </template>
    </v-snackbar>

    <!-- DIALOGO DE CONFIRMACIÓN -->
    <v-dialog v-model="confirmDelete" max-width="400">
      <v-card>
        <v-card-title class="headline">¿Está seguro de que desea eliminar este ciudadano?</v-card-title>
        <v-card-text>Esta acción no se puede deshacer.</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="grey" text @click="confirmDelete = false; snackbarError = 'Eliminación cancelada'; snackbarErrorPush = true;">Cancelar</v-btn>
          <v-btn color="red" text @click="confirmarEliminacion">Eliminar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import axios from 'axios';
import { mapActions, mapGetters } from 'vuex';
import API_BASE_URL from '@/config/apiConfig';
import { validarCedula, validarRUC } from '@/utils/validaciones';

export default {
  name: 'CatastroCiudadano',
  data() {
    return {
      valid: false,
      form: {
        id_ciudadano: null,
        id_tipo_documento: '',
        id_tipo_persona: '',
        id_personeria: '',
        numero_documento: '',
        nombre_principal: '',
        nombre_secundario: '',
        apellido_primario: '',
        apellido_secundario: '',
        nombres: '',
        fecha_nacimiento: '',
        telefono: '',
        email: '',
        direccion: '',
        id_estado_civil: '',
        fecha_registro: '',  // Solo para visualización, se genera en el backend
        digitador: '',  // Se asignará desde el store al guardar/actualizar
        fecha_actualizacion_aud: ''  // Solo para visualización, se genera en el backend
      },
      tipoDocumentos: [],
      tipoPersonas: [],
      tipoPersonerias: [],
      estadosCiviles: [],
      idCiudadano: null,
      snackbarOkPush: false,
      snackbarOK: '',
      snackbarErrorPush: false,
      snackbarError: '',
      confirmDelete: false
    };
  },

  created() {
    const idCiudadano = this.$route.query.id_ciudadano;
    if (idCiudadano) {
      this.idCiudadano = idCiudadano;
      this.updateIdCiudadano(idCiudadano);
    } else {
      this.resetIdCiudadano();
    }
  },

  computed: {
    ...mapGetters(['userLogin', 'userName']),
    
    isUpdateMode() {
      return this.idCiudadano !== null;
    },
    
    tipoDocumentoSeleccionado() {
      if (!this.form.id_tipo_documento || !this.tipoDocumentos.length) return '';
      
      const tipoDoc = this.tipoDocumentos.find(t => t.id === this.form.id_tipo_documento);
      return tipoDoc ? tipoDoc.descripcion.toUpperCase() : '';
    }
  },
  
  watch: {
    // Vigilar cambios en el formulario para validarlo
    'form': {
      deep: true,
      handler() {
        this.$nextTick(() => {
          if (this.$refs.form) {
            this.$refs.form.validate();
            console.log('Validando formulario, estado actual:', this.valid);
          }
        });
      }
    },
    // Vigilar cambios en valid para depuración
    valid(newValue) {
      console.log('La validez del formulario cambió a:', newValue);
    }
  },

  async mounted() {
    try {
      this.tipoDocumentos = await this.cargaCatalogos(7, 0);
      this.tipoPersonas = await this.cargaCatalogos(5, 0);
      this.tipoPersonerias = await this.cargaCatalogos(6, 0);
      this.estadosCiviles = await this.cargaCatalogos(4, 0);

      if (this.idCiudadano) {
        this.snackbarOK = 'Recuperando datos del ciudadano';
        this.snackbarOkPush = true;
        await this.recuperaCiudadano(this.idCiudadano);
      } else {
        this.snackbarOK = 'Nuevo Ciudadano';
        this.snackbarOkPush = true;
      }
      
      // Validar formulario después de cargar todos los datos
      this.$nextTick(() => {
        this.validarFormulario();
      });

      // Pequeña demora para asegurar que los campos se han llenado correctamente
      this.$nextTick(() => {
        // Validar el formulario después de cargar todos los datos
        if (this.$refs.form) {
          this.$refs.form.validate();
        }
      });
    } catch (error) {
      console.error('Error al montar el componente:', error);
    }
  },

  methods: {
    ...mapActions(['setIdCiudadano', 'updateIdCiudadano', 'resetIdCiudadano']),

    async cargaCatalogos(id_tipo_atributo, tipo) {
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
        throw new Error('No se pudo obtener el catálogo');
      }
    },

    updateNombres() {
      // Si es RUC, solo mostrar razón social
      if (this.tipoDocumentoSeleccionado === 'RUC') {
        this.form.nombres = this.form.nombre_principal.trim();
      } else {
        // Para otros tipos, mostrar apellidos y nombres completos
        this.form.nombres = `${this.form.apellido_primario} ${this.form.apellido_secundario} ${this.form.nombre_principal} ${this.form.nombre_secundario}`.trim();
      }
      
      // Validar el formulario después de actualizar los nombres
      this.$nextTick(() => {
        if (this.$refs.form) {
          this.$refs.form.validate();
        }
      });
    },

    async guardar() {
      // Reset cualquier mensaje de error previo
      this.snackbarErrorPush = false;
      this.snackbarError = '';
      
      try {
        // Validación básica de campos requeridos
        if (!this.formEsValido()) {
          this.snackbarError = 'Por favor, complete todos los campos requeridos correctamente';
          this.snackbarErrorPush = true;
          return;
        }

        // Actualizar el nombre completo
        this.updateNombres();

        // Validar número de documento según tipo
        const tipo = this.tipoDocumentoSeleccionado;
        const numeroDocumento = this.form.numero_documento;
        
        // Verificar si es cédula (puede ser '0' o 'CEDULA')
        const esCedula = 
          tipo === 'CEDULA' || 
          this.form.id_tipo_documento === 0;
        
        // Solo validar si hay un tipo seleccionado y un número ingresado
        if ((tipo || esCedula) && numeroDocumento) {
          // Validar que sea solo números
          if (!/^\d+$/.test(numeroDocumento)) {
            this.snackbarError = 'El número de documento debe contener solo dígitos';
            this.snackbarErrorPush = true;
            return;
          }
          
          // Validación específica para CÉDULA
          if (esCedula) {
            if (numeroDocumento.length !== 10) {
              this.snackbarError = 'La cédula debe tener exactamente 10 dígitos';
              this.snackbarErrorPush = true;
              return;
            }
            
            if (!validarCedula(numeroDocumento)) {
              this.snackbarError = 'Número de cédula no válido';
              this.snackbarErrorPush = true;
              return;
            }
          }
          
          // Validación específica para RUC
          if (tipo === 'RUC') {
            if (numeroDocumento.length !== 13) {
              this.snackbarError = 'El RUC debe tener exactamente 13 dígitos';
              this.snackbarErrorPush = true;
              return;
            }
            
            if (!validarRUC(numeroDocumento)) {
              this.snackbarError = 'Número de RUC no válido';
              this.snackbarErrorPush = true;
              return;
            }
          }
        }

        // Asegurar que el digitador sea el usuario actual usando la variable global del store
        // Utiliza el nombre de usuario (userName) o el login del usuario (userLogin) desde Vuex
        this.form.digitador = this.userName || this.userLogin || 'sistema';
        
        // Creamos un objeto sin la fecha de registro para enviar al backend
        // ya que la fecha se genera automáticamente en el servidor con NOW()
        const datosParaEnviar = { ...this.form };
        delete datosParaEnviar.fecha_registro;
        delete datosParaEnviar.fecha_actualizacion_aud;
        
        const response = await axios.post(`${API_BASE_URL}/inserta_ciudadano`, datosParaEnviar);
        this.idCiudadano = response.data;
        this.snackbarOK = 'Ciudadano guardado exitosamente';
        this.snackbarOkPush = true;
      } catch (error) {
        console.error('Error al guardar el ciudadano:', error);
        this.snackbarError = 'Error al guardar el ciudadano';
        this.snackbarErrorPush = true;
      }
    },

    async actualizar() {
      // Reset cualquier mensaje de error previo
      this.snackbarErrorPush = false;
      this.snackbarError = '';

      try {
        // Validación básica de campos requeridos
        if (!this.formEsValido()) {
          this.snackbarError = 'Por favor, complete todos los campos requeridos correctamente';
          this.snackbarErrorPush = true;
          return;
        }        // Actualizar el nombre completo
        this.updateNombres();

        // Validar número de documento según tipo
        const tipo = this.tipoDocumentoSeleccionado;
        const numeroDocumento = this.form.numero_documento;
        
        // Verificar si es cédula (puede ser '0' o 'CEDULA')
        const esCedula = 
          tipo === 'CEDULA' || 
          this.form.id_tipo_documento === 0;
        
        // Solo validar si hay un tipo seleccionado y un número ingresado
        if ((tipo || esCedula) && numeroDocumento) {
          // Validar que sea solo números
          if (!/^\d+$/.test(numeroDocumento)) {
            this.snackbarError = 'El número de documento debe contener solo dígitos';
            this.snackbarErrorPush = true;
            return;
          }
          
          // Validación específica para CÉDULA
          if (esCedula) {
            if (numeroDocumento.length !== 10) {
              this.snackbarError = 'La cédula debe tener exactamente 10 dígitos';
              this.snackbarErrorPush = true;
              return;
            }
            
            if (!validarCedula(numeroDocumento)) {
              this.snackbarError = 'Número de cédula no válido';
              this.snackbarErrorPush = true;
              return;
            }
          }
          
          // Validación específica para RUC
          if (tipo === 'RUC') {
            if (numeroDocumento.length !== 13) {
              this.snackbarError = 'El RUC debe tener exactamente 13 dígitos';
              this.snackbarErrorPush = true;
              return;
            }
            
            if (!validarRUC(numeroDocumento)) {
              this.snackbarError = 'Número de RUC no válido';
              this.snackbarErrorPush = true;
              return;
            }
          }
        }

        // Asegurar que el digitador sea el usuario actual para la actualización usando la variable global del store
        // Utiliza el nombre de usuario (userName) o el login del usuario (userLogin) desde Vuex
        this.form.digitador = this.userName || this.userLogin || 'sistema';
        
        // Creamos un objeto sin las fechas para enviar al backend
        // ya que la fecha de actualización se genera automáticamente en el servidor con NOW()
        const datosParaEnviar = { ...this.form };
        delete datosParaEnviar.fecha_registro; // La fecha de registro no debe cambiar
        delete datosParaEnviar.fecha_actualizacion_aud; // Se genera en el backend
        
        const response = await axios.put(`${API_BASE_URL}/actualiza_ciudadano/${this.idCiudadano}`, datosParaEnviar);
        this.snackbarOK = 'Datos actualizados exitosamente';
        this.snackbarOkPush = true;
        await this.recuperaCiudadano(this.idCiudadano);
      } catch (error) {
        console.error('Error al actualizar el ciudadano:', error);
        this.snackbarError = 'Error al actualizar el ciudadano';
        this.snackbarErrorPush = true;
      }
    },

    eliminar() {
      // Mostrar confirmación con dialog
      this.confirmDelete = true;
    },

    async confirmarEliminacion() {
      this.confirmDelete = false;
      try {
        await axios.delete(`${API_BASE_URL}/elimina_ciudadano_by_id/${this.idCiudadano}`);
        this.snackbarOK = 'Ciudadano eliminado exitosamente';
        this.snackbarOkPush = true;
        this.nuevo();
      } catch (error) {
        console.error('Error al eliminar el ciudadano:', error);
        this.snackbarError = 'Error al eliminar el ciudadano';
        this.snackbarErrorPush = true;
      }
    },

    nuevo() {
      // Reiniciar el formulario
      if (this.$refs.form) {
        this.$refs.form.reset();
      }
      
      this.form = {
        id_ciudadano: null,
        id_tipo_documento: '',
        id_tipo_persona: '',
        id_personeria: '',
        numero_documento: '',
        nombre_principal: '',
        nombre_secundario: '',
        apellido_primario: '',
        apellido_secundario: '',
        nombres: '',
        fecha_nacimiento: '',
        telefono: '',
        email: '',
        direccion: '',
        id_estado_civil: '',
        fecha_registro: '', // Solo para visualización, se genera en el backend
        digitador: '', // Se asignará desde el store al guardar
        fecha_actualizacion_aud: '' // Solo para visualización, se genera en el backend
      };
      this.idCiudadano = null;
    },

    salir() {
      this.$router.push('/busqueda-ciudadanos');
    },

    formatDate(date) {
      if (!date) return '';
      const d = new Date(date);
      const month = '' + (d.getMonth() + 1);
      const day = '' + d.getDate();
      const year = d.getFullYear();
      return [year, month.padStart(2, '0'), day.padStart(2, '0')].join('-');
    },

    onChangeTipoDocumento() {
      // Al cambiar el tipo de documento, limpiar el campo
      this.form.numero_documento = '';
      
      // Si es RUC, limpiar los campos específicos
      if (this.tipoDocumentoSeleccionado === 'RUC') {
        // Limpiar campos no necesarios para RUC
        this.form.nombre_secundario = '';
        this.form.apellido_secundario = '';
        this.form.fecha_nacimiento = '';
        this.form.id_estado_civil = '';
      }
      
      // Actualizar nombres completos
      this.$nextTick(() => {
        this.updateNombres();
        this.validarFormulario();
      });
    },
    
    soloNumeros(event) {
      // Permitir solo caracteres numéricos (0-9)
      const keyCode = event.keyCode ? event.keyCode : event.which;
      if (keyCode < 48 || keyCode > 57) {
        event.preventDefault();
        return;
      }
      
      // Verificar si es cédula (puede ser '0' o 'CEDULA')
      const esCedula = 
        this.tipoDocumentoSeleccionado === 'CEDULA' || 
        this.form.id_tipo_documento === 0 || 
        this.form.id_tipo_documento === '0';
      
      // Limitar longitud según el tipo de documento
      if (esCedula && 
          this.form.numero_documento && 
          this.form.numero_documento.length >= 10) {
        if (keyCode !== 8 && keyCode !== 46) { // No es backspace ni delete
          event.preventDefault();
          return;
        }
      } else if (this.tipoDocumentoSeleccionado === 'RUC' && 
                this.form.numero_documento && 
                this.form.numero_documento.length >= 13) {
        if (keyCode !== 8 && keyCode !== 46) { // No es backspace ni delete
          event.preventDefault();
          return;
        }
      }
      
      // Validar el formulario después de ingresar un número
      this.$nextTick(() => {
        this.validarFormulario();
      });
    },

    async recuperaCiudadano(idCiudadano) {
      try {
        const response = await axios.get(`${API_BASE_URL}/recupera_ciudadano_by_id/${idCiudadano}`);
        if (response.data) {
          // Formatear fechas a yyyy-MM-dd si existen
          const formatDate = (dateStr) => {
            if (!dateStr) return '';
            const d = new Date(dateStr);
            if (isNaN(d)) return dateStr; // fallback
            const year = d.getFullYear();
            const month = String(d.getMonth() + 1).padStart(2, '0');
            const day = String(d.getDate()).padStart(2, '0');
            return `${year}-${month}-${day}`;
          };
          // Convertir campos de texto a mayúsculas
          const dataEnMayusculas = {...response.data};
          ['nombre_principal', 'nombre_secundario', 'apellido_primario', 'apellido_secundario', 'direccion'].forEach(campo => {
            if (dataEnMayusculas[campo] && typeof dataEnMayusculas[campo] === 'string') {
              dataEnMayusculas[campo] = dataEnMayusculas[campo].toUpperCase();
            }
          });
          
          this.form = {
            ...this.form,
            ...dataEnMayusculas,
            fecha_nacimiento: formatDate(response.data.fecha_nacimiento),
            fecha_registro: formatDate(response.data.fecha_registro)
          };
          
          // Validar el formulario después de recuperar los datos
          this.$nextTick(() => {
            this.validarFormulario();
          });
        } else {
          this.snackbarError = 'No se encontraron datos para el ciudadano';
          this.snackbarErrorPush = true;
        }
      } catch (error) {
        console.error('Error al recuperar el ciudadano:', error);
        this.snackbarError = 'Error al recuperar el ciudadano';
        this.snackbarErrorPush = true;
      }
    },
    
    // Método para validar el formulario explícitamente
    validarFormulario() {
      console.log('Validando formulario manualmente');
      if (this.$refs.form) {
        console.log('Estado antes de validar:', this.valid);
        const result = this.$refs.form.validate();
        
        // Forzar actualización del estado valid basado en requisitos mínimos
        if (!this.valid && this.formEsValido()) {
          console.log('Forzando estado valid a true porque cumple requisitos mínimos');
          this.valid = true;
        }
        
        console.log('Estado después de validar:', this.valid);
        return result;
      }
      return false;
    },
    
    // Método para verificar si el formulario tiene los datos mínimos requeridos
    formEsValido() {
      const f = this.form;
      const esRUC = this.tipoDocumentoSeleccionado === 'RUC';
      
      // Verificar campos obligatorios básicos
      if (!f.id_tipo_documento || !f.numero_documento || !f.nombre_principal) {
        return false;
      }
      
      // Verificar campos adicionales solo para personas naturales (no RUC)
      if (!esRUC) {
        // Para personas naturales verificar apellido, fecha nacimiento y estado civil
        if (!f.apellido_primario || !f.fecha_nacimiento || !f.id_estado_civil) {
          return false;
        }
      }
      
      // Verificar si es cédula (puede ser '0' o 'CEDULA')
      const esCedula = 
        this.tipoDocumentoSeleccionado === 'CEDULA' || 
        f.id_tipo_documento === 0 || 
        f.id_tipo_documento === '0';
      
      // Validar longitud de cédula/RUC según tipo
      if (esCedula && f.numero_documento.length !== 10) {
        return false;
      }
      if (esRUC && f.numero_documento.length !== 13) {
        return false;
      }
      
      return true;
    },
    
    // Método para convertir texto a mayúsculas
    aTextoMayusculas(campo, valor) {
      if (typeof valor === 'string') {
        this.form[campo] = valor.toUpperCase();
      }
    }
  }
};
</script>

<style scoped>
.v-card {
  background-color: white;
}

.v-btn {
  font-weight: bold;
}

.v-snackbar {
  font-weight: bold;
}
</style>

