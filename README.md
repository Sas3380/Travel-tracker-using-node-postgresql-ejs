# Travel-tracker-using-node-postgresql-ejs

Getting Started
Prerequisites
1.  Before running the application, ensure you have the following installed on your machine:
    
    Node.js: A JavaScript runtime for executing code server-side.
    PostgreSQL: A powerful, open-source object-relational database system

2. Clone the repo
    git clone https://github.com/your-username/travel-tracker.git
    cd travel-tracker

3. Install Dependencies: Navigate to the project directory and install the required Node.js packages:
    npm I

4. Set Up the Database: Make sure your PostgreSQL server is running. Create a new database and set up the required tables:
    CREATE DATABASE world;
    CREATE TABLE countries (
        id SERIAL PRIMARY KEY,
        country_name VARCHAR(255) UNIQUE NOT NULL,
        country_code VARCHAR(3) UNIQUE NOT NULL
    );
    
    CREATE TABLE visited_countries (
        id SERIAL PRIMARY KEY,
        country_code VARCHAR(3) REFERENCES countries(country_code) ON DELETE CASCADE
    );

5. Configure Environment Variables: Create a .env file in the root directory of your project and add your PostgreSQL configuration:
    DB_USER=your_db_user
    DB_HOST=localhost
    DB_NAME=travel_tracker
    DB_PASSWORD=your_db_password
    DB_PORT=5432
6. Then run this using npx nodemon 
