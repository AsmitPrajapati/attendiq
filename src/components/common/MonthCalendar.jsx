import {Card} from './index';import s from './ui.module.css';import {iso} from '../../data/seed';import {useApp} from '../../context/AppContext';
const SC={Present:'#DDF0E6',Late:'#F7E8D0','Half Day':'#F7E8D0',Absent:'#F6D9D9','On Leave':'#DDE4FB',Holiday:'#F0EDE7'};
export default function MonthCalendar({emp='',dept=''}){
 const {role,me,employees,attendance}=useApp();const n=new Date(),y=n.getFullYear(),m=n.getMonth(),last=new Date(y,m+1,0).getDate(),off=(new Date(y,m,1).getDay()+6)%7;
 const cells=[...Array(off).fill(null),...Array.from({length:last},(_,i)=>i+1)];const today=iso(n);const P=x=>x==='Present'||x==='Late';
 const scope=role==='employee'?me.id:emp;const ids=new Set(employees.filter(e=>!dept||e.dept===dept).map(e=>e.id));
 const at=attendance.filter(a=>scope?a.empId===scope:ids.has(a.empId));const td=at.filter(a=>a.date===today);
 const info=d=>{const r=at.filter(a=>a.date===iso(new Date(Date.UTC(y,m,d))));if(!r.length)return{bg:'#F0EDE7',t:''};
  if(scope)return{bg:SC[r[0].status],t:r[0].status};const p=Math.round(r.filter(a=>P(a.status)).length/r.length*100);return{bg:p>=85?'#DDF0E6':p>=65?'#F7E8D0':'#F6D9D9',t:p+'% present'}};
 const T=td.length,pp=td.filter(a=>P(a.status)).length;const c=x=>td.filter(a=>a.status===x).length;
 const St=({l,v,pill,bg,c})=><Card><small style={{color:'#475569'}}>{l}</small><div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginTop:8}}><span className={s.big}>{v}</span>{pill&&<span className={s.pill} style={{background:bg,color:c}}>{pill}</span>}</div></Card>;
 const who=scope?employees.find(e=>e.id===scope)?.name:dept||'All employees';
 return <div><p style={{color:'#475569',margin:'0 0 14px'}}>{n.toLocaleString('en',{month:'long'})} {y} · {who}</p>
 <div className={s.grid4}><St l="Present today" v={pp} pill={T?Math.round(pp/T*100)+'%':''} bg="#DDF0E6" c="#15803D"/><St l="On leave" v={c('On Leave')}/><St l="Late check-ins" v={c('Late')}/><St l="Absent" v={c('Absent')}/></div>
 <Card><div className={s.cal}>{['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map(d=><div key={d} className={s.h}>{d}</div>)}
 {cells.map((d,i)=>{if(!d)return <div key={i}/>;const x=info(d);return <div key={i} className={s.cell} style={{background:x.bg}}><b style={{fontWeight:500}}>{d}</b><small>{x.t}</small></div>})}</div></Card></div>}
