<template>
  <v-container class="container">
    <v-overlay :model-value="loading" class="d-flex align-center justify-center" persistent style="z-index: 1000">
      <v-card class="pa-4 text-center" color="#F1ECE7">
        <v-progress-circular indeterminate color="primary" size="50" class="mb-2" />
        <div aria-live="polite">Cargando documentos, por favor espere...</div>
      </v-card>
    </v-overlay>

    <v-row justify="center">
      <v-col cols="12" class="text-center">
        <h2 class="titulo-pantalla">Listado de Anexos Documentos</h2>
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
          <template #top>
            <v-toolbar flat>
              <v-toolbar-title>Anexos Documentales</v-toolbar-title>
              <v-divider class="mx-4" inset vertical />
              <v-spacer/>
              <v-text-field
                v-model="search"
                append-icon="mdi-magnify"
                label="Buscar Documento"
                single-line
                hide-details
              />
            </v-toolbar>
          </template>

          <template #item.fecha_registro="{ item }">
            {{ formatFecha(item.fecha_registro) }}
          </template>

          <template #item.fecha_actualizacion_aud="{ item }">
            {{ formatFecha(item.fecha_actualizacion_aud) }}
          </template>

          <template #item.id_documentos="{ item }">
            <v-btn variant="text" color="primary" @click="irAGestionDocumental(item.id_documentos)">
              {{ item.id_documentos }}
            </v-btn>
          </template>

          <template #item.acciones="{ item }">
            <v-btn icon color="primary" @click="descargarPorId(item.id_documentos, item.nombre, item.tipo)">
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
        { title: 'ID', value: 'id_documentos' },
        { title: 'Nombre', value: 'nombre' },
        { title: 'Descripción', value: 'descripcion' },
        { title: 'Fecha Registro', value: 'fecha_registro' },
        { title: 'Digitador', value: 'digitador' },
        { title: 'Acciones', value: 'acciones', sortable: false },
      ],
    };
  },
  computed: {
    filteredDocumentos() {
      if (!this.documentos) return [];
      if (!this.search) return this.documentos;
      const s = this.search.toLowerCase();
      return this.documentos.filter(doc =>
        Object.values(doc).some(v => String(v || '').toLowerCase().includes(s))
      );
    },
  },
  methods: {
    async cargarDocumentos() {
      this.loading = true;
      try {
        const { data } = await axios.get(`${API_BASE_URL}/obtiene_documentos`);
        this.documentos = data;
      } catch (e) {
        console.error('Error al cargar documentos:', e);
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
    async descargarPorId(id, nombre = 'documento', tipo = 'application/octet-stream') {
      try {
        const url = `${API_BASE_URL}/documento/${id}/download`;
        const { data } = await axios.get(url, { responseType: 'blob' });
        const blob = new Blob([data], { type: tipo || 'application/octet-stream' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = nombre || `documento_${id}`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(a.href);
      } catch (e) {
        console.error('Error al descargar:', e);
      }
    },
    irAGestionDocumental(id) {
      this.$router.push({ path: '/gestion-documental', query: { id_documentos: id } });
    },
  },
  mounted() {
    this.cargarDocumentos();
  },
};
</script>

<style scoped>
.titulo-pantalla { font-size: 2rem; color: #000000; }
.container { background-color: #F1ECE7; }
.btn_app { background-color: #223770; color: #ffffff; }
.v-data-table { font-size: 0.95rem; }
</style>
