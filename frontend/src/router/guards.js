// Función para validar acceso a menús urbano o rural
export function puedeAccederMenu(userTipoPri, userTipoSec, path, menuAccessUrb, menuAccessRur) {
    return (
      ['U', 'R'].includes(userTipoPri) &&
      ['U', 'R'].includes(userTipoSec) &&
      (menuAccessUrb.includes(path) || menuAccessRur.includes(path))
    );
  }
  
  // Función para validar acceso a valoración
  export function puedeAccederValoracion(userValUrb, userValRur, path, menuValoraUrb, menuValoraRur) {
    return (
      (userValUrb === 'Y' && menuValoraUrb.includes(path)) ||
      (userValRur === 'Y' && menuValoraRur.includes(path))
    );
  }
  