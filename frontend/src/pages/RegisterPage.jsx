import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { InlineError } from '../components/ui/States'
import apiClient from '../services/api'
import getErrorMessage from '../utils/getErrorMessage'

const RegisterPage = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({ name: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setLoading(true)

    try {
      await apiClient.post('/auth/register', formData)
      navigate('/login')
    } catch (apiError) {
      setError(getErrorMessage(apiError, 'Registration failed. Please try again.'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <section className="w-full max-w-md rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-2xl font-bold text-slate-900">Register</h2>
        <p className="mt-2 text-sm text-slate-600">
          Create your account to manage your farm.
        </p>
        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <input
            className="w-full rounded-md border border-slate-300 p-2"
            placeholder="Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <input
            className="w-full rounded-md border border-slate-300 p-2"
            placeholder="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            className="w-full rounded-md border border-slate-300 p-2"
            type="password"
            placeholder="Password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          {error ? <InlineError message={error} /> : null}
          <button
            className="w-full rounded-md bg-slate-900 p-2 text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
            type="submit"
            disabled={loading}
          >
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>
        <p className="mt-4 text-sm text-slate-600">
          Already have an account?{' '}
          <Link className="font-medium text-slate-900" to="/login">
            Login
          </Link>
        </p>
      </section>
    </main>
  )
}

export default RegisterPage
