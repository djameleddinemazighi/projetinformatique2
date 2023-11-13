var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser = require('body-parser')
const cors = require('cors');
const apiRoutes = require('./routes/api');
const sequelize = require('./config/database'); // Import Sequelize instance
var db = require('./models/index');

const app = express();

const corsOptions = {
  origin: 'http://localhost:8080', // Replace with the URL of your Vue.js frontend
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true, // Enable passing of cookies, if your app uses them
};

app.use(cors(corsOptions));
app.use(bodyParser({limit: '50mb'}));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//console.log(db)

db.sequelize.authenticate() // Test the database connection
  .then(() => {
    console.log('Database connected.');
  })
  .catch(err => {
    console.error('Database connection error:', err);
  });


app.use('/api', apiRoutes);



module.exports = app;
