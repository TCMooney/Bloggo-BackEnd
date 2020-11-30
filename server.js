const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const session = require('express-session');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');

dotenv.config({ path: './configuration/config.env' });

const app = express();

app.use(cors({
    origin: process.env.FRONT_END_URL,
    credentials: true
}));

app.use(session({
    secret: process.env.SESSION_SECRET,
    name: 'auth_session',
    resave: false,
    unset: 'destroy',
    saveUninitialized: true,
    cookie: {
        sameSite: 'lax',
        // secure: true,
        httpOnly: true,
        maxAge: 60000 * 60 * 24
    }
}))

app.set('trust proxy', 1)

app.use(cookieParser());

app.use(express.json());

//Connect to Mongo
mongoose.connect(process.env.MONGO_URI, {
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

app.get('/', (req, res) => {
    res.send("Hello World")
});

const port = process.env.PORT || 2000;

app.listen(port, () => console.log(`Server started on port ${port}`));