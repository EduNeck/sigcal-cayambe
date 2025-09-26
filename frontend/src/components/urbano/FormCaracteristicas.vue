<template>
  <v-container :class="['container', tipoClaseContainer]">

    <v-col cols="auto" class="d-flex justify-center">
      <h2 class="titulo-pantalla">Caracteristicas del predio</h2>
    </v-col>
    <v-col cols="auto" class="d-flex justify-center">            
      <v-btn :class="['btn_app', tipoClaseButton, 'mx-2']" append-icon="mdi-pencil" @click="actualiza" v-if="canEdit">Actualizar</v-btn>
    </v-col>     

    <!-- Primer Bloque -->
    <v-card class="mb-3 fill-width" :class="['block-color', tipoClaseBlock]">
      <v-card-title class="centered-title">USO DEL PREDIO</v-card-title>
      <v-card-text>
        <v-row>
          <v-col cols="12" sm="6" md="6">
            <v-select 
              :items="usoPredio" 
              label="Uso del Predio" 
              v-model="form.id_uso_predio" 
              item-text="title" 
              item-value="id" 
              placeholder="Seleccione"
            ></v-select>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
    <!-- Segundo Bloque -->
    <v-card class="mb-3 fill-width" :class="['block-color', tipoClaseBlock]">
      <v-card-title class="centered-title">CONFLICTO</v-card-title>
      <v-card-text>
        <v-row>
          <v-col cols="12" sm="6" md="2">
            <v-select 
              :items="valida" 
              label="Lote en Conflicto" 
              v-model="form.lote_conflicto" 
              item-text="title" 
              item-value="id" 
              placeholder="Seleccione"
            ></v-select>
          </v-col>
          <v-col cols="12" sm="6" md="4">
            <v-text-field 
              label="Observaciones del Conflicto" 
              v-model="form.obs_conflicto" 
            ></v-text-field>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
    <!-- Tercer Bloque -->
    <v-card class="mb-3 fill-width" :class="['block-color', tipoClaseBlock]">
      <v-card-title class="centered-title">DESCRIPCIÓN DEL PREDIO</v-card-title>
      <v-card-text>
        <v-row>
          <v-col cols="12" sm="6" md="2">
            <v-select 
              :items="formaLote" 
              label="Forma Lote" 
              v-model="form.id_forma_lote" 
              item-text="title" 
              item-value="id" 
              placeholder="Seleccione"
            ></v-select>
          </v-col>
          <v-col cols="12" sm="6" md="2">
            <v-select 
              :items="topografia" 
              label="Topografía" 
              v-model="form.id_topografia" 
              item-text="title" 
              item-value="id" 
              placeholder="Seleccione"
            ></v-select>
          </v-col>
          <v-col cols="12" sm="6" md="2">
            <v-select 
              :items="localizacionManzana" 
              label="Localización Manzana" 
              v-model="form.id_localizacion_manzana" 
              item-text="title" 
              item-value="id" 
              placeholder="Seleccione"
            ></v-select>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
    <!-- Cuarto Bloque -->
    <v-card class="mb-3 fill-width" :class="['block-color', tipoClaseBlock]">
      <v-card-title class="centered-title">SERVICIOS BÁSICOS</v-card-title>
      <v-card-text>
        <v-row>
          <v-col cols="12" sm="6" md="2">
            <v-select 
              :items="agua" 
              label="Agua" 
              v-model="form.id_agua" 
              item-text="title" 
              item-value="id" 
              placeholder="Seleccione"
            ></v-select>
          </v-col>
          <v-col cols="12" sm="6" md="2">
            <v-select 
              :items="sanitarias" 
              label="Sanitarias" 
              v-model="form.id_sanitarias" 
              item-text="title" 
              item-value="id" 
              placeholder="Seleccione"
            ></v-select>
          </v-col>
          <v-col cols="12" sm="6" md="2">
            <v-select 
              :items="energiaElectrica" 
              label="Energía Eléctrica" 
              v-model="form.id_energia_electrica" 
              item-text="title" 
              item-value="id" 
              placeholder="Seleccione"
            ></v-select>
          </v-col>
          <v-col cols="12" sm="6" md="2">
            <v-select 
              :items="valida" 
              label="Aceras" 
              v-model="form.aceras" 
              item-text="title" 
              item-value="id" 
              placeholder="Seleccione"
            ></v-select>
          </v-col>
          <v-col cols="12" sm="6" md="2">
            <v-select 
              :items="valida" 
              label="Bordillos" 
              v-model="form.bordillos" 
              item-text="title" 
              item-value="id" 
              placeholder="Seleccione"
            ></v-select>
          </v-col>
          <v-col cols="12" sm="6" md="2">
            <v-select 
              :items="valida" 
              label="Aseo de Calles" 
              v-model="form.aseo_calles" 
              item-text="title" 
              item-value="id" 
              placeholder="Seleccione"
            ></v-select>
          </v-col>
          <v-col cols="12" sm="6" md="2">
            <v-select 
              :items="valida" 
              label="Recolección de Basura" 
              v-model="form.recoleccion_basura" 
              item-text="title" 
              item-value="id" 
              placeholder="Seleccione"
            ></v-select>
          </v-col>
          <v-col cols="12" sm="6" md="2">
            <v-select 
              :items="eliminacionBasura" 
              label="Eliminación de Basura" 
              v-model="form.id_eliminacion_basura" 
              item-text="title" 
              item-value="id" 
              placeholder="Seleccione"
            ></v-select>
          </v-col>
          <v-col cols="12" sm="6" md="2">
            <v-select 
              :items="valida" 
              label="Transporte Urbano" 
              v-model="form.transporte_urbano" 
              item-text="title" 
              item-value="id" 
              placeholder="Seleccione"
            ></v-select>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
    <!-- Bloque Redes Públicas en la Vía -->
    <v-card class="mb-3 fill-width" :class="['block-color', tipoClaseBlock]">
      <v-card-title class="centered-title">REDES PÚBLICAS EN LA VÍA</v-card-title>
      <v-card-text>
        <v-row>
          <v-col cols="12" sm="6" md="3">
            <v-select 
              :items="valida" 
              label="Agua Potable en la Vía" 
              v-model="form.agua_potable_via" 
              item-text="title" 
              item-value="id" 
              placeholder="Seleccione"
            ></v-select>
          </v-col>
          <v-col cols="12" sm="6" md="3">
            <v-select 
              :items="valida" 
              label="Alcantarillado en la Vía" 
              v-model="form.alcantarillado_via" 
              item-text="title" 
              item-value="id" 
              placeholder="Seleccione"
            ></v-select>
          </v-col>
          <v-col cols="12" sm="6" md="3">
            <v-select 
              :items="valida" 
              label="Energía Eléctrica en la Vía" 
              v-model="form.energia_electrica_via" 
              item-text="title" 
              item-value="id" 
              placeholder="Seleccione"
            ></v-select>
          </v-col>
          <v-col cols="12" sm="6" md="3">
            <v-select 
              :items="valida" 
              label="Alumbrado Público" 
              v-model="form.alumbrado" 
              item-text="title" 
              item-value="id" 
              placeholder="Seleccione"
            ></v-select>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
    <!-- Quinto Bloque -->    
    <v-card class="mb-3 fill-width" :class="['block-color', tipoClaseBlock]">
      <v-card-title class="centered-title">TELECOMUNICACIONES</v-card-title>
      <v-card-text>
        <v-row>
          <v-col cols="12" sm="6" md="2">
            <v-select 
              :items="valida" 
              label="Telefonía Fija" 
              v-model="form.telefonia_fija" 
              item-text="title" 
              item-value="id" 
              placeholder="Seleccione"
            ></v-select>
          </v-col>
          <v-col cols="12" sm="6" md="2">
            <v-select 
              :items="valida" 
              label="Telefonía Satelital" 
              v-model="form.telefonia_satelital" 
              item-text="title" 
              item-value="id" 
              placeholder="Seleccione"
            ></v-select>
          </v-col>
          <v-col cols="12" sm="6" md="2">
            <v-select 
              :items="valida" 
              label="Internet" 
              v-model="form.internet" 
              item-text="title" 
              item-value="id" 
              placeholder="Seleccione"
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
import { mapGetters } from 'vuex';
import useUserRoles from '@/composables/useUserRoles';
import API_BASE_URL from '@/config/apiConfig';

export default {
  name: 'TabCaracteristicas',
  data() {
    return {
      form: {
        id_uso_predio: null,
        lote_conflicto: null,
        obs_conflicto: '',
        id_forma_lote: null,
        id_topografia: null,
        id_localizacion_manzana: null,
        permiso_construccion: null,
        num_permiso_construccion: '',
        id_agua: null,
        id_sanitarias: null,
        id_energia_electrica: null,
        aceras: null,
        bordillos: null,
        alumbrado: null,
        aseo_calles: null,
        recoleccion_basura: null,
        id_eliminacion_basura: null,
        transporte_urbano: null,
        agua_potable_via: null,
        alcantarillado_via: null,
        energia_electrica_via: null,
        telefonia_fija: null,
        telefonia_satelital: null,
        internet: null,
      },
      idPredio: null,
      usoPredio: [],
      valida: ['SI', 'NO'],
      formaLote: [],
      topografia: [],
      localizacionManzana: [],
      agua: [],
      sanitarias: [],
      energiaElectrica: [],
      eliminacionBasura: [],
      snackbarErrorPush: false,
      snackbarError: '',
      snackbarOkPush: false,
      snackbarOk: ''
    }
  },

  computed: {
    ...mapGetters(['getIdPredio', 'getTipoPredio', 'isConsultaPrimario']),
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
    try {
      console.log('Componente montado');
      console.log('ID DEL PREDIO:', this.getIdPredio);
      if (this.getIdPredio) {
        await this.cargaCaracteristicas();
      }
    } catch (error) {
      console.error('Error al montar el componente:', error);
    }

    // Monta el Catalogo
    try {
      console.log('Componente Catalogo montado');
      this.usoPredio = await this.cargaCatalogo(9,0);
      this.formaLote = await this.cargaCatalogo(10,0);
      this.topografia = await this.cargaCatalogo(61,0);
      this.localizacionManzana = await this.cargaCatalogo(11,0);
      this.agua = await this.cargaCatalogo(16,0);
      this.sanitarias = await this.cargaCatalogo(17,0);
      this.energiaElectrica = await this.cargaCatalogo(18,0);
      this.eliminacionBasura = await this.cargaCatalogo(19,0);
    } catch (error) {
      console.error('Error al montar los componentes:', error);
    }
  },

  methods: {
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

    // Recuperar datos del predio
    async cargaCaracteristicas() {
      try {
        console.log('Recuperando características del predio...', this.getIdPredio);
        const response = await axios.get(`${API_BASE_URL}/catastro_predio_by_id/${this.getIdPredio}`);
        const data = response.data;
        this.form.id_uso_predio = data.id_uso_predio;
        this.form.lote_conflicto = data.lote_conflicto ? 'SI' : 'NO';
        this.form.obs_conflicto = data.obs_conflicto;
        this.form.id_forma_lote = data.id_forma_lote;
        this.form.id_topografia = data.id_topografia;
        this.form.id_localizacion_manzana = data.id_localizacion_manzana;
        this.form.permiso_construccion = data.permiso_construccion ? 'SI' : 'NO';
        this.form.num_permiso_construccion = data.num_permiso_construccion;
        this.form.id_agua = data.id_agua;
        this.form.id_sanitarias = data.id_sanitarias;
        this.form.id_energia_electrica = data.id_energia_electrica;
        this.form.aceras = data.aceras ? 'SI' : 'NO';
        this.form.bordillos = data.bordillos ? 'SI' : 'NO';
        this.form.alumbrado = data.alumbrado ? 'SI' : 'NO';
        this.form.aseo_calles = data.aseo_calles ? 'SI' : 'NO';
        this.form.recoleccion_basura = data.recoleccion_basura ? 'SI' : 'NO';
        this.form.id_eliminacion_basura = data.id_eliminacion_basura;
        this.form.transporte_urbano = data.transporte_urbano ? 'SI' : 'NO';
        this.form.agua_potable_via = data.agua_potable_via ? 'SI' : 'NO';
        this.form.alcantarillado_via = data.alcantarillado_via ? 'SI' : 'NO';
        this.form.energia_electrica_via = data.energia_electrica_via ? 'SI' : 'NO';
        this.form.telefonia_fija = data.telefonia_fija ? 'SI' : 'NO';
        this.form.telefonia_satelital = data.telefonia_satelital ? 'SI' : 'NO';
        this.form.internet = data.internet ? 'SI' : 'NO';
        console.log('Datos del predio recuperados:', data);
      } catch (error) {
        console.error('Error al recuperar los datos del predio:', error);
      }
    },

    // Actualiza Características del Predio
    async actualiza() {
      console.log('Actualizando características del predio...');

      // Helper para convertir a null si es vacío
      const parseOrNull = v => (v === '' || v === undefined) ? null : v;

      const actualizaCaracteristicas = {
        id_uso_predio: parseOrNull(this.form.id_uso_predio),
        lote_conflicto: this.form.lote_conflicto === 'SI',
        obs_conflicto: parseOrNull(this.form.obs_conflicto),
        id_forma_lote: parseOrNull(this.form.id_forma_lote),
        id_topografia: parseOrNull(this.form.id_topografia),
        id_localizacion_manzana: parseOrNull(this.form.id_localizacion_manzana),
        permiso_construccion: this.form.permiso_construccion === 'SI',
        num_permiso_construccion: parseOrNull(this.form.num_permiso_construccion),
        id_agua: parseOrNull(this.form.id_agua),
        id_sanitarias: parseOrNull(this.form.id_sanitarias),
        id_energia_electrica: parseOrNull(this.form.id_energia_electrica),
        aceras: this.form.aceras === 'SI',
        bordillos: this.form.bordillos === 'SI',
        alumbrado: this.form.alumbrado === 'SI',
        aseo_calles: this.form.aseo_calles === 'SI',
        recoleccion_basura: this.form.recoleccion_basura === 'SI',
        id_eliminacion_basura: parseOrNull(this.form.id_eliminacion_basura),
        transporte_urbano: this.form.transporte_urbano === 'SI',
        agua_potable_via: this.form.agua_potable_via === 'SI',
        alcantarillado_via: this.form.alcantarillado_via === 'SI',
        energia_electrica_via: this.form.energia_electrica_via === 'SI',
        telefonia_fija: this.form.telefonia_fija === 'SI',
        telefonia_satelital: this.form.telefonia_satelital === 'SI',
        internet: this.form.internet === 'SI',
      };

      try {
        const response = await axios.put(`${API_BASE_URL}/catastro_actualiza_caracteristicas/${this.getIdPredio}`, actualizaCaracteristicas);
        console.log('Características actualizadas:', response.data);
        this.snackbarOk = 'Características actualizadas correctamente';
        this.snackbarOkPush = true;
        await this.cargaCaracteristicas(); // Recuperar los datos actualizados
      } catch (error) {
        console.error('Error al actualizar las características del predio:', error);
        this.snackbarError = 'Error al actualizar las características del predio';
        this.snackbarErrorPush = true;
      }
    },

    // Método para limpiar el formulario
    limpiarFormulario() {
      this.form = {
        id_uso_predio: null,
        lote_conflicto: null,
        obs_conflicto: '',
        id_forma_lote: null,
        id_topografia: null,
        id_localizacion_manzana: null,
        permiso_construccion: null,
        num_permiso_construccion: '',
        id_agua: null,
        id_sanitarias: null,
        id_energia_electrica: null,
        aceras: null,
        bordillos: null,
        alumbrado: null,
        aseo_calles: null,
        recoleccion_basura: null,
        id_eliminacion_basura: null,
        transporte_urbano: null,
        agua_potable_via: null,
        alcantarillado_via: null,
        energia_electrica_via: null,
        telefonia_fija: null,
        telefonia_satelital: null,
        internet: null,
      };      
    },

    nuevo() {
      this.limpiarFormulario();      
      this.snackbarOk = 'Campos limpiados';
      this.snackbarOkPush = true;
    },
  }
}
</script>

<style scoped>

.titulo-pantalla {
  font-size: 2rem;
  color: #ffffff;
}

.container {
  background-color: #114358;
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
  font-size: 1rem;
}

.block-color {
  background-color: #F1ECE7;
}

.fill-width {
  width: 100%;
}

/* Dinámicos */
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

</style>