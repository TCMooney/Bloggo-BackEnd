const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');

dotenv.config({ path: './configuration/config.env' });

const app = express();

app.use(cors({
    origin: process.env.FRONT_END_URL,
    credentials: true
}));
app.use(cookieParser());

app.use(express.json());

const mongoUri = process.env.MONGO_URI.toString();

//Connect to Mongo
mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
})
    .then(() => console.log('DB Connected'))
    .catch(err => console.log(err));

//Use Routes`
app.use('/api/users', require('./routes/api/users'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/blogPost', require('./routes/api/blogPost'));

const port = process.env.PORT || 4000;

app.listen(port, () => console.log(`Server started on port ${port}`));