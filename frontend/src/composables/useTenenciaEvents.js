import { ref, watch, readonly } from 'vue'

// Estado reactivo global para eventos de tenencia
const tenenciaUpdated = ref(0)

export default function useTenenciaEvents() {
  // Función para emitir evento de actualización de tenencia
  const emitTenenciaUpdated = () => {
    tenenciaUpdated.value++
    console.log('🏠 Evento tenencia actualizada emitido:', tenenciaUpdated.value)
  }

  // Función para escuchar cambios de tenencia
  const onTenenciaUpdated = (callback) => {
    watch(tenenciaUpdated, callback, { immediate: false })
  }

  return {
    tenenciaUpdated: readonly(tenenciaUpdated),
    emitTenenciaUpdated,
    onTenenciaUpdated
  }
}
