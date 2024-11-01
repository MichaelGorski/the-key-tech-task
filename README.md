# Task for The Key Tech in Next.js 

A production-ready Next.js application template featuring authentication, protected routes, and optimized performance.

## Features

### Authentication
- Context-based auth management
- Persistent sessions via `localStorage`
- Protected route guards
- Token-based authentication

### Performance Optimizations
- Lazy loading components
- Virtualized lists with drag-and-drop
- Code splitting and dynamic imports
- Optimized bundle size

### Developer Experience
- TypeScript support
- Comprehensive test suite
- Modern React patterns
- Code quality tools


## Getting Started

### Prerequisites
- **Node.js** 18.x or later
- **bun** or **npm** or **yarn**

### Installation

Clone the repository:
```bash
git clone https://github.com/MichaelGorski/the-key-tech-task.git
or
git clone git@github.com:MichaelGorski/the-key-tech-task.git
```

Install dependencies:
```bash
bun install
# or
npm install
# or
yarn install
```

Set up environment variables:
```bash
cp .env.example .env.local
```
Edit `.env.local` with your configuration.

---

## Development

Start the development server:

```bash
bun dev
# or
npm run dev
# or
yarn dev
```

The application will be available at `http://localhost:3000`.

---

## Testing

### Running Tests

Execute the test suite:
```bash
bun test
# or
npm test
# or
yarn test
```

### Test Coverage

Generate coverage report:
```bash
bun test
# or
npm run test:coverage
# or
yarn test:coverage
```

Coverage reports will be available in the `/coverage` directory.

---

## Project Structure
```bash
├── app/               # Next.js pages and API routes
├── app/(auth)         # Login
├── app/(protected)    # Home Page
├── api/auth           # Api Routes
├── lib/components/    # Reusable UI components 
├── context/           # React contexts including auth
├── graphql/           # GraphQL 
├── graphql/mutations  # GraphQL Mutations 
├── graphql/queries    # GraphQL Queries
└── utils/             # Helper functions and utilities
└── server/auth        # Next.js related middleware, config
```

---
