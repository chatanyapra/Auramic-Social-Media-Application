# Auramic – MERN Social Media Application 🚀

### Check out video Link:  
[Auramic-Website-Video](https://www.linkedin.com/posts/chatanyapratap_mernstack-webdevelopment-reactjs-activity-7341078926405877761-gb4m?utm_source=share&utm_medium=member_desktop&rcm=ACoAAEN4RagBI9CxND0jBi8Bgq_6y3oHu0Q0CXk)

<div align="center">

[![MERN Stack](https://img.shields.io/badge/MERN-Stack-blue)](https://www.mongodb.com/mern-stack)
[![React](https://img.shields.io/badge/React-18.2.0-blue)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18.x-green)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Live Demo](https://img.shields.io/badge/Live-Demo-success)](https://auramic.onrender.com)

**A modern, full-featured social media platform built with the MERN stack**

</div>

---

## 📋 Table of Contents

- [✨ Features](#-features)
- [🚀 Quick Start](#-quick-start)
- [🛠️ Tech Stack](#️-tech-stack)
- [📁 Project Structure](#-project-structure)
- [⚙️ Installation](#️-installation)
- [🔧 Configuration](#-configuration)
- [🚀 Running the Application](#-running-the-application)
- [📱 Key Features in Detail](#-key-features-in-detail)
- [🔐 API Documentation](#-api-documentation)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)

---

## ✨ Features

### 👤 User Features
- **🔐 Authentication**: Secure login/signup with JWT tokens
- **👤 Profiles**: Customizable user profiles with bio, avatar, and cover images
- **🔍 Search**: Find users, posts, and content easily
- **🤝 Connections**: Send/receive friend requests, follow/unfollow users

### 📱 Content Features
- **📝 Posts**: Create, edit, delete, and share posts
- **📸 Stories**: 24-hour disappearing images & videos
- **💬 Comments**: Engage with posts through comments
- **❤️ Reactions**: Like and save favorite posts
- **🎨 Media**: Upload images & videos via Cloudinary

### 💬 Real-time Features
- **💬 Live Chat**: Real-time messaging with Socket.IO
- **📞 Video/Audio Calls**: WebRTC-based calling system
- **🔔 Notifications**: Real-time updates for interactions
- **📱 Online Status**: See when friends are online

### 🤖 AI-Powered Features
- **🧠 AuramicAI**: Gemini API-powered AI assistant
- **💡 Smart Suggestions**: AI-powered content recommendations
- **🔍 Smart Search**: AI-enhanced search capabilities

### 🎨 UI/UX Features
- **📱 Responsive Design**: Works on all device sizes
- **🎭 Modern UI**: Clean, intuitive interface with Tailwind CSS
- **✨ Animations**: Smooth transitions with GSAP
- **🌙 Dark/Light Mode**: User preference themes

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** 18.x or higher
- **MongoDB** 4.4 or higher
- **npm** or **yarn** package manager

### Clone & Install
```bash
# Clone the repository
git clone https://github.com/yourusername/auramic.git
cd auramic

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
```

### Start Development Servers
```bash
# Run both frontend and backend concurrently
npm run dev

# Or run separately:
# Backend
npm run server

# Frontend
npm run client
```

Visit `http://localhost:3000` to see the application!

---

## 🛠️ Tech Stack

### **Frontend**
- **⚛️ React 18** – UI library with hooks
- **🎨 Tailwind CSS** – Utility-first CSS framework
- **🔄 React Router DOM** – Client-side routing
- **📡 Axios** – HTTP client for API calls
- **✨ GSAP** – Animation library
- **🌐 Socket.IO Client** – Real-time communication
- **📷 React Dropzone** – File uploads
- **📅 Date-fns** – Date manipulation

### **Backend**
- **🟢 Node.js** – JavaScript runtime
- **🚂 Express.js** – Web application framework
- **🍃 MongoDB + Mongoose** – Database & ODM
- **🔑 JWT** – Authentication & authorization
- **☁️ Cloudinary** – Media storage & CDN
- **📦 Multer** – File upload handling
- **🔌 Socket.IO** – Real-time bidirectional communication
- **🤖 Google Gemini API** – AI capabilities
- **⚡ Bcrypt** – Password hashing

### **Dev Tools**
- **📝 TypeScript** – Type safety
- **🔍 ESLint** – Code linting
- **💅 Prettier** – Code formatting
- **🐳 Docker** – Containerization
- **🚀 Render** – Deployment platform

---

## 📁 Project Structure

```
auramic/
├── client/                    # React Frontend
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   │   ├── common/      # Common components (Buttons, Modals, etc.)
│   │   │   ├── layout/      # Layout components (Navbar, Sidebar, etc.)
│   │   │   ├── posts/       # Post-related components
│   │   │   ├── chat/        # Chat components
│   │   │   ├── stories/     # Story components
│   │   │   └── ai/          # AI assistant components
│   │   ├── pages/           # Page components
│   │   │   ├── Home/        # Home page
│   │   │   ├── Auth/        # Authentication pages
│   │   │   ├── Profile/     # User profile page
│   │   │   ├── Chat/        # Chat page
│   │   │   └── Explore/     # Explore page
│   │   ├── context/         # React Context
│   │   │   ├── AuthContext.tsx
│   │   │   └── SocketContext.tsx
│   │   ├── hooks/           # Custom hooks
│   │   ├── utils/           # Utility functions
│   │   ├── types/           # TypeScript types
│   │   ├── assets/          # Static assets
│   │   ├── styles/          # Global styles
│   │   ├── App.tsx          # Main App component
│   │   └── main.tsx         # Entry point
│   ├── public/              # Static files
│   ├── index.html           # HTML template
│   ├── vite.config.ts       # Vite configuration
│   ├── tailwind.config.js   # Tailwind config
│   └── tsconfig.json        # TypeScript config
│
├── server/                   # Express Backend
│   ├── src/
│   │   ├── controllers/     # Route controllers
│   │   │   ├── auth.controller.ts
│   │   │   ├── user.controller.ts
│   │   │   ├── post.controller.ts
│   │   │   ├── chat.controller.ts
│   │   │   └── ai.controller.ts
│   │   ├── routes/          # API routes
│   │   │   ├── auth.routes.ts
│   │   │   ├── user.routes.ts
│   │   │   ├── post.routes.ts
│   │   │   └── chat.routes.ts
│   │   ├── models/          # Mongoose models
│   │   │   ├── User.ts
│   │   │   ├── Post.ts
│   │   │   ├── Chat.ts
│   │   │   └── Story.ts
│   │   ├── middleware/      # Express middleware
│   │   │   ├── auth.ts
│   │   │   └── upload.ts
│   │   ├── utils/           # Utility functions
│   │   ├── config/          # Configuration files
│   │   └── server.ts        # Server entry point
│   ├── .env                 # Environment variables
│   └── package.json
│
├── shared/                   # Shared code
├── docker-compose.yml        # Docker compose config
├── Dockerfile               # Docker configuration
├── package.json             # Root package.json
└── README.md                # This file
```

---

## ⚙️ Installation

### Option 1: Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/auramic.git
   cd auramic
   ```

2. **Install dependencies**
   ```bash
   npm install
   cd client && npm install
   cd ../server && npm install
   ```

3. **Set up environment variables**
   ```bash
   # Copy example environment files
   cp server/.env.example server/.env
   cp client/.env.example client/.env.local
   ```

4. **Configure environment variables**

   **Server (.env)**
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/auramic
   JWT_SECRET=your_jwt_secret_here
   CLOUDINARY_CLOUD_NAME=your_cloudinary_name
   CLOUDINARY_API_KEY=your_cloudinary_key
   CLOUDINARY_API_SECRET=your_cloudinary_secret
   GEMINI_API_KEY=your_gemini_api_key
   ```

   **Client (.env.local)**
   ```env
   VITE_API_URL=http://localhost:5000
   VITE_SOCKET_URL=http://localhost:5000
   ```

5. **Start MongoDB**
   ```bash
   # If you have MongoDB installed locally
   mongod
   
   # Or using Docker
   docker-compose up mongodb
   ```

### Option 2: Docker Deployment

```bash
# Build and start all services
docker-compose up --build

# Or run in detached mode
docker-compose up -d
```

The application will be available at `http://localhost:3000`

---

## 🔧 Configuration

### MongoDB Setup
1. Install MongoDB locally or use MongoDB Atlas
2. Create a database named `auramic`
3. Update the `MONGODB_URI` in your `.env` file

### Cloudinary Setup
1. Sign up at [Cloudinary](https://cloudinary.com/)
2. Get your Cloud Name, API Key, and API Secret
3. Add them to your `.env` file

### Gemini API Setup
1. Get an API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Add it to your `.env` file as `GEMINI_API_KEY`

---

## 🚀 Running the Application

### Development Mode
```bash
# Run both client and server concurrently
npm run dev

# Or run separately
# Terminal 1: Start backend
cd server
npm run dev

# Terminal 2: Start frontend
cd client
npm run dev
```

### Production Build
```bash
# Build the application
npm run build

# Start production server
npm start
```

### Docker Deployment
```bash
# Build Docker images
docker build -t auramic .

# Run container
docker run -p 3000:3000 -p 5000:5000 auramic
```

---

## 📱 Key Features in Detail

### 🧠 AuramicAI - AI Assistant
- Integrated with Google's Gemini API
- Natural language conversations
- Context-aware responses
- Available throughout the application

### 💬 Real-time Chat
- Instant messaging with Socket.IO
- Typing indicators
- Message read receipts
- Online/offline status

### 📞 Video & Audio Calls
- WebRTC implementation
- Peer-to-peer connections
- Secure encrypted communication
- Screen sharing support

### 📸 Stories
- 24-hour expiration
- Image and video support
- Views tracking
- Interactive reactions

### 👥 Social Features
- Friend request system
- Follow/unfollow functionality
- Activity feed
- Notifications for interactions

---

## 🔐 API Documentation

### Authentication Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/register` | Register new user | No |
| POST | `/api/auth/login` | Login user | No |
| GET | `/api/auth/logout` | Logout user | Yes |
| GET | `/api/auth/me` | Get current user | Yes |

### User Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/users` | Get all users | Yes |
| GET | `/api/users/:id` | Get user by ID | Yes |
| PUT | `/api/users/:id` | Update user | Yes |
| POST | `/api/users/follow/:id` | Follow user | Yes |
| DELETE | `/api/users/unfollow/:id` | Unfollow user | Yes |

### Post Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/posts` | Get all posts | Yes |
| POST | `/api/posts` | Create post | Yes |
| GET | `/api/posts/:id` | Get post by ID | Yes |
| PUT | `/api/posts/:id` | Update post | Yes |
| DELETE | `/api/posts/:id` | Delete post | Yes |
| POST | `/api/posts/like/:id` | Like post | Yes |
| POST | `/api/posts/comment/:id` | Add comment | Yes |

### Chat Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/chat` | Get user chats | Yes |
| POST | `/api/chat` | Create/access chat | Yes |
| GET | `/api/chat/:id` | Get chat messages | Yes |
| POST | `/api/chat/message` | Send message | Yes |

---

## 🤝 Contributing

We love contributions! Here's how you can help:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Commit your changes**
   ```bash
   git commit -m 'Add amazing feature'
   ```
4. **Push to the branch**
   ```bash
   git push origin feature/amazing-feature
   ```
5. **Open a Pull Request**

### Development Guidelines
- Follow existing code style
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🌐 Live Demo

Check out the live application at: [https://auramic.onrender.com](https://auramic.onrender.com)
