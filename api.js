var mongoose = require("mongoose"); // Importamos una instancia de mongoose
var express = require("express"); //Importamos una instancia de express ambos para poder establecer el manejo de rutas.
var router = express.Router();

let environment = null;

if (!process.env.ON_RENDER) {
  // Esta es la forma de obtener algo de una variable de entorno, ON_HEROKU sinplemente es el nombre que le damos a esa variables, lo podemos cambiar por lo que queramos, en esta oportunidad lo llamaremos RENDER (Heroku y/o render es el nombre de un servidor)
  // En el caso de que este desplegado se ejecutaran las lineas 16, 17 ... es decir las toma(las credenciales) directamente del sistema operativo, que  y si no esta desplegado mostrara el mensaje y cargara las variables desde un archivo

  console.log("Cargando variables de entorno desde archivo");
  const env = require("node-env-file"); // el node file funciona para simular un ambiente de producción desde un archivo .env para tener acceso a las variables, es decir, este si la aplicación ya esta desplegada entonces este if no se ejecuta y como no se ejecuta nunca va a importar el node-file como dependencia y por tal razon nunca va a cargar o simular en ese ambiente lo que hay en la ruta de la siguiente linea que es acceso al archivo .env
  env(__dirname + "/.env");
}

environment = {
  DBMONGOUSER: process.env.DBMONGOUSER,
  DBMONGOPASS: process.env.DBMONGOPASS,
  DBMONGOSERV: process.env.DBMONGOSERV,
  DBMONGO: process.env.DBMONGO,
};

//Este query ira tomando los datos respectivos del archivo .env
var query =
  "mongodb+srv://" +
  environment.DBMONGOUSER +
  ":" +
  environment.DBMONGOPASS +
  "@" +
  environment.DBMONGOSERV +
  "/" +
  environment.DBMONGO +
  "?retryWrites=true&w=majority&appName=Cluster0";

//var query =
//  "mongodb+srv://sandyosef1617:1234@cluster0.szobo.mongodb.net/taskBD?retryWrites=true&w=majority&appName=Cluster0"; // Este es el query de conexion con la base de datos
const db = query;

mongoose.Promise = global.Promise;

mongoose.connect(
  //Establecemos la concexion con la instancia de mongoose con el metodo connect
  db,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  function (error) {
    if (error) {
      console.log("Error!" + error);
    } else {
      console.log("Se ha conectado con la base de datos exitosamente");
    }
  }
);

module.exports = router;
