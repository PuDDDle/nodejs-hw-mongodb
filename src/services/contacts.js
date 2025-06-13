import { ContactsCollection } from '../db/models/contacts.js';

export const getAllContacts = async () => {
  try {
    console.log('Trying to fetch contacts...');
    const contacts = await ContactsCollection.find();
    console.log(`Found ${contacts.length} contacts`);
    return contacts;
  } catch (error) {
    console.error('Error in getAllContacts:', error);
    throw error;
  }
};

export const getContactById = async (contactId) => {
  const contact = await ContactsCollection.findById(contactId);
  return contact;
};
