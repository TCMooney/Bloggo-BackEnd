const express = require('express');
const mongoose = require('mongoose');
const config = require('config');
const cors = require('cors');

const app = express();

app.use(cors());

//BodyParser Middleware
app.use(express.json());

//DB Config
const db = config.get('mongoURI');

//Connect to Mongo
mongoose.connect(db, { 
    useNewUrlParser: true,
     useUnifiedTopology: true, 
     useCreateIndex:true })
    .then(() => console.log('DB Connected'))
    .catch(err => console.log(err)); 

//Use Routes`
app.use('/api/users', require('./routes/api/users'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/blogPost', require('./routes/api/blogPost'));

const port = process.env.PORT || 4000;

app.listen(port, () => console.log(`Server started on port ${port}`));