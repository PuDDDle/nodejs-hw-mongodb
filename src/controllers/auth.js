import { ONE_DAY } from '../constants/index.js';
import {
  loginUser,
  logoutUser,
  refreshUsersSession,
  registerUser,
  requestResetToken,
  resetPassword,
} from '../services/auth.js';

// 📌 Допоміжна функція для установки сесійних cookie
const setupSession = (res, session) => {
  const options = {
    httpOnly: true,
    expires: new Date(Date.now() + ONE_DAY),
  };

  res.cookie('refreshToken', session.refreshToken, options);
  res.cookie('sessionId', session._id, options);
};

// 📌 Реєстрація користувача
export const registerUserController = async (req, res) => {
  const user = await registerUser(req.body);

  res.status(201).json({
    status: 201,
    message: 'Successfully registered a user!',
    data: user,
  });
};

// 📌 Логін користувача
export const loginUserController = async (req, res) => {
  const session = await loginUser(req.body);

  setupSession(res, session);

  res.json({
    status: 200,
    message: 'Successfully logged in a user!',
    data: {
      accessToken: session.accessToken,
    },
  });
};

// 📌 Вихід користувача
export const logoutUserController = async (req, res) => {
  if (req.cookies.sessionId) {
    await logoutUser(req.cookies.sessionId);
  }

  res.clearCookie('sessionId');
  res.clearCookie('refreshToken');

  res.status(204).send();
};

// 📌 Оновлення токенів (рефреш сесії)
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

// 📌 Відправлення email для скидання паролю
export const requestResetEmailController = async (req, res) => {
  await requestResetToken(req.body.email);

  res.status(200).json({
    status: 200,
    message: 'Reset password email was successfully sent!',
    data: {},
  });
};

// 📌 Скидання паролю по токену
export const resetPasswordController = async (req, res) => {
  await resetPassword(req.body);

  res.status(200).json({
    status: 200,
    message: 'Password was successfully reset!',
    data: {},
  });
};
