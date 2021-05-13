"use strict";

var chalk = require("chalk");

if(process.env.NODE_ENV !== "production")
    require("dotenv").config();


if (!process.env.NODE_ENV ) { //undefined
  console.log("ERROR: Ambiente de procesos desconocido");
  return 1;
}



/* if(process.env.NODE_ENV == "production"){
  //SET CONFIG VARS IN DEPLOYING (ie: HEROKU APP SETTINGS)
  NODE_ENV=production
  API_URL=http://server:port/
  ORIGIN=http://server:port/

  //DON'T CONFIGURE PORT AND URI_MONGODB IN PRODUCTION
} */


process.env.PORT = process.env.PORT || 5000;

var mongoose = require("mongoose");
var app = require("./app");

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
  autoIndex: false, // Don't build indexes
  poolSize: 10, // Maintain up to 10 socket connections
  serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
  socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
  family: 4, // Use IPv4, skip trying IPv6
};

/* process.env.URI_MONGODB = "mongodb://localhost:27017/traceorganic"; */

if (process.env.NODE_ENV == "production") {
  process.env.URI_MONGODB =
    "mongodb+srv://admin:anunaki75@traceorganic.jjrrf.mongodb.net/traceorganic?retryWrites=true&w=majority";
}



mongoose.Promise = global.Promise;

mongoose.connect(process.env.URI_MONGODB, options).then(
  () => {
    console.log("\n");
    // string concatenation - template literals

    console.log("INFO: process.env.NODE_ENV = " + chalk.red.bold(process.env.NODE_ENV));
    console.log("INFO: La base de datos es: " + chalk.green(process.env.URI_MONGOD));
    console.log("INFO: La conexión a la base de datos es correcta!!!");

    //Crear servidor y ponerme a escuchar peticiones HTTP
    app.listen(process.env.PORT, () => {
      console.log("INFO: Escuchando peticiones en: " + chalk.green( `API URL: ${process.env.APIURL}`));
      console.log("INFO: Aceptando peticiones desde: " + chalk.green(`ORIGIN: ${process.env.ORIGIN}`));
      //console.log(process.env);
    });
  },
  (err) => {
    console.log("ERROR: " + chalk.bgYellowBright.red(err));
    console.log("ERROR: " + chalk.red("No fue posible la conexión a MongoDB"));
  }
);
