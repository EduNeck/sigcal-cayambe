// db/models/seguridad.js
const db = require('../config');
const bcrypt = require('bcrypt');

// Función para autenticar un usuario
const autenticarUsuario = async (login, pswd) => {
  const query = `
    SELECT login, pswd, name, email, active, activation_code, priv_admin, 
		date_insert, date_inactivo, priv_rol, priv_tipo, priv_rol_sec, 
		priv_tipo_sec, val_urbano, val_rural,
    CASE WHEN photo IS NOT NULL THEN encode(photo, 'base64') ELSE NULL END AS photo
    FROM public.sec_users
    WHERE login = $1;
  `;
  const values = [login];
  console.log('Intentando autenticar usuario con login:', login);

  try {
    const result = await db.query(query, values);
    const usuario = result.rows[0];
    console.log('Usuario encontrado:', usuario);

    if (usuario && await bcrypt.compare(pswd, usuario.pswd)) {
      console.log('Contraseña correcta para el usuario:', login);
      return usuario;
    } else {
      console.log('Credenciales inválidas para el usuario:', login);
      throw new Error('Credenciales inválidas');
    }
  } catch (err) {
    console.error('Error autenticando usuario:', err.message);
    throw new Error(`Error autenticando usuario: ${err.message}`);
  }
};

// Función para ingresar un nuevo usuario
const ingresoUsuario = async (usuario) => {
  const { login, pswd, name, email, active, priv_admin, photo, priv_rol, priv_tipo, 
    priv_rol_sec, priv_tipo_sec, val_urbano, val_rural } = usuario;
  const hashedPassword = await bcrypt.hash(pswd, 10); 
  const query = `
    INSERT INTO public.sec_users (login, pswd, name, email, active, priv_admin, photo, priv_rol, priv_tipo, 
      priv_rol_sec, priv_tipo_sec, val_urbano, val_rural, date_insert)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, now())
    RETURNING *;
  `;
  const values = [login, hashedPassword, name, email, active, priv_admin, photo, priv_rol, priv_tipo, priv_rol_sec, priv_tipo_sec, val_urbano, val_rural];

  try {
    const result = await db.query(query, values);
    return result.rows[0];
  } catch (err) {
    console.error('Error ingresando usuario:', err.message);
    throw new Error(`Error ingresando usuario: ${err.message}`);
  }
};

// Función para eliminar un usuario por su login
const eliminacionUsuario = async (login) => {
  const query = `
    DELETE FROM public.sec_users
    WHERE login = $1
    RETURNING *;
  `;
  const values = [login];

  try {
    const result = await db.query(query, values);
    return result.rows[0];
  } catch (err) {
    console.error('Error eliminando usuario:', err.message);
    throw new Error(`Error eliminando usuario: ${err.message}`);
  }
};

// Función para actualizar un usuario
const actualizarUsuario = async (login, usuario) => {
  const { pswd, name, email, active, activation_code, priv_admin, photo, priv_rol, priv_tipo, priv_rol_sec, priv_tipo_sec, val_urbano, val_rural } = usuario;
  const hashedPassword = await bcrypt.hash(pswd, 10); // Encriptar la nueva contraseña con bcrypt
  const query = `
    UPDATE public.sec_users
    SET pswd = $2, name = $3, email = $4, active = $5, activation_code = $6, priv_admin = $7, photo = $8,
    priv_rol = $9, priv_tipo = $10, priv_rol_sec = $11,  priv_tipo_sec = $12, val_urbano = $13, val_rural = $14
    WHERE login = $1
    RETURNING *;
  `;
  const values = [login, hashedPassword, name, email, active, activation_code, priv_admin, photo, priv_rol, priv_tipo, priv_rol_sec, priv_tipo_sec, val_urbano, val_rural];

  try {
    const result = await db.query(query, values);
    return result.rows[0];
  } catch (err) {
    console.error('Error actualizando usuario:', err.message);
    throw new Error(`Error actualizando usuario: ${err.message}`);
  }
};

// Función para obtener un usuario por su login
const obtenerUsuario = async (login) => {
  const query = `
    SELECT login, pswd, name, email, active, activation_code, priv_admin, 
		date_insert, date_inactivo, photo, priv_rol, priv_tipo, priv_rol_sec, 
		priv_tipo_sec, val_urbano, val_rural
    FROM public.sec_users
    WHERE login = $1;
  `;
  const values = [login];

  try {
    const result = await db.query(query, values);
    return result.rows[0];
  } catch (err) {
    console.error('Error obteniendo usuario:', err.message);
    throw new Error(`Error obteniendo usuario: ${err.message}`);
  }
};

// Función para obtener todos los usuarios
const obtenerTodosUsuarios = async () => {
  const query = `
    SELECT login, pswd, name, email, active, activation_code, priv_admin, 
		date_insert, date_inactivo, photo, priv_rol, priv_tipo, priv_rol_sec, 
		priv_tipo_sec,val_urbano, val_rural
    FROM public.sec_users;
  `;

  try {
    const result = await db.query(query);
    return result.rows;
  } catch (err) {
    console.error('Error obteniendo todos los usuarios:', err.message);
    throw new Error(`Error obteniendo todos los usuarios: ${err.message}`);
  }
};


// Función para activar o inactivar un usuario
const cambiarEstadoUsuario = async (login, active) => {
  if (!['N', 'Y'].includes(active)) {
    throw new Error(`El valor de 'active' debe ser 'N' o 'Y'. Valor recibido: ${active}`);
  }
  const query = `
    UPDATE public.sec_users
    SET active = $2::varchar, 
        date_inactivo = CASE WHEN $2 = 'N' THEN now() ELSE NULL END
    WHERE login = $1
    RETURNING *;
  `;
  const values = [login, String(active)]; 

  try {
    const result = await db.query(query, values);
    if (result.rows.length === 0) {
      throw new Error(`Usuario con login '${login}' no encontrado.`);
    }
    console.log(`Usuario ${active === 'N' ? 'inactivado' : 'activado'}:`, result.rows[0]);
    return result.rows[0];
  } catch (err) {
    console.error(`Error cambiando estado del usuario:`, err.message);
    throw new Error(`Error cambiando estado del usuario: ${err.message}`);
  }
};

// Función para cambiar el permiso de administrador (priv_admin)
const cambiarPrivAdmin = async (login, priv_admin) => {
  if (!['N', 'Y'].includes(priv_admin)) {
    throw new Error(`El valor de 'priv_admin' debe ser 'N' o 'Y'. Valor recibido: ${priv_admin}`);
  }

  const query = `
    UPDATE public.sec_users
    SET priv_admin = $2::varchar
    WHERE login = $1
    RETURNING *;
  `;
  const values = [login, String(priv_admin)]; // Convertimos a cadena explícitamente

  // Mensajes de depuración
  console.log('Intentando cambiar el permiso de administrador...');
  console.log('Login:', login);
  console.log('Nuevo estado (priv_admin):', priv_admin);
  console.log('Valores enviados a la consulta:', values);

  try {
    const result = await db.query(query, values);
    if (result.rows.length === 0) {
      throw new Error(`Usuario con login '${login}' no encontrado.`);
    }
    console.log(`Permiso de administrador ${priv_admin === 'N' ? 'quitado' : 'otorgado'}:`, result.rows[0]);
    return result.rows[0];
  } catch (err) {
    console.error(`Error cambiando el permiso de administrador:`, err.message);
    throw new Error(`Error cambiando el permiso de administrador: ${err.message}`);
  }
};

// Función para actualizar la contraseña solo si la clave anterior es correcta
const actualizarClaveUsuario = async (login, claveAnterior, claveNueva) => {
  // 1. Obtener el hash actual de la base de datos
  const querySelect = `SELECT pswd FROM public.sec_users WHERE login = $1`;
  const valuesSelect = [login];
  try {
    const result = await db.query(querySelect, valuesSelect);
    if (result.rows.length === 0) {
      throw new Error(`Usuario con login '${login}' no encontrado.`);
    }
    const hashActual = result.rows[0].pswd;
    // 2. Verificar la clave anterior
    const coincide = await bcrypt.compare(claveAnterior, hashActual);
    if (!coincide) {
      throw new Error('La clave anterior no es correcta.');
    }
    // 3. Actualizar la clave
    const hashedPassword = await bcrypt.hash(claveNueva, 10);
    const queryUpdate = `
      UPDATE public.sec_users
      SET pswd = $2
      WHERE login = $1
      RETURNING login;
    `;
    const valuesUpdate = [login, hashedPassword];
    const resultUpdate = await db.query(queryUpdate, valuesUpdate);
    return resultUpdate.rows[0];
  } catch (err) {
    console.error('Error actualizando clave del usuario:', err.message);
    throw new Error(`Error actualizando clave del usuario: ${err.message}`);
  }
};

module.exports = {
  autenticarUsuario,  
  ingresoUsuario,
  eliminacionUsuario,
  actualizarUsuario,
  obtenerUsuario,
  obtenerTodosUsuarios,
  cambiarEstadoUsuario,
  cambiarPrivAdmin,
  actualizarClaveUsuario,
};

