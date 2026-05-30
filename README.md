# GitHub Profile Analyzer API

A backend service built with Node.js + Express + MySQL
that analyzes GitHub profiles using the GitHub public API.

## 🚀 Features
- Fetch public GitHub profile data by username
- Store insights in MySQL database
- REST API to get all analyzed profiles
- REST API to get single profile data
- Calculates total stars and top language

## 🛠️ Tech Stack
- Node.js
- Express.js
- MySQL2
- Axios
- EJS

## ⚙️ Setup Instructions

### 1. Clone the repository
git clone https://github.com/vinaysrikar/github-profile-analyzer.git
cd github-profile-analyzer

### 2. Install dependencies
npm install

### 3. Setup MySQL Database
- Create database: github_analyzer
- Run schema.sql file in MySQL

### 4. Configure environment
Create a .env file:
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=github_analyzer

### 5. Run the server
nodemon index.js

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | / | Home page |
| POST | /analyze | Analyze GitHub user |
| GET | /profiles | Get all profiles (JSON) |
| GET | /profiles/:username | Get single profile (JSON) |

## 📊 Example API Response

GET /profiles/vinaysrikar
{
  "success": true,
  "data": {
    "username": "vinaysrikar",
    "name": "Vinay Srikar",
    "public_repos": 14,
    "followers": 0,
    "total_stars": 0,
    "top_language": "JavaScript"
  }
}