import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'
import Sidebar from './Sidebar'

const AppLayout = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-100 via-lime-50 to-teal-100 text-slate-900">
      <Navbar onMenuToggle={() => setMobileMenuOpen((prev) => !prev)} />
      <div className="flex">
        {mobileMenuOpen ? (
          <button
            type="button"
            aria-label="Close menu overlay"
            className="fixed inset-0 z-30 bg-slate-900/30 lg:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />
        ) : null}
        <Sidebar mobileOpen={mobileMenuOpen} onNavigate={() => setMobileMenuOpen(false)} />
        <main className="w-full flex-1 p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default AppLayout
