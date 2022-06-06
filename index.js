const express = require("express")
const app = express()
const cors = require("cors")
var morgan = require("morgan")

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

/* ----- DATA ----- */
let data = [
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

/* ----- REST ----- */

app.get("/", (request, response) => {
    response.send("<h1>Well Hello darling...</h1>")
})

app.get("/api/persons", (request, response) => {
    return response.json(data)
})

app.get("/api/persons/:id", (request, response) => {
    const person = data.filter(el => el.id == request.params.id)
    console.log(person === true)
    if (person)
        return response.json(person[0])
    response.status(404).end()
})

app.get("/info", (request, response) => {
    response.send(`<p>Phonebook has info for ${data.length} people</p><p>${new Date()}</p>`)
})

app.delete("/api/persons/:id", (request, response) => {
  
  if(data.find(el => el.id === Number(request.params.id)) !== undefined){
    data = data.filter(el => el.id !== Number(request.params.id))
    response.status(204).end()
  }
  else{
    response.status(404).send(new Error('No se encuentra'))
  }
})

app.post("/api/persons", (request, response) => {

  const body = request.body
  const allowed = body.name !== "" && body.number !== "" && data.find(el => el.name == body.name) === undefined;
  
  if(allowed){
    const newPerson = {
      "id": parseInt(Math.random()*100000),
      "name": request.body.name,
      "number": request.body.number
    }
    data.push(newPerson)
    return response.json(newPerson)
  }
  response.status(400).json({error: "important data missing or name is already on phonebook"})
})

/* ----- LISTENING ----- */

const PORT = process.env.PORT || 3001
app.listen(PORT, () =>{
    console.log(`Server running on port ${PORT}`)
})