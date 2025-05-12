<template>
  <v-container class="container">
    <v-card class="pa-5" outlined>
      <!-- Título principal centrado con fondo gris -->
      <v-card-title class="headline text-center grey lighten-2">Búsqueda de Ciudadano</v-card-title>
      
      <v-form ref="form" v-model="valid" lazy-validation>
        <!-- Campos del formulario -->
        <v-row>
          <v-col cols="12">
            <v-text-field
              v-model="form.nombres"
              label="Nombres"
            ></v-text-field>
          </v-col>
          <v-col cols="12">
            <v-text-field
              v-model="form.numero_documento"
              label="Número de Documento"
            ></v-text-field>
          </v-col>
          <v-col cols="12">
            <v-select
              v-model="form.tipo_persona"
              :items="tipoPersonas"
              item-text="tipoNombre"
              item-value="tipoNombre"
              label="Tipo de Persona"
            ></v-select>
          </v-col>
          <v-col cols="12">
            <v-select
              v-model="form.tipo_docuemnto"
              :items="tipoDocumentos"
              item-text="tipoNombre"
              item-value="tipoNombre"
              label="Tipo de Documento"
            ></v-select>
          </v-col>
        </v-row>
        
        <!-- Botones de acción -->
        <v-row class="mt-4">
          <v-col cols="12" class="d-flex justify-center">
            <v-btn class="mx-2" color="primary" @click="buscar">Buscar</v-btn>
            <v-btn class="mx-2" color="info" @click="nuevoRegistro">Nuevo</v-btn>
            <v-btn class="mx-2" color="secondary" @click="limpiar">Limpiar</v-btn>
            <v-btn class="mx-2" color="error" @click="salir">Salir</v-btn>
          </v-col>
        </v-row>
      </v-form>
    </v-card>
  </v-container>
</template>

<script>
import axios from 'axios';

export default {
  name: 'BusquedaCiudadano',
  data() {
    return { 
      valid: false,
      form: {
        nombres: '',
        numero_documento: '',
        tipo_persona: '',
        tipo_docuemnto: ''
      },
      tipoPersonas: [],
      tipoDocumentos: []
    };
  },

  async mounted() {
    try {
      console.log('Componente montado');
      this.tipoPersonas = await this.cargaCatalogos(5,0); // Obtén los datos para el tipo de persona
      this.tipoDocumentos = await this.cargaCatalogos(7,0); // Obtén los datos para el tipo de documento
    } catch (error) {
      console.error('Error al montar el componente:', error);
    }
  },

  methods: {
    
    // Obtiene Catalogo
    async cargaCatalogos(id_tipo_atributo, tipo) {
      try {
        const response = await axios.get(`http://localhost:3001/api/catalogo/${id_tipo_atributo}/${tipo}`);
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

    buscar() {
      console.log('Valores enviados:', this.form); 
      if (this.$refs.form.validate()) {
        const query = {};

        // Agregar solo los parámetros que tienen valores
        if (this.form.nombres) query.nombres = this.form.nombres;
        if (this.form.numero_documento) query.numero_documento = this.form.numero_documento;
        if (this.form.tipo_persona) query.tipo_persona = this.form.tipo_persona;
        if (this.form.tipo_docuemnto) query.tipo_docuemnto = this.form.tipo_docuemnto;

        this.$router.push({
          path: '/listado-ciudadanos',
          query: query // Enviar solo los parámetros con valores
        });
      } else {
        console.log('Formulario inválido');
      }
    },

    limpiar() {
      this.form = {
        nombres: '',
        numero_documento: '',
        tipo_persona: '',
        tipo_docuemnto: ''
      };
    },

    salir() {
      this.$router.push('/menu-predial');
    },

    nuevoRegistro() {
      this.$router.push('/ciudadano');
    }
  }
};
</script>

<style scoped>
/* Agrega tus estilos aquí */
.v-card {
  background-color: white;
  max-width: 600px; /* Ajusta el ancho máximo de la tarjeta */
  margin: 0 auto; /* Centra la tarjeta horizontalmente */
}

.container {
  max-width: 600px; /* Ajusta el ancho máximo del contenedor */
  margin: 0 auto; /* Centra el contenedor horizontalmente */
}
</style>