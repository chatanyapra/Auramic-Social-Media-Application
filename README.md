

```markdown
# Auramic – MERN Social Media Application 🚀

**Auramic** is a full-stack social media web application built using the **MERN stack** (MongoDB, Express.js, React, Node.js). It delivers a modern, responsive, and engaging experience with real-time features like live chat, stories, video/audio calling, and AI-powered conversations (AuramicAi). :contentReference[oaicite:1]{index=1}

🌐 **Live Demo:** https://auramic.onrender.com :contentReference[oaicite:2]{index=2}

---

## ⭐ Key Features

✔️ User Authentication (Login/Signup)  
✔️ **AI Assistant (AuramicAi)** using Gemini API  
✔️ Create/Edit/Delete Posts  
✔️ Story Feature (Images & Videos)  
✔️ ❤️ Like & Comment on Posts  
✔️ Real-Time Chat with Socket.IO  
✔️ Video & Audio Calling (WebRTC)  
✔️ Friend Requests & Follow/Unfollow  
✔️ Search Users  
✔️ Save/Unsave Posts  
✔️ User Profile Page  
✔️ Responsive & Aesthetic UI  
✔️ Image/Video Uploads via Cloudinary + Multer :contentReference[oaicite:3]{index=3}

---

## 🧠 Tech Stack

### Frontend
- React.js  
- Tailwind CSS  
- React Router DOM  
- Axios  
- GSAP (animation) :contentReference[oaicite:4]{index=4}

### Backend
- Node.js  
- Express.js  
- MongoDB + Mongoose  
- JWT Authentication  
- Cloudinary + Multer (media uploads)  
- Socket.IO (real-time events) :contentReference[oaicite:5]{index=5}

### Extra Technologies
- **Gemini API** for AI chat  
- **WebRTC** for audio & video calls  
- Deployment:
  - Frontend & Backend: Render  
  - Database: MongoDB Atlas :contentReference[oaicite:6]{index=6}

---

## 📁 Project Structure

```

Auramic-Social-Media-Application/
├── backend/
├── frontend/
├── .gitignore
├── env.text
├── README.md
├── package.json

````

- **backend** – API, authentication, socket logic  
- **frontend** – React UI & pages  
- **env.text** – Environment variable template  
- **package.json** – Dependencies & scripts :contentReference[oaicite:7]{index=7}

---

## 📦 Setup & Installation

### 🔁 Clone the Repository

```bash
git clone https://github.com/chatanyapra/Auramic-Social-Media-Application.git
cd Auramic-Social-Media-Application
````

---

### ⚙ Backend Setup

1. Navigate to backend:

```bash
cd backend
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file from the template:

```bash
cp ../env.text .env
```

4. Fill in environment variables (MongoDB URI, JWT secret, Cloudinary keys, etc).

5. Start the backend:

```bash
npm run dev
```

---

### 🌐 Frontend Setup

1. Navigate to frontend:

```bash
cd frontend
```

2. Install packages:

```bash
npm install
```

3. Start the frontend:

```bash
npm start
```

4. Open the app in the browser:

```
http://localhost:3000
```

---

## 📌 Environment Variables

Your `.env` should include:

```
MONGO_URI=your_mongo_db_connection_string
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=xxx
CLOUDINARY_API_KEY=xxx
CLOUDINARY_API_SECRET=xxx
SOCKET_ENDPOINT=http://localhost:5000
```
