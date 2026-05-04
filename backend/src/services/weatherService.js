const OPENWEATHER_BASE_URL = 'https://api.openweathermap.org/data/2.5'

const getApiKey = () => {
  const apiKey = process.env.OPENWEATHER_API_KEY
  if (!apiKey) {
    return null
  }
  return apiKey
}

const buildCurrentWeatherUrl = ({ city, lat, lon }) => {
  const apiKey = getApiKey()
  if (!apiKey) return null
  const params = new URLSearchParams({ appid: apiKey, units: 'metric' })

  if (city) {
    params.set('q', city)
  } else {
    params.set('lat', String(lat))
    params.set('lon', String(lon))
  }

  return `${OPENWEATHER_BASE_URL}/weather?${params.toString()}`
}

const buildForecastUrl = ({ city, lat, lon }) => {
  const apiKey = getApiKey()
  if (!apiKey) return null
  const params = new URLSearchParams({ appid: apiKey, units: 'metric' })

  if (city) {
    params.set('q', city)
  } else {
    params.set('lat', String(lat))
    params.set('lon', String(lon))
  }

  return `${OPENWEATHER_BASE_URL}/forecast?${params.toString()}`
}

const fetchJson = async (url) => {
  const response = await fetch(url)
  const payload = await response.json()

  if (!response.ok) {
    const message = payload?.message || 'Failed to fetch weather data'
    const error = new Error(message)
    error.statusCode = response.status
    throw error
  }

  return payload
}

const hasExpectedRainSoon = (forecastList = []) => {
  const nextEntries = forecastList.slice(0, 4) // next ~12 hours
  return nextEntries.some((entry) => {
    const volume1h = entry?.rain?.['1h'] || 0
    const volume3h = entry?.rain?.['3h'] || 0
    const rainyWeather = (entry?.weather || []).some((w) =>
      ['rain', 'drizzle', 'thunderstorm'].includes(String(w.main).toLowerCase()),
    )
    return volume1h > 0 || volume3h > 0 || rainyWeather
  })
}

const getWeatherInsights = async ({ city, lat, lon }) => {
  if (!city && (lat === undefined || lon === undefined)) {
    const error = new Error('Provide city or both lat and lon')
    error.statusCode = 400
    throw error
  }

  const currentUrl = buildCurrentWeatherUrl({ city, lat, lon })
  const forecastUrl = buildForecastUrl({ city, lat, lon })

  if (!currentUrl || !forecastUrl) {
    return {
      location: city || `${lat},${lon}`,
      temperature: null,
      humidity: null,
      rainfall: 0,
      rainExpected: false,
      irrigationSuggestion: 'Configure OPENWEATHER_API_KEY to enable live weather insights.',
      weatherEnabled: false,
    }
  }

  const [current, forecast] = await Promise.all([
    fetchJson(currentUrl),
    fetchJson(forecastUrl),
  ])

  const rainfall =
    current?.rain?.['1h'] ?? current?.rain?.['3h'] ?? forecast?.list?.[0]?.rain?.['3h'] ?? 0
  const rainExpected = hasExpectedRainSoon(forecast?.list)

  return {
    location: current?.name || city || `${lat},${lon}`,
    temperature: current?.main?.temp ?? null,
    humidity: current?.main?.humidity ?? null,
    rainfall,
    rainExpected,
    irrigationSuggestion: rainExpected
      ? 'Rain expected → reduce irrigation'
      : 'No rain expected soon: continue normal irrigation plan.',
    weatherEnabled: true,
  }
}

module.exports = {
  getWeatherInsights,
}
