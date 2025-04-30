# Presupplied Codebase Documentation

This document provides a high-level overview of the presupplied.com codebase, which is a digital curriculum for children ages 0-18 with the goal of dramatically reducing the cost of quality education.

## Core Project Features

- **Free and open source** educational curriculum
- **Comprehensive** coverage from early childhood to advanced topics
- **Teacher resources** to aid instructors
- **Starting from birth** for first-time parents
- **Designed for both classroom and homeschooling**
- **Prerequisite-based** curriculum rather than age-based

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

##### Client (`/images/psapp/client`)
- React-based frontend using TypeScript
- Uses Material-UI for styling
- Main index.tsx provides the application routes
- Module system for different educational components

###### Client Structure
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
    - Reading modules with word exercises in **modules/READ_WORDS_***
    - Recognition modules in **modules/RECOGNIZE_***
    - Repetition modules in **modules/REPEAT_***
    - Finger tracing modules in **modules/FINGER_TRACE_***
    - Mouse usage modules in **modules/USE_MOUSE_***
  - **util.ts**: Utility functions

##### Server (`/images/psapp/server`)
- Express-based backend using TypeScript and TypeORM
- Handles API requests, authentication, and database access
- Serves static files and proxies TTS service

###### Server Structure
- **src/**
  - **index.ts**: Main server entry point and API routes
  - **entity/**: Database entity definitions
    - **Student.ts**: Student user model
    - **Module.ts**: Educational module model
    - **StudentProgress.ts**: Tracks student progress
    - **StudentProgressVideo.ts**: Tracks video progress
  - **migration/**: Database migrations
  - **data-source.ts**: TypeORM configuration
  - **env.ts**: Environment configuration
  - **typedRoutes.ts**: Type-safe route definitions

##### Static Assets (`/images/psapp/static`)
- **images/**: Image assets for the application
  - **cartoon/**: Cartoon characters and imagery
  - **fingers/**: Hand and finger SVG images for finger exercises
  - **misc/**: Miscellaneous images
  - **module_cards/**: Card images for module selection
  - **objects/**: SVG objects for recognition exercises
- **knowledge-map.json**: Curriculum map with dependencies
- **progress.json**: Default progress data
- **dist/**: Compiled client assets

#### Other Docker Images
- **psingress/**: Ingress proxy with TLS termination
- **pspostgres/**: Database container
- **pstts/**: Text-to-speech service

### Testing (`/testing`)

- Python-based inference and recording tools
- Speech recognition (wav2vec2-live)

### Codemods (`/codemods`)

- Scripts for transforming code
- Includes tools for managing word modules

## Key Components

### Educational Modules

The curriculum is organized into modules with prerequisites, forming a knowledge map. Module types include:

1. **Reading modules**: Teaching letter and word recognition
2. **Recognition modules**: Object and pattern recognition
3. **Tracking modules**: Visual tracking exercises
4. **Repeat modules**: Sound and word repetition
5. **Interactive modules**: Mouse usage, finger tracing

### Database Structure

The database tracks:
- Students and authentication
- Module completion status
- Progress through videos and exercises

### Audio and TTS

The application uses:
- Pre-recorded audio for instructions and feedback
- Text-to-speech for dynamic content
- Audio recording for speech recognition exercises

## Development Guidelines

When making changes to this codebase:

1. Keep this documentation updated with new modules or structural changes
2. Follow existing patterns for creating new educational modules
3. Maintain TypeScript typing across the application
4. Use the Docker-based development environment for testing

## Testing

### Running Tests
The project uses Jest for testing client-side code. Tests are located in `images/psapp/client/src/__tests__/` directory.

To run tests:
1. Make sure the application containers are running (`./run.sh`)
2. Execute tests in the Docker container:
   ```bash
   docker exec presupplied-psapp-1 bash -c "cd /presupplied/images/psapp/client && npm test"
   ```

For running tests with coverage:
```bash
docker exec presupplied-psapp-1 bash -c "cd /presupplied/images/psapp/client && npm test -- --coverage"
```

Test files should follow the naming pattern `*.test.ts` or `*.test.tsx`.

### Linting
The project uses ESLint for code quality checks:
```bash
docker exec presupplied-psapp-1 bash -c "cd /presupplied/images/psapp/client && npm run lint"
```

## Knowledge Map

The curriculum is organized in a prerequisite graph (knowledge-map.json) where each module depends on previously completed modules. This allows for a flexible, non-age-based progression through the material.

---

**Note to AI assistants**: This document serves as a high-level overview of the presupplied.com codebase. As you make changes to the code, please keep this documentation updated to reflect the current state of the project. Add new modules, architecture changes, or other important modifications to help future developers (and AIs) understand the system more quickly.