# Freshroots

Freshroots is a farm-to-home marketplace that connects local farmers directly with customers. Farmers can publish fresh produce, customers can browse and order products, and administrators can manage the marketplace.

## Benefits

- **For customers:** Discover fresh local produce, view farmer information, add products to a cart, and place orders online.
- **For farmers:** Add and manage harvest listings, set prices and stock, upload product images, and track incoming orders.
- **For administrators:** View marketplace activity and manage products, users, and orders from one dashboard.
- **For the community:** Supports local growers, improves price transparency, and reduces unnecessary middlemen.

## Technology

- **Frontend:** React, TypeScript, Vite, Tailwind CSS
- **Backend:** Java 17, Spring Boot, Spring Data JPA, Spring Security, JWT
- **Database:** MySQL

## Project Structure

```text
Fresh_Root/
├── freshroots-backend/   Spring Boot REST API
├── freshroots-frontend/  React web application
└── README.md
```

## Prerequisites

Install the following before running the project:

- Java 17 or newer
- Maven
- Node.js and npm
- MySQL Server

## Configuration

1. Create or use a MySQL user and make sure MySQL is running.
2. Open `freshroots-backend/src/main/resources/application.properties`.
3. Update the database URL, username, password, JWT secret, and other values for your computer.
4. Do not publish real database passwords, JWT secrets, or other credentials to GitHub. Use environment variables or a private local configuration for shared deployments.

The default local API URL is:

```text
http://localhost:8080/api
```

## Run the Backend

Open a terminal in the project root and run:

```bash
cd freshroots-backend
mvn spring-boot:run
```

The backend starts on `http://localhost:8080`.

## Run the Frontend

Open a second terminal in the project root and run:

```bash
cd freshroots-frontend
npm install
npm run dev
```

Open the website at:

```text
http://localhost:3000
```

## Build and Validate

Frontend production build:

```bash
cd freshroots-frontend
npm run build
```

Frontend TypeScript check:

```bash
cd freshroots-frontend
npm run lint
```

Backend tests and compilation:

```bash
cd freshroots-backend
mvn test
```

## How to Use the Website

### Customer

1. Open the marketplace at `http://localhost:3000`.
2. Register or sign in using the customer login.
3. Browse produce or search for a product.
4. Add products to the cart and adjust quantities.
5. Open the cart, enter a delivery address, and place the order.
6. Track placed orders from **My Orders**.

### Farmer

1. Open the farmer login page at `/farmer/login`.
2. Sign in with a farmer account.
3. Open **Add New Harvest** from the farmer dashboard.
4. Choose a preset produce item or enter product details manually.
5. Add the price, unit, stock, category, and optional image URL.
6. Publish the produce and manage listings from the dashboard.
7. Review incoming customer orders and update their status.

Farmer accounts are for selling produce and managing farm orders. The customer cart and checkout controls are hidden for farmer accounts.

### Administrator

1. Open the administrator login page at `/admin/login`.
2. Sign in with an administrator account.
3. Use the admin console to review users, products, and orders.

## Important Notes

- The backend must be running before the frontend can load products, categories, login data, or orders.
- Product image downloads depend on the image URL being reachable by the backend server.
- The application currently expects the backend API at `http://localhost:8080/api`.
- For production use, configure HTTPS, secure secrets, database backups, CORS rules, and proper environment-specific settings.

## License

This project does not currently include a license. Add a license before accepting external contributions or distributing the project publicly.
