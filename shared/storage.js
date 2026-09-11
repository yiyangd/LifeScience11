(function(root){
'use strict';
const KEY='lifescience11:v1';let memoryOnly=false,fallback={version:1,read:{},answers:{},sessions:{},results:[]};
function notice(){const e=typeof document!=='undefined'&&document.getElementById('storage-notice');if(e){e.hidden=false;e.textContent='Browser storage is unavailable. Your progress will last only while this page stays open.';}}
function read(){if(memoryOnly)return fallback;try{const value=JSON.parse(root.localStorage.getItem(KEY)||'null');if(value&&value.version===1&&typeof value.read==='object'&&value.read&&typeof value.answers==='object'&&value.answers&&typeof value.sessions==='object'&&value.sessions&&Array.isArray(value.results)){fallback=value;return value;}}catch(e){notice();}return fallback;}
function write(value){fallback=value;try{root.localStorage.setItem(KEY,JSON.stringify(value));}catch(e){memoryOnly=true;notice();}return value;}
function update(fn){const s=read();fn(s);return write(s);}
function mark(id,value){return update(s=>{s.read[id]=value;});}
function grade(questions,answers){const rows=questions.map(q=>({id:q.id,selected:answers[q.id],correct:answers[q.id]===q.answer,points:q.points}));return {total:rows.length,correct:rows.filter(r=>r.correct).length,rows};}
function record(questions,answers,mode){const result=grade(questions,answers);update(s=>{result.rows.forEach(r=>{s.answers[r.id]={selected:r.selected,correct:r.correct,at:Date.now()};});s.results.unshift({mode,total:result.total,correct:result.correct,at:Date.now()});s.results=s.results.slice(0,30);});return result;}
root.CourseStore={read,write,update,mark,grade,record};
if(typeof module!=='undefined')module.exports=root.CourseStore;
})(typeof window==='undefined'?globalThis:window);
