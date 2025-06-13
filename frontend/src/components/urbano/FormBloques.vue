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


      <!-- Primer Bloque -->  
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

          </v-row>
        </v-card-text>
      </v-card>
      
      <!-- Segundo Bloque -->
       <v-card class="mb-3" :class="['block-color', tipoClaseBlock]">
        <v-card-title class="centered-title"> DATOS DESCRIPTIVOS DEL BLOQUE CONSTRUCTIVO - PISO</v-card-title>
        <v-card-text>
          <v-row>

            <v-col cols="12" sm="6" md="2">                
              <v-select 
                :items="condicionFisica" 
                label="Condición Fisica" 
                v-model="form.id_condicion_fisica" 
                item-text="title" 
                item-value="id"
                
              ></v-select>
            </v-col>
            
            <v-col cols="12" sm="6" md="2">                
              <v-select 
                :items="estadoConservacion" 
                label="Estado de Conservación" 
                v-model="form.id_estado_conservacion" 
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

            <v-col cols="12" sm="6" md="2">
              <v-text-field label="Año Construcción *" 
                v-model="form.anio_construccion" 
                type="number"
                :rules="[v => !!v || 'Este campo es obligatorio']"
                required 
                ></v-text-field>
            </v-col>

            <v-col cols="12" sm="6" md="2">
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

          </v-row>
        </v-card-text>
      </v-card>

      <!-- Tercer Bloque -->
       <v-card class="mb-3" :class="['block-color', tipoClaseBlock]">
        <v-card-title></v-card-title>
        <v-card-text>
          <v-row>

            <v-col cols="12" sm="6" md="4">                
              <v-select 
                :items="ocupacionBloque" 
                label="Ocupación del Bloque o Piso" 
                v-model="form.id_ocupacion" 
                item-text="title" 
                item-value="id"
                 
              ></v-select>
            </v-col>

          </v-row>
        </v-card-text>
      </v-card>

      <!-- Cuarto Bloque -->
       <v-card class="mb-3" :class="['block-color', tipoClaseBlock]">
        <v-card-title class="centered-title">ELEMENTOS CONSTRUCTIVOS</v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="12" sm="6" md="3">                
              <v-select 
                :items="estructura" 
                label="Estructura" 
                v-model="form.id_estructura" 
                item-text="title" 
                item-value="id"                 
              ></v-select>
            </v-col>
            
            <v-col cols="12" sm="6" md="3">                
              <v-select 
                :items="paredes" 
                label="Paredes" 
                v-model="form.id_paredes" 
                item-text="title" 
                item-value="id"                
              ></v-select>
            </v-col>

            <v-col cols="12" sm="6" md="3">                
              <v-select 
                :items="cubierta" 
                label="Cubierta" 
                v-model="form.id_cubierta" 
                item-text="title" 
                item-value="id"                
              ></v-select>
            </v-col>

            <v-col cols="12" sm="6" md="3">                
              <v-select 
                :items="acabadosVivienda" 
                label="Acabados Vivienda" 
                v-model="form.id_acabados_vivienda" 
                item-text="title" 
                item-value="id"                
              ></v-select>
            </v-col>

          </v-row>
        </v-card-text>
      </v-card>

      <!-- Quinto Bloque -->
       <v-card class="mb-3" :class="['block-color', tipoClaseBlock]">
        <v-card-title class="centered-title">ACABADOS EXTERIORES</v-card-title>
        <v-card-text>
          <v-row>

            <v-col cols="12" sm="6" md="3">                
              <v-select 
                :items="revParedes" 
                label="Revestimiento Paredes" 
                v-model="form.id_revestimiento_paredes" 
                item-text="title" 
                item-value="id"                
              ></v-select>
            </v-col>

            <v-col cols="12" sm="6" md="3">                
              <v-select 
                :items="revCubierta" 
                label="Revestimiento Cubierta" 
                v-model="form.id_revestimiento_cubierta" 
                item-text="title" 
                item-value="id"                
              ></v-select>
            </v-col>

            <v-col cols="12" sm="6" md="3">                
              <v-select 
                :items="ventanas" 
                label="Marco Ventanas" 
                v-model="form.id_marco_ventanas" 
                item-text="title" 
                item-value="id"                
              ></v-select>
            </v-col>

            <v-col cols="12" sm="6" md="3">                
              <v-select 
                :items="vidrios" 
                label="Vidrios" 
                v-model="form.id_vidrios" 
                item-text="title" 
                item-value="id"                
              ></v-select>
            </v-col>

            <v-col cols="12" sm="6" md="3">                
              <v-select 
                :items="puertas" 
                label="Puertas" 
                v-model="form.id_puertas" 
                item-text="title" 
                item-value="id"                
              ></v-select>
            </v-col>

          </v-row>
        </v-card-text>
      </v-card>

      <!-- Sexto Bloque -->
       <v-card class="mb-3" :class="['block-color', tipoClaseBlock]">
        <v-card-title class="centered-title">PERMISO DE CONSTRUCCIÓN</v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="12" sm="6" md="6">
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
import { mapGetters } from 'vuex';
import useUserRoles from '@/composables/useUserRoles';
import API_BASE_URL from '@/config/apiConfig';

export default {
  name: 'TabBloques',
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
        anio_construccion: '',
        anio_restauracion: '', 
        area_construida: '',
        id_ocupacion: null,
        id_estructura: null,
        id_paredes: null,
        id_cubierta: null,
        id_acabados_vivienda: null,
        id_revestimiento_paredes: null,
        id_revestimiento_cubierta: null,
        id_marco_ventanas: null,
        id_vidrios: null,
        id_puertas: null,        
        permiso_construccion: ''
      },

      // Listados
      tipoPiso: [],      
      condicionFisica: [],
      estadoConservacion: [],        
      condicionPatrimonial: [],   
      ocupacionBloque: [],      
      estructura: [],
      paredes: [],
      cubierta: [],
      acabadosVivienda: [],
      revParedes: [],        
      revCubierta: [],
      ventanas: [],
      vidrios: [],
      puertas: [],
      valida: [ 'SI' , 'NO' ],
      idBloque: null,
      idPredio: null,
      snackbarErrorPush: false,
      snackbarOkPush: false,
      snackbarOk: '',
      snackbarError: ''   
    };
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
    }
  },

  methods: {
  
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
      const tipoPredioFlag = this.getTipoPredio === 1 ? 0 : 2;
      try {
        this.tipoPiso = await this.cargaCatalogo(3,0);         
        this.condicionFisica = await this.cargaCatalogo(99,tipoPredioFlag);
        this.estadoConservacion = await this.cargaCatalogo(27,tipoPredioFlag); 
        this.ocupacionBloque = await this.cargaCatalogo(30,tipoPredioFlag);
        this.condicionPatrimonial = await this.cargaCatalogo(29,tipoPredioFlag);
        this.estructura = await this.cargaCatalogo(35,tipoPredioFlag); 
        this.paredes = await this.cargaCatalogo(36,tipoPredioFlag); 
        this.cubierta = await this.cargaCatalogo(37,tipoPredioFlag);
        this.acabadosVivienda = await this.cargaCatalogo(33,tipoPredioFlag);
        this.revParedes = await this.cargaCatalogo(89,tipoPredioFlag);
        this.revCubierta = await this.cargaCatalogo(90,tipoPredioFlag);
        this.ventanas = await this.cargaCatalogo(40,tipoPredioFlag);
        this.vidrios = await this.cargaCatalogo(42,tipoPredioFlag);
        this.puertas = await this.cargaCatalogo(41,tipoPredioFlag);
      } catch (error) {
        console.error('Error al obtener los catálogos:', error);
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
          anio_construccion: this.form.anio_construccion,
          anio_restauracion: this.form.anio_restauracion || null,
          area_construida: this.form.area_construida || null,
          id_ocupacion: this.form.id_ocupacion || null,
          id_estructura: this.form.id_estructura || null,
          id_paredes: this.form.id_paredes || null,
          id_cubierta: this.form.id_cubierta || null,
          id_acabados_vivienda: this.form.id_acabados_vivienda || null,
          id_revestimiento_paredes: this.form.id_revestimiento_paredes|| null,
          id_revestimiento_cubierta: this.form.id_revestimiento_cubierta || null,
          id_marco_ventanas: this.form.id_marco_ventanas || null,
          id_vidrios: this.form.id_vidrios || null,
          id_puertas: this.form.id_puertas || null,
          permiso_construccion: this.form.permiso_construccion || null          
        };
        console.log('Datos a guardar:', nuevoBloque);        
        const response = await axios.post(`${API_BASE_URL}/inserta_bloque`, nuevoBloque);
        this.idBloque = response.data.id_bloques;
        console.log('Respuesta del servidor:', this.idBloque);        
        this.snackbarOk = 'Bloque guardado con éxito';
        this.snackbarOkPush = true;
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
          anio_construccion: this.form.anio_construccion || null,
          anio_restauracion: this.form.anio_restauracion || null,
          area_construida: this.form.area_construida || null,
          id_ocupacion: this.form.id_ocupacion || null,
          id_estructura: this.form.id_estructura || null,
          id_paredes: this.form.id_paredes || null,
          id_cubierta: this.form.id_cubierta || null,
          id_acabados_vivienda: this.form.id_acabados_vivienda || null,
          id_revestimiento_paredes: this.form.id_revestimiento_paredes || null,
          id_revestimiento_cubierta: this.form.id_revestimiento_cubierta || null,
          id_marco_ventanas: this.form.id_marco_ventanas || null,
          id_vidrios: this.form.id_vidrios || null,
          id_puertas: this.form.id_puertas || null,
          permiso_construccion: this.form.permiso_construccion || null 
        };
        console.log('Datos a actualizar:', bloqueActualizado);
        const response = await axios.put(`${API_BASE_URL}/actualiza_bloque_by_idBloque/${this.getIdBloque}`, bloqueActualizado);
        console.log('Respuesta del servidor:', response.data);        
        this.snackbarOk = 'Bloque actualizado con éxito';
        this.snackbarOkPush = true;
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
        }
      } catch (error) {
        console.error('Error al recuperar los datos del bloque:', error);
        this.snackbarError = 'Error al recuperar los datos del bloque';
        this.snackbarErrorPush = true;
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
        anio_construccion: '',
        anio_restauracion: '', 
        area_construida: '',
        id_ocupacion: null,
        id_estructura: null,
        id_paredes: null,
        id_cubierta: null,
        id_acabados_vivienda: null,
        id_revestimiento_paredes: null,
        id_revestimiento_cubierta: null,
        id_marco_ventanas: null,
        id_vidrios: null,
        id_puertas: null,        
        permiso_construccion: ''
      };
    },

    nuevo() {
      this.limpiarCampos();
      this.idBloque = null;
    },
     
  },
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
</style>