const express = require('express')
const app = express();
const bodyParser = require('body-parser')
const morgan = require('morgan')
const mongoose = require('mongoose')
const product = require('./models/product')


//routes
const categoriesRoutes = require('./routers/categories')
const productsRoutes = require('./routers/products')
const usersRoutes = require('./routers/users')
const orderRoutes = require('./routers/orders')

require('dotenv/config')

const api = process.env.API_URL;
app.use(morgan('tiny'))
app.use(bodyParser.json())

//routes added
app.use(`${api}/products`, productsRoutes)
app.use(`${api}/categories`, categoriesRoutes)
app.use(`${api}/users`, usersRoutes)
app.use(`${api}/order`, orderRoutes)



mongoose.connect(
   process.env.CONNECTION_STRING,
   {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      dbName: 'eshop-database'
   }
).then(() => console.log("connection successfull")).catch((err) => {
   console.log(err)
});

app.listen(3001, () => {
   console.log(`app started at port 3001`)
})   