/* =========================================================
   Northland Driving — shared behaviour
   • sticky-header state • mobile nav • scroll reveal
   • FAQ accordion • email booking generator
   ---------------------------------------------------------
   ========================================================= */

// Contact email. This is where booking messages go.
window.ND_EMAIL = "hello@northlanddriving.com";

(function(){
  "use strict";
  var $=function(s,c){return (c||document).querySelector(s);};
  var $$=function(s,c){return Array.prototype.slice.call((c||document).querySelectorAll(s));};

  /* ---- Set email display + links ---- */
  $$("[data-email-display]").forEach(function(el){ el.textContent = window.ND_EMAIL; });
  $$("[data-email-link]").forEach(function(el){ el.setAttribute("href","mailto:"+window.ND_EMAIL); });

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

      var subj="Lesson enquiry — Northland Driving";
      var lines=["Hi Northland Driving team, I'd like to book a driving lesson.",""];
      if(name) lines.push("Name: "+name);
      if(opt)  lines.push("Interested in: "+opt);
      if(from) lines.push("Email: "+from);
      if(note){ lines.push(""); lines.push("Note: "+note); }
      var body=lines.join("\n");
      window.location.href="mailto:"+window.ND_EMAIL+"?subject="+encodeURIComponent(subj)+"&body="+encodeURIComponent(body);
    };
    sendBtn.addEventListener("click",build);
  }
})();
