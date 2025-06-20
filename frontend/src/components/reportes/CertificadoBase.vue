<template>
  <div class="a4-container">
    <div class="org-header">
      <img src="@/assets/logo_ventana.png" alt="Logo" class="org-logo" />
      <div class="org-title">{{ organizationName }}</div>
    </div>
    <div class="cert-body">
      <slot />
      <v-card class="block">
        <v-card-title class="block-title"> 
          CERTIFICADO DE PROPIEDAD
        </v-card-title>
          
        <v-card-text class="block-text">
          <p class="text-center">
            Este certificado es emitido por la Ventanilla Única de Atención al Ciudadano del Municipio de Loja.
          </p>
          <p class="text-center">
            Fecha de emisión: {{ new Date().toLocaleDateString() }}
          </p>
        </v-card-text>
      </v-card>

    </div>
  </div>
</template>

<script>
import { textVariables } from '@/config/textVariables';
export default {
  name: 'CertificadoBase',
  data() {
    return {
      ...textVariables.general,
    };
  }
};
</script>

<style scoped>
.a4-container {
  width: 210mm;
  min-height: 297mm;
  max-width: 210mm;
  max-height: 297mm;
  margin: 5px auto;
  padding: 7mm 7mm;
  background: #d6d6d6;
  box-shadow: 0 0 10px rgba(20, 199, 50, 0.1);
  box-sizing: border-box;
  overflow: hidden;
  position: relative;
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
}

.block-title {
  font-size: 0.8rem;
  font-weight: bold;
  color: #e08309;
  text-align: center;
  margin-bottom: 1px;
  padding: 0px 0px 0px 0px;
}

.block-text {
  font-size: 0.8rem;
  line-height: 1.5;
  color: #114358;
  padding: 0px 0px 0px 0px;
}

</style>
