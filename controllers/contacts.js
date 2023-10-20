const contactRouter = require('express').Router()
const Contact = require('../models/contact')

// contactRouter.get('/info', (req, res) => {
//   let date = new Date()
//   res.send(`<p>Phonebook has in for ${phonebook.length} people <br/> ${date}</p>`)
// })

contactRouter.get('/', (req, res) => {
  Contact.find({}).then(contact => {
    res.json(contact)
  })

})

contactRouter.get('/:id', (req, res, next) => {
  Contact.findById(req.params.id).then(contact => {
    if(contact) {
      res.json(contact)
    } else {
      res.status(404).end()
    }
  }).catch(error => next(error))
})

contactRouter.delete('/:id', (req, res, next) => {
  Contact.findByIdAndRemove(req.params.id)
    .then(() => {
      res.status(204).end()
    })
    .catch(error => next(error))
})

contactRouter.put('/:id', (req, res, next) => {
  const { name, number } = req.body

  Contact.findByIdAndUpdate(req.params.id, { name, number }, { new: true, runValidators: true, context: 'query' }).then(updateContact => {
    res.json(updateContact)
  }).catch(error => next(error))


})

// const generateId = () => {
//   const randId = phonebook.length > 0
//     ? Math.floor(Math.random() * 1000)
//     : 0
//   return randId
// }

contactRouter.post('/', (req, res, next) => {
  const body = req.body

  // const checkExists = (str) => {
  //   return phonebook.some(person => person.name === str)
  // }

  if (!body.name || !body.number) {
    return res.status(400).json({
      error: 'Name and/ or Number is missing, or contact is already in phonebook'
    })
  }

  const newContact = new Contact({
    name: body.name,
    number: body.number,
    // id: generateId(),
  })

  newContact.save().then(savedContact => {
    res.json(savedContact)
  }).catch(error => next(error))


})

module.exports =  contactRouter