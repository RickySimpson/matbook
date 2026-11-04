(function(root){
  'use strict';
  const labels={striking:'Striking',bjj:'No-Gi BJJ',mma:'MMA Fundamentals',sparring:'Sparring',bag:'Bag Conditioning'};
  const colors={striking:'#ff624f',bjj:'#d9d1bd',mma:'#9ebbf3',sparring:'#ceabe5',bag:'#b7d58a'};
  function today(){const d=new Date();return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;}
  function validDate(s){if(typeof s!=='string'||!/^\d{4}-\d{2}-\d{2}$/.test(s))return false;const d=new Date(s+'T12:00:00');return !Number.isNaN(+d)&&d.getFullYear()===+s.slice(0,4)&&d.getMonth()+1===+s.slice(5,7)&&d.getDate()===+s.slice(8,10);}
  function cleanEntry(e){
    if(!e||typeof e.id!=='string'||!e.id||e.id.length>100||!Object.hasOwn(labels,e.class)||!validDate(e.date)||e.date>today()||typeof e.note!=='string'||e.note.length>2000||(e.win!==undefined&&typeof e.win!=='boolean'))throw Error('Invalid session');
    return {id:e.id,class:e.class,date:e.date,note:e.note,createdAt:typeof e.createdAt==='string'?e.createdAt:'',win:e.class==='bjj'&&!!e.note.trim()&&e.win===true};
  }
  function normalize(data){
    const source=Array.isArray(data)?{sessions:data,focus:''}:data;
    if(!source||!Array.isArray(source.sessions)||typeof (source.focus??'')!=='string'||(source.focus??'').length>160)throw Error('Invalid log');
    const sessions=source.sessions.map(cleanEntry);
    if(new Set(sessions.map(e=>e.id)).size!==sessions.length)throw Error('Duplicate session');
    return {version:2,sessions,focus:source.focus??''};
  }
  function backup(data){return {app:'matbook',...normalize(data)};}
  function readBackup(data){if(!data||data.app!=='matbook'||![1,2].includes(data.version))throw Error('Invalid backup');return normalize(data);}
  function merge(current,incoming){const entries=new Map(current.sessions.map(e=>[e.id,e]));incoming.sessions.forEach(e=>{if(!entries.has(e.id))entries.set(e.id,e);});return normalize({sessions:[...entries.values()],focus:current.focus||incoming.focus});}
  function counts(sessions){const result=Object.fromEntries(Object.keys(labels).map(k=>[k,0]));sessions.forEach(e=>result[e.class]++);return result;}
  function sorted(sessions){return [...sessions].sort((a,b)=>a.date.localeCompare(b.date)||a.createdAt.localeCompare(b.createdAt)||a.id.localeCompare(b.id));}
  function marks(sessions){return sorted(sessions).slice(-180).map((e,i)=>{const angle=i*137.508*Math.PI/180;const radius=94+Math.sqrt(i/179)*60;const x=180+Math.cos(angle)*radius,y=180+Math.sin(angle)*radius;return {entry:e,x,y,angle:angle*180/Math.PI+90};});}
  const api={labels,colors,today,validDate,cleanEntry,normalize,backup,readBackup,merge,counts,sorted,marks};
  if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.MatbookModel=api;
})(typeof window!=='undefined'?window:globalThis);
