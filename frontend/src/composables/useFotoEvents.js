import { ref, watch, readonly } from 'vue'

// Estado reactivo global para eventos de foto
const fotoUpdated = ref(0)

export default function useFotoEvents() {
  // Función para emitir evento de actualización de foto
  const emitFotoUpdated = () => {
    fotoUpdated.value++
    console.log('📸 Evento foto actualizada emitido:', fotoUpdated.value)
  }

  // Función para escuchar cambios de foto
  const onFotoUpdated = (callback) => {
    watch(fotoUpdated, callback, { immediate: false })
  }

  return {
    fotoUpdated: readonly(fotoUpdated),
    emitFotoUpdated,
    onFotoUpdated
  }
}
