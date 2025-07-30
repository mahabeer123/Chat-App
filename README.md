# Chat App - Real-time Messaging Application

A modern, real-time chat application built with React, Firebase, and Redux. Features include Google authentication, real-time messaging, file uploads, message reactions, and dark/light theme support.

## 🚀 Features

- **Real-time Messaging** - Instant message delivery using Firebase
- **Google Authentication** - Secure sign-in with Google accounts
- **File Uploads** - Share images and files in conversations
- **Message Reactions** - React to messages with emojis
- **Dark/Light Theme** - Toggle between themes
- **Responsive Design** - Works on desktop and mobile
- **User Profiles** - Customizable user profiles and status
- **Online Status** - See who's online in real-time
- **Message History** - Persistent chat history
- **Modern UI** - Beautiful, intuitive interface

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite
- **State Management**: Redux Toolkit
- **Styling**: Tailwind CSS
- **Backend**: Firebase (Firestore, Authentication, Storage)
- **Routing**: React Router DOM
- **Icons**: Lucide React

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/chat-app.git
   cd chat-app/chat-app-fresh
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Firebase**
   - Create a new Firebase project at [Firebase Console](https://console.firebase.google.com/)
   - Enable Authentication (Google provider)
   - Enable Firestore Database
   - Enable Storage
   - Update the Firebase configuration in `src/firebase.js`

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:3000`

## 🔧 Configuration

### Firebase Setup

1. Create a Firebase project
2. Enable the following services:
   - **Authentication** (Google provider)
   - **Firestore Database**
   - **Storage**

3. Update `src/firebase.js` with your Firebase config:
   ```javascript
   const firebaseConfig = {
     apiKey: "your-api-key",
     authDomain: "your-project.firebaseapp.com",
     projectId: "your-project-id",
     storageBucket: "your-project.appspot.com",
     messagingSenderId: "your-sender-id",
     appId: "your-app-id"
   };
   ```

## 📁 Project Structure

```
chat-app-fresh/
├── src/
│   ├── Components/          # React components
│   │   ├── AuthContext.jsx  # Authentication context
│   │   ├── ChatPanel.jsx    # Contact list
│   │   ├── ChatWindow.jsx   # Main chat interface
│   │   ├── Login.jsx        # Login page
│   │   ├── Profile.jsx      # User profile
│   │   └── ...
│   ├── store/               # Redux store
│   │   ├── slices/          # Redux slices
│   │   └── index.js         # Store configuration
│   ├── utils/               # Utility functions
│   ├── App.jsx              # Main app component
│   ├── main.jsx             # App entry point
│   └── firebase.js          # Firebase configuration
├── public/                  # Static assets
├── package.json
└── vite.config.js
```

## 🚀 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🔐 Environment Variables

Create a `.env` file in the root directory:

```env
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id
```

## 🎨 Features in Detail

### Authentication
- Google OAuth integration
- Automatic user profile creation
- Session persistence

### Real-time Messaging
- Instant message delivery
- Message history persistence
- Typing indicators
- Message status (sent, delivered, read)

### File Sharing
- Image upload support
- File size validation
- Progress indicators

### User Experience
- Responsive design
- Dark/light theme toggle
- Smooth animations
- Loading states

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Firebase](https://firebase.google.com/) for backend services
- [React](https://reactjs.org/) for the UI framework
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [Vite](https://vitejs.dev/) for build tooling

## 📞 Support

If you have any questions or need help, please open an issue on GitHub.

---

**Made with ❤️ using React and Firebase**
