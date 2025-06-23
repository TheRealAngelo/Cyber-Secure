# Cyber-Secure By TheRealAngelo

A modern, secure authentication API with brute-force protection and an animated user interface.

## Features

- JWT-based authentication with access and refresh tokens
- Account lockout after 5 failed login attempts
- Rate limiting to prevent brute force attacks
- Password hashing with bcrypt
- Modern, animated UI with cybersecurity theme
- Responsive design that works on all devices
- MongoDB integration for user data storage

## Prerequisites

Before running this project, make sure you have the following installed:
- [Node.js](https://nodejs.org/) (v14+)
- [MongoDB](https://www.mongodb.com/try/download/community) (v4+)
- [npm](https://www.npmjs.com/) (v6+)

## Installation

1. Clone the repository or download the source code
   ```bash
   git clone https://github.com/yourusername/Cyber-Secure.git
   cd Cyber-Secure

2. npm install

3. Create a .env file in the root directory with the following content:

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

4. Make sure MongoDB is running

5. run (terminal)
npm run dev
npm start
http://localhost:3000