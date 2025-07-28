import { ref, watch, readonly } from 'vue'

// ARCHIVO ACTUALIZADO - Estado reactivo global para eventos de vías  
const viasUpdated = ref(0)

// Composable para manejar eventos de vías - VERSIÓN FINAL
export function useViasEvents() {
  // Función para emitir evento de actualización de vías
  const emitViasUpdated = () => {
    viasUpdated.value++
    console.log('🛣️ Evento vías actualizada emitido:', viasUpdated.value)
  }

  // Función para escuchar cambios de vías
  const onViasUpdated = (callback) => {
    watch(viasUpdated, callback, { immediate: false })
  }

  return {
    viasUpdated: readonly(viasUpdated),
    emitViasUpdated,
    onViasUpdated
  }
}

// Final del archivo
