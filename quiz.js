/* =========================================================
   Northland Driving — permit study quiz
   Pulls 10 random questions from a bank of 30, shuffles the
   options, gives instant feedback, and scores the run.
   Supports English ('en') and Tagalog ('tl').
   Practice only — not affiliated with the Missouri DOR/MSHP.
   ========================================================= */
(function(){
  "use strict";
  var mount = document.getElementById("quiz");
  if(!mount) return;

  var BANK = [
    {
      q_en: "What is the minimum age to apply for a Missouri Class F instruction permit?",
      q_tl: "Ano ang minimum na edad para mag-apply para sa Missouri Class F instruction permit?",
      o_en: ["14", "15", "16", "18"],
      o_tl: ["14", "15", "16", "18"],
      a: 1,
      e_en: "You can apply for a Missouri instruction permit at age 15. There is no maximum age.",
      e_tl: "Maaaring mag-apply para sa Missouri instruction permit sa edad na 15. Walang maximum age."
    },
    {
      q_en: "While driving on an instruction permit, a licensed driver must sit where?",
      q_tl: "Habang nagmamaneho gamit ang instruction permit, saan dapat nakaupo ang lisensyadong driver?",
      o_en: ["In the back seat", "In the front passenger seat", "Anywhere in the car", "No licensed driver is required"],
      o_tl: ["Sa likod na upuan", "Sa harap na upuan ng pasahero", "Kahit saan sa kotse", "Hindi kailangan ng lisensyadong driver"],
      a: 1,
      e_en: "A qualified licensed driver must sit in the front passenger seat next to the permit holder at all times.",
      e_tl: "Ang isang kwalipikadong lisensyadong driver ay dapat nakaupo sa harap na upuan ng pasahero katabi ng permit holder."
    },
    {
      q_en: "For drivers 21 and older, Missouri's legal blood alcohol concentration (BAC) limit is:",
      q_tl: "Para sa mga driver na 21 pataas, ang legal na blood alcohol concentration (BAC) limit sa Missouri ay:",
      o_en: ["0.05%", "0.08%", "0.10%", "0.12%"],
      o_tl: ["0.05%", "0.08%", "0.10%", "0.12%"],
      a: 1,
      e_en: "0.08% is the legal BAC limit for drivers 21 and older in Missouri.",
      e_tl: "0.08% ang legal na limitasyon sa BAC para sa mga driver na 21 pataas sa Missouri."
    },
    {
      q_en: "For drivers under 21, Missouri's 'zero tolerance' BAC limit is:",
      q_tl: "Para sa mga driver na wala pang 21, ang 'zero tolerance' BAC limit sa Missouri ay:",
      o_en: ["0.00%", "0.02%", "0.05%", "0.08%"],
      o_tl: ["0.00%", "0.02%", "0.05%", "0.08%"],
      a: 1,
      e_en: "Under Missouri's zero tolerance law, a BAC of 0.02% or higher leads to suspension for drivers under 21.",
      e_tl: "Sa ilalim ng zero tolerance law ng Missouri, ang BAC na 0.02% o mas mataas ay nagdudulot ng suspensyon sa mga driver na wala pang 21."
    },
    {
      q_en: "A red, eight-sided (octagon) traffic sign always means:",
      q_tl: "Ang pulang sign na may walong sulok (octagon) ay laging nangangahulugang:",
      o_en: ["Yield", "Stop", "Do not enter", "Caution"],
      o_tl: ["Magbigay-daan (Yield)", "Huminto (Stop)", "Huwag pumasok (Do not enter)", "Mag-ingat (Caution)"],
      a: 1,
      e_en: "The octagon shape is exclusively used for STOP signs.",
      e_tl: "Ang hugis na walong sulok (octagon) ay ginagamit lamang para sa STOP signs."
    },
    {
      q_en: "A yellow diamond-shaped sign is used to:",
      q_tl: "Ang dilaw na diamond-shaped sign ay ginagamit upang:",
      o_en: ["Give an order you must obey", "Warn you about hazards or conditions ahead", "Mark a highway route", "Show a rest stop"],
      o_tl: ["Magbigay ng utos na dapat sundin", "Magbabala tungkol sa panganib o kondisyon sa kalsada", "Magpakita ng highway route", "Magpakita ng pahingahan"],
      a: 1,
      e_en: "Yellow diamond signs warn drivers of upcoming road hazards or changes in traffic conditions.",
      e_tl: "Ang dilaw na diamond signs ay nagbabala sa mga driver tungkol sa mga panganib o pagbabago sa kalsada."
    },
    {
      q_en: "A solid yellow line on your side of the center line means:",
      q_tl: "Ang buong dilaw na linya (solid yellow line) sa iyong tabi ng gitnang linya ay nangangahulugang:",
      o_en: ["Passing is allowed", "Do not pass", "Merge left immediately", "Two-way left turn lane"],
      o_tl: ["Pinapayagan ang pag-overtake", "Bawal mag-overtake (Do not pass)", "Lumipat sa kaliwa kagad", "Kalyeng pwedeng kumatid"],
      a: 1,
      e_en: "A solid yellow line on your side indicates a no-passing zone.",
      e_tl: "Ang buong dilaw na linya (solid yellow line) sa iyong tabi ay nangangahulugang bawal mag-overtake."
    },
    {
      q_en: "A flashing red traffic light means:",
      q_tl: "Ang kumukuskos na pulang ilaw sa trapiko ay nangangahulugang:",
      o_en: ["Speed up to clear it", "Stop completely, then proceed when safe", "Slow down only", "Ignore the light"],
      o_tl: ["Bumilis para makalagpas", "Huminto nang tuluyan, bago tumuloy kapag ligtas na", "Magdahan-dahan lamang", "Pabayaan ang ilaw"],
      a: 1,
      e_en: "Treat a flashing red light like a stop sign: come to a complete stop and proceed when clear.",
      e_tl: "Tratuhin ang kumukuskos na pulang ilaw tulad ng stop sign: huminto nang tuluyan at tumuloy kapag ligtas na."
    },
    {
      q_en: "A flashing yellow traffic light means:",
      q_tl: "Ang kumukuskos na dilaw na ilaw sa trapiko ay nangangahulugang:",
      o_en: ["Stop completely", "Slow down and proceed with caution", "Turn right only", "Road closed"],
      o_tl: ["Huminto nang tuluyan", "Magdahan-dahan at magpatuloy nang may pag-iingat", "Kumatid sa kanan lamang", "Isinara ang kalsada"],
      a: 1,
      e_en: "A flashing yellow light warns drivers to slow down and proceed carefully through the intersection.",
      e_tl: "Ang kumukuskos na dilaw na ilaw ay nagpapaalala na magdahan-dahan at maging maingat sa intersection."
    },
    {
      q_en: "On a two-lane road, when a school bus stops with red lights flashing, you must:",
      q_tl: "Sa dalawang linyang kalsada, kapag huminto ang school bus na kumukuskos ang pulang ilaw, dapat kang:",
      o_en: ["Slow to 15 mph", "Stop completely until the red lights stop flashing", "Pass quickly on the left", "Honk and continue"],
      o_tl: ["Magdahan-dahan sa 15 mph", "Huminto nang tuluyan hanggang mamatay ang pulang ilaw", "Mag-overtake sa kaliwa", "Bumusina at magpatuloy"],
      a: 1,
      e_en: "Drivers in both directions must stop for a school bus loading or unloading children on a two-lane road.",
      e_tl: "Dapat huminto ang mga driver sa dalawang direksyon para sa school bus na nagpapasakay o nagpapababa ng bata sa dalawang linyang kalsada."
    },
    {
      q_en: "What is the total fee for a Missouri Class F instruction permit?",
      q_tl: "Magkano ang kabuuang bayad para sa Missouri Class F instruction permit?",
      o_en: ["Free", "$10.00", "$25.00", "$50.00"],
      o_tl: ["Libre", "$10.00", "$25.00", "$50.00"],
      a: 1,
      e_en: "The Missouri DOR total fee for a Class F instruction permit is $10.00.",
      e_tl: "Ang kabuuang bayad sa Missouri DOR para sa Class F instruction permit ay $10.00."
    },
    {
      q_en: "A Missouri instruction permit is valid for:",
      q_tl: "Ang Missouri instruction permit ay valid sa loob ng:",
      o_en: ["3 months", "6 months", "12 months", "3 years"],
      o_tl: ["3 buwan", "6 na buwan", "12 buwan", "3 taon"],
      a: 2,
      e_en: "A Missouri instruction permit is valid for 12 months (1 year) and is renewable.",
      e_tl: "Ang Missouri instruction permit ay valid sa loob ng 12 buwan (1 taon) at pwedeng i-renew."
    },
    {
      q_en: "A safe following distance in normal conditions is guided by:",
      q_tl: "Ang ligtas na agwat sa kasunod na sasakyan sa normal na kondisyon ay ginagabayan ng:",
      o_en: ["The 3-second rule", "One car length total", "Stay within 10 feet", "Match the brake lights ahead"],
      o_tl: ["Ang 3-second rule", "Isang haba ng kotse", "Manatili sa loob ng 10 talampakan", "Sumunod sa ilaw ng preno"],
      a: 0,
      e_en: "Maintain at least a 3-second gap behind the vehicle ahead under normal driving conditions.",
      e_tl: "Manatili sa hindi bababa sa 3-segundong agwat sa kasunod na sasakyan sa normal na kondisyon."
    },
    {
      q_en: "When driving in dense fog, you should use:",
      q_tl: "Kapag nagmamaneho sa makapal na fog, dapat mong gamitin ang:",
      o_en: ["High-beam headlights", "Low-beam headlights", "Hazard lights only", "No lights"],
      o_tl: ["Malakas na ilaw (High-beam)", "Mahinang ilaw (Low-beam)", "Hazard lights lamang", "Walang ilaw"],
      a: 1,
      e_en: "Use low-beam headlights in fog; high beams reflect off fog moisture and reduce visibility.",
      e_tl: "Gumamit ng low-beam headlights kapag may fog; ang high beams ay tumatalbog sa fog at nakakasilaw."
    },
    {
      q_en: "If your vehicle begins to skid, you should:",
      q_tl: "Kapag nagsimulang mag-skid ang iyong sasakyan, dapat mong:",
      o_en: ["Slam hard on the brakes", "Ease off the gas pedal and steer where you want to go", "Steer sharply the opposite way", "Speed up to gain traction"],
      o_tl: ["Pumreno nang malakas", "Alisin ang paa sa gas at imaneho sa direksyong gusto mong puntahan", "Kumatid nang mabilis sa kabaligtaran", "Bumilis para kumapit ang gulong"],
      a: 1,
      e_en: "Ease off the accelerator gently and steer smoothly in the direction you wish to travel.",
      e_tl: "Dahan-dahang alisin ang paa sa accelerator at i-maniobra ang sasakyan sa direksyong nais puntahan."
    },
    {
      q_en: "When entering a traffic roundabout, you must yield to:",
      q_tl: "Kapag papasok sa traffic roundabout, dapat kang magbigay-daan sa:",
      o_en: ["Traffic already circulating in the roundabout", "Traffic entering on your left", "Pedestrians on the sidewalk only", "No one"],
      o_tl: ["Mga sasakyang umiikot na sa loob ng roundabout", "Mga sasakyang papasok mula sa kaliwa", "Mga pedestrian lamang", "Kahit kanino"],
      a: 0,
      e_en: "Always yield the right-of-way to traffic already circulating within the roundabout.",
      e_tl: "Laging magbigay-daan sa mga sasakyang umiikot na sa loob ng roundabout."
    },
    {
      q_en: "A red and white downward-pointing triangle sign means:",
      q_tl: "Ang pulang at puting tatsulok na nakaturo sa ibaba ay nangangahulugang:",
      o_en: ["Stop", "Yield", "Do not enter", "Merge ahead"],
      o_tl: ["Huminto (Stop)", "Magbigay-daan (Yield)", "Huwag pumasok", "Lumipat ng lane"],
      a: 1,
      e_en: "A downward-pointing red and white triangle is exclusively used for YIELD signs.",
      e_tl: "Ang pabaliktad na pulang at puting tatsulok ay ginagamit lamang para sa YIELD signs."
    },
    {
      q_en: "Seat belts are required for whom when driving on an instruction permit?",
      q_tl: "Sino ang kailangang mag-seat belt habang nagmamaneho gamit ang instruction permit?",
      o_en: ["The driver only", "Front-seat passengers only", "Everyone in the vehicle", "No one"],
      o_tl: ["Ang driver lamang", "Ang mga nasa harap na upuan lamang", "Lahat ng nakasakay sa sasakyan", "Kahit sino"],
      a: 2,
      e_en: "Missouri law requires everyone in the vehicle to wear a seat belt.",
      e_tl: "Ipinaguutos ng batas sa Missouri na ang lahat ng nakasakay sa sasakyan ay nakakabit ang seat belt."
    },
    {
      q_en: "Before changing lanes, you should:",
      q_tl: "Bago lumipat ng lane, dapat mong:",
      o_en: ["Signal, check mirrors, and check blind spots", "Just turn on your signal", "Speed up first", "Honk your horn"],
      o_tl: ["Mag-signal, tingnan ang mga salamin, at suriin ang blind spot", "Mag-signal lamang", "Bumilis muna", "Bumusina"],
      a: 0,
      e_en: "Signal, check interior and side mirrors, and look over your shoulder for blind spots.",
      e_tl: "Mag-signal, suriin ang mga salamin sa gitna at gilid, at lumingon sa balikat upang tiyakin ang blind spot."
    },
    {
      q_en: "On a road with no posted speed limit, drivers should:",
      q_tl: "Sa kalsadang walang nakalagay na speed limit, ang mga driver ay dapat:",
      o_en: ["Drive as fast as traffic allows", "Drive at a safe and reasonable speed for conditions", "Always drive 60 mph", "Stop at every intersection"],
      o_tl: ["Mag-drive nang kasing bilis ng trapiko", "Mag-drive sa ligtas at makatwirang bilis ayon sa kondisyon", "Laging mag-drive ng 60 mph", "Huminto sa bawat tawiran"],
      a: 1,
      e_en: "Drive at a safe and reasonable speed depending on weather, traffic, and road conditions.",
      e_tl: "Mag-drive sa ligtas at angkop na bilis batay sa panahon, trapiko, at kondisyon ng kalsada."
    },
    {
      q_en: "Under Missouri's hands-free law, holding a cell phone while driving is:",
      q_tl: "Sa ilalim ng hands-free law ng Missouri, ang paghawak ng cellphone habang nagmamaneho ay:",
      o_en: ["Allowed at red lights", "Allowed on interstate highways", "Prohibited while driving", "Allowed for calls only"],
      o_tl: ["Pinapayagan sa red light", "Pinapayagan sa mga highway", "Ipinagbabawal habang nagmamaneho", "Pinapayagan para sa tawag lamang"],
      a: 2,
      e_en: "Missouri's hands-free law prohibits holding or supporting a cell phone while operating a vehicle.",
      e_tl: "Ipinagbabawal sa batas ng Missouri ang paghawak o pag-suporta ng cellphone habang nagmamaneho."
    },
    {
      q_en: "Headlights are required from:",
      q_tl: "Kailangan ang headlights mula:",
      o_en: ["Only on rural highways", "30 minutes after sunset to 30 minutes before sunrise", "Only when raining hard", "10:00 PM to 5:00 AM"],
      o_tl: ["Sa mga probinsyang highway lamang", "30 minuto pagkalubog ng araw hanggang 30 minuto bago sumikat ang araw", "Kapag malakas lamang ang ulan", "10:00 PM hanggang 5:00 AM"],
      a: 1,
      e_en: "Headlights are required from 30 minutes after sunset to 30 minutes before sunrise, and in low visibility.",
      e_tl: "Kailangan ang headlights mula 30 minuto pagkalubog ng araw hanggang 30 minuto bago sumikat ang araw, at kapag mahina ang tanaw."
    },
    {
      q_en: "Two vehicles reach an open intersection at the same time. Who yields?",
      q_tl: "Dalawang sasakyan ang sabay na dumating sa intersection. Sino ang magbibigay-daan?",
      o_en: ["The driver on the left yields to the driver on the right", "The faster car goes first", "The larger vehicle goes first", "Whoever honks first"],
      o_tl: ["Ang driver sa kaliwa ay magbibigay-daan sa driver sa kanan", "Ang mas mabilis na kotse ang mauuna", "Ang mas malaking sasakyan ang mauuna", "Ang unang bumusina"],
      a: 0,
      e_en: "Yield to the vehicle on your right when arriving at an open intersection at the same time.",
      e_tl: "Magbigay-daan sa sasakyang nasa iyong kanan kapag sabay na dumating sa intersection."
    },
    {
      q_en: "A white rectangular traffic sign usually shows:",
      q_tl: "Ang puting parihabang sign sa trapiko ay karaniwang nagpapakita ng:",
      o_en: ["A warning", "A traffic law or regulation you must obey", "A rest area ahead", "A historic site"],
      o_tl: ["Isang babala", "Batas o patakaran sa trapiko na dapat sundin", "Pahingahan sa harap", "Makasaysayang lugar"],
      a: 1,
      e_en: "White rectangular regulatory signs state traffic laws you must obey, like speed limits.",
      e_tl: "Ang puting parihabang signs ay nagsasaad ng mga batas sa trapiko tulad ng speed limit."
    },
    {
      q_en: "When parking uphill next to a curb, turn your front wheels:",
      q_tl: "Kapag nakatigil pataas sa tabi ng curb, iikot ang mga gulong sa harap:",
      o_en: ["Toward the curb", "Away from the curb", "Straight ahead", "It does not matter"],
      o_tl: ["Papunta sa curb", "Palayo sa curb (Away from curb)", "Diretso sa harap", "Hindi mahalaga"],
      a: 1,
      e_en: "Turn wheels away from the curb so the car rolls back against the curb if brakes fail.",
      e_tl: "Iikot ang gulong palayo sa curb para sumandal ito sa curb kung gumulong pabalik."
    },
    {
      q_en: "When parking downhill next to a curb, turn your front wheels:",
      q_tl: "Kapag nakatigil pababa sa tabi ng curb, iikot ang mga gulong sa harap:",
      o_en: ["Toward the curb", "Away from the curb", "Straight ahead", "It does not matter"],
      o_tl: ["Papunta sa curb (Toward curb)", "Palayo sa curb", "Diretso sa harap", "Hindi mahalaga"],
      a: 0,
      e_en: "Turn wheels toward the curb so the car rolls into the curb rather than into traffic.",
      e_tl: "Iikot ang gulong papunta sa curb upang gumulong ito sa curb at hindi sa trapiko."
    },
    {
      q_en: "An emergency vehicle approaches with siren and lights on. You must:",
      q_tl: "Kapag may emergency vehicle na may siren at ilaw na papalapit, dapat kang:",
      o_en: ["Speed up", "Pull to the right edge of the road and stop", "Stop in your lane", "Turn left immediately"],
      o_tl: ["Bumilis", "Gumilid sa kanang tabi ng kalsada at huminto", "Huminto sa iyong lane", "Kumatid sa kaliwa agad"],
      a: 1,
      e_en: "Pull over to the right edge of the roadway and stop until the emergency vehicle passes.",
      e_tl: "Gumilid sa kanang tabi ng kalsada at huminto hanggang sa makalampas ang emergency vehicle."
    },
    {
      q_en: "Missouri's 'Move Over' law requires drivers approaching stopped emergency vehicles to:",
      q_tl: "Ang 'Move Over' law ng Missouri ay nag-aatas sa mga driver na papalapit sa nakahintong emergency vehicle na:",
      o_en: ["Maintain speed", "Slow down and change lanes if safe to do so", "Speed past quickly", "Stop in the middle lane"],
      o_tl: ["Panatilihin ang bilis", "Magdahan-dahan at lumipat ng lane kung ligtas", "Bumilis para makalagpas", "Huminto sa gitnang lane"],
      a: 1,
      e_en: "Slow down and, if safe, change lanes to leave an open lane next to the stopped emergency vehicle.",
      e_tl: "Magdahan-dahan at lumipat ng lane kung ligtas upang mag-iwan ng puwang sa emergency vehicle."
    },
    {
      q_en: "A right turn on a red traffic light in Missouri is:",
      q_tl: "Ang pagliko sa kanan sa red light sa Missouri ay:",
      o_en: ["Never allowed", "Allowed after a full stop if clear and no sign forbids it", "Allowed without stopping", "Allowed only at night"],
      o_tl: ["Kailanman ay hindi pinapayagan", "Pinapayagan pagkatapos huminto nang tuluyan kung malinis at walang sign na nagbabawal", "Pinapayagan nang hindi humihinto", "Pinapayagan lamang sa gabi"],
      a: 1,
      e_en: "Stop completely first, check that traffic and crosswalks are clear, and turn if no sign forbids it.",
      e_tl: "Huminto muna nang tuluyan, tiyaking malinis ang daan, at kumatid kung walang sign na nagbabawal."
    },
    {
      q_en: "Is formal driver education required for applicants 18 or older in Missouri?",
      q_tl: "Kailangan ba ng pormal na driver education para sa mga aplikante na 18 pataas sa Missouri?",
      o_en: ["Yes, always required", "No, driver education is not required for applicants 18 and older", "Only in Kansas City", "Only if you failed once"],
      o_tl: ["Oo, laging kailangan", "Hindi, hindi kailangan ang driver education para sa 18 pataas", "Sa Kansas City lamang", "Kapag bumagsak ka lang nang minsan"],
      a: 1,
      e_en: "Driver education is not mandatory for adult applicants 18 and older in Missouri.",
      e_tl: "Hindi kailangan ang driver education para sa mga adult na 18 pataas sa Missouri."
    }
  ];

  var LABELS = {
    en: {
      q: "Question",
      score: "Score",
      next: "Next question",
      finish: "See results",
      you: "You scored",
      retake: "Try again",
      book: "Book a lesson",
      review: "Back to Permit Help",
      hi: "Nice work — you know your stuff!",
      mid: "Good start. A little more study and you've got this.",
      lo: "Keep studying — you'll get there. Review the Missouri Driver Guide."
    },
    tl: {
      q: "Tanong",
      score: "Puntos",
      next: "Susunod na tanong",
      finish: "Tingnan ang resulta",
      you: "Nakakuha ka ng",
      retake: "Subukan muli",
      book: "Mag-book ng lesson",
      review: "Bumalik sa Tulong sa Permit",
      hi: "Magaling — alam na alam mo ang mga aralin!",
      mid: "Magandang simula. Kaunti pang aral at handa ka na.",
      lo: "Ituloy ang pag-aaral — makakaya mo rin ito. Balikan ang Missouri Driver Guide."
    }
  };

  function getLang(){
    var k = "en";
    try {
      k = window.ND_LANG || localStorage.getItem("nd_lang") || "en";
    } catch(e){}
    return (k === "tl") ? "tl" : "en";
  }

  var TOTAL = 10;
  var CHECK = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="m5 12 5 5L20 7"/></svg>';
  var CROSS = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M6 6l12 12M18 6 6 18"/></svg>';

  function shuffle(arr){
    var a=arr.slice();
    for(var i=a.length-1;i>0;i--){ var j=Math.floor(Math.random()*(i+1)); var t=a[i];a[i]=a[j];a[j]=t; }
    return a;
  }
  function esc(s){ return String(s||"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;"); }

  var state = null;

  function start(){
    var picked = shuffle(BANK).slice(0, TOTAL).map(function(item){
      // Create options mapping preserving correct index
      var rawOpts = item.o_en.map(function(optEn, idx){
        return {
          idx: idx,
          en: optEn,
          tl: item.o_tl[idx],
          isCorrect: (idx === item.a)
        };
      });
      var shuffledOpts = shuffle(rawOpts);
      return {
        q_en: item.q_en,
        q_tl: item.q_tl,
        opts: shuffledOpts,
        e_en: item.e_en,
        e_tl: item.e_tl
      };
    });

    state = {
      list: picked,
      idx: 0,
      score: 0,
      answers: new Array(TOTAL), // stores chosen option index in opts array
      finished: false
    };

    render();
    mount.scrollIntoView({behavior:"smooth", block:"start"});
  }

  function render(){
    if(!state) return;
    if(state.finished){
      renderResult();
      return;
    }
    renderQuestion();
  }

  function renderQuestion(){
    var lang = getLang();
    var t = LABELS[lang] || LABELS.en;
    var i = state.idx;
    var item = state.list[i];
    var pct = Math.round((i/TOTAL)*100);
    var chosenOptIndex = state.answers[i];
    var answered = (chosenOptIndex !== undefined && chosenOptIndex !== null);

    var qText = lang === "tl" ? item.q_tl : item.q_en;
    var eText = lang === "tl" ? item.e_tl : item.e_en;

    var optsHtml = item.opts.map(function(optObj, oIdx){
      var text = lang === "tl" ? optObj.tl : optObj.en;
      var cls = "quiz-opt";
      var mkContent = "";

      if(answered){
        if(optObj.isCorrect){
          cls += " correct";
          mkContent = CHECK;
        } else if(oIdx === chosenOptIndex){
          cls += " wrong";
          mkContent = CROSS;
        }
      }

      return '<button class="' + cls + '" type="button" data-oidx="' + oIdx + '" ' + (answered ? 'disabled' : '') + '>' +
               '<span class="mk">' + mkContent + '</span><span>' + esc(text) + '</span>' +
             '</button>';
    }).join("");

    mount.innerHTML =
      '<div class="quiz-progress"><span style="width:' + pct + '%"></span></div>' +
      '<div class="quiz-card">' +
        '<div class="quiz-meta"><span>' + esc(t.q) + ' <b>' + (i+1) + '</b> / ' + TOTAL + '</span>' +
          '<span>' + esc(t.score) + ' <b>' + state.score + '</b></span></div>' +
        '<p class="quiz-q">' + esc(qText) + '</p>' +
        '<div class="quiz-opts">' + optsHtml + '</div>' +
        '<div class="quiz-explain" ' + (answered ? '' : 'hidden') + '>' + esc(eText) + '</div>' +
        '<div class="quiz-actions" ' + (answered ? '' : 'hidden') + '>' +
          '<button class="btn btn-primary quiz-next" type="button">' + esc(i === TOTAL - 1 ? t.finish : t.next) + '</button>' +
        '</div>' +
      '</div>';

    if(!answered){
      var btns = mount.querySelectorAll(".quiz-opt");
      Array.prototype.forEach.call(btns, function(b){
        b.addEventListener("click", function(){
          var oIdx = parseInt(b.getAttribute("data-oidx"), 10);
          answer(oIdx);
        });
      });
    } else {
      var nextBtn = mount.querySelector(".quiz-next");
      if(nextBtn){
        nextBtn.addEventListener("click", next);
      }
    }
  }

  function answer(chosenOIdx){
    var item = state.list[state.idx];
    state.answers[state.idx] = chosenOIdx;

    if(item.opts[chosenOIdx] && item.opts[chosenOIdx].isCorrect){
      state.score++;
    }

    renderQuestion();
  }

  function next(){
    if(state.idx < TOTAL - 1){
      state.idx++;
      renderQuestion();
      mount.scrollIntoView({behavior:"smooth", block:"start"});
    } else {
      state.finished = true;
      renderResult();
      mount.scrollIntoView({behavior:"smooth", block:"start"});
    }
  }

  function renderResult(){
    var lang = getLang();
    var t = LABELS[lang] || LABELS.en;
    var s = state.score;
    var msg = s >= 8 ? t.hi : (s >= 5 ? t.mid : t.lo);

    mount.innerHTML =
      '<div class="quiz-card quiz-result">' +
        '<div class="quiz-score">' + s + '<small> / ' + TOTAL + '</small></div>' +
        '<p class="quiz-msg">' + esc(msg) + '</p>' +
        '<div class="btn-row">' +
          '<button class="btn btn-primary quiz-retake" type="button">' + esc(t.retake) + '</button>' +
          '<a class="btn btn-ghost" href="contact.html">' + esc(t.book) + '</a>' +
          '<a class="btn btn-ghost" href="permit.html">' + esc(t.review) + '</a>' +
        '</div>' +
      '</div>';

    var retakeBtn = mount.querySelector(".quiz-retake");
    if(retakeBtn){
      retakeBtn.addEventListener("click", start);
    }
  }

  // Listen for language changes from app.js or DOM
  window.addEventListener("nd_lang_change", function(){
    render();
  });

  start();
})();
