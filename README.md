# Nuvia — Backend

Nuvia is a social network in the spirit of X (formerly Twitter), where users can share posts with images, comment on posts, like them, and interact with other people's profiles. Built as a university project to practice designing and building a complete REST API for a real-world social platform.

**Live demo (frontend):** [https://nuvia-coral.vercel.app/](https://nuvia-coral.vercel.app/)

This repository contains the **backend** of Nuvia: a REST API built with NestJS, consumed by the [Angular frontend](#).

## Features

- User registration and login
- JWT-based authentication
- Role-based access control (roles & permissions)
- Posts (create, read)
- Likes
- Comments
- Feed
- User profiles
- Image upload and storage via Cloudinary
- Basic statistics

There are currently no additional features planned for this project.

## Tech Stack

- **NestJS 11** — application framework
- **MongoDB** — database
- **Mongoose** — ODM for MongoDB
- **JWT** — authentication, enforced through custom Guards
- **Cloudinary** — image storage

## Project Structure

The API is organized into the following modules:

- **Authentication** — login, registration, JWT issuing/validation
- **Usuarios** (Users) — user profiles and user-related operations
- **Publicaciones** (Posts) — posts, likes and comments
- **Cloudinary** — image upload and storage integration
- **Estadisticas** (Statistics) — basic app/usage statistics
- **Guards** — route protection and role/permission checks
- **Schemas** — Mongoose schemas/models

## Getting Started

### Prerequisites

- Node.js and npm installed
- A MongoDB instance (local or remote) — **no Docker setup is required**, MongoDB is not spun up via Docker in this project
- A Cloudinary account (for image storage)

### Environment Variables

Create a `.env` file in the project root with the following variables:

```env
JWT_SECRET=your_jwt_secret
MONGODB_URI=your_mongodb_connection_string
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

### Installation

```bash
npm install
```

### Run the development server

```bash
npm run start:dev
```

> API documentation via Swagger is not currently available for this project. There are no WebSocket-based features implemented.

## License

This project is free to use without restrictions.

## Author

**Federico Frediani Baldi**
