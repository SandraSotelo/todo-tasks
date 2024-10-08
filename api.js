var mongoose = require("mongoose"); // Importamos una instancia de mongoose
var express = require("express"); //Importamos una instancia de express ambos para poder establecer el manejo de rutas.
var TaskModel = require("./task_schema");
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

//CREAR TAREAS

router.post("/create-task", function (req, res) {
  // el req es lo que llega (Cuando del lado del cliente http el hace una petición con cierta información esto llega al servidor y el servidor lo recibe y lo captura en esta variable req la cual tiene el body que es el cuerpo de la solicitud)
  // el res es la respuesta del lado del servidor, el servidor siempre debe responder, que hubo un error o que todo salio bien.

  let task_id = req.body.TaskId;
  let name = req.body.Name;
  let deadline = req.body.Deadline;

  let task = {
    //Aqui creamos el json con la estructura
    TaskId: task_id,
    Name: name,
    Deadline: deadline,
  };
  var newTask = new TaskModel(task); //lo que hay entre las lienas 64 a 69 se le pasa entonces con la información recibida al constructos mediante este argumento task

  newTask.save(function (err, data) {
    //Como este modelo ya implemento mongoose, el metodo save, lo que va a hacer es crear un nuevo recurso en la BD (nuevo registro), es decir el schema ya tiene toda esa información en la coleccion
    if (err) {
      console.log(err);
      res.status(500).send("Internal error\n");
    } else {
      res.status(200).send("OK\n");
    }
  });
});

// CONSULTAR TAREAS

router.get("/all-tasks", function (req, res) {
  TaskModel.find(function (err, data) {
    if (err) {
      res.status(500).send("Internal error\n");
    } else {
      res.status(200).send(data);
    }
  });
});

//MODIFICAR UNA TAREA

router.post("/update-task", function (req, res) {
  TaskModel.updateOne(
    { TaskId: req.body.TaskId }, //el primer argumento es el ID por el cual va a realizar la busqueda y el segundo es lo que le va a cambiar
    {
      Name: req.body.Name,
      Deadline: req.body.Deadline,
    },
    function (err, data) {
      if (err) {
        res.status(500).send("Internal error\n");
      } else {
        res.status(200).send("OK\n");
      }
    }
  );
});

//ELIMINAR UNA TAREA
router.delete("/delete-task", function (req, res) {
  TaskModel.deleteOne({ TaskId: req.body.TaskId }, function (err, data) {
    if (err) {
      res.status(500).send("Internal error\n");
    } else {
      res.status(200).send("OK\n");
    }
  });
});

module.exports = router;
