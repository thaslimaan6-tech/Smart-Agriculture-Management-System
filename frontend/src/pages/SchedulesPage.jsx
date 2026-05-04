import { useEffect, useState } from 'react'
import { EmptyState, InlineError } from '../components/ui/States'
import apiClient from '../services/api'
import getErrorMessage from '../utils/getErrorMessage'

const initialForm = {
  cropId: '',
  activityType: 'irrigation',
  date: '',
}

const SchedulesPage = () => {
  const [formData, setFormData] = useState(initialForm)
  const [crops, setCrops] = useState([])
  const [upcomingTasks, setUpcomingTasks] = useState([])
  const [overdueTasks, setOverdueTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const fetchData = async () => {
    setLoading(true)
    setError('')
    try {
      const [cropsRes, upcomingRes, overdueRes] = await Promise.all([
        apiClient.get('/crops'),
        apiClient.get('/schedules/upcoming'),
        apiClient.get('/schedules/overdue'),
      ])

      const cropList = cropsRes.data?.crops || []
      setCrops(cropList)
      setUpcomingTasks(upcomingRes.data?.tasks || [])
      setOverdueTasks(overdueRes.data?.tasks || [])

      if (cropList.length > 0) {
        setFormData((prev) => ({ ...prev, cropId: prev.cropId || cropList[0]._id }))
      }
    } catch (apiError) {
      setError(getErrorMessage(apiError, 'Failed to load schedules.'))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
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
      await apiClient.post('/schedules', formData)
      setFormData((prev) => ({ ...initialForm, cropId: prev.cropId }))
      await fetchData()
    } catch (apiError) {
      setError(getErrorMessage(apiError, 'Failed to add schedule.'))
    } finally {
      setSaving(false)
    }
  }

  const markCompleted = async (scheduleId) => {
    try {
      await apiClient.patch(`/schedules/${scheduleId}/complete`)
      await fetchData()
    } catch (apiError) {
      setError(getErrorMessage(apiError, 'Failed to mark task complete.'))
    }
  }

  const renderTable = (tasks, isOverdue = false) => (
    <div className="mt-4 overflow-x-auto">
      <table className="min-w-full text-left text-sm">
        <thead className="border-b border-slate-200 text-slate-500">
          <tr>
            <th className="px-3 py-2">Crop</th>
            <th className="px-3 py-2">Activity</th>
            <th className="px-3 py-2">Date</th>
            <th className="px-3 py-2">Status</th>
            <th className="px-3 py-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {tasks.length === 0 ? (
            <tr>
              <td className="px-3 py-3 text-slate-500" colSpan={5}>
                <EmptyState label="No tasks found." />
              </td>
            </tr>
          ) : (
            tasks.map((task) => (
              <tr
                key={task._id}
                className={`border-b border-slate-100 ${
                  isOverdue ? 'bg-red-50' : ''
                }`}
              >
                <td className="px-3 py-2">{task.cropId?.cropType || '-'}</td>
                <td className="px-3 py-2 capitalize">{task.activityType}</td>
                <td className="px-3 py-2">{new Date(task.date).toLocaleString()}</td>
                <td className="px-3 py-2">
                  {isOverdue ? (
                    <span className="rounded-full bg-red-100 px-2 py-1 text-xs font-medium text-red-700">
                      Overdue
                    </span>
                  ) : (
                    <span className="rounded-full bg-amber-100 px-2 py-1 text-xs font-medium text-amber-700">
                      Upcoming
                    </span>
                  )}
                </td>
                <td className="px-3 py-2">
                  <button
                    type="button"
                    className="rounded-md bg-emerald-600 px-3 py-1 text-xs text-white transition hover:bg-emerald-700"
                    onClick={() => markCompleted(task._id)}
                  >
                    Mark Completed
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )

  return (
    <section className="space-y-6">
      <header>
        <h2 className="text-2xl font-semibold text-slate-900">Scheduling</h2>
        <p className="mt-1 text-slate-600">Plan tasks, track upcoming work, and close overdue items.</p>
      </header>

      <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h3 className="text-lg font-semibold text-slate-900">Add Schedule</h3>
        {error ? <div className="mt-4"><InlineError message={error} /></div> : null}
        <form className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3" onSubmit={handleSubmit}>
          <div>
            <label className="mb-1 block text-sm text-slate-600">Crop</label>
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
              <option value="irrigation">Irrigation</option>
              <option value="fertilizer">Fertilizer</option>
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm text-slate-600">Schedule Date</label>
            <input
              className="w-full rounded-md border border-slate-300 p-2"
              type="datetime-local"
              name="date"
              value={formData.date}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="md:col-span-3">
            <button
              type="submit"
              className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
              disabled={saving || crops.length === 0}
            >
              {saving ? 'Saving...' : 'Add Schedule'}
            </button>
          </div>
        </form>
      </article>

      <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h3 className="text-lg font-semibold text-slate-900">Upcoming Tasks</h3>
        {error ? <div className="mt-4"><InlineError message={error} onRetry={fetchData} /></div> : null}
        {loading ? <p className="mt-3 text-slate-500">Loading upcoming tasks...</p> : renderTable(upcomingTasks)}
      </article>

      <article className="rounded-xl border border-red-200 bg-white p-5 shadow-sm">
        <h3 className="text-lg font-semibold text-red-700">Overdue Tasks</h3>
        {loading ? <p className="mt-3 text-slate-500">Loading overdue tasks...</p> : renderTable(overdueTasks, true)}
      </article>
    </section>
  )
}

export default SchedulesPage
