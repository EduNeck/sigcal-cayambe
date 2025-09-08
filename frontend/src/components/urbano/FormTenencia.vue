<template>
  <v-container :class="['container', tipoClaseContainer]">
    <v-row justify="center">
      <v-col cols="12" class="text-center">
        <h2 class="titulo-pantalla">Tenencia Propiedad</h2>
      </v-col>
      <v-col cols="auto" class="d-flex justify-center">
        <v-btn :class="['btn_app', tipoClaseButton]" append-icon="mdi-plus" @click="nuevo" :disabled="!getIdPredio" v-if="canEdit">Nuevo</v-btn>
        <v-btn :class="['btn_app', tipoClaseButton]" append-icon="mdi-check" @click="guardar" :disabled="!getIdPredio || !!idTenencia" v-if="canEdit">Guardar</v-btn>
        <v-btn :class="['btn_app', tipoClaseButton]" append-icon="mdi-pencil" @click="actualizaTenencia" :disabled="!idTenencia" v-if="canEdit">Actualizar</v-btn>
        <v-btn :class="['btn_app', tipoClaseButton]" append-icon="mdi-delete" @click="eliminar" :disabled="!idTenencia" v-if="canEdit">Eliminar</v-btn>
        <v-btn :class="['btn_app', tipoClaseButton]" append-icon="mdi-file-document" @click="consultarRegistroPropiedad" :disabled="!getIdPredio">Reg. Propiedad</v-btn>
      </v-col>

    </v-row>              
    <!-- Primer y Segundo Bloque juntos en horizontal -->
    <v-row justify="center" class="mb-3">
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
                  :items="items" 
                  label="Presenta Escritura" 
                  v-model="form.presenta_escritura" 
                  item-text="name" 
                  item-value="value"                   
                ></v-select>
              </v-col>

              <v-col cols="12" sm="6" md="3">
                <v-select 
                  :items="items" 
                  label="Asent. de Hecho" 
                  v-model="form.asentamiento_de_hecho" 
                  item-text="descripcion"
                  item-value="id"
                  required>                  
                ></v-select>
              </v-col>

              <v-col cols="12" sm="6" md="3">
                <v-select 
                  :items="items" 
                  label="Conflicto" 
                  v-model="form.conflicto" 
                  item-text="name" 
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
    <v-card class="mb-3" :class="['block-color', tipoClaseBlock]">
      <v-card-title :class="['centered-title', tipoClaseTitle]">PROPIETARIO</v-card-title>
      <v-card-text>
        <v-row>
          <v-col cols="12" sm="6" md="8">
            <v-select 
              :items="ciudadanoTenencia" 
              label="Propietario" 
              v-model="form.id_propietario" 
              item-text="title" 
              item-value="id"
              required              
            ></v-select>
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
    <v-card class="mb-3" :class="['block-color', tipoClaseBlock]">
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
              @click="onProvinciaProto"
            ></v-select>
          </v-col>

          <v-col cols="12" sm="6" md="2">
            <v-select
              :items="cantones" 
              label="Cantón" 
              v-model="form.id_can_protocol" 
              item-text="title" 
              item-value="id" 
              required
              @click="onProvinciaProto"
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
              type="number" >
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
    <v-card class="mb-3" :class="['block-color', tipoClaseBlock]">
      <v-card-title :class="['centered-title', tipoClaseTitle]">DATOS DE INSCRIPCIÓN - REGISTRO</v-card-title>
      <v-card-text>
        <v-row>

          <v-col cols="12" sm="6" md="2">                  
            <v-select               
              label="Provincia"   
              :items="provincias"               
              v-model="form.id_provincia" 
              item-text="title" 
              item-value="id"   
              @change="onProvinciaRegistro"
              disabled
              hint="Provincia fija: Pichincha"
              persistent-hint             
            ></v-select>
          </v-col>

          <v-col cols="12" sm="6" md="2">
            <v-select               
              label="Cantón" 
              :items="cantonesReg"
              v-model="form.id_canton" 
              item-text="title" 
              item-value="id" 
              disabled
              hint="Cantón fijo: Cayambe"
              persistent-hint
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
    <v-card class="mb-3" :class="['block-color', tipoClaseBlock]">
      <v-card-title :class="['centered-title', tipoClaseTitle]">LINDEROS</v-card-title>
      <v-card-text>
        <v-row>
          <v-col cols="12" sm="6" md="6">
            <v-text-field label="Lindero Norte" 
            v-model="form.lindero_norte" type="text" >
          </v-text-field>
          </v-col>

          <v-col cols="12" sm="6" md="6">
            <v-text-field label="Lindero Sur" 
            v-model="form.lindero_sur" type="text" >
          </v-text-field>
          </v-col>  

          <v-col cols="12" sm="6" md="6">
            <v-text-field label="Lindero Este" 
            v-model="form.lindero_este" type="text" >
          </v-text-field>
          </v-col>  

          <v-col cols="12" sm="6" md="6">
            <v-text-field label="Lindero Oeste" 
            v-model="form.lindero_oeste" type="text" >
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
        permite_ingreso: null,
        presenta_escritura: null,
        asentamiento_de_hecho: null,
        conflicto: null,
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
        lindero_norte: '',
        lindero_sur: '',
        lindero_este: '',
        lindero_oeste: '', 
        propietario_anterior: '',        
        representante: 2,
      },
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

    // Establecer Pichincha como provincia por defecto para registro
    this.form.id_provincia = 17;
    this.form.id_canton = 1702; // Establecer cantón fijo
    // Cargar cantones de Pichincha automáticamente
    await this.cargaCantonesByProvinciaRegistro(17);

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

    // Cargar datos de la tenencia si existe idTenencia
    if (this.idTenencia) {
      console.log('Cargando datos de la tenencia:', this.idTenencia);
      await this.cargarDatosTenencia(this.idTenencia);
    }

    // 🏠 Listener para reactividad de tenencias
    this.onTenenciaUpdated(() => {
      console.log('🏠 Evento de tenencia actualizado detectado');
      // Aquí podrías actualizar datos si es necesario
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

    // Metodo para fitrar cantones por provincia de protocolizacion
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

    // Método para cargar los datos de la tenencia por idTenencia
    async cargarDatosTenencia(idTenencia) {
      try {
        const response = await axios.get(`${API_BASE_URL}/tenencia_by_id/${idTenencia}`);
        const tenencia = response.data;
        console.log('Datos de la tenencia cargados:', tenencia);
        // Asignar los datos de la tenencia al formulario
        this.form.permite_ingreso = tenencia.permite_ingreso ? 'SI' : 'NO';
        this.form.presenta_escritura = tenencia.presenta_escritura ? 'SI' : 'NO';
        this.form.asentamiento_de_hecho = tenencia.asentamiento_de_hecho ? 'SI' : 'NO';
        this.form.conflicto = tenencia.conflicto ? 'SI' : 'NO';
        this.form.porcentaje_participacion = tenencia.porcentaje_participacion;
        this.form.id_forma_propiedad = tenencia.id_forma_propiedad;
        this.form.id_propietario = tenencia.id_propietario; 
        this.form.id_prov_protocol = tenencia.id_prov_protocol;
        this.form.id_can_protocol = tenencia.id_can_protocol;
        this.form.fecha_inscripcion = tenencia.fecha_inscripcion ? tenencia.fecha_inscripcion.split('T')[0]: '';
        this.form.numero_notaria = tenencia.numero_notaria;
        this.form.area_registro = tenencia.area_registro;
        this.form.id_unidad = tenencia.id_unidad;
        this.form.id_provincia = tenencia.id_provincia;
        this.form.id_canton = tenencia.id_canton;
        this.form.fecha_escritura = tenencia.fecha_escritura ? tenencia.fecha_escritura.split('T')[0]: '';
        this.form.repertorio = tenencia.repertorio;
        this.form.folio = tenencia.folio;
        this.form.numero_registro = tenencia.numero_registro;
        this.form.lindero_norte = tenencia.lindero_norte;
        this.form.lindero_sur = tenencia.lindero_sur;
        this.form.lindero_este = tenencia.lindero_este;
        this.form.lindero_oeste = tenencia.lindero_oeste;
        this.form.propietario_anterior = tenencia.propietario_anterior;

        // Cargar datos del propietario
        await this.cargarDatosPropietario(tenencia.id_propietario);
      } catch (error) {
        console.error('Error al cargar los datos de la tenencia:', error);        
      }
    },    

    // Guardar formulario
    async guardar() {
      console.log('Guardar formulario');
      // Validar permite_ingreso
      this.form.permite_ingreso = this.form.permite_ingreso === 'SI';
      this.form.presenta_escritura = this.form.presenta_escritura === 'SI';
      this.form.conflicto = this.form.conflicto === 'SI';
      this.form.asentamiento_de_hecho = this.form.asentamiento_de_hecho === 'SI';

      const nuevaTenencia = {
        id_predio: this.idPredio, 
        permite_ingreso: this.form.permite_ingreso || null,
        presenta_escritura: this.form.presenta_escritura || null,
        asentamiento_de_hecho: this.form.asentamiento_de_hecho || null,
        conflicto: this.form.conflicto || null,
        porcentaje_participacion: this.form.porcentaje_participacion || null,
        id_forma_propiedad: this.form.id_forma_propiedad || null,
        id_propietario: this.form.id_propietario || null, 
        representante: this.form.representante || false,
        id_prov_protocol: this.form.id_prov_protocol || null,
        id_can_protocol: this.form.id_can_protocol || null,
        fecha_inscripcion: this.form.fecha_inscripcion || null,
        numero_notaria: this.form.numero_notaria || null,
        area_registro: this.form.area_registro || null,
        id_unidad: this.form.id_unidad || null,
        id_provincia: this.form.id_provincia || null,
        id_canton: this.form.id_canton || null,
        fecha_escritura: this.form.fecha_escritura || null,
        repertorio: this.form.repertorio || null,
        folio: this.form.folio || null,
        numero_registro: this.form.numero_registro || null,
        lindero_norte: this.form.lindero_norte || null,
        lindero_sur: this.form.lindero_sur || null,
        lindero_este: this.form.lindero_este || null,
        lindero_oeste: this.form.lindero_oeste || null,  
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
        this.emitTenenciaUpdated(); // 🏠 Emitir evento de tenencia actualizada
        this.incrementTenenciasCount(); // 🏠 Incrementar contador en store
      } catch (error) {     
        console.error('Error al guardar tenencia:', error);
        this.snackbarError = 'Error al guardar la tenencia';
        this.snackbarErrorPush = true;        
      }
    },

    // Método para actualizar la tenencia
    async actualizaTenencia() {
      console.log('Actualizar tenencia');

      // Validar campos tipo booleano
      this.form.permite_ingreso = this.form.permite_ingreso === 'SI';
      this.form.presenta_escritura = this.form.presenta_escritura === 'SI';
      this.form.conflicto = this.form.conflicto === 'SI';
      this.form.asentamiento_de_hecho = this.form.asentamiento_de_hecho === 'SI';

      // Corregido: usar `this.form` en lugar de `data`
      const fecha_escritura = this.form.fecha_escritura || null;
      const fecha_inscripcion = this.form.fecha_inscripcion || null;

      const tenenciaActualizada = {
        id_predio: this.idPredio, 
        permite_ingreso: this.form.permite_ingreso,
        presenta_escritura: this.form.presenta_escritura,
        asentamiento_de_hecho: this.form.asentamiento_de_hecho,
        conflicto: this.form.conflicto,
        porcentaje_participacion: this.form.porcentaje_participacion,
        id_forma_propiedad: this.form.id_forma_propiedad,
        id_propietario: this.form.id_propietario,
        representante: this.form.representante,
        id_prov_protocol: this.form.id_prov_protocol,
        id_can_protocol: this.form.id_can_protocol,
        fecha_inscripcion: fecha_inscripcion,
        numero_notaria: this.form.numero_notaria,
        area_registro: this.form.area_registro,
        id_unidad: this.form.id_unidad,
        id_provincia: this.form.id_provincia,
        id_canton: this.form.id_canton,
        fecha_escritura: fecha_escritura,
        repertorio: this.form.repertorio,
        folio: this.form.folio,
        numero_registro: this.form.numero_registro,
        lindero_norte: this.form.lindero_norte,
        lindero_sur: this.form.lindero_sur,
        lindero_este: this.form.lindero_este,
        lindero_oeste: this.form.lindero_oeste, 
        propietario_anterior: this.form.propietario_anterior
      };

      console.log('Datos a actualizar', tenenciaActualizada);

      try {
        const response = await axios.put(`${API_BASE_URL}/actualiza_tenencia/${this.idTenencia}`, tenenciaActualizada); 
        console.log('Respuesta de actualización:', response.data);
        this.snackbarOk = 'Tenencia actualizada con éxito';
        this.snackbarOkPush = true;
        this.emitTenenciaUpdated(); // 🏠 Emitir evento de tenencia actualizada
        this.incrementTenenciasCount(); // 🏠 Incrementar contador en store
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
        this.emitTenenciaUpdated(); // 🏠 Emitir evento de tenencia actualizada
        this.incrementTenenciasCount(); // 🏠 Incrementar contador en store
        this.nuevo(); // Limpiar el formulario después de eliminar
        this.updateIdTenencia(null); // Establecer idTenencia a null después de eliminar
      } catch (error) {
        console.error('Error al eliminar el tenencia:', error);
        this.snackbarError = 'Error al eliminar el tenencia';
        this.snackbarErrorPush = true;
      }
    },    

    // Método para limpiar el formulario
    limpiarFormulario() {
      this.form = {
        permite_ingreso: null,
        presenta_escritura: null,
        asentamiento_de_hecho: null,
        conflicto: null,
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
        lindero_norte: '',
        lindero_sur: '',
        lindero_este: '',
        lindero_oeste: '', 
        propietario_anterior: '',     
        representante: 2,
      };
      // Cargar cantones de Pichincha después de limpiar
      this.cargaCantonesByProvinciaRegistro(17);
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
      this.cargaCiudadanoTenecia(); 
    },

    // Método para consultar el Registro de la Propiedad
    consultarRegistroPropiedad() {
      console.log('Consultando Registro de la Propiedad');
      this.dialogConsultaRegistro = true;
    },

    cerrarModal() {
      this.dialogConsultaRegistro = false;
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
        numero_registro: this.form.numero_registro
      });
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
  font-size: 2rem;
  color: #ffffff;
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
}

.centered-title.urbano-title {
  background-color: #276E90;
  color: #F1ECE7;
  font-size: 1rem;
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

</style>
