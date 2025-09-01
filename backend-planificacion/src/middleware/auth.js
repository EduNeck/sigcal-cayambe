const jwt = require('jsonwebtoken');

// Middleware para verificar el token JWT
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
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'sigcal_secret_cayambe');
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
