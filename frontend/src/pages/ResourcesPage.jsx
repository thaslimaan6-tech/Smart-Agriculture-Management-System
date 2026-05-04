import { useEffect, useState } from 'react'
import { EmptyState, InlineError } from '../components/ui/States'
import apiClient from '../services/api'
import getErrorMessage from '../utils/getErrorMessage'

const initialForm = {
  type: 'water',
  quantity: '',
  date: '',
}

const ResourcesPage = () => {
  const [formData, setFormData] = useState(initialForm)
  const [resources, setResources] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const fetchResources = async () => {
    setLoading(true)
    setError('')
    try {
      const { data } = await apiClient.get('/resources')
      setResources(data.resources || [])
    } catch (apiError) {
      setError(getErrorMessage(apiError, 'Failed to fetch resources.'))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchResources()
  }, [])

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setSaving(true)
    setError('')

    try {
      await apiClient.post('/resources', {
        ...formData,
        quantity: Number(formData.quantity),
      })
      setFormData(initialForm)
      await fetchResources()
    } catch (apiError) {
      setError(getErrorMessage(apiError, 'Failed to add resource usage.'))
    } finally {
      setSaving(false)
    }
  }

  return (
    <section className="space-y-6">
      <header>
        <h2 className="text-2xl font-semibold text-slate-900">Resource Management</h2>
        <p className="mt-1 text-slate-600">Track water, fertilizer, and pesticide usage.</p>
      </header>

      <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h3 className="text-lg font-semibold text-slate-900">Add Resource Usage</h3>
        {error ? <div className="mt-4"><InlineError message={error} /></div> : null}
        <form className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3" onSubmit={handleSubmit}>
          <div>
            <label className="mb-1 block text-sm text-slate-600">Type</label>
            <select
              className="w-full rounded-md border border-slate-300 p-2"
              name="type"
              value={formData.type}
              onChange={handleChange}
              required
            >
              <option value="water">Water</option>
              <option value="fertilizer">Fertilizer</option>
              <option value="pesticide">Pesticide</option>
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm text-slate-600">Quantity</label>
            <input
              className="w-full rounded-md border border-slate-300 p-2"
              type="number"
              min="0"
              step="0.01"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              placeholder="e.g. 25"
              required
            />
          </div>

          <div>
            <label className="mb-1 block text-sm text-slate-600">Date</label>
            <input
              className="w-full rounded-md border border-slate-300 p-2"
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
            />
          </div>

          <div className="md:col-span-3">
            <button
              className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
              type="submit"
              disabled={saving}
            >
              {saving ? 'Saving...' : 'Add Usage'}
            </button>
          </div>
        </form>
      </article>

      <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h3 className="text-lg font-semibold text-slate-900">Resource Usage History</h3>
        {error ? <div className="mt-4"><InlineError message={error} onRetry={fetchResources} /></div> : null}
        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-slate-200 text-slate-500">
              <tr>
                <th className="px-3 py-2">Type</th>
                <th className="px-3 py-2">Quantity</th>
                <th className="px-3 py-2">Date</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td className="px-3 py-3 text-slate-500" colSpan={3}>
                    Loading resources...
                  </td>
                </tr>
              ) : resources.length === 0 ? (
                <tr>
                  <td className="px-3 py-3 text-slate-500" colSpan={3}>
                    <EmptyState label="No resource records found." />
                  </td>
                </tr>
              ) : (
                resources.map((resource) => (
                  <tr key={resource._id} className="border-b border-slate-100">
                    <td className="px-3 py-2 capitalize">{resource.type}</td>
                    <td className="px-3 py-2">{resource.quantity}</td>
                    <td className="px-3 py-2">
                      {resource.date ? new Date(resource.date).toLocaleDateString() : '-'}
                    </td>
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

export default ResourcesPage
