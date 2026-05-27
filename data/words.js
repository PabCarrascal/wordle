// All words are lowercase ASCII, no accents. Exactly 5 letters.
// ANSWER_WORDS: words that can be the answer. Fixed order = schedule of daily words.
// VALID_WORDS: additional words accepted as guesses but never chosen as answers.

window.ANSWER_WORDS = [
  // A
  "abeja","abono","abrir","acera","acero","acosa","actor","agrio","aguda","agudo",
  "aguja","ahora","ajena","ajeno","alega","aleta","algas","aliso","almas","altar",
  "alzar","amena","ameno","amiga","amigo","ancla","andar","angel","animo","ansia",
  "antro","apoya","arbol","ardid","arder","ardor","arena","argot","arido","armas",
  "armar","aroma","arpon","arroz","artes","asado","asear","asilo","asomo","astro",
  "ataud","atajo","atras","audio","autor","avena","avion","aviso","ayuda","azada",
  "azote","albor","aloja","ambos","anima","arado","ataca","avaro",
  // B
  "bache","baile","banco","bando","barba","barca","barra","basto","beber","bicho",
  "bingo","bizco","blusa","bolsa","bomba","brazo","breve","bruja","buche","bueno",
  "bufon","burro","busca","besar","bilis","bolso","boton","broma","bucle","babor",
  "faena","falda","farol","favor","fecha","femur","feroz","fibra","fideo","fiero",
  "fijar","fisco","flaco","fleco","flota","flojo","flujo","fobia","fogon","folio",
  "fondo","forma","forja","forro","fosil","foton","freno","friso","fruta","fuego",
  "fugaz","fumar","fusil","finca","firma",
  // C
  "cabra","cacto","cajon","calma","calor","calva","calle","campo","canal","canas",
  "capaz","cariz","cargo","carne","carta","carpa","carro","casas","casco","casta",
  "causa","cavar","ceder","celda","cenar","censo","cerca","cerdo","cerco","cerro",
  "cesto","chico","chile","chivo","choza","ciclo","cielo","cifra","cinco","cirio",
  "cisne","claro","cloro","cobre","cobro","coche","colmo","comba","copia","coral",
  "corte","corto","corzo","coser","costa","coste","crear","crema","crudo","cruel",
  "cuajo","cuero","cueva","culpa","culto","curva","celta","censo",
  // D
  "danza","datos","debut","decir","delta","denso","densa","deseo","deuda","dicha",
  "dique","disco","dolor","domar","dosis","droga","ducha","duelo","dulce","dudar",
  // E
  "ebano","echar","enero","enano","enojo","entre","envio","epoca","error","espia",
  "etapa","extra","emite",
  // F — already merged above
  // G
  "galgo","gallo","gamba","ganas","garbo","garra","garza","gasto","gemir","genio",
  "gesto","globo","golfo","golpe","gordo","gorra","gotas","graba","grado","gramo",
  "grano","grasa","grava","gripe","grupo","guapo","guano","gubia","guisa","gusto",
  "grajo",
  // H
  "hacer","hacia","harto","hielo","higos","hongo","honor","hogar","horca","horno",
  "hosco","hueso","huevo","humor","hurto",
  // I
  "icono","idear","igual","ileso","imago","impar","indio","infra","islam",
  // J
  "jabon","jalea","jamon","jarra","jaula","jiron","joven","juega","juego","jugar",
  "judia","justo","junto","jalon",
  // L
  "labio","labor","lacio","laico","largo","larva","lavar","leche","lecho","lejia",
  "lento","letra","libra","libre","liceo","licor","limon","lince","lindo","linea",
  "lirio","litio","llama","llano","lleno","locos","logro","lonja","lucha","lugar",
  "lunar","lumen",
  // M
  "madre","magia","manco","mango","manso","manos","marca","marco","marzo","matar",
  "matiz","mayor","media","mejor","menor","mente","metro","miedo","minar","mitad",
  "molde","monta","monte","morir","morbo","motor","mojar","monje","mosca","mujer",
  "multa","mundo","muslo","mucho",
  // N
  "naipe","narco","nariz","narra","natal","negro","nieto","nivel","norma","norte",
  "novia","novio","nueve",
  // O
  "obrar","ocaso","ojera","omega","opaco","orden","oreja","oruga","oveja","ovulo",
  // P
  "padre","pagar","peine","perro","pesar","picar","piojo","pista","plaga","plano",
  "plaza","plomo","poder","polvo","pompa","poner","porra","poste","presa","primo",
  "prisa","puedo","punta","punto",
  // Q
  "queja","quema","quien","quinta",
  // R
  "radio","rabia","rampa","rapaz","rasgo","raton","razon","recio","recta","reina",
  "reloj","reino","renta","rigor","rinon","ritmo","rizar","roble","rocio","rodeo",
  "rogar","rombo","ronco","rosca","rozar","rubio","rueda","rugir","ruido","rumba",
  "rumbo",
  // S
  "sacar","salsa","salto","salud","salvo","samba","sarna","sauce","selva","senda",
  "senal","senor","sidra","siglo","sirva","sobra","socio","solar","sonar","soplo",
  "sordo","sorbo","sucio","suelo","suero","sumar","surco","sutil",
  // T
  "tabla","talco","tallo","tango","tapiz","tapon","tarde","tarro","tecla","techo",
  "temer","temor","tener","tenso","tenaz","terco","termo","tigre","tilde","timar",
  "timon","tinto","tocar","toldo","tomar","tonto","torpe","torso","tramo","trama",
  "trapo","trece","treta","trigo","tripa","trono","tumba","tumor","turba","turco",
  // U
  "ultra","union","urdir","usado","usual","utero",
  // V
  "vacio","valor","vapor","vasco","velar","vello","venas","venda","venir","venta",
  "verde","verso","viejo","vigor","virar","virgo","virus","vista","vivir","vocal",
  "vuelo","vulgo",
  // Y
  "yarda","yermo","yerno","yesca","yunta",
  // Z
  "zarza","zurdo",
  // Extra common words
  "calco","calma","campo","capen","capaz","carta","casco","causa","cebar","celda",
  "cerco","chico","cifra","circo","clavo","cofia","coger","colmo","colon","combo",
  "compa","conde","cormo","cormo","cosmo","coxal","cruza","cuajo","cuajo",
  "dardo","dedal","degra","delta","denso","depre","derbi","diodo","dirge","disco",
  "divan","doble","dogma","drone","duque",
  "echar","edema","egida","ellas","ellos","elude","emite","empal","enano","espía",
  "fallo","fanon","fasto","flojo","folga","fonos","foste","fugaz",
  "garbo","garza","gatos","giros","glosa","gnomo","gorge","gozar","grelo","greve",
  "halgo","hampo","harpa","helar","herbo","hinco","hipso","hobos","holgo","hurto",
  "icara","idear","igneo","imago","inane","incas","infer","infra","inter","intra",
  "intro",
  "jacal","japon","jarabe","jiron","judas","jubon","judio",
  "labio","lampo","lapso","lebia","legua","leito","lemon","leona","lesto","letra",
  "libar","limbo","linfa","litar","litro","livio","lloro","lobos","lonja","lucio",
  "lumbo","lurex",
  "macho","malva","mambo","manto","matojo","mazos","melca","melon","melva","menar",
  "merma","mesna","mezon","mirlo","moble","mocio","molde","moler","molsa","molzo",
  "monjo","monol","montano","morbo","morsa","motos","mudez",
  "nansa","nauta","nebla","nefas","negro","nerva","nervo","nidal","nidio","nimbo",
  "ninfo","nitos","noble","nopal","norco","norma","notro","novio",
  "obice","obito","obras","ocote","ofita","oiran","ojear","ojete","oliva","olivo",
  "ollar","omate","omiso","onoto","opimo","orbea","orgon","oriol","orion","orujo",
  "oscio",
  "pacos","padro","palco","pando","pango","pante","panza","papon","pardo","pargo",
  "parmo","parra","pasmo","pauta","pebra","peche","pecio","pecho","pedal","pelma",
  "pelmo","penal","peral","perla","perno","petro","piano","picar","picor","pilaf",
  "pilma","pinar","pinza","piojo","pipas","pique","piton","pizan","pizza","plata",
  "playa","plena","pleno","plomo","polar","polca","polea","pompa","pormo","porta",
  "potro","prela","premo","prion","proto","pruno","pubis","puedo","pulga","pulpo",
  "pulsar",
  "quimo","quino","quion",
  "ramal","randa","rapso","raspa","ravia","recia","recua","redis","refle","regia",
  "regio","relva","remas","repro","resma","retel","retos","reuma","rezan","risco",
  "rizar","rodar","ronza","ropas","rosco","roseo","rozna","ruano","ruche","rufio",
  "rungo",
  "sabio","sagaz","saiga","salce","salmo","salon","salpa","salvo","sanbo","sangre",
  "sarco","sastre","satén","sauce","sauna","secos","secua","senso","senta","serio",
  "sigla","silbo","silfa","silex","sinco","sitio","sobre","sodio","solaz","soldo",
  "solin","solio","solzo","somos","sorba","sorna","sorzo","sotol","suabo","subir",
  "surca","surta",
  "tache","tafia","tajin","tamiz","tapon","tapso","tarco","tecno","tejon","telmo",
  "terma","terso","tesla","tetro","tiara","tifon","timar","timba","timol","tiner",
  "tiron","tizna","tocho","torva","tosto","totem","torze","trago","trapo","traza",
  "trebo","trece","tress","trice","trigo","trino","trise","triso","trito","trocar",
  "troco","troja","trole","trovar","trovo","truco","trufa","tuber","tubos","tucon",
  "turbo",
  "ubico","untar","urano","urdir","usaba","usias",
  "vacar","vacos","vaina","valer","valsa","vambi","varón","vedar","veiga","velar",
  "venco","verbo","verge","veros","vetar","vibra","victo","viejo","vinco","viren",
  "virgo","viril","viron","virto","visar","visir","vison","viton","vocal","vocar",
  "voraz","vulva",
  "yacen","yacer","yanqui","yerba","yodio","yogur",
  "zafio","zafra","zaino","zambo","zanco","zanco","zapor","zarpa","zonas","zotal",
  "zumba","zumbo","zumar"
];

// Deduplicate
window.ANSWER_WORDS = [...new Set(window.ANSWER_WORDS)].filter(w => w.length === 5);

// Additional valid guesses (unusual words not chosen as answers)
window.VALID_WORDS = [
  "abaco","abase","abate","abibe","abiso","abjad","abona","abord","abota","abraz",
  "abren","abres","abrid","abrio","abris","absit","absor","abuba","abuje","abune",
  "acabe","acabi","acacho","acais","acaja","acalo","acame","acapo","acaro","acate",
  "acato","acaua","accio","acebo","acedo","acela","acelo","acena","aceno","acens",
  "acepa","acepo","aceta","acezo","acias","acibe","acida","acido","acies","acima",
  "acimo","acino","acipe","acire","acirn","acnea","acnes","acoba","acoco","acoda",
  "acola","acolo","acome","acona","acone","aconz","acopa","acopi","acopl","acora",
  "acord","acori","acorn","acosar","acote","acoto","acovi","acoya","acras","acrea",
  "acreb","acreo","acres","acria","acrib","acroe","acroj","acros","actea",
  "adaza","adeca","adeco","adela","adelo","ademe","adena","adeno","adeon","aderc",
  "aderm","adeta","adeva","adevo","adibe","adica","adico","adida","adiez","adige",
  "adiro","adise","adiso","adjal","adjes","admen","admon","adnon","adoca","adoco",
  "adoja","adola","adolo","adoma","adona","adono","adopo","adora","adorn","adora",
  "agalb","agamo","agane","agano","agard","agasa","agato","agavi","agaxa","agaza",
  "axila","azimo","azafo","azedo","azeic","azina","azole","azorb","azota","azuer"
];
