/* DRAGON BALL NEW AGE: REBORN | independent offline canvas + turn-based RPG engine */
(function(){
'use strict';
const D=DBData,ART=DBArt,ROOT=document.getElementById('game'),SAVE='dbna-reborn-saiyan-v1';
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const esc=(v)=>String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const fmt=(v)=>Math.max(0,Math.round(v)).toLocaleString('pl-PL');
const loc=(id)=>D.places.find(p=>p.id===id);
const chapter=()=>D.chapters[Math.min(S.stage,D.chapters.length-1)];
const enemy=(id)=>D.enemies[id];
const stats=(v)=>S.stats[v]||0;
const mhp=()=>380+S.lv*42+stats('vitality')*20;
const mki=()=>90+S.lv*5+stats('ki')*6;
const power=()=>Math.round((S.lv*55+stats('strength')*28+stats('ki')*20+stats('speed')*15)*(1+S.lv*.012));
function initial(){return {v:1,screen:'home',lv:1,xp:0,points:0,skillPoints:0,coins:250,gems:0,stage:0,stats:{strength:5,ki:5,vitality:5,speed:5,luck:3},mastery:{},flags:{},pos:{x:820,y:1450},zoom:1.0,hp:0,energy:0,battle:null,sequence:null,dialog:null,log:[],moraleUntil:0}}
let S=initial();S.hp=mhp();S.energy=mki();
try{const st=JSON.parse(localStorage.getItem(SAVE)||'null');if(st&&st.v===1){S={...initial(),...st,stats:{...initial().stats,...st.stats},mastery:{...st.mastery},flags:{...st.flags},pos:{...initial().pos,...st.pos}};S.hp=clamp(S.hp,1,mhp());S.energy=clamp(S.energy,0,mki());}}catch(e){console.warn('Stored save invalid, using a fresh game',e)}
S.battle=null;S.sequence=null;S.dialog=null;S.screen='home';
function save(){try{localStorage.setItem(SAVE,JSON.stringify({...S,screen:'home',battle:null,sequence:null,dialog:null}))}catch(e){console.warn('Save unavailable',e)}}
let mapAsset=new Image(),mapLoaded=false,animation=null,lastPaint=0,mapCanvas=null,mapContext=null,camX=0,camY=0,worldScale=1,worldTarget=null,dragging=null,moveInterval=null,sceneTimer=null,toastTimer=null;
mapAsset.onload=()=>{mapLoaded=true;if(S.screen==='world')drawMap(performance.now())};
mapAsset.onerror=()=>{mapLoaded=false;console.warn('World map not loaded: fallback terrain active')};
mapAsset.src=D.world.image;
const P=(key,pose)=>ART.get(key,pose);
function btn(text,act,key='',cls='',disabled=false){return '<button type="button" data-act="'+act+'" data-key="'+esc(key)+'" class="'+cls+'" '+(disabled?'disabled':'')+'>'+text+'</button>'}
function meter(value,max,col='hp'){return '<div class="meter '+col+'"><i style="width:'+clamp(100*value/max,0,100).toFixed(1)+'%"></i></div>'}
function nav(){const tabs=[['home','⌂','Start'],['world','🌍','Mapa'],['battle','⚔','Walka'],['character','◉','Postać'],['skills','✦','Techniki']];return '<nav class="nav">'+tabs.map(t=>btn('<span>'+t[1]+'</span><b>'+t[2]+'</b>','nav',t[0],S.screen===t[0]||(['cut','dialog'].includes(S.screen)&&t[0]==='battle')?'selected':'')).join('')+'</nav>'}
function hud(){return '<header class="hud"><div class="hero-id"><img src="'+P('goku')+'" alt="Goku"><div><strong>GOKU <em>LV '+S.lv+'</em></strong><small>SUPER SAIYAN: ZABLOKOWANE</small></div></div><div class="hud-bars"><span>HP '+fmt(S.hp)+' / '+fmt(mhp())+'</span>'+meter(S.hp,mhp())+'<span>KI '+fmt(S.energy)+' / '+fmt(mki())+'</span>'+meter(S.energy,mki(),'ki')+'</div><div class="currencies"><b>◉ '+fmt(S.coins)+'</b><b>💎 '+fmt(S.gems)+'</b>'+btn('⚙','nav','settings','settings-btn')+'</div></header>'}
function shell(body){ROOT.innerHTML=hud()+body+nav()+'<aside id="toast" aria-live="polite"></aside>'}
function toast(str){clearTimeout(toastTimer);let el=document.getElementById('toast');if(!el)return;el.textContent=str;el.classList.add('show');toastTimer=setTimeout(()=>el.classList.remove('show'),2500)}
function screen(name){stopWalk();stopScene();if(name==='battle'&&!S.battle)name='world';S.screen=name;save();render()}
function expNeed(){return 110+S.lv*65+S.lv*S.lv*7}
function award(amount,coins=0){S.xp+=amount;S.coins+=coins;let count=0;while(S.xp>=expNeed()){S.xp-=expNeed();S.lv++;S.points+=5;S.skillPoints+=3;S.hp=mhp();S.energy=mki();count++}return count}
function objective(){let q=chapter();return '<section class="quest"><div class="quest-top"><span>🎯 GŁÓWNY CEL · ROZDZIAŁ '+(S.stage+1)+' / '+D.chapters.length+'</span><span class="pill">'+esc(loc(q.at).name)+'</span></div><h2>'+esc(q.title)+'</h2><p><b>'+esc(q.short)+'</b><br>'+esc(q.summary)+'</p><div class="quest-actions">'+btn('ZNAJDŹ CEL  ❯❯','seek',q.at,'gold-btn')+btn('DZIENNIK','nav','story','outline-btn')+'</div></section>'}
function home(){return '<main class="home"><section class="hero-cover"><div class="home-scenery"></div><img src="'+P('goku')+'" alt="Goku • forma normalna"><div class="cover-copy"><div class="eyebrow">DRAGON BALL NEW AGE • REBORN</div><h1>SAGA <em>SAIYAN</em></h1><p>Od pojawienia się Raditza do ostatecznego starcia z Vegetą.</p></div></section><div class="home-grid">'+btn('<strong>▶ KONTYNUUJ</strong><small>Eksploruj Ziemię</small>','nav','world','primary-tile')+btn('<strong>⚔ TRENING</strong><small>Zdobywaj poziomy</small>','train','','primary-tile')+btn('<strong>✦ DRZEWKO</strong><small>Rozwijaj techniki</small>','nav','skills','primary-tile')+btn('<strong>📖 FABUŁA</strong><small>Saga Saiyan</small>','nav','story','primary-tile')+'</div>'+objective()+'</main>'}
function world(){return '<main class="world"><div class="world-title"><div><div class="eyebrow">PLANETA ZIEMIA • SAGA SAIYAN</div><h1>OTWARTY ŚWIAT <span>2.5D</span></h1></div><div class="pill">MAPA 3840 × 2160</div></div><section class="map-panel"><canvas id="worldCanvas" aria-label="Interaktywna mapa Ziemi" tabindex="0"></canvas><div class="map-overlay"><div class="map-status"><b id="map-region">ZIEMIA · DOM GOKU</b><small id="map-location">Ruch dotykiem lub przyciskami</small></div><div class="mini"><div> N </div><strong>✧</strong><span>W</span><span>E</span></div></div><div class="map-bottom"><div class="dpad"><i></i>'+btn('▲','step','up')+'<i></i>'+btn('◀','step','left')+btn('◉','center')+btn('▶','step','right')+'<i></i>'+btn('▼','step','down')+'<i></i></div><div class="zoom">'+btn('+','zoom','in')+btn('−','zoom','out')+btn('◎','center')+'</div></div></section><div class="map-info"><span>🌲 <b>Wolna eksploracja</b> · przeciwnicy regionalni</span><span>⚔ Moc Goku: <b>'+fmt(power())+'</b></span></div>'+objective()+'<section class="places"><h3>ODWIEDŹ LOKACJĘ</h3><div class="place-list">'+D.places.map(p=>btn('<span>'+p.icon+'</span><strong>'+esc(p.name)+'</strong><small>LV '+p.level+'</small>','seek',p.id,'place')).join('')+'</div></section></main>'}
function colorsForBattle(){
 const p=S.battle?.place||'training';return ['canyon','nappa','vegeta','landing'].includes(p)?'desert':['west','home','village'].includes(p)?'forest':p==='roshi'?'coast':p==='kai'?'space':'field';
}
function battleStage(mode='idle',damage=''){
 const b=S.battle,e=enemy(b.enemy),bg=colorsForBattle();
 return '<div class="arena '+bg+' mode-'+mode+'"><div class="arena-sky"><div class="sun"></div><div class="far-mountain"></div><div class="near-mountain"></div><div class="arena-floor"></div></div><div class="energy-lines"></div><div class="aura"></div><img class="fighter hero-sprite" src="'+P('goku',mode==='hit'?'strike':mode==='charge'?'charge':'idle')+'" alt="Goku w walce"><img class="fighter enemy-sprite" src="'+P(e.art,mode==='counter'?'strike':'idle')+'" alt="'+esc(e.name)+'"><div class="impact"></div><div class="energy-beam"></div><div class="damage-label">'+damage+'</div><div class="arena-label"><span>'+esc(loc(b.place).name.toUpperCase())+' · ZIEMIA</span><span>'+esc(e.name.toUpperCase())+'</span></div></div>';
}
function battle(){const b=S.battle;if(!b)return world();let e=enemy(b.enemy),tabs=['Wszystko','Ciosy','Ki','Taktyka','Specjalne'],list=D.skills.filter(m=>(b.category||'Wszystko')==='Wszystko'||m.category===b.category);return '<main class="battle"><div class="fight-hud"><div class="fighter-hud"><b>GOKU · LV '+S.lv+'</b><span>HP '+fmt(S.hp)+' / '+fmt(mhp())+'</span>'+meter(S.hp,mhp())+'<span>KI '+fmt(S.energy)+' / '+fmt(mki())+'</span>'+meter(S.energy,mki(),'ki')+'</div><div class="round">TURA<br><strong>'+b.turn+'</strong></div><div class="fighter-hud opponent"><b>'+esc(e.name.toUpperCase())+'</b><span>HP '+fmt(b.hp)+' / '+fmt(e.hp)+'</span>'+meter(b.hp,e.hp)+'<span>MOC '+fmt(e.power)+'</span></div></div><div class="battle-main"><section class="battle-visual">'+battleStage()+'<div class="battle-meta"><span>🔥 COMBO '+b.combo+'%</span><span>💠 MORALE '+(Date.now()<S.moraleUntil?'5':'100')+'</span><span>⚡ '+fmt(power())+' vs '+fmt(e.power)+'</span></div><p>Walka trwa w tle. Obrażenia są naliczane dopiero po wykonaniu wybranego ataku.</p></section><section class="commands"><h2>WYBIERZ TECHNIKĘ</h2><div class="command-tabs">'+tabs.map(t=>btn(t,'category',t,b.category===t?'active':'')).join('')+'</div><div class="move-grid">'+list.map(m=>{let allowed=canUse(m);return btn('<span>'+esc(m.name)+'</span><small>'+fmt(m.ki)+' KI · opanowanie '+(S.mastery[m.id]||0)+'</small><em>'+esc(m.desc)+'</em>','attack',m.id,allowed?'':'locked',!allowed)}).join('')+'</div>'+btn('ODWRÓT','flee','','outline-btn',!!e.boss)+'<div class="battle-log">'+(b.log||[]).slice(-3).map(x=>'<p>'+esc(x)+'</p>').join('')+'</div></section></div></main>'}
function scene(){const z=S.sequence,frame=z.frames[z.at],b=S.battle;return '<main class="cinema"><div class="cinema-top"><div><b>'+esc(z.moveName)+'</b><span>KADR '+(z.at+1)+' / '+z.frames.length+'</span></div><span>AKCJA W TOKU</span></div>'+battleStage(frame.mode,frame.damage?fmt(frame.damage)+' DMG':'')+'<div class="frame-caption"><div><h2>'+esc(frame.title)+'</h2><p>'+esc(frame.text)+'</p></div><div class="frame-progress">'+z.frames.map((_,i)=>'<i class="'+(i<=z.at?'done':'')+'"></i>').join('')+'</div><div class="frame-actions">'+btn(z.at>=z.frames.length-1?'ZAKOŃCZ ATAK  ❯':'NASTĘPNY KADR  ❯','nextframe','','gold-btn')+btn('POMIŃ','skipframe','','outline-btn')+'</div></div></main>'}
function dialogue(){const z=S.dialog,ln=z.lines[z.at],whom=ln[0],p=(whom.toLowerCase().includes('vegeta')?'vegeta':whom.toLowerCase().includes('nappa')?'nappa':whom.toLowerCase().includes('raditz')?'raditz':whom.toLowerCase().includes('piccolo')?'piccolo':whom.toLowerCase().includes('kaio')?'king':'goku');return '<main class="dialog"><div class="eyebrow">SAGA SAIYAN · '+esc(z.title)+'</div><div class="dialog-canvas"><div class="dialog-landscape"></div><img src="'+P(p)+'" alt="'+esc(whom)+'"><div class="dialog-speaker">'+esc(whom.toUpperCase())+'</div></div><div class="dialog-words"><p>'+esc(ln[1])+'</p><div class="frame-progress">'+z.lines.map((_,i)=>'<i class="'+(i<=z.at?'done':'')+'"></i>').join('')+'</div>'+btn(z.at>=z.lines.length-1?'DALEJ  ❯':'NASTĘPNY DIALOG  ❯','nextdialog','','gold-btn')+'</div></main>'}
function character(){return '<main class="character"><h1>GOKU <span>FORMA PODSTAWOWA</span></h1><div class="char-grid"><div class="character-art"><img src="'+P('goku')+'" alt="Goku w stroju Saiyan Saga"><div>SAIYAN · LV '+S.lv+'<br>MOC '+fmt(power())+'</div></div><section class="stats"><div class="stats-total"><b>POZIOM '+S.lv+'</b><b>WOLNE PUNKTY: '+S.points+'</b></div>'+meter(S.xp,expNeed(),'xp')+Object.entries({strength:['Siła','🥊'],ki:['Energia Ki','🔵'],vitality:['Wytrzymałość','❤️'],speed:['Szybkość','⚡'],luck:['Szczęście','✦']}).map(([k,v])=>'<div class="stat-row"><b>'+v[1]+' '+v[0]+'</b><span>'+stats(k)+'</span>'+btn('+','stat',k,'',S.points<1)+'</div>').join('')+'<div class="notice">Każdy poziom: +5 punktów atrybutów i +3 punkty technik. Transformacje odblokowujesz fabularnie.</div></section></div></main>'}
function skills(){return '<main class="skills"><div class="world-title"><div class="eyebrow">ROZWÓJ POSTACI</div><h1>DRZEWKO TECHNIK</h1></div><div class="skill-count">DOSTĘPNE PUNKTY: <b>'+S.skillPoints+'</b></div><section class="skill-list">'+D.skills.map(m=>{const unlocked=canLearn(m);let rank=S.flags['skill_'+m.id]||0;return '<article class="skill-card"><div class="skill-heading"><b>'+esc(m.name)+'</b><span>'+m.category+'</span></div><p>'+esc(m.desc)+'</p><small>KI: '+m.ki+' · wymagany LV '+m.learn+(m.mentor?' · próba Roshiego':'')+'</small><div>RANGA '+rank+'/5 &nbsp; | &nbsp; WYKONANE: '+(S.mastery[m.id]||0)+'</div>'+btn(!unlocked?'ZABLOKOWANE':rank?'ULEPSZ':'ODKRYJ','learn',m.id,unlocked?'gold-btn':'outline-btn',!unlocked||rank>=5)+'</article>'}).join('')+'</section></main>'}
function journal(){return '<main class="journal"><div class="eyebrow">DRAGON BALL NEW AGE</div><h1>SAGA SAIYAN · DZIENNIK</h1><p>Radzitz, trening u Króla Kaio, przybycie Saiyan, walka Nappy i kolejne etapy pojedynku z Vegetą.</p><div class="chapter-list">'+D.chapters.map((q,i)=>'<article class="'+(i===S.stage?'active':i<S.stage?'done':'locked')+'"><b>'+String(i+1).padStart(2,'0')+' · '+esc(q.title)+'</b><span>'+(i<S.stage?'ZAKOŃCZONE':i===S.stage?'AKTYWNE':'NIEODKRYTE')+'</span><p>'+esc(i<=S.stage?q.summary:'Odkryj wcześniejszy rozdział.')+'</p></article>').join('')+'</div>'+btn('WRÓĆ NA MAPĘ','nav','world','gold-btn')+'</main>'}
function settings(){return '<main class="settings"><h1>USTAWIENIA</h1><p>Dragon Ball New Age — Reborn 1.0 · niezależny silnik, nowa mapa 4K SVG, offline po zbuforowaniu.</p><p>Zapis nowej gry jest osobny i nie usuwa żadnych danych starego dema.</p>'+btn('ZAPISZ GRĘ','save','','gold-btn')+btn('NOWA GRA (RESET TEJ WERSJI)','reset','','outline-btn')+btn('POWRÓT','nav','home','outline-btn')+'</main>'}
function render(){stopScene();let body;
 try{switch(S.screen){case'world':body=world();break;case'battle':body=battle();break;case'cut':body=scene();break;case'dialog':body=dialogue();break;case'character':body=character();break;case'skills':body=skills();break;case'story':body=journal();break;case'settings':body=settings();break;default:body=home()}shell(body);if(S.screen==='world')setupMap();if(S.screen==='cut')scheduleFrame()}
 catch(e){console.error('Game render error',e);ROOT.innerHTML='<main class="error"><h2>Błąd gry</h2><p>'+esc(e.message)+'</p><button data-act="nav" data-key="home">WRÓĆ DO MENU</button></main>'}
}
function getView(){const rc=mapCanvas.getBoundingClientRect();let ratio=2.75/S.zoom;const vw=rc.width*ratio,vh=rc.height*ratio;const focus=worldTarget?.focus||S.pos;camX=clamp(focus.x-vw/2,0,D.world.width-vw);camY=clamp(focus.y-vh/2,0,D.world.height-vh);return {rc,ratio,vw,vh,x:camX,y:camY}}
function drawMap(time){if(S.screen!=='world'||!mapCanvas)return;let rc=mapCanvas.getBoundingClientRect();if(!rc.width||!rc.height)return;let scale=clamp(window.devicePixelRatio||1,1,2.4);const nw=Math.round(rc.width*scale),nh=Math.round(rc.height*scale);if(mapCanvas.width!==nw||mapCanvas.height!==nh){mapCanvas.width=nw;mapCanvas.height=nh}mapContext=mapCanvas.getContext('2d',{alpha:false});if(!mapContext)return;const c=mapContext,v=getView();c.setTransform(scale,0,0,scale,0,0);c.clearRect(0,0,rc.width,rc.height);c.fillStyle='#70ab88';c.fillRect(0,0,rc.width,rc.height);
 if(mapLoaded)c.drawImage(mapAsset,v.x,v.y,v.vw,v.vh,0,0,rc.width,rc.height);
 else{let grd=c.createLinearGradient(0,0,rc.width,rc.height);grd.addColorStop(0,'#438d66');grd.addColorStop(.6,'#b3c780');grd.addColorStop(1,'#c89163');c.fillStyle=grd;c.fillRect(0,0,rc.width,rc.height)}
 const px=(x)=>(x-v.x)/v.ratio,py=(y)=>(y-v.y)/v.ratio;
 for(const p of D.places){let x=px(p.x),y=py(p.y);if(x< -90||x>rc.width+90||y< -70||y>rc.height+70)continue;
 let active=chapter().at===p.id;
 c.save();c.shadowColor=active?'#ffda47':'#020f35';c.shadowBlur=active?22:8;
 c.fillStyle=active?'#6f2543ee':'#081c37e6';c.strokeStyle=active?'#ffe98b':'#a9d8ed';c.lineWidth=2.4;c.beginPath();c.arc(x,y,active?25:20,0,Math.PI*2);c.fill();c.stroke();c.restore();
 c.fillStyle=active?'#ffe96d':'#e8faff';c.font='900 21px system-ui';c.textAlign='center';c.fillText(p.icon,x,y+7);
 let label=p.name,w=clamp(c.measureText(label).width+25,90,179);
 c.fillStyle='#071a36e8';c.beginPath();if(c.roundRect)c.roundRect(x-w/2,y+28,w,28,8);else c.rect(x-w/2,y+28,w,28);c.fill();c.strokeStyle=active?'#ffcf64':'#4c8fb4';c.stroke();c.font='bold 13px system-ui';c.fillStyle='#fff8df';c.fillText(label,x,y+47)}
 let x=px(S.pos.x),y=py(S.pos.y)+Math.sin(time/260)*2;
 if(worldTarget&&worldTarget.x!==undefined){const tx=px(worldTarget.x),ty=py(worldTarget.y);c.strokeStyle='#f8dc86bb';c.setLineDash([5,9]);c.lineWidth=2;c.beginPath();c.moveTo(x,y);c.lineTo(tx,ty);c.stroke();c.setLineDash([])}
 c.fillStyle='#0836579c';c.beginPath();c.ellipse(x,y+20,25,9,0,0,Math.PI*2);c.fill();c.strokeStyle='#35e9ff';c.lineWidth=3;c.beginPath();c.ellipse(x,y+20,26,11,0,0,Math.PI*2);c.stroke();
 if(heroImage.complete&&heroImage.naturalWidth>0)c.drawImage(heroImage,x-36,y-104,72,119);
 else{c.fillStyle='#f88d31';c.strokeStyle='#101e3b';c.lineWidth=3;c.beginPath();c.arc(x,y-37,18,0,Math.PI*2);c.fill();c.stroke();}
 c.fillStyle='#fff2a4';c.strokeStyle='#172445';c.lineWidth=3.5;c.textAlign='center';c.font='900 15px system-ui';c.strokeText('LV '+S.lv,x,y-107);c.fillText('LV '+S.lv,x,y-107);
 if(!mapLoaded){c.textAlign='left';c.fillStyle='#fff';c.font='bold 14px system-ui';c.fillText('ŁADOWANIE MAPY 4K...',16,24)}
 const near=nearestPlace(),el=document.getElementById('map-region');if(el)el.textContent='ZIEMIA · '+(near?near.name.toUpperCase():'DZIKIE TERENY');const pos=document.getElementById('map-location');if(pos)pos.textContent='X '+Math.round(S.pos.x)+' · Y '+Math.round(S.pos.y);
}
const heroImage=new Image();heroImage.onload=()=>{if(S.screen==='world')drawMap(performance.now())};heroImage.src=P('goku');
function nearestPlace(){let near=null,best=Infinity;for(const p of D.places){let dis=Math.hypot(p.x-S.pos.x,p.y-S.pos.y);if(dis<best){near=p;best=dis}}return best<250?near:null}
function setupMap(){mapCanvas=document.getElementById('worldCanvas');if(!mapCanvas)return;const useCoord=(e)=>{const v=getView();return {x:clamp(v.x+(e.clientX-v.rc.left)*v.ratio,0,D.world.width),y:clamp(v.y+(e.clientY-v.rc.top)*v.ratio,0,D.world.height)}};
 mapCanvas.addEventListener('pointerdown',e=>{dragging={sx:e.clientX,sy:e.clientY,mx:S.pos.x,my:S.pos.y,panX:camX,panY:camY};mapCanvas.setPointerCapture(e.pointerId)});
 mapCanvas.addEventListener('pointerup',e=>{if(!dragging)return;let move=Math.hypot(e.clientX-dragging.sx,e.clientY-dragging.sy);dragging=null;if(move>12)return;const wp=useCoord(e);let marked=D.places.find(p=>Math.hypot(p.x-wp.x,p.y-wp.y)<90);if(marked){worldTarget={x:marked.x,y:marked.y,place:marked.id};if(Math.hypot(S.pos.x-marked.x,S.pos.y-marked.y)<155)visit(marked.id)}else worldTarget={x:wp.x,y:wp.y};drawMap(performance.now())});
 mapCanvas.addEventListener('pointermove',e=>{if(!dragging||!e.buttons)return;let dx=e.clientX-dragging.sx,dy=e.clientY-dragging.sy;if(Math.hypot(dx,dy)>12){worldTarget={focus:{x:clamp(dragging.mx-dx*2.75/S.zoom,0,D.world.width),y:clamp(dragging.my-dy*2.75/S.zoom,0,D.world.height)}};drawMap(performance.now())}});
 mapCanvas.addEventListener('pointercancel',()=>{dragging=null});
 window.requestAnimationFrame(mapLoop);
}
function mapLoop(t){if(S.screen!=='world')return;if(t-lastPaint>48){let tgt=worldTarget;if(tgt&&tgt.x!==undefined){let dx=tgt.x-S.pos.x,dy=tgt.y-S.pos.y,dist=Math.hypot(dx,dy);if(dist<13){let id=tgt.place;worldTarget=null;if(id){visit(id);if(S.screen!=='world')return}}else{let speed=clamp(4.0+stats('speed')*.42,5,14)*(Math.min(38,Math.max(1,(t-lastPaint)/20)));S.pos.x+=dx/dist*Math.min(speed,dist);S.pos.y+=dy/dist*Math.min(speed,dist);if(Math.random()<.027)randomEncounter()} }lastPaint=t;drawMap(t)}animation=window.requestAnimationFrame(mapLoop)}
function stopWalk(){clearInterval(moveInterval);moveInterval=null;worldTarget=null;dragging=null}
function walk(dx,dy){worldTarget=null;S.pos.x=clamp(S.pos.x+dx*65,0,D.world.width);S.pos.y=clamp(S.pos.y+dy*65,0,D.world.height);if(S.screen==='world'){drawMap(performance.now());if(Math.random()<.08)randomEncounter();let p=nearestPlace();if(p&&chapter().at===p.id&&Math.hypot(p.x-S.pos.x,p.y-S.pos.y)<110)toast('Dotknij znacznika misji: '+p.name)}}
function seek(id){let p=loc(id);if(!p)return;S.screen='world';render();worldTarget={x:p.x,y:p.y,place:p.id};toast('Kierunek: '+p.name)}
function visit(id){let p=loc(id),q=chapter();if(!p)return;if(q.at===id){if(S.lv<q.minLevel){toast('Misja wymaga minimum LV '+q.minLevel+'. Najpierw trenuj!');return}S.dialog={lines:q.lines,at:0,title:q.title,mission:true};S.screen='dialog';render();return}
 if(id==='home'||id==='village'){S.hp=mhp();S.energy=mki();save();toast('Odpoczynek: HP i KI odnowione.');render();return}
 if(id==='roshi'){if(S.lv<4){toast('Mistrz Roshi: potrzebujesz co najmniej LV 4.');return}startBattle('roshi',false,'roshi');return}
 if(id==='training'||id==='west'||id==='city'){startBattle(id==='west'?'pig':id==='city'?'scout':'bandit',false,id);return}
 if(id==='canyon'||id==='nappa'||id==='landing'){startBattle(id==='canyon'?'saibawild':id==='nappa'?'scout':'bandit',false,id);return}
 toast(p.name+' · lokacja do dalszej eksploracji')
}
function randomEncounter(){if(S.screen!=='world')return;let p=nearestPlace();if(p&&['home','city','village','roshi','snake','kai'].includes(p.id))return;let x=S.pos.x;let e=x<1300?'pig':x<2300?'bandit':x<2700?'scout':'saibawild';if(Math.random()<.28)startBattle(e,false,p?.id||'training')}
function train(){startBattle('bandit',false,'training')}
function beginMission(){let q=chapter();visit(q.at)}
function nextDialogue(){let d=S.dialog;if(!d)return;if(d.at<d.lines.length-1){d.at++;render();return}S.dialog=null;if(d.mission){let q=chapter();if(q.kind==='battle')startBattle(q.enemy,true,q.at);else{S.stage=clamp(S.stage+1,0,D.chapters.length-1);award(120+S.stage*40,55);save();S.screen='world';render();toast('Rozdział ukończony! +EXP +monety')}}else{S.screen='world';render()}}
function startBattle(id,mission=false,place='training'){if(!enemy(id))return;stopWalk();let e=enemy(id);S.battle={enemy:id,place,mission,hp:e.hp,turn:1,combo:0,category:'Wszystko',log:['Rozpoczęto walkę z '+e.name+'.']};S.energy=Math.max(S.energy,Math.min(mki(),18));S.screen='battle';render()}
function canLearn(m){return S.lv>=m.learn&&(!m.mentor||S.flags.roshi)&&(!m.story||S.stage>=m.story)&&S.skillPoints>0}
function canUse(m){return (m.id==='combo'||m.id==='ki'||m.id==='guard'||(S.flags['skill_'+m.id]||0)>0)&&S.energy>=m.ki}
function learn(id){const m=D.skills.find(x=>x.id===id);if(!m||!canLearn(m))return;const k='skill_'+id;S.flags[k]=(S.flags[k]||0)+1;S.skillPoints--;save();render();toast('Odblokowano/ulepszono: '+m.name)}
function prepareAttack(id){let m=D.skills.find(x=>x.id===id);if(!m||!S.battle||!canUse(m))return;const b=S.battle,e=enemy(b.enemy);S.energy-=m.ki;S.mastery[id]=(S.mastery[id]||0)+1;
 let r=S.flags['skill_'+id]||0,morale=Date.now()<S.moraleUntil?.65:1,critical=Math.random()<(stats('luck')*.007+.09)*morale;
 let damage=m.id==='guard'?0:Math.max(8,Math.round((m.base+stats('strength')*8+S.lv*12)*(1+Math.floor(S.mastery[id]/10)*.06+r*.12)*(1+b.combo/230)*(critical?1.55:1)-(e.def*2.1)));
 let avoid=Math.random()<clamp(.10+stats('speed')*.012,0,.50),counter=Math.random()<.16;
 let received=m.id==='guard'?Math.round(e.atk*.22):avoid?0:Math.max(5,Math.round((e.atk+e.lv*4-stats('vitality')*3)*(counter?1.17:.78)));
 if(power()>e.power*2)received=Math.round(received*.65);
 if(m.id==='kaioken'){S.hp=Math.max(1,S.hp-55);damage=Math.round(damage*1.15)}
 const frames=[
 {mode:'idle',title:'NAPRZECIW SIEBIE',text:'Goku mierzy siłę przeciwnika.'},
 {mode:m.id==='guard'?'counter':'charge',title:m.id==='guard'?'OSŁONA':'KONCENTRACJA',text:m.id==='guard'?'Postawa obronna osłabia uderzenia.':'Energia zaczyna drżeć wokół Goku.'},
 {mode:'dash',title:'BŁYSKAWICZNY DOSKOK',text:'Wojownicy znikają w powidoku.'},
 {mode:m.category==='Ki'||m.category==='Specjalne'?'beam':'hit',title:m.id==='kame'?'KAMEHAMEHA!':m.id==='guard'?'BLOK!':m.id==='kaioken'?'KAIOKEN!':'POTĘŻNE TRAFIENIE',text:m.id==='guard'?'Goku osłania się i odzyskuje Ki.':m.category==='Ki'?'Wiązka energii rozświetla arenę.':'Cios dosięga przeciwnika.',damage},
 {mode:'crash',title:'ODRZUT I WSTRZĄS',text:damage>0?'Fala uderzeniowa wzburza teren bitwy.':'Przeciwnik szuka możliwości kontrataku.',damage},
 {mode:received>0?'counter':'dash',title:received>0?'KONTRA WROGA':'UNIK!',text:received>0?e.name+' kontratakuje!':'Goku unika kontrataku.',damage:received>0?received:0}
 ];
 if(damage>b.hp&&damage>0)frames.push({mode:'crash',title:'FINISHER!',text:e.name+' zostaje pokonany!',damage});
 S.sequence={at:0,moveName:m.name,frames,consequence:{damage,received,move:id,critical}};S.screen='cut';render()
}
function stopScene(){if(sceneTimer){clearTimeout(sceneTimer);sceneTimer=null}}
function scheduleFrame(){stopScene();if(S.screen==='cut'&&S.sequence)sceneTimer=setTimeout(()=>advanceFrame(),1200)}
function advanceFrame(skip=false){stopScene();let z=S.sequence;if(!z)return;if(!skip&&z.at<z.frames.length-1){z.at++;render();return}const b=S.battle;if(!b){S.sequence=null;S.screen='world';render();return}
 const c=z.consequence;b.hp=Math.max(0,b.hp-c.damage);b.log.push(z.moveName+' → '+fmt(c.damage)+' DMG');b.combo=clamp(b.combo+(c.move==='combo'?19:c.move==='dash'?24:-10),0,100);
 if(c.move==='guard')S.energy=clamp(S.energy+30,0,mki());
 S.sequence=null;if(b.hp<=0){victory();return}
 S.hp=Math.max(0,S.hp-c.received);S.energy=clamp(S.energy+11,0,mki());b.turn++;if(c.received)b.log.push('Kontra '+fmt(c.received)+' HP');if(S.hp<=0){defeat();return}S.screen='battle';save();render()}
function victory(){const b=S.battle,e=enemy(b.enemy);const lv=award(e.xp,e.coins);if(b.enemy==='roshi')S.flags.roshi=true;if(b.mission){S.stage=Math.min(S.stage+1,D.chapters.length-1);if(D.chapters[S.stage-1]?.unlocks)for(const v of D.chapters[S.stage-1].unlocks)S.flags['skill_'+v]=Math.max(1,S.flags['skill_'+v]||0)}
 S.hp=clamp(S.hp+Math.round(mhp()*.25),1,mhp());S.energy=clamp(S.energy+Math.round(mki()*.4),0,mki());S.battle=null;S.screen='world';save();render();toast('ZWYCIĘSTWO! +'+fmt(e.xp)+' EXP, +'+fmt(e.coins)+' Zeni'+(lv?' · POZIOM +'+lv:''))}
function defeat(){const b=S.battle;S.battle=null;S.hp=Math.ceil(mhp()*.6);S.energy=Math.ceil(mki()*.5);S.pos={x:820,y:1450};S.moraleUntil=Date.now()+3600000;S.screen='world';save();render();toast('Porażka — powrót do domu. Morale obniżone na 1 godzinę.')}
function flee(){if(!S.battle||enemy(S.battle.enemy).boss)return;S.battle=null;S.screen='world';save();render();toast('Udało się wycofać z walki.')}
ROOT.addEventListener('click',e=>{let el=e.target.closest('[data-act]');if(!el||el.disabled)return;const a=el.dataset.act,k=el.dataset.key;try{switch(a){
 case'nav':screen(k);break;case'save':save();toast('Zapisano grę');break;
 case'find':case'seek':seek(k);break;case'objective':beginMission();break;
 case'train':train();break;case'visit':visit(k);break;
 case'step':{const ds={up:[0,-1],down:[0,1],left:[-1,0],right:[1,0]};if(ds[k])walk(...ds[k]);break}
 case'zoom':S.zoom=clamp(S.zoom*(k==='in'?1.3:1/1.3),.72,2.7);if(S.screen==='world')drawMap(performance.now());break;
 case'center':worldTarget=null;if(S.screen==='world')drawMap(performance.now());break;
 case'category':S.battle.category=k;render();break;case'attack':prepareAttack(k);break;case'nextframe':advanceFrame();break;case'skipframe':advanceFrame(true);break;
 case'nextdialog':nextDialogue();break;case'learn':learn(k);break;case'flee':flee();break;
 case'stat':if(S.points>0&&k in S.stats){S.stats[k]++;S.points--;S.hp=Math.min(mhp(),S.hp+20);save();render()}break;
 case'reset':if(confirm('Usunąć wyłącznie zapis nowej wersji REBORN?')){S=initial();S.hp=mhp();S.energy=mki();save();screen('home')}break;
 }}catch(ex){console.error('UI action failed',ex);toast('Błąd: '+ex.message)}});
let hold=null;ROOT.addEventListener('pointerdown',e=>{const t=e.target.closest('[data-act="step"]');if(!t)return;const k=t.dataset.key;const ds={up:[0,-1],down:[0,1],left:[-1,0],right:[1,0]};clearInterval(hold);hold=setTimeout(()=>{hold=setInterval(()=>{if(S.screen==='world')walk(...ds[k])},100)},280)});
for(const name of ['pointerup','pointercancel','pointerleave'])ROOT.addEventListener(name,()=>{clearTimeout(hold);clearInterval(hold);hold=null});
window.addEventListener('keydown',e=>{if(S.screen!=='world'||e.target?.tagName==='INPUT')return;let key={ArrowUp:[0,-1],ArrowDown:[0,1],ArrowLeft:[-1,0],ArrowRight:[1,0]}[e.key];if(key){e.preventDefault();walk(...key)}})
window.addEventListener('pagehide',save);
window.addEventListener('resize',()=>{if(S.screen==='world')drawMap(performance.now())});
render();
if('serviceWorker' in navigator)window.addEventListener('load',()=>navigator.serviceWorker.register('./sw.js').catch(()=>{}));
window.DBNA_TEST={getState:()=>({...S}),navigate:screen,visit,startBattle,advanceFrame,drawMap};
})();