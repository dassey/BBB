/* =========================================================
   Northland Driving — WebMCP tools
   ---------------------------------------------------------
   Exposes a few page capabilities to an AI agent through
   document.modelContext (the WebMCP proposal).

   Availability, honestly: this needs Chrome 149+ with a flag,
   or an origin-trial token in a <meta> tag. Nobody searching
   for driving lessons in Gladstone has that today. It is here
   because it is a free sandbox on a site we control and it
   demos well — not because it will bring in leads.

   Two rules this file follows:

   1. NO DUPLICATED FACTS. Everything a tool states about
      prices or service area is read from data/facts.json —
      the same file .agent/tools/checks/40-pricing.mjs gates.
      A tool that hardcoded $85 would keep quoting it after a
      price rise, and nothing would catch that.

   2. NOTHING SENDS. The booking tool fills the form and stops.
      A public static site has no server-side rate limiting, so
      an agent-callable "submit" is a spam cannon with a schema
      attached. A human presses send.
   ========================================================= */
(function () {
  "use strict";

  var mc = typeof document !== "undefined" && document.modelContext;
  if (!mc || typeof mc.registerTool !== "function") return;

  var FACTS = null;

  function facts() {
    if (FACTS) return Promise.resolve(FACTS);
    return fetch("data/facts.json", { cache: "no-cache" })
      .then(function (r) {
        if (!r.ok) throw new Error("facts.json " + r.status);
        return r.json();
      })
      .then(function (j) { FACTS = j; return j; });
  }

  function money(n) { return "$" + n; }

  function register(tool) {
    try {
      var out = mc.registerTool(tool);
      if (out && typeof out.catch === "function") out.catch(function () {});
    } catch (e) { /* one bad tool must not take out the rest */ }
  }

  var page = (location.pathname.split("/").pop() || "index.html").toLowerCase();
  var onQuiz = page === "quiz.html";
  var onContact = page === "contact.html";

  /* ---------------------------------------------------------
     Everywhere: what the school charges
     --------------------------------------------------------- */
  register({
    name: "get_pricing",
    description:
      "Returns Northland Driving's current lesson rates and what each option includes. " +
      "Use instead of reading prices off the page, which requires parsing layout.",
    inputSchema: { type: "object", properties: {} },
    annotations: { readOnlyHint: true },
    execute: function () {
      return facts().then(function (f) {
        return {
          currency: "USD",
          tiers: f.tiers.map(function (t) {
            return {
              name: t.name,
              price: t.price,
              hours: t.hours,
              perHour: t.hours ? Math.round((t.price / t.hours) * 100) / 100 : null
            };
          }),
          includedInEveryLesson: [
            "Practice in the school's dual-control vehicle",
            "Free pick-up and drop-off inside the Northland service area",
            "One-to-one instruction with a female driver"
          ],
          paymentMethods: ["Cash", "Venmo", "Cash App", "Zelle"],
          note:
            "Single sessions are paid at the end of the lesson. Packages are paid " +
            "at the first session. Booking is by email at " + f.business.email + "."
        };
      });
    }
  });

  /* ---------------------------------------------------------
     Everywhere: is this address covered by free pick-up
     --------------------------------------------------------- */
  register({
    name: "check_service_area",
    description:
      "Checks whether a given city, neighbourhood, or ZIP code is inside Northland " +
      "Driving's free pick-up area around Gladstone, Missouri.",
    inputSchema: {
      type: "object",
      properties: {
        location: {
          type: "string",
          description: "City name, neighbourhood, or 5-digit ZIP code"
        }
      },
      required: ["location"]
    },
    annotations: { readOnlyHint: true },
    execute: function (args) {
      return facts().then(function (f) {
        var b = f.business;
        var q = String((args && args.location) || "").trim().toLowerCase();
        if (!q) return { covered: null, message: "Give me a city, neighbourhood, or ZIP to check." };

        var names = (b.areaServed || []).concat(b.areaServedAliases || []);
        var zips = b.areaServedZips || [];

        var byName = names.some(function (n) { return q.indexOf(n.toLowerCase()) !== -1; });
        var byZip = zips.indexOf(q) !== -1;

        if (byName || byZip) {
          return {
            covered: true,
            message:
              args.location + " is inside the service area. Free pick-up and drop-off " +
              "is included — roughly a " + b.pickupRadiusMinutes + "-minute radius from " +
              b.baseCity + ", " + b.region + ".",
            areaServed: b.areaServed
          };
        }

        // Deliberately does not claim "not covered" — the ZIP list is empty
        // until the owner fills it, and guessing wrong about a free service
        // is worse than pointing at a human.
        return {
          covered: null,
          message:
            args.location + " is not one of the places listed as inside the free " +
            "pick-up radius (" + b.areaServed.join(", ") + "). It may still be " +
            "possible — email " + b.email + " to ask.",
          areaServed: b.areaServed,
          contact: f.business.email
        };
      });
    }
  });

  /* ---------------------------------------------------------
     Everywhere: Missouri permit basics
     --------------------------------------------------------- */
  register({
    name: "get_permit_requirements",
    description:
      "Returns how to get a Missouri Class F instruction permit — the tests, the " +
      "documents, the fee, and what adult applicants over 18 can skip.",
    inputSchema: { type: "object", properties: {} },
    annotations: { readOnlyHint: true },
    execute: function () {
      return facts().then(function (f) {
        var fees = (f.external && f.external.fees) || {};
        return {
          steps: [
            "Pass three tests at a Missouri State Highway Patrol driver examination station: vision, road signs, and written knowledge.",
            "Take your Driver Examination Record to a Missouri Department of Revenue license office.",
            "Bring proof of identity and legal status, your Social Security number, and proof of Missouri residency. A REAL ID permit needs two proofs of address.",
            "Pay the fee."
          ],
          instructionPermitFee: fees.missouriInstructionPermit != null ? money(fees.missouriInstructionPermit) : null,
          intermediateLicenseFee: fees.missouriIntermediateLicense != null ? money(fees.missouriIntermediateLicense) : null,
          permitValidMonths: 12,
          minimumAge: (f.external && f.external.minPermitAge) || null,
          maximumAge: null,
          adultsOver18: "No formal driver education course is required for applicants 18 or older.",
          whileOnAPermit: "A qualified licensed driver must be in the front passenger seat at all times. Everyone in the car wears a seat belt.",
          disclaimer:
            "Rules change. Confirm against the Missouri Department of Revenue before you go — this is a summary of the site's permit page, not legal advice."
        };
      });
    }
  });

  /* ---------------------------------------------------------
     Everywhere: the page's own light/dark state
     --------------------------------------------------------- */
  register({
    name: "set_theme",
    description: "Switches this page between its light and dark colour themes.",
    inputSchema: {
      type: "object",
      properties: {
        theme: { type: "string", enum: ["light", "dark"], description: "Which theme to apply" }
      },
      required: ["theme"]
    },
    execute: function (args) {
      var t = args && args.theme === "dark" ? "dark" : "light";
      document.documentElement.setAttribute("data-theme", t);
      try { localStorage.setItem("nd_theme", t); } catch (e) {}
      var btn = document.getElementById("themeToggle");
      if (btn) btn.setAttribute("aria-label", t === "dark" ? "Switch to light theme" : "Switch to dark theme");
      return { theme: t, message: "Theme set to " + t + "." };
    }
  });

  /* ---------------------------------------------------------
     quiz.html only: drive the permit practice quiz
     --------------------------------------------------------- */
  if (onQuiz) {
    register({
      name: "start_quiz",
      description:
        "Starts a fresh Missouri permit practice quiz — 10 questions drawn at random " +
        "from a bank of 30 — and returns the first question.",
      inputSchema: { type: "object", properties: {} },
      execute: function () {
        if (!window.ND_QUIZ) return { error: "The quiz has not loaded on this page." };
        window.ND_QUIZ.start();
        return window.ND_QUIZ.getState();
      }
    });

    register({
      name: "get_quiz_state",
      description: "Returns the current quiz question, its options, the score so far, and whether the run is finished.",
      inputSchema: { type: "object", properties: {} },
      annotations: { readOnlyHint: true },
      execute: function () {
        if (!window.ND_QUIZ) return { error: "The quiz has not loaded on this page." };
        return window.ND_QUIZ.getState() || { error: "The quiz has not started. Call start_quiz first." };
      }
    });

    register({
      name: "answer_quiz_question",
      description:
        "Answers the current quiz question by the 0-based index of the option, then " +
        "returns the result with the explanation. Call get_quiz_state first to see the options.",
      inputSchema: {
        type: "object",
        properties: {
          optionIndex: { type: "integer", minimum: 0, description: "0-based index into the options array" }
        },
        required: ["optionIndex"]
      },
      execute: function (args) {
        if (!window.ND_QUIZ) return { error: "The quiz has not loaded on this page." };
        var ok = window.ND_QUIZ.answer(args && args.optionIndex);
        if (!ok) {
          return {
            error: "Could not answer — the quiz may not be running, this question may already be answered, or the index is out of range.",
            state: window.ND_QUIZ.getState()
          };
        }
        return window.ND_QUIZ.getState();
      }
    });

    register({
      name: "next_quiz_question",
      description: "Moves to the next quiz question after the current one has been answered.",
      inputSchema: { type: "object", properties: {} },
      execute: function () {
        if (!window.ND_QUIZ) return { error: "The quiz has not loaded on this page." };
        var ok = window.ND_QUIZ.next();
        if (!ok) return { error: "Answer the current question first.", state: window.ND_QUIZ.getState() };
        return window.ND_QUIZ.getState();
      }
    });
  }

  /* ---------------------------------------------------------
     contact.html only: fill the booking form — never send it
     --------------------------------------------------------- */
  if (onContact) {
    register({
      name: "prepare_lesson_enquiry",
      description:
        "Fills in the booking form on this page with the visitor's details. It does NOT " +
        "send anything — the person stays in control and presses the send button themselves.",
      inputSchema: {
        type: "object",
        properties: {
          name: { type: "string", description: "The visitor's name" },
          email: { type: "string", description: "The visitor's email address" },
          interest: {
            type: "string",
            description: "Which option they want. Call get_pricing for the exact tier names."
          },
          note: { type: "string", description: "Anything they want to add about their driving experience" }
        }
      },
      execute: function (args) {
        args = args || {};
        var set = function (id, v) {
          var el = document.getElementById(id);
          if (el && v != null && v !== "") { el.value = v; return true; }
          return false;
        };

        var filled = [];
        if (set("bkName", args.name)) filled.push("name");
        if (set("bkEmail", args.email)) filled.push("email");
        if (set("bkNote", args.note)) filled.push("note");

        if (args.interest) {
          var sel = document.getElementById("bkOption");
          if (sel) {
            var want = String(args.interest).toLowerCase();
            for (var i = 0; i < sel.options.length; i++) {
              if (sel.options[i].text.toLowerCase().indexOf(want) !== -1) {
                sel.selectedIndex = i;
                filled.push("interest");
                break;
              }
            }
          }
        }

        var form = document.getElementById("bkName");
        if (form && form.scrollIntoView) form.scrollIntoView({ behavior: "smooth", block: "center" });

        return {
          filled: filled,
          sent: false,
          message:
            filled.length
              ? "Filled in " + filled.join(", ") + ". Nothing has been sent — the form is ready for the visitor to review and press send."
              : "Nothing was filled in. The booking form was not found on this page."
        };
      }
    });
  }
})();
