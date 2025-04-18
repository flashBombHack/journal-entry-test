# Project Setup Instructions

Follow these steps to set up and run the project:

## 1. Install Dependencies

Navigate to the `api` and `frontend` directories and run the following command in each:

```bash
npm install
```

## 2. Set Up the Database

Run the following commands to set up the database:

```bash
createdb <your_database_name>
psql -f db/schema.sql
psql -f db/seed.sql
```

Or you can run the SetupDB script to automatically run the commands for you
NOTE: You can change the default Postgres user in the file (postgres) to your prefered user.

```bash
node db/setupDB.js
```

## 3. Start the API

Navigate to the `api` directory and start the API server:

```bash
node api/index.js
```

## 4. Start the Front-End

Navigate to the `frontend` directory and start the front-end application:

```bash
npm start
```

## 5. Browse the application

Go to your browser browse the app on - http://localhost:3000

You are now ready to use the application!
