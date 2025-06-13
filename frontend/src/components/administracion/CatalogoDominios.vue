<template>
  <v-container>
    <v-card class="pa-4">
      <v-card-title>Editar Dominio</v-card-title>
      <v-card-text>
        <v-form ref="form" v-model="valid" lazy-validation>
          <v-row>
            <v-col cols="12" sm="6" md="4">
              <v-text-field v-model="dominio.id_tipo_atributo" label="ID Tipo Atributo" required></v-text-field>
            </v-col>
            <v-col cols="12" sm="6" md="4">
              <v-text-field v-model="dominio.id" label="ID" required></v-text-field>
            </v-col>
            <v-col cols="12" sm="6" md="4">
              <v-text-field v-model="dominio.codigo" label="Código" required></v-text-field>
            </v-col>
            <v-col cols="12" sm="6" md="6">
              <v-text-field v-model="dominio.descripcion" label="Descripción" required></v-text-field>
            </v-col>
            <v-col cols="12" sm="6" md="3">
              <v-text-field v-model="dominio.factor" label="Factor"></v-text-field>
            </v-col>
            <v-col cols="12" sm="6" md="3">
              <v-text-field v-model="dominio.tipo_exclusivo" label="Tipo Exclusivo"></v-text-field>
            </v-col>
          </v-row>
          <v-btn color="primary" @click="guardarDominio">Guardar</v-btn>
        </v-form>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
import axios from 'axios';
import API_BASE_URL from '@/config/apiConfig';

export default {
  name: 'CatalogoDominios',
  data() {
    return {
      valid: false,
      dominio: {
        id_tipo_atributo: '',
        id: '',
        codigo: '',
        descripcion: '',
        factor: '',
        tipo_exclusivo: ''
      }
    };
  },
  methods: {
    async guardarDominio() {
      if (!this.$refs.form.validate()) return;
      try {
        // Aquí deberías usar el endpoint correspondiente para guardar/actualizar el dominio
        await axios.post(`${API_BASE_URL}/catalogo_dominios`, this.dominio);
        this.$emit('dominio-guardado');
      } catch (error) {
        console.error('Error al guardar el dominio:', error);
      }
    }
  }
};
</script>