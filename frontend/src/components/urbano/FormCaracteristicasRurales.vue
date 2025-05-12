<template>
  <v-container class="container">
    <v-col cols="auto" class="d-flex justify-center">
      <h2 class="titulo-pantalla">Características Rurales</h2>
    </v-col>
    <v-col cols="auto" class="d-flex justify-center">
      <v-btn class="btn_app mx-2 custom-text-color" append-icon="mdi-pencil" @click="actualiza" :disabled="isConsultaPrimario">Actualizar</v-btn>
    </v-col>

    <!-- Bloque Agrícola -->
    <v-card class="mb-3 block-color fill-width">
      <v-card-title class="centered-title">Agrícola</v-card-title>
      <v-card-text>
        <v-row>
          <v-col cols="12" sm="6" md="3">
            <v-checkbox v-model="formData.agricultura_tecnificada" label="Agricultura Tecnificada" />
          </v-col>
          <v-col cols="12" sm="6" md="3">
            <v-checkbox v-model="formData.agricultura_tradicional" label="Agricultura Tradicional" />
          </v-col>
          <v-col cols="12" sm="6" md="3">
            <v-checkbox v-model="formData.agricultura_subsistencia" label="Agricultura Subsistencia" />
          </v-col>
          <v-col cols="12" sm="6" md="3">
            <v-checkbox v-model="formData.agricultura_huerto_familiar" label="Huerto Familiar" />
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <!-- Bloque Pecuario -->
    <v-card class="mb-3 block-color fill-width">
      <v-card-title class="centered-title">Pecuario</v-card-title>
      <v-card-text>
        <v-row>
          <v-col cols="12" sm="6" md="3">
            <v-checkbox v-model="formData.pecuarios_bovino" label="Bovino" />
          </v-col>
          <v-col cols="12" sm="6" md="3">
            <v-checkbox v-model="formData.pecuarios_caprino" label="Caprino" />
          </v-col>
          <v-col cols="12" sm="6" md="3">
            <v-checkbox v-model="formData.pecuarios_porcino" label="Porcino" />
          </v-col>
          <v-col cols="12" sm="6" md="3">
            <v-checkbox v-model="formData.pecuarios_avicola" label="Avícola" />
          </v-col>
          <v-col cols="12" sm="6" md="3">
            <v-checkbox v-model="formData.pecuarios_otro" label="Otro" />
          </v-col>
          <v-col cols="12" sm="6" md="3">
            <v-checkbox v-model="formData.pecuarios_intensivo" label="Intensivo" />
          </v-col>
          <v-col cols="12" sm="6" md="3">
            <v-checkbox v-model="formData.pecuarios_extensivo" label="Extensivo" />
          </v-col>
          <v-col cols="12" sm="6" md="3">
            <v-checkbox v-model="formData.pecuarios_subsistencia" label="Subsistencia" />
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <!-- Bloque Forestal -->
    <v-card class="mb-3 block-color fill-width">
      <v-card-title class="centered-title">Forestal</v-card-title>
      <v-card-text>
        <v-row>
          <v-col cols="12" sm="6" md="4">
            <v-checkbox v-model="formData.forestal_madera" label="Madera" />
          </v-col>
          <v-col cols="12" sm="6" md="4">
            <v-checkbox v-model="formData.forestal_pulpa" label="Pulpa" />
          </v-col>
          <v-col cols="12" sm="6" md="4">
            <v-checkbox v-model="formData.forestal_lenya_carbon" label="Leña/Carbón" />
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <!-- Bloque Acuacultura -->
    <v-card class="mb-3 block-color fill-width">
      <v-card-title class="centered-title">Acuacultura</v-card-title>
      <v-card-text>
        <v-row>
          <v-col cols="12" sm="6" md="4">
            <v-checkbox v-model="formData.camaronera" label="Camaronera" />
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <!-- Bloque Conservación -->
    <v-card class="mb-3 block-color fill-width">
      <v-card-title class="centered-title">Conservación</v-card-title>
      <v-card-text>
        <v-row>
          <v-col cols="12" sm="6" md="4">
            <v-checkbox v-model="formData.conservacion_reserva_natural" label="Reserva Natural" />
          </v-col>
          <v-col cols="12" sm="6" md="4">
            <v-checkbox v-model="formData.conservacion_proteccion" label="Protección" />
          </v-col>
          <v-col cols="12" sm="6" md="4">
            <v-checkbox v-model="formData.conservacion_otros" label="Otros" />
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <!-- Bloque Otros Productos -->
    <v-card class="mb-3 block-color fill-width">
      <v-card-title class="centered-title">Otros Productos</v-card-title>
      <v-card-text>
        <v-row>
          <v-col cols="12" sm="6" md="3">
            <v-checkbox v-model="formData.comercio" label="Comercio" />
          </v-col>
          <v-col cols="12" sm="6" md="3">
            <v-checkbox v-model="formData.turismo" label="Turismo" />
          </v-col>
          <v-col cols="12" sm="6" md="3">
            <v-checkbox v-model="formData.industria" label="Industria" />
          </v-col>
          <v-col cols="12" sm="6" md="3">
            <v-checkbox v-model="formData.mineria" label="Minería" />
          </v-col>
          <v-col cols="12" sm="6" md="3">
            <v-checkbox v-model="formData.hidrocarburos" label="Hidrocarburos" />
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <!-- Bloque Sociales -->
    <v-card class="mb-3 block-color fill-width">
      <v-card-title class="centered-title">Sociales</v-card-title>
      <v-card-text>
        <v-row>
          <v-col cols="12" sm="6" md="3">
            <v-checkbox v-model="formData.social_educacion" label="Educación" />
          </v-col>
          <v-col cols="12" sm="6" md="3">
            <v-checkbox v-model="formData.social_salud" label="Salud" />
          </v-col>
          <v-col cols="12" sm="6" md="3">
            <v-checkbox v-model="formData.social_culto" label="Culto" />
          </v-col>
          <v-col cols="12" sm="6" md="3">
            <v-checkbox v-model="formData.social_cementerio" label="Cementerio" />
          </v-col>
          <v-col cols="12" sm="6" md="3">
            <v-checkbox v-model="formData.social_recreacion" label="Recreación" />
          </v-col>
          <v-col cols="12" sm="6" md="3">
            <v-checkbox v-model="formData.social_espacio_publico" label="Espacio Público" />
          </v-col>
          <v-col cols="12" sm="6" md="3">
            <v-checkbox v-model="formData.social_casa_comunal" label="Casa Comunal" />
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <!-- Otros Usos -->
    <v-card class="mb-3 block-color fill-width">
      <v-card-title class="centered-title">Otros Usos</v-card-title>
      <v-card-text>
        <v-row>
          <v-col cols="12" sm="6" md="6">
            <v-checkbox v-model="formData.infraestructura_especial" label="Infraestructura Especial" />
          </v-col>
          <v-col cols="12" sm="6" md="6">
            <v-text-field v-model="formData.infraestructura_otros" label="Infraestructura Otros" />
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <!-- Bloque Ecosistema Relevante / Cobertura Predominante -->
    <v-card class="mb-3 block-color fill-width">
      <v-card-title class="centered-title">Ecosistema Relevante / Cobertura Predominante</v-card-title>
      <v-card-text>
        <v-row>
          <v-col cols="12" sm="6" md="6">
            <v-select 
                v-model="formData.id_ecosistema_relevante" 
                :items="ecosistemas" 
                item-text="descripcion" 
                item-value="id" 
                label="Ecosistema Relevante" />
          </v-col>
          <v-col cols="12" sm="6" md="6">
            <v-select 
                v-model="formData.id_cobertura_principal" 
                :items="coberturas" 
                item-text="descripcion" 
                item-value="id" 
                label="Cobertura Principal" />
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <!-- Sin Uso -->
    <v-card class="mb-3 block-color fill-width">
      <v-card-title class="centered-title">Sin Uso</v-card-title>
      <v-card-text>
        <v-row>
          <v-col cols="12" sm="6" md="6">
            <v-checkbox v-model="formData.rural_sin_aprovechamiento" label="Sin Aprovechamiento" />
          </v-col>
          <v-col cols="12" sm="6" md="6">
            <v-checkbox v-model="formData.rural_no_utilizable" label="No Utilizable" />
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
    <v-snackbar v-model="snackbar.show" :color="snackbar.color" :timeout="3000" top>
      {{ snackbar.message }}
    </v-snackbar>
  </v-container>
</template>

<script>

import axios from 'axios';
import { mapGetters } from 'vuex';
import API_BASE_URL from '@/config/apiConfig';

export default {
    name: 'FormCaracteristicasRurales',    
  data() {
    return {
      formData: {
        agricultura_tecnificada: false,
        agricultura_tradicional: false,
        agricultura_subsistencia: false,
        agricultura_huerto_familiar: false,
        pecuarios_bovino: false,
        pecuarios_caprino: false,
        pecuarios_porcino: false,
        pecuarios_avicola: false,
        pecuarios_otro: false,
        pecuarios_intensivo: false,
        pecuarios_extensivo: false,
        pecuarios_subsistencia: false,
        forestal_madera: false,
        forestal_pulpa: false,
        forestal_lenya_carbon: false,
        camaronera: false,
        conservacion_reserva_natural: false,
        conservacion_proteccion: false,
        conservacion_otros: false,
        comercio: false,
        turismo: false,
        industria: false,
        mineria: false,
        hidrocarburos: false,
        social_educacion: false,
        social_salud: false,
        social_culto: false,
        social_cementerio: false,
        social_recreacion: false,
        social_espacio_publico: false,
        social_casa_comunal: false,
        infraestructura_especial: false,
        infraestructura_otros: '',
        id_ecosistema_relevante: null,
        id_cobertura_principal: null,
        rural_sin_aprovechamiento: false,
        rural_no_utilizable: false,
      },
      idPredio: null,
      ecosistemas: [],
      coberturas: [],
      snackbar: {
        show: false,
        color: '',
        message: ''
      }
    };
  },

  computed: {
      ...mapGetters(['getIdPredio','isConsultaPrimario']),
    },

  methods: {

    // Obtiene Catalogo
    async cargaCatalogo(id_tipo_atributo, tipo) {
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

      // Recuperar datos del predio
    async cargaCaracteristicas() {
        try {
            console.log('Recuperando características del predio...', this.getIdPredio);
            const response = await axios.get(`${API_BASE_URL}/catastro_predio_by_id/${this.getIdPredio}`);
            const data = response.data;

            this.formData.agricultura_tecnificada = data.agricultura_tecnificada;
            this.formData.agricultura_tradicional = data.agricultura_tradicional;
            this.formData.agricultura_subsistencia = data.agricultura_subsistencia;
            this.formData.agricultura_huerto_familiar = data.agricultura_huerto_familiar;
            this.formData.pecuarios_bovino = data.pecuarios_bovino;
            this.formData.pecuarios_caprino = data.pecuarios_caprino;
            this.formData.pecuarios_porcino = data.pecuarios_porcino;
            this.formData.pecuarios_avicola = data.pecuarios_avicola;
            this.formData.pecuarios_otro = data.pecuarios_otro;
            this.formData.pecuarios_intensivo = data.pecuarios_intensivo;
            this.formData.pecuarios_extensivo = data.pecuarios_extensivo;
            this.formData.pecuarios_subsistencia = data.pecuarios_subsistencia;
            this.formData.forestal_madera = data.forestal_madera;
            this.formData.forestal_pulpa = data.forestal_pulpa;
            this.formData.forestal_lenya_carbon = data.forestal_lenya_carbon;
            this.formData.camaronera = data.camaronera;
            this.formData.conservacion_reserva_natural = data.conservacion_reserva_natural;
            this.formData.conservacion_proteccion = data.conservacion_proteccion;
            this.formData.conservacion_otros = data.conservacion_otros;
            this.formData.comercio = data.comercio;
            this.formData.turismo = data.turismo;
            this.formData.industria = data.industria;
            this.formData.mineria = data.mineria;
            this.formData.hidrocarburos = data.hidrocarburos;
            this.formData.social_educacion = data.social_educacion;
            this.formData.social_salud = data.social_salud;
            this.formData.social_culto = data.social_culto;
            this.formData.social_cementerio = data.social_cementerio;
            this.formData.social_recreacion = data.social_recreacion;
            this.formData.social_espacio_publico = data.social_espacio_publico;
            this.formData.social_casa_comunal = data.social_casa_comunal;
            this.formData.infraestructura_especial = data.infraestructura_especial;
            this.formData.infraestructura_otros = data.infraestructura_otros;
            this.formData.id_ecosistema_relevante = data.id_ecosistema_relevante;
            this.formData.id_cobertura_principal = data.id_cobertura_principal;
            this.formData.rural_sin_aprovechamiento = data.rural_sin_aprovechamiento;
            this.formData.rural_no_utilizable = data.rural_no_utilizable;

            console.log('Datos del predio recuperados:', data);
        } catch (error) {
            console.error('Error al recuperar los datos del predio:', error);
        }
    },    

    // Actualiza Características del Predio
    async actualiza() {
      console.log('Actualizando características del predio...');
    
      const actualizaCaracteristicas = {
        agricultura_tecnificada: this.formData.agricultura_tecnificada,
        agricultura_tradicional: this.formData.agricultura_tradicional,
        agricultura_subsistencia: this.formData.agricultura_subsistencia,
        agricultura_huerto_familiar: this.formData.agricultura_huerto_familiar,
        pecuarios_bovino: this.formData.pecuarios_bovino,
        pecuarios_caprino: this.formData.pecuarios_caprino,
        pecuarios_porcino: this.formData.pecuarios_porcino,
        pecuarios_avicola: this.formData.pecuarios_avicola,
        pecuarios_otro: this.formData.pecuarios_otro,
        pecuarios_intensivo: this.formData.pecuarios_intensivo,
        pecuarios_extensivo: this.formData.pecuarios_extensivo,
        pecuarios_subsistencia: this.formData.pecuarios_subsistencia,
        forestal_madera: this.formData.forestal_madera,
        forestal_pulpa: this.formData.forestal_pulpa,
        forestal_lenya_carbon: this.formData.forestal_lenya_carbon,
        camaronera: this.formData.camaronera,
        conservacion_reserva_natural: this.formData.conservacion_reserva_natural,
        conservacion_proteccion: this.formData.conservacion_proteccion,
        conservacion_otros: this.formData.conservacion_otros,
        comercio: this.formData.comercio,
        turismo: this.formData.turismo,
        industria: this.formData.industria,
        mineria: this.formData.mineria,
        hidrocarburos: this.formData.hidrocarburos,
        social_educacion: this.formData.social_educacion,
        social_salud: this.formData.social_salud,
        social_culto: this.formData.social_culto,
        social_cementerio: this.formData.social_cementerio,
        social_recreacion: this.formData.social_recreacion,
        social_espacio_publico: this.formData.social_espacio_publico,
        social_casa_comunal: this.formData.social_casa_comunal,
        infraestructura_especial: this.formData.infraestructura_especial,
        infraestructura_otros: this.formData.infraestructura_otros,
        id_ecosistema_relevante: this.formData.id_ecosistema_relevante,
        id_cobertura_principal: this.formData.id_cobertura_principal,
        rural_sin_aprovechamiento: this.formData.rural_sin_aprovechamiento,
        rural_no_utilizable: this.formData.rural_no_utilizable,
      };
    
      console.log('Datos a actualizar en formato JSON:', JSON.stringify(actualizaCaracteristicas, null, 2));
    
      try {
        const response = await axios.put(`${API_BASE_URL}/actualiza_caracteristicas_rurales/${this.getIdPredio}`, actualizaCaracteristicas);
        console.log('Características actualizadas:', response.data);
        this.snackbar = {
          show: true,
          color: 'success',
          message: 'Actualización realizada con éxito.'
        };
      } catch (error) {
        console.error('Error al actualizar las características del predio:', error);
        this.snackbar = {
          show: true,
          color: 'error',
          message: 'Error al realizar la actualización.'
        };
      }
    },    
  },

  async mounted() {
      // Cargar catálogos
      try {
        console.log('Componente montado');
        this.ecosistemas = await this.cargaCatalogo(13,0);
        this.coberturas = await this.cargaCatalogo(12,0); 
        console.log('Datos del catálogo cargados:', 
        this.ecosistemas,
        this.coberturas);
        console.log('Datos de parroquias cargados:', 
        this.parroquias);
      } catch (error) {
        console.error('Error al montar el componente:', error);
      }
      
      try {
        console.log('Componente montado');
        console.log('ID DEL PREDIO:', this.getIdPredio);
        if (this.getIdPredio) {
            await this.cargaCaracteristicas();
        }
        } catch (error) {
        console.error('Error al montar el componente:', error);
        }

    }, 


};
</script>

<style scoped>
.container {
  background-color: #324b21;
  padding: 16px;
}

.block-color {
  background-color: #F1ECE7;
  color: #324b21;
}

.centered-title {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  text-align: center;
  background-color: #668A4C;
  color: #F1ECE7;
  font-size: 1.2rem;
}

.btn_app {
  background-color: #668A4C;
  color: #ffffff;
}

.titulo-pantalla {
  font-size: 2rem;
  color: #ffffff;
}
</style>