import {useState} from 'react';import {NavLink,Outlet,useNavigate,useLocation} from 'react-router-dom';
import {LayoutDashboard,CalendarCheck,Users,Building2,Clock,FileText,BarChart3,Settings,Menu,Bell,User,Calendar,ChevronDown,Filter} from 'lucide-react';
import {useApp} from '../../context/AppContext';import s from './Layout.module.css';
const ALL=[['/','Dashboard',LayoutDashboard,['admin','manager','employee']],['/attendance','Attendance',CalendarCheck,['admin','manager','employee']],['/employees','Employees',Users,['admin','manager']],['/departments','Departments',Building2,['admin']],['/shifts','Shifts & Schedules',Clock,['admin','manager','employee']],['/leaves','Leave Management',FileText,['admin','manager','employee']],['/reports','Reports & Analytics',BarChart3,['admin','manager','employee']],['/settings','Settings',Settings,['admin']]];
export default function Layout(){
 const {role,setRole,leaves}=useApp();const nav=useNavigate();const {pathname}=useLocation();const [col,setCol]=useState(window.innerWidth<700);const [bell,setBell]=useState(false);
 const pend=leaves.filter(l=>l.status==='Pending');const title=pathname==='/'?'Attendance Management':(ALL.find(n=>n[0]===pathname)||[])[1]||'AttendIQ';
 return <div className={s.app}>
  <aside className={`${s.side} ${col?s.col:''}`}><div className={s.logo}><i><CalendarCheck size={20}/></i><span>AttendIQ</span></div>
   {ALL.filter(n=>n[3].includes(role)).map(([to,l,I])=><NavLink key={to} to={to} end={to==='/'} className={({isActive})=>s.nav+' '+(isActive?s.act:'')}><I size={18}/><span>{l}</span></NavLink>)}
   <div className={s.help}><b>Need Help?</b><br/><span style={{color:'#1D5FE6',fontWeight:600}}>Contact Support →</span></div></aside>
  <div className={s.main}><header className={s.top}>
   <button className={s.ic} onClick={()=>setCol(!col)}><Menu size={20}/></button><i className={s.logoI}><User size={20}/></i><b className={s.title}>{title}</b><div className={s.sp}/>
   <div className={s.dt}><Calendar size={15}/>{new Date().toLocaleDateString('en-GB',{day:'numeric',month:'short',year:'numeric'})}<ChevronDown size={14}/></div>
   <button className={s.flt}><Filter size={16}/></button>
   <select value={role} onChange={e=>setRole(e.target.value)} className={s.sel}><option value="admin">Admin / HR</option><option value="manager">Manager</option><option value="employee">Employee</option></select>
   <div style={{position:'relative'}}><button className={s.ic} onClick={()=>setBell(!bell)}><Bell size={20}/></button>
    {bell&&<div style={{position:'absolute',right:0,top:30,background:'#fff',border:'1px solid #e2e8f0',borderRadius:8,padding:12,width:240,zIndex:30}}><b>Notifications</b>{pend.length?pend.map(p=><div key={p.id} style={{padding:'6px 0',fontSize:13}}>{p.empId} requested {p.type}</div>):<div>All caught up</div>}</div>}</div>
   <button className={s.mark} onClick={()=>nav('/attendance')}>Mark Attendance <ChevronDown size={14}/></button>
  </header><main className={s.page}><Outlet/></main></div></div>}
