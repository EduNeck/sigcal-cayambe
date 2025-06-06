<template>
  <v-container class="container">
    <!-- Overlay de carga -->
    <v-overlay
      :model-value="loading"
      class="d-flex align-center justify-center"
      persistent
      style="z-index: 1000"
    >
      <v-card class="pa-4 text-center" color="#F1ECE7">
        <v-progress-circular indeterminate color="primary" size="50" class="mb-2" />
        <div aria-live="polite">Cargando documentos, por favor espere...</div>
      </v-card>
    </v-overlay>

    <v-row justify="center">
      <v-col cols="12" class="text-center">
        <h2 class="titulo-pantalla">Listado de Documentos</h2>
      </v-col>
      <v-col cols="12" class="d-flex justify-center flex-wrap">
        <v-btn class="btn_app mx-2 my-2" append-icon="mdi-close" @click="navigateToMenuUrbano">Salir</v-btn>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12">
        <v-data-table
          :headers="headers"
          :items="filteredDocumentos"
          :search="search"
          class="elevation-1"
        >
          <template v-slot:top>
            <v-toolbar flat>
              <v-toolbar-title>Documentos</v-toolbar-title>
              <v-divider class="mx-4" inset vertical></v-divider>
              <v-spacer></v-spacer>
              <v-text-field
                v-model="search"
                append-icon="mdi-magnify"
                label="Buscar Documento"
                single-line
                hide-details
              ></v-text-field>
            </v-toolbar>
          </template>

          <template v-slot:item.fecha_registro="{ item }">
            {{ formatFecha(item.fecha_registro) }}
          </template>

          <template v-slot:item.fecha_actualizacion_aud="{ item }">
            {{ formatFecha(item.fecha_actualizacion_aud) }}
          </template>

          <template v-slot:item.documento="{ item }">
            <v-btn
              icon
              color="primary"
              @click="descargarDocumento(item.documento, `documento_${item.id_documento || 'descarga'}.pdf`)"
            >
              <v-icon>mdi-download</v-icon>
            </v-btn>
          </template>
        </v-data-table>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import axios from 'axios';
import API_BASE_URL from '@/config/apiConfig';

export default {
  name: 'ListadoDocumental',
  data() {
    return {
      search: '',
      documentos: [],
      loading: false,
      headers: [
        { title: 'Descargar', value: 'documento', sortable: false },
        { title: 'Descripción', value: 'descripcion' },
        { title: 'Fecha Registro', value: 'fecha_registro' },
        { title: 'Digitador', value: 'digitador' },
        { title: 'Actualizador', value: 'actualizador' },
        { title: 'Fecha Actualización', value: 'fecha_actualizacion_aud' },
      ],
    };
  },
  computed: {
    filteredDocumentos() {
      if (!this.documentos) return [];
      if (!this.search) return this.documentos;
      const searchLower = this.search.toLowerCase();
      return this.documentos.filter(doc =>
        Object.values(doc).some(val =>
          String(val || '').toLowerCase().includes(searchLower)
        )
      );
    },
  },
  methods: {
    async cargarDocumentos() {
      this.loading = true;
      try {
        const response = await axios.get(`${API_BASE_URL}/obtiene_documentos`);
        this.documentos = response.data;
      } catch (error) {
        console.error('Error al cargar documentos:', error);
      } finally {
        this.loading = false;
      }
    },
    formatFecha(fecha) {
      if (!fecha) return '';
      return new Date(fecha).toLocaleDateString();
    },
    navigateToMenuUrbano() {
      this.$router.push('/menu-predial');
    },
    descargarDocumento(documentoData, nombre = 'documento.pdf') {
      try {
        let base64String = '';

        // Si es un objeto tipo Buffer del backend, conviértelo
        if (typeof documentoData === 'object' && documentoData.data) {
          const byteArray = new Uint8Array(documentoData.data);
          base64String = btoa(
            byteArray.reduce((data, byte) => data + String.fromCharCode(byte), '')
          );
        } else if (typeof documentoData === 'string') {
          base64String = documentoData;
        } else {
          throw new Error('Formato de documento no reconocido');
        }

        const byteCharacters = atob(base64String);
        const byteNumbers = Array.from(byteCharacters, char => char.charCodeAt(0));
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: 'application/octet-stream' });

        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = nombre;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(link.href);
      } catch (err) {
        console.error('Error al descargar documento:', err);
      }
    },
  },
  mounted() {
    this.cargarDocumentos();
  },
};
</script>

<style scoped>
.titulo-pantalla {
  font-size: 2rem;
  color: #000000;
}
.container {
  background-color: #F1ECE7;
}
.btn_app {
  background-color: #223770;
  color: #ffffff;
}
.v-data-table {
  font-size: 0.95rem;
}
</style>
