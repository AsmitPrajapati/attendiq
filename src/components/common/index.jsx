import s from './ui.module.css';
export const Card=({children,className=''})=><div className={s.card+' '+className}>{children}</div>;
export const Badge=({v})=><span className={`${s.badge} ${s[v.split(' ')[0]]||''}`}>{v}</span>;
export const Kpi=({label,value,note})=><div className={s.card+' '+s.kpi}><span>{label}</span><b>{value}</b><span>{note}</span></div>;
export function Modal({title,onClose,children}){return <div className={s.ovl} onMouseDown={e=>e.target===e.currentTarget&&onClose()}><div className={s.modal}><h2>{title}</h2>{children}</div></div>}
export const Field=({label,error,children})=><label>{label}{children}{error&&<span className={s.err}>{error}</span>}</label>;
export function downloadCSV(name,rows){if(!rows.length)return;const k=Object.keys(rows[0]);const c=[k.join(','),...rows.map(r=>k.map(x=>`"${r[x]??''}"`).join(','))].join('\n');const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([c],{type:'text/csv'}));a.download=name;a.click()}
export const hours=(a,b)=>{if(!a||!b)return '-';const m=(+b.slice(0,2)*60+ +b.slice(3))-(+a.slice(0,2)*60+ +a.slice(3));return (m/60).toFixed(1)+'h'};
