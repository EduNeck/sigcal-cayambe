-- Script para crear la tabla de ICUS (Informe de Compatibilidad de Uso de Suelo)
-- Ejecutar este script en la base de datos

CREATE TABLE IF NOT EXISTS icus (
    id SERIAL PRIMARY KEY,
    clave_catastral VARCHAR(30) NOT NULL,
    propietario VARCHAR(255) NOT NULL,
    fecha DATE NOT NULL,
    id_suelo VARCHAR(20) NOT NULL,
    uso_suelo VARCHAR(255) NOT NULL,
    id_actividad VARCHAR(20) NOT NULL,
    actividad VARCHAR(255) NOT NULL,
    id_tipologia VARCHAR(20) NOT NULL,
    tipologia VARCHAR(255) NOT NULL,
    compatibilidad VARCHAR(50) NOT NULL,
    tipo_compatibilidad INTEGER,
    usuario VARCHAR(50) DEFAULT 'sistema',
    estado VARCHAR(20) DEFAULT 'ACTIVO',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Crear índices para mejorar el rendimiento de las consultas
CREATE INDEX IF NOT EXISTS idx_icus_clave_catastral ON icus(clave_catastral);
CREATE INDEX IF NOT EXISTS idx_icus_fecha ON icus(fecha);
CREATE INDEX IF NOT EXISTS idx_icus_id_suelo ON icus(id_suelo);
CREATE INDEX IF NOT EXISTS idx_icus_id_actividad ON icus(id_actividad);
CREATE INDEX IF NOT EXISTS idx_icus_id_tipologia ON icus(id_tipologia);
CREATE INDEX IF NOT EXISTS idx_icus_compatibilidad ON icus(compatibilidad);

-- Comentarios para documentar la tabla y sus columnas
COMMENT ON TABLE icus IS 'Almacena los informes de compatibilidad de uso de suelo';
COMMENT ON COLUMN icus.id IS 'Identificador único del informe';
COMMENT ON COLUMN icus.clave_catastral IS 'Clave catastral del predio';
COMMENT ON COLUMN icus.propietario IS 'Nombre del propietario del predio';
COMMENT ON COLUMN icus.fecha IS 'Fecha de emisión del informe';
COMMENT ON COLUMN icus.id_suelo IS 'Código del uso de suelo';
COMMENT ON COLUMN icus.uso_suelo IS 'Descripción del uso de suelo';
COMMENT ON COLUMN icus.id_actividad IS 'Código de la actividad';
COMMENT ON COLUMN icus.actividad IS 'Descripción de la actividad';
COMMENT ON COLUMN icus.id_tipologia IS 'Código de la tipología';
COMMENT ON COLUMN icus.tipologia IS 'Descripción de la tipología';
COMMENT ON COLUMN icus.compatibilidad IS 'Resultado de compatibilidad (COMPATIBLE, CONDICIONADO, NO COMPATIBLE)';
COMMENT ON COLUMN icus.tipo_compatibilidad IS 'Tipo numérico de compatibilidad (1=COMPATIBLE, 2=CONDICIONADO, 0=NO COMPATIBLE)';
COMMENT ON COLUMN icus.usuario IS 'Usuario que creó el registro';
COMMENT ON COLUMN icus.estado IS 'Estado del registro (ACTIVO, INACTIVO)';
COMMENT ON COLUMN icus.created_at IS 'Fecha y hora de creación';
COMMENT ON COLUMN icus.updated_at IS 'Fecha y hora de última actualización';

-- Mensaje de confirmación
SELECT 'Tabla ICUS creada correctamente' AS mensaje;
