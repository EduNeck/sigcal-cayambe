<template>
  <v-container :class="['container', tipoClaseContainer]">
  <v-col cols="12" class="text-center">
    <h2 class="titulo-pantalla">Bloques Constructivos</h2>
  </v-col>

  <v-col cols="auto" class="d-flex justify-center"> 
    <v-btn :class="['btn_app', tipoClaseButton]" append-icon="mdi-plus" @click="nuevo" :disabled="!getIdPredio" v-if="canEdit">Nuevo</v-btn>
    <v-btn :class="['btn_app', tipoClaseButton]" append-icon="mdi-check" @click="guardar" :disabled="!getIdPredio || !!idBloque" v-if="canEdit">Guardar</v-btn>      
    <v-btn :class="['btn_app', tipoClaseButton]" append-icon="mdi-pencil" @click="actualizar" :disabled="!idBloque" v-if="canEdit">Actualizar</v-btn>          
    <v-btn :class="['btn_app', tipoClaseButton]" append-icon="mdi-delete" @click="eliminar" :disabled="!idBloque" v-if="canEdit">Eliminar</v-btn>          
  </v-col>


      <!-- Primer Bloque - Información del Bloque -->  
       <v-card class="mb-3" :class="['block-color', tipoClaseBlock]">
        <v-card-title class="centered-title">BLOQUE CONSTRUCTIVO - PISO</v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="12" sm="6" md="3">
              <v-text-field 
                label="Código Unidad" 
                v-model="form.cod_uni" 
                type="number"
                ></v-text-field>
            </v-col>
            
            <v-col cols="12" sm="6" md="3">
              <v-text-field 
                label="Código de Bloque" 
                v-model="form.cod_bloq" 
                type="number"
                ></v-text-field>
            </v-col>

            <v-col cols="12" sm="6" md="3">                
              <v-select 
                :items="tipoPiso" 
                label="Tipo de Piso" 
                v-model="form.id_tipo_piso" 
                item-text="title" 
                item-value="id" 
                ></v-select>
            </v-col>

            <v-col cols="12" sm="6" md="3">
              <v-text-field 
                label="Código de Piso" 
                v-model="form.cod_piso" 
                type="number"
                ></v-text-field>
            </v-col>

            <v-col cols="12" sm="6" md="3">
              <v-text-field label="Código Único Eléctronico Nacional" 
                v-model="form.cuen"
                ></v-text-field>
            </v-col>
            
            <v-col cols="12" sm="6" md="3">                
              <v-select 
                :items="ocupacionBloque" 
                label="Uso del Bloque" 
                v-model="form.id_ocupacion" 
                item-text="title" 
                item-value="id"
              ></v-select>
            </v-col>

          </v-row>
        </v-card-text>
      </v-card>
      
      <!-- Nueva Sección: DATOS DEL PISO -->
       <v-card class="mb-3" :class="['block-color', tipoClaseBlock]">
        <v-card-title class="centered-title">DATOS DEL PISO</v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="12" sm="6" md="3">
              <v-text-field label="Año Construcción *" 
                v-model="form.anio_construccion" 
                type="number"
                :rules="[v => !!v || 'Este campo es obligatorio']"
                required 
                ></v-text-field>
            </v-col>

            <v-col cols="12" sm="6" md="3">
              <v-text-field label="Año Restauración" 
                v-model="form.anio_restauracion" 
                type="number"
                ></v-text-field>
            </v-col>

            <v-col cols="12" sm="6" md="2">
              <v-text-field label="Área Construcción (m2)" 
                v-model="form.area_construida" 
                type="number"
                ></v-text-field>
            </v-col>

            <v-col cols="12" sm="6" md="2">                
              <v-select 
                :items="condicionFisica" 
                label="Condición Física" 
                v-model="form.id_condicion_fisica" 
                item-text="title" 
                item-value="id"
              ></v-select>
            </v-col>
            
            <v-col cols="12" sm="6" md="2">                
              <v-select 
                :items="condicionPatrimonial" 
                label="Condición Patrimonial" 
                v-model="form.id_condicion_patrimonial" 
                item-text="title" 
                item-value="id"
              ></v-select>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
      
      <!-- Sección 1: CARACTERÍSTICAS GENERALES -->
       <v-card class="mb-3" :class="['block-color', tipoClaseBlock]">
        <v-card-title class="centered-title">CARACTERÍSTICAS GENERALES</v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="12" sm="6" md="4">                
              <v-select 
                :items="estructura" 
                label="Estructura" 
                v-model="form.id_estructura" 
                item-text="title" 
                item-value="id"                 
              ></v-select>
            </v-col>
            
            <v-col cols="12" sm="6" md="4">                
              <v-select 
                :items="estadoConservacion" 
                label="Estado de Conservación" 
                v-model="form.id_estado_conservacion" 
                item-text="title" 
                item-value="id"                
              ></v-select>
            </v-col>

            <v-col cols="12" sm="6" md="4">                
              <v-select 
                :items="valorCultural" 
                label="Valor Cultural" 
                v-model="form.id_valor_cultural" 
                item-text="title" 
                item-value="id"                
              ></v-select>
            </v-col>

          </v-row>
        </v-card-text>
      </v-card>

      <!-- Sección 2: ESTRUCTURA -->
       <v-card class="mb-3" :class="['block-color', tipoClaseBlock]">
        <v-card-title class="centered-title">ESTRUCTURA</v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="12" sm="6" md="4">                
              <v-select 
                :items="columnas" 
                label="Columnas" 
                v-model="form.id_columnas" 
                item-text="title" 
                item-value="id"                 
              ></v-select>
            </v-col>

            <v-col cols="12" sm="6" md="4">                
              <v-select 
                :items="vigas" 
                label="Vigas" 
                v-model="form.id_vigas" 
                item-text="title" 
                item-value="id"                
              ></v-select>
            </v-col>
            
            <v-col cols="12" sm="6" md="4">                
              <v-select 
                :items="entrepisos" 
                label="Entrepisos" 
                v-model="form.id_entrepisos" 
                item-text="title" 
                item-value="id"                
              ></v-select>
            </v-col>
            
            <v-col cols="12" sm="6" md="4">                
              <v-select 
                :items="contrapiso" 
                label="Contrapiso" 
                v-model="form.id_contrapiso" 
                item-text="title" 
                item-value="id"                
              ></v-select>
            </v-col>
            
            <v-col cols="12" sm="6" md="4">                
              <v-select 
                :items="paredes" 
                label="Paredes" 
                v-model="form.id_paredes" 
                item-text="title" 
                item-value="id"                
              ></v-select>
            </v-col>

            <v-col cols="12" sm="6" md="4">                
              <v-select 
                :items="escaleras" 
                label="Escaleras" 
                v-model="form.id_escaleras" 
                item-text="title" 
                item-value="id"                
              ></v-select>
            </v-col>
            
            <v-col cols="12" sm="6" md="4">                
              <v-select 
                :items="cubiertaEstructura" 
                label="Cubierta Estructura" 
                v-model="form.id_cubierta" 
                item-text="title" 
                item-value="id"                
              ></v-select>
            </v-col>
            
            <v-col cols="12" sm="6" md="4">                
              <v-select 
                :items="pisos" 
                label="Pisos" 
                v-model="form.id_pisos" 
                item-text="title" 
                item-value="id"                
                placeholder="Seleccione"
              ></v-select>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>

      <!-- Sección 3: ACABADOS -->
       <v-card class="mb-3" :class="['block-color', tipoClaseBlock]">
        <v-card-title class="centered-title">ACABADOS</v-card-title>
        <v-card-text>
          <v-row>

            <v-col cols="12" sm="6" md="4">                
              <v-select 
                :items="revPiso" 
                label="Revestimiento Piso" 
                v-model="form.id_revestimiento_pisos" 
                item-text="title" 
                item-value="id"                
              ></v-select>
            </v-col>

            <v-col cols="12" sm="6" md="4">                
              <v-select 
                :items="revInterior" 
                label="Revestimiento Interior" 
                v-model="form.id_revestimiento_paredes" 
                item-text="title" 
                item-value="id"                
              ></v-select>
            </v-col>

            <v-col cols="12" sm="6" md="4">                
              <v-select 
                :items="revExterior" 
                label="Revestimiento Exterior" 
                v-model="form.id_revestimiento_cubierta" 
                item-text="title" 
                item-value="id"                
              ></v-select>
            </v-col>
            
            <v-col cols="12" sm="6" md="4">                
              <v-select 
                :items="revEscaleras" 
                label="Revestimiento Escaleras" 
                v-model="form.id_revestimiento_escaleras" 
                item-text="title" 
                item-value="id"                
              ></v-select>
            </v-col>
            
            <v-col cols="12" sm="6" md="4">                
              <v-select 
                :items="tumbado" 
                label="Tumbado" 
                v-model="form.id_tumbado" 
                item-text="title" 
                item-value="id"                
              ></v-select>
            </v-col>
            
            <v-col cols="12" sm="6" md="4">                
              <v-select 
                :items="cubAcabados" 
                label="Cubierta Acabados" 
                v-model="form.id_revestimiento_acabados" 
                item-text="title" 
                item-value="id"                
              ></v-select>
            </v-col>

            <v-col cols="12" sm="6" md="4">                
              <v-select 
                :items="puertas" 
                label="Puertas" 
                v-model="form.id_puertas" 
                item-text="title" 
                item-value="id"                
              ></v-select>
            </v-col>
            
            <v-col cols="12" sm="6" md="4">                
              <v-select 
                :items="ventanas" 
                label="Ventanas" 
                v-model="form.id_ventanas" 
                item-text="title" 
                item-value="id"                
              ></v-select>
            </v-col>

            <v-col cols="12" sm="6" md="4">                
              <v-select 
                :items="cubVentanas" 
                label="Cubierta Ventanas" 
                v-model="form.id_marco_ventanas" 
                item-text="title" 
                item-value="id"                
              ></v-select>
            </v-col>
            
            <v-col cols="12" sm="6" md="4">                
              <v-select 
                :items="closets" 
                label="Closets" 
                v-model="form.id_closets" 
                item-text="title" 
                item-value="id"                
              ></v-select>
            </v-col>

            <v-col cols="12" sm="6" md="4">                
              <v-select 
                :items="acabadosVivienda" 
                label="Acabados Vivienda" 
                v-model="form.id_acabados_vivienda" 
                item-text="title" 
                item-value="id"
                placeholder="Seleccione"                
              ></v-select>
            </v-col>

          </v-row>
        </v-card-text>
      </v-card>

      <!-- Sección 4: INSTALACIONES -->
       <v-card class="mb-3" :class="['block-color', tipoClaseBlock]">
        <v-card-title class="centered-title">INSTALACIONES</v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="12" sm="6" md="4">                
              <v-select 
                :items="instalacionesSanitarias" 
                label="Instalaciones Sanitarias" 
                v-model="form.id_instalaciones_sanitarias" 
                item-text="title" 
                item-value="id"                
              ></v-select>
            </v-col>
            
            <v-col cols="12" sm="6" md="4">                
              <v-select 
                :items="banios" 
                label="Baños" 
                v-model="form.id_banios" 
                item-text="title" 
                item-value="id"                
              ></v-select>
            </v-col>
            
            <v-col cols="12" sm="6" md="4">                
              <v-select 
                :items="instalacionesElectricas" 
                label="Instalaciones Eléctricas" 
                v-model="form.id_instalaciones_electricas" 
                item-text="title" 
                item-value="id"                
              ></v-select>
            </v-col>
            
            <v-col cols="12" sm="6" md="4">
              <v-select label="Permiso de Construcción" 
                :items="valida"
                v-model="form.permiso_construccion"
                ></v-select>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    <!-- Alerta -->
    <v-snackbar v-model="snackbarErrorPush" :timeout="3000" color="error">
      {{ snackbarError }}
    </v-snackbar>
    <v-snackbar v-model="snackbarOkPush" :timeout="3000" color="success">
      {{ snackbarOk }}
    </v-snackbar>
    </v-container>
</template>
  
<script>
import axios from 'axios';
import { mapGetters, mapActions } from 'vuex';
import useUserRoles from '@/composables/useUserRoles';
import { useBloquesEvents } from '@/composables/useBloquesEvents';
import API_BASE_URL from '@/config/apiConfig';

export default {
  name: 'TabBloques', // 🏗️ Force refresh - Fixed mapActions duplication issue
  setup() {
    const { emitBloquesUpdated } = useBloquesEvents();
    return { emitBloquesUpdated };
  },
  data() {
    return {
      form: {
        id_bloques: null,
        cod_uni: '',
        cod_bloq: '',        
        id_tipo_piso: null,
        cod_piso: '',
        cuen: '',        
        id_condicion_fisica: null,
        id_estado_conservacion: null,
        id_condicion_patrimonial: null,
        id_valor_cultural: null,
        anio_construccion: '',
        anio_restauracion: '', 
        area_construida: '',
        id_ocupacion: null,
        id_estructura: null,
        id_columnas: null,
        id_vigas: null,
        id_entrepisos: null,
        id_contrapiso: null,
        id_paredes: null,
        id_escaleras: null,
        id_cubierta: null,
        id_pisos: null,
        id_revestimiento_cubierta: null,
        id_acabados_vivienda: null,
        id_revestimiento_pisos: null,
        id_revestimiento_paredes: null,
        id_revestimiento_escaleras: null,
        id_tumbado: null,
        id_revestimiento_acabados: null,
        id_puertas: null,
        id_ventanas: null,
        id_marco_ventanas: null,
        id_vidrios: null,
        id_closets: null,
        id_instalaciones_sanitarias: null,
        id_banios: null,
        id_instalaciones_electricas: null,
        permiso_construccion: ''
      },

      // Listados
      tipoPiso: [],      
      condicionFisica: [],
      estadoConservacion: [],        
      condicionPatrimonial: [],
      valorCultural: [],   
      ocupacionBloque: [],      
      estructura: [],
      columnas: [],
      vigas: [],
      entrepisos: [],
      contrapiso: [],
      paredes: [],
      escaleras: [],
      cubierta: [],
      pisos: [],
      acabadosVivienda: [],
      revPiso: [],
      revInterior: [],        
      revExterior: [],
      revEscaleras: [],
      tumbado: [],
      cubAcabados: [],
      puertas: [],
      ventanas: [],
      cubVentanas: [],
      vidrios: [],
      closets: [],
      instalacionesSanitarias: [],
      banios: [],
      instalacionesElectricas: [],
      valida: [ 'SI' , 'NO' ],
      cubiertaEstructura: [],
      idBloque: null,
      idPredio: null,
      areaCalculationTimeout: null, // Para el debounce del cálculo automático
      snackbarErrorPush: false,
      snackbarOkPush: false,
      snackbarOk: '',
      snackbarError: ''   
    };
  },

  watch: {
    // Watcher para calcular automáticamente el área cuando se llenan todos los campos necesarios
    'form.cod_bloq'() { this.calcularAreaAutomaticamente(); },
    'form.cod_piso'() { this.calcularAreaAutomaticamente(); },
    'form.cod_uni'() { this.calcularAreaAutomaticamente(); },
    'form.id_tipo_piso'() { this.calcularAreaAutomaticamente(); }
  },

  computed: {
    ...mapGetters(['getIdPredio', 'getIdBloque', 'getTipoPredio', 'isConsultaPrimario']),
    canEdit() {
      const { canEdit } = useUserRoles();
      return canEdit.value;
    },
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
    }
  },

  async mounted() {
    // Recuperar id de query o Vuex
    const idBloquesQuery = this.$route.query.id_bloques; 
    
    // Recuperar tipo_predio de la URL
    const tipoPredioQuery = this.$route.query.tipo_predio;
    console.log('🔍 Parámetros de la URL:', { id_bloques: idBloquesQuery, tipo_predio: tipoPredioQuery });
    
    // Si viene el tipo_predio en la URL, actualizar el store
    if (tipoPredioQuery) {
      const tipoPredioNumerico = parseInt(tipoPredioQuery);
      console.log('✅ Recibido TIPO PREDIO desde la URL:', tipoPredioNumerico);
      this.$store.commit('setTipoPredio', tipoPredioNumerico);
    }

    if (idBloquesQuery) {
      console.log('✅ Recibido ID BLOQUE desde la URL:', idBloquesQuery);
      this.idBloque = idBloquesQuery;
      this.$store.dispatch('updateIdBloque', idBloquesQuery);
    } else if (this.getIdBloque) {
      console.log('✅ ID BLOQUE tomado desde Vuex:', this.getIdBloque);
      this.idBloque = this.getIdBloque;
    } else {
      console.warn('⚠️ No hay ID de bloque disponible.');
    }

    // Asignar idPredio de Vuex
    if (this.getIdPredio) {
      this.idPredio = this.getIdPredio;
      console.log('✅ ID PREDIO:', this.idPredio);
    } else {
      console.warn('⚠️ No hay ID de predio disponible.');
    }

    // Cargar catálogos una sola vez
    await this.cargaCatalogos();

    // Recuperar datos del bloque si existe
    if (this.idBloque) {
      await this.cargaBloques(this.idBloque);
      
      // Verificar si después de cargar el bloque tenemos los campos necesarios pero no el área
      // Nota: cod_uni puede ser 0, por lo que validamos si existe con typeof
      const cod_uni_valido = typeof this.form.cod_uni === 'number' || typeof this.form.cod_uni === 'string';
      
      if (this.form.cod_bloq && this.form.cod_piso && cod_uni_valido && 
          this.form.id_tipo_piso && !this.form.area_construida) {
        console.log('⏱️ Esperando 500ms antes de intentar obtener el área del bloque...');
        console.log('📊 Valores para cálculo:', 
                   {cod_bloq: this.form.cod_bloq, 
                    cod_piso: this.form.cod_piso, 
                    cod_uni: this.form.cod_uni, 
                    tipo_piso: this.form.id_tipo_piso});
        // Pequeña espera para asegurar que todo esté listo
        setTimeout(() => {
          console.log('🔄 Intentando obtener el área del bloque después del montaje...');
          this.obtenerAreaBloque();
        }, 500);
      }
    }
  },

  methods: {
    ...mapActions(['incrementBloquesCount']), // 🏗️ Action para incrementar contador de bloques
  
    async obtenerAreaBloque() {
      // Validar que tenemos todos los parámetros necesarios
      // Nota: cod_uni puede ser 0, por lo que debemos validarlo con typeof para evitar falsy
      if (!this.idPredio || !this.form.cod_bloq || !this.form.cod_piso || 
          (typeof this.form.cod_uni !== 'number' && typeof this.form.cod_uni !== 'string') || !this.form.id_tipo_piso) {
        console.warn('⚠️ Faltan parámetros para consultar el área del bloque');
        console.log('Parámetros faltantes:');
        if (!this.idPredio) console.log('  - ID Predio');
        if (!this.form.cod_bloq) console.log('  - cod_bloq');
        if (!this.form.cod_piso) console.log('  - cod_piso');
        if (typeof this.form.cod_uni !== 'number' && typeof this.form.cod_uni !== 'string') console.log('  - cod_uni');
        if (!this.form.id_tipo_piso) console.log('  - id_tipo_piso');
        return;
      }

      try {
        console.log('🔄 Obteniendo clave catastral para el predio ID:', this.idPredio);
        // Primero necesitamos obtener la clave catastral del predio
        const predioResponse = await axios.get(`${API_BASE_URL}/catastro_predio_by_id/${this.idPredio}`);
        const claveCatastral = predioResponse.data.clave_catastral;
        
        if (!claveCatastral) {
          console.warn('⚠️ No se pudo obtener la clave catastral del predio');
          this.snackbarError = 'No se pudo obtener la clave catastral del predio';
          this.snackbarErrorPush = true;
          return;
        }
        
        console.log('✅ Clave catastral obtenida:', claveCatastral);

        // Convertir getTipoPredio a tipoZona (asumiendo que es la misma lógica)
        const tipoZona = this.getTipoPredio;

        // Ajustar id_tipo_piso restando 4
        const tipoPixoAjustado = this.form.id_tipo_piso - 4;
        console.log('🔧 Ajustando id_tipo_piso:', this.form.id_tipo_piso, '→', tipoPixoAjustado);

        console.log('🔍 Consultando área para bloque con parámetros:');
        console.log(`  - Clave Catastral: ${claveCatastral}`);
        console.log(`  - Código Bloque: ${this.form.cod_bloq}`);
        console.log(`  - Código Piso: ${this.form.cod_piso}`);
        console.log(`  - Código Unidad: ${this.form.cod_uni}`);
        console.log(`  - Tipo Piso Ajustado: ${tipoPixoAjustado}`);
        console.log(`  - Tipo Zona: ${tipoZona}`);

        const urlConsulta = `${API_BASE_URL}/geo_consultas/area_bloque/${claveCatastral}/${this.form.cod_bloq}/${this.form.cod_piso}/${this.form.cod_uni}/${tipoPixoAjustado}/${tipoZona}`;
        console.log('📡 URL de consulta:', urlConsulta);

        // Llamar al servicio de área de bloque
        const areaResponse = await axios.get(urlConsulta);

        if (areaResponse.data && (typeof areaResponse.data === 'number' || (typeof areaResponse.data === 'string' && !isNaN(parseFloat(areaResponse.data))))) {
          // Convertir a número si es string
          const areaValue = typeof areaResponse.data === 'number' ? areaResponse.data : parseFloat(areaResponse.data);
          this.form.area_construida = areaValue;
          console.log('✅ Área del bloque obtenida:', areaValue);
          
          // Mostrar mensaje con el área obtenida
          this.snackbarOk = `Área del bloque calculada: ${areaValue.toFixed(2)} m²`;
          this.snackbarOkPush = true;
        } else {
          console.warn('⚠️ No se encontró área para este bloque');
          console.log('Respuesta recibida:', areaResponse.data);
          this.snackbarError = 'No se encontró área para este bloque en la capa gráfica';
          this.snackbarErrorPush = true;
        }

      } catch (error) {
        console.error('❌ Error al obtener el área del bloque:', error);
        if (error.response) {
          console.error('Detalles del error:');
          console.error('  - Status:', error.response.status);
          console.error('  - Data:', error.response.data);
        }
        
        if (error.response?.status === 404) {
          console.warn('⚠️ No se encontró área para este bloque en la base de datos (404)');
          this.snackbarError = 'No se encontró geometría para este bloque en la capa gráfica';
          this.snackbarErrorPush = true;
        } else {
          this.snackbarError = 'Error al obtener el área del bloque';
          this.snackbarErrorPush = true;
        }
      }
    },

    // Método para calcular área automáticamente con debounce
    calcularAreaAutomaticamente() {
      // Limpiar timeout anterior si existe
      if (this.areaCalculationTimeout) {
        clearTimeout(this.areaCalculationTimeout);
      }
      
      // Establecer nuevo timeout para evitar múltiples llamadas
      this.areaCalculationTimeout = setTimeout(() => {
        // Nota: cod_uni puede ser 0, por lo que validamos si existe con typeof
        const cod_uni_valido = typeof this.form.cod_uni === 'number' || typeof this.form.cod_uni === 'string';
        
        if (this.form.cod_bloq && this.form.cod_piso && cod_uni_valido && 
            this.form.id_tipo_piso && this.idPredio && !this.form.area_construida) {
          console.log('⏱️ Calculando área automáticamente con valores:',
                     {cod_bloq: this.form.cod_bloq, 
                      cod_piso: this.form.cod_piso, 
                      cod_uni: this.form.cod_uni, 
                      tipo_piso: this.form.id_tipo_piso});
          this.obtenerAreaBloque();
        }
      }, 500); // Esperar 500ms después del último cambio
    },

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

    async cargaCatalogos() {
      console.log('Cargando catálogos...');
      
      // Determinar el tipo de predio a utilizar
      // Verificar primero si hay un tipo_predio en la URL
      const tipoPredioQuery = this.$route.query.tipo_predio;
      
      let tipoPredioFlag;
      if (tipoPredioQuery) {
        const tipoPredioNumerico = parseInt(tipoPredioQuery);
        tipoPredioFlag = tipoPredioNumerico === 1 ? 0 : 2;
        console.log('🔍 Usando tipo de predio desde la URL para catálogos:', tipoPredioNumerico, '→ Flag:', tipoPredioFlag);
      } else {
        // Si no hay en la URL, usar el del store
        tipoPredioFlag = this.getTipoPredio === 1 ? 0 : 2;
        console.log('🔍 Usando tipo de predio desde store para catálogos:', this.getTipoPredio, '→ Flag:', tipoPredioFlag);
      }
      
      try {
        this.tipoPiso = await this.cargaCatalogo(3,0);         
        this.ocupacionBloque = await this.cargaCatalogo(30,tipoPredioFlag);               
           
        this.condicionFisica = await this.cargaCatalogo(28,tipoPredioFlag);
        this.condicionPatrimonial = await this.cargaCatalogo(29,tipoPredioFlag); 

        this.estructura = await this.cargaCatalogo(35,tipoPredioFlag); 
        this.estadoConservacion = await this.cargaCatalogo(27,tipoPredioFlag); 
        this.valorCultural = await this.cargaCatalogo(66,tipoPredioFlag);
        

        this.columnas = await this.cargaCatalogo(85,tipoPredioFlag);
        this.vigas = await this.cargaCatalogo(86,tipoPredioFlag);
        this.entrepisos = await this.cargaCatalogo(70,tipoPredioFlag);
        this.contrapiso = await this.cargaCatalogo(87,tipoPredioFlag);

        this.paredes = await this.cargaCatalogo(36,tipoPredioFlag); 
        this.escaleras = await this.cargaCatalogo(71,tipoPredioFlag);   
        this.cubiertaEstructura = await this.cargaCatalogo(39,tipoPredioFlag);
        this.pisos = await this.cargaCatalogo(55,tipoPredioFlag);

        this.revPiso = await this.cargaCatalogo(88,tipoPredioFlag);
        this.revInterior = await this.cargaCatalogo(89,tipoPredioFlag);
        this.revExterior = await this.cargaCatalogo(90,tipoPredioFlag);
        this.revEscaleras = await this.cargaCatalogo(91,tipoPredioFlag);
        this.tumbado = await this.cargaCatalogo(56,tipoPredioFlag);
        this.cubAcabados = await this.cargaCatalogo(37,tipoPredioFlag);
        this.puertas = await this.cargaCatalogo(41,tipoPredioFlag);
        this.ventanas = await this.cargaCatalogo(81,tipoPredioFlag);
        this.cubVentanas = await this.cargaCatalogo(40,tipoPredioFlag);
        this.closets = await this.cargaCatalogo(92,tipoPredioFlag);
        this.acabadosVivienda = await this.cargaCatalogo(33,tipoPredioFlag);

        this.instalacionesSanitarias = await this.cargaCatalogo(58,tipoPredioFlag);
        this.banios = await this.cargaCatalogo(93,tipoPredioFlag);
        this.instalacionesElectricas = await this.cargaCatalogo(57,tipoPredioFlag); 

        
        console.log('✅ Catálogos cargados según tipo de predio:', tipoPredioFlag === 0 ? 'Urbano' : 'Rural');
      } catch (error) {
        console.error('❌ Error al obtener los catálogos:', error);
        console.error('Detalles del error:', error.message);
      }
    },

    async guardar() {
      console.log('Guardando...');
      try {
        this.form.permiso_construccion = this.form.permiso_construccion === 'SI';
        const nuevoBloque = {
          id_predio: this.idPredio,
          cod_uni: this.form.cod_uni,
          cod_bloq: this.form.cod_bloq,
          cod_piso: this.form.cod_piso,
          id_tipo_piso: this.form.id_tipo_piso,
          cuen: this.form.cuen || null,
          id_condicion_fisica: this.form.id_condicion_fisica || null,
          id_estado_conservacion: this.form.id_estado_conservacion || null,
          id_condicion_patrimonial: this.form.id_condicion_patrimonial || null,
          id_valor_cultural: this.form.id_valor_cultural || null,
          anio_construccion: this.form.anio_construccion,
          anio_restauracion: this.form.anio_restauracion || null,
          area_construida: this.form.area_construida || null,
          id_ocupacion: this.form.id_ocupacion || null,
          id_estructura: this.form.id_estructura || null,
          id_columnas: this.form.id_columnas || null,
          id_vigas: this.form.id_vigas || null,
          id_entrepisos: this.form.id_entrepisos || null,
          id_contrapiso: this.form.id_contrapiso || null,
          id_paredes: this.form.id_paredes || null,
          id_escaleras: this.form.id_escaleras || null,
          id_cubierta: this.form.id_cubierta || null,
          id_pisos: this.form.id_pisos || null,
          id_revestimiento_cubierta: this.form.id_revestimiento_cubierta || null,
          id_acabados_vivienda: this.form.id_acabados_vivienda || null,
          id_revestimiento_pisos: this.form.id_revestimiento_pisos || null,
          id_revestimiento_paredes: this.form.id_revestimiento_paredes || null,
          id_revestimiento_escaleras: this.form.id_revestimiento_escaleras || null,
          id_tumbado: this.form.id_tumbado || null,
          id_revestimiento_acabados: this.form.id_revestimiento_acabados || null,
          id_puertas: this.form.id_puertas || null,
          id_ventanas: this.form.id_ventanas || null,
          id_marco_ventanas: this.form.id_marco_ventanas || null,
          id_vidrios: this.form.id_vidrios || null,
          id_closets: this.form.id_closets || null,
          id_instalaciones_sanitarias: this.form.id_instalaciones_sanitarias || null,
          id_banios: this.form.id_banios || null,
          id_instalaciones_electricas: this.form.id_instalaciones_electricas || null,
          permiso_construccion: this.form.permiso_construccion || null          
        };
        console.log('Datos a guardar:', nuevoBloque);        
        const response = await axios.post(`${API_BASE_URL}/inserta_bloque`, nuevoBloque);
        this.idBloque = response.data.id_bloques;
        console.log('Respuesta del servidor:', this.idBloque);        
        this.snackbarOk = 'Bloque guardado con éxito';
        this.snackbarOkPush = true;
        
        // 🏗️ Emitir evento y actualizar contador para reactividad
        this.emitBloquesUpdated();
        this.incrementBloquesCount();
      } catch (error) {
        console.error('Error al guardar el bloque:', error);        
        this.snackbarError = 'Error al guardar el bloque';
        this.snackbarErrorPush = true;    

      }
    },

    async actualizar() {

      console.log('ID DEL PREDIO:', this.getIdPredio);
      console.log('ID DEL BLOQUE:', this.getIdBloque);
      try {      
        this.form.permiso_construccion = this.form.permiso_construccion === 'SI';
        const bloqueActualizado = {
          id_predio: this.getIdPredio,
          cod_uni: this.form.cod_uni,
          cod_bloq: this.form.cod_bloq,
          cod_piso: this.form.cod_piso,
          id_tipo_piso: this.form.id_tipo_piso,
          cuen: this.form.cuen || null,
          id_condicion_fisica: this.form.id_condicion_fisica  || null,
          id_estado_conservacion: this.form.id_estado_conservacion || null,
          id_condicion_patrimonial: this.form.id_condicion_patrimonial || null,
          id_valor_cultural: this.form.id_valor_cultural || null,
          anio_construccion: this.form.anio_construccion || null,
          anio_restauracion: this.form.anio_restauracion || null,
          area_construida: this.form.area_construida || null,
          id_ocupacion: this.form.id_ocupacion || null,
          id_estructura: this.form.id_estructura || null,
          id_columnas: this.form.id_columnas || null,
          id_vigas: this.form.id_vigas || null,
          id_entrepisos: this.form.id_entrepisos || null,
          id_contrapiso: this.form.id_contrapiso || null,
          id_paredes: this.form.id_paredes || null,
          id_escaleras: this.form.id_escaleras || null,
          id_cubierta: this.form.id_cubierta || null,
          id_pisos: this.form.id_pisos || null,
          id_revestimiento_cubierta: this.form.id_revestimiento_cubierta || null,
          id_acabados_vivienda: this.form.id_acabados_vivienda || null,
          id_revestimiento_pisos: this.form.id_revestimiento_pisos || null,
          id_revestimiento_paredes: this.form.id_revestimiento_paredes || null,
          id_revestimiento_escaleras: this.form.id_revestimiento_escaleras || null,
          id_tumbado: this.form.id_tumbado || null,
          id_revestimiento_acabados: this.form.id_revestimiento_acabados || null,
          id_puertas: this.form.id_puertas || null,
          id_ventanas: this.form.id_ventanas || null,
          id_marco_ventanas: this.form.id_marco_ventanas || null,
          id_vidrios: this.form.id_vidrios || null,
          id_closets: this.form.id_closets || null,
          id_instalaciones_sanitarias: this.form.id_instalaciones_sanitarias || null,
          id_banios: this.form.id_banios || null,
          id_instalaciones_electricas: this.form.id_instalaciones_electricas || null,

          permiso_construccion: this.form.permiso_construccion || null 
        };
        console.log('Datos a actualizar:', bloqueActualizado);
        const response = await axios.put(`${API_BASE_URL}/actualiza_bloque_by_idBloque/${this.getIdBloque}`, bloqueActualizado);
        console.log('Respuesta del servidor:', response.data);        
        this.snackbarOk = 'Bloque actualizado con éxito';
        this.snackbarOkPush = true;
        
        //Emitir evento y actualizar contador para reactividad
        this.emitBloquesUpdated();
        this.incrementBloquesCount();
      } catch (error) {
        console.error('Error al actualizar el bloque:', error);        
        this.snackbarError = 'Error al actualizar el bloque';
        this.snackbarErrorPush = true;
      }
    },

    async cargaBloques(idBloque) {
      console.log('ID DEL BLOQUE:', idBloque);
      try {
        const response = await axios.get(`${API_BASE_URL}/bloque_by_idBloque/${idBloque}`);
        console.log('Datos recuperados del servidor:', response.data);
        this.form = { ...this.form, ...response.data };
        if (response.data.id_predio) {
          this.idPredio = response.data.id_predio;
          this.$store.dispatch('updateIdPredio', response.data.id_predio);
          console.log('Asignado ID Predio desde el bloque:', this.idPredio);
          // Llamar a la API catastro_predio_by_id y guardar el tipo de predio en Vuex
          const predioResp = await axios.get(`${API_BASE_URL}/catastro_predio_by_id/${response.data.id_predio}`);
          const predio = predioResp.data;
          if (predio && predio.id_tipo_predio !== undefined) {
            this.$store.commit('setTipoPredio', predio.id_tipo_predio);
            console.log('Tipo de predio recuperado y almacenado en Vuex:', predio.id_tipo_predio);
          }

          // Cargar área del bloque automáticamente después de cargar los datos
          console.log('Iniciando carga automática del área del bloque...');
          await this.cargarAreaBloqueAutomatico(predio.clave_catastral);
        }
      } catch (error) {
        console.error('Error al recuperar los datos del bloque:', error);
        this.snackbarError = 'Error al recuperar los datos del bloque';
        this.snackbarErrorPush = true;
      }
    },

    async cargarAreaBloqueAutomatico(claveCatastral) {      
      // Validar que tenemos todos los parámetros necesarios
      // Nota: cod_uni puede ser 0, por lo que debemos validarlo con typeof para evitar falsy
      if (!claveCatastral || !this.form.cod_bloq || !this.form.cod_piso || 
          (typeof this.form.cod_uni !== 'number' && typeof this.form.cod_uni !== 'string') || !this.form.id_tipo_piso) {
        console.warn('⚠️ Faltan parámetros para consultar el área del bloque automáticamente');
        console.log('Parámetros faltantes:');
        if (!claveCatastral) console.log('  - Clave Catastral');
        if (!this.form.cod_bloq) console.log('  - cod_bloq');
        if (!this.form.cod_piso) console.log('  - cod_piso');
        if (typeof this.form.cod_uni !== 'number' && typeof this.form.cod_uni !== 'string') console.log('  - cod_uni');
        if (!this.form.id_tipo_piso) console.log('  - id_tipo_piso');
        
        // Si ya tenemos un área, no mostrar error
        if (!this.form.area_construida) {
          this.snackbarError = 'No se puede calcular el área: faltan datos del bloque';
          this.snackbarErrorPush = true;
        }
        return;
      }

      try {
        console.log('🔍 Consultando área para bloque con parámetros:');
        console.log(`  - Clave Catastral: ${claveCatastral}`);
        console.log(`  - Código Bloque: ${this.form.cod_bloq}`);
        console.log(`  - Código Piso: ${this.form.cod_piso}`);
        console.log(`  - Código Unidad: ${this.form.cod_uni}`);
        console.log(`  - Tipo Piso: ${this.form.id_tipo_piso}`);
        
        const tipoZona = this.getTipoPredio;
        
        // Ajustar id_tipo_piso restando 4
        const tipoPixoAjustado = this.form.id_tipo_piso - 4;        
        const urlCompleta = `${API_BASE_URL}/geo_consultas/area_bloque/${claveCatastral}/${this.form.cod_bloq}/${this.form.cod_piso}/${this.form.cod_uni}/${tipoPixoAjustado}/${tipoZona}`;
        console.log('📡 URL de consulta:', urlCompleta);
        
        const areaResponse = await axios.get(urlCompleta);      

        if (areaResponse.data && (typeof areaResponse.data === 'number' || (typeof areaResponse.data === 'string' && !isNaN(parseFloat(areaResponse.data))))) {
          // Convertir a número si es string
          const areaValue = typeof areaResponse.data === 'number' ? areaResponse.data : parseFloat(areaResponse.data);
          this.form.area_construida = areaValue;
          console.log('✅ Área del bloque cargada automáticamente:', areaValue);
          
          // Mostrar mensaje con el área cargada automáticamente
          this.snackbarOk = `Área del bloque cargada: ${areaValue.toFixed(2)} m²`;
          this.snackbarOkPush = true;
        } else {
          console.warn('⚠️ No se encontró área para este bloque o la respuesta no es válida');
          console.log('Respuesta recibida:', areaResponse.data);
          
          if (!this.form.area_construida) {
            this.snackbarError = 'No se encontró área para este bloque en la capa gráfica';
            this.snackbarErrorPush = true;
          }
        }

      } catch (error) {
        console.error('❌ Error al obtener el área del bloque automáticamente:', error);
        if (error.response) {
          console.error('Detalles del error:');
          console.error('  - Status:', error.response.status);
          console.error('  - Data:', error.response.data);
          console.error('  - Headers:', error.response.headers);
        }
        if (error.response?.status === 404) {
          console.warn('⚠️ No se encontró área para este bloque en la base de datos (404)');
          this.snackbarError = 'No se encontró geometría para este bloque en la capa gráfica';
          this.snackbarErrorPush = true;
        } else {
          this.snackbarError = 'Error al obtener el área del bloque';
          this.snackbarErrorPush = true;
        }
      }      
    },

    async eliminar() {
      console.log('Eliminando bloques:', this.idBloque);
      if (!this.idBloque) {
        this.snackbarError = 'No hay un bloques seleccionado para eliminar';
        this.snackbarErrorPush = true;
        return;
      }
      try {
        await axios.post(`${API_BASE_URL}/elimina_bloque_by_id/${this.idBloque}`);
        this.snackbarOk = 'bloques eliminado exitosamente';
        this.snackbarOkPush = true;
        this.limpiarCampos(); 
        
        //Emitir evento y actualizar contador para reactividad
        this.emitBloquesUpdated();
        this.incrementBloquesCount(); 
      } catch (error) {
        console.error('Error al eliminar el bloques:', error);
        this.snackbarError = 'Error al eliminar el bloques';
        this.snackbarErrorPush = true;
      }
    },    

    async limpiarCampos () {
      this.form = {
        id_bloque: null,
        cod_uni: '',
        cod_bloq: '',        
        id_tipo_piso: null,
        cod_piso: '',
        cuen: '',        
        id_condicion_fisica: null,
        id_estado_conservacion: null,
        id_condicion_patrimonial: null,
        id_valor_cultural: null,
        anio_construccion: '',
        anio_restauracion: '', 
        area_construida: '',
        id_ocupacion: null,
        id_estructura: null,
        id_columnas: null,
        id_vigas: null,
        id_entrepisos: null,
        id_contrapiso: null,
        id_paredes: null,
        id_escaleras: null,
        id_cubierta: null,
        id_pisos: null,
        id_revestimiento_cubierta: null,
        id_acabados_vivienda: null,
        id_revestimiento_pisos: null,
        id_revestimiento_paredes: null,
        id_revestimiento_escaleras: null,
        id_tumbado: null,
        id_revestimiento_acabados: null,
        id_puertas: null,
        id_ventanas: null,
        id_marco_ventanas: null,
        id_vidrios: null,
        id_closets: null,
        id_instalaciones_sanitarias: null,
        id_banios: null,
        id_instalaciones_electricas: null,
        permiso_construccion: ''
      };
    },

    nuevo() {
      this.limpiarCampos();
      this.idBloque = null;
    },
     
  },

  beforeDestroy() {
    // Limpiar timeout al destruir el componente
    if (this.areaCalculationTimeout) {
      clearTimeout(this.areaCalculationTimeout);
    }
  }
};
</script>
  
<style scoped>

.container {
  background-color: #114358;
}

.urbano-container {
  background-color: #114358;
}
.rural-container {
  background-color: #668A4C;
}

.btn_app {
  margin-bottom: 10px;
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

.centered-title {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  text-align: center;
  font-size: 1rem;
}
.urbano-title {
  background-color: #276E90;
  color: #F1ECE7;
  font-weight: bold;
}
.rural-title {
  background-color: #4C7031;
  color: #F1ECE7;
  font-weight: bold;
}

.titulo-pantalla {
  font-size: 2rem;
  color: #ffffff;
}

.v-snackbar {
  border-radius: 12px;
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
</style>