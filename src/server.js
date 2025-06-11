const express = require('express')
const contactsController = require('./controllers/contacts')

function setupServer() {
  const app = express()

  app.use(express.json())

  app.get('/contacts', contactsController.getAllContacts)
  app.get('/contacts/:contactId', contactsController.getContactById)

  app.use((req, res) => {
    res.status(404).json({ message: 'Not found' })
  })

  const PORT = process.env.PORT || 3000
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
  })

  return app
}

module.exports = setupServer
