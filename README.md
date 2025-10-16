# Lucky Casino E2E Testing Framework

Enterprise-grade Playwright testing framework for Lucky Casino platform with comprehensive configuration and SOLID architecture.

## 🚀 Quick Start

### Prerequisites
- Node.js >= 18.0.0
- npm >= 9.0.0

### Installation
```bash
# Install dependencies
npm install

# Install Playwright browsers
npm run test:install

# Copy environment configuration
cp env.example .env
```

### Running Tests
```bash
# Run all tests
npm test

# Run smoke tests
npm run test:smoke

# Run tests with UI
npm run test:ui

# Run tests in headed mode
npm run test:headed

# Run specific project
npm run test:auth
npm run test:firefox
npm run test:ukraine
```

## 📁 Project Structure

```
src/
├── components/          # UI Components (Atomic Design)
│   ├── games/          # Game-specific components
│   ├── modals/         # Modal components
│   └── sidebar.component.ts
├── core/               # Core framework classes
│   ├── base/           # Base classes
│   ├── decorators/     # Custom decorators
│   └── logger.ts       # Logging system
├── pages/              # Page Objects
├── services/           # Business Logic Services
│   ├── game/           # Game-related services
│   ├── sidebar/        # Sidebar services
│   └── tournament/      # Tournament services
├── setup/              # Global setup
├── types/              # TypeScript type definitions
└── utils/              # Utility functions

tests/
├── smoke/              # Critical functionality tests
├── auth/               # Authentication tests
├── unit/               # Unit tests
└── geo/                # Geolocation tests
```

## 🛠 Configuration Files

### TypeScript Configuration (`tsconfig.json`)
- **Target**: ES2020 with DOM support
- **Module Resolution**: Node.js with path aliases
- **Strict Type Checking**: Enabled for better code quality
- **Path Aliases**: `@/*`, `@pages/*`, `@services/*`, etc.

### Package Configuration (`package.json`)
- **Scripts**: Comprehensive test execution commands
- **Dependencies**: Playwright, TypeScript, ESLint, Prettier
- **Engines**: Node.js >= 18.0.0, npm >= 9.0.0

### Playwright Configuration (`playwright.config.ts`)
- **Projects**: Multiple test configurations (smoke, auth, firefox, ukraine, mobile)
- **Global Setup**: Authentication state management
- **Parallel Execution**: Disabled for stability
- **Timeouts**: Optimized for casino game testing
- **Geolocation**: Ukraine-specific settings

### ESLint Configuration (`.eslintrc.json`)
- **TypeScript Support**: Full TypeScript integration
- **Playwright Rules**: Specialized Playwright linting rules
- **Code Quality**: Strict rules for maintainable code
- **Overrides**: Test-specific rule relaxations

## 🎯 Test Projects

### 1. **auth-without-setup**
- Tests authentication process without global setup
- Path: `tests/smoke/without-global-setup/`

### 2. **smoke**
- Critical functionality tests
- Path: `tests/smoke/`

### 3. **auth**
- Authentication-related tests
- Path: `tests/auth/`

### 4. **unit**
- Unit tests for components and services
- Path: `tests/unit/`

### 5. **firefox**
- Cross-browser testing with Firefox
- Path: `tests/{smoke,auth}/`

### 6. **ukraine**
- Ukraine-specific geolocation tests
- Path: `tests/**/*.spec.ts`

### 7. **mobile**
- Mobile device testing
- Path: `tests/smoke/`

## 🔧 Available Scripts

### Test Execution
```bash
npm test                    # Run all tests
npm run test:smoke         # Run smoke tests
npm run test:auth          # Run auth tests
npm run test:ui            # Run with UI
npm run test:debug         # Run in debug mode
npm run test:headed        # Run in headed mode
```

### Development
```bash
npm run dev                # Development mode with UI
npm run type-check         # TypeScript type checking
npm run lint               # ESLint checking
npm run lint:fix           # Fix ESLint issues
npm run format             # Prettier formatting
```

### Maintenance
```bash
npm run clean              # Clean test results
npm run clean:all          # Clean everything
npm run test:install       # Install Playwright browsers
```

## 🌍 Environment Configuration

### Environment Variables (`.env`)
```bash
# Base URL
BASE_URL=https://luckycoin777.live

# Authentication
AUTH_STORAGE_PATH=test-results/auth-storage.json

# Geolocation (Ukraine)
GEO_LATITUDE=50.4501
GEO_LONGITUDE=30.5234
GEO_LOCALE=uk-UA
GEO_TIMEZONE=Europe/Kiev

# Timeouts
TEST_TIMEOUT=120000
EXPECT_TIMEOUT=30000
```

## 🏗 Architecture Principles

### SOLID Principles
- **Single Responsibility**: Each service has one clear purpose
- **Open/Closed**: Extensible without modification
- **Liskov Substitution**: Proper inheritance hierarchy
- **Interface Segregation**: Focused interfaces
- **Dependency Inversion**: Abstractions over concretions

### Design Patterns
- **Page Object Model**: Encapsulated page interactions
- **Service Layer**: Business logic separation
- **Component-Based**: Atomic design principles
- **Factory Pattern**: Dynamic object creation
- **Strategy Pattern**: Algorithm selection

## 📊 Quality Metrics

### Code Quality
- **TypeScript**: Strict type checking
- **ESLint**: Comprehensive linting rules
- **Prettier**: Consistent code formatting
- **Playwright Rules**: Specialized test linting

### Test Quality
- **Coverage**: Comprehensive test coverage
- **Stability**: Sequential execution for reliability
- **Performance**: Optimized timeouts and settings
- **Maintainability**: Clear structure and documentation

## 🚀 Getting Started

1. **Clone the repository**
2. **Install dependencies**: `npm install`
3. **Install browsers**: `npm run test:install`
4. **Configure environment**: Copy `env.example` to `.env`
5. **Run tests**: `npm run test:smoke`

## 📝 Best Practices

### Writing Tests
- Use descriptive test names
- Follow AAA pattern (Arrange, Act, Assert)
- Keep tests independent and isolated
- Use proper wait strategies

### Code Organization
- Follow SOLID principles
- Use TypeScript strictly
- Implement proper error handling
- Write comprehensive documentation

### Maintenance
- Regular dependency updates
- Code quality monitoring
- Performance optimization
- Documentation updates

## 🤝 Contributing

1. Follow the established architecture
2. Write comprehensive tests
3. Maintain code quality standards
4. Update documentation
5. Follow Git best practices

## 📄 License

ISC License - See LICENSE file for details

---

**Lucky Team - Senior Automation Engineer**  
*Enterprise-grade E2E Testing Framework*
