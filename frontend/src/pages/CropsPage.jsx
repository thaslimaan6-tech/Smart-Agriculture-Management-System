import { useEffect, useState } from 'react'
import { EmptyState, InlineError } from '../components/ui/States'
import apiClient from '../services/api'
import getErrorMessage from '../utils/getErrorMessage'

const initialForm = {
  cropType: '',
  plantingDate: '',
  harvestDate: '',
  growthStage: '',
}

const cropTypeOptions = [
  'Rice',
  'Wheat',
  'Maize',
  'Cotton',
  'Sugarcane',
  'Tomato',
  'Potato',
  'Onion',
  'Chilli',
  'Groundnut',
]

const growthStageOptions = ['seed', 'germination', 'vegetative', 'flowering', 'harvest']

const CropsPage = () => {
  const [formData, setFormData] = useState(initialForm)
  const [crops, setCrops] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [editCropId, setEditCropId] = useState(null)

  const fetchCrops = async () => {
    setLoading(true)
    setError('')
    try {
      const { data } = await apiClient.get('/crops')
      setCrops(data.crops || [])
    } catch (apiError) {
      setError(getErrorMessage(apiError, 'Failed to fetch crops.'))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCrops()
  }, [])

  const handleInputChange = (event) => {
    const { name, value } = event.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const resetForm = () => {
    setFormData(initialForm)
    setEditCropId(null)
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setSaving(true)
    setError('')
    try {
      if (editCropId) {
        await apiClient.put(`/crops/${editCropId}`, formData)
      } else {
        await apiClient.post('/crops', formData)
      }
      resetForm()
      await fetchCrops()
    } catch (apiError) {
      setError(getErrorMessage(apiError, 'Failed to save crop.'))
    } finally {
      setSaving(false)
    }
  }

  const handleEdit = (crop) => {
    setEditCropId(crop._id)
    setFormData({
      cropType: crop.cropType || '',
      plantingDate: crop.plantingDate ? crop.plantingDate.slice(0, 10) : '',
      harvestDate: crop.harvestDate ? crop.harvestDate.slice(0, 10) : '',
      growthStage: crop.growthStage || '',
    })
  }

  const handleDelete = async (cropId) => {
    try {
      await apiClient.delete(`/crops/${cropId}`)
      await fetchCrops()
    } catch (apiError) {
      setError(getErrorMessage(apiError, 'Failed to delete crop.'))
    }
  }

  const handleGrowthStageUpdate = async (cropId, growthStage) => {
    try {
      await apiClient.patch(`/crops/${cropId}/growth-stage`, { growthStage })
      await fetchCrops()
    } catch (apiError) {
      setError(getErrorMessage(apiError, 'Failed to update growth stage.'))
    }
  }

  return (
    <section className="space-y-6">
      <header>
        <h2 className="text-2xl font-semibold text-slate-900">Crop Management</h2>
        <p className="mt-1 text-slate-600">Add, edit, and track crop growth stages.</p>
      </header>

      <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h3 className="text-lg font-semibold text-slate-900">
          {editCropId ? 'Edit Crop' : 'Add Crop'}
        </h3>
        {error ? <div className="mt-4"><InlineError message={error} /></div> : null}
        <form className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2" onSubmit={handleSubmit}>
          <select
            className="rounded-md border border-slate-300 p-2"
            name="cropType"
            value={formData.cropType}
            onChange={handleInputChange}
            required
          >
            <option value="" disabled>
              Select crop type
            </option>
            {cropTypeOptions.map((cropType) => (
              <option key={cropType} value={cropType}>
                {cropType}
              </option>
            ))}
          </select>
          <select
            className="rounded-md border border-slate-300 p-2"
            name="growthStage"
            value={formData.growthStage}
            onChange={handleInputChange}
            required
          >
            <option value="" disabled>
              Select growth stage
            </option>
            {growthStageOptions.map((stage) => (
              <option key={stage} value={stage}>
                {stage}
              </option>
            ))}
          </select>
          <div>
            <label className="mb-1 block text-sm text-slate-600">Planting Date</label>
            <input
              className="w-full rounded-md border border-slate-300 p-2"
              type="date"
              name="plantingDate"
              value={formData.plantingDate}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <label className="mb-1 block text-sm text-slate-600">Harvest Date</label>
            <input
              className="w-full rounded-md border border-slate-300 p-2"
              type="date"
              name="harvestDate"
              value={formData.harvestDate}
              onChange={handleInputChange}
            />
          </div>

          <div className="flex gap-2 md:col-span-2">
            <button
              className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
              type="submit"
              disabled={saving}
            >
              {saving ? 'Saving...' : editCropId ? 'Update Crop' : 'Add Crop'}
            </button>
            {editCropId ? (
              <button
                className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
                type="button"
                onClick={resetForm}
              >
                Cancel Edit
              </button>
            ) : null}
          </div>
        </form>
      </article>

      <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h3 className="text-lg font-semibold text-slate-900">Crop List</h3>
        {error ? <div className="mt-4"><InlineError message={error} onRetry={fetchCrops} /></div> : null}
        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-slate-200 text-slate-500">
              <tr>
                <th className="px-3 py-2">Crop Type</th>
                <th className="px-3 py-2">Planting Date</th>
                <th className="px-3 py-2">Harvest Date</th>
                <th className="px-3 py-2">Growth Stage</th>
                <th className="px-3 py-2">Update Stage</th>
                <th className="px-3 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td className="px-3 py-3 text-slate-500" colSpan={6}>
                    Loading crops...
                  </td>
                </tr>
              ) : crops.length === 0 ? (
                <tr>
                  <td className="px-3 py-3 text-slate-500" colSpan={6}>
                    <EmptyState label="No crops added yet." />
                  </td>
                </tr>
              ) : (
                crops.map((crop) => (
                  <tr key={crop._id} className="border-b border-slate-100">
                    <td className="px-3 py-2">{crop.cropType}</td>
                    <td className="px-3 py-2">
                      {crop.plantingDate
                        ? new Date(crop.plantingDate).toLocaleDateString()
                        : '-'}
                    </td>
                    <td className="px-3 py-2">
                      {crop.harvestDate ? new Date(crop.harvestDate).toLocaleDateString() : '-'}
                    </td>
                    <td className="px-3 py-2 capitalize">{crop.growthStage}</td>
                    <td className="px-3 py-2">
                      <select
                        defaultValue={crop.growthStage}
                        className="rounded-md border border-slate-300 px-2 py-1"
                        onChange={(event) =>
                          handleGrowthStageUpdate(crop._id, event.target.value)
                        }
                      >
                        <option value="seed">Seed</option>
                        <option value="germination">Germination</option>
                        <option value="vegetative">Vegetative</option>
                        <option value="flowering">Flowering</option>
                        <option value="harvest">Harvest</option>
                      </select>
                    </td>
                    <td className="px-3 py-2">
                      <div className="flex gap-2">
                        <button
                          type="button"
                          className="rounded-md bg-blue-600 px-3 py-1 text-xs text-white"
                          onClick={() => handleEdit(crop)}
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          className="rounded-md bg-red-600 px-3 py-1 text-xs text-white"
                          onClick={() => handleDelete(crop._id)}
                        >
                          Delete
                        </button>
                      </div>
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

export default CropsPage
