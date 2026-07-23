/* =========================================================
   Northland Driving — permit study quiz
   Pulls 10 random questions from a bank of 30, shuffles the
   options, gives instant feedback, and scores the run.
   Practice only — not affiliated with the Missouri DOR/MSHP.
   ========================================================= */
(function(){
  "use strict";
  var mount = document.getElementById("quiz");
  if(!mount) return;

  var BANK = [
    {q:"What is the minimum age to apply for a Missouri instruction permit?",o:["14","15","16","18"],a:1,e:"You can apply for an instruction permit at 15. There is no maximum age."},
    {q:"While driving on an instruction permit, a licensed driver must sit where?",o:["In the back seat","In the front passenger seat","Anywhere in the car","No one has to ride along"],a:1,e:"A qualified licensed driver must be in the front passenger seat at all times."},
    {q:"For drivers 21 and older, Missouri's legal blood-alcohol (BAC) limit is:",o:["0.05","0.08","0.10","0.12"],a:1,e:"0.08% is the legal limit for drivers 21 and older."},
    {q:"For drivers under 21, Missouri's 'zero tolerance' BAC limit is:",o:["0.00","0.02","0.05","0.08"],a:1,e:"Under 21, a BAC of 0.02 or higher can lead to a license suspension."},
    {q:"A red, eight-sided (octagon) sign always means:",o:["Yield","Stop","Do not enter","Caution"],a:1,e:"The octagon shape is used only for STOP."},
    {q:"A yellow diamond-shaped sign is used to:",o:["Give an order you must obey","Warn you about conditions ahead","Mark a highway route","Show a rest stop"],a:1,e:"Yellow diamonds are warning signs — a curve, merge, or other hazard ahead."},
    {q:"A solid yellow line on your side of the center line means:",o:["Passing is allowed","Do not pass","Merge left","Two-way left turn lane"],a:1,e:"A solid yellow line on your side means no passing there."},
    {q:"A flashing red traffic light means:",o:["Speed up to clear it","Stop, then go when it is safe","Slow down only","The light is broken — ignore it"],a:1,e:"Treat a flashing red like a stop sign: stop fully, then go when it is safe."},
    {q:"A flashing yellow traffic light means:",o:["Stop completely","Slow down and proceed with caution","Turn only","Road closed"],a:1,e:"Flashing yellow means slow down and cross carefully."},
    {q:"On a two-lane road, when a school bus ahead stops with red lights flashing, you must:",o:["Slow to 10 mph","Stop until the lights stop flashing","Pass on the left quickly","Honk and continue"],a:1,e:"You must stop for a school bus loading or unloading children."},
    {q:"The total cost of a Missouri Class F instruction permit is about:",o:["Free","$10","$25","$50"],a:1,e:"The DOR lists the Class F instruction permit total at $10.00."},
    {q:"A Missouri instruction permit is valid for:",o:["3 months","6 months","12 months","5 years"],a:2,e:"It is valid for 12 months and is renewable."},
    {q:"A good rule for a safe following distance in normal conditions is:",o:["The three-second rule","One car length total","Stay within 10 feet","Match the brake lights ahead"],a:0,e:"Stay at least three seconds behind the car ahead — more in bad weather."},
    {q:"In fog, you should drive with:",o:["High-beam headlights","Low-beam headlights","Parking lights only","No lights"],a:1,e:"High beams reflect off fog. Use low beams."},
    {q:"If your vehicle begins to skid, you should:",o:["Brake hard","Ease off the gas and steer where you want to go","Steer the opposite way","Speed up"],a:1,e:"Ease off the accelerator and steer gently in the direction you want to go."},
    {q:"When entering a roundabout, you must yield to:",o:["Traffic already in the roundabout","Traffic entering on your left","Pedestrians only","No one"],a:0,e:"Yield to traffic already circulating, then enter in a safe gap."},
    {q:"A downward-pointing triangle (red and white) means:",o:["Stop","Yield","No entry","Merge"],a:1,e:"That shape is used only for YIELD."},
    {q:"When you drive on an instruction permit, seat belts are required for:",o:["The driver only","Front-seat riders only","Everyone in the vehicle","No one"],a:2,e:"Everyone in the car must be buckled up."},
    {q:"Before changing lanes you should:",o:["Signal, check mirrors, and check your blind spot","Just signal","Speed up first","Honk"],a:0,e:"Signal, check your mirrors, and look over your shoulder for the blind spot."},
    {q:"On a road with no posted speed limit, you should:",o:["Drive as fast as traffic allows","Drive at a safe, reasonable speed for conditions","Always drive 60 mph","Stop frequently"],a:1,e:"Drive at a speed that is safe and reasonable for the road, weather, and traffic."},
    {q:"Under Missouri's hands-free law, holding and using a cell phone while driving is:",o:["Allowed at red lights","Allowed on highways","Not allowed","Allowed for calls only"],a:2,e:"Missouri's hands-free law prohibits holding a phone while driving. Use hands-free or wait."},
    {q:"You must turn on your headlights:",o:["Only on highways","From a half hour after sunset to a half hour before sunrise","Only when it rains","Never in town"],a:1,e:"Headlights are required from 30 minutes after sunset to 30 minutes before sunrise, and whenever visibility is low."},
    {q:"Two vehicles reach an open intersection at the same time. Who yields?",o:["The driver on the left yields to the one on the right","The faster car goes first","The larger vehicle goes first","Whoever honks first"],a:0,e:"Yield to the vehicle on your right when you arrive at the same time."},
    {q:"A white rectangular sign usually shows:",o:["A warning","A traffic law you must obey","A rest area","A tourist site"],a:1,e:"White regulatory signs tell you the law — speed limits, turn rules, and so on."},
    {q:"When parking uphill next to a curb, turn your front wheels:",o:["Toward the curb","Away from the curb","Straight ahead","It does not matter"],a:1,e:"Uphill with a curb: point the wheels away from the curb so the car rolls back into it."},
    {q:"When parking downhill next to a curb, turn your front wheels:",o:["Toward the curb","Away from the curb","Straight ahead","It does not matter"],a:0,e:"Downhill: turn the wheels toward the curb so the car rolls into it, not into traffic."},
    {q:"An emergency vehicle approaches with lights and siren on. You should:",o:["Speed up","Pull to the right and stop","Stop in your lane","Turn left immediately"],a:1,e:"Pull to the right edge of the road and stop until it passes."},
    {q:"Missouri's 'Move Over' law says that for a stopped emergency vehicle you should:",o:["Keep your speed","Slow down and move over a lane if you can","Speed past quickly","Stop in the road"],a:1,e:"Slow down and, if safe, move over a lane to give stopped crews room."},
    {q:"A right turn on a red light is:",o:["Never allowed","Allowed after a full stop if it is safe and no sign forbids it","Allowed without stopping","Allowed only at night"],a:1,e:"Stop fully first, make sure it is clear and not prohibited by a sign, then turn."},
    {q:"Is driver education required to get a Missouri license if you are 18 or older?",o:["Yes, always","No","Only in Kansas City","Only for some drivers"],a:1,e:"Driver education is not required for applicants 18 and older."}
  ];

  var LABELS = {
    en:{q:"Question",score:"Score",next:"Next question",finish:"See results",you:"You scored",retake:"Try again",book:"Book a lesson",review:"Back to Permit Help",
        hi:"Nice work — you know your stuff.",mid:"Good start. A little more study and you've got this.",lo:"Keep studying — you'll get there. Review the Missouri Driver Guide."},
    es:{q:"Pregunta",score:"Puntos",next:"Siguiente",finish:"Ver resultados",you:"Obtuviste",retake:"Intentar de nuevo",book:"Reservar una clase",review:"Volver a la Guía del permiso",
        hi:"¡Bien hecho! Dominas el tema.",mid:"Buen comienzo. Un poco más de estudio y lo tienes.",lo:"Sigue estudiando, lo lograrás. Repasa la Guía del Conductor de Missouri."},
    tl:{q:"Tanong",score:"Puntos",next:"Susunod",finish:"Tingnan ang resulta",you:"Nakakuha ka ng",retake:"Subukan muli",book:"Mag-book ng lesson",review:"Bumalik sa Gabay sa permit",
        hi:"Magaling — alam mo ang gamit.",mid:"Magandang simula. Kaunti pang aral at kaya mo na.",lo:"Ituloy ang pag-aaral, makakaya mo. Balikan ang Missouri Driver Guide."}
  };
  function L(){ var k="en"; try{k=localStorage.getItem("nd_lang")||"en";}catch(e){} return LABELS[k]||LABELS.en; }

  var TOTAL = 10;
  var CHECK = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="m5 12 5 5L20 7"/></svg>';
  var CROSS = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M6 6l12 12M18 6 6 18"/></svg>';

  function shuffle(arr){
    var a=arr.slice();
    for(var i=a.length-1;i>0;i--){ var j=Math.floor(Math.random()*(i+1)); var t=a[i];a[i]=a[j];a[j]=t; }
    return a;
  }
  function esc(s){ return s.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;"); }

  var state;
  function start(){
    var picked = shuffle(BANK).slice(0, TOTAL).map(function(item){
      var correct = item.o[item.a];
      return { q:item.q, o:shuffle(item.o), correct:correct, e:item.e };
    });
    state = { list:picked, idx:0, score:0 };
    render();
    mount.scrollIntoView({behavior:"smooth", block:"start"});
  }

  function render(){
    var t=L(), i=state.idx, item=state.list[i];
    var pct = Math.round((i/TOTAL)*100);
    var opts = item.o.map(function(opt){
      return '<button class="quiz-opt" type="button" data-opt="'+esc(opt)+'">'+
               '<span class="mk"></span><span>'+esc(opt)+'</span></button>';
    }).join("");
    mount.innerHTML =
      '<div class="quiz-progress"><span style="width:'+pct+'%"></span></div>'+
      '<div class="quiz-card">'+
        '<div class="quiz-meta"><span>'+t.q+' <b>'+(i+1)+'</b> / '+TOTAL+'</span>'+
          '<span>'+t.score+' <b>'+state.score+'</b></span></div>'+
        '<p class="quiz-q">'+esc(item.q)+'</p>'+
        '<div class="quiz-opts">'+opts+'</div>'+
        '<div class="quiz-explain" hidden></div>'+
        '<div class="quiz-actions" hidden><button class="btn btn-primary quiz-next" type="button">'+
          (i===TOTAL-1 ? t.finish : t.next)+'</button></div>'+
      '</div>';

    var btns = mount.querySelectorAll(".quiz-opt");
    Array.prototype.forEach.call(btns, function(b){
      b.addEventListener("click", function(){ answer(b); });
    });
  }

  function answer(btn){
    var item = state.list[state.idx];
    var chosen = btn.getAttribute("data-opt");
    var btns = mount.querySelectorAll(".quiz-opt");
    Array.prototype.forEach.call(btns, function(b){
      b.disabled = true;
      var opt = b.getAttribute("data-opt");
      if(opt === item.correct){ b.classList.add("correct"); b.querySelector(".mk").innerHTML = CHECK; }
      else if(b === btn){ b.classList.add("wrong"); b.querySelector(".mk").innerHTML = CROSS; }
    });
    if(chosen === item.correct) state.score++;
    var ex = mount.querySelector(".quiz-explain");
    ex.textContent = item.e; ex.hidden = false;
    var act = mount.querySelector(".quiz-actions"); act.hidden = false;
    mount.querySelector(".quiz-meta b:last-child") && (mount.querySelectorAll(".quiz-meta b")[1].textContent = state.score);
    mount.querySelector(".quiz-next").addEventListener("click", next);
  }

  function next(){
    if(state.idx < TOTAL-1){ state.idx++; render(); mount.scrollIntoView({behavior:"smooth",block:"start"}); }
    else result();
  }

  function result(){
    var t=L(), s=state.score;
    var msg = s>=8 ? t.hi : (s>=5 ? t.mid : t.lo);
    mount.innerHTML =
      '<div class="quiz-card quiz-result">'+
        '<div class="quiz-score">'+s+'<small> / '+TOTAL+'</small></div>'+
        '<p class="quiz-msg">'+msg+'</p>'+
        '<div class="btn-row">'+
          '<button class="btn btn-primary quiz-retake" type="button">'+t.retake+'</button>'+
          '<a class="btn btn-ghost" href="contact.html">'+t.book+'</a>'+
          '<a class="btn btn-ghost" href="permit.html">'+t.review+'</a>'+
        '</div>'+
      '</div>';
    mount.querySelector(".quiz-retake").addEventListener("click", start);
    mount.scrollIntoView({behavior:"smooth",block:"start"});
  }

  start();
})();
