# 🐳 Configuración Docker - SIGCAL Cayambe

Este proyecto incluye configuración Docker para ejecutar ambos sistemas (Catastro y Planificación) de forma containerizada.

## 🏗️ Arquitectura de Servicios

```
┌─────────────────────────────────────────────────────────┐
│                    SIGCAL Cayambe                       │
├─────────────────────────────────────────────────────────┤
│  🏠 Sistema Catastro        │  🗺️ Sistema Planificación  │
│  ├── Backend: 3001          │  ├── Backend: 4001          │
│  ├── Frontend: 8090         │  ├── Frontend: 5174         │
│  └── Nginx: 443/80          │  └── Integrado              │
└─────────────────────────────────────────────────────────┘
```

## 📋 Prerrequisitos

- [Docker](https://docs.docker.com/get-docker/) >= 20.10
- [Docker Compose](https://docs.docker.com/compose/install/) >= 2.0
- 8GB RAM disponible
- 10GB espacio en disco

## 🚀 Inicio Rápido

### 1. **Construir todas las imágenes:**
```bash
# Linux/Mac
./docker-scripts.sh build-all

# Windows
docker-scripts.bat build-all

# Manual
docker-compose build --no-cache
```

### 2. **Iniciar todos los servicios:**
```bash
# Linux/Mac
./docker-scripts.sh start-all

# Windows
docker-scripts.bat start-all

# Manual
docker-compose up -d
```

### 3. **Verificar estado:**
```bash
./docker-scripts.sh status
# o
docker ps
```

## 🎯 Comandos Disponibles

### Gestión de Servicios
```bash
# Iniciar sistema completo
./docker-scripts.sh start-all

# Iniciar solo catastro
./docker-scripts.sh start-catastro

# Iniciar solo planificación  
./docker-scripts.sh start-plan

# Detener todos los servicios
./docker-scripts.sh stop-all
```

### Logs y Monitoreo
```bash
# Ver logs de todos los servicios
./docker-scripts.sh logs-all

# Ver logs solo de catastro
./docker-scripts.sh logs-catastro

# Ver logs solo de planificación
./docker-scripts.sh logs-plan

# Ver estado de contenedores
./docker-scripts.sh status
```

### Desarrollo
```bash
# Modo desarrollo (con hot-reload)
./docker-scripts.sh dev

# Limpiar contenedores e imágenes
./docker-scripts.sh clean
```

## 🌐 URLs de Acceso

Una vez iniciados los servicios:

### 🏠 **Sistema Catastro:**
- **Frontend:** http://localhost:8090
- **Backend API:** http://localhost:3001/api
- **Nginx (SSL):** https://localhost

### 🗺️ **Sistema Planificación:**
- **Frontend:** http://localhost:5174  
- **Backend API:** http://localhost:4001/api

## ⚙️ Configuración de Entorno

### **Backend Catastro:**
Archivo: `backend/.env.production`
```bash
PGHOST=localhost
PGUSER=postgres
PGPASSWORD=postgres
PGDATABASE=sigcalcayambe
PGPORT=5434
PORT=3001
```

### **Backend Planificación:**
Archivo: `backend-planificacion/.env.production`
```bash
PGHOST=localhost
PGUSER=postgres  
PGPASSWORD=postgres
PGDATABASE=sigcalcayambe
PGPORT=5434
PORT=4001
```

## 🛠️ Desarrollo

### **Modo Desarrollo:**
```bash
# Usar docker-compose para desarrollo
docker-compose -f docker-compose.dev.yml up -d

# O con el script
./docker-scripts.sh dev
```

### **Reconstruir una imagen específica:**
```bash
# Solo backend catastro
docker-compose build backend

# Solo frontend planificación  
docker-compose build frontend-planificacion
```

### **Logs en tiempo real:**
```bash
# Seguir logs de un servicio específico
docker-compose logs -f backend-planificacion

# Logs desde una fecha
docker-compose logs --since="2023-10-01" backend
```

## 🐛 Resolución de Problemas

### **Error de puertos ocupados:**
```bash
# Verificar puertos en uso
netstat -tulpn | grep :3001
lsof -i :4001    # Mac/Linux
netstat -ano | findstr :8090    # Windows

# Cambiar puerto en docker-compose.yml
ports:
  - "3002:3001"  # Puerto externo:interno
```

### **Error de memoria:**
```bash
# Limpiar imágenes no utilizadas
docker system prune -f

# Ver uso de recursos
docker stats

# Aumentar memoria disponible para Docker
# Docker Desktop > Settings > Resources > Memory
```

### **Base de datos no conecta:**
```bash
# Verificar PostgreSQL
docker run --rm postgres:15 pg_isready -h localhost -p 5434

# Verificar conexión desde contenedor
docker-compose exec backend node -e "console.log(process.env.PGHOST)"
```

### **Certificados SSL:**
```bash
# Generar certificados self-signed
mkdir certs
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout certs/nginx-selfsigned.key \
  -out certs/nginx-selfsigned.crt
```

## 📦 Estructura de Archivos Docker

```
.
├── Dockerfile-backend                 # Docker para backend catastro
├── Dockerfile-frontend                # Docker para frontend catastro  
├── Dockerfile-backend-planificacion   # Docker para backend planificación
├── Dockerfile-frontend-planificacion  # Docker para frontend planificación
├── docker-compose.yml                 # Configuración producción
├── docker-compose.dev.yml             # Configuración desarrollo
├── nginx.conf                         # Configuración Nginx catastro
├── nginx-planificacion.conf          # Configuración Nginx planificación
├── docker-scripts.sh                 # Scripts de gestión (Linux/Mac)
└── docker-scripts.bat                # Scripts de gestión (Windows)
```

## 🔧 Personalización

### **Cambiar puertos:**
Editar `docker-compose.yml`:
```yaml
services:
  backend:
    ports:
      - "3001:3001"  # cambiar primer número
  frontend-planificacion:
    ports:
      - "5174:5174"  # cambiar primer número
```

### **Configurar dominio personalizado:**
1. Editar `/etc/hosts` (Linux/Mac) o `C:\Windows\System32\drivers\etc\hosts` (Windows):
```
127.0.0.1 catastro.cayambe.local
127.0.0.1 planificacion.cayambe.local
```

2. Actualizar `nginx.conf`:
```nginx
server_name catastro.cayambe.local;
```

### **Habilitar HTTPS:**
1. Generar certificados SSL
2. Actualizar `nginx.conf` con configuración SSL
3. Mapear certificados en `docker-compose.yml`

## 📝 Logs y Monitoreo

### **Ubicación de logs:**
```bash
# Logs de contenedores
docker-compose logs backend > backend.log

# Logs de Nginx dentro del contenedor
docker-compose exec nginx cat /var/log/nginx/access.log
```

### **Métricas de rendimiento:**
```bash
# Uso de recursos por contenedor
docker stats --no-stream

# Información detallada de un contenedor
docker inspect cayambe-backend
```

## 🚀 Despliegue en Producción

### **Variables de entorno:**
- Configurar `.env.production` con credenciales reales
- Usar secretos de Docker para contraseñas sensibles
- Configurar certificados SSL válidos

### **Escalabilidad:**
```yaml
deploy:
  replicas: 3
  resources:
    limits:
      cpus: '0.5'
      memory: 512M
```

### **Backup de datos:**
```bash
# Backup de volúmenes
docker run --rm -v cayambe_postgres_data:/data -v $(pwd):/backup ubuntu tar czf /backup/backup.tar.gz /data
```

---

## 📞 Soporte

Para problemas o consultas:
1. Revisar logs: `./docker-scripts.sh logs-all`
2. Verificar estado: `./docker-scripts.sh status`
3. Limpiar y reiniciar: `./docker-scripts.sh clean && ./docker-scripts.sh build-all`