import React, {useState} from 'react'

export default function Auth(){
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [msg, setMsg] = useState('')

  function handleLogin(e){
    e.preventDefault()
    // Simple client-side mock login for static frontend
    if(!email || !password){ setMsg('Enter email and password'); return }
    localStorage.setItem('token', 'demo-token')
    setMsg('Logged in (demo)')
    setTimeout(()=> window.location.href = '/dashboard', 600)
  }

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded shadow">
      <h3 className="text-xl font-semibold mb-3">Sign In</h3>
      <form onSubmit={handleLogin} className="space-y-3">
        <input className="w-full p-2 border rounded" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
        <input className="w-full p-2 border rounded" placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
        <button className="px-4 py-2 bg-blue-600 text-white rounded">Sign In</button>
      </form>
      <div className="mt-2 text-sm text-gray-600">{msg}</div>
    </div>
  )
}
