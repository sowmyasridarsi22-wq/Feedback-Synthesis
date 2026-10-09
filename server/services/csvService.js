import fs from 'fs'; import csv from 'csv-parser';
export function parseCSV(path){return new Promise((resolve,reject)=>{const rows=[];fs.createReadStream(path).pipe(csv()).on('data',r=>rows.push(r)).on('end',()=>resolve(rows)).on('error',reject)})}
export function cleanRows(rows,col){const seen=new Set();let dup=0,missing=0;const clean=[];for(const r of rows){const text=String(r[col.feedback]??'').trim();if(!text){missing++;continue}const key=text.toLowerCase().replace(/\s+/g,' ');if(seen.has(key)){dup++;continue}seen.add(key);clean.push({...r,__feedback:text})}return {clean,dup,missing}}
