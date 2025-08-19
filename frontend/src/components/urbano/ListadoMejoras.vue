<template>
    <v-container :class="['container', tipoClaseContainer]">
        <v-row justify="center">
            <v-col cols="12" class="text-center">
                <h2 class="titulo-pantalla">Listado de Mejoras</h2>
            </v-col>

            <v-row>
                <v-col cols="12">
                    <v-data-table
                        :headers="headers"
                        :items="mejoras"
                        :search="search"
                        class="elevation-1"
                    >
                        <template v-slot:top>
                            <v-toolbar flat>
                                <v-toolbar-title>Mejoras</v-toolbar-title>
                                <v-divider class="mx-4" inset vertical></v-divider>
                                <v-spacer></v-spacer>                
                                <v-col cols="auto">
                                    <v-btn :class="['btn_app', tipoClaseButton]" @click="recargarDatos">
                                        Recargar Datos
                                    </v-btn>
                                </v-col>
                                <v-divider class="mx-4" inset vertical></v-divider>
                                <v-spacer></v-spacer>
                                <v-text-field
                                    v-model="search"
                                    append-icon="mdi-magnify"
                                    label="Buscar"
                                    single-line
                                    hide-details
                                ></v-text-field>
                            </v-toolbar>
                        </template>
                        <template v-slot:item="{ item }">
                            <tr :class="{ 'selected-row': item.id_mejoras === selectedMejoraId }">
                                <v-btn :class="['btn_app', tipoClaseButton]" icon @click="selectMejora(item.id_mejoras)">
                                    <v-icon>mdi-pencil</v-icon>
                                </v-btn>
                                <td>{{ item.id_mejoras }}</td>
                                <td>{{ item.tipo_obra }}</td>
                                <td>{{ item.material }}</td>
                                <td>{{ item.area }}</td>
                                <td>{{ item.estado }}</td>                                
                                <td>{{ item.condicion_fisica }}</td>
                                <td>{{ item.anio_construccion }}</td>
                            </tr>
                        </template>
                    </v-data-table>
                </v-col>
            </v-row>
        </v-row>
    </v-container>

</template>

<script>
import axios from 'axios';
import { mapGetters, mapActions } from 'vuex';
import { useMejorasEvents } from '@/composables/useMejorasEvents';
import API_BASE_URL from '@/config/apiConfig';

export default {
    name: 'TabListadoMejoras',
    setup() {
        const { onMejorasUpdated } = useMejorasEvents();
        return { onMejorasUpdated };
    },

    data() {
        return {
            search: '',
            mejoras: [],
            selectedMejoraId: null,
            headers: [
                { title: 'Acción', value: 'action', sortable: false },
                { title: 'Id Mejoras', value: 'mejoras' },
                { title: 'Tipo Obra', value: 'tipo_obra' },
                { title: 'Material', value: 'material' },
                { title: 'Cantidad / Dimensión', value: 'area' },
                { title: 'Estado', value: 'estado' },                
                { title: 'Condición Física', value: 'condicion_fisica' },
                { title: 'Año de Construcción', value: 'anio_construccion' }
            ]
        };
    },

    computed: {
        ...mapGetters(['getIdPredio', 'getTipoPredio']),
        tipoClaseContainer() {
            return this.getTipoPredio === 1 ? 'urbano-container' : 'rural-container';
        },
        tipoClaseButton() {
            return this.getTipoPredio === 1 ? 'urbano-btn' : 'rural-btn';
        },
        tipoClaseBlock() {
            return this.getTipoPredio === 1 ? 'urbano-block' : 'rural-block';
        },
        tipoClaseTitle() {
            return this.getTipoPredio === 1 ? 'urbano-title' : 'rural-title';
        }
    },


    async mounted() {
        try {
            console.log('Componente montado');
            console.log('ID DEL PREDIO:', this.getIdPredio);
            await this.recuperaMejoras(this.getIdPredio);
            
            // 🔧 Listener para reactividad de mejoras
            this.onMejorasUpdated(() => {
                console.log('🔧 Evento de mejoras actualizado detectado, recargando listado...');
                this.recargarDatos();
            });
        } catch (error) {
            console.error('Error al montar el componente:', error);
        }
    },

    methods: {
        
        ...mapActions(['updateIdMejora']), 

        // Método para recargar los datos de la tabla
        async recargarDatos() {
            try {
                console.log('Recargando datos...');
                await this.recuperaMejoras(this.getIdPredio);
            } catch (error) {
                console.error('Error al recargar los datos:', error);
            }
        },

        // Método para obtener las mejoras de un predio
        async recuperaMejoras(idPredio) {
            try {
                if (!idPredio || String(idPredio).trim() === '') {
                    console.log('idPredio no está definido o está vacío');
                    return;
                }
                const response = await axios.get(`${API_BASE_URL}/vista_mejoras_by_idPredio/${idPredio}`);
                this.mejoras = response.data;
            } catch (error) {
                console.error('Error al obtener el listado de mejoras:', error);
            }
        },

        selectMejora(id_mejoras) {
            this.$store.dispatch('updateIdMejora', id_mejoras);
            this.$emit('navigateToMejoras'); 
        },
    }
};
</script>

<style scoped>
.urbano-container {
    background-color: #114358;
}
.rural-container {
    background-color: #668A4C;
}

.urbano-btn {
    background-color: #276E90;
    color: #ffffff;
}
.rural-btn {
    background-color: #4C7031;
    color: #ffffff;
}

.urbano-block {
    background-color: #F1ECE7;
    color: #114358;
}
.rural-block {
    background-color: #F1ECE7;
    color: #4C7031;
}

.centered-title {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    text-align: center;
    font-size: 1rem;
}
.urbano-title {
    background-color: #276E90;
    color: #F1ECE7;
    font-weight: bold;
}
.rural-title {
    background-color: #4C7031;
    color: #F1ECE7;
    font-weight: bold;
}

.titulo-pantalla {
    font-size: 2rem;
    color: #ffffff;
}

.v-data-table-header th {
    color: black !important;
}

.selected-row {
    background-color: #114358; 
    color: white;
}

</style>