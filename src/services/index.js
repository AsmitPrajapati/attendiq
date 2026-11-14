import {load,save} from './mock/db.js';
import {seedEmployees,seedAttendance,seedLeaves} from '../data/seed.js';
const uid=p=>p+Date.now().toString(36);
export const employeeService={
 getEmployees:()=>load('employees',seedEmployees),
 createEmployee(e){const l=[...this.getEmployees(),{...e,id:'EMP'+(100+this.getEmployees().length+1+Math.floor(Math.random()*900))}];save('employees',l);return l},
 updateEmployee(e){const l=this.getEmployees().map(x=>x.id===e.id?e:x);save('employees',l);return l},
 deleteEmployee(id){const l=this.getEmployees().filter(x=>x.id!==id);save('employees',l);return l}};
export const attendanceService={
 getAttendance:()=>load('attendance',seedAttendance(seedEmployees)),
 updateAttendance(r){const a=this.getAttendance();const has=a.some(x=>x.id===r.id);const l=has?a.map(x=>x.id===r.id?r:x):[...a,r];save('attendance',l);return l}};
export const leaveService={
 getLeaveRequests:()=>load('leaves',seedLeaves),
 createLeave(l){const n=[...this.getLeaveRequests(),{...l,id:uid('L'),status:'Pending'}];save('leaves',n);return n},
 setStatus(id,status){const n=this.getLeaveRequests().map(x=>x.id===id?{...x,status}:x);save('leaves',n);return n}};
export const deptService={get:()=>load('depts',['Engineering','HR','Sales','Finance','Operations'].map((name,i)=>({id:'D'+i,name,head:['Aarav Mehta','Priya Singh','Rohit Sharma','Neha Verma','Amit Patel'][i]}))),set:l=>{save('depts',l);return l}};
export const shiftService={get:()=>load('shifts',[['Morning','06:00','14:00',30],['General','09:00','17:30',60],['Evening','14:00','22:00',30],['Night','22:00','06:00',45]].map(([name,start,end,brk],i)=>({id:'S'+i,name,start,end,brk,active:true}))),set:l=>{save('shifts',l);return l}};
export const settingsService={get:()=>load('settings',{org:'AttendIQ Inc.',days:[1,2,3,4,5],lateMin:15,minHours:8,leave:{casual:12,sick:10,earned:15,unpaid:5},notify:{late:true,leave:true,daily:false}}),set:v=>{save('settings',v);return v}};
export const eventService={get:()=>load('events',[
 ['Team Sync Meeting','Meeting','2026-11-18','11:00','12:00','Conference Room A / Zoom','Weekly sync on sprint progress and blockers.','Priya Singh','team'],
 ['Data Engineering Workshop','Training','2026-11-20','10:00','13:00','Training Hall, Floor 2','Hands-on workshop on data pipelines and tooling.','HR Admin','company'],
 ['Company Annual Day','Company Event','2026-11-28','','','Head Office Auditorium','Annual celebration with awards and team activities.','HR Admin','company'],
 ['Quarterly Review','Meeting','2026-12-03','15:00','16:30','https://meet.example.com/quarterly','Review of quarterly goals and team performance.','Aarav Mehta','team'],
 ['Christmas Holiday','Holiday','2026-12-25','','','Company-wide','Office closed for the public holiday.','HR Admin','company'],
 ['Safety Drill','Other','2026-11-05','10:00','10:45','Main Building','Annual fire and safety drill.','HR Admin','company']
 ].map(([title,category,date,start,end,location,desc,organizer,scope],i)=>({id:'E'+i,title,category,date,start,end,location,desc,organizer,scope}))),set:l=>{save('events',l);return l}};
