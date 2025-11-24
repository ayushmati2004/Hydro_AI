import React, {useState} from 'react'

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

export default function Upload(){
  const [file, setFile] = useState(null)
  const [msg, setMsg] = useState('')

  function handleUpload(e){
    e.preventDefault()
    const token = localStorage.getItem('token')
    if(!token){ window.location.href = '/auth'; return }
    if(!file){ setMsg('Choose a CSV file'); return }
    const reader = new FileReader()
    reader.onload = function(ev){
      const txt = ev.target.result
      const parsed = parseCSV(txt)
      // store small preview in localStorage for Dashboard demo
      localStorage.setItem('uploaded_dataset', JSON.stringify(parsed))
      setMsg(`Parsed ${parsed.rows.length} rows — preview saved locally`)
    }
    reader.readAsText(file)
  }

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded shadow">
      <h3 className="text-xl font-semibold mb-3">Upload CSV Dataset</h3>
      <form onSubmit={handleUpload} className="space-y-3">
        <input type="file" accept=".csv" onChange={e=>setFile(e.target.files[0])} />
        <button className="px-4 py-2 bg-blue-600 text-white rounded">Upload / Parse (client)</button>
      </form>
      <div className="mt-2 text-sm text-gray-600">{msg}</div>
    </div>
  )
}
