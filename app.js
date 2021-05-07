'use strict'

// Cargar módulos de node para crear el servidor
const swaggerUI = require('swagger-ui-express');



var bodyParser = require('body-parser');
var express = require('express');
const Cabin = require('cabin');
const cabin = new Cabin();
const jwt = require('jsonwebtoken');

// Ejecutar expresss (htpp)
var app = express();

app.use(cabin.middleware);

global.baseURL = 'localhost';

// Cargar ficheros rutas
var authRoutes = require('./routes/auth.routes');
var personRoutes = require('./routes/person.routes');
var companyRoutes = require('./routes/company.routes');
var driverRoutes = require('./routes/driver.routes');
var vehicleRoutes = require('./routes/vehicle.routes');
var userRoutes = require('./routes/user.routes');
var roleRoutes = require('./routes/role.routes');

var apiRoutes = [
  authRoutes, 
  userRoutes,
  roleRoutes,
  companyRoutes,
  personRoutes,
  driverRoutes,
  vehicleRoutes,
];

var rootRoutes = require('./routes/root.routes');

process.env.ACCESS_TOKEN_SECRET = "xv2pXfdXV&aDs91P";
process.env.ACCESS_TOKEN_LIFE = '4h';
process.env.REFRESH_TOKEN_SECRET = "hw782wujnd99ahmmakhanjkajikhi&aDs91P";
process.env.REFRESH_TOKEN_LIFE = '24h';

// Middlewares

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


/* <PASSPORT> */
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
app.use(passport.initialize());
/* </PASSPORT> */


// Activar CORS
// Configurar cabeceras y cors
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, X-Access-Token, Content-Type, Accept, Access-Control-Allow-Request-Method');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE, PATCH');
  res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE, PATCH');
  global.baseURL = req.hostname + ":" + global.PORT;
  //console.log('INFO: Servidor corriendo en: ' + global.baseURL );
  next();
});

console.debug('listening on port ' + global.PORT);

app.disable('x-powered-by');


/* <SWAGGER> */
const swaggerJsdoc = require('swagger-jsdoc');
var json_data = require('./swagger.json');
const swaggerOptions = JSON.parse(JSON.stringify(json_data));
const openapiSpecification = swaggerJsdoc(swaggerOptions);
app.use('/doc', swaggerUI.serve, swaggerUI.setup(openapiSpecification, { explorer: true }));
/* </SWAGGER> */


// Añadir prefijos a las rutas / Cargar rutas
// Añadir manualmente las rutas parciales en el arreglo
app.use('/api', apiRoutes);
app.use('/', rootRoutes);



// Exportar módulo (fichero actual)
module.exports = app;
