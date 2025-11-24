import React from 'react'

export default function RightDots(){
  const sections = [
    {id:'section-what', title:'What'},
    {id:'section-goals', title:'Goals'},
    {id:'section-why', title:'Why'},
    {id:'section-measure', title:'Measure'}
  ]

  const [active, setActive] = React.useState(sections[0].id)

  React.useEffect(()=>{
    function onScroll(){
      for(const s of sections){
        const el = document.getElementById(s.id)
        if(!el) continue
        const rect = el.getBoundingClientRect()
        if(rect.top <= (window.innerHeight/2) && rect.bottom >= (window.innerHeight/4)){
          setActive(s.id); break
        }
      }
    }
    onScroll()
    window.addEventListener('scroll', onScroll, {passive:true})
    return ()=> window.removeEventListener('scroll', onScroll)
  },[])

  return (
    <nav className="right-dots" aria-label="Section navigation">
      {sections.map(s=> (
        <a key={s.id} href={`#${s.id}`} className={s.id===active? 'active':''} title={s.title} />
      ))}
    </nav>
  )
}
