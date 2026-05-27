// Palabras en español de 5 letras, sin tildes, minúsculas.
//
// ANSWER_WORDS → pueden ser la palabra del día.
//   Criterio: palabras que cualquier hispanohablante adulto reconoce.
//   ~750 palabras curadas: sustantivos comunes, adjetivos frecuentes,
//   verbos en infinitivo o forma base, nombres de animales/comida/naturaleza.
//
// VALID_WORDS → se aceptan como intento pero NUNCA serán respuesta.
//   Incluye: conjugaciones verbales poco frecuentes, tecnicismos, regionalismos,
//   términos científicos, palabras muy formales o arcaicas.

window.ANSWER_WORDS = [
  // ── A ────────────────────────────────────────────────────────────────
  "abeja","abono","abrir","abuso","acebo","acera","acero","actor","agave",
  "agria","agrio","aguda","agudo","aguja","ahora","ajena","ajeno","ajuar",
  "alado","alamo","alcon","aldea","aleta","algas","alijo","aliso","almas",
  "altar","alzar","amena","ameno","amiga","amigo","ancla","andar","angel",
  "anima","animo","ansia","antro","apodo","apoya","apuro","arbol","ardid",
  "arder","ardor","arena","argot","arido","armas","armar","aroma","arpon",
  "arroz","artes","asado","asear","asilo","asomo","astro","ataud","atajo",
  "atras","audio","autor","avara","avaro","avena","avion","aviso","ayuda",
  "azada","azote","albor","arado","ataca","acabo","ahoga","amago","aspid",
  "aloja","ambos","alero",
  // ── B ────────────────────────────────────────────────────────────────
  "babor","bache","bahia","baile","balsa","banco","bando","barba","barca",
  "barco","barro","basto","bazar","beber","bella","bello","besar","bicho",
  "bilis","bingo","bizco","blusa","bocio","bolsa","bolso","bomba","bordo",
  "boton","bravo","brazo","breve","brisa","broma","bruja","bruto","buche",
  "buena","bueno","bufon","bucle","burdo","burla","burro","busca","brava",
  "braza",
  // ── C ────────────────────────────────────────────────────────────────
  "cabal","cabra","cacto","cajon","calco","caliz","calma","calor","calva",
  "calvo","calle","campo","canal","canas","canto","caoba","capon","capaz",
  "cariz","cargo","carne","carta","carpa","carro","caspa","casco","casta",
  "casto","causa","cavar","ceder","celda","celos","cenar","censo","cerca",
  "cerdo","cerco","cerro","cesta","cesto","chapa","chico","chile","chivo",
  "chopo","choza","ciclo","cielo","ciego","cieno","cifra","cinco","cirio",
  "civil","cisne","claro","clavo","cloro","cofia","cobra","cobro","coche",
  "colmo","color","comba","comun","copia","coral","corro","corte","corto",
  "corva","corzo","coser","costa","coste","crear","crema","cruce","crudo",
  "cruel","cruza","cuajo","cuero","cueva","culpa","culto","cuota","curva",
  "curvo","coger",
  // ── D ────────────────────────────────────────────────────────────────
  "danta","danza","datos","datil","debut","decir","delta","denso","densa",
  "depre","derbi","deseo","deuda","dicha","dicho","digno","dique","disco",
  "doble","docil","dogma","dolor","domar","dosis","droga","ducha","duelo",
  "dulce","dudar","dunas","duque",
  // ── E ────────────────────────────────────────────────────────────────
  "ebano","ebrio","echar","edema","enero","enano","enojo","entre","envio",
  "epoca","erizo","error","espia","etapa","extra","estio",
  // ── F ────────────────────────────────────────────────────────────────
  "faena","falda","falso","farsa","fauna","favor","fecha","femur","feroz",
  "fibra","ficha","fideo","fiero","fijar","finca","firma","fisco","flema",
  "fleco","floja","flojo","flora","flota","flujo","fobia","fogon","folio",
  "fondo","forma","forja","forro","fosil","foton","frago","freno","fresa",
  "friso","fruta","fuego","fuero","fugaz","fumar","funda","furia","fusil",
  // ── G ────────────────────────────────────────────────────────────────
  "galgo","gallo","galon","gamba","ganso","garbo","garra","garza","gatos",
  "gasto","gemir","genio","gesta","gesto","gleba","globo","glosa","gnomo",
  "golfo","golpe","gordo","gorra","gotas","graba","grado","gramo","grano",
  "grasa","grava","grelo","gripe","grajo","grumo","grupo","guapo","guano",
  "gubia","guion","guisa","guiso","gusto",
  // ── H ────────────────────────────────────────────────────────────────
  "habas","hacha","hampa","hacer","hacia","harto","hebra","hielo","hiena",
  "higos","himen","hondo","honda","hongo","honor","hogar","horca","horma",
  "horno","hosco","hueco","hueso","huevo","humor","hurto",
  // ── I ────────────────────────────────────────────────────────────────
  "icono","idear","igneo","igual","ileso","imago","impar","inane","indio",
  "infra","islam",
  // ── J ────────────────────────────────────────────────────────────────
  "jabon","jalea","jamon","jarra","jaula","jiron","joven","juega","juego",
  "jugar","judia","justo","junto","jubon","jalon",
  // ── L ────────────────────────────────────────────────────────────────
  "labio","labor","lacio","lacre","laico","lampa","lapso","lasca","lavar",
  "legua","leche","lecho","lejia","lento","letra","leona","libra","libre",
  "liceo","licor","limon","limbo","lince","lindo","linea","linfa","lirio",
  "litio","litro","llama","llana","llano","llena","lleno","locos","lobos",
  "logro","lonja","lucha","lucio","lugar","lunar","lumen","lupus",
  // ── M ────────────────────────────────────────────────────────────────
  "macho","madre","magro","malva","mambo","mango","manta","manos","marca",
  "marco","marta","matiz","melon","merma","metro","miedo","minar","mirlo",
  "mitad","mixto","molde","monta","monte","morir","morbo","morsa","motor",
  "mojar","monje","mosca","muela","murga","mujer","multa","mundo","musgo",
  "muslo","mucho",
  // ── N ────────────────────────────────────────────────────────────────
  "naipe","narco","nariz","narra","natal","negro","nicho","nieto","nieve",
  "nivel","nimbo","noble","nopal","norma","norte","novia","novio","nubes",
  "nueve",
  // ── O ────────────────────────────────────────────────────────────────
  "oasis","obeso","obice","obrar","ocaso","ojera","oliva","omega","ondas",
  "opaco","opimo","orden","oreja","oruga","orujo","oveja","ovulo",
  // ── P ────────────────────────────────────────────────────────────────
  "padre","pagar","palco","palma","panda","panza","pardo","parra","pasta",
  "pasto","pauta","pecho","pedal","pella","pelma","penal","peine","peral",
  "perla","perno","perro","pesar","pesca","piano","picar","pilar","pinar",
  "pinza","piojo","piton","pizza","pista","plaga","plano","plaza","playa",
  "plena","pleno","pluma","plomo","polar","polca","polea","poder","pollo",
  "polvo","pompa","poner","porra","poste","potro","prado","presa","primo",
  "prisa","pubis","puedo","pulga","pulpa","pulpo","pulso","punta","punto",
  // ── Q ────────────────────────────────────────────────────────────────
  "queja","quema","quien","quinta",
  // ── R ────────────────────────────────────────────────────────────────
  "rabia","rampa","ramal","ramos","rapaz","rasgo","raspa","raton","razon",
  "recio","recta","regio","reina","reloj","reino","renta","reojo","resma",
  "rigor","rinon","risco","ritmo","rival","rizar","roble","rocas","rocio",
  "rodeo","rogar","rombo","ronco","rosca","rozar","rubio","rueda","rugir",
  "ruido","rumba","rumbo",
  // ── S ────────────────────────────────────────────────────────────────
  "sabio","sagaz","sacar","salce","salon","salsa","salto","salud","salvo",
  "samba","sarna","sauna","sauce","selva","senda","senal","senor","setas",
  "serio","sidra","sigla","siglo","silbo","sirva","sitio","sobre","sobra",
  "socio","sodio","solar","solaz","sonar","soplo","sorna","sordo","sorbo",
  "subir","sucio","suelo","suero","sumar","surca","surco","sutil",
  // ── T ────────────────────────────────────────────────────────────────
  "tabla","taiga","talco","tallo","talud","tamiz","tango","talon","tapiz",
  "tapon","tarde","tarro","tecla","techo","tecno","tejon","temer","temor",
  "tener","tenso","tenaz","terco","terso","termo","tiara","tifon","tigre",
  "tilde","timba","timar","timon","tinto","tiron","tizna","tocar","toldo",
  "tomar","tonto","tordo","torpe","torso","torva","totem","trago","tramo",
  "trama","trapo","traza","trece","treta","trigo","trino","tripa","trono",
  "truco","trufa","tumba","tumor","turba","turco",
  // ── U ────────────────────────────────────────────────────────────────
  "ultra","union","untar","urano","urdir","usado","usual","utero","ufano",
  // ── V ────────────────────────────────────────────────────────────────
  "vacio","vaina","valor","vapor","vasco","vedar","velar","vello","venas",
  "venda","venir","venta","verde","verbo","verso","viejo","vigor","villa",
  "virar","visor","virgo","virus","vista","vivir","vocal","voraz","vuelo",
  "vulgo","vulva","vodka",
  // ── Y ────────────────────────────────────────────────────────────────
  "yacer","yarda","yerba","yermo","yerno","yesca","yogur","yunta",
  // ── Z ────────────────────────────────────────────────────────────────
  "zafio","zafra","zaino","zambo","zanco","zarpa","zarza","zonas","zumba",
  "zurdo","zorra","zorro",
];

// Palabras válidas como intento pero que nunca serán la respuesta del día:
// conjugaciones poco frecuentes, tecnicismos, arcaísmos, regionalismos.
window.VALID_WORDS = [
  // Conjugaciones y formas verbales no-infinitivo
  "aboga","acaba","acoge","actua","agita","agota","ahoga","alega","aloja",
  "amaga","apoya","ataca","avisa","busca","canta","cobra","copia","corra",
  "cruza","duela","emite","enoja","escapa","forma","gasta","guisa","habla",
  "impor","jalea","labra","llora","manda","mueve","niega","ocupa","omite",
  "pague","plega","llama","quite","rinde","salga","siege","tenga","traba",
  "urge","venga","vuela","zumba",
  // Formas adjetivales o plurales poco usados como base
  "ácida","acida","acido","aguda","airon","alcon","algal","alada","aspid",
  "boron","braza","calvo","caspa","ciego","clavo","corva","cruza","depre",
  "diodo","docil","dolce","doble","ebria","ebrio","edema","espia","estio",
  "fatua","fatuo","ferri","flema","flora","flujo","fogon","frago","fuero",
  "gleba","glosa","gnomo","grumo","guano","gubia","hampa","hebra","himen",
  "igneo","imago","inane","infra","irate","jacal","lampa","lapso","lasca",
  "legua","lejia","limbo","linfa","litio","litro","lucio","lupus","magro",
  "mambo","merma","mixto","morsa","muela","murga","musgo","nimbo","nopal",
  "obeso","obice","obito","ojear","ojete","opimo","orujo","ovulo","pedal",
  "pella","pelma","pernal","piano","pilar","piton","plena","pleno","polar",
  "polca","polea","potro","pubis","pulga","pulpa","pulpo","regio","reojo",
  "resma","risco","rival","rigor","roble","sagaz","salce","sigla","silbo",
  "sitio","sobra","sodio","solaz","sorna","sorbo","subir","surca","taiga",
  "talud","tiara","tifon","timba","tiron","tizna","tordo","torva","totem",
  "traza","trino","truco","trufa","ufano","ultra","urano","vedar","visor",
  "vulva","yacer","zafra","zaino","zambo","zarpa",
  // Tecnicismos y vocabulario especializado
  "abeto","acana","acedo","acida","agave","ajuar","alijo","albor","alero",
  "alfil","alcon","aldea","alamo","alado","ambar","ancla","ardon","ardid",
  "argot","aspid","ataud","audio","avara","avaro","azada","babor","balsa",
  "bazar","bordo","braza","buche","bufon","burdo","cabal","calco","caliz",
  "caoba","capon","cariz","caspa","casto","celda","celos","censo","cerco",
  "cesta","chapa","chopo","cieno","civil","clavo","cobra","cobro","colmo",
  "comba","corro","corva","corzo","cofia","cruza","cuajo","cuota","curvo",
  "danta","datil","debut","depre","derbi","dique","docil","dogma","duque",
  "ebano","ebrio","edema","erizo","estio","farsa","fauna","femur","fibra",
  "ficha","fisco","flema","fobia","fogon","folio","forja","fosil","foton",
  "frago","fresa","fuero","funda","furia","fusil","galgo","galon","garbo",
  "gesta","gleba","gnomo","grumo","guano","gubia","guion","guisa","hampa",
  "hebra","himen","honda","horma","hueco","imago","impar","inane","islam",
  "jalon","jiron","jubon","lacre","lampa","lapso","lasca","legua","lejia",
  "leona","libra","limbo","linfa","litio","litro","lobos","lonja","lucio",
  "lumen","lupus","malva","mambo","merma","mirlo","mixto","morsa","muela",
  "murga","musgo","nimbo","nopal","obeso","obice","ojera","oliva","opimo",
  "orujo","ovulo","palco","panza","parda","parro","pauta","pedal","pella",
  "pelma","penal","peral","perno","pilar","pinar","pinza","piton","pizza",
  "plena","pleno","polar","polca","polea","potro","pubis","pulga","pulpa",
  "pulpo","pulso","ramal","resma","reojo","risco","rival","roble","sagaz",
  "salce","sigla","silbo","sodio","solaz","sorna","sorbo","surca","taiga",
  "talud","tiara","tifon","timba","tiron","tizna","tordo","torva","totem",
  "traza","trino","truco","trufa","ufano","urano","visor","vulva","yacer",
  "zafra","zaino","zambo","zarpa",
  // Palabras coloquiales o de uso regional
  "bocio","burla","chapa","colmo","comun","corro","depre","derbi","farsa",
  "floja","flojo","grelo","gubia","hampa","himen","lacre","lampa","lapso",
  "lasca","legua","lejia","limbo","linfa","litio","litro","lucio","magro",
  "murga","nimbo","nopal","obeso","obice","orujo","ovulo","pedal","pella",
  "pelma","piano","pilar","polar","polca","polea","pubis","pulga","reojo",
  "resma","risco","rival","sagaz","salce","sigla","silbo","sodio","solaz",
  "sorna","sorbo","taiga","talud","tiara","tifon","timba","tiron","tizna",
  "tordo","torva","totem","traza","trino","truco","trufa","ufano","urano",
  "visor","vulva","yacer","zafra","zaino","zambo","zarpa",
];

// Deduplicar, filtrar, y verificar longitud exacta de 5 letras
window.ANSWER_WORDS = [...new Set(window.ANSWER_WORDS)].filter(w => /^[a-z]{5}$/.test(w));
window.VALID_WORDS   = [...new Set(window.VALID_WORDS)].filter(w => /^[a-z]{5}$/.test(w));

// Eliminar de VALID_WORDS cualquier palabra que ya esté en ANSWER_WORDS
const answerSet = new Set(window.ANSWER_WORDS);
window.VALID_WORDS = window.VALID_WORDS.filter(w => !answerSet.has(w));
