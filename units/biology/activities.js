'use strict';
(() => {
  const S = CourseStore;
  const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const historySource = 'https://openstax.org/books/microbiology/pages/3-2-foundations-of-modern-cell-theory';
  const proteinSource = 'https://openstax.org/books/biology-2e/pages/4-4-the-endomembrane-system-and-proteins';
  const timeline = [
    {id:'hooke',title:'Robert Hooke',text:'Names the compartments observed in cork “cells.”',date:'1665',why:'Hooke described cork compartments before Leeuwenhoek’s observations of single-celled organisms.',point:'hooke'},
    {id:'leeuwenhoek',title:'Antonie van Leeuwenhoek',text:'Observes single-celled organisms.',date:'1674',why:'Microscopic observations of living single-celled organisms followed Hooke’s work on cork.',point:'leeuwenhoek'},
    {id:'schleiden',title:'Matthias Schleiden',text:'Describes plant tissues as composed of cells.',date:'1838',why:'Schleiden’s conclusion about plants preceded Schwann’s extension to animals.',point:'schleiden'},
    {id:'schwann',title:'Theodor Schwann',text:'Extends the cellular view to animal tissues.',date:'1839',why:'Schwann extended the cellular view to animal tissues after Schleiden’s work on plants.',point:'schwann'},
    {id:'virchow',title:'Rudolf Virchow',text:'Popularizes the principle that cells arise from existing cells.',date:'1855',why:'This principle followed the plant and animal conclusions. Virchow popularized it; Remak had already supplied evidence of cell division.',point:'virchow'}
  ];
  const route = [
    {id:'rough-er',title:'Ribosome + rough ER',text:'A ribosome builds the protein, which enters the ER.',why:'For this secreted protein, synthesis and entry into the ER come before transport toward the Golgi.',point:'rough-er',short:'Build protein'},
    {id:'er-vesicle',title:'ER transport vesicle',text:'A vesicle carries cargo from the ER to the Golgi.',why:'A transport vesicle buds from the ER and delivers cargo to the Golgi; the two are not one continuous tunnel.',point:'membrane-trafficking',short:'ER → Golgi'},
    {id:'golgi',title:'Golgi apparatus',text:'Cargo is modified, sorted and packaged.',why:'The Golgi handles the arriving cargo before packaging it for delivery to the cell surface.',point:'golgi',short:'Sort & package'},
    {id:'secretory-vesicle',title:'Secretory vesicle',text:'Packaged cargo travels from the Golgi to the plasma membrane.',why:'This later vesicle carries the cargo toward the surface. It is distinct from the earlier ER-to-Golgi transport vesicle.',point:'vesicles',short:'Golgi → surface'},
    {id:'exocytosis',title:'Exocytosis',text:'The vesicle fuses with the plasma membrane and releases cargo outside.',why:'Membrane fusion releases the protein outside the cell; the large protein does not pass directly through the lipid core.',point:'exocytosis',short:'Release outside'}
  ];
  const matches = [
    {id:'nucleus',title:'Nucleus',text:'Houses hereditary DNA inside a double membrane.',why:'The nucleus encloses hereditary DNA. It is not the site where ribosomes assemble proteins.',page:22},
    {id:'ribosomes',title:'Ribosome',text:'Assembles proteins.',why:'Ribosomes carry out protein synthesis. They are not enclosed by a membrane.',page:24},
    {id:'golgi',title:'Golgi apparatus',text:'Sorts and packages cargo into vesicles.',why:'The Golgi receives and handles cargo, then packages it for delivery.',page:25},
    {id:'mitochondria',title:'Mitochondrion',text:'Supports ATP production through aerobic respiration.',why:'Mitochondria use energy from respiration to support ATP production. Plant cells contain mitochondria too.',page:26},
    {id:'lysosomes',title:'Lysosome',text:'Breaks down materials using digestive enzymes.',why:'Lysosomes contain digestive enzymes that break down material within the cell.',page:27},
    {id:'chloroplasts',title:'Chloroplast',text:'Carries out photosynthesis.',why:'Chloroplasts contain chlorophyll and the structures needed for photosynthesis.',page:28}
  ];
  const catalog = [
    {id:'timeline',title:'Build the cell-theory timeline',tag:'Put events in order',description:'Arrange five discoveries from early microscopy to the origins of new cells.',pages:'4–9',keys:timeline.map(x=>x.point),count:'5 events'},
    {id:'matching',title:'Match structures to their jobs',tag:'Match six pairs',description:'Connect each cell structure with its function, then work through any mismatches.',pages:'22, 24–28',keys:matches.map(x=>x.id),count:'6 pairs'},
    {id:'protein',title:'Follow a secreted protein',tag:'Build & play the route',description:'Arrange the journey from rough ER to the cell surface, then watch each step.',pages:'23–25, 27, 38–39',keys:route.map(x=>x.point).concat('ribosomes'),count:'5 steps'},
    {id:'osmosis',title:'Predict water movement',tag:'Change concentrations',description:'Adjust solute concentrations inside and outside a cell and predict net water flow.',pages:'36',count:'3 conditions'},
    {id:'transport',title:'Choose a transport route',tag:'Classify scenarios',description:'Compare diffusion, membrane pumps and vesicle transport in six situations.',pages:'32–38',count:'6 scenarios'},
    {id:'size',title:'Explore cell size',tag:'Change the model',description:'Resize a model cell and compare surface area, volume and exchange demands.',pages:'40–43',count:'Size slider'}
  ];
  let timer = null;
  const cleanup = () => { if (timer) clearInterval(timer); timer = null; const b=document.querySelector('[data-protein-play]');if(b)b.textContent=b.dataset.atEnd==='true'?'Replay journey':'Play journey'; };
  const meta = id => catalog.find(a=>a.id===id);
  const save = (id,state) => S.update(s=>{s.activities??={};s.activities['biology-'+id]=state;});
  function shuffle(ids) {
    const out=ids.slice();for(let i=out.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[out[i],out[j]]=[out[j],out[i]];}
    if(out.every((x,i)=>x===ids[i]))out.push(out.shift());
    return out;
  }
  function load(id,items) {
    const old=S.read().activities?.['biology-'+id],ids=items.map(x=>x.id);
    if(old?.version===1 && Array.isArray(old.order) && old.order.length===ids.length && new Set(old.order).size===ids.length && old.order.every(x=>ids.includes(x)))return old;
    const state={version:1,order:shuffle(ids),assignments:{},checked:false,completed:false,attempts:0};save(id,state);return state;
  }
  function links(id) {
    return `<section class="activity-learning"><h2>Connect this activity to the lesson</h2><div class="lab-links">${meta(id).keys.map(key=>{const o=BIOLOGY_DATA.objectives.find(o=>o.key===key);return `<a href="#point-${key}">${esc(o.title)} →</a>`;}).join('')}</div><a class="course-button secondary" href="../../index.html#test/biology">Take the unit test</a></section>`;
  }
  function heading(id) {
    const a=meta(id);return `<div class="activity-heading"><a href="#activities" class="activity-back">← All interactive activities</a><span class="eyebrow-course">${esc(a.tag)} · PDF p. ${a.pages}</span><h1>${a.title}</h1><p>${a.description}</p><p class="activity-save-note">Your activity is saved in this browser. These practice challenges do not change your quiz score.</p></div>`;
  }
  function cards() {
    return catalog.map((a,i)=>`<article class="activity-card"><span class="activity-card-number">${String(i+1).padStart(2,'0')}</span><span class="eyebrow-course">${a.tag}</span><h2>${a.title}</h2><p>${a.description}</p><div class="activity-card-meta"><span>${a.count}</span><span>PDF p. ${a.pages}</span>${S.read().activities?.['biology-'+a.id]?.completed?'<strong>✓ Completed</strong>':''}</div><a class="course-button" href="#lab-${a.id}">Open activity →</a></article>`).join('');
  }
  function hub() {
    return `<section class="biology-intro"><span class="eyebrow-course">Learn by doing</span><h1>Interactive activities</h1><p>Build, match, predict and explore. Choose an activity, get feedback, and return to the lesson whenever you need it.</p></section><div class="activity-grid">${cards()}</div>`;
  }
  function teaser() {return `<section class="activity-teaser"><div><span class="eyebrow-course">Learn by doing</span><h2>Try six interactive activities</h2><p>Build a timeline, match cell structures, follow a protein, or experiment with transport and cell size.</p></div><a class="course-button" href="#activities">Explore activities →</a></section>`;}
  function sortPage(id) {
    const isTime=id==='timeline';
    return heading(id)+`<section class="activity-workspace"><div class="activity-instructions"><h2>${isTime?'From earliest to latest':'From protein synthesis to secretion'}</h2><p>Drag a card into position, or use its Move up / Move down buttons. Check your order when you are ready.</p></div><div id="activity-sort"></div><div class="course-actions"><button class="course-button" data-activity-check>Check order</button><button class="course-button secondary" data-activity-reset>Shuffle & try again</button></div><div id="activity-feedback" class="activity-feedback" role="status" hidden></div></section>${isTime?`<aside class="activity-source-note">This timeline uses discovery dates, not birth and death dates. The lecture introduces these researchers on pages 4–9; dates beyond Hooke’s 1665 work are additional historical context from <a href="${historySource}" target="_blank" rel="noopener">OpenStax</a>.</aside>`:`<section id="protein-player" class="activity-workspace" hidden><div class="activity-instructions"><h2>Watch the journey</h2><p>A simplified route for a typical secreted protein. Vesicles carry cargo between compartments.</p></div><div class="protein-route" id="protein-route" aria-label="Protein secretion pathway"></div><div class="protein-current" id="protein-current" aria-live="polite"></div><div class="course-actions"><button class="course-button" data-protein-play>Play journey</button><button class="course-button secondary" data-protein-prev>Previous step</button><button class="course-button secondary" data-protein-next>Next step</button></div><p class="activity-save-note">Other proteins have different destinations. <a href="${proteinSource}" target="_blank" rel="noopener">Explore the endomembrane system</a>.</p></section>`}${links(id)}`;
  }
  function matchingPage() {
    return heading('matching')+`<section class="activity-workspace"><div class="activity-instructions"><h2>Which structure does this job?</h2><p>Select a structure, then select its function card. You can also drag a structure onto a card. Assign all six before checking.</p></div><div class="matching-layout"><div><h3 class="activity-bank-heading">Structures</h3><div id="structure-bank" class="structure-bank"></div><p id="matching-selection" class="activity-save-note" role="status">Select a structure to begin.</p><details class="matching-diagrams"><summary>Look at the cell diagrams</summary><figure><img src="../cells/assets/animal.png" width="1248" height="1227" alt="Animal cell schematic from the companion lesson"><figcaption>Animal cell</figcaption></figure><figure><img src="../cells/assets/plant.png" width="1855" height="1430" alt="Plant cell schematic from the companion lesson"><figcaption>Plant cell · plants also have mitochondria</figcaption></figure><p class="activity-save-note">Companion lesson diagrams; structures are not to scale.</p></details></div><div><h3 class="activity-bank-heading">Functions</h3><div id="function-cards" class="function-cards"></div></div></div><div class="course-actions"><button class="course-button" data-activity-check disabled>Check matches</button><button class="course-button secondary" data-activity-reset>Reset & try again</button></div><div id="activity-feedback" class="activity-feedback" role="status" hidden></div></section>${links('matching')}`;
  }
  function bindSort(id) {
    const items=id==='timeline'?timeline:route,expected=items.map(x=>x.id),host=document.getElementById('activity-sort');
    let state=load(id,items),dragged=null;
    function move(key,to,focusDirection) {
      const from=state.order.indexOf(key);if(from<0||to<0||to>=state.order.length||to===from)return;
      state.order.splice(from,1);state.order.splice(to,0,key);state.checked=false;save(id,state);draw();
      if(focusDirection){const row=host.querySelector(`[data-sort-id="${key}"]`);const preferred=row.querySelector(`[data-move="${focusDirection}"]`);(preferred.disabled?row.querySelector('button:not(:disabled)'):preferred).focus();}
    }
    function draw() {
      host.innerHTML=`<ol class="activity-sort-list">${state.order.map((key,i)=>{const item=items.find(x=>x.id===key),ok=key===expected[i];return `<li class="activity-sort-card ${state.checked?(ok?'is-correct':'is-wrong'):''}" draggable="true" data-sort-id="${key}"><span class="activity-position">${i+1}</span><div class="activity-sort-copy"><h3>${item.title}</h3><p>${item.text}</p>${state.checked?`<p class="activity-card-feedback">${ok?'✓ Correct position.':`↻ This belongs in position ${expected.indexOf(key)+1}.`} ${item.date?`<strong>${item.date}</strong> · `:''}${item.why} <a href="#point-${item.point}">Review →</a></p>`:''}</div><div class="activity-move-buttons"><button data-move="up" aria-label="Move ${esc(item.title)} up" ${i===0?'disabled':''}>↑</button><button data-move="down" aria-label="Move ${esc(item.title)} down" ${i===items.length-1?'disabled':''}>↓</button></div></li>`;}).join('')}</ol>`;
      const feedback=document.getElementById('activity-feedback');feedback.hidden=!state.checked;
      if(state.checked){const n=state.order.filter((x,i)=>x===expected[i]).length;feedback.classList.toggle('has-errors',n<items.length);feedback.innerHTML=`<strong>${n} / ${items.length} in the correct position</strong><p>${n===items.length?'Complete! You have connected the full sequence.':'Use the explanation on each card, move the cards and check again.'}</p>`;}
      document.querySelector('[data-activity-check]').disabled=state.checked;
      host.querySelectorAll('[data-sort-id]').forEach(card=>{
        card.querySelectorAll('[data-move]').forEach(b=>b.onclick=()=>move(card.dataset.sortId,state.order.indexOf(card.dataset.sortId)+(b.dataset.move==='up'?-1:1),b.dataset.move));
        card.ondragstart=e=>{dragged=card.dataset.sortId;e.dataTransfer.setData('text/plain',dragged);e.dataTransfer.effectAllowed='move';card.classList.add('is-dragging');};
        card.ondragend=()=>{dragged=null;host.querySelectorAll('.is-dragging,.is-drop-target').forEach(x=>x.classList.remove('is-dragging','is-drop-target'));};
        card.ondragover=e=>{e.preventDefault();card.classList.add('is-drop-target');};
        card.ondragleave=()=>card.classList.remove('is-drop-target');
        card.ondrop=e=>{e.preventDefault();const key=dragged||e.dataTransfer.getData('text/plain');if(expected.includes(key))move(key,state.order.indexOf(card.dataset.sortId));dragged=null;};
      });
      if(id==='protein'){document.getElementById('protein-player').hidden=!state.checked;if(!state.checked)cleanup();}
    }
    document.querySelector('[data-activity-check]').onclick=()=>{state.checked=true;state.attempts++;state.completed=state.completed||state.order.every((x,i)=>x===expected[i]);save(id,state);draw();document.getElementById('activity-feedback').scrollIntoView({block:'nearest'});};
    document.querySelector('[data-activity-reset]').onclick=()=>{state.order=shuffle(expected);state.checked=false;save(id,state);draw();host.querySelector('button:not(:disabled)').focus();};
    draw();if(id==='protein')bindPlayer();
  }
  function bindPlayer() {
    let step=0;const play=document.querySelector('[data-protein-play]');
    function draw() {
      document.getElementById('protein-route').innerHTML=route.map((r,i)=>`<div class="protein-stage ${i===step?'is-current':''} ${i<step?'is-done':''}" aria-current="${i===step?'step':'false'}"><span class="protein-stage-number">${i<step?'✓':i+1}</span><h3>${r.title}</h3><p>${r.short}</p><span class="protein-cargo" aria-hidden="true">●</span></div>`).join('');
      document.getElementById('protein-current').innerHTML=`<span class="eyebrow-course">STEP ${step+1} / ${route.length}</span><h3>${route[step].title}</h3><p>${route[step].text}</p><p>${route[step].why}</p>`;
      document.querySelector('[data-protein-prev]').disabled=step===0;document.querySelector('[data-protein-next]').disabled=step===route.length-1;play.dataset.atEnd=String(step===route.length-1);if(!timer)play.textContent=step===route.length-1?'Replay journey':'Play journey';
    }
    function pause(){cleanup();play.textContent=step===route.length-1?'Replay journey':'Play journey';}
    play.onclick=()=>{if(timer){pause();return;}if(step===route.length-1)step=0;play.textContent='Pause journey';timer=setInterval(()=>{step++;draw();if(step===route.length-1)pause();},2500);draw();};
    document.querySelector('[data-protein-prev]').onclick=()=>{pause();step=Math.max(0,step-1);draw();};
    document.querySelector('[data-protein-next]').onclick=()=>{pause();step=Math.min(route.length-1,step+1);draw();};
    draw();
  }
  function bindMatching() {
    let state=load('matching',matches),selected=null,dragged=null;
    state.assignments??={};
    const bank=document.getElementById('structure-bank'),targets=document.getElementById('function-cards');
    function assign(target,key) {
      if(!matches.some(x=>x.id===key))return;
      for(const k of Object.keys(state.assignments))if(state.assignments[k]===key)delete state.assignments[k];
      state.assignments[target]=key;state.checked=false;selected=null;save('matching',state);draw();targets.querySelector(`[data-target="${target}"]`).focus();
      document.getElementById('matching-selection').textContent=`${matches.find(x=>x.id===key).title} assigned. Select another structure, or check your matches.`;
    }
    function draw() {
      bank.innerHTML=matches.map(m=>`<button class="structure-token" draggable="true" data-structure="${m.id}" aria-pressed="${selected===m.id}">${m.title}<span>${Object.values(state.assignments).includes(m.id)?'Placed':'Choose'}</span></button>`).join('');
      targets.innerHTML=state.order.map((key,i)=>{const m=matches.find(m=>m.id===key),assigned=matches.find(x=>x.id===state.assignments[key]),ok=assigned?.id===key;return `<div class="function-card ${state.checked?(ok?'is-correct':'is-wrong'):''}" data-function="${key}"><button class="function-target" data-target="${key}"><span class="activity-position">${i+1}</span><span><strong>${m.text}</strong><span class="assigned-structure">${assigned?assigned.title:'Choose a structure, then select this card'}</span></span></button>${state.checked?`<p class="activity-card-feedback">${ok?'✓ Matched.':'↻ Correct match: '+m.title+'.'} ${m.why} <a href="#point-${m.id}">Review p. ${m.page} →</a></p>`:''}</div>`;}).join('');
      const count=matches.filter(m=>state.assignments[m.id]).length;
      document.querySelector('[data-activity-check]').disabled=count!==matches.length||state.checked;
      const feedback=document.getElementById('activity-feedback');feedback.hidden=!state.checked;
      if(state.checked){const n=matches.filter(m=>state.assignments[m.id]===m.id).length;feedback.classList.toggle('has-errors',n<6);feedback.innerHTML=`<strong>${n} / 6 matched correctly</strong><p>${n===6?'Complete! Each structure is connected to its job.':'Read the explanations and reassign any mismatches, then check again.'}</p>`;}
      bank.querySelectorAll('[data-structure]').forEach(b=>{
        b.onclick=()=>{selected=b.dataset.structure;bank.querySelectorAll('button').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));document.getElementById('matching-selection').textContent='Now select the function of '+matches.find(m=>m.id===selected).title+'.';};
        b.ondragstart=e=>{dragged=b.dataset.structure;e.dataTransfer.setData('text/plain',dragged);e.dataTransfer.effectAllowed='move';};b.ondragend=()=>{dragged=null;targets.querySelectorAll('.is-drop-target').forEach(x=>x.classList.remove('is-drop-target'));};
      });
      targets.querySelectorAll('[data-function]').forEach(card=>{
        card.querySelector('[data-target]').onclick=()=>{if(selected)assign(card.dataset.function,selected);else document.getElementById('matching-selection').textContent='Choose a structure first, then select its function.';};
        card.ondragover=e=>{e.preventDefault();card.classList.add('is-drop-target');};card.ondragleave=()=>card.classList.remove('is-drop-target');
        card.ondrop=e=>{e.preventDefault();assign(card.dataset.function,dragged||e.dataTransfer.getData('text/plain'));dragged=null;};
      });
    }
    document.querySelector('[data-activity-check]').onclick=()=>{state.checked=true;state.attempts++;state.completed=state.completed||matches.every(m=>state.assignments[m.id]===m.id);save('matching',state);draw();document.getElementById('activity-feedback').scrollIntoView({block:'nearest'});};
    document.querySelector('[data-activity-reset]').onclick=()=>{state.assignments={};state.order=shuffle(matches.map(x=>x.id));state.checked=false;selected=null;save('matching',state);draw();document.getElementById('matching-selection').textContent='Select a structure to begin.';bank.querySelector('button').focus();};
    draw();
  }
  const has=hash=>hash==='activities'||['lab-timeline','lab-matching','lab-protein'].includes(hash);
  const render=hash=>hash==='activities'?hub():hash==='lab-matching'?matchingPage():sortPage(hash.slice(4));
  const bind=hash=>hash==='lab-matching'?bindMatching():['lab-timeline','lab-protein'].includes(hash)?bindSort(hash.slice(4)):undefined;
  function relatedLinks(o){return catalog.filter(a=>a.keys?.includes(o.key)).map(a=>`<a class="course-button secondary" href="#lab-${a.id}">${a.title} →</a>`).join('');}
  window.BiologyActivities={catalog,has,render,bind,cleanup,teaser,relatedLinks};
})();
