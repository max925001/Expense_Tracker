Expense Tracker Application
A full-stack web application for tracking income and expenses, featuring user authentication, transaction management, filtering, and data visualization with pie charts.
Test User Credentials
To test the application without registering, use the following credentials:

Email: shivam1@gmail.com
Password: 12345678

Deployed Application
[Live Link](https://expense-tracker-9rs4.vercel.app)

Demo Video
[Watch Video](https://drive.google.com/file/d/1LcPbqubcbfd81KxV5S34P_SKCUY8s1kk/view?usp=sharing)

Setup Instructions
Follow these steps to run the application locally.
Prerequisites

Node.js: v16 or higher
MongoDB: Local or cloud instance (e.g., MongoDB Atlas)
Cloudinary Account: For image uploads (optional, depending on features used)
Git: For cloning the repository

Steps

Clone the Repository
[git clone https://github.com/your-repo/expense-tracker.git](https://github.com/max925001/Expense_Tracker.git)
cd expense-tracker


Install Dependencies

Backend:cd backend
npm install


Frontend:cd ../frontend
npm install




Set Up Environment VariablesCreate a .env file in the backend directory with the following:
NODE_ENV=development
PORT=5001
MONGO_URI=<your-mongo-uri>
JWT_SECRET=<your-jwt-secret>
JWT_EXPIRY=7d
FRONTEND_URL=http://localhost:5173
CLOUDINARY_CLOUD_NAME=<your-cloudinary-cloud-name>
CLOUDINARY_API_KEY=<your-cloudinary-api-key>
CLOUDINARY_API_SECRET=<your-cloudinary-api-secret>


Replace <your-mongo-uri> with your MongoDB connection string (e.g., mongodb://localhost:27017/expense-tracker or MongoDB Atlas URI).
Replace <your-jwt-secret> with a secure random string (e.g., mySecretKey123).
Replace Cloudinary variables with your Cloudinary credentials (obtain from Cloudinary Dashboard).


Run the Application

Backend:cd backend
npm run dev

This starts the server on http://localhost:5001 (uses nodemon for development).
Frontend:cd frontend
npm run dev

This starts the React app on http://localhost:5173 (default Vite port).


Access the Application

Open http://localhost:5173 in your browser.
Log in with the test credentials (shivam1@gmail.com, 12345678) or register a new user.


Test API EndpointsUse tools like Postman or curl to test backend APIs (see API Endpoints below).Example:
curl -X GET http://localhost:5001/api/expenses -H "Authorization: Bearer <your-jwt-token>"



Technologies Used



Technology
Purpose
Reason for Choice



React
Frontend framework
Component-based architecture, fast rendering with virtual DOM, and rich ecosystem for UI development.


React Router
Client-side routing
Seamless navigation between pages (e.g., Dashboard, Transactions, Analysis) without full page reloads.


Redux Toolkit
State management
Simplifies state management for transactions, totals, and user data with predictable state updates.


Chart.js
Data visualization
Lightweight, customizable library for creating pie charts to visualize income/expense by category.


React Hot Toast
Notifications
Easy-to-use toast notifications for success/error feedback (e.g., transaction added/deleted).


React Icons
Icons
Provides scalable, customizable icons (e.g., FaEdit, FaTrash) for intuitive UI.


Node.js/Express
Backend server
Fast, scalable, and JavaScript-based for full-stack consistency.


MongoDB/Mongoose
Database
NoSQL database for flexible schema, with Mongoose for easy data modeling and validation.


JWT
Authentication
Secure token-based authentication for protecting routes and user sessions.


Cloudinary
Image storage
Optional for user profile images or transaction-related uploads, with easy integration.


Tailwind CSS
Styling
Utility-first CSS for rapid, responsive UI development with consistent green-white theme.


Vite
Frontend build tool
Faster development server and build times compared to Create React App.


Why These Technologies?

Full-Stack JavaScript: Using JavaScript (React, Node.js) for both frontend and backend ensures developer familiarity and code reuse.
Scalability: MongoDB and Express handle growing transaction data efficiently.
User Experience: React, Tailwind CSS, and Chart.js provide a responsive, visually appealing interface with clear data insights.
Security: JWT ensures secure user authentication, and Cloudinary offloads image storage securely.

ER Diagram
The application uses two main models: User and Expense. Below is a text-based representation of the Entity-Relationship (ER) diagram.
Entities:
+-------------+                  +-------------+
|    User     |                  |   Expense   |
+-------------+                  +-------------+
| _id         |◄──1:N──┐        | _id         |
| name        |         └──────►| userId      |
| email       |                  | type        |
| password    |                  | description |
| createdAt   |                  | category    |
| updatedAt   |                  | date        |
+-------------+                  | amount      |
                                 | createdAt   |
                                 | updatedAt   |
                                 +-------------+

Relationships:
- One User has many Expenses (1:N).
- Expense.userId references User._id.

Fields:

User:
_id: ObjectId (primary key)
name: String, required
email: String, required, unique
password: String, required
createdAt: Date, auto-generated
updatedAt: Date, auto-generated


Expense:
_id: ObjectId (primary key)
userId: ObjectId, references User._id, required
type: String, enum [Income, Expense], required
description: String, required
category: String, required
date: Date, required
amount: Number, required, >= 0
createdAt: Date, auto-generated
updatedAt: Date, auto-generated



API Endpoints



HTTP Method
Route
Purpose



POST
/api/auth/register
Register a new user (name, email, password).


POST
/api/auth/login
Log in a user and return JWT token.


POST
/api/expenses
Add a new transaction (income or expense).


GET
/api/expenses
Get all transactions for the authenticated user, sorted by updatedAt.


GET
/api/expenses/filter
Filter transactions by category, amount, date range, sorted by updatedAt.


GET
/api/expenses/totals
Get total income, expenses, and balance.


GET
/api/expenses/:id
Get a transaction by ID.


PUT
/api/expenses/:id
Update a transaction by ID.


DELETE
/api/expenses/:id
Delete a transaction by ID.


Authentication:

All /api/expenses/* endpoints require a JWT token in the Authorization header: Bearer <token>.

Example Request (Get all transactions):
curl -X GET http://localhost:5001/api/expenses -H "Authorization: Bearer <your-jwt-token>"

Troubleshooting

MongoDB Connection: Ensure MONGO_URI is correct. Test with mongo <your-mongo-uri> or MongoDB Compass.
JWT Errors: Verify JWT_SECRET matches between server and token generation. Clear browser cookies if token issues persist.
CORS Issues: Confirm FRONTEND_URL is set to http://localhost:5173 in development.
Empty Transactions: Check MongoDB (db.expenses.find({ userId: ObjectId("<userId>") })) and ensure user is authenticated.
Chart.js Issues: Ensure chart.js and react-chartjs-2 are installed (npm install chart.js react-chartjs-2).
Logs: Check browser console and server logs (backend/server.js) for errors.

Contributing

Fork the repository.
Create a feature branch (git checkout -b feature/new-feature).
Commit changes (git commit -m "Add new feature").
Push to the branch (git push origin feature/new-feature).
Open a pull request.

License
MIT License. See LICENSE for details.
