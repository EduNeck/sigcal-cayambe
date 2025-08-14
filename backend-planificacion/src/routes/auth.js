const express = require('express');
const router = express.Router();
const pool = require('../db/config'); 
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// SECRET para firmar JWT (pon en .env en producción)
const JWT_SECRET = process.env.JWT_SECRET || 'secreto-planificacion';

// Login endpoint
router.post('/login', async (req, res) => {
  const { usuario, password } = req.body;
  try {
    // Buscar usuario en la tabla del esquema planificacion
    console.log('Usuario recibido:', usuario, 'Password recibido:', password);
    const result = await pool.query(
      `SELECT * FROM planificacion.planificacion_usuarios WHERE usuario = $1 AND estado = true`,
      [usuario]
    );

    console.log('Resultado query:', result.rows);

    if (result.rows.length === 0) {
      return res.status(401).json({ message: 'Usuario o contraseña incorrectos' });
    }
    const user = result.rows[0];
    console.log('User encontrado en DB:', user);

    // Comparar contraseña con el hash
    const valid = await bcrypt.compare(password, user.password);
    console.log('Resultado de bcrypt.compare:', valid);
    if (!valid) {
      return res.status(401).json({ message: 'Usuario o contraseña incorrectos' });
    }

    // Generar token
    const token = jwt.sign(
      {
        id: user.id,
        usuario: user.usuario,
        nombres: user.nombres,
        rol: user.rol
      },
      JWT_SECRET,
      { expiresIn: '8h' }
    );

    res.json({ token, user: { id: user.id, usuario: user.usuario, nombres: user.nombres, rol: user.rol } });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

module.exports = router;
