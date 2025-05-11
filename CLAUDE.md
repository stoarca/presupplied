# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Presupplied is an educational platform providing a free, open-source digital curriculum for children ages 0-18. The platform's key differentiators:
- Free and open source educational curriculum
- Comprehensive coverage from early childhood to advanced topics
- Teacher resources to aid instructors
- Starting from birth for first-time parents
- Designed for both classroom and homeschooling
- Prerequisite-based curriculum rather than age-based

The goal is to dramatically reduce the cost of quality education.

## Development Environment Setup

1. **Clone and Setup**
   ```bash
   git clone https://github.com/stoarca/presupplied.git
   cd presupplied
   ```

2. **Prerequisites**
   - [Bun](https://bun.sh) for JavaScript/TypeScript runtime
   - Docker for containerization
   
   ```bash
   curl -fsSL https://bun.sh/install | bash
   ```

3. **Setup HTTPS**
   ```bash
   cd images/psingress/certs && ./generate-certs.sh
   sudo cp presupplied-selfsigned.crt /usr/local/share/ca-certificates/
   sudo update-ca-certificates
   ```
   
4. **Configure hosts file**
   ```bash
   echo "127.0.0.1 applocal.presupplied.com" | sudo tee -a /etc/hosts
   ```

5. **Start the application**
   ```bash
   ./run.sh
   ```

## Development Environment

### Live Development

The development environment uses Docker with live mounting and hot reloading:
- **Client (Frontend)**: Files are live-mounted and changes are automatically rebuilt (hot module replacement)
- **Server (Backend)**: Files are live-mounted with automatic restart on changes
- **No manual rebuild needed**: When you modify source files, they're automatically picked up

### Key Build Commands

Note: In development mode, you typically don't need to manually rebuild after making changes.

#### Client (Frontend)

```bash
# Build the frontend (usually not needed in development)
docker exec presupplied-psapp-1 bash -c "cd /presupplied/images/psapp/client && bun run build"

# Development mode (watch files) - automatically rebuilds on changes
docker exec presupplied-psapp-1 bash -c "cd /presupplied/images/psapp/client && bun run dev" 

# Run linting
docker exec presupplied-psapp-1 bash -c "cd /presupplied/images/psapp/client && bun run lint"

# Fix linting issues
docker exec presupplied-psapp-1 bash -c "cd /presupplied/images/psapp/client && bun run lint:fix"

# Run tests
docker exec presupplied-psapp-1 bash -c "cd /presupplied/images/psapp/client && bun test"
```

### Server (Backend)

```bash
# Start server
docker exec presupplied-psapp-1 bash -c "cd /presupplied/images/psapp/server && bun run start"

# Development mode (watch files)
docker exec presupplied-psapp-1 bash -c "cd /presupplied/images/psapp/server && bun run dev"

# Verify TypeScript build
docker exec presupplied-psapp-1 bash -c "cd /presupplied/images/psapp/server && bun run typecheck"

# Database migrations
docker exec presupplied-psapp-1 bash -c "cd /presupplied/images/psapp/server && bun run migration:generate <name>"
docker exec presupplied-psapp-1 bash -c "cd /presupplied/images/psapp/server && bun run migration:run"
docker exec presupplied-psapp-1 bash -c "cd /presupplied/images/psapp/server && bun run migration:revert"
docker exec presupplied-psapp-1 bash -c "cd /presupplied/images/psapp/server && bun run migration:show"
```

## Repository Structure

### Root Directory

- **README.md**: Project overview and setup instructions
- **ROADMAP.md**: Development priorities and future plans
- **run.sh**: Main script to start the application using Docker Compose
- **docker-compose.yml.js**: Docker Compose configuration
- **secrets.dev.json/secrets.prod.json.encrypted**: Application secrets
- **encrypt-prod-secrets.sh/decrypt-prod-secrets.sh**: Scripts for managing encrypted secrets

### Docker Images (`/images`)

#### psapp - Main Application

The core application using a client-server architecture:

##### Client Structure
- **src/**
  - **index.tsx**: Main application entry point with routing
  - **components/**: Reusable UI components
  - **pages/**: Main application pages (Login, Register, ChildHomePage, ParentHomePage)
  - **ModuleContext.tsx**: Provides context for module components with audio support
  - **Module.tsx**: Core module functionality including exercise logic and UI
  - **StudentContext.tsx**: Manages student data and progress
  - **modules/**: Educational content organized by module
    - Each module (e.g., INTRODUCTION, READ_WORDS_*) has its own directory
    - Common modules with shared functionality in **modules/common/**
  - **util.ts**: Utility functions

##### Server Structure
- **src/**
  - **index.ts**: Main server entry point and API routes
  - **entity/**: Database entity definitions
  - **migration/**: Database migrations
  - **data-source.ts**: TypeORM configuration
  - **env.ts**: Environment configuration
  - **typedRoutes.ts**: Type-safe route definitions

##### Static Assets (`/images/psapp/static`)
- **images/**: Image assets for the application
- **knowledge-map.json**: Curriculum map with dependencies
- **progress.json**: Default progress data
- **dist/**: Compiled client assets

### Testing (`/testing`)
- Python-based inference and recording tools
- Speech recognition (wav2vec2-live)

### Codemods (`/codemods`)
- Scripts for transforming code
- Includes tools for managing word modules

## Architecture Overview

The application follows a client-server architecture with Docker containerization:

### Container Components

1. **psapp**: Main application container
   - Client (React/TypeScript frontend)
   - Server (Express/TypeORM backend)

2. **pstts**: Text-to-speech service

3. **pspostgres**: PostgreSQL database

4. **psingress**: Traefik reverse proxy for routing and SSL

### Client Architecture

- React-based single page application with TypeScript
- Component system for educational modules
- Material-UI for styling
- Uses esbuild for bundling (configured in build.ts)
- Modules are organized in a prerequisite graph structure

### Server Architecture

- Express API with TypeScript
- TypeORM for database access
- JWT-based authentication
- APIs for:
  - Authentication (login/register/logout)
  - Student progress tracking
  - Module and video completion status

### Audio and TTS

The application uses:
- Pre-recorded audio for instructions and feedback
- Text-to-speech for dynamic content
- Audio recording for speech recognition exercises

### Data Model

- **Student**: User accounts with authentication
- **Module**: Educational modules with unique vanity IDs
- **StudentProgress**: Tracks student completion of modules
- **StudentProgressVideo**: Tracks student progress through videos

### Module System

The curriculum is organized as a graph of modules with prerequisites (knowledge map). The modules include:

- Reading modules (letters, words)
- Recognition modules
- Tracking modules
- Interactive modules (finger tracing, mouse usage)

## Developer Guidelines

1. **Code Style**
  - Follow TypeScript typing conventions
  - Use ESLint for code quality
  - NEVER add comments unless explicitly asked for
  - NEVER use if without {}
  - NEVER import \*, always import specific objects
  - ALWAYS use 2 spaces for indentation
  - before making changes, ALWAYS review the eslint config to understand the style

2. **Adding New Modules**
  - Follow existing patterns in the `/modules` directory
  - Update the knowledge map to include prerequisites
  - Generate appropriate audio assets if needed

3. **Database Changes**
  - Use TypeORM migration system
  - Test migrations thoroughly before deployment

4. **Build System**
  - Uses esbuild for frontend bundling
  - The build.ts file handles bundling configuration 
  - Automatically generates available modules list during build

