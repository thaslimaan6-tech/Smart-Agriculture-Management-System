const getErrorMessage = (error, fallbackMessage) =>
  error?.response?.data?.message ||
  error?.message ||
  fallbackMessage ||
  'Something went wrong. Please try again.'

export default getErrorMessage
