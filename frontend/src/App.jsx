import React from 'react'
import { Outlet, Link, useLocation } from 'react-router-dom'
import LogoUrl from './assets/logo.svg'
import heroUrl from './assets/hero.svg'

function TopHeader({darkMode, onToggleDark}){
  return (
    <div className="bg-transparent">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between text-gray-300 text-sm">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2"><svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12v6M8 12v6M12 6v6"/></svg> needhelp@hydro_ai.com</div>
          <div className="flex items-center gap-2"><svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5h12M9 3v2m6 4h6"/></svg> 666 888 0000</div>
        </div>
        <div className="flex items-center gap-3 text-gray-400">
          <button title="Toggle dark mode" onClick={onToggleDark} className="rounded-full bg-gray-100 dark:bg-gray-800 w-8 h-8 flex items-center justify-center">{darkMode? '🌙' : '☀️'}</button>
          <button className="rounded-full bg-gray-100 dark:bg-gray-800 w-8 h-8 flex items-center justify-center">f</button>
          <button className="rounded-full bg-gray-100 dark:bg-gray-800 w-8 h-8 flex items-center justify-center">t</button>
        </div>
      </div>
      <div className="border-t border-gray-800/30" />
    </div>
  )
}

function MainNav(){
  const loc = useLocation()
  return (
    <header className="bg-transparent">
      <div className="max-w-6xl mx-auto px-4 py-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-3xl font-extrabold text-white">🌱 Hydro_Ai</h1>
          <div className="text-sm text-gray-300">Smart Multi-Crop Hydroponic Farming Powered by AI &amp; Intelligent Resource Scheduling</div>
        </div>
        <div className="flex items-center gap-6">
          <nav className="hidden md:flex items-center gap-6 text-sm text-gray-600 dark:text-gray-300">
            <Link to="/" className={`py-2 ${loc.pathname==='/'? 'text-yellow-500 font-semibold':''}`}>Home</Link>
            <Link to="/about" className="py-2">Services</Link>
            <Link to="/dashboard" className="py-2">Projects</Link>
            <Link to="/dashboard" className="py-2">Shop</Link>
            <Link to="/auth" className="py-2 text-teal-600">Sign In</Link>
          </nav>
          <div className="w-20 hidden md:block">
            <img src={LogoUrl} alt="logo" />
          </div>
        </div>
      </div>
      <div className="border-t border-gray-800/20" />
    </header>
  )
}

export default function App(){
  const [darkMode, setDarkMode] = React.useState(()=> {
    try{ return localStorage.getItem('hydro_dark') === '1' }catch(e){return false}
  })

  React.useEffect(()=>{
    document.documentElement.classList.toggle('dark', darkMode)
    try{ localStorage.setItem('hydro_dark', darkMode? '1':'0') }catch(e){}
  },[darkMode])

  // Background now handled via CSS to ensure the user-provided image
  // at `/images/site-hero.jpg` is applied as the site-wide background.

  function toggleDark(){ setDarkMode(d=>!d) }

  return (
    <div className="min-h-screen bg-transparent text-slate-100">
      <TopHeader darkMode={darkMode} onToggleDark={toggleDark} />
      <MainNav />
      <main className="p-6">
        <Outlet context={{darkMode}} />
      </main>
    </div>
  )
}
