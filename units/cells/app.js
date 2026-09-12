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

byId('lesson-nav').insertAdjacentHTML('beforeend',data.topics.map(t=>`<a class="nav-link" href="#topic-${t.id}"><span class="nav-index">${num(t.id)}</span><span class="nav-copy">${esc(t.en)}</span></a>`).join(''));
byId('lessons').innerHTML = data.topics.map(t=>`<section class="lesson" id="topic-${t.id}" aria-labelledby="topic-title-${t.id}"><div class="lesson-head"><span class="lesson-index">${num(t.id)}</span><div class="lesson-title"><h2 id="topic-title-${t.id}">${esc(t.en)}</h2></div><span class="page-ref">PDF p. ${esc(t.pages)}</span></div><div class="lesson-body"><div class="review-return" id="return-${t.id}"></div><div class="lesson-summary"><p>${esc(t.summaryEn)}</p></div><div class="facts">${t.facts.map(f=>`<article class="fact" id="fact-${f.key}" aria-labelledby="fact-title-${f.key}"><h3 id="fact-title-${f.key}">${esc(f.en)}</h3><span class="fact-label">${t.id===1||t.id===2||f.key==='comparison'?'UNDERSTAND':'STRUCTURE'}</span><p>${esc(f.structureEn)}</p><span class="fact-label">${t.id===1||t.id===2||f.key==='comparison'?'REMEMBER':'FUNCTION'}</span><p>${esc(f.jobEn)}</p><a class="fact-test" href="../../index.html#practice/cells/${f.key}">Practise this objective</a></article>`).join('')}</div>${t.flow?`<div class="flow" aria-label="${t.id===1?'Levels of organization':'Protein transport pathway'}">${t.flow.map((f,i)=>`${i?'<b aria-hidden="true">→</b>':''}<span class="flow-step">${esc(f[1])}</span>`).join('')}</div>`:''}${t.image?'<figure class="membrane-figure"><img src="assets/membrane.png" width="1119" height="482" loading="lazy" alt="Phospholipid bilayer with hydrophilic heads, hydrophobic tails and embedded proteins"><figcaption>Phospholipid bilayer · PDF p. 11</figcaption></figure>':''}${t.noteEn?`<aside class="clarification"><strong>Clarification</strong><p>${esc(t.noteEn)}</p>${t.sources?`<div class="reference-links"><span>Sources:</span> ${t.sources.map(s=>`<a href="${esc(s[1])}" target="_blank" rel="noopener noreferrer"><span>${esc(s[0])}</span> ↗</a>`).join(' · ')}</div>`:''}</aside>`:''}</div><div class="lesson-action"><span>Check what you have learned.</span><a class="primary-link" href="#question-${t.id}"><span>Question</span> ${t.id} →</a></div></section>`).join('');

byId('questions').innerHTML=data.questions.map(q=>`<article class="question" id="question-${q.id}" aria-labelledby="question-title-${q.id}"><div class="question-top"><span class="question-number">QUESTION ${num(q.id)} / 10</span><span class="topic-tag">${esc(data.topics[q.id-1].en)} · PDF p. ${esc(data.topics[q.id-1].pages)}</span></div><h3 id="question-title-${q.id}">${esc(q.en)}</h3><fieldset class="options" aria-labelledby="question-title-${q.id}"><legend class="sr-only">Choose one best answer</legend>${q.options.map((o,i)=>`<label class="option" id="option-${q.id}-${i}"><input type="radio" name="q-${q.id}" value="${i}" data-question="${q.id}"><span class="option-letter" aria-hidden="true">${String.fromCharCode(65+i)}</span><span class="option-text">${esc(o.en)}</span></label>`).join('')}</fieldset><div class="question-actions"><button type="button" class="check-button" data-check="${q.id}">Check answer</button><a class="review-link" data-review="${q.id}" href="#topic-${q.id}">Review this topic ↗</a></div><div class="feedback" id="feedback-${q.id}" role="status" aria-live="polite" hidden></div></article>`).join('');

function selectOrgan(key){
 if(!locations[state.cell].some(p=>p[0]===key))throw new Error('This structure is not available in the selected diagram.');
 state.organ=key;
 const f=facts.get(key);
 byId('organelle-detail').innerHTML=`<span class="detail-number"><span>STRUCTURE</span> ${num(locations[state.cell].findIndex(p=>p[0]===key)+1)}</span><h3>${esc(f.en)}</h3><div class="bilingual"><p>${esc(f.jobEn)}</p></div><a href="#fact-${f.key}" class="text-link">Learn more →</a><a href="#question-${f.topic}" class="explorer-test"><span>Practice</span> ${num(f.topic)} ↗</a>`;
 document.querySelectorAll('[data-organ]').forEach(b=>{const selected=b.dataset.organ===key;b.classList.toggle('selected',selected);b.setAttribute('aria-pressed',String(selected));});
 return {cell:state.cell,structure:key,topicId:f.topic};
}
function setCell(cell){
 if(!Object.hasOwn(locations,cell))throw new Error('Choose animal or plant.');
 state.cell=cell;
 const plant=cell==='plant';
 const img=byId('cell-image');img.src=`assets/${cell}.png`;img.width=plant?1855:1248;img.height=plant?1430:1227;img.alt=plant?'Plant cell structure diagram, source reference page 9':'Animal cell structure diagram, source reference page 8';
 byId('diagram-caption').textContent=plant?'Plant cell · PDF p. 9':'Animal cell · PDF p. 8';
 document.querySelectorAll('[data-cell]').forEach(b=>{const selected=b.dataset.cell===cell;b.classList.toggle('selected',selected);b.setAttribute('aria-pressed',String(selected));});
 byId('organelle-picker').innerHTML=locations[cell].map(([key],i)=>`<button type="button" data-organ="${key}" aria-pressed="false"><span class="organ-number">${i+1}</span> ${esc(facts.get(key).en)}</button>`).join('');
 byId('hotspots').innerHTML=locations[cell].map(([key,x,y],i)=>`<button type="button" class="hotspot" style="left:${x}%;top:${y}%" data-organ="${key}" aria-pressed="false" aria-label="${i+1}. ${esc(facts.get(key).en)}" title="${esc(facts.get(key).en)}">${i+1}</button>`).join('');
 return selectOrgan(locations[cell].some(x=>x[0]===state.organ)?state.organ:'nucleus');
}
function updateScore(){
 CourseStore.update(s=>{s.legacy??={};s.legacy.cells={selected:state.selected,graded:state.graded};});
 const graded=Object.values(state.graded);const correct=graded.filter(Boolean).length;
 byId('score').innerHTML=`<span>Answered</span> ${graded.length} / 10 · <span>Correct</span> ${correct} / 10`;
 if(graded.length===10){byId('score').insertAdjacentHTML('beforeend',` · <span>${correct===10?'All correct!':'Review mistakes and try again.'}</span>`);}
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
 if(selected===undefined){feedback.hidden=false;feedback.className='feedback wrong';feedback.textContent='Please select an answer first.';return {questionId:id,submitted:false,reason:'no_selection'};}
 const correct=selected===q.answer;state.graded[id]=correct;const sharedQuestion=COURSE_DATA.questions.find(item=>item.id==='cells-original-'+id);if(sharedQuestion&&!restoring)CourseStore.record([sharedQuestion],{[sharedQuestion.id]:selected},'legacy-cells');
 byId(`option-${id}-${q.answer}`).classList.add('answer-correct');
 if(!correct)byId(`option-${id}-${selected}`).classList.add('answer-wrong');
 feedback.className=`feedback${correct?'':' wrong'}`;feedback.hidden=false;
 feedback.innerHTML=`<strong><span>${correct?'✓ Correct':'Try again'}</span>${correct?'':` · <span>Correct answer:</span> ${String.fromCharCode(65+q.answer)}`}</strong><p>${esc(q.explainEn)}</p>${correct?'':'<p class="retry-note">Review the topic, then choose again.</p>'}`;
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
 if(link.dataset.review){const n=Number(link.dataset.review);byId(`return-${n}`).innerHTML=`<div class="return-banner"><span>Reviewing question</span> ${n}<br><a href="#question-${n}"><span>Back to question</span> ${n} →</a></div>`;}
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
