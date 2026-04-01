#!/bin/bash

# RadioFlow - Script de Despliegue en Producción
# Uso: ./deploy.sh [comando]
# Comandos: start, stop, restart, build, logs, status

set -e

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Variables de entorno por defecto
export NEXTAUTH_SECRET=${NEXTAUTH_SECRET:-"radioflow-super-secret-key-change-me-$(date +%s)"}
export NEXTAUTH_URL=${NEXTAUTH_URL:-"http://localhost:3000"}
export ICECAST_SOURCE_PASSWORD=${ICECAST_SOURCE_PASSWORD:-"sourcepassword"}
export ICECAST_ADMIN_PASSWORD=${ICECAST_ADMIN_PASSWORD:-"adminpassword"}

# Función para mostrar mensajes
log_info() { echo -e "${BLUE}[INFO]${NC} $1"; }
log_success() { echo -e "${GREEN}[SUCCESS]${NC} $1"; }
log_warning() { echo -e "${YELLOW}[WARNING]${NC} $1"; }
log_error() { echo -e "${RED}[ERROR]${NC} $1"; }

# Función de inicio
start() {
    log_info "Iniciando RadioFlow..."
    docker-compose up -d
    
    log_info "Esperando a que los servicios estén listos..."
    sleep 10
    
    # Verificar que la aplicación esté corriendo
    if curl -s http://localhost:3000/api > /dev/null 2>&1; then
        log_success "RadioFlow está corriendo en http://localhost:3000"
    else
        log_warning "La aplicación puede estar iniciando todavía. Verifica con: ./deploy.sh logs"
    fi
    
    log_info "Icecast streaming disponible en http://localhost:8000"
}

# Función de detención
stop() {
    log_info "Deteniendo RadioFlow..."
    docker-compose down
    log_success "RadioFlow detenido"
}

# Función de reinicio
restart() {
    log_info "Reiniciando RadioFlow..."
    stop
    sleep 2
    start
}

# Función de build
build() {
    log_info "Construyendo imagen de RadioFlow..."
    docker-compose build --no-cache
    log_success "Imagen construida exitosamente"
}

# Función de logs
logs() {
    docker-compose logs -f --tail=100
}

# Función de estado
status() {
    log_info "Estado de los servicios:"
    docker-compose ps
    
    echo ""
    log_info "Health check de la aplicación:"
    if curl -s http://localhost:3000/api > /dev/null 2>&1; then
        log_success "Aplicación respondiendo correctamente"
    else
        log_error "Aplicación no responde"
    fi
}

# Función de backup
backup() {
    log_info "Creando backup de la base de datos..."
    BACKUP_FILE="backup-$(date +%Y%m%d-%H%M%S).db"
    docker cp radioflow-app:/app/db/custom.db "./$BACKUP_FILE"
    log_success "Backup creado: $BACKUP_FILE"
}

# Función de restore
restore() {
    if [ -z "$1" ]; then
        log_error "Especifica el archivo de backup: ./deploy.sh restore backup-file.db"
        exit 1
    fi
    
    if [ ! -f "$1" ]; then
        log_error "Archivo no encontrado: $1"
        exit 1
    fi
    
    log_info "Restaurando base de datos desde $1..."
    docker cp "$1" radioflow-app:/app/db/custom.db
    docker-compose restart radioflow
    log_success "Base de datos restaurada"
}

# Función de seed
seed() {
    log_info "Ejecutando seed de la base de datos..."
    docker exec radioflow-app npx prisma db seed
    log_success "Seed completado"
}

# Mostrar uso
usage() {
    echo "RadioFlow - Script de Despliegue"
    echo ""
    echo "Uso: ./deploy.sh [comando]"
    echo ""
    echo "Comandos disponibles:"
    echo "  start     - Iniciar todos los servicios"
    echo "  stop      - Detener todos los servicios"
    echo "  restart   - Reiniciar todos los servicios"
    echo "  build     - Construir la imagen Docker"
    echo "  logs      - Ver logs de los servicios"
    echo "  status    - Ver estado de los servicios"
    echo "  backup    - Crear backup de la base de datos"
    echo "  restore   - Restaurar base de datos (usar: ./deploy.sh restore archivo.db)"
    echo "  seed      - Ejecutar seed de la base de datos"
    echo "  help      - Mostrar esta ayuda"
}

# Ejecutar comando
case "${1:-}" in
    start)
        start
        ;;
    stop)
        stop
        ;;
    restart)
        restart
        ;;
    build)
        build
        ;;
    logs)
        logs
        ;;
    status)
        status
        ;;
    backup)
        backup
        ;;
    restore)
        restore "$2"
        ;;
    seed)
        seed
        ;;
    help|--help|-h)
        usage
        ;;
    *)
        if [ -n "${1:-}" ]; then
            log_error "Comando desconocido: $1"
        fi
        usage
        exit 1
        ;;
esac
