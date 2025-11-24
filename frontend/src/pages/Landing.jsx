import React from 'react'
import Hero from '../components/Hero'
import RightDots from '../components/RightDots'

export default function Landing(){
  return (
    <div className="max-w-6xl mx-auto space-y-6 relative">
      <RightDots />

      <div className="pt-8">
        <Hero />
      </div>

      <section id="section-what" className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="rounded-xl shadow content-card">
          <div className="p-6">
            <h3 className="font-semibold text-lg">⭐ What Hydro_Ai Does</h3>
            <p className="text-gray-700 dark:text-gray-300 mt-2">Hydro_Ai grows multiple crops together in one hydroponic system and uses AI to share water, nutrients and light intelligently.</p>
            <p className="text-gray-600 dark:text-gray-400 mt-2">Each plant gets what it needs in real time for maximum growth and minimum waste.</p>
          </div>
        </div>

        <div className="rounded-xl shadow content-card">
          <div className="p-6">
            <h3 className="font-semibold text-lg">🎯 Core Goals</h3>
            <ul className="list-disc list-inside mt-2 text-gray-600 dark:text-gray-300">
              <li>Build growth models that understand crop needs</li>
              <li>Simulate crop mixes and allocation</li>
              <li>Optimize and forecast resource plans</li>
              <li>Visualize and compare strategies</li>
            </ul>
          </div>
        </div>

        <div className="rounded-xl shadow content-card">
          <div className="p-6">
            <h3 className="font-semibold text-lg">🚀 Why Hydro_Ai Matters</h3>
            <p className="text-gray-600 dark:text-gray-400 mt-2">Traditional hydroponics often treats all plants the same, causing waste and uneven yields. Hydro_Ai brings efficiency and sustainability—valuable for urban farms, water-scarce regions, and space missions.</p>
          </div>
        </div>
      </section>

      <section id="section-goals" className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="rounded-xl shadow content-card">
          <div className="p-6">
            <h4 className="text-sm text-gray-500">Learning</h4>
            <p className="font-semibold mt-1">Analyze crop water, nutrient and light needs with scientific models.</p>
          </div>
        </div>
        <div className="rounded-xl shadow content-card">
          <div className="p-6">
            <h4 className="text-sm text-gray-500">Simulation</h4>
            <p className="font-semibold mt-1">Run time-step simulations of shared hydroponic systems.</p>
          </div>
        </div>
        <div className="rounded-xl shadow content-card">
          <div className="p-6">
            <h4 className="text-sm text-gray-500">AI & Optimization</h4>
            <p className="font-semibold mt-1">Use LP, NSGA-II, forecasting and RL to allocate resources.</p>
          </div>
        </div>
      </section>

      <section id="section-measure" className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-xl shadow content-card">
          <div className="p-6">
            <h3 className="font-semibold">🔬 Measuring What Works</h3>
            <p className="text-gray-600 dark:text-gray-400 mt-2">Yield per crop, total yield, water & nutrient efficiency, and fairness are measured and compared using statistical tests.</p>
          </div>
        </div>
        <div className="rounded-xl shadow content-card">
          <div className="p-6">
            <h3 className="font-semibold">🌍 Real-World Impact</h3>
            <p className="text-gray-600 dark:text-gray-400 mt-2">Hydro_Ai helps agri-tech companies, urban farmers and space missions design efficient, reliable multi-crop systems.</p>
          </div>
        </div>
      </section>
    </div>
  )
}
