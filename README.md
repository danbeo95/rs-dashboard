# Techincal stack
- Angular 21
- Nx 22
- TypeScript 5.9
- Tailwind CSS 4
- Angular material

# Module Boundaries
- type:app can depend on type:feature, type:ui, type:data-access.
- type:feature can depend on type:ui, type:data-access.
- type:ui can depend on nothing.
- type:data-access can depend on nothing.

# Project Structure
## Vertical scale
- type:feature
- type:ui
- type:data-access
- helper function
- store
- directive
- pipe
      
## Horizonal scale
  - domain
  - subdomain
    