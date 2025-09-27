/**
 * Funciones de validación para cédula y RUC ecuatorianos
 */

/**
 * Valida si una cédula ecuatoriana es correcta
 * @param {string} cedula - Número de cédula de 10 dígitos
 * @returns {boolean} - true si la cédula es válida, false en caso contrario
 */
export function validarCedula(cedula) {
  if (typeof cedula !== 'string' || cedula.length !== 10 || !/^\d+$/.test(cedula)) {
    return false;
  }

  // Extraer dígito verificador
  const digitoVerificador = parseInt(cedula.substring(9, 10));
  
  // Extraer y multiplicar los 9 primeros dígitos
  let suma = 0;
  for (let i = 0; i < 9; i++) {
    let digito = parseInt(cedula.charAt(i));
    // Para posiciones impares, multiplicar por 2
    if (i % 2 === 0) {
      digito *= 2;
      // Si el resultado es mayor a 9, restar 9
      if (digito > 9) {
        digito -= 9;
      }
    }
    suma += digito;
  }

  // Calcular el módulo de la suma dividida para 10
  const modulo = suma % 10;
  
  // Si el módulo es 0, el dígito verificador debería ser 0
  // De lo contrario, el dígito verificador debería ser 10 - módulo
  const digitoCalculado = modulo === 0 ? 0 : 10 - modulo;
  
  // Comparar el dígito verificador calculado con el proporcionado
  return digitoVerificador === digitoCalculado;
}

/**
 * Valida si un RUC ecuatoriano es correcto
 * @param {string} ruc - Número de RUC de 13 dígitos
 * @returns {boolean} - true si el RUC es válido, false en caso contrario
 */
export function validarRUC(ruc) {
  if (typeof ruc !== 'string' || ruc.length !== 13 || !/^\d+$/.test(ruc)) {
    return false;
  }

  // Los tres últimos dígitos deben ser 001
  if (ruc.substring(10) !== '001') {
    return false;
  }

  // Para personas naturales, los primeros 10 dígitos son la cédula
  // Para empresas privadas, el 9no dígito es el verificador
  // Para empresas públicas, el 8vo dígito es el verificador

  // Verificar el tipo de RUC
  const tercerDigito = parseInt(ruc.charAt(2));
  
  if (tercerDigito < 6) {
    // Es persona natural, validar como cédula
    return validarCedula(ruc.substring(0, 10));
  } else if (tercerDigito === 6) {
    // Es empresa pública
    return validarRucEmpresaPublica(ruc);
  } else if (tercerDigito === 9) {
    // Es sociedad privada
    return validarRucSociedadPrivada(ruc);
  }
  
  return false;
}

/**
 * Valida si un RUC de empresa pública es correcto
 * @param {string} ruc - Número de RUC de 13 dígitos
 * @returns {boolean} - true si el RUC es válido, false en caso contrario
 */
function validarRucEmpresaPublica(ruc) {
  let suma = 0;
  const coeficientes = [3, 2, 7, 6, 5, 4, 3, 2];

  // Multiplicar cada dígito por su coeficiente correspondiente
  for (let i = 0; i < 8; i++) {
    suma += parseInt(ruc.charAt(i)) * coeficientes[i];
  }

  // Calcular el módulo de la suma dividida para 11
  const residuo = suma % 11;
  
  // El dígito verificador debería ser 11 - residuo
  const digitoVerificador = residuo === 0 ? 0 : 11 - residuo;
  
  // Comparar el dígito verificador calculado con el proporcionado
  return parseInt(ruc.charAt(8)) === digitoVerificador;
}

/**
 * Valida si un RUC de sociedad privada es correcto
 * @param {string} ruc - Número de RUC de 13 dígitos
 * @returns {boolean} - true si el RUC es válido, false en caso contrario
 */
function validarRucSociedadPrivada(ruc) {
  let suma = 0;
  const coeficientes = [4, 3, 2, 7, 6, 5, 4, 3, 2];

  // Multiplicar cada dígito por su coeficiente correspondiente
  for (let i = 0; i < 9; i++) {
    suma += parseInt(ruc.charAt(i)) * coeficientes[i];
  }

  // Calcular el módulo de la suma dividida para 11
  const residuo = suma % 11;
  
  // El dígito verificador debería ser 11 - residuo
  const digitoVerificador = residuo === 0 ? 0 : 11 - residuo;
  
  // Comparar el dígito verificador calculado con el proporcionado
  return parseInt(ruc.charAt(9)) === digitoVerificador;
}