# =============================================================================
# Customer Portal - Docker Development Helper Script (PowerShell)
# =============================================================================
# Usage:
#   .\docker-dev.ps1 up      # Start local environment
#   .\docker-dev.ps1 down    # Stop local environment
#   .\docker-dev.ps1 logs    # View logs
#   .\docker-dev.ps1 build   # Rebuild containers
#   .\docker-dev.ps1 clean   # Remove volumes and rebuild
#   .\docker-dev.ps1 ps      # Show container status
# =============================================================================

param(
    [Parameter(Position=0)]
    [string]$Command = "up"
)

$BASE = "docker-compose.base.yml"
$LOCAL = "docker-compose.local.yml"

switch ($Command) {
    "up" {
        Write-Host "Starting Customer Portal local environment..." -ForegroundColor Green
        docker-compose -f $BASE -f $LOCAL up -d
    }
    "down" {
        Write-Host "Stopping Customer Portal..." -ForegroundColor Yellow
        docker-compose -f $BASE -f $LOCAL down
    }
    "logs" {
        docker-compose -f $BASE -f $LOCAL logs -f
    }
    "build" {
        Write-Host "Rebuilding containers..." -ForegroundColor Cyan
        docker-compose -f $BASE -f $LOCAL up -d --build
    }
    "clean" {
        Write-Host "Cleaning and rebuilding..." -ForegroundColor Red
        docker-compose -f $BASE -f $LOCAL down -v
        docker-compose -f $BASE -f $LOCAL up -d --build
    }
    "ps" {
        docker-compose -f $BASE -f $LOCAL ps
    }
    default {
        Write-Host "Usage: .\docker-dev.ps1 [up|down|logs|build|clean|ps]"
    }
}
