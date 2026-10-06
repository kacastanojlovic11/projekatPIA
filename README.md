# projekatPIA

Full-stack web application that connects clients with printing companies and supports product browsing, customized print orders, online payments, order management, and public procurement.

The application was developed using **Angular** on the frontend and **Node.js, Express, TypeScript, and MongoDB** on the backend.

## Features

### User accounts

The application supports several types of users:

- individual clients
- business clients
- printing companies
- administrators

Users can register, log in, manage their profile information, upload a profile picture, and use the password reset functionality.

New user registrations can be reviewed and approved or rejected by an administrator.

### Product catalog

Users can browse and search available products offered by different printing companies.

Each product can contain information such as:

- product name and description
- category and subcategory
- price
- available quantity
- available colors
- main and additional images
- available printing services and their additional costs

Product pages also display user feedback and product reactions.

### Product management

Printing companies can manage their own products.

Products can be:

- added individually
- imported from a JSON file
- assigned a main image and additional images
- configured with available colors and printing options
- tracked by available stock quantity

### Customized printing

Clients can prepare products for printing by selecting available product options.

Order items can contain additional information such as:

- selected color
- printing type
- custom text
- an uploaded image for printing
- quantity

Prepared products can then be added to the shopping cart.

### Orders

Clients can create and manage orders, while printing companies can view orders placed with them and update their status.

The application supports different order states, including:

- ordered
- paid
- in printing
- delivered
- received

Clients can also access their previous orders.

### Online payments

The application integrates **Stripe Checkout** for online payment processing.

After successful payment verification, the corresponding orders are automatically marked as paid.

### Reviews and feedback

Clients can leave feedback for products they have received.

Feedback supports:

- like or dislike reactions
- written comments

The latest comments can be displayed on the product details page.

### Public procurement

Business clients can create public procurement requests for products.

Printing companies can view active procurements and submit offers for the requested products.

The system supports:

- creating procurement requests
- submitting offers
- checking product availability
- selecting an eligible offer
- creating an order from the selected offer
- generating PDF procurement reports

### Administration

Administrators can manage different parts of the application, including:

- reviewing new user registrations
- viewing and managing users
- managing product categories and subcategories
- viewing application statistics

The administration section includes statistics related to printing companies, frequently ordered products, and product feedback.

## Technologies

### Frontend

- Angular
- TypeScript
- HTML
- CSS
- Angular Router
- Angular Forms
- RxJS
- Chart.js

### Backend

- Node.js
- Express
- TypeScript
- MongoDB
- Mongoose

### Additional libraries and services

- Multer — file and image uploads
- Stripe — online payments
- PDFKit — PDF generation
- Nodemailer — email functionality
- bcryptjs — password hashing

## Project structure

```text
projekatPIA/
│
├── backend_Node/
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   └── server.ts
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   └── app/
│   └── package.json
│
└── .gitignore
```

## Running the project

### Prerequisites

To run the application locally, you need:

- Node.js
- npm
- MongoDB

MongoDB is expected to be available locally on:

```text
mongodb://127.0.0.1:27017/projekatPIA
```

### Backend

Navigate to the backend directory:

```bash
cd backend_Node
```

Install dependencies:

```bash
npm install
```

Build the TypeScript project:

```bash
npm run build
```

Start the server:

```bash
npm start
```

The backend runs on:

```text
http://localhost:4000
```

Some integrations require their corresponding environment variables to be configured. For example, Stripe payment functionality uses `STRIPE_SECRET_KEY`.

### Frontend

Navigate to the frontend directory:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start the Angular development server:

```bash
npm start
```

The application is then available at:

```text
http://localhost:4200
```

## Author

**Katarina Stanojlović**
