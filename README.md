# CtrlRoom - Computer Lab Management System

A modern, full-stack application for managing university computer labs with real-time monitoring, complaint tracking, and user management.

## 🚀 Features

- **Computer Inventory Management**: Track computer specifications, status, and location
- **Real-time Status Monitoring**: Monitor computer availability and maintenance status
- **Complaint Management**: Report and track computer issues
- **User Authentication**: Role-based access for students and administrators
- **Responsive Dashboard**: Modern UI with real-time statistics
- **API-First Architecture**: RESTful API with comprehensive documentation

## 🏗️ Tech Stack

### Backend

- **Laravel 8.x** - PHP Framework
- **Laravel Sanctum** - API Authentication
- **MySQL** - Database
- **Eloquent ORM** - Database Management

### Frontend

- **React 19.x** - UI Framework
- **Vite** - Build Tool
- **Tailwind CSS** - Styling
- **React Router** - Navigation
- **Axios** - HTTP Client
- **FontAwesome** - Icons

## 📋 Prerequisites

- PHP 8.0 or higher
- Composer
- Node.js 16.x or higher
- MySQL 5.7 or higher
- Git

## 🛠️ Installation

### Backend Setup

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd CtrlRoom/Backend
   ```

2. **Install dependencies**

   ```bash
   composer install
   ```

3. **Environment configuration**

   ```bash
   cp .env.example .env
   php artisan key:generate
   ```

4. **Database setup**

   ```bash
   # Update .env with your database credentials
   DB_CONNECTION=mysql
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_DATABASE=ctrlroom
   DB_USERNAME=your_username
   DB_PASSWORD=your_password
   ```

5. **Run migrations and seeders**

   ```bash
   php artisan migrate
   php artisan db:seed --class=ComputerSeeder
   ```

6. **Start the server**
   ```bash
   php artisan serve
   ```

### Frontend Setup

1. **Navigate to frontend directory**

   ```bash
   cd ../Frontend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Environment configuration**

   ```bash
   # Create .env file
   echo "REACT_APP_API_URL=http://127.0.0.1:8000/api" > .env
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

## 🌐 Access Points

- **Frontend**: http://localhost:3000
- **Backend API**: http://127.0.0.1:8000/api
- **API Documentation**: See `Backend/COMPUTER_API_DOCUMENTATION.md`

## 👥 User Roles

### Student

- View computer availability
- Access personal dashboard
- Update profile information

### Admin

- Full computer management (CRUD operations)
- View all complaints
- Access system statistics
- Manage user accounts

## 📊 API Endpoints

### Authentication

- `POST /api/register/student` - Student registration
- `POST /api/register/admin` - Admin registration
- `POST /api/login` - User login
- `POST /api/logout` - User logout
- `GET /api/user` - Get current user

### Computer Management

- `GET /api/computers` - List all computers
- `POST /api/computers` - Create computer
- `GET /api/computers/{id}` - Get computer details
- `PUT /api/computers/{id}` - Update computer
- `DELETE /api/computers/{id}` - Delete computer
- `GET /api/computers/status/{status}` - Get computers by status
- `PATCH /api/computers/{id}/status` - Update computer status
- `PATCH /api/computers/{id}/complaints` - Update complaints
- `GET /api/computers/statistics/overview` - Get statistics

## 🗄️ Database Schema

### Users Table

- `id` - Primary key
- `name` - User's full name
- `email` - Unique email address
- `password` - Hashed password
- `role` - User role (student/admin)
- `created_at` - Creation timestamp
- `updated_at` - Last update timestamp

### Computers Table

- `id` - Primary key
- `system_status` - Computer status (available/under_maintenance)
- `complaints` - JSON array of complaints
- `os` - Operating system
- `processor` - CPU information
- `ram` - Memory information
- `storage` - Storage information
- `graphics_card` - Graphics card
- `motherboard` - Motherboard information
- `location` - Physical location
- `asset_tag` - Unique asset identifier
- `created_at` - Creation timestamp
- `updated_at` - Last update timestamp

## 🔧 Development

### Backend Development

```bash
# Run tests
php artisan test

# Generate model with migration
php artisan make:model ModelName -m

# Create controller
php artisan make:controller ControllerName

# Clear cache
php artisan cache:clear
php artisan config:clear
php artisan route:clear
```

### Frontend Development

```bash
# Run linting
npm run lint

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🚨 Security Considerations

⚠️ **IMPORTANT**: This project has several security vulnerabilities that need to be addressed before production deployment:

1. **CORS Configuration**: Currently allows all origins
2. **Missing Authentication**: Computer routes are not protected
3. **No Role-Based Access Control**: All users can access all features
4. **Token Expiration**: API tokens never expire

See the code review for detailed security recommendations.

## 📁 Project Structure

```
CtrlRoom/
├── Backend/
│   ├── app/
│   │   ├── Http/Controllers/
│   │   ├── Models/
│   │   └── ...
│   ├── database/
│   │   ├── migrations/
│   │   └── seeders/
│   ├── routes/
│   └── config/
├── Frontend/
│   ├── src/
│   │   ├── Components/
│   │   ├── Pages/
│   │   ├── context/
│   │   └── services/
│   └── public/
└── README.md
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request



## 🙏 Acknowledgments

- Laravel community for the excellent framework
- React team for the amazing UI library
- Tailwind CSS for the utility-first CSS framework
- FontAwesome for the comprehensive icon set


## 🔮 Roadmap

- [ ] Implement real-time notifications
- [ ] Add computer usage tracking
- [ ] Implement automated maintenance scheduling
- [ ] Add mobile app support
- [ ] Implement advanced reporting features
- [ ] Add multi-language support

---

**Note**: This project is currently in development. Please refer to the security considerations section before deploying to production.
