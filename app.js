/* =========================================================
   Northland Driving — shared behaviour
   • sticky-header state • mobile nav • language toggle (EN/ES/TL)
   • scroll reveal • FAQ accordion • SMS booking
   ---------------------------------------------------------
   BEFORE LAUNCH — set the two constants just below.
   ========================================================= */

// Contact email. This is where booking messages go.
window.ND_EMAIL = "hello@northlanddriving.com";

/* ---- Translations. English is the source text in the HTML.
   Only keys that differ from English need entries here. ---- */
window.ND_DICT = {
  es:{
    "nav.about":"Nosotras","nav.pricing":"Precios","nav.permit":"Permiso","nav.contact":"Contacto","nav.book":"Reservar clase",
    "cta.book":"Reservar una clase","cta.pricing":"Ver precios","cta.contact":"Contáctanos","cta.learn":"Cómo funciona","cta.permit":"Guía del permiso",

    /* footer + common */
    "foot.tag":"Clases de manejo con calma y paciencia para adultos en Gladstone y el Northland de Kansas City.",
    "foot.explore":"Explorar","foot.lessons":"Las clases","foot.contact":"Contacto",
    "foot.area":"Servimos a Gladstone y el Northland de KC, Missouri.",
    "foot.owned":"Negocio local, propiedad de una mujer · Gladstone, MO",
    "foot.rights":"© 2026 Northland Driving.",
    "foot.emailcta":"Envíanos un correo","foot.book":"Reservar una clase","foot.home":"Inicio",
    "common.email":"Escríbenos","common.badge.owned":"Propiedad de una mujer","common.badge.car":"Usamos nuestro auto","common.badge.lang":"Inglés y tagalo",

    /* HOME */
    "home.title":"Home · Northland Driving",
    "home.eyebrow":"Clases de manejo · Gladstone, MO",
    "home.h1":"Aprende a manejar a tu ritmo.",
    "home.lead":"Clases individuales para adultos que empiezan de cero. Comenzamos en un estacionamiento tranquilo y avanzamos hacia calles reales cuando estés lista.",
    "home.m1":"Desde cero, sin experiencia previa","home.m2":"Usamos nuestro auto, tú solo te presentas","home.m3":"Clases en inglés o tagalo",
    "home.who.eyebrow":"Para quién es","home.who.h2":"Diseñado para principiantes de verdad.","home.who.lead":"La mayoría de nuestras alumnas nunca han manejado, o lo intentaron hace años y quieren volver a empezar sin presión.",
    "home.who1.t":"Nunca has manejado","home.who1.p":"Empezamos por lo básico, paso a paso, sin dar nada por sentado.",
    "home.who2.t":"Regresas nerviosa","home.who2.p":"Si un intento anterior no salió bien, retomamos con calma y a tu propio ritmo.",
    "home.who3.t":"Aprendes en inglés","home.who3.p":"Explicamos con claridad y sin apuro. Las clases pueden ser en inglés o tagalo.",
    "home.how.eyebrow":"Cómo funciona","home.how.h2":"Del estacionamiento a la licencia.","home.how.lead":"Un plan claro de tres etapas. Avanzamos solo cuando te sientes lista.",
    "home.s1.t":"Fundamentos en el lote","home.s1.p":"Arrancar, frenar, dirigir, espejos y estacionar en un lote grande y vacío, sin tráfico.",
    "home.s2.t":"Ganar confianza","home.s2.p":"Vueltas suaves, retroceso, control del carril y puntos ciegos hasta que se sienta natural.",
    "home.s3.t":"Calles reales","home.s3.p":"Pasamos a calles tranquilas del Northland con señales, cruces y giros de verdad.",
    "home.band.h2":"Da tu primer paso al volante.","home.band.p":"La primera clase de prueba es de una hora por $30. Reserva por mensaje cuando quieras.",

    /* ABOUT */
    "about.title":"Nosotras · Northland Driving",
    "about.eyebrow":"Nosotras","about.h1":"Instrucción tranquila, de una persona que se toma el tiempo.",
    "about.frametag":"La foto de tu instructora va aquí","about.phcaption":"Foto próximamente",
    "about.pull":"“No hay prisa. Avanzamos a tu ritmo hasta que el auto se sienta normal.”",
    "about.p1":"Northland Driving es un pequeño negocio local, propiedad de una mujer, en Gladstone. La instrucción es individual y siempre en nuestro auto, así que solo necesitas presentarte.",
    "about.p2":"Ha enseñado a manejar a muchas personas y tiene paciencia real para ello. Como inmigrante, entiende lo que es aprender algo grande en un país e idioma nuevos, y por eso las clases pueden darse en inglés o tagalo, sin apuro.",
    "about.v1.t":"Paciencia genuina","about.v1.p":"Vamos a tu ritmo, con explicaciones claras y sin juicios.",
    "about.v2.t":"Auto incluido","about.v2.p":"Practicas en nuestro auto. No necesitas traer el tuyo.",
    "about.v3.t":"Inglés o tagalo","about.v3.p":"Cómoda enseñando a quienes aún aprenden inglés.",
    "about.v4.t":"Local y de confianza","about.v4.p":"Negocio propiedad de una mujer, con base en Gladstone.",
    "about.stat1":"Estacionamiento","about.stat1l":"Donde empezamos","about.stat2":"1 a 1","about.stat2l":"Siempre individual","about.stat3":"EN · TL","about.stat3l":"Idiomas de clase",

    /* PRICING */
    "pricing.title":"Precios · Northland Driving",
    "pricing.eyebrow":"Precios","pricing.h1":"Precios simples y claros.","pricing.lead":"Paga por clase o ahorra con el paquete. Sin cuotas ocultas, sin presión.",
    "pricing.per":"/ hora",
    "pricing.t1.name":"Primera clase","pricing.t1.sub":"Una hora · solo para primerizas, una por persona","pricing.t1.f1":"Un primer intento sin presión","pricing.t1.f2":"Descubre si manejar es para ti","pricing.t1.f3":"Nuestro auto, lote vacío","pricing.t1.btn":"Empezar aquí",
    "pricing.t2.flag":"Mejor valor","pricing.t2.name":"Paquete de 6 horas","pricing.t2.sub":"Unas seis clases · aproximadamente $41.67 por hora","pricing.t2.f1":"Ahorras $20 frente al precio por clase","pricing.t2.f2":"Tiempo suficiente para dominarlo","pricing.t2.f3":"Del lote hasta las calles","pricing.t2.btn":"Elegir paquete",
    "pricing.t3.name":"Por clase","pricing.t3.sub":"Paga sobre la marcha, una hora a la vez","pricing.t3.f1":"Sin compromiso","pricing.t3.f2":"Reserva cuando te convenga","pricing.t3.f3":"La misma atención individual","pricing.t3.btn":"Reservar una clase",
    "pricing.inc.h":"Incluido en cada clase","pricing.inc1":"Nuestro auto","pricing.inc1p":"Practicas en nuestro vehículo. No traes nada.","pricing.inc2":"Horario flexible","pricing.inc2p":"Reservamos a la hora que te convenga.","pricing.inc3":"Uno a uno","pricing.inc3p":"Toda la hora es tuya, a tu ritmo.",
    "pricing.faq.h2":"Preguntas sobre pago",
    "pricing.q1":"¿Cómo pago?","pricing.a1":"Aceptamos efectivo, Venmo, Cash App y Zelle. [Confirma los métodos que aceptas antes de publicar.]",
    "pricing.q2":"¿Cuándo pago?","pricing.a2":"Por clase, pagas al final de la sesión. Los paquetes se pagan por adelantado y luego programamos las horas cuando te convenga.",
    "pricing.q3":"¿Puedo empezar con la clase de prueba?","pricing.a3":"Sí. La clase de prueba de $30 es la mejor manera de empezar. Es de una hora, solo para primerizas, una por persona.",
    "pricing.q4":"¿Necesito un permiso primero?","pricing.a4":"No para practicar en un estacionamiento privado. Necesitarás un permiso de instrucción de Missouri antes de manejar en calles públicas. Consulta la Guía del permiso.",

    /* PERMIT */
    "permit.title":"Guía del permiso de Missouri · Northland Driving",
    "permit.eyebrow":"Guía del permiso de Missouri","permit.h1":"Cómo obtener tu permiso de Missouri.","permit.lead":"Antes de practicar en calles públicas, Missouri exige un permiso de instrucción. Aquí está el proceso, y te ayudamos a estudiar para el examen.",
    "permit.notice":"Las leyes cambian. Verificamos estos datos con el Departamento de Ingresos de Missouri (DOR), pero confirma siempre las reglas actuales en los enlaces oficiales de abajo antes de ir.",
    "permit.steps.h2":"El proceso, paso a paso",
    "permit.st1.t":"Estudia y presenta tres exámenes","permit.st1.p":"Vista, señales de tránsito y conocimiento escrito, en una estación de examen de la Patrulla de Caminos de Missouri (MSHP). El DOR no aplica los exámenes.",
    "permit.st2.t":"Lleva tu registro al DOR","permit.st2.p":"Presenta tu Registro de Examen de Conductor en una oficina de licencias del DOR de Missouri.",
    "permit.st3.t":"Lleva tus documentos","permit.st3.p":"Identidad y estatus legal, número de Seguro Social y prueba de residencia en Missouri. Un permiso REAL ID requiere dos pruebas de domicilio.",
    "permit.st4.t":"Paga la cuota","permit.st4.p":"El permiso de instrucción Clase F cuesta en total $10.00. Es válido por 12 meses y renovable.",
    "permit.facts.h2":"Lo que conviene saber",
    "permit.f1.t":"Quién necesita un permiso","permit.f1a":"Cualquier conductor primerizo sin licencia válida de otro estado de EE. UU., <b>incluidos los adultos de 18 años o más.</b>","permit.f1b":"La edad mínima es 15. <b>No hay edad máxima.</b>","permit.f1c":"Los menores de 18 necesitan la firma de un padre o tutor.",
    "permit.f2.t":"Con el permiso puedes","permit.f2a":"Manejar siempre con un conductor con licencia calificado en el asiento delantero.","permit.f2b":"Si tienes 16 o más, ese acompañante debe tener al menos 21 años.","permit.f2c":"Todas las personas en el auto deben usar cinturón.",
    "permit.f3.t":"Adultas de 18+ (la mayoría)","permit.f3a":"Vas directo de permiso → práctica → examen de manejo en MSHP → licencia en el DOR.","permit.f3b":"No se exige educación vial si tienes 18 años o más.","permit.f3c":"Vigencia: 18–20 → 3 años; 21–69 → 6 años.",
    "permit.f4.t":"Menores de 18 (pasos GDL)","permit.f4a":"Mantener el permiso 182 días y registrar 40 horas supervisadas, incluidas 10 de noche.","permit.f4b":"Luego una Licencia Intermedia ($5, válida 2 años).","permit.f4c":"Toque de queda de 1 a 5 a.m. y límites de pasajeros.",
    "permit.links.h":"Enlaces oficiales",
    "permit.l1":"Costo y vigencia del permiso (DOR)","permit.l2":"Licencia Graduada (DOR)","permit.l3":"Preguntas frecuentes GDL (DOR)","permit.l4":"Lista de documentos (DOR)","permit.l5":"Guía del Conductor (PDF)","permit.l6":"Estaciones de examen (MSHP)",
    "permit.band.h2":"¿Estudiando para el examen escrito?","permit.band.p":"Te indicamos exámenes de práctica gratuitos y te ayudamos a prepararte para las clases.",

    /* CONTACT */
    "contact.title":"Contacto · Northland Driving",
    "contact.eyebrow":"Contacto","contact.h1":"Reserva una clase.","contact.lead":"Escribe tu nombre y correo y abriremos un mensaje listo para enviar. También puedes escribirnos directamente cuando quieras.",
    "contact.f.name":"Tu nombre","contact.f.namePh":"Nombre","contact.f.email":"Tu correo","contact.f.emailPh":"tucorreo@ejemplo.com","contact.f.opt":"Qué te interesa","contact.f.note":"Mensaje (opcional)","contact.f.notePh":"Cuéntanos un poco sobre tu experiencia manejando.",
    "contact.opt1":"Clase de prueba de $30","contact.opt2":"Clase por hora ($45)","contact.opt3":"Paquete de 6 horas ($250)","contact.opt4":"Solo tengo una pregunta",
    "contact.send":"Abrir correo","contact.fine":"Abre tu app de correo con un mensaje listo para enviar. Nunca enviamos spam.",
    "contact.reach.h":"Otras formas de contacto","contact.reach.email":"Escríbenos por correo","contact.reach.area":"Área de servicio","contact.reach.areaVal":"Gladstone y el Northland de Kansas City","contact.reach.hours":"Horario","contact.reach.hoursVal":"Flexible, según tu agenda"
  },

  tl:{
    "nav.about":"Tungkol","nav.pricing":"Presyo","nav.permit":"Permit","nav.contact":"Kontak","nav.book":"Mag-book ng lesson",
    "cta.book":"Mag-book ng lesson","cta.pricing":"Tingnan ang presyo","cta.contact":"Kontakin kami","cta.learn":"Paano ito","cta.permit":"Gabay sa permit",

    "foot.tag":"Kalmado at mapagpasensyang driving lessons para sa mga adult sa Gladstone at KC Northland.",
    "foot.explore":"Tuklasin","foot.lessons":"Ang lessons","foot.contact":"Kontak",
    "foot.area":"Naglilingkod sa Gladstone at KC Northland, Missouri.",
    "foot.owned":"Lokal na negosyo, pag-aari ng babae · Gladstone, MO",
    "foot.rights":"© 2026 Northland Driving.",
    "foot.emailcta":"Mag-email sa amin","foot.book":"Mag-book ng lesson","foot.home":"Home",
    "common.email":"Mag-email","common.badge.owned":"Pag-aari ng babae","common.badge.car":"Aming kotse ang gamit","common.badge.lang":"English at Tagalog",

    "home.title":"Home · Northland Driving",
    "home.eyebrow":"Driving lessons · Gladstone, MO",
    "home.h1":"Matutong mag-drive sa sarili mong bilis.",
    "home.lead":"One-on-one na lessons para sa mga adult na nagsisimula pa lang. Magsisimula tayo sa tahimik na parking lot at unti-unting susulong sa totoong kalsada kapag handa ka na.",
    "home.m1":"Mula sa simula, walang karanasang kailangan","home.m2":"Aming kotse ang gamit, dumating ka na lang","home.m3":"Lessons sa English o Tagalog",
    "home.who.eyebrow":"Para kanino","home.who.h2":"Para talaga sa mga baguhan.","home.who.lead":"Karamihan ng aming estudyante ay hindi pa nakakapag-drive, o sinubukan noon at gustong magsimulang muli nang walang pressure.",
    "home.who1.t":"Hindi pa nakakapag-drive","home.who1.p":"Sisimulan natin sa basics, hakbang-hakbang, walang ipinapalagay.",
    "home.who2.t":"Balik na may kaba","home.who2.p":"Kung hindi maganda ang nakaraang subok, dahan-dahan tayong babalik sa bilis mo.",
    "home.who3.t":"Nag-aaral sa English","home.who3.p":"Malinaw at hindi minamadali. Pwedeng English o Tagalog ang lessons.",
    "home.how.eyebrow":"Paano ito","home.how.h2":"Mula parking lot hanggang lisensya.","home.how.lead":"Malinaw na tatlong yugto. Susulong lang tayo kapag handa ka na.",
    "home.s1.t":"Basics sa lote","home.s1.p":"Pag-andar, preno, manibela, salamin at parking sa malaki at bakanteng lote, walang trapiko.",
    "home.s2.t":"Bumuo ng kumpiyansa","home.s2.p":"Malulan na liko, pag-atras, pagkontrol sa lane at blind spot hangga't natural na.",
    "home.s3.t":"Totoong kalsada","home.s3.p":"Susulong tayo sa tahimik na kalye ng Northland na may totoong signs, tawiran at liko.",
    "home.band.h2":"Simulan ang unang hakbang sa manibela.","home.band.p":"Ang unang trial lesson ay isang oras sa halagang $30. Mag-book sa text anumang oras.",

    "about.title":"Tungkol · Northland Driving",
    "about.eyebrow":"Tungkol","about.h1":"Kalmadong pagtuturo, mula sa taong may oras para sa iyo.",
    "about.frametag":"Dito ilalagay ang litrato ng instructor","about.phcaption":"Litrato, malapit na",
    "about.pull":"“Walang minamadali. Sa bilis mo tayo pupunta hangga't hindi pa normal ang pakiramdam sa kotse.”",
    "about.p1":"Ang Northland Driving ay maliit na lokal na negosyo na pag-aari ng babae, base sa Gladstone. One-on-one ang pagtuturo at laging aming kotse ang gamit, kaya dumating ka na lang.",
    "about.p2":"Marami na siyang tinuruang mag-drive at may tunay na pasensya rito. Bilang immigrant, alam niya ang pakiramdam ng pag-aaral ng malaking bagay sa bagong bansa at wika, kaya pwedeng English o Tagalog ang lessons, walang minamadali.",
    "about.v1.t":"Tunay na pasensya","about.v1.p":"Sa bilis mo tayo pupunta, malinaw magpaliwanag, walang panghuhusga.",
    "about.v2.t":"Kasama ang kotse","about.v2.p":"Sa aming kotse ka magpa-praktis. Di mo kailangan magdala ng sarili.",
    "about.v3.t":"English o Tagalog","about.v3.p":"Komportableng magturo sa mga nag-aaral pa ng English.",
    "about.v4.t":"Lokal at maaasahan","about.v4.p":"Pag-aari ng babae, base sa Gladstone.",
    "about.stat1":"Parking lot","about.stat1l":"Kung saan nagsisimula","about.stat2":"1 sa 1","about.stat2l":"Laging one-on-one","about.stat3":"EN · TL","about.stat3l":"Wika ng lesson",

    "pricing.title":"Presyo · Northland Driving",
    "pricing.eyebrow":"Presyo","pricing.h1":"Simple at malinaw na presyo.","pricing.lead":"Bayad kada lesson o mag-ipon gamit ang package. Walang tagong bayad, walang pressure.",
    "pricing.per":"/ oras",
    "pricing.t1.name":"Unang lesson","pricing.t1.sub":"Isang oras · para sa first-timer lang, isa kada tao","pricing.t1.f1":"Walang-pressure na unang subok","pricing.t1.f2":"Tingnan kung bagay sa'yo ang mag-drive","pricing.t1.f3":"Aming kotse, bakanteng lote","pricing.t1.btn":"Dito magsimula",
    "pricing.t2.flag":"Pinakasulit","pricing.t2.name":"6-oras na package","pricing.t2.sub":"Mga anim na lesson · humigit-kumulang $41.67 kada oras","pricing.t2.f1":"Makatipid ng $20 kumpara sa per-lesson","pricing.t2.f2":"Sapat na oras para talagang matutunan","pricing.t2.f3":"Mula lote hanggang kalye","pricing.t2.btn":"Kunin ang package",
    "pricing.t3.name":"Kada lesson","pricing.t3.sub":"Bayad habang tumatakbo, isang oras kada beses","pricing.t3.f1":"Walang commitment","pricing.t3.f2":"Mag-book kung kailan bagay sa'yo","pricing.t3.f3":"Parehong one-on-one na atensyon","pricing.t3.btn":"Mag-book ng lesson",
    "pricing.inc.h":"Kasama sa bawat lesson","pricing.inc1":"Aming kotse","pricing.inc1p":"Sa aming sasakyan magpa-praktis. Wala kang dadalhin.","pricing.inc2":"Flexible na oras","pricing.inc2p":"Mag-book sa oras na bagay sa'yo.","pricing.inc3":"One-on-one","pricing.inc3p":"Buong oras ay sa'yo, sa bilis mo.",
    "pricing.faq.h2":"Mga tanong sa bayad",
    "pricing.q1":"Paano magbayad?","pricing.a1":"Tumatanggap kami ng cash, Venmo, Cash App, at Zelle. [Kumpirmahin ang tinatanggap na paraan ng bayad bago i-publish.]",
    "pricing.q2":"Kailan magbabayad?","pricing.a2":"Kada lesson, magbabayad sa dulo ng session. Ang package ay bayad muna, tapos ische-schedule ang oras kung kailan bagay sa'yo.",
    "pricing.q3":"Pwede bang magsimula sa trial lesson?","pricing.a3":"Oo. Ang $30 na trial lesson ang pinakamagandang simula. Isang oras, para sa first-timer lang, isa kada tao.",
    "pricing.q4":"Kailangan ko ba muna ng permit?","pricing.a4":"Hindi para sa praktis sa pribadong parking lot. Kakailanganin mo ng Missouri instruction permit bago mag-drive sa pampublikong kalye. Tingnan ang Gabay sa permit.",

    "permit.title":"Gabay sa Missouri permit · Northland Driving",
    "permit.eyebrow":"Gabay sa Missouri permit","permit.h1":"Paano kunin ang iyong Missouri permit.","permit.lead":"Bago mag-praktis sa pampublikong kalsada, kailangan ng Missouri ang instruction permit. Eto ang proseso, at tutulungan ka naming mag-aral para sa test.",
    "permit.notice":"Nagbabago ang batas. Ni-check namin ito sa Missouri Department of Revenue (DOR), pero laging kumpirmahin ang kasalukuyang rules sa opisyal na links sa ibaba bago ka pumunta.",
    "permit.steps.h2":"Ang proseso, hakbang-hakbang",
    "permit.st1.t":"Mag-aral at pumasa sa tatlong test","permit.st1.p":"Mata, road signs at written knowledge, sa isang Missouri State Highway Patrol (MSHP) driver examination station. Hindi ang DOR ang nagbibigay ng test.",
    "permit.st2.t":"Dalhin ang record sa DOR","permit.st2.p":"Dalhin ang iyong Driver Examination Record sa isang Missouri DOR license office.",
    "permit.st3.t":"Dalhin ang mga dokumento","permit.st3.p":"Identity at legal status, Social Security number, at patunay ng paninirahan sa Missouri. Ang REAL ID permit ay kailangan ng dalawang patunay ng address.",
    "permit.st4.t":"Bayaran ang fee","permit.st4.p":"Ang Class F instruction permit ay $10.00 sa kabuuan. Valid ng 12 buwan at pwedeng i-renew.",
    "permit.facts.h2":"Mga dapat malaman",
    "permit.f1.t":"Sino ang kailangan ng permit","permit.f1a":"Sinumang first-time driver na walang valid na lisensya mula sa ibang U.S. state, <b>kasama ang mga adult na 18 pataas.</b>","permit.f1b":"Ang minimum age ay 15. <b>Walang maximum age.</b>","permit.f1c":"Ang mga wala pang 18 ay kailangan ng pirma ng magulang o guardian.",
    "permit.f2.t":"Sa permit, pwede kang","permit.f2a":"Laging mag-drive na may qualified na lisensyadong driver sa harap na upuan.","permit.f2b":"Kung 16 pataas, ang kasama ay dapat 21 taon pataas.","permit.f2c":"Lahat sa kotse ay dapat naka-seat belt.",
    "permit.f3.t":"Adult 18+ (karamihan)","permit.f3a":"Diretso mula permit → praktis → driving test sa MSHP → lisensya sa DOR.","permit.f3b":"Hindi kailangan ng driver education kung 18 pataas ka.","permit.f3c":"Bisa: 18–20 → 3 taon; 21–69 → 6 taon.",
    "permit.f4.t":"Wala pang 18 (GDL steps)","permit.f4a":"Hawakan ang permit ng 182 araw at mag-log ng 40 oras na supervised, kasama ang 10 oras sa gabi.","permit.f4b":"Tapos Intermediate License ($5, valid 2 taon).","permit.f4c":"Curfew na 1 hanggang 5 a.m. at limitasyon sa pasahero.",
    "permit.links.h":"Mga opisyal na link",
    "permit.l1":"Presyo at bisa ng permit (DOR)","permit.l2":"Graduated Driver License (DOR)","permit.l3":"GDL FAQ (DOR)","permit.l4":"Listahan ng dokumento (DOR)","permit.l5":"Driver Guide (PDF)","permit.l6":"Test stations (MSHP)",
    "permit.band.h2":"Nag-aaral para sa written test?","permit.band.p":"Maituturo namin ang libreng practice tests at tutulungan kang maging handa sa lesson.",

    "contact.title":"Kontak · Northland Driving",
    "contact.eyebrow":"Kontak","contact.h1":"Mag-book ng lesson.","contact.lead":"Ilagay ang pangalan at email mo at magbubukas kami ng mensaheng handa nang i-send. Pwede ka ring mag-email nang diretso anumang oras.",
    "contact.f.name":"Pangalan mo","contact.f.namePh":"First name","contact.f.email":"Email mo","contact.f.emailPh":"email@halimbawa.com","contact.f.opt":"Ano ang gusto mo","contact.f.note":"Mensahe (opsyonal)","contact.f.notePh":"Sabihin mo kaunti tungkol sa karanasan mo sa pag-drive.",
    "contact.opt1":"$30 na trial lesson","contact.opt2":"Per-hour lesson ($45)","contact.opt3":"6-oras na package ($250)","contact.opt4":"May tanong lang ako",
    "contact.send":"Buksan ang email","contact.fine":"Bubuksan nito ang email app mo na may handang mensahe. Walang spam kailanman.",
    "contact.reach.h":"Iba pang paraan","contact.reach.email":"Mag-email sa amin","contact.reach.area":"Serbisyong lugar","contact.reach.areaVal":"Gladstone at KC Northland","contact.reach.hours":"Oras","contact.reach.hoursVal":"Flexible, ayon sa schedule mo"
  }
};

(function(){
  "use strict";
  var $=function(s,c){return (c||document).querySelector(s);};
  var $$=function(s,c){return Array.prototype.slice.call((c||document).querySelectorAll(s));};

  /* set email display + links */
  $$("[data-email-display]").forEach(function(el){ el.textContent = window.ND_EMAIL; });
  $$("[data-email-link]").forEach(function(el){ el.setAttribute("href","mailto:"+window.ND_EMAIL); });

  /* ---- capture English source ---- */
  var EN={}, ENP={};
  $$("[data-i18n]").forEach(function(el){var k=el.getAttribute("data-i18n"); if(!(k in EN)) EN[k]=el.innerHTML;});
  $$("[data-i18n-ph]").forEach(function(el){var k=el.getAttribute("data-i18n-ph"); if(!(k in ENP)) ENP[k]=el.getAttribute("placeholder")||"";});
  var current="en";

  function apply(lang){
    current=lang;
    var d = lang==="en" ? null : (window.ND_DICT[lang]||{});
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
    $$(".lang button").forEach(function(b){b.setAttribute("aria-pressed", b.getAttribute("data-lang")===lang?"true":"false");});
    $$(".qa[aria-expanded='true']").forEach(function(qa){var a=$(".ans",qa); a.style.maxHeight=a.scrollHeight+"px";});
    try{localStorage.setItem("nd_lang",lang);}catch(e){}
  }

  $$(".lang button").forEach(function(b){b.addEventListener("click",function(){apply(b.getAttribute("data-lang"));});});
  var saved=null; try{saved=localStorage.getItem("nd_lang");}catch(e){}
  if(saved==="es"||saved==="tl") apply(saved);

  /* ---- sticky header state ---- */
  var header=$("#siteHeader");
  if(header){
    var stick=function(){header.classList.toggle("is-stuck", window.scrollY>6);};
    stick(); window.addEventListener("scroll",stick,{passive:true});
  }

  /* ---- mobile nav ---- */
  var toggle=$("#navToggle"), nav=$("#mainNav");
  if(toggle&&nav){
    toggle.addEventListener("click",function(){
      var open=nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded",open?"true":"false");
    });
    $$("a",nav).forEach(function(a){a.addEventListener("click",function(){nav.classList.remove("open");toggle.setAttribute("aria-expanded","false");});});
  }

  /* ---- FAQ ---- */
  $$(".qa").forEach(function(qa){
    var btn=$("button",qa), ans=$(".ans",qa);
    if(!btn||!ans) return;
    btn.addEventListener("click",function(){
      var open=qa.getAttribute("aria-expanded")==="true";
      qa.setAttribute("aria-expanded",open?"false":"true");
      ans.style.maxHeight=open?"0px":ans.scrollHeight+"px";
    });
  });

  /* ---- reveal ---- */
  var reduce=window.matchMedia("(prefers-reduced-motion:reduce)").matches;
  var items=$$(".reveal");
  if("IntersectionObserver" in window && !reduce){
    var io=new IntersectionObserver(function(ents){
      ents.forEach(function(e){ if(e.isIntersecting){e.target.classList.add("in");io.unobserve(e.target);} });
    },{rootMargin:"0px 0px -8% 0px",threshold:0.06});
    items.forEach(function(el){io.observe(el);});
  } else { items.forEach(function(el){el.classList.add("in");}); }

  /* ---- booking -> email ---- */
  var sendBtn=$("#bookSend");
  if(sendBtn){
    var build=function(){
      var name=($("#bkName")&&$("#bkName").value||"").trim();
      var from=($("#bkEmail")&&$("#bkEmail").value||"").trim();
      var optEl=$("#bkOption"); var opt=optEl?optEl.options[optEl.selectedIndex].text:"";
      var note=($("#bkNote")&&$("#bkNote").value||"").trim();
      var subj={en:"Lesson enquiry — Northland Driving",
                es:"Consulta de clase — Northland Driving",
                tl:"Tanong sa lesson — Northland Driving"}[current];
      var greet={en:"Hi Northland Driving, I'd like to book a driving lesson.",
                 es:"Hola Northland Driving, me gustaría reservar una clase de manejo.",
                 tl:"Hi Northland Driving, gusto ko sanang mag-book ng driving lesson."}[current];
      var L={en:{n:"Name: ",o:"Interested in: ",e:"Email: ",note:"Note: "},
             es:{n:"Nombre: ",o:"Me interesa: ",e:"Correo: ",note:"Nota: "},
             tl:{n:"Pangalan: ",o:"Interesado sa: ",e:"Email: ",note:"Note: "}}[current];
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
