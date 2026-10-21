"use strict";
/* Original fan-game story structure; fixed enemy strength, player may delay battles. */
const DBData={
world:{width:3840,height:2160,start:{x:820,y:1450},image:"./assets/earth-4k.svg"},
places:[
{id:"home",name:"Dom Goku",sub:"Początek podróży • odpoczynek",x:820,y:1450,type:"home",icon:"⌂",level:"1–3"},
{id:"west",name:"Las Zachodni",sub:"Dzika przyroda i wojownicy",x:520,y:650,type:"forest",icon:"♠",level:"1–4"},
{id:"village",name:"Wioska Południowa",sub:"Sklepy i poboczne zlecenia",x:580,y:1770,type:"village",icon:"⌂",level:"1–4"},
{id:"city",name:"Miasto Centralne",sub:"Capsule Corp • handel",x:2220,y:790,type:"city",icon:"◈",level:"3–8"},
{id:"training",name:"Pole Treningowe",sub:"Walka, trening KI i uniki",x:1610,y:1400,type:"training",icon:"⚔",level:"1–7"},
{id:"roshi",name:"Kame House",sub:"Próba Mistrza Roshiego",x:1360,y:1970,type:"mentor",icon:"✦",level:"4+"},
{id:"snake",name:"Droga Węża",sub:"Brama do zaświatów",x:2130,y:340,type:"story",icon:"∞",level:"5+"},
{id:"kai",name:"Planeta Kaio",sub:"Szkolenie u Króla Kaio",x:2470,y:320,type:"mentor",icon:"★",level:"6+"},
{id:"landing",name:"Lądowisko Raditza",sub:"Kapsuła Saiyan",x:2780,y:940,type:"boss",icon:"!",level:"5–7"},
{id:"canyon",name:"Wąwóz Saibamen",sub:"Wrogie jednostki",x:3180,y:1050,type:"boss",icon:"!",level:"8–11"},
{id:"nappa",name:"Krater Nappy",sub:"Pustynia pod ostrzałem",x:3060,y:1520,type:"boss",icon:"!",level:"12–16"},
{id:"vegeta",name:"Szczyt Vegety",sub:"Starcie z księciem Saiyan",x:3460,y:520,type:"boss",icon:"!",level:"18–28"}
],
enemies:{
pig:{name:"Dzik z zachodnich lasów",art:"pig",lv:1,power:110,hp:185,atk:24,def:4,xp:34,coins:26},
bandit:{name:"Zbłąkany wojownik",art:"yamcha",lv:2,power:260,hp:270,atk:36,def:6,xp:50,coins:46},
scout:{name:"Zwiadowca",art:"scout",lv:4,power:470,hp:360,atk:47,def:9,xp:92,coins:63},
saibawild:{name:"Dzikie Saibamen",art:"saiba",lv:6,power:950,hp:540,atk:66,def:14,xp:135,coins:95},
raditz:{name:"Raditz",art:"raditz",lv:5,power:1500,hp:870,atk:84,def:16,xp:520,coins:380,boss:true},
roshi:{name:"Mistrz Roshi",art:"roshi",lv:8,power:2350,hp:1240,atk:95,def:19,xp:470,coins:0,boss:true},
king:{name:"Król Kaio — próba",art:"king",lv:8,power:2600,hp:1310,atk:97,def:20,xp:720,coins:0,boss:true},
saibaboss:{name:"Oddział Saibamen",art:"saiba",lv:10,power:3600,hp:1660,atk:118,def:22,xp:760,coins:480,boss:true},
saibaelite:{name:"Saibamen — elita",art:"saiba",lv:11,power:4400,hp:1880,atk:129,def:29,xp:890,coins:550,boss:true},
nappa:{name:"Nappa",art:"nappa",lv:15,power:7600,hp:2580,atk:156,def:39,xp:1410,coins:920,boss:true},
vegeta:{name:"Vegeta",art:"vegeta",lv:20,power:18000,hp:3600,atk:201,def:54,xp:1970,coins:1250,boss:true},
vegetaKai:{name:"Vegeta — pełna moc",art:"vegeta",lv:23,power:23000,hp:4200,atk:225,def:62,xp:2170,coins:1360,boss:true},
vegetaGalick:{name:"Vegeta — Galick Gun",art:"vegeta",lv:25,power:27000,hp:4600,atk:250,def:66,xp:2410,coins:1400,boss:true},
oozaru:{name:"Vegeta — Oozaru",art:"vegeta",lv:28,power:37000,hp:5800,atk:295,def:79,xp:2900,coins:1600,boss:true},
vegetaFinal:{name:"Vegeta — ostatnia walka",art:"vegeta",lv:26,power:28000,hp:4500,atk:238,def:72,xp:3120,coins:1900,boss:true}
},
chapters:[
{id:"c0",title:"Niespokojny poranek",short:"Trening w domu Goku",at:"home",kind:"talk",minLevel:1,summary:"Goku spotyka dawnych towarzyszy. Wykonaj pierwszy trening.",lines:[["Goku","Coś dziwnego zbliża się do Ziemi. Muszę być gotowy."],["Piccolo","Wybrałem miejsce do sparingu. Przestań tracić czas!"],["Narrator","Twoja podróż zaczyna się w górach i lasach Ziemi."]]},
{id:"c1",title:"Nieznajomy z kosmosu",short:"Zbadaj kapsułę Raditza",at:"landing",kind:"battle",enemy:"raditz",minLevel:5,summary:"Raditz ląduje na Ziemi i ujawnia prawdę o pochodzeniu Goku.",lines:[["Raditz","Kakarotto. Nie pamiętasz nawet własnego imienia?"],["Goku","Nie pozwolę ci skrzywdzić mojej rodziny."],["Piccolo","Współpraca jest naszą jedyną szansą."]]},
{id:"c2",title:"Ofiara wojownika",short:"Finał starcia z Raditzem",at:"landing",kind:"talk",minLevel:5,summary:"Raditz zostaje pokonany kosztem życia Goku. Rozpoczyna się rok przygotowań.",lines:[["Piccolo","Makankosappo! Goku, trzymaj go jeszcze przez chwilę!"],["Goku","Wszyscy... obronimy Ziemię."],["Kami","Czeka cię długa droga. Król Kaio może cię nauczyć nowych technik."]]},
{id:"c3",title:"Droga Węża",short:"Dotrzyj do Króla Kaio",at:"snake",kind:"talk",minLevel:5,summary:"Goku przemierza zaświaty. Przyszła walka wymaga ogromnego treningu.",lines:[["Goku","Ta droga naprawdę nie ma końca!" ],["Narrator","Z każdym krokiem rośnie wytrzymałość bohatera."],["Król Kaio","Jeśli dotrzesz do mnie, może nauczę cię czegoś wyjątkowego!"]]},
{id:"c4",title:"Ciężar grawitacji",short:"Wygraj próbę Króla Kaio",at:"kai",kind:"battle",enemy:"king",minLevel:8,summary:"Szkolenie w grawitacji odblokuje naukę Kaioken.",lines:[["Król Kaio","Najpierw dogoń Bubblesa! Potem sprawdzimy, ile potrafisz."],["Goku","Spróbuję! Tym razem nie odpuszczę."],["Król Kaio","Kontrola Ki jest równie ważna co siła!"]],unlocks:["kaioken"]},
{id:"c5",title:"Przybycie Saiyan",short:"Zbadaj wąwóz Saibamen",at:"canyon",kind:"battle",enemy:"saibaboss",minLevel:10,summary:"Nappa i Vegeta docierają na Ziemię. Wojownicy Z walczą ze stworzeniami Saibamen.",lines:[["Krillin","Nie sądzę, żeby walka była łatwa."],["Nappa","Saibamen! Pokażcie im siłę!" ],["Goku","Wracam na Ziemię. Wytrzymajcie jeszcze!"]]},
{id:"c6",title:"Stracony towarzysz",short:"Pokonaj elitę Saibamen",at:"canyon",kind:"battle",enemy:"saibaelite",minLevel:11,summary:"Zagrożenie rośnie, a walka zbiera tragiczne żniwo.",lines:[["Yamcha","Pozwólcie mi się tym zająć!" ],["Narrator","Niespodziewana eksplozja Saibamena zmienia bieg walki."],["Krillin","Nie pozwolimy im wygrać!"]]},
{id:"c7",title:"Gniew Nappy",short:"Powstrzymaj Nappę",at:"nappa",kind:"battle",enemy:"nappa",minLevel:15,summary:"Goku powraca, by zatrzymać brutalnego Saiyanina i ocalić przyjaciół.",lines:[["Nappa","Jeszcze jeden robak chce ze mną walczyć?" ],["Goku","Za krzywdę moich przyjaciół odpowiesz sam."],["Vegeta","Pokaż, na co cię stać, Kakarotto."]]},
{id:"c8",title:"Duma księcia",short:"Zmierz się z Vegetą",at:"vegeta",kind:"battle",enemy:"vegeta",minLevel:20,summary:"Początek pojedynku z księciem Saiyan. Jego poziom nie dopasowuje się do gracza.",lines:[["Vegeta","Nie możesz mnie pokonać. Jestem elitą!" ],["Goku","Zobaczymy, co potrafisz!"],["Vegeta","To dopiero początek!"]]},
{id:"c9",title:"Kaioken razy trzy",short:"Przełam obronę Vegety",at:"vegeta",kind:"battle",enemy:"vegetaKai",minLevel:23,summary:"Ryzykowna technika Kaio pozwala Goku podnieść moc ponad granice.",lines:[["Goku","Kaioken... razy trzy!" ],["Król Kaio","Nie przesadzaj! Twoje ciało tego nie wytrzyma!" ],["Vegeta","Niemożliwe!"]]},
{id:"c10",title:"Galick Gun",short:"Wytrzymaj starcie energii",at:"vegeta",kind:"battle",enemy:"vegetaGalick",minLevel:25,summary:"Galick Gun przeciw Kamehameha. Ziemia drży od zgromadzonej energii.",lines:[["Vegeta","Zniszczę tę planetę razem z tobą!" ],["Goku","Kame... hame... HAAA!" ],["Narrator","Fale energii splatają się nad skalistym kanionem."]]},
{id:"c11",title:"Wielka Małpa",short:"Przetrwaj transformację Vegety",at:"vegeta",kind:"battle",enemy:"oozaru",minLevel:28,summary:"Sztuczny księżyc uruchamia transformację Oozaru. Wróg staje się potężniejszy.",lines:[["Vegeta","Patrz, Kakarotto! Oto siła wielkiego Saiyanina!" ],["Goku","Musimy odciąć mu ogon!" ],["Yajirobe","Niech ktoś zajmie go przez chwilę..."]]},
{id:"c12",title:"Ostatni wysiłek",short:"Powstrzymaj Vegetę",at:"vegeta",kind:"battle",enemy:"vegetaFinal",minLevel:26,summary:"Genki Dama i pomoc przyjaciół rozstrzygają o losach Ziemi.",lines:[["Krillin","To nasza ostatnia szansa!" ],["Gohan","Tato! Nie poddamy się!" ],["Goku","Oszczędźmy go. Chcę spotkać go jeszcze kiedyś."]]},
{id:"c13",title:"Po burzy",short:"Wróć do domu",at:"home",kind:"talk",minLevel:1,summary:"Ziemia ocalała. Otwiera się droga do kolejnej sagi i nowych planet.",lines:[["Narrator","Vegeta opuszcza Ziemię. Dla wojowników zaczyna się nowy rozdział."],["Goku","Muszę jeszcze dużo trenować!"],["Bulma","Być może teraz czas pomyśleć o Namek..."]]}
],
skills:[
{id:"combo",name:"Seria ciosów",category:"Ciosy",ki:0,base:76,learn:1,desc:"Szybki atak fizyczny, buduje combo."},
{id:"ki",name:"Pocisk KI",category:"Ki",ki:10,base:118,learn:1,desc:"Krótki strzał energii."},
{id:"guard",name:"Obrona + regeneracja",category:"Taktyka",ki:0,base:0,learn:1,desc:"Zmniejsza otrzymane obrażenia i odnawia KI."},
{id:"dash",name:"Wielokrotny doskok",category:"Ciosy",ki:16,base:175,learn:4,desc:"Krótka seria teleportów i trafień."},
{id:"wave",name:"Fala KI",category:"Ki",ki:27,base:232,learn:7,desc:"Silniejszy atak energią."},
{id:"meteor",name:"Meteor Combo",category:"Ciosy",ki:36,base:310,learn:11,desc:"Kombinacja zakończona odrzutem."},
{id:"kame",name:"Kamehameha",category:"Ki",ki:43,base:378,learn:6,mentor:"roshi",desc:"Technika Mistrza Roshiego."},
{id:"kaioken",name:"Kaioken",category:"Specjalne",ki:49,base:455,learn:8,story:5,desc:"Krótki wybuch mocy kosztem energii i zdrowia."},
{id:"spirit",name:"Genki Dama",category:"Specjalne",ki:90,base:910,learn:26,story:12,desc:"Potężna kula energii życiowej."}
]};
