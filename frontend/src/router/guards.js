export function puedeAccederMenu(userTipoPri, userTipoSec, path, menuAccessUrb, menuAccessRur) {
  // Admin accede a todo
  if (userTipoPri === 'A') {
    return menuAccessUrb.includes(path) || menuAccessRur.includes(path);
  }

  // Usuario con acceso a ambos (urbano y rural)
  const tieneAccesoUrbano = userTipoPri === 'U' || userTipoSec === 'U';
  const tieneAccesoRural  = userTipoPri === 'R' || userTipoSec === 'R';

  return (
    (tieneAccesoUrbano && menuAccessUrb.includes(path)) ||
    (tieneAccesoRural && menuAccessRur.includes(path))
  );
}
