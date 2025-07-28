import { ref, watch, readonly } from 'vue'

// 🔧 Estado reactivo global para eventos de mejoras - CACHE REFRESH  
const mejorasUpdated = ref(0)

// Composable para manejar eventos de mejoras
export function useMejorasEvents() {
  // Función para emitir evento de actualización de mejoras
  const emitMejorasUpdated = () => {
    mejorasUpdated.value++
    console.log('🔧 Evento mejoras actualizada emitido:', mejorasUpdated.value)
  }

  // Función para escuchar cambios de mejoras
  const onMejorasUpdated = (callback) => {
    watch(mejorasUpdated, callback, { immediate: false })
  }

  return {
    mejorasUpdated: readonly(mejorasUpdated),
    emitMejorasUpdated,
    onMejorasUpdated
  }
}
