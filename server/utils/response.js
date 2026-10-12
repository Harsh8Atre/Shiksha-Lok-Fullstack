export const sendResponse = (res, statusCode, message, data = null) => {
  const success = statusCode < 400;
  res.status(statusCode).json({
    success,
    message,
    data
  });
};
