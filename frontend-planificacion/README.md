# Frontend Planificación - SIGCAL Cayambe

Interfaz de usuario para el módulo de planificación del Sistema de Gestión Catastral de Cayambe.

## Configuración

### Variables de entorno

El proyecto utiliza las siguientes variables de entorno que deben configurarse en un archivo `.env.local`:

- `VITE_API_BASE_URL`: URL base para la API de planificación (por defecto: http://localhost:4001/api)
- `VITE_BACKEND_URL`: URL base para la API principal del sistema (por defecto: http://localhost:4000/api)
- `VITE_GEOSERVER_URL`: URL del servidor GeoServer para los mapas (por defecto: http://localhost:8080/geoserver)

### Ejemplo de archivo .env.local

```
VITE_API_BASE_URL=http://localhost:4001/api
VITE_BACKEND_URL=http://localhost:4000/api
VITE_GEOSERVER_URL=http://localhost:8080/geoserver
```

## Desarrollo

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev

# Compilar para producción
npm run build
```

## Funcionalidades principales

- Informes de Regulación Municipal (IRM)
- Consulta y visualización de predios
- Generación de certificados
- Gestión de proyectos urbanos
