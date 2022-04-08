const mongoose= require("mongoose")//importamos la libreria para utilizar mejor la base de dato
const uniqueValidator= require("mongoose-unique-validator") //es un complemento que agrega validación previa al guardado para campos únicos dentro de un esquema de Mongoose.
const url= process.env.MONGODB_URI //URL de la base de dato

console.log(`Connection to ${url}`);

//Connection to the BD
mongoose.connect(url).then(result=>{

    console.log("Connection exitosa!!!");
}).catch((error)=>{
    console.log(`Connection fallida: ${error.menssage}`);
})

const phoneSchema= new mongoose.Schema({
    name:{
        type:String,
        required:true,
        unique:true,
        minlength:3,
    },
    number:{
        type:String,
        required:true,
        minlength:8,
        unique:true,
    },
})

phoneSchema.plugin(uniqueValidator)

//Retorna el json con el id convertido en string de la base de dato
phoneSchema.set("toJSON",{
    transform:(document,returnedObject)=>{
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
      }
})

module.exports= mongoose.model("phone",phoneSchema)