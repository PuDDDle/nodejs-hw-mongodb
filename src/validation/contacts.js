import Joi from 'joi';

const contactTypes = ['personal', 'business', 'other'];

export const createContactSchema = Joi.object({
  name: Joi.string().min(3).max(20).required(),
  phoneNumber: Joi.string().length(12).pattern(/^\d+$/).required(),
  email: Joi.string().email().allow(null),
  isFavourite: Joi.boolean(),
  contactType: Joi.string()
    .valid(...contactTypes)
    .required(),
});

export const updateContactSchema = createContactSchema.fork(
  ['name', 'phoneNumber', 'contactType'],
  (field) => field.optional(),
);
