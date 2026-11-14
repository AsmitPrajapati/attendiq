import {useState} from 'react';import {useApp} from '../context/AppContext';import {Card,downloadCSV} from '../components/common';import s from '../components/common/ui.module.css';import {DEPTS,iso} from '../data/seed';
import {BarChart,Bar,XAxis,YAxis,Tooltip,ResponsiveContainer,CartesianGrid} from 'recharts';
const TYPES=['Monthly attendance','Employee-wise','Department-wise','Late arrivals','Overtime','Working hours','Leave utilization'];
const mins=t=>+t.slice(0,2)*60+ +t.slice(3);const hrs=(a,b)=>a&&b?(mins(b)-mins(a))/60:0;const days=(a,b)=>Math.round((new Date(b)-new Date(a))/864e5)+1;
export default function Reports(){
 const {role,me,employees,attendance,leaves}=useApp();const n=new Date();const [type,setType]=useState(TYPES[0]);const [from,setFrom]=useState(iso(new Date(n.getFullYear(),n.getMonth(),2)));const [to,setTo]=useState(iso(n));const [dept,setDept]=useState('');const [emp,setEmp]=useState('');
 const scope=role==='employee'?[me]:employees.filter(e=>(!dept||e.dept===dept)&&(!emp||e.id===emp));const ids=new Set(scope.map(e=>e.id));
 const recs=attendance.filter(a=>ids.has(a.empId)&&a.date>=from&&a.date<=to);const E=id=>employees.find(e=>e.id===id)||{name:id,dept:''};const c=(r,x)=>r.filter(a=>a.status===x).length;
 const agg=key=>{const g={};recs.forEach(a=>{(g[key(a)]=g[key(a)]||[]).push(a)});return Object.entries(g).sort().map(([k,r])=>({Name:k,Present:c(r,'Present'),Late:c(r,'Late'),Absent:c(r,'Absent'),'On Leave':c(r,'On Leave'),Hours:+r.reduce((x,a)=>x+hrs(a.checkIn,a.checkOut),0).toFixed(1)}))};
 const lv=(()=>{const g={};leaves.filter(l=>ids.has(l.empId)&&l.status==='Approved').forEach(l=>{const k=E(l.empId).name;g[k]=(g[k]||0)+days(l.start,l.end)});return Object.entries(g).map(([Name,Days])=>({Name,'Approved days':Days}))})();
 const rows={'Monthly attendance':agg(a=>a.date),'Employee-wise':agg(a=>E(a.empId).name),'Department-wise':agg(a=>E(a.empId).dept),
  'Late arrivals':recs.filter(a=>a.status==='Late').map(a=>({Name:E(a.empId).name,Date:a.date,'Check-in':a.checkIn,'Minutes late':Math.max(0,mins(a.checkIn)-540)})),
  'Overtime':recs.filter(a=>hrs(a.checkIn,a.checkOut)>8).map(a=>({Name:E(a.empId).name,Date:a.date,Hours:+hrs(a.checkIn,a.checkOut).toFixed(1),'Overtime hrs':+(hrs(a.checkIn,a.checkOut)-8).toFixed(1)})),
  'Working hours':agg(a=>E(a.empId).name).map(r=>({Name:r.Name,Hours:r.Hours})),'Leave utilization':lv}[type];
 const yk=rows[0]&&Object.keys(rows[0]).find((k,i)=>i>0&&typeof rows[0][k]==='number');
 return <div><h1>Reports & Analytics</h1><div className={`${s.bar} noprint`}><select className={s.in} value={type} onChange={e=>setType(e.target.value)}>{TYPES.map(t=><option key={t}>{t}</option>)}</select>
  <input type="date" className={s.in} value={from} onChange={e=>setFrom(e.target.value)}/><input type="date" className={s.in} value={to} onChange={e=>setTo(e.target.value)}/>
  {role!=='employee'&&<><select className={s.in} value={dept} onChange={e=>setDept(e.target.value)}><option value="">All departments</option>{DEPTS.map(d=><option key={d}>{d}</option>)}</select><select className={s.in} value={emp} onChange={e=>setEmp(e.target.value)}><option value="">All employees</option>{employees.map(e=><option key={e.id} value={e.id}>{e.name}</option>)}</select></>}
  <button className={s.btn} onClick={()=>downloadCSV(type+'.csv',rows)}>Export CSV</button><button className={`${s.btn} ${s.ghost}`} onClick={()=>window.print()}>Print</button></div>
 <h2>{type} · {from} to {to}</h2>
 {!rows.length?<Card><div className={s.empty}>No data for the selected filters.</div></Card>:<><Card><ResponsiveContainer width="100%" height={240}><BarChart data={rows}><CartesianGrid vertical={false} stroke="#EEF1F6"/><XAxis dataKey={Object.keys(rows[0])[0]} fontSize={11}/><YAxis fontSize={11}/><Tooltip/><Bar dataKey={yk} fill="#1D5FE6" radius={[6,6,0,0]}/></BarChart></ResponsiveContainer></Card>
 <Card className=""><div className={s.wrap}><table><thead><tr>{Object.keys(rows[0]).map(k=><th key={k}>{k}</th>)}</tr></thead><tbody>{rows.map((r,i)=><tr key={i}>{Object.values(r).map((v,j)=><td key={j}>{v}</td>)}</tr>)}</tbody></table></div></Card></>}</div>}
