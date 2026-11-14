import {useState} from 'react';import {useApp} from '../context/AppContext';import {settingsService} from '../services';import {Card,Field} from '../components/common';import s from '../components/common/ui.module.css';
const DN=['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
export default function Settings(){
 const {toast}=useApp();const [v,setV]=useState(settingsService.get());const set=(k,x)=>setV({...v,[k]:x});const nest=(g,k,x)=>setV({...v,[g]:{...v[g],[k]:x}});
 const save=()=>{if(!v.org.trim()||v.lateMin<0||v.minHours<=0||!v.days.length)return toast('Please fix invalid values');settingsService.set(v);toast('Settings saved')};
 const num=(g,k)=><Field label={k[0].toUpperCase()+k.slice(1)+' leave (days/year)'}><input type="number" min="0" className={s.in} value={v[g][k]} onChange={e=>nest(g,k,+e.target.value)}/></Field>;
 return <div><h1>Settings</h1><div className={s.grid2}>
 <Card><h2>Organization profile</h2><Field label="Organization name"><input className={s.in} value={v.org} onChange={e=>set('org',e.target.value)}/></Field></Card>
 <Card><h2>Working days</h2><div className={s.bar}>{DN.map((d,i)=><label key={d}><input type="checkbox" checked={v.days.includes(i)} onChange={e=>set('days',e.target.checked?[...v.days,i]:v.days.filter(x=>x!==i))}/> {d}</label>)}</div></Card>
 <Card><h2>Attendance rules</h2><div style={{display:'grid',gap:10}}><Field label="Late arrival threshold (minutes)"><input type="number" min="0" className={s.in} value={v.lateMin} onChange={e=>set('lateMin',+e.target.value)}/></Field><Field label="Minimum working hours / day"><input type="number" min="1" className={s.in} value={v.minHours} onChange={e=>set('minHours',+e.target.value)}/></Field></div></Card>
 <Card><h2>Leave policies</h2><div style={{display:'grid',gap:10}}>{['casual','sick','earned','unpaid'].map(k=><div key={k}>{num('leave',k)}</div>)}</div></Card>
 <Card><h2>Notification preferences</h2>{[['late','Late arrival alerts'],['leave','Leave request alerts'],['daily','Daily summary email']].map(([k,l])=><label key={k} style={{display:'block',padding:'6px 0'}}><input type="checkbox" checked={v.notify[k]} onChange={e=>nest('notify',k,e.target.checked)}/> {l}</label>)}</Card></div>
 <button className={s.btn} onClick={save}>Save settings</button> <button className={`${s.btn} ${s.ghost}`} onClick={()=>{localStorage.removeItem('attendiq2:settings');setV(settingsService.get());toast('Reset to defaults')}}>Reset</button></div>}
