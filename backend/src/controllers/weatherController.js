const { getWeatherInsights } = require('../services/weatherService')

const getWeather = async (req, res, next) => {
  try {
    const { city, lat, lon } = req.query
    const data = await getWeatherInsights({ city, lat, lon })

    return res.status(200).json({
      success: true,
      weather: data,
    })
  } catch (error) {
    return next(error)
  }
}

module.exports = {
  getWeather,
}
