const buildHealthResponse = () => {
  return {
    success: true,
    message: 'Smart Agriculture API is running',
    timestamp: new Date().toISOString(),
  }
}

module.exports = {
  buildHealthResponse,
}
