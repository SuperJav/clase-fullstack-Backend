const mongoose = require("mongoose"); //importamos la libreria para poder utilizar la base de dato mejor

//Condicional para enviar un mensaje a la consola si no agrega el argumento correcto en la terminal
if (process.argv.length === 2 || process.argv.length === 4) {
  console.log("No has ingresado la clave en la linea de comando");
  process.exit(1);
}

const password = process.argv[2]; //Clave del usuario
const name = process.argv[3]; //nom
const number = String(process.argv[4]); //number

const URL = `mongodb+srv://admin:${password}@cluster0.khcgw.mongodb.net/app-agenda?retryWrites=true&w=majority`;

mongoose.connect(URL); //Permite the Connection

//Crear un modelo para el almacenamiento de como se almacenaras en la nube
const phoneSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Phone = mongoose.model("Phone", phoneSchema);

//if he argument is menor a 3 sinigica que solo queremos the datas
//if he argument is mayor o igual a 5 sinifica que solo queremos add new data
if (process.argv.length <= 3) {
  Phone.find({}).then((result) => {

      console.log("PhoneBook");
    result.map(usuario=> console.log(`${usuario.name}: ${usuario.number}`))
    mongoose.connection.close();
  });
} else if (process.argv.length >= 4) {
  const phone = new Phone({
    name: name,
    number: number,
  });

  phone.save().then((result) => {
    console.log(
      `Added ${process.argv[3]} number ${process.argv[4]} to phoneBook`
    );
    mongoose.connection.close();
  });
}
