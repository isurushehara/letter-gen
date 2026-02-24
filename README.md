# 📝 Letter Generator

A full-stack web application that helps users create professional letters using customizable templates. Built with React, TypeScript, Express, and Prisma.

## ✨ Features

### User Features
- 🔐 **User Authentication** - Secure registration and login system with JWT
- 📄 **Template-based Generation** - Create letters from pre-built templates
- ✍️ **Rich Text Editor** - Powered by TipTap for advanced text formatting
- 💾 **Letter Management** - Save, view, and manage all your letters
- 👤 **User Profile** - Manage your account settings
- 📊 **Letter History** - Track all your created letters with metadata

### Admin Features
- 🔑 **Admin Dashboard** - Separate admin authentication and interface
- 📋 **Template Management** - Create and manage global templates
- 👥 **User Management** - Oversee user accounts and activities

### Template System
- **Categories** - Organize templates by type (business, personal, formal, etc.)
- **Tone & Audience** - Templates tailored for different contexts
- **Custom Templates** - Users can create their own templates
- **Dynamic Fields** - Input values stored and reusable

## 🛠️ Tech Stack

### Frontend
- **React 19** - Modern UI library
- **TypeScript** - Type-safe development
- **React Router** - Client-side routing
- **TailwindCSS** - Utility-first styling
- **TipTap** - Rich text editor
- **JWT Decode** - Token handling

### Backend
- **Node.js** - Runtime environment
- **Express 5** - Web framework
- **Prisma** - Modern ORM
- **PostgreSQL** - Database
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **Puppeteer** - PDF generation
- **CORS** - Cross-origin resource sharing

## 📁 Project Structure

```
letter_gen/
├── client/                 # React frontend
│   ├── public/            # Static files
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   │   ├── Navbar.tsx
│   │   │   └── RichEditor.tsx
│   │   ├── context/       # React context
│   │   │   └── AuthContext.tsx
│   │   ├── pages/         # Page components
│   │   │   ├── Home.tsx
│   │   │   ├── Generator.tsx
│   │   │   ├── Letters.tsx
│   │   │   ├── LetterView.tsx
│   │   │   ├── Login.tsx
│   │   │   ├── Register.tsx
│   │   │   ├── Profile.tsx
│   │   │   ├── AdminLogin.tsx
│   │   │   └── AdminDashboard.tsx
│   │   └── App.tsx
│   └── package.json
│
├── server/                # Express backend
│   ├── controllers/       # Route controllers
│   │   ├── authController.js
│   │   ├── letterController.js
│   │   └── templateController.js
│   ├── middlewares/       # Custom middleware
│   │   └── authMiddleware.js
│   ├── routes/           # API routes
│   │   ├── authRoutes.js
│   │   ├── letterRoutes.js
│   │   └── templateRoutes.js
│   ├── prisma/           # Database
│   │   ├── schema.prisma
│   │   └── migrations/
│   ├── scripts/          # Utility scripts
│   └── index.js          # Server entry point
│
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- PostgreSQL database
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd letter_gen
   ```

2. **Set up the backend**
   ```bash
   cd server
   npm install
   ```

3. **Configure environment variables**
   
   Create a `.env` file in the `server` directory:
   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/letter_gen"
   JWT_SECRET="your-secret-key-here"
   PORT=5000
   ```

4. **Run database migrations**
   ```bash
   npx prisma migrate dev
   npx prisma generate
   ```

5. **Set up the frontend**
   ```bash
   cd ../client
   npm install
   ```

### Running the Application

1. **Start the backend server** (from the `server` directory)
   ```bash
   npm run dev
   ```
   The server will run on `http://localhost:5000`

2. **Start the frontend** (from the `client` directory)
   ```bash
   npm start
   ```
   The app will open at `http://localhost:3000`

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/admin-login` - Admin login

### Templates
- `GET /api/templates` - Get all templates
- `GET /api/templates/:id` - Get template by ID
- `POST /api/templates` - Create new template (Admin)
- `PUT /api/templates/:id` - Update template (Admin)
- `DELETE /api/templates/:id` - Delete template (Admin)

### Letters
- `GET /api/letters` - Get user's letters
- `GET /api/letters/:id` - Get letter by ID
- `POST /api/letters` - Create new letter
- `PUT /api/letters/:id` - Update letter
- `DELETE /api/letters/:id` - Delete letter

## 🗄️ Database Schema

### User Model
- `id` (UUID)
- `name` (String)
- `email` (String, unique)
- `password` (String, hashed)
- `role` (Enum: USER | ADMIN)
- `createdAt` (DateTime)

### Letter Model
- `id` (UUID)
- `title` (String)
- `content` (String)
- `language` (String)
- `userId` (String, foreign key)
- `templateId` (String, optional foreign key)
- `inputValues` (JSON, optional)
- `createdAt` (DateTime)

### Template Model
- `id` (UUID)
- `title` (String)
- `category` (String)
- `tone` (String)
- `audience` (String)
- `language` (String)
- `content` (String)
- `isGlobal` (Boolean)
- `userId` (String, optional foreign key)
- `createdAt` (DateTime)

## 🔒 Authentication

The application uses JWT (JSON Web Tokens) for authentication:
- Separate authentication flows for users and admins
- Protected routes on both frontend and backend
- Token-based session management
- Password hashing with bcryptjs

## 🧪 Testing

Run tests for the frontend:
```bash
cd client
npm test
```

## 📝 Scripts

### Server Scripts
- `npm run dev` - Start development server with nodemon
- `npm run check:persistence` - Validate database persistence
- `npm run check:all` - Run all health checks

### Client Scripts
- `npm start` - Start development server
- `npm run build` - Build for production
- `npm test` - Run tests

## 🔧 Development Tools

- **Prisma Studio** - Visual database editor
  ```bash
  cd server
  npx prisma studio
  ```

- **Database Reset** (caution: deletes all data)
  ```bash
  npx prisma migrate reset
  ```

## 📦 Building for Production

1. **Build the frontend**
   ```bash
   cd client
   npm run build
   ```
   The production build will be in the `client/build` directory.

2. **Configure backend for production**
   - Set `NODE_ENV=production`
   - Use production database URL
   - Configure proper CORS settings
   - Set secure JWT secret

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License.

## 👨‍💻 Author

Your Name - isurushehara@gmail.com

## 🙏 Acknowledgments

- TipTap for the excellent rich text editor
- Prisma for the amazing ORM
- React community for the awesome ecosystem
