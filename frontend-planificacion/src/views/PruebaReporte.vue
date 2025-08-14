<template>
  <div class="prueba-reporte">
    <h2>Prueba del Reporte ICUS</h2>
    
    <div class="controles">
      <label for="icusId">ID del ICUS:</label>
      <input 
        id="icusId"
        v-model="icusIdSeleccionado" 
        type="number" 
        placeholder="ID por defecto: 15"
        min="1"
      />
      <button @click="mostrarReporte" :disabled="!icusIdSeleccionado">
        Mostrar Reporte
      </button>
    </div>

    <div v-if="mostrarComponente" class="reporte-container">
      <ReporteIcus :icusId="icusIdSeleccionado" />
    </div>
  </div>
</template>

<script>
import ReporteIcus from '@/components/ReporteIcus.vue'

export default {
  name: 'PruebaReporte',
  components: {
    ReporteIcus
  },
  data() {
    return {
      icusIdSeleccionado: 15,
      mostrarComponente: true
    }
  },
  methods: {
    mostrarReporte() {
      if (this.icusIdSeleccionado) {
        this.mostrarComponente = true
      }
    }
  }
}
</script>

<style scoped>
.prueba-reporte {
  padding: 20px;
}

.controles {
  margin-bottom: 30px;
  display: flex;
  gap: 10px;
  align-items: center;
}

.controles label {
  font-weight: bold;
}

.controles input {
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  width: 200px;
}

.controles button {
  padding: 8px 16px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.controles button:hover:not(:disabled) {
  background-color: #0056b3;
}

.controles button:disabled {
  background-color: #6c757d;
  cursor: not-allowed;
}

.reporte-container {
  margin-top: 20px;
  border-top: 2px solid #dee2e6;
  padding-top: 20px;
}
</style>
