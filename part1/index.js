require("dotenv").config()//Permite cargar la variable de entonrno hay que instalarla con el npm
const { response } = require("express")
const { request } = require("express")
const express =require("express")//importamos despues de instalarla para poder manejar mejor la peticiones
const { get } = require("express/lib/response")
const morgan = require("morgan")//Permite vizualizar las peticiones en la terminal
const cors = require("cors")
const app=express()//ejecutamos el http de express
const phone =require("./models/telefono")//importacion del modulo para haceder a la base de datos
morgan("tiny")

app.use(express.static("build"))//Permite hacer la conexion con el frontec static
app.use(express.json())//para haceder a los datos convertidos en json
app.use(cors())//es un agente que permite la autorizacion de pasar informacion desde otra puerto ect
app.use(morgan(":method :url :status :res[content-length] - :response-time ms"))//devuelve informacion de la solicitud en la terminal

//Manejador de error de express middleware
const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }else if(error.name === "ValidationError"){
    return response.status(400).json({ error:error.message })
  }
  next(error)
}
app.use(errorHandler)


//Peticion que devuelve la lista de los contacto de las persona
app.get("/api/persons",(request,response)=>{
  phone.find({}).then(person=>{
    response.json(person)
  })
})

//Peticion que devuelve a una sola persona dependiendo del ID
app.get("/api/persons/:id",(request,response)=>{
    let id=request.params.id;
      phone.findById(id).then(person=>{
        response.json(person)
      }).catch(error=>{
        response.status(404).end()
      })
})

//Peticion que borra una persona dependiendo del id
app.delete("/api/persons/:id",(request,response)=>{
    const id=request.params.id
    phone.findByIdAndDelete(id).then(result=>{
      response.status(204).end();
    }).catch(error=>next(error))
})
//Actualiza un objecto
app.put("/api/persons/:id",(request,response,next)=>{
  const body=request.body
  const id=request.params.id

  const person={
    name:body.name,
    number:body.number,
  }

  phone.findByIdAndUpdate(id,person,{new: true})
                .then(updatePerson=>response.json(updatePerson))
                .catch(error=>next(error))
})

//Peticion que agrega un nueva persona 
app.post("/api/persons",(request,response,next)=>{
      const body=request.body;
      const name=body.name
      const numero=body.number;

      //Creacionn de token para haceder a cuerpo de la solicitud
     // morgan.token("solicitudName",(request,response)=>{return JSON.stringify({name:request.body.name, number:request.body.number})})

    //Condicional si algunos de la dos entrada esta vacia responde con un error status 400
    if (name === undefined) {
      return response.status(400).json({
        error: "content missing"
      })
    }
  //Declaracion del nuevo objecto
  const telefono =new phone({
    name:name,
    number:numero,
  })
  //guarda los datos en la base
  telefono.save()
            .then(savedphone=>savedphone.toJSON())
            .then(saveAndFormattedNote=>response.json(saveAndFormattedNote))
            .catch(error=>next(error))
})

const PORT=process.env.PORT;
app.listen(PORT,()=>{
    console.log(`Esta en el puerto ${PORT}`);
})