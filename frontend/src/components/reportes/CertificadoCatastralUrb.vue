<template>

  <v-layout
      class="overflow-visible"
      style="height: 56px;"
    >
      <v-bottom-navigation        
        active
      >
      <v-btn 
        v-if="pdfGenerado" 
        @click="pdf">
        <v-icon>mdi-printer</v-icon>
        PDF
      </v-btn>
      <v-btn 
        v-if="!pdfGenerado" 
              
        @click="insertaCertificadoCatastral">
        <v-icon>mdi-content-save</v-icon>
        Generar
      </v-btn>
      <v-btn 
        @click="salir">
        <v-icon>mdi-close</v-icon>
        Salir
      </v-btn>
      </v-bottom-navigation>
  </v-layout>

  <v-container  class="pdf-wrapper" fluid>
    <div id="certificado" class="a4-container">
       <!-- Cabecera -->
      <v-row align="center" class="header">
        <v-col cols="2" class="logo-container">
          <v-img
            src="@/assets/logo_ventana.png"
            alt="Logo"
            class="logo"
          ></v-img>
        </v-col>
        <v-col cols="8" class="text-center">
          <h3 class="title">{{organizationName}}</h3>     
        </v-col>
        <v-col cols="2"></v-col>
      </v-row>
      <v-divider
        :thickness="2"
        class="border-opacity-100"
        color="info"
      ></v-divider>
      <!-- Primer Bloques -->
      <v-card>
        <v-card-title class="block-title fondo-sub">
          <v-card-title class="block-title fondo-sub">
            <p class="text-center">
              CERTIFICADO DE AVALÚS Y CATASTROS 
              <span v-if="form.tipo_predio == 1">URBANOS</span>
              <span v-else-if="form.tipo_predio == 2">RURALES</span>
              <span v-else>CATASTRALES</span>
              N°: {{ form.numero_serie }}
            </p>
          </v-card-title>

        </v-card-title>
        <v-card-text class="block-text">
          <v-row>
            <v-col cols="12">
              <p class="text-justify"><strong>De acuerdo al Código de Organización Territorial, Autonomía y Descentralización vigente, de la Dirección de Avalúos y Catastros del Gobierno Municipal del Cantón Cayambe, a través del jefe de Avalúos y Catastros en usos de sus atribuciones, CERTIFICA QUE:</strong></p>
              <p><strong>Nombre de: </strong> {{ form.propietario }}</p>
              <p><strong>con cédula/RUC: </strong> {{ form.numero_documento }}</p>
              <p><strong>Consta en el Catastro urbano del año: </strong> {{ form.anio_proceso }} <strong>del cantón:</strong>CAYAMBE<strong>de la parroquia:</strong> {{ form.nombre_parroquia }}</p>              
              <p><strong>Dirección:</strong> {{ form.direccion }}</p>              
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
      <!-- Segundo Bloques -->
      <v-card>
        <v-card-title class="block-title fondo-sub">
          VALORACIÓN CATASTRAL
        </v-card-title>
        <v-card-text class="block-text">
          <v-row>
            <v-col cols="6">              
              <p><strong>Clave Catastral:</strong> {{ form.clave_catastral }} </p>
              <p><strong>Clave Catastral Anterior:</strong> {{ form.clave_anterior }} </p>
              <p><strong>Área Construcción:</strong> {{ form.area_construcciones_porcentual }}</p>
              <p><strong>Avalúo Construcción $: </strong> {{ form.valor_construcciones_porcentual }}</p>          
              
            </v-col>
            <v-col cols="6">
              <p><strong>Área del terreno m2:</strong> {{ form.area_suelo_porcentual }}</p>
              <p><strong>Alicuota %:</strong> {{ form.alicuota }}</p>
              <p><strong>Avalúo del Terreno $:</strong> {{ form.valor_suelo_porcentual }}</p>
              <p><strong>Avalúo Total $:</strong> {{ form.avaluo_predio_porcentual }}</p>    
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>       
      <!-- Tercero Bloques -->
      <v-card>
        <v-card-title class="block-title fondo-sub">
          TIPO DE TRÁMITE
        </v-card-title>
        <v-card-text class="block-text">
          <v-row>
            <v-col cols="12" mt-1>              
              <v-select
                v-model="form.tipo_tramite"             
                :items="tipoTramites"
                item-text="descripcion"
                item-value="descripcion"
                multiple
                >
              </v-select>              
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>           
      <!-- Cuarto Bloques -->
      <v-card class="block-border">
        <v-card-title class="block-title fondo-sub">
          NUEVO REGISTRO CATASTRAL
        </v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="12">
              <v-autocomplete
                class="input-text"
                label="Propietario"
                v-model="form.propietario_nuevo"
                :items="ciudadanoRecuperado"
                item-text="title"
                item-value="id"
                required
                outlined
                dense
                @update:model-value="onPropietarioNuevoChange"
                ></v-autocomplete>
            </v-col>
            <v-col cols="6">
              <v-text-field
                class="input-text"
                label="Nuevo Documento"
                v-model="form.nuevo_documento"
                outlined
                dense
              ></v-text-field>
              <v-select
                class="input-text"
                label="Tipo Venta"
                v-model="form.tipo_venta"             
                :items="tipoVenta"
                item-text="descripcion"
                item-value="descripcion"
                multiple                
              ></v-select>      
            </v-col>
            <v-col cols="6">
              <v-text-field
                class="input-text"
                label="Porcentaje de Compra"
                v-model="form.porcentaje_compra"
                outlined
                dense
                type="number"
                suffix="%"
              ></v-text-field>
              <v-text-field
                class="input-text"
                label="Cuantía"
                v-model="form.cuantia"
                outlined
                dense
                type="number"
                prefix="$"
              ></v-text-field>     
            </v-col>
            <v-col cols="10">
              <v-textarea                
                label="Observaciones"
                v-model="form.observaciones"
                variant="filled"
                rows="3"
                no-resize
              ></v-textarea>
            </v-col>
            <v-col cols="2" v-if="qrCode">
              <p class="text-center"><strong>Código QR:</strong></p>
              <div class="text-center">
                <img :src="qrCode" alt="QR Code" class="qr-code" />
              </div>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>              
      <!-- Quito Bloques -->
      <v-card>
        <v-card-text>
          <v-row>
            <v-col cols="6" class="text-center">
              <p>{{var_usuario}}</p>
              <p>_________________________</p>
              <p>Avalúador</p>
            </v-col>
            <v-col cols="6" class="text-center">
              <p>{{jefeCatastros}}</p>
              <p>_________________________</p>
              <p>{{tituloJefe}}</p>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </div>
  </v-container>

</template>

<script>
import axios from 'axios';
import html2pdf from 'html2pdf.js';
import QRCode from 'qrcode';
import { textVariables } from '@/config/textVariables';
import { mapGetters } from 'vuex';
import API_BASE_URL from '@/config/apiConfig';

export default {
  name: "CertificadoCatastral",
  data() {
    return {
      organizationName: textVariables.general.organizationName,
      jefeCatastros: textVariables.experto_urbano.jefe,
      tituloJefe: textVariables.experto_urbano.titulo,
      qrCode: null, // Nueva propiedad para almacenar el QR generado
      form: {
        propietario: '',
        numero_documento: '',
        anio_proceso: '',
        nombre_canton: '',
        nombre_parroquia: '',
        direccion: '',
        clave_catastral: '',
        tipo_tramite: '',
        propietario_nuevo: '',
        nuevo_documento: '',
        porcentaje_compra: '',
        tipo_predio: '',
        ph: '',
        clave_anterior: '',
        parroquia: '',
        alicuota: '',
        porcentaje_participacion: '',
        area_suelo_porcentual: '',
        area_construcciones_porcentual: '',
        valor_suelo_porcentual: '',
        valor_construcciones_porcentual: '',
        valor_instalaciones_porcentual: '',
        valor_adicionales_porcentual: '',
        avaluo_predio_porcentual: '',
        id_tenencia_propiedad: '',
        id_predio: '',
        fecha_proceso: '',
        observaciones: '',
        tipo_certificado: 'AvaluoUrb',
      },
      tipoTramites: [],
      ciudadanoRecuperado: [],
      tipoVenta: [],
      pdfGenerado: false 
    };
  },

  methods: {
    async recuperaPatrimonio(claveCatastral, anioProceso, tipoPredio) {
      try {
        const response = await axios.get(`${API_BASE_URL}/patrimonio-certificado`,{
            params: {
              clave_catastral: claveCatastral,
              anio_proceso: anioProceso,
              tipo_predio: tipoPredio
            },
          }
        );

        if (response.data && response.data.length > 0) {
          const patrimonio = response.data[0];
          this.form = {
            tipo_predio: patrimonio.tipo_predio || '',
            ph: patrimonio.ph || '',
            clave_catastral: patrimonio.clave_catastral || '',
            clave_anterior: patrimonio.clave_anterior || '',
            parroquia: patrimonio.parroquia || '',
            numero_documento: patrimonio.numero_documento || '',
            alicuota: patrimonio.alicuota || '',
            porcentaje_participacion: patrimonio.porcentaje_participacion || '',
            area_suelo_porcentual: patrimonio.area_suelo_porcentual || '',
            area_construcciones_porcentual: patrimonio.area_construcciones_porcentual || '',
            valor_suelo_porcentual: patrimonio.valor_suelo_porcentual || '',
            valor_construcciones_porcentual: patrimonio.valor_construcciones_porcentual || '',
            valor_instalaciones_porcentual: patrimonio.valor_instalaciones_porcentual || '',
            valor_adicionales_porcentual: patrimonio.valor_adicionales_porcentual || '',
            avaluo_predio_porcentual: patrimonio.avaluo_predio_porcentual || '',
            anio_proceso: patrimonio.anio_proceso || '',
            id_tenencia_propiedad: patrimonio.id_tenencia_propiedad || '',
            id_predio: patrimonio.id_predio || '',
            propietario: patrimonio.propietario || '',
            fecha_proceso: patrimonio.fecha_proceso || '',
            nombre_canton: patrimonio.nombre_canton || '',
            nombre_parroquia: patrimonio.nombre_parroquia || '',
            direccion: patrimonio.direccion || '',
          };
        } else {
          console.warn('No se encontraron datos para la clave catastral y año de proceso proporcionados.');
        }
      } catch (error) {
        console.error('Error al recuperar los datos de patrimonio urbano:', error);
      }
    },

    async insertaCertificadoCatastral() {
      try {
        this.form.usuario = this.userName;
        this.form.tipo_certificado = 'AvaluoUrb';

        const now = new Date();
        const formattedDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
        this.form.fecha_registro = formattedDate;

        console.log('Datos enviados al proceso de insertar:', JSON.stringify(this.form, null, 2));

        const response = await axios.post(`${API_BASE_URL}/genera_certificado`, this.form);

        if (response.status === 201) {
          console.log('Certificado catastral insertado correctamente:', response.data);
          this.form.numero_serie = response.data.numero_serie; // Actualiza el número de serie
          this.pdfGenerado = true; // Mostrar el botón PDF
          this.$emit('certificadoInsertado', response.data);

          // Generar el QR
          this.generateQRCode();
        } else {
          console.warn('No se pudo insertar el certificado catastral:', response);
        }
      } catch (error) {
        console.error('Error al insertar el certificado catastral:', error);
      }
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

    async cargaCiudadano() {
      try {
        const response = await axios.get(`${API_BASE_URL}/ciudadano_tenencia`);
        console.log('Datos obtenidos para ciudadano:', response.data);
        if (Array.isArray(response.data)) {
          this.ciudadanoRecuperado = response.data.map(item => {
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
        this.ciudadanoRecuperado = [];
      }      
    },

    pdf() {
      console.log('Generando PDF...');
      var element = document.getElementById('certificado');
      var opt = {
        margin: [0, 0, 0, 0],
        filename: `certificado_${this.form.numero_serie || 'sin_numero'}.pdf`, // Concatenar el número de serie
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 3 },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
      };
      html2pdf().from(element).set(opt).save();
    },

    salir() {
      this.$router.push('/genera-certificados'); 
    },

    async generateQRCode() {
      const qrData = {
        clave_catastral: this.form.clave_catastral,
        numero_serie: this.form.numero_serie,
        tipo_tramite: this.form.tipo_tramite,
        propietario: this.form.propietario,
        numero_documento: this.form.numero_documento,
        propietario_nuevo: this.form.propietario_nuevo,
        nuevo_documento: this.form.nuevo_documento,
        fecha_generacion: this.form.fecha_registro,
      };

      try {
        this.qrCode = await QRCode.toDataURL(JSON.stringify(qrData));        
      } catch (error) {
        console.error('Error al generar el QR Code:', error);
      }
    },

    onPropietarioNuevoChange(val) {
      // Buscar el ciudadano seleccionado por id y asignar su número de documento
      const ciudadano = this.ciudadanoRecuperado.find(c => c.id === val);
      if (ciudadano) {
        this.form.nuevo_documento = ciudadano.numero_documento;
      }
    },
  },

  async mounted() {
    // Si vienen datos por query desde GeneraCertificados.vue, llenar el form
    const q = this.$route.query;
    if (q && q.clave_catastral) {
      this.form.clave_catastral = q.clave_catastral || '';
      this.form.propietario = q.propietario || '';
      this.form.valor_suelo_porcentual = q.avaluo_suelo || '';
      this.form.valor_construcciones_porcentual = q.avaluo_construccion || '';
      this.form.avaluo_predio_porcentual = q.avaluo_total || '';
      this.form.area_construcciones_porcentual = q.area_construccion || '';
      this.form.area_suelo_porcentual = q.area_suelo || '';
      // Soporte para tipo_tramite múltiple
      if (q.tipo_tramite) {
        try {
          this.form.tipo_tramite = JSON.parse(q.tipo_tramite);
        } catch {
          this.form.tipo_tramite = q.tipo_tramite;
        }
      }
      this.form.certificadoPlusvalia = q.certificado_plusvalia === 'true' || false;
      if (q.cuantia) {
        this.form.cuantia = q.cuantia;
      }
      if (q.numero_documento) {
        this.form.numero_documento = q.numero_documento;
      }
      if (q.direccion_principal) {
        this.form.direccion = q.direccion_principal;
      }
      if (q.nombre_parroquia) {
        this.form.nombre_parroquia = q.nombre_parroquia;
      }
      if (q.anio_proceso) {
        this.form.anio_proceso = q.anio_proceso;
      }
      if (q.porcentaje_participacion) {
        this.form.alicuota = q.porcentaje_participacion;
      }
      if (q.clave_catastral_anterior) {
        this.form.clave_anterior = q.clave_catastral_anterior;
      }

    } else {
      const { clave_catastral, anio_proceso, tipo_predio } = this.$route.query;
      if (clave_catastral && anio_proceso && tipo_predio) {
        await this.recuperaPatrimonio(clave_catastral, anio_proceso, tipo_predio);
      } else {
        console.warn('❌ Faltan parámetros requeridos para cargar patrimonio');
      }
    }
    await this.cargaCiudadano();
    try {
      this.tipoTramites = await this.cargaCatalogo(94, 0);    
      this.tipoVenta = await this.cargaCatalogo(95, 0);  
    } catch (error) {
      console.error('Error al montar el componente:', error);
    }
  },

    // Cancatenar descripción de parroquia
    computed: {
    ...mapGetters(['isConsultaPrimario', 'userName']),
    var_usuario() {
      return this.userName;
    }
  },

};
</script>

<style scoped>

.text-center {
  text-align: center;
}

.a4-container {
  width: 210mm;
  max-height: 297mm;
  padding: 10mm;
  box-sizing: border-box;
  background: white;
  overflow: hidden;
  margin: 5px auto; 
  box-shadow: 0 0 10px rgba(20, 199, 50, 0.1); 
}

.pdf-wrapper {
  display: flex;
  justify-content: center;
  align-items: flex-start; 
  min-height: 100vh;
  background-color: #b9b6b6; 
  padding: 20px;
}

.logo {
  max-width: 100%;
  width: 160px;
  max-height: 90px;
  height: auto;
  display: block;
  margin: 0 auto;
  object-fit: contain;
  background: none;
}

.title {
  font-size: 1rem;
  font-weight: bold;
  color: #114358;
  margin-top: 10px;
  margin-bottom: 10px;
}

.fondo-sub {
  background-color: #dbdbdb;
  color: #114358;
  text-align: center;
  padding: 4px;
  font-weight: bold;
  font-size: 0.85rem; /* Reducido */
}

.input-text {
  height: 60px; 
}

.input-text input,
.input-text .v-input__control,
.input-text .v-field__input {
  font-size: 0.85rem !important; /* Reducido */
  height: 32px !important;
}

.v-select input,
.v-select .v-input__control,
.v-select .v-field__input {
  font-size: 0.85rem !important;
  height: 32px !important;
}

.v-text-field input,
.v-text-field .v-input__control,
.v-text-field .v-field__input {
  font-size: 0.85rem !important;
  height: 32px !important;
}

.v-textarea textarea {
  font-size: 0.85rem !important;
}

.numero-serie {
  font-size: 0.85rem;
  font-weight: bold;
  color: #114358;
  margin-top: 5px;
}

.qr-code {
  width: 100px; /* Ajusta el ancho */
  height: 100px; /* Ajusta la altura */
  object-fit: contain; /* Asegura que la imagen se ajuste correctamente */
}

</style>