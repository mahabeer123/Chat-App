# 🤝 Contributing to Chat App

Thank you for your interest in contributing to Chat App! This document provides guidelines and information for contributors.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Coding Standards](#coding-standards)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)
- [Reporting Bugs](#reporting-bugs)
- [Feature Requests](#feature-requests)

## 📜 Code of Conduct

This project and everyone participating in it is governed by our Code of Conduct. By participating, you are expected to uphold this code.

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Git
- Firebase account (for backend features)

### Development Setup

1. **Fork the repository**
   ```bash
   git clone https://github.com/your-username/Chat-App.git
   cd Chat-App/chat-app-fresh
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your Firebase configuration
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

## 💻 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint errors automatically

### Project Structure

```
src/
├── Components/          # React components
│   ├── AuthContext.jsx  # Authentication context
│   ├── ChatPanel.jsx    # Contact list and search
│   ├── ChatWindow.jsx   # Message display and input
│   ├── Home.jsx         # Main app layout
│   ├── Login.jsx        # Google sign-in
│   ├── MessageReactions.jsx # Message reaction system
│   ├── Profile.jsx      # User profile management
│   └── ThemeToggle.jsx  # Dark/light theme toggle
├── store/               # Redux store
│   ├── index.js         # Store configuration
│   └── slices/          # Redux slices
├── utils/               # Utility functions
├── App.jsx              # Main app component
├── firebase.js          # Firebase configuration
└── main.jsx             # App entry point
```

## 📝 Coding Standards

### JavaScript/React

- Use functional components with hooks
- Follow React best practices
- Use TypeScript for new features (optional)
- Implement proper error boundaries
- Use meaningful variable and function names

### CSS/Styling

- Use Tailwind CSS utility classes
- Follow mobile-first responsive design
- Maintain consistent spacing and colors
- Use CSS custom properties for theming

### State Management

- Use Redux Toolkit for global state
- Keep local state in components when appropriate
- Use React Context for theme and auth state
- Implement proper loading and error states

### Code Quality

- Write meaningful comments
- Use ESLint and Prettier
- Follow DRY (Don't Repeat Yourself) principle
- Write unit tests for critical functions

## 📝 Commit Guidelines

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

### Types

- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation only changes
- `style`: Changes that do not affect the meaning of the code
- `refactor`: A code change that neither fixes a bug nor adds a feature
- `perf`: A code change that improves performance
- `test`: Adding missing tests or correcting existing tests
- `chore`: Changes to the build process or auxiliary tools

### Examples

```bash
feat: add message reactions functionality
fix: resolve authentication redirect issue
docs: update README with deployment instructions
style: improve button hover states
refactor: optimize message rendering performance
```

## 🔄 Pull Request Process

1. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```

2. **Make your changes**
   - Follow coding standards
   - Add tests if applicable
   - Update documentation

3. **Test your changes**
   ```bash
   npm run lint
   npm run build
   npm run preview
   ```

4. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat: add amazing feature"
   ```

5. **Push to your fork**
   ```bash
   git push origin feature/amazing-feature
   ```

6. **Create a Pull Request**
   - Use the PR template
   - Describe your changes clearly
   - Include screenshots if UI changes
   - Link related issues

### Pull Request Template

```markdown
## Description
Brief description of the changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Tested locally
- [ ] All tests pass
- [ ] No console errors

## Screenshots (if applicable)
Add screenshots of UI changes

## Checklist
- [ ] Code follows project style
- [ ] Self-review completed
- [ ] Comments added for complex code
- [ ] Documentation updated
```

## 🐛 Reporting Bugs

### Before Reporting

1. Check existing issues
2. Test on latest version
3. Try to reproduce the issue

### Bug Report Template

```markdown
## Bug Description
Clear description of the bug

## Steps to Reproduce
1. Go to '...'
2. Click on '...'
3. See error

## Expected Behavior
What should happen

## Actual Behavior
What actually happens

## Environment
- OS: [e.g. macOS, Windows, Linux]
- Browser: [e.g. Chrome, Firefox, Safari]
- Version: [e.g. 1.0.0]

## Additional Information
Screenshots, console logs, etc.
```

## 💡 Feature Requests

### Before Requesting

1. Check existing feature requests
2. Consider if it fits the project scope
3. Think about implementation complexity

### Feature Request Template

```markdown
## Feature Description
Clear description of the feature

## Use Case
Why this feature is needed

## Proposed Solution
How you think it should be implemented

## Alternatives Considered
Other approaches you considered

## Additional Information
Mockups, examples, etc.
```

## 🎯 Areas for Contribution

### High Priority
- Performance optimizations
- Accessibility improvements
- Mobile responsiveness
- Error handling

### Medium Priority
- New message reactions
- File upload improvements
- Theme customization
- User profile features

### Low Priority
- Documentation updates
- Code refactoring
- Test coverage
- Build optimizations

## 📞 Getting Help

- **GitHub Issues**: For bugs and feature requests
- **Discussions**: For questions and ideas
- **Documentation**: Check the README first

## 🙏 Recognition

Contributors will be recognized in:
- README.md contributors section
- Release notes
- Project documentation

---

**Thank you for contributing to Chat App!** 🚀 