const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const bodyParser = require('body-parser');
const cors = require('cors');

const users = require('./routes/api/users');
const todos = require('./routes/api/todos');

const app = express();

app.use(bodyParser.json());
app.use(cors());

mongoose.connect("mongodb://localhost:27017/todoapp", { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true });

const connection = mongoose.connection;

connection.once('open', () => {
    console.log("MongoDB database connection established successfully");
});

// Passport Middleware
app.use(passport.initialize());

// Passport config
require("./config/passport")(passport);

// Routes
app.use("/", todos);
app.use("/users", users);

app.listen(5000, () => {
    console.log("Server started on port 5000");
});