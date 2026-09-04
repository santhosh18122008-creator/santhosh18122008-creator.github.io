# Contributing to MarqDesk

Thank you for your interest in contributing to MarqDesk! This document provides guidelines and instructions for contributing.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Making Changes](#making-changes)
- [Pull Request Process](#pull-request-process)
- [Coding Standards](#coding-standards)
- [Testing](#testing)

## Code of Conduct

Please be respectful and constructive in your interactions. We're committed to providing a welcoming environment for all contributors.

## Getting Started

1. **Fork** the repository
2. **Clone** your fork: `git clone https://github.com/YOUR_USERNAME/santhosh18122008-creator.github.io.git`
3. **Create a branch**: `git checkout -b feature/your-feature-name`

## Development Setup

### Prerequisites

- Node.js >= 22.12.0
- npm or pnpm

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm test` - Run tests
- `npm run typecheck` - Type check code

## Making Changes

### Adding a New Calculator

1. Create calculation logic in `src/lib/calculations/`
2. Create React component in `src/components/islands/`
3. Add page in `src/pages/tools/`
4. Add tests in `tests/calculations/`

### Calculator Component Template

```tsx
import { useState, useMemo } from 'react';
import { formatNumber } from '../../lib/formatting/number';
import { validateNumber } from '../../lib/utilities/errorHandler';

export default function YourCalculator() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState<number | null>(null);
  const [error, setError] = useState('');

  const handleCalculate = () => {
    const validation = validateNumber(input, 'Value');
    if (!validation.valid || validation.num === null) {
      setError(validation.error?.message || 'Invalid input');
      return;
    }
    
    // Your calculation logic
    const calculated = validation.num * 2; // Example
    setResult(calculated);
    setError('');
  };

  return (
    <div className="rounded-xl border border-ink/10 bg-card p-6">
      {/* Your UI */}
    </div>
  );
}
```

### Best Practices

- Use TypeScript for type safety
- Follow existing code patterns
- Write tests for new functionality
- Keep components focused and reusable
- Use the `CalculatorForm` component for consistency
- Implement proper error handling
- Add ARIA labels for accessibility

## Pull Request Process

1. **Update documentation** if needed
2. **Add/update tests** for your changes
3. **Ensure all tests pass**: `npm test`
4. **Run type checking**: `npm run typecheck`
5. **Update CHANGELOG.md** if applicable
6. **Submit PR** with clear description

### PR Checklist

- [ ] Tests added/updated
- [ ] Documentation updated
- [ ] No TypeScript errors
- [ ] Follows coding standards
- [ ] Responsive design tested
- [ ] Accessibility considerations addressed

## Coding Standards

### TypeScript

- Use strict typing
- Define interfaces for props and complex objects
- Use union types for limited value sets

### React Components

```tsx
// Good: Proper typing and hooks usage
interface Props {
  value: number;
  onChange: (value: number) => void;
}

export default function MyComponent({ value, onChange }: Props) {
  const memoizedValue = useMemo(() => computeExpensive(value), [value]);
  
  const handleChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    onChange(Number(e.target.value));
  }, [onChange]);
  
  return <input value={value} onChange={handleChange} />;
}
```

### CSS/Tailwind

- Use Tailwind utility classes
- Follow mobile-first approach
- Support dark mode with `dark:` variants
- Maintain consistent spacing scale

### Accessibility

- Use semantic HTML
- Add ARIA labels where needed
- Ensure keyboard navigation works
- Test with screen readers
- Maintain color contrast ratios

## Testing

### Unit Tests

```typescript
import { describe, it, expect } from 'vitest';
import { yourFunction } from '../lib/calculations/yourFile';

describe('yourFunction', () => {
  it('should calculate correctly', () => {
    expect(yourFunction(5)).toBe(10);
  });
  
  it('should handle edge cases', () => {
    expect(() => yourFunction(-1)).toThrow();
  });
});
```

### Running Tests

```bash
# Run all tests
npm test

# Run specific test file
npm test -- filename.test.ts

# Run in watch mode
npm run test:watch
```

## Questions?

Feel free to open an issue for questions or discussions about contributing.

---

Thank you for contributing to MarqDesk! 🎉
