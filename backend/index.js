const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./config/db');
const router = require('./routes');
const cookieParser = require('cookie-parser');
const invoiceRoutes = require('./routes/invoiceRoutes');
const app = express();
const cartRoutes = require('./routes/cart');
const orderRoutes = require('./routes/order');
const bodyParser = require('body-parser');

app.use(cors({
    origin : process.env.FRONTEND_URL,
    credentials : true
}));
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.json());
app.use(cookieParser());
app.use('/api',router);
app.use('/api',invoiceRoutes);
app.use('/api', cartRoutes);
app.use('/api', orderRoutes);

const PORT = 8080 || process.env.PORT;

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log('connected to DB');
        console.log('Server is running');
    })
});
