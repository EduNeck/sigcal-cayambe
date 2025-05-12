<template>
  <v-container class="container">
    <v-row justify="center" align="center">
      <v-col cols="12" class="text-center">
        <h2 class="titulo-pantalla">Listado de Ciudadanos</h2>
      </v-col>
      <v-spacer></v-spacer>
      <v-btn color="white" class="text-primary" @click="recargaUsuario">
        <v-icon left>mdi-refresh</v-icon>Recargar
      </v-btn>
      <v-btn color="white" class="text-primary" @click="salir">
        <v-icon left>mdi-logout</v-icon>Salir
      </v-btn>
      
      <v-col cols="12">
        <v-data-table
          :headers="headers"
          :items="usuarios"
          :search="search"
          class="elevation-2 rounded-lg"
          dense
        >          
          <!-- Barra superior -->
          <template v-slot:top>
            <v-toolbar flat class="bg-primary rounded-t-lg">
              <v-toolbar-title class="white--text">Ciudadanos</v-toolbar-title>              
              <v-text-field
                v-model="search"
                append-icon="mdi-magnify"
                label="Buscar"
                single-line
                hide-details
                dense
                class="ml-4"
              ></v-text-field>
            </v-toolbar>
          </template>

          <!-- Botón de acciones -->
          <template v-slot:[`item.actions`]="{ item }">
            <v-btn icon color="primary" @click="ingresaUsuario(item.login)">
              <v-icon>mdi-pencil</v-icon>
            </v-btn>
          </template>

          <!-- Estado Activo -->
          <template v-slot:[`item.active`]="{ item }">
            <v-chip :color="item.active === 'Y' ? 'green' : item.active === 'N' ? 'red' : 'grey'" dark small>
              {{ item.active === 'Y' ? 'Activo' : item.active === 'N' ? 'Inactivo' : 'S/D' }}
            </v-chip>
          </template>

          <!-- Privilegios de Administrador -->
          <template v-slot:[`item.priv_admin`]="{ item }">
            <v-chip :color="item.priv_admin === 'Y' ? 'blue' : 'grey'" dark small>
              {{ item.priv_admin === 'Y' ? 'Sí' : item.priv_admin === 'N' ? 'No' : 'S/D' }}
            </v-chip>
          </template>

          <!-- Tipo Usuario Principal -->
          <template v-slot:[`item.priv_tipo`]="{ item }">
            <v-chip :color="item.priv_tipo === 'U' ? 'teal' : item.priv_tipo === 'R' ? 'brown' : 'grey'" dark small>
              {{ item.priv_tipo === 'U' ? 'Urbano' : item.priv_tipo === 'R' ? 'Rural' : 'S/D' }}
            </v-chip>
          </template>           

          <!-- Rol Principal -->
          <template v-slot:[`item.priv_rol`]="{ item }">
            <v-chip :color="item.priv_rol === 'E' ? 'purple' : item.priv_rol === 'C' ? 'orange' : 'grey'" dark small>
              {{ item.priv_rol === 'E' ? 'Edición' : item.priv_rol === 'C' ? 'Consulta' : 'S/D' }}
            </v-chip>
          </template>

          <!-- Tipo Usuario Secundario -->
          <template v-slot:[`item.priv_tipo_sec`]="{ item }">
            <v-chip :color="item.priv_tipo_sec === 'U' ? 'teal' : item.priv_tipo_sec === 'R' ? 'brown' : 'grey'" dark small>
              {{ item.priv_tipo_sec === 'U' ? 'Urbano' : item.priv_tipo_sec === 'R' ? 'Rural' : 'S/D' }}
            </v-chip>
          </template>          

          <!-- Rol Secundario -->
          <template v-slot:[`item.priv_rol_sec`]="{ item }">
            <v-chip :color="item.priv_rol_sec === 'E' ? 'purple' : item.priv_rol_sec === 'C' ? 'orange' : 'grey'" dark small>
              {{ item.priv_rol_sec === 'E' ? 'Edición' : item.priv_rol_sec === 'C' ? 'Consulta' : 'S/D' }}
            </v-chip>
          </template>

          <!-- Valoración Urbana -->
          <template v-slot:[`item.val_urbano`]="{ item }">
            <v-chip :color="item.val_urbano === 'Y' ? 'green' : item.val_urbano === 'N' ? 'red' : 'grey'" dark small>
              {{ item.val_urbano === 'Y' ? 'Sí' : item.val_urbano === 'N' ? 'No' : 'S/D' }}
            </v-chip>
          </template>

          <!-- Valoración Rural -->
          <template v-slot:[`item.val_rural`]="{ item }">
            <v-chip :color="item.val_rural === 'Y' ? 'green' : item.val_rural === 'N' ? 'red' : 'grey'" dark small>
              {{ item.val_rural === 'Y' ? 'Sí' : item.val_rural === 'N' ? 'No' : 'S/D' }}
            </v-chip>
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
  name: 'ListadoUsuario',
  data() {
    return {
      search: '',
      headers: [
        { title: 'Acciones', value: 'actions', sortable: false },
        { title: 'Login', value: 'login' },
        { title: 'Nombre', value: 'name' },
        { title: 'Correo Electrónico', value: 'email' },
        { title: 'Activo', value: 'active' },
        { title: 'Admin', value: 'priv_admin' },
        { title: 'Tipo Usuario', value: 'priv_tipo' },
        { title: 'Rol Primario', value: 'priv_rol' },
        { title: 'Tipo Usuario Secundario', value: 'priv_tipo_sec' },
        { title: 'Rol Secundario', value: 'priv_rol_sec' },        
        { title: 'Valoración Urbana', value: 'val_urbano' },
        { title: 'Valoración Rural', value: 'val_rural' }
      ],
      usuarios: [],
    };
  },
  created() {
    this.recargaUsuario();
  },
  methods: {
    async recargaUsuario() {
      try {
        const response = await axios.get(`${API_BASE_URL}/recuperaTodosUsuarios`);
        this.usuarios = response.data;
      } catch (error) {
        console.error('Error al recuperar los usuarios:', error);
      }
    },
    salir() {
      this.$router.push('/menu-admin');
    },
    ingresaUsuario(login = null) {
      if (login) {
        this.$router.push({ path: '/ingreso-usuarios', query: { login } });
      } else {
        this.$router.push('/ingreso-usuarios');
      }
    }
  },
};
</script>


<style scoped>
.container {
  background-color: #f5f5f5;
  min-height: 100vh;
  padding-top: 20px;
}

.titulo-pantalla {
  font-weight: bold;
  font-size: 28px;
  color: #324b21;
}

.v-data-table {
  background: white;
}

.v-toolbar {
  background-color: #324b21;
}

.v-toolbar-title {
  font-weight: bold;
}
</style>

