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
    {
      q: "What is the minimum age to apply for a Missouri Class F instruction permit?",
      o: ["14", "15", "16", "18"],
      a: 1,
      e: "You can apply for a Missouri instruction permit at age 15. There is no maximum age."
    },
    {
      q: "While driving on an instruction permit, a licensed driver must sit where?",
      o: ["In the back seat", "In the front passenger seat", "Anywhere in the car", "No licensed driver is required"],
      a: 1,
      e: "A qualified licensed driver must sit in the front passenger seat next to the permit holder at all times."
    },
    {
      q: "For drivers 21 and older, Missouri's legal blood alcohol concentration (BAC) limit is:",
      o: ["0.05%", "0.08%", "0.10%", "0.12%"],
      a: 1,
      e: "0.08% is the legal BAC limit for drivers 21 and older in Missouri."
    },
    {
      q: "For drivers under 21, Missouri's 'zero tolerance' BAC limit is:",
      o: ["0.00%", "0.02%", "0.05%", "0.08%"],
      a: 1,
      e: "Under Missouri's zero tolerance law, a BAC of 0.02% or higher leads to suspension for drivers under 21."
    },
    {
      q: "A red, eight-sided (octagon) traffic sign always means:",
      o: ["Yield", "Stop", "Do not enter", "Caution"],
      a: 1,
      e: "The octagon shape is exclusively used for STOP signs."
    },
    {
      q: "A yellow diamond-shaped sign is used to:",
      o: ["Give an order you must obey", "Warn you about hazards or conditions ahead", "Mark a highway route", "Show a rest stop"],
      a: 1,
      e: "Yellow diamond signs warn drivers of upcoming road hazards or changes in traffic conditions."
    },
    {
      q: "A solid yellow line on your side of the center line means:",
      o: ["Passing is allowed", "Do not pass", "Merge left immediately", "Two-way left turn lane"],
      a: 1,
      e: "A solid yellow line on your side indicates a no-passing zone."
    },
    {
      q: "A flashing red traffic light means:",
      o: ["Speed up to clear it", "Stop completely, then proceed when safe", "Slow down only", "Ignore the light"],
      a: 1,
      e: "Treat a flashing red light like a stop sign: come to a complete stop and proceed when clear."
    },
    {
      q: "A flashing yellow traffic light means:",
      o: ["Stop completely", "Slow down and proceed with caution", "Turn right only", "Road closed"],
      a: 1,
      e: "A flashing yellow light warns drivers to slow down and proceed carefully through the intersection."
    },
    {
      q: "On a two-lane road, when a school bus stops with red lights flashing, you must:",
      o: ["Slow to 15 mph", "Stop completely until the red lights stop flashing", "Pass quickly on the left", "Honk and continue"],
      a: 1,
      e: "Drivers in both directions must stop for a school bus loading or unloading children on a two-lane road."
    },
    {
      q: "What is the total fee for a Missouri Class F instruction permit?",
      o: ["Free", "$10.00", "$25.00", "$50.00"],
      a: 1,
      e: "The Missouri DOR total fee for a Class F instruction permit is $10.00."
    },
    {
      q: "A Missouri instruction permit is valid for:",
      o: ["3 months", "6 months", "12 months", "3 years"],
      a: 2,
      e: "A Missouri instruction permit is valid for 12 months (1 year) and is renewable."
    },
    {
      q: "A safe following distance in normal conditions is guided by:",
      o: ["The 3-second rule", "One car length total", "Stay within 10 feet", "Match the brake lights ahead"],
      a: 0,
      e: "Maintain at least a 3-second gap behind the vehicle ahead under normal driving conditions."
    },
    {
      q: "When driving in dense fog, you should use:",
      o: ["High-beam headlights", "Low-beam headlights", "Hazard lights only", "No lights"],
      a: 1,
      e: "Use low-beam headlights in fog; high beams reflect off fog moisture and reduce visibility."
    },
    {
      q: "If your vehicle begins to skid, you should:",
      o: ["Slam hard on the brakes", "Ease off the gas pedal and steer where you want to go", "Steer sharply the opposite way", "Speed up to gain traction"],
      a: 1,
      e: "Ease off the accelerator gently and steer smoothly in the direction you wish to travel."
    },
    {
      q: "When entering a traffic roundabout, you must yield to:",
      o: ["Traffic already circulating in the roundabout", "Traffic entering on your left", "Pedestrians on the sidewalk only", "No one"],
      a: 0,
      e: "Always yield the right-of-way to traffic already circulating within the roundabout."
    },
    {
      q: "A red and white downward-pointing triangle sign means:",
      o: ["Stop", "Yield", "Do not enter", "Merge ahead"],
      a: 1,
      e: "A downward-pointing red and white triangle is exclusively used for YIELD signs."
    },
    {
      q: "Seat belts are required for whom when driving on an instruction permit?",
      o: ["The driver only", "Front-seat passengers only", "Everyone in the vehicle", "No one"],
      a: 2,
      e: "Missouri law requires everyone in the vehicle to wear a seat belt."
    },
    {
      q: "Before changing lanes, you should:",
      o: ["Signal, check mirrors, and check blind spots", "Just turn on your signal", "Speed up first", "Honk your horn"],
      a: 0,
      e: "Signal, check interior and side mirrors, and look over your shoulder for blind spots."
    },
    {
      q: "On a road with no posted speed limit, drivers should:",
      o: ["Drive as fast as traffic allows", "Drive at a safe and reasonable speed for conditions", "Always drive 60 mph", "Stop at every intersection"],
      a: 1,
      e: "Drive at a safe and reasonable speed depending on weather, traffic, and road conditions."
    },
    {
      q: "Under Missouri's hands-free law, holding a cell phone while driving is:",
      o: ["Allowed at red lights", "Allowed on interstate highways", "Prohibited while driving", "Allowed for calls only"],
      a: 2,
      e: "Missouri's hands-free law prohibits holding or supporting a cell phone while operating a vehicle."
    },
    {
      q: "Headlights are required from:",
      o: ["Only on rural highways", "30 minutes after sunset to 30 minutes before sunrise", "Only when raining hard", "10:00 PM to 5:00 AM"],
      a: 1,
      e: "Headlights are required from 30 minutes after sunset to 30 minutes before sunrise, and in low visibility."
    },
    {
      q: "Two vehicles reach an open intersection at the same time. Who yields?",
      o: ["The driver on the left yields to the driver on the right", "The faster car goes first", "The larger vehicle goes first", "Whoever honks first"],
      a: 0,
      e: "Yield to the vehicle on your right when arriving at an open intersection at the same time."
    },
    {
      q: "A white rectangular traffic sign usually shows:",
      o: ["A warning", "A traffic law or regulation you must obey", "A rest area ahead", "A historic site"],
      a: 1,
      e: "White rectangular regulatory signs state traffic laws you must obey, like speed limits."
    },
    {
      q: "When parking uphill next to a curb, turn your front wheels:",
      o: ["Toward the curb", "Away from the curb", "Straight ahead", "It does not matter"],
      a: 1,
      e: "Turn wheels away from the curb so the car rolls back against the curb if brakes fail."
    },
    {
      q: "When parking downhill next to a curb, turn your front wheels:",
      o: ["Toward the curb", "Away from the curb", "Straight ahead", "It does not matter"],
      a: 0,
      e: "Turn wheels toward the curb so the car rolls into the curb rather than into traffic."
    },
    {
      q: "An emergency vehicle approaches with siren and lights on. You must:",
      o: ["Speed up", "Pull to the right edge of the road and stop", "Stop in your lane", "Turn left immediately"],
      a: 1,
      e: "Pull over to the right edge of the roadway and stop until the emergency vehicle passes."
    },
    {
      q: "Missouri's 'Move Over' law requires drivers approaching stopped emergency vehicles to:",
      o: ["Maintain speed", "Slow down and change lanes if safe to do so", "Speed past quickly", "Stop in the middle lane"],
      a: 1,
      e: "Slow down and, if safe, change lanes to leave an open lane next to the stopped emergency vehicle."
    },
    {
      q: "A right turn on a red traffic light in Missouri is:",
      o: ["Never allowed", "Allowed after a full stop if clear and no sign forbids it", "Allowed without stopping", "Allowed only at night"],
      a: 1,
      e: "Stop completely first, check that traffic and crosswalks are clear, and turn if no sign forbids it."
    },
    {
      q: "Is formal driver education required for applicants 18 or older in Missouri?",
      o: ["Yes, always required", "No, driver education is not required for applicants 18 and older", "Only in Kansas City", "Only if you failed once"],
      a: 1,
      e: "Driver education is not mandatory for adult applicants 18 and older in Missouri."
    }
  ];

  var LABELS = {
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
  };

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
      var rawOpts = item.o.map(function(optText, idx){
        return {
          idx: idx,
          text: optText,
          isCorrect: (idx === item.a)
        };
      });
      var shuffledOpts = shuffle(rawOpts);
      return {
        q: item.q,
        opts: shuffledOpts,
        e: item.e
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
    var t = LABELS;
    var i = state.idx;
    var item = state.list[i];
    var pct = Math.round((i/TOTAL)*100);
    var chosenOptIndex = state.answers[i];
    var answered = (chosenOptIndex !== undefined && chosenOptIndex !== null);

    var qText = item.q;
    var eText = item.e;

    var optsHtml = item.opts.map(function(optObj, oIdx){
      var text = optObj.text;
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
    var t = LABELS;
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

  start();
})();
