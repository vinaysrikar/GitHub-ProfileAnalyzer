CREATE DATABASE IF NOT EXISTS github_analyzer;

USE github_analyzer;

CREATE TABLE IF NOT EXISTS Profiles (
  id           INT AUTO_INCREMENT PRIMARY KEY,
  username     VARCHAR(100) NOT NULL UNIQUE,
  name         VARCHAR(200),
  avatar_url   VARCHAR(500),
  bio          TEXT,
  followers    INT DEFAULT 0,
  following    INT DEFAULT 0,
  public_repos INT DEFAULT 0,
  total_stars  INT DEFAULT 0,
  top_language VARCHAR(100),
  analyzed_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);