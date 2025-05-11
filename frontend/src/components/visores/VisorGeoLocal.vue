<template>
    <v-container fluid>
      <v-card class="pa-4" elevation="6">
        <v-card-title>Visor Catastral</v-card-title>
        <v-card-text>
          <iframe
            :src="urlVisor"
            width="100%"
            height="600"
            frameborder="0"
          ></iframe>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red" @click="salir">Salir</v-btn>
        </v-card-actions>
      </v-card>
    </v-container>
  </template>
  
  <script>
  export default {
    name: "VisorSecundario",
    data() {
      return {
        urlVisor: "http://localhost/paginas/gis/prediosCayambe", 
      };
    },
    methods: {
      salir() {
        this.$router.back();
      },
    },
  };
  </script>
  
  <style scoped>
  iframe {
    border-radius: 10px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
  }
  </style>
  