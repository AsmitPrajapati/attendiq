import {useState} from 'react';import {Calendar,Clock,MapPin,User,Pencil,Trash2,Plus} from 'lucide-react';
import {useApp} from '../../context/AppContext';import {eventService} from '../../services';import {Card,Modal,Field} from '../../components/common';import s from '../../components/common/ui.module.css';import {iso} from '../../data/seed';
const CATS={'Company Event':['#FFF1DC','#B45309'],Meeting:['#E6EEFF','#1D5FE6'],Training:['#EDE9FE','#6D28D9'],Holiday:['#DCFCE7','#166534'],Other:['#F1F5F9','#475569']};
const fd=d=>new Date(d+'T00:00').toLocaleDateString('en-GB',{day:'numeric',month:'short',year:'numeric'});
export default function FutureEvents(){
 const {role,toast}=useApp();const [list,setList]=useState(eventService.get());const [q,setQ]=useState('');const [cat,setCat]=useState('');const [scope,setScope]=useState('');const [dir,setDir]=useState(1);const [past,setPast]=useState(false);const [m,setM]=useState(null);const [del,setDel]=useState(null);const [err,setErr]=useState('');
 const today=iso(new Date()),wk=iso(new Date(Date.now()+7*864e5));const canEdit=e=>role==='admin'||(role==='manager'&&e.scope==='team');const save=l=>setList(eventService.set(l));
 const shown=list.filter(e=>(past||e.date>=today)&&(e.title+e.location+e.organizer).toLowerCase().includes(q.toLowerCase())&&(!cat||e.category===cat)&&(!scope||e.scope===scope)).sort((a,b)=>((a.date+a.start)>(b.date+b.start)?1:-1)*dir);
 const up=list.filter(e=>e.date>=today);
 const submit=ev=>{ev.preventDefault();const f=Object.fromEntries(new FormData(ev.target));f.title=f.title.trim();
  if(!f.title||!f.date)return setErr('Title and date are required');if(!f.start!==!f.end)return setErr('Set both start and end time, or leave both empty for an all-day event');if(f.start&&f.end<=f.start)return setErr('End time must be after start time');
  const v={...m,...f,scope:role==='manager'?'team':f.scope};save(m.id?list.map(x=>x.id===m.id?v:x):[...list,{...v,id:'E'+Date.now()}]);toast('Event saved');setM(null)};
 const S=({l,v})=><Card><small style={{color:'#475569'}}>{l}</small><div className={s.big}>{v}</div></Card>;
 return <div><h2 style={{fontSize:20,marginBottom:4}}>Future Events</h2><p style={{color:'#475569',margin:'0 0 14px'}}>Stay updated with upcoming company activities and important dates.</p>
 <div className={s.grid4}><S l="Upcoming events" v={up.length}/><S l="Next 7 days" v={up.filter(e=>e.date<=wk).length}/><S l="Company-wide" v={up.filter(e=>e.scope==='company').length}/><S l="Team-level" v={up.filter(e=>e.scope==='team').length}/></div>
 <div className={s.bar}><input className={s.in} placeholder="Search events" value={q} onChange={e=>setQ(e.target.value)}/><select className={s.in} value={cat} onChange={e=>setCat(e.target.value)}><option value="">All categories</option>{Object.keys(CATS).map(c=><option key={c}>{c}</option>)}</select>
  <select className={s.in} value={scope} onChange={e=>setScope(e.target.value)}><option value="">All levels</option><option value="company">Company-wide</option><option value="team">Team-level</option></select>
  <select className={s.in} value={dir} onChange={e=>setDir(+e.target.value)}><option value={1}>Soonest first</option><option value={-1}>Latest first</option></select>
  <label><input type="checkbox" checked={past} onChange={e=>setPast(e.target.checked)}/> Include past</label>
  {role!=='employee'&&<button className={s.btn} onClick={()=>{setErr('');setM({category:'Meeting',scope:'team',organizer:role==='admin'?'HR Admin':'Team Manager'})}}><Plus size={15}/> {role==='admin'?'Create event':'Create team event'}</button>}</div>
 {!shown.length?<Card><div className={s.empty}>No events match your filters.</div></Card>:<div className={s.evs}>{shown.map(e=>{const [bg,c]=CATS[e.category]||CATS.Other;return <Card key={e.id}>
  <div style={{display:'flex',justifyContent:'space-between',gap:8}}><b>{e.title}</b><span className={s.badge} style={{background:bg,color:c,height:'fit-content'}}>{e.category}</span></div>
  <div className={s.meta}><Calendar size={14}/>{fd(e.date)}</div><div className={s.meta}><Clock size={14}/>{e.start?`${e.start} – ${e.end}`:'All Day'}</div><div className={s.meta}><MapPin size={14}/>{e.location||'TBD'}</div><div className={s.meta}><User size={14}/>{e.organizer} · {e.scope==='company'?'Company-wide':'Team'}</div>
  <p style={{color:'#334155',fontSize:13}}>{e.desc}</p>
  {canEdit(e)&&<div className={s.bar} style={{marginBottom:0}}><button className={`${s.btn} ${s.ghost}`} onClick={()=>{setErr('');setM(e)}}><Pencil size={14}/> Edit</button><button className={`${s.btn} ${s.danger}`} onClick={()=>setDel(e)}><Trash2 size={14}/> Delete</button></div>}</Card>})}</div>}
 {m&&<Modal title={m.id?'Edit event':'Create event'} onClose={()=>setM(null)}><form onSubmit={submit} style={{display:'grid',gap:10}}>
  <Field label="Title" error={err}><input name="title" className={s.in} defaultValue={m.title}/></Field><Field label="Category"><select name="category" className={s.in} defaultValue={m.category}>{Object.keys(CATS).map(c=><option key={c}>{c}</option>)}</select></Field>
  <Field label="Date"><input type="date" name="date" className={s.in} defaultValue={m.date}/></Field><Field label="Start time"><input type="time" name="start" className={s.in} defaultValue={m.start}/></Field><Field label="End time"><input type="time" name="end" className={s.in} defaultValue={m.end}/></Field>
  <Field label="Location / meeting link"><input name="location" className={s.in} defaultValue={m.location}/></Field><Field label="Organizer"><input name="organizer" className={s.in} defaultValue={m.organizer}/></Field>
  {role==='admin'&&<Field label="Level"><select name="scope" className={s.in} defaultValue={m.scope}><option value="company">Company-wide</option><option value="team">Team-level</option></select></Field>}
  <Field label="Description"><input name="desc" className={s.in} defaultValue={m.desc}/></Field><button className={s.btn}>Save event</button></form></Modal>}
 {del&&<Modal title="Delete event?" onClose={()=>setDel(null)}><p>"{del.title}" will be removed.</p><button className={`${s.btn} ${s.danger}`} onClick={()=>{save(list.filter(x=>x.id!==del.id));toast('Event deleted');setDel(null)}}>Delete</button></Modal>}</div>}
