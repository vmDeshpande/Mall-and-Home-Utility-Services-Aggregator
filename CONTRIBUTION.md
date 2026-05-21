# Contributing to Mall and Home Utility Services Aggregator

Thank you for your interest in contributing! This document provides guidelines and instructions for contributing to the project.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Commit Guidelines](#commit-guidelines)
- [Code Standards](#code-standards)
- [Pull Request Process](#pull-request-process)
- [Testing Guidelines](#testing-guidelines)
- [Documentation](#documentation)
- [Issue Reporting](#issue-reporting)

## 💼 Code of Conduct

We are committed to providing a welcoming and inclusive environment. All contributors must:

- Be respectful and professional
- Provide constructive feedback
- Respect different opinions and experiences
- Report inappropriate behavior to project maintainers

## 🚀 Getting Started

### 1. Fork and Clone
```bash
# Fork the repository on GitHub
# Clone your fork
git clone https://github.com/vmDeshpande/Mall-and-Home-Utility-Services-Aggregator
cd repo

# Add upstream remote
git remote add upstream https://github.com/vmDeshpande/Mall-and-Home-Utility-Services-Aggregator
```

### 2. Set Up Development Environment
```bash
# Install dependencies
pnpm install

# Install backend dependencies
cd backend
pnpm install
cd ..

# Create environment files
cp ENV_GUIDE.md .env.local.example
cp backend/.env.example backend/.env
```

### 3. Create a Feature Branch
```bash
# Update your local main
git fetch upstream
git checkout main
git merge upstream/main

# Create feature branch
git checkout -b feature/your-feature-name
```

## 🔄 Development Workflow

### 1. Make Changes
- Write code following project standards (see Code Standards below)
- Make commits with clear, descriptive messages
- Test your changes locally

### 2. Keep Your Branch Updated
```bash
# Fetch latest changes
git fetch upstream

# Rebase on main
git rebase upstream/main
# or merge if rebase causes issues
git merge upstream/main
```

### 3. Push Your Changes
```bash
git push origin feature/your-feature-name
```

### 4. Create Pull Request
- Go to GitHub and create a PR
- Fill in the PR template with details
- Link related issues

## 📝 Commit Guidelines

### Commit Message Format
```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, missing semicolons, etc.)
- `refactor`: Code refactoring without changing functionality
- `perf`: Performance improvements
- `test`: Test additions or updates
- `chore`: Build, dependencies, or tooling changes

### Examples
```
feat(payment): add mock payment processing
fix(tracking): resolve status update delay
docs(readme): update installation instructions
style(components): format payment card component
refactor(api): simplify booking endpoint logic
```

### Commit Message Best Practices
- Use imperative mood ("add" not "added")
- Don't capitalize first letter of subject
- No period at end of subject
- Limit subject to 50 characters
- Reference issues in footer: "Fixes #123"

## 📐 Code Standards

### TypeScript
- Enable strict mode (`"strict": true` in tsconfig.json)
- Define types for all functions and components
- Use interfaces for object types
- Avoid `any` type unless absolutely necessary

```typescript
// Good
interface BookingProps {
  bookingId: string;
  serviceAmount: number;
  onPayment: () => void;
}

const Booking: React.FC<BookingProps> = ({ bookingId, serviceAmount, onPayment }) => {
  // ...
};

// Avoid
const Booking = (props: any) => {
  // ...
};
```

### React Components
- Use functional components with hooks
- Keep components focused and single-responsibility
- Extract reusable logic into custom hooks

```typescript
// Good
export function PaymentCard({ bookingId, amount }: PaymentCardProps) {
  const [isPaid, setIsPaid] = useState(false);
  
  useEffect(() => {
    checkPaymentStatus(bookingId);
  }, [bookingId]);
  
  return <Card>{/* ... */}</Card>;
}

// Avoid - Too many concerns
export function ComplexComponent() {
  // Multiple unrelated features in one component
}
```

### Naming Conventions
- **Components**: PascalCase (`PaymentCard.tsx`)
- **Files**: kebab-case (`payment-card.tsx`)
- **Functions/Variables**: camelCase (`handlePayment`)
- **Constants**: UPPER_SNAKE_CASE (`MAX_RETRY_ATTEMPTS = 3`)
- **Types/Interfaces**: PascalCase (`PaymentState`)

### Code Organization
```typescript
// 1. Imports
import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';

// 2. Types
interface ComponentProps {
  // ...
}

// 3. Component
export function Component({ prop }: ComponentProps) {
  // ...
}

// 4. Exports (if not default)
export { Component };
```

### Comments
- Write clear, concise comments
- Explain WHY, not WHAT (code should be self-documenting)
- Keep comments up-to-date

```typescript
// Good - explains the why
// Retry payment 3 times due to occasional gateway timeouts
const MAX_RETRY_ATTEMPTS = 3;

// Avoid - states the obvious
// Set max retries to 3
const MAX_RETRIES = 3;
```

### Error Handling
- Always handle errors in API calls
- Provide user-friendly error messages
- Log errors appropriately

```typescript
// Good
try {
  const data = await api.getRequest(bookingId);
  setBooking(data);
} catch (error) {
  const message = error instanceof Error ? error.message : 'Failed to load booking';
  setError(message);
  console.error('Error fetching booking:', error);
}

// Avoid - silent errors
const data = await api.getRequest(bookingId);
setBooking(data);
```

### Styling
- Use Tailwind CSS classes only (no inline styles)
- Use CSS modules or component-scoped styles when needed
- Follow Tailwind conventions

```typescript
// Good
<Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
  Submit
</Button>

// Avoid - inline styles
<button style={{ width: '100%', backgroundColor: '#primary', color: 'white' }}>
  Submit
</button>
```

## 🔀 Pull Request Process

### PR Title Format
- Be descriptive and concise
- Examples:
  - "Add payment modal to tracking page"
  - "Fix: resolve booking status update bug"
  - "Refactor: simplify payment validation logic"

### PR Description Template
```markdown
## Description
Briefly describe the changes and why they were made.

## Related Issues
Fixes #123
Related to #456

## Type of Change
- [ ] New feature
- [ ] Bug fix
- [ ] Breaking change
- [ ] Documentation update

## Testing
Describe how to test the changes.

## Screenshots (if applicable)
Add screenshots for UI changes.

## Checklist
- [ ] Code follows style guidelines
- [ ] TypeScript compiles without errors
- [ ] Comments and documentation added/updated
- [ ] No new warnings generated
- [ ] Tested locally
```

### Review Process
1. **Automated Checks**
   - Code builds successfully
   - No TypeScript errors
   - Tests pass

2. **Peer Review**
   - At least one maintainer review required
   - Constructive feedback provided
   - Changes requested if needed

3. **Approval & Merge**
   - PR approved by maintainer
   - Branch up-to-date with main
   - Squash and merge or rebase depending on project preference

## 🧪 Testing Guidelines

### Unit Tests
- Write tests for utility functions
- Mock external dependencies
- Test error cases

### Integration Tests
- Test component interactions
- Test API integration
- Test state management

### Manual Testing
- Test in development environment
- Test in multiple browsers
- Test on mobile devices
- Test error scenarios

### Test File Naming
```
src/
├── components/
│   ├── PaymentCard.tsx
│   └── PaymentCard.test.tsx
└── lib/
    ├── payment-utils.ts
    └── payment-utils.test.ts
```

## 📚 Documentation

### When to Update Documentation
- When adding new features
- When changing behavior
- When adding new pages or components
- When changing API endpoints

### Documentation to Maintain
- **README.md**: Project overview
- **API.md**: API endpoints and usage
- **Code Comments**: Inline documentation
- **Component Stories**: Usage examples (if using Storybook)
- **DEPLOYMENT.md**: Deployment procedures

### Documentation Standards
- Use clear, simple language
- Include code examples
- Keep instructions up-to-date
- Add table of contents for long documents

## 🐛 Issue Reporting

### Before Opening an Issue
- Check if issue already exists
- Verify the issue in latest version
- Gather relevant information

### Issue Template
```markdown
## Description
Clear, concise description of the issue.

## Steps to Reproduce
1. Step one
2. Step two
3. ...

## Expected Behavior
What should happen.

## Actual Behavior
What actually happens.

## Environment
- OS: [e.g., Windows 10]
- Browser: [e.g., Chrome 120]
- Node version: [e.g., 18.16.0]
- npm/pnpm version: [e.g., pnpm 8.0.0]

## Additional Context
Any other relevant information, screenshots, or error messages.
```

## 🏆 Recognition

### Contributors
All contributors will be recognized in:
- CONTRIBUTORS.md file
- GitHub contributors page
- Release notes (for significant contributions)

## 🤔 Questions?

- Check existing documentation
- Review similar PRs or issues
- Contact maintainers
- Participate in discussions

## 📋 Checklist Before Submitting PR

- [ ] Branch is up-to-date with main
- [ ] Code follows project style guidelines
- [ ] TypeScript compilation successful
- [ ] No new warnings or errors
- [ ] Comments and docs added/updated
- [ ] Changes tested locally
- [ ] PR description is clear and complete
- [ ] Related issues are referenced
- [ ] No unrelated changes included

## 🎯 Areas for Contribution

### High Priority
- Real payment gateway integration
- Enhanced error handling
- Performance optimizations
- Security improvements

### Medium Priority
- Additional UI components
- API documentation
- Test coverage
- Bug fixes

### Lower Priority
- Documentation improvements
- Code refactoring
- UI/UX enhancements
- Feature requests

## 📞 Getting Help

- **Questions**: Open a discussion or issue
- **Found a bug**: Create a bug report issue
- **Feature request**: Create a feature request issue
- **Code review**: Ask for review in PR comments

---

Thank you for contributing! 🙏

**Happy coding!**
