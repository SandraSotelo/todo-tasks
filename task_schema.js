var mongoose = require("mongoose");

var TaskSchema = new mongoose.Schema({
  //De monggose va a usar el esquema, la libreria que dice Schema, para crear una istancia a un objeto, donde dicho esquema se le pasa por argumento a un json que va a tener la estructura de lo que seria un TaskSchema (o el esquema de una tarea)
  TaskId: Number,
  Name: String,
  Deadline: Date,
});

module.exports = mongoose.model("task", TaskSchema, "Tasks"); //Exportamos el modelo, schema lo llamaremos despues desde el api.js, api.js ya tiene la conexion con mongoDB, como ya esta la conexion aqui simplemente exportamos dicho modelo. Aqui el primer argumento seria un identificador cualquiera, el segundo seria el esquema que va a tener esa estructura y el tercero el nombre de la colección asociada a este esquema, si no existe la va a crear y si ya exite entonces todo lo que se genere en el esquema va a ir a quedar en esa colección, en caso de la necesidad de modificar el esquema por ejemplo agregar una descripcion y otros campos pues se agregan y a su vez se modifican los metodos para darle manejo a los otros datos.
