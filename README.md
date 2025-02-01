# FileUploader 
In the WebApps course I have to develop a fullstack web application. As requirements the WebApp should be developed in the frontend with ReactJS, Semantic UI, MOBX, Webpack and Babel, and in the backend with NodeJS, Express (REST) and Sequelize.

## Getting Started
These instructions will get you a copy of the project up and running on your local machine.

### Prerequisites
- git to clone the repository (alternatively, the project can be downloaded and unzipped)
- npm to manage the dependencies and run the application in development mode or create a production build
- PostgreSQL to store the data of the webapp

### Installing and Running

1. Clone git repository to your local machine.
2. Open the root directory with the IDE of your choice.
3. Start the PostgreSQL database. You can use docker to easily start the database: `docker run --name postgres -e POSTGRES_PASSWORD=123456 -p 5432:5432 -d postgres`.
You have to create a database named fileuploader. With docker execute the following commands: `docker exec -it postgres /bin/bash`, `su postgres`, `psql`, `CREATE DATABASE fileuploader`. You can modify the properties of the database in the file `/api/.env`.
4. Open a new terminal in the api subdirectory.
5. Install the required dependencies of the api with `npm install`.
6. Start the api server with `npm start`. The api server becomes available on port 3000.
7. Open a new terminal in the client subdirectory.
8. Install the required dependencies of the client with `npm install`.
9. Start the client with `npm run dev-server`. The webapp becomes available on port 8080.

## What I have learned
- Building a fullstack single page web application with ReactJS and NodeJS
- Creating a RESTful service using Express
- Accessing a database with Sequelize
- Storing environmental variables with dotenv
- Hashing passwords with bcryptjs
- Using jsonwebtoken to authenticate users
- Using multer to receive and handle multipart/form-data requests
- Bundling the webapp with webpack and running the webapp in dev mode with webpack-dev-server
- Using babel for compiling and using JSX syntax
- Using semantic ui to easily design the ui
- Using mobx for state management to implement the observer pattern when requesting the api server
- Storing cookies in the webbrowser
- Using react-helmet to modify the header files of the html document
- Using react-router to route between mutliple pages with links
