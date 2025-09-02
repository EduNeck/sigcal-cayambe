const jwt = require('jsonwebtoken');

// SECRET para firmar JWT (pon en .env en producción)
const JWT_SECRET = process.env.JWT_SECRET || 'secreto-planificacion';

/**
 * Middleware para verificar el token JWT
 */
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ 
      success: false, 
      message: 'Token de acceso requerido' 
    });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    console.error('Error al verificar token:', err);
    return res.status(403).json({ 
      success: false, 
      message: 'Token inválido o expirado' 
    });
  }
};

module.exports = {
  authenticateToken
};
