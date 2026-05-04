import { useEffect, useMemo, useState } from 'react'
import { InlineError, LoadingState } from '../components/ui/States'
import apiClient from '../services/api'
import getErrorMessage from '../utils/getErrorMessage'

const StatCard = ({ title, value }) => (
  <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
    <p className="text-sm text-slate-500">{title}</p>
    <p className="mt-2 text-3xl font-bold text-slate-900">{value}</p>
  </article>
)

const DashboardPage = () => {
  const [dashboard, setDashboard] = useState(null)
  const [weather, setWeather] = useState(null)
  const [weatherCity, setWeatherCity] = useState(import.meta.env.VITE_WEATHER_CITY || 'Hyderabad')
  const [weatherLoading, setWeatherLoading] = useState(false)
  const [weatherError, setWeatherError] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  const fetchDashboardData = async () => {
    setLoading(true)
    setError('')

    try {
      const [dashboardRes, weatherRes] = await Promise.all([
        apiClient.get('/dashboard'),
        apiClient.get('/weather', { params: { city: weatherCity } }),
      ])

      setDashboard(dashboardRes.data)
      setWeather(weatherRes.data.weather)
    } catch (apiError) {
      setError(getErrorMessage(apiError, 'Failed to load dashboard data.'))
    } finally {
      setLoading(false)
    }
  }

  const fetchWeather = async (city) => {
    const trimmedCity = String(city || '').trim()
    if (!trimmedCity) {
      setWeatherError('Please enter a city name.')
      return
    }

    setWeatherLoading(true)
    setWeatherError('')

    try {
      const weatherRes = await apiClient.get('/weather', { params: { city: trimmedCity } })
      setWeather(weatherRes.data.weather)
    } catch (apiError) {
      setWeatherError(getErrorMessage(apiError, 'Failed to load weather data.'))
    } finally {
      setWeatherLoading(false)
    }
  }

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const upcomingAlertsCount = useMemo(() => {
    return dashboard?.alerts?.upcomingIrrigation?.length || 0
  }, [dashboard])

  if (loading) {
    return <LoadingState label="Loading dashboard..." />
  }

  if (error) {
    return <InlineError message={error} onRetry={fetchDashboardData} />
  }

  return (
    <section className="space-y-6 rounded-2xl border border-emerald-100/70 bg-white/70 p-4 shadow-sm backdrop-blur-sm sm:p-6">
      <header>
        <h2 className="text-2xl font-semibold text-slate-900">Dashboard</h2>
        <p className="mt-1 text-slate-600">Farm overview with alerts and weather insights.</p>
      </header>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Total Crops" value={dashboard?.totalCrops || 0} />
        <StatCard title="Total Activities" value={dashboard?.totalActivities || 0} />
        <StatCard title="Upcoming Alerts" value={upcomingAlertsCount} />
        <StatCard title="Overdue Alerts" value={dashboard?.alerts?.overdueActivities?.length || 0} />
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm xl:col-span-1">
          <h3 className="text-lg font-semibold text-slate-900">Weather Data</h3>
          <form
            className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center"
            onSubmit={(event) => {
              event.preventDefault()
              fetchWeather(weatherCity)
            }}
          >
            <input
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
              placeholder="Enter city (e.g., Hyderabad)"
              value={weatherCity}
              onChange={(event) => setWeatherCity(event.target.value)}
            />
            <button
              className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
              type="submit"
              disabled={weatherLoading}
            >
              {weatherLoading ? 'Updating...' : 'Update'}
            </button>
          </form>
          {weatherError ? <p className="mt-2 text-sm text-red-600">{weatherError}</p> : null}
          <dl className="mt-4 space-y-2 text-sm text-slate-700">
            <div className="flex justify-between">
              <dt>Location</dt>
              <dd className="font-medium">{weather?.location || '-'}</dd>
            </div>
            <div className="flex justify-between">
              <dt>Temperature</dt>
              <dd className="font-medium">{weather?.temperature ?? '-'} C</dd>
            </div>
            <div className="flex justify-between">
              <dt>Humidity</dt>
              <dd className="font-medium">{weather?.humidity ?? '-'}%</dd>
            </div>
            <div className="flex justify-between">
              <dt>Rainfall</dt>
              <dd className="font-medium">{weather?.rainfall ?? '-'} mm</dd>
            </div>
          </dl>
          <p className="mt-4 rounded-md bg-emerald-50 p-3 text-sm text-emerald-800">
            {weather?.rainExpected
              ? 'Rain expected → reduce irrigation'
              : weather?.irrigationSuggestion || 'No irrigation suggestion available.'}
          </p>
        </article>

        <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm xl:col-span-2">
          <h3 className="text-lg font-semibold text-slate-900">Upcoming Schedules</h3>
          <div className="mt-4 overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="border-b border-slate-200 text-slate-500">
                <tr>
                  <th className="px-3 py-2">Crop</th>
                  <th className="px-3 py-2">Activity</th>
                  <th className="px-3 py-2">Date</th>
                  <th className="px-3 py-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {(dashboard?.upcomingSchedules || []).map((item) => (
                  <tr key={item._id} className="border-b border-slate-100">
                    <td className="px-3 py-2">{item.cropId?.cropType || '-'}</td>
                    <td className="px-3 py-2 capitalize">{item.activityType}</td>
                    <td className="px-3 py-2">{new Date(item.date).toLocaleDateString()}</td>
                    <td className="px-3 py-2">
                      <span className="rounded-full bg-amber-100 px-2 py-1 text-xs font-medium text-amber-800">
                        Pending
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </article>
      </div>

      <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h3 className="text-lg font-semibold text-slate-900">Alerts</h3>
        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-slate-200 text-slate-500">
              <tr>
                <th className="px-3 py-2">Type</th>
                <th className="px-3 py-2">Crop</th>
                <th className="px-3 py-2">Date</th>
              </tr>
            </thead>
            <tbody>
              {(dashboard?.alerts?.upcomingIrrigation || []).map((item) => (
                <tr key={`upcoming-${item._id}`} className="border-b border-slate-100">
                  <td className="px-3 py-2">Upcoming Irrigation</td>
                  <td className="px-3 py-2">{item.cropId?.cropType || '-'}</td>
                  <td className="px-3 py-2">{new Date(item.date).toLocaleString()}</td>
                </tr>
              ))}
              {(dashboard?.alerts?.overdueActivities || []).map((item) => (
                <tr key={`overdue-${item._id}`} className="border-b border-slate-100">
                  <td className="px-3 py-2 text-red-700">Overdue Activity</td>
                  <td className="px-3 py-2">{item.cropId?.cropType || '-'}</td>
                  <td className="px-3 py-2">{new Date(item.date).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </article>
    </section>
  )
}

export default DashboardPage
