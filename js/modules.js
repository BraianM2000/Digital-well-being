
const LANG_KEY = "dw-lang";

const dictionary = {
  en: {
    home:"Home", modules:"Modules", about:"About", credits:"Credits",
    brand:"Digital Well-being", sub:"Learn • Reflect • Improve"
  },
  es: {
    home:"Inicio", modules:"Módulos", about:"Acerca de", credits:"Créditos",
    brand:"Bienestar Digital", sub:"Aprende • Reflexiona • Mejora"
  }
};

function currentLanguage(){
  return localStorage.getItem(LANG_KEY) || "en";
}

function applyLanguage(lang){
  document.documentElement.lang = lang;

  // Complete bilingual spans used by all module/subsection pages.
  document.querySelectorAll("[data-lang]").forEach(el=>{
    const show = el.dataset.lang === lang;
    el.hidden = !show;
    el.setAttribute("aria-hidden", String(!show));
  });

  // Dictionary-based labels used by the home page.
  const d = dictionary[lang];
  document.querySelectorAll("[data-i18n]").forEach(el=>{
    const key = el.dataset.i18n;
    if(d[key]) el.textContent = d[key];
  });

  // Bilingual page titles.
  const body = document.body;
  if(body?.dataset.titleEn && body?.dataset.titleEs){
    document.title = lang === "es" ? body.dataset.titleEs : body.dataset.titleEn;
  }

  const btn = document.getElementById("languageToggle");
  if(btn){
    btn.setAttribute("aria-label", lang === "en" ? "Switch to Spanish" : "Cambiar a inglés");
  }

  document.querySelectorAll(".quiz-result").forEach(result=>{
    if(result.dataset.state){
      result.textContent = lang === "es"
        ? (result.dataset.state === "correct" ? "¡Correcto! Buena elección." : "No exactamente. Revisa la idea y vuelve a intentarlo.")
        : (result.dataset.state === "correct" ? "Correct! Good choice." : "Not quite. Review the idea and try again.");
    }
  });

  document.querySelectorAll(".score[data-done]").forEach(score=>{
    score.textContent = lang === "es"
      ? `Progreso: ${score.dataset.done}/${score.dataset.total}`
      : `Progress: ${score.dataset.done}/${score.dataset.total}`;
  });
}

function setLanguage(lang){
  localStorage.setItem(LANG_KEY, lang);
  applyLanguage(lang);
}

document.addEventListener("DOMContentLoaded", ()=>{
  applyLanguage(currentLanguage());

  const langBtn = document.getElementById("languageToggle");
  if(langBtn) langBtn.addEventListener("click",()=>{
    setLanguage(currentLanguage() === "en" ? "es" : "en");
  });

  const menu = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".main-nav");
  if(menu && nav){
    menu.addEventListener("click",()=>{
      const open = nav.classList.toggle("open");
      menu.setAttribute("aria-expanded",String(open));
    });
  }

  document.querySelectorAll("#year").forEach(e=>e.textContent=new Date().getFullYear());

  document.querySelectorAll(".click-card").forEach(card=>{
    card.addEventListener("click",()=>{
      document.querySelectorAll(".click-card").forEach(x=>x.classList.remove("active"));
      document.querySelectorAll(".click-detail").forEach(x=>x.classList.remove("show"));
      card.classList.add("active");
      const detail=document.getElementById(card.dataset.target);
      if(detail) detail.classList.add("show");
    });
  });

  document.querySelectorAll(".quiz-option").forEach(option=>{
    option.addEventListener("click",()=>{
      const quiz=option.closest(".quiz");
      const result=quiz?.querySelector(".quiz-result");
      if(!quiz || !result) return;
      quiz.querySelectorAll(".quiz-option").forEach(x=>x.classList.remove("correct","wrong"));
      const ok=option.dataset.correct==="true";
      option.classList.add(ok?"correct":"wrong");
      result.dataset.state=ok?"correct":"wrong";
      applyLanguage(currentLanguage());
    });
  });

  const checks=document.querySelectorAll(".check input");
  const score=document.querySelector(".score");
  if(checks.length && score){
    const update=()=>{
      const done=[...checks].filter(x=>x.checked).length;
      score.dataset.done=done;score.dataset.total=checks.length;
      applyLanguage(currentLanguage());
    };
    checks.forEach(x=>x.addEventListener("change",update));
    update();
  }
});
