# 🔒 Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |
| < 1.0   | :x:                |

## Reporting a Vulnerability

If you discover a security vulnerability in Chat App, please report it responsibly.

### How to Report

**Please DO NOT create a public GitHub issue for security vulnerabilities.**

Instead, please contact:
- **Email**: [mahabeer123@gmail.com](mailto:mahabeer123@gmail.com)
- **GitHub**: [@mahabeer123](https://github.com/mahabeer123)

### What to Include

When reporting a vulnerability, please include:
1. **Description**: Clear description of the issue
2. **Steps to Reproduce**: How to reproduce the problem
3. **Impact**: Potential impact of the vulnerability
4. **Environment**: Browser, OS, and version information

## Security Features

### Authentication
- **Google OAuth**: Secure authentication with Google
- **Protected Routes**: Automatic redirection for unauthenticated users
- **Session Management**: Secure session handling

### Data Protection
- **Firebase Security Rules**: Server-side data validation
- **Input Validation**: Client-side validation for messages
- **Real-time Security**: Secure WebSocket connections

### File Security
- **File Type Validation**: Whitelist of allowed file types
- **File Size Limits**: Maximum file size restrictions
- **Secure Storage**: Firebase Storage with security rules

## Security Best Practices

### For Users
1. **Use Strong Google Account**: Enable 2FA on your Google account
2. **Keep Browser Updated**: Latest security patches
3. **Report Suspicious Activity**: Contact support immediately
4. **Don't Share Sensitive Information**: Be careful with personal data

### For Developers
1. **Keep Dependencies Updated**
   ```bash
   npm audit
   npm update
   ```

2. **Use Environment Variables**
   ```bash
   # Never commit sensitive data
   VITE_FIREBASE_API_KEY=your_api_key
   ```

## Incident Response

### Response Timeline
- **Critical**: 24 hours
- **High**: 72 hours
- **Medium**: 1 week
- **Low**: 2 weeks

## Contact Information

- **Email**: [mahabeer123@gmail.com](mailto:mahabeer123@gmail.com)
- **GitHub**: [@mahabeer123](https://github.com/mahabeer123)

---

**Thank you for helping keep Chat App secure!** 🔒
