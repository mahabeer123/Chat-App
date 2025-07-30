# Deployment Guide

This guide will help you deploy your Chat App to various platforms.

## 🚀 Deployment Options

### 1. Vercel (Recommended)

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Deploy**
   ```bash
   cd chat-app-fresh
   vercel
   ```

3. **Follow the prompts** and your app will be live!

### 2. Netlify

1. **Build the project**
   ```bash
   cd chat-app-fresh
   npm run build
   ```

2. **Deploy to Netlify**
   - Drag and drop the `dist` folder to [Netlify](https://netlify.com)
   - Or use Netlify CLI: `netlify deploy --prod --dir=dist`

### 3. GitHub Pages

1. **Add GitHub Pages dependency**
   ```bash
   cd chat-app-fresh
   npm install --save-dev gh-pages
   ```

2. **Update package.json**
   ```json
   {
     "scripts": {
       "predeploy": "npm run build",
       "deploy": "gh-pages -d dist"
     }
   }
   ```

3. **Deploy**
   ```bash
   npm run deploy
   ```

## 🔧 Environment Setup

### Firebase Configuration

1. **Create a Firebase project** at [Firebase Console](https://console.firebase.google.com/)

2. **Enable services**:
   - Authentication (Google provider)
   - Firestore Database
   - Storage

3. **Update security rules** in Firebase Console:
   - Firestore: Allow read/write for authenticated users
   - Storage: Allow read/write for authenticated users

4. **Add your domain** to Firebase Authentication authorized domains

### Environment Variables

For production, set these environment variables:

```env
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id
```

## 📝 Post-Deployment Checklist

- [ ] Firebase services are enabled
- [ ] Authentication domain is configured
- [ ] Firestore security rules are set
- [ ] Storage security rules are set
- [ ] Environment variables are configured
- [ ] App is accessible and functional
- [ ] Google sign-in works
- [ ] Real-time messaging works
- [ ] File uploads work

## 🐛 Troubleshooting

### Common Issues

1. **Firebase not initialized**
   - Check if Firebase config is correct
   - Verify all required services are enabled

2. **Authentication not working**
   - Add your domain to Firebase authorized domains
   - Check if Google provider is enabled

3. **Real-time updates not working**
   - Verify Firestore security rules
   - Check if user is authenticated

4. **File uploads failing**
   - Check Storage security rules
   - Verify file size limits

## 📞 Support

If you encounter issues during deployment, please:
1. Check the browser console for errors
2. Verify Firebase configuration
3. Check security rules
4. Open an issue on GitHub with details 