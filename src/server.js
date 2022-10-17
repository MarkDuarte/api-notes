require('express-async-errors');
const migrationsRun = require('./database/sqlite/migrations');
const express = require('express');

const routes = require('./routes');
const AppError = require('./utils/AppError');

const app = express();
app.use(express.json());

migrationsRun();

app.use(routes);

app.use(( error, request, response, next) => {
  if (error instanceof AppError) {
    return response.status(error.statusCode).json({
      status: 'error',
      message: error.message
    });
  }

  console.error(error);

  return response.status(500).json({
    status: 500,
    message: 'Internal server error',
  });
})

const port = 3333;
app.listen(port, () => console.log(`Server is running on Port ${port}`))