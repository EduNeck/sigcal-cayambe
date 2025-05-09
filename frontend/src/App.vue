<template>
  <v-app>
    <v-app-bar app color="primary" dark>
      <v-toolbar-title>SIGCAL Cayambe</v-toolbar-title>
      <v-spacer />
      <v-btn to="/" text>Inicio</v-btn>
      <v-btn to="/about" text>Acerca de</v-btn>
    </v-app-bar>
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>
