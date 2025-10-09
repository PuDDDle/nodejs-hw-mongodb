import createHttpError from 'http-errors';

import { SessionsCollection } from '../db/models/session.js';
import { UsersCollection } from '../db/models/user.js';

export const authenticate = async (req, res, next) => {
  const authHeader = req.get('Authorization');

  console.log('Authorization header:', authHeader); // додано лог

  if (!authHeader) {
    return next(createHttpError(401, 'Please provide Authorization header'));
  }

  const bearer = authHeader.split(' ')[0];
  const token = authHeader.split(' ')[1];

  console.log('Bearer:', bearer); // додано лог
  console.log('Token:', token); // додано лог

  if (bearer !== 'Bearer' || !token) {
    return next(createHttpError(401, 'Auth header should be of type Bearer'));
  }

  const session = await SessionsCollection.findOne({ accessToken: token });

  console.log('Session found:', session); // додано лог

  if (!session) {
    return next(createHttpError(401, 'Session not found'));
  }

  const now = new Date();
  const tokenExpiry = new Date(session.accessTokenValidUntil);

  console.log('Current server time:', now.toISOString());
  console.log('Token expiry time:', tokenExpiry.toISOString());

  if (now > tokenExpiry) {
    console.log('Access token is expired');
    return next(createHttpError(401, 'Access token expired'));
  }

  const user = await UsersCollection.findById(session.userId);

  console.log('User found:', user); // додано лог

  if (!user) {
    return next(createHttpError(401));
  }

  req.user = user;

  next();
};
