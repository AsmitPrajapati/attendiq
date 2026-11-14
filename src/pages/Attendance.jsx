import {useState,useMemo} from 'react';import {useApp} from '../context/AppContext';import {Card,Badge,Modal,Field,downloadCSV,hours} from '../components/common';
import MonthCalendar from '../components/common/MonthCalendar';import s from '../components/common/ui.module.css';import {DEPTS,STATUSES,iso} from '../data/seed';
const PER=8;
export default function Attendance(){
 const {role,me,employees,attendance,saveAttendance}=useApp();
 const [q,setQ]=useState('');const [dept,setDept]=useState('');const [st,setSt]=useState('');const [date,setDate]=useState(iso(new Date()));
 const [sort,setSort]=useState({k:'name',d:1});const [pg,setPg]=useState(0);const [edit,setEdit]=useState(null);const [view,setView]=useState('table');const [emp,setEmp]=useState('');
 const rows=useMemo(()=>{let r=attendance.filter(a=>emp?a.empId===emp:a.date===date).map(a=>({...(employees.find(e=>e.id===a.empId)||{name:a.empId,dept:''}),...a}));
  if(role==='employee')r=r.filter(x=>x.empId===me.id);
  r=r.filter(x=>x.name.toLowerCase().includes(q.toLowerCase())&&(!dept||x.dept===dept)&&(!st||x.status===st));
  return r.sort((a,b)=>(a[sort.k]>b[sort.k]?1:-1)*sort.d)},[attendance,employees,q,dept,st,date,sort,role,me,emp]);
 const page=rows.slice(pg*PER,pg*PER+PER);const th=(k,l)=><th onClick={()=>setSort({k,d:sort.k===k?-sort.d:1})}>{l}{sort.k===k?(sort.d>0?' ▲':' ▼'):''}</th>;
 const save=e=>{e.preventDefault();const f=new FormData(e.target);const {id,empId,date:dt}=edit;saveAttendance({id,empId,date:dt,status:f.get('status'),checkIn:f.get('in'),checkOut:f.get('out')});setEdit(null)};
 return <div><h1>Attendance</h1>
 <div className={s.bar}><input className={s.in} placeholder="Search employee" value={q} onChange={e=>{setQ(e.target.value);setPg(0)}}/>
  {role!=='employee'&&<select className={s.in} value={emp} onChange={e=>{setEmp(e.target.value);setPg(0);setSort(e.target.value?{k:'date',d:-1}:{k:'name',d:1})}}><option value="">All employees</option>{employees.map(x=><option key={x.id} value={x.id}>{x.name}</option>)}</select>}<select className={s.in} value={dept} onChange={e=>{setDept(e.target.value);setPg(0)}}><option value="">All departments</option>{DEPTS.map(d=><option key={d}>{d}</option>)}</select>
  <select className={s.in} value={st} onChange={e=>{setSt(e.target.value);setPg(0)}}><option value="">All statuses</option>{STATUSES.map(d=><option key={d}>{d}</option>)}</select>
  <input type="date" disabled={!!emp} className={s.in} value={date} onChange={e=>{setDate(e.target.value);setPg(0)}}/>
  <div className={s.seg}><button className={view==='table'?s.on:''} onClick={()=>setView('table')}>Table</button><button className={view==='calendar'?s.on:''} onClick={()=>setView('calendar')}>Calendar</button></div><button className={s.btn} onClick={()=>downloadCSV(`attendance-${date}.csv`,rows.map(r=>({ID:r.empId,Name:r.name,Dept:r.dept,Date:r.date,CheckIn:r.checkIn,CheckOut:r.checkOut,Hours:hours(r.checkIn,r.checkOut),Status:r.status})))}>Export CSV</button></div>
 {view==='calendar'?<MonthCalendar emp={emp} dept={dept}/>:<Card><div className={s.wrap}><table><thead><tr>{th('date','Date')}{th('empId','ID')}{th('name','Name')}{th('dept','Department')}{th('checkIn','In')}{th('checkOut','Out')}<th>Hours</th>{th('status','Status')}{role!=='employee'&&<th></th>}</tr></thead>
 <tbody>{page.map(r=><tr key={r.id}><td>{r.date}</td><td>{r.empId}</td><td>{r.name}</td><td>{r.dept}</td><td>{r.checkIn||'-'}</td><td>{r.checkOut||'-'}</td><td>{hours(r.checkIn,r.checkOut)}</td><td><Badge v={r.status}/></td>{role!=='employee'&&<td><button className={`${s.btn} ${s.ghost}`} onClick={()=>setEdit(r)}>Edit</button></td>}</tr>)}</tbody></table>
 {!rows.length&&<div className={s.empty}>No records match your filters.</div>}</div>
 <div className={s.bar} style={{marginTop:12}}><button className={`${s.btn} ${s.ghost}`} disabled={!pg} onClick={()=>setPg(pg-1)}>Prev</button><span>Page {pg+1} of {Math.max(1,Math.ceil(rows.length/PER))}</span><button className={`${s.btn} ${s.ghost}`} disabled={(pg+1)*PER>=rows.length} onClick={()=>setPg(pg+1)}>Next</button></div></Card>}
 {edit&&<Modal title={`Edit ${edit.name}`} onClose={()=>setEdit(null)}><form onSubmit={save} style={{display:'grid',gap:10}}>
  <Field label="Status"><select name="status" className={s.in} defaultValue={edit.status}>{STATUSES.map(x=><option key={x}>{x}</option>)}</select></Field>
  <Field label="Check-in"><input name="in" type="time" className={s.in} defaultValue={edit.checkIn}/></Field><Field label="Check-out"><input name="out" type="time" className={s.in} defaultValue={edit.checkOut}/></Field>
  <button className={s.btn}>Save</button></form></Modal>}</div>}
