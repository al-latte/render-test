const express = require("express")
const app = express()

app.use(express.json())

// Cross Origin Resource Sharing
const cors = require("cors")
app.use(cors())

// To make express show static content
app.use(express.static("dist"))


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
    res.json(phonebook)
})

app.get("/api/persons/:id", (req, res) => {
    const id = Number(req.params.id)
    const contact = phonebook.find(con => con.id === id)
    if(contact) {
        res.json(contact)
    } else {
        res.status(404).end()
    }
        
})

app.delete("/api/persons/:id", (req, res) => {
    const id = Number(req.params.id)
    phonebook = phonebook.filter(contact => contact.id !== id)

    res.status(204).end()
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

    const newContact = {    
    name: body.name,
    number: body.number, 
    id: generateId(),
    }

    phonebook = phonebook.concat(newContact)

    res.json(newContact)
})

const PORT = process.env.PORT || 3001
app.listen(PORT)
console.log(`Server running on port ${PORT}`)