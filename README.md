# WebRental - Security Service Portfolio & Management System

A modern, responsive web application for a high-end security service provider. This project features a public-facing portfolio/landing page and a comprehensive admin dashboard for managing content, leads, and services.

## 🚀 Tech Stack

### Frontend
- **React**: UI library for building the interface.
- **Vite**: Build tool and development server for fast HMR.
- **Tailwind CSS**: Utility-first CSS framework for styling.
- **React Router**: For client-side routing.
- **Axios**: HTTP client for API requests.
- **React Hot Toast**: For toast notifications.

### Backend
- **Node.js**: Runtime environment.
- **Express**: Web framework for the API server.
- **MongoDB**: NoSQL database for data persistence.
- **Mongoose**: ODM library for MongoDB and schema modeling.
- **Multer**: Middleware for handling file uploads.

## 🗂 Project Structure

```bash
webrental/
├── models/                 # Mongoose database schemas
│   ├── About.js           # Schema for 'About Us' content
│   ├── Category.js        # Schema for service/project categories
│   ├── Lead.js            # Schema for customer leads/inquiries
│   ├── Project.js         # Schema for portfolio projects
│   ├── Service.js         # Schema for security services offered
│   ├── Setting.js         # Schema for site settings (contact info, hours)
│   └── Stat.js            # Schema for homepage statistics
├── public/                 # Static assets served by Express/Vite
│   └── uploads/           # Directory for uploaded images
├── src/                    # Frontend source code
│   ├── components/        # Reusable UI components
│   ├── hooks/             # Custom React hooks (e.g., useSettings)
│   ├── layouts/           # Page layouts (Admin vs Public)
│   ├── pages/             # Route components
│   │   ├── admin/         # Admin dashboard pages
│   │   └── public/        # Public landing pages
│   ├── utils/             # Helper functions (image processing, formatting)
│   ├── App.jsx            # Main app component with Routing
│   └── main.jsx           # Entry point
├── server.js               # Main Express server file
├── migrate_to_mongo.js    # Script to migrate data from db.json to MongoDB
├── verify_migration.js    # Script to verify API endpoints
└── README.md              # Project documentation
```

## 🛠️ Setup & Installation

### Prerequisites
- [Node.js](https://nodejs.org/) (v16+)
- [MongoDB](https://www.mongodb.com/try/download/community) (Local instance or Atlas)

### 1. Clone the Repository
```bash
git clone https://github.com/aji8f/webrental.git
cd webrental
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Database Setup
Ensure your local MongoDB instance is running on port `27017`. The application connects to `mongodb://127.0.0.1:27017/webrentaldb` by default.

If this is a fresh install and you have a `db.json` backup, you can migrate data:
```bash
node migrate_to_mongo.js
```

### 4. Start the Application
You need to run both the backend server and the frontend development server.

**Terminal 1 (Backend):**
```bash
npm run server
# OR
node server.js
```
Server runs on `http://localhost:3001`.

**Terminal 2 (Frontend):**
```bash
npm run dev
```
Frontend usually runs on `http://localhost:5173`.

## 📡 API Endpoints

The backend exposes a RESTful API.

### Categories
- `GET /categories` - List all categories
- `GET /categories/:id` - Get single category
- `POST /categories` - Create category
- `PUT /categories/:id` - Update category
- `DELETE /categories/:id` - Delete category

### Services
- `GET /services` - List services
- `GET /services/:id` - Get single service
- `POST /services` - Create service
- `PUT /services/:id` - Update service
- `DELETE /services/:id` - Delete service

### Projects (Portfolio)
- `GET /projects` - List projects
- `GET /projects/:id` - Get single project
- `POST /projects` - Add project
- `PUT /projects/:id` - Update project details
- `PATCH /projects/:id` - Partial update (e.g., toggle visibility)
- `DELETE /projects/:id` - Delete project

### Leads
- `GET /leads` - List all inquiries
- `POST /leads` - Submit a new inquiry (Public form)
- `DELETE /leads/:id` - Delete an inquiry

### Settings & Content
- `GET /settings` - Get site configuration
- `PUT /settings` - Update site configuration
- `GET /about` - Get 'About Us' content
- `PUT /about` - Update 'About Us' content
- `GET /stats` - Get company statistics

### Uploads
- `POST /upload` - Upload an image file (returns `{ url: "/uploads/filename.ext" }`)

## 🌐 Website Flow

### Public Interface
1. **Home**: Landing page with hero section, statistics, and featured services.
2. **About**: Company history and mission.
3. **Services**: Detailed list of security services offered.
4. **Portfolio**: Gallery of past projects/secured events.
5. **Contact**: Inquiry form (submits to `/leads`) and contact information.

### Admin Dashboard (`/dashboard`)
*Authentication required (currently simplified)*
1. **Overview**: Dashboard with key metrics.
2. **Leads**: Manage incoming inquiries (view/delete).
3. **Portfolio**: ADD/EDIT/DELETE projects. Includes image gallery management.
4. **Settings**: Configure general site settings (contact info, map URL).

## 🗃️ Database Schema Details

- **Leads**: Stores potential client info (`firstName`, `lastName`, `email`, `phone`, `message`, `status`).
- **Projects**: Portfolio items with `title`, `description`, `category`, `coverImage`, `gallery` (array of images).
- **Settings**: Singleton collection for global site config (`contact` details, `heroImages`, business hours).
- **Services**: Service definitions with `title`, `description`, `icon`.

This documentation provides an overview for developers to understand, run, and extend the application.
