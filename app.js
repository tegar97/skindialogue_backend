const path =  require('path')
const express = require('express');
const app = express();
const morgan = require('morgan');
const connectDb  = require('./config/server.js')
const cookieParser = require('cookie-parser')
const dotenv = require('dotenv').config({path: './config.env'})

const methodOverride = require('method-override');
const flash = require('connect-flash')
const session = require('express-session');
var cors = require('cors')
const globalErrorHandler = require('./controller/errorController')
const mongoSanitize = require('express-mongo-sanitize')
const xss = require('xss-clean')
const expressip = require('express-ip');
app.use(expressip().getIpInfoMiddleware);

var helmet = require('helmet')
app.use(helmet())

console.log(process.env.NODE_ENV)





//allow all cors request
app.use(cors())

//Data Sanitizalition against nosql query injection
app.use(mongoSanitize())
//Data sanitization agains html/javascript
app.use(xss())
//Logger 
if(process.env.NODE_ENV == 'development') {
  app.use(morgan('dev'))
}
console.log(process.env.MONGO_URL)
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
//flash
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60000 }
  }))
app.use(flash())


app.use(express.json({limit : '10kb'}))
app.use(cookieParser());
app.use(express.urlencoded({extended : true, limit : '10kb'}))
//method override 
app.use(methodOverride('_method'))

//setting template engine
app.set('view engine','ejs')
app.set('views',path.join(__dirname, 'views'))

app.use(cookieParser());
//acces to folder public
app.use(express.static(path.join(__dirname, 'public')));
app.use('/sb-admin',express.static(path.join(__dirname,'node_modules/startbootstrap-sb-admin-2')));


//router
app.use('/',require('./route/adminRouter'))
app.use('/api/v1/', require('./route/apiRouter'))

//connect to mongo db
connectDb()
app.use(globalErrorHandler)

const PORT = 4000|| 5000

app.listen(PORT,console.log(`SERVER RUNNING IN ${process.env.NODE_ENV} made on port ${PORT}`))