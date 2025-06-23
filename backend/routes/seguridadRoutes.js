const express = require('express');
const router = express.Router();
const seguridadModel = require('../db/models/seguridad');
const multer = require('multer');

const upload = multer({ storage: multer.memoryStorage() });

// Ruta de prueba
router.get('/test', (req, res) => {
  res.send('Funciona seguridad');
});

// ---------------------- AUTENTICAR USUARIO ----------------------
router.post('/autenticarUsuario', async (req, res) => {
  const { login, pswd } = req.body;
  try {
    const data = await seguridadModel.autenticarUsuario(login, pswd);
    res.json({ success: true, data });
  } catch (err) {
    console.error('Error autenticando usuario:', err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

// ---------------------- INGRESAR USUARIO ----------------------
router.post('/ingresaUsuario', upload.single('photo'), async (req, res) => {
  try {
    const { login, pswd, name, email, active, priv_admin, priv_rol, priv_tipo, priv_rol_sec, priv_tipo_sec, val_urbano, val_rural } = req.body;
    const photo = req.file ? req.file.buffer : null;

    const usuario = { login, pswd, name, email, active, priv_admin, photo, priv_rol, priv_tipo, priv_rol_sec, priv_tipo_sec, val_urbano, val_rural };
    const data = await seguridadModel.ingresoUsuario(usuario);
    res.json(data);
  } catch (err) {
    console.error('Error ingresando usuario:', err.message);
    res.status(500).send('Server Error');
  }
});

// ---------------------- OBTENER USUARIO POR LOGIN ----------------------
router.get('/recuperaUsuario/:login', async (req, res) => {
  try {
    const usuario = await seguridadModel.obtenerUsuario(req.params.login);
    usuario ? res.json(usuario) : res.status(404).json({ error: 'Usuario no encontrado' });
  } catch (err) {
    console.error('Error obteniendo usuario:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// ---------------------- OBTENER TODOS LOS USUARIOS ----------------------
router.get('/recuperaTodosUsuarios', async (req, res) => {
  try {
    const usuarios = await seguridadModel.obtenerTodosUsuarios();
    res.json(usuarios);
  } catch (err) {
    console.error('Error obteniendo usuarios:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// ---------------------- ACTUALIZAR USUARIO ----------------------
router.put('/actualizaUsuario/:login', upload.single('photo'), async (req, res) => {
  const { login } = req.params;
  const { pswd, name, email, active, priv_admin, priv_rol, priv_tipo, priv_rol_sec, priv_tipo_sec, val_urbano, val_rural } = req.body;
  const photo = req.file ? req.file.buffer : null;

  const usuario = { pswd, name, email, active, priv_admin, photo, priv_rol, priv_tipo, priv_rol_sec, priv_tipo_sec, val_urbano, val_rural };

  try {
    const updatedUsuario = await seguridadModel.actualizarUsuario(login, usuario);
    updatedUsuario ? res.json(updatedUsuario) : res.status(404).json({ error: 'Usuario no encontrado' });
  } catch (err) {
    console.error('Error actualizando usuario:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// ---------------------- CAMBIAR ESTADO DE USUARIO ----------------------
router.put('/cambiarEstadoUsuario/:login', async (req, res) => {
  const { login } = req.params;
  const { active } = req.body;

  if (!['N', 'Y'].includes(active)) {
    return res.status(400).json({ error: 'El valor de "active" debe ser "N" o "Y".' });
  }

  try {
    const usuario = await seguridadModel.cambiarEstadoUsuario(login, active);
    usuario
      ? res.json({ message: `Usuario ${active === 'N' ? 'inactivado' : 'activado'} con éxito`, usuario })
      : res.status(404).json({ error: 'Usuario no encontrado' });
  } catch (err) {
    console.error('Error cambiando estado del usuario:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// ---------------------- CAMBIAR PRIVILEGIO DE ADMINISTRADOR ----------------------
router.put('/cambiarPrivAdmin/:login', async (req, res) => {
  const { login } = req.params;
  const { priv_admin } = req.body;

  if (!['N', 'Y'].includes(priv_admin)) {
    return res.status(400).json({ error: 'El valor de "priv_admin" debe ser "N" o "Y".' });
  }

  try {
    const usuario = await seguridadModel.cambiarPrivAdmin(login, priv_admin);
    usuario
      ? res.json({ message: `Permiso de administrador ${priv_admin === 'N' ? 'quitado' : 'otorgado'} con éxito`, usuario })
      : res.status(404).json({ error: 'Usuario no encontrado' });
  } catch (err) {
    console.error('Error cambiando privilegio admin:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// ---------------------- CAMBIAR CONTRASEÑA DE USUARIO ----------------------
router.put('/cambiarContrasena/:login', async (req, res) => {
  const { login } = req.params;
  const { pswd } = req.body;

  try {
    const usuario = await seguridadModel.actualizarClaveUsuario(login, pswd);
    usuario
      ? res.json({ message: 'Contraseña cambiada con éxito', usuario })
      : res.status(404).json({ error: 'Usuario no encontrado' });
  } catch (err) {
    console.error('Error cambiando contraseña del usuario:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// ---------------------- ACTUALIZAR CLAVE USUARIO ----------------------
router.put('/actualizarClaveUsuario', async (req, res) => {
  const { login, claveAnterior, claveNueva } = req.body;
  if (!login || !claveAnterior || !claveNueva) {
    return res.status(400).json({ success: false, error: 'Faltan parámetros requeridos.' });
  }
  try {
    const data = await seguridadModel.actualizarClaveUsuario(login, claveAnterior, claveNueva);
    res.json({ success: true, data });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

module.exports = router;
