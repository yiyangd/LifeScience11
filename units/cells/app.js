'use strict';
(() => {
const data = window.CELL_DATA;
const esc = value => String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const num = n => String(n).padStart(2,'0');
const byId = id => document.getElementById(id);
const facts = new Map(data.topics.flatMap(t=>t.facts.map(f=>[f.key,{...f,topic:t.id}])));
const remembered=CourseStore.read().legacy?.cells;
const state = {cell:'animal',organ:'nucleus',selected:remembered?.selected||{},graded:remembered?.graded||{}};
const locations = {
 animal:[['nucleus',39,49],['mitochondria',35,18],['golgi',64,25],['rough-er',37,35],['membrane',3,43],['lysosome',65,71],['vacuole',81,48]],
 plant:[['nucleus',19,34],['mitochondria',71,21],['golgi',50,20],['rough-er',30,27],['membrane',6.2,47],['chloroplast',86,25],['central-vacuole',56,53],['wall',4,60]]
};

byId('lesson-nav').insertAdjacentHTML('beforeend',data.topics.map(t=>`<a class="nav-link" href="#topic-${t.id}"><span>${num(t.id)}</span>${esc(t.short)}<small lang="en">${esc(t.en)}</small></a>`).join(''));
byId('lessons').innerHTML = data.topics.map(t=>`<section class="lesson" id="topic-${t.id}" aria-labelledby="topic-title-${t.id}"><div class="lesson-head"><span class="lesson-index">${num(t.id)}</span><div class="lesson-title"><h2 id="topic-title-${t.id}">${esc(t.zh)}</h2><p lang="en">${esc(t.en)}</p></div><span class="page-ref">PDF p. ${esc(t.pages)}</span></div><div class="lesson-body"><div class="review-return" id="return-${t.id}"></div><div class="lesson-summary"><p>${esc(t.summaryZh)}</p><p lang="en">${esc(t.summaryEn)}</p></div><div class="facts">${t.facts.map(f=>`<article class="fact" id="fact-${f.key}" aria-labelledby="fact-title-${f.key}"><h3 id="fact-title-${f.key}">${esc(f.zh)}</h3><p class="term-en" lang="en">${esc(f.en)}</p><span class="fact-label">${t.id===1||t.id===2||f.key==='comparison'?'理解 · UNDERSTAND':'结构 · STRUCTURE'}</span><p>${esc(f.structureZh)}</p><p lang="en">${esc(f.structureEn)}</p><span class="fact-label">${t.id===1||t.id===2||f.key==='comparison'?'记住 · REMEMBER':'功能 · FUNCTION'}</span><p>${esc(f.jobZh)}</p><p lang="en">${esc(f.jobEn)}</p><a class="fact-test" href="#question-${t.id}" aria-label="测试${esc(f.zh)}：跳到第 ${t.id} 题">测试 · Practice ${num(t.id)} ↗</a></article>`).join('')}</div>${t.flow?`<div class="flow" aria-label="${t.id===1?'生命层次 · Levels of organization':'蛋白质运输路线 · Protein transport pathway'}">${t.flow.map((f,i)=>`${i?'<b aria-hidden="true">→</b>':''}<span>${esc(f[0])}<small lang="en">${esc(f[1])}</small></span>`).join('')}</div>`:''}${t.image?'<figure class="membrane-figure"><img src="assets/membrane.png" width="1119" height="482" loading="lazy" alt="细胞膜的磷脂双分子层示意图，显示亲水头部、疏水尾部和嵌入的蛋白质"><figcaption>磷脂双分子层 · Phospholipid bilayer · PDF p. 11</figcaption></figure>':''}${t.noteZh?`<aside class="clarification"><strong>理解补充 · Clarification</strong><p>${esc(t.noteZh)}</p><p lang="en">${esc(t.noteEn)}</p>${t.sources?`<div class="reference-links">参考 · Sources: ${t.sources.map(s=>`<a href="${esc(s[1])}" target="_blank" rel="noopener noreferrer">${esc(s[0])} ↗</a>`).join(' · ')}</div>`:''}</aside>`:''}</div><div class="lesson-action"><span>学完这一组，检验一下理解。<small lang="en">Check what you have learned.</small></span><a class="primary-link" href="#question-${t.id}">测试 · 第 ${t.id} 题 →</a></div></section>`).join('');

byId('questions').innerHTML=data.questions.map(q=>`<article class="question" id="question-${q.id}" aria-labelledby="question-title-${q.id}"><div class="question-top"><span class="question-number">QUESTION ${num(q.id)} / 10</span><span class="topic-tag">${esc(data.topics[q.id-1].short)} · PDF p. ${esc(data.topics[q.id-1].pages)}</span></div><h3 id="question-title-${q.id}">${esc(q.zh)}</h3><p class="question-en" lang="en">${esc(q.en)}</p><fieldset class="options" aria-labelledby="question-title-${q.id}"><legend class="sr-only">请选择一个最佳答案 · Choose one best answer</legend>${q.options.map((o,i)=>`<label class="option" id="option-${q.id}-${i}"><input type="radio" name="q-${q.id}" value="${i}" data-question="${q.id}"><span class="option-letter" aria-hidden="true">${String.fromCharCode(65+i)}</span><span class="option-text">${esc(o.zh)}<small lang="en">${esc(o.en)}</small></span></label>`).join('')}</fieldset><div class="question-actions"><button type="button" class="check-button" data-check="${q.id}">检查答案 · Check answer</button><a class="review-link" data-review="${q.id}" href="#topic-${q.id}">不会？回到知识点 · Review this topic ↗</a></div><div class="feedback" id="feedback-${q.id}" role="status" aria-live="polite" hidden></div></article>`).join('');

function selectOrgan(key){
 if(!locations[state.cell].some(p=>p[0]===key))throw new Error('This structure is not available in the selected diagram.');
 state.organ=key;
 const f=facts.get(key);
 byId('organelle-detail').innerHTML=`<span class="detail-number">STRUCTURE ${num(locations[state.cell].findIndex(p=>p[0]===key)+1)}</span><h3>${esc(f.zh)}</h3><p class="term-en" lang="en">${esc(f.en)}</p><div class="bilingual"><p>${esc(f.jobZh)}</p><p lang="en">${esc(f.jobEn)}</p></div><a href="#fact-${f.key}" class="text-link">学习结构与功能 · Learn more →</a><a href="#question-${f.topic}" class="explorer-test">测试 · Practice ${num(f.topic)} ↗</a>`;
 document.querySelectorAll('[data-organ]').forEach(b=>{const selected=b.dataset.organ===key;b.classList.toggle('selected',selected);b.setAttribute('aria-pressed',String(selected));});
 return {cell:state.cell,structure:key,topicId:f.topic};
}
function setCell(cell){
 if(!Object.hasOwn(locations,cell))throw new Error('Choose animal or plant.');
 state.cell=cell;
 const plant=cell==='plant';
 const img=byId('cell-image');img.src=`assets/${cell}.png`;img.width=plant?1855:1248;img.height=plant?1430:1227;img.alt=plant?'PDF 第 9 页的植物细胞结构示意图':'PDF 第 8 页的动物细胞结构示意图';
 byId('diagram-caption').textContent=plant?'植物细胞 · Plant cell · PDF p. 9':'动物细胞 · Animal cell · PDF p. 8';
 document.querySelectorAll('[data-cell]').forEach(b=>{const selected=b.dataset.cell===cell;b.classList.toggle('selected',selected);b.setAttribute('aria-pressed',String(selected));});
 byId('organelle-picker').innerHTML=locations[cell].map(([key],i)=>`<button type="button" data-organ="${key}" aria-pressed="false"><span>${i+1}</span> ${esc(facts.get(key).zh)}</button>`).join('');
 byId('hotspots').innerHTML=locations[cell].map(([key,x,y],i)=>`<button type="button" class="hotspot" style="left:${x}%;top:${y}%" data-organ="${key}" aria-pressed="false" aria-label="${i+1}. ${esc(facts.get(key).zh)} · ${esc(facts.get(key).en)}" title="${esc(facts.get(key).zh)} · ${esc(facts.get(key).en)}">${i+1}</button>`).join('');
 return selectOrgan(locations[cell].some(x=>x[0]===state.organ)?state.organ:'nucleus');
}
function updateScore(){
 CourseStore.update(s=>{s.legacy??={};s.legacy.cells={selected:state.selected,graded:state.graded};});
 const graded=Object.values(state.graded);const correct=graded.filter(Boolean).length;
 byId('score').textContent=`已答 ${graded.length} / 10 · 答对 ${correct} / 10`;
 if(graded.length===10){byId('score').textContent+=correct===10?' · 全部掌握！':' · 可回看错题后重答';}
}
function chooseAnswer(id,option){
 const q=data.questions.find(q=>q.id===id);
 if(!q||!Number.isInteger(option)||option<0||option>=q.options.length)throw new Error('Invalid question or option.');
 state.selected[id]=option;delete state.graded[id];
 byId(`feedback-${id}`).hidden=true;
 document.querySelectorAll(`input[name="q-${id}"]`).forEach(r=>{r.checked=Number(r.value)===option;});
 document.querySelectorAll(`#question-${id} .option`).forEach(o=>o.classList.remove('answer-correct','answer-wrong'));
 updateScore();return {questionId:id,selectedOption:option,submitted:false};
}
function checkAnswer(id,restoring=false){
 const q=data.questions.find(q=>q.id===id);if(!q)throw new Error('Unknown question.');
 const feedback=byId(`feedback-${id}`);const selected=state.selected[id];
 if(selected===undefined){feedback.hidden=false;feedback.className='feedback wrong';feedback.textContent='先选择一个答案，再检查。Please select an answer first.';return {questionId:id,submitted:false,reason:'no_selection'};}
 const correct=selected===q.answer;state.graded[id]=correct;const sharedQuestion=COURSE_DATA.questions.find(item=>item.id==='cells-original-'+id);if(sharedQuestion&&!restoring)CourseStore.record([sharedQuestion],{[sharedQuestion.id]:selected},'legacy-cells');
 byId(`option-${id}-${q.answer}`).classList.add('answer-correct');
 if(!correct)byId(`option-${id}-${selected}`).classList.add('answer-wrong');
 feedback.className=`feedback${correct?'':' wrong'}`;feedback.hidden=false;
 feedback.innerHTML=`<strong>${correct?'✓ 回答正确 · Correct':'再想一想 · Try again'}${correct?'':` · 正确答案 ${String.fromCharCode(65+q.answer)}`}</strong><p>${esc(q.explainZh)}</p><p lang="en">${esc(q.explainEn)}</p>${correct?'':'<p class="retry-note">可以回到知识点复习，再修改答案。Review the topic, then choose again.</p>'}`;
 updateScore();return {questionId:id,submitted:true,correct};
}
function goTo(id){
 const target=byId(id);if(!target)throw new Error('Unknown learning destination.');
 if(location.hash!==`#${id}`)history.pushState(null,'',`#${id}`);
 target.setAttribute('tabindex','-1');target.focus({preventScroll:true});target.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'start'});
 target.classList.remove('highlight');void target.offsetWidth;target.classList.add('highlight');
 return {destination:id};
}
document.addEventListener('click',event=>{
 const cell=event.target.closest('[data-cell]');if(cell){setCell(cell.dataset.cell);return;}
 const organ=event.target.closest('[data-organ]');if(organ){selectOrgan(organ.dataset.organ);return;}
 const check=event.target.closest('[data-check]');if(check){checkAnswer(Number(check.dataset.check));return;}
 const link=event.target.closest('a[href^="#"]');if(!link||event.ctrlKey||event.metaKey||event.shiftKey||event.altKey)return;
 const id=link.hash.slice(1);if(!byId(id))return;
 event.preventDefault();
 if(link.dataset.review){const n=Number(link.dataset.review);byId(`return-${n}`).innerHTML=`<div class="return-banner">正在复习第 ${n} 题的知识点 · Reviewing question ${n}<br><a href="#question-${n}">复习好了，返回第 ${n} 题 → Back to question ${n}</a></div>`;}
 goTo(id);
});
document.addEventListener('change',event=>{if(event.target.matches('input[data-question]'))chooseAnswer(Number(event.target.dataset.question),Number(event.target.value));});
window.addEventListener('popstate',()=>{const t=byId(location.hash.slice(1));if(t)t.scrollIntoView({block:'start'});});
setCell('animal');updateScore();
for(const [id,option] of Object.entries(state.selected)){const radio=document.querySelector('input[name="q-'+id+'"][value="'+option+'"]');if(radio)radio.checked=true;}
for(const id of Object.keys(state.graded))checkAnswer(Number(id),true);
if(location.hash&&byId(location.hash.slice(1)))requestAnimationFrame(()=>goTo(location.hash.slice(1)));
if('IntersectionObserver' in window){const observer=new IntersectionObserver(entries=>{for(const entry of entries){if(entry.isIntersecting){document.querySelectorAll('#lesson-nav .nav-link').forEach(a=>a.classList.toggle('active',a.hash===`#${entry.target.id}`));}}},{rootMargin:'-90px 0px -60% 0px',threshold:0});document.querySelectorAll('.lesson,#explore').forEach(el=>observer.observe(el));}

// Use the same actions for supported page-scoped agent controls.
const context=document.modelContext;
if(context?.registerTool){
 const lifecycle=new AbortController();window.addEventListener('pagehide',()=>lifecycle.abort(),{once:true});
 const tools=[
 {name:'navigate_cell_topic',title:'Navigate to a learning topic',description:'Open one of the ten bilingual learning topics.',inputSchema:{type:'object',properties:{topicId:{type:'integer',minimum:1,maximum:10}},required:['topicId'],additionalProperties:false},execute:input=>{if(!input||!Number.isInteger(input.topicId)||input.topicId<1||input.topicId>10)throw new Error('topicId must be 1–10.');return goTo(`topic-${input.topicId}`);}},
 {name:'select_cell_structure',title:'Explore a cell structure',description:'Switch the cell diagram and display the selected structure and its function.',inputSchema:{type:'object',properties:{cell:{type:'string',enum:['animal','plant']},structure:{type:'string'}},required:['cell','structure'],additionalProperties:false},execute:input=>{if(!input||!Object.hasOwn(locations,input.cell)||!locations[input.cell].some(p=>p[0]===input.structure))throw new Error('Invalid cell or structure.');setCell(input.cell);return selectOrgan(input.structure);}},
 {name:'submit_cell_practice_answer',title:'Submit a practice answer',description:'Choose and submit an option for one question, displaying feedback and updating the score. Option indices are 0–3.',inputSchema:{type:'object',properties:{questionId:{type:'integer',minimum:1,maximum:10},optionIndex:{type:'integer',minimum:0,maximum:3}},required:['questionId','optionIndex'],additionalProperties:false},execute:input=>{if(!input||!Number.isInteger(input.questionId))throw new Error('Invalid question.');chooseAnswer(input.questionId,input.optionIndex);return checkAnswer(input.questionId);}}
 ];
 tools.forEach(t=>{try{Promise.resolve(context.registerTool({...t,annotations:{readOnlyHint:false,untrustedContentHint:false}},{signal:lifecycle.signal})).catch(()=>{});}catch{}});
}
})();
