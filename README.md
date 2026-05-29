# Store Rating App

This is a small full stack project for rating stores. It has three types of users:

- Admin
- Normal user
- Store owner

The backend is made with Express, Prisma and PostgreSQL. The frontend is made with React, TypeScript, Vite and Tailwind CSS.

## Features

- User signup and login
- JWT based authentication
- Role based pages
- Admin dashboard with total users, stores and ratings
- Admin can create users and stores
- Normal users can search stores and submit ratings
- Store owners can see their store rating and users who rated it
- Users can update their password

## Project Structure

```text
backend/   Express API, Prisma schema, database connection
frontend/  React app
```

## Requirements

Install these before running the project:

- Node.js
- npm
- PostgreSQL database URL, for example Neon

## Backend Setup

Go to the backend folder:

```bash
cd backend
```

Install packages:

```bash
npm install
```

Create a `.env` file in the `backend` folder:

```env
PORT=3000
JWT_SECRET=your_secret_key
DATABASE_URL="your_postgres_database_url"
CLIENT_URL="http://localhost:5173"
```

Generate Prisma client:

```bash
npm run prisma:generate
```

Run migration:

```bash
npm run prisma:migrate
```

Start backend:

```bash
npm run dev
```

Backend runs on:

```text
http://localhost:3000
```

## Frontend Setup

Open another terminal and go to the frontend folder:

```bash
cd frontend
```

Install packages:

```bash
npm install
```

Start frontend:

```bash
npm run dev
```

Frontend runs on:

```text
http://localhost:5173
```

## Create Admin User

Add an admin user directly in the database. The password must be a bcrypt hash, not plain text.

Example password:

```text
Admin@123
```

Example SQL:

```sql
INSERT INTO "User" (name, email, password, address, role, "createdAt", "updatedAt")
VALUES (
  'Admin User Account Demo',
  'admin@gmail.com',
  '$2b$10$K69q1n5uKwKwoG0vhyXO7eAW9f7aTlNVNeV4np6n/EYWpW1BLFFIC',
  'Pune Maharashtra',
  'ADMIN',
  NOW(),
  NOW()
);
```

Login:

```text
Email: admin@gmail.com
Password: Admin@123
```

## Normal User Signup Example

```text
Name: Demo Normal User Account
Email: demo1@gmail.com
Address: 123 Test Street, Demo City
Password: Demo@123
```

## Useful Commands

Backend build:

```bash
cd backend
npm run build
```

Frontend build:

```bash
cd frontend
npm run build
```

Open Prisma Studio:

```bash
cd backend
npm run prisma:studio
```


