const { response } = require("express")
const { request } = require("express")
const express =require("express")//importamos express
const { get } = require("express/lib/response")
const morgan = require("morgan")
const cors = require("cors")

const app=express()//ejecutamos el http de express

//Permite crear un middleware para ver las solicitudes en la terminar
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :solicitudName'))
app.use(express.json())//para haceder a los datos convertidos en json
app.use(cors())//Permite da actorizacion para pasar informacion mediante api

//Peticion que devuelve un H1 de bienvenida
app.get("/",(request,response)=>{
    response.send("<h1>Contacto de personas</h1>")
})

//Objecto con la lista de contacto
let persons=[
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

//Peticion que devuelve la lista de los contacto de las persona
app.get("/api/persons",(request,response)=>{
    
    response.send(persons)
})

//Peticion que devuelve a una sola persona dependiendo del ID
app.get("/api/persons/:id",(request,response)=>{
    let id=Number(request.params.id);
    
    const person=persons.find(index =>index.id === id)

    //condicional si existe se muestra el json de lo contrario muestra un error
    if (person) {
        response.json(person)     
    }else{
        
        response.status(404).end()
    
    }
})

//Peticion que borra una persona dependiendo del id
app.delete("/api/persons/:id",(request,response)=>{
    const id= Number(request.params.id);
    //filtra los id dejado el id identico al parametro afuera
    persons=persons.filter(index =>index.id !== id)

    response.status(204).end();

})

//Peticion que agrega un nueva persona 
app.post("/api/persons",(request,response)=>{
      const body=request.body;
      //Creacionn de token para haceder a cuerpo de la solicitud
      morgan.token("solicitudName",(request,response)=>{return JSON.stringify({name:request.body.name, number:request.body.number})})
  
    //Condicional si algunos de la dos entrada esta vacia responde con un error status 400
    if (!body.name || !body.number) {
      return response.status(400).json({
        error: "content missing"
      })
    }

    let comparacion=persons.find(index =>index.name == body.name) //compara los nombre guardado con el nombre a gregar

    //Condicional para verificar que no existan nombres iguales 
    if (comparacion) {
      return response.status(400).json({
        error: "name must be unique"
      })
    }

    //Declaracion del nuevo objecto
  const person = {
    "id":Math.floor(Math.random()*100),
    "name":body.name,
    "number":body.number
  }
    //Almacena el nuevo objecto con los otros
    persons=persons.concat(person)
    response.status(204).end();
})

const PORT=3001;
app.listen(PORT,()=>{
    console.log(`Esta en el puerto ${PORT}`);
})