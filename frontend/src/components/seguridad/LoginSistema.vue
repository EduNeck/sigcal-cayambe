<template>
  <div class="login-layout">
    <v-app>
      <v-container fluid fill-height>
        <v-row align="center" justify="center">
          <v-col cols="12" md="4">
            <v-card>
              <v-card-title class="text-h5">Login</v-card-title>
              <v-card-text>
                <slot></slot>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-app>
  </div>
</template>

<script>
export default {
  name: "LoginLayout",
};
</script>

<style scoped>
.login-layout {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #b43838;
}
</style>
