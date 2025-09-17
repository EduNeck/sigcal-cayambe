<template>
    <v-container class="container">
      <v-card class="pa-6 rounded-lg" elevation="3">
        <!-- Título principal con diseño moderno -->
        <v-card-title class="d-flex align-center mb-6">
          <v-icon large color="primary" class="mr-3">mdi-magnify</v-icon>
          <span class="text-h4 font-weight-medium">Búsqueda de Predios</span>
        </v-card-title>
        
        <v-form ref="form" v-model="valid" lazy-validation>
          <!-- Campos del formulario con diseño mejorado -->
          <v-row>
            <v-col cols="12" sm="6">
              <v-text-field
                v-model="form.clave_catastral"
                label="Clave Catastral"
                prepend-inner-icon="mdi-key-variant"
                outlined
                dense
                clearable
                hide-details="auto"
                class="mb-3"
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field
                v-model="form.clave_catastral_anterior"
                label="Clave Catastral Anterior"
                prepend-inner-icon="mdi-key"
                outlined
                dense
                clearable
                hide-details="auto"
                class="mb-3"
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field
                v-model="form.nombres"
                label="Nombres"
                prepend-inner-icon="mdi-account"
                outlined
                dense
                clearable
                hide-details="auto"
                class="mb-3"
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field
                v-model="form.numero_documento"
                label="Número de Documento"
                prepend-inner-icon="mdi-card-account-details"
                outlined
                dense
                clearable
                hide-details="auto"
                class="mb-3"
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-select
                v-model="form.id_regimen_propiedad"
                :items="regimen"
                item-text="tipoNombre"
                item-value="tipoNombre"
                label="Régimen de Propiedad"
                prepend-inner-icon="mdi-home-city"
                outlined
                dense
                clearable
                hide-details="auto"
              ></v-select>
            </v-col>            
          </v-row>
          
          <!-- Botones de acción con diseño mejorado -->
          <v-card-actions class="pt-6 pb-2">
            <v-spacer></v-spacer>
            <v-btn 
              color="primary" 
              @click="buscar" 
              elevation="2"
              x-large
              class="px-6"
              :disabled="!valid"
            >
              <v-icon left>mdi-magnify</v-icon>
              Buscar
            </v-btn>
            <v-btn 
              color="secondary" 
              @click="limpiar" 
              elevation="2"
              outlined
              class="mx-3"
            >
              <v-icon left>mdi-refresh</v-icon>
              Limpiar
            </v-btn>
            <v-btn 
              color="error" 
              @click="salir" 
              elevation="2"
              text
            >
              <v-icon left>mdi-exit-to-app</v-icon>
              Salir
            </v-btn>
            <v-spacer></v-spacer>
          </v-card-actions>
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
  /* Estilos modernizados */
  .v-card {
    background-color: white;
    max-width: 800px; /* Aumentado para mejor responsividad */
    margin: 0 auto; /* Centra la tarjeta horizontalmente */
    border-radius: 12px;
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1) !important;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
  }

  .v-card:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.12) !important;
  }

  .container {
    max-width: 800px; /* Ajusta el ancho máximo del contenedor */
    margin: 0 auto; /* Centra el contenedor horizontalmente */
  }

  /* Estilo para los inputs */
  .v-text-field >>> .v-input__slot:hover,
  .v-select >>> .v-input__slot:hover {
    border-color: var(--v-primary-base) !important;
  }

  /* Animación para los botones */
  .v-btn {
    transition: all 0.3s ease;
  }

  .v-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15) !important;
  }

  /* Estilos responsivos para dispositivos móviles */
  @media (max-width: 600px) {
    .v-card-title {
      font-size: 1.5rem !important;
    }
    
    .v-card {
      padding: 16px !important;
    }
  }
  </style>