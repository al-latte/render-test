require('dotenv').config()

const express = require("express")
const app = express()

app.use(express.json())

// Cross Origin Resource Sharing
const cors = require("cors")
app.use(cors())

// To make express show static content
app.use(express.static("dist"))

const Contact = require("./models/contact")

// error handling
const errorHandler = (error, request, response, next) => {
    console.error(error.message)
  
    if (error.name === 'CastError') {
      return response.status(400).send({ error: 'malformatted id' })
    } 
  
    next(error)
  }

app.use(errorHandler)
  

let phonebook = [
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

app.get("/info", (req, res) => {
    let date = new Date()
    res.send(`<p>Phonebook has in for ${phonebook.length} people <br/> ${date}</p>`)
})

app.get("/api/persons", (req, res) => {
    Contact.find({}).then(contact => {
        res.json(contact)
    })
    
})

app.get("/api/persons/:id", (req, res, next) => {
    Contact.findById(req.params.id).then(contact => {
        if(contact) {
            res.json(contact)
        } else {
            res.status(404).end()
        }
    }).catch(error => next(error))
})

app.delete("/api/persons/:id", (req, res, next) => {
    Contact.findByIdAndRemove(req.params.id)
    .then(results => {
      res.status(204).end()
    })
    .catch(error => next(error))
})

const generateId = () => {
    const randId = phonebook.length > 0
      ? Math.floor(Math.random() * 1000)
      : 0
    return randId
  }

app.post("/api/persons", (req, res) => {
    const body = req.body

    const checkExists = (str) => {
        return phonebook.some(person => person.name === str)
    }

    if (!body.name || !body.number || checkExists(body.name)) {
        return res.status(400).json({ 
          error: 'Name and/ or Number is missing, or contact is already in phonebook' 
        })
      }

    const newContact = new Contact({    
    name: body.name,
    number: body.number, 
    id: generateId(),
    })

    newContact.save().then(savedContact => {
        res.json(savedContact)
    })

    
})

const PORT = process.env.PORT
app.listen(PORT)
console.log(`Server running on port ${PORT}`)