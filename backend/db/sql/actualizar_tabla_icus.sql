-- Script para actualizar la tabla de ICUS con campos adicionales
-- Ejecutar este script en la base de datos

-- Añadir nuevos campos a la tabla ICUS
ALTER TABLE icus
ADD COLUMN IF NOT EXISTS numero_documento VARCHAR(20),
ADD COLUMN IF NOT EXISTS clave_anterior VARCHAR(30),
ADD COLUMN IF NOT EXISTS derechos_acciones VARCHAR(2),
ADD COLUMN IF NOT EXISTS ph VARCHAR(2),
ADD COLUMN IF NOT EXISTS area_construccion NUMERIC(12,2),
ADD COLUMN IF NOT EXISTS area_escritura NUMERIC(12,2),
ADD COLUMN IF NOT EXISTS area_gis NUMERIC(12,2),
ADD COLUMN IF NOT EXISTS frente NUMERIC(12,2),
ADD COLUMN IF NOT EXISTS id_par VARCHAR(20),
ADD COLUMN IF NOT EXISTS nombre_parroquia VARCHAR(100),
ADD COLUMN IF NOT EXISTS sector VARCHAR(100),
ADD COLUMN IF NOT EXISTS resultado_informe TEXT,
ADD COLUMN IF NOT EXISTS id_uso_suelo VARCHAR(20),
ADD COLUMN IF NOT EXISTS notas TEXT,
ADD COLUMN IF NOT EXISTS id_predio INTEGER,
ADD COLUMN IF NOT EXISTS geometria GEOMETRY;

-- Crear índices para los nuevos campos
CREATE INDEX IF NOT EXISTS idx_icus_numero_documento ON icus(numero_documento);
CREATE INDEX IF NOT EXISTS idx_icus_clave_anterior ON icus(clave_anterior);
CREATE INDEX IF NOT EXISTS idx_icus_id_par ON icus(id_par);
CREATE INDEX IF NOT EXISTS idx_icus_id_predio ON icus(id_predio);

-- Comentarios para los nuevos campos
COMMENT ON COLUMN icus.numero_documento IS 'Número de documento de identidad del propietario';
COMMENT ON COLUMN icus.clave_anterior IS 'Clave catastral anterior del predio';
COMMENT ON COLUMN icus.derechos_acciones IS 'Indica si el predio tiene derechos y acciones (SI/NO)';
COMMENT ON COLUMN icus.ph IS 'Indica si el predio es propiedad horizontal (SI/NO)';
COMMENT ON COLUMN icus.area_construccion IS 'Área de construcción del predio en m²';
COMMENT ON COLUMN icus.area_escritura IS 'Área según escritura del predio en m²';
COMMENT ON COLUMN icus.area_gis IS 'Área según sistema GIS en m²';
COMMENT ON COLUMN icus.frente IS 'Longitud del frente del predio en metros';
COMMENT ON COLUMN icus.id_par IS 'Código de la parroquia';
COMMENT ON COLUMN icus.nombre_parroquia IS 'Nombre de la parroquia';
COMMENT ON COLUMN icus.sector IS 'Sector donde se ubica el predio';
COMMENT ON COLUMN icus.resultado_informe IS 'Resultado detallado del informe';
COMMENT ON COLUMN icus.id_uso_suelo IS 'Código alternativo del uso de suelo';
COMMENT ON COLUMN icus.notas IS 'Notas adicionales sobre el informe';
COMMENT ON COLUMN icus.id_predio IS 'Identificador del predio relacionado';
COMMENT ON COLUMN icus.geometria IS 'Representación geométrica del predio';

-- Mensaje de confirmación
SELECT 'Tabla ICUS actualizada correctamente' AS mensaje;
