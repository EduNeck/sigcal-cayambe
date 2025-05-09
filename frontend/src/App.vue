<template>
  <v-app>    
    <router-view />    
  </v-app>
</template>

<script>
export default {
  name: "App",
};
</script>
<style>
.v-application {
  background-color: #E0E0E0 !important;
}


.v-main {
  background-color: #E0E0E0 !important;
}


html, body {
  margin: 0;
  padding: 0;
  min-height: 100vh;
}
</style>