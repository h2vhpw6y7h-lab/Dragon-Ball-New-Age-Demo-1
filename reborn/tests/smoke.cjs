"use strict";
/* Headless, dependency-free smoke test for the wholly independent REBORN engine. */
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..');const read=p=>fs.readFileSync(path.join(root,p),'utf8');
for(const f of ['index.html','style.css','data.js','art.js','engine.js','assets/earth-4k.svg','sw.js','manifest.webmanifest']){
 assert(fs.statSync(path.join(root,f)).size>100,'Missing or empty '+f)}
for(const f of ['data.js','art.js','engine.js','sw.js'])new Function(read(f));
assert(read('index.html').includes('./engine.js?v=1'),'Missing engine link');
assert(read('index.html').includes('./assets/earth-4k.svg'),'Map asset unavailable');
assert(!read('engine.js').includes('goku-base-anime.svg'),'Legacy Goku must not be referenced');
assert(!read('engine.js').includes('pngegg.com'),'Remote image hotlinks are forbidden');
const canvasMethods=['setTransform','clearRect','fillRect','save','restore','beginPath','arc','ellipse','fill','stroke','fillText','strokeText','moveTo','lineTo','setLineDash','drawImage','roundRect'];
const fakeCtx=Object.fromEntries(canvasMethods.map(m=>[m,()=>{}]));fakeCtx.measureText=s=>({width:s.length*7});
const callbacks={},controls={};
const canvas={width:1,height:1,getBoundingClientRect(){return {width:750,height:520,left:0,top:0}},getContext(){return fakeCtx},addEventListener(){},setPointerCapture(){}};
const rootElem={innerHTML:'',addEventListener(a,fn){callbacks[a]=fn}};
const toast={textContent:'',classList:{add(){},remove(){}}};
const stub={getElementById(id){return id==='game'?rootElem:id==='worldCanvas'?canvas:id==='toast'?toast:controls[id]||(controls[id]={textContent:''})}};
const storage={};const localStorage={getItem:k=>storage[k]||null,setItem:(k,v)=>{storage[k]=v}};
class FakeImage{set src(value){this._src=value;this.complete=true;this.naturalWidth=3840;this.naturalHeight=2160;if(this.onload)this.onload()}get src(){return this._src}}
const context={
 document:stub,window:{devicePixelRatio:2,addEventListener(){},requestAnimationFrame(){}},
 navigator:{},Image:FakeImage,localStorage,console,performance:{now:()=>110},
 setTimeout:()=>1,clearTimeout(){},setInterval:()=>2,clearInterval(){},confirm:()=>true,
 Math,JSON,Number,Object,Array,Date,Error,Promise,URL
};
vm.createContext(context);
vm.runInContext(read('data.js'),context,{timeout:1000});
vm.runInContext(read('art.js'),context,{timeout:1000});
vm.runInContext(read('engine.js'),context,{timeout:3000});
const api=context.window.DBNA_TEST;assert(api,'Engine test hook missing');
assert(rootElem.innerHTML.includes('SAGA'),'Home screen missing');
assert(rootElem.innerHTML.includes('GOKU'),'Normal form hero missing');
function click(action,key=''){const el={disabled:false,dataset:{act:action,key}};callbacks.click({target:{closest(){return el}}})}
click('nav','world');assert(rootElem.innerHTML.includes('worldCanvas'),'World map unavailable');
api.drawMap(250);
click('nav','character');assert(rootElem.innerHTML.includes('Siła'),'Character stats missing');
click('nav','skills');assert(rootElem.innerHTML.includes('DRZEWKO'),'Skill tree missing');
click('nav','story');assert(rootElem.innerHTML.includes('SAGA SAIYAN')&&rootElem.innerHTML.includes('Duma księcia'),'Saiyan Saga campaign missing');
click('nav','home');
api.visit('home');assert(rootElem.innerHTML.includes('NASTĘPNY DIALOG'),'Story dialog did not start');
for(let i=0;i<3;i++)click('nextdialog');
assert(api.getState().stage===1,'Chapter progress not saved');
assert(storage['dbna-reborn-saiyan-v1'],'Reborn save missing');
api.startBattle('pig',false,'west');assert(rootElem.innerHTML.includes('WYBIERZ TECHNIKĘ'),'Battle menu missing');
const oldHp=api.getState().battle.hp;
click('attack','combo');assert(rootElem.innerHTML.includes('KADR'),'Cinematic attack missing');
assert(api.getState().battle.hp===oldHp,'Damage applied before cinematic end');
api.advanceFrame(true);assert(api.getState().battle.hp<oldHp,'Damage not applied after frames');
const unlocked=vm.runInContext('DBArt.get("goku")',context);
const drawing=decodeURIComponent(unlocked.split(',').slice(1).join(','));
assert(drawing.includes('#f58023'),'Goku orange gi color missing');
assert(!drawing.includes('var(--cloth)'),'SVG gradients contain unresolved custom properties');
assert(drawing.includes('<svg'),'Missing original SVG actor');
console.log('PASS / Reborn: HTML, graphics, vector map, start, navigation, character, skill tree, 14 chapter campaign, dialogue, combat, delayed damage, local save, valid sprite palette.');
