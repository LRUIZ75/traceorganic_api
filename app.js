'use strict'

// Cargar módulos de node para crear el servidor
const swaggerUI = require('swagger-ui-express');



var express = require('express');
const Cabin = require('cabin');
const logger = new Cabin();
const jwt = require('jsonwebtoken');

// Ejecutar expresss (htpp)
var app = express();

app.use(logger.middleware);

const {SyncIndexes} = require('./models/sync-indexes');
SyncIndexes();

// Cargar ficheros rutas
var authRoutes = require('./routes/auth.routes');
var personRoutes = require('./routes/person.routes');
var companyRoutes = require('./routes/company.routes');
var countryRoutes = require('./routes/country.routes');
var driverRoutes = require('./routes/driver.routes');
var vehicleRoutes = require('./routes/vehicle.routes');
var userRoutes = require('./routes/user.routes');
var roleRoutes = require('./routes/role.routes');
var settingsRoutes = require('./routes/settings.routes');
var processincentersRoutes = require('./models/processingcenters.model');
var warehousesRoutes = require('./models/warehouses.model');

var apiRoutes = [
  authRoutes, 
  userRoutes,
  roleRoutes,
  companyRoutes,
  settingsRoutes,
  countryRoutes,
  personRoutes,
  driverRoutes,
  vehicleRoutes,
  processincentersRoutes,
  warehousesRoutes,
];

var rootRoutes = require('./routes/root.routes');

process.env.ACCESS_TOKEN_SECRET = "xv2pXfdXV&aDs91P";
process.env.ACCESS_TOKEN_LIFE = '8h';
process.env.REFRESH_TOKEN_SECRET = "hw782wujnd99ahmmakhanjkajikhi&aDs91P";
process.env.REFRESH_TOKEN_LIFE = '24h';

// Middlewares

app.use(express.urlencoded({ extended: true }));  //false vs true???
app.use(express.json());


// Activar CORS
// Configurar cabeceras y cors
app.use((req, res, next) => {
  /* res.header('Cross-Origin-Resource-Policy', "cross-origin"); */
  const corsWhitelist = [
    'http://localhost:5000',
    'http://localhost:4200',
    'https://traceorganic-api.herokuapp.com',
    'https://traceorganic.herokuapp.com'
];
if (corsWhitelist.indexOf(req.headers.origin) !== -1) {
    res.header('Access-Control-Allow-Origin', req.headers.origin);
}
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Headers', 'Authorization, Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE, PATCH');
  next();
});

console.debug('listening on port ' + process.env.PORT);

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
