const contactService = require('../services/contacts') // Імпортуємо сервіс

// Контролер для отримання всіх контактів
async function getAllContacts(req, res) {
  try {
    const data = await contactService.getAll() // Виклик функції сервісу
    res.status(200).json({
      status: 200,
      message: 'Successfully found contacts!',
      data,
    })
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Error retrieving contacts', error: error.message })
  }
}

// Контролер для отримання контакту за ID
async function getContactById(req, res) {
  const { contactId } = req.params

  try {
    const contact = await contactService.getById(contactId)

    if (!contact) {
      return res.status(404).json({ message: 'Contact not found' })
    }

    res.status(200).json({
      status: 200,
      message: `Successfully found contact with id ${contactId}!`,
      data: contact,
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Error retrieving contact' })
  }
}

module.exports = { getAllContacts, getContactById }
