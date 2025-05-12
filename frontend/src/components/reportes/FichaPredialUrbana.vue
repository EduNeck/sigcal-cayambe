<template>
    <v-layout class="overflow-visible" style="height: 56px;">
      <v-bottom-navigation active>
      <v-btn         
        @click="pdf">
        <v-icon>mdi-printer</v-icon>
        PDF
      </v-btn>
      <v-btn 
        @click="salir">
        <v-icon>mdi-close</v-icon>
        Salir
      </v-btn>
      </v-bottom-navigation>
    </v-layout>

    <!-- Contenedor principal para el PDF -->
    <v-container class="pdf-wrapper" fluid>
        <div id="certificado" class="a4-container">
            <!-- Cabercera -->
            <v-row  no-gutters align="center" class="header">
                <v-col cols="2" class="logo-container">
                    <v-img
                        :src="logo"
                        alt="Logo"
                        class="logo"
                    ></v-img>
                </v-col>
                <v-col cols="10" class="text-center">
                    <h1 class="title">{{organizationName}}</h1>     
                </v-col>            
            </v-row>
            <!-- Cabercera Fin -->
            <v-divider
                :thickness="1"
                class="border-opacity-100"
                color="black"
            ></v-divider>

            <v-card class="bloques">

                <v-card-title class="block-title">
                    <p class="titulo-text-header">FICHA CATASTRAL URBANA</p>
                </v-card-title>
                <!-- Datos Predio -->
                <v-card-subtitle class="block-title-sub">
                    <p class="titulo-text-sub">Datos del predio</p>
                </v-card-subtitle>                
                <v-card-text class="styled-text">
                    <p class="styled-text"><strong>Clave Catastral: </strong> {{ form.clave_catastral }}</p>
                    <p class="styled-text"><strong>Clave Anterior: </strong> {{ form.clave_catastral_anterior }}</p>
                    <p class="styled-text"><strong>Nombre del Predio: </strong> {{ form.nombre_predio }}</p>
                </v-card-text>
                <!-- Localización -->
                <v-card-subtitle class="block-title-sub">
                    <p class="titulo-text-sub">Localización</p>
                </v-card-subtitle>
                <v-card-text class="styled-text">
                    <p class="styled-text">
                        <strong>Parroquia: </strong> {{ form.nombre_parroquia }} 
                        <strong>Sector: </strong> {{ form.sector }} 
                        <strong>Eje Principal: </strong> {{ form.eje_principal }} 
                        <strong>Eje Secundario: </strong> {{ form.eje_secundario }}                   
                    </p>                    
                </v-card-text>
                <!-- Información del predio -->
                <v-card-subtitle class="block-title-sub">
                    <p class="titulo-text-sub">Información del predio</p>
                </v-card-subtitle>
                <v-card-text>
                    <v-row>
                        <v-col cols="6" class="styled-text">
                            <p class="styled-text"><strong>Área de terreno gráfico: </strong> {{ form.area_terreno }}</p>
                            <p class="styled-text"><strong>Área de construcción: </strong> {{ form.area_comun_construida }}</p>
                        </v-col>
                        <v-col cols="6" class="styled-text">
                            <p class="styled-text"><strong>Avalúo por m2 del terreno: </strong>  m²</p>
                            <p class="styled-text"><strong>Avalúo del terreno: </strong> {{ form.valor_suelo_porcentual }} $</p>
                            <p class="styled-text"><strong>Avalúo de mejoras: </strong> {{ form.valor_adicionales_porcentual }} $</p>
                            <p class="styled-text"><strong>Avalúo de la construcción: </strong> {{ form.valor_construcciones_porcentual }} $</p>
                            <p class="styled-text"><strong>Avalúo total: </strong> {{ form.avaluo_predio_porcentual }} $</p>
                        </v-col>
                    </v-row>    
                </v-card-text>
                <!-- Propietarios -->
                <v-card-subtitle class="block-title-sub">
                    <p class="titulo-text-sub">PROPIETARIOS</p>
                </v-card-subtitle>
                <v-row>
                    <v-col cols="12">
                    <v-data-table
                        :headers="headers"
                        :items="tenenciasFicha"                                               
                        disable-pagination 
                        hide-default-footer
                        class="elevation-1 styled-text"
                                               
                    >                        
                        <template v-slot:item="{ item }">
                        <tr>                         
                            <td class="styled-text">{{ item.nombres }}</td>
                            <td class="styled-text">{{ item.numero_documento }}</td>
                            <td class="styled-text">{{ item.presenta_escritura ? 'Sí' : 'No' }}</td>
                            <td class="styled-text">{{ item.forma_propiedad }}</td>
                            <td class="styled-text">{{ item.tipo_persona }}</td>
                            <td class="styled-text">{{ item.porcentaje_participacion }}%</td>
                            <td class="styled-text">{{ item.regimen_propiedad }}</td>
                        </tr>
                        </template>
                    </v-data-table>
                    </v-col>
                </v-row>
                <!-- Caracteristicas -->
                <v-card-subtitle class="block-title-sub">
                    <p class="titulo-text-sub">CARACTERISTICAS</p>
                    <p class="titulo-text-sub">USOS DEL SUELO</p>
                </v-card-subtitle>
                <v-card-text class="styled-text">
                    <p class="styled-text">
                        <strong>GESTION: </strong> 
                        <strong> CONSUMO: </strong> {{ form.uso }}</p>
                </v-card-text>
                <v-card-subtitle class="block-title-sub">                    
                    <p class="titulo-text-sub">DESCRIPCIÓN DEL TERRENO</p>                    
                </v-card-subtitle>
                <v-card-text class="styled-text">
                    <p class="styled-text">
                            <strong>ACCESO AL LOTE: </strong> 
                            <strong> OCUPACIÓN: </strong> 
                            <strong> LOCALIZACIÓN:</strong> {{ form.localizacion }}
                    </p>         
                    <p class="styled-text">
                            <strong> TOPOGRAFIA: </strong> {{ form.topografia }}
                            <strong> VALOR CULTURAL: </strong>
                    </p>                         
                </v-card-text>
                <!-- Infraestructura -->                 
                <v-card-subtitle class="block-title-sub">                    
                    <p class="titulo-text-sub">INFRAESTRUCCTURA Y SERVICIOS BASICOS</p>                    
                </v-card-subtitle>
                <v-card-text class="styled-text">
                    <p class="styled-text"> <strong>REDES PUBLICAS EN LA VIA: </strong></p>         
                    <p class="styled-text"> <strong>ALCANTARILLADO: </strong> {{ form.sanitarias }}</p>
                    <p class="styled-text"> <strong>ENERGÍA ELECTRICA: </strong> {{ form.energia }}</p>
                    <p class="styled-text"> <strong>ABASTECIMIENTO AGUA: </strong> {{ form.agua }}</p>                    
                </v-card-text>   
                <!-- Bloques -->
                <v-card-subtitle class="block-title-sub">
                    <p class="titulo-text-sub">EDIFICACIONES</p>
                </v-card-subtitle>
                <v-row>
                    <v-col cols="12">
                    <v-data-table
                        :headers="headers_blq"
                        :items="bloquesFicha"
                        disable-pagination 
                        hide-default-footer
                        class="elevation-1 styled-text"                                               
                    >                        
                        <template v-slot:item="{ item }">
                        <tr>                   
                            <td class="styled-text">{{ item.cod_uni }}</td>
                            <td class="styled-text">{{ item.cod_bloq }}</td>
                            <td class="styled-text">{{ item.cod_piso }}</td>
                            <td class="styled-text">{{ item.tipo_piso }}</td>
                            <td class="styled-text">{{ item.condicion_fisica }}</td>
                            <td class="styled-text">{{ item.estado_conservacion }}</td>                
                            <td class="styled-text">{{ item.ocupacion }}</td>
                            <td class="styled-text">{{ item.anio_construccion }}</td>                
                            <td class="styled-text">{{ item.area_construida }}</td>
                        </tr>
                        </template>
                    </v-data-table>
                    </v-col>
                </v-row>
                <!-- Vias -->
                <v-card-subtitle class="block-title-sub">                    
                    <p class="titulo-text-sub">VIAS</p>                    
                </v-card-subtitle>
                <v-row>
                    <v-col cols="12">
                    <v-data-table
                        :headers="headers_vias"
                        :items="viasFicha"                                               
                        disable-pagination 
                        hide-default-footer
                        class="elevation-1 styled-text"                                               
                    >                        
                        <template v-slot:item="{ item }">
                        <tr>                            
                            <td class="styled-text">{{ item.via_principal }}</td>
                            <td class="styled-text">{{ item.via_secundaria }}</td>
                            <td class="styled-text">{{ item.nombre_via }}</td>
                            <td class="styled-text">{{ item.longitud }}</td>
                            <td class="styled-text">{{ item.tipo_via }}</td>
                            <td class="styled-text">{{ item.material_via }}</td>
                            <td class="styled-text">{{ item.aceras_bordillos }}</td>
                            <td class="styled-text">{{ item.num_inmueble }}</td>                                                   
                        </tr>
                        </template>
                    </v-data-table>
                    </v-col>
                </v-row>  
                <!-- Mejoras -->
                <v-card-subtitle class="block-title-sub">
                    <p class="titulo-text-sub">MEJORAS</p>                    
                </v-card-subtitle>
                <v-row>
                    <v-col cols="12">
                    <v-data-table
                        :headers="headers_mjr"
                        :items="mejorasFicha"
                        disable-pagination 
                        hide-default-footer
                        class="elevation-1 styled-text"                                               
                    >                        
                        <template v-slot:item="{ item }">
                        <tr>                                              
                            <td class="styled-text">{{ item.tipo }}</td>
                            <td class="styled-text">{{ item.material }}</td>
                            <td class="styled-text">{{ item.area }}</td>
                            <td class="styled-text">{{ item.estado }}</td>                                
                        </tr>
                        </template>
                    </v-data-table>
                    </v-col>
                </v-row>                
            
                <!-- Informantes -->
                <v-card-subtitle class="block-title-sub">                    
                    <p class="titulo-text-sub">INFORMANTES</p>                    
                </v-card-subtitle>
                <v-card-text class="styled-text">
                    <p class="styled-text"> <strong>NOMBRE: </strong></p>         
                </v-card-text>       
                <!-- Linderos -->
                <v-card-subtitle class="block-title-sub">                    
                    <p class="titulo-text-sub">LINDEROS</p>                    
                </v-card-subtitle>
                <v-row>
                    <v-col cols="12">
                    <v-data-table
                        :headers="headers_lind"
                        :items="tenenciasFicha"                                               
                        disable-pagination 
                        hide-default-footer
                        class="elevation-1 styled-text"
                                               
                    >                        
                        <template v-slot:item="{ item }">
                        <tr>                         
                            <td class="styled-text">{{ item.nombres }}</td>
                            <td class="styled-text">{{ item.lindero_norte }}</td>
                            <td class="styled-text">{{ item.lindero_sur }}</td>                            
                            <td class="styled-text">{{ item.lindero_este }}</td>
                            <td class="styled-text">{{ item.lindero_oeste }}</td>                            
                        </tr>
                        </template>
                    </v-data-table>
                    </v-col>
                </v-row>            
                <!-- Planimetria -->
                <v-card-subtitle class="block-title-sub">
                    <p class="titulo-text-sub">PLANIMETRIA</p>                    
                </v-card-subtitle>
                <v-card-text>
                    <div class="ma-4 d-flex" >
                        <!-- Foto Predio -->
                        <v-img v-if="fotoRecuperadaUrl" :src="fotoRecuperadaUrl" class="custom-img">Foto Predio</v-img>
                        <v-img v-else :src="sinFoto" class="custom-img">Sin Foto</v-img>
                        <!-- Croquis Predio -->
                        <v-img v-if="croquis" :src="sinCroquis" class="custom-img" >Croquis Predio</v-img>
                        <v-img v-else :src="sinCroquis" class="custom-img">Sin Croquis</v-img>
                    </div>
                </v-card-text>

                <!-- Pie de página -->
                <v-footer class="footer">
                    <p class="footer-text">Página {{ currentPage }} de {{ totalPages }}</p>
                </v-footer>

                <!-- Salto de hoja -->
                <div class="page-break"></div>
                <!-- FIN -->
            </v-card>
        </div>        
    </v-container>

</template>

<script>

import axios from 'axios';
import { textVariables } from '@/config/textVariables';
import html2pdf from 'html2pdf.js';
import logo from '@/assets/logo_ventana.png';
import sinFoto from '@/assets/sin-foto.png';
import sinCroquis from '@/assets/sin-croquis.png';

export default {
    name: 'FichaPredialUrbana',
    data() {
        return {
            organizationName: textVariables.organizationName,
            tenenciasFicha: [],  
            bloquesFicha: [],    
            mejorasFicha: [],
            viasFicha: [],
            logo: logo,
            sinFoto: sinFoto,
            sinCroquis: sinCroquis,
            form: {
                id_predio: null, 
                clave_catastral: null, 
                clave_catastral_anterior: null, 
                tipo_predio: null, 
                regimen_propiedad: null, 
                alicuota: null, 
                area_terreno: null, 
                area_comun_terreno: null, 
                unidad: null, 
                area_individual_construida: null, 
                area_comun_construida: null, 
                eje_principal: null, 
                eje_secundario: null, 
                sector: null, 
                porcentaje_cobertura_principal: null, 
                porcentaje_cobertura_secundaria: null, 
                tiene_medidor_agua: null, 
                tiene_medidor_energia: null, 
                uso: null, 
                forma: null, 
                localizacion: null, 
                cobertura_natural: null, 
                ecosistema_relevante: null, 
                disponibilidad_riego: null, 
                cobertura_principal: null, 
                cobertura_secundaria: null, 
                agua: null, 
                sanitarias: null, 
                energia: null, 
                transporte_urbano: null, 
                eliminacion_basura: null, 
                telefonia_fija: null, 
                telefonia_movil: null, 
                telefonia_satelital: null, 
                internet: null, 
                id_actualizador: null, 
                actualizador: null, 
                nombre_informador: null, 
                observaciones: null, 
                digitador: null, 
                fecha_registro: null, 
                num_medidores_agua: null, 
                num_medidores_energia: null, 
                documento_propietario: null, 
                propietario: null, 
                fecha_fiscalizacion: null, 
                id_fiscalizador: null, 
                fiscalizador: null, 
                fecha_actualizacion: null, 
                foto: null, 
                tipo_persona: null, 
                personeria: null, 
                topografia: null, 
                condicion_ocupacion: null, 
                recolec_aguas_lluvia: null, 
                nombre_canton: null, 
                nombre_parroquia: null,
                // Datos de valoracion
                area_suelo_porcentual: null,
                area_construcciones_porcentual: null,
                valor_suelo_porcentual : null,
                valor_construcciones_porcentual: null,
                valor_instalaciones_porcentual: null,
                valor_adicionales_porcentual: null,
                avaluo_predio_porcentual: null,
            },

            headers: [                                
                { title: 'Nombres', value: 'nombre' },
                { title: 'Número de Documento', value: 'numero_documento' },
                { title: 'Presenta Escritura', value: 'presenta_escritura' },
                { title: 'Forma de Propiedad', value: 'forma_propiedad' },
                { title: 'Tipo de Persona', value: 'tipo_persona' },
                { title: 'Porcentaje de Participación', value: 'porcentaje_participación' },
                { title: 'Régimen de Propiedad', value: 'regimen_propiedad' },
            ],

            headers_blq: [                                                
                { title: 'Código Unidad', value: 'cod_uni' },
                { title: 'Código Bloque', value: 'cod_bloq' },
                { title: 'Código Piso', value: 'cod_piso' },
                { title: 'Tipo de Piso', value: 'id_tipo_piso' },
                { title: 'Condición Física', value: 'id_condicion_fisica' },
                { title: 'Estado de Conservación', value: 'id_estado_conservacion' },        
                { title: 'Ocupación', value: 'id_ocupacion' },
                { title: 'Año de Construcción', value: 'anio_construccion' },        
                { title: 'Área Construida', value: 'area_construida' }
            ],   

            headers_mjr: [                                
                { title: 'Tipo Obra', value: 'tipo_obra' },
                { title: 'Material', value: 'material' },
                { title: 'Área', value: 'area' },
                { title: 'Estado', value: 'estado' },                
            ],

            headers_lind: [          
                { title: 'Nombres', value: 'nombre' },      
                { title: 'Lindero Norte', value: 'lindero_norte' },
                { title: 'Lindero Sur', value: 'lindero_sur' },
                { title: 'Lindero Este', value: 'lindero_este' },
                { title: 'Lindero Oeste', value: 'lindero_oeste' },
            ],
            headers_vias: [                                
                { title: 'Vía Principal', value: 'via_principal' },
                { title: 'Vía Secundaria', value: 'via_secundaria' },
                { title: 'Nombre de Vía', value: 'nombre_via' },
                { title: 'Longitud', value: 'longitud' },
                { title: 'Tipo de Vía', value: 'tipo_via' },
                { title: 'Aceras y Bordillos', value: 'aceras_bordillos' },
                { title: 'Material de Vía', value: 'material_via' },        
                { title: 'Número de Inmueble', value: 'num_inmueble' }
            ],     
            fotoRecuperadaUrl: '',
            croquis: '',            
            currentPage: 1,
            totalPages: 1, 
        };
    },
    
    methods: {
        
        // Método para recuperar los datos del predio desde la API
        async recuperaDatosPredio(idPredio) {
            try {
                const response = await axios.get(`http://localhost:3001/api/ficha_predio/${idPredio}`);
                const predioFicha=response.data; 
                console.log('Datos del predio:', predioFicha);                
                this.form = {
                    ...this.form,
                    clave_catastral: predioFicha.clave_catastral,
                    clave_catastral_anterior: predioFicha.clave_catastral_anterior,
                    tipo_predio: predioFicha.tipo_predio,
                    regimen_propiedad: predioFicha.regimen_propiedad,
                    alicuota: predioFicha.alicuota,
                    area_terreno: predioFicha.area_terreno,
                    area_comun_terreno: predioFicha.area_comun_terreno,
                    unidad: predioFicha.unidad,
                    area_individual_construida: predioFicha.area_individual_construida,
                    area_comun_construida: predioFicha.area_comun_construida,
                    eje_principal: predioFicha.eje_principal,
                    eje_secundario: predioFicha.eje_secundario,
                    sector: predioFicha.sector,
                    porcentaje_cobertura_principal: predioFicha.porcentaje_cobertura_principal,
                    porcentaje_cobertura_secundaria: predioFicha.porcentaje_cobertura_secundaria,
                    tiene_medidor_agua: predioFicha.tiene_medidor_agua,
                    tiene_medidor_energia: predioFicha.tiene_medidor_energia,
                    uso: predioFicha.uso,
                    forma: predioFicha.forma,
                    localizacion: predioFicha.localizacion,
                    cobertura_natural: predioFicha.cobertura_natural,
                    ecosistema_relevante: predioFicha.ecosistema_relevante,
                    disponibilidad_riego: predioFicha.disponibilidad_riego,
                    cobertura_principal: predioFicha.cobertura_principal,
                    cobertura_secundaria: predioFicha.cobertura_secundaria,
                    agua: predioFicha.agua,
                    sanitarias: predioFicha.sanitarias,
                    energia: predioFicha.energia,
                    transporte_urbano: predioFicha.transporte_urbano,
                    eliminacion_basura: predioFicha.eliminacion_basura,
                    telefonia_fija: predioFicha.telefonia_fija,
                    telefonia_movil: predioFicha.telefonia_movil,
                    telefonia_satelital: predioFicha.telefonia_satelital,
                    internet: predioFicha.internet,
                    id_actualizador: predioFicha.id_actualizador,
                    actualizador: predioFicha.actualizador,
                    nombre_informador: predioFicha.nombre_informador,
                    observaciones: predioFicha.observaciones,
                    digitador: predioFicha.digitador,
                    fecha_registro: predioFicha.fecha_registro,
                    num_medidores_agua: predioFicha.num_medidores_agua,
                    num_medidores_energia: predioFicha.num_medidores_energia,
                    documento_propietario: predioFicha.documento_propietario,
                    propietario: predioFicha.propietario,
                    fecha_fiscalizacion: predioFicha.fecha_fiscalizacion,
                    id_fiscalizador: predioFicha.id_fiscalizador,
                    fiscalizador: predioFicha.fiscalizador,
                    fecha_actualizacion: predioFicha.fecha_actualizacion,
                    foto: predioFicha.foto,
                    tipo_persona: predioFicha.tipo_persona,
                    personeria: predioFicha.personeria,
                    topografia: predioFicha.topografia,
                    condicion_ocupacion: predioFicha.condicion_ocupacion,
                    recolec_aguas_lluvia: predioFicha.recolec_aguas_lluvia,
                    nombre_canton: predioFicha.nombre_canton,
                    nombre_parroquia: predioFicha.nombre_parroquia
                };

                return predioFicha;
            } catch (error) {
                console.error('Error al recuperar los datos del predio:', error);
                throw error;
            }
        },

        // Método para recuperar los datos de tenencia desde la API
        async recuperaDatosTenencia(idPredio) {   
            console.log('Recuperando tenencias...');
            try {
                if (!idPredio) {
                    console.log('idPredio no está definido, no es una cadena de texto o está vacío');
                    return;
                }
                const response = await axios.get(`http://localhost:3001/api/ficha_tenencia/${idPredio}`);
                this.tenenciasFicha = response.data;
            } catch (error) {
                console.warn('Datos de tenencia faltantes para el predio:', idPredio);
                this.tenenciasFicha = [];
            }
        },        

        // Método para recuperar los datos de tenencia desde la APIn 
        async recuperaDatosBloques(idPredio) {   
            console.log('Recuperando Bloques...');
            try {
                if (!idPredio) {
                    console.log('idPredio no está definido, no es una cadena de texto o está vacío');
                    return;
                }
                const response = await axios.get(`http://localhost:3001/api/ficha_bloques/${idPredio}`);
                this.bloquesFicha = response.data;
            } catch (error) {
                console.warn('Datos de bloques faltantes para el predio:', idPredio);
                this.bloquesFicha = [];
            }
        },            

        // Método para recuperar los datos de tenencia desde la APIn 
        async recuperaDatosMejoras(idPredio) {   
            console.log('Recuperando Mejoras...');
            try {
                if (!idPredio) {
                    console.log('idPredio no está definido, no es una cadena de texto o está vacío');
                    return;
                }
                const response = await axios.get(`http://localhost:3001/api/ficha_mejoras/${idPredio}`);
                this.mejorasFicha = response.data;
            } catch (error) {
                console.warn('Datos de mejoras faltantes para el predio:', idPredio);
                this.mejorasFicha = [];
            }
        }, 

        // Método para recuperar los datos de tenencia desde la APIn 
        async recuperaDatosVias(idPredio) {   
            console.log('Recuperando Vias...');
            try {
                if (!idPredio) {
                    console.log('idPredio no está definido, no es una cadena de texto o está vacío');
                    return;
                }
                const response = await axios.get(`http://localhost:3001/api/ficha_vias/${idPredio}`);
                this.viasFicha = response.data;
            } catch (error) {
                console.warn('Datos de vías faltantes para el predio:', idPredio);
                this.viasFicha = [];
            }
        },
        
        // Método para recuperar los datos del predio desde la API
        async recuperaDatosValoracion(idPredio) {
            try {
                const response = await axios.get(`http://localhost:3001/api/patrimonio-urbano/${idPredio}`);
                const patrimonioFicha = response.data; 
                console.log('Datos del predio:', patrimonioFicha);                
                this.form = {
                    ...this.form,                    
                    area_suelo_porcentual: patrimonioFicha.area_suelo_porcentual, 
                    area_construcciones_porcentual: patrimonioFicha.area_construcciones_porcentual, 
                    valor_suelo_porcentual: patrimonioFicha.valor_suelo_porcentual, 
                    valor_construcciones_porcentual: patrimonioFicha.valor_construcciones_porcentual, 
                    valor_instalaciones_porcentual: patrimonioFicha.valor_instalaciones_porcentual, 
                    valor_adicionales_porcentual: patrimonioFicha.valor_adicionales_porcentual, 
                    avaluo_predio_porcentual: patrimonioFicha.avaluo_predio_porcentual,
                };

                return patrimonioFicha;
            } catch (error) {
                console.warn('Error al recuperar los datos de valoracion:', error);
                this.patrimonioFicha = [];
            }
        },        


        async recuperaFotos(idPredio) {      
            try {
                const response = await axios.get(`http://localhost:3001/api/fotos_by_idPredio/${idPredio}`);
                const data = response.data;
                if (data.length > 0) {
                const fotosPredio = data[0];                    

                if (fotosPredio.foto) {
                    // Verificar si la imagen ya está en Base64
                    if (typeof fotosPredio.foto === "string") {
                    this.fotoRecuperadaUrl = `data:image/png;base64,${fotosPredio.foto}`;
                    } else if (fotosPredio.foto.data) {
                    // Convertir bytea a Blob y luego a URL
                    const byteArray = new Uint8Array(fotosPredio.foto.data);
                    const blob = new Blob([byteArray], { type: 'image/png' });
                    this.fotoRecuperadaUrl = URL.createObjectURL(blob);
                    }            
                    this.fotoRecuperadaUrl = `data:image/png;base64,${fotosPredio.foto}`;
                } else {
                    this.fotoRecuperadaUrl = '';
                    this.snackbarNota = 'No se encontró una imagen asociada';
                    this.snackbarNotaPush = true;
                }
                } else {
                this.snackbarNota = 'No se encontraron fotos para este predio';
                this.snackbarNotaPush = true;
                this.fotoRecuperadaUrl = '';
                }
            } catch (error) {
                console.error('Error al recuperar la foto:', error);
                this.snackbarError = 'Error al recuperar la foto';
                this.snackbarErrorPush = true;
            }
        },

        salir() {
            this.$router.go(-1);
        },

        pdf() {
            console.log('Generando PDF...');
            const element = document.getElementById('certificado');
            const opt = {
                margin: [0, 0, 0, 0],
                filename: `certificado_${this.form.clave_catastral}.pdf`,
                image: { type: 'jpeg', quality: 0.98 },
                html2canvas: { scale: 3 },
                jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
                pagebreak: { mode: ['css', 'legacy'] } // Asegura que respete los saltos de página
            };
            html2pdf().from(element).set(opt).save();
        },        

       
        calculateTotalPages() {
            const element = document.getElementById('certificado');
            const pageHeight = 297; // Altura de una hoja A4 en mm
            const contentHeight = element.scrollHeight; // Altura total del contenido
            this.totalPages = Math.ceil(contentHeight / pageHeight); // Calcula el número total de páginas            
        },
        
    },
    
    async mounted() {  
        this.calculateTotalPages();
    },

    created() {
        const idPredio = this.$route.query.idPredio;
        if (idPredio) {
            this.idPredio = idPredio;
            console.log('ID del predio recibido:', idPredio);
            this.recuperaDatosPredio(idPredio);
            this.recuperaDatosTenencia(idPredio);
            this.recuperaDatosBloques(idPredio);
            this.recuperaDatosMejoras(idPredio);
            this.recuperaDatosVias(idPredio);
            this.recuperaDatosValoracion(idPredio);
            this.recuperaFotos(idPredio);
        } else {
            console.error('No se recibió un ID de predio válido.');
        }
    },
};
</script>

<style>

.pdf-wrapper {
    display: flex;
    justify-content: center;
    align-items: flex-start; 
    min-height: 100vh;
    background-color: #b9b6b6; 
    padding: 20px;
}

.a4-container {
    width: 210mm;    
    padding: 5mm;
    box-sizing: border-box;
    background: white;
    overflow: auto;
    margin: 5px auto; 
    box-shadow: 0 0 10px rgba(20, 199, 50, 0.1); 
}

.title {
    font-size: 14px;
    font-weight: bold;
    color:#114358;
    text-align: center;
}

.logo {
    max-width: 40%;
    height: 50%;
}

.titulo-text-header {
    text-align: center;
    font-size: 12px;
    color: #000000;
    font-weight: bold;
    background-color: #929292;
    padding: 0px 0px 0px 0px;            
}

.titulo-text-sub {
    text-align: left;
    font-size: 11px;
    color: #000000;
    font-weight: bold;
    background-color: #b9b9b9;    
    padding: 0px 0px 0px 0px;
}

.bloques {
    margin: 0px 0px 0px 0px;
    padding: 0px 0px 0px 0px;
    background-color: #ffffff;
    border-radius: 0px;
}

.block-title {
    padding: 0px 0px 0px 0px;
}

.block-title-sub {  
    padding: 0px 0px 0px 0px;
}

.styled-text {
    font-size: 11px; 
    color: #000000;
    margin-top: 1px;  
    padding: 1px 1px 1px 1px;
}

.custom-img {
  width: 250px;
  height: 250px; 

  /* Texto */ 
  text-align: center;
  font-size: 1rem;
  color: #276E90;  
  font-weight: bold;
  text-shadow: 2px 2px 5px rgba(0, 0, 0, 0.5);
}

.footer {
  text-align: center;
  font-size: 12px;
  color: #000;
  margin-top: 20px;
}

.footer-text {
  font-weight: bold;
}

.page-break {
  page-break-after: always;
}

</style>