<template>
    <v-window v-model="window" show-arrows arrows-color="red">
      <v-window-item value="listado-bloques">
        <ListadoBloques @navigateToBloques="navigateToBloques"/>
      </v-window-item>
      <v-window-item :key="tabBloquesKey" value="tab-bloques">
        <TabBloques/>
      </v-window-item>
    </v-window>
  </template>
  
  <script>
  import ListadoBloques from './ListadoBloques.vue';
  import TabBloques from './FormBloques.vue';
  import { mapGetters } from 'vuex';
  
  
  export default {
    name: 'VentanaBloques',
    data() {
      return {
        window: 'listado-bloques',
        tabBloquesKey: 0, 
      };
    },
    components: {
      ListadoBloques,
      TabBloques
    },
    computed: {
      ...mapGetters(['getIdPredio'])
    },
    methods: {
      toggleTabBloques() {
        this.window = this.window === 'listado-bloques' ? 'tab-bloques' : 'listado-bloques';
      },
      navigateToBloques() {
        this.tabBloquesKey += 1; 
        this.window = 'tab-bloques';
      }
    }
  };
  </script>
  
  <style scoped>

  </style>