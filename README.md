# 🏡 Real Estate Marketplace

<div align="center">

![MERN Stack](https://img.shields.io/badge/MERN-Stack-blue?style=for-the-badge)
![React](https://img.shields.io/badge/React-18.3.1-61DAFB?style=for-the-badge&logo=react)
![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=node.js)
![MongoDB](https://img.shields.io/badge/MongoDB-Database-47A248?style=for-the-badge&logo=mongodb)
![Vercel](https://img.shields.io/badge/Deployed-Vercel-000000?style=for-the-badge&logo=vercel)

**A modern full-stack real estate marketplace built with the MERN stack**

[Live Demo](https://sman-state-g7eq.vercel.app) • [Report Bug](https://github.com/naqvi110k/mern-state/issues) • [Request Feature](https://github.com/naqvi110k/mern-state/issues)

</div>

---

## 🌟 Overview

A comprehensive real estate platform that enables users to browse, list, and manage properties with a seamless user experience. Built with modern technologies and best practices, this application features secure authentication, cloud-based image management, and a responsive design.

**🔗 Live Application**: [https://sman-state.vercel.app](https://sman-state.vercel.app)

---

## ✨ Key Features

### 🔐 Authentication & Security
- **JWT-based Authentication** - Secure token-based login system
- **Google OAuth Integration** - Quick sign-in with Google accounts
- **Protected Routes** - Private routes for authenticated users only
- **Password Encryption** - Bcrypt hashing for secure password storage

### 🏘️ Property Management
- **Create Listings** - Add new properties with detailed information
- **Edit & Delete** - Full CRUD operations on user's own listings
- **Advanced Search** - Filter by location, price, type, and amenities
- **Property Details** - Comprehensive property information pages

### 🖼️ Media Handling
- **Cloudinary Integration** - Cloud-based image storage and optimization
- **Multiple Images** - Upload multiple property images per listing
- **Responsive Images** - Automatic image optimization for different devices

### 👤 User Dashboard
- **Profile Management** - Update user information and preferences
- **My Listings** - View and manage personal property listings
- **Contact Landlord** - Direct communication with property owners

### 🎨 Modern UI/UX
- **Responsive Design** - Mobile-first approach with Tailwind CSS
- **Swiper Carousel** - Beautiful image galleries
- **Toast Notifications** - Real-time feedback with react-hot-toast
- **Loading States** - Smooth loading indicators and transitions

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| **React 18** | UI library with modern hooks |
| **Vite** | Fast build tool and dev server |
| **Redux Toolkit** | State management |
| **Redux Persist** | Persist Redux state across sessions |
| **React Router v7** | Client-side routing |
| **Tailwind CSS** | Utility-first CSS framework |
| **Axios** | HTTP client for API requests |
| **Firebase** | Google authentication |
| **Swiper** | Modern touch slider |
| **Lucide React** | Beautiful icon library |

### Backend
| Technology | Purpose |
|------------|---------|
| **Node.js** | JavaScript runtime |
| **Express.js** | Web application framework |
| **MongoDB** | NoSQL database |
| **Mongoose** | MongoDB ODM |
| **JWT** | JSON Web Token authentication |
| **Bcrypt** | Password hashing |
| **Cookie Parser** | Parse cookies in requests |
| **Dotenv** | Environment variable management |

### Cloud Services
- **Vercel** - Hosting and serverless functions
- **MongoDB Atlas** - Cloud database
- **Cloudinary** - Image storage and CDN
- **Firebase** - Google OAuth

---

## 📁 Project Structure

```
mern-state/
├── api/                      # Backend source code
│   ├── controllers/          # Route controllers
│   │   ├── auth.controller.js
│   │   ├── listing.controller.js
│   │   └── user.controller.js
│   ├── models/              # Database models
│   │   ├── user.model.js
│   │   └── listing.model.js
│   ├── routes/              # API routes
│   │   ├── auth.route.js
│   │   ├── listing.route.js
│   │   └── user.route.js
│   ├── utils/               # Utility functions
│   │   ├── error.js
│   │   └── verifyUser.js
│   └── index.js             # Express app entry point
├── client/                  # Frontend source code
│   ├── src/
│   │   ├── Component/       # React components
│   │   │   ├── Header.jsx
│   │   │   ├── OAuth.jsx
│   │   │   ├── PrivateRoute.jsx
│   │   │   ├── ListingItem.jsx
│   │   │   └── Contact.jsx
│   │   ├── pages/           # Page components
│   │   │   ├── Home.jsx
│   │   │   ├── SignIn.jsx
│   │   │   ├── SignUp.jsx
│   │   │   ├── Profile.jsx
│   │   │   ├── CreateListing.jsx
│   │   │   ├── UpdateListing.jsx
│   │   │   ├── Listing.jsx
│   │   │   ├── Search.jsx
│   │   │   └── About.jsx
│   │   ├── redux/           # Redux store
│   │   │   ├── store.js
│   │   │   └── user/
│   │   │       └── userSlice.js
│   │   ├── App.jsx          # Main app component
│   │   ├── main.jsx         # Entry point
│   │   ├── firebase.js      # Firebase config
│   │   └── index.css        # Global styles
│   ├── public/              # Static assets
│   ├── index.html
│   ├── vite.config.js       # Vite configuration
│   ├── tailwind.config.js   # Tailwind configuration
│   └── package.json
├── vercel.json              # Vercel deployment config
├── package.json             # Root package.json
├── .gitignore
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **MongoDB** account (MongoDB Atlas)
- **Cloudinary** account
- **Firebase** project (for Google OAuth)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/naqvi110k/mern-state.git
   cd mern-state
   ```

2. **Install backend dependencies**
   ```bash
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd client
   npm install
   cd ..
   ```

4. **Set up environment variables**

   Create a `.env` file in the root directory:
   ```env
   # MongoDB
   MONGO=your_mongodb_connection_string
   
   # JWT
   JWT_SECRET=your_jwt_secret_key
   
   # Cloudinary (Backend)
   CLOUDINARY_CLOUD_NAME=your_cloudinary_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   ```

   Create a `.env` file in the `client/` directory:
   ```env
   # Firebase (Google OAuth)
   VITE_FIREBASE_API_KEY=your_firebase_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
   VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_firebase_sender_id
   VITE_FIREBASE_APP_ID=your_firebase_app_id
   ```

5. **Run the application**

   **Backend (Terminal 1):**
   ```bash
   npm run dev
   ```

   **Frontend (Terminal 2):**
   ```bash
   cd client
   npm run dev
   ```

6. **Access the application**
   - Frontend: `http://localhost:5173`
   - Backend API: `http://localhost:3000`

---

## ☁️ Deployment

### Deploy to Vercel

This project is configured for seamless deployment on Vercel with both frontend and backend in a single monorepo.

#### Quick Deploy

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Import to Vercel**
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click **"New Project"**
   - Import your GitHub repository

3. **Configure Build Settings**
   - **Framework Preset**: Vite (auto-detected)
   - **Root Directory**: Leave as root
   - **Build Command**: `cd client && npm install && npm run build`
   - **Output Directory**: `client/dist`
   - **Install Command**: `npm install`

4. **Add Environment Variables**
   
   In Vercel Dashboard → Settings → Environment Variables, add:
   ```
   MONGO=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   CLOUDINARY_CLOUD_NAME=your_cloudinary_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   VITE_FIREBASE_API_KEY=your_firebase_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   ```

5. **Deploy** 🚀
   - Click **"Deploy"**
   - Vercel will build and deploy your application
   - Your app will be live at `https://your-project.vercel.app`

#### How It Works

- **Frontend**: Built with Vite and served from `client/dist`
- **Backend**: Runs as Vercel serverless functions at `/api/*`
- **Routing**: Configured in [`vercel.json`](./vercel.json)
- **API Requests**: Frontend `/api/*` routes automatically proxy to backend

---

## 📚 API Endpoints

### Authentication
```
POST   /api/auth/signup      - Register new user
POST   /api/auth/signin      - Login user
POST   /api/auth/google      - Google OAuth login
GET    /api/auth/signout     - Logout user
```

### User
```
GET    /api/user/:id         - Get user profile
POST   /api/user/update/:id  - Update user profile
DELETE /api/user/delete/:id  - Delete user account
GET    /api/user/listings/:id - Get user's listings
```

### Listings
```
POST   /api/listing/create   - Create new listing
DELETE /api/listing/delete/:id - Delete listing
POST   /api/listing/update/:id - Update listing
GET    /api/listing/get/:id  - Get single listing
GET    /api/listing/get      - Search listings with filters
```

---

## 🎯 Features in Detail

### User Authentication Flow
1. User signs up with email/password or Google OAuth
2. JWT token generated and stored in HTTP-only cookie
3. Redux state persisted in localStorage
4. Protected routes check authentication status
5. Automatic token refresh on page reload

### Property Listing Flow
1. User navigates to "Create Listing" page
2. Fills property details (name, description, address, price)
3. Uploads images to Cloudinary
4. Submits form → API creates listing in MongoDB
5. Redirects to property detail page

### Search & Filter
- **Text Search**: Property name and description
- **Type Filter**: Rent, Sale, Offer
- **Amenities**: Parking, Furnished
- **Sort Options**: Price (high/low), Latest, Oldest
- **Pagination**: Load more results

---

## 🔧 Configuration Files

### `vercel.json`
Routes API requests to serverless functions:
```json
{
  "rewrites": [
    {
      "source": "/api/(.*)",
      "destination": "/api/index.js"
    }
  ]
}
```

### `vite.config.js`
Proxies API requests during development:
```javascript
export default defineConfig({
  server: {
    proxy: {
      "/api": {
        target: 'http://localhost:3000',
        changeOrigin: true,
      }
    }
  }
})
```

---

## 🤝 Contributing

Contributions make the open-source community an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Naqvi110k**

- GitHub: [@naqvi110k](https://github.com/naqvi110k)
- Project Link: [https://github.com/naqvi110k/mern-state](https://github.com/naqvi110k/mern-state)

---

## 🙏 Acknowledgments

- [React Documentation](https://react.dev)
- [Express.js](https://expressjs.com)
- [MongoDB](https://www.mongodb.com)
- [Tailwind CSS](https://tailwindcss.com)
- [Vercel](https://vercel.com)
- [Cloudinary](https://cloudinary.com)
- [Firebase](https://firebase.google.com)

---

<div align="center">

**⭐ Star this repo if you find it useful!**

Made with ❤️ using MERN Stack

</div>
