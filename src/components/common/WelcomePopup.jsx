import {useEffect,useState} from 'react';import {ShieldCheck,Users,User} from 'lucide-react';
import {useApp} from '../../context/AppContext';import {iso} from '../../data/seed';import s from './WelcomePopup.module.css';
const OFF='attendiq2:welcome-off',SEEN='attendiq-welcomed';
export default function WelcomePopup(){
 const {setRole,employees,attendance}=useApp();
 const [open,setOpen]=useState(()=>{try{return !localStorage.getItem(OFF)&&!sessionStorage.getItem(SEEN)}catch{return true}});
 const [now,setNow]=useState(new Date());const [off,setOff]=useState(false);
 const close=r=>{try{sessionStorage.setItem(SEEN,'1');if(off)localStorage.setItem(OFF,'1')}catch{}if(r)setRole(r);setOpen(false)};
 useEffect(()=>{if(!open)return;const t=setInterval(()=>setNow(new Date()),1000);const k=e=>e.key==='Escape'&&close();window.addEventListener('keydown',k);return()=>{clearInterval(t);window.removeEventListener('keydown',k)}},[open,off]);
 if(!open)return null;
 const td=attendance.filter(a=>a.date===iso(new Date()));const pres=td.filter(a=>a.status==='Present'||a.status==='Late').length;const h=now.getHours();
 const hi=h<12?'Good morning':h<17?'Good afternoon':'Good evening';
 const R=[['admin','Admin / HR',ShieldCheck],['manager','Manager',Users],['employee','Employee',User]];
 return <div className={s.ovl} onMouseDown={e=>e.target===e.currentTarget&&close()}><div className={s.card} role="dialog" aria-modal="true" aria-label="Welcome to AttendIQ">
  <div className={s.hero}><div className={s.badge}><i className={s.ring}/><i className={`${s.ring} ${s.r2}`}/><div className={s.disc}><svg width="34" height="34" viewBox="0 0 34 34"><path className={s.chk} d="M7 18l7 7 13-14"/></svg></div></div>
   <div className={s.clock}>{now.toLocaleTimeString('en-GB')}</div><div className={s.date}>{now.toLocaleDateString('en-GB',{weekday:'long',day:'numeric',month:'long',year:'numeric'})}</div></div>
  <div className={s.body}><h2>{hi}! Welcome to AttendIQ 👋</h2><p className={s.sub}>Smart Attendance & Workforce Platform. You're all set to check in, track hours and manage your team.</p>
   <div className={s.chips}><div className={s.chip}><b>{pres}/{employees.length}</b><small>Present today</small></div><div className={s.chip}><b>{td.filter(a=>a.status==='Late').length}</b><small>Late arrivals</small></div><div className={s.chip}><b>{td.filter(a=>a.status==='On Leave').length}</b><small>On leave</small></div></div>
   <div className={s.lbl}>Choose a portal to explore</div><div className={s.roles}>{R.map(([k,l,I])=><button key={k} className={s.role} onClick={()=>close(k)}><span><I size={20}/></span>{l}</button>)}</div></div>
  <div className={s.foot}><label><input type="checkbox" checked={off} onChange={e=>setOff(e.target.checked)}/> Don't show again</label><button className={s.skip} onClick={()=>close()}>Skip</button></div></div></div>}
