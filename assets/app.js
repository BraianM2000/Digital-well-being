(()=>{
'use strict';
const KEY='brujula-language-v3';
const root=document.documentElement;
const navLabels={
  es:['Inicio','🎯 Atención','🌙 Sueño','🚶 Movimiento','💬 Redes','🗓️ Tiempo','📚 Créditos'],
  en:['Home','🎯 Attention','🌙 Sleep','🚶 Movement','💬 Social','🗓️ Time','📚 Credits']
};
const ui={
 es:{lang:'EN',next:'Siguiente →',prev:'← Anterior',correct:'✓ Correcto. ¡Buen trabajo!',wrong:'✕ Incorrecto. Revisa la idea e inténtalo de nuevo.',saved:'🧭 Guardado en esta sesión.',reset:'Reiniciar',start:'Iniciar',stop:'Detener',open:'Abrir',close:'Cerrar',finish:'Completar'},
 en:{lang:'ES',next:'Next →',prev:'← Previous',correct:'✓ Correct. Good job!',wrong:'✕ Incorrect. Review the idea and try again.',saved:'🧭 Saved for this session.',reset:'Reset',start:'Start',stop:'Stop',open:'Open',close:'Close',finish:'Complete'}
};
function lang(){return root.dataset.lang==='en'?'en':'es'}
function applyLanguage(l){
 root.dataset.lang=l;root.lang=l;
 document.querySelectorAll('[data-es][data-en]').forEach(el=>{
   el.textContent=el.dataset[l];
 });
 document.querySelectorAll('[data-es-html][data-en-html]').forEach(el=>{
   el.innerHTML=el.dataset[l+'Html'];
 });
 document.querySelectorAll('[data-placeholder-es][data-placeholder-en]').forEach(el=>el.placeholder=el.getAttribute('data-placeholder-'+l) || '');
 document.querySelectorAll('[data-aria-es][data-aria-en]').forEach(el=>el.setAttribute('aria-label',el.dataset['aria-'+l]));
 document.querySelectorAll('[data-title-es][data-title-en]').forEach(el=>el.title=el.dataset['title-'+l]);
 const b=document.querySelector('.lang-switch'); if(b)b.textContent=ui[l].lang;
 document.querySelectorAll('[data-ui]').forEach(el=>{const k=el.dataset.ui;if(ui[l][k])el.textContent=ui[l][k]});
 document.querySelectorAll('.main-nav a').forEach((a,i)=>{if(navLabels[l][i])a.textContent=navLabels[l][i]});
 localStorage.setItem(KEY,l);
 document.dispatchEvent(new CustomEvent('languagechange',{detail:{lang:l}}));
}
function toggle(){applyLanguage(lang()==='es'?'en':'es')}
function setupQuiz(){
 document.querySelectorAll('[data-quiz]').forEach(q=>{
  const feedback=q.querySelector('.feedback');
  q.querySelectorAll('.choice').forEach(btn=>btn.addEventListener('click',()=>{
   q.querySelectorAll('.choice').forEach(x=>x.classList.remove('wrong','correct'));
   const ok=btn.dataset.correct==='true';btn.classList.add(ok?'correct':'wrong');
   if(feedback){feedback.className='feedback show '+(ok?'good':'bad');feedback.textContent=ok?ui[lang()].correct:ui[lang()].wrong}
  }));
 });
}
function setupRange(){
 document.querySelectorAll('[data-range]').forEach(box=>{
  const input=box.querySelector('input[type=range]'),value=box.querySelector('[data-range-value]'),bar=box.querySelector('.bar i'),msg=box.querySelector('[data-range-message]');
  const update=()=>{const n=Number(input.value);if(value)value.textContent=n+'%';if(bar)bar.style.width=n+'%';if(msg)msg.textContent=lang()==='en'?(n<35?'🟢 Low noise':n<70?'🟡 Medium noise':'🔴 High noise'):(n<35?'🟢 Bajo ruido':n<70?'🟡 Ruido medio':'🔴 Mucho ruido')};
  input.addEventListener('input',update);document.addEventListener('languagechange',update);update();
 });
}
function setupFlips(){document.querySelectorAll('.flip button').forEach(btn=>btn.addEventListener('click',()=>btn.parentElement.classList.toggle('open')))}
function setupTimer(){document.querySelectorAll('[data-timer]').forEach(box=>{
 let total=30,remaining=30,timer=null;const time=box.querySelector('.time');const paint=()=>time.textContent='00:'+String(remaining).padStart(2,'0');
 box.querySelector('[data-start]').addEventListener('click',()=>{clearInterval(timer);timer=setInterval(()=>{remaining--;paint();if(remaining<=0){clearInterval(timer);alert(lang()==='en'?'🌙 Ritual complete.':'🌙 Ritual completo.')}},1000)});
 box.querySelector('[data-reset]').addEventListener('click',()=>{clearInterval(timer);remaining=total;paint()});paint();
})}
function setupChecklist(){document.querySelectorAll('[data-checklist]').forEach(box=>{const out=box.querySelector('[data-check-count]');const update=()=>{const n=box.querySelectorAll('input:checked').length;out.textContent=lang()==='en'?`${n} items checked`:`${n} elementos marcados`};box.querySelectorAll('input').forEach(i=>i.addEventListener('change',update));document.addEventListener('languagechange',update);update()})}
function setupContract(){
 document.querySelectorAll('[data-contract]').forEach(box=>{
  const btn=box.querySelector('#downloadContract');
  if(!btn)return;
  const get=id=>{const el=document.getElementById(id);return el?el.value.trim():''};
  const feedback=box.querySelector('#contractFeedback');
  btn.addEventListener('click',()=>{
   const current=lang(), limit=get('contractLimit'), cue=get('contractCue'), focus=get('contractFocus');
   if(!limit||!cue||!focus){
    if(feedback)feedback.textContent=current==='en'?'⚠️ Please complete the three parts before downloading your contract.':'⚠️ Completa las tres partes antes de descargar tu contrato.';
    return;
   }
   const date=new Date().toLocaleDateString(current==='en'?'en-US':'es-CO');
   const content=current==='en'
    ? `DIGITAL CONTRACT\n\nDate: ${date}\n\nMy digital limit:\n${limit}\n\nMy closing cue:\n${cue}\n\nMy priority:\n${focus}\n\nCommitment:\nI will test these decisions during the next week and reflect on what works for me.\n\n🧭 Digital Compass`
    : `CONTRATO DIGITAL\n\nFecha: ${date}\n\nMi límite digital:\n${limit}\n\nMi señal de cierre:\n${cue}\n\nMi prioridad:\n${focus}\n\nCompromiso:\nProbaré estas decisiones durante la próxima semana y reflexionaré sobre lo que funciona para mí.\n\n🧭 Brújula Digital`;
   const blob=new Blob([content],{type:'text/plain;charset=utf-8'}), url=URL.createObjectURL(blob), a=document.createElement('a');
   a.href=url;a.download=current==='en'?'digital-contract.txt':'contrato-digital.txt';document.body.appendChild(a);a.click();a.remove();
   setTimeout(()=>URL.revokeObjectURL(url),1000);
   if(feedback)feedback.textContent=current==='en'?'✓ Your contract has been downloaded.':'✓ Tu contrato se ha descargado.';
  });
 });
}
function setupNav(){
 const current=location.pathname.split('/').pop()||'index.html';document.querySelectorAll('.main-nav a').forEach(a=>{const href=a.getAttribute('href');if(href===current || (current==='index.html'&&href==='#inicio'))a.classList.add('active')});
 document.querySelectorAll('[data-nav-next]').forEach(a=>{a.textContent=ui[lang()].next});document.querySelectorAll('[data-nav-prev]').forEach(a=>{a.textContent=ui[lang()].prev});document.addEventListener('languagechange',()=>{document.querySelectorAll('[data-nav-next]').forEach(a=>a.textContent=ui[lang()].next);document.querySelectorAll('[data-nav-prev]').forEach(a=>a.textContent=ui[lang()].prev)})
}
function init(){document.querySelector('.lang-switch')?.addEventListener('click',toggle);setupQuiz();setupRange();setupFlips();setupTimer();setupChecklist();setupContract();setupNav();applyLanguage(localStorage.getItem(KEY)==='en'?'en':'es')}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
