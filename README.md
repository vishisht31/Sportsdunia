# College Placement API

## Overview

This project is a backend application built using NestJS and PostgreSQL. It manages college-related data, including information about colleges, their placements, courses, cities, and states. The API allows users to retrieve data on college placements, courses, and filter colleges based on city and state. Additionally, it includes JWT-based authentication to secure endpoints.

## Features

- **JWT Authentication**: Secure API with login and signup functionality.
- **College Data**: Fetch placement data with calculations like averages for each year.
- **Placement Trend**: Calculate and return placement trends comparing the placement rate for the last two years.
- **College Courses**: Get the list of courses offered by a college, sorted by course fee.
- **City and State Filter**: Filter colleges by city or state.
- **Swagger Documentation**: Automatically generated API documentation for easy testing and usage.

## Technologies

- **NestJS**: A progressive Node.js framework for building efficient and scalable server-side applications.
- **PostgreSQL**: A powerful, open-source relational database system.
- **TypeORM**: An ORM for TypeScript and JavaScript that helps with database operations.
- **JWT**: JSON Web Tokens for secure authentication.
- **Swagger**: API documentation and testing interface.

## Prerequisites

Before you begin, ensure you have the following installed:

- Node.js (version 14 or higher)
- PostgreSQL
- TypeORM

## Installation

1. Clone the repository:

```bash
git clone https://github.com/vishisht31/Sportsdunia.git
```

2. Install the dependencies:

```bash
cd Sportsdunia
npm install
```

3. Setting up the PostgreSQL database:

Make sure PostgreSQL is installed and running. Create a database and configure the connection in `src/app.module.ts/` in the imports section.

Example:
```json
{
  "type": "postgres",
  "host": "localhost",
  "port": 5432,
  "username": "your-username",
  "password": "your-password",
  "database": "college_placement",
  "entities": ["src/entities/*.ts"],
  "synchronize": true
}
```

4. Start the development server
```bash
npm run start:dev
```
This will start the development server and create the required tables in PostgreSQL.

5. Seed the database:
Configure the connection in `seed.ts` the same way as did in the `src/app.module.ts/` and run the following command:
```bash
npx ts-node seed.ts
```

This will seed the database with realistic dummy data


## Authentication

### JWT Authentication

The APIs use JWT for authentication. To access the secured endpoints, you'll need to:

1. **Signup** to register yourself:
```bash
POST /auth/signup
```

Request Body:
```json
{
  "name": "your name",
  "email": "user@example.com",
  "password": "password"
}
```

2. **Login** to get the JWT token:

```bash
POST /auth/login
```

Example Request:
```json
{
  "email": "user@example.com",
  "password": "password"
}
```

Response:
```json
{
  "message": "Login Successfull",
  "access_token": "your-jwt-access-token"
}
```

3. **Access Secured Endpoints**: Use the JWT token in the `Authorization` header for subsequent requests:

```bash
Authorization: Bearer ${your-jwt-access-token}
```

## Running the Application

To run the application in development mode:

```bash
npm run start:dev
```

This will start the server on `http://localhost:3000`.

## Testing with Postman

A Postman collection is provided in the `SportsDunia.postman_collection.json` file to help you test the endpoints.

## Deployment

My created Database and Backend application are both hosted on render

```bash
https://sportsdunia.onrender.com/
```

### Swagger Documentation

The Swagger UI will be available at:

```
http://localhost:3000/api
```
