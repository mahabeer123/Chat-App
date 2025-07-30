# 💬 Chat App - Real-time Messaging Platform

A modern, full-featured real-time chat application built with React, Firebase, and Redux. Features include Google authentication, real-time messaging, file uploads, message reactions, and a beautiful responsive UI.

![Chat App Demo](https://img.shields.io/badge/Live-Demo-blue?style=for-the-badge&logo=vercel)
![React](https://img.shields.io/badge/React-18.3.1-blue?style=for-the-badge&logo=react)
![Firebase](https://img.shields.io/badge/Firebase-10.12.5-orange?style=for-the-badge&logo=firebase)
![Vite](https://img.shields.io/badge/Vite-7.0.6-purple?style=for-the-badge&logo=vite)

## 🚀 Live Demo

**Visit the live application:** [https://chat-app-u7k4.vercel.app](https://chat-app-u7k4.vercel.app)

## ✨ Features

### 🔐 Authentication & Security
- **Google OAuth Integration** - Secure sign-in with Google accounts
- **Protected Routes** - Automatic redirection for unauthenticated users
- **User Profiles** - Customizable user profiles and status updates
- **Online Status** - Real-time online/offline indicators

### 💬 Real-time Messaging
- **Instant Message Delivery** - Real-time messaging using Firebase
- **Message Reactions** - React to messages with emojis (❤️ 👍 👎 😊)
- **File Sharing** - Upload and share images, videos, PDFs, and documents
- **Message History** - Persistent chat history across sessions
- **Unread Message Counters** - Track unread messages per contact
- **Typing Indicators** - See when someone is typing

### 🎨 User Experience
- **Dark/Light Theme** - Toggle between themes with persistent preference
- **Responsive Design** - Works perfectly on desktop, tablet, and mobile
- **Modern UI/UX** - Beautiful gradient designs and smooth animations
- **Custom Favicon** - Professional chat bubble branding
- **Search Contacts** - Find contacts quickly with search functionality

### 🔧 Technical Features
- **Redux State Management** - Centralized state management
- **Error Boundaries** - Graceful error handling
- **Loading States** - Smooth loading animations
- **Optimized Performance** - Fast loading and smooth interactions
- **PWA Ready** - Progressive Web App capabilities

## 🛠️ Tech Stack

### Frontend
- **React 18.3.1** - Modern React with hooks and functional components
- **Redux Toolkit** - State management with RTK Query
- **React Router DOM** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Vite** - Fast build tool and development server

### Backend & Services
- **Firebase Authentication** - Google OAuth and user management
- **Firebase Firestore** - Real-time NoSQL database
- **Firebase Storage** - File upload and storage
- **Firebase Hosting** - Static hosting (optional)

### Development Tools
- **ESLint** - Code linting and formatting
- **PostCSS** - CSS processing
- **Autoprefixer** - CSS vendor prefixing

## 📱 Screenshots

### Desktop View
- Modern chat interface with contact list and message window
- Dark/light theme support
- File upload and message reactions

### Mobile View
- Responsive design optimized for mobile devices
- Touch-friendly interface
- Native app-like experience

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Firebase project setup

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/mahabeer123/Chat-App.git
   cd Chat-App/chat-app-fresh
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Firebase**
   - Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
   - Enable Authentication (Google provider)
   - Enable Firestore Database
   - Enable Storage
   - Update `src/firebase.js` with your Firebase config

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   - Navigate to `http://localhost:3000`
   - Sign in with Google to start chatting

## 🏗️ Project Structure

```
chat-app-fresh/
├── src/
│   ├── Components/          # React components
│   │   ├── AuthContext.jsx  # Authentication context
│   │   ├── ChatPanel.jsx    # Contact list and search
│   │   ├── ChatWindow.jsx   # Message display and input
│   │   ├── Home.jsx         # Main app layout
│   │   ├── Login.jsx        # Google sign-in
│   │   ├── MessageReactions.jsx # Message reaction system
│   │   ├── Profile.jsx      # User profile management
│   │   └── ThemeToggle.jsx  # Dark/light theme toggle
│   ├── store/               # Redux store
│   │   ├── index.js         # Store configuration
│   │   └── slices/          # Redux slices
│   │       ├── chatSlice.js # Chat state management
│   │       ├── userSlice.js # User state management
│   │       └── uiSlice.js   # UI state management
│   ├── utils/               # Utility functions
│   │   ├── logger.js        # Logging utilities
│   │   ├── validation.js    # Input validation
│   │   └── theme.js         # Theme utilities
│   ├── App.jsx              # Main app component
│   ├── firebase.js          # Firebase configuration
│   └── main.jsx             # App entry point
├── public/                  # Static assets
│   ├── chat-favicon.svg     # Custom app favicon
│   └── _redirects           # Vercel routing
├── vercel.json              # Vercel deployment config
└── package.json             # Dependencies and scripts
```

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Vercel will automatically detect the Vite configuration
3. Add your Firebase domain to authorized domains
4. Deploy with one click

### Other Platforms
- **Netlify**: Drag and drop the `dist` folder
- **Firebase Hosting**: Use `firebase deploy`
- **GitHub Pages**: Enable in repository settings

## 🔧 Configuration

### Environment Variables
```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### Firebase Setup
1. Create a Firebase project
2. Enable Google Authentication
3. Create Firestore database
4. Enable Storage
5. Add your domain to authorized domains

## 🧪 Testing

```bash
# Run linting
npm run lint

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Mahabeer Patnaik**
- GitHub: [@mahabeer123](https://github.com/mahabeer123)
- Live Demo: [Chat App](https://chat-app-u7k4.vercel.app)

## 🙏 Acknowledgments

- Firebase for real-time backend services
- Vercel for seamless deployment
- React and Vite communities for excellent tooling
- Tailwind CSS for beautiful styling

---

⭐ **Star this repository if you found it helpful!**
