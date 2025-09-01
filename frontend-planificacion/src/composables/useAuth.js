import { ref, computed, onMounted } from 'vue';

export function useAuth() {
  const user = ref(null);
  const token = ref(null);
  const isAuthenticated = computed(() => !!token.value);

  // Función para obtener el usuario desde el localStorage
  const loadUserFromStorage = () => {
    try {
      const userJson = localStorage.getItem('user');
      const storedToken = localStorage.getItem('token');
      
      if (userJson) {
        user.value = JSON.parse(userJson);
        console.log('Usuario cargado desde localStorage:', user.value);
      } else {
        console.warn('No se encontró información de usuario en localStorage');
        
        // Si hay token pero no hay usuario, podemos crear un usuario predeterminado
        if (storedToken && !user.value) {
          user.value = {
            id: 'default',
            nombre: 'Usuario',
            roles: ['user']
          };
          // Guardamos este usuario predeterminado para futuros usos
          localStorage.setItem('user', JSON.stringify(user.value));
          console.log('Se creó un usuario predeterminado porque hay token pero no hay usuario');
        }
      }
      
      if (storedToken) {
        token.value = storedToken;
        console.log('Token cargado desde localStorage');
      } else {
        console.warn('No se encontró token en localStorage');
      }
    } catch (error) {
      console.error('Error al cargar el usuario desde localStorage:', error);
    }
  };

  // Cargar el usuario al inicializar el hook
  onMounted(() => {
    loadUserFromStorage();
  });

  return {
    user,
    token,
    isAuthenticated,
    loadUserFromStorage
  };
}
