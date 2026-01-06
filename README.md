🏡 Real Estate Marketplace – MERN Stack

A full-stack real estate marketplace web app built with the MERN stack (MongoDB, Express, React, Node).
The app allows users to browse, list, and manage properties with secure authentication, image uploads, and modern UI/UX.

🚀 Features

🔑 Authentication & Authorization

JWT-based login & signup

Google Sign-In integration

🏘 Property Listings

Create, edit, delete property ads

Advanced search & filtering

🖼 Image Uploads

Integrated with Cloudinary for fast, scalable image storage

📊 User Dashboard

Manage personal listings

View favorites & history

⚡ State Management

Implemented with Redux Toolkit for seamless data flow

🛠 Tech Stack

Frontend

React.js (Vite/CRA)

Redux Toolkit

TailwindCSS

Backend

Node.js + Express.js

MongoDB (Mongoose)

Other Tools

JWT Authentication

Google OAuth

Cloudinary for image handling

📂 Installation & Setup
# Clone the repo
git clone https://github.com/naqvi110k/mern-state.git

# Navigate to project root directory
cd mern-state

# Install backend dependencies
npm install

# Navigate to client and install frontend dependencies
cd client
npm install

cd .. # Return to root directory

# Run the development servers
# In one terminal, run backend:
npm run dev

# In another terminal, navigate to client and run frontend:
cd client
npm run dev

⚡ Environment Variables

Create a .env file in the backend folder with the following:

MONGO=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

☁️ Deployment

### Deploy to Vercel

The project is configured for deployment on Vercel. Follow these steps:

1. Push your code to a Git repository (GitHub, GitLab, or Bitbucket)
2. Go to [Vercel Dashboard](https://vercel.com/dashboard) and click "New Project"
3. Import your Git repository
4. Configure the following settings:
   - Build Command: `npm run vercel-build`
   - Root Directory: Select your project root
5. Add environment variables in Vercel dashboard:
   - `MONGO_URI`
   - `JWT_SECRET`
   - `CLOUDINARY_CLOUD_NAME`
   - `CLOUDINARY_API_KEY`
   - `CLOUDINARY_API_SECRET`
   - `VITE_APP_PRESET`
   - `VITE_APP_CLOUD_NAME`
   - `VITE_APP_API_KEY`
   - `VITE_FIREBASE_API_KEY`
6. Click "Deploy"

The application will be deployed with both frontend and backend in a single deployment.

🤝 Contributing

Contributions are welcome! Feel free to open issues and pull requests.

📜 License

This project is licensed under the MIT License.
