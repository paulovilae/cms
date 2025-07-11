#!/bin/bash

# Docker Management Scripts for Multi-Tenant CMS
# Usage: ./docker-scripts.sh [command] [business]

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Helper functions
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Docker is running
check_docker() {
    if ! docker info > /dev/null 2>&1; then
        log_error "Docker is not running. Please start Docker first."
        exit 1
    fi
}

# Build all services
build_all() {
    log_info "Building all Docker services..."
    docker-compose build
    log_success "All services built successfully"
}

# Start specific business or all
start_business() {
    local business=$1
    
    if [ -z "$business" ]; then
        log_info "Starting all business services..."
        docker-compose up -d
        log_success "All services started"
        show_urls
    else
        case $business in
            "intellitrade"|"salarium"|"latinos")
                log_info "Starting $business service..."
                docker-compose up -d $business
                log_success "$business service started"
                show_business_url $business
                ;;
            "dev"|"development")
                log_info "Starting development service..."
                docker-compose --profile dev up -d dev-all
                log_success "Development service started"
                echo "Development: http://localhost:3000"
                ;;
            *)
                log_error "Unknown business: $business"
                log_info "Available options: intellitrade, salarium, latinos, dev"
                exit 1
                ;;
        esac
    fi
}

# Stop services
stop_services() {
    local business=$1
    
    if [ -z "$business" ]; then
        log_info "Stopping all services..."
        docker-compose down
        log_success "All services stopped"
    else
        log_info "Stopping $business service..."
        docker-compose stop $business
        log_success "$business service stopped"
    fi
}

# Show service URLs
show_urls() {
    echo ""
    log_info "Service URLs:"
    echo "IntelliTrade: http://localhost:3001"
    echo "Salarium:     http://localhost:3002"
    echo "Latinos:      http://localhost:3003"
    echo ""
    log_info "Admin URLs:"
    echo "IntelliTrade: http://localhost:3001/admin"
    echo "Salarium:     http://localhost:3002/admin"
    echo "Latinos:      http://localhost:3003/admin"
}

# Show specific business URL
show_business_url() {
    local business=$1
    case $business in
        "intellitrade")
            echo "IntelliTrade: http://localhost:3001"
            echo "Admin: http://localhost:3001/admin"
            ;;
        "salarium")
            echo "Salarium: http://localhost:3002"
            echo "Admin: http://localhost:3002/admin"
            ;;
        "latinos")
            echo "Latinos: http://localhost:3003"
            echo "Admin: http://localhost:3003/admin"
            ;;
    esac
}

# View logs
view_logs() {
    local business=$1
    
    if [ -z "$business" ]; then
        log_info "Showing logs for all services..."
        docker-compose logs -f
    else
        log_info "Showing logs for $business..."
        docker-compose logs -f $business
    fi
}

# Seed database
seed_database() {
    local business=$1
    
    if [ -z "$business" ]; then
        log_error "Please specify a business to seed: intellitrade, salarium, latinos"
        exit 1
    fi
    
    log_info "Seeding $business database..."
    docker-compose exec $business node seed-script.js
    log_success "$business database seeded"
}

# Backup databases
backup_databases() {
    local timestamp=$(date +%Y%m%d_%H%M%S)
    local backup_dir="backups/$timestamp"
    
    log_info "Creating database backup..."
    mkdir -p $backup_dir
    
    # Copy database files
    if [ -f "databases/intellitrade.db" ]; then
        cp databases/intellitrade.db $backup_dir/
        log_success "IntelliTrade database backed up"
    fi
    
    if [ -f "databases/salarium.db" ]; then
        cp databases/salarium.db $backup_dir/
        log_success "Salarium database backed up"
    fi
    
    if [ -f "databases/latinos.db" ]; then
        cp databases/latinos.db $backup_dir/
        log_success "Latinos database backed up"
    fi
    
    # Create compressed archive
    tar -czf backups/backup_$timestamp.tar.gz $backup_dir
    log_success "Backup created: backups/backup_$timestamp.tar.gz"
}

# Reset databases
reset_databases() {
    log_warning "This will delete all database files. Are you sure? (y/N)"
    read -r response
    
    if [[ "$response" =~ ^[Yy]$ ]]; then
        log_info "Stopping services..."
        docker-compose down
        
        log_info "Removing database files..."
        rm -f databases/*.db
        
        log_info "Restarting services..."
        docker-compose up -d
        
        log_success "Databases reset successfully"
    else
        log_info "Database reset cancelled"
    fi
}

# Show service status
show_status() {
    log_info "Service Status:"
    docker-compose ps
}

# Clean up Docker resources
cleanup() {
    log_warning "This will remove unused Docker resources. Continue? (y/N)"
    read -r response
    
    if [[ "$response" =~ ^[Yy]$ ]]; then
        log_info "Cleaning up Docker resources..."
        docker system prune -f
        log_success "Cleanup completed"
    else
        log_info "Cleanup cancelled"
    fi
}

# Show help
show_help() {
    echo "Docker Management Scripts for Multi-Tenant CMS"
    echo ""
    echo "Usage: $0 [command] [business]"
    echo ""
    echo "Commands:"
    echo "  build                    Build all Docker services"
    echo "  start [business]         Start services (all or specific business)"
    echo "  stop [business]          Stop services (all or specific business)"
    echo "  restart [business]       Restart services"
    echo "  logs [business]          View logs (all or specific business)"
    echo "  status                   Show service status"
    echo "  seed <business>          Seed database for specific business"
    echo "  backup                   Backup all databases"
    echo "  reset                    Reset all databases (destructive)"
    echo "  cleanup                  Clean up unused Docker resources"
    echo "  urls                     Show service URLs"
    echo "  help                     Show this help message"
    echo ""
    echo "Businesses:"
    echo "  intellitrade            Trade finance platform"
    echo "  salarium                HR document flow system"
    echo "  latinos                 Trading stocks bot platform"
    echo "  dev                     Development mode (all plugins)"
    echo ""
    echo "Examples:"
    echo "  $0 start intellitrade   Start only IntelliTrade"
    echo "  $0 logs salarium        View Salarium logs"
    echo "  $0 seed latinos         Seed Latinos database"
    echo "  $0 backup               Backup all databases"
}

# Main script logic
main() {
    check_docker
    
    case $1 in
        "build")
            build_all
            ;;
        "start")
            start_business $2
            ;;
        "stop")
            stop_services $2
            ;;
        "restart")
            stop_services $2
            start_business $2
            ;;
        "logs")
            view_logs $2
            ;;
        "status")
            show_status
            ;;
        "seed")
            seed_database $2
            ;;
        "backup")
            backup_databases
            ;;
        "reset")
            reset_databases
            ;;
        "cleanup")
            cleanup
            ;;
        "urls")
            show_urls
            ;;
        "help"|"--help"|"-h"|"")
            show_help
            ;;
        *)
            log_error "Unknown command: $1"
            show_help
            exit 1
            ;;
    esac
}

# Run main function with all arguments
main "$@"