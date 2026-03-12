export const handleApiError = (res, error, fallbackMessage = 'Unexpected error') => {
  if (error?.name === 'ZodError') {
    return res.status(400).json({ message: 'Invalid payload', issues: error.issues });
  }

  const status = error?.status ?? 500;
  return res.status(status).json({ message: error?.message ?? fallbackMessage });
};

export const withHttpError = (message, status = 400) => {
  const err = new Error(message);
  err.status = status;
  return err;
};
