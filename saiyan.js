
(function(){
"use strict";
const HD_ART=/(?:\\?|&)hd=1(?:&|$)/.test((typeof window!=="undefined"&&window.location&&window.location.search)||"");
const ANIME_BATTLE=HD_ART?"./assets/anime-scene-battle-hd.webp":"./assets/anime-scene-battle-v1.png";
const ANIME_KI=HD_ART?"./assets/anime-scene-ki-hd.webp":"./assets/anime-scene-ki-v1.png";
const CINEMA_4K=/(?:\\?|&)cinema=1(?:&|$)/.test((typeof window!=="undefined"&&window.location&&window.location.search)||"");
const CINEMA_ART={battle:"./assets/4k/battle-3840x2160.webp",dash:"./assets/4k/dash-3840x2160.webp",charge:"./assets/4k/charge-3840x2160.webp",beam:"./assets/4k/beam-3840x2160.webp",impact:"./assets/4k/impact-3840x2160.webp",focus:"./assets/4k/focus-3840x2160.webp",teleport:"./assets/4k/teleport-3840x2160.webp",punch:"./assets/4k/punch-3840x2160.webp",uppercut:"./assets/4k/uppercut-3840x2160.webp",guard:"./assets/4k/guard-3840x2160.webp",volley:"./assets/4k/volley-3840x2160.webp",clash:"./assets/4k/clash-3840x2160.webp",finisher:"./assets/4k/finisher-3840x2160.webp",aftermath:"./assets/4k/aftermath-3840x2160.webp",counter:"./assets/4k/counter-3840x2160.webp"};
const frameAsset=f=>{const k=f&&f.art;if(k&&CINEMA_ART[k])return CINEMA_ART[k];const m=f&&f.mode;return CINEMA_ART[m==="vanish"?"dash":m==="charge"?"charge":m==="beam"?"beam":m==="hit"?"impact":m==="counter"?"counter":"battle"];};
const MOTION_MICROFRAMES=100;
const ROOT=document.getElementById("app"),SAVE="dbna-saiyan-saga-v1",T=68,MW=50,MH=30;
const PIC={
goku:"./assets/characters/hero.svg?v=1",
gokuAtk:"./assets/characters/hero.svg?v=1",
gokuDef:"./assets/characters/hero.svg?v=1",
gokuAura:"./assets/characters/hero.svg?v=1",
saiba:"https://www.nicepng.com/png/full/562-5627827_dbz-saibaman-clipart-goku-vegeta-frieza-dragon-ball.png",
nappa:"https://e7.pngegg.com/pngimages/826/98/png-clipart-nappa-goku-vegeta-shenron-dragon-ball-goku-hand-manga.png",
vegeta:"https://thecodex.wiki/images/thumb/9/96/SaiyanSagaVegeta.png/800px-SaiyanSagaVegeta.png",
frieza:"https://jp.dblegends.net/assets/card_arts/0450_Frieza4th_450/0450_Frieza4th_450_Chara.png",
duel:"./assets/earth-battle-4k.svg?v=8",
clash:"./assets/earth-battle-4k.svg?v=8"
};
PIC.gokuDash="./assets/characters/hero.svg?v=1";
const ENEMIES={
bandit:{name:"Bandyta pustkowi",lv:2,hp:270,atk:37,def:5,spd:5,xp:65,coins:55,art:PIC.saiba,area:"Pustkowia"},
drone:{name:"Robot treningowy",lv:3,hp:320,atk:45,def:10,spd:7,xp:80,coins:70,art:PIC.nappa,area:"Pole treningowe"},
saiba:{name:"Saibamen",lv:5,hp:490,atk:62,def:12,spd:11,xp:125,coins:90,art:PIC.saiba,area:"Wąwóz Saibamen"},
scout:{name:"Zwiadowca Saiyan",lv:7,hp:640,atk:79,def:17,spd:14,xp:165,coins:125,art:PIC.vegeta,area:"Lądowisko"},
saibaBoss:{name:"Saibamen — dowódca",lv:7,hp:900,atk:80,def:16,spd:14,xp:380,coins:250,art:PIC.saiba,boss:true,area:"SAGA SAIYAN • ROZDZIAŁ I"},
nappa:{name:"Nappa",lv:13,hp:2350,atk:153,def:37,spd:24,xp:980,coins:900,art:PIC.nappa,boss:true,area:"SAGA SAIYAN • ROZDZIAŁ II"},
vegeta:{name:"Vegeta",lv:20,hp:3650,atk:210,def:58,spd:44,xp:2200,coins:1800,art:PIC.vegeta,boss:true,area:"SAGA SAIYAN • FINAŁ"},
roshi:{name:"Mistrz Roshi",lv:8,hp:940,atk:72,def:20,spd:15,xp:275,coins:0,art:PIC.goku,boss:true,mentor:true,area:"PRÓBA MISTRZA"}
};

/* Individually illustrated organic shonen characters; no geometric enemy stand-ins. */
const CHARACTER_ART=Object.freeze({
 hero:"./assets/characters/hero.svg?v=1",bandit:"./assets/characters/bandit.svg?v=1",
 drone:"./assets/characters/drone.svg?v=1",scout:"./assets/characters/scout.svg?v=1",
 saiba:"./assets/characters/saiba.svg?v=1",saibaBoss:"./assets/characters/saiba-boss.svg?v=1",
 nappa:"./assets/characters/nappa.svg?v=1",vegeta:"./assets/characters/vegeta.svg?v=1",
 roshi:"./assets/characters/roshi.svg?v=1",ribbon:"./assets/characters/ribbon.svg?v=1",
 pig:"./assets/characters/pig.svg?v=1",martial:"./assets/characters/martial.svg?v=1",sentry:"./assets/characters/sentry.svg?v=1"
});
for(const key of ["bandit","drone","scout","saiba","saibaBoss","nappa","vegeta","roshi"])ENEMIES[key].art=CHARACTER_ART[key];
ENEMIES.ribbon={name:"Żołnierz Red Ribbon",lv:3,hp:335,atk:41,def:9,spd:9,xp:95,coins:78,art:CHARACTER_ART.ribbon,area:"Posterunek Red Ribbon"};
ENEMIES.pig={name:"Dzik z pustkowi",lv:2,hp:300,atk:44,def:7,spd:7,xp:70,coins:38,art:CHARACTER_ART.pig,area:"Leśne pustkowia"};
ENEMIES.martial={name:"Wojownik pustelnik",lv:4,hp:425,atk:52,def:13,spd:12,xp:120,coins:86,art:CHARACTER_ART.martial,area:"Ścieżka górska"};
ENEMIES.sentry={name:"Strażnik kapsuł",lv:5,hp:530,atk:68,def:22,spd:11,xp:155,coins:120,art:CHARACTER_ART.sentry,area:"Lądowisko kapsuł"};

const LOC=[
{id:"home",x:5,y:6,name:"Dom Goku",icon:"⌂",color:"#83e1ff"},
{id:"field",x:12,y:7,name:"Pole treningowe",icon:"⚔",color:"#81edec"},
{id:"wilderness",x:18,y:9,name:"Pustkowia",icon:"☀",color:"#ffc35f"},
{id:"village",x:13,y:18,name:"Wioska",icon:"⌂",color:"#86ecc1"},
{id:"capsule",x:24,y:22,name:"Lądowisko kapsuł",icon:"◉",color:"#dba9f9"},
{id:"saiba",x:31,y:12,name:"Wąwóz Saibamen",icon:"!",color:"#e8ff65"},
{id:"nappa",x:39,y:18,name:"Obóz Nappy",icon:"!",color:"#ffb448"},
{id:"vegeta",x:46,y:25,name:"Szczyt Vegety",icon:"♛",color:"#fe6779"},
{id:"roshi",x:5,y:24,name:"Trening u Roshiego",icon:"✦",color:"#86e9ff"},
{id:"lake",x:10,y:25,name:"Jezioro",icon:"≈",color:"#6ee6ff"},
{id:"radar",x:30,y:4,name:"Punkt widokowy",icon:"◆",color:"#e8faff"}];
const CHAPTERS=[
{title:"Zielone zagrożenie",goal:"Pokonaj Saibamen w wąwozie",location:"saiba",boss:"saibaBoss"},
{title:"Ziemia pod ostrzałem",goal:"Pokonaj Nappę w jego obozie",location:"nappa",boss:"nappa"},
{title:"Duma księcia",goal:"Pokonaj Vegetę na skalnym szczycie",location:"vegeta",boss:"vegeta"},
{title:"Po bitwie",goal:"Eksploruj Ziemię i doskonal umiejętności",location:"home",boss:null}
];
const STATS=[
{id:"str",name:"Siła",icon:"🥊",desc:"Moc ciosów i combo"},
{id:"vit",name:"Życie",icon:"❤️",desc:"Maksymalne HP"},
{id:"ki",name:"Ki",icon:"🔵",desc:"Rezerwa energii"},
{id:"def",name:"Obrona",icon:"🛡",desc:"Mniejsze obrażenia"},
{id:"spd",name:"Szybkość",icon:"⚡",desc:"Uniki i kontry"},
{id:"luck",name:"Szczęście",icon:"★",desc:"Szansa na trafienie krytyczne"},
{id:"tal",name:"Talent",icon:"✦",desc:"Skuteczność technik"}];
const TREES=[
{id:"punch",name:"Ciosy",icon:"🥊",nodes:[
{id:"fist",name:"Hart pięści",req:null,lv:1,max:3,desc:"+8% obrażeń fizycznych za rangę"},
{id:"combo",name:"Szybkie Combo",req:"fist",lv:2,max:1,desc:"Odblokowuje serię ciosów"},
{id:"meteor",name:"Meteor Combo",req:"combo",lv:5,max:1,desc:"Potężne combo z teleportem"},
{id:"finisher",name:"Łamacz skał",req:"meteor",lv:9,max:3,desc:"Mocniejsze finisze combo"}]},
{id:"ki",name:"KI",icon:"🔵",nodes:[
{id:"energy",name:"Kontrola energii",req:null,lv:1,max:3,desc:"Koszt technik KI -3 za rangę"},
{id:"kiwave",name:"Fala KI",req:"energy",lv:2,max:1,desc:"Silniejsza fala KI"},
{id:"kame",name:"Kamehameha",req:"kiwave",lv:4,max:1,desc:"Po próbie u Mistrza Roshiego"},
{id:"kiBurst",name:"Deszcz energii",req:"kame",lv:8,max:3,desc:"Wzmocnienie wybuchu KI"}]},
{id:"combo",name:"Combo",icon:"💥",nodes:[
{id:"rhythm",name:"Rytm walki",req:null,lv:1,max:3,desc:"Większy przyrost miernika Combo"},
{id:"counter",name:"Kontra",req:"rhythm",lv:3,max:1,desc:"Aktywna kontra po unikach"},
{id:"teleport",name:"Powidok",req:"counter",lv:5,max:3,desc:"Wyższa szansa uniknięcia ciosu"},
{id:"chain",name:"Drugi atak",req:"teleport",lv:8,max:3,desc:"Szansa na dodatkowy cios"}]},
{id:"passive",name:"Pasywy",icon:"💚",nodes:[
{id:"morale",name:"Hart ducha",req:null,lv:1,max:3,desc:"Stabilniejsze morale"},
{id:"resilience",name:"Saiyańska duma",req:"morale",lv:3,max:3,desc:"Przewaga przeciw silniejszym"},
{id:"recovery",name:"Regeneracja",req:"resilience",lv:6,max:3,desc:"Odzyskaj więcej KI po turze"},
{id:"instinct",name:"Instynkt walki",req:"recovery",lv:10,max:3,desc:"Szansa na automatyczną kontrę"}]},
{id:"form",name:"Transformacje",icon:"🔥",nodes:[
{id:"kaioken",name:"Kaioken",req:null,lv:25,max:1,desc:"Próba mistrzowska — w kolejnej sadze"},
{id:"ssj",name:"Super Saiyan",req:"kaioken",lv:40,max:1,desc:"Wymaga wydarzenia fabularnego"},
{id:"god",name:"Boskie KI",req:"ssj",lv:250,max:1,desc:"Transformacja boska"},
{id:"ui",name:"Ultra Instynkt",req:"god",lv:800,max:1,desc:"Ścieżka mistrza"}]}
];
const MOVES=[
{id:"punch",name:"Szybkie ciosy",icon:"🥊",type:"attack",ki:0,base:54,frames:4,desc:"Atak podstawowy • rośnie Combo",req:null},
{id:"blast",name:"Pocisk KI",icon:"🔵",type:"ki",ki:10,base:80,frames:4,desc:"Krótki wybuch energii",req:null},
{id:"rapid",name:"Szybkie Combo",icon:"⚡",type:"combo",ki:20,base:120,frames:5,desc:"Seria ataków i teleport",req:"combo"},
{id:"kiwave",name:"Fala KI",icon:"🌊",type:"ki",ki:25,base:145,frames:5,desc:"Rozbudowana technika KI",req:"kiwave"},
{id:"meteor",name:"Meteor Combo",icon:"💥",type:"combo",ki:38,base:240,frames:6,desc:"Dynamiczny finisher",req:"meteor"},
{id:"kame",name:"Kamehameha",icon:"🌟",type:"ki",ki:48,base:340,frames:7,desc:"Próba Mistrza Roshiego",req:"kame"}];
const DRAW=Object.create(null);
function make(){let stats={str:6,vit:6,ki:6,def:5,spd:6,luck:4,tal:4};return{version:1,screen:"home",level:1,xp:0,attrPts:0,skillPts:0,coins:250,race:"Saiyan",heroName:"Goku",avatar:"goku",stats,skills:{},mastery:{},chapter:0,done:[],roshi:false,loc:{x:5,y:6,steps:0},battle:null,scene:null,dialog:null,encounter:null,result:null,skillTree:"punch",category:"all",log:["Na Ziemi zbliża się niebezpieczeństwo..."],hp:0,energy:0,moraleUntil:0,questFlags:{},mode:"walk"}}
let S=make();S.hp=maxHP();S.energy=maxKI();
try{const stored=JSON.parse(localStorage.getItem(SAVE)||"null");if(stored&&stored.version===1){S=Object.assign(make(),stored);S.stats=Object.assign(make().stats,stored.stats||{});S.skills=Object.assign({},stored.skills||{});S.mastery=Object.assign({},stored.mastery||{});S.loc=Object.assign(make().loc,stored.loc||{});if(!Number.isFinite(S.hp))S.hp=maxHP();if(!Number.isFinite(S.energy))S.energy=maxKI();if(S.heroName==="Nowy wojownik")S.heroName="Goku";S.screen="home";S.scene=null;S.dialog=null;S.encounter=null;S.battle=null;}}catch(e){}
let walkTimer=null,cutTimer=null,toastTimer=null,canvas=null,C=null,pan={x:0,y:0},target=null,pressTimer=null,dragStart=null;
const MAP_ART=typeof Image==="function"?new Image():null;
const PLAYER_ART=typeof Image==="function"?new Image():null;
if(MAP_ART){MAP_ART.onload=function(){if(S.screen==="world")paint()};MAP_ART.src="./assets/earth-map-4k.svg?v=7"}
if(PLAYER_ART){PLAYER_ART.onload=function(){if(S.screen==="world")paint()};PLAYER_ART.src=PIC.goku}
function save(){try{const o=Object.assign({},S,{screen:"home",scene:null,dialog:null,encounter:null,battle:null,result:null});localStorage.setItem(SAVE,JSON.stringify(o));}catch(e){}}
function val(id){return S.stats[id]||0}
function rank(id){return S.skills[id]||0}
function lvlExp(n){return 110+Math.floor(n*85+n*n*14)}
function maxHP(){return 340+S.level*44+val("vit")*29}
function maxKI(){return 65+S.level*5+val("ki")*7}
function power(){return Math.round(S.level*14+val("str")*16+val("ki")*8+val("tal")*9)}
function clamp(v,min,max){return Math.min(max,Math.max(min,v))}
function pct(v,max){return clamp(max?Math.round(v/max*100):0,0,100)}
function bar(v,max,color){return '<div class="bar '+(color||"")+'"><span style="width:'+pct(v,max)+'%"></span></div>'}
function esc(v){return String(v).replace(/[&<>"']/g,function(c){return{"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]})}
function button(label,action,arg,cls,disabled){return '<button type="button" class="btn '+(cls||"")+'" data-a="'+action+'" data-v="'+(arg===undefined?"":esc(arg))+'" '+(disabled?"disabled":"")+'>'+label+'</button>'}
function hdr(title){return '<div class="top compact"><div class="logo">DRAGON BALL <em>NEW AGE</em></div><div class="topside"><span class="coin">🪙 '+S.coins+'</span>'+button("⚙","settings","","btn-square")+'</div></div>'+ (title?'<div class="row space"><h2 class="flame" style="font-size:clamp(22px,3vw,31px);margin:7px 0">'+title+'</h2><span class="label orange">SAGA SAIYAN</span></div>':"")}
function nav(){const b=[["home","⌂","Start"],["world","🌍","Mapa"],["battle","⚔","Walka"],["character","🥊","Postać"],["skills","🌳","Skille"]];return '<div class="bottomnav">'+b.map(function(a){return '<button data-a="nav" data-v="'+a[0]+'" class="'+(S.screen===a[0]?"active":"")+'"><b>'+a[1]+'</b>'+a[2]+'</button>'}).join("")+'</div>'}
function toast(msg){const el=document.getElementById("status-toast");if(el){el.textContent=msg;el.style.opacity="1";clearTimeout(toastTimer);toastTimer=setTimeout(()=>{el.style.opacity="0"},2500);}}
function loc(id){return LOC.find(x=>x.id===id)}
function quest(){return CHAPTERS[Math.min(S.chapter,3)]}
function gameImage(src,cls,alt){return '<img draggable="false" class="'+(cls||"")+'" src="'+src+'" alt="'+(alt||"Ilustracja")+'" loading="eager" decoding="async" onerror="this.onerror=null;this.src=(this.className.indexOf(\'enemy\')>=0?\'./assets/unknown-warrior.svg?v=7\':\'./assets/goku-normal-idle.svg?v=7\')">'}
function protagonist(){return PIC.goku}
function drawHome(){let q=quest();return hdr("")+
'<div class="hero-cover"><div class="hero-image" style="background-image:url('+(CINEMA_4K?CINEMA_ART.battle:ANIME_BATTLE)+')"></div>'+gameImage(PIC.goku,"home-goku","Goku w formie podstawowej")+'<div class="hero-caption"><span class="label orange">SAGA SAIYAN • ROZDZIAŁ '+(S.chapter+1)+'</span><h1 class="flame">'+(S.chapter<3?'ATAK SAIYAN':'ZWYCIĘSTWO')+'</h1><p>'+esc(q.goal)+'</p></div></div>'+
'<div class="ticker"><b style="font-size:23px">🔥</b><div><b>DRAGON BALL NEW AGE</b><br><span class="sm">'+esc(S.heroName)+' • LV '+S.level+' • Moc '+power()+'</span></div></div>'+
'<div class="tile-menu"><button class="tile main" data-a="new"><span class="glyph">⚔️</span><strong>NOWA GRA</strong><small>Nowa przygoda • Saga Saiyan</small></button>'+
'<button class="tile" data-a="nav" data-v="world"><span class="glyph">▶️</span><strong>KONTYNUUJ</strong><small>Swobodna mapa i misje</small></button>'+
'<a class="tile cinema-switch" href="'+(CINEMA_4K?"./?lite=1":"./?cinema=1")+'"><span class="glyph">🎬</span><strong>'+ (CINEMA_4K?"TRYB KINOWY 4K":"URUCHOM ANIMACJE 4K")+'</strong><small>15 scen 3840 × 2160 px</small></a>'+
'<button class="tile quick-duel" data-a="quickfight"><span class="glyph">🔥</span><strong>WALKA TESTOWA</strong><small>Robot treningowy • filmowe kadry • bez utraty postępu</small></button>'+
'<button class="tile" data-a="nav" data-v="world"><span class="glyph">🌍</span><strong>MAPA ŚWIATA</strong><small>Duża mapa z chodzeniem</small></button>'+
'<button class="tile" data-a="nav" data-v="character"><span class="glyph">👤</span><strong>POSTAĆ</strong><small>Atrybuty, wygląd, progres</small></button>'+
'<button class="tile" data-a="nav" data-v="skills"><span class="glyph">🌳</span><strong>DRZEWKO SKILLI</strong><small>+3 punkty na każdy LV</small></button>'+
'<button class="tile" data-a="heal"><span class="glyph">💪</span><strong>TRENING</strong><small>Odpoczynek, regeneracja</small></button></div>'+
'<section class="panel gold-edge"><div class="row space"><div><b class="gold caps">Bieżący rozdział</b><p class="sm">'+esc(q.title)+' — '+esc(q.goal)+'</p></div>'+button("PRZEJDŹ NA MAPĘ →","nav","world","btn-hot")+'</div>'+bar(S.xp,lvlExp(S.level),"exp")+'<span class="micro">XP '+S.xp+' / '+lvlExp(S.level)+' • '+(S.chapter<3?'Bossowie nie skalują się do Twojego poziomu.':'Saga ukończona — swobodna eksploracja.')+'</span></section>'}
function drawWorldUI(){let q=quest();return hdr("Mapa — Ziemia")+
'<div class="row space sm"><b>LV '+S.level+' • '+esc(S.heroName)+'</b><span class="gold">Odkrywanie: '+Math.min(100,Math.round(S.loc.steps/8))+'%</span></div>'+
'<div class="world-layout"><div class="map-frame" id="map-frame"><canvas id="world-canvas" aria-label="Duża mapa Ziemi z grywalnym poruszaniem"></canvas>'+
'<div class="map-top"><span>🌍 <b>PLANETA ZIEMIA</b><br>Saga Saiyan • mapa 50 × 30</span><span id="worldpos">Pozycja '+(S.loc.x+1)+', '+(S.loc.y+1)+'</span></div>'+
'<div class="map-bot"><div class="dpad"><i></i><button data-a="step" data-v="up">▲</button><i></i><button data-a="step" data-v="left">◀</button><button data-a="stop">◉</button><button data-a="step" data-v="right">▶</button><i></i><button data-a="step" data-v="down">▼</button><i></i></div></div>'+
'<div class="map-zoom"><button data-a="zoom" data-v="plus">＋</button><button data-a="zoom" data-v="minus">－</button><button data-a="center">⌖</button></div></div>'+
'<div class="world-side"><section class="panel gold-edge quest"><div class="panel-title"><h2>🎯 Główny cel</h2></div><b>'+esc(q.title)+'</b><div class="questline">➤ '+esc(q.goal)+'</div><p class="sm muted">Podejdź na mapie do oznaczonej lokacji. Możesz trenować i wrócić do bossa znacznie silniejszy.</p>'+button("Znajdź cel","findgoal","","btn-hot btn-wide")+'</section>'+
'<section class="panel"><div class="panel-title"><h2>Podróż</h2><span class="label">Walka losowa</span></div><p class="sm">Dotknij mapy — wojownik ruszy we wskazane miejsce. Przytrzymaj strzałki, aby chodzić.</p><div class="row space"><span>❤️ '+Math.max(0,Math.round(S.hp))+' / '+maxHP()+'</span><span>🔵 '+Math.round(S.energy)+' / '+maxKI()+'</span></div>'+button("Wróć do domu","seek","home","btn-wide")+'</section>'+
'<section class="panel"><div class="panel-title"><h2>Lokacje</h2></div><div class="location-list">'+LOC.filter(x=>["home","field","saiba","nappa","vegeta","roshi"].includes(x.id)).map(x=>'<div class="location">'+x.icon+' <b>'+x.name+'</b>'+button("Pokaż","seek",x.id,"btn-mini")+'</div>').join("")+'</div></section></div></div>'+
'<p class="map-hint">Mapa nie jest pojedynczym obrazkiem. Sterujesz postacią po dużym terenie; na pustkowiach spotkasz losowych przeciwników i możesz trenować przed kolejnym bossem.</p>'}
function fightArt(mode,enemy,shot){
const id=enemy||S.battle?.enemy||"saiba",b=ENEMIES[id]||ENEMIES.saiba;
const m=mode||"battlefield",area=["saiba","saibaBoss","nappa","vegeta","scout"].includes(id)?"rock":terrain(S.loc.x,S.loc.y);
let left=protagonist(),right=b.art;
if(shot){if(shot.mode==="vanish")left=PIC.gokuDash;else if(shot.mode==="hit")left=PIC.gokuAtk;else if(shot.mode==="counter")left=PIC.gokuDef;else if(shot.mode==="charge"||shot.mode==="beam")left=PIC.gokuAura;}
const sceneMode=shot&&["vanish","charge","beam","hit","counter"].includes(shot.mode)?shot.mode:"battlefield";
const sceneArt=shot&&shot.art&&CINEMA_ART[shot.art]?shot.art:"battle";
const sceneFx=CINEMA_4K?'<div class="cinema-fx"><i class="afterimage"></i><i class="rays"></i><i class="shockwave"></i><i class="ki-core"></i></div>':"";
return '<div class="scene-wrap anime-arena organic-anime '+(CINEMA_4K?"cinema-4k cinema-shot-"+sceneMode+" cinema-art-"+sceneArt+" ":"")+'arena-'+area+' '+m+' '+(shot?"angle-"+(shot.angle||"wide"):"angle-wide")+' '+(shot?"combat-"+(shot.mode||"wide"):"combat-idle")+'" data-motion-steps="'+MOTION_MICROFRAMES+'">'+
'<div class="anime-background"></div>'+(CINEMA_4K?'<div class="cinema-ambient" style="background-image:url('+frameAsset(shot)+')"></div>':"")+
'<div class="stage-ground"></div><div class="stage-atmosphere"></div>'+
gameImage(left,"player-art "+(shot?"pose-"+shot.mode:"pose-idle"),"Wojownik anime")+
gameImage(right,"enemy-art",b.name)+
'<div class="aura-burst"></div><div class="impact-ring"></div><div class="combat-speed"></div><div class="combat-sparks"></div>'+sceneFx+
(m==="beam"?'<div class="beam"></div>':"")+
'<div class="flash"></div><div class="shade"></div><div class="scene-name"><span>ZIEMIA • '+esc(b.area.toUpperCase())+'</span><span>'+esc(b.name.toUpperCase())+'</span></div></div>';
}
function battleHUD(){let b=S.battle,e=ENEMIES[b.enemy];return '<div class="panel gold-edge"><div class="battle-hud"><div class="hud-side"><div class="fighter-row">'+gameImage(protagonist(),"portrait","Wojownik")+'<div><strong>'+esc(S.heroName)+'</strong><div class="micro">LV '+S.level+' • Moc '+power()+'</div></div></div><div class="sm">HP '+Math.round(S.hp)+' / '+maxHP()+'</div>'+bar(S.hp,maxHP())+'<div class="micro">KI '+Math.round(S.energy)+' / '+maxKI()+'</div>'+bar(S.energy,maxKI(),"ki")+'</div>'+
'<div class="hud-round">TURA<br>'+b.turn+'</div>'+
'<div class="hud-side enemy"><div class="fighter-row"><div><strong>'+e.name+'</strong><div class="micro">LV '+e.lv+' • '+(e.boss?"BOSS":"Wróg")+'</div></div>'+gameImage(e.art,"portrait enemy",e.name)+'</div><div class="sm">HP '+Math.max(0,Math.round(b.hp))+' / '+e.hp+'</div>'+bar(b.hp,e.hp)+'</div></div></div>'}
function safeEnemyHUD(){let b=S.battle,e=ENEMIES[b.enemy];return '<div class="panel gold-edge"><div class="battle-hud"><div class="hud-side"><div class="fighter-row">'+gameImage(protagonist(),"portrait","Wojownik")+'<div><strong>'+esc(S.heroName)+'</strong><div class="micro">LV '+S.level+' • Moc '+power()+'</div></div></div><div class="sm">HP '+Math.max(0,Math.round(S.hp))+' / '+maxHP()+'</div>'+bar(S.hp,maxHP())+'<div class="micro">KI '+Math.round(S.energy)+' / '+maxKI()+'</div>'+bar(S.energy,maxKI(),"ki")+'</div><div class="hud-round">TURA<br>'+b.turn+'</div><div class="hud-side enemy"><div class="fighter-row"><div><strong>'+e.name+'</strong><div class="micro">LV '+e.lv+' • '+(e.boss?"BOSS":"Wróg")+'</div></div>'+gameImage(e.art,"portrait enemy",e.name)+'</div><div class="sm">HP '+Math.max(0,Math.round(b.hp))+' / '+e.hp+'</div>'+bar(b.hp,e.hp)+'</div></div></div>'}
function cost(m){return Math.max(0,m.ki-(rank("energy")*3))}
function moveAllowed(m){return !m.req||rank(m.req)>0}
function drawBattle(){const b=S.battle;if(!b)return drawWorldUI();const tabs=[["all","⚔ Wszystko"],["attack","🥊 Ciosy"],["ki","🔵 KI"],["combo","💥 Combo"]],type=S.category||"all";return hdr("Walka — "+ENEMIES[b.enemy].name)+safeEnemyHUD()+
'<section class="panel"><div class="combo-meter"><span class="gold">🔥 COMBO '+b.combo+'%</span>'+bar(b.combo,100,"combo")+'<span class="micro">Seria '+b.chain+'</span></div></section>'+
'<div class="battle-layout"><div class="panel">'+fightArt("battlefield")+'<p class="sm muted">Wybierz technikę. Starcie w tle jest wizualne — HP zmienia się dopiero po zakończeniu sekwencji ataku.</p><div class="row space"><span class="label orange">'+ENEMIES[b.enemy].area+'</span><span class="label">Morale '+(Date.now()<S.moraleUntil?5:100)+'</span></div></div>'+
'<div class="panel battle-actions"><div class="panel-title"><h2>Menu walki</h2><span class="label">Twój ruch</span></div><div class="command-tabs">'+tabs.map(a=>'<button class="'+(a[0]===type?"current":"")+'" data-a="category" data-v="'+a[0]+'">'+a[1]+'</button>').join("")+'</div>'+
'<div class="tech-grid">'+MOVES.filter(m=>type==="all"||m.type===type).map(m=>{let allowed=moveAllowed(m);return '<button class="tech '+(m.id==="kame"?"ultimate":"")+'" data-a="move" data-v="'+m.id+'" '+(!allowed||S.energy<cost(m)?"disabled":"")+'><span class="icon">'+m.icon+'</span><strong>'+m.name+(allowed?"":" 🔒")+'</strong><p>'+m.desc+'</p><small>'+cost(m)+' KI • użycia '+(S.mastery[m.id]||0)+'</small></button>'}).join("")+'</div>'+
'<div class="two" style="margin-top:10px">'+button("🛡 Obrona +KI","move","defend","",S.hp<=0)+button("↩️ Odwrót","flee","","",ENEMIES[b.enemy].boss)+'</div>'+
'<div class="battle-log">'+(b.log||[]).slice(-5).reverse().map(x=>'<div>• '+esc(x)+'</div>').join("")+'</div></div></div>'}
function frameCaption(frame){return frame.label||"Walka trwa..."}
function drawCut(){
const sc=S.scene,b=S.battle,f=sc.frames[sc.idx],last=sc.idx>=sc.frames.length-1;
const enriched=Object.assign({},f,{angle:["wide","close","low","left","high","tilt","reverse","detail"][sc.idx%8]});
let art=fightArt(f.mode,b.enemy,enriched);
if(/TRAFIENIE|FINISHER|DODATKOWY|KRYTYCZNE/.test(f.heading||"")){
art=art.replace('<div class="shade"></div>','<div class="damage">'+sc.consequence.dmg+'<small>DAMAGE</small></div><div class="shade"></div>');
}
return hdr("Atak — "+sc.moveName)+safeEnemyHUD()+
'<div class="cut-stage"><div>'+art+'</div><div class="cut-dialogue"><div><span class="label orange">KADR '+(sc.idx+1)+' / '+sc.frames.length+'</span><h2 class="flame">'+esc(f.heading||"WALKA")+'</h2><p>'+esc(f.text)+'</p><div class="cut-progress">'+sc.frames.map((x,i)=>'<span class="'+(i<=sc.idx?"done":"")+'"></span>').join("")+'</div></div><div class="cut-controls">'+button(last?"ZAKOŃCZ →":"NASTĘPNY KADR →","frame","","btn-hot")+button("POMIŃ ››","skipscene","","btn-mini")+'</div></div></div><p class="sm muted">Kadry przewijają się automatycznie. Możesz przejść do następnego ręcznie.</p>';
}
function drawDialogue(){const d=S.dialog,frame=d.lines[d.idx];let person=frame.who||"Narrator";let art=person.includes("Nappa")?PIC.nappa:person.includes("Vegeta")?PIC.vegeta:person.includes("Saib")?PIC.saiba:PIC.goku;let q=quest();return hdr("Saga Saiyan • Fabuła")+
'<div class="panel gold-edge"><div class="scene-wrap">'+gameImage(d.bg||PIC.duel,"shot","Scena fabularna")+'<div class="shade"></div><div class="scene-name"><span>'+esc(q.title.toUpperCase())+'</span><span>'+ (d.idx+1)+' / '+d.lines.length+'</span></div></div></div>'+
'<div class="panel"><div class="dialog-portrait">'+gameImage(art,"","Portret")+'<div><div class="dialog-heading">'+esc(person)+'</div><div class="dialog-sub">SAGA SAIYAN • ROZDZIAŁ '+(S.chapter+1)+'</div></div></div><p style="font-size:clamp(18px,2.5vw,27px);line-height:1.5;min-height:75px">'+esc(frame.text)+'</p>'+
'<div class="cut-progress">'+d.lines.map((x,i)=>'<span class="'+(i<=d.idx?"done":"")+'"></span>').join("")+'</div><div class="choice-grid" style="margin-top:15px">'+button(d.idx===d.lines.length-1?"DALEJ →":"NASTĘPNY DIALOG →","nextdialog","","btn-hot")+button("POMIŃ ››","skipdialog","","btn-mini")+'</div></div>'}
function drawEncounter(){let c=S.encounter,e=ENEMIES[c.enemy];return hdr("Losowe zdarzenie")+'<section class="panel gold-edge encounter"><div class="panel-title"><h2>⚠️ '+esc(c.title)+'</h2><span class="label orange">LV '+e.lv+'</span></div><div class="row">'+gameImage(e.art,"enemy-thumb",e.name)+'<div><h2 class="flame" style="margin:0">'+e.name+'</h2><p class="sm">'+esc(c.message)+'</p><p class="micro">Stała siła przeciwnika • '+e.xp+' EXP</p></div></div><div class="choice-grid">'+button("⚔ WALCZ","start-enc","","btn-hot")+button("🏃 OMIŃ","avoid-enc","","btn-blue")+'</div></section>'}
function drawResult(){const r=S.result;return hdr(r.win?"Zwycięstwo!":"Porażka")+'<div class="panel gold-edge"><h1 class="flame" style="font-size:clamp(29px,6vw,56px);margin:8px 0">'+(r.win?"ZWYCIĘSTWO!":"POWRÓT DO TRENINGU")+'</h1><div class="scene-wrap">'+gameImage(r.enemy==="drone"?ANIME_BATTLE:(r.win?protagonist():ENEMIES[r.enemy].art),"shot","Wynik starcia")+'<div class="shade"></div><div class="scene-name"><span>'+esc(ENEMIES[r.enemy].name.toUpperCase())+'</span><span>'+(r.win?"POKONANY":"ZBYT SILNY")+'</span></div></div><p>'+esc(r.text)+'</p>'+
'<div class="reward"><div>🟢 EXP<strong>+'+r.xp+'</strong></div><div>🥊 ATRYBUTY<strong>+'+r.gainedAttr+'</strong></div><div>🌳 SKILLE<strong>+'+r.gainedSkill+'</strong></div></div><div class="choice-grid" style="margin-top:15px">'+button(r.storyStage!==null&&r.storyStage!==undefined?"📖 SCENA FABULARNA":"🗺 NA MAPĘ","result-map","","btn-blue")+button("💪 TRENING","result-train","","btn-hot")+button("👤 POSTAĆ","nav","character")+'</div></div>'}
function drawCharacter(){return hdr("Karta wojownika")+'<div class="charsheet"><div class="char-art">'+gameImage(protagonist(),"","Wojownik")+'<div class="caption"><b class="flame" style="font-size:32px">'+esc(S.heroName)+'</b><br><span class="label">'+esc(S.race)+' • LV '+S.level+'</span></div></div>'+
'<div class="panel gold-edge"><div class="panel-title"><h2>Atrybuty postaci</h2><span class="label orange">+5 pkt / LV</span></div><div class="two"><div class="sm">Poziom <b class="gold">'+S.level+'</b><br>Moc: '+power()+'</div><div class="sm">Punkty atrybutów<br><b class="gold" style="font-size:22px">'+S.attrPts+'</b></div></div>'+bar(S.xp,lvlExp(S.level),"exp")+
'<div class="row space micro"><span>XP '+S.xp+'/'+lvlExp(S.level)+'</span><span>Punkty skilli: '+S.skillPts+'</span></div>'+
'<div class="stat-grid" style="margin-top:10px">'+STATS.map(x=>'<div class="stat"><span class="symbol">'+x.icon+'</span><div><strong>'+x.name+'</strong><div class="micro">'+x.desc+'</div></div><span class="value">'+val(x.id)+'</span><button aria-label="Ulepsz '+x.name+'" data-a="addstat" data-v="'+x.id+'" '+(S.attrPts<1?"disabled":"")+'>+</button></div>').join("")+'</div>'+
'<div class="row space" style="margin-top:14px"><span class="sm">❤️ HP '+Math.round(S.hp)+' / '+maxHP()+'</span><span class="sm">🔵 KI '+Math.round(S.energy)+' / '+maxKI()+'</span></div>'+
'<div class="sm" style="margin-top:11px">Wygląd wojownika</div><div class="choice-grid">'+button("Goku","avatar","goku","btn-mini") +button("Saiyan Aura","avatar","aura","btn-mini")+button("Vegeta","avatar","vegeta","btn-mini")+'</div>'+
'<div class="row" style="margin-top:12px"><input type="text" id="hero-name" maxlength="24" value="'+esc(S.heroName)+'" style="background:#081b32;border:1px solid #5985a7;border-radius:9px;color:white;padding:10px;width:65%">'+button("Zmień imię","rename","","btn-hot btn-mini")+'</div></div></div>'+
'<section class="panel"><div class="panel-title"><h2>Rozwój postaci</h2></div><p class="sm">Za każdy nowy poziom otrzymujesz <b class="gold">5 punktów atrybutów i 3 punkty skilli</b>. Skille rozwijają się dodatkowo przez używanie w walce.</p>'+button("🌳 Zobacz drzewko umiejętności","nav","skills","btn-hot btn-wide")+'</section>'}
function drawSkills(){const tree=TREES.find(x=>x.id===S.skillTree)||TREES[0];return hdr("Drzewko skilli")+'<div class="panel gold-edge"><div class="row space"><div><b class="gold">LV '+S.level+'</b> • XP '+S.xp+'<br><span class="micro">Rozdziel punkty skilli</span></div><span class="label orange">DOSTĘPNE: '+S.skillPts+' SP</span></div><div class="skill-tabs">'+TREES.map(x=>'<button data-a="tree" data-v="'+x.id+'" class="'+(S.skillTree===x.id?"current":"")+'">'+x.icon+' '+x.name+'</button>').join("")+'</div><div class="skillpath">'+tree.nodes.map(n=>{let v=rank(n.id),locked=(S.level<n.lv)||(n.req&&!rank(n.req))||(n.id==="kame"&&!S.roshi);return '<div class="skillnode '+(v?"open":"")+' '+(locked?"disabled":"")+'"><div class="nodeicon">'+tree.icon+'</div><strong>'+n.name+'</strong><span class="nodelevel">RANGA '+v+'/'+n.max+'</span><p>'+n.desc+'</p>'+button(locked?"🔒 "+(n.id==="kame"&&!S.roshi?"MISTRZ":"LV "+n.lv):v===n.max?"MAX":"ODKRYJ / ULEPSZ","learn",n.id,"btn-mini",locked||v>=n.max||S.skillPts<1)+'</div>'}).join("")+'</div>'+
'<div class="notice">'+(tree.id==="ki"?"Kamehameha wymaga wygranej próby u Mistrza Roshiego na mapie.":"Każda gałąź otwiera nowe podskille i pasywy.")+'</div></div>'+
'<section class="panel"><div class="panel-title"><h2>Opanowanie technik</h2></div><div class="two">'+MOVES.map(m=>'<div class="stat"><b>'+m.icon+' '+m.name+'</b><span class="value">'+(S.mastery[m.id]||0)+'</span></div>').join("")+'</div><p class="sm muted">Co dziesięć użyć danej techniki otrzymuje ona +5% obrażeń.</p></section>'}
function drawSettings(){return hdr("Ustawienia")+'<section class="panel gold-edge"><h2>Dragon Ball New Age — wersja 1.0 • Anime Combat</h2><p class="sm">Grywalne demo Sagi Saiyan. Dane zapisują się na tym urządzeniu.</p><div class="choice-grid">'+button("💾 Zapisz","save","","btn-hot")+button("🌍 Mapa","nav","world")+button("↩ Wstecz","nav","home")+'</div><p class="micro">Ilustracje postaci w tej wersji są tymczasowe i pochodzą z zewnętrznych źródeł. Mapa generowana jest przez silnik gry; kolejne kadry i własne grafiki HD wymagają jeszcze dopracowania.</p></section>'}
function render(){stopCut();stopMotion();if(walkTimer&&S.screen!=="world")stopWalk();let html="";try{switch(S.screen){case"home":html=drawHome();break;case"world":html=drawWorldUI();break;case"battle":html=drawBattle();break;case"cut":html=drawCut();break;case"dialog":html=drawDialogue();break;case"encounter":html=drawEncounter();break;case"result":html=drawResult();break;case"character":html=drawCharacter();break;case"skills":html=drawSkills();break;case"settings":html=drawSettings();break;default:S.screen="home";html=drawHome();}ROOT.innerHTML=html+nav()+'<div id="status-toast" style="position:fixed;top:70px;left:50%;transform:translateX(-50%);background:#2c1d16ed;border:1px solid #ffcc5d;color:#ffe6ad;font-weight:850;padding:9px 16px;border-radius:14px;pointer-events:none;opacity:0;transition:opacity .2s;z-index:100;max-width:88vw;text-align:center"></div>';if(S.screen==="world")setupWorld();if(S.screen==="cut"){startCut();if(CINEMA_4K&&S.scene){const next=S.scene.frames[S.scene.idx+1];if(next){const image=new Image();image.src=frameAsset(next);}}}}catch(e){console.error(e);ROOT.innerHTML='<div class="panel gold-edge"><h2>Błąd silnika gry</h2><p>'+esc(e.message)+'</p>'+button("Wróć do startu","nav","home","btn-hot")+'</div>'+nav();}}
function navigate(screen){if(screen==="battle"&&!S.battle)screen="world";S.screen=screen;save();render()}
function heal(){S.hp=maxHP();S.energy=maxKI();S.loc={x:5,y:6,steps:S.loc.steps};save();S.screen="world";render();toast("Wojownik wypoczął. HP i KI odnowione.")}
function newGame(){if(S.level>1||S.chapter>0){if(!confirm("Rozpocząć nową grę? Postęp Sagi Saiyan zostanie wyzerowany."))return;}S=make();S.hp=maxHP();S.energy=maxKI();save();S.screen="dialog";S.dialog={lines:[{who:"Narrator",text:"Na Ziemię przybywają dwaj Saiyanie. Ich siła przekracza wszystko, co znali obrońcy planety."},{who:"Krillin",text:"Nappa i Vegeta są już na Ziemi! Najpierw musimy rozprawić się z Saibamenami!"},{who:"Goku",text:"Najpierw przygotuję się do walki. Zdobędę doświadczenie i dopiero wtedy ruszę do ich obozu."}],idx:0,after:{kind:"map"}};render()}
function dialogue(lines,after,bg){S.dialog={lines,idx:0,after,bg:bg||PIC.duel};S.screen="dialog";render()}
function nextDialogue(skip){let d=S.dialog;if(!d)return;if(!skip&&d.idx<d.lines.length-1){d.idx++;render();return;}S.dialog=null;let a=d.after||{kind:"map"};if(a.kind==="battle")startBattle(a.enemy);else if(a.kind==="storyreturn"){S.screen="result";render()}else{S.screen="world";render()}}
function enemyForRegion(){let x=S.loc.x,y=S.loc.y;let pool=x>35?["scout","saiba","martial","sentry"]:x>24?["saiba","sentry","scout","martial"]:x>15?["bandit","pig","ribbon","saiba"]:x>9?["ribbon","drone","pig","bandit"]:["pig","bandit","drone","ribbon"];return pool[Math.floor(Math.random()*pool.length)]}
function chanceEncounter(){if(S.loc.steps<6||S.loc.steps%7!==0)return false;const nearby=LOC.find(p=>Math.abs(p.x-S.loc.x)<2&&Math.abs(p.y-S.loc.y)<2&&["home","village","field","roshi"].includes(p.id));if(nearby)return false;let chance=.32;if(S.loc.x<9)chance=.12;if(Math.random()>chance)return false;let enemy=enemyForRegion();S.encounter={enemy,title:"Nieoczekiwane starcie!",message:"Na drodze pojawia się "+ENEMIES[enemy].name+". Możesz stoczyć walkę dla EXP albo spróbować go ominąć."};S.screen="encounter";stopWalk();save();render();return true;}
function interact(place){stopWalk();if(place.id==="home"||place.id==="village"){heal();return;}if(place.id==="field"){S.energy=Math.min(maxKI(),S.energy+35);S.hp=Math.min(maxHP(),S.hp+35);S.xp+=18;levelCheck();save();render();toast("Trening +18 EXP, +35 KI");return;}
if(place.id==="lake"){S.hp=Math.min(maxHP(),S.hp+100);S.energy=Math.min(maxKI(),S.energy+30);save();render();toast("Jezioro — odpoczynek i regeneracja");return;}
if(place.id==="radar"){toast("Z najwyższego wzgórza widać obóz Nappy i skały Vegety.");return;}
if(place.id==="wilderness"||place.id==="capsule"){let enemy=place.id==="wilderness"?"bandit":"scout";S.encounter={enemy,title:"Zagrożenie w pobliżu",message:"W okolicy krąży silny przeciwnik. Możesz zdobyć doświadczenie."};S.screen="encounter";render();return;}
if(place.id==="roshi"){if(S.roshi){S.energy=maxKI();S.hp=maxHP();save();render();toast("Mistrz Roshi pomaga Ci zregenerować KI.");return;}if(S.level<3){toast("Mistrz Roshi: wróć, gdy osiągniesz LV 3.");return;}dialogue([{who:"Mistrz Roshi",text:"Chcesz poznać zaawansowane KI? Najpierw pokaż mi, jak walczysz!"},{who:"Goku",text:"Jestem gotowy do próby! Nauczę się panować nad energią."}],{kind:"battle",enemy:"roshi"});return;}
const bossIndex=place.id==="saiba"?0:place.id==="nappa"?1:place.id==="vegeta"?2:-1;if(bossIndex<0)return;
if(S.chapter>bossIndex){toast("Ten boss został już pokonany. Możesz dalej eksplorować.");return;}
if(S.chapter<bossIndex){toast("Najpierw ukończ wcześniejszy rozdział fabuły.");return;}
const dialogs=[
[{who:"Krillin",text:"Te zielone stwory są szybkie. Nie pozwól im podejść zbyt blisko!"},{who:"Saibamen",text:"Kiii! Ruszamy do ataku!"},{who:"Goku",text:"Dobrze. Najpierw sprawdzę ich siłę!"}],
[{who:"Krillin",text:"To dopiero początek... Nappa jest coraz bliżej!"},{who:"Nappa",text:"Wasze treningi nic nie znaczą. Zobaczcie prawdziwą moc Saiyana!"},{who:"Goku",text:"Nie muszę walczyć od razu. Ale gdy wrócę, będę gotowy."}],
[{who:"Vegeta",text:"Pokonałeś Nappę? Nieźle. Ale przede mną jeszcze długa droga."},{who:"Goku",text:"Mój trening właśnie się skończył. Teraz walczymy!"},{who:"Vegeta",text:"Pokaż mi, ile naprawdę jesteś wart!"}]
];
dialogue(dialogs[bossIndex],{kind:"battle",enemy:CHAPTERS[bossIndex].boss});}
function randomFight(){let eid=S.encounter.enemy;S.encounter=null;startBattle(eid)}
function startBattle(id){stopWalk();const e=ENEMIES[id];if(!e)return;S.battle={enemy:id,hp:e.hp,turn:1,combo:0,chain:0,log:["Walka rozpoczęta: "+e.name]};S.screen="battle";save();render()}
function xpAward(amount){let attr=0,skill=0;S.xp+=amount;while(S.xp>=lvlExp(S.level)){S.xp-=lvlExp(S.level);S.level++;S.attrPts+=5;S.skillPts+=3;attr+=5;skill+=3;S.hp=Math.min(maxHP(),S.hp+120);S.energy=Math.min(maxKI(),S.energy+25);}return{attr,skill};}
function levelCheck(){return xpAward(0)}
function win(enemyId){let e=ENEMIES[enemyId];let gained=xpAward(e.xp);S.coins+=e.coins;S.hp=Math.min(maxHP(),S.hp+Math.round(maxHP()*.16));S.energy=Math.min(maxKI(),S.energy+18);let text=e.name+" pokonany! Otrzymujesz "+e.xp+" EXP i "+e.coins+" monet.";if(e.mentor){S.roshi=true;text="Próba ukończona! Mistrz Roshi może nauczyć Cię Kamehameha. Odblokuj technikę w drzewku KI.";}
if(e.boss&&!e.mentor){let idx=CHAPTERS.findIndex(c=>c.boss===enemyId);if(idx===S.chapter){S.chapter++;text="Zwycięstwo fabularne: "+e.name+"! Rozdział ukończony. Możesz dalej trenować przed następnym bossem.";}}
S.result={win:true,enemy:enemyId,text,xp:e.xp,gainedAttr:gained.attr,gainedSkill:gained.skill,storyStage:(e.boss&&!e.mentor&&S.chapter<=3)?S.chapter:null};
S.battle=null;S.screen="result";save();render();}
function postBossStory(stage){let lines=stage===1?[{who:"Krillin",text:"To dopiero początek... Nappa jest coraz bliżej! Musimy być przygotowani."},{who:"Goku",text:"Najpierw pójdę potrenować. Nie rzucę się na niego bez przygotowania."},{who:"Narrator",text:"Nowy cel: Pokonaj Nappę. Możesz swobodnie eksplorować Ziemię."}]:stage===2?[{who:"Krillin",text:"Udało się! Ale Vegeta obserwował cały pojedynek. Jego energia jest jeszcze potężniejsza..."},{who:"Vegeta",text:"Interesujące. Zobaczymy, czy dasz sobie radę również ze mną."},{who:"Narrator",text:"Nowy cel: Pokonaj Vegetę. Trening i eksploracja pozostają dostępne."}]:[{who:"Narrator",text:"Vegeta został pokonany. Nad Ziemią powoli wraca spokój..."},{who:"Goku",text:"To był ciężki dzień. Ale wiem, że czekają mnie jeszcze większe wyzwania."},{who:"Narrator",text:"Saga Saiyan ukończona! Teraz możesz rozwijać postać i zwiedzać cały obszar."}];S.result=null;dialogue(lines,{kind:"map"},stage<3?PIC.duel:PIC.gokuAura)}
function lose(enemyId){S.moraleUntil=Date.now()+3600*1000;S.hp=Math.round(maxHP()*.65);S.energy=Math.round(maxKI()*.75);S.loc.x=5;S.loc.y=6;S.result={win:false,enemy:enemyId,text:"Wojownik został pokonany i wrócił do bezpiecznego domu. Przez godzinę realnego czasu jego morale jest obniżone. Poziom i skille pozostają.",xp:0,gainedAttr:0,gainedSkill:0};S.battle=null;S.screen="result";save();render();}
function mastery(id){S.mastery[id]=(S.mastery[id]||0)+1}
function moveAttack(id){const m=MOVES.find(x=>x.id===id);if(!m||!S.battle||!moveAllowed(m)||S.energy<cost(m))return;S.energy-=cost(m);mastery(id);const e=ENEMIES[S.battle.enemy],b=S.battle;const playerPower=power(),enemypower=e.lv*28+e.def*3;let morale=Date.now()<S.moraleUntil?.75:1;let normal=(m.base+val("str")*7+S.level*5)*(1+rank("fist")*.08)*(1+Math.floor((S.mastery[id]-1)/10)*.05)*(m.type==="ki"?1+val("tal")*.025+rank("kiBurst")*.08:1);
if(m.type==="combo")normal*=1+b.combo/180+rank("finisher")*.09;
let critChance=(.07+val("luck")*.008)*morale;let crit=Math.random()<critChance;let dodgeChance=clamp(e.spd/(val("spd")+e.spd+20)*.18+(.025*(e.lv>S.level?1:0)),.02,.22);let dodge=Math.random()<dodgeChance;let guard=!dodge&&Math.random()<.11;let counter=!dodge&&Math.random()<clamp(.15+(e.lv>S.level?.06:0)-(val("spd")*0.005),.05,.3);
let extra=Math.random()<clamp(.06+rank("chain")*.07+b.combo/700,.06,.45);let dmg=Math.max(6,Math.round((normal-(e.def*2))* (crit?1.65:1)*(guard?.56:1)*(dodge?.20:1)*(extra?1.22:1)));
let enemyHit=Math.max(7,Math.round((e.atk+e.lv*3-val("def")*5)*(counter?1.1:.82)));
if(playerPower>enemypower*2)enemyHit=Math.round(enemyHit*.5);
let playerDodge=Math.random()<clamp(.08+val("spd")*.007+rank("teleport")*.06,.04,.58);
if(playerDodge)enemyHit=0;
let frames=[
{mode:"battlefield",art:"battle",heading:"NAPRZECIW SIEBIE",text:"Goku i "+e.name+" wymieniają pierwsze ciosy.",label:"STARCIE"},
{mode:"vanish",art:"dash",heading:"START — ZERWANIE DYSTANSU!",text:"Błyskawiczny pierwszy krok, pył zostaje daleko w tyle.",label:"START"},
{mode:m.type==="ki"?"charge":"vanish",art:m.type==="ki"?"charge":"focus",heading:m.type==="ki"?"KONCENTRACJA KI":"BŁYSK!",text:m.type==="ki"?"Energia zbiera się w dłoniach Goku.":"Goku przyspiesza i znika z pola widzenia!",label:"PRZYGOTOWANIE"},
{mode:"vanish",art:"teleport",heading:"PÓŁ SEKUNDY!",text:"Seria błyskawicznych doskoków. Przeciwnik traci wojownika z oczu.",label:"SZYBKOŚĆ"},
{mode:m.type==="ki"?"charge":"counter",art:m.type==="ki"?"focus":"clash",heading:m.type==="ki"?"KULMINACJA MOCY":"ZDERZENIE!",text:m.type==="ki"?"Kamienie unoszą się od ciśnienia energii.":"Pięści zderzają się, a skały pękają pod stopami.",label:"NAPIĘCIE"},
{mode:m.type==="ki"?"beam":"hit",art:m.type==="ki"?"beam":"punch",heading:m.type==="ki"?"WYSTRZAŁ KI!":"CIOS ZA CIOSEM!",text:m.type==="ki"?"Fala energii przecina pole bitwy!":"Kombinacja ciosów trafia przeciwnika!",label:"ATAK"}
];
frames.push({mode:m.type==="ki"?"charge":"counter",art:m.type==="ki"?"charge":"guard",heading:m.type==="ki"?"NARASTANIE ENERGII":"ZMIANA GARDY",text:m.type==="ki"?"Wokół dłoni wirują błękitne iskry.":"Przeciwnik nie nadąża za kolejną zmianą tempa.",label:"DRAMATURGIA"});
if(m.frames>=5){
frames.push({mode:"vanish",art:"teleport",heading:"POWIDOK!",text:"Szybki ruch rozdziela powietrze — bohater znika za przeciwnikiem.",label:"ZMIANA POZYCJI"});
frames.push({mode:"hit",art:"uppercut",heading:"COMBO!",text:"Potężne uderzenie odbija przeciwnika od skalnej ściany.",label:"CIOS"});
frames.push({mode:"counter",art:"aftermath",heading:"ODRZUT!",text:"Odłamki skał i fala uderzeniowa przecinają pole bitwy.",label:"IMPULS"});
}
if(m.type==="ki")frames.push({mode:"beam",art:"volley",heading:"PRZEŁAMANIE OBRONY!",text:"Druga fala uderzeniowa rozświetla całe pole bitwy.",label:"PRZEBICIE"});
if(m.type==="combo")frames.push({mode:"vanish",art:"teleport",heading:"PRZESKOK ZA PLECY!",text:"Seria błysków i powidoków, przeciwnik zostaje za plecami.",label:"TELEPORT"});
frames.push({mode:"hit",art:"impact",heading:"FALA UDERZENIOWA!",text:"Wyrzucone odłamki skał przecinają powietrze.",label:"EFEKT"});
if(counter)frames.push({mode:"counter",art:"counter",heading:"KONTRA!",text:e.name+" próbuje odpowiedzieć błyskawicznym ciosem!",label:"KONTRATAK"});
else if(dodge)frames.push({mode:"vanish",art:"teleport",heading:"UNIK!",text:e.name+" częściowo unika nadchodzącej techniki.",label:"POWIDOK"});
else if(guard)frames.push({mode:"counter",art:"guard",heading:"BLOK!",text:e.name+" osłania się przed uderzeniem.",label:"OBRONA"});
if(extra)frames.push({mode:"hit",art:"punch",heading:"DODATKOWY CIOS!",text:"Kolejny cios trafia przeciwnika! Combo trwa.",label:"COMBO"});
frames.push({mode:"vanish",art:"focus",heading:"ZATRZYMANIE CZASU!",text:"Ułamek sekundy przed ostatnim ciosem.",label:"SLOW MOTION"});
frames.push({mode:"hit",art:"impact",heading:crit?"KRYTYCZNE TRAFIENIE!":"TRAFIENIE!",text:"Zadajesz "+dmg+" obrażeń!",label:""+dmg+" DAMAGE"});
if(dmg>=b.hp)frames.push({mode:"hit",art:"finisher",heading:"FINISHER!",text:e.name+" przegrywa walkę. Nad areną rozbłyskuje energia!",label:"FINISH"});
S.scene={frames,idx:0,moveName:m.name,consequence:{dmg,enemyHit,crit,dodge,guard,counter,extra,id}};S.screen="cut";render();}
function defend(){if(!S.battle)return;let e=ENEMIES[S.battle.enemy];S.energy=Math.min(maxKI(),S.energy+29+rank("recovery")*4);let hit=Math.max(0,Math.round((e.atk+e.lv*2-val("def")*5)*.27));S.scene={idx:0,moveName:"Obrona i odzyskanie KI",frames:[{mode:"counter",art:"guard",heading:"OBRONA",text:"Wojownik przyjmuje postawę obronną i koncentruje energię.",label:"BLOK"},{mode:"battlefield",art:"focus",heading:"ODZYSK KI",text:"Obrona osłabia atak przeciwnika. Zyskujesz KI.",label:"KONCENTRACJA"}],consequence:{dmg:0,enemyHit:hit,id:"defend"}};S.screen="cut";render()}
function finishScene(){const c=S.scene.consequence,b=S.battle;if(!b||!c){S.scene=null;S.screen="world";render();return}b.hp=Math.max(0,b.hp-c.dmg);b.log.push((c.id||"Atak")+": "+c.dmg+" DMG.");if(c.counter)b.log.push("Wróg wykonał kontratak!");if(c.dodge)b.log.push("Wróg uniknął części obrażeń.");if(c.extra)b.log.push("Dodatkowe Combo!");if(c.crit)b.log.push("Trafienie krytyczne!");
if(c.id==="punch")b.combo=clamp(b.combo+18+rank("rhythm")*8,0,100);
else if(["rapid","meteor"].includes(c.id)){b.chain++;b.combo=c.id==="meteor"?0:clamp(b.combo+24,0,100)}
else b.combo=Math.max(0,b.combo-8);
S.scene=null;if(b.hp<=0){win(b.enemy);return;}
S.hp=Math.max(0,S.hp-c.enemyHit);if(c.enemyHit)b.log.push("Kontra wroga: -"+c.enemyHit+" HP");else b.log.push("Unik udany! Brak obrażeń.");
S.energy=Math.min(maxKI(),S.energy+10+rank("recovery")*3);b.turn++;if(S.hp<=0){lose(b.enemy);return;}save();S.screen="battle";render()}
let motionRaf=0;
function stopMotion(){
 if(motionRaf&&typeof cancelAnimationFrame==="function")cancelAnimationFrame(motionRaf);
 motionRaf=0;
}
function motionPose(step,mode){
 const t=step/(MOTION_MICROFRAMES-1),wave=Math.sin(t*Math.PI*2),burst=Math.sin(Math.PI*t);
 const dash=mode==="vanish",ki=mode==="beam"||mode==="charge",hit=mode==="hit",counter=mode==="counter";
 return {
  heroX:(dash?Math.round(-20+170*t):hit?Math.round(92*burst):ki?Math.round(-12+11*wave):Math.round(7*wave)),
  heroY:(dash?Math.round(18-62*burst):hit?Math.round(-37*burst):Math.round(-12*burst)),
  foeX:hit?Math.round(48*burst):counter?Math.round(-27*burst):Math.round(3*wave),
  foeY:hit?Math.round(-31*burst):Math.round(7*wave),
  scale:1+(hit?.12:ki?.08:dash?.16:.04)*burst,
  energy:ki?0.65+0.35*burst:.12+.24*burst
 };
}
function startMotion(){
 if(!CINEMA_4K||typeof requestAnimationFrame!=="function"||typeof ROOT.querySelector!=="function"||!S.scene)return;
 const arena=ROOT.querySelector(".scene-wrap.organic-anime");
 if(!arena)return;
 const hero=arena.querySelector(".player-art"),enemy=arena.querySelector(".enemy-art");
 if(!hero||!enemy)return;
 const scene=S.scene,frame=scene.frames[scene.idx];
 const span=scene.frames.length,startStep=Math.floor(scene.idx*MOTION_MICROFRAMES/span);
 const endStep=Math.max(startStep+1,Math.floor((scene.idx+1)*MOTION_MICROFRAMES/span));
 const duration=frame.mode==="charge"?1080:frame.mode==="vanish"?860:frame.mode==="beam"?845:880;
 const start=typeof performance!=="undefined"?performance.now():Date.now();
 function tick(now){
  if(S.scene!==scene||S.screen!=="cut")return;
  const t=Math.max(0,Math.min(1,(now-start)/duration));
  const step=Math.min(MOTION_MICROFRAMES-1,Math.floor(startStep+(endStep-startStep)*t));
  const p=motionPose(step,frame.mode);
  hero.style.transform="translate3d("+p.heroX+"%, "+p.heroY+"%,0) scale("+p.scale+")";
  enemy.style.transform="translate3d("+p.foeX+"%, "+p.foeY+"%,0) scale("+(1+(p.scale-1)*.45)+")";
  arena.style.setProperty("--cinema-energy",String(p.energy));
  if(t<1)motionRaf=requestAnimationFrame(tick);
 }
 motionRaf=requestAnimationFrame(tick);
}
function stopCut(){if(cutTimer){clearTimeout(cutTimer);cutTimer=null}}
function startCut(){stopCut();if(S.screen==="cut"&&S.scene){const frame=S.scene.frames[S.scene.idx];const ms=CINEMA_4K?({vanish:870,charge:1100,beam:850,hit:820,counter:980,battlefield:1000}[frame.mode]||1050):1450;startMotion();cutTimer=setTimeout(()=>{cutTimer=null;advanceFrame()},ms)}}
function advanceFrame(skip){stopCut();if(!S.scene)return;if(!skip&&S.scene.idx<S.scene.frames.length-1){S.scene.idx++;render();return;}finishScene();}
function escapeFight(){let b=S.battle;if(!b)return;S.battle=null;S.scene=null;S.screen="world";save();render();toast("Wycofano się z walki.")}
function learn(id){let n=TREES.flatMap(t=>t.nodes).find(x=>x.id===id);if(!n||S.skillPts<1||S.level<n.lv||(n.req&&!rank(n.req))||rank(n.id)>=n.max){toast("Ta umiejętność jest jeszcze zablokowana.");return}if(n.id==="kame"&&!S.roshi){toast("Najpierw pokonaj Mistrza Roshiego.");return}S.skills[id]=rank(id)+1;S.skillPts--;save();render();}
function addStat(id){if(!S.attrPts||!STATS.some(x=>x.id===id))return;const oldHp=maxHP(),oldKi=maxKI();S.stats[id]++;S.attrPts--;S.hp+=(maxHP()-oldHp);S.energy+=(maxKI()-oldKi);save();render();}
function saveName(){const input=document.getElementById("hero-name");if(!input)return;let name=input.value.trim().slice(0,24);if(name){S.heroName=name;save();render()}}
function worldCoord(){return Math.round((S.loc.x+S.loc.y)*10)}
function seeded(x,y){let n=Math.sin(x*127.1+y*311.7+24.37)*43758.5453;return n-Math.floor(n)}
function terrain(x,y){if(x<5&&y>19)return "water";if(x<9&&y>24)return "water";if(x>32&&y>19)return "rock";if(x>17&&y<18)return "desert";if(x>29&&y<8)return "rock";if(x<14&&y>13)return "forest";return "grass"}
function drawTile(ctx,x,y,t){let ty=terrain(x,y),z=x*T,q=y*T,h=seeded(x,y),c=ty==="water"?"#187baf":ty==="desert"?"#cf9159":ty==="rock"?"#687966":ty==="forest"?"#53844e":"#77b365";
ctx.fillStyle=c;ctx.fillRect(z,q,T+1,T+1);
if(ty==="water"){ctx.strokeStyle="#91e7ef47";ctx.lineWidth=2;ctx.beginPath();ctx.arc(z+T*h,q+T*(1-h),13+h*13,0,Math.PI);ctx.stroke();return;}
ctx.fillStyle=ty==="desert"?"#e3ac68":ty==="rock"?"#9aa090":"#a0ca6a";ctx.globalAlpha=.35;ctx.beginPath();ctx.moveTo(z,q);ctx.lineTo(z+T*.65,q);ctx.lineTo(z+T*.14,q+T);ctx.closePath();ctx.fill();ctx.globalAlpha=1;
if(ty==="rock"||(ty==="desert"&&h>.73)){ctx.fillStyle="#46575a";ctx.beginPath();ctx.moveTo(z+9,q+51);ctx.lineTo(z+T*.52,q+7+h*8);ctx.lineTo(z+T-9,q+50);ctx.closePath();ctx.fill();ctx.fillStyle="#c4b39a";ctx.beginPath();ctx.moveTo(z+T*.52,q+7+h*8);ctx.lineTo(z+T*.72,q+45);ctx.lineTo(z+T*.44,q+26);ctx.closePath();ctx.fill();}
else if(ty==="forest"||(ty==="grass"&&h>.64)){ctx.fillStyle="#254e34";ctx.beginPath();ctx.ellipse(z+T*.52,q+T*.67,19,11,0,0,Math.PI*2);ctx.fill();ctx.fillStyle="#235e3e";for(let i=0;i<3;i++){ctx.beginPath();ctx.arc(z+22+i*11,q+24+(i%2)*8,15,0,Math.PI*2);ctx.fill();}ctx.fillStyle="#4d9b48";ctx.beginPath();ctx.arc(z+29,q+20,10,0,Math.PI*2);ctx.fill();}
else if(h>.36){ctx.fillStyle=ty==="desert"?"#a67b50":"#4f8645";for(let i=0;i<4;i++)ctx.fillRect(z+9+i*12,q+13+seeded(x+i,y)*28,2,7)}
}
function drawRoads(ctx){const route=[loc("home"),loc("field"),loc("wilderness"),loc("saiba"),loc("nappa"),loc("vegeta")];ctx.lineJoin="round";ctx.lineCap="round";for(let i=0;i<route.length-1;i++){let p=route[i],q=route[i+1],sx=(p.x+.5)*T,sy=(p.y+.5)*T,ex=(q.x+.5)*T,ey=(q.y+.5)*T;ctx.beginPath();ctx.moveTo(sx,sy);ctx.quadraticCurveTo((sx+ex)/2,(sy+ey)/2-90,ex,ey);ctx.strokeStyle="#614b3677";ctx.lineWidth=25;ctx.stroke();ctx.strokeStyle="#e7cc9189";ctx.lineWidth=14;ctx.stroke();}
}
function drawBuilding(ctx,x,y,c){let px=x*T+T/2,py=y*T+T/2;ctx.save();ctx.translate(px,py);ctx.fillStyle="#142c3a8c";ctx.beginPath();ctx.ellipse(8,18,33,13,0,0,Math.PI*2);ctx.fill();ctx.fillStyle=c||"#c5e3dc";ctx.beginPath();ctx.ellipse(0,2,28,24,0,Math.PI,Math.PI*2);ctx.lineTo(28,21);ctx.lineTo(-28,21);ctx.closePath();ctx.fill();ctx.fillStyle="#e96f54";ctx.beginPath();ctx.ellipse(0,0,29,12,0,Math.PI,Math.PI*2);ctx.fill();ctx.fillStyle="#17485c";ctx.fillRect(-4,0,10,20);ctx.restore()}
function drawIcon(ctx,p){const x=(p.x+.5)*T,y=(p.y+.5)*T;ctx.save();ctx.shadowBlur=18;ctx.shadowColor=p.color;ctx.strokeStyle=p.color;ctx.lineWidth=3;ctx.beginPath();ctx.arc(x,y,24,0,Math.PI*2);ctx.stroke();ctx.shadowBlur=0;ctx.fillStyle="#0b1935f0";ctx.beginPath();ctx.arc(x,y,20,0,Math.PI*2);ctx.fill();ctx.font="bold 23px system-ui";ctx.textAlign="center";ctx.fillStyle=p.color;ctx.fillText(p.icon,x,y+8);ctx.font="bold 14px system-ui";let width=Math.min(185,ctx.measureText(p.name).width+25);ctx.fillStyle="#0c1c30e8";ctx.beginPath();if(ctx.roundRect)ctx.roundRect(x-width/2,y+28,width,23,6);else ctx.rect(x-width/2,y+28,width,23);ctx.fill();ctx.fillStyle="#fff3d6";ctx.fillText(p.name,x,y+45);ctx.restore()}
function drawHero(ctx){let x=(S.loc.x+.5)*T,y=(S.loc.y+.5)*T;
if(PLAYER_ART&&PLAYER_ART.complete&&PLAYER_ART.naturalWidth){
ctx.save();ctx.translate(x,y);
ctx.fillStyle="#061e29a9";ctx.beginPath();ctx.ellipse(0,18,31,10,0,0,Math.PI*2);ctx.fill();
ctx.strokeStyle="#28dbfc";ctx.lineWidth=4;ctx.beginPath();ctx.ellipse(0,18,30,12,0,0,Math.PI*2);ctx.stroke();
ctx.drawImage(PLAYER_ART,-42,-105,84,123);
ctx.font="900 14px system-ui";ctx.textAlign="center";ctx.lineWidth=4;ctx.strokeStyle="#18344d";ctx.fillStyle="#ffe17a";ctx.strokeText("LV "+S.level,0,-112);ctx.fillText("LV "+S.level,0,-112);ctx.restore();return;
}ctx.save();ctx.translate(x,y);ctx.fillStyle="#0346a085";ctx.beginPath();ctx.ellipse(0,18,22,9,0,0,7);ctx.fill();ctx.strokeStyle="#32d6fc";ctx.lineWidth=3;ctx.beginPath();ctx.ellipse(0,19,22,9,0,0,Math.PI*2);ctx.stroke();ctx.fillStyle="#ff7e1d";ctx.strokeStyle="#1d1833";ctx.lineWidth=3;ctx.beginPath();if(ctx.roundRect)ctx.roundRect(-10,-2,20,23,6);else ctx.rect(-10,-2,20,23);ctx.fill();ctx.stroke();ctx.fillStyle="#f4b77d";ctx.beginPath();ctx.arc(0,-13,10,0,Math.PI*2);ctx.fill();ctx.fillStyle="#171624";for(let i=-2;i<=2;i++){ctx.beginPath();ctx.moveTo(i*5,-18);ctx.lineTo(i*8,-29-((i+4)%3)*4);ctx.lineTo(i*5+5,-17);ctx.fill();}ctx.fillStyle="#ffbf42";ctx.font="bold 13px system-ui";ctx.textAlign="center";ctx.fillText("LV "+S.level,0,-43);ctx.restore()}
function camera(w,h){let cx=(S.loc.x+.5)*T+pan.x,cy=(S.loc.y+.5)*T+pan.y;return{x:clamp(cx-w/2,0,MW*T-w),y:clamp(cy-h/2,0,MH*T-h)}}
let MAP_SCALE=1;
function paint(){canvas=document.getElementById("world-canvas");if(!canvas||S.screen!=="world")return;const rect=canvas.getBoundingClientRect();if(!rect.width||!rect.height)return;let dpr=Math.min(2.75,window.devicePixelRatio||1);canvas.width=Math.round(rect.width*dpr);canvas.height=Math.round(rect.height*dpr);C=canvas.getContext("2d");if(!C)return;C.setTransform(dpr,0,0,dpr,0,0);
const sw=rect.width/MAP_SCALE,sh=rect.height/MAP_SCALE,cam=camera(sw,sh);C.save();C.scale(MAP_SCALE,MAP_SCALE);C.translate(-cam.x,-cam.y);C.fillStyle="#1d6481";C.fillRect(cam.x,cam.y,sw,sh);
const x0=Math.max(0,Math.floor(cam.x/T)-1),y0=Math.max(0,Math.floor(cam.y/T)-1),x1=Math.min(MW-1,Math.ceil((cam.x+sw)/T)+1),y1=Math.min(MH-1,Math.ceil((cam.y+sh)/T)+1);
if(MAP_ART&&MAP_ART.complete&&MAP_ART.naturalWidth){
C.imageSmoothingEnabled=true;C.imageSmoothingQuality="high";
C.drawImage(MAP_ART,cam.x/(MW*T)*MAP_ART.naturalWidth,cam.y/(MH*T)*MAP_ART.naturalHeight,
sw/(MW*T)*MAP_ART.naturalWidth,sh/(MH*T)*MAP_ART.naturalHeight,cam.x,cam.y,sw,sh);
}else{
for(let y=y0;y<=y1;y++)for(let x=x0;x<=x1;x++)drawTile(C,x,y);
drawRoads(C);
}
for(const p of LOC){if(p.x<x0-2||p.x>x1+2||p.y<y0-2||p.y>y1+2)continue;if(["home","village","field","capsule","roshi"].includes(p.id))drawBuilding(C,p.x,p.y,p.id==="capsule"?"#bbb8db":"#cdeac6");drawIcon(C,p)}
if(target){C.strokeStyle="#fff0a5";C.lineWidth=3;C.beginPath();C.arc((target.x+.5)*T,(target.y+.5)*T,13,0,7);C.stroke();}
drawHero(C);C.restore();const label=document.getElementById("worldpos");if(label)label.textContent="X "+(S.loc.x+1)+" • Y "+(S.loc.y+1);}
function canvasToWorld(clientX,clientY){let rect=canvas.getBoundingClientRect(),sw=rect.width/MAP_SCALE,sh=rect.height/MAP_SCALE,cam=camera(sw,sh);return{x:clamp(Math.floor((cam.x+(clientX-rect.left)/MAP_SCALE)/T),0,MW-1),y:clamp(Math.floor((cam.y+(clientY-rect.top)/MAP_SCALE)/T),0,MH-1)}}
function setupWorld(){canvas=document.getElementById("world-canvas");if(!canvas)return;paint();let down=null;canvas.addEventListener("pointerdown",function(e){down={x:e.clientX,y:e.clientY,panX:pan.x,panY:pan.y};canvas.setPointerCapture(e.pointerId)});canvas.addEventListener("pointermove",function(e){if(!down)return;let dx=e.clientX-down.x,dy=e.clientY-down.y;if(Math.abs(dx)+Math.abs(dy)>9){pan.x=down.panX-dx/MAP_SCALE;pan.y=down.panY-dy/MAP_SCALE;paint()}});canvas.addEventListener("pointerup",function(e){if(!down)return;let moved=Math.abs(e.clientX-down.x)+Math.abs(e.clientY-down.y);down=null;if(moved<12){target=canvasToWorld(e.clientX,e.clientY);beginWalk()}else paint()});window.addEventListener("resize",paint,{once:true});}
function stopWalk(){clearInterval(walkTimer);walkTimer=null;target=null;}
function walkOne(dx,dy){let x=clamp(S.loc.x+dx,0,MW-1),y=clamp(S.loc.y+dy,0,MH-1);if(x===S.loc.x&&y===S.loc.y)return;S.loc.x=x;S.loc.y=y;S.loc.steps++;S.mode="walk";pan.x*=.78;pan.y*=.78;paint();if(S.loc.steps%4===0)save();const near=LOC.find(p=>p.x===x&&p.y===y);if(near&&near.id!==S.questFlags.lastNear){S.questFlags.lastNear=near.id;interact(near);return}if(!near)S.questFlags.lastNear=null;chanceEncounter();}
function beginWalk(){clearInterval(walkTimer);if(!target)return;walkTimer=setInterval(function(){if(S.screen!=="world"||!target){stopWalk();return}if(S.loc.x===target.x&&S.loc.y===target.y){stopWalk();paint();return}let dx=target.x-S.loc.x,dy=target.y-S.loc.y;let takeX=Math.abs(dx)>=Math.abs(dy);walkOne(takeX?Math.sign(dx):0,takeX?0:Math.sign(dy));if(S.screen!=="world")stopWalk();},135);}
function step(name){stopWalk();let dirs={up:[0,-1],down:[0,1],left:[-1,0],right:[1,0]};const d=dirs[name];if(d)walkOne(d[0],d[1]);}
function seek(id){let p=loc(id);if(!p)return;stopWalk();target={x:p.x,y:p.y};beginWalk();toast("Postać zmierza do: "+p.name);}
function findGoal(){seek(quest().location)}
function zoom(v){MAP_SCALE=clamp(MAP_SCALE+(v==="plus"?.25:-.25),.8,2.5);paint()}
ROOT.addEventListener("click",function(e){let b=e.target.closest("button[data-a]");if(!b||!ROOT.contains(b)||b.disabled)return;let a=b.getAttribute("data-a"),v=b.getAttribute("data-v");try{switch(a){
case"nav":navigate(v);break;
case"new":newGame();break;
case"quickfight":if(S.hp<=0){S.hp=maxHP();S.energy=maxKI();}startBattle("drone");break;
case"settings":navigate("settings");break;
case"save":save();toast("Zapisano postęp.");break;
case"heal":heal();break;
case"step":step(v);break;
case"stop":stopWalk();paint();break;
case"zoom":zoom(v);break;
case"center":pan.x=0;pan.y=0;paint();break;
case"findgoal":findGoal();break;
case"seek":seek(v);break;
case"nextdialog":nextDialogue(false);break;
case"skipdialog":nextDialogue(true);break;
case"start-enc":randomFight();break;
case"avoid-enc":S.encounter=null;S.screen="world";render();break;
case"category":S.category=v;render();break;
case"move":v==="defend"?defend():moveAttack(v);break;
case"frame":advanceFrame(false);break;
case"skipscene":advanceFrame(true);break;
case"flee":escapeFight();break;
case"result-map":if(S.result&&S.result.storyStage!==null&&S.result.storyStage!==undefined){postBossStory(S.result.storyStage)}else{S.screen="world";S.result=null;save();render()}break;
case"result-train":S.screen="world";S.result=null;save();render();seek("field");break;
case"addstat":addStat(v);break;
case"tree":S.skillTree=v;render();break;
case"learn":learn(v);break;
case"avatar":S.avatar="goku";if(PLAYER_ART)PLAYER_ART.src=PIC.goku;save();render();break;
case"rename":saveName();break;
}}catch(err){console.error("UI action error",err);toast("Błąd gry: "+err.message)}});
ROOT.addEventListener("pointerdown",function(e){const b=e.target.closest("button[data-a='step']");if(!b||S.screen!=="world")return;let v=b.getAttribute("data-v");clearInterval(pressTimer);pressTimer=setTimeout(()=>{pressTimer=setInterval(()=>step(v),120)},280)});
["pointerup","pointercancel","pointerleave"].forEach(name=>ROOT.addEventListener(name,function(){clearInterval(pressTimer);pressTimer=null}));
document.addEventListener("keydown",function(e){if(S.screen!=="world"||/INPUT|TEXTAREA/.test(document.activeElement?.tagName||""))return;const k={ArrowUp:"up",ArrowDown:"down",ArrowLeft:"left",ArrowRight:"right",w:"up",s:"down",a:"left",d:"right"}[e.key];if(k){e.preventDefault();step(k)}});
if(PLAYER_ART)PLAYER_ART.src=PIC.goku;S.screen="home";render();
})();
