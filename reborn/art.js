/* New, consistent in-game Saiyan Saga vector actors. No external image requests. */
"use strict";
const DBArt=(()=>{
 const INK="#11182b",CACHE={};
 const gradients='<defs><linearGradient id="cloth" x1="0" y1="0" x2=".9" y2="1"><stop stop-color="#ffcc64"/><stop offset=".3" stop-color="var(--cloth)"/><stop offset=".85" stop-color="var(--cloth)"/><stop offset="1" stop-color="#713c3b"/></linearGradient><linearGradient id="skin" x1="0" y1="0" x2=".8" y2="1"><stop stop-color="#ffe6b5"/><stop offset=".4" stop-color="var(--skin)"/><stop offset="1" stop-color="#a76a60"/></linearGradient><linearGradient id="hair" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#526078"/><stop offset=".4" stop-color="#1a2237"/><stop offset="1" stop-color="#080b19"/></linearGradient></defs>';
 const costumes={
 goku:['#f58023','#2357a5','#eeb080'],vegeta:['#2f4eac','#f7ead2','#d99f7a'],
 raditz:['#513f83','#f5e5c4','#dba87b'],nappa:['#283b82','#e5d3ae','#dca376'],
 saiba:['#6fae49','#326b47','#89c46c'],piccolo:['#7952a3','#d6dada','#82bd65'],
 roshi:['#eee6d7','#e7bb73','#dca77c'],king:['#c83c48','#242f56','#81bbef'],
 scout:['#2e4687','#dcd2b6','#db9d77'],yamcha:['#de7a35','#284c92','#d5a178']
 };
 function path(d,fill,stroke=INK,w=10){return '<path d="'+d+'" fill="'+fill+'" stroke="'+stroke+'" stroke-width="'+w+'" stroke-linejoin="round" stroke-linecap="round"/>'}
 function get(kind,pose='idle'){
 const key=kind+':'+pose;if(CACHE[key])return CACHE[key];
 const cfg=costumes[kind]||costumes.scout,cloth=cfg[0],trim=cfg[1],flesh=cfg[2],armor=['vegeta','nappa','raditz','scout'].includes(kind),alien=['piccolo','saiba'].includes(kind);
 let shapes='',hair='';
 shapes+=path('M167 436L136 623 117 704 185 713 221 555 254 564 283 716 358 707 322 512 305 436Z','url(#cloth)');
 shapes+=path('M109 695L194 691 196 745 72 745Z',trim);
 shapes+=path('M280 698L360 688 383 744 283 747Z',trim);
 shapes+=path('M151 537l51 22-40 112M285 555l44 116','none','#a44b40',12);
 shapes+=path('M162 293Q112 286 110 358L135 490Q245 551 350 486L368 358Q360 294 307 292Z','url(#cloth)');
 shapes+=path('M151 306L190 358 292 358 319 306',trim);
 shapes+=path('M137 464Q236 491 353 462L341 521Q246 550 133 508Z',trim);
 shapes+=path('M146 316Q91 294 75 364L52 502 96 527 169 389Z','url(#skin)');
 shapes+=path('M340 311Q396 309 411 377L458 510 411 534 330 398Z','url(#skin)');
 shapes+=path('M51 483l68 29-21 49-70-22Z',trim);
 shapes+=path('M404 513l68-34 28 51-77 34Z',trim);
 shapes+=path('M30 528Q4 550 22 590 63 616 105 574L92 537Z','url(#skin)');
 shapes+=path('M423 551Q451 518 486 540L499 581Q462 611 432 578Z','url(#skin)');
 if(armor){shapes+=path('M147 323L191 343H287L324 316 351 360 329 469H158L129 366Z','#f3e6cc');shapes+=path('M184 351l18 95M284 350l-19 95','none','#a99797',10);shapes+=path('M150 311l-65 36 16 53 48-15M321 312l71 33 1 54-49-16',trim)}
 shapes+=path('M204 292L202 329 278 326 274 284Z','url(#skin)');
 shapes+=path('M167 175Q218 114 304 179L318 252Q296 314 247 325Q193 310 161 259Z','url(#skin)');
 shapes+=path('M161 235q-35-14-30 20 10 28 38 32','url(#skin)');
 shapes+=path('M313 235q29-13 34 12-5 33-33 36','url(#skin)');
 if(kind==='vegeta')hair='M153 244L114 106 151 134 171 50 203 114 237 22 266 104 304 61 322 151 361 129 336 248 287 196 237 190 188 223Z';
 else if(kind==='raditz')hair='M141 198L75 230 46 357 91 329 55 462 103 399 74 542 148 463 170 586 201 472 273 535 295 453 356 522 331 388 390 409 338 281 351 125 282 155 226 37 178 142 136 91Z';
 else if(!['piccolo','saiba','roshi','nappa','king'].includes(kind))hair='M149 229L108 201 137 174 84 177 140 131 106 85 170 116 178 25 228 92 266 29 280 106 338 62 322 129 385 117 351 173 385 207 309 207 283 194 240 211 197 189 173 224Z';
 if(hair){shapes+=path(hair,'url(#hair)');shapes+=path('M157 162l32-39 13 46M250 132l22-43 8 68M325 160l25-34','none','#66748f',8)}
 if(kind==='saiba'){shapes+=path('M155 204L141 134 172 157 188 98 217 155 236 76 260 143 299 101 313 160 339 146 325 213Z','#6fa946');}
 if(kind==='piccolo'){shapes+=path('M174 170l-34-59 43 27M290 166l34-57-40 30','#9acb66');shapes+=path('M177 191l-9-55M300 190l6-51','none','#2b7d50',9)}
 if(kind==='king'){shapes+=path('M198 153l-22-71M284 153l19-70','none',INK,12);shapes+='<circle cx="176" cy="80" r="12" fill="#d8c766"/><circle cx="304" cy="80" r="12" fill="#d8c766"/>'}
 shapes+=path('M187 234l41 13M260 247l41-13','none',INK,14);
 shapes+=path('M189 258l34 4M262 261l34-6','none','#fff4df',10);
 shapes+=path('M209 253l8 11M277 253l-8 11','none',INK,8);
 shapes+=path('M245 264l-11 18 16 4','none','#96594e',6);
 shapes+=path('M214 291q30 17 62-3','none',kind==='saiba'?'#902b35':'#7b3438',8);
 if(kind==='nappa')shapes+=path('M190 189q49-32 107-1M211 289q29 31 62 2','none','#643831',13);
 if(kind==='roshi'){shapes+=path('M184 241h106','none','#202439',28);shapes+=path('M190 287q47 79 102-6l-32 58-39-4Z','#f0f2e6')}
 if(kind==='king'){shapes+=path('M184 249h105','none',INK,30)}
 if(kind==='saiba'){shapes+=path('M188 269l32 10M264 275l28-10','none','#b42632',11)}
 if(armor)shapes+=path('M168 340L187 431M305 345L283 430','none','#cebbb0',10);
 const poseTransform=pose==='strike'?'translate(18 -12) rotate(-8 230 410)':pose==='charge'?'translate(1 -9) scale(1.03)':'';
 const svg='<svg xmlns="http://www.w3.org/2000/svg" width="512" height="768" viewBox="0 0 512 768"><title>'+kind+' '+pose+'</title>'+gradients+'<g style="--cloth:'+cloth+';--skin:'+flesh+';" transform="'+poseTransform+'">'+shapes+'</g></svg>';
 const data='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(svg);
 CACHE[key]=data;return data;
 }
 return {get};
})();