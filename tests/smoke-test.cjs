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
"assets/goku-normal-idle.svg","assets/goku-normal-dash.svg",
"assets/goku-normal-punch.svg","assets/goku-normal-guard.svg",
"assets/goku-normal-ki.svg","assets/earth-battle-4k.svg","assets/earth-map-4k.svg"]){
 assert(fs.statSync(path.join(rootDir,p)).size>100,p+" is missing or empty");
}
assert(html.includes('cinematic-0.8.css?v=10'),"cinematic stylesheet must load");
assert(html.includes('saiyan.js?v=13'),"engine asset must be cache-busted");
assert(!source.includes("goku-base-anime.svg?v=1"),"stale cartoon Goku must not be used");
assert(source.includes('goku-normal-punch.svg?v=8'));
assert(source.includes('goku-normal-guard.svg?v=8'));
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
assert(root.innerHTML.includes("goku-normal-idle.svg"),"Goku sprite missing");
function click(action,val=""){
 const btn={disabled:false,getAttribute(n){return n==="data-a"?action:n==="data-v"?val:null}};
 listeners.click({target:{closest(){return btn}}});
 if(root.innerHTML.includes("Błąd silnika gry"))throw Error("Engine error after "+action+":"+val);
}
click("quickfight");
assert(root.innerHTML.includes("Robot treningowy"),"quick duel must start against training robot");
assert(root.innerHTML.includes("MENU WALKI")||root.innerHTML.includes("Menu walki"),"quick duel must reach battle UI");
click("move","punch");
assert(root.innerHTML.includes("KADR 1 /"),"quick duel must start cinematic frames");
click("skipscene");
click("nav","home");
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
click("move","punch");
assert(root.innerHTML.includes('KADR 1 /'),"combat frame not started");
assert(root.innerHTML.includes("anime-arena"),"cinematic arena not used");
assert(root.innerHTML.includes("goku-normal"),"cinematic must keep consistent Goku");
click("skipscene");
assert(!root.innerHTML.includes("Błąd silnika gry"),"combat result crashed");
assert(read("cinematic-0.8.css").includes("ANIME COMBAT 1.0"),"anime polish css is missing");
console.log("PASS: menu, character, skill tree, map movement, story, battle, cinematic attack and local graphics.");
