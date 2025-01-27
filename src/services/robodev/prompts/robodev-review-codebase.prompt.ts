export const robodevReviewCodebasePrompt = (currentTimestamp: string, taskId: string) => `
Your task is to understand the project structure and review only the most relevant files that contribute directly to the core functionality of this project. and save your findings in a new ${currentTimestamp}-${taskId}.robodev file located in the .robodev folder at the root of the project.
This includes examining the following aspects:

Controllers: Focus on the files that handle incoming requests and connect to services or logic layers.
Services: Analyze the files responsible for implementing business logic and interacting with models or APIs.
Models: Understand the data structures or schema definitions, especially those relevant to the database or APIs.
Database: Investigate the database configuration and migration files to understand the underlying data model.
Pagination: Analyze the current implementation of paginating and filtering data if they exist.

Summarize the packages that are used for DTO validations and also the example of how DTOs and models are mapped.

For the frontend, ensure to include the following:
Tailwind: Examine the configuration or implementation of Tailwind CSS, especially for styling strategies.
Queries / APIs: Focus on the logic for data fetching or communication with external/internal APIs, also on the packages used for data fetching.
Routing: Identify the files or directories defining the application routes and understand their structure and relationships.
Pages: Review the key pages of the application, understanding their purpose and how they link to other components or routes.
Components: Focus on reusable and core components, especially those that implement shared UI elements, logic, or styling strategies.

Additional Guidelines:

Avoid unnecessary deep dives into unrelated files or modules (e.g., utilities or helpers not directly tied to core functionality).
Skip third-party configurations unless they significantly alter the project's behavior.

Outcome:
Summarize how the project works. 
Store this information in a file with (${currentTimestamp}-${taskId}.robodev) as its filename. Ensure this is saved in the .robodev folder.
This file will serve as a persistent reference for future tasks.

Example of a good summary:

"
## Backend (NestJS)

### Database

- Uses Prisma ORM with PostgreSQL
- Key models:
  - User (core user entity)
  - Organization (company/team entity)
  - AuthnIdentity (authentication identities)
  - UsageLog (activity tracking)
  - Media (file storage)
  - EmailTemplate (email templating)
  - KVStoreItem (key-value storage)

### Module Structure

Each module follows a consistent pattern:

- \`*.module.ts\` - Module definition and dependency injection
- \`*.controller.ts\` - HTTP endpoints and route handlers
- \`*.service.ts\` - Business logic implementation
- \`*.repository.ts\` - Data access abstraction
- \`*.prisma-repository.ts\` - Concrete Prisma implementation

### DTOs and Validation

- Uses class-validator for input validation
- DTOs follow pattern:
  - Request DTOs (input validation)
  - Response DTOs (output transformation)
  - Uses class-transformer for serialization
  - Implements toDomain() for mapping DTOs to domain models

### Authentication

- Multi-provider authentication support
- JWT-based with refresh token mechanism
- Role-based access control (USER, ADMIN roles)
- Session management

### HTTP Layer

- RESTful API design
- Swagger/OpenAPI documentation
- Pagination support
- Error handling with custom exceptions
- CORS configuration

## Frontend (React + Vite)

### Core Dependencies

- React 18
- React Router v6 (routing)
- TanStack Query (data fetching)
- Axios (HTTP client)
- Tailwind CSS (styling)
- Headless UI (accessible components)
- React Hook Form (form handling)
- Zod (schema validation)
- Zustand (state management)

### Routing Structure

Main routes:

- Auth routes (/auth/\\*)
  - Login
  - Signup
  - Password reset flow
  - OAuth callbacks
- Protected routes
  - Organizations dashboard
  - Organization details
  - Users dashboard
  - User logs
- Protected route wrapper for authentication

### API Integration

- Centralized API client (axios instance)
- Authentication header injection
- Refresh token rotation
- Error handling with redirects
- Protected routes implementation

### State Management

- React Query for server state
- Zustand for client state
- Authentication state management

### Styling

- Tailwind CSS for utility-first styling
- Customizable theme configuration
- Responsive design support

### Components Organization

- Pages: Full page components
- Components: Reusable UI elements
- Layout components (Menu)
- Protected route wrapper

## Key Features

- Organization management
- User management
- Activity logging
- File handling
- Email templating
- Key-value storage
- Authentication with multiple providers
- Role-based access control

## Development Workflow

- TypeScript throughout
- ESLint for code quality
- Prettier for code formatting
- Vite for frontend development
- NestJS CLI for backend development
- Docker support
"
`
