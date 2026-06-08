# SmartCafe POS

SmartCafe POS is an AI-assisted Point of Sale (POS) web application for small F&B businesses such as cafés, restaurants, and food stalls.

The system helps staff take customer orders, send orders to the kitchen, track preparation status, collect payments, and view receipts. It also includes an AI-assisted kitchen summary and upsell suggestion to reduce order confusion and support better sales recommendations.

## Tech Stack

### Frontend

* React
* TypeScript
* Vite
* CSS

### Backend

* Java 17
* Spring Boot
* Spring Web
* Spring Data JPA
* MySQL Driver

### Database

* MySQL

## Main Features

* Menu item display
* Cart and quantity management
* Dine-in and takeaway order support
* Special item notes such as "less sugar" or "no peanuts"
* Kitchen Display workflow
* Order status tracking
* Payment method selection: Cash, QR, or Card
* Paid receipt list
* AI Kitchen Summary
* AI Upsell Suggestion
* MySQL data persistence

## Restaurant Workflow

The system separates the POS into three operational views:

1. **POS Counter**

   * Staff selects menu items.
   * Staff adds item notes.
   * Staff chooses dine-in or takeaway.
   * Staff sends the order to the next workflow.

2. **Kitchen Display**

   * Kitchen staff views active orders.
   * Kitchen staff updates order status from NEW to PREPARING to READY.
   * AI Kitchen Summary helps kitchen staff understand the order clearly.

3. **Payments**

   * Staff collects payment using Cash, QR, or Card.
   * Paid orders are recorded as receipts.

## Order Flow

### Dine-in Flow

Dine-in orders are sent to the kitchen first. Payment happens after the order is ready.

```text
NEW → PREPARING → READY → PAID
```

### Takeaway Flow

Takeaway orders require payment first before kitchen preparation.

```text
UNPAID → PAID → PREPARING → READY
```

## AI Feature

The AI-assisted feature generates:

1. **Kitchen Summary**

   * Summarizes the order and special notes clearly for kitchen staff.

2. **Upsell Suggestion**

   * Suggests a relevant add-on item to increase order value.

Example:

```text
AI Kitchen Summary:
Prepare: 2x Nasi Lemak (no peanuts), 1x Iced Latte (less sugar)

AI Upsell Suggestion:
Suggest adding Curry Puff as a snack pairing with the drink.
```

## Project Structure

```text
smartcafe-pos-ai/
├── backend/
│   └── Spring Boot backend API
├── frontend/
│   └── React TypeScript frontend
└── README.md
```

## Backend Setup

Go to the backend folder:

```bash
cd backend
```

Run the Spring Boot backend:

```bash
.\mvnw.cmd spring-boot:run
```

The backend runs on:

```text
http://localhost:8080
```

## Frontend Setup

Go to the frontend folder:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Run the frontend:

```bash
npm run dev
```

The frontend runs on:

```text
http://localhost:5173
```

## Database Setup

Create a MySQL database:

```sql
CREATE DATABASE smartcafe_pos;
```

Update the database configuration in:

```text
backend/src/main/resources/application.properties
```

Example configuration:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/smartcafe_pos?createDatabaseIfNotExist=true
spring.datasource.username=root
spring.datasource.password=YOUR_MYSQL_PASSWORD

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true

server.port=8080
```

Do not commit your real database password to GitHub.

## API Endpoints

### Menu

```text
GET /api/menu
```

Returns the menu items.

### Orders

```text
GET /api/orders
```

Returns all orders.

```text
POST /api/orders
```

Creates a new order.

```text
PATCH /api/orders/{id}/status?status=PREPARING
```

Updates an order status.

```text
POST /api/orders/{id}/payment
```

Marks an order as paid.

## What I Would Build Next

Given more time, I would add:

* Staff login and role-based access
* Real AI API integration using Gemini or OpenAI
* Split bill support
* Inventory tracking
* Low-stock alerts
* Refund and void order handling
* Sales dashboard and daily reports
* Receipt printing
* QR ordering from customer table
* Better mobile optimization

## Tradeoffs

The focus of this project is to deliver a working end-to-end MVP under time constraints. I prioritized the core POS workflow: order taking, kitchen tracking, payment, receipt, database persistence, and AI-assisted order support.

More advanced features such as authentication, inventory, split bills, and analytics are intentionally left as future improvements.
