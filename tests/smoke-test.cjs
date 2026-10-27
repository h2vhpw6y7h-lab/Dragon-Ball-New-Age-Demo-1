/* Dependency-free runtime smoke test for GitHub Pages and the Saiyan Saga UI. */
"use strict";
const fs=require("node:fs");
const vm=require("node:vm");
const assert=require("node:assert/strict");
const path=require("node:path");
const rootDir=path.resolve(__dirname,"..");
const read=(p)=>fs.readFileSync(path.join(rootDir,p),"utf8");
const source=read("saiyan.js"),html=read("index.html");
for(const p of ["saiyan.js","saiyan.css","visual-upgrade.css","cinematic-0.8.css",
"assets/anime-scene-battle-v1.png","assets/anime-scene-ki-v1.png",
"assets/anime-scene-battle-hd.webp","assets/anime-scene-ki-hd.webp",
"assets/4k/battle-3840x2160.webp","assets/4k/dash-3840x2160.webp",
"assets/4k/charge-3840x2160.webp","assets/4k/beam-3840x2160.webp",
"assets/4k/impact-3840x2160.webp",
"assets/goku-normal-idle.svg","assets/goku-normal-dash.svg",
"assets/goku-normal-punch.svg","assets/goku-normal-guard.svg",
"assets/goku-normal-ki.svg","assets/earth-battle-4k.svg","assets/earth-map-4k.svg"]){
 assert(fs.statSync(path.join(rootDir,p)).size>100,p+" is missing or empty");
}
assert(html.includes('cinematic-0.8.css?v=16'),"cinematic stylesheet must load");
assert(html.includes('saiyan.js?v=20'),"engine asset must be cache-busted");
assert(!source.includes("goku-base-anime.svg?v=1"),"stale cartoon Goku must not be used");
assert(source.includes("assets/characters/hero.svg"),"All screens must share a new organic anime hero");
assert(source.includes("MOTION_MICROFRAMES=100"),"Every cinematic move needs 100 planned motion subframes");
new Function(source); // syntax validation only
const listeners={},intervals=[];
const root={
 innerHTML:"",
 addEventListener(type,fn){listeners[type]=fn},
 contains(){return true}
};
const saved={version:1,level:3,heroName:"Nowy wojownik",loc:{x:30,y:12,steps:0},chapter:0};
const localStorage={
 getItem(){return JSON.stringify(saved)},
 setItem(_key,value){Object.assign(saved,JSON.parse(value))}
};
class FakeImage{
 constructor(){this.complete=false;this.naturalWidth=0;this.onload=null}
 set src(value){this._src=value}
 get src(){return this._src}
}
const silent={log(){},error(...args){throw Error("Runtime error: "+args.join(" "))}};
const sandbox={
 document:{
   getElementById(id){return id==="app"?root:null},
   addEventListener(){},
   activeElement:{tagName:""}
 },
 window:{devicePixelRatio:2,addEventListener(){}},
 Image:FakeImage,
 localStorage,
 navigator:{},
 console:silent,
 setInterval(fn){intervals.push(fn);return intervals.length},
 clearInterval(){},
 setTimeout(){return 1},
 clearTimeout(){},
 confirm(){return true},
 Date,Math,JSON,Number,Array,Object,String,Boolean,
};
vm.runInNewContext(source,sandbox,{timeout:1500});
assert(root.innerHTML.includes("Goku"),"home not rendered");
assert(root.innerHTML.includes("characters/hero.svg"),"Detailed character on home missing");
function click(action,val=""){
 const btn={disabled:false,getAttribute(n){return n==="data-a"?action:n==="data-v"?val:null}};
 listeners.click({target:{closest(){return btn}}});
 if(root.innerHTML.includes("Błąd silnika gry"))throw Error("Engine error after "+action+":"+val);
}
click("quickfight");
assert(root.innerHTML.includes("characters/drone.svg")&&root.innerHTML.includes("characters/hero.svg"),"Robot fight must render organic character sprites, not robot block art");
assert(root.innerHTML.includes("Robot treningowy"),"quick duel must start against training robot");
assert(root.innerHTML.includes("MENU WALKI")||root.innerHTML.includes("Menu walki"),"quick duel must reach battle UI");
click("move","punch");
assert(root.innerHTML.includes("KADR 1 /"),"quick duel must start cinematic frames");
click("skipscene");
click("nav","home");
assert(root.innerHTML.includes("earth-battle-4k.svg")&&root.innerHTML.includes("characters/hero.svg"),"Home must have clean detailed hero instead of enlarged low-resolution raster");
click("nav","character");
assert(root.innerHTML.includes("Atrybuty postaci"),"character menu unavailable");
click("nav","skills");
assert(/drzewko|opanowanie technik/i.test(root.innerHTML),"skill menu unavailable");
click("nav","world");
assert(root.innerHTML.includes("world-canvas"),"map unavailable");
click("seek","saiba");
assert(intervals.length>0,"map movement interval missing");
intervals[intervals.length-1]();
assert(root.innerHTML.includes('data-a="nextdialog"'),"story dialog not triggered at boss");
for(let n=0;n<12&&root.innerHTML.includes('data-a="nextdialog"');n++)click("nextdialog");
assert(root.innerHTML.includes("MENU WALKI")||root.innerHTML.includes("Menu walki"),"battle menu unavailable after dialog");
assert(root.innerHTML.includes("anime-arena"),"new arena not drawn");
assert(root.innerHTML.includes("characters/saiba-boss.svg")||root.innerHTML.includes("characters/saiba.svg"),"Story battle must render appropriate organic Saibamen art");
click("move","punch");
assert(root.innerHTML.includes('KADR 1 /'),"combat frame not started");
assert(root.innerHTML.includes("anime-arena"),"cinematic arena not used");
assert(root.innerHTML.includes("characters/hero.svg"),"Cinematic must keep detailed hero");
click("skipscene");
assert(!root.innerHTML.includes("Błąd silnika gry"),"combat result crashed");
assert(read("cinematic-0.8.css").includes("ANIME COMBAT 1.0"),"anime polish css is missing");

// Regression: preview HD mode must use new assets, preserving normal mode.
const hdRoot={innerHTML:"",addEventListener(type,fn){hdListeners[type]=fn},contains(){return true}};
const hdListeners={};
const hdSandbox={...sandbox,window:{...sandbox.window,location:{search:"?hd=1"}},document:{...sandbox.document,getElementById(id){return id==="app"?hdRoot:null}}};
vm.runInNewContext(source,hdSandbox,{timeout:1500});
assert(hdRoot.innerHTML.includes("earth-battle-4k.svg")&&hdRoot.innerHTML.includes("characters/hero.svg"),"Home HD must not reuse old soft bitmap art");
const hdButton={disabled:false,getAttribute(n){return n==="data-a"?"quickfight":n==="data-v"?"":null}};
hdListeners.click({target:{closest(){return hdButton}}});
assert(hdRoot.innerHTML.includes("characters/drone.svg"),"HD robot battle must use detailed character sprite");

// Cinema-4K is opt-in and must preserve the older mode and player progression.
const cinemaListeners={};
const cinemaRoot={innerHTML:"",addEventListener(type,fn){cinemaListeners[type]=fn},contains(){return true}};
const cinemaSandbox={...sandbox,window:{...sandbox.window,location:{search:"?cinema=1"}},document:{...sandbox.document,getElementById(id){return id==="app"?cinemaRoot:null}}};
vm.runInNewContext(source,cinemaSandbox,{timeout:2000});
assert(cinemaRoot.innerHTML.includes("cinema-switch"),"4K home toggle absent");
assert(cinemaRoot.innerHTML.includes("characters/hero.svg"),"4K home must show new full-resolution vector hero");
function cinemaClick(action,val=""){const btn={disabled:false,getAttribute(n){return n==="data-a"?action:n==="data-v"?val:null}};cinemaListeners.click({target:{closest(){return btn}}});assert(!cinemaRoot.innerHTML.includes("Błąd silnika gry"),"Cinema engine error: "+action);}
cinemaClick("quickfight");
assert(cinemaRoot.innerHTML.includes("cinema-4k"),"Cinema arena class not rendered");
assert(cinemaRoot.innerHTML.includes("characters/drone.svg")&&cinemaRoot.innerHTML.includes("characters/hero.svg"),"4K battle lacks unique illustrated characters");
cinemaClick("move","punch");
const parts=cinemaRoot.innerHTML.match(/KADR 1 \/ (\d+)/);
assert(parts&&Number(parts[1])>=8,"Basic combo requires >=8 storyboard cuts");
cinemaClick("frame");
assert(cinemaRoot.innerHTML.includes("assets/4k/dash-3840x2160.webp"),"Dash 4K image not selected");
cinemaClick("frame");
assert(cinemaRoot.innerHTML.includes("assets/4k/focus-3840x2160.webp"),"Focus scene is missing");
cinemaClick("frame");
assert(cinemaRoot.innerHTML.includes("assets/4k/teleport-3840x2160.webp"),"Teleport art is missing");
cinemaClick("skipscene");
assert(!cinemaRoot.innerHTML.includes("Błąd silnika gry"),"4K attack ending broke battle state");
for(const kind of ["battle","dash","charge","beam","impact","focus","teleport","punch","uppercut","guard","volley","clash","finisher","aftermath","counter"]){const file="assets/4k/"+kind+"-3840x2160.webp";assert(fs.existsSync(path.join(rootDir,file)),"Missing 4K anime frame "+file)}


for(const kind of ["hero","bandit","ribbon","scout","nappa","vegeta","roshi","pig","martial","saiba","saiba-boss","drone","sentry"]){
 const p="assets/characters/"+kind+".svg";
 const svg=read(p);
 assert(svg.includes("<path")&&svg.includes("Q")&&svg.includes("</svg>"),p+" must be organic curved SVG, not boxy geometry");
}
assert(!source.includes("ENEMIES.bandit.art=originalEnemy"),"Old geometric enemy generator still active");
assert(source.includes("MOTION_MICROFRAMES=100"),"100 microframe animation engine must be wired");
console.log("PASS: menu, character, skill tree, map movement, story, battle, cinematic attack and local graphics.");
