const Contact = require('../models/contact')

async function getAll() {
  return await Contact.find()
}

async function getById(id) {
  return await Contact.findById(id)
}

module.exports = { getAll, getById }
