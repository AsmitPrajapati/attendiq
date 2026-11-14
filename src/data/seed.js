export const DEPTS=['Engineering','HR','Sales','Finance','Operations'];
export const STATUSES=['Present','Absent','Late','Half Day','On Leave','Holiday'];
export const LEAVE_TYPES=['Casual Leave','Sick Leave','Earned Leave','Unpaid Leave'];
export const iso=d=>d.toISOString().slice(0,10);
const names=['Aarav Mehta','Priya Singh','Rohit Sharma','Neha Verma','Amit Patel','Sara Khan','John Lee','Maria Gomez','Ken Tanaka','Lina Park','Omar Ali','Zoe Clark'];
export const seedEmployees=names.map((n,i)=>({id:'EMP'+(101+i),name:n,email:n.split(' ')[0].toLowerCase()+'@attendiq.com',dept:DEPTS[i%5],designation:['Developer','Manager','Analyst','Executive'][i%4],joined:`2022-0${1+i%9}-15`,shift:['General','Morning','Evening'][i%3],status:'Active'}));
export function seedAttendance(emps){const out=[];for(let d=0;d<30;d++){const dt=new Date();dt.setDate(dt.getDate()-d);if(d&&[0,6].includes(dt.getDay()))continue;emps.forEach((e,i)=>{const r=(i*7+d*3)%10;let status='Present',ci=`0${7+(i+d)%3}:${String(5+((i*7+d*3)%50)).padStart(2,'0')}`,co=d?'17:30':'';if(r===0){status='Absent';ci=co='';}else if(r<3){status='Late';ci='09:4'+r;}else if(r===3){status='On Leave';ci=co='';}out.push({id:`${e.id}_${iso(dt)}`,empId:e.id,date:iso(dt),status,checkIn:ci,checkOut:co});});}return out;}
export const seedLeaves=[
{id:'L1',empId:'EMP103',type:'Sick Leave',start:'2026-11-17',end:'2026-11-18',reason:'Fever',status:'Pending'},
{id:'L2',empId:'EMP105',type:'Casual Leave',start:'2026-11-20',end:'2026-11-20',reason:'Family event',status:'Pending'},
{id:'L3',empId:'EMP101',type:'Earned Leave',start:'2026-12-01',end:'2026-12-05',reason:'Vacation',status:'Approved'},
{id:'L4',empId:'EMP107',type:'Unpaid Leave',start:'2026-11-10',end:'2026-11-11',reason:'Personal',status:'Rejected'}];
