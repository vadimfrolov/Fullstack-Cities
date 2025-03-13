# Fullstack Cities

A comprehensive web application that displays information about cities around the world.

## Project Overview

Fullstack Cities is a full-stack web application that provides detailed information about various cities.

## Project Structure

- **app-cities-frontend**: React-based frontend application
- **app-cities-backend**: Backend API service
- **mysql-db**: Database service for storing city information
- **proxy**: Nginx

## Features

- Display list of cities with detailed information
- View city population data with proper formatting
- Browse famous landmarks for each city
- Responsive design for all device sizes

## Technologies Used

### Frontend
- React
- TypeScript
- Vitest for testing
- React Testing Library

### Backend
- Nestjs

### Database
- MySQL

### Infrastructure
- Docker
- Nginx

## Getting Started

### Prerequisites

- Node.js (v14 or newer) - for development
- npm or yarn package manager - for development
- Docker - for running the application

### Running the Application

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/Fullstack-Cities.git
   cd Fullstack-Cities
   ```

1. Start both frontend and backend services using Docker Compose:
   ```
   docker-compose up -d
   ```

1. Access the application at [http://localhost:5173/](http://localhost:5173/)

1. To stop the application:
   ```
   docker-compose down
   ```

## Testing

### Frontend Tests

Run the frontend test suite with:

```
cd app-cities-frontend
npm i
npm test
```

To run tests with coverage report:

```
cd app-cities-frontend
npm i
npm test -- --coverage
```

### Backend Tests

Run the backend test suite with:

```
cd app-cities-backend
npm test
```

For coverage reporting:

```
cd app-cities-backend
npm run test:cov
```

## API Documentation

The application interacts with a cities API that provides endpoints for:

- Fetching all cities
