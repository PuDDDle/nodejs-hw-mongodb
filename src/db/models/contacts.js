import { model, Schema } from 'mongoose';

const contactsSchema = new Schema(
  {
    name: {
      type: String,
      require: true,
    },

    phoneNumber: {
      type: String,
      required: true,
      match: /^\d{10,13}$/,
    },
    email: {
      type: String,
      require: false,
      unique: true,
    },
    isFavourite: {
      type: Boolean,
      default: false,
    },
    contactType: {
      type: String,
      enum: ['work', 'home', 'personal'],
      required: true,
      default: 'personal',
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'users',
      required: true,
    },
    photo: { type: String },
  },
  { timestamps: true },
);

export const ContactsCollection = model('contacts', contactsSchema);
