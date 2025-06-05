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
  - **pages/**: Main application pages (Login, Register, HomePage, Settings, etc.)
  - **ModuleContext.tsx**: Provides context for module components with audio support
  - **Module.tsx**: Core module functionality including exercise logic and UI (handles childId parameter for delegated modules)
  - **UserContext.tsx**: Manages user data and progress (replaced StudentContext)
  - **modules/**: Educational content organized by module
    - Each module (e.g., INTRODUCTION, READ_WORDS_*) has its own directory
    - Common modules with shared functionality in **modules/common/**
    - Test modules (PS_TESTING_*) available in non-production environments
  - **util.ts**: Utility functions
  - **components/**: Reusable components including UserSelector for child selection

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

- **User**: User accounts with authentication (types: parent, teacher, student)
- **Module**: Educational modules with unique vanity IDs
- **UserProgress**: Tracks user completion of modules (with optional completedBy field for delegated completion)
- **UserProgressVideo**: Tracks user progress through videos
- **UserRelationship**: Links adults to children with relationship types (primary, secondary, observer)
- **UserInvitation**: Manages invitations for adults to connect with children

### Account Types and Access Patterns

#### Adult Accounts (Parent/Teacher)
- Can create and manage child accounts
- See ADULT_OWNED modules for themselves
- See CHILD_DELEGATED modules for each connected child
- Can complete modules on behalf of children
- Can invite other adults to connect with their children
- Can switch between their own view and child views

#### Child Accounts (Student)
- Created and managed by adults
- See only CHILD_OWNED modules
- Cannot see ADULT_OWNED modules
- Cannot manage other accounts
- Progress tracked separately for each child

#### Self-Managed Student Accounts
- Student accounts with no adult connections
- Act as "hybrid" accounts with access to all module types
- Can complete CHILD_DELEGATED modules for themselves
- Used for:
  - Independent learners
  - Anonymous users before registration
  - Students who register directly without a parent/teacher

#### Module Visibility Rules
- **Adults**: See ADULT_OWNED modules + CHILD_DELEGATED modules (with child selector)
- **Children**: See only CHILD_OWNED modules
- **Self-managed students**: See all module types (act as both adult and child)

### Module System

The curriculum is organized as a graph of modules with prerequisites (knowledge map). 

#### Module Types

- **ADULT_OWNED**: Modules for adults only (e.g., ACCOUNT_AND_PASSWORD)
- **CHILD_OWNED**: Modules completed by children directly (e.g., SOCIAL_SMILE, READ_WORDS_*)
- **CHILD_DELEGATED**: Modules completed by adults on behalf of specific children (e.g., CALIBRATION)

#### Module Categories

- Reading modules (letters, words)
- Recognition modules
- Tracking modules
- Interactive modules (finger tracing, mouse usage)
- Test modules (PS_TESTING_*) - Available only in non-production environments

#### Child Selection Flow

When a parent/teacher with multiple children clicks on a CHILD_DELEGATED module:
1. A UserSelector dialog appears showing all connected children
2. The parent selects which child to complete the module for
3. The module is launched with `?childId=` parameter
4. Progress is tracked specifically for that child

### Account Switching System

The application supports account switching that allows adults (parents/teachers) to switch between their own account and their children's accounts. This is implemented using a dual-token system:

#### JWT Token Structure

The JWT token contains:
```typescript
interface JWTUser {
  email: string;           // Email of the adult who originally logged in
  selectedUserId?: number; // ID of the currently active user account
}
```

#### Authentication Flow

1. **Initial Login**: When an adult logs in, a JWT is created with their email and no `selectedUserId`
2. **Account Switching**: When switching accounts via `/api/auth/switch`, a new JWT is issued with:
   - Same `email` (preserving the original adult's identity)
   - New `selectedUserId` (the target account to switch to)

#### Account Types and Switching Capabilities

**Adult Accounts (PARENT/TEACHER):**
- Can switch to their own child accounts freely (no PIN required)
- Cannot switch to other adult accounts
- Must use PIN to switch back from child to adult account

**Child Accounts (STUDENT with adults):**
- Created and managed by adults
- Cannot initiate account switching themselves
- Accessible via adult account switching

**Hybrid Accounts (Self-registered STUDENT):**
- Student accounts that register independently without adult management
- Have their own email/password login credentials
- Act as both adult and child in the system:
  - Can see ADULT_OWNED modules
  - Can complete CHILD_DELEGATED modules for themselves
  - Have full account management capabilities
- Cannot switch to other accounts (no relationships exist)
- Equivalent to "anonymous users before registration" but with persistent accounts

#### Account Switching Rules

**Who Can Switch:**
- Only adults (PARENT/TEACHER accounts) can initiate account switching
- Adults can only switch to their own account or child accounts they have relationships with
- Hybrid accounts cannot switch (they operate independently)

**PIN Requirements:**
- **Adult to Child (first time)**: No PIN required - adults can freely switch to their children
- **Child back to Adult**: PIN required (adult's PIN or default "4000")
- **Child to other Child**: PIN required for the target child
- **Adult to Adult**: Not allowed - adults cannot switch to other adult accounts

**Current User Determination:**
- If `selectedUserId` is present in JWT: Use that user as the current user
- If `selectedUserId` is absent: Use the user associated with the JWT email
- The `/api/user` endpoint returns the currently selected user's data

#### Backend Implementation Details

**JWT Verification Middleware:**
```typescript
app.use((req, resp, next) => {
  req.jwtUser = null;
  if (req.cookies['authToken']) {
    req.jwtUser = jwt.verify(req.cookies['authToken'], JWT_SIGNING_KEY) as JWTUser;
  }
  next();
});
```

**User Data Resolution:**
1. Extract `selectedUserId` from JWT
2. If `selectedUserId` exists: Load that user and verify adult has permission
3. If no `selectedUserId`: Load user by email from JWT
4. Return user data with relationships (children/adults/classmates as appropriate)
5. Hybrid accounts have no relationships, so they see only their own data

**Security Considerations:**
- Account switching validates relationships before allowing access
- Adults cannot switch to other adult accounts (relationship validation prevents this)
- PIN protection prevents unauthorized access to adult accounts
- Original adult identity is preserved in JWT even when viewing child accounts
- Hybrid accounts are isolated - no cross-account access possible
- All progress tracking maintains proper attribution (who completed what for whom)

#### Progress Tracking with Account Switching

- When an adult completes a module while viewing a child account, progress is recorded for the child
- The `completedBy` field tracks which adult completed the module on behalf of the child
- Adults can complete CHILD_DELEGATED modules for children, which appears in the child's progress
- Hybrid accounts complete all modules for themselves (acting as both adult and child)

## Developer Guidelines

1. **Code Style**
  - Follow TypeScript typing conventions
  - Use ESLint for code quality
  - NEVER add comments unless explicitly asked for
  - NEVER add comments in code, not even for clarity or explanation
  - NEVER use if without {}
  - NEVER import \*, always import specific objects
  - ALWAYS use 2 spaces for indentation
  - before making changes, ALWAYS review the eslint config to understand the style

2. **API Conventions**
  - ONLY use GET, POST, and DELETE HTTP methods
  - NEVER use PUT, PATCH, or other HTTP methods
  - Use POST for both creating and updating resources
  - Structure endpoints clearly with RESTful patterns where possible
  - Getting a list of objects: GET /api/{plural} (e.g., GET /api/invitations)
  - Getting a specific object: GET /api/{plural}/:id (e.g., GET /api/invitations/:id)
  - Creating an object: POST /api/{plural} (e.g., POST /api/invitations)
  - Updating an object: POST /api/{plural}/:id (e.g., POST /api/invitations/:id)
  - Deleting an object: DELETE /api/{plural}/:id (e.g., DELETE /api/invitations/:id)
  - **Namespace Collision Avoidance**: Endpoints that have the potential to be called with an id should never have sub-endpoints. For example, /api/user/children is problematic because it conflicts with potential /api/user/:id endpoints. Instead, use /api/children directly.

3. **Adding New Modules**
  - Follow existing patterns in the `/modules` directory
  - Create module in `/images/psapp/client/src/modules/{MODULE_NAME}/index.tsx`
  - Update the knowledge map to include prerequisites and module type
  - Generate appropriate audio assets if needed
  - Module IDs starting with `PS_TESTING_` are automatically excluded from production and admin exports
  - Add `data-test-module` attribute to module cards for E2E testing

4. **Database Changes**
  - Use TypeORM migration system
  - Test migrations thoroughly before deployment

5. **Build System**
  - Uses esbuild for frontend bundling
  - The build.ts file handles bundling configuration 
  - Automatically generates available modules list during build

6. **E2E Testing Conventions**
  - Always define selectors as constants at the top of the file
  - Never use inline string selectors in test functions
  - When using XC.evaluate, always prefix parameter names with underscore
  - When passing variables to XC.evaluate, name parameters consistently
  
  Good example:
  ```typescript
  export const moduleCardSelector = '[data-test="module-card"]';
  
  export const checkForModuleCards = Xdotoolify.setupWithPage(async (page) => {
    return XC.evaluate(page, (_moduleCardSelector: string) => {
      const cards = document.querySelectorAll(_moduleCardSelector);
      return cards.length;
    }, moduleCardSelector);
  });
  ```
  
  Bad example:
  ```typescript
  export const checkForModuleCards = Xdotoolify.setupWithPage(async (page) => {
    return XC.evaluate(page, (cardSelector: string) => {
      const cards = document.querySelectorAll(cardSelector);
      return cards.length;
    }, '[data-test="module-card"]');
  });
  ```

  **Test Chaining Best Practices**
  - Use method chaining instead of individual awaits - this ensures every action is verified and reduces flaky tests
  - Use `checkUntil` to wait for and verify expected states instead of arbitrary `waitFor`
  - Use `run(XC.autoClick, selector)` instead of `click` to move the mouse and click like a real user

  Good example (chained approach):
  ```typescript
  await page.X
    .run(Onboarding.navigateToRegister)
    .run(Onboarding.enterRegistrationDetails, { name, email, password, type })
    .run(Onboarding.submitRegistration)
    .checkUntil(getModuleCardTitles, (cards) => {
      expect(cards).toContain('Introduction to presupplied.com');
      expect(cards.length).toBe(1);
    })
    .run(XC.autoClick, moduleCardSelector)
    .checkUntil(XC.elementText, 'h1', (text) => {
      expect(text).toBe('Module Started');
    })
    .do();
  ```
  
  Bad example (individual awaits):
  ```typescript
  // Avoid this pattern - it's more prone to timing issues and doesn't verify each step
  await Onboarding.navigateToRegister(page);
  await Onboarding.enterRegistrationDetails(page, { name, email, password, type });
  await Onboarding.submitRegistration(page);
  await XC.waitFor(page, 2000); // Arbitrary wait
  
  const cards = await getModuleCardTitles(page);
  expect(cards).toContain('Introduction to presupplied.com');
  
  await XC.click(page, moduleCardSelector); // Should use run(XC.autoClick, selector)
  await XC.waitFor(page, 1000); // Another arbitrary wait
  ```
  
  Key principles:
  - **Chain all actions** in a single `.X` chain ending with `.do()`
  - **Use `checkUntil`** after actions to verify the expected state was reached
  - **No arbitrary waits** - let `checkUntil` handle timing by checking repeatedly until condition is met
  - **Use `run(XC.autoClick, selector)`** for more realistic user interaction (moves mouse then clicks)
  - **Define reusable functions** with `XC.setupWithPage` for common operations
  - **Use `checkUntil` after `requireCheckImmediatelyAfter` functions** like `selectAccount`
  
  **Testing Module Cards**
  - Define a `sortCards` helper function for consistent comparison:
    ```typescript
    const sortCards = (cardList: { title: string; childIds: number[] }[]) => cardList
      .map(card => ({ 
        title: card.title, 
        childIds: [...card.childIds].sort() 
      }))
      .sort((a, b) => a.title.localeCompare(b.title));
    ```
  - Use exact matches with `expect(sortCards(cards)).toEqual(sortCards(expected))`
  
  **Test Modules**
  - Three test modules are available in non-production environments:
    - `PS_TESTING_ADULT` - Adult owned module
    - `PS_TESTING_CHILD` - Child owned module  
    - `PS_TESTING_DELEGATED` - Child delegated module
  - These modules have no videos, making tests faster and more reliable
  - Test modules are automatically synced to the database on server startup

