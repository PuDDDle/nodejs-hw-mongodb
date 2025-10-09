import jwt from 'jsonwebtoken';
import { getEnvVar } from './getEnvVar.js';

const ACCESS_TOKEN_SECRET = getEnvVar('ACCESS_TOKEN_SECRET');
const REFRESH_TOKEN_SECRET = getEnvVar('REFRESH_TOKEN_SECRET');

export const generateAccessToken = (userId) => {
  return jwt.sign({ userId }, ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
};

export const generateRefreshToken = (userId) => {
  return jwt.sign({ userId }, REFRESH_TOKEN_SECRET, { expiresIn: '7d' });
};
