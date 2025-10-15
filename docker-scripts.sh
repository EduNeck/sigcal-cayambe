#!/bin/bash

# Script para gestionar los contenedores Docker de SIGCAL Cayambe
# Uso: ./docker-scripts.sh [comando]

set -e

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Función para mostrar ayuda
show_help() {
    echo -e "${BLUE}🐳 Scripts de Docker para SIGCAL Cayambe${NC}"
    echo ""
    echo -e "${YELLOW}Comandos disponibles:${NC}"
    echo "  build-all       Construir todas las imágenes"
    echo "  start-all       Iniciar todos los servicios"
    echo "  start-catastro  Iniciar solo sistema catastro"
    echo "  start-plan      Iniciar solo sistema planificación"
    echo "  stop-all        Detener todos los servicios"
    echo "  logs-all        Ver logs de todos los servicios"
    echo "  logs-catastro   Ver logs del sistema catastro"
    echo "  logs-plan       Ver logs del sistema planificación"
    echo "  status          Ver estado de contenedores"
    echo "  clean           Limpiar contenedores e imágenes"
    echo "  dev             Iniciar en modo desarrollo"
    echo ""
    echo -e "${YELLOW}Ejemplos:${NC}"
    echo "  ./docker-scripts.sh build-all"
    echo "  ./docker-scripts.sh start-catastro"
    echo "  ./docker-scripts.sh logs-plan"
}

# Función para verificar Docker
check_docker() {
    if ! command -v docker &> /dev/null; then
        echo -e "${RED}❌ Docker no está instalado${NC}"
        exit 1
    fi
    
    if ! command -v docker-compose &> /dev/null; then
        echo -e "${RED}❌ Docker Compose no está instalado${NC}"
        exit 1
    fi
}

# Construir todas las imágenes
build_all() {
    echo -e "${BLUE}🔨 Construyendo todas las imágenes Docker...${NC}"
    docker-compose build --no-cache
    echo -e "${GREEN}✅ Todas las imágenes construidas exitosamente${NC}"
}

# Iniciar todos los servicios
start_all() {
    echo -e "${BLUE}🚀 Iniciando todos los servicios...${NC}"
    docker-compose up -d
    echo -e "${GREEN}✅ Todos los servicios iniciados${NC}"
    show_status
}

# Iniciar solo sistema catastro
start_catastro() {
    echo -e "${BLUE}🏠 Iniciando sistema catastro...${NC}"
    docker-compose up -d backend frontend nginx
    echo -e "${GREEN}✅ Sistema catastro iniciado${NC}"
    show_status
}

# Iniciar solo sistema planificación
start_planning() {
    echo -e "${BLUE}🗺️ Iniciando sistema planificación...${NC}"
    docker-compose up -d backend-planificacion frontend-planificacion
    echo -e "${GREEN}✅ Sistema planificación iniciado${NC}"
    show_status
}

# Detener todos los servicios
stop_all() {
    echo -e "${YELLOW}⏹️ Deteniendo todos los servicios...${NC}"
    docker-compose down
    echo -e "${GREEN}✅ Todos los servicios detenidos${NC}"
}

# Ver logs de todos los servicios
logs_all() {
    echo -e "${BLUE}📋 Mostrando logs de todos los servicios...${NC}"
    docker-compose logs -f
}

# Ver logs del sistema catastro
logs_catastro() {
    echo -e "${BLUE}📋 Mostrando logs del sistema catastro...${NC}"
    docker-compose logs -f backend frontend nginx
}

# Ver logs del sistema planificación
logs_planning() {
    echo -e "${BLUE}📋 Mostrando logs del sistema planificación...${NC}"
    docker-compose logs -f backend-planificacion frontend-planificacion
}

# Ver estado de contenedores
show_status() {
    echo -e "${BLUE}📊 Estado de los contenedores:${NC}"
    docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
}

# Limpiar contenedores e imágenes
clean() {
    echo -e "${YELLOW}🧹 Limpiando contenedores e imágenes...${NC}"
    docker-compose down -v --rmi all --remove-orphans
    docker system prune -f
    echo -e "${GREEN}✅ Limpieza completada${NC}"
}

# Modo desarrollo
dev_mode() {
    echo -e "${BLUE}👨‍💻 Iniciando en modo desarrollo...${NC}"
    docker-compose -f docker-compose.dev.yml up -d
    echo -e "${GREEN}✅ Modo desarrollo iniciado${NC}"
    show_status
}

# Verificar Docker al inicio
check_docker

# Procesar comandos
case "${1:-}" in
    "build-all")
        build_all
        ;;
    "start-all")
        start_all
        ;;
    "start-catastro")
        start_catastro
        ;;
    "start-plan")
        start_planning
        ;;
    "stop-all")
        stop_all
        ;;
    "logs-all")
        logs_all
        ;;
    "logs-catastro")
        logs_catastro
        ;;
    "logs-plan")
        logs_planning
        ;;
    "status")
        show_status
        ;;
    "clean")
        clean
        ;;
    "dev")
        dev_mode
        ;;
    "help"|"-h"|"--help"|"")
        show_help
        ;;
    *)
        echo -e "${RED}❌ Comando desconocido: $1${NC}"
        echo ""
        show_help
        exit 1
        ;;
esac