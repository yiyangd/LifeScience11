'use strict';
(() => {
  const dict=window.COURSE_ZH||{},valid=['en','zh','both'],S=window.CourseStore;
  const norm=s=>String(s??'').replace(/\s+/g,' ').trim();
  const saved=S.read();let mode=valid.includes(saved.language)?saved.language:valid.includes(saved.legacy?.levels?.lang)?saved.legacy.levels.lang:'en';
  const attrs=new Map(),plain=new Map();let observer;
  function tr(text){
    const s=norm(text);if(Object.hasOwn(dict,s))return dict[s];
    for(const [pattern,fn] of rules){const match=s.match(pattern);if(match)return fn(...match.slice(1));}
    return null;
  }
  const t=s=>tr(s)||s;
  const rules=[
    [/^(\d+) learning objectives · (\d+) questions · (\d+) source pages$/, (a,b,c)=>`${a} 个知识点 · ${b} 道题 · ${c} 页原课件`],
    [/^(.+) · PDF p\. (.+)$/, (a,b)=>`${t(a)} · PDF 第 ${b} 页`],
    [/^PDF pages (.+) · (\d+) objectives$/, (a,b)=>`PDF 第 ${a} 页 · ${b} 个知识点`],
    [/^PDF p\. (.+)$/, a=>`PDF 第 ${a} 页`],
    [/^p\. (\d+)$/, a=>`第 ${a} 页`],
    [/^Cell Biology · PDF page (\d+) of 43 ·$/, n=>`细胞生物学 · PDF 第 ${n} 页，共 43 页 ·`],
    [/^Original Cell Biology lecture page (\d+)\. (.*)$/, (n,rest)=>`细胞生物学原课件第 ${n} 页。${t(rest)}`],
    [/^(\d+) (question|questions) · PDF p\. (.+)$/, (n,_,p)=>`${n} 道题 · PDF 第 ${p} 页`],
    [/^QUESTION (\d+) \/ (\d+)$/, (a,b)=>`第 ${a} 题，共 ${b} 题`],
    [/^Question (\d+)$/, n=>`第 ${n} 题`],
    [/^Answer ([A-Z]):$/, a=>`答案 ${a}：`],
    [/^STEP (\d+) \/ (\d+)$/, (a,b)=>`第 ${a} 步，共 ${b} 步`],
    [/^Move (.+) (up|down)$/, (name,dir)=>`将“${t(name)}”${dir==='up'?'上移':'下移'}`],
    [/^(\d+) \/ (\d+) in the correct position$/, (a,b)=>`${b} 个位置中有 ${a} 个正确`],
    [/^(\d+) \/ 6 matched correctly$/, n=>`6 组中有 ${n} 组配对正确`],
    [/^↻ This belongs in position (\d+)\.$/, n=>`↻ 应放在第 ${n} 位。`],
    [/^↻ This belongs in position (\d+)\. (.+)$/, (n,s)=>`↻ 应放在第 ${n} 位。${t(s)}`],
    [/^✓ Correct position\. (.+)$/, s=>`✓ 位置正确。${t(s)}`],
    [/^· (.+)$/, s=>tr(s)?`· ${t(s)}`:null],
    [/^Concept 1 · (.+)$/, s=>`概念一 · ${t(s)}`],
    [/^(.+) →$/, s=>tr(s)?`${t(s)} →`:null],
    [/^↻ Correct match: (.+?)\. (.+)$/, (name,why)=>`↻ 正确配对：${t(name)}。${t(why)}`],
    [/^✓ Matched\. (.+)$/, why=>`✓ 配对正确。${t(why)}`],
    [/^Now select the function of (.+)\.$/, name=>`现在请选择${t(name)}的功能。`],
    [/^(.+) assigned\. Select another structure, or check your matches\.$/, name=>`已放置${t(name)}。请选择下一个结构，或检查配对。`],
    [/^Review p\. (\d+) →$/, n=>`复习第 ${n} 页 →`],
    [/^(\d+)\. (.+)$/, (n,label)=>tr(label)?`${n}. ${t(label)}`:null],
    [/^(Animal|Plant) cell with numbered organelle markers$/, name=>`${name==='Animal'?'动物':'植物'}细胞图，带编号的细胞器标记`],
    [/^Review your mistakes \((\d+)\)$/, n=>`重练错题（${n}）`],
    [/^(\d+) lessons available$/, n=>`现有 ${n} 份课件`],
    [/^(\d+) learning objectives$/, n=>`${n} 个知识点`],
    [/^(\d+) scored questions$/, n=>`${n} 道计分题`],
    [/^(\d+) objectives( · source check pending)?$/, (n,p)=>`${n} 个知识点${p?' · 原课件待核验':''}`],
    [/^(\d+) questions?$/, n=>`${n} 道题`],
    [/^(\d+)\/(\d+) studied$/, (a,b)=>`已学 ${a}/${b}`],
    [/^(\d+) of (\d+) objectives marked studied$/, (a,b)=>`${b} 个知识点中已学 ${a} 个`],
    [/^The combined test checks all (\d+) learning objectives with (\d+) questions\. You can pause and resume in this browser\.$/, (a,b)=>`综合测试用 ${b} 道题检查全部 ${a} 个知识点。你可以暂停，并在当前浏览器中继续。`],
    [/^(\d+) objectives · (\d+) scored questions(.*)$/, (a,b,tail)=>`${a} 个知识点 · ${b} 道计分题${t(tail)}`],
    [/^(.+) · (\d+) questions$/, (a,b)=>`${t(a)} · ${b} 道题`],
    [/^Question (\d+) of (\d+)$/, (a,b)=>`第 ${a} 题，共 ${b} 题`],
    [/^Question (\d+), (answered|unanswered)$/, (n,s)=>`第 ${n} 题，${s==='answered'?'已答':'未答'}`],
    [/^(\d+)\/(\d+) answered · saved in this browser$/, (a,b)=>`已答 ${a}/${b} 题 · 已保存在当前浏览器`],
    [/^Jump to a question \((\d+)\/(\d+) answered\)$/, (a,b)=>`跳转到题目（已答 ${a}/${b} 题）`],
    [/^You have a saved (result|attempt) \((\d+)\/(\d+) answered\)\.$/, (s,a,b)=>`你有已保存的${s==='result'?'测试结果':'答题记录'}（已答 ${a}/${b} 题）。`],
    [/^(\d+)% correct · (\d+) to review$/, (a,b)=>`正确率 ${a}% · ${b} 题待复习`],
    [/^Correct answer: (.+)$/, s=>`正确答案：${t(s)}`],
    [/^Your answer: (.+)$/, s=>`你的答案：${t(s)}`],
    [/^Review (.+)$/, s=>`复习${t(s)}`],
    [/^(.+) · Source p\. (.+)$/, (s,p)=>`${t(s)} · 原课件第 ${p} 页`],
    [/^(Practice|Assessment) · (.+)$/, (m,s)=>`${m==='Practice'?'练习':'测试'} · ${t(s)}`],
    [/^([a-z0-9-]+) · (PDF|Source reference) p\. (.+)$/, (id,s,p)=>`${id} · ${s==='PDF'?'PDF':'原课件'}第 ${p} 页`],
    [/^(\d+) \/ (\d+) answered$/, (a,b)=>`已答 ${a}/${b} 题`],
    [/^(\d+) correct · (\d+) to review$/, (a,b)=>`${a} 题正确 · ${b} 题待复习`],
    [/^(\d+) questions · (.+)$/, (n,label)=>`${n} 道题 · ${t(label)}`],
    [/^Review: (.+)$/, s=>`复习：${t(s)}`],
    [/^Source: (.+)$/, s=>`来源：${t(s)}`],
    [/^Correct\. (.+)$/, s=>`正确。${t(s)}`],
    [/^Try the comparison again\. (.+)$/, s=>`再比较一次。${t(s)}`],
    [/^The matching route is (.+?)\. (.+)$/, (a,b)=>`对应的运输方式是${t(a)}。${t(b)}`],
    [/^Compare the two growth factors\. (.+)$/, s=>`比较两个增长倍数。${t(s)}`],
    [/^At side length (.+), each unit of volume has (.+) units of membrane area\. As a similarly shaped cell grows, volume increases faster than surface area, making exchange more demanding\. Actual cells can also change shape, fold membranes or use internal transport; this is a geometric model, not a fixed death threshold\.$/, (l,r)=>`边长为 ${l} 时，每单位体积对应 ${r} 单位的膜面积。形状相似的细胞越大，体积增长越快于表面积，物质交换的负担也越大。真实细胞还能改变形状、折叠膜或利用内部运输；这是几何模型，并不表示达到某个大小就一定死亡。`],
    [/^Area ×(.*)$/, n=>`表面积 ×${n}`],[/^Volume ×(.*)$/, n=>`体积 ×${n}`],
  ];
  let lastTitle=null;
  function title(){const current=document.title,en=lastTitle&&[lastTitle.en,lastTitle.zh,`${lastTitle.zh} / ${lastTitle.en}`].includes(current)?lastTitle.en:current;const suffix=' · LifeScience 11',name=en.endsWith(suffix)?en.slice(0,-suffix.length):en,translated=tr(name);if(!translated)return;lastTitle={en,zh:translated+(en.endsWith(suffix)?suffix:'')};document.title=shown(lastTitle.en,lastTitle.zh);}
  const excluded='script,style,pre,code,textarea,select[data-language-control],.ls-localized,[data-no-localize]';
  function shown(en,zh){return mode==='en'?en:mode==='zh'?zh:`${zh} / ${en}`;}
  function scan(root){
    if(!root?.isConnected)return;
    const element=root.nodeType===1?root:root.parentElement;if(!element||element.closest(excluded))return;
    const nodes=[];if(root.nodeType===3)nodes.push(root);else{const walk=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);while(walk.nextNode())nodes.push(walk.currentNode);}
    for(const node of nodes){
      if(!node.isConnected||!node.parentElement||node.parentElement.closest(excluded))continue;
      const original=plain.get(node)?.en||node.textContent,key=norm(original),zh=tr(key);if(!zh||zh===key)continue;
      if(['OPTION','TITLE','TEXT'].includes(node.parentElement.tagName.toUpperCase())){plain.set(node,{en:key,zh});const next=shown(key,zh);if(node.textContent!==next)node.textContent=next;continue;}
      const wrap=document.createElement('span');wrap.className='ls-localized';wrap.dataset.english=key;
      const z=document.createElement('span');z.className='ls-zh';z.lang='zh-CN';z.textContent=zh;
      const e=document.createElement('span');e.className='ls-en';e.lang='en';e.textContent=key;
      const lead=original.match(/^\s*/)[0],tail=original.match(/\s*$/)[0];wrap.append(z,e);node.replaceWith(document.createTextNode(lead),wrap,document.createTextNode(tail));
    }
    const els=root.nodeType===1?[root,...root.querySelectorAll('[aria-label],[alt],[title],[placeholder]')]:[];
    for(const el of els){if(el.closest(excluded))continue;for(const name of ['aria-label','alt','title','placeholder']){if(!el.hasAttribute(name))continue;const old=attrs.get(el)?.[name],value=el.getAttribute(name);const en=old&&[old.en,old.zh,shown(old.en,old.zh)].includes(value)?old.en:value,zh=tr(en);if(!zh)continue;const entries=attrs.get(el)||{};entries[name]={en,zh};attrs.set(el,entries);const next=shown(en,zh);if(value!==next)el.setAttribute(name,next);}}
  }
  function setMode(next,persist=true){
    if(!valid.includes(next))return;mode=next;document.documentElement.dataset.language=mode;document.documentElement.lang=mode==='en'?'en':'zh-CN';
    document.querySelectorAll('[data-language-control]').forEach(el=>el.value=mode);
    if(persist)S.update(s=>{s.language=mode;});
    for(const [el,entries] of attrs){if(!el.isConnected){attrs.delete(el);continue;}for(const [key,{en,zh}] of Object.entries(entries))el.setAttribute(key,shown(en,zh));}
    for(const [node,{en,zh}] of plain){if(node.isConnected)node.textContent=shown(en,zh);else plain.delete(node);}
    title();
    document.dispatchEvent(new CustomEvent('course-languagechange',{detail:mode}));
  }
  document.querySelectorAll('[data-language-control]').forEach(el=>{el.onchange=()=>setMode(el.value);});
  setMode(mode,false);scan(document.body);
  observer=new MutationObserver(records=>{const roots=new Set();for(const m of records){if(m.type==='childList'){for(const n of m.addedNodes)roots.add(n);}else roots.add(m.target);}for(const root of roots)scan(root);title();});
  observer.observe(document.body,{subtree:true,childList:true,characterData:true,attributes:true,attributeFilter:['aria-label','alt','title','placeholder']});
  window.CourseLanguage={set:setMode,get:()=>mode,translate:tr,scan};
})();
