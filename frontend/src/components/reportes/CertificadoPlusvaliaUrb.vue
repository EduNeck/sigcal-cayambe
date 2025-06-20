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

  <div id="certificado" class="a4-container"> 

    <div class="org-header">
      <img src="@/assets/logo_ventana.png" alt="Logo" class="org-logo" />
      <div class="org-title">{{ organizationName }}</div>
    </div>    
    <!-- Primer Bloques -->
    <v-card class="block">
      <v-card-title class="block-title"> 
          CERTIFICADO DE PLUSVALIA N°: {{ form.numero_serie }}
      </v-card-title>
        <v-card-text class="block-text">
          <v-row no-gutters>
            <v-col cols="12">
              <p class="styled-text"><strong>NOTARIA</strong></p>
              <p class="styled-text"><strong>A CARGO DE</strong></p>
              <p class="styled-text"><strong>NOTARIO</strong></p>              
              <p class="styled-text"><strong>PARA: DIRECTOR FINACIERO DEL GOBIERNO AUTONOMO DESCENTRALIZADO DEL CANTON CAYAMBE COMUNICO A USTED QUE ANTE EL SUSCRITO NOTARIO. VA A PROTOCOLZARSE UN CONTRATO DE</strong></p>              
            </v-col>
            <v-col cols="12" mt-1>              
              <v-select class="input-text"
                label="TIPO DE TRAMITE"
                v-model="form.tipo_tramite"             
                :items="tipoTramites"
                item-text="descripcion"
                item-value="descripcion"
                multiple
                density="compact"                
                >
              </v-select>              
            </v-col>
          </v-row>
        </v-card-text>
    </v-card>
    <!-- Segundo Bloques -->
    <v-card class="block">
      <v-card-title class="block-title"> 
        CARACTERISTICAS DE ESCRITURAS ACTUALES
      </v-card-title>
      <v-card-text class="block-text">
        <v-row no-gutters>
          <v-col cols="12">              
            <p class="styled-text"><strong>UBICACIÓN EN EL CANTON: </strong>{{ form.nombre_canton }}<strong> de la parroquia:</strong> {{ form.nombre_parroquia }}</p>
            <p class="styled-text"><strong>DIRECCIÓN:</strong> {{ form.direccion }} </p>
            <p class="styled-text"><strong>CLAVE CATASTRAL:</strong> {{ form.clave_catastral }}</p>
            <p class="styled-text"><strong>QUE OTORGA: </strong> {{ form.propietario }}</p>          
          </v-col>
          <v-col cols="12" style="margin-top: 0;">
            <v-autocomplete
              class="input-text"
              label="A FAVOR DE:"
              v-model="form.propietario_nuevo"
              :items="ciudadanoRecuperado" 
              item-text="title" 
              item-value="title"
              required
              outlined
              dense 
              density="compact"
            ></v-autocomplete>                            
          </v-col>
          <v-row no-gutters>
            <v-col cols="6">              
              <p class="styled-text"><strong>AVALÚO DEL TERRENO $:</strong> {{ form.valor_suelo_porcentual }}</p>
              <p class="styled-text"><strong>AVALÚO CONSTRUCCIÓN $:</strong> {{ form.valor_construcciones_porcentual }}</p>          
              <p class="styled-text"><strong>AVALÚO TOTAL $:</strong> {{ form.avaluo_predio_porcentual }}</p>                                 
            </v-col>
            <v-col cols="6">
              <v-text-field
                class="input-text"
                label="Cuantía"
                v-model="form.cuantia"
                outlined
                dense
                type="number"
                prefix="$"
                density="compact"
              ></v-text-field>                
            </v-col>
          </v-row>
        </v-row>
        <v-divider></v-divider>
        <v-col>
          <p class="styled-text"><strong>LINDEROS</strong></p>
          <v-text-field
            class="input-text"
            label="Lindero Norte"
            v-model="form.lindero_norte"
            outlined
            dense
            density="compact"
          ></v-text-field>
          <v-text-field
            class="input-text"
            label="Lindero Sur"
            v-model="form.lindero_sur"
            outlined
            dense
            density="compact"
          ></v-text-field>
          <v-text-field
            class="input-text"
            label="Lindero Este"
            v-model="form.lindero_este"
            outlined
            dense
            density="compact"
          ></v-text-field>
          <v-text-field
            class="input-text"
            label="Lindero Oeste"
            v-model="form.lindero_oeste"
            outlined
            dense
            density="compact"
          ></v-text-field>
        </v-col>
      </v-card-text>
    </v-card>
    <!-- Tercero Bloques -->
    <v-card class="block">
      <v-card-title class="block-title">
        CARACTERISTICAS DE ESCRITURAS ANTERIORES
      </v-card-title>
      <v-card-text class="block-text">
        <v-row no-gutters>
          <v-col cols="6">
            <v-text-field
              class="input-text"
              label="Fecha Adquisición Anterior"
              v-model="form.fecha_adquisicion_anterior"
              outlined
              dense
              type="date"
              density="compact"                
            ></v-text-field>
            <v-text-field
                class="input-text"
                label="Valor Avaluo Anterior"
                v-model="form.valor_avaluo_anterior"
                outlined
                dense
                type="number"
                prefix="$"
                density="compact"
            ></v-text-field>    
            <v-text-field
                class="input-text"
                label="Superficie Total Adquirida"
                v-model="form.sup_total_adquirida"                  
                outlined
                dense
                type="number"
                prefix="m2"
                density="compact"
            ></v-text-field>                  
            <v-text-field
                class="input-text"
                label="Superficie Transfiere"
                v-model="form.sup_transfiere"                  
                outlined
                dense
                type="number"
                prefix="m2"
                density="compact"
            ></v-text-field>                 
          </v-col>
          <v-col cols="6">
            <v-text-field
              class="input-text"
              label="Fecha Pos Efec/Defun"
              v-model="form.fecha_pos_def"
              outlined
              dense
              type="date"    
              density="compact"            
            ></v-text-field>
            <v-text-field
              class="input-text"
              label="Valor Avaluo Pos Def"
              v-model="form.valor_avaluo_pos_def"
              outlined
              dense
              type="number"
              prefix="$"
              density="compact"
            ></v-text-field>
            <v-text-field
              class="input-text"
              label="Valor Construcción Pos Def"
              v-model="form.valor_const_pos_def"
              outlined
              dense
              type="number"
              prefix="$"
              density="compact"
            ></v-text-field>
            <v-text-field
              class="input-text"
              label="Valor Otros Pos Def"
              v-model="form.valor_otros_pos_def"
              outlined
              dense
              type="number"
              prefix="$"
              density="compact"
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row no-gutters>
          <v-col cols="8">
            <v-text-field  class="text-area"              
              label="Observaciones"
              v-model="form.observaciones"    
            ></v-text-field>
          </v-col>
          <v-col cols="2" v-if="qrCode">            
            <div class="">
              <img :src="qrCode" alt="QR Code" class="qr-code" />
            </div>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>                     
    <!-- Quito Bloques -->
    <v-card class="block">
      <v-card-text class="block-text">
        <v-row no-gutters>
          <v-col cols="6" class="firma" >
            <p class="firma" >{{var_usuario}}</p>
            <p>_________________________</p>
            <p class="firma" >Avalúador</p>
          </v-col>
          <v-col cols="6" class="firma" >
            <p>{{jefeCatastros}}</p>
            <p>_________________________</p>
            <p>{{tituloJefe}}</p>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
    <div class="footer-fecha">
      Fecha y hora de emisión: {{ fechaHoraActual }}
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import html2pdf from 'html2pdf.js';
import QRCode from 'qrcode'; 
import { textVariables } from '@/config/textVariables';
import { mapGetters } from 'vuex';
import API_BASE_URL from '@/config/apiConfig';

export default {
  name: "CertificadoPlusvaliaUrb",
  data() {
    return {
      ...textVariables.general,
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
        valor_compra: '',
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
        tipo_certificado: 'PlusvaliaUrb',
        lindero_norte: '',
        lindero_sur: '',
        lindero_este: '',
        lindero_oeste: '',
        fecha_adquisicion_anterior: '', 
        valor_avaluo_anterior: '', 
        sup_total_adquirida: '', 
        sup_transfiere: '', 
        fecha_pos_def: '', 
        valor_avaluo_pos_def: '', 
        valor_const_pos_def: '', 
        valor_otros_pos_def: '',
        cuantia: 0,

      },
      tipoTramites: [],
      ciudadanoRecuperado: [],
      tipoVenta: [],
      pdfGenerado: false 
    };
  },

  methods: {
    async recuperaPatrimonio() {
      const { clave_catastral, anio_proceso, tipo_predio } = this.$route.query;

      console.log('🟡 Parámetros RAW desde la URL:', this.$route.query);
      console.log('➡️ clave_catastral:', clave_catastral);
      console.log('➡️ anio_proceso:', anio_proceso);
      console.log('➡️ tipo_predio:', tipo_predio);

      if (!clave_catastral || !anio_proceso || !tipo_predio) {
        console.error('❌ Faltan uno o más parámetros requeridos para recuperar patrimonio');
        return;
      }

      try {
        const response = await axios.get(`${API_BASE_URL}/patrimonio-certificado`, {
          params: {
            clave_catastral,
            anio_proceso,
            tipo_predio
          }
        });

        if (response.data && response.data.length > 0) {
          const patrimonio = response.data[0];
          this.form = {
            ...this.form,
            tipo_predio: patrimonio.tipo_predio || null,
            ph: patrimonio.ph || null,
            clave_catastral: patrimonio.clave_catastral || null,
            clave_anterior: patrimonio.clave_anterior || null,
            parroquia: patrimonio.parroquia || null,
            numero_documento: patrimonio.numero_documento || null,
            alicuota: patrimonio.alicuota || null,
            porcentaje_participacion: patrimonio.porcentaje_participacion || null,
            area_suelo_porcentual: patrimonio.area_suelo_porcentual || null,
            area_construcciones_porcentual: patrimonio.area_construcciones_porcentual || null,
            valor_suelo_porcentual: patrimonio.valor_suelo_porcentual || null,
            valor_construcciones_porcentual: patrimonio.valor_construcciones_porcentual || null,
            valor_instalaciones_porcentual: patrimonio.valor_instalaciones_porcentual || null,
            valor_adicionales_porcentual: patrimonio.valor_adicionales_porcentual || null,
            avaluo_predio_porcentual: patrimonio.avaluo_predio_porcentual || null,
            anio_proceso: patrimonio.anio_proceso || null,
            id_tenencia_propiedad: patrimonio.id_tenencia_propiedad || null,
            id_predio: patrimonio.id_predio || null,
            propietario: patrimonio.propietario || null,
            fecha_proceso: patrimonio.fecha_proceso || null,
            nombre_canton: patrimonio.nombre_canton || null,
            nombre_parroquia: patrimonio.nombre_parroquia || null,
            direccion: patrimonio.direccion || null,
            fecha_adquisicion_anterior: patrimonio.fecha_adquisicion_anterior || null,
            valor_avaluo_anterior: patrimonio.valor_avaluo_anterior || null,
            sup_total_adquirida: patrimonio.sup_total_adquirida || null,
            sup_transfiere: patrimonio.sup_transfiere || null,
            fecha_pos_def: patrimonio.fecha_pos_def || null,
            valor_avaluo_pos_def: patrimonio.valor_avaluo_pos_def || null,
            valor_const_pos_def: patrimonio.valor_const_pos_def || null,
            valor_otros_pos_def: patrimonio.valor_otros_pos_def || null,
            observaciones: patrimonio.observaciones || null,
            cuantia: patrimonio.cuantia || null,
          };
        } else {
          console.warn('No se encontraron datos para la clave catastral y año de proceso proporcionados.');
        }
      } catch (error) {
        console.error('Error al recuperar los datos de patrimonio urbano:', error);
      }
    },

    /// Método para insertar el certificado catastral
    async insertaCertificadoCatastral() {
      try {
        this.form.usuario = this.userName;
        this.form.tipo_certificado = 'PlusvaliaUrb';

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

    // Método para cargar el catálogo
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

    // Método para cargar los ciudadanos
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
      this.$router.push('/menu-predial'); // Cambia la ruta según tu aplicación
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
        console.log('QR Code generado:', this.qrCode);
      } catch (error) {
        console.error('Error al generar el QR Code:', error);
      }
    },
  },

  async mounted() {
    // Asignar datos desde query params si existen
    const q = this.$route.query;
    if (q) {
      this.form.clave_catastral = q.clave_catastral || '';
      this.form.propietario = q.propietario || '';
      this.form.numero_documento = q.numero_documento || '';
      this.form.nombre_parroquia = q.nombre_parroquia || '';
      this.form.direccion = q.direccion || q.direccion_principal || '';
      this.form.valor_suelo_porcentual = q.avaluo_suelo || q.avaluo_suelo_porcentual || '';
      this.form.valor_construcciones_porcentual = q.avaluo_construccion || q.valor_construcciones_porcentual || '';
      this.form.avaluo_predio_porcentual = q.avaluo_total || q.avaluo_predio_porcentual || '';
      this.form.area_construcciones_porcentual = q.area_construccion || q.area_construcciones_porcentual || '';
      this.form.area_suelo_porcentual = q.area_suelo || q.area_suelo_porcentual || '';
      this.form.tipo_tramite = q.tipo_tramite ? JSON.parse(q.tipo_tramite) : [];
      this.form.cuantia = q.cuantia || '';
      this.form.anio_proceso = q.anio_proceso || '';
      this.form.clave_anterior = q.clave_catastral_anterior || '';
      this.form.porcentaje_participacion = q.porcentaje_participacion || '';
    }
    await this.recuperaPatrimonio();
    await this.cargaCiudadano();
    try {
      this.tipoTramites = await this.cargaCatalogo(94, 0);
      this.tipoVenta = await this.cargaCatalogo(95, 0);
    } catch (error) {
      console.error('Error al montar el componente:', error);
    }
  },

    // Concatenar descripción de parroquia
    computed: {
      ...mapGetters(['isConsultaPrimario', 'userName']),
      var_usuario() {
      return this.userName;
    },
    fechaHoraActual() {
      const now = new Date();
      const fecha = now.toLocaleDateString();
      const hora = now.toLocaleTimeString();
      return `${fecha} ${hora}`;
    }
  },

};
</script>

<style scoped>

.a4-container {
  width: 210mm;
  min-height: 297mm;
  max-width: 210mm;
  max-height: 297mm;
  margin: 1px auto;
  padding: 5mm 5mm;
  background: #ffffff;
  position: relative;
  overflow: hidden;
}
.org-header {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 18px;
  gap: 18px;
}
.org-logo {
  height: 54px;
  width: auto;
  object-fit: contain;
  margin-right: 8px;
}
.org-title {
  text-align: center;
  font-size: 0.9rem;
  font-weight: bold;
  color: #114358;
  letter-spacing: 1px;
}
.cert-body {
  width: 100%;
}
@media print {
  .a4-container {
    margin: 0;
    box-shadow: none;
    width: 210mm;
    min-height: 297mm;
    max-width: 210mm;
    max-height: 297mm;
    padding: 20mm 15mm;
    background: #fff;
    page-break-after: always;
  }
}
.block {
  display: block;
  color: #114358;
  border-radius: 0xp;
  margin: 0px 0px 0px 0px;
  padding: 0px 0px 0px 0px;
  background-color: #ffffff;
  box-shadow: 0 0 0px rgba(255, 255, 255, 0.1);
}
.block-title {
  font-size: 0.7rem;
  font-weight: bold;
  color: #ffffff;
  background-color: #114358;
  text-align: center;
  justify-content: center;
  margin-bottom: 0px;
  padding: 0px 0px 0px 0px;
}
.block-text {
  font-size: 2rem;
  line-height: 1.5;
  color: #114358;
  padding: 0px 0px 0px 0px;
}
.styled-text{
  font-size: 0.6rem;  
  color: #114358;
  padding: 0px 0px 0px 0px;
}
.input-text {
  font-size: 0.1rem;
  color: #114358;
  padding: 0px 0px 0px 0px;
  background-color: #ffffff;
  border: 0px solid #ffffff;
  border-radius: 0px;
  width: 100%;
  height: 40px;
  box-sizing: border-box;  
}
.firma {
  font-size: 0.9rem;
  color: #114358;
  padding: 0px 0px 0px 0px;
  text-align: center;
}
.text-area {
  width: 100%;
  height: 100px;
  font-size: 0.8rem;
  color: #114358;
  padding: 0px 0px 0px 0px;
}
.qr-code {
  width: 80px; 
  height: 80px; 
  object-fit: contain; 
}
.footer-fecha {
  width: 100%;
  text-align: center;
  font-size: 0.85rem;
  color: #ffffff;
  margin-top: 18px;
  margin-bottom: 8px;
}

</style>