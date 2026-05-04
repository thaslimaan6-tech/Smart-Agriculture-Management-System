import { useEffect, useState } from 'react'
import { EmptyState, InlineError } from '../components/ui/States'
import apiClient from '../services/api'
import getErrorMessage from '../utils/getErrorMessage'

const initialForm = {
  cropId: '',
  activityType: 'watering',
  date: '',
  description: '',
}

const ActivitiesPage = () => {
  const [formData, setFormData] = useState(initialForm)
  const [crops, setCrops] = useState([])
  const [activities, setActivities] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const fetchPageData = async () => {
    setLoading(true)
    setError('')

    try {
      const [cropsRes, activitiesRes] = await Promise.all([
        apiClient.get('/crops'),
        apiClient.get('/activities'),
      ])

      const cropList = cropsRes.data?.crops || []
      setCrops(cropList)
      setActivities(activitiesRes.data?.activities || [])

      if (cropList.length > 0) {
        setFormData((prev) => ({ ...prev, cropId: prev.cropId || cropList[0]._id }))
      }
    } catch (apiError) {
      setError(getErrorMessage(apiError, 'Failed to load activities data.'))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPageData()
  }, [])

  const handleInputChange = (event) => {
    const { name, value } = event.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setSaving(true)
    setError('')

    try {
      await apiClient.post('/activities', formData)
      setFormData((prev) => ({ ...initialForm, cropId: prev.cropId }))
      const { data } = await apiClient.get('/activities')
      setActivities(data.activities || [])
    } catch (apiError) {
      setError(getErrorMessage(apiError, 'Failed to add activity.'))
    } finally {
      setSaving(false)
    }
  }

  return (
    <section className="space-y-6">
      <header>
        <h2 className="text-2xl font-semibold text-slate-900">Activity Management</h2>
        <p className="mt-1 text-slate-600">Add activities and review history by crop.</p>
      </header>

      <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h3 className="text-lg font-semibold text-slate-900">Add Activity</h3>
        {error ? <div className="mt-4"><InlineError message={error} /></div> : null}
        <form className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2" onSubmit={handleSubmit}>
          <div>
            <label className="mb-1 block text-sm text-slate-600">Select Crop</label>
            <select
              className="w-full rounded-md border border-slate-300 p-2"
              name="cropId"
              value={formData.cropId}
              onChange={handleInputChange}
              required
              disabled={crops.length === 0}
            >
              {crops.length === 0 ? (
                <option value="">No crops available</option>
              ) : (
                crops.map((crop) => (
                  <option key={crop._id} value={crop._id}>
                    {crop.cropType}
                  </option>
                ))
              )}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm text-slate-600">Activity Type</label>
            <select
              className="w-full rounded-md border border-slate-300 p-2"
              name="activityType"
              value={formData.activityType}
              onChange={handleInputChange}
              required
            >
              <option value="watering">Watering</option>
              <option value="fertilizing">Fertilizing</option>
              <option value="pesticide">Pesticide</option>
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm text-slate-600">Date</label>
            <input
              className="w-full rounded-md border border-slate-300 p-2"
              type="date"
              name="date"
              value={formData.date}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="md:col-span-2">
            <label className="mb-1 block text-sm text-slate-600">Description</label>
            <textarea
              className="w-full rounded-md border border-slate-300 p-2"
              rows={3}
              name="description"
              placeholder="Optional notes about this activity"
              value={formData.description}
              onChange={handleInputChange}
            />
          </div>

          <div className="md:col-span-2">
            <button
              className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
              type="submit"
              disabled={saving || crops.length === 0}
            >
              {saving ? 'Saving...' : 'Add Activity'}
            </button>
          </div>
        </form>
      </article>

      <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h3 className="text-lg font-semibold text-slate-900">Activity History</h3>
        {error ? <div className="mt-4"><InlineError message={error} onRetry={fetchPageData} /></div> : null}

        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-slate-200 text-slate-500">
              <tr>
                <th className="px-3 py-2">Crop</th>
                <th className="px-3 py-2">Type</th>
                <th className="px-3 py-2">Date</th>
                <th className="px-3 py-2">Description</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td className="px-3 py-3 text-slate-500" colSpan={4}>
                    Loading activities...
                  </td>
                </tr>
              ) : activities.length === 0 ? (
                <tr>
                  <td className="px-3 py-3 text-slate-500" colSpan={4}>
                    <EmptyState label="No activity history found." />
                  </td>
                </tr>
              ) : (
                activities.map((activity) => (
                  <tr key={activity._id} className="border-b border-slate-100">
                    <td className="px-3 py-2">{activity.cropId?.cropType || '-'}</td>
                    <td className="px-3 py-2 capitalize">{activity.activityType}</td>
                    <td className="px-3 py-2">
                      {activity.date ? new Date(activity.date).toLocaleDateString() : '-'}
                    </td>
                    <td className="px-3 py-2">{activity.description || '-'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </article>
    </section>
  )
}

export default ActivitiesPage
