import fs from 'fs/promises';
import path from 'path';
import { CONTACTS_UPLOAD_DIR } from '../constants/index.js';

export const processPhotoUpload = async (file) => {
  if (!file) return null;

  const tempPath = file.path; // наприклад: temp/1720703994000-avatar.jpg
  const finalPath = path.join(CONTACTS_UPLOAD_DIR, file.filename); // uploads/contacts/...

  await fs.rename(tempPath, finalPath); // перекидаємо файл

  return `/uploads/contacts/${file.filename}`; // шлях, який побачить фронтенд
};
