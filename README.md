IT is still ongoing project.
---

# Destamerch Website

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node.js](https://img.shields.io/badge/Node.js-v14.17.0-green.svg)
![React](https://img.shields.io/badge/React-v18.2.0-blue.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-v4.6.4-blue.svg)

## Table of Contents

## Project Description

This project is a **Destamerch** website that allows users to create custom designs, which can be printed on various products such as t-shirts, mugs, and posters. The site is built using **React** with **TypeScript** and follows a microfrontend architecture. The backend is powered by **Node.js**, providing a robust API for managing orders, products, and user accounts.

## Features

- User authentication and account management.
- Custom design creation using an interactive editor.
- Product catalog with dynamic filtering and sorting.
- Order management and tracking.
- Integration with third-party payment gateways.
- Responsive design for mobile and desktop users.

## Technologies Used

- **Frontend**: 
  - React
  - TypeScript
  - Microfrontends using Module Federation
- **Backend**:
  - Node.js
  - Express
  - MongoDB (for data storage)
- **Other Tools**:
  - Webpack (for bundling)
  - Docker (for containerization)
  - Jest (for testing)

## Microfrontend Architecture

The application is divided into several microfrontends, each responsible for a specific part of the website, such as:

- **Product Designer**: Handles the design editor and preview.
- **Catalog**: Manages the product listing and filtering.
- **User Dashboard**: Handles user accounts, orders, and profile management.

Each microfrontend is independently deployable, allowing for flexible updates and scaling.

## Installation

### Prerequisites

- **Node.js** (v14.17.0 or higher)
- **npm** or **yarn**
- **Docker** (optional, for containerization)

### Install Dependencies

```bash
# For the main application
npm install

# For each microfrontend
cd packages/microfrontend-name
npm install
```

### Environment Variables

Create a `.env` file in the root directory and add the following:

```env
NODE_ENV=development
PORT=5000
MONGO_URI=your-mongodb-uri
JWT_SECRET=your-secret-key
```

## Usage

Once the application is running, open [http://localhost:5000](http://localhost:8000) in your browser. You can create an account, design custom products, and place orders.

## API Endpoints

### User Authentication

- **POST** `/api/auth/register`: Register a new user.
- **POST** `/api/auth/login`: Log in an existing user.

### Products

- **GET**  Retrieve a list of products.
- **POST** Add a new product (admin only).

### Orders

- **GET**  Retrieve a list of orders for the logged-in user.
- **POST** Place a new order.

_For a complete list of API endpoints, refer to the [API Documentation](link-to-api-docs)._


Feel free to adjust the sections according to your project's specifics.
