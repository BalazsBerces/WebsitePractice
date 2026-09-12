# Cinema Booking Application

A full-stack cinema management and booking application built with **Spring Boot**, **React**, **MySQL**, and **Docker**.

The project is designed to practice full-stack development, REST API design, database relationships, and communication between a React frontend and a Spring Boot backend.

## Features

### Movies
- View all movies
- Add new movies
- Update existing movies
- Delete movies

### Rooms
- View cinema rooms
- Add new rooms
- Update rooms
- Delete rooms
- Store room capacity

### Screenings
- Create screenings
- Assign a movie to a screening
- Assign a room to a screening
- Set screening date and time
- View available screenings
- Update existing screenings
- Delete screenings

### Bookings
- Book tickets for a screening
- View all bookings
- Update an existing booking
- Delete a booking
- Seat capacity is validated against the room's capacity, preventing overbooking

### Frontend
- React-based user interface
- Navigation between Movies, Rooms, Screenings and Bookings
- Forms for creating new data
- Edit and delete actions on every entity
- Data is loaded directly from the Spring Boot REST API

## Planned Features

- Form validation on all entities (currently only movie titles are validated)
- Replace prompt-based editing with inline edit forms
- Improved frontend design
- User authentication

## Technologies

### Backend

- Java
- Spring Boot
- Spring Web
- Spring Data JPA
- Hibernate
- Maven

### Frontend

- React
- Vite
- JavaScript
- HTML
- CSS
- Fetch API

### Database

- MySQL
- Docker
- Docker Compose

## Architecture

The application follows a layered backend architecture:

```text
React Frontend
      |
      | HTTP / JSON
      v
Spring Boot REST API
      |
      v
Controller
      |
      v
Service
      |
      v
Repository
      |
      v
Spring Data JPA / Hibernate
      |
      v
MySQL
```

The React frontend and Spring Boot backend run as separate applications.

```text
React:       localhost:5173
Spring Boot: localhost:8080
MySQL:       localhost:3306
```

## Database Model

The main entities currently used by the application are:

```text
Movie
  |
  | 1 : N
  v
Screening  <---- N : 1 ---- Booking
  |
  | N : 1
  v
Room
```

A screening connects a movie with a cinema room and a specific date and time.
A booking connects a customer's ticket purchase to a single screening.

Example:

```text
Movie: Alien
Room: Room 1
Start time: 2026-09-10 18:30
```

## Example REST Endpoints

### Movies

```http
GET /movies
GET /movies/{id}
POST /movies
PUT /movies/{id}
DELETE /movies/{id}
```

Example request:

```json
{
  "title": "Alien"
}
```

### Rooms

```http
GET /rooms
GET /rooms/{id}
POST /rooms
PUT /rooms/{id}
DELETE /rooms/{id}
```

Example request:

```json
{
  "name": "Room 1",
  "capacity": 100
}
```

### Screenings

```http
GET /screenings
GET /screenings/{id}
POST /screenings
PUT /screenings/{id}
DELETE /screenings/{id}
```

Example request:

```json
{
  "movieId": 1,
  "roomId": 1,
  "startTime": "2026-09-10T18:30:00"
}
```

### Bookings

```http
GET /bookings
POST /bookings
PUT /bookings/{id}
DELETE /bookings/{id}
```

Example request:

```json
{
  "screeningId": 1,
  "customerName": "Jane Doe",
  "ticketCount": 2
}
```

A booking is rejected with `409 Conflict` if the requested ticket count would exceed the screening's room capacity.

## Running the Application

### Requirements

Make sure the following are installed:

- Java
- Node.js
- Docker Desktop
- Git

## 1. Start MySQL

Start Docker Desktop.

From the project root:

```bash
docker compose up -d
```

Check that the MySQL container is running:

```bash
docker compose ps
```

## 2. Start the Spring Boot Backend

Run the Spring Boot application from IntelliJ IDEA or use the Maven wrapper.

Windows:

```bash
./mvnw.cmd spring-boot:run
```

The backend will run at:

```text
http://localhost:8080
```

## 3. Start the React Frontend

Open the frontend directory:

```bash
cd Frontend
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

The frontend will be available at:

```text
http://localhost:5173
```

## Docker Database Configuration

The MySQL database is started using Docker Compose.

The Spring Boot application connects to the database through JDBC:

```text
Spring Boot
     |
     v
localhost:3306
     |
     v
Docker
     |
     v
MySQL
```

A Docker volume is used to keep the database data between container restarts.

## Project Structure

```text
project/
│
├── src/
│   └── main/
│       ├── java/
│       │   └── ...
│       │       ├── controller/
│       │       ├── dto/
│       │       ├── model/
│       │       ├── repository/
│       │       ├── service/
│       │       └── config/
│       │
│       └── resources/
│           └── application.properties
│
├── Frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   └── App.css
│   └── package.json
│
├── compose.yaml
├── pom.xml
└── README.md
```

## Purpose

This project was created as a learning project to practice:

- Java and Spring Boot development
- REST API design
- CRUD operations
- JPA entity relationships
- MySQL database integration
- Docker-based development environments
- React frontend development
- Frontend/backend communication using HTTP and JSON

## Status

The project is currently under development.

Current focus:

- Movie management
- Cinema room management
- Screening management
- Ticket booking with seat capacity validation
- React frontend integration, including edit/delete for every entity

Future development will focus on request validation, a friendlier editing UI, and authentication.
