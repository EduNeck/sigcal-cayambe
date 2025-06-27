<template>
  <v-app-bar color="#BDBDBD" :elevation="1" class="d-flex justify-center">
    <v-app-bar-title class="text-center">
      Fito Corvini
    </v-app-bar-title>
  </v-app-bar>
  <v-container class="container fill-height">
    <v-row justify="center">
      <v-col cols="12" class="text-center">
        <h2 class="titulo-pantalla">Formulario Fito Corvini</h2>
      </v-col>
      <v-col cols="12" class="d-flex justify-center flex-wrap">
        <v-btn class="btn_app mx-2 custom-text-color" append-icon="mdi-plus" @click="addRow">Nuevo</v-btn>
        <v-btn class="btn_app mx-2 custom-text-color" append-icon="mdi-check" @click="submitForm">Guardar</v-btn>
        <v-btn class="btn_app mx-2 custom-text-color" append-icon="mdi-check" @click="navigateToMenu">Salir</v-btn>
      </v-col>
      <v-col cols="12" md="8">
        <v-card class="pa-4 neutral-card">
          <v-data-table
            :headers="headers"
            :items="rows"
            item-value="id"
            class="elevation-1"
            hide-default-footer
          >
            <template v-slot:[`item.desde`]="{ item }">
              <v-text-field v-model="item.desde" label="Desde" hide-details class="white-text-field"></v-text-field>
            </template>
            <template v-slot:[`item.hasta`]="{ item }">
              <v-text-field v-model="item.hasta" label="Hasta" hide-details class="white-text-field"></v-text-field>
            </template>
            <template v-slot:[`item.estado`]="{ item }">
              <v-text-field v-model="item.estado" label="Estado" hide-details class="white-text-field"></v-text-field>
            </template>
            <template v-slot:[`item.factor`]="{ item }">
              <v-text-field v-model="item.factor" label="Factor" hide-details class="white-text-field"></v-text-field>
            </template>
            <template v-slot:[`item.actions`]="{ item }">
              <v-icon small @click="removeRow(item)">mdi-delete</v-icon>
            </template>
          </v-data-table>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import axios from 'axios';
import API_BASE_URL from '@/config/apiConfig';

export default {
  name: 'FitoCorvini',
  data() {
    return {
      headers: [
        { text: 'ID', value: 'id', align: 'start' },
        { text: 'Desde', value: 'desde' },
        { text: 'Hasta', value: 'hasta' },
        { text: 'Estado', value: 'estado' },
        { text: 'Factor', value: 'factor' },
        { text: 'Acciones', value: 'actions', sortable: false },
      ],
      rows: [],
    };
  },
  methods: {
    async fetchData() {
      try {
        const response = await axios.get(`${API_BASE_URL}/fitto_corvini`);
        this.rows = response.data;
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    },
    addRow() {
      const newId = this.rows.length ? Math.max(...this.rows.map(row => row.id)) + 1 : 1;
      this.rows.push({ id: newId, desde: '', hasta: '', estado: '', factor: '' });
    },
    removeRow(item) {
      const index = this.rows.indexOf(item);
      if (index > -1) {
        this.rows.splice(index, 1);
      }
    },
    submitForm() {
      // Aquí puedes manejar el envío del formulario, por ejemplo, enviarlo a una API
      console.log('Formulario enviado:', this.rows);
    },
    navigateToMenu() {
      this.$router.push('/menu-predial');
  },
  },
  mounted() {
    this.fetchData();
  },

};
</script>

<style scoped>
.titulo-pantalla {
  font-size: 2rem;
  color: #333333;
}

.container {
  background-color: #E8E8E8;
}

.btn_app {
  background-color: #8C8C8C;
  color: #FFFFFF;
}

.v-btn {
  margin-top: 20px;
}

.white-text-field .v-input__control {
  background-color: #FFFFFF !important;
}

.white-text-field .v-input__slot {
  background-color: #FFFFFF !important;
}

.neutral-card {
  background-color: #F7F6F2;
  border: 1px solid #D6D6D6;
}
</style>