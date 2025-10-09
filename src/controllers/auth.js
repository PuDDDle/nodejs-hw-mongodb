import { ONE_DAY } from '../constants/index.js';
import {
  loginUser,
  logoutUser,
  refreshUsersSession,
  registerUser,
  requestResetToken,
  resetPassword,
} from '../services/auth.js';
import createHttpError from 'http-errors';
import { SessionsCollection } from '../db/models/session.js';
import {
  generateAccessToken,
  generateRefreshToken,
} from '../utils/tokenUtils.js';
export const refreshTokenController = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      throw createHttpError(400, 'Refresh token is required');
    }

    const session = await SessionsCollection.findOne({ refreshToken });

    if (!session) {
      throw createHttpError(401, 'Invalid refresh token');
    }

    const now = new Date();
    const refreshTokenExpiry = new Date(session.refreshTokenValidUntil);

    if (now > refreshTokenExpiry) {
      throw createHttpError(401, 'Refresh token expired');
    }

    const newAccessToken = generateAccessToken(session.userId);
    const newRefreshToken = generateRefreshToken(session.userId);

    session.accessToken = newAccessToken;
    session.refreshToken = newRefreshToken;
    session.accessTokenValidUntil = new Date(Date.now() + 15 * 60 * 1000); // 15 хв
    session.refreshTokenValidUntil = new Date(
      Date.now() + 7 * 24 * 60 * 60 * 1000,
    ); // 7 днів

    await session.save();

    res.status(200).json({
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    });
  } catch (error) {
    next(error);
  }
};
const setupSession = (res, session) => {
  res.cookie('refreshToken', session.refreshToken, {
    httpOnly: true,
    expires: new Date(Date.now() + ONE_DAY),
  });
  res.cookie('sessionId', session._id, {
    httpOnly: true,
    expires: new Date(Date.now() + ONE_DAY),
  });
};

export const registerUserController = async (req, res) => {
  const user = await registerUser(req.body);

  res.status(201).json({
    status: 201,
    message: 'Successfully registered a user!',
    data: user,
  });
};

export const loginUserController = async (req, res) => {
  const session = await loginUser(req.body);
  res.cookie('refreshToken', session.refreshToken, {
    httpOnly: true,
    expires: new Date(Date.now() + ONE_DAY),
  });
  res.cookie('sessionId', session._id, {
    httpOnly: true,
    expires: new Date(Date.now() + ONE_DAY),
  });

  res.json({
    status: 200,
    message: 'Successfully logged in an user!',
    data: { accessToken: session.accessToken },
  });
};

export const logoutUserController = async (req, res) => {
  if (req.cookies.sessionId) {
    await logoutUser(req.cookies.sessionId);
  }
  res.clearCookie('sessionId');
  res.clearCookie('refreshToken');

  res.status(204).send();
};

export const refreshUserSessionController = async (req, res) => {
  const session = await refreshUsersSession({
    sessionId: req.cookies.sessionId,
    refreshToken: req.cookies.refreshToken,
  });

  setupSession(res, session);

  res.json({
    status: 200,
    message: 'Successfully refreshed a session!',
    data: {
      accessToken: session.accessToken,
    },
  });
};

export const requestResetEmailController = async (req, res, next) => {
  try {
    console.log('Requesting password reset for email:', req.body.email);

    await requestResetToken(req.body.email);

    console.log('Reset password email was successfully sent!');

    res.json({
      message: 'Reset password email was successfully sent!',
      status: 200,
      data: {},
    });
  } catch (error) {
    console.error('Error in requestResetEmailController:', error);
    next(error);
  }
};

export const resetPasswordController = async (req, res) => {
  await resetPassword(req.body);
  res.json({
    message: 'Password was successfully reset!',
    status: 200,
    data: {},
  });
};
