import React from 'react'

export default function About(){
  return (
    <div className="max-w-3xl mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-2xl font-bold">About the Project</h2>
      <p className="mt-3 text-gray-700">This project explores multi-crop hydroponic systems using optimization and ML-based scheduling. The content is adapted from the project brief (PDF).</p>
      <div className="mt-4">
        <details className="mb-2">
          <summary className="font-semibold">Methodology</summary>
          <p className="text-sm text-gray-600 mt-2">Model crop growth, simulate time-step resource allocation, and compare static/adaptive/RL strategies.</p>
        </details>
        <details className="mb-2">
          <summary className="font-semibold">Tech Stack</summary>
          <ul className="text-sm text-gray-600 list-disc list-inside">
            <li>FastAPI backend with Python data processing</li>
            <li>React + Vite frontend with Plotly charts</li>
            <li>PostgreSQL for production; SQLite for local dev</li>
          </ul>
        </details>
      </div>
    </div>
  )
}
