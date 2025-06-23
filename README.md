# Cyber-Secure

A modern, secure authentication system with brute-force protection and an animated user interface.

## Features

-  JWT-based authentication with access and refresh tokens
-  Account lockout after 5 failed login attempts
-  Rate limiting to prevent brute force attacks  
-  Password hashing with bcrypt
-  Responsive animated design
-  MongoDB integration for user data storage

## Demo

![Cyber-Secure Demo](https://example.com/demo.gif)

## Prerequisites

Before running this project, make sure you have the following installed:
- [Node.js](https://nodejs.org/) (v14+)
- [MongoDB](https://www.mongodb.com/try/download/community) (v4+)
- [npm](https://www.npmjs.com/) (v6+)

## Installation

1. Clone the repository or download the source code
   ```bash
   git clone https://github.com/TheRealAngelo/Cyber-Secure.git
   cd Cyber-Secure
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory with the following content:
   ```env
   # Server settings
   PORT=3000
   NODE_ENV=development

   # MongoDB connection
   MONGO_URI=mongodb://localhost:27017/cybersecure

   # JWT settings
   JWT_SECRET=your_super_secret_key_change_in_production
   JWT_EXPIRES_IN=1h
   JWT_REFRESH_SECRET=refresh_token_secret_key_change_in_production
   JWT_REFRESH_EXPIRES_IN=7d

   # Security
   PASSWORD_SALT_ROUNDS=12
   ```

4. Make sure MongoDB is running

5. Start the application
   ```bash
   # Development mode with hot reloading
   npm run dev
   
   # OR Production mode
   npm start
   ```

6. Access the application at [http://localhost:3000](http://localhost:3000)

## Project Structure

```
.
├── config/              # Configuration files
├── controllers/         # Route controllers
├── middleware/          # Express middleware
├── models/              # Mongoose models
├── public/              # Static files
├── routes/              # Express routes
├── services/            # Business logic
├── utils/               # Utility functions
└── server.js            # Entry point
```

## API Endpoints

| Method | Endpoint            | Description                | Auth Required |
|--------|---------------------|----------------------------|--------------|
| POST   | /api/auth/register  | Register a new user        | No           |
| POST   | /api/auth/login     | User login                 | No           |
| POST   | /api/auth/refresh   | Refresh access token       | Yes          |
| POST   | /api/auth/logout    | Logout user                | Yes          |

## Security Features

- **JWT Authentication**: Secure token-based authentication system
- **Brute Force Protection**: Account locks after 5 failed attempts
- **Rate Limiting**: Prevents excessive requests to API endpoints
- **Password Hashing**: Uses bcrypt for secure password storage
- **Helmet.js**: Secures Express apps by setting HTTP headers
- **CORS Protection**: Configured Cross-Origin Resource Sharing

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

Distributed under the MIT License. See `LICENSE` file for more information.

## Contact

Angelo Morales - [@TheRealAngelo](https://github.com/TheRealAngelo)

Project Link: [https://github.com/TheRealAngelo/Cyber-Secure](https://github.com/TheRealAngelo/Cyber-Secure)