<template>
    <v-window v-model="window" show-arrows arrows-color="red">
      <v-window-item value="listado-vias">
        <TabListadoVias @navigateToVias="navigateToVias"/>
      </v-window-item>
      <v-window-item :key="tabViasKey" value="tab-vias">
        <TabVias/>
      </v-window-item>
    </v-window>
  </template>

<script>
import TabListadoVias from './ListadoVias.vue';
import TabVias from './FormVias.vue';
import { mapGetters } from 'vuex';

export default {
  name: 'VentanaVias',
  data() {
    return {
      window: 'listado-vias',
      tabViasKey: 0,
    };
  },
  components: {
    TabListadoVias,
    TabVias
  },
  computed: {
    ...mapGetters(['getIdPredio'])
  },
  methods: {
    toggleTabVias() {
      this.window = this.window === 'listado-vias' ? 'tab-vias' : 'listado-vias';
    },
    navigateToVias() {
      this.tabViasKey += 1;
      this.window = 'tab-vias';
    }
  }
};
</script>

<style scoped>
/* Tus estilos aquí */
</style>