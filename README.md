# Tourist Spotter in India

## 🌍 Project Overview
Tourist Spotter is a **MERN stack** web application that helps users discover popular tourist destinations in India based on their preferences. The app provides personalized vacation plans, displays tourist locations on an interactive map, and allows users to generate AI-powered itineraries.

## 🚀 Features
- 🔐 **User Authentication** (Login & Registration with JWT)
- 🎯 **Personalized Preferences** (Interests, duration, transport mode, location)
- 🗺 **Interactive Map** (Markers for tourist spots, hover descriptions, place selection)
- 📍 **Predefined & API-based Locations** (Famous tourist spots + Geoapify & Wikipedia API integration)
- 📅 **AI-Generated Itinerary** (Using Google Gemini API for personalized travel plans)
- 💾 **MongoDB Storage** (Stores user preferences & selected places)

---

## 🏗️ Tech Stack
- **Frontend:** React, Tailwind CSS
- **Backend:** Node.js, Express.js
- **Database:** MongoDB (Mongoose ODM)
- **APIs:** Geoapify, Wikipedia, Google Gemini AI
- **Authentication:** JWT (JSON Web Tokens)

---

## 📂 Project Structure
```
Tourist Spotter/
│── backend/                # Express.js Backend
│   ├── controllers/        # API controllers
│   ├── models/             # Mongoose models
│   ├── routes/             # API routes
│   ├── config/             # Configuration files
│   ├── server.js           # Entry point for backend
│
│── ts/                     # React Frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── services/       # API service calls
│   │   ├── App.js          # Main React App file
│   │   ├── index.js        # React entry point
│
│── README.md               # Project Documentation
│── package.json            # Dependencies
│── .env                    # Environment variables
```

---

## 🛠 Setup & Installation
### 1️⃣ Clone the Repository
```sh
git clone https://github.com/Madathanapalleleena/tourist-spotter.git
cd tourist-spotter
```

### 2️⃣ Backend Setup
```sh
cd backend
npm install  # Install dependencies
cp .env.example .env  # Configure environment variables
node server.js  # Start backend server
```

### 3️⃣ Frontend Setup
```sh
cd ts
npm install  # Install dependencies
npm start  # Start frontend server
```

---

## 🔑 Environment Variables
Create a `.env` file in the `backend/` folder and set up the following:
```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
GEMINI_API_KEY=your_google_gemini_api_key
GEOAPIFY_API_KEY=your_geoapify_api_key
```

---

## 🎯 API Endpoints
### **User Authentication**
| Method | Endpoint       | Description         |
|--------|---------------|---------------------|
| POST   | /api/auth/register | User Registration |
| POST   | /api/auth/login    | User Login        |

### **Preferences & Itinerary**
| Method | Endpoint             | Description                       |
|--------|----------------------|-----------------------------------|
| POST   | /api/preferences     | Save user preferences            |
| GET    | /api/preferences     | Get user preferences             |
| POST   | /api/generate-itinerary | Generate AI-powered itinerary   |

### **Tourist Spots & Map**
| Method | Endpoint         | Description                        |
|--------|-----------------|------------------------------------|
| GET    | /api/tourist-spots | Fetch predefined & API-based spots |
| POST   | /api/select-spot  | Select/unselect a tourist spot     |

---

## 🎉 Future Improvements
- ✅ User reviews & ratings for places
- ✅ Real-time weather integration
- ✅ Social sharing of travel plans

---

## 🤝 Contributing
Feel free to **fork** this repo, make changes, and submit a **pull request**! 😊

---

## 📜 License
This project is **open-source** under the MIT License.

---

💡 **Created by Madathanapalle Leena and Priyanshu Nerella** 🚀

