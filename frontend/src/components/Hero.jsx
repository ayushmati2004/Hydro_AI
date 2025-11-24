import React from 'react'
import heroUrl from '../assets/hero.svg'
import {useEffect, useState} from 'react'

export default function Hero(){
  const [bgUrl, setBgUrl] = useState('')

  useEffect(()=>{
    // prefer a user-provided hero image at public/images/site-hero.jpg
    fetch('/images/site-hero.jpg', {method:'HEAD'})
      .then(r=>{ if(r.ok) setBgUrl('/images/site-hero.jpg') })
      .catch(()=> setBgUrl(''))
  },[])

  const background = bgUrl ? `linear-gradient(rgba(255,255,255,0.6), rgba(255,255,255,0.6)), url(${bgUrl})` : `linear-gradient(rgba(255,255,255,0.06), rgba(255,255,255,0.06)), url(${heroUrl})`

  return (
    <section className="relative overflow-hidden rounded-lg p-8 flex flex-col md:flex-row items-center gap-6 hero-bg" style={{backgroundImage: background, backgroundSize:'cover', backgroundPosition:'center'}}>
      <div className="absolute inset-0 pointer-events-none" />

      <div className="relative z-10 flex-1 animate-content-fade">
        <h1 className="text-4xl md:text-6xl font-extrabold leading-tight text-white drop-shadow-lg">🌱 Hydro_Ai<br/><span className="text-teal-300">Smart Multi-Crop Scheduling</span></h1>
        <p className="mt-4 text-white/85 dark:text-gray-200 max-w-xl text-lg">Optimize water, nutrients and light across multiple crops with AI-driven resource scheduling — maximize growth while minimizing waste.</p>
        <div className="mt-6 flex gap-3">
          <a href="/dashboard" className="px-6 py-3 bg-gradient-to-br from-teal-500 to-cyan-500 text-white rounded-lg shadow-lg hover:scale-[1.01] transition-transform">Explore Dashboard</a>
          <a href="/about" className="px-6 py-3 border border-white/20 text-white/90 rounded-lg hover:bg-white/5 transition">Learn More</a>
        </div>
      </div>

      <div className="relative z-10 flex-1 hidden md:flex justify-center md:justify-end">
        <div className="w-full max-w-md animate-float">
          {/* decorative SVG when no hero image provided */}
          {!bgUrl && <img src={heroUrl} alt="hero" className="w-full h-auto rounded shadow-2xl" />}
        </div>
      </div>

      {/* torn edge SVG at the bottom of the hero */}
      <svg className="absolute bottom-0 left-0 w-full h-14 hero-torn" viewBox="0 0 1200 60" preserveAspectRatio="none" aria-hidden>
        <path d="M0,20 C120,30 240,10 360,20 C480,30 600,10 720,20 C840,30 960,10 1080,20 L1200,40 L1200,60 L0,60 Z" />
      </svg>
    </section>
  )
}
