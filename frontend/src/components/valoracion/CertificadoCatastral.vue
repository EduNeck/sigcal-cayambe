<template>
  <v-card class="container">
    <v-container class="container fill-height">
      <v-col cols="12" class="d-flex justify-center flex-wrap">
        <v-btn @click="printCertificate" class="mt-3" color="primary">Imprimir</v-btn>
        <v-btn @click="navigateToMenu" class="mt-3" color="primary">Salir</v-btn>
        <v-btn @click="recupera" class="mt-3" color="primary">Certificado</v-btn>
        <v-btn @click="downloadPDF" class="mt-3" color="primary">PDF</v-btn>
      </v-col>
    </v-container>

    <v-container class="container fill-height" style="width: 210mm; height: 297mm;">
      <v-card class="mx-auto pdf" ref="certificadocatastral">
      <v-card-title class="headline">
        <v-row align="center">
        <v-col cols="2">
          <v-img src="@/assets/logo_ventana.png" alt="Logo" class="logo"></v-img>
        </v-col>
        <v-col cols="8" class="text-center">
          CERTIFICADO CATASTRAL
        </v-col>
        <v-col cols="2"></v-col>
        </v-row>
      </v-card-title>
      <v-card-subtitle class="text-center titulo">{{ organizationName }}</v-card-subtitle>
      <v-divider></v-divider>
      <v-card-text>
        <v-row>
        <v-col cols="6" class="d-flex justify-center">
          <v-img src="@/assets/sin-foto.png" alt="Sin Foto" class="imagenes"></v-img>
        </v-col>
        <v-col cols="6" class="d-flex justify-center">
          <v-img src="@/assets/sin-croquis.png" alt="Sin Croquis" class="imagenes"></v-img>
        </v-col>
        </v-row>
        <v-divider></v-divider>

        <v-card>
        <v-card-title class="subtitle text-center fondo-sub">ÁREAS Y AVALUOS</v-card-title>
        <v-card-text>
          <v-row>
          <v-col cols="6">
            <p><strong>Área Registro:</strong> {{ certificado.area_suelo_porcentual }} M2</p>
            <p><strong>Avalúo Suelo:</strong> ${{ certificado.valor_suelo_porcentual }}</p>
            <p><strong>Avalúo Predial:</strong> ${{ certificado.avaluo_predio_porcentual }}</p>
          </v-col>
          <v-col cols="6">
            <p><strong>Área Const.:</strong> {{ certificado.area_construcciones_porcentual }} M2</p>
            <p><strong>Avalúo Const.:</strong> ${{ certificado.valor_construcciones_porcentual }}</p>
            <p><strong>Avalúo Instalaciones:</strong> ${{ certificado.valor_instalaciones_porcentual }}</p>
            <p><strong>Avalúo Adicionales:</strong> ${{ certificado.valor_adicionales_porcentual }}</p>
          </v-col>
          </v-row>
        </v-card-text>
        </v-card>
        <v-divider></v-divider>

        <v-card>
        <v-card-title class="subtitle text-center fondo-sub">DATOS DEL PREDIO</v-card-title>
        <v-card-text>
          <v-row>
          <v-col>
            <p><strong>Clave Catastral Nueva:</strong> {{ certificado.clave_catastral }}</p>
            <p><strong>Clave Anterior:</strong> {{ certificado.clave_anterior }}</p>
            <p><strong>Tipo:</strong> {{ certificado.tipo_predio === 1 ? 'URBANO' : certificado.tipo_predio === 2 ? 'RURAL' : '' }}</p>
            <p><strong>Régimen:</strong> {{ certificado.ph }}</p>
          </v-col>
          </v-row>
        </v-card-text>
        </v-card>
        <v-divider></v-divider>

        <v-card>
        <v-card-title class="subtitle text-center fondo-sub">PROPIETARIOS</v-card-title>
        <v-card-text>
          <v-row>
          <v-col>
            <p><strong>Propietario:</strong> {{ certificado.propietario }}</p>
            <p><strong>Número Documento:</strong> {{ certificado.numero_documento }}</p>
          </v-col>
          <v-col>
            <p><strong>Tipo Persona:</strong> {{ certificado.tipo_persona }}</p>
            <p><strong>Alicuota:</strong> {{ certificado.alicuota }}</p>
            <p><strong>% Participación:</strong> {{ certificado.porcentaje_participacion }}</p>
          </v-col>
          </v-row>
        </v-card-text>
        </v-card>
        <v-divider></v-divider>

        <v-card>
        <v-card-title class="subtitle text-center fondo-sub">DIRECCIÓN</v-card-title>
        <v-card-text>
          <v-row>
          <v-col cols="6">
            <p><strong>Parroquia:</strong> {{ certificado.parroquia_nombre }}</p>
            <p><strong>Eje Principal:</strong> {{ certificado.eje_principal }}</p>
            <p><strong>Sector:</strong> {{ certificado.sector }}</p>
          </v-col>
          <v-col cols="6">
            <p><strong>Coordenada X:</strong> {{ certificado.coordenada_x }}</p>
            <p><strong>Coordenada Y:</strong> {{ certificado.coordenada_y }}</p>
          </v-col>
          </v-row>
        </v-card-text>
        </v-card>
        <v-divider></v-divider>

        <v-card>
        <v-card-title class="subtitle text-center fondo-sub">OBSERVACIONES</v-card-title>
        <v-card-text>
          <v-row>
          <v-col>
            <p>{{ certificado.observaciones }}</p>
          </v-col>
          </v-row>
        </v-card-text>
        </v-card>
        <v-divider></v-divider>
        <p><strong>Nota:</strong> El catastro predial no quita ni otorga derechos sobre predio alguno...</p>
        <v-divider></v-divider>
        <v-row justify="center">
        <v-col cols="auto">
          <v-img :src="qrCodeUrl" alt="Código QR" class="qr-code"></v-img>
        </v-col>
        </v-row>
      </v-card-text>
      </v-card>
    </v-container>
  </v-card>
</template>

<script>
import axios from 'axios';
import { textVariables } from '@/config/textVariables';
import QRCode from 'qrcode';
import html2pdf from 'html2pdf.js';
import API_BASE_URL from '@/config/apiConfig';

export default {
  name: 'CertificadoCatastral',
  data() {
    return {
      organizationName: textVariables.organizationName,
      certificado: {},      
      qrCodeUrl: ''
    };
  },

  methods: {
    printCertificate() {
      const printContents = this.$refs.certificadocatastral.$el.innerHTML;
      const originalContents = document.body.innerHTML;

      document.body.innerHTML = printContents;
      window.print();
      document.body.innerHTML = originalContents;
      window.location.reload();
    },

    downloadPDF() {
      const element = this.$refs.certificadocatastral ? this.$refs.certificadocatastral.$el : this.$el;
      const filename = `CertificadoCatastral_${this.certificado.clave_catastral}.pdf`;
      const opt = {
        margin: 0,
        filename: filename,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'in', format: 'A4', orientation: 'portrait' }
      };
      html2pdf().from(element).set(opt).save();
    },

    async recupera() {
      try {
        const response = await axios.post(`${API_BASE_URL}/certificado_catastral_geografico`, {
          codigo: '02023420240126-7'
        });
        console.log('Datos:', response.data);
        this.certificado = response.data[0];
        this.generateQRCode();
      } catch (error) {
        console.error('Error al obtener el certificado catastral geográfico:', error);
      }
    },

    async generateQRCode() {
      const data = {
        clave_catastral: this.certificado.clave_catastral,
        propietario: this.certificado.propietario,
        numero_documento: this.certificado.numero_documento,
        avaluo_suelo: this.certificado.valor_suelo_porcentual,
        avaluo_predial: this.certificado.avaluo_predio_porcentual,
        tipo_predio: this.certificado.tipo_predio === 1 ? 'URBANO' : this.certificado.tipo_predio === 2 ? 'RURAL' : ''
      };

      try {
        this.qrCodeUrl = await QRCode.toDataURL(JSON.stringify(data), {
          width: 200,
          margin: 2,
          color: {
            dark: '#000000',
            light: '#ffffff'
          }
        });
      } catch (error) {
        console.error('Error al generar el código QR:', error);
      }
    },

    navigateToMenu() {
      this.$router.push('/menu-predial');
    }
  }
};
</script>

<style scoped>
.custom-container {
  background-color: #F1ECE7;
}

p {
  margin: 0;
  padding: 0;
}

.headline {
  font-size: 24px;
  font-weight: bold;
}

.subtitle {
  font-size: 14px;
}

.logo {
  max-width: 50%;
  height: auto;
}

.imagenes {
  max-width: 100%;
  height: auto;
  border: 1px solid #A9A9A9;
  width: 200px;
  height: 200px;
}

.pdf {
  width: 210mm;
  height: 297mm;
}

.titulo {
  font-size: 15px;
  font-weight: bold;
  color: #000000;
}

.container {
  background-color: #114358;
}

.fondo-sub {
  background-color: #A9A9A9;
  height: 25px;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
}

.qr-code {
  width: 150px;
  height: 150px;
}

@media print {
  body * {
    visibility: hidden;
  }
  .v-card,
  .v-card * {
    visibility: visible;
  }
  .v-card {
    position: absolute;
    left: 0;
    top: 0;
  }
}
</style>
