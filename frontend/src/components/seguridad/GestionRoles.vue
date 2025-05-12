<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" sm="10" md="8">
        <v-card>
          <v-card-title class="headline primary--text">Gestión de Roles</v-card-title>
          <v-card-text>
            <v-data-table
              :headers="headers"
              :items="roles"
              item-value="role"
              class="elevation-1"
              dense
            >
              <template v-slot:[`item.canNavigate`]="{ item }">
                <v-switch
                  v-model="item.canNavigate"
                  color="success"
                  label="Navegar"
                ></v-switch>
              </template>
              <template v-slot:[`item.canUseButtons`]="{ item }">
                <v-switch
                  v-model="item.canUseButtons"
                  color="success"
                  label="Usar Botones"
                ></v-switch>
              </template>
            </v-data-table>
          </v-card-text>
          <v-card-actions class="justify-center">
            <v-btn color="success" @click="guardarCambios">Guardar Cambios</v-btn>
            <v-btn color="primary" @click="salir">Salir</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { rolesConfig } from '@/config/rolesConfig';

export default {
  name: 'GestionRoles',
  data() {
    return {
      roles: Object.entries(rolesConfig).map(([role, permissions]) => ({
        role,
        ...permissions,
      })),
      headers: [
        { text: 'Rol', value: 'role' },
        { text: 'Navegar', value: 'canNavigate', sortable: false },
        { text: 'Usar Botones', value: 'canUseButtons', sortable: false },
      ],
    };
  },
  methods: {
    guardarCambios() {
      const updatedRoles = {};
      this.roles.forEach((role) => {
        updatedRoles[role.role] = {
          canNavigate: role.canNavigate,
          canUseButtons: role.canUseButtons,
        };
      });

      // Convertir los datos a JSON
      const jsonData = JSON.stringify(updatedRoles, null, 2);

      // Crear un blob con los datos JSON
      const blob = new Blob([jsonData], { type: 'application/json' });

      // Crear un enlace para descargar el archivo
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'rolesConfig.json'; 
      link.click();

      console.log('Roles guardados en archivo local:', updatedRoles);
    },
    salir() {
      this.$router.push('/menu-admin'); 
    },
  },
};
</script>

<style scoped>
.v-container {
  margin-top: 20px;
}
</style>