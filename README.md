# Terra Luna Classic Website

A modern, responsive web application for the Terra Luna Classic blockchain ecosystem, providing information about governance, validators, ecosystem projects, and more.

![Terra Luna Classic Website](https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?auto=format&fit=crop&q=80&w=1200&h=630)

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Development](#development)
  - [Building for Production](#building-for-production)
- [Project Structure](#project-structure)
- [Testing Guide](#testing-guide)
  - [Component Testing](#component-testing)
  - [End-to-End Testing](#end-to-end-testing)
  - [Performance Testing](#performance-testing)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

## ✨ Features

- **Dark/Light Mode**: Toggle between dark and light themes for user preference
- **Governance Portal**: View and interact with on-chain governance proposals
- **Validators Dashboard**: Explore active validators, their details, and statistics
- **Ecosystem Projects**: Discover projects building on Terra Luna Classic
- **Price Feeds**: Real-time token price information
- **Development Roadmap**: View upcoming features and improvements
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices

## 🛠️ Tech Stack

- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **State Management**: React Context API
- **API Communication**: Axios, React Query
- **Animations**: Framer Motion
- **Charts & Graphs**: Recharts
- **Date Formatting**: date-fns
- **Icons**: Lucide React

## 🚀 Getting Started

### Prerequisites

- Node.js (v16.0.0 or higher)
- npm or yarn

### Installation

1. Clone the repository:

```bash
git clone https://github.com/your-organization/terra-website.git
cd terra-website
```

2. Install dependencies:

```bash
npm install
# or
yarn
```

### Development

Start the development server:

```bash
npm run dev
# or
yarn dev
```

The application will be available at `http://localhost:5173`.

### Building for Production

Build the application for production:

```bash
npm run build
# or
yarn build
```

Preview the production build:

```bash
npm run preview
# or
yarn preview
```

## 📁 Project Structure

```
terra-website/
├── public/             # Static assets
├── src/
│   ├── api/            # API interfaces and services
│   ├── components/     # Reusable UI components
│   │   ├── governance/ # Governance-specific components
│   │   └── ...         # Other component modules
│   ├── pages/          # Main page components
│   ├── utils/          # Utility functions
│   ├── App.tsx         # Main application component
│   ├── index.css       # Global styles
│   └── main.tsx        # Application entry point
├── .bolt/              # Bolt configuration
├── index.html          # HTML template
├── package.json        # Project dependencies and scripts
├── tailwind.config.js  # Tailwind CSS configuration
├── tsconfig.json       # TypeScript configuration
└── vite.config.ts      # Vite configuration
```

## 🧪 Testing Guide

### Component Testing

We use React Testing Library for component tests. To run component tests:

1. Install testing dependencies if not already done:

```bash
npm install --save-dev vitest @testing-library/react @testing-library/jest-dom happy-dom
# or
yarn add --dev vitest @testing-library/react @testing-library/jest-dom happy-dom
```

2. Create test files with the `.test.tsx` extension in the same directory as your component.

Example test file for a component:

```tsx
// Button.test.tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Button from './Button';

describe('Button component', () => {
  it('renders correctly', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });
});
```

3. Run tests:

```bash
npm run test
# or
yarn test
```

### End-to-End Testing

For end-to-end testing, we use Cypress:

1. Install Cypress:

```bash
npm install --save-dev cypress
# or
yarn add --dev cypress
```

2. Open Cypress and create your first test:

```bash
npx cypress open
```

3. Create test files in the `cypress/integration` directory.

Example test:

```js
// cypress/integration/home.spec.js
describe('Home Page', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should display the header', () => {
    cy.get('header').should('be.visible');
  });

  it('should toggle theme when clicking theme button', () => {
    cy.get('button[aria-label="Toggle theme"]').click();
    cy.get('body').should('have.class', 'dark-theme');
  });
});
```

4. Run Cypress tests:

```bash
npx cypress run
```

### Performance Testing

To test the performance of the application:

1. Use Lighthouse in Chrome DevTools to analyze performance metrics.
2. Run a production build and use tools like `web-vitals` to measure Core Web Vitals.

```bash
npm install web-vitals
# or
yarn add web-vitals
```

3. Add web-vitals reporting to your application:

```tsx
// Add this to your main.tsx or index.tsx
import { getCLS, getFID, getLCP } from 'web-vitals';

getCLS(console.log);
getFID(console.log);
getLCP(console.log);
```

## 📦 Deployment

### Static Hosting (Recommended)

1. Build the application:

```bash
npm run build
# or
yarn build
```

2. Deploy the contents of the `dist` directory to a static hosting service like:
   - Netlify
   - Vercel
   - GitHub Pages
   - AWS S3 + CloudFront

### Containerized Deployment

1. Create a Dockerfile:

```dockerfile
FROM node:16-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

2. Build and run the Docker container:

```bash
docker build -t terra-website .
docker run -p 80:80 terra-website
```

## 👥 Contributing

We welcome contributions to the Terra Luna Classic website! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Style Guidelines

- Follow the existing code style
- Write descriptive commit messages
- Add or update tests for new features
- Update documentation when needed

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.
