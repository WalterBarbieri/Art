# Art

[![License](https://img.shields.io/badge/License-Proprietary-red)](LICENSE)

## Description
This site is a Single Page Application (SPA) for an artist who conducts projects (workshops and performances) in nature. Through this site, the administrator can create and modify projects, manage a newsletter, and an email system for course subscribers. Users can subscribe to the newsletter and projects without authentication.

## Prerequisites
- Angular: 20.0.0
- Node.js: 20.11.1 or later (see [Angular Versions](https://angular.dev/reference/versions))
- npm: latest stable version
- Angular CLI: 20.x

## Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/WalterBarbieri/Art.git
   ```
2. Navigate to the project directory:
   ```bash
   cd art
   ```
3. Install dependencies:
   ```bash
   npm install
   ```

## External Libraries

### NGX TRANSLATE
i18n translation management
```bash
npm install @ngx-translate/core@^17.0.0 @ngx-translate/http-loader@^17.0.0
```
### JWT
JSON Web Token authentication
```bash
npm install @auth0/angular-jwt
```
### Bootstrap & Popper
UI framework and positioning
```bash
npm install @ng-bootstrap/ng-bootstrap@^19.0.0 @popperjs/core@^2.11.8
```
### GLightbox
Image and video gallery with lightbox
```bash
npm install glightbox
```
## Usage

### Development
Start the development server with hot reload:
```bash
ng serve -o
ng s -o
```
This will open the app in your browser at `http://localhost:4200`.

### Build
Build the project for production:
```bash
ng build --configuration production
```
The output will be in the `dist/` folder.

## Deployment
This is a static Angular SPA. After building, deploy the `dist/browser/` folder to any static hosting service.

For backend integration, ensure the API endpoints are configured in `environment.ts`.

## Project Structure
This Angular application follows a modular architecture with a focus on separation of concerns. The project is currently migrating towards standalone components (Angular best practices), with most components still using modules but gradually becoming standalone.

### Root Level (`src/app/`)
- `app.component.*`: Main app component.
- `app.module.ts`: Root module (being phased out for standalone).
- `app-routing.module.ts`: Main routing configuration.

### Key Folders
- **`auth/`**: Authentication-related modules and components.
  - `auth-routing.module.ts`: Routing for auth pages.
  - `auth.interface.ts`: TypeScript interfaces for auth.
  - `auth.module.ts`: Auth module.
  - `login/`: Login component and related files.
  - `password/`: Password management (reset, etc.).

- **`components/`**: Application-specific components, organized by feature.
  - Includes pages like `home/`, `contact/`, `projects/`, `userpage/`, etc.
  - Each folder contains component files (HTML, SCSS, TS, spec).
  - Some use dedicated modules; migrating to standalone.

- **`core/`**: Core application services, guards, and interceptors.
  - `core.module.ts`: Core module for providers.
  - `guards/`: Route guards for authentication/authorization.
  - `interceptors/`: HTTP interceptors (e.g., for JWT, errors).
  - `services/`: General services (e.g., API clients, utilities).

- **`directive/`**: Custom Angular directives.
  - `textarea-autoresize.directive.ts`: Directive for auto-resizing textareas.

- **`models/`**: TypeScript interfaces and types.
  - Files like `user.interface.ts`, `event.interface.ts`, defining data models.

- **`service/`**: Feature-specific services.
  - Services for content, courses, events, images, language, meta, static assets, users.

- **`shared/`**: Reusable components, pipes, and services across the app.
  - `components/`: Shared UI components (e.g., buttons, modals).
  - `pipes/`: Custom pipes for data transformation.
  - `services/`: Shared services (e.g., utilities).
  - `shared.module.ts`: Module for shared declarations.

### Notes
- **Migration to Standalone**: The app is transitioning to standalone components for better tree-shaking and modularity.
- **Shared Components**: Prioritizing reusable elements in `shared/` to avoid duplication.
- **Backend Integration**: Services in `core/services/` and `service/` handle API calls; configure in `environments/`.

## Author
- **Name**: Walter Barbieri
- **Company**: BW Full Stack Developer
- **VAT Number**: 02521100509
- **Email**: walter@walterbarbieri.it
- **GitHub**: [https://github.com/WalterBarbieri](https://github.com/WalterBarbieri)
