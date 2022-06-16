const contact = require('./models/contact')
require('dotenv').config()
const express = require("express")
const app = express()
const cors = require("cors")
var morgan = require("morgan")
const { request, response } = require('express')

app.use(express.json())
app.use(express.static('build'))
app.use(cors())
app.use(morgan((tokens, req, res) => {
  return [
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    tokens.res(req, res, 'content-length'), '-',
    tokens['response-time'](req, res), 'ms',
    JSON.stringify(req.body)
  ].join(' ')
}))

data = []
/* ----- REST ----- */

app.get("/", (request, response) => {
    response.send("<h1>Well Hello darling...</h1>")
})

app.get("/api/persons", (request, response) => {
    contact
      .find({})
      .then(people => {
        data.push(people)
        response.json(people)})
})

app.get("/api/persons/:id", (request, response) => {
    contact
      .findById(request.params.id)
      .then(person => response.json(person))
})

app.put("/api/persons/:id", (request, response) => {
  return contact
    .findByIdAndUpdate(request.params.id, {number: request.body.number})
    .then((req, res) => {
      return response.json({...request.body, number: request.body.number})})
})

app.get("/info", (request, response) => {
    response.send(`<p>Phonebook has info for ${data.length} people</p><p>${new Date()}</p>`)
})

app.delete("/api/persons/:id", (request, response) => {
  console.log(request.params.id)
  contact
    .findByIdAndRemove(request.params.id)
    .then(() => response.status(204).end())
    .catch(error => {
      console.log(error)
      response.status(404).end()})
})

app.post("/api/persons", (request, response, next) => {
  const body = request.body
  const allowed = body.name !== "" && body.number !== "" && data.find(el => el.name == body.name) === undefined;
  
  if(allowed){
    console.log("entro")
    const newPerson = new contact({
      name: request.body.name,
      number: request.body.number
    })
    return newPerson
      .save()
      .then(added => {
        console.log("Person added", added)
        return response.json(added)
      })
      .catch(error => {
        next(error)
      })
      
  }
  response.status(400).json({error: "important data missing or name is already on phonebook"})
})

//ERROR HANDLING

app.use((err, req, res, next)=>{
  console.log("error is",err.errors.name.message)
  return res.status(422).send({error: err.errors.name.message})
})

/* ----- LISTENING ----- */

const PORT = process.env.PORT || 3001
app.listen(PORT, () =>{
    console.log(`Server running on port ${PORT}`)
})