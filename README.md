# Internal Academic Resource & Notes Exchange System

A centralized web platform for students, faculty, and admins to upload, verify, and access academic resources (notes, PDFs, past papers).

## Team Members
- Bhimansh – 23103032
- Beerkanwar – 23103030

## Tech Stack
- **Frontend**: React (Vite) + Tailwind CSS
- **Backend**: Node.js + Express
- **Database**: PostgreSQL (Raw SQL)
- **Auth**: JWT (role-based)

## Project Setup

### Environment Variables
Create a `.env` file in the `/backend` directory based on `/backend/.env.example`.

### Running Locally
1. Start PostgreSQL server.
2. `cd backend`
3. `npm install`
4. `npm run migrate` (Initializes PostgreSQL schema)
5. `npm run dev`
6. `cd ../frontend`
7. `npm install`
8. `npm run dev`
