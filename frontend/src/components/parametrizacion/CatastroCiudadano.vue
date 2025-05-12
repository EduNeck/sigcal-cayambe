<template>
  <v-container>
    <v-card class="pa-5" outlined>
      <!-- Título principal centrado con fondo gris -->
      <v-card-title class="headline text-center grey lighten-2">Ingreso Ciudadano</v-card-title>
      
      <!-- Sección superior para los botones -->
      <v-row class="mb-4">
        <v-col cols="12" class="d-flex justify-center">
          <v-btn class="mx-2" color="primary" @click="nuevo">Nuevo</v-btn>
          <v-btn class="mx-2" color="success" @click="guardar" :disabled="idCiudadano !== null">Guardar</v-btn>
          <v-btn class="mx-2" color="success" @click="actualizar" :disabled="idCiudadano === null">Modificar</v-btn>
          <v-btn class="mx-2" color="success" @click="eliminar" :disabled="idCiudadano === null">Eliminar</v-btn>
          <v-btn class="mx-2" color="warning" @click="salir">Salir</v-btn>
        </v-col>
      </v-row>

      <v-form ref="form" v-model="valid" lazy-validation>
        <!-- Primer Bloque: Tipo de Documento, Tipo de Persona, Personería -->
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
                  required
                ></v-select>
              </v-col>
              <v-col cols="12" sm="6" md="4">
                <v-select
                  v-model="form.id_tipo_persona"
                  :items="tipoPersonas"
                  item-text="tipoNombre"
                  item-value="id"
                  label="Tipo de Persona"
                  required
                ></v-select>
              </v-col>
              <v-col cols="12" sm="6" md="4">
                <v-select
                  v-model="form.id_personeria"
                  :items="tipoPersonerias"
                  item-text="tipoNombre"
                  item-value="id"
                  label="Personería"
                  required
                ></v-select>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>

        <!-- Segundo Bloque: Nombres -->
        <v-card class="mb-4" outlined>
          <v-card-title class="subtitle-1">Información Personal</v-card-title>
          <v-card-text>
            <v-row>
              <v-col cols="12" sm="6" md="4">
                <v-text-field
                  v-model="form.numero_documento"
                  label="Número de Documento"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6" md="4">
                <v-text-field
                  v-model="form.nombre_principal"
                  label="Nombre Principal"
                  required
                  @input="updateNombres"
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6" md="4">
                <v-text-field
                  v-model="form.apellido_primario"
                  label="Apellido Primario"
                  required
                  @input="updateNombres"
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6" md="4">
                <v-text-field
                  v-model="form.nombre_secundario"
                  label="Nombre Secundario"
                  @input="updateNombres"
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6" md="4">
                <v-text-field
                  v-model="form.apellido_secundario"
                  label="Apellido Secundario"
                  @input="updateNombres"
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6" md="4">
                <v-text-field
                  v-model="form.nombres"
                  label="Nombres Completos"
                  required
                  readonly
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6" md="4">
                <v-select
                  v-model="form.id_estado_civil"
                  :items="estadosCiviles"
                  item-text="tipoNombre"
                  item-value="id"
                  label="Estado Civil"
                ></v-select>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>

        <!-- Tercer Bloque: Fechas y Datos Adicionales -->
        <v-card class="mb-4" outlined>
          <v-card-title class="subtitle-1">Datos Adicionales</v-card-title>
          <v-card-text>
            <v-row>
              <v-col cols="12" sm="6" md="4">
                <v-text-field
                  v-model="form.fecha_nacimiento"
                  label="Fecha de Nacimiento"
                  type="date"
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6" md="4">
                <v-text-field
                  v-model="form.telefono"
                  label="Teléfono"
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6" md="4">
                <v-text-field
                  v-model="form.email"
                  label="Email"
                  type="email"
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6" md="4">
                <v-text-field
                  v-model="form.direccion"
                  label="Dirección"
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6" md="4">
                <v-text-field
                  v-model="form.fecha_registro"
                  label="Fecha de Registro"
                  type="date"
                  readonly
                ></v-text-field>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-form>
    </v-card>
    <!--Alerta -->                    
    <v-snackbar v-model="snackbarOkPush" :timeout="3000" color="success">
      {{ snackbarOK }}
    </v-snackbar>
    <v-snackbar v-model="snackbarErrorPush" :timeout="3000" color="fail">
      {{ snackbarError }}
    </v-snackbar>    
  </v-container>
</template>

<script>
import axios from 'axios';
import { mapActions } from 'vuex';
import API_BASE_URL from '@/config/apiConfig';

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
        fecha_registro: ''
      },
      tipoDocumentos: [],
      tipoPersonas: [],
      tipoPersonerias: [],
      estadosCiviles: [],
      idCiudadano: null,
      snackbarOkPush: false,
      snackbarOK: '',
      snackbarErrorPush: false,
      snackbarError: ''
    };
  },

  // Crea el componente Id Ciudadano
  created() {
    console.log('created' , this.$route.query.id_ciudadano);
    const idCiudadano = this.$route.query.id_ciudadano;
    console.log('ID DEL CIUDADANO RECIBIDO:', idCiudadano);
    if (idCiudadano) {
      console.log('ID Ciudadano Created:', idCiudadano);
      this.idCiudadano = idCiudadano;
      this.updateIdCiudadano(idCiudadano);// setea variable global

    }else{
      console.log('SIN ID DEL CIUDADANO RECIBIDO');
      this.resetIdCiudadano();
    }
  },

  computed: {
    isUpdateMode(){
      console.log('isUpdateMode:', this.idCiudadano);
      return this.idCiudadano !== null;
    }
  },

  async mounted() {
    // Cargar catálogos
    try {
      console.log('Componente montado ciudadano');
      this.tipoDocumentos = await this.cargaCatalogos(7,0); // Obtén los datos para el tipo de documento
      this.tipoPersonas = await this.cargaCatalogos(5,0); // Obtén los datos para el tipo de persona
      this.tipoPersonerias = await this.cargaCatalogos(6,0); // Obtén los datos para el tipo de personería
      this.estadosCiviles = await this.cargaCatalogos(4,0); // Obtén los datos para el estado civil
      console.log('Datos del catálogo cargados:', 
      this.tipoDocumentos, 
      this.tipoPersonas, 
      this.tipoPersonerias,
      this.estadosCiviles);

      // Si hay un idCiudadano en el estado global, recupera los datos del ciudadano
      if (this.idCiudadano) {
        this.snackbarOK = 'Recuperando datos del ciudadano';
        this.snackbarOkPush = true;
        await this.recuperaCiudadano(this.idCiudadano);
      }else{
        this.snackbarOK = 'Nuevo Ciudadano';
        this.snackbarOkPush = true;
      }
    } catch (error) {
      console.error('Error al montar el componente:', error);
    }    
  },

  methods: {
    ...mapActions(['setIdCiudadano','updateIdCiudadano','resetIdCiudadano']),
    // Obtiene Catalogo
    async cargaCatalogos(id_tipo_atributo, tipo) {
      try {
        const response = await axios.get(`${API_BASE_URL}/catalogo/${id_tipo_atributo}/${tipo}`);
        console.log(`Datos obtenidos para id_tipo_atributo ${id_tipo_atributo} y tipo ${tipo}:`, response.data);
        
        if (Array.isArray(response.data)) {
          // Eliminar duplicados basados en el campo 'id'
          const uniqueData = response.data.filter((item, index, self) =>
            index === self.findIndex((t) => t.id === item.id)
          );
          return uniqueData.map(item => ({
            ...item,
            tipoNombre: item.descripcion, // Crea la propiedad `tipoNombre`
            title: item.descripcion        // Crea la propiedad `title`
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
      this.form.nombres = `${this.form.apellido_primario} ${this.form.apellido_secundario} ${this.form.nombre_principal} ${this.form.nombre_secundario}`.trim();
    },

    async guardar() {
      this.updateNombres(); // Asegurarse de que el campo nombres esté actualizado
      console.log('Guardando formulario:', this.form);      
      const nuevoCiudadano = {
        id_tipo_documento: this.form.id_tipo_documento,
        id_tipo_persona: this.form.id_tipo_persona,
        id_personeria: this.form.id_personeria,
        numero_documento: this.form.numero_documento,
        nombre_principal: this.form.nombre_principal || '',
        nombre_secundario: this.form.nombre_secundario || '',
        apellido_primario: this.form.apellido_primario || '',
        apellido_secundario: this.form.apellido_secundario || '',
        nombres: this.form.nombres || '',
        fecha_nacimiento: this.form.fecha_nacimiento || '',
        telefono: this.form.telefono || '',
        email: this.form.email || '',
        direccion: this.form.direccion || '',
        id_estado_civil: this.form.id_estado_civil || ''
      };

      try {
        const response = await axios.post(`${API_BASE_URL}/inserta_ciudadano`, nuevoCiudadano);       
        console.log('Ciudadano guardado:', response.data);
        this.idCiudadano = response.data;
        console.log('ID Ciudadano Asignado:', this.idCiudadano); // Comprobación adicional
        this.snackbarOK = 'Ciudadano guardado exitosamente';
        this.snackbarOkPush = true;
      } catch (error) {
        console.error('Error al guardar el ciudadano:', error);
        this.snackbarError = 'Error al guardar el ciudadano';
        this.snackbarErrorPush = true;
      }
    },

    async recuperaCiudadano(idCiudadano) {
      console.log('Recuperando ciudadano:', idCiudadano);
      try {
        const response = await axios.get(`${API_BASE_URL}/recupera_ciudadano_by_id/${idCiudadano}`);
        const ciudadano = response.data;
        console.log('Ciudadano recuperado:', ciudadano);
        this.form = {
          id_ciudadano: ciudadano.id_ciudadano,
          id_tipo_documento: ciudadano.id_tipo_documento,
          id_tipo_persona: ciudadano.id_tipo_persona,
          id_personeria: ciudadano.id_personeria,
          numero_documento: ciudadano.numero_documento,
          nombre_principal: ciudadano.nombre_principal,
          nombre_secundario: ciudadano.nombre_secundario,
          apellido_primario: ciudadano.apellido_primario,
          apellido_secundario: ciudadano.apellido_secundario,
          nombres: ciudadano.nombres,
          fecha_nacimiento: ciudadano.fecha_nacimiento.split('T')[0],
          telefono: ciudadano.telefono,
          email: ciudadano.email,
          direccion: ciudadano.direccion,
          id_estado_civil: ciudadano.id_estado_civil,
          fecha_registro: this.formatDate(ciudadano.fecha_registro)
        };
        this.idCiudadano = idCiudadano;
      } catch (error) {
        console.error('Error al recuperar el ciudadano:', error);
        this.snackbarError = 'Error al recuperar el ciudadano';
        this.snackbarErrorPush = true;
      }
    },

    async actualizar() {
      this.updateNombres(); // Asegurarse de que el campo nombres esté actualizado
      console.log('Actualizando formulario:', this.form);
      console.log('ID Ciudadano Actual:', this.idCiudadano); // Comprobación adicional
      console.log('Formulario:', JSON.stringify(this.form));

      if (!this.idCiudadano) {
        console.error('ID Ciudadano está vacío');
        this.snackbarError = 'ID Ciudadano no está disponible para actualizar';
        this.snackbarErrorPush = true;
        return;
      }

      const formData = { ...this.form };
      Object.keys(formData).forEach(key => {
        if (formData[key] === '') {
          formData[key] = '';
        }
      });

      try {
        console.log('Actualizando ciudadano:', this.idCiudadano);
        const response = await axios.put(`${API_BASE_URL}/actualiza_ciudadano/${this.idCiudadano}`, formData);
        console.log('Ciudadano actualizado:', response.data);
        this.snackbarOK = 'Datos actualizados exitosamente';
        this.snackbarOkPush = true;
        await this.recuperaCiudadano(this.idCiudadano);
      } catch (error) {
        console.error('Error al actualizar el ciudadano:', error);
        this.snackbarError = 'Error al actualizar el ciudadano';
        this.snackbarErrorPush = true;
      }
    },


    async eliminar() {
      console.log('Eliminando ciudadano:', this.idCiudadano);
      try {
        const response = await axios.delete(`${API_BASE_URL}/elimina_ciudadano_by_id/${this.idCiudadano}`);
        console.log('Ciudadano eliminado:', response.data);
        this.snackbarOK = 'Ciudadano eliminado exitosamente';
        this.snackbarOkPush = true;
        this.nuevo(); // Limpiar el formulario y el estado global
      } catch (error) {
        console.error('Error al eliminar el ciudadano:', error);
        this.snackbarError = 'Error al eliminar el ciudadano';
        this.snackbarErrorPush = true;
      }
    },

    nuevo() {
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
        
      };
      this.setIdCiudadano(null); // Limpiar el idCiudadano en el estado global
    },
    salir() {
      this.$router.push('/listado-ciudadanos');
    },
    formatDate(date) {
      if (!date) return '';
      const d = new Date(date);
      const month = '' + (d.getMonth() + 1);
      const day = '' + d.getDate();
      const year = d.getFullYear();

      return [year, month.padStart(2, '0'), day.padStart(2, '0')].join('-');
    }
  }
};
</script>

<style scoped>
/* Agrega tus estilos aquí */
.v-card {
  background-color: white;
}
</style>