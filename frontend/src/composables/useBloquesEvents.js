import { ref, watch, readonly } from 'vue'

// 🏗️ Estado reactivo global para eventos de bloques - CACHE REFRESH
const bloquesUpdated = ref(0)

// Composable para manejar eventos de bloques
export function useBloquesEvents() {
  // Función para emitir evento de actualización de bloques
  const emitBloquesUpdated = () => {
    bloquesUpdated.value++
    console.log('🏗️ Evento bloques actualizada emitido:', bloquesUpdated.value)
  }

  // Función para escuchar cambios de bloques
  const onBloquesUpdated = (callback) => {
    watch(bloquesUpdated, callback, { immediate: false })
  }

  return {
    bloquesUpdated: readonly(bloquesUpdated),
    emitBloquesUpdated,
    onBloquesUpdated
  }
}
