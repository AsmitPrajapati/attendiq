import {useState} from 'react';import {useApp} from '../context/AppContext';import {Card,Badge,Modal,Field} from '../components/common';import s from '../components/common/ui.module.css';import {DEPTS} from '../data/seed';
export default function Employees(){
 const {role,employees,addEmployee,editEmployee,removeEmployee}=useApp();const [q,setQ]=useState('');const [dept,setDept]=useState('');const [m,setM]=useState(null);const [del,setDel]=useState(null);const [err,setErr]=useState({});
 const list=employees.filter(e=>(e.name+e.email+e.id).toLowerCase().includes(q.toLowerCase())&&(!dept||e.dept===dept));
 const submit=ev=>{ev.preventDefault();const f=Object.fromEntries(new FormData(ev.target));const er={};if(!f.name.trim())er.name='Name required';if(!/^\S+@\S+\.\S+$/.test(f.email))er.email='Valid email required';setErr(er);if(Object.keys(er).length)return;
  m.id?editEmployee({...m,...f}):addEmployee({...f,status:'Active'});setM(null)};
 const open=e=>{setErr({});setM(e)};
 return <div><h1>Employees</h1><div className={s.bar}><input className={s.in} placeholder="Search" value={q} onChange={e=>setQ(e.target.value)}/>
  <select className={s.in} value={dept} onChange={e=>setDept(e.target.value)}><option value="">All departments</option>{DEPTS.map(d=><option key={d}>{d}</option>)}</select>
  {role==='admin'&&<button className={s.btn} onClick={()=>open({})}>Add employee</button>}</div>
 <Card><div className={s.wrap}><table><thead><tr><th>ID</th><th>Name</th><th>Email</th><th>Department</th><th>Designation</th><th>Shift</th><th>Status</th><th></th></tr></thead>
 <tbody>{list.map(e=><tr key={e.id}><td>{e.id}</td><td>{e.name}</td><td>{e.email}</td><td>{e.dept}</td><td>{e.designation}</td><td>{e.shift}</td><td><Badge v={e.status}/></td>
 <td>{role==='admin'&&<><button className={`${s.btn} ${s.ghost}`} onClick={()=>open(e)}>Edit</button> <button className={`${s.btn} ${s.danger}`} onClick={()=>setDel(e)}>Delete</button></>}</td></tr>)}</tbody></table>{!list.length&&<div className={s.empty}>No employees found.</div>}</div></Card>
 {m&&<Modal title={m.id?'Edit employee':'Add employee'} onClose={()=>setM(null)}><form onSubmit={submit} style={{display:'grid',gap:10}}>
  <Field label="Name" error={err.name}><input name="name" className={s.in} defaultValue={m.name}/></Field><Field label="Email" error={err.email}><input name="email" className={s.in} defaultValue={m.email}/></Field>
  <Field label="Department"><select name="dept" className={s.in} defaultValue={m.dept||DEPTS[0]}>{DEPTS.map(d=><option key={d}>{d}</option>)}</select></Field>
  <Field label="Designation"><input name="designation" className={s.in} defaultValue={m.designation}/></Field><Field label="Shift"><select name="shift" className={s.in} defaultValue={m.shift||'General'}>{['Morning','General','Evening','Night'].map(d=><option key={d}>{d}</option>)}</select></Field>
  <Field label="Joining date"><input name="joined" type="date" className={s.in} defaultValue={m.joined}/></Field><button className={s.btn}>Save</button></form></Modal>}
 {del&&<Modal title="Delete employee?" onClose={()=>setDel(null)}><p>{del.name} will be removed.</p><button className={`${s.btn} ${s.danger}`} onClick={()=>{removeEmployee(del.id);setDel(null)}}>Delete</button></Modal>}</div>}
