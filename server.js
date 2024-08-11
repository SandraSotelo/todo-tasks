const express = require("express"); //express, debe estar instalada la dependencia
const api = require("./api"); //importamos la api.js para que se ejecute la coneción que tenemos en el momento
const port = process.env.PORT || 3000;
const app = express(); //Esta es la instancia de express, definición de la variable app

app.listen(port, function () {
  console.log("Server is listening at port: " + port);
});

app.get("/", function (req, res) {
  res.send("hello world");
});

app.use("/api", api); //Ubicamos esta linea aqui porque debe quedar despues de la definicion de la variable app, aqui estamos estableciendo la ruta con el metodo use
                      //establecemos las rutas a la instancia api, en la linea 2