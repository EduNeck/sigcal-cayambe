<template>
    <v-container class="container">
      <v-card class="pa-5" outlined>
        <!-- Título principal centrado con fondo gris -->
        <v-card-title class="headline text-center grey lighten-2">Búsqueda de Predios</v-card-title>
        
        <v-form ref="form" v-model="valid" lazy-validation>
          <!-- Campos del formulario -->
          <v-row>
            <v-col cols="12">
              <v-text-field
                v-model="form.clave_catastral"
                label="Clave Catastral"
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-text-field
                v-model="form.clave_catastral_anterior"
                label="Clave Catastral Anterior"
              ></v-text-field>
            </v-col>
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
                v-model="form.id_regimen_propiedad"
                :items="regimen"
                item-text="tipoNombre"
                item-value="tipoNombre"
                label="Regimen de Propiedad"
              ></v-select>
            </v-col>            
          </v-row>
          
          <!-- Botones de acción -->
          <v-row class="mt-4">
            <v-col cols="12" class="d-flex justify-center">
              <v-btn class="mx-2" color="primary" @click="buscar">Buscar</v-btn>
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
  import API_BASE_URL from '@/config/apiConfig';

  export default {
    name: 'BusquedaPrediosUrbanos',
    data() {
      return {
        valid: false,
        form: {
          clave_catastral: '',
          clave_catastral_anterior: '',            
          nombres: '',
          numero_documento: '',
          id_regimen_propiedad: ''
        },
        regimen: [],        
      };
    },
  
  async mounted() {
    try {
      console.log('Componente montado');
      this.regimen = await this.cargarCatalogo(2,0);
      
      // Agregar la opción "TODOS" al inicio del array
      this.regimen.unshift({
        id: 'todos',
        descripcion: 'TODOS',
        tipoNombre: 'TODOS',
        title: 'TODOS'
      });
    } catch (error) {
      console.error('Error al montar el componente:', error);
    }
  },    methods: {
      // Método para cargar los catálogos
      async cargarCatalogo(id_tipo_atributo, tipo) {
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
              tipoNombre: item.descripcion, 
              title: item.descripcion,
            }));
          } else {
            throw new Error('La respuesta de la API no es un array');
          }
        } catch (error) {
          console.error('Error fetching catalogo:', error);
          throw new Error('No se pudo obtener el catálogo');
        }
      },
  
    // Ajuste en la función buscar para manejar errores y mejorar la navegación
    buscar() {
      if (this.$refs.form.validate()) {
        try {
          // ✅ Conversión de número a texto
          const tipoTexto = this.$store.state.tipoPredio === 1 ? 'URBANO' : 'RURAL';

          // Si se selecciona "TODOS", no enviar valor para régimen de propiedad
          const regimenValue = this.form.id_regimen_propiedad === 'TODOS' ? '' : this.form.id_regimen_propiedad;

          this.$router.push({
            path: '/listado-predios-urb',
            query: {
              clave_catastral: this.form.clave_catastral,
              clave_catastral_anterior: this.form.clave_catastral_anterior,
              nombres: this.form.nombres,
              numero_documento: this.form.numero_documento,
              id_regimen_propiedad: regimenValue,
              tipo_predio: tipoTexto   
            }
          });
        } catch (error) {
          console.error('Error al navegar:', error);
        }
      } else {
        console.log('Formulario inválido');
      }
    },      limpiar() {
        this.form = {
          clave_catastral: '',
          clave_catastral_anterior: '',
          nombres: '',
          numero_documento: '',
          id_regimen_propiedad: ''          
        };
      },
  
      salir() {
        this.$router.push('/menu-predial');
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