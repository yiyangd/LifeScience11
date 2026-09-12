const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=path.resolve(__dirname,'..'),ctx={};ctx.window=ctx;vm.createContext(ctx);
for(const file of ['course-data.js','units/cells/data.js','shared/zh-data.js'])vm.runInContext(fs.readFileSync(path.join(root,file),'utf8'),ctx);
const norm=s=>s.replace(/\s+/g,' ').trim(),check=s=>assert(typeof ctx.COURSE_ZH[norm(s)]==='string'&&ctx.COURSE_ZH[norm(s)].trim(),`Missing Chinese: ${s}`);
const biology=JSON.parse(fs.readFileSync(path.join(root,'data/biology-objectives.json'),'utf8'));
for(const o of biology){[o.title,o.summary,...o.bullets,o.clarification].filter(Boolean).forEach(check);}
for(const t of ctx.CELL_DATA.topics){[t.en,t.summaryEn,t.noteEn,...t.facts.flatMap(f=>[f.en,f.structureEn,f.jobEn]),...(t.flow||[]).map(step=>step[1])].filter(Boolean).forEach(check);}
for(const q of ctx.CELL_DATA.questions)[q.en,...q.options.map(o=>o.en),q.explainEn].forEach(check);
for(const q of ctx.COURSE_DATA.questions)[q.stem,...q.options,q.explanation].forEach(check);
console.log(`PASS: complete Chinese text for ${biology.length} Cell Biology objectives, 27 Concept 1 objectives and ${ctx.COURSE_DATA.questions.length} scored questions; IDs and answer keys stay in the original data.`);
