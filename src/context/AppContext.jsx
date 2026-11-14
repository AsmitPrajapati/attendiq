import {createContext,useContext,useState,useCallback} from 'react';
import {employeeService as ES,attendanceService as AS,leaveService as LS} from '../services';
import {load,save} from '../services/mock/db.js';
const Ctx=createContext();export const useApp=()=>useContext(Ctx);
export function AppProvider({children}){
 const [role,setRoleS]=useState(load('role','admin'));
 const [employees,setE]=useState(ES.getEmployees());const [attendance,setA]=useState(AS.getAttendance());const [leaves,setL]=useState(LS.getLeaveRequests());
 const [toasts,setT]=useState([]);
 const toast=useCallback(m=>{const id=Math.random();setT(t=>[...t,{id,m}]);setTimeout(()=>setT(t=>t.filter(x=>x.id!==id)),2600)},[]);
 const setRole=r=>{setRoleS(r);save('role',r)};
 const me=employees[0]||{id:'EMP101',name:'Demo User'};
 const v={role,setRole,me,employees,attendance,leaves,toast,
  addEmployee:e=>{setE(ES.createEmployee(e));toast('Employee added')},
  editEmployee:e=>{setE(ES.updateEmployee(e));toast('Employee updated')},
  removeEmployee:id=>{setE(ES.deleteEmployee(id));toast('Employee deleted')},
  saveAttendance:r=>{setA(AS.updateAttendance(r));toast('Attendance saved')},
  applyLeave:l=>{setL(LS.createLeave(l));toast('Leave submitted')},
  setLeaveStatus:(id,s)=>{setL(LS.setStatus(id,s));toast('Leave '+s.toLowerCase())}};
 return <Ctx.Provider value={v}>{children}<div style={{position:'fixed',bottom:16,right:16,display:'grid',gap:8,zIndex:99}}>{toasts.map(t=><div key={t.id} style={{background:'#172554',color:'#fff',padding:'10px 14px',borderRadius:6}}>{t.m}</div>)}</div></Ctx.Provider>}
