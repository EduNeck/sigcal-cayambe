const jwt = require('jsonwebtoken');

// Leer SECRET para firmar JWT de las variables de entorno
const JWT_SECRET = process.env.JWT_SECRET || 'secreto-planificacion';

/**
 * Middleware para verificar el token JWT
 * @param {Object} req - Objeto de solicitud Express
 * @param {Object} res - Objeto de respuesta Express
 * @param {Function} next - Función para continuar al siguiente middleware
 * @returns {Object|undefined} - Retorna un error de respuesta o continúa la ejecución
 */
const authenticateToken = (req, res, next) => {
  // Obtener el token del encabezado Authorization
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
  
  // Si no hay token, devolver error 401 Unauthorized
  if (!token) {
    return res.status(401).json({ 
      success: false, 
      message: 'Token de acceso requerido' 
    });
  }

  try {
    // Verificar y decodificar el token
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Guardar la información del usuario en el objeto request
    req.user = decoded;
    
    // Continuar con el siguiente middleware
    next();
  } catch (err) {
    console.error('Error al verificar token:', err);
    
    // Devolver error 403 Forbidden para tokens inválidos o expirados
    return res.status(403).json({ 
      success: false, 
      message: 'Token inválido o expirado' 
    });
  }
};

module.exports = {
  authenticateToken
};
