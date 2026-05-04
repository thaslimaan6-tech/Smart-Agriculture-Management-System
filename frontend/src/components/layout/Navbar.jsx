import { clearToken } from '../../services/authStorage'

const Navbar = ({ onMenuToggle }) => {
  const handleLogout = () => {
    clearToken()
    window.location.href = '/login'
  }

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur sm:px-6">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onMenuToggle}
          className="rounded-md border border-slate-300 px-2 py-1 text-slate-700 lg:hidden"
          aria-label="Open menu"
        >
          Menu
        </button>
        <h1 className="text-base font-semibold text-slate-900 sm:text-lg">Smart Agriculture</h1>
      </div>
      <button
        type="button"
        onClick={handleLogout}
        className="rounded-md bg-slate-900 px-3 py-2 text-sm font-medium text-white transition hover:bg-slate-700"
      >
        Logout
      </button>
    </header>
  )
}

export default Navbar
