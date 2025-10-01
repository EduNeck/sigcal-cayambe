<template>
  <v-container :class="['container', tipoClaseContainer]">
    <v-row justify="center" dense>
      <v-col cols="12" class="text-center py-1">
        <h2 class="titulo-pantalla">Tenencia Propiedad</h2>
      </v-col>
      <v-col cols="auto" class="d-flex justify-center py-1">
        <v-btn :class="['btn_app', tipoClaseButton]" append-icon="mdi-plus" @click="nuevo" :disabled="!getIdPredio" v-if="canEdit">Nuevo</v-btn>
        <v-btn :class="['btn_app', tipoClaseButton]" append-icon="mdi-check" @click="guardar" :disabled="!getIdPredio || !!idTenencia" v-if="canEdit">Guardar</v-btn>
        <v-btn :class="['btn_app', tipoClaseButton]" append-icon="mdi-pencil" @click="actualizaTenencia" :disabled="!idTenencia" v-if="canEdit">Actualizar</v-btn>
        <v-btn :class="['btn_app', tipoClaseButton]" append-icon="mdi-delete" @click="eliminar" :disabled="!idTenencia" v-if="canEdit">Eliminar</v-btn>
        <v-btn :class="['btn_app', tipoClaseButton]" append-icon="mdi-file-document" @click="consultarRegistroPropiedad" :disabled="!getIdPredio">Reg. Prop.</v-btn>
      </v-col>

    </v-row>              
    <!-- Primer y Segundo Bloque juntos en horizontal -->
    <v-row justify="center" class="mb-2" dense>
      <v-col cols="12" md="6">
         <v-card :class="['block-color', tipoClaseBlock]">
          <v-card-title :class="['centered-title', tipoClaseTitle]">INFORMACIÓN LEGAL</v-card-title>
          <v-card-text>
            <v-row>
              <v-col cols="12" sm="6" md="3">
                <v-select
                  v-model="form.permite_ingreso"
                  :items="items"
                  label="Permite Ingreso"
                  item-text="text"
                  item-value="value"
                ></v-select>               
              </v-col>

              <v-col cols="12" sm="6" md="3">
                <v-select
                  v-model="form.presenta_escritura"
                  :items="items"
                  label="Presenta Escritura"
                  item-text="text"
                  item-value="value"
                ></v-select> 
              </v-col>

              <v-col cols="12" sm="6" md="3">
                <v-select
                  v-model="form.asentamiento_de_hecho"
                  :items="items"
                  label="Asent. de Hecho"
                  item-text="text"
                  item-value="value"
                ></v-select> 
              </v-col>

              <v-col cols="12" sm="6" md="3">
                <v-select
                  v-model="form.conflicto"
                  :items="items"
                  label="Permite Ingreso"
                  item-text="text"
                  item-value="value"
                ></v-select> 
              </v-col>
              
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="6">
         <v-card :class="['block-color', tipoClaseBlock]">
          <v-card-title :class="['centered-title', tipoClaseTitle]">PARTICIPACIÓN</v-card-title>
          <v-card-text>
            <v-row>
              <v-col cols="12" sm="6" md="4">
                <v-text-field label="Porcentaje Participación" 
                  v-model="form.porcentaje_participacion" 
                  type="number"
                  :error-messages="errorPorcentaje"
                  @input="validarPorcentaje"
                  hint="El porcentaje total no debe superar el 100%"
                  persistent-hint
                  >
                </v-text-field>
              </v-col>
              <v-col cols="12" sm="6" md="4">
                <v-select 
                  :items="formaPropiedad" 
                  label="Forma de Propiedad o Posesión" 
                  v-model="form.id_forma_propiedad" 
                  item-text="descripcion"
                  item-value="id"
                  required>
                ></v-select>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Tercer Bloque -->
    <v-card class="mb-2" :class="['block-color', tipoClaseBlock]">
      <v-card-title :class="['centered-title', tipoClaseTitle]">PROPIETARIO</v-card-title>
      <v-card-text>
        <v-row>
          <v-col cols="12" sm="6" md="7">
            <v-autocomplete 
              :items="ciudadanoTenencia" 
              label="Propietario (buscar por nombre, apellido o documento)" 
              v-model="form.id_propietario" 
              item-text="title" 
              item-value="id"
              required
              clearable
              @update:search="buscarCiudadanos"
              :loading="buscandoPropietarios"
              return-object
              @update:model-value="seleccionarPropietario"
              hint="Puede buscar por nombre, apellido o número de documento sin importar el orden"
              persistent-hint
              auto-select-first
              :menu-props="{ auto: true }"
              :no-data-text="'Sin resultados. Intente otra búsqueda'"
            ></v-autocomplete>
          </v-col>
          <v-col cols="12" sm="6" md="1" class="d-flex align-center">
            <v-btn 
              :class="['btn_app', tipoClaseButton]" 
              icon 
              variant="text" 
              @click="abrirNuevoCiudadano"
              title="Nuevo ciudadano"
            >
              <v-icon>mdi-account-plus</v-icon>
            </v-btn>
          </v-col>
          <v-col cols="12" sm="6" md="4">
            <v-checkbox
              :model-value="form.representante === 1"
              @update:model-value="val => form.representante = val ? 1 : 2"
              label="¿Representante?"
              color="primary"
            ></v-checkbox>
          </v-col>          
        </v-row>
      </v-card-text>
    </v-card>

    <!-- Cuarto Bloque Protocolización-->
    <v-card class="mb-2" :class="['block-color', tipoClaseBlock]">
      <v-card-title :class="['centered-title', tipoClaseTitle]">PROTOCOLIZACIÓN - NOTARIA</v-card-title>
      <v-card-text>
        <v-row>
          <v-col cols="12" sm="6" md="2">                  
            <v-select
              v-model="form.id_prov_protocol"
              :items="provincias"
              item-text="title"
              item-value="id"
              label="Provincia"
              @change="onProvinciaProto"
            ></v-select>
          </v-col>

          <v-col cols="12" sm="6" md="2">
            <v-select
              :items="cantones" 
              label="Cantón" 
              v-model="form.id_can_protocol" 
              item-text="title" 
              item-value="id"
            ></v-select>
          </v-col>

          <v-col cols="12" sm="6" md="2">
            <v-text-field label="Fecha de Protocolización" 
              v-model="form.fecha_escritura"               
              type="date" >
            </v-text-field>
          </v-col>            

          <v-col cols="12" sm="6" md="2">                
            <v-text-field label="Número de Notaría" 
              v-model="form.numero_notaria" 
              type="text" >
            </v-text-field>
          </v-col>
          
          <v-col cols="12" sm="6" md="2">
            <v-text-field label="Área Registro" 
              v-model="form.area_registro" 
              type="number" >
            </v-text-field>
          </v-col>

          <v-col cols="12" sm="6" md="2">
            <v-select 
              :items="unidadAreas" 
              label="Unidad" 
              v-model="form.id_unidad" 
              item-text="descripcion"
              item-value="id"
              required>
            </v-select>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <!-- Quinto Bloque  Registro -->
    <v-card class="mb-2" :class="['block-color', tipoClaseBlock]">
      <v-card-title :class="['centered-title', tipoClaseTitle]">DATOS DE INSCRIPCIÓN - REGISTRO</v-card-title>
      <v-card-text>
        <v-row>

          <v-col cols="12" sm="6" md="2">                  
            <v-select
              v-model="form.id_provincia"
              :items="provincias"
              item-text="title"
              item-value="id"
              label="Provincia"
              @change="onProvinciaRegistro"
            ></v-select>
          </v-col>

          <v-col cols="12" sm="6" md="2">
            <v-select
              v-model="form.id_canton"
              :items="cantones"
              item-text="title"
              item-value="id"
              label="Cantón"              
            ></v-select>
          </v-col>

          <v-col cols="12" sm="6" md="2">
            <v-text-field label="Fecha de Registro" 
              v-model="form.fecha_inscripcion"               
              type="date" >
            </v-text-field>
          </v-col>            

          <v-col cols="12" sm="6" md="2">                
            <v-text-field label="Repertorio" 
              v-model="form.repertorio" 
              type="number" >
            </v-text-field>
          </v-col>
          
          <v-col cols="12" sm="6" md="2">
            <v-text-field label="Folio" 
              v-model="form.folio" 
              type="number" >
            </v-text-field>
          </v-col>                

          <v-col cols="12" sm="6" md="2">
            <v-text-field label="N° Registro" 
              v-model="form.numero_registro" 
              type="number" >
            </v-text-field>
          </v-col>

        </v-row>
      </v-card-text>
    </v-card>  

    <!-- Sexto Bloque  Linderos -->
    <v-card class="mb-2" :class="['block-color', tipoClaseBlock]">
      <v-card-title :class="['centered-title', tipoClaseTitle]">LINDEROS</v-card-title>
      <v-card-text>
        <v-row>
          <v-col cols="12">
            <v-text-field label="Linderos" 
            v-model="form.linderos_registro" type="text" >
          </v-text-field>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <!-- Alerta -->
    <v-snackbar v-model="snackbarErrorPush" :timeout="3000" color="error" rounded="pill">
      {{ snackbarError }}
    </v-snackbar>
    <v-snackbar v-model="snackbarOkPush" :timeout="3000" color="success">
      {{ snackbarOk }}
    </v-snackbar>

    <!-- Modal para Consulta Registro de la Propiedad -->
    <v-dialog v-model="dialogConsultaRegistro" max-width="1200px" persistent>
      <v-card>
        <v-card-title class="d-flex justify-space-between align-center">
          <span class="text-h5">Consulta Registro de la Propiedad</span>
          <v-btn icon @click="cerrarModal" variant="plain">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text class="pa-0">
          <ConsultaWsRegistro @sincronizar-datos="recibirDatosSincronizados" />
        </v-card-text>
      </v-card>
    </v-dialog>

    <!-- Modal para Ingreso de Nuevos Ciudadanos -->
    <v-dialog v-model="dialogCiudadano" max-width="1200px" persistent>
      <v-card>
        <v-card-title class="d-flex justify-space-between align-center">
          <span class="text-h5">Ingreso de Nuevo Ciudadano</span>
          <v-btn icon @click="cerrarDialogCiudadano" variant="plain">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text class="pa-0" style="height: 80vh;">
          <iframe 
            src="/ciudadano" 
            style="width: 100%; height: 100%; border: none;" 
            ref="ciudadanoFrame"
            @load="onIframeLoaded"
          ></iframe>
        </v-card-text>
        <v-card-actions>
          <v-btn color="primary" @click="actualizarCiudadanos">Actualizar lista de ciudadanos</v-btn>
          <v-spacer></v-spacer>
          <v-btn color="error" @click="cerrarDialogCiudadano">Cerrar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

  </v-container>
</template>

<script>
import axios from 'axios';
import { mapActions, mapGetters } from 'vuex';
import useUserRoles from '@/composables/useUserRoles';
import useTenenciaEvents from '@/composables/useTenenciaEvents';
import API_BASE_URL from '@/config/apiConfig';
import ConsultaWsRegistro from '@/components/ws/ConsultaWsRegistro.vue';

export default {
  name: 'TabTenencia',
  setup() {
    const { emitTenenciaUpdated, onTenenciaUpdated } = useTenenciaEvents();
    return {
      emitTenenciaUpdated,
      onTenenciaUpdated
    };
  },
  components: {
    ConsultaWsRegistro
  },
  data() {
    return {
      form: {
        permite_ingreso: false,
        presenta_escritura: false,
        asentamiento_de_hecho: false,
        conflicto: false,
        porcentaje_participacion: '',
        id_forma_propiedad: null,
        id_propietario: null,
        id_prov_protocol: null,
        id_can_protocol: null,
        fecha_inscripcion: '',
        numero_notaria: '',
        area_registro: '',
        id_unidad: null,
        id_provincia: 17, 
        id_canton: 1702, 
        fecha_escritura: '',
        repertorio: '',
        folio: '',
        numero_registro: '',
        linderos_registro: '',
        propietario_anterior: '',        
        representante: 2,
      },
      buscandoPropietarios: false,
      busquedaTimeout: null,
      // Listados
      items: ['SI', 'NO'],
      formaPropiedad: [],
      provincias: [],
      cantones: [],
      cantonesReg: [],
      
      ciudadanoTenencia: [],
      unidadAreas: [],
      idPredio: null, 
      idTenencia: null,
      snackbarErrorPush: false,
      snackbarError: '',
      snackbarOkPush: false,
      snackbarOk: '',
      dialogConsultaRegistro: false,
      dialogCiudadano: false, // Para controlar la visibilidad del diálogo de ciudadanos
      
      // Variables para validación del porcentaje
      porcentajeAcumulado: 0,
      porcentajeOriginal: 0,
      errorPorcentaje: '',
      porcentajeValido: true
    }
  },
  computed: { 
    ...mapGetters(['getIdPredio', 'getIdTenencia', 'getTipoPredio', 'isConsultaPrimario']),

    tipoClaseContainer() {
      return this.getTipoPredio === 1 ? 'urbano-container' : 'rural-container';
    },
    tipoClaseButton() {
      return this.getTipoPredio === 1 ? 'urbano-btn' : 'rural-btn';
    },
    tipoClaseBlock() {
      return this.getTipoPredio === 1 ? 'urbano-block' : 'rural-block';
    },
    tipoClaseTitle() {
      return this.getTipoPredio === 1 ? 'urbano-title' : 'rural-title';
    },

    canEdit() {
      const { canEdit } = useUserRoles();
      return canEdit.value; 
    }
  },
  async mounted() {

    console.log('Componente Catalogo montado');
    this.formaPropiedad = await this.cargaCatalogo(20,0);    
    this.unidadAreas = await this.cargaCatalogo(8,0); 
    await this.cargaProvincias();   
    await this.cargaCiudadanoTenecia();


    this.form.id_provincia = 17;
    this.form.id_canton = 1702; 
    this.form.id_prov_protocol = 17;
    this.form.id_can_protocol = 1702; 
    
    await this.cargaCantonesByProvinciaRegistro(17);
    await this.cargaCantonesByProvincia(17);

    console.log('Componente TabTenencia montado');
    
    // Validar idPredio
    if (!this.getIdPredio) {
      this.snackbarError = 'No se ha definido un predio para el ingreso de Tenencia'; 
      this.snackbarErrorPush = true;           
      return;
    }

    // Montar idPredio e idTenencia
    this.idPredio = this.getIdPredio;
    this.idTenencia = this.getIdTenencia;

    // Cargar porcentaje acumulado
    await this.obtenerPorcentajeAcumulado();

    // Cargar datos de la tenencia si existe idTenencia
    if (this.idTenencia) {
      console.log('Cargando datos de la tenencia:', this.idTenencia);
      await this.cargarDatosTenencia(this.idTenencia);
      // Guardamos el porcentaje original para la validación al actualizar
      this.porcentajeOriginal = parseFloat(this.form.porcentaje_participacion) || 0;
    }

    this.onTenenciaUpdated(() => {     
      // Actualizar el porcentaje acumulado cuando cambian las tenencias
      this.obtenerPorcentajeAcumulado();
    });
  },
  methods: {
    ...mapActions(['updateIdTenencia', 'incrementTenenciasCount']),    
    async cargarDatosPropietario(id_propietario) {
      try {
        const response = await axios.get(`${API_BASE_URL}/recupera_ciudadano_by_id/${id_propietario}`);
        const propietario = response.data;
        console.log('Datos del propietario cargados:', propietario);
        // Asignar los datos del propietario al formulario
        this.form.id_propietario = propietario.id_ciudadano;
        console.log('ID del propietario:', this.form.id_propietario);
      } catch (error) {
        console.error('Error al cargar los datos del propietario:', error);        
      }
    },

    // Método para filtrar cantones por provincia de protocolización
    async onProvinciaProto() {
      this.form.id_can_protocol = '';      
      if (this.form.id_prov_protocol) {        
        await this.cargaCantonesByProvincia(this.form.id_prov_protocol);
      } else {
        this.cantones = [];
      }
    },

    // Metodo para fitrar cantones por provincia de registro
    async onProvinciaRegistro() {
      this.form.id_canton = '';      
      if (this.form.id_provincia) {        
        await this.cargaCantonesByProvinciaRegistro(this.form.id_provincia);
      } else {
        this.cantonesReg = [];
      }
    },

    // Cargar Provincias
    async cargaProvincias() {
      try {
        const response = await axios.get(`${API_BASE_URL}/catalogo_provincia`);        
        if (Array.isArray(response.data)) {
          this.provincias = response.data.map(item => {
            if (item.dpa && item.descripcion) {
              return {
                ...item,
                tipoDpa: `${item.dpa}`,
                title: `${item.descripcion}`,
                id: item.id_prov,                
              };              
            } else {
              console.warn('Elemento con datos incompletos:', item);
              return null;
            }
          }).filter(item => item !== null);
        } else {
          throw new Error('La respuesta de la API no es un array');
        }
      } catch (error) {
        console.error('Error fetching provincias:', error);
        this.provincias = [];
      }      
    },

    // Cargar Cantones por Provincia 
    async cargaCantonesByProvincia(id_prov) {
      try {
        const response = await axios.get(`${API_BASE_URL}/catalogo_cantonByProvincia/${id_prov}`);        
        if (Array.isArray(response.data)) {
          this.cantones = response.data.map(item => {
            if (item.id_can && item.descripcion) {
              return {
                ...item,
                id: `${item.id_can}`,
                title: `${item.descripcion}`,                
              };
            } else {
              console.warn('Elemento con datos incompletos:', item);
              return null;
            }
          }).filter(item => item !== null);
        } else {
          throw new Error('La respuesta de la API no es un array');
        }
      } catch (error) {
        console.error('Error fetching cantones:', error);
        this.cantones = [];
      }
    },

    // Cargar Cantones por Provincia Registro 
    async cargaCantonesByProvinciaRegistro(id_prov) {
      try {
        const response = await axios.get(`${API_BASE_URL}/catalogo_cantonByProvincia/${id_prov}`);        
        if (Array.isArray(response.data)) {
          this.cantonesReg = response.data.map(item => {
            if (item.id_can && item.descripcion) {
              return {
                ...item,
                id: `${item.id_can}`,
                title: `${item.descripcion}`,                
              };
            } else {
              console.warn('Elemento con datos incompletos:', item);
              return null;
            }
          }).filter(item => item !== null);
        } else {
          throw new Error('La respuesta de la API no es un array');
        }
      } catch (error) {
        console.error('Error fetching cantones:', error);
        this.cantonesReg = [];
      }
    },

    // Cargar Catalogo
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


    // Cargar Ciudadano
    async cargaCiudadanoTenecia() {
      try {
        const response = await axios.get(`${API_BASE_URL}/ciudadano_tenencia`);
        console.log('Datos obtenidos para ciudadano:', response.data);
        if (Array.isArray(response.data)) {
          this.ciudadanoTenencia = response.data.map(item => {
            if (item.id_ciudadano && item.nombres) {
              return {
                ...item,                
                title: `${item.nombres} - ${item.numero_documento}`,
                id: item.id_ciudadano,                
              };              
            } else {
              console.warn('Elemento con datos incompletos:', item);
              return null;
            }
          }).filter(item => item !== null);
        } else {
          throw new Error('La respuesta de la API no es un array');
        }
      } catch (error) {
        console.error('Error fetching ciudadano:', error);
        this.ciudadanoTenencia = [];
      }      
    },
    
    // Buscar ciudadanos por API (optimizado)
    async buscarCiudadanos(texto) {
      if (this.busquedaTimeout) {
        clearTimeout(this.busquedaTimeout);
      }
      if (!texto || texto.length < 2) {
        this.ciudadanoTenencia = [];
        return;
      }
      this.busquedaTimeout = setTimeout(async () => {
        this.buscandoPropietarios = true;
        try {
          const response = await axios.get(`${API_BASE_URL}/ciudadano_tenencia/buscar`, {
            params: { q: texto }
          });
          if (Array.isArray(response.data)) {
            this.ciudadanoTenencia = response.data
              .filter(item => item && item.id_ciudadano && item.nombres)
              .map(item => ({
                ...item,
                title: `${item.nombres} - ${item.numero_documento}`,
                id: item.id_ciudadano,
              }));
          } else {
            this.ciudadanoTenencia = [];
          }
        } catch (error) {
          console.error('Error buscando ciudadanos:', error);
          this.snackbarError = 'Error buscando ciudadanos';
          this.snackbarErrorPush = true;
        } finally {
          this.buscandoPropietarios = false;
        }
      }, 400);
    },
    
    // Manejar la selección de un propietario
    seleccionarPropietario(propietario) {
      if (propietario) {
        // Si el propietario es un objeto (cuando se selecciona de la lista)
        if (typeof propietario === 'object') {
          console.log('Propietario seleccionado:', propietario);
          // Usar id_ciudadano o id, dependiendo de cuál esté disponible
          this.form.id_propietario = propietario.id_ciudadano || propietario.id;
        }
      } else {
        // Si se limpia la selección
        this.form.id_propietario = null;
        console.log('Selección de propietario borrada');
      }
    },

    // Método para cargar los datos de la tenencia por idTenencia
    async cargarDatosTenencia(idTenencia) {
      try {
        const response = await axios.get(`${API_BASE_URL}/tenencia_by_id/${idTenencia}`);
        const tenencia = response.data;
        console.log('Datos de la tenencia cargados:', tenencia);
        console.log('Valor de representante recibido:', {
          valor: tenencia.representante,
          tipo: typeof tenencia.representante
        });
        
        // Depurar los valores booleanos para entender qué tipo de datos se reciben
        console.log('Valores booleanos recibidos:', {
          permite_ingreso: {
            valor: tenencia.permite_ingreso,
            tipo: typeof tenencia.permite_ingreso,
            convertido: this.convertirAOpcionSiNo(tenencia.permite_ingreso)
          },
          presenta_escritura: {
            valor: tenencia.presenta_escritura,
            tipo: typeof tenencia.presenta_escritura,
            convertido: this.convertirAOpcionSiNo(tenencia.presenta_escritura)
          },
          asentamiento_de_hecho: {
            valor: tenencia.asentamiento_de_hecho,
            tipo: typeof tenencia.asentamiento_de_hecho,
            convertido: this.convertirAOpcionSiNo(tenencia.asentamiento_de_hecho)
          },
          conflicto: {
            valor: tenencia.conflicto,
            tipo: typeof tenencia.conflicto,
            convertido: this.convertirAOpcionSiNo(tenencia.conflicto)
          }
        });
        // Asignar los datos de la tenencia al formulario con validaciones de tipo
        this.form.permite_ingreso = this.convertirABoolean(tenencia.permite_ingreso);
        this.form.presenta_escritura = this.convertirABoolean(tenencia.presenta_escritura);
        this.form.asentamiento_de_hecho = this.convertirABoolean(tenencia.asentamiento_de_hecho);
        this.form.conflicto = this.convertirABoolean(tenencia.conflicto);
        
        // Validar campos numéricos
        this.form.porcentaje_participacion = this.validarNumero(tenencia.porcentaje_participacion);
        this.form.id_forma_propiedad = tenencia.id_forma_propiedad;
        this.form.id_prov_protocol = tenencia.id_prov_protocol;
        this.form.id_can_protocol = tenencia.id_can_protocol;
        
        // Validar fechas
        this.form.fecha_inscripcion = this.validarFecha(tenencia.fecha_inscripcion);
        
        // Validar campos numéricos
        this.form.numero_notaria = this.validarNumero(tenencia.numero_notaria);
        this.form.area_registro = this.validarNumero(tenencia.area_registro);
        
        this.form.id_unidad = tenencia.id_unidad;
        this.form.id_provincia = tenencia.id_provincia;
        this.form.id_canton = tenencia.id_canton;
        
        // Validar fechas
        this.form.fecha_escritura = this.validarFecha(tenencia.fecha_escritura);
        
        // Validar campos numéricos
        this.form.repertorio = this.validarNumero(tenencia.repertorio);
        this.form.folio = this.validarNumero(tenencia.folio);
        this.form.numero_registro = this.validarNumero(tenencia.numero_registro);        
        this.form.linderos_registro = tenencia.linderos_registro;
        this.form.propietario_anterior = tenencia.propietario_anterior;
        
        // Procesar y asignar el valor de representante
        const valorRepresentanteOriginal = tenencia.representante;
        const valorProcesado = this.procesarValorRepresentante(valorRepresentanteOriginal);
        console.log('Procesando valor de representante:', { 
          original: valorRepresentanteOriginal, 
          tipo: typeof valorRepresentanteOriginal,
          procesado: valorProcesado,
          checkbox_estara_marcado: valorProcesado === 1 
        });
        this.form.representante = valorProcesado;

        // Cargar datos del propietario y asignarlos al formulario
        try {
          const propResponse = await axios.get(`${API_BASE_URL}/recupera_ciudadano_by_id/${tenencia.id_propietario}`);
          const propietario = propResponse.data;
          
          // Aseguramos que el ciudadano esté en la lista de opciones del autocomplete
          const propietarioFormateado = {
            ...propietario,
            title: `${propietario.nombres} - ${propietario.numero_documento}`,
            id: propietario.id_ciudadano
          };
          
          // Si el propietario no está en la lista, lo agregamos
          const existeEnLista = this.ciudadanoTenencia.some(c => c.id === propietario.id_ciudadano);
          if (!existeEnLista) {
            this.ciudadanoTenencia = [...this.ciudadanoTenencia, propietarioFormateado];
          }
          
          // Asignamos el ID del propietario
          this.form.id_propietario = tenencia.id_propietario;
        } catch (error) {
          console.error('Error al cargar los datos del propietario:', error);
        }
      } catch (error) {
        console.error('Error al cargar los datos de la tenencia:', error);        
      }
    },    

    // Guardar formulario
    async guardar() {
      console.log('Guardar formulario');
      
      // Validar el porcentaje antes de guardar
      await this.obtenerPorcentajeAcumulado();
      this.validarPorcentaje();
      
      if (!this.porcentajeValido) {
        this.snackbarError = this.errorPorcentaje;
        this.snackbarErrorPush = true;
        return;
      }

      // Validar campos numéricos para asegurar que sean números o null, excepto notaría que es texto
      const numeroNotaria = this.form.numero_notaria === '' ? null : this.form.numero_notaria;
      const areaRegistro = this.form.area_registro === '' ? null : (this.form.area_registro ? Number(this.form.area_registro) : null);
      const repertorio = this.form.repertorio === '' ? null : (this.form.repertorio ? Number(this.form.repertorio) : null);
      const folio = this.form.folio === '' ? null : (this.form.folio ? Number(this.form.folio) : null);
      const numeroRegistro = this.form.numero_registro === '' ? null : (this.form.numero_registro ? Number(this.form.numero_registro) : null);
      const porcentajeParticipacion = this.form.porcentaje_participacion === '' ? null : (this.form.porcentaje_participacion ? Number(this.form.porcentaje_participacion) : null);
      
      const nuevaTenencia = {
        id_predio: this.idPredio, 
        permite_ingreso: this.form.permite_ingreso || null,
        presenta_escritura: this.form.presenta_escritura || null,
        asentamiento_de_hecho: this.form.asentamiento_de_hecho || null,
        conflicto: this.form.conflicto || null,
        porcentaje_participacion: porcentajeParticipacion,
        id_forma_propiedad: this.form.id_forma_propiedad || null,
        id_propietario: this.form.id_propietario || null, 
        representante: this.form.representante || 2,
        id_prov_protocol: this.form.id_prov_protocol || null,
        id_can_protocol: this.form.id_can_protocol || null,
        fecha_inscripcion: this.form.fecha_inscripcion || null,
        numero_notaria: numeroNotaria,
        area_registro: areaRegistro,
        id_unidad: this.form.id_unidad || null,
        id_provincia: this.form.id_provincia || null,
        id_canton: this.form.id_canton || null,
        fecha_escritura: this.form.fecha_escritura || null,
        repertorio: repertorio,
        folio: folio,
        numero_registro: numeroRegistro,
        linderos_registro: this.form.linderos_registro || null,
        propietario_anterior: this.form.propietario_anterior || null
      }
      console.log('Datos a guardar', nuevaTenencia);
      console.log( 'Envio:', JSON.stringify(nuevaTenencia, null, 2));

      try {
        const response = await axios.post(`${API_BASE_URL}/inserta_tenencia`, nuevaTenencia);
        console.log('Datos Guardados Tenencia');
        this.idTenencia = response.data;
        this.updateIdTenencia(this.idTenencia);
        console.log('ID TENENCIA: ', this.idTenencia);               
        this.snackbarOk = 'Tenencia creada con éxito';
        this.snackbarOkPush = true;
        this.emitTenenciaUpdated(); 
        this.incrementTenenciasCount(); 
        
        this.porcentajeOriginal = parseFloat(this.form.porcentaje_participacion) || 0;
      } catch (error) {     
        console.error('Error al guardar tenencia:', error);
        this.snackbarError = 'Error al guardar la tenencia';
        this.snackbarErrorPush = true;        
      }
    },

    // Método para actualizar la tenencia
    async actualizaTenencia() {
      console.log('Actualizar tenencia');
      
      // Validar el porcentaje antes de actualizar
      await this.obtenerPorcentajeAcumulado();
      this.validarPorcentaje();
      
      if (!this.porcentajeValido) {
        this.snackbarError = this.errorPorcentaje;
        this.snackbarErrorPush = true;
        return;
      }

      // Corregido: usar `this.form` en lugar de `data`
      const fecha_escritura = this.form.fecha_escritura || null;
      const fecha_inscripcion = this.form.fecha_inscripcion || null;

      // Validar campos numéricos para asegurar que sean números o null, excepto notaría que es texto
      const numeroNotaria = this.form.numero_notaria === '' ? null : this.form.numero_notaria;
      const areaRegistro = this.form.area_registro === '' ? null : Number(this.form.area_registro);
      const repertorio = this.form.repertorio === '' ? null : Number(this.form.repertorio);
      const folio = this.form.folio === '' ? null : Number(this.form.folio);
      const numeroRegistro = this.form.numero_registro === '' ? null : Number(this.form.numero_registro);
      const porcentajeParticipacion = this.form.porcentaje_participacion === '' ? null : Number(this.form.porcentaje_participacion);

      // Validar campos booleanos para asegurar que sean de tipo booleano
      console.log('Valores booleanos antes de conversión:', {
        permite_ingreso: this.form.permite_ingreso,
        presenta_escritura: this.form.presenta_escritura,
        asentamiento_de_hecho: this.form.asentamiento_de_hecho,
        conflicto: this.form.conflicto
      });
      
      // Usar el método convertirABoolean para todos los campos booleanos
      this.form.permite_ingreso = this.convertirABoolean(this.form.permite_ingreso);
      this.form.presenta_escritura = this.convertirABoolean(this.form.presenta_escritura);
      this.form.asentamiento_de_hecho = this.convertirABoolean(this.form.asentamiento_de_hecho);
      this.form.conflicto = this.convertirABoolean(this.form.conflicto);
      
      console.log('Valores booleanos después de conversión:', {
        permite_ingreso: this.form.permite_ingreso,
        presenta_escritura: this.form.presenta_escritura,
        asentamiento_de_hecho: this.form.asentamiento_de_hecho,
        conflicto: this.form.conflicto
      });

      const tenenciaActualizada = {
        id_predio: this.idPredio, 
        permite_ingreso: this.form.permite_ingreso,
        presenta_escritura: this.form.presenta_escritura,
        asentamiento_de_hecho: this.form.asentamiento_de_hecho,
        conflicto: this.form.conflicto,
        porcentaje_participacion: porcentajeParticipacion,
        id_forma_propiedad: this.form.id_forma_propiedad,
        id_propietario: this.form.id_propietario,
        representante: this.form.representante,
        id_prov_protocol: this.form.id_prov_protocol,
        id_can_protocol: this.form.id_can_protocol,
        fecha_inscripcion: fecha_inscripcion,
        numero_notaria: numeroNotaria,
        area_registro: areaRegistro,
        id_unidad: this.form.id_unidad,
        id_provincia: this.form.id_provincia,
        id_canton: this.form.id_canton,
        fecha_escritura: fecha_escritura,
        repertorio: repertorio,
        folio: folio,
        numero_registro: numeroRegistro,
        linderos_registro: this.form.linderos_registro,
        propietario_anterior: this.form.propietario_anterior
      };

      console.log('Datos a actualizar', tenenciaActualizada);

      try {
        const response = await axios.put(`${API_BASE_URL}/actualiza_tenencia/${this.idTenencia}`, tenenciaActualizada); 
        console.log('Respuesta de actualización:', response.data);
        this.snackbarOk = 'Tenencia actualizada con éxito';
        this.snackbarOkPush = true;
        this.emitTenenciaUpdated(); 
        this.incrementTenenciasCount(); 
        
        this.porcentajeOriginal = parseFloat(this.form.porcentaje_participacion) || 0;
      } catch (error) {
        console.error('Error al actualizar la tenencia:', error.message || error);
        this.snackbarError = 'Error al actualizar la tenencia';
        this.snackbarErrorPush = true;
      }
    },


    async eliminar() {
      console.log('Eliminando tenencia:', this.idTenencia);
      if (!this.idTenencia) {
        this.snackbarError = 'No hay una tenencia seleccionada para eliminar';
        this.snackbarErrorPush = true;
        return;
      }
      try {
        await axios.delete(`${API_BASE_URL}/elimina_tenencia_by_id/${this.idTenencia}`);
        this.snackbarOk = 'Tenencia eliminada exitosamente';
        this.snackbarOkPush = true;
        this.emitTenenciaUpdated(); 
        this.incrementTenenciasCount(); 
        this.nuevo(); 
        this.updateIdTenencia(null); 
      } catch (error) {
        console.error('Error al eliminar el tenencia:', error);
        this.snackbarError = 'Error al eliminar el tenencia';
        this.snackbarErrorPush = true;
      }
    },    

    // Método para limpiar el formulario
    limpiarFormulario() {
      this.form = {
        permite_ingreso: false,
        presenta_escritura: false,
        asentamiento_de_hecho: false,
        conflicto: false,
        porcentaje_participacion: '',
        id_forma_propiedad: null,
        id_propietario: null,
        id_prov_protocol: null,
        id_can_protocol: null,
        fecha_inscripcion: '',
        numero_notaria: '',
        area_registro: '',
        id_unidad: null,
        id_provincia: 17, // Siempre Pichincha
        id_canton: 1702, // Siempre cantón fijo (ID: 1702)
        fecha_escritura: '',
        repertorio: '',
        folio: '',
        numero_registro: '',
        linderos_registro: '',
        propietario_anterior: '',     
        representante: 2,
      };
      // Cargar cantones de Pichincha después de limpiar
      this.cargaCantonesByProvinciaRegistro(17);
      this.cargaCantonesByProvincia(17);
    },

    navigateToMenuUrbano() {
      this.$router.push('/menu-predial'); // Updated from '/menu-urbano'
    },
    navigateToCiudadano() {
      this.$router.push('/ingreso-ciudadano');
    },

    // Método para limpiar el formulario y preparar para una nueva entrada
    nuevo() {
      this.limpiarFormulario();
      this.idTenencia = null;
      // Actualizar la lista de ciudadanos
      this.cargaCiudadanoTenecia();
      // Asegurar que el propietario está limpio
      this.$nextTick(() => {
        this.form.id_propietario = null;
      });
    },

    // Método para consultar el Registro de la Propiedad
    consultarRegistroPropiedad() {
      console.log('Consultando Registro de la Propiedad');
      this.dialogConsultaRegistro = true;
    },

    cerrarModal() {
      this.dialogConsultaRegistro = false;
    },

    // Métodos para gestionar el diálogo de nuevo ciudadano
    abrirNuevoCiudadano() {
      this.dialogCiudadano = true;
    },

    cerrarDialogCiudadano() {
      this.dialogCiudadano = false;
    },

    onIframeLoaded() {
      console.log('Iframe cargado correctamente');
    },

    async actualizarCiudadanos() {
      try {
        // Recargar la lista de ciudadanos
        await this.cargaCiudadanoTenecia();
        this.snackbarOk = 'Lista de ciudadanos actualizada';
        this.snackbarOkPush = true;
      } catch (error) {
        console.error('Error al actualizar la lista de ciudadanos:', error);
        this.snackbarError = 'Error al actualizar la lista de ciudadanos';
        this.snackbarErrorPush = true;
      }
    },

    recibirDatosSincronizados(datos) {
      console.log('=== RECIBIR DATOS EN FORMULARIO TENENCIA ===');
      console.log('Datos recibidos completos:', datos);
      console.log('Fecha recibida:', datos.fecha_inscripcion);
      console.log('Tipo de fecha recibida:', typeof datos.fecha_inscripcion);
      
      // Sincronizar los datos del WS con el formulario de tenencia
      if (datos.fecha_inscripcion) {
        console.log('Valor ANTES de asignar:', this.form.fecha_inscripcion);
        this.form.fecha_inscripcion = datos.fecha_inscripcion;
        console.log('Valor DESPUÉS de asignar:', this.form.fecha_inscripcion);
      }
      
      if (datos.repertorio) {
        this.form.repertorio = datos.repertorio;
        console.log('Repertorio asignado:', datos.repertorio);
      }
      
      if (datos.folio) {
        this.form.folio = datos.folio;
        console.log('Folio asignado:', datos.folio);
      }
      
      if (datos.numero_registro) {
        this.form.numero_registro = datos.numero_registro;
        console.log('Número registro asignado:', datos.numero_registro);
      }
      
      if (datos.linderos_registro) {
        this.form.linderos_registro = datos.linderos_registro;
        console.log('Linderos asignados:', datos.linderos_registro);
      }
      
      if (datos.numero_notaria) {
        this.form.numero_notaria = datos.numero_notaria;
        console.log('Notaría asignada:', datos.numero_notaria);
      }

      // Forzar reactividad de Vue
      this.$forceUpdate();

      // Cerrar el modal después de la sincronización
      this.dialogConsultaRegistro = false;

      // Mostrar mensaje de éxito
      this.snackbarOk = 'Datos sincronizados exitosamente';
      this.snackbarOkPush = true;

      console.log('Estado final del formulario:', {
        fecha_inscripcion: this.form.fecha_inscripcion,
        repertorio: this.form.repertorio,
        folio: this.form.folio,
        numero_registro: this.form.numero_registro,
        numero_notaria: this.form.numero_notaria
      });
    },
    
    // Método para obtener el porcentaje acumulado de participaciones
    async obtenerPorcentajeAcumulado() {
      if (!this.idPredio) return;
      
      try {
        let url = `${API_BASE_URL}/porcentaje_acumulado_predio/${this.idPredio}`;
        
        // Si estamos actualizando, excluimos el porcentaje actual de la tenencia
        if (this.idTenencia) {
          url += `?id_tenencia_excluir=${this.idTenencia}`;
        }
        
        const response = await axios.get(url);
        this.porcentajeAcumulado = response.data.porcentaje_acumulado;
        console.log('Porcentaje acumulado:', this.porcentajeAcumulado);
        
        // Validar inmediatamente si hay un porcentaje establecido
        if (this.form.porcentaje_participacion) {
          this.validarPorcentaje();
        }
      } catch (error) {
        console.error('Error al obtener el porcentaje acumulado:', error);
        this.snackbarError = 'Error al verificar el porcentaje acumulado';
        this.snackbarErrorPush = true;
      }
    },
    
    // Método para validar el porcentaje de participación
    validarPorcentaje() {
      this.errorPorcentaje = '';
      this.porcentajeValido = true;
      
      // Convertir a número y verificar que sea válido
      const porcentaje = parseFloat(this.form.porcentaje_participacion) || 0;
      
      if (porcentaje <= 0) {
        this.errorPorcentaje = 'El porcentaje debe ser mayor que 0';
        this.porcentajeValido = false;
        return;
      }
      
      if (porcentaje > 100) {
        this.errorPorcentaje = 'El porcentaje no puede ser mayor a 100%';
        this.porcentajeValido = false;
        return;
      }
      
      // Verificar que no exceda el 100% en total
      const totalPorcentaje = this.porcentajeAcumulado + porcentaje;
      if (totalPorcentaje > 100) {
        this.errorPorcentaje = `El porcentaje total (${totalPorcentaje.toFixed(2)}%) excede el 100%. Máximo disponible: ${(100 - this.porcentajeAcumulado).toFixed(2)}%`;
        this.porcentajeValido = false;
      }
    },
    
    // Método para validar y convertir valores numéricos
    validarNumero(valor) {
      // Si el valor es null, undefined o string vacío, devolver null
      if (valor === null || valor === undefined || valor === '') {
        return null;
      }
      
      // Si es una cadena que contiene letras (como "TERCERA"), devolver null
      if (typeof valor === 'string' && isNaN(Number(valor))) {
        console.warn(`Valor numérico no válido: "${valor}". Se establecerá como null.`);
        return null;
      }
      
      // Si es un número o una cadena convertible a número, devolver el número
      return Number(valor);
    },
    
    // Método para validar y formatear fechas
    validarFecha(fecha) {
      // Si la fecha es null, undefined o string vacío, devolver string vacío
      if (fecha === null || fecha === undefined || fecha === '') {
        return '';
      }
      
      try {
        // Intentar convertir a fecha válida
        if (typeof fecha === 'string' && fecha.includes('T')) {
          // Si es una fecha con formato ISO, extraer solo la parte de la fecha
          return fecha.split('T')[0];
        }
        
        // Si es una cadena que no se puede convertir a fecha, verificar
        const fechaPrueba = new Date(fecha);
        if (isNaN(fechaPrueba.getTime())) {
          console.warn(`Fecha no válida: "${fecha}". Se establecerá como vacío.`);
          return '';
        }
        
        // Si todo está bien y es una fecha válida sin formato ISO, devolverla tal cual
        return fecha;
      } catch (error) {
        console.error('Error al validar fecha:', error);
        return '';
      }
    },
    
    // Método para convertir diferentes tipos de valores a booleanos
    convertirABoolean(valor) {
      // Comprobar el tipo y valor para manejar todos los posibles casos
      if (valor === true || valor === 1 || valor === '1' || 
          valor === 'true' || valor === 'TRUE' || 
          valor === 't' || valor === 'T' || 
          valor === 'si' || valor === 'SI' || 
          valor === 's' || valor === 'S' || 
          valor === 'yes' || valor === 'YES' || 
          valor === 'y' || valor === 'Y') {
        return true;
      } else {
        return false;
      }
    },
    
    // Mantener el método original para compatibilidad con otras partes del código
    convertirAOpcionSiNo(valor) {
      return this.convertirABoolean(valor) ? 'SI' : 'NO';
    },
    
    // Método auxiliar para procesar el valor del campo representante
    procesarValorRepresentante(valor) {
      // Si el valor es 1, true o alguna representación de verdadero, retornar 1
      if (valor === 1 || valor === '1' || valor === true ||
          valor === 'true' || valor === 'TRUE' ||
          valor === 't' || valor === 'T') {
        return 1;
      } else {
        return 2; // Valor por defecto (no representante)
      }
    }
  }
}
</script>

<style scoped>
.container {
  background-color: #114358;
}

.block-color {
  background-color: #F1ECE7;
  color: #114358;
}

.titulo-pantalla {
  font-size: 1.5rem;
  color: #ffffff;
  margin-top: 0;
  margin-bottom: 8px;
}

.btn_app {
  background-color: #276E90;
  color: #ffffff;
}

.centered-title {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  text-align: center;
  padding: 4px 0; /* Reducir el padding vertical */
}

.centered-title.urbano-title {
  background-color: #276E90;
  color: #F1ECE7;
  font-size: 0.9rem; /* Reducir tamaño de fuente */
  font-weight: bold;
}

.centered-title.rural-title {
  background-color: #4C7031;
  color: #F1ECE7;
  font-size: 1rem;
  font-weight: bold;
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

.urbano-block {
  background-color: #F1ECE7;
  color: #114358;
}

.rural-block {
  background-color: #F1ECE7;
  color: #4C7031;
}

/* Estilos para etiquetas más oscuras */
:deep(.v-label) {
  color: #333333 !important; 
  font-weight: 500 !important;
}

/* Etiquetas en selects */
:deep(.v-select .v-label) {
  color: #2c2c2c !important;
  font-weight: 500 !important;
}

/* Etiquetas cuando el campo está enfocado */
:deep(.v-field--focused .v-label) {
  color: #276E90 !important;
  font-weight: 600 !important;
}

/* Mejorar legibilidad de texto en los campos */
:deep(.v-field__input) {
  color: #121212 !important;
  font-weight: 500 !important;
}

/* Mejorar contraste de las etiquetas en diferentes estados */
:deep(.v-field--variant-filled .v-label) {
  opacity: 1 !important;
  text-shadow: 0px 0px 0px rgba(0,0,0,0.1);
}

/* Clase para aplicar a campos específicos si es necesario */
.dark-label :deep(.v-label) {
  color: #222222 !important;
  font-weight: 600 !important;
}

/* Estilos para reducir espacios en campos */
:deep(.v-input--density-default) {
  --v-input-padding-top: 8px;
}

:deep(.v-card-text) {
  padding: 8px 16px;
}

:deep(.v-input__details) {
  padding-inline: 8px;
  min-height: 16px;
}

/* Reducir espacio entre checkboxes */
:deep(.v-selection-control) {
  min-height: 30px;
}
</style>
