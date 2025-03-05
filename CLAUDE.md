# Open-DPP Admin Interface Development Guidelines

## Build Commands
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run check-ts` - TypeScript type checking
- `npm run lint` - Run ESLint with fix
- `npm run test` - Run all tests
- `npm run test src/components/__tests__/ItemList.spec.ts` - Run single test file
- `npx cypress open --component` - Open Cypress component testing

## Code Style Guidelines
- **Formatting**: Follows Prettier defaults with ESLint integration
- **Components**: Use Vue 3 Composition API with `<script setup lang="ts">`
- **Types**: Strict TypeScript with explicit typing, no implicit `any`
- **Naming**: PascalCase for components, camelCase for properties/methods
- **Imports**: Group by category (Vue, third-party, local)
- **State Management**: Use Pinia stores for shared state
- **Testing**: Use Vitest for unit tests, Cypress for component tests
- **Error Handling**: Use async/await with try/catch blocks
- **Component Structure**: template → script → style order in Vue files