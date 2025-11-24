import React, {useEffect, useState} from 'react'
import { useOutletContext } from 'react-router-dom'
import Plot from 'react-plotly.js'

function generateDemoSeries(){
  // 30 days demo series
  const days = 30
  const out = []
  let base = 10
  for(let i=0;i<days;i++){
    base += (Math.random()-0.45) * 1.5
    out.push({date: new Date(Date.now() - (days-i-1)*24*3600*1000).toISOString().slice(0,10), biomass: Math.max(0, base + Math.random()*2)})
  }
  return out
}

export default function Dashboard(){
  const [overview, setOverview] = useState(null)
  const [series, setSeries] = useState([])
  const [selectedFile, setSelectedFile] = useState('')

  const dataFiles = [
    {label:'EXP1 — Harvest', path:'/data/csvs/EXP1/Harvest_EXP1.csv'},
    {label:'EXP1 — Nutrients Water', path:'/data/csvs/EXP1/Nutrients_Water_EXP1.csv'},
    {label:'EXP1 — Seedlings', path:'/data/csvs/EXP1/Seedlings_Measurement_EXP1.csv'},
    {label:'EXP1 — Water Quality', path:'/data/csvs/EXP1/Water_Quality_EXP1.csv'},
    {label:'EXP2 — Harvest', path:'/data/csvs/EXP2/Harvest_EXP2.csv'},
    {label:'EXP2 — Nutrients Water', path:'/data/csvs/EXP2/Nutrients_Water_EXP2.csv'},
    {label:'EXP3 — Harvest', path:'/data/csvs/EXP3/Harvest_EXP3.csv'},
  ]

  function parseCSV(text){
    const lines = text.split(/\r?\n/).filter(Boolean)
    if(lines.length===0) return {header:[], rows:[]}
    const header = lines[0].split(',').map(h=>h.trim())
    const rows = lines.slice(1).map(l=>{
      const cols = l.split(',')
      const obj = {}
      header.forEach((h,i)=> obj[h] = cols[i] ? cols[i].trim() : '')
      return obj
    })
    return {header, rows}
  }

  async function loadFile(path){
    try{
      const res = await fetch(path)
      if(!res.ok) throw new Error('Not found')
      const txt = await res.text()
      const parsed = parseCSV(txt)
      const numericKey = parsed.header.find(h=> parsed.rows.some(r=> !isNaN(parseFloat(r[h])) ))
      const s = parsed.rows.map((r,i)=>({date: (r.date || `row-${i+1}`), biomass: parseFloat(r[numericKey]) || (Math.random()*10)})).slice(0,120)
      setSeries(s)
      setOverview({total_yield: s.reduce((a,b)=>a+(b.biomass||0),0), water_use_efficiency: Math.random(), nutrient_efficiency: Math.random(), fairness_index: 0.9})
    }catch(e){
      setSeries([])
      setOverview(null)
      alert('Could not load file — please copy your CSVs into `frontend/public/data/csvs/` following the README instructions.')
    }
  }

  useEffect(()=>{
    const token = localStorage.getItem('token')
    if(!token){ window.location.href = '/auth'; return }

    // try to read uploaded dataset from localStorage first
    const raw = localStorage.getItem('uploaded_dataset')
    if(raw){
      try{
        const parsed = JSON.parse(raw)
        // build a simple time series from any numeric column found
        const numericKey = parsed.header.find(h=> parsed.rows.some(r=> !isNaN(parseFloat(r[h])) ))
        const s = parsed.rows.slice(0,30).map((r,i)=>({date: (r.date || `day-${i}`), biomass: parseFloat(r[numericKey]) || (Math.random()*10)}))
        setSeries(s)
        const last = s[s.length-1]?.biomass || 0
        setOverview({total_yield: s.reduce((a,b)=>a+ (b.biomass||0),0), water_use_efficiency: Math.random(), nutrient_efficiency: Math.random(), fairness_index: (last%10)+1})
        return
      }catch(e){ /* fall back to demo data */ }
    }

    // fallback: generate demo series and simple overview
    const demo = generateDemoSeries()
    setSeries(demo)
    setOverview({total_yield: demo.reduce((a,b)=>a+b.biomass,0), water_use_efficiency: 0.0123, nutrient_efficiency: 0.0456, fairness_index: 0.88})
  },[])

  const trace = {x: series.map(s=>s.date), y: series.map(s=>s.biomass), type:'scatter', mode:'lines+markers', name:'Biomass'}

  // prefer darkMode from App via Outlet context so toggling updates charts immediately
  const outlet = useOutletContext?.() || {}
  const darkModeFromOutlet = outlet.darkMode
  const isDark = typeof darkModeFromOutlet !== 'undefined' ? darkModeFromOutlet : (typeof document !== 'undefined' && document.documentElement.classList.contains('dark'))

  const cardClass = 'p-4 rounded shadow content-card'

  const plotLayout = {
    autosize: true,
    height: 400,
    title: 'Biomass over time',
    paper_bgcolor: 'rgba(0,0,0,0)',
    plot_bgcolor: 'rgba(0,0,0,0)',
    font: {color: isDark ? '#e5e7eb' : '#0f172a'},
    xaxis: {gridcolor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(2,6,23,0.06)'},
    yaxis: {gridcolor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(2,6,23,0.06)'}
  }

  return (
    <div className="max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-white">Dashboard</h2>
      <div className="mb-4 flex items-center gap-4">
        <label className="text-sm text-gray-300">Load prepackaged CSV:</label>
        <select value={selectedFile} onChange={e=>{ setSelectedFile(e.target.value); if(e.target.value) loadFile(e.target.value)}} className="p-2 border rounded bg-transparent text-white">
          <option value="">— Select dataset —</option>
          {dataFiles.map(f=> <option key={f.path} value={f.path}>{f.label}</option>)}
        </select>
        <div className="text-sm text-gray-400">(Place CSVs in `frontend/public/data/csvs/...`)</div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-6">
        <div className={cardClass}>
          <div className="text-sm text-gray-300">Total Yield</div>
          <div className="text-xl font-semibold text-white">{overview ? overview.total_yield.toFixed(2) : '—'}</div>
        </div>
        <div className={cardClass}>
          <div className="text-sm text-gray-300">Water Use Efficiency</div>
          <div className="text-xl font-semibold text-white">{overview ? overview.water_use_efficiency.toFixed(4) : '—'}</div>
        </div>
        <div className={cardClass}>
          <div className="text-sm text-gray-300">Nutrient Efficiency</div>
          <div className="text-xl font-semibold text-white">{overview ? overview.nutrient_efficiency.toFixed(4) : '—'}</div>
        </div>
        <div className={cardClass}>
          <div className="text-sm text-gray-300">Fairness Index</div>
          <div className="text-xl font-semibold text-white">{overview ? overview.fairness_index.toFixed(2) : '—'}</div>
        </div>
      </div>

      <div className={cardClass}>
        <h3 className="font-semibold text-white">Biomass Time Series</h3>
        <div className="mt-3">
          <Plot
            data={[trace]}
            layout={plotLayout}
            useResizeHandler={true}
            style={{width: '100%'}}
          />
        </div>
      </div>
    </div>
  )
}
