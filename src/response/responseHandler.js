export const responseHandler = (
  res,
  statusCode,
  message,
  data,
  students,
  mentors,
  classes
) => {
  res.status(statusCode).json({
    message: message,
    data: data,
    students,
    mentors,
    classes,
  });
};
