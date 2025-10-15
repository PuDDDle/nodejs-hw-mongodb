import createHttpError from 'http-errors';

export const validateBody = (schema) => async (req, res, next) => {
  try {
    if (req.is('multipart/form-data')) {
      for (const key in req.body) {
        if (req.body[key] === 'true') req.body[key] = true;
        if (req.body[key] === 'false') req.body[key] = false;
      }
    }

    await schema.validateAsync(req.body, { abortEarly: false });
    next();
  } catch (err) {
    const error = createHttpError(400, 'Bad request', { errors: err.details });
    next(error);
  }
};
