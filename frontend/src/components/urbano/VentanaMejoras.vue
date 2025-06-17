<template>
    <v-window v-model="window" show-arrows>
        <!-- Botón anterior -->
        <template #prev="{ props }">
            <v-btn v-bind="props" icon>
                <v-icon color="red">mdi-chevron-left</v-icon>
            </v-btn>
        </template>

        <!-- Botón siguiente con tooltip "Nuevo" solo cuando está en listado-mejoras -->
        <template #next="{ props }">
            <v-tooltip v-if="window === 'listado-mejoras'" text="Nuevo" location="top">
                <template #activator="{ props: tooltipProps }">
                    <v-btn
                        v-bind="{ ...props, ...tooltipProps }"
                        icon
                    >
                        <v-icon color="red">mdi-chevron-right</v-icon>
                    </v-btn>
                </template>
            </v-tooltip>
            <v-btn
                v-else
                v-bind="props"
                icon
            >
                <v-icon color="red">mdi-chevron-right</v-icon>
            </v-btn>
        </template>
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

.v-window__controls .v-btn .v-icon {
  color: white !important;
  background: linear-gradient(145deg, #ff5722, #ff9800);
  border-radius: 50%;
  width: 42px;
  height: 42px;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.3);
  font-size: 24px;
  transition: transform 0.2s ease, background-color 0.2s ease;
}

.v-window__controls .v-btn:hover .v-icon {
  transform: scale(1.1);
  background-color: #e53935;
}

</style>