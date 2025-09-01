import QRCode from 'qrcode';

const qrService = {
  /**
   * Genera un código QR como imagen base64 a partir de un texto
   * @param {String} texto - Texto a codificar en el QR
   * @param {Object} options - Opciones para la generación del QR
   * @returns {Promise<String>} - Imagen en formato base64
   */
  generarQR: async (texto, options = {}) => {
    const defaultOptions = {
      errorCorrectionLevel: 'H',
      type: 'image/png',
      margin: 1,
      width: 200,
      color: {
        dark: '#000000',
        light: '#ffffff'
      }
    };
    
    const mergedOptions = { ...defaultOptions, ...options };
    
    try {
      const url = await QRCode.toDataURL(texto, mergedOptions);
      return url;
    } catch (error) {
      console.error('Error al generar el código QR:', error);
      throw error;
    }
  },
  
  /**
   * Genera un QR para un IRM con el formato requerido
   * @param {Object} datos - Datos para el QR del IRM
   * @returns {Promise<String>} - Imagen QR en formato base64
   */
  generarQRIRM: async (datos) => {
    const { 
      numeroInforme, 
      fechaHora, 
      idPredio, 
      claveCatastral, 
      idPropietario, 
      nombrePropietario,
      usuarioId, 
      nombreUsuario 
    } = datos;
    
    // Formato: IPRU|<número_informe>|<fecha_hora>|<id_predio>|<clave_catastral>|<id_propietario>|<nombre_propietario>|<usuario_id>|<nombre_usuario>
    const textoQR = `IPRU|${numeroInforme}|${fechaHora}|${idPredio || ''}|${claveCatastral || ''}|${idPropietario || ''}|${nombrePropietario || ''}|${usuarioId || ''}|${nombreUsuario || ''}`;
    
    return await qrService.generarQR(textoQR);
  }
};

export default qrService;
