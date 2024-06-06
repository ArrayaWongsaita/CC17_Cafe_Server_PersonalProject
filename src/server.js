require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const limiter = require('./middlewares/rete-limit');
const authRouter = require('./routes/auth-route');
const authenticate = require('./middlewares/authenticatel');
const productRouter = require('./routes/product-route');
const errorMiddleware = require('./middlewares/error');
const notFoundMiddleware = require('./middlewares/not-found');

const app = express();

app.use(cors());
app.use(morgan('dev'))
app.use(limiter)
app.use(express.json());




app.use('/auth', authRouter)
app.use('/product',productRouter)


app.use(errorMiddleware)
app.use(notFoundMiddleware)

const PORT = process.env.PORT || 8000;
app.listen(PORT,()=> console.log('server running on port ',PORT))