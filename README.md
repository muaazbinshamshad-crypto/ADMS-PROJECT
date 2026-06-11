# CareerSync Placement Portal

This is a beginner-friendly university demo project for an Advanced Database Management Systems course.

## Project Features

- Student registration and login
- Admin registration and login
- JWT authentication
- bcrypt password hashing
- Student profile creation and update
- Company creation by admin
- Student application submission
- Admin application status update
- MongoDB collections: users, students, companies, applications
- MongoDB aggregation report to show join-like functionality

## Folder Structure

```txt
careersync_project
├── backend
│   ├── models
│   ├── routes
│   ├── middleware
│   ├── server.js
│   ├── seed.js
│   ├── .env
│   └── package.json
└── frontend
    ├── login.html
    ├── register.html
    ├── student.html
    ├── admin.html
    └── style.css
```

## Requirements

Install these first:

1. Node.js
2. MongoDB Community Server OR MongoDB Atlas
3. MongoDB Compass
4. VS Code
5. Live Server extension in VS Code

## How to Run Backend

Open terminal in the backend folder:

```bash
cd backend
npm install
npm run seed
npm run dev
```

Backend will run on:

```txt
http://localhost:5000
```

## Demo Login Details

After running `npm run seed`, use these accounts:

```txt
Admin:
Email: admin@gmail.com
Password: 123456

Student:
Email: student@gmail.com
Password: 123456
```

## How to Run Frontend

Open `frontend/login.html` with VS Code Live Server.

Then login using the demo accounts.

## Demo Flow for University

1. Start MongoDB.
2. Run backend with `npm run dev`.
3. Open frontend login page.
4. Login as admin.
5. Add a company.
6. Login as student.
7. Create/update student profile.
8. Load companies.
9. Apply to a company.
10. Login as admin again.
11. Load applications.
12. Update status to Shortlisted or Accepted.
13. Open student dashboard again and show updated status.
14. In admin dashboard, load aggregation report to show MongoDB join-like query.

## Important ADBMS Concepts Covered

- Entity relationship modeling
- CRUD operations
- Authentication database
- Role-based access control
- MongoDB aggregation pipeline / lookup style joins
- Document-oriented NoSQL database model
