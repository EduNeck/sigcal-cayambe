// Script para verificar la vista actividad.view_cambios_predios
const db = require('./db/config');

async function verificarVista() {
  try {
    console.log('🔍 Verificando conexión a la base de datos...');
    
    // Verificar conexión
    const connectionTest = await db.query('SELECT NOW() as current_time');
    console.log('✅ Conexión exitosa:', connectionTest.rows[0].current_time);
    
    // Verificar si existe el schema actividad
    console.log('\n🔍 Verificando schema actividad...');
    const schemaQuery = `
      SELECT schema_name 
      FROM information_schema.schemata 
      WHERE schema_name = 'actividad'
    `;
    const schemaResult = await db.query(schemaQuery);
    
    if (schemaResult.rows.length === 0) {
      console.log('❌ El schema "actividad" no existe');
      return;
    }
    console.log('✅ Schema "actividad" encontrado');
    
    // Verificar si existe la vista
    console.log('\n🔍 Verificando vista view_cambios_predios...');
    const vistaQuery = `
      SELECT table_name, table_type
      FROM information_schema.tables 
      WHERE table_schema = 'actividad' 
      AND table_name = 'view_cambios_predios'
    `;
    const vistaResult = await db.query(vistaQuery);
    
    if (vistaResult.rows.length === 0) {
      console.log('❌ La vista "view_cambios_predios" no existe en el schema "actividad"');
      
      // Buscar vistas similares
      console.log('\n🔍 Buscando vistas similares...');
      const vistasQuery = `
        SELECT table_name, table_type
        FROM information_schema.tables 
        WHERE table_schema = 'actividad'
        AND table_type IN ('VIEW', 'BASE TABLE')
        ORDER BY table_name
      `;
      const vistasResult = await db.query(vistasQuery);
      console.log('📋 Tablas/vistas en schema actividad:', vistasResult.rows);
      return;
    }
    
    console.log('✅ Vista encontrada:', vistaResult.rows[0]);
    
    // Verificar estructura de la vista
    console.log('\n🔍 Verificando estructura de la vista...');
    const estructuraQuery = `
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns
      WHERE table_schema = 'actividad'
      AND table_name = 'view_cambios_predios'
      ORDER BY ordinal_position
    `;
    const estructuraResult = await db.query(estructuraQuery);
    console.log('📋 Estructura de la vista:', estructuraResult.rows);
    
    // Hacer una consulta de prueba
    console.log('\n🔍 Realizando consulta de prueba...');
    const pruebaQuery = `
      SELECT COUNT(*) as total
      FROM actividad.view_cambios_predios
      LIMIT 1
    `;
    const pruebaResult = await db.query(pruebaQuery);
    console.log('📊 Total de registros en la vista:', pruebaResult.rows[0].total);
    
    // Consulta con límite para ver datos de muestra
    console.log('\n🔍 Consultando datos de muestra...');
    const muestraQuery = `
      SELECT *
      FROM actividad.view_cambios_predios
      ORDER BY fecha_actividad DESC
      LIMIT 3
    `;
    const muestraResult = await db.query(muestraQuery);
    console.log('📋 Datos de muestra:', muestraResult.rows);
    
  } catch (error) {
    console.error('❌ Error durante la verificación:', error);
    console.error('❌ Stack:', error.stack);
  } finally {
    process.exit(0);
  }
}

verificarVista();