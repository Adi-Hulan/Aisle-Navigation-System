const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const app = express();
require('dotenv').config();

const PORT = process.env.PORT || 8070;

app.use(cors());
app.use(bodyParser.json());

//Import routes
const userRoutes = require('./routes/UserRoute');
const inventoryRoute = require('./routes/InventoryRoute');
const productRoute = require('./routes/ProductRoute');
const categoryRoute = require('./routes/CategoryRoute');
const supplierRoute = require('./routes/SupplierRoute');
const promotionRoute = require('./routes/PromotionRoute');
const feedbackRoute = require('./routes/FeedBackRoute');
const stockRoute = require('./routes/StockRoute');
const productRouteS = require("./routes/SupplierProductRoute")


app.use((req, res, next) => {
    console.log(req.path, req.method) 
    next()
})
//Use routes
app.use('/users', userRoutes);
app.use('/inventory', inventoryRoute);
app.use('/product', productRoute);
app.use('/category', categoryRoute);
app.use('/supplier', supplierRoute);
app.use('/promotion', promotionRoute)
app.use('/feedback', feedbackRoute);
app.use('/stock', stockRoute);
app.use("/productS", productRouteS);

const url = process.env.MONGODB_URL;

mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const connection = mongoose.connection;
connection.once('open', () => {
    console.log("MongoDB connection success!");
});

app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
});