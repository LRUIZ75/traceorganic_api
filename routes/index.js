// Cargar ficheros rutas
var authRoutes = require('./auth.routes');
var personRoutes = require('./person.routes');
var companyRoutes = require('./company.routes');
var countryRoutes = require('./country.routes');
var driverRoutes = require('./driver.routes');
var vehicleRoutes = require('./vehicle.routes');
var userRoutes = require('./user.routes');
var roleRoutes = require('./role.routes');
var processincenterRoutes = require('./processingcenter.routes');
var warehouseRoutes = require('./warehouse.routes');
var providerRoutes = require('./provider.routes');
var farmerRoutes = require('./farmer.routes');

const apiRoutes = [
  authRoutes, 
  userRoutes,
  roleRoutes,
  companyRoutes,
  countryRoutes,
  personRoutes,
  driverRoutes,
  vehicleRoutes,
  processincenterRoutes,
  warehouseRoutes,
  providerRoutes,
  farmerRoutes,
];

module.exports = apiRoutes;