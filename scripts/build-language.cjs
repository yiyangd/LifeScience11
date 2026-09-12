const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=path.resolve(__dirname,'..'),norm=s=>String(s).replace(/\s+/g,' ').trim(),dict={};
function add(en,zh){if(typeof en==='string'&&typeof zh==='string'&&en&&zh)dict[norm(en)]=zh;}
const context={};context.window=context;vm.createContext(context);
for(const file of ['units/levels/data.js','units/levels/learning.js','units/cells/data.js','course-data.js'])vm.runInContext(fs.readFileSync(path.join(root,file),'utf8'),context);
function pairs(value){if(!value||typeof value!=='object')return;if(Array.isArray(value)){value.forEach(pairs);return;}for(const [k,v] of Object.entries(value)){if(k==='en')add(v,value.zh);if(k.endsWith('En'))add(v,value[k.slice(0,-2)+'Zh']);pairs(v);}}
pairs(context.LEVELS);pairs(context.PHOTO_ITEMS);pairs(context.CONCEPTS);pairs(context.CELL_DATA);
for(const q of context.CONCEPTS)for(const o of q.options)add(o[1],o[0]);
for(const [page,hint] of Object.entries(context.PHOTO_HINTS||{}))add(hint[1],hint[0]);
for(const q of context.COURSE_DATA.questions.filter(q=>q.id.startsWith('levels-photo-'))){const src=context.PHOTO_ITEMS.find(x=>String(x.page)===q.pages),l=context.LEVELS.find(x=>x.id===src.level);add(q.stem,`图中主要对象属于哪个组织层次？${context.PHOTO_HINTS[src.page]?.[0]||'判断图中主要对象的层次。'}`);add(q.explanation,`${src.subjectZh}：${l.zh}。${l.defZh} ${src.noteZh||''}`);add(q.imageAlt,`原课件第 ${q.pages} 页的分类练习`);}
for(const file of ['portal-zh.json','biology-content-zh.json','biology-ui-zh.json','activities-zh.json','assessments-zh.json','cells-ui-zh.json']){const data=JSON.parse(fs.readFileSync(path.join(root,'data',file),'utf8').replace(/^\uFEFF/,''));for(const [en,zh]of Object.entries(data))add(en,zh);}
fs.writeFileSync(path.join(root,'shared/zh-data.js'),'window.COURSE_ZH='+JSON.stringify(dict)+';\n');
console.log(`Built ${Object.keys(dict).length} Chinese translations.`);
