<template>
  <v-container fluid>
    <v-btn
      color="error"
      class="ma-2"
      @click="salirDelVisor"
    >
      Salir del visor
    </v-btn>

    <div id="mapa" style="height: 90vh; width: 100%;"></div>
  </v-container>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

const router = useRouter()

function salirDelVisor() {
  router.push('/menu-predial') // Cambia la ruta según tu menú o layout
}

onMounted(() => {
  const map = L.map('mapa').setView([-0.13600, -78.47973], 17)

  const osm = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap',
    maxZoom: 19
  }).addTo(map)

  const geoServerUrl = "http://localhost:8090/geoserver/esp_quito/wms"

  const capaCalles = L.tileLayer.wms(geoServerUrl, {
    layers: 'esp_quito:calle',
    format: 'image/png',
    transparent: true,
    attribution: 'GeoServer - Calles'
  })

  const capaManzanas = L.tileLayer.wms(geoServerUrl, {
    layers: 'esp_quito:manzana',
    format: 'image/png',
    transparent: true,
    attribution: 'GeoServer - Manzanas'
  })

  const capaParques = L.tileLayer.wms(geoServerUrl, {
    layers: 'esp_quito:parques',
    format: 'image/png',
    transparent: true,
    attribution: 'GeoServer - Parques'
  })

  L.control.layers(
    { "OpenStreetMap": osm },
    {
      "Calles": capaCalles,
      "Manzanas": capaManzanas,
      "Parques": capaParques
    }
  ).addTo(map)

  capaCalles.addTo(map)
  capaManzanas.addTo(map)
  capaParques.addTo(map)

   /*
  const iconoPersonalizado = L.icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/684/684908.png',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -30]
  })

  const marcador = L.marker([-0.13600, -78.47973], { icon: iconoPersonalizado }).addTo(map)
  marcador.bindPopup("📍 Punto de interés central")
  */ 
})
</script>
