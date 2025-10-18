import createHttpError from 'http-errors';
import {
  createContact,
  deleteContact,
  getAllContacts,
  getContactById,
  updateContact,
} from '../services/contacts.js';
import { parsePaginationParams } from '../utils/parsePaginationParams.js';
import { parseSortParams } from '../utils/parseSortParams.js';
import { parseFilterParams } from '../utils/parseFilterParams.js';
import { saveFileToCloudinary as processPhotoUpload } from '../utils/saveFileToCloudinary.js';
import { createContactSchema } from '../validation/contacts.js';

export const getContactsController = async (req, res, next) => {
  try {
    const { page, perPage } = parsePaginationParams(req.query);
    const { sortBy, sortOrder } = parseSortParams(req.query);
    const filter = parseFilterParams(req.query);

    const contacts = await getAllContacts({
      page,
      perPage,
      sortBy,
      sortOrder,
      filter,
      userId: req.user._id,
    });

    console.log('User ID:', req.user._id);
    console.log('Filter:', filter);
    console.log('Contacts found:', contacts?.data?.length ?? 0);

    res.status(200).json({
      status: 200,
      message: contacts?.data?.length
        ? 'Successfully found contacts!'
        : 'No contacts found (empty list)',
      data: contacts,
    });
  } catch (error) {
    next(error);
  }
};

export const getContactByIdController = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const contact = await getContactById(contactId, req.user._id);

    if (!contact) {
      throw createHttpError(404, 'Contact not found');
    }

    res.status(200).json({
      status: 200,
      message: `Successfully found contact with id ${contactId}!`,
      data: contact,
    });
  } catch (error) {
    next(error);
  }
};

export const createContactController = async (req, res, next) => {
  try {
    let photoUrl = null;

    if (req.file) {
      photoUrl = await processPhotoUpload(req.file);
    }

    const validatedData = await createContactSchema.validateAsync(req.body);

    const normalizedData = {
      ...validatedData,
      contactType: validatedData.contactType.toLowerCase(),
    };

    const contact = await createContact({
      ...normalizedData,
      userId: req.user._id,
      photo: photoUrl,
    });

    res.status(201).json({
      status: 201,
      message: 'Successfully created a contact',
      data: contact,
    });
  } catch (error) {
    next(error);
  }
};

export const patchContactController = async (req, res, next) => {
  try {
    const { contactId } = req.params;

    const payload = { ...req.body };

    if (payload.contactType) {
      payload.contactType = payload.contactType.toLowerCase();
    }

    if (req.file) {
      const photoUrl = await processPhotoUpload(req.file);
      payload.photo = photoUrl;
    }

    const result = await updateContact(contactId, payload, req.user._id);

    if (!result) {
      throw createHttpError(404, 'Contact not found');
    }

    res.status(200).json({
      status: 200,
      message: 'Successfully patched a contact!',
      data: result.contact,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteContactController = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const contact = await deleteContact(contactId, req.user._id);

    if (!contact) {
      throw createHttpError(404, 'Contact not found');
    }

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
