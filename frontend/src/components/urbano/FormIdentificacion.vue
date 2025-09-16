<template>
  <v-container :class="['container', tipoClaseContainer]">
    <v-row justify="center">
      <v-col cols="12" class="text-center">
        <h2 class="titulo-pantalla">FICHA CATASTRAL - IDENTIFICACIÓN</h2>
      </v-col>
      <!-- Botones -->
      <v-col cols="12" class="d-flex justify-center flex-wrap">
        <v-btn :class="['btn_app', tipoClaseButton]" append-icon="mdi-refresh" @click="refrescarIdentificacion" :disabled="!Boolean(getIdPredio)" v-if="canEdit"></v-btn>
        <v-btn :class="['btn_app', tipoClaseButton]" append-icon="mdi-plus" @click="nuevoRegistro" v-if="canEdit">Nuevo</v-btn>
        <v-btn :class="['btn_app', tipoClaseButton]" append-icon="mdi-check" @click="guardar" :disabled="Boolean(Boolean(getIdPredio))" v-if="canEdit">Guardar</v-btn>
        <v-btn :class="['btn_app', tipoClaseButton]" append-icon="mdi-pencil" @click="actualizar" :disabled="!Boolean(getIdPredio)" v-if="canEdit">Actualizar</v-btn>       
        <v-btn :class="['btn_app', tipoClaseButton]" append-icon="mdi-file" @click="valorar" :disabled="!Boolean(getIdPredio)" v-if="canEdit">Valorar</v-btn>
        <v-btn :class="['btn_app', tipoClaseButton]" append-icon="mdi-printer" @click="imprimirFicha" :disabled="!Boolean(getIdPredio)" v-if="canEdit">Imprimir Ficha</v-btn>
        <!-- Botón de eliminar oculto -->
        <v-btn :class="['btn_app', tipoClaseButton]" append-icon="mdi-close" @click="navegaMenuPrincipal">Salir</v-btn>        
      </v-col>
    </v-row>

    <!-- Primer Bloque -->
    <v-btn variant="text" color="white" :append-icon="isWindowVisible ? 'mdi-close' : 'mdi-plus'" size="small" @click="alternaVentanas">{{ isWindowVisible ? 'Cerrar' : 'Abrir' }}</v-btn>
    <v-window class="custom-window" v-show="isWindowVisible">
      <v-card-title class="window-title">INFORMACIÓN</v-card-title>
      <div class="ma-4 d-flex" >
        <!-- Foto Predio - 📸 Usar computed reactivo -->
        <v-img v-if="fotoRecuperadaUrlReactiva" :src="fotoRecuperadaUrlReactiva" class="custom-img">
          <div class="img-title">Foto Predio</div>
        </v-img>
        <v-img
          v-else :src="sinPredio" class="custom-img">
          <div class="img-title">Sin Foto</div>
        </v-img>       
        <!-- Croquis Predio -->
        <v-img v-if="croquisUrl" :src="croquisUrl" class="custom-img">
          <div class="img-title">Croquis Predio</div>
        </v-img>
        <v-img
          v-else :src="sinCroquis" class="custom-img">
          <div class="img-title">Sin Croquis</div>
        </v-img>
      </div>
    </v-window>
    <!-- Segundo Bloque -->
   <v-card :class="[tipoClaseBlock]" class="fill-width">
      <v-card-title class="centered-title">IDENTIFICACIÓN</v-card-title>
      <v-card-text>
        <v-row>
          <v-col cols="12" sm="6" md="2">
            <v-select 
              label="Tipo Predio"   
              v-model="form.id_tipo_predio"             
              :items="tipoPredios"
              item-title="descripcion"
              item-value="id"
              required>
            </v-select>
          </v-col>

          <v-col cols="12" sm="6" md="3">                
            <v-select 
              label="Regimen de Propiedad" 
              v-model="form.id_regimen_propiedad"  
              :items="regimens"
              item-title="descripcion" 
              item-value="id" 
              required >
            </v-select>
          </v-col>

          <v-col cols="12" sm="6" md="3">
            <v-text-field label="Clave Catastral Anterior"
              v-model="form.clave_catastral_anterior">
            </v-text-field>
          </v-col>

          <v-col cols="12" sm="6" md="3">
            <v-text-field label="Clave Catastral"
                class = "bold-text large-text" v-model="form.clave_catastral" readonly>
                <v-btn icon @click="copiaClaveCatastral(form.clave_catastral)" class="mr-2">
                  <v-icon class="v-icon--small">mdi-content-copy</v-icon>
                </v-btn>
            </v-text-field>
          </v-col>

          <v-col cols="12" sm="6" md="3">
            <v-text-field label="Nombre del Predio"
                v-model="form.nombre_predio">
            </v-text-field>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>   
    <!-- Segundo Bloque Clave Catastral-->
   <v-card :class="[tipoClaseBlock]" class="fill-width">
      <v-card-title class="centered-title">CLAVE CATASTRAL</v-card-title>
      <v-card-text>
        <v-row>
          <v-col cols="12" sm="6" md="2" class="bold-text large-text">         
              Provincia Pichincha: {{ form.id_prov }}            
          </v-col>
          <v-col cols="12" sm="6" md="2" class="bold-text large-text">           
              Cantón Cayambe: {{ form.id_can }}            
          </v-col>

          <v-col cols="12" sm="6" md="3">
            <v-select
              label="Parroquia" 
              v-model="form.id_par" 
              :items="formateaParroquias"
              item-title="descripcion" 
              item-value="dpa" 
              required 
              @input="actualizaClaveCatastral">
            </v-select>
          </v-col>

          <v-col cols="12" sm="6" md="1">
            <v-text-field
              label="Zona"              
              v-model="form.cod_zon"
              type="number"
              :rules="[v => !!v && v >= 1 && v <= 9 || 'Debe ser un número entre 1 y 9']"
              maxlength="1" @input="actualizaClaveCatastral"
              @keypress="limitDigits($event, 1)"
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="6" md="1">
            <v-text-field
              label="Sector"              
              v-model="form.cod_sec"
              type="number"
              :rules="[v => !!v && v >= 1 && v <= 9 || 'Debe ser un número entre 1 y 9']"
              maxlength="1" @input="actualizaClaveCatastral"
              @keypress="limitDigits($event, 1)">
            </v-text-field>
          </v-col>
          <v-col cols="12" sm="6" md="1">
            <v-text-field
              :label="getTipoPredio === 1 ? 'Manzana' : 'Polígono'"
              v-model="form.cod_pol_man"
              type="number"
              :rules="[v => !!v && v >= 1 && v <= 999 || 'Debe ser un número entre 1 y 999']"
              maxlength="3" @input="actualizaClaveCatastral"
              @keypress="limitDigits($event, 3)">
            </v-text-field>
          </v-col>          
          <v-col cols="12" sm="6" md="1" >
            <v-text-field
              label="Predio"              
              v-model="form.cod_pred"
              type="number"
              :rules="[v => !!v && v >= 1 && v <= 999 || 'Debe ser un número entre 1 y 999']"
              maxlength="3" @input="actualizaClaveCatastral"
              @keypress="limitDigits($event, 3)">
            </v-text-field>
          </v-col> 
      </v-row> 
      </v-card-text> 
    </v-card>     
    <!-- Tercer Bloque Ph -->
    <v-card :class="[tipoClaseBlock]" class="fill-width" v-if="form.id_regimen_propiedad === 4">
      <v-card-title class="centered-title">PROPIEDAD HORIZONTAL</v-card-title>
      <v-card-text>
        <v-row>
          <v-col cols="12" sm="6" md="2" v-if="form.id_regimen_propiedad === 4"> 
              <v-text-field 
                label="Unidad"                  
                v-model="form.cod_uni"               
                type="number"
                :rules="[v => !!v && v >= 0 && v <= 999 || 'Debe ser un número entre 0 y 999']"
                maxlength="3"
                @input="actualizaClaveCatastral"></v-text-field> 
            </v-col> 
            <v-col cols="12" sm="6" md="2" v-if="form.id_regimen_propiedad === 4"> 
              <v-text-field 
                label="Bloque"                  
                v-model="form.cod_bloq"
                type="number"
                :rules = "[v => !!v && v >= 0 && v <= 999 || 'Debe ser un número entre 0 y 999']"
                maxlength="3"
                @input="actualizaClaveCatastral"></v-text-field> 
            </v-col> 
            <v-col cols="12" sm="6" md="2" v-if="form.id_regimen_propiedad === 4"> 
              <v-select
              label="Tipo de Piso" v-model="form.id_tipo_piso" :items="tipoPisos" 
              item-title="descripcion" item-value="id" required  
              @input="actualizaClaveCatastral">
            </v-select> 
            </v-col> 
            <v-col cols="12" sm="6" md="2" v-if="form.id_regimen_propiedad === 4"> 
              <v-text-field 
                label="Piso"                  
                v-model="form.cod_piso"
                type="number"
                :rules = "[v => !!v && v >= 0 && v <= 99 || 'Debe ser un número entre 0 y 99']"
                maxlength="2"
                @input="actualizaClaveCatastral"></v-text-field> 
          </v-col>        
        </v-row>
      </v-card-text>
    </v-card>
    <!-- Cuarto Bloque Areas -->
    <v-card :class="[tipoClaseBlock]" class="fill-width" v-if="form.id_regimen_propiedad === 4">
      <v-card-title class="centered-title">ÁREAS</v-card-title>
      <v-card-text>
        <v-row>
          <v-col cols="12" sm="6" md="2">
            <v-text-field 
             label="Alicuota"                          
             v-model="form.alicuota" 
             type="number"
             >
            </v-text-field>
          </v-col>
          <v-col cols="12" sm="6" md="2">
            <v-text-field 
             label="Área de Terreno" 
             v-model="form.area_terreno" 
             type="number" 
             >
            </v-text-field>
          </v-col>
          <v-col cols="12" sm="6" md="2">
            <v-text-field label="Área Común de Terreno"               
             v-model="form.area_comun_terreno" 
             type="number"
              >
            </v-text-field>
          </v-col>
          <v-col cols="12" sm="6" md="2">                
            <v-select 
              :items="unidadAreas"
              label="Unidad de Área" 
              v-model="form.id_unidad_area" 
              item-title="descripcion" 
              item-value="id" 
              required 
            ></v-select>
          </v-col>          
          <v-col cols="12" sm="6" md="2">
            <v-text-field label="Área Individual Construida" 
             color = #F2AA1F 
             v-model="form.area_individual_construida" 
             type="number"
             >
            </v-text-field>
          </v-col>
          <v-col cols="12" sm="6" md="2">
            <v-text-field label="Área Común Construida" 
             color = #F2AA1F 
             v-model="form.area_comun_construida" 
             type="number"
             >
            </v-text-field>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card> 
     <!-- Quito Bloque Ejes Viales-->
    <v-card :class="[tipoClaseBlock]" class="fill-width">
      <v-card-title class="centered-title">EJES VIALES</v-card-title>
      <v-card-text>
        <v-row>
          <v-col cols="12" sm="6" md="4">
            <v-text-field label="Eje Principal" color = #F2AA1F v-model="form.eje_principal"></v-text-field>
          </v-col>
          <v-col cols="12" sm="6" md="4">
            <v-text-field label="Eje Secundario" color = #F2AA1F v-model="form.eje_secundario"></v-text-field>
          </v-col>
          <v-col cols="12" sm="6" md="4">
            <v-text-field label="Dirección Principal" color = #F2AA1F v-model="form.direccion_principal"></v-text-field>
          </v-col>
          <v-col cols="12" sm="6" md="4">
            <v-text-field label="Sector" color = #F2AA1F v-model="form.sector"></v-text-field>
          </v-col>
          <v-col cols="12" sm="6" md="4">
            <v-text-field
              label="Área Gráfica" 
              v-model="form.area_grafica" 
              readonly
             >
            </v-text-field>
          </v-col>          
        </v-row>
      </v-card-text>
    </v-card> 
    <!-- Alerta -->
    <v-snackbar v-model="snackbarErrorPush" :timeout="3000" color="error" rounded="pill">
      {{ snackbarError }}
    </v-snackbar>
    <v-snackbar v-model="snackbarOkPush" :timeout="3000" color="success" rounded="pill">
      {{ snackbarOk }}
    </v-snackbar>       
    <v-snackbar v-model="snackbarNotaPush" :timeout="3000" color="success" rounded="pill">
      {{ snackbarNota }}
    </v-snackbar>

    <!-- DIALOGO DE CONFIRMACIÓN -->
    <template v-if="confirmDelete">
      <v-dialog v-model="confirmDelete" max-width="400">
        <v-card>
          <v-card-title class="headline" style="white-space: normal; word-break: break-word;">¿Está seguro de que desea eliminar este Predio?</v-card-title>
          <v-card-text>Esta acción no se puede deshacer.</v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="grey" text @click="confirmDelete = false; snackbarError = 'Eliminación cancelada'; snackbarErrorPush = true;">Cancelar</v-btn>
            <v-btn color="red" text @click="confirmarEliminacion">Eliminar</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </template>
  </v-container>
</template>

<script>
import axios from 'axios';
import { mapActions } from 'vuex';
import { mapGetters } from 'vuex';
import useUserRoles from '@/composables/useUserRoles';
import useFotoEvents from '@/composables/useFotoEvents';
import API_BASE_URL from '@/config/apiConfig';
import sinPredio from '@/assets/sin-foto.png';
import sinCroquis from '@/assets/sin-croquis.png';
import { generarUrlCroquis } from '@/components/utils/croquisUtils';

export default {
  name: 'TabIdentificacion',
  setup() {
    const { onFotoUpdated } = useFotoEvents();
    return {
      onFotoUpdated
    };
  },

  data() {    
    return {      
      form: {
        id_predio: null, 
        id_tipo_predio: '',
        id_regimen_propiedad: '',
        clave_catastral_anterior: '',
        clave_catastral: '',
        nombre_predio: '',
        id_prov: '17',
        id_can: '1702',
        id_par: '',
        cod_zon: '',
        cod_sec: '',
        cod_pol_man: '',
        cod_pred: '',
        cod_uni: '',
        cod_bloq: '', 
        id_tipo_piso: '',
        cod_piso: '',
        alicuota: '',
        area_terreno: '',
        area_comun_terreno: '',
        id_unidad_area: '',
        area_individual_construida: '',
        area_comun_construida: '',
        eje_principal: '',
        eje_secundario: '',
        sector: '',
        area_grafica: '',
        digitador: '',
        fecha_registro: '',
        actualizador: '',
        fecha_actualizacion: '',        
        direccion_principal: '',
      },
      // Catálogos
      tipoPredios: [],
      regimens: [],
      tipoPisos: [],
      unidadAreas: [],
      parroquias: [],
      idPredio: null,
      isWindowVisible: true,
      snackbarErrorPush: false,
      snackbarError: '',      
      snackbarOkPush: false,
      snackbarOk: '',
      snackbarNotaPush: false,
      snackbarNota: '',
      fotoRecuperadaUrl: '',
      croquis: '',
      sinPredio: sinPredio,
      sinCroquis: sinCroquis,
      croquisUrl : '',
      confirmDelete: false,
     };
  },

  
  created() {
    let idPredio = this.$route.query.id_predio;
    let tipoPredio = this.$route.query.tipo_predio;
    
    // Manejar URLs mal formateadas con doble signo de interrogación
    if (idPredio && idPredio.includes('?tipo_predio=')) {
      const parts = idPredio.split('?tipo_predio=');
      idPredio = parts[0];
      tipoPredio = parts[1];
      console.log('URL mal formateada detectada. Corrigiendo:', {
        idPredio_original: this.$route.query.id_predio,
        idPredio_corregido: idPredio,
        tipoPredio_extraido: tipoPredio
      });
    }
    
    if (idPredio) {
      console.log('ID de predio recibido:', idPredio);
      this.id_predio = idPredio;
      this.updateIdPredio(idPredio);
      this.cargaPredio(idPredio);
      this.recuperaFotos(idPredio);
    } else {
      console.log('SIN ID DEL PREDIO RECIBIDO');
      this.resetIdPredio();
      this.resetIdTenencia();
      this.resetIdVia();
      this.resetIdBloque();
      this.resetIdMejora();    
      this.resetIdFoto();  
    }

    // Establecer tipo de predio desde URL si está disponible
    if (tipoPredio) {
      console.log('Tipo de predio recibido por URL:', tipoPredio);
      // Convertir string a number para que coincida con el catálogo
      const tipoPredioId = parseInt(tipoPredio);
      this.form.id_tipo_predio = tipoPredioId;
      
      // También establecer en el store de Vuex
      this.$store.commit('setTipoPredio', tipoPredioId);
      console.log('Tipo de predio establecido en Vuex desde URL:', tipoPredioId);
    }
  },

  async mounted() {
    try {
      console.log('Componente montado');
      
      // Obtener tipo de predio desde el store o determinar por defecto
      let tipoPredioFlag;
      if (this.form.id_tipo_predio) {
        // Si ya se estableció desde la URL, usarlo
        tipoPredioFlag = this.form.id_tipo_predio === 1 ? 0 : 2;
        console.log('Usando tipo de predio desde URL:', this.form.id_tipo_predio, 'Flag:', tipoPredioFlag);
      } else {
        // Usar el valor del store de Vuex
        tipoPredioFlag = this.getTipoPredio === 1 ? 0 : 2;
        console.log('Usando tipo de predio desde store:', this.getTipoPredio, 'Flag:', tipoPredioFlag);
      }
      
      // Cargar catálogos con el flag correcto
      this.tipoPredios = await this.cargaCatalogo(1, tipoPredioFlag);
      this.regimens = await this.cargaCatalogo(2, 0);
      this.tipoPisos = await this.cargaCatalogo(3, tipoPredioFlag);
      this.unidadAreas = await this.cargaCatalogo(8, tipoPredioFlag);
      this.parroquias = await this.caragaParroquias();

      console.log('Datos del catálogo cargados:',
        'tipoPredios:', this.tipoPredios,
        'regimens:', this.regimens,
        'tipoPisos:', this.tipoPisos
      );
    } catch (error) {
      console.error('Error al montar el componente:', error);
    }

    // 📸 Configurar listener para actualizaciones de foto
    this.onFotoUpdated(() => {
      console.log('FormIdentificacion: Foto actualizada detectada, recargando...');
      if (this.getIdPredio) {
        this.recuperaFotos(this.getIdPredio);
      }
    });
  },
  
  computed: {
    ...mapGetters(['isConsultaPrimario', 'userName', 'getTipoPredio', 'getIdPredio', 'getFotoUrl']),
    
    tipoClaseContainer() {
      return this.getTipoPredio === 1 ? 'urbano-container' : 'rural-container';
    },
    tipoClaseButton() {
      return this.getTipoPredio === 1 ? 'urbano-btn' : 'rural-btn';
    },
    tipoClaseTitle() {
      return this.getTipoPredio === 1 ? 'urbano-title' : 'rural-title';
    },
    tipoClaseBorder() {
      return this.getTipoPredio === 1 ? 'urbano-border' : 'rural-border';
    },
    tipoClaseText() {
      return this.getTipoPredio === 1 ? 'urbano-text' : 'rural-text';
    },

    tipoClaseBlock() {
      return this.getTipoPredio === 1 ? 'urbano-block' : 'rural-block';
    },
    
    formateaParroquias() {
      return this.parroquias.map(parroquia => ({
        ...parroquia,
        descripcion: `${parroquia.dpa} - ${parroquia.descripcion}`
      }));
    },
    
    isUpdateMode() {
      return this.idPredio !== null;
    },
    
    canEdit() {
      const { canEdit } = useUserRoles();
      return canEdit.value;
    },

    // 📸 Computed para obtener la foto reactiva del store
    fotoRecuperadaUrlReactiva() {
      return this.getFotoUrl || this.fotoRecuperadaUrl || '';
    }
  },

  // Métodos del componente
  methods: {
    ...mapActions([
    'updateIdPredio','updateIdTenencia','updateIdVia','updateIdBloque','updateIdMejora', 'updateIdFoto', 
    'resetIdPredio','resetIdTenencia','resetIdVia','resetIdBloque','resetIdMejora', 'resetIdFoto',
    'updateClaveCatastral', 'resetClaveCatastral', 'updateFotoUrl', 'resetFotoUrl'
    ]),

    // Obtener parroquia
    async caragaParroquias() {
      try {
        const response = await axios.get(`${API_BASE_URL}/catastro_parroquia`);        
        if (Array.isArray(response.data)) {
          return response.data.map(item => {
            if (item.dpa && item.descripcion) {
              return {
                ...item,
                tipoNombre: `${item.dpa} - ${item.descripcion}`,
                title: `${item.dpa} - ${item.descripcion}`,
                id: item.id
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
        console.error('Error fetching parroquia:', error);
        return [];
      }
    },

    // Obtiene Catalogo
    async cargaCatalogo(id_tipo_atributo, tipo) {
      try {
        const response = await axios.get(`${API_BASE_URL}/catalogo/${id_tipo_atributo}/${tipo}`);        
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

    // Obtener área del predio
    async caragaAreaGeo() {
      const claveCatastral = this.form.clave_catastral;
      if (!claveCatastral) {
        console.log('Clave catastral no definida');
        return;
      }
      try {
        console.log('Realizando solicitud para obtener el área del predio con clave catastral:', claveCatastral);
        const response = await axios.get(`${API_BASE_URL}/geo_consultas/area_predio/${claveCatastral}`);
        const areaPredio = response.data;
        console.log('Área del predio recuperada:', areaPredio);
        this.form.area_grafica = areaPredio;
        console.log('Área gráfica asignada:', this.form.area_grafica);
      } catch (error) {        
        this.form.area_grafica = 0;
      }
    },

    // Guardar formulario
    async guardar() {
      console.log('Guardando formulario:');

      const fechaActual = new Date();
      const anio = fechaActual.getFullYear();
      const mes = String(fechaActual.getMonth() + 1).padStart(2, '0');
      const dia = String(fechaActual.getDate()).padStart(2, '0');
      const hora = String(fechaActual.getHours()).padStart(2, '0');
      const minutos = String(fechaActual.getMinutes()).padStart(2, '0');
      const fechaRegistro = `${anio}-${mes}-${dia} ${hora}:${minutos}`;

      const nuevoPredio = {
        id_tipo_predio: this.form.id_tipo_predio,
        id_regimen_propiedad: this.form.id_regimen_propiedad,
        //clave_catastral: this.form.clave_catastral,
        fecha_registro: fechaRegistro,
        id_prov: this.form.id_prov && this.form.id_prov !== '' ? this.form.id_prov : '17',
        id_can: this.form.id_can && this.form.id_can !== '' ? this.form.id_can : '1702',
        id_par: this.form.id_par || 0,
        cod_zon: this.form.cod_zon || 0,
        cod_sec: this.form.cod_sec || 0,
        cod_pol_man: this.form.cod_pol_man || 0,
        cod_pred: this.form.cod_pred || 0,
        cod_uni: this.form.cod_uni || 0,
        cod_bloq: this.form.cod_bloq || 0,
        id_tipo_piso: this.form.id_tipo_piso || 5,
        cod_piso: this.form.cod_piso || 0,
        alicuota: this.form.alicuota || 0,
        area_terreno: this.form.area_terreno || 0,
        area_comun_terreno: this.form.area_comun_terreno || 0,
        id_unidad_area: this.form.id_unidad_area || 22,
        area_individual_construida: this.form.area_individual_construida || 0,
        area_comun_construida: this.form.area_comun_construida || 0,
        eje_principal: this.form.eje_principal || '',
        eje_secundario: this.form.eje_secundario || '',
        sector: this.form.sector || '',
        area_grafica: this.form.area_grafica ||  0,
        direccion_principal: this.form.direccion_principal || ''
        // Otros campos necesarios
      };

      try {
        const response = await axios.post(`${API_BASE_URL}/inserta_identificacion_predio`, nuevoPredio);
        console.log('Predio guardado con éxito:', response.data);
        this.snackbarOk = 'Predio guardado con éxito';
        this.snackbarOkPush = true;
        // Guardar el id del predio en la variable global idPredio si viene en la respuesta
        if (response.data && response.data.id) {
          this.idPredio = response.data.id;
          this.updateIdPredio(response.data.id);
          // Establecer la clave catastral en el store
          this.updateClaveCatastral(this.form.clave_catastral);
          console.log('Respuesta recibida del backend:', response.data);
          console.log('Clave catastral establecida en store:', this.form.clave_catastral);
        }

      } catch (error) {
        console.error('Error al guardar el predio:', error);
        
        // Capturar error específico de clave duplicada
        if (error.response && error.response.data) {
          // Si el backend envía mensaje específico
          if (error.response.data.error && error.response.data.error.includes('duplicada') || 
              error.response.data.error && error.response.data.error.includes('duplicate') ||
              error.response.data.error && error.response.data.error.includes('unique')) {
            this.snackbarError = 'Error: La clave catastral ya existe. No se permiten claves duplicadas.';
          } else {
            // Usar el mensaje de error que viene del backend
            this.snackbarError = error.response.data.error || 'Error al guardar el predio';
          }
        } else {
          this.snackbarError = 'Error al guardar el predio';
        }
        
        this.snackbarErrorPush = true;
      }
    },

    // Actualizar formulario
    async actualizar() {
      console.log('Actualizando identificación');
      // Obtener la fecha y hora actuales      

      // Validar id_predio antes de continuar
      if (!this.getIdPredio) {
        this.snackbarError = 'No se puede actualizar: el ID del predio es inválido.';
        this.snackbarErrorPush = true;
        return;
      }
      
      // Usar el ID del predio desde el store
      const id_predio = this.getIdPredio;

      const fechaActual = new Date();
      const anio = fechaActual.getFullYear();
      const mes = String(fechaActual.getMonth() + 1).padStart(2, '0'); 
      const dia = String(fechaActual.getDate()).padStart(2, '0');
      const hora = String(fechaActual.getHours()).padStart(2, '0');
      const minutos = String(fechaActual.getMinutes()).padStart(2, '0');
      const fechaActualiza = `${anio}-${mes}-${dia} ${hora}:${minutos}`;       

      const detalle_json = { 
        id_tipo_predio: this.form.id_tipo_predio,
        id_regimen_propiedad: this.form.id_regimen_propiedad,
        clave_catastral_anterior: this.form.clave_catastral_anterior,        
        id_prov: this.form.id_prov,
        id_can: this.form.id_can,
        id_par: this.form.id_par,
        cod_zon: this.form.cod_zon,
        cod_sec: this.form.cod_sec,
        cod_pol_man: this.form.cod_pol_man,
        cod_pred: this.form.cod_pred,
        eje_principal: this.form.eje_principal,
        eje_secundario: this.form.eje_secundario,
        sector: this.form.sector,
        actualizador: this.userName,
        fecha_actualizacion: fechaActualiza,
        direccion_principal: this.form.direccion_principal,
      };

      if (this.form.id_regimen_propiedad === 4) {
        // Validar campos PH
        const camposPH = [
          { nombre: 'cod_uni', valor: this.form.cod_uni },
          { nombre: 'cod_bloq', valor: this.form.cod_bloq },
          { nombre: 'id_tipo_piso', valor: this.form.id_tipo_piso },
          { nombre: 'cod_piso', valor: this.form.cod_piso },
          { nombre: 'alicuota', valor: this.form.alicuota },
          { nombre: 'area_terreno', valor: this.form.area_terreno },
          { nombre: 'area_comun_terreno', valor: this.form.area_comun_terreno },
          { nombre: 'id_unidad_area', valor: this.form.id_unidad_area },
          { nombre: 'area_individual_construida', valor: this.form.area_individual_construida },
          { nombre: 'area_comun_construida', valor: this.form.area_comun_construida }
        ];
        const campoFaltante = camposPH.find(c => c.valor === '' || c.valor === undefined || c.valor === null);
        if (campoFaltante) {
          this.snackbarError = `El campo ${campoFaltante.nombre} no puede estar vacío.`;
          this.snackbarErrorPush = true;
          return;
        }
        // Si el régimen de propiedad es PROPIEDAD HORIZONTAL - PH (código 4)
        detalle_json.cod_uni = this.form.cod_uni;
        detalle_json.cod_bloq = this.form.cod_bloq;
        detalle_json.id_tipo_piso = this.form.id_tipo_piso;
        detalle_json.cod_piso = this.form.cod_piso;
        detalle_json.alicuota = this.form.alicuota;
        detalle_json.area_terreno = this.form.area_terreno;
        detalle_json.area_comun_terreno = this.form.area_comun_terreno;
        detalle_json.id_unidad_area = this.form.id_unidad_area;
        detalle_json.area_individual_construida = this.form.area_individual_construida;
        detalle_json.area_comun_construida = this.form.area_comun_construida;
      } else {
        // Si el régimen de propiedad no es PROPIEDAD HORIZONTAL - PH (código 4)
        detalle_json.cod_uni = 0;
        detalle_json.cod_bloq = 0;
        detalle_json.id_tipo_piso = 5;
        detalle_json.cod_piso = 0;
        detalle_json.alicuota = null;
        detalle_json.area_terreno = null;
        detalle_json.area_comun_terreno = null;
        detalle_json.id_unidad_area = 22;
        detalle_json.area_individual_construida = null;
        detalle_json.area_comun_construida = null;
      }

      console.log('Datos a actualizar:', JSON.stringify(detalle_json, null, 2));

      try {
        const response = await axios.put(`${API_BASE_URL}/actualiza_catastro_predio/${id_predio}`, detalle_json);
        console.log('Identificación actualizada:', response.data);
        this.snackbarOk = 'Datos actualizados exitosamente';        
        this.snackbarOkPush = true;
        
      } catch (error) {
        console.error('Error al actualizar la identificación:', error);
        
        // Capturar error específico de clave duplicada
        if (error.response && error.response.data) {
          // Si el backend envía mensaje específico
          if (error.response.data.error && error.response.data.error.includes('duplicada') || 
              error.response.data.error && error.response.data.error.includes('duplicate')) {
            this.snackbarError = 'Error: La clave catastral ya existe. No se permiten claves duplicadas.';
          } else {
            // Usar el mensaje de error que viene del backend
            this.snackbarError = error.response.data.error || 'Error al actualizar la identificación';
          }
        } else {
          this.snackbarError = 'Error al actualizar la identificación';
        }
        
        this.snackbarErrorPush = true;
      }
    },

    // Obtener predio
    async cargaPredio(idPredio) {
      try {
        const response = await axios.get(`${API_BASE_URL}/catastro_predio_by_id/${idPredio}`);
        const predio = response.data;
        console.log('Datos del predio:', predio);
        // ✅ Establecer el tipo de predio en Vuex
        this.$store.commit('setTipoPredio', predio.id_tipo_predio);
        console.log('Tipo de predio establecido en Vuex:', predio.id_tipo_predio);        

        this.form = {
          id_tipo_predio: predio.id_tipo_predio,
          id_regimen_propiedad: predio.id_regimen_propiedad,
          clave_catastral_anterior: predio.clave_catastral_anterior,
          clave_catastral: predio.clave_catastral,
          id_prov: predio.id_prov,
          id_can: predio.id_can,
          id_par: predio.id_par,
          cod_zon: predio.cod_zon,
          cod_sec: predio.cod_sec,
          cod_pol_man: predio.cod_pol_man,
          cod_pred: predio.cod_pred,
          cod_uni: predio.cod_uni,
          cod_bloq: predio.cod_bloq,
          id_tipo_piso: predio.id_tipo_piso,
          cod_piso: predio.cod_piso,
          alicuota: predio.alicuota,
          area_terreno: predio.area_terreno,
          area_comun_terreno: predio.area_comun_terreno,
          id_unidad_area: predio.id_unidad_area,
          area_individual_construida: predio.area_individual_construida,
          area_comun_construida: predio.area_comun_construida,
          eje_principal: predio.eje_principal,
          eje_secundario: predio.eje_secundario,
          sector: predio.sector,
          area_grafica: predio.area_grafica,
          direccion_principal: predio.direccion_principal,
        };

        this.idPredio = idPredio;

        // ✅ Establecer la clave catastral en el store
        this.updateClaveCatastral(this.form.clave_catastral);
        console.log('Clave catastral establecida en store:', this.form.clave_catastral);

        // ✅ Generar croquis
        this.croquisUrl = await generarUrlCroquis(this.form.clave_catastral, 5);

        // (opcional) Cargar área geográfica
        await this.caragaAreaGeo(predio.area_grafica);

      } catch (error) {
        console.error('Error fetching predio:', error);
      }
    },


    // Recuperar fotos
    async recuperaFotos(id_predio) {      
      try {
        const response = await axios.get(`${API_BASE_URL}/fotos_by_idPredio/${id_predio}`);
        const data = response.data;
        if (data.length > 0) {
          const fotosPredio = data[0];                    

          if (fotosPredio.foto) {
            // Verificar si la imagen ya está en Base64
            if (typeof fotosPredio.foto === "string") {
              this.fotoRecuperadaUrl = `data:image/png;base64,${fotosPredio.foto}`;
            } else if (fotosPredio.foto.data) {
              // Convertir bytea a Blob y luego a URL
              const byteArray = new Uint8Array(fotosPredio.foto.data);
              const blob = new Blob([byteArray], { type: 'image/png' });
              this.fotoRecuperadaUrl = URL.createObjectURL(blob);
            }            
            this.fotoRecuperadaUrl = `data:image/png;base64,${fotosPredio.foto}`;
            this.updateFotoUrl(this.fotoRecuperadaUrl); // 📸 Actualizar store
          } else {
            this.fotoRecuperadaUrl = '';
            this.updateFotoUrl(null); // 📸 Limpiar store
            this.snackbarNota = 'No se encontró una imagen asociada';
            this.snackbarNotaPush = true;
          }
        } else {
          this.snackbarNota = 'No se encontraron fotos para este predio';
          this.snackbarNotaPush = true;
          this.fotoRecuperadaUrl = '';
          this.updateFotoUrl(null); // 📸 Limpiar store
        }
      } catch (error) {
        console.error('Error al recuperar la foto:', error);
        this.snackbarError = 'Error al recuperar la foto';
        this.snackbarErrorPush = true;
      }
    },

    async created() {
      const clave = this.form.clave_catastral;
      const url = await generarUrlCroquis(clave, 15); // 15 metros de margen
      this.croquisUrl = url;
    },

    // Nuevo registro
    nuevoRegistro() {
      this.idPredio = null;
      this.limpiarCampos();
      
      // Limpiar todas las variables relacionadas con fotos
      this.fotoRecuperadaUrl = '';
      this.updateFotoUrl(null); // Limpiar foto del store
      this.resetFotoUrl(); // Reset completo del store de fotos
      
      // Limpiar croquis
      this.croquisUrl = '';
      
      // Limpiar clave catastral
      this.resetClaveCatastral();
      
      console.log('✅ Nuevo registro: fotos y datos limpiados');
    },

    // Actualizar clave catastral
    actualizaClaveCatastral() {
      const { id_par, cod_zon, cod_sec, cod_pol_man, cod_pred, 
        id_regimen_propiedad, cod_uni, cod_bloq, id_tipo_piso, cod_piso } = this.form;

      // Asegurarse de que los campos manzana y predio sean de 3 dígitos
      const formattedCodPolMan = cod_pol_man ? String(cod_pol_man).padStart(3, '0') : '';
      const formattedCodPred = cod_pred ? String(cod_pred).padStart(3, '0') : '';

      if (id_regimen_propiedad !== 4) {
        // Si el régimen de propiedad no es PROPIEDAD HORIZONTAL - PH (código 4)
        this.form.clave_catastral = `${id_par}${cod_zon}${cod_sec}${formattedCodPolMan}${formattedCodPred}000000P00`;
      } else {
        // Si el régimen de propiedad es PROPIEDAD HORIZONTAL - PH (código 4)
        const formattedCodUni = cod_uni ? String(cod_uni).padStart(3, '0') : '';
        const formattedCodBloq = cod_bloq ? String(cod_bloq).padStart(3, '0') : '';
        let formattedCodPiso = cod_piso ? String(cod_piso).padStart(2, '0') : '';

        if (id_tipo_piso === 5) {
          // Si el tipo de piso es PISO (código 5)
          formattedCodPiso = `P${formattedCodPiso}`;
        } else if (id_tipo_piso === 6) {
          // Si el tipo de piso es SUBSUELO (código 6)
          formattedCodPiso = `S${formattedCodPiso}`;
        }

        this.form.clave_catastral = `${id_par}${cod_zon}${cod_sec}${formattedCodPolMan}${formattedCodPred}${formattedCodUni}${formattedCodBloq}${formattedCodPiso}`;
      }
    },

    async refrescarIdentificacion() {
      if (this.getIdPredio) {
        await this.cargaPredio(this.getIdPredio);
        this.recuperaFotos(this.getIdPredio);
        this.caragaAreaGeo();
        this.snackbarOk = 'Datos de identificación actualizados';
        this.snackbarOkPush = true;
      } else {
        this.snackbarError = 'No hay un predio seleccionado para refrescar';
        this.snackbarErrorPush = true;
      }
    },    

    // Limpiar Campos
    limpiarCampos() {
      console.log('Limpiando campos');
      this.form.id_predio = null;
      this.form.id_tipo_predio = '';
      this.form.id_regimen_propiedad = '';
      this.form.clave_catastral_anterior = '';
      this.form.clave_catastral = '';
      this.form.nombre_predio = '';
      this.form.id_prov = '17';
      this.form.id_can = '1702';
      this.form.id_par = '';
      this.form.cod_zon = '';
      this.form.cod_sec = '';
      this.form.cod_pol_man = '';
      this.form.cod_pred = '';
      this.form.cod_uni = '';
      this.form.cod_bloq = '';
      this.form.id_tipo_piso = '';
      this.form.cod_piso = '';
      this.form.alicuota = '';
      this.form.area_terreno = '';
      this.form.area_comun_terreno = '';
      this.form.id_unidad_area = '';
      this.form.area_individual_construida = '';
      this.form.area_comun_construida = '';
      this.form.eje_principal = '';
      this.form.eje_secundario = '';
      this.form.sector = '';      
      this.fecha_actualizacion = '';      
      this.fecha_registro = '';
      this.form.direccion_principal = '';

      // Limpia variables globales
      this.resetIdPredio();
      this.resetIdTenencia();
      this.resetIdVia();
      this.resetIdBloque();
      this.resetIdMejora();  
      this.resetIdFoto();
      this.resetClaveCatastral();
    },

    // Limitar dígitos
    limitDigits(event, maxDigits) {
      const input = event.target;
      if (input.value.length >= maxDigits) {
        event.preventDefault();
      }
    },

    // Navegar a la página de menú urbano
    navegaMenuPrincipal() {
      this.idPredio = null;
      this.idTenencia = null;
      this.idVia = null;
      this.idBloque = null;
      this.idMejora = null;
      this.idFoto = null;
      this.fotoRecuperadaUrl = '';
      this.resetClaveCatastral();
      this.$router.push('/menu-predial');
    },

    // Valida si el régimen de propiedad es propiedad horizontal
    validaRegimenPropiedad() {
      if (this.form.id_regimen_propiedad !== 4) {
        this.limpiarCampos();
      }
    },

    // Alternar visibilidad de la ventana
    alternaVentanas() {
      this.isWindowVisible = !this.isWindowVisible; // Alterna la visibilidad del v-window
    },

    // Método para copiar al portapapeles
    copiaClaveCatastral(text) {
      if (navigator && navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
        navigator.clipboard.writeText(text).then(() => {
          this.snackbarOk = 'Clave catastral copiada al portapapeles';
          this.snackbarOkPush = true;
        }).catch(err => {
          console.error('Error al copiar al portapapeles:', err);
          this.snackbarError = 'No se pudo copiar la clave al portapapeles';
          this.snackbarErrorPush = true;
        });
      } else {
        // Alternativa de respaldo con execCommand
        try {
          const input = document.createElement('input');
          input.setAttribute('value', text);
          document.body.appendChild(input);
          input.select();
          const success = document.execCommand('copy');
          document.body.removeChild(input);
          if (success) {
            this.snackbarOk = 'Clave catastral copiada al portapapeles (modo alternativo)';
            this.snackbarOkPush = true;
          } else {
            throw new Error('Fallback copy failed');
          }
        } catch (err) {
          console.error('Error alternativo al copiar:', err);
          this.snackbarError = 'Copiado no soportado en este navegador';
          this.snackbarErrorPush = true;
        }
      }
    },  


    // Eliminar predio
    async eliminar() {
      console.log('Eliminando predio', this.idPredio);
      if (!this.idPredio) {
        this.snackbarError = 'No hay un predio seleccionado para eliminar';
        this.snackbarErrorPush = true;
        return;
      }
      console.log('Eliminando predio 1');
      this.confirmDelete = true;
    },

    async confirmarEliminacion() {
      console.log('Confirmando eliminación de predio');
      this.confirmDelete = false;
      try {
        console.log('Eliminando predio');        
        await axios.post(`${API_BASE_URL}/elimina_predio_by_id/${this.idPredio}`);
        this.snackbarOk = 'Predio eliminado exitosamente';
        this.snackbarOkPush = true;
        this.resetClaveCatastral(); // Limpiar clave catastral del store
        this.nuevoRegistro(); // Limpiar el formulario después de eliminar
      } catch (error) {
        console.error('Error al eliminar el predio:', error);
        this.snackbarError = 'Error al eliminar el predio';
        this.snackbarErrorPush = true;
      }
    },

    async generaValoracion() {
      console.log('Genera Valoración');
      if (this.$refs.form.validate()) {
        const payload = {
          pr_anio: this.form.anio_emision,
          var_tipo: this.form.tipo,
          pr_clave: this.form.clave_catastral,
          var_usuario: this.form.usuario
        };
        console.log('Datos enviados a la API:', JSON.stringify(payload, null, 2));
        try {
          const response = await axios.post(`${API_BASE_URL}/ejecuta_valoracion`, payload);
          console.log('Respuesta de la API:', response.data);
          this.snackbarOk = 'Valoración generada correctamente';
          this.snackbarOkPush = true;

        } catch (error) {
          console.error('Error al ejecutar la valoración:', error);
          this.snackbarError = 'Error al generar la valoración';
          this.snackbarErrorPush = true;
        }
      } else {
        console.log('Formulario inválido');
        this.snackbarNota = 'Formulario inválido';
        this.snackbarNotaPush = true;
      }
    },

    async valorar() {
      console.log('Ejecutando valoración...');
      if (!this.idPredio) {
        this.snackbarError = 'No hay un predio seleccionado para valorar';
        this.snackbarErrorPush = true;
        return;
      }
  
      const payload = {
        pr_anio: new Date().getFullYear(), // Año actual
        var_tipo: 1, // Tipo 1: Urbano
        pr_clave: this.form.clave_catastral, // Clave catastral
        var_usuario: this.form.usuario // Nombre del usuario
      };
  
      console.log('Datos enviados a la API para valoración:', JSON.stringify(payload, null, 2));
  
      try {
        const response = await axios.post(`${API_BASE_URL}/ejecuta_valoracion`, payload);
        console.log('Respuesta de la API:', response.data);
        this.snackbarOk = 'Valoración generada correctamente';
        this.snackbarOkPush = true;
      } catch (error) {
        console.error('Error al ejecutar la valoración:', error);
        this.snackbarError = 'Error al generar la valoración';
        this.snackbarErrorPush = true;
      }
    },

    imprimirFicha() {
      if (this.idPredio) {
        this.$router.push({ path: '/impresion-ficha', query: { idPredio: this.idPredio } });
      } else {
        this.snackbarError = 'No hay un predio seleccionado para imprimir';
        this.snackbarErrorPush = true;
      }
    },

  }, 
};

</script>

<style scoped>

.window-title {
  font-size: 1.5rem;
  font-weight: bold;
  color: #ffffff;
  margin-bottom: 0px;
}
/* Fondo uniforme para todas las tarjetas */
.v-card {
  background-color: #F1ECE7 ;
}

.custom-img {
  width: 240px;
  height: 240px;
  object-fit: cover;
  border-radius: 8px;
  background-color: #F1ECE7;
  border: 1px solid #ccc;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: relative;
  overflow: hidden;
}

/* Título centrado sobre la imagen */
.img-title {
  position: absolute;
  bottom: 8px;
  left: 50%;
  transform: translateX(-50%);
  background-color: rgba(17, 17, 17, 0.6); 
  color: #fff;
  padding: 4px 12px;
  border-radius: 6px;
  font-weight: 600;
  font-size: 1rem;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.5);
}

/* Contenedor principal */
.urbano-container {
  background-color: #114358;
}

.rural-container {
  background-color: #668A4C;
}

/* Botones */
.urbano-btn {
  background-color: #276E90 ;
  color: #ffffff ;
  border-radius: 8px;
  font-weight: 600;
  margin: 4px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
}

.rural-btn {
  background-color: #4C7031 ;
  color: #ffffff ;
  border-radius: 8px;
  font-weight: 600;
  margin: 4px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
}

/* Título superior */
.titulo-pantalla {
  font-size: 2rem;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 12px;
}

/* Bloques */
.urbano-block {
  background-color: #ffffff;
  border-left: 6px solid #276E90;
  border-radius: 12px;
  margin-bottom: 16px;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.rural-block {
  background-color: #ffffff;
  border-left: 6px solid #4C7031;
  border-radius: 12px;
  margin-bottom: 16px;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

/* Títulos de tarjetas */
.centered-title {
  font-weight: bold;
  font-size: 1.3rem;
  text-align: center;
  margin-bottom: 8px;
  color: #333;
}

/* Imágenes */
.custom-img {
  width: 240px;
  height: 240px;
  object-fit: cover;
  border-radius: 10px;
  border: 2px solid #ccc;
  margin-right: 12px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.1);
}

/* Texto */
.bold-text {
  font-weight: bold;
}
.large-text {
  font-size: 1.15rem;
}



</style>