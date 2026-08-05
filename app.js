/* =========================================================
   Northland Driving — shared behaviour
   • sticky-header state • mobile nav • language toggle (EN/TL)
   • scroll reveal • FAQ accordion • email booking generator
   ---------------------------------------------------------
   ========================================================= */

// Contact email. This is where booking messages go.
window.ND_EMAIL = "hello@northlanddriving.com";

/* ---- Translations. English is the source text in the HTML.
   Dictionary supports 'en' overrides (if needed) and 'tl' (Tagalog). ---- */
window.ND_DICT = {
  en: {
    "nav.about": "Our Drivers"
  },
  tl: {
    /* NAV & CTA */
    "nav.about": "Aming Mga Driver",
    "nav.pricing": "Presyo",
    "nav.permit": "Tulong sa Permit",
    "nav.contact": "Kontak",
    "nav.quiz": "Quiz",
    "nav.book": "Mag-book ng lesson",
    "cta.book": "Mag-book ng lesson",
    "cta.pricing": "Tingnan ang presyo",
    "cta.contact": "Makipag-ugnayan sa amin",
    "cta.learn": "Paano ito gumagana",
    "cta.permit": "Gabay sa permit",
    "cta.quiz": "Subukan ang study quiz",

    /* QUIZ PAGE HEADER */
    "quiz.title": "Study Quiz sa Permit · Northland Driving",
    "quiz.eyebrow": "Study quiz sa permit",
    "quiz.h1": "Subukan ang sarili mo.",
    "quiz.intro": "Sampung tanong kada beses, random na kinukuha mula sa bank ng tatlumpu. Makikita mo ang sagot at maikling paliwanag habang naglalaro.",
    "quiz.note": "Praktis lang — hindi ito ang opisyal na test. Pwedeng pumili ng English o Tagalog. Pag-aralan din ang opisyal na Missouri Driver Guide.",

    /* FOOTER & COMMON */
    "foot.tag": "Kalmado at mapagpasensyang driving lessons para sa mga adult na babae sa Gladstone at KC Northland.",
    "foot.explore": "Tuklasin",
    "foot.lessons": "Mga Aralin",
    "foot.contact": "Kontak",
    "foot.area": "Naglilingkod sa Gladstone at KC Northland, Missouri.",
    "foot.owned": "Lokal na negosyo, pag-aari ng babae · Gladstone, MO",
    "foot.rights": "© 2026 Northland Driving.",
    "foot.emailcta": "Mag-email sa amin",
    "foot.book": "Mag-book ng lesson",
    "foot.home": "Home",
    "common.email": "Mag-email",
    "common.badge.owned": "Pag-aari ng babae",
    "common.badge.car": "Aming kotse ang gamit",
    "common.badge.lang": "English at Tagalog",

    /* HOME */
    "home.title": "Home · Northland Driving",
    "home.eyebrow": "Driving lessons sa Gladstone, MO · KC Northland",
    "home.h1": "Matutong mag-drive sa sarili mong bilis.",
    "home.lead": "One-on-one na driving lessons para sa mga adult na babae sa Gladstone at KC Northland. Magsimula man mula sa simula o naghahanda para sa Missouri road test, ang aming mga pasensyosang babaeng driver ang gagabay sa iyo step-by-step sa sarili mong bilis.",
    "home.m1": "Mga pasensyosang babaeng driver",
    "home.m2": "Aming kotse ang gamit, dumating ka na lang",
    "home.m3": "Lessons sa English o Tagalog",
    "home.who.eyebrow": "Para kanino",
    "home.who.h2": "Ginawa para sa mga babae, ng mga babae.",
    "home.who.lead": "Ang aming mga babaeng driver ay nakatuon sa pagtuturo sa mga adult na babae, one-on-one. Karamihan sa aming mga mag-aaral ay hindi pa nakakapag-drive, bumabalik matapos ang takot, o naghahanda para sa Missouri road test.",
    "home.who1.t": "Hindi pa nakakapag-drive",
    "home.who1.p": "Sisimulan natin sa basics, hakbang-hakbang, walang ipinapalagay.",
    "home.who2.t": "Balik na may kaba",
    "home.who2.p": "Ang aming malumanay at nakakapagpalakas-loob na pamamaraan ay tumutulong upang maalis ang kaba para makabuo ka ng tunay na kumpiyansa.",
    "home.who3.t": "Nag-aaral sa English",
    "home.who3.p": "Malinaw at hindi minamadali. Ang aming koponan ay nagpapadama sa mga nag-aaral pa ng English na silang lubos na tanggap.",
    "home.who4.t": "Aming mga babaeng driver",
    "home.who4.p": "Mga adult na babae lang ang tinuturuan namin, at babae ang iyong instructor — isang komportable at walang-panghuhusgang lugar para matuto.",
    "home.how.eyebrow": "Paano ito gumagana",
    "home.how.h2": "Mula parking lot hanggang lisensya.",
    "home.how.lead": "Malinaw na tatlong yugto. Susulong lang tayo kapag handa ka na.",
    "home.s1.t": "Basics sa lote",
    "home.s1.p": "Pag-andar, preno, manibela, salamin at parking sa malaki at bakanteng lote, walang trapiko.",
    "home.s2.t": "Bumuo ng kumpiyansa",
    "home.s2.p": "Malumanay na liko, pag-atras, pagkontrol sa lane at blind spot hangga't maging natural.",
    "home.s3.t": "Totoong kalsada",
    "home.s3.p": "Susulong tayo sa tahimik na kalye ng Northland na may totoong signs, tawiran at liko.",
    "home.band.h2": "Simulan ang unang pagmamaneho.",
    "home.band.p": "Mag-book ng session sa aming mga driver ngayon. Libreng sundo at hatid para sa mga residente ng KC Northland.",

    /* ABOUT */
    "about.title": "Aming Mga Driver · Northland Driving",
    "about.eyebrow": "Aming Mga Driver",
    "about.h1": "Mga pasensyoso at nakakakapagpalakas ng loob na instructor.",
    "about.frametag": "Punong Instruktor: Mary",
    "about.phcaption": "Litrato, malapit na",
    "about.pull": "“Walang minamadali. Sa bilis mo tayo pupunta hangga't hindi pa normal ang pakiramdam sa kotse.”",
    "about.p1": "Ang Northland Driving ay isang independiyente at lokal na negosyo na pag-aari ng babae sa Gladstone, Missouri. Pinamumunuan ni Mary ang aming koponan ng mga babaeng instructor, na nagtuturo sa mga adult na babae nang may pasensya, bait, at praktikal na karanasan sa kapitbahayan.",
    "about.p2": "Bilang punong instructor, nauunawaan ni Mary at ng aming koponan ang pakiramdam ng pag-aaral ng malaking bagay sa bagong bansa at wika. Nag-aalok kami ng lessons sa English o Tagalog, nang walang minamadali.",
    "about.v1.t": "Tunay na pasensya",
    "about.v1.p": "Walang sigawan, walang pressure. Malinaw na ipinapaliwanag ni Mary at ng aming koponan ang bawat hakbang hanggang sa maging 100% komportable ka.",
    "about.v2.t": "Kasama ang kotse",
    "about.v2.p": "Magsanay sa aming ligtas at malinis na sasakyan. Libreng sundo at hatid sa buong KC Northland.",
    "about.v3.t": "English o Tagalog",
    "about.v3.p": "Komportableng magturo sa mga nag-aaral pa ng English.",
    "about.v4.t": "Lokal at maaasahan",
    "about.v4.p": "Pag-aari ng babae, base sa Gladstone.",
    "about.stat1": "Parking lot",
    "about.stat1l": "Kung saan nagsisimula",
    "about.stat2": "1-sa-1",
    "about.stat2l": "Laging one-on-one",
    "about.stat3": "EN · TL",
    "about.stat3l": "Wika ng lesson",

    /* PRICING ($85 / $160 / $450) */
    "pricing.title": "Presyo · Northland Driving",
    "pricing.eyebrow": "Presyo",
    "pricing.h1": "Simple at malinaw na presyo.",
    "pricing.lead": "Pumili ng 1-oras na focus session, standard test prep, o 3-session confidence package. Kasama sa bawat opsyon ang aming sasakyan at libreng sundo sa Northland area.",
    "pricing.per": "/ session",
    "pricing.t1.name": "1-Oras na Focus Session",
    "pricing.t1.sub": "Isang 1-oras na session · mag-focus sa mga tiyak na kasanayan o basics sa parking lot",
    "pricing.t1.f1": "Isang oras na pagtuturo",
    "pricing.t1.f2": "Pagsasanay sa aming malinis at ligtas na sasakyan",
    "pricing.t1.f3": "Libreng sundo sa Northland (~10 min radius)",
    "pricing.t1.btn": "Mag-book ng 1-oras ($85)",

    "pricing.t2.flag": "Pinakasikat",
    "pricing.t2.name": "2-Oras na Standard / Test Prep",
    "pricing.t2.sub": "2 Oras · Perpekto para sa praktis sa kalsada at paghahanda sa driver exam",
    "pricing.t2.f1": "Sapat na oras para sa parking lot at tunay na kalsada",
    "pricing.t2.f2": "Direktang praktis sa ruta ng Missouri road test",
    "pricing.t2.f3": "Libreng sundo sa Northland (~10 min radius)",
    "pricing.t2.btn": "Mag-book ng 2-Oras na Session ($160)",

    "pricing.t3.name": "3-Session Confidence Package",
    "pricing.t3.sub": "6 na Oras sa Kabuuan · Tatlong 2-oras na komprehensibong session",
    "pricing.t3.f1": "Kumpletong progreso mula basics hanggang highway",
    "pricing.t3.f2": "Masusing saklaw ng lahat ng kasanayan sa road exam",
    "pricing.t3.f3": "Libreng sundo sa Northland (~10 min radius)",
    "pricing.t3.btn": "Kunin ang Package ($450)",

    "pricing.inc.h": "Kasama sa bawat lesson",
    "pricing.inc1": "Aming ligtas na sasakyan",
    "pricing.inc1p": "Sa aming sasakyan magpa-praktis. Wala kang dadalhin.",
    "pricing.inc2": "Flexible na schedule",
    "pricing.inc2p": "Mag-book sa oras na bagay sa buhay mo.",
    "pricing.inc3": "1-on-1 sa aming mga driver",
    "pricing.inc3p": "Buong session ay sa'yo, kasama ang buong at kalmadong atensyon ng aming driver.",
    "pricing.inc4": "Libreng sundo",
    "pricing.inc4p": "Libreng sundo at hatid sa Gladstone, Parkville, NKC, at Liberty (~10 min radius).",

    "pricing.faq.h2": "Mga Tanong sa Bayad at Session",
    "pricing.q1": "Paano ako magbabayad?",
    "pricing.a1": "Tumatanggap kami ng cash, Venmo, Cash App, at Zelle.",
    "pricing.q2": "Kailan ang bayad?",
    "pricing.a2": "Ang mga solong session ay binabayaran sa dulo ng lesson. Ang mga package ay bayad muna sa unang session, at ische-schedule ang mga natitirang oras habang nagpapatuloy.",
    "pricing.q3": "Aling opsyon sa presyo ang dapat kong simulan?",
    "pricing.a3": "Ang 1-Oras na Focus Session ($85) ay maganda kung gusto mo munang subukan ang lesson. Ang 3-Session Confidence Package ($450) ang pinakasulit para sa buong kasanayan.",
    "pricing.q4": "Kailangan ko ba muna ng permit bago mag-book?",
    "pricing.a4": "Hindi para sa praktis sa pribadong parking lot. Kakailanganin mo ng Missouri instruction permit bago mag-drive sa pampublikong kalsada.",
    "pricing.q5": "Ano ang kasama sa driving test prep?",
    "pricing.a5": "Gagabayan ka ng aming mga babaeng driver sa totoong kalsada, parallel parking, turnabouts, stop signs, at intersections na madalas i-test sa Missouri road test.",

    /* PERMIT */
    "permit.title": "Tulong sa Missouri Permit · Northland Driving",
    "permit.eyebrow": "Tulong sa Missouri Permit",
    "permit.h1": "Paano kunin ang iyong Missouri permit.",
    "permit.lead": "Bago mag-praktis sa pampublikong kalsada, kailangan ng Missouri ang instruction permit. Eto ang proseso, at tutulungan ka naming mag-aral para sa test.",
    "permit.notice": "Nagbabago ang batas. Ni-check namin ito sa Missouri Department of Revenue (DOR), pero laging kumpirmahin ang kasalukuyang rules sa opisyal na links sa ibaba bago ka pumunta.",
    "permit.steps.h2": "Ang proseso, hakbang-hakbang",
    "permit.st1.t": "Mag-aral at pumasa sa tatlong test",
    "permit.st1.p": "Mata, road signs at written knowledge, sa isang Missouri State Highway Patrol (MSHP) driver examination station. Hindi ang DOR ang nagbibigay ng test.",
    "permit.st2.t": "Dalhin ang record sa DOR",
    "permit.st2.p": "Dalhin ang iyong Driver Examination Record sa isang Missouri DOR license office.",
    "permit.st3.t": "Dalhin ang mga dokumento",
    "permit.st3.p": "Identity at legal status, Social Security number, at patunay ng paninirahan sa Missouri. Ang REAL ID permit ay kailangan ng dalawang patunay ng address.",
    "permit.st4.t": "Bayaran ang fee",
    "permit.st4.p": "Ang Class F instruction permit ay $10.00 sa kabuuan. Valid ng 12 buwan at pwedeng i-renew.",
    "permit.facts.h2": "Mga dapat malaman",
    "permit.f1.t": "Sino ang kailangan ng permit",
    "permit.f1a": "Sinumang first-time driver na walang valid na lisensya mula sa ibang U.S. state, <b>kasama ang mga adult na 18 pataas.</b>",
    "permit.f1b": "Ang minimum age ay 15. <b>Walang maximum age.</b>",
    "permit.f1c": "Ang mga wala pang 18 ay kailangan ng pirma ng magulang o guardian.",
    "permit.f2.t": "Sa permit, pwede kang",
    "permit.f2a": "Laging mag-drive na may qualified na lisensyadong driver sa harap na upuan.",
    "permit.f2b": "Kung 16 pataas, ang kasama ay dapat 21 taon pataas.",
    "permit.f2c": "Lahat sa kotse ay dapat naka-seat belt.",
    "permit.f3.t": "Adult 18+ (karamihan sa aming mag-aaral)",
    "permit.f3a": "Diretso mula permit → praktis sa aming mga driver → driving test sa MSHP → lisensya sa DOR.",
    "permit.f3b": "Hindi kailangan ng driver education kung 18 pataas ka.",
    "permit.f3c": "Bisa: 18–20 → 3 taon; 21–69 → 6 taon.",
    "permit.f4.t": "Wala pang 18 (GDL steps)",
    "permit.f4a": "Hawakan ang permit ng 182 araw at mag-log ng 40 oras na supervised, kasama ang 10 oras sa gabi.",
    "permit.f4b": "Tapos Intermediate License ($5, valid 2 taon).",
    "permit.f4c": "Curfew na 1 hanggang 5 a.m. at limitasyon sa pasahero.",
    "permit.links.h": "Mga opisyal na link",
    "permit.l1": "Presyo at bisa ng permit (DOR)",
    "permit.l2": "Graduated Driver License (DOR)",
    "permit.l3": "GDL FAQ (DOR)",
    "permit.l4": "Listahan ng dokumento (DOR)",
    "permit.l5": "Driver Guide (PDF)",
    "permit.l6": "Test stations (MSHP)",
    "permit.band.h2": "Nag-aaral para sa written test?",
    "permit.band.p": "Subukan ang aming libreng practice quiz — 10 tanong kada beses, mula sa bank ng 30.",

    /* CONTACT */
    "contact.title": "Kontak · Northland Driving",
    "contact.eyebrow": "Kontak",
    "contact.h1": "Mag-book ng lesson.",
    "contact.lead": "Ilagay ang pangalan at email mo at magbubukas kami ng mensaheng handa nang i-send sa aming koponan.",
    "contact.f.name": "Pangalan mo",
    "contact.f.namePh": "Pangalan",
    "contact.f.email": "Email mo",
    "contact.f.emailPh": "email@halimbawa.com",
    "contact.f.opt": "Ano ang gusto mo",
    "contact.f.note": "Mensahe (opsyonal)",
    "contact.f.notePh": "Sabihin sa amin kaunti tungkol sa karanasan mo sa pag-drive.",
    "contact.opt1": "1-Oras na Focus Session ($85)",
    "contact.opt2": "2-Oras na Session / Test Prep ($160)",
    "contact.opt3": "3-Session Confidence Package ($450)",
    "contact.opt4": "May tanong lang ako para sa koponan",
    "contact.send": "Mag-email sa aming koponan",
    "contact.fine": "Bubuksan nito ang email app mo na may handang mensahe. Walang spam kailanman.",
    "contact.reach.h": "Iba pang paraan",
    "contact.reach.email": "Mag-email sa aming koponan",
    "contact.reach.area": "Serbisyong lugar",
    "contact.reach.areaVal": "Gladstone, Parkville, NKC, Liberty & KC Northland",
    "contact.reach.pickup": "Sundo",
    "contact.reach.pickupVal": "Libre sa Northland area (~10 min radius)",
    "contact.reach.hours": "Oras",
    "contact.reach.hoursVal": "Flexible, ayon sa schedule mo"
  }
};

(function(){
  "use strict";
  var $=function(s,c){return (c||document).querySelector(s);};
  var $$=function(s,c){return Array.prototype.slice.call((c||document).querySelectorAll(s));};

  /* Hide or remove any old ES buttons if present in DOM */
  $$("[data-lang='es']").forEach(function(el){ el.remove(); });

  /* Set email display + links */
  $$("[data-email-display]").forEach(function(el){ el.textContent = window.ND_EMAIL; });
  $$("[data-email-link]").forEach(function(el){ el.setAttribute("href","mailto:"+window.ND_EMAIL); });

  /* ---- Capture English source text ---- */
  var EN={}, ENP={};
  $$("[data-i18n]").forEach(function(el){var k=el.getAttribute("data-i18n"); if(!(k in EN)) EN[k]=el.innerHTML;});
  $$("[data-i18n-ph]").forEach(function(el){var k=el.getAttribute("data-i18n-ph"); if(!(k in ENP)) ENP[k]=el.getAttribute("placeholder")||"";});
  var current="en";

  function apply(lang){
    if (lang !== "en" && lang !== "tl") lang = "en";
    current = lang;
    window.ND_LANG = lang;
    var d = lang==="en" ? (window.ND_DICT["en"]||{}) : (window.ND_DICT[lang]||{});
    $$("[data-i18n]").forEach(function(el){
      var k=el.getAttribute("data-i18n");
      var v = d && d[k]!=null ? d[k] : EN[k];
      if(v!=null) el.innerHTML=v;
    });
    $$("[data-i18n-ph]").forEach(function(el){
      var k=el.getAttribute("data-i18n-ph");
      var v = d && d[k]!=null ? d[k] : ENP[k];
      if(v!=null) el.setAttribute("placeholder",v);
    });
    if(d && d["__title"]) document.title=d["__title"];
    document.documentElement.lang=lang;
    $$(".lang button").forEach(function(b){
      var blang = b.getAttribute("data-lang");
      b.setAttribute("aria-pressed", blang===lang?"true":"false");
    });
    $$(".qa[aria-expanded='true']").forEach(function(qa){
      var a=$(".ans",qa);
      if(a) a.style.maxHeight=a.scrollHeight+"px";
    });
    try{localStorage.setItem("nd_lang",lang);}catch(e){}
    try{
      window.dispatchEvent(new CustomEvent("nd_lang_change", { detail: { lang: lang } }));
    }catch(e){}
  }

  $$(".lang button").forEach(function(b){
    b.addEventListener("click",function(){
      var lang = b.getAttribute("data-lang");
      if (lang === "en" || lang === "tl") apply(lang);
    });
  });

  var saved=null; try{saved=localStorage.getItem("nd_lang");}catch(e){}
  if(saved==="tl") {
    apply("tl");
  } else {
    apply("en");
  }

  /* ---- Sticky header state ---- */
  var header=$("#siteHeader");
  if(header){
    var stick=function(){header.classList.toggle("is-stuck", window.scrollY>6);};
    stick(); window.addEventListener("scroll",stick,{passive:true});
  }

  /* ---- Mobile nav ---- */
  var toggle=$("#navToggle"), nav=$("#mainNav");
  if(toggle&&nav){
    toggle.addEventListener("click",function(){
      var open=nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded",open?"true":"false");
    });
    $$("a",nav).forEach(function(a){a.addEventListener("click",function(){nav.classList.remove("open");toggle.setAttribute("aria-expanded","false");});});
  }

  /* ---- FAQ Accordions ---- */
  $$(".qa").forEach(function(qa){
    var btn=$("button",qa), ans=$(".ans",qa);
    if(!btn||!ans) return;
    btn.addEventListener("click",function(){
      var open=qa.getAttribute("aria-expanded")==="true";
      qa.setAttribute("aria-expanded",open?"false":"true");
      ans.style.maxHeight=open?"0px":ans.scrollHeight+"px";
    });
  });

  /* ---- Reveal animation ---- */
  var reduce=window.matchMedia("(prefers-reduced-motion:reduce)").matches;
  var items=$$(".reveal");
  if("IntersectionObserver" in window && !reduce){
    var io=new IntersectionObserver(function(ents){
      ents.forEach(function(e){ if(e.isIntersecting){e.target.classList.add("in");io.unobserve(e.target);} });
    },{rootMargin:"0px 0px -8% 0px",threshold:0.06});
    items.forEach(function(el){io.observe(el);});
  } else { items.forEach(function(el){el.classList.add("in");}); }

  /* ---- Booking Form -> Mailto Generator ---- */
  var sendBtn=$("#bookSend");
  if(sendBtn){
    var build=function(){
      var name=($("#bkName")&&$("#bkName").value||"").trim();
      var from=($("#bkEmail")&&$("#bkEmail").value||"").trim();
      var optEl=$("#bkOption"); var opt=optEl?optEl.options[optEl.selectedIndex].text:"";
      var note=($("#bkNote")&&$("#bkNote").value||"").trim();
      var subj={
        en:"Lesson enquiry — Northland Driving",
        tl:"Tanong sa lesson — Northland Driving"
      }[current] || "Lesson enquiry — Northland Driving";
      
      var greet={
        en:"Hi Northland Driving team, I'd like to book a driving lesson.",
        tl:"Hi Northland Driving team, gusto ko sanang mag-book ng driving lesson."
      }[current] || "Hi Northland Driving team, I'd like to book a driving lesson.";
      
      var L={
        en:{n:"Name: ",o:"Interested in: ",e:"Email: ",note:"Note: "},
        tl:{n:"Pangalan: ",o:"Interesado sa: ",e:"Email: ",note:"Note: "}
      }[current] || {n:"Name: ",o:"Interested in: ",e:"Email: ",note:"Note: "};
      
      var lines=[greet,""];
      if(name) lines.push(L.n+name);
      if(opt)  lines.push(L.o+opt);
      if(from) lines.push(L.e+from);
      if(note){ lines.push(""); lines.push(L.note+note); }
      var body=lines.join("\n");
      window.location.href="mailto:"+window.ND_EMAIL+"?subject="+encodeURIComponent(subj)+"&body="+encodeURIComponent(body);
    };
    sendBtn.addEventListener("click",build);
  }
})();
