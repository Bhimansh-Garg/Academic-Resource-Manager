-- users table
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role VARCHAR(20) CHECK (role IN ('student', 'faculty', 'admin')) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- departments table
CREATE TABLE departments (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL
);

-- subjects table
CREATE TABLE subjects (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  semester INT NOT NULL,
  department_id INT REFERENCES departments(id)
);

-- resources table
CREATE TABLE resources (
  id SERIAL PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  file_url TEXT NOT NULL,
  subject_id INT REFERENCES subjects(id),
  uploaded_by INT REFERENCES users(id),
  verification_status VARCHAR(20) DEFAULT 'pending' CHECK (verification_status IN ('pending', 'approved', 'rejected')),
  version INT DEFAULT 1,
  download_count INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

-- verifications table
CREATE TABLE verifications (
  id SERIAL PRIMARY KEY,
  resource_id INT REFERENCES resources(id),
  faculty_id INT REFERENCES users(id),
  action VARCHAR(20) CHECK (action IN ('approved', 'rejected')),
  verified_at TIMESTAMP DEFAULT NOW()
);
