'use strict';
(() => {
  const S = CourseStore;
  const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const objectives = BIOLOGY_DATA.objectives;
  const locations = {
    animal: [['nucleus',39,49],['mitochondria',35,18],['golgi',64,25],['rough-er',37,35],['plasma-membrane',3,43],['lysosomes',65,71],['vacuoles',81,48]],
    plant: [['nucleus',19,34],['mitochondria',71,21],['golgi',50,20],['rough-er',30,27],['plasma-membrane',6.2,47],['chloroplasts',86,25],['vacuoles',56,53],['cell-wall',4,60]]
  };

  function explorer() {
    return `<section class="bio-explorer" aria-labelledby="cell-atlas-title">
      <div class="bio-section-head"><div><span class="eyebrow-course">Explore the cell</span><h2 id="cell-atlas-title">Cell atlas</h2></div><div class="bio-segmented" aria-label="Cell diagram"><button data-atlas-cell="animal" aria-pressed="true">Animal cell</button><button data-atlas-cell="plant" aria-pressed="false">Plant cell</button></div></div>
      <div class="bio-explorer-grid"><div class="bio-diagram-area"><span class="bio-diagram-tag">Select a structure to explore</span><div class="bio-diagram-wrap"><img id="atlas-image" src="../cells/assets/animal.png" alt="Animal cell with numbered organelle markers" width="1248" height="1227"><div id="atlas-hotspots"></div></div><p class="bio-figure-note">Course diagrams reused from Concept 1. Schematic; structures are not to scale.</p></div><div class="bio-explorer-details"><span class="eyebrow-course">Structure → function → quiz</span><div id="atlas-picker" class="bio-structure-picker"></div><article id="atlas-detail"></article><p class="bio-figure-note">Also see <a href="#point-plant-animal-models">this lecture’s plant and animal diagrams</a> on pages 16–17.</p></div></div>
    </section>`;
  }

  function bindExplorer() {
    if (!document.getElementById('atlas-image')) return;
    let cell = 'animal', organ = 'nucleus';
    function select(key) {
      const o = objectives.find(o => o.key === key);
      organ = key;
      document.getElementById('atlas-detail').innerHTML = `<h3>${esc(o.title)}</h3><p>${esc(o.summary)}</p><div class="bio-atlas-fact">${esc(o.bullets[0])}</div><div class="course-actions"><a class="course-button" href="#point-${o.key}">Learn & quiz →</a></div>`;
      document.querySelectorAll('[data-atlas-organ]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.atlasOrgan === key)));
    }
    function setCell(next) {
      cell = next;
      const img = document.getElementById('atlas-image');
      img.src = `../cells/assets/${cell}.png`;
      img.width = cell === 'plant' ? 1855 : 1248;
      img.height = cell === 'plant' ? 1430 : 1227;
      img.alt = `${cell === 'plant' ? 'Plant' : 'Animal'} cell with numbered organelle markers`;
      document.querySelectorAll('[data-atlas-cell]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.atlasCell === cell)));
      document.getElementById('atlas-picker').innerHTML = locations[cell].map(([key],i) => `<button data-atlas-organ="${key}" aria-pressed="false"><span>${i+1}</span> ${esc(objectives.find(o=>o.key===key).title)}</button>`).join('');
      document.getElementById('atlas-hotspots').innerHTML = locations[cell].map(([key,x,y],i) => `<button class="bio-hotspot" style="left:${x}%;top:${y}%" data-atlas-organ="${key}" aria-pressed="false" aria-label="${i+1}. ${esc(objectives.find(o=>o.key===key).title)}">${i+1}</button>`).join('');
      document.querySelectorAll('[data-atlas-organ]').forEach(b => b.onclick = () => select(b.dataset.atlasOrgan));
      select(locations[cell].some(([key]) => key === organ) ? organ : 'nucleus');
    }
    document.querySelectorAll('[data-atlas-cell]').forEach(b => b.onclick = () => setCell(b.dataset.atlasCell));
    setCell('animal');
  }

  function quiz(o) {
    const qs = COURSE_DATA.questions.filter(q => q.points.includes('biology-' + o.key));
    return `<section class="bio-quick-check" id="quick-check" aria-labelledby="quick-check-title"><div class="bio-section-head"><div><span class="eyebrow-course">Check your understanding</span><h2 id="quick-check-title">Quick quiz</h2></div><span class="muted">${qs.length} ${qs.length === 1 ? 'question' : 'questions'} · PDF p. ${o.pages.join(', ')}</span></div><div class="bio-quiz-body"><p>Choose one best answer, then check your reasoning. Results are saved in this browser and appear in Review mistakes.</p><div class="question-picker" aria-label="Questions for this objective">${qs.map((q,i)=>`<button data-inline-pick="${i}" aria-current="${i===0}" aria-label="Question ${i+1}">${i+1}</button>`).join('')}</div><div id="inline-question"></div></div></section>`;
  }

  function bindQuiz(o) {
    const host = document.getElementById('inline-question');
    if (!host) return;
    const qs = COURSE_DATA.questions.filter(q => q.points.includes('biology-' + o.key));
    let index = 0;
    function save(id, value) { S.update(s => { s.inline ??= {}; s.inline[id] = value; }); }
    function render() {
      const q = qs[index], state = S.read().inline?.[q.id] || {};
      const selected = state.selected, checked = state.checked === true, correct = selected === q.answer;
      document.querySelectorAll('[data-inline-pick]').forEach(b => {
        b.setAttribute('aria-current', String(Number(b.dataset.inlinePick) === index));
        b.classList.toggle('answered', S.read().inline?.[qs[Number(b.dataset.inlinePick)].id]?.checked === true);
      });
      host.dataset.questionId = q.id;
      host.innerHTML = `<span class="bio-question-number">QUESTION ${index+1} / ${qs.length}</span><h3 id="inline-stem">${esc(q.stem)}</h3><fieldset class="quiz-options" aria-labelledby="inline-stem"><legend class="sr-only">Choose one answer</legend>${q.options.map((option,i) => `<label class="quiz-option ${checked && i===q.answer?'correct':''} ${checked && i===selected && !correct?'incorrect':''}"><input type="radio" name="inline-answer" value="${i}" ${i===selected?'checked':''}><span class="bio-option-letter" aria-hidden="true">${String.fromCharCode(65+i)}</span><span>${esc(option)}</span></label>`).join('')}</fieldset><div class="course-actions"><button class="course-button" data-inline-check ${!Number.isInteger(selected)?'disabled':''}>Check answer</button><button class="course-button secondary" data-inline-retry ${!Number.isInteger(selected)?'hidden':''}>Try again</button><a class="bio-review-link" href="#point-${o.key}">Review this knowledge point ↑</a></div><div class="feedback-panel ${correct?'':'incorrect'}" id="inline-feedback" role="status" ${checked?'':'hidden'}>${checked?`<strong>${correct?'Correct — well reasoned.':'Not quite. Let’s work through it.'}</strong><p><strong>Answer ${String.fromCharCode(65+q.answer)}:</strong> ${esc(q.options[q.answer])}</p><p>${esc(q.explanation)}</p><a href="#point-${o.key}">Return to the explanation and diagram ↑</a>`:''}</div><div class="bio-quiz-links"><a href="../../index.html#practice/biology/${o.key}">Open focused practice →</a><a href="../../index.html#review/biology">Review mistakes →</a></div>`;
      host.querySelectorAll('input[name="inline-answer"]').forEach(input => input.onchange = () => {
        save(q.id, {selected: Number(input.value), checked: false});
        host.querySelector('[data-inline-check]').disabled = false;
        host.querySelector('[data-inline-retry]').hidden = false;
        host.querySelector('#inline-feedback').hidden = true;
        host.querySelectorAll('.quiz-option').forEach(el => el.classList.remove('correct','incorrect'));
      });
      host.querySelector('[data-inline-check]').onclick = () => {
        const current = S.read().inline?.[q.id];
        if (!Number.isInteger(current?.selected)) return;
        save(q.id, {...current, checked: true});
        S.record([q], {[q.id]: current.selected}, 'biology-inline');
        render();
        host.querySelector('#inline-feedback').scrollIntoView({block:'nearest'});
      };
      host.querySelector('[data-inline-retry]').onclick = () => { save(q.id, {}); render(); host.querySelector('input').focus(); };
    }
    document.querySelectorAll('[data-inline-pick]').forEach(b => b.onclick = () => { index = Number(b.dataset.inlinePick); render(); });
    render();
  }
  window.BiologyStudy = {explorer, bindExplorer, quiz, bindQuiz};
})();
