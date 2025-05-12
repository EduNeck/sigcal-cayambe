<template>
    <v-window v-model="window" show-arrows arrows-color="blue">
        <v-window-item value="listado-mejoras">
            <TabListadoMejoras @navigateToMejoras="navigateToMejoras"/>
        </v-window-item>
        <v-window-item :key="tabMejorasKey" value="tab-mejoras">
            <TabMejoras/>
        </v-window-item>
    </v-window>
</template>

<script>
import TabListadoMejoras from './ListadoMejoras.vue';
import TabMejoras from './FormMejoras.vue';
import { mapGetters } from 'vuex';

export default {
    name: 'VentanaMejoras',
    data() {
        return {
            window: 'listado-mejoras',
            tabMejorasKey: 0, 
        };
    },
    components: {
        TabListadoMejoras,
        TabMejoras
    },
    computed: {
        ...mapGetters(['getIdPredio'])
    },
    methods: {
        toggleTabMejoras() {
            this.window = this.window === 'listado-mejoras' ? 'tab-mejoras' : 'listado-mejoras';
        },
        navigateToMejoras() {
            this.tabMejorasKey += 1;
            this.window = 'tab-mejoras';
        }
    }
};
</script>

<style scoped>
/* Tus estilos aquí */
</style>