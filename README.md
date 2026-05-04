# 🌱 Smart Agriculture System

## Overview

Smart Agriculture System is a full-stack MERN application designed to assist farmers with modern digital tools for agriculture management. The system provides weather insights, crop-related support, secure authentication, and data-driven decision-making through a centralized platform.

The system includes modules for:

- Farmers (Users)
- System Management

Smart Agriculture helps users efficiently monitor environmental conditions, manage farming activities, and make informed agricultural decisions.

---

## Tech Stack

### Frontend
- React.js
- JavaScript
- HTML5
- CSS3
- Axios
- React Router DOM
- Tailwind CSS

### Backend
- Node.js
- Express.js

### Database
- MongoDB
- Mongoose

### Authentication & Security
- JWT Authentication
- bcrypt Password Hashing

---

## Project Structure

SMART-AGRICULTURE
│
├── backend
│   ├── config
│   ├── controllers
│   ├── middleware
│   ├── models
│   ├── routes
│   ├── src
│   └── package.json
│
├── frontend
│   ├── public
│   ├── src
│   ├── index.html
│   └── package.json
│
├── .gitignore
└── README.md

---

## Features

### Farmer Module
- User Registration & Login
- Weather Information Display
- Crop Management
- Profile Management
- Dashboard Overview

### System Features
- Real-time Weather Data Integration
- Secure API Communication
- Responsive UI Design
- Data Storage & Retrieval

---

## Authentication & Security

- JWT-based Authentication
- Protected Routes
- Password Hashing using bcrypt
- Secure MongoDB Connection

---

## Installation & Setup

### Prerequisites

Install the following:

- Node.js (v16 or above)
- MongoDB
- npm

---

### Clone Repository

git clone https://github.com/thaslimaan6-tech/Smart-Agriculture-Management-System
cd smart-Agriculture-Management-System  

---

### Backend Setup

cd backend  
npm install  

#### Create `.env` File

PORT=5000  
MONGO_URI=your_mongodb_connection_string  
JWT_SECRET=your_secret_key  
OPENWEATHER_API_KEY=your_api_key  

#### Start Backend Server

npm start  

Backend runs on:

http://localhost:5000  

---

### Frontend Setup

cd frontend  
npm install  
npm run dev  

Frontend runs on:

http://localhost:5173  

---

## Installing Node Modules

node_modules are ignored using `.gitignore`.

Install them manually after cloning:

### Backend
cd backend  
npm install  

### Frontend
cd frontend  
npm install  

---

## API Structure

The backend follows RESTful API architecture.

### Main API Modules

- Authentication APIs  
- Weather APIs  
- Crop Management APIs  
- User APIs  

---

## MVC Architecture

This project follows MVC architecture.

### Model
Handles MongoDB schemas and database operations.

### View
Frontend React components and UI.

### Controller
Handles business logic and API processing.

---

## Database

MongoDB is used as the primary database.

### Collections include:

- Users  
- Weather Data  
- Crop Data  

---

## 🔔 Features

- User Authentication (Login/Register)
- Weather Information System
- Crop Management
- Secure API with JWT
- Responsive Dashboard
- Real-time Data Handling

---

## 🎥 FRONTEND CODE EXPLANATION VIDEO
https://drive.google.com/file/d/1jnV2_wa38BEwCpXK8GGyrKm7p84ks9TV/view?usp=drivesdk

---
## 🎥 BACKEND CODE EXPLANATION VIDEO
https://drive.google.com/file/d/1f1gz3Y-HKkox-YiAc98CCWShtwR2Gujh/view?usp=drivesdk

---

## 🎥 PROJECT OVERVIEW VIDEO
https://drive.google.com/file/d/1gK2LyRZ8Kh9EUIauyTiUh4TSgvIXcHrM/view?usp=drivesdk

---

## 🚀 Future Enhancements

- 🌾 AI-based Crop Recommendation System  
- 📡 IoT Sensor Integration  
- 📊 Advanced Analytics Dashboard  
- 🌦 Real-time Weather Alerts  
- 📱 Mobile Application  
- 🧠 Crop Disease Detection using AI  
- 🛰 Satellite Data Integration  
- 💬 Farmer Support System  
- 🔔 Push Notifications  

---

## Author
Shaik Asliman Thasliaan

## License

This project is developed for educational and academic purposes.
