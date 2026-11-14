// Mock persistence. Replace with fetch/axios calls when the backend exists.
export const load=(k,seed)=>{try{const v=localStorage.getItem('attendiq2:'+k);if(v)return JSON.parse(v)}catch{}return seed};
export const save=(k,v)=>localStorage.setItem('attendiq2:'+k,JSON.stringify(v));
