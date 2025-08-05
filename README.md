# ExportExpress Pro - Complete Export Management Solution

## 🚀 Project Overview

ExportExpress Pro is a comprehensive export management platform that combines web-based administration, desktop applications, AI-powered market analysis, and intelligent document generation. The platform is designed to streamline export operations, provide market intelligence, and automate document workflows.

## 📋 Table of Contents

- [Architecture Overview](#architecture-overview)
- [Components](#components)
- [Quick Start](#quick-start)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [API Documentation](#api-documentation)
- [Development](#development)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

## 🏗️ Architecture Overview

ExportExpress Pro consists of multiple interconnected components:

```
ExportExpress Pro
├── 📱 Desktop Application (Tauri + React)
├── 🌐 Web Frontend (React + TypeScript)
├── 🔧 Backend API (Node.js + Express)
├── 🤖 AI Engine (Python + ML)
├── 📊 Database (MongoDB + Redis)
└── 🔗 Website Integration
```

## 🧩 Components

### 1. Desktop Application (`desktop-app/`)
- **Technology**: Tauri + React + TypeScript
- **Purpose**: Cross-platform desktop application for export management
- **Features**:
  - Product catalog management
  - Order processing
  - Document generation
  - Market intelligence dashboard
  - Supplier management
  - Real-time notifications

### 2. Web Frontend (`TheExportExpress-main/frontend/`)
- **Technology**: React + TypeScript + Tailwind CSS
- **Purpose**: Web-based interface for export operations
- **Features**:
  - Product browsing and search
  - User authentication
  - Admin panel
  - Bulk import/export
  - Category management

### 3. Backend API (`TheExportExpress-main/backend/`)
- **Technology**: Node.js + Express + TypeScript
- **Purpose**: RESTful API for all export operations
- **Features**:
  - User authentication and authorization
  - Product CRUD operations
  - File upload handling
  - Category management
  - Inquiry processing
  - Admin controls

### 4. AI Engine (`ai-engine/`)
- **Technology**: Python + Machine Learning
- **Purpose**: Market analysis and price prediction
- **Features**:
  - Price prediction models
  - Market trend analysis
  - News processing
  - Real-time market data
  - Predictive analytics

### 5. Website Integration (`website-integration/`)
- **Technology**: Node.js + Express
- **Purpose**: Integration layer for external websites
- **Features**:
  - API synchronization
  - Data transformation
  - Webhook handling

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- Python (v3.8 or higher)
- MongoDB
- Redis
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/PearlShadowww/TheExportExpress.git
   cd TheExportExpress
   ```

2. **Install dependencies for all components**
   ```bash
   # Backend
   cd TheExportExpress-main/backend
   npm install

   # Frontend
   cd ../frontend
   npm install

   # Desktop App
   cd ../../desktop-app
   npm install

   # AI Engine
   cd ../ai-engine
   pip install -r requirements.txt
   ```

3. **Set up environment variables**
   ```bash
   # Copy environment templates
   cp .env.example .env
   ```

4. **Start the services**
   ```bash
   # Start backend
   cd TheExportExpress-main/backend
   npm run dev

   # Start frontend (in new terminal)
   cd TheExportExpress-main/frontend
   npm run dev

   # Start AI engine (in new terminal)
   cd ai-engine
   python src/main.py
   ```

## ⚙️ Configuration

### Environment Variables

Create `.env` files in each component directory:

**Backend (.env)**
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/exportexpress
JWT_SECRET=your_jwt_secret
REDIS_URL=redis://localhost:6379
UPLOAD_PATH=./uploads
```

**Frontend (.env)**
```env
VITE_API_URL=http://localhost:5000/api
VITE_WS_URL=ws://localhost:5000
```

**AI Engine (.env)**
```env
MONGODB_URI=mongodb://localhost:27017/exportexpress
REDIS_URL=redis://localhost:6379
API_KEY=your_api_key
```

### Database Setup

1. **MongoDB**
   ```bash
   # Start MongoDB
   mongod

   # Initialize database
   node TheExportExpress-main/backend/src/scripts/seed-all.ts
   ```

2. **Redis**
   ```bash
   # Start Redis
   redis-server
   ```

## 📖 Usage

### Desktop Application
1. Navigate to `desktop-app/`
2. Run `npm run tauri dev` for development
3. Run `npm run tauri build` for production build

### Web Application
1. Access the frontend at `http://localhost:5173`
2. Register an account or login as admin
3. Start managing products and exports

### API Endpoints
- **Authentication**: `/api/auth/*`
- **Products**: `/api/products/*`
- **Categories**: `/api/categories/*`
- **Users**: `/api/admin/*`
- **Uploads**: `/api/upload/*`

## 🔧 Development

### Project Structure
```
ExportExpress Pro/
├── desktop-app/           # Tauri desktop application
├── ai-engine/            # Python AI/ML engine
├── TheExportExpress-main/
│   ├── backend/          # Node.js API server
│   └── frontend/         # React web application
├── website-integration/   # External integrations
├── shared/               # Shared utilities
└── docs/                 # Documentation
```

### Development Commands

**Backend Development**
```bash
cd TheExportExpress-main/backend
npm run dev          # Start development server
npm run build        # Build for production
npm run test         # Run tests
```

**Frontend Development**
```bash
cd TheExportExpress-main/frontend
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
```

**Desktop App Development**
```bash
cd desktop-app
npm run tauri dev    # Start development
npm run tauri build  # Build for production
```

**AI Engine Development**
```bash
cd ai-engine
python src/main.py   # Start AI engine
python -m pytest     # Run tests
```

## 🚀 Deployment

### Docker Deployment
```bash
# Build and run with Docker Compose
docker-compose up -d
```

### Manual Deployment
1. Build all components
2. Set up production environment variables
3. Configure reverse proxy (nginx)
4. Set up SSL certificates
5. Configure PM2 for process management

## 📚 API Documentation

### Authentication
```http
POST /api/auth/register
POST /api/auth/login
POST /api/auth/logout
GET  /api/auth/profile
```

### Products
```http
GET    /api/products
POST   /api/products
GET    /api/products/:id
PUT    /api/products/:id
DELETE /api/products/:id
```

### Categories
```http
GET    /api/categories
POST   /api/categories
PUT    /api/categories/:id
DELETE /api/categories/:id
```

### Admin Operations
```http
GET    /api/admin/users
POST   /api/admin/users
PUT    /api/admin/users/:id
DELETE /api/admin/users/:id
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Write comprehensive tests
- Update documentation
- Follow the existing code style
- Add proper error handling

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: Check the `/docs` folder for detailed guides
- **Issues**: Report bugs via GitHub Issues
- **Discussions**: Use GitHub Discussions for questions
- **Email**: support@exportexpress.com

## 🔗 Links

- **GitHub Repository**: https://github.com/PearlShadowww/TheExportExpress
- **Live Demo**: https://exportexpress.com
- **Documentation**: https://docs.exportexpress.com
- **API Docs**: https://api.exportexpress.com

---

**ExportExpress Pro** - Streamlining global trade operations with intelligent automation and comprehensive management tools.

*Built with ❤️ for the global export community*
