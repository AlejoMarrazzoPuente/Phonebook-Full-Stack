const mongoose = require('mongoose')

//GUARDAR EL PASS, PORT Y URL EN ENVDOT
const url = `mongodb+srv://Alejo8139:Martina8139@cluster0.wkysg.mongodb.net/phonebook?retryWrites=true&w=majority`

mongoose
    .connect(url)
    .then(()=>{
        console.log('Connected to DB')
    })
    .catch(error => console.log(error))

const contactSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: [5, 'Must be at least have 3 characters long, got {VALUE}']
    }, //String,
    number: Number,
    id: Number,
  })

contactSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v}})

module.exports = mongoose.model('Person', contactSchema)

