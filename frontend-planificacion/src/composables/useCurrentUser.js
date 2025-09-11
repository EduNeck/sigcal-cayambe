import { ref, computed, onMounted } from 'vue';

export function useCurrentUser() {
  const currentUser = ref(null);
  
  // Función para obtener el usuario desde localStorage
  const loadUserFromStorage = () => {
    try {
      const userJson = localStorage.getItem('user');
      
      if (userJson) {
        try {
          const parsedUser = JSON.parse(userJson);
          currentUser.value = parsedUser;
          console.log('Usuario cargado correctamente:', currentUser.value);
        } catch (parseError) {
          console.error('Error al parsear el usuario desde localStorage:', parseError);
          // Si no podemos parsear, usamos el string como nombre de usuario
          currentUser.value = {
            usuario: userJson,
            nombre: userJson
          };
        }
      } else {
        console.warn('No se encontró información de usuario en localStorage, usando usuario por defecto');
        currentUser.value = {
          usuario: 'sistema',
          nombre: 'Usuario del Sistema'
        };
      }
    } catch (error) {
      console.error('Error al cargar el usuario desde localStorage:', error);
      currentUser.value = {
        usuario: 'sistema',
        nombre: 'Usuario del Sistema'
      };
    }
  };

  // Cargar el usuario al inicializar el hook
  onMounted(() => {
    loadUserFromStorage();
  });

  // Método para obtener el nombre de usuario para almacenarlo en registros
  const getUsernameForRecord = computed(() => {
    if (!currentUser.value) return 'sistema';
    
    // Priorizar diferentes propiedades que podrían contener el nombre de usuario
    return currentUser.value.usuario || 
           currentUser.value.username ||
           currentUser.value.user || 
           currentUser.value.nombre || 
           currentUser.value.name || 
           'sistema';
  });

  // Método para obtener el nombre completo para mostrar en la interfaz
  const getDisplayName = computed(() => {
    if (!currentUser.value) return 'Usuario del Sistema';
    
    // Priorizar nombre completo sobre el nombre de usuario
    return currentUser.value.nombres || 
           currentUser.value.fullName || 
           currentUser.value.nombre ||
           currentUser.value.name ||
           currentUser.value.usuario || 
           currentUser.value.username || 
           'Usuario del Sistema';
  });

  return {
    currentUser,
    getUsernameForRecord,
    getDisplayName,
    loadUserFromStorage
  };
}
