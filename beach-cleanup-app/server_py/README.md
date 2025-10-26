# Beach Cleanup API - Python Backend

A modern FastAPI backend for the Beach Cleanup application, providing RESTful APIs for user authentication, event management, and social features.

## Features

- **FastAPI Framework**: Modern, fast, with automatic API documentation
- **JWT Authentication**: Secure token-based authentication
- **SQLite Database**: Async database operations with aiosqlite
- **Auto-generated API Docs**: Interactive Swagger UI at `/docs`
- **Type Safety**: Full Pydantic validation for requests/responses
- **CORS Support**: Configured for local development
- **Password Hashing**: Secure bcrypt password storage

## Quick Start

### 1. Activate Virtual Environment

```bash
# Windows
..\venv\Scripts\activate

# Mac/Linux
source ../venv/bin/activate
```

### 2. Install Dependencies

All dependencies are already installed! If you need to reinstall:

```bash
pip install -r ../requirements.txt
```

### 3. Set Up Environment Variables

```bash
# Copy example env file
cp .env.example .env

# Edit .env with your configuration
```

### 4. Initialize Database

```bash
python init_database.py
```

This creates:
- All database tables
- Indexes for performance
- Sample debris hotspot data

### 5. Run the Server

```bash
python run.py
```

The server will start on **http://localhost:8000**

## API Documentation

Once the server is running, visit:

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc
- **OpenAPI JSON**: http://localhost:8000/openapi.json

## Available Endpoints

### Authentication

- **POST** `/api/v1/auth/register` - Register new user
  ```json
  {
    "username": "string",
    "email": "user@example.com",
    "password": "string (min 6 chars)"
  }
  ```

- **POST** `/api/v1/auth/login` - Login user
  ```json
  {
    "email": "user@example.com",
    "password": "string"
  }
  ```

### Health Check

- **GET** `/health` - Check server status

## Project Structure

```
server_py/
├── src/
│   ├── config/
│   │   └── database.py          # Database connection management
│   ├── controllers/
│   │   └── auth_controller.py   # Authentication business logic
│   ├── middleware/
│   │   └── auth.py              # JWT authentication middleware
│   ├── models/
│   │   └── schemas.py           # Pydantic request/response models
│   ├── routes/
│   │   └── auth_routes.py       # Authentication API routes
│   └── main.py                  # FastAPI application entry point
├── init_database.py             # Database initialization script
├── run.py                       # Server runner
├── .env                         # Environment configuration
├── .env.example                 # Example environment variables
├── database.db                  # SQLite database (auto-created)
└── README.md                    # This file
```

## Environment Variables

Configure these in `.env`:

```env
# Server
PORT=8000                        # Server port
ENV=development                  # Environment (development/production)

# Database
DATABASE_PATH=database.db        # SQLite database file path

# JWT
JWT_SECRET=your-secret-key       # Secret key for JWT (change in production!)
JWT_EXPIRES_IN=7d                # Token expiration time

# CORS
CORS_ORIGINS=http://localhost:5173,http://localhost:3000
```

## Development

### Running in Development Mode

The server automatically reloads when you make changes:

```bash
python run.py
```

### Database Schema

The database includes these tables:

- **users** - User accounts
- **events** - Cleanup events
- **event_attendees** - Event participation
- **posts** - Social media posts
- **post_likes** - Post likes
- **comments** - Post comments
- **user_follows** - User following relationships
- **debris_hotspots** - Marine debris data

### Adding New Routes

1. Create controller in `src/controllers/`
2. Create routes in `src/routes/`
3. Import and include router in `src/main.py`:
   ```python
   from src.routes import your_routes
   app.include_router(your_routes.router)
   ```

### Testing API

Use the interactive docs at http://localhost:8000/docs or tools like:

- **curl**
- **Postman**
- **HTTPie**
- **Thunder Client** (VS Code extension)

Example with curl:

```bash
# Register a user
curl -X POST http://localhost:8000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","email":"test@example.com","password":"password123"}'

# Login
curl -X POST http://localhost:8000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

## Production Deployment

### Before deploying:

1. **Change JWT_SECRET** to a strong random value
2. **Set ENV=production**
3. **Use a production ASGI server** like Gunicorn with Uvicorn workers:
   ```bash
   pip install gunicorn
   gunicorn src.main:app -w 4 -k uvicorn.workers.UvicornWorker
   ```
4. **Use environment variables** instead of .env file
5. **Set up HTTPS** with reverse proxy (nginx/Caddy)

## Comparing to Node.js Backend

The Python backend is a **complete replacement** for the Node.js server in `/server/`.

### Advantages of Python Backend:

- ✅ **Automatic API documentation** (Swagger/ReDoc)
- ✅ **Type safety** with Pydantic
- ✅ **Better async performance** for I/O operations
- ✅ **Easier to extend** with Python's ecosystem
- ✅ **Works with your virtual environment**

### To use Python backend with frontend:

Update frontend API URL to point to `http://localhost:8000` instead of `http://localhost:3000`.

## Troubleshooting

### Port already in use

```bash
# Change PORT in .env or:
PORT=8001 python run.py
```

### Database locked

```bash
# Stop all server instances and delete database:
rm database.db
python init_database.py
```

### Import errors

Make sure you're in the `server_py` directory and venv is activated:

```bash
cd server_py
..\venv\Scripts\activate  # Windows
python run.py
```

## Tech Stack

- **FastAPI** 0.120.0 - Web framework
- **Uvicorn** 0.38.0 - ASGI server
- **Pydantic** 2.12.3 - Data validation
- **SQLite** (aiosqlite 0.21.0) - Database
- **python-jose** 3.5.0 - JWT tokens
- **passlib** 1.7.4 - Password hashing
- **bcrypt** 5.0.0 - Bcrypt algorithm

## License

MIT

---

**Built with Python for our oceans** 🌊
