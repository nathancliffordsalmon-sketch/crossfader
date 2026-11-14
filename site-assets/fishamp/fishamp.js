/* FISHAMP \u00b7 Like The Fish AMP: fish-themed TRON player + 8 full-screen visualizers.
 Mount: <div id="fishamp"></div><script src=".../site-assets/fishamp/fishamp.js"></script>
 Game music (C64 remixes, Kevin MacLeod moods, MOBYGRATIS) comes from the shared site-assets/rko/gm.js loader. */
(function(){var R=document.getElementById('fishamp');if(!R){R=document.createElement('div');R.id='fishamp';(document.currentScript&&document.currentScript.parentNode||document.body).insertBefore(R,document.currentScript);}
if(R.getAttribute('data-ready'))return;R.setAttribute('data-ready','1');
if(!document.getElementById('fishamp-fonts')){var l=document.createElement('link');l.id='fishamp-fonts';l.rel='stylesheet';l.href='https://fonts.googleapis.com/css2?family=Orbitron:wght@500;700;900&family=Share+Tech+Mono&family=Cormorant+Garamond:ital,wght@0,600;1,500&display=swap';document.head.appendChild(l);}
var st=document.createElement('style');st.textContent="@keyframes floor{to{background-position:0 60px}}@keyframes marq{to{transform:translateX(-100%)}}#fishamp{--cy:#00eaff;--cy2:#5ff6ff;--sal:#ff7a59;--pink:#ff3fb4;--bg:#01060d;--panel:#03101c}#fishamp,#fishamp *{box-sizing:border-box}#fishamp{margin:0;min-height:100%;background:var(--bg);color:#bfefff;font-family:\"Share Tech Mono\",ui-monospace,monospace;overflow-x:hidden;display:flex;flex-direction:column;align-items:center;padding:24px 10px 60px;position:relative;isolation:isolate;overflow:hidden;border-radius:18px;max-width:none}#fishamp .amp::after,#fishamp::before{content:\"\";position:absolute;pointer-events:none}#fishamp::before{inset:0;background:radial-gradient(ellipse at 50%0,#003b5c55,transparent 60%),radial-gradient(ellipse at 50% 100%,#ff7a5922,transparent 55%);z-index:-2}#fishamp .floor{position:absolute;left:-50%;right:-50%;bottom:-10vh;height:55vh;z-index:-1;pointer-events:none;background-image:linear-gradient(#00eaff30 1px,transparent 1px),linear-gradient(90deg,#00eaff30 1px,transparent 1px);background-size:60px 60px;transform:perspective(500px) rotateX(62deg);transform-origin:50% 100%;animation:floor 3s linear infinite;-webkit-mask-image:linear-gradient(transparent,#000 60%);mask-image:linear-gradient(transparent,#000 60%)}#fishamp .amp{width:min(900px,100%);background:linear-gradient(180deg,#041624,#020b14 60%,#03111d);border:1px solid #00eaff55;border-radius:16px;box-shadow:0 0 0 1px #00eaff22 inset,0 0 40px #00eaff33,0 0 120px #00eaff14;padding:14px 16px 16px;position:relative}#fishamp .amp::after{inset:6px;border-radius:12px;border:1px solid #ff7a5922}#fishamp .titlebar{display:flex;align-items:center;gap:12px;margin-bottom:12px}#fishamp .titlebar svg{flex:none;filter:drop-shadow(0 0 6px var(--sal))}#fishamp .titlebar h1{margin:0;font-family:Orbitron,sans-serif;font-weight:900;letter-spacing:.18em;font-size:clamp(15px,3.2vw,24px);color:#e9fdff;text-shadow:0 0 6px var(--cy),0 0 18px var(--cy)}#fishamp .titlebar h1 b{color:var(--sal);text-shadow:0 0 6px var(--sal),0 0 18px var(--sal)}#fishamp .titlebar .ver{margin-left:auto;font-size:11px;color:#6fd8e8;opacity:.75;letter-spacing:.1em;text-align:right}#fishamp .lcd{display:grid;grid-template-columns:auto 1fr;gap:12px;align-items:stretch;margin-bottom:10px}#fishamp .info,#fishamp .time{background:#000c14;border:1px solid #00eaff44;border-radius:8px;display:flex;justify-content:center}#fishamp .time{font-size:40px;line-height:1;padding:8px 14px;color:var(--cy2);text-shadow:0 0 8px var(--cy);min-width:150px;text-align:center;align-items:center;gap:8px}#fishamp .time .st{font-size:14px;color:var(--sal);text-shadow:0 0 6px var(--sal)}#fishamp .info{padding:8px 12px;overflow:hidden;flex-direction:column;gap:6px;min-width:0}#fishamp .marq{white-space:nowrap;overflow:hidden;font-size:17px;color:#e6fcff;text-shadow:0 0 6px var(--cy)}#fishamp .marq span{display:inline-block;padding-left:100%;animation:marq 16s linear infinite}#fishamp .chips{display:flex;gap:6px;flex-wrap:wrap}#fishamp .chip{font-size:10px;letter-spacing:.12em;padding:2px 7px;border-radius:4px;border:1px solid #00eaff44;color:#7fe9f7}#fishamp .chip.on{background:#00eaff22;color:#dffcff;border-color:var(--cy)}#fishamp .chip.sal{border-color:#ff7a5966;color:#ffb39f}#fishamp .tank{position:relative;border-radius:10px;overflow:hidden;border:1px solid #00eaff55;box-shadow:0 0 18px #00eaff33 inset;cursor:zoom-in;background:#000}#fishamp .tank canvas{display:block;width:100%;height:300px}#fishamp .tank .hint{position:absolute;right:10px;bottom:8px;font-size:11px;color:#bff;opacity:.6;letter-spacing:.1em;pointer-events:none}#fishamp .seek{margin:12px 0 4px;width:100%}#fishamp input[type=range]{-webkit-appearance:none;appearance:none;background:0 0;width:100%;height:18px;cursor:pointer}#fishamp input[type=range]::-webkit-slider-runnable-track{height:6px;border-radius:3px;background:linear-gradient(90deg,#00eaff55,#003a55);border:1px solid #00eaff55}#fishamp input[type=range]::-moz-range-track{height:6px;border-radius:3px;background:linear-gradient(90deg,#00eaff55,#003a55);border:1px solid #00eaff55}#fishamp input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;width:22px;height:14px;margin-top:-5px;border-radius:7px 3px 3px 7px;background:var(--sal);box-shadow:0 0 10px var(--sal);border:0}#fishamp input[type=range]::-moz-range-thumb{width:22px;height:14px;border-radius:7px 3px 3px 7px;background:var(--sal);box-shadow:0 0 10px var(--sal);border:0}#fishamp .controls{display:flex;flex-wrap:wrap;gap:8px;align-items:center;margin-top:8px}#fishamp .btn{font-family:Orbitron,sans-serif;font-weight:700;font-size:14px;color:#dffcff;background:linear-gradient(#06263a,#031522);border:1px solid #00eaff66;border-radius:8px;padding:9px 13px;cursor:pointer;text-shadow:0 0 6px var(--cy);box-shadow:0 0 10px #00eaff22;transition:.15s;min-width:44px}#fishamp .btn:hover{border-color:var(--cy);box-shadow:0 0 16px #00eaff66}#fishamp .btn.tog.on{background:#00eaff2a;border-color:var(--cy)}#fishamp .btn.dive{margin-left:auto;color:#fff;border-color:#ff7a59aa;background:linear-gradient(#3a1408,#1a0803);text-shadow:0 0 8px var(--sal);box-shadow:0 0 14px #ff7a5944;letter-spacing:.08em}#fishamp .btn.dive:hover{box-shadow:0 0 22px #ff7a59aa;border-color:var(--sal)}#fishamp .pl header,#fishamp .pl li,#fishamp .vol{display:flex;align-items:center}#fishamp .vol{gap:6px;font-size:12px;color:#7fe9f7;min-width:150px}#fishamp .vol input{width:110px}#fishamp .pl{margin-top:14px;border:1px solid #00eaff44;border-radius:10px;background:#000a12;overflow:hidden}#fishamp .pl header{justify-content:space-between;padding:8px 12px;border-bottom:1px solid #00eaff33;font-family:Orbitron,sans-serif;font-size:12px;letter-spacing:.2em;color:var(--cy2)}#fishamp .pl header small{font-family:\"Share Tech Mono\";letter-spacing:.05em;color:#7fc9d6;font-size:11px}#fishamp .pl ol{list-style:none;margin:0;padding:4px 0;max-height:220px;overflow:auto}#fishamp .pl li{gap:10px;padding:6px 12px;cursor:pointer;font-size:14px;color:#9fdcea}#fishamp .pl li:hover{background:#00eaff14}#fishamp .pl li.cur{color:#fff;background:linear-gradient(90deg,#ff7a5933,transparent);text-shadow:0 0 6px var(--sal)}#fishamp .pl li .n{color:#4fb6c8;width:24px}#fishamp .pl li .nm{flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}#fishamp .pl li .x{opacity:.4;padding:0 4px}#fishamp .pl li .x:hover{opacity:1;color:var(--sal)}#fishamp .drop{padding:10px 12px;font-size:12px;color:#6fb8c6;border-top:1px dashed #00eaff33}#fishamp.dragging .amp{box-shadow:0 0 0 2px var(--sal),0 0 60px #ff7a5977}#fishamp .gmrow,#fishamp .qp{gap:8px;align-items:center;border-radius:10px}#fishamp .qp{display:flex;margin:0 0 10px;padding:6px 8px;border:1px solid #ff7a5966;background:#0a0606}#fishamp .gmrow b,#fishamp .qp b{font-family:Orbitron,sans-serif;font-size:10px;letter-spacing:.2em;color:#ff9b7f;white-space:nowrap}#fishamp .gmrow select,#fishamp .qp select,#fishamp .sprow input,#fishamp .sprow select{flex:1;min-width:0;font-family:\"Share Tech Mono\",monospace;font-size:14px;padding:6px 8px;border-radius:8px;background:#021320;color:#dffcff;border:1px solid #ff7a5966}#fishamp .qp .btn{font-size:12px;padding:7px 12px}#fishamp .gmrow{display:none;flex-wrap:wrap;margin-top:12px;padding:10px 12px;border:1px solid #00eaff44;background:#000a12}#fishamp .gmrow.on{display:flex}#fishamp .gmrow b{font-size:11px;text-shadow:0 0 6px #ff7a59}#fishamp .gmrow select,#fishamp .sprow input,#fishamp .sprow select{flex:1 1 170px;padding:8px;border:1px solid #00eaff55}#fishamp .gmrow .btn{font-size:12px}#fishamp .gmcred{display:none;margin-top:6px;font-size:12px;line-height:1.55;color:#8fc9d6}#fishamp #fs.open,#fishamp .gmcred.on{display:block}#fishamp .gmcred a{color:#5ff6ff}#fishamp .gmcred b{color:#fff}#fishamp .sprow{display:flex;flex-wrap:wrap;gap:8px;align-items:center;margin-top:12px;padding:10px 12px;border:1px solid #1ed76055;border-radius:10px;background:#000a12}#fishamp .sprow b{font-family:Orbitron,sans-serif;font-size:11px;letter-spacing:.2em;color:#1ed760;text-shadow:0 0 6px #1ed76088;white-space:nowrap}#fishamp .sprow input,#fishamp .sprow select{border:1px solid #1ed76055}#fishamp .sprow .btn{font-size:12px;border-color:#1ed76088}#fishamp .sprow .btn.on{background:#1ed76033;border-color:#1ed760}#fishamp .spembed{flex-basis:100%}#fishamp .spembed iframe{display:block;border-radius:12px}#fishamp .spmsg{flex-basis:100%;font-size:12px;color:#9fdcb4;line-height:1.5}#fishamp .scenes{display:flex;flex-wrap:wrap;gap:6px;margin-top:12px}#fishamp .scenes button{font-family:\"Share Tech Mono\";font-size:12px;color:#9fe6f2;background:#021320;border:1px solid #00eaff33;border-radius:20px;padding:5px 11px;cursor:pointer}#fishamp .scenes button:hover{border-color:var(--sal);color:#fff}#fishamp .fa-foot{margin-top:18px;font-size:11px;color:#4f8fa0;letter-spacing:.12em;text-align:center}#fishamp #fs{position:fixed;inset:0;z-index:100;background:#000;display:none;cursor:pointer}#fishamp #fs canvas{display:block;width:100%;height:100%}#fishamp #fs .hud{position:absolute;left:0;right:0;bottom:0;padding:14px 18px;display:flex;align-items:flex-end;gap:14px;background:linear-gradient(transparent,#0008);transition:opacity .6s;pointer-events:none}#fishamp #fs.idle .hud,#fishamp #fs.idle .top{opacity:0}#fishamp #fs .scene{font-family:Orbitron;font-weight:900;font-size:22px;letter-spacing:.14em;color:#fff;text-shadow:0 0 8px var(--cy),0 0 20px var(--cy)}#fishamp #fs .sub{font-size:13px;color:#cfefff;opacity:.85;text-shadow:0 0 4px #000}#fishamp #fs .top{position:absolute;top:12px;right:12px;display:flex;gap:8px;transition:opacity .6s}#fishamp #fs .top .btn{font-size:12px;padding:7px 11px;background:#000a;cursor:pointer}#fishamp #fs .toast{position:absolute;top:40%;left:0;right:0;text-align:center;font-family:Orbitron;font-weight:900;font-size:clamp(22px,5vw,54px);letter-spacing:.2em;color:#fff;text-shadow:0 0 12px var(--cy),0 0 40px var(--cy);opacity:0;transition:opacity .5s;pointer-events:none}#fishamp #fs .toast.show{opacity:1}@media (max-width:600px){#fishamp .lcd{grid-template-columns:1fr}#fishamp .time{font-size:32px}#fishamp .btn.dive{margin-left:0}}#fishamp button{line-height:1.2}#fishamp ol{margin:0}#fishamp{container-type:inline-size;container-name:fishamp}#fishamp *{overflow-wrap:normal;word-break:normal}#fishamp .marq span{white-space:nowrap!important}#fishamp .pl li .nm{white-space:nowrap!important}#fishamp .titlebar h1{white-space:nowrap}@container fishamp (max-width:640px){#fishamp .lcd{grid-template-columns:1fr}#fishamp .time{font-size:32px}#fishamp .btn.dive{margin-left:0;flex:1 1 100%}#fishamp .vol{min-width:0;flex:1 1 auto}#fishamp .vol input{width:100%}#fishamp .titlebar .ver{display:none}#fishamp .titlebar h1{font-size:17px}#fishamp .btn{padding:8px 10px;min-width:38px}#fishamp .gmrow b{display:none}}@container fishamp (max-width:420px){#fishamp .titlebar svg{width:44px}#fishamp .titlebar h1{font-size:14px;letter-spacing:.1em}}";document.head.appendChild(st);
R.innerHTML="<div class=\"floor\"></div>\n\n<div class=\"amp\" id=\"amp\">\n  <div class=\"titlebar\">\n    <svg width=\"64\" height=\"34\" viewBox=\"0 0 64 34\" aria-hidden=\"true\">\n      <path d=\"M60 17 C54 6 36 3 18 13 L6 4 L10 17 L6 30 L18 21 C36 31 54 28 60 17Z\" fill=\"#1a0b08\" stroke=\"#ff7a59\" stroke-width=\"2\"/>\n      <path d=\"M50 17 Q36 14 18 17\" stroke=\"#5ff6ff\" stroke-width=\"1.4\" fill=\"none\"/>\n      <circle cx=\"51\" cy=\"14\" r=\"2\" fill=\"#fff\"/>\n      <path d=\"M30 9 L34 3 L38 9\" stroke=\"#ff7a59\" stroke-width=\"1.6\" fill=\"none\"/>\n    </svg>\n    <h1>LIKE THE FISH <b>AMP</b></h1>\n    <div class=\"ver\">SALMON EDITION<br>v1.0 \u00b7 likethefish.ca</div>\n  </div>\n\n  <div class=\"qp\" id=\"qp\"><b>QUICK PLAY</b><select id=\"qpSel\" aria-label=\"Quick play\"><option value=\"sp\">\ud83c\udfb2 Random Spotify playlist</option></select><button class=\"btn\" id=\"qpGo\">\u25b6 PLAY</button></div>\n  <div class=\"lcd\">\n    <div class=\"time\"><span class=\"st\" id=\"st\">\u25a0</span><span id=\"time\">00:00</span></div>\n    <div class=\"info\">\n      <div class=\"marq\"><span id=\"marq\">Like The Fish AMP \u00b7 press \u25b6 to swim upstream</span></div>\n      <div class=\"chips\">\n        <span class=\"chip on\">192 KBPS</span><span class=\"chip on\">44 KHZ</span><span class=\"chip\">STEREO</span>\n        <span class=\"chip sal\" id=\"srcChip\">DEMO</span><span class=\"chip\" id=\"beatChip\">BEAT</span>\n      </div>\n    </div>\n  </div>\n\n  <div class=\"tank\" id=\"tank\" title=\"Click to dive into full-screen visualizers\">\n    <canvas id=\"aq\"></canvas>\n    <div class=\"hint\">CLICK THE TANK TO DIVE IN \u26f6</div>\n  </div>\n\n  <input type=\"range\" class=\"seek\" id=\"seek\" min=\"0\" max=\"1000\" value=\"0\" aria-label=\"Seek\">\n\n  <div class=\"controls\">\n    <button class=\"btn\" id=\"prev\" title=\"Previous\">\u23ee</button>\n    <button class=\"btn\" id=\"play\" title=\"Play\">\u25b6</button>\n    <button class=\"btn\" id=\"pause\" title=\"Pause\">\u23f8</button>\n    <button class=\"btn\" id=\"stop\" title=\"Stop\">\u23f9</button>\n    <button class=\"btn\" id=\"next\" title=\"Next\">\u23ed</button>\n    <button class=\"btn\" id=\"eject\" title=\"Add music files\">\u23cf</button>\n    <button class=\"btn tog\" id=\"shuf\" title=\"Shuffle\">\u292e</button>\n    <button class=\"btn tog\" id=\"rep\" title=\"Repeat\">\u21bb</button>\n    <div class=\"vol\">VOL <input type=\"range\" id=\"vol\" min=\"0\" max=\"100\" value=\"80\" aria-label=\"Volume\"></div>\n    <button class=\"btn\" id=\"castBtn\" title=\"Share to your TV (cast or screen mirroring)\">\ud83d\udcfa TV</button>\n    <button class=\"btn dive\" id=\"dive\">DIVE IN \u26f6</button>\n  </div>\n\n  <div class=\"gmrow\" id=\"gmRow\"><b>GAME MUSIC</b><select id=\"gmColl\" aria-label=\"Game music collection\"></select><select id=\"gmSub\" aria-label=\"C64 remixes\" style=\"display:none\"></select><button class=\"btn\" id=\"gmGo\">LOAD &amp; PLAY \u25b6</button></div>\n  <div class=\"gmcred\" id=\"gmCred\"><span id=\"gmNow\"></span>C64 remixes stream from <a href=\"https://remix.kwed.org/\" target=\"_blank\" rel=\"noopener\">Remix.Kwed.Org</a> \u00b7 Relaxing, Encapsulating &amp; Insanity: music by Kevin MacLeod (<a href=\"https://incompetech.com/\" target=\"_blank\" rel=\"noopener\">incompetech.com</a>), licensed under <a href=\"https://creativecommons.org/licenses/by/4.0/\" target=\"_blank\" rel=\"noopener\">Creative Commons: By Attribution 4.0</a> \u00b7 MOBYGRATIS from <a href=\"https://mobygratis.com/\" target=\"_blank\" rel=\"noopener\">mobygratis.com</a>. Nothing is rehosted; game-music visuals follow the beat.</div>\n\n  <div class=\"sprow\" id=\"spRow\"><b>SPOTIFY</b><select id=\"spSel\" aria-label=\"Like the Fish playlists\"><option value=\"\">Pick a Like the Fish playlist\u2026</option></select><button class=\"btn\" id=\"spRand\" title=\"Random playlist\">\ud83c\udfb2</button>\n    <input id=\"spUrl\" placeholder=\"\u2026or paste a Spotify link\" aria-label=\"Spotify link\"><button class=\"btn\" id=\"spLoad\">LOAD</button>\n    <div class=\"spembed\" id=\"spEmbed\"></div>\n    <button class=\"btn\" id=\"spCap\" title=\"Share this tab's sound so the visuals follow the real Spotify audio (desktop Chrome or Edge)\">\ud83c\udfa7 SYNC VISUALS TO SPOTIFY</button><button class=\"btn\" id=\"spMic\" title=\"Use the microphone so the visuals follow music playing nearby\">\ud83c\udfa4 MIC VISUALIZER</button>\n    <div class=\"spmsg\" id=\"spMsg\">Pick a playlist and press play in the Spotify player. The fish dance to the beat; press \ud83c\udfa7 Sync to make them follow the real sound (choose \u201cThis tab\u201d and turn on \u201cAlso share tab audio\u201d). On a phone, play Spotify on a speaker and use \ud83c\udfa4 Mic Visualizer.</div></div>\n\n  <div class=\"scenes\" id=\"scenes\"></div>\n\n  <div class=\"pl\">\n    <header>SCHOOL OF SONGS <small id=\"plCount\"></small></header>\n    <ol id=\"list\"></ol>\n    <div class=\"drop\">Drop music files anywhere (mp3, wav, ogg, m4a, flac) or press \u23cf to add them. The built-in \u201cSalmon Run\u201d demo plays if you haven't added any.</div>\n  </div>\n  <input type=\"file\" id=\"file\" accept=\"audio/*,.mp3,.wav,.ogg,.m4a,.flac,.aac\" multiple hidden>\n</div>\n<div class=\"fa-foot\">CLICK TO CHANGE SCENE \u00b7 \u2190 \u2192 KEYS \u00b7 SPACE PLAY/PAUSE \u00b7 F FULL SCREEN \u00b7 ESC TO SURFACE</div>\n\n<div id=\"fs\">\n  <canvas id=\"fsc\"></canvas>\n  <div class=\"top\">\n    <button class=\"btn\" id=\"fsPlay\">\u25b6 / \u23f8</button>\n    <button class=\"btn\" id=\"fsNext\">NEXT SCENE \u23ed</button>\n    <button class=\"btn\" id=\"fsCast\">\ud83d\udcfa TV</button>\n    <button class=\"btn\" id=\"fsClose\">\u2715 SURFACE</button>\n  </div>\n  <div class=\"toast\" id=\"toast\"></div>\n  <div class=\"hud\"><div><div class=\"scene\" id=\"fsName\"></div><div class=\"sub\" id=\"fsSub\"></div></div></div>\n</div>";
})();

(()=>{
'use strict';
const ME_SRC=(document.currentScript&&document.currentScript.src)||'';
const $=s=>document.querySelector(s);
const TAU=Math.PI*2, clamp=(v,a,b)=>v<a?a:v>b?b:v, lerp=(a,b,t)=>a+(b-a)*t;
const rand=(a=1,b)=>b===undefined?Math.random()*a:a+Math.random()*(b-a);
const pick=a=>a[Math.floor(Math.random()*a.length)];
function hr(i){const x=Math.sin(i*127.1+311.7)*43758.5453;return x-Math.floor(x);}
function hr2(i,j){const x=Math.sin(i*127.1+j*311.7+74.7)*43758.5453;return x-Math.floor(x);}
function noise1(x){const i=Math.floor(x),f=x-i,u=f*f*(3-2*f);return lerp(hr(i),hr(i+1),u);}
function noise2(x,y){const i=Math.floor(x),j=Math.floor(y),fx=x-i,fy=y-j,ux=fx*fx*(3-2*fx),uy=fy*fy*(3-2*fy);
  return lerp(lerp(hr2(i,j),hr2(i+1,j),ux),lerp(hr2(i,j+1),hr2(i+1,j+1),ux),uy);}
function fbm1(x,o=4){let s=0,a=.5,f=1,n=0;for(let k=0;k<o;k++){s+=a*noise1(x*f+k*17.3);n+=a;f*=2.03;a*=.5;}return s/n;}
function mulberry(seed){return()=>{seed|=0;seed=seed+0x6D2B79F5|0;let t=Math.imul(seed^seed>>>15,1|seed);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};}
const mk=(w,h)=>{const c=document.createElement('canvas');c.width=Math.max(1,Math.round(w));c.height=Math.max(1,Math.round(h));return c;};

/* ================= AUDIO ================= */
let ac=null,analyser,master,freq,mediaEl,mediaSrc,demo=null;
let isPlaying=false;
function ensureAudio(){
  if(ac)return;
  ac=new (window.AudioContext||window.webkitAudioContext)();
  analyser=ac.createAnalyser();analyser.fftSize=2048;analyser.smoothingTimeConstant=.75;
  master=ac.createGain();master.gain.value=$('#vol').value/100;
  analyser.connect(master);master.connect(ac.destination);
  freq=new Uint8Array(analyser.frequencyBinCount);
  mediaEl=new Audio();mediaEl.preload='auto';
  mediaSrc=ac.createMediaElementSource(mediaEl);mediaSrc.connect(analyser);
  mediaEl.addEventListener('ended',()=>next(true));
}
function startDemo(){
  ensureAudio();
  const bus=ac.createGain();bus.gain.value=.55;bus.connect(analyser);
  const nb=ac.createBuffer(1,ac.sampleRate,ac.sampleRate);const d=nb.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=Math.random()*2-1;
  const mtof=m=>440*Math.pow(2,(m-69)/12);
  const spb=60/118/4;
  const prog=[[57,60,64],[53,57,60],[48,52,55],[55,59,62]];
  const mel=[[76,0,72,0,74,76,0,79,76,0,74,0,72,0,69,0],[72,0,69,0,72,74,0,72,69,0,67,0,69,0,0,0],[67,0,72,0,76,0,74,72,74,0,76,0,79,0,76,0],[74,0,71,0,74,0,79,0,78,0,74,0,71,0,74,0]];
  function tone(type,f,t0,dur,vol,cut){
    const o=ac.createOscillator(),g=ac.createGain();o.type=type;o.frequency.value=f;let n=o;
    if(cut){const fl=ac.createBiquadFilter();fl.type='lowpass';fl.frequency.setValueAtTime(cut,t0);fl.frequency.exponentialRampToValueAtTime(Math.max(120,cut*.25),t0+dur);o.connect(fl);n=fl;}
    n.connect(g);g.connect(bus);g.gain.setValueAtTime(.0001,t0);g.gain.exponentialRampToValueAtTime(vol,t0+.012);g.gain.exponentialRampToValueAtTime(.0001,t0+dur);
    o.start(t0);o.stop(t0+dur+.05);
  }
  function kick(t0){const o=ac.createOscillator(),g=ac.createGain();o.frequency.setValueAtTime(160,t0);o.frequency.exponentialRampToValueAtTime(42,t0+.16);
    g.gain.setValueAtTime(1,t0);g.gain.exponentialRampToValueAtTime(.001,t0+.32);o.connect(g);g.connect(bus);o.start(t0);o.stop(t0+.34);}
  function noiseHit(t0,type,fq,vol,dur){const s=ac.createBufferSource();s.buffer=nb;const f=ac.createBiquadFilter();f.type=type;f.frequency.value=fq;
    const g=ac.createGain();g.gain.setValueAtTime(vol,t0);g.gain.exponentialRampToValueAtTime(.001,t0+dur);s.connect(f);f.connect(g);g.connect(bus);s.start(t0);s.stop(t0+dur+.02);}
  let step=0,nextT=ac.currentTime+.06;
  function sched(){
    while(nextT<ac.currentTime+.12){
      const bar=Math.floor(step/16)%4,s=step%16,ch=prog[bar],sect=Math.floor(step/64)%4;
      if(s%4===0)kick(nextT);
      if(sect>0&&s===14&&bar===3)kick(nextT);
      if(s===4||s===12){noiseHit(nextT,'bandpass',1800,.5,.16);tone('triangle',190,nextT,.08,.18);}
      noiseHit(nextT,'highpass',7500,s%2?.06:.13,.045);
      if(s%2===0)tone('sawtooth',mtof(ch[0]-24+(s===10?7:0)),nextT,spb*1.7,.22,1000);
      const arp=ch[[0,1,2,1,2,0,1,2][s%8]]+12+(s>=8?12:0);
      tone('square',mtof(arp),nextT,spb*.85,.045,3200);
      if(s===0)ch.forEach(n=>{tone('sawtooth',mtof(n),nextT,spb*15.5,.028,1500);tone('sawtooth',mtof(n)*1.007,nextT,spb*15.5,.024,1500);});
      if(sect>=1){const m=mel[bar][s];if(m)tone('triangle',mtof(m),nextT,spb*2.2,.11);}
      nextT+=spb;step++;
    }
  }
  sched();
  demo={bus,id:setInterval(sched,25),start:ac.currentTime};
}
let gmEl=null;
function ensureGm(){if(gmEl)return;gmEl=new Audio();gmEl.preload='auto';gmEl.volume=$('#vol').value/100;
  gmEl.addEventListener('ended',()=>next(true));
  let errs=0;gmEl.addEventListener('error',()=>{if(isPlaying&&tracks[cur]&&tracks[cur].gm&&++errs<5)setTimeout(()=>next(true),1200);});
  gmEl.addEventListener('playing',()=>{errs=0;});}
let capAn=null,capOn=false,capStream=null;
const SP={on:false,bpm:118,t0:0,ctrl:null,api:null,uri:'',title:''};
const gmOn=()=>isPlaying&&gmEl&&!gmEl.paused&&tracks[cur]&&tracks[cur].gm;
function stopDemo(){if(!demo)return;clearInterval(demo.id);const b=demo.bus;try{b.gain.setTargetAtTime(0,ac.currentTime,.03);}catch(e){}setTimeout(()=>{try{b.disconnect()}catch(e){}},400);demo=null;}

/* audio analysis */
const A={bins:new Float32Array(64),bass:0,mid:0,treb:0,level:0,beat:false,pulse:0,avg:.2};
let lastBeat=0;
function updateAudio(t,dt){
  const N=64;let has=false;
  const capb=!!(capAn&&capOn);const spb=!capb&&SP.on;const gmb=!capb&&(gmOn()||spb);let kick=0,hat=0,bt=0;
  if(capb){capAn.getByteFrequencyData(freq);has=true;}
  else if(gmb){const bpm=spb?SP.bpm:clamp(+tracks[cur].gm.bpm||120,60,200),ph=(spb?(performance.now()-SP.t0)/1000:gmEl.currentTime)*bpm/60;bt=Math.floor(ph);kick=Math.exp(-(ph%1)*5);hat=Math.exp(-((ph*2)%1)*9);has=true;}
  else if(analyser&&isPlaying&&ac.state==='running'){analyser.getByteFrequencyData(freq);has=true;}
  const L=freq?freq.length:1024,top=L*.72;
  for(let i=0;i<N;i++){
    let v;
    if(gmb){const sw=noise2(i*.31,t*1.7+bt*.37);v=i<8?(.25+.7*kick)*(1-i/14)+.1*sw:i<36?.22+.38*sw+.18*kick*(1-i/40):.12+.42*hat*sw+.15*noise1(t*6+i);v=clamp(v,0,1);}
    else if(has){
      const lo=Math.floor(2*Math.pow(top/2,i/N)),hi=Math.max(lo+1,Math.floor(2*Math.pow(top/2,(i+1)/N)));
      let s=0;for(let k=lo;k<hi;k++)s+=freq[k];v=s/(hi-lo)/255;v=clamp(v*(1+i/N*.7),0,1);v=v*v*(3-2*v);
    }else v=.07+.05*Math.sin(t*1.1+i*.35)+.04*Math.sin(t*2.3-i*.2);
    A.bins[i]=v>A.bins[i]?lerp(A.bins[i],v,.6):Math.max(v,A.bins[i]-dt*1.6);
  }
  let b=0,m=0,tr=0;for(let i=0;i<6;i++)b+=A.bins[i];for(let i=6;i<30;i++)m+=A.bins[i];for(let i=30;i<64;i++)tr+=A.bins[i];
  A.bass=b/6;A.mid=m/24;A.treb=tr/34;A.level=(A.bass+A.mid+A.treb)/3;
  A.beat=false;
  if(has&&A.bass>A.avg*1.22&&A.bass>.3&&t-lastBeat>.26){A.beat=true;lastBeat=t;A.pulse=1;}
  if(!has&&t-lastBeat>2.4){A.beat=true;lastBeat=t;A.pulse=.5;}
  A.avg=lerp(A.avg,A.bass,clamp(dt*2,0,1));
  A.pulse=Math.max(0,A.pulse-dt*3);
}

/* ================= SHARED DRAWING ================= */
const bc1=mk(1,1),bc2=mk(1,1),bx1=bc1.getContext('2d'),bx2=bc2.getContext('2d');
function bloom(ctx,amt){
  if(amt<=.01)return;const c=ctx.canvas,W=c.width,H=c.height;
  const w1=Math.max(1,W>>2),h1=Math.max(1,H>>2),w2=Math.max(1,W>>4),h2=Math.max(1,H>>4);
  if(bc1.width!==w1||bc1.height!==h1){bc1.width=w1;bc1.height=h1;}
  if(bc2.width!==w2||bc2.height!==h2){bc2.width=w2;bc2.height=h2;}
  bx1.globalCompositeOperation='copy';bx1.drawImage(c,0,0,w1,h1);
  bx2.globalCompositeOperation='copy';bx2.drawImage(bc1,0,0,w2,h2);
  ctx.save();ctx.setTransform(1,0,0,1,0,0);ctx.globalCompositeOperation='lighter';
  ctx.globalAlpha=clamp(amt*.45,0,1);ctx.drawImage(bc1,0,0,W,H);
  ctx.globalAlpha=clamp(amt*.8,0,1);ctx.drawImage(bc2,0,0,W,H);ctx.restore();
}
const SPOTS=[[.25,-.22],[.05,-.26],[-.15,-.2],[-.35,-.16],[.12,-.12],[-.05,-.1],[-.48,-.1]];
function drawSalmon(ctx,x,y,s,ang,wig,glow='#ff8a65',flip=false){
  ctx.save();ctx.translate(x,y);ctx.rotate(ang);if(flip)ctx.scale(1,-1);
  const tw=Math.sin(wig)*.2;
  ctx.beginPath();ctx.moveTo(s,0);
  ctx.bezierCurveTo(s*.78,-s*.36,s*.05,-s*.42,-s*.68,-s*.1+tw*s*.3);
  ctx.lineTo(-s*1.08,-s*.38+tw*s);ctx.quadraticCurveTo(-s*.9,tw*s,-s*1.08,s*.38+tw*s);
  ctx.lineTo(-s*.68,s*.1+tw*s*.3);
  ctx.bezierCurveTo(s*.05,s*.36,s*.72,s*.3,s,0);ctx.closePath();
  const g=ctx.createLinearGradient(0,-s*.42,0,s*.34);
  g.addColorStop(0,'#123247');g.addColorStop(.38,'#6f8aa0');g.addColorStop(.55,'#ff8a6b');g.addColorStop(1,'#ffd6c8');
  ctx.fillStyle=g;ctx.shadowColor=glow;ctx.shadowBlur=s*.6;ctx.fill();ctx.shadowBlur=0;
  ctx.lineWidth=Math.max(1,s*.05);ctx.strokeStyle=glow;ctx.stroke();
  ctx.beginPath();ctx.moveTo(-s*.05,-s*.39);ctx.lineTo(s*.12,-s*.62);ctx.lineTo(s*.3,-s*.36);ctx.stroke();
  ctx.beginPath();ctx.moveTo(-s*.42,s*.24);ctx.lineTo(-s*.3,s*.42);ctx.lineTo(-s*.18,s*.27);ctx.stroke();
  ctx.beginPath();ctx.moveTo(s*.7,-s*.01);ctx.quadraticCurveTo(0,-s*.05,-s*.68,tw*s*.2);ctx.strokeStyle='#8ff8ff';ctx.lineWidth=Math.max(.7,s*.028);ctx.stroke();
  ctx.fillStyle='#0b1b28';for(const[a,b]of SPOTS){ctx.beginPath();ctx.arc(a*s,b*s,s*.035,0,TAU);ctx.fill();}
  ctx.beginPath();ctx.moveTo(s*.55,-s*.22);ctx.quadraticCurveTo(s*.46,0,s*.56,s*.2);ctx.strokeStyle=glow;ctx.lineWidth=Math.max(.8,s*.03);ctx.stroke();
  ctx.fillStyle='#fff';ctx.beginPath();ctx.arc(s*.73,-s*.07,s*.065,0,TAU);ctx.fill();
  ctx.fillStyle='#000';ctx.beginPath();ctx.arc(s*.745,-s*.07,s*.033,0,TAU);ctx.fill();
  ctx.restore();
}
function splashes(arr,x,y,n,col){for(let i=0;i<n;i++){const a=-Math.PI/2+rand(-1.1,1.1),sp=rand(60,220);arr.push({x,y,vx:Math.cos(a)*sp,vy:Math.sin(a)*sp,l:rand(.5,1),c:col});}}
function drawSplash(ctx,arr,dt,g=420){
  for(let i=arr.length-1;i>=0;i--){const p=arr[i];p.l-=dt;if(p.l<=0){arr.splice(i,1);continue;}
    p.vy+=g*dt;p.x+=p.vx*dt;p.y+=p.vy*dt;ctx.globalAlpha=clamp(p.l,0,1);ctx.fillStyle=p.c;ctx.beginPath();ctx.arc(p.x,p.y,1.8,0,TAU);ctx.fill();}
  ctx.globalAlpha=1;
}

/* ================= VISUALIZERS ================= */
/* 1. NEON AQUARIUM */
function Aquarium(){
  let w,h,fish,bub=[],sal,stars,spl=[],kelp;
  return{name:'NEON AQUARIUM',sub:'Glowing tides rise and fall with the music',
  init(W,H){w=W;h=H;
    fish=Array.from({length:16},()=>({x:rand(w),y:rand(h*.35,h*.8),s:rand(4,8),v:rand(25,60)*(Math.random()<.5?-1:1),ph:rand(TAU),c:pick(['#00f0ff','#ff3fb4','#7dff9a','#b18cff'])}));
    sal={x:w*.4,dir:1,ph:0,leap:null,cool:3};
    stars=Array.from({length:60},()=>({x:rand(w),y:rand(h*.2),r:rand(.4,1.4),p:rand(TAU)}));
    kelp=Array.from({length:10},(_,i)=>({x:i<5?rand(w*.02,w*.16):rand(w*.84,w*.98),hgt:rand(h*.2,h*.42),p:rand(TAU)}));
  },
  draw(ctx,t,dt,A){
    const surf=h*.22;
    let g=ctx.createLinearGradient(0,0,0,surf);g.addColorStop(0,'#01030a');g.addColorStop(1,'#04182c');ctx.fillStyle=g;ctx.fillRect(0,0,w,surf+2);
    for(const s of stars){ctx.globalAlpha=.4+.6*Math.abs(Math.sin(t*1.5+s.p));ctx.fillStyle='#cff';ctx.fillRect(s.x,s.y,s.r,s.r);}ctx.globalAlpha=1;
    g=ctx.createLinearGradient(0,surf,0,h);g.addColorStop(0,'#00426e');g.addColorStop(.45,'#001d36');g.addColorStop(1,'#00070f');ctx.fillStyle=g;ctx.fillRect(0,surf,w,h-surf);
    // light rays
    ctx.save();ctx.globalCompositeOperation='lighter';
    for(let i=0;i<6;i++){const x=w*(.1+i*.17)+Math.sin(t*.3+i)*30;ctx.fillStyle=`rgba(0,200,255,${.035+A.level*.06})`;
      ctx.beginPath();ctx.moveTo(x,surf);ctx.lineTo(x+40,surf);ctx.lineTo(x+140+Math.sin(t*.2+i)*40,h);ctx.lineTo(x+20,h);ctx.fill();}
    ctx.restore();
    // grid floor
    ctx.save();ctx.strokeStyle='rgba(0,234,255,.16)';ctx.lineWidth=1;const fy=h*.78,vx=w/2;
    for(let i=0;i<7;i++){const y=fy+Math.pow(i/6,1.7)*(h-fy);ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(w,y);ctx.stroke();}
    for(let i=-12;i<=12;i++){ctx.beginPath();ctx.moveTo(vx+i*w*.03,fy);ctx.lineTo(vx+i*w*.16,h);ctx.stroke();}
    ctx.restore();
    // cliffs + waterfalls
    const cl=[[0,0],[w*.2,h*.08],[w*.21,surf],[0,surf]],cr=[[w,0],[w*.8,h*.1],[w*.79,surf],[w,surf]];
    for(const c of [cl,cr]){ctx.beginPath();ctx.moveTo(c[0][0],c[0][1]);for(const p of c)ctx.lineTo(p[0],p[1]);ctx.closePath();ctx.fillStyle='#020c16';ctx.fill();
      ctx.strokeStyle='#00eaff';ctx.lineWidth=1.5;ctx.shadowColor='#00eaff';ctx.shadowBlur=8;ctx.beginPath();ctx.moveTo(c[0][0],c[1][1]);ctx.lineTo(c[1][0],c[1][1]);ctx.lineTo(c[2][0],c[2][1]);ctx.stroke();ctx.shadowBlur=0;}
    const falls=[[w*.12,w*.2,h*.08],[w*.8,w*.88,h*.1]];
    ctx.save();ctx.globalCompositeOperation='lighter';
    for(const[a,b,top]of falls){
      g=ctx.createLinearGradient(0,top,0,surf);g.addColorStop(0,'rgba(0,200,255,.15)');g.addColorStop(1,'rgba(120,240,255,.45)');ctx.fillStyle=g;ctx.fillRect(a,top,b-a,surf-top);
      ctx.lineWidth=1.4;for(let i=0;i<12;i++){const x=a+(b-a)*(i+.5)/12;ctx.setLineDash([8+i%3*6,14]);ctx.lineDashOffset=-t*(160+i*9)-i*13;
        ctx.strokeStyle=`rgba(${150+i*8},250,255,${.45+.3*A.treb})`;ctx.beginPath();ctx.moveTo(x,top);ctx.lineTo(x+Math.sin(t*3+i)*1.5,surf);ctx.stroke();}
      ctx.setLineDash([]);
      for(let i=0;i<10;i++){const mx=a+(b-a)*hr(i*3.3)+Math.sin(t*2+i)*8,r=6+8*Math.abs(Math.sin(t*1.7+i));ctx.fillStyle=`rgba(180,250,255,${.06+A.level*.05})`;ctx.beginPath();ctx.arc(mx,surf,r,0,TAU);ctx.fill();}
      if(Math.random()<.5)bub.push({x:rand(a,b),y:surf+rand(4,30),r:rand(1,3),v:rand(-10,30),p:rand(TAU)});
    }
    ctx.restore();
    // kelp
    ctx.save();ctx.lineCap='round';
    for(const k of kelp){ctx.strokeStyle='rgba(60,255,170,.55)';ctx.lineWidth=2.2;ctx.shadowColor='#3cffaa';ctx.shadowBlur=6;ctx.beginPath();ctx.moveTo(k.x,h);
      for(let s=1;s<=8;s++){const yy=h-k.hgt*s/8;ctx.lineTo(k.x+Math.sin(t*1.2+k.p+s*.6)*s*2.2*(1+A.mid),yy);}ctx.stroke();}
    ctx.restore();
    // tide columns
    const n=40,cw=w/n;ctx.save();ctx.globalCompositeOperation='lighter';
    for(let i=0;i<n;i++){
      const v=A.bins[Math.floor(2+i*1.45)],ht=h*.06+v*(h-surf-14)*.92,top=h-ht,x0=i*cw,hue=185+i*2.6;
      ctx.beginPath();ctx.moveTo(x0+1,h);
      for(let k=0;k<=4;k++){const xx=x0+1+(cw-2)*k/4;ctx.lineTo(xx,top+Math.sin(t*3.2+i*.55+k*.9)*3*(.4+v));}
      ctx.lineTo(x0+cw-1,h);ctx.closePath();
      g=ctx.createLinearGradient(0,top,0,h);g.addColorStop(0,`hsla(${hue},100%,62%,.55)`);g.addColorStop(.3,`hsla(${hue+10},100%,45%,.22)`);g.addColorStop(1,`hsla(${hue+20},100%,35%,.03)`);
      ctx.fillStyle=g;ctx.fill();
      ctx.strokeStyle=`hsla(${hue-10},100%,85%,${.5+v*.5})`;ctx.lineWidth=1.5;ctx.beginPath();
      for(let k=0;k<=4;k++){const xx=x0+1+(cw-2)*k/4,yy=top+Math.sin(t*3.2+i*.55+k*.9)*3*(.4+v);k?ctx.lineTo(xx,yy):ctx.moveTo(xx,yy);}ctx.stroke();
      if(A.beat&&v>.45&&Math.random()<.5)for(let b=0;b<3;b++)bub.push({x:x0+rand(cw),y:top,r:rand(1,3.5),v:rand(30,70),p:rand(TAU)});
    }
    ctx.restore();
    // surface line
    ctx.save();ctx.strokeStyle='#5ff6ff';ctx.lineWidth=2;ctx.shadowColor='#00eaff';ctx.shadowBlur=12;ctx.beginPath();
    for(let x=0;x<=w;x+=6){const y=surf+Math.sin(x*.025+t*2)*2+Math.sin(x*.06-t*3)*1.2*(1+A.bass*2);x?ctx.lineTo(x,y):ctx.moveTo(x,y);}ctx.stroke();ctx.restore();
    // bubbles
    ctx.strokeStyle='rgba(190,250,255,.75)';ctx.lineWidth=1;
    for(let i=bub.length-1;i>=0;i--){const b=bub[i];b.y-=(b.v+20)*dt;b.x+=Math.sin(t*3+b.p)*.4;if(b.y<surf){bub.splice(i,1);continue;}ctx.beginPath();ctx.arc(b.x,b.y,b.r,0,TAU);ctx.stroke();}
    if(bub.length>300)bub.splice(0,bub.length-300);
    // tetras
    for(const f of fish){f.x+=f.v*dt*(1+A.level);if(f.x<-20)f.x=w+20;if(f.x>w+20)f.x=-20;const y=f.y+Math.sin(t*1.3+f.ph)*8;
      ctx.save();ctx.translate(f.x,y);ctx.scale(f.v<0?-1:1,1);ctx.fillStyle=f.c;ctx.shadowColor=f.c;ctx.shadowBlur=8;
      ctx.beginPath();ctx.ellipse(0,0,f.s,f.s*.38,0,0,TAU);ctx.fill();ctx.beginPath();ctx.moveTo(-f.s*.8,0);ctx.lineTo(-f.s*1.5,-f.s*.4+Math.sin(t*12+f.ph)*1.5);ctx.lineTo(-f.s*1.5,f.s*.4+Math.sin(t*12+f.ph)*1.5);ctx.fill();ctx.restore();}
    // salmon
    const S=Math.max(16,h*.085);sal.cool-=dt;
    if(!sal.leap){
      /* steer toward wandering targets: always faces the way it swims, turns smoothly, darts on big beats */
      if(sal.vx===undefined){sal.y=h*.55;sal.vx=60;sal.vy=0;sal.tx=w*.7;sal.ty=h*.5;sal.face=1;}
      const top=surf+S*.9,bot=h-S*.9,dxT=sal.tx-sal.x,dyT=sal.ty-sal.y,dT=Math.hypot(dxT,dyT);
      if(dT<S*1.2||Math.random()<dt*.08){sal.tx=rand(w*.1,w*.9);sal.ty=rand(top,bot);}
      const sp=(55+A.level*95)*(sal.dash>0?2.6:1);sal.dash=Math.max(0,(sal.dash||0)-dt);
      if(A.beat&&A.pulse>.8&&Math.random()<.18){sal.dash=.45;}
      const dvx=dxT/(dT||1)*sp,dvy=dyT/(dT||1)*sp*.7,k=Math.min(1,dt*1.6);
      sal.vx+=(dvx-sal.vx)*k;sal.vy+=(dvy-sal.vy)*k;
      sal.x=clamp(sal.x+sal.vx*dt,S,w-S);sal.y=clamp(sal.y+sal.vy*dt+Math.sin(t*2.2)*.25,top,bot);
      if(sal.vx>12)sal.face=1;else if(sal.vx<-12)sal.face=-1;
      const spd=Math.hypot(sal.vx,sal.vy);sal.ph+=dt*(5+spd*.09);sal.dir=sal.face;
      let ang=Math.atan2(sal.vy,Math.abs(sal.vx)+8);ang=clamp(ang,-.7,.7);
      drawSalmon(ctx,sal.x,sal.y,S,sal.face>0?ang:Math.PI-ang,sal.ph,'#ff7a59',sal.face<0);
      if(A.beat&&A.pulse>.8&&sal.cool<0&&Math.random()<.35){sal.leap={t:0,x0:sal.x,y0:sal.y,dir:sal.x>w*.75?-1:sal.x<w*.25?1:sal.face};sal.cool=6;}
    }else{
      const L=sal.leap;L.t+=dt/1.4;const p=L.t,x=L.x0+L.dir*p*w*.22,top=surf-h*.17;
      const y=p<.5?lerp(L.y0,top,Math.sin(p*Math.PI)):lerp(L.y0,top,Math.sin(p*Math.PI));
      const p2=Math.min(1,p+.01),y2=lerp(L.y0,top,Math.sin(p2*Math.PI)),x2=L.x0+L.dir*p2*w*.22;
      const ang=Math.atan2(y2-y,x2-x);sal.ph+=dt*16;
      if(!L.out&&y<surf){L.out=1;splashes(spl,x,surf,22,'#bff');}
      if(L.out===1&&p>.6&&y>surf){L.out=2;splashes(spl,x,surf,26,'#bff');}
      drawSalmon(ctx,x,y,S,ang,sal.ph,'#ff7a59',L.dir<0);
      if(p>=1){sal.leap=null;sal.x=clamp(x,S,w-S);sal.y=Math.max(L.y0,surf+S);sal.vx=L.dir*80;sal.vy=40;sal.face=L.dir;}
    }
    drawSplash(ctx,spl,dt);
    bloom(ctx,.5+A.level*.6+A.pulse*.2);
  }};
}

/* 2. STORM TIDE */
function Storm(){
  let w,h,hor,cl1,cl2,rain,bolt=null,flash=0,leap=null,spl=[],next=6;
  function clouds(W,H,dark,seed){const c=mk(W,H),x=c.getContext('2d'),r=mulberry(seed);
    for(let i=0;i<260;i++){const cx=r()*W,cy=r()*H*.85,rad=rand(H*.08,H*.32)*(.5+r()),a=.05+r()*.08;
      for(const dx of[-W,0,W]){const g=x.createRadialGradient(cx+dx,cy,0,cx+dx,cy,rad);const l=dark?18+r()*25:35+r()*30;
        g.addColorStop(0,`rgba(${l},${l+6},${l+16},${a*2.4})`);g.addColorStop(1,`rgba(${l},${l+6},${l+16},0)`);x.fillStyle=g;x.fillRect(cx+dx-rad,cy-rad,rad*2,rad*2);}}
    return c;}
  function genBolt(){const pts=[];let x=rand(w*.1,w*.9),y=0;pts.push([x,y]);const br=[];
    while(y<hor*.95){x+=rand(-40,40);y+=rand(15,45);pts.push([x,y]);if(Math.random()<.18){const b=[[x,y]];let bx=x,by=y;for(let k=0;k<5;k++){bx+=rand(-50,50);by+=rand(12,35);b.push([bx,by]);}br.push(b);}}
    return{pts,br,l:1};}
  return{name:'STORM TIDE',sub:'Midnight squall \u00b7 equalizer light-columns on the swell',
  init(W,H){w=W;h=H;hor=h*.44;cl1=clouds(w,hor*1.1,true,7);cl2=clouds(w,hor*.8,false,19);
    rain=Array.from({length:Math.floor(w*h/2600)},()=>({x:rand(w),y:rand(h),v:rand(700,1100),l:rand(10,26)}));},
  draw(ctx,t,dt,A){
    let g=ctx.createLinearGradient(0,0,0,hor);g.addColorStop(0,'#030509');g.addColorStop(1,'#16212f');ctx.fillStyle=g;ctx.fillRect(0,0,w,hor+1);
    const o1=(t*10)%w,o2=(t*22)%w;
    ctx.drawImage(cl1,-o1,0);ctx.drawImage(cl1,w-o1,0);ctx.globalAlpha=.7;ctx.drawImage(cl2,-o2,0);ctx.drawImage(cl2,w-o2,0);ctx.globalAlpha=1;
    next-=dt;
    if(!bolt&&((A.beat&&A.pulse>.8&&Math.random()<.3)||next<0)){bolt=genBolt();flash=1;next=rand(5,10);}
    if(bolt){ctx.save();ctx.globalCompositeOperation='lighter';ctx.strokeStyle=`rgba(220,235,255,${bolt.l})`;ctx.shadowColor='#9cf';ctx.shadowBlur=20;
      for(const path of [bolt.pts,...bolt.br]){ctx.lineWidth=path===bolt.pts?2.6:1.2;ctx.beginPath();path.forEach((p,i)=>i?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]));ctx.stroke();}
      ctx.restore();bolt.l-=dt*4;if(bolt.l<=0)bolt=null;}
    // ocean
    const N=30;ctx.fillStyle='#0a1520';ctx.fillRect(0,hor,w,h-hor);
    for(let k=0;k<N;k++){
      const p=k/(N-1),y0=hor+Math.pow(p,1.75)*(h-hor+60),amp=(1+p*p*60)*(.65+A.bass*.8),fq=1/(.22+p*1.2),stepX=p<.3?14:8;
      ctx.beginPath();ctx.moveTo(0,h+5);
      const crest=[];
      for(let x=0;x<=w+stepX;x+=stepX){
        const y=y0-amp*(.4*Math.sin(x*.006*fq+t*.8+k*1.7)+.22*Math.sin(x*.016*fq-t*1.25+k*.9)+.1*Math.sin(x*.041*fq+t*2+k*2.3)+.45*(1-Math.abs(Math.sin(x*.0045*fq+t*.55+k*.7)))-.2);
        ctx.lineTo(x,y);crest.push(x,y);
      }
      ctx.lineTo(w,h+5);ctx.closePath();
      const gw=ctx.createLinearGradient(0,y0-amp*1.1,0,y0+amp*.9+4);
      gw.addColorStop(0,`rgb(${78+p*30|0},${100+p*35|0},${118+p*35|0})`);gw.addColorStop(.3,`rgb(${30+p*8|0},${48+p*10|0},${64+p*10|0})`);gw.addColorStop(1,`rgb(${6+(1-p)*30|0},${12+(1-p)*36|0},${20+(1-p)*44|0})`);
      ctx.fillStyle=gw;ctx.fill();
      ctx.beginPath();for(let i=0;i<crest.length;i+=2)i?ctx.lineTo(crest[i],crest[i+1]):ctx.moveTo(crest[i],crest[i+1]);
      ctx.strokeStyle=`rgba(190,215,235,${.04+p*.16+flash*.25})`;ctx.lineWidth=.6+p*1.6;ctx.stroke();
      if(p>.4){ctx.fillStyle=`rgba(225,238,245,${.12+p*.22})`;
        for(let i=2;i<crest.length-2;i+=2){const y=crest[i+1];if(y<crest[i-1]&&y<=crest[i+3]&&y<y0-amp*.55){ctx.beginPath();ctx.ellipse(crest[i],y+1.5,stepX*(1.5+p*2.5),1.2+p*3.2,0,0,TAU);ctx.fill();}}}
    }
    // equalizer light columns on the water
    const n=44,cw=w/n;ctx.save();ctx.globalCompositeOperation='lighter';
    for(let i=0;i<n;i++){
      const v=A.bins[Math.floor(2+i*1.36)],hue=(i*8+t*22)%360,len=(.12+v*.88)*(h-hor),cx=(i+.5)*cw;
      {const bh=2+v*Math.max(42,hor*.13),gb=ctx.createLinearGradient(0,hor-bh,0,hor);gb.addColorStop(0,`hsla(${hue},100%,72%,${.35+v*.5})`);gb.addColorStop(1,`hsla(${hue},100%,58%,${.25+v*.55})`);ctx.fillStyle=gb;ctx.fillRect(cx-cw*.32,hor-bh,cw*.64,bh);}
      for(let y=hor+1,j=0;y<hor+len;j++){const q=(y-hor)/(h-hor),dh=1+q*5,gap=2+q*12;
        const ww=cw*(.25+.65*noise2(i*3.1,y*.05-t*2.2))*(1-q*.25),jit=Math.sin(t*3+y*.08+i)*cw*.18*(.3+q);
        ctx.globalAlpha=(1-(y-hor)/len)*(.35+v*.65);ctx.fillStyle=`hsl(${hue+q*30},100%,${55+v*15}%)`;ctx.fillRect(cx-ww/2+jit,y,ww,dh);y+=dh+gap;}
      ctx.globalAlpha=1;
    }
    ctx.restore();
    // leaping salmon
    if(!leap&&A.beat&&A.pulse>.8&&Math.random()<.2)leap={x:rand(w*.2,w*.8),y0:hor+(h-hor)*rand(.25,.55),t:0,d:Math.random()<.5?1:-1};
    if(leap){leap.t+=dt/1.3;const p=leap.t,s=lerp(10,38,(leap.y0-hor)/(h-hor)),x=leap.x+leap.d*p*s*7,y=leap.y0-Math.sin(p*Math.PI)*s*4.5;
      const p2=p+.02,x2=leap.x+leap.d*p2*s*7,y2=leap.y0-Math.sin(p2*Math.PI)*s*4.5;
      if(!leap.s1){leap.s1=1;splashes(spl,x,leap.y0,18,'#cde');}
      if(p>.95&&!leap.s2){leap.s2=1;splashes(spl,x,leap.y0,18,'#cde');}
      drawSalmon(ctx,x,y,s,Math.atan2(y2-y,x2-x),t*16,'#ff7a59',leap.d<0);if(p>=1)leap=null;}
    drawSplash(ctx,spl,dt,500);
    // rain
    ctx.strokeStyle='rgba(170,200,230,.28)';ctx.lineWidth=1;ctx.beginPath();
    for(const r of rain){r.y+=r.v*dt;r.x-=r.v*dt*.18;if(r.y>h){r.y=-20;r.x=rand(w*1.2);}if(r.x<-30)r.x+=w+30;ctx.moveTo(r.x,r.y);ctx.lineTo(r.x+r.l*.18,r.y-r.l);}ctx.stroke();
    if(flash>0){ctx.fillStyle=`rgba(200,220,255,${flash*.28})`;ctx.fillRect(0,0,w,h);flash=Math.max(0,flash-dt*3);}
    bloom(ctx,.35+A.level*.5);
  }};
}

/* 3. STARRY STARRY FIREWORKS */
function Starry(){
  let w,h,tc,tx,parts,rockets=[],sparks=[],stars,swirls,moon,last=0,ring=0;
  const PAL=['#1d3c8f','#2b56b8','#4f7fd6','#8fb3ff','#c9dcff','#f3e27a','#e8c547','#ffffff','#163070','#3d6fd1'];
  return{name:'STARRY STARRY FIREWORKS',sub:'Bursts melt into swirling brushstroke sky',
  init(W,H){w=W;h=H;tc=mk(w,h);tx=tc.getContext('2d');
    const g=tx.createLinearGradient(0,0,0,h);g.addColorStop(0,'#081640');g.addColorStop(1,'#163a7a');tx.fillStyle=g;tx.fillRect(0,0,w,h);
    parts=Array.from({length:Math.floor(w*h/900)},()=>({x:rand(w),y:rand(h),c:pick(PAL),l:rand(2,8)}));
    swirls=[{x:w*.42,y:h*.3,r:h*.16,d:1},{x:w*.62,y:h*.22,r:h*.1,d:-1},{x:w*.25,y:h*.45,r:h*.11,d:1}];
    stars=Array.from({length:11},()=>({x:rand(w*.05,w*.95),y:rand(h*.05,h*.55),r:rand(4,10),p:rand(TAU),b:Math.floor(rand(30,60))}));
    const mr=Math.min(w,h)*.06;moon={c:mk(mr*2.4,mr*2.4),r:mr,x:w*.86,y:h*.14};const mx=moon.c.getContext('2d');
    mx.fillStyle='#ffe27a';mx.beginPath();mx.arc(mr*1.2,mr*1.2,mr,0,TAU);mx.fill();mx.globalCompositeOperation='destination-out';mx.beginPath();mx.arc(mr*1.65,mr*.95,mr*.85,0,TAU);mx.fill();
  },
  draw(ctx,t,dt,A){
    tx.fillStyle='rgba(10,26,72,0.022)';tx.fillRect(0,0,w,h);
    const sp=(35+A.level*90)*dt;tx.lineWidth=2.4;tx.lineCap='round';tx.globalAlpha=.32;
    for(const p of parts){
      const a=noise2(p.x*.0022,p.y*.0022+t*.025)*TAU*2;let vx=Math.cos(a),vy=Math.sin(a)*.6;
      for(const s of swirls){const dx=p.x-s.x,dy=p.y-s.y,d2=(dx*dx+dy*dy)/(s.r*s.r);if(d2<6){const f=Math.exp(-d2*.6)*2.2,an=Math.atan2(dy,dx)+Math.PI/2*s.d;vx+=Math.cos(an)*f;vy+=Math.sin(an)*f;}}
      const m=Math.hypot(vx,vy)||1,nx=p.x+vx/m*sp,ny=p.y+vy/m*sp;
      tx.strokeStyle=p.c;tx.beginPath();tx.moveTo(p.x,p.y);tx.lineTo(nx,ny);tx.stroke();
      p.x=nx;p.y=ny;p.l-=dt;if(p.l<0||p.x<0||p.x>w||p.y<0||p.y>h){p.x=rand(w);p.y=rand(h);p.l=rand(2,8);if(!p.keep)p.c=pick(PAL);p.keep=false;}
    }
    tx.globalAlpha=1;
    if((A.beat&&t-last>.3)||t-last>1.9){last=t;rockets.push({x:rand(w*.12,w*.88),y:h,vy:-rand(h*.75,h*1.05),hue:pick([5,30,45,55,190,280,320,140]),ty:rand(h*.1,h*.45),k:Math.floor(rand(3))});}
    for(let i=rockets.length-1;i>=0;i--){const r=rockets[i];const oy=r.y;r.y+=r.vy*dt;r.vy+=h*.35*dt;
      tx.strokeStyle=`hsla(${r.hue},100%,80%,.9)`;tx.lineWidth=2;tx.beginPath();tx.moveTo(r.x,oy);tx.lineTo(r.x+Math.sin(t*20)*1,r.y);tx.stroke();
      if(r.y<r.ty||r.vy>-40){rockets.splice(i,1);const n=Math.floor(80+A.bass*90),pw=rand(h*.25,h*.42)*(1+A.bass*.4);
        for(let j=0;j<n;j++){const a=j/n*TAU+rand(.05),s=r.k===1?pw:pw*Math.pow(Math.random(),.45);
          sparks.push({x:r.x,y:r.y,vx:Math.cos(a)*s,vy:Math.sin(a)*s,l:rand(1.2,2.4),m:2.4,hue:r.hue+rand(-15,15),wil:r.k===2});}}}
    tx.lineWidth=2;
    for(let i=sparks.length-1;i>=0;i--){const s=sparks[i];const ox=s.x,oy=s.y;const dr=s.wil?.955:.975;
      s.vx*=Math.pow(dr,dt*60);s.vy=s.vy*Math.pow(dr,dt*60)+(s.wil?120:70)*dt;s.x+=s.vx*dt;s.y+=s.vy*dt;s.l-=dt;
      const al=clamp(s.l/1.4,0,1);tx.strokeStyle=`hsla(${s.hue},100%,${60+al*25}%,${al})`;tx.beginPath();tx.moveTo(ox,oy);tx.lineTo(s.x,s.y);tx.stroke();
      if(s.l<=0){sparks.splice(i,1);if(Math.random()<.6){const p=parts[ring++%parts.length];p.x=s.x;p.y=s.y;p.c=`hsl(${s.hue},75%,68%)`;p.l=rand(6,14);p.keep=true;}}}
    ctx.drawImage(tc,0,0,w,h);
    // stars w/ halos
    ctx.save();ctx.globalCompositeOperation='lighter';
    for(const s of stars){const v=A.bins[s.b],r=s.r*(1+v*.7+Math.sin(t*2+s.p)*.1);
      const g=ctx.createRadialGradient(s.x,s.y,0,s.x,s.y,r*4);g.addColorStop(0,'rgba(255,250,200,.95)');g.addColorStop(.25,'rgba(250,230,120,.45)');g.addColorStop(1,'rgba(250,230,120,0)');
      ctx.fillStyle=g;ctx.beginPath();ctx.arc(s.x,s.y,r*4,0,TAU);ctx.fill();
      ctx.lineWidth=2;for(let k=1;k<=3;k++){ctx.strokeStyle=`rgba(255,240,150,${.28-k*.06})`;ctx.setLineDash([6,5]);ctx.lineDashOffset=t*10*k;ctx.beginPath();ctx.arc(s.x,s.y,r*(1.6+k*.9),0,TAU);ctx.stroke();}
      ctx.setLineDash([]);}
    const mg=ctx.createRadialGradient(moon.x,moon.y,0,moon.x,moon.y,moon.r*3.5);mg.addColorStop(0,'rgba(255,220,120,.4)');mg.addColorStop(1,'rgba(255,220,120,0)');ctx.fillStyle=mg;ctx.fillRect(moon.x-moon.r*4,moon.y-moon.r*4,moon.r*8,moon.r*8);
    ctx.restore();
    ctx.drawImage(moon.c,moon.x-moon.r*1.2,moon.y-moon.r*1.2);
    // village hills
    ctx.fillStyle='#0b1733';ctx.beginPath();ctx.moveTo(0,h);for(let x=0;x<=w;x+=10)ctx.lineTo(x,h*.86-Math.sin(x*.004+1)*h*.04-Math.sin(x*.011)*h*.015);ctx.lineTo(w,h);ctx.fill();
    for(let i=0;i<14;i++){const x=w*.3+i*w*.035,y=h*.9+Math.sin(i*1.7)*h*.012;ctx.fillStyle='#08112a';ctx.fillRect(x,y-14,22,14);ctx.beginPath();ctx.moveTo(x-3,y-14);ctx.lineTo(x+11,y-24);ctx.lineTo(x+25,y-14);ctx.fill();
      ctx.fillStyle=`rgba(255,215,90,${.6+.4*Math.sin(t*2+i)})`;ctx.fillRect(x+8,y-9,5,5);}
    ctx.fillStyle='#08112a';const sx=w*.56;ctx.fillRect(sx,h*.82,10,h*.08);ctx.beginPath();ctx.moveTo(sx-2,h*.82);ctx.lineTo(sx+5,h*.74);ctx.lineTo(sx+12,h*.82);ctx.fill();
    // cypress flame
    ctx.fillStyle='#06100c';ctx.beginPath();const cx=w*.11,base=h,top=h*.18;ctx.moveTo(cx-w*.05,base);
    for(let i=0;i<=20;i++){const p=i/20,y=lerp(base,top,p),wd=w*.05*(1-p*.9)+Math.sin(p*18+t*.8)*w*.008;ctx.lineTo(cx-wd+Math.sin(p*7+t*.5)*w*.01,y);}
    for(let i=20;i>=0;i--){const p=i/20,y=lerp(base,top,p),wd=w*.05*(1-p*.9)+Math.cos(p*16+t*.7)*w*.008;ctx.lineTo(cx+wd+Math.sin(p*7+t*.5)*w*.01,y);}ctx.fill();
    ctx.strokeStyle='rgba(30,70,40,.6)';ctx.lineWidth=2;for(let i=0;i<14;i++){const p=hr(i*7.1),y=lerp(base,top,p);ctx.beginPath();ctx.moveTo(cx-w*.02,y);ctx.quadraticCurveTo(cx,y-20,cx+w*.015*(1-p),y-35);ctx.stroke();}
    bloom(ctx,.35+A.level*.35);
  }};
}

/* 4. JUNGLE PULSE */
function Jungle(){
  let w,h,leaves,falling=[],nextFall=2,S,cats=[],nextCat=.3;
  /* leaf kinds: shapes are built once per leaf as Path2D in unit space (stem at -1, tip at +1) */
  const KINDS=[['lance',3],['heart',2],['monstera',2],['palm',1.4],['fern',1.4],['banana',1.2],['calathea',1.6],['arrow',1.4],['croton',1],['split',1]];
  const KT=KINDS.reduce((t,k)=>t+k[1],0);
  function pickKind(){let r=Math.random()*KT;for(const[k,wt]of KINDS){r-=wt;if(r<=0)return k;}return 'lance';}
  function lancelet(P,x0,y0,ang,len,wd){const c=Math.cos(ang),s0=Math.sin(ang),X=(u,v)=>x0+u*c-v*s0,Y=(u,v)=>y0+u*s0+v*c;
    P.moveTo(X(0,0),Y(0,0));P.bezierCurveTo(X(len*.3,-wd),Y(len*.3,-wd),X(len*.75,-wd*.8),Y(len*.75,-wd*.8),X(len,0),Y(len,0));P.bezierCurveTo(X(len*.75,wd*.8),Y(len*.75,wd*.8),X(len*.3,wd),Y(len*.3,wd),X(0,0),Y(0,0));}
  function build(L){
    const k=L.kind,wd=L.wd,body=new Path2D(),vein=new Path2D();let rule='nonzero';
    const mid=(bend=.08)=>{vein.moveTo(-1.12,0);vein.quadraticCurveTo(0,-bend,.95,0);};
    if(k==='heart'||k==='arrow'||k==='split'){
      const W=wd*(k==='arrow'?1.25:1.55);
      if(k==='arrow'){body.moveTo(1,0);body.quadraticCurveTo(.05,-W*.95,-1,-W);body.lineTo(-.55,0);body.lineTo(-1,W);body.quadraticCurveTo(.05,W*.95,1,0);}
      else{body.moveTo(-.72,0);body.bezierCurveTo(-1.25,-W,.15,-W*1.05,1,0);body.bezierCurveTo(.15,W*1.05,-1.25,W,-.72,0);}
      mid(.02);for(let i=1;i<5;i++){const x=-.7+i*.33;vein.moveTo(-.72,0);vein.quadraticCurveTo(x-.1,-W*.35*(1.2-i*.2),x+.15,-W*.7*(1.1-i*.18));vein.moveTo(-.72,0);vein.quadraticCurveTo(x-.1,W*.35*(1.2-i*.2),x+.15,W*.7*(1.1-i*.18));}
      if(k==='split'){rule='evenodd';for(let i=0;i<4;i++){const x=-.45+i*.36,y=W*.48*(1-i*.15);body.moveTo(x,-y*.35);body.lineTo(x+.06,-y*1.25);body.lineTo(x+.13,-y*.35);body.closePath();body.moveTo(x,y*.35);body.lineTo(x+.06,y*1.25);body.lineTo(x+.13,y*.35);body.closePath();}}
    }else if(k==='monstera'){
      rule='evenodd';const rx=1,ry=wd*1.6,cx=.02,N=18;
      for(let i=0;i<=N;i++){const a=Math.PI+i/N*TAU,x=cx+Math.cos(a)*rx,y=Math.sin(a)*ry;
        if(i===0){body.moveTo(x,y);continue;}
        const nearEnd=Math.abs(Math.cos(a))>.86;
        if(i%2===0&&!nearEnd&&i<N){const a2=a+TAU/N*.14,d=.5+Math.random()*.14;body.lineTo(cx+Math.cos(a)*rx*d,Math.sin(a)*ry*d);body.lineTo(cx+Math.cos(a2)*rx*d,Math.sin(a2)*ry*d);body.lineTo(cx+Math.cos(a2)*rx,Math.sin(a2)*ry);}
        else body.lineTo(x,y);}
      body.closePath();
      for(let i=0;i<4;i++){const x=-.5+i*.32;for(const sg of[-1,1]){body.ellipse(x,sg*ry*.22,.06,.03,sg*.4,0,TAU);}}
      mid(.02);for(let i=1;i<N;i+=2){const a=Math.PI+i/N*TAU;if(Math.abs(Math.cos(a))>.9)continue;vein.moveTo(cx+Math.cos(a)*.15,0);vein.lineTo(cx+Math.cos(a)*rx*.9,Math.sin(a)*ry*.9);}
    }else if(k==='palm'||k==='fern'){
      const n=k==='palm'?15:20;vein.moveTo(-1.15,0);vein.quadraticCurveTo(0,-.12,1,0);
      for(let i=1;i<=n;i++){const t=i/(n+1),x=-1+t*2,y=-.12*4*t*(1-t),env=k==='palm'?.62*(1-Math.pow(Math.abs(t-.35)*1.4,2)):.42*(1-t*.8),lw=k==='palm'?.05:.07;
        for(const sg of[-1,1]){lancelet(body,x,y,sg*(k==='palm'?1.05:1.25)+(k==='palm'?.35:.25),Math.max(.08,env),lw);}}
    }else if(k==='banana'){
      const W=wd*1.05;body.moveTo(-1,0);
      for(let x=-1;x<=1.001;x+=.1){const e=W*Math.sin(Math.PI*Math.min(1,(x+1)/2*1.15))*(x>.7?(1-x)/0.3:1);const tear=(Math.random()<.18&&x>-.8&&x<.8);body.lineTo(x,-e);if(tear){body.lineTo(x+.02,-e*.3);body.lineTo(x+.05,-e);}}
      for(let x=1;x>=-1;x-=.1){const e=W*Math.sin(Math.PI*Math.min(1,(x+1)/2*1.15))*(x>.7?(1-x)/0.3:1);const tear=(Math.random()<.18&&x>-.8&&x<.8);body.lineTo(x,e);if(tear){body.lineTo(x-.02,e*.3);body.lineTo(x-.05,e);}}
      body.closePath();mid(0);for(let x=-.9;x<.95;x+=.07){const e=W*Math.sin(Math.PI*Math.min(1,(x+1)/2*1.15))*(x>.7?(1-x)/0.3:1)*.92;vein.moveTo(x,0);vein.lineTo(x+.12,-e);vein.moveTo(x,0);vein.lineTo(x+.12,e);}
    }else{ // lance, calathea, croton
      const W=wd*(k==='calathea'?1.35:k==='croton'?.75:1);
      body.moveTo(-1,0);body.bezierCurveTo(-.55,-W*1.1,.45,-W,1,0);body.bezierCurveTo(.45,W,-.55,W*1.1,-1,0);
      mid();for(let i=1;i<7;i++){const x=-1+i*.28,f=(1-Math.abs(x)*.5);vein.moveTo(x,0);vein.quadraticCurveTo(x+.12,-W*.4,x+.28,-W*.72*f);vein.moveTo(x,0);vein.quadraticCurveTo(x+.12,W*.4,x+.28,W*.72*f);}
      if(k==='calathea'){L.stripes=new Path2D();for(let i=0;i<9;i++){const x=-.85+i*.2;L.stripes.moveTo(x,0);L.stripes.lineTo(x+.12,-W);L.stripes.moveTo(x,0);L.stripes.lineTo(x+.12,W);}}
    }
    L.body=body;L.vein=vein;L.rule=rule;
  }
  function leaf(x,y){const kind=pickKind();const L={x,y,kind,sz:S*rand(.7,1.35)*({palm:1.5,fern:1.3,banana:1.45,monstera:1.15,croton:.9}[kind]||1),rot:rand(TAU),ho:rand(-28,28)+({banana:-18,calathea:35,croton:-95,fern:12}[kind]||0),b:Math.floor(rand(2,52)),ph:rand(TAU),wd:rand(.42,.62),lt:rand(18,30)+(kind==='banana'?6:0),vari:Math.random()<.12};build(L);return L;}
  function drawLeaf(ctx,L,t,A,hueBase,fall){
    const v=A.bins[L.b],sc=1+v*.13+A.pulse*.05;
    const sx=Math.sin(t*37+L.ph)*v*v*4,sy=Math.cos(t*29+L.ph)*v*v*4,rr=L.rot+Math.sin(t*41+L.ph)*v*v*(L.kind==='palm'||L.kind==='fern'?.16:.09);
    ctx.save();ctx.translate(L.x+sx,L.y+sy);ctx.rotate(rr);const s=L.sz*sc;ctx.scale(s,s);
    const hue=L.kind==='croton'?(hueBase*.25+L.ho+40):hueBase+L.ho;
    ctx.save();ctx.translate(.06,.1);ctx.fillStyle='rgba(0,0,0,.45)';ctx.fill(L.body,L.rule);ctx.restore();
    const g=ctx.createLinearGradient(-1,-.5,1,.5);g.addColorStop(0,`hsl(${hue},80%,${L.lt*.4}%)`);g.addColorStop(.6,`hsl(${hue+12},85%,${L.lt+v*18}%)`);g.addColorStop(1,`hsl(${hue+25},90%,${L.lt*.9+v*26}%)`);
    ctx.fillStyle=g;ctx.fill(L.body,L.rule);
    if(L.stripes||L.vari||L.kind==='croton'){ctx.save();ctx.clip(L.body,L.rule);
      if(L.stripes){ctx.lineWidth=.07;ctx.strokeStyle=`hsla(${hue-40},70%,${12+v*10}%,.75)`;ctx.stroke(L.stripes);ctx.lineWidth=.025;ctx.strokeStyle=`hsla(${hue+60},90%,${70+v*20}%,.6)`;ctx.stroke(L.stripes);}
      if(L.vari){ctx.fillStyle=`hsla(${hue+20},40%,${80+v*15}%,.35)`;for(let i=0;i<6;i++){ctx.beginPath();ctx.ellipse(-.7+i*.3,(i%2?-.18:.15),.16,.07,.5*(i%2?1:-1),0,TAU);ctx.fill();}}
      if(L.kind==='croton'){ctx.fillStyle=`hsla(${hue+30},100%,${50+v*20}%,.55)`;for(let i=0;i<9;i++){ctx.beginPath();ctx.arc(-.8+i*.2,((i*37)%7-3)*.06,.05,0,TAU);ctx.fill();}}
      ctx.restore();}
    ctx.lineWidth=1.6/s;ctx.strokeStyle=`hsla(${hue+30},100%,${55+v*25}%,${.35+v*.6})`;if(L.kind!=='palm'&&L.kind!=='fern')ctx.stroke(L.body);
    ctx.lineWidth=(L.kind==='palm'||L.kind==='fern'?2.2:1.3)/s;ctx.strokeStyle=L.kind==='croton'?`hsla(55,100%,${65+v*20}%,${.5+v*.5})`:`hsla(${hue+40},100%,${70+v*20}%,${.25+v*.7+A.pulse*.2})`;ctx.stroke(L.vein);
    ctx.restore();
  }
  return{name:'JUNGLE PULSE',sub:'Leaves shiver, glow and drift through colour',
  init(W,H){w=W;h=H;S=Math.min(w,h)*.085;leaves=[];
    const n=Math.ceil(w*h/(S*S)*1.25);for(let i=0;i<n;i++)leaves.push(leaf(rand(-S,w+S),rand(-S,h+S)));
    leaves.sort((a,b)=>a.y-b.y);falling=[];},
  draw(ctx,t,dt,A){
    ctx.fillStyle='#010804';ctx.fillRect(0,0,w,h);
    const hueBase=112+45*Math.sin(t*.03-.6)+30*Math.sin(t*.0093+2);
    const split=Math.floor(leaves.length*.85);
    for(let i=0;i<split;i++)drawLeaf(ctx,leaves[i],t,A,hueBase);
    /* neon glowstick caterpillars slither through the leaves */
    nextCat-=dt;
    if(nextCat<0&&cats.length<3){const side=Math.floor(rand(4)),m=S*2;let x,y,a;
      if(side===0){x=-m;y=rand(h*.15,h*.85);a=rand(-.5,.5);}else if(side===1){x=w+m;y=rand(h*.15,h*.85);a=Math.PI+rand(-.5,.5);}else if(side===2){x=rand(w*.15,w*.85);y=-m;a=Math.PI/2+rand(-.5,.5);}else{x=rand(w*.15,w*.85);y=h+m;a=-Math.PI/2+rand(-.5,.5);}
      const n=Math.floor(rand(12,22)),hue=pick([300,185,95,30,265,330,55]);cats.push({x,y,a,n,hue,r:S*rand(.14,.19),sp:rand(42,70),ph:rand(TAU),trail:[],age:0,turn:rand(TAU)});nextCat=rand(5,12);}
    ctx.save();ctx.globalCompositeOperation='lighter';
    for(let ci=cats.length-1;ci>=0;ci--){const c=cats[ci];c.age+=dt;
      c.a+=Math.sin(t*.7+c.turn)*dt*.9+(noise1(t*.5+c.turn)-.5)*dt*1.2;
      const sp=c.sp*(1+A.level*1.4)*(.75+.5*Math.max(0,Math.sin(t*6+c.ph)));
      c.x+=Math.cos(c.a)*sp*dt;c.y+=Math.sin(c.a)*sp*dt;c.trail.unshift([c.x,c.y,c.a]);
      const gap=c.r*1.7;let need=c.n*gap/(Math.max(1,sp*dt))+4;if(c.trail.length>need+60)c.trail.length=Math.ceil(need+60);
      const pts=[];let acc=0,k=0;pts.push(c.trail[0]);
      for(let j=1;j<c.trail.length&&pts.length<c.n;j++){const p0=c.trail[j-1],p1=c.trail[j];acc+=Math.hypot(p1[0]-p0[0],p1[1]-p0[1]);if(acc>=gap){pts.push(p1);acc=0;}}
      for(let j=pts.length-1;j>=0;j--){const[px,py,pa]=pts[j],wig=Math.sin(t*9+c.ph-j*.7)*c.r*.55,ox=-Math.sin(pa)*wig,oy=Math.cos(pa)*wig;
        const v=A.bins[Math.floor(4+j*2.4)%64],puls=.75+.6*v+.35*Math.max(0,Math.sin(t*7-j*.8+c.ph)),rr=c.r*(j===0?1.25:1-j/c.n*.35)*puls,X=px+ox,Y=py+oy;
        const g=ctx.createRadialGradient(X,Y,rr*.6,X,Y,rr*2.4);g.addColorStop(0,`hsla(${c.hue},100%,60%,${.45+v*.35})`);g.addColorStop(1,`hsla(${c.hue},100%,50%,0)`);
        ctx.fillStyle=g;ctx.beginPath();ctx.arc(X,Y,rr*2.4,0,TAU);ctx.fill();
        ctx.globalCompositeOperation='source-over';ctx.fillStyle=`hsl(${c.hue},100%,${45+v*20}%)`;ctx.beginPath();ctx.arc(X,Y,rr,0,TAU);ctx.fill();
        ctx.fillStyle=`hsla(${c.hue},100%,90%,${.8+v*.2})`;ctx.beginPath();ctx.ellipse(X,Y,rr*.55,rr*.32,pa,0,TAU);ctx.fill();
        ctx.strokeStyle=`hsla(${c.hue},90%,25%,.8)`;ctx.lineWidth=Math.max(1,rr*.12);ctx.beginPath();ctx.arc(X,Y,rr,0,TAU);ctx.stroke();
        if(j===0){ctx.fillStyle='#fff';for(const sg of[-1,1]){ctx.beginPath();ctx.arc(X+Math.cos(pa+sg*.6)*rr*.55,Y+Math.sin(pa+sg*.6)*rr*.55,rr*.18,0,TAU);ctx.fill();}}
        ctx.globalCompositeOperation='lighter';
        if(j===0){ctx.strokeStyle=`hsla(${c.hue},100%,80%,.9)`;ctx.lineWidth=Math.max(1,c.r*.18);for(const sg of[-1,1]){const aa=pa+sg*.5;ctx.beginPath();ctx.moveTo(X,Y);ctx.quadraticCurveTo(X+Math.cos(aa)*rr*1.6,Y+Math.sin(aa)*rr*1.6,X+Math.cos(pa+sg*.35)*rr*2.6+Math.sin(t*12)*2,Y+Math.sin(pa+sg*.35)*rr*2.6);ctx.stroke();}}}
      const out=c.x<-S*4||c.x>w+S*4||c.y<-S*4||c.y>h+S*4;if(out&&c.age>3)cats.splice(ci,1);}
    ctx.restore();
    for(let i=split;i<leaves.length;i++)drawLeaf(ctx,leaves[i],t,A,hueBase);
    nextFall-=dt;
    if(nextFall<0||(A.beat&&A.pulse>.8&&Math.random()<.12&&falling.length<4)){const L=leaf(rand(w*.05,w*.95),-S*1.5);L.land=rand(h*.08,h*.95);L.vy=rand(45,85);L.sw=rand(TAU);L.sz*=1.15;falling.push(L);nextFall=rand(1.5,4);}
    for(let i=falling.length-1;i>=0;i--){const L=falling[i];L.y+=L.vy*dt;L.x+=Math.sin(t*1.4+L.sw)*40*dt;L.rot+=Math.sin(t*1.8+L.sw)*.9*dt;
      if(L.y>=L.land){falling.splice(i,1);leaves.push(L);const max=Math.ceil(w*h/(S*S)*1.6);if(leaves.length>max)leaves.splice(0,leaves.length-max);}
      else{ctx.save();ctx.globalAlpha=.4;ctx.fillStyle='#000';ctx.beginPath();ctx.ellipse(L.x+S*.3,L.land+S*.3,S*(1-(L.land-L.y)/h)*.8,S*.3,0,0,TAU);ctx.fill();ctx.restore();drawLeaf(ctx,L,t,A,hueBase,true);}}
    const vg=ctx.createRadialGradient(w/2,h/2,Math.min(w,h)*.3,w/2,h/2,Math.max(w,h)*.75);vg.addColorStop(0,'rgba(0,0,0,0)');vg.addColorStop(1,'rgba(0,0,0,.55)');ctx.fillStyle=vg;ctx.fillRect(0,0,w,h);
    bloom(ctx,.22+A.level*.55+A.pulse*.3);
  }};
}

/* 5. LIGHT CYCLES (the scoreboard lasts as long as the page is open) */
const TRON_SCORE={wins:[0,0,0,0,0,0],last:-1};
function Tron(){
  let w,h,cell,cols,rows,ox,oy,grid,vis,q,stamp=0,bikes,tc,tx,acc=0,state='run',rt=0,filled=0,round=1;
  const COL=['#00f0ff','#ff6a3d','#ff2bd6','#ffe94d','#7dff4d','#a98bff'],CN=['CYAN','SALMON','MAGENTA','YELLOW','LIME','VIOLET'];let steps=0,winner=-1;const D=[[1,0],[0,1],[-1,0],[0,-1]];
  const free=(x,y)=>x>=0&&y>=0&&x<cols&&y<rows&&!grid[y*cols+x];
  function space(sx,sy,lim){stamp++;let hd=0,tl=0;const s0=sy*cols+sx;q[tl++]=s0;vis[s0]=stamp;let n=0;
    while(hd<tl&&n<lim){const id=q[hd++];n++;const x=id%cols;
      if(x>0){const j=id-1;if(!grid[j]&&vis[j]!==stamp){vis[j]=stamp;q[tl++]=j;}}
      if(x<cols-1){const j=id+1;if(!grid[j]&&vis[j]!==stamp){vis[j]=stamp;q[tl++]=j;}}
      if(id>=cols){const j=id-cols;if(!grid[j]&&vis[j]!==stamp){vis[j]=stamp;q[tl++]=j;}}
      if(id<cols*(rows-1)){const j=id+cols;if(!grid[j]&&vis[j]!==stamp){vis[j]=stamp;q[tl++]=j;}}}
    return n;}
  const cx=x=>ox+(x+.5)*cell,cy=y=>oy+(y+.5)*cell;
  function reset(){grid=new Uint8Array(cols*rows);vis=new Int32Array(cols*rows);q=new Int32Array(cols*rows);stamp=0;filled=0;tx.clearRect(0,0,w,h);
    bikes=COL.map((c,i)=>{let x,y;do{x=Math.floor(rand(cols*.15,cols*.85));y=Math.floor(rand(rows*.15,rows*.85));}while(grid[y*cols+x]);
      grid[y*cols+x]=i+1;filled++;return{x,y,d:Math.floor(rand(4)),c,i,alive:true,out:0,cells:1};});state='run';rt=0;steps=0;winner=-1;}
  function step(){steps++;
    for(const b of bikes){if(!b.alive)continue;
      const opts=[b.d,(b.d+1)%4,(b.d+3)%4].filter(d=>free(b.x+D[d][0],b.y+D[d][1]));
      if(!opts.length){b.alive=false;b.out=steps;continue;}
      const sc=opts.map(d=>{const nx=b.x+D[d][0],ny=b.y+D[d][1];let s=space(nx,ny,700);
        for(const o of bikes)if(o!==b&&o.alive&&Math.abs(o.x-nx)+Math.abs(o.y-ny)<=2)s-=40;return s;});
      const best=Math.max(...sc);let ch=b.d;
      const si=opts.indexOf(b.d);
      if(Math.random()<.07+A.pulse*.25){const turns=opts.map((d,i)=>[d,sc[i]]).filter(([d,s])=>d!==b.d&&s>=best*.85);if(turns.length)ch=pick(turns)[0];else ch=opts[sc.indexOf(best)];}
      else ch=(si>=0&&sc[si]>=best*.97)?b.d:opts[sc.indexOf(best)];
      const ox_=b.x,oy_=b.y;b.d=ch;b.x+=D[ch][0];b.y+=D[ch][1];grid[b.y*cols+b.x]=COL.indexOf(b.c)+1;filled++;b.cells++;
      tx.lineCap='square';tx.strokeStyle=b.c;tx.lineWidth=cell*.42;tx.beginPath();tx.moveTo(cx(ox_),cy(oy_));tx.lineTo(cx(b.x),cy(b.y));tx.stroke();
      tx.strokeStyle='rgba(255,255,255,.85)';tx.lineWidth=cell*.12;tx.beginPath();tx.moveTo(cx(ox_),cy(oy_));tx.lineTo(cx(b.x),cy(b.y));tx.stroke();
    }
    if(!bikes.some(b=>b.alive)){state='reset';rt=0;const wb=bikes.slice().sort((a,b)=>b.out-a.out||b.cells-a.cells)[0];winner=wb.i;TRON_SCORE.wins[winner]++;TRON_SCORE.last=winner;}
  }
  return{name:'LIGHT CYCLES',sub:'Six riders, zero crashes \u00b7 the grid resets when it fills',
  init(W,H){w=W;h=H;cell=Math.max(7,Math.floor(Math.min(w,h)/58));cols=Math.floor((w-40)/cell);rows=Math.floor((h-90)/cell);
    ox=(w-cols*cell)/2;oy=(h-rows*cell)/2+12;tc=mk(w,h);tx=tc.getContext('2d');reset();},
  draw(ctx,t,dt,A){
    ctx.fillStyle='#00040a';ctx.fillRect(0,0,w,h);
    ctx.lineWidth=1;
    ctx.strokeStyle=`rgba(0,200,255,${.05+A.pulse*.05})`;ctx.beginPath();for(let x=0;x<=cols;x++){ctx.moveTo(ox+x*cell,oy);ctx.lineTo(ox+x*cell,oy+rows*cell);}for(let y=0;y<=rows;y++){ctx.moveTo(ox,oy+y*cell);ctx.lineTo(ox+cols*cell,oy+y*cell);}ctx.stroke();
    ctx.strokeStyle=`rgba(0,220,255,${.16+A.pulse*.2})`;ctx.beginPath();for(let x=0;x<=cols;x+=5){ctx.moveTo(ox+x*cell,oy);ctx.lineTo(ox+x*cell,oy+rows*cell);}for(let y=0;y<=rows;y+=5){ctx.moveTo(ox,oy+y*cell);ctx.lineTo(ox+cols*cell,oy+y*cell);}ctx.stroke();
    ctx.strokeStyle='#00eaff';ctx.lineWidth=2;ctx.shadowColor='#00eaff';ctx.shadowBlur=14;ctx.strokeRect(ox-3,oy-3,cols*cell+6,rows*cell+6);ctx.shadowBlur=0;
    if(state==='run'){acc+=dt*(14+A.level*38);let g=0;while(acc>=1&&g++<6){step();acc--;if(state!=='run')break;}}
    if(state==='reset'){rt+=dt;ctx.globalAlpha=clamp(1-(rt-1)/1.2,0,1);}
    ctx.drawImage(tc,0,0,w,h);ctx.globalAlpha=1;
    if(state==='run')for(const b of bikes){if(!b.alive)continue;const x=cx(b.x),y=cy(b.y),[dx,dy]=D[b.d];
      ctx.save();ctx.translate(x,y);ctx.rotate(Math.atan2(dy,dx));ctx.shadowColor=b.c;ctx.shadowBlur=16;ctx.fillStyle=b.c;
      ctx.fillRect(-cell*1.1,-cell*.42,cell*1.7,cell*.84);ctx.fillStyle='#fff';ctx.fillRect(cell*.25,-cell*.22,cell*.45,cell*.44);
      ctx.fillStyle='#000';ctx.fillRect(-cell*.9,-cell*.18,cell*.9,cell*.36);ctx.restore();}
    ctx.font=`700 ${Math.max(11,cell*1.1)}px Orbitron, sans-serif`;ctx.fillStyle='#7ff6ff';ctx.textAlign='left';ctx.textBaseline='top';
    ctx.fillText(`GRID ${String(round).padStart(2,'0')} \u00b7 FILL ${Math.round(filled/(cols*rows)*100)}% \u00b7 RIDERS ${bikes.filter(b=>b.alive).length}`,ox,8);
    {const fsz=Math.max(10,cell*1.05);ctx.font=`700 ${fsz}px Orbitron, sans-serif`;ctx.textAlign='right';let x=ox+cols*cell;
      for(let i=COL.length-1;i>=0;i--){const txt=String(TRON_SCORE.wins[i]);ctx.fillStyle=COL[i];ctx.shadowColor=COL[i];ctx.shadowBlur=i===TRON_SCORE.last?12:0;ctx.fillText(txt,x,8);x-=ctx.measureText(txt).width+4;ctx.fillRect(x-fsz*.8,8+fsz*.1,fsz*.8,fsz*.8);x-=fsz*.8+12;}
      ctx.shadowBlur=0;ctx.fillStyle='#7ff6ff';ctx.fillText('WINS',x,8);}
    if(state==='reset'){
      const fl=Math.random()<.12?.3:1;ctx.textAlign='center';ctx.textBaseline='middle';const fs=Math.min(w,h)*.2;
      ctx.font=`900 ${fs}px Orbitron, sans-serif`;ctx.lineWidth=3;ctx.strokeStyle=`rgba(0,240,255,${fl})`;ctx.shadowColor='#00eaff';ctx.shadowBlur=30;ctx.strokeText('RESET',w/2,h/2);
      ctx.fillStyle=`rgba(220,255,255,${.85*fl})`;ctx.fillText('RESET',w/2,h/2);ctx.shadowBlur=0;
      ctx.font=`500 ${fs*.12}px Orbitron, sans-serif`;ctx.fillStyle='#ff9b7f';ctx.fillText('GRID FULL \u00b7 DEREZZING',w/2,h/2+fs*.62);
      if(winner>=0){ctx.font=`900 ${fs*.2}px Orbitron, sans-serif`;ctx.fillStyle=COL[winner];ctx.shadowColor=COL[winner];ctx.shadowBlur=18;ctx.fillText(`${CN[winner]} WINS GRID ${String(round).padStart(2,'0')}`,w/2,h/2-fs*.78);ctx.shadowBlur=0;
        const order=COL.map((c,i)=>i).sort((a,b)=>TRON_SCORE.wins[b]-TRON_SCORE.wins[a]),lh=fs*.15,y0=h/2+fs*.85;ctx.font=`700 ${lh*.8}px Orbitron, sans-serif`;
        order.forEach((i,k)=>{const col=k%3,row=Math.floor(k/3),x=w/2+(col-1)*Math.min(w*.3,lh*9),y=y0+row*lh*1.4;ctx.fillStyle=COL[i];ctx.fillText(`${k+1}. ${CN[i]} ${TRON_SCORE.wins[i]}`,x,y);});}
      if(rt>4.5){round++;reset();}
    }
    bloom(ctx,.7+A.level*.5+A.pulse*.3);
  }};
}

/* 6. AURORA ROAD (Iceland) */
/* Icelandic animals for Aurora Road: 6 sheep and 6 horse looks */
const SHEEP=[{w:'#e9e6dc',f:'#2a2522'},{w:'#d8ccb4',f:'#3a2e24'},{w:'#2e2a28',f:'#151110'},{w:'#7a5a3e',f:'#2d1f14'},{w:'#e2ddd2',f:'#e2ddd2',sp:'#3a302a'},{w:'#f2efe6',f:'#5a4a3e',big:1}];
const HORSE=[{b:'#7a3e1c',m:'#3a1a0a'},{b:'#1c1714',m:'#0a0807'},{b:'#e8e2d6',m:'#bdb5a6'},{b:'#c99a4a',m:'#f2e6c6'},{b:'#8f9296',m:'#e6e6e6',dap:1},{b:'#f0ece4',m:'#2a2420',pinto:'#6a3a1c'}];
function drawSheep(ctx,x,y,s,v,t,ph,dir){const S=SHEEP[v];ctx.save();ctx.translate(x,y);ctx.scale(dir*s,s);
  const graze=Math.sin(t*1.3+ph)>.3?1:0,bob=Math.sin(t*4+ph)*.03;
  ctx.fillStyle='#0d0d0d';for(const lx of[-.35,-.15,.2,.38]){ctx.fillRect(lx,-.25,.08,.45);}
  ctx.fillStyle=S.w;const r=S.big?.34:.28;for(const[cx,cy]of[[-.3,-.55],[0,-.62],[.3,-.55],[-.15,-.4],[.18,-.42],[-.42,-.42],[.42,-.45]]){ctx.beginPath();ctx.arc(cx,cy,r,0,TAU);ctx.fill();}
  if(S.sp){ctx.fillStyle=S.sp;ctx.beginPath();ctx.arc(-.1,-.6,.13,0,TAU);ctx.arc(.25,-.45,.1,0,TAU);ctx.fill();}
  ctx.fillStyle=S.f;ctx.save();ctx.translate(.62,-.55+graze*.35+bob);ctx.rotate(graze*.6);ctx.beginPath();ctx.ellipse(.08,0,.2,.13,.3,0,TAU);ctx.fill();ctx.fillRect(-.08,-.16,.08,.07);ctx.restore();
  ctx.restore();}
function drawHorse(ctx,x,y,s,v,t,ph,dir,trot){const H=HORSE[v];ctx.save();ctx.translate(x,y);ctx.scale(dir*s,s);
  const k=trot?Math.sin(t*9+ph):0,graze=!trot&&Math.sin(t*.7+ph)>.4?1:0;
  ctx.fillStyle=H.b;ctx.strokeStyle=H.b;ctx.lineWidth=.13;ctx.lineCap='round';
  [[-.55,k],[-.35,-k],[.4,-k],[.6,k]].forEach(([lx,kk])=>{ctx.beginPath();ctx.moveTo(lx,-.75);ctx.lineTo(lx+kk*.12,-.32);ctx.lineTo(lx+kk*.08,0);ctx.stroke();});
  ctx.beginPath();ctx.ellipse(0,-.95,.78,.33,0,0,TAU);ctx.fill();
  if(H.pinto){ctx.fillStyle=H.pinto;ctx.beginPath();ctx.ellipse(-.25,-.95,.3,.22,.4,0,TAU);ctx.ellipse(.35,-1,.2,.18,0,0,TAU);ctx.fill();ctx.fillStyle=H.b;}
  if(H.dap){ctx.fillStyle='rgba(255,255,255,.35)';for(let i=0;i<7;i++){ctx.beginPath();ctx.arc(-.5+i*.17,-.95+(i%2?.08:-.06),.06,0,TAU);ctx.fill();}ctx.fillStyle=H.b;}
  ctx.save();ctx.translate(.62,-1.1);ctx.rotate(graze?1.15:-.5);ctx.beginPath();ctx.moveTo(-.12,.12);ctx.lineTo(.08,-.5);ctx.lineTo(.24,-.48);ctx.lineTo(.2,.05);ctx.fill();
  ctx.translate(.18,-.5);ctx.rotate(graze?.2:1.15);ctx.beginPath();ctx.ellipse(.16,0,.24,.11,0,0,TAU);ctx.fill();ctx.fillRect(-.04,-.17,.06,.1);
  ctx.restore();
  ctx.fillStyle=H.m;ctx.beginPath();ctx.moveTo(.5,-1.15);ctx.quadraticCurveTo(.75,graze?-1.05:-1.7,.95,graze?-.75:-1.65);ctx.lineTo(.82,graze?-.9:-1.45);ctx.closePath();ctx.fill();
  ctx.beginPath();ctx.moveTo(-.76,-1.02);ctx.quadraticCurveTo(-1.05,-.8+Math.sin(t*3+ph)*.1,-.95,-.3);ctx.lineTo(-.85,-.32);ctx.quadraticCurveTo(-.9,-.75,-.7,-.9);ctx.fill();
  ctx.restore();}
function Aurora(){
  let w,h,au,ax,aw,ah,st1,st2,stars,scroll=0,bombs=[],flash=0;
  function strip(stops){const c=mk(1,256),x=c.getContext('2d'),g=x.createLinearGradient(0,0,0,256);stops.forEach(([p,col])=>g.addColorStop(p,col));x.fillStyle=g;x.fillRect(0,0,1,256);return c;}
  const LAY=[
    {par:.06,base:.64,amp:.34,f:.0021,sharp:1.5,col:['#a9bfd3','#5f7690','#152536','#08121d']},
    {par:.16,base:.68,amp:.17,f:.0034,sharp:1.3,col:['#8197ad','#3d526a','#0f1c2a','#060d16']},
  ];
  function ridge(L,X){let s=0,a=.5,f=1,n=0;for(let k=0;k<5;k++){const v=1-Math.abs(2*noise1(X*L.f*f+L.par*100+k*13.7)-1);s+=a*v*v;n+=a;f*=2.1;a*=.48;}return Math.pow(s/n,L.sharp)*1.85;}
  return{name:'AURORA ROAD',sub:'Northern lights over Iceland \u00b7 an endless slow drive',
  init(W,H){w=W;h=H;aw=Math.ceil(w/2);ah=Math.ceil(h/2);au=mk(aw,ah);ax=au.getContext('2d');
    st1=strip([[0,'rgba(170,70,255,0)'],[.35,'rgba(170,70,255,.35)'],[.75,'rgba(40,255,150,.85)'],[.93,'rgba(150,255,200,.95)'],[1,'rgba(40,255,150,0)']]);
    st2=strip([[0,'rgba(255,60,160,0)'],[.4,'rgba(255,80,170,.3)'],[.8,'rgba(40,230,220,.8)'],[1,'rgba(40,230,220,0)']]);
    stars=Array.from({length:Math.floor(w*h/3500)},()=>({x:rand(w),y:rand(h*.62),r:rand(.5,1.6),p:rand(TAU)}));},
  draw(ctx,t,dt,A){
    scroll+=dt*(28+A.level*8);
    let g=ctx.createLinearGradient(0,0,0,h*.7);g.addColorStop(0,'#01030b');g.addColorStop(.6,'#061628');g.addColorStop(1,'#0b2a36');ctx.fillStyle=g;ctx.fillRect(0,0,w,h);
    for(const s of stars){ctx.globalAlpha=.35+.65*Math.abs(Math.sin(t*.8+s.p));ctx.fillStyle='#e8f6ff';ctx.fillRect(s.x,s.y,s.r,s.r);}ctx.globalAlpha=1;
    // aurora
    ax.clearRect(0,0,aw,ah);ax.globalCompositeOperation='lighter';
    for(let c=0;c<2;c++){const S=c?st2:st1;
      for(let x=0;x<aw;x+=2){const X=x*2+scroll*.03*0;const v=A.bins[4+Math.floor(x/aw*44)];
        const base=h*(.22+.2*fbm1(X*.0012+t*.035+c*9,3)+c*.05+.07*(.5-.5*Math.cos(t*.025))+.03*Math.sin(X*.0025-t*.08))+Math.sin(X*.008+t*.6+c)*10;
        const hh=h*(.12+.3*noise1(X*.004-t*.11+c*5))*(.55+v*.9+A.bass*.3);
        ax.globalAlpha=clamp((.12+.7*noise1(X*.018+t*.5+c*3))*(.28+A.level*.6+v*.35)*(c?.55:.9),0,1);
        ax.drawImage(S,0,0,1,256,x,(base-hh)/2,2.6,hh/2);}}
    ax.globalAlpha=1;
    ctx.save();ctx.globalCompositeOperation='lighter';ctx.drawImage(au,0,0,w,h);ctx.restore();
    // mountains
    for(const L of LAY){const base=h*L.base,amp=h*L.amp;ctx.beginPath();ctx.moveTo(0,base+2);
      for(let x=0;x<=w+4;x+=4){ctx.lineTo(x,base-amp*ridge(L,x+scroll*L.par*10));}ctx.lineTo(w,base+2);ctx.closePath();
      g=ctx.createLinearGradient(0,base-amp*1.1,0,base);L.col.forEach((c,i)=>g.addColorStop([0,.28,.6,1][i],c));ctx.fillStyle=g;ctx.fill();
      ctx.save();ctx.globalCompositeOperation='lighter';ctx.fillStyle=`rgba(40,255,160,${.015+A.level*.03})`;ctx.fill();ctx.restore();}
    // waterfalls tumbling down the mountains
    ctx.save();ctx.globalCompositeOperation='lighter';
    for(const L of LAY){const base=h*L.base,amp=h*L.amp,off=scroll*L.par*10,span=L.par<.1?650:420;
      for(let k=Math.floor(off/span)-1;k<=Math.floor((off+w)/span)+1;k++){if(hr(k*13.7+L.par*99)<.5)continue;const X=k*span+hr(k*3.1)*span*.6,x=X-off;if(x<-20||x>w+20)continue;
        const top=base-amp*ridge(L,X)+amp*.12,bot=base-2;if(bot-top<h*.04)continue;
        const gw=ctx.createLinearGradient(0,top,0,bot);gw.addColorStop(0,'rgba(200,235,255,.15)');gw.addColorStop(1,`rgba(170,230,255,${.35+A.treb*.3})`);ctx.fillStyle=gw;
        const ww=Math.max(2,amp*.025);ctx.fillRect(x-ww/2,top,ww,bot-top);
        ctx.strokeStyle='rgba(235,250,255,.5)';ctx.lineWidth=1;ctx.setLineDash([4,7]);ctx.lineDashOffset=-t*60-k*9;ctx.beginPath();ctx.moveTo(x,top);ctx.lineTo(x,bot);ctx.stroke();ctx.setLineDash([]);
        ctx.fillStyle='rgba(210,240,255,.12)';ctx.beginPath();ctx.ellipse(x,bot,ww*3+Math.sin(t*3+k)*2,ww*1.3,0,0,TAU);ctx.fill();}}
    ctx.restore();
    // a volcano now and then: pulsing lava, rivers of lava, rare explosions
    {const par=1.1,off=scroll*par,span=2400,vb=h*.69;
      for(let k=Math.floor(off/span)-1;k<=Math.floor((off+w)/span)+1;k++){if(hr(k*7.7)<.45)continue;const cx=k*span+span*.5*hr(k*1.9)-off;const vw=h*.36,vh=h*.2;if(cx<-vw||cx>w+vw)continue;
        const top=vb-vh,cr=vw*.12,glow=.55+.45*Math.sin(t*2.2+k)+A.bass*.6;
        ctx.fillStyle='#0b0d12';ctx.beginPath();ctx.moveTo(cx-vw/2,vb);ctx.quadraticCurveTo(cx-cr*1.6,top+vh*.25,cx-cr,top);ctx.lineTo(cx+cr,top);ctx.quadraticCurveTo(cx+cr*1.6,top+vh*.25,cx+vw/2,vb);ctx.closePath();ctx.fill();
        ctx.save();ctx.globalCompositeOperation='lighter';
        let g2=ctx.createRadialGradient(cx,top,0,cx,top,vw*.35);g2.addColorStop(0,`rgba(255,160,40,${.55*glow})`);g2.addColorStop(1,'rgba(255,60,0,0)');ctx.fillStyle=g2;ctx.fillRect(cx-vw*.4,top-vw*.35,vw*.8,vw*.6);
        ctx.fillStyle=`rgba(255,${120+glow*60|0},40,${.8})`;ctx.fillRect(cx-cr,top-1,cr*2,3);
        for(let r=0;r<3;r++){const sd=r-1,wig=hr(k*5+r);ctx.strokeStyle=`rgba(255,${90+r*30},20,${.55+.35*glow})`;ctx.lineWidth=1.5+wig*2;ctx.beginPath();ctx.moveTo(cx+sd*cr*.6,top+1);
          for(let i=1;i<=10;i++){const p=i/10;ctx.lineTo(cx+sd*cr*.6+sd*p*vw*(.18+wig*.22)+Math.sin(p*9+k+r)*vw*.025,top+p*vh+(i===10?0:0));}
          for(let i=1;i<=6;i++){const p=i/6;ctx.lineTo(cx+sd*vw*(.4+wig*.2)+sd*p*vw*.35+Math.sin(p*7+r)*8,vb+p*h*.05);}ctx.stroke();}
        for(let i=0;i<4;i++){const sy=top-((t*14+i*22+k*7)%(vh*1.3)),sx=cx+Math.sin(t*.4+i)*12+(top-sy)*.15;ctx.fillStyle=`rgba(70,60,70,${.25*(1-(top-sy)/(vh*1.3))})`;ctx.beginPath();ctx.arc(sx,sy,8+(top-sy)*.18,0,TAU);ctx.fill();}
        if(A.beat&&A.pulse>.8&&Math.random()<.05){flash=1;for(let i=0;i<40;i++){const a=-Math.PI/2+rand(-.9,.9),sp=rand(h*.15,h*.45);bombs.push({x:cx,y:top,vx:Math.cos(a)*sp,vy:Math.sin(a)*sp,l:rand(1.2,2.6)});}}
        if(flash>0){ctx.fillStyle=`rgba(255,140,40,${flash*.5})`;ctx.beginPath();ctx.arc(cx,top,vw*.5*(1.2-flash),0,TAU);ctx.fill();}
        ctx.restore();}
      flash=Math.max(0,flash-dt*1.5);
      ctx.save();ctx.globalCompositeOperation='lighter';for(let i=bombs.length-1;i>=0;i--){const b=bombs[i];b.l-=dt;if(b.l<=0){bombs.splice(i,1);continue;}b.vy+=h*.35*dt;b.x+=b.vx*dt-dt*(28)*par;b.y+=b.vy*dt;ctx.fillStyle=`rgba(255,${150+Math.random()*80|0},40,${Math.min(1,b.l)})`;ctx.fillRect(b.x,b.y,2.5,2.5);}ctx.restore();}
    // fjord with reflection
    const wy=h*.68,wb=h*.75;ctx.fillStyle='#030d18';ctx.fillRect(0,wy,w,wb-wy);
    ctx.save();ctx.beginPath();ctx.rect(0,wy,w,wb-wy);ctx.clip();ctx.globalCompositeOperation='lighter';ctx.globalAlpha=.32;ctx.translate(0,wy*2);ctx.scale(1,-1);ctx.drawImage(au,0,0,w,h);ctx.restore();
    ctx.strokeStyle='rgba(150,255,210,.12)';ctx.lineWidth=1;ctx.beginPath();for(let i=0;i<14;i++){const y=wy+3+i*(wb-wy)/14,x=((i*137+scroll*.4)%w);ctx.moveTo(x,y);ctx.lineTo(x+40+i*6,y);}ctx.stroke();
    // near hills
    const nb=h*.84,na=h*.1;ctx.beginPath();ctx.moveTo(0,h);for(let x=0;x<=w+6;x+=6){const X=x+scroll*.45;ctx.lineTo(x,nb-na*fbm1(X*.004,3)*1.3);}ctx.lineTo(w,h);ctx.closePath();
    g=ctx.createLinearGradient(0,nb-na*1.3,0,h);g.addColorStop(0,'#13261d');g.addColorStop(1,'#040a07');ctx.fillStyle=g;ctx.fill();
    // little houses with warm windows
    const hs=1700;for(let k=Math.floor((scroll*.45)/hs)-1;k<=Math.floor((scroll*.45+w)/hs)+1;k++){const X=k*hs+500*hr(k),x=X-scroll*.45;if(x<-60||x>w+60)continue;
      const y=nb-na*fbm1(X*.004,3)*1.3+4;ctx.fillStyle='#020504';ctx.fillRect(x,y-16,30,16);ctx.beginPath();ctx.moveTo(x-4,y-16);ctx.lineTo(x+15,y-30);ctx.lineTo(x+34,y-16);ctx.fill();
      if(hr(k*3)>.4){ctx.fillRect(x+36,y-24,10,24);ctx.beginPath();ctx.moveTo(x+34,y-24);ctx.lineTo(x+41,y-38);ctx.lineTo(x+48,y-24);ctx.fill();}
      ctx.fillStyle='#ffc865';ctx.shadowColor='#ffb347';ctx.shadowBlur=12;ctx.fillRect(x+7,y-11,6,6);ctx.fillRect(x+18,y-11,6,6);ctx.shadowBlur=0;}
    // herds of sheep and Icelandic horses grazing on the hills
    {const off=scroll*.45,span=520,surf=X=>nb-na*fbm1(X*.004,3)*1.3,sz=Math.max(6,h*.022);ctx.filter='brightness(.62) saturate(.8)';
      for(let k=Math.floor(off/span)-1;k<=Math.floor((off+w)/span)+1;k++){const r0=hr(k*2.3+.7);if(r0<.25)continue;
        const isH=r0>.72,n=isH?1+Math.floor(hr(k*5.1)*4):3+Math.floor(hr(k*4.3)*7),X0=k*span+hr(k*1.1)*span*.5;
        for(let i=0;i<n;i++){const X=X0+i*(isH?sz*3.2:sz*1.6)+hr(k*9+i)*sz*2.5,x=X-off;if(x<-40||x>w+40)continue;
          const y=surf(X)+2+hr(k*3+i)*na*.25,v=Math.floor(hr(k*11+i*3)*6),dir=hr(k+i*7)>.5?1:-1,ph=k*3+i;
          const tint=ctx.globalAlpha;ctx.globalAlpha=.92;
          if(isH)drawHorse(ctx,x+(hr(ph)>.7?Math.sin(t*.3+ph)*6:0),y,sz*1.15,v,t,ph,dir,hr(ph*1.7)>.75);else drawSheep(ctx,x+Math.sin(t*.2+ph)*2,y,sz*.75*(SHEEP[v].big?1.15:1),v,t,ph,dir);
          ctx.globalAlpha=tint;}}
      ctx.filter='none';}
    // lava field foreground
    const lb=h*.965;ctx.beginPath();ctx.moveTo(0,h);for(let x=0;x<=w+5;x+=5){const X=x+scroll*1;ctx.lineTo(x,lb-h*.015*fbm1(X*.02,3)-h*.006*noise1(X*.09));}ctx.lineTo(w,h);ctx.closePath();ctx.fillStyle='#030605';ctx.fill();
    // road posts
    const sp=300,ps=scroll*1.7;for(let k=Math.floor(ps/sp)-1;k<=Math.floor((ps+w)/sp)+1;k++){const x=k*sp-ps;const y=h*.99,ph=h*.04;
      ctx.fillStyle='#d9dedd';ctx.fillRect(x,y-ph,5,ph);ctx.fillStyle='#ffd23a';ctx.shadowColor='#ffd23a';ctx.shadowBlur=8;ctx.fillRect(x,y-ph,5,ph*.18);ctx.shadowBlur=0;}
    bloom(ctx,.18+A.level*.3);
  }};
}

/* 7. FLOWER HILLS (10-min day, 30-sec night) */
let flowerSkip=0;
function Flowers(){
  let w,h,hills,fl,clouds,stars,flies,dan=[],seeds=[],patch=null,nextSprout=0;
  const CYC=630,PAL=[350,45,285,205,15,322,55,0,265];
  return{name:'FLOWER HILLS',sub:'',
  init(W,H){w=W;h=H;
    hills=[0,1,2,3].map(k=>{const r=mulberry(k*99+5);const L={base:h*(.5+k*.1),amp:h*(.06-k*.008),f1:.002+r()*.002,f2:.006+r()*.004,ph:r()*TAU,k,dots:[]};
      const n=Math.floor((260+k*170)*w/1400);for(let i=0;i<n;i++)L.dots.push({u:r(),dv:Math.pow(r(),1.3),ci:Math.floor(r()*PAL.length),r:(.8+k*.7)*(.6+r()*.8)});return L;});
    fl=Array.from({length:Math.floor(110*w/1400)},()=>({x:rand(w),by:h*rand(.9,1.03),sh:h*rand(.1,.26),pet:Math.floor(rand(5,9)),hue:pick(PAL),sz:rand(9,20)*h/900,b:Math.floor(rand(3,55)),ph:rand(TAU)})).sort((a,b)=>a.by-b.by);
    clouds=Array.from({length:6},()=>({x:rand(w),y:rand(h*.06,h*.3),s:rand(.6,1.4),v:rand(6,14)}));
    stars=Array.from({length:180},()=>({x:rand(w),y:rand(h*.55),r:rand(.5,1.6),p:rand(TAU)}));
    flies=Array.from({length:40},()=>({x:rand(w),y:rand(h*.55,h),p:rand(TAU)}));},
  draw(ctx,t,dt,A){
    const c=(t+flowerSkip)%CYC;
    const d=c<10?c/10:c<590?1:c<600?(600-c)/10:c<620?0:(c-620)/10;
    const gold=clamp(1-Math.min(Math.abs(c-15),Math.abs(c-585))/60,0,1)*.9;
    const mix=(a,b,p)=>a.map((v,i)=>Math.round(lerp(v,b[i],p)));
    const dayT=[74,168,255],dayB=[200,236,255],goT=[90,100,200],goB=[255,170,120],niT=[3,6,23],niB=[18,26,64];
    const tc=mix(niT,mix(dayT,goT,gold),d),bc=mix(niB,mix(dayB,goB,gold),d);
    let g=ctx.createLinearGradient(0,0,0,h*.65);g.addColorStop(0,`rgb(${tc})`);g.addColorStop(1,`rgb(${bc})`);ctx.fillStyle=g;ctx.fillRect(0,0,w,h);
    // stars & moon
    if(d<1){ctx.fillStyle='#fff';for(const s of stars){ctx.globalAlpha=(1-d)*(.4+.6*Math.abs(Math.sin(t+s.p)));ctx.fillRect(s.x,s.y,s.r,s.r);}
      ctx.globalAlpha=1-d;ctx.fillStyle='#f4f1dc';ctx.shadowColor='#fff';ctx.shadowBlur=30;ctx.beginPath();ctx.arc(w*.8,h*.16,h*.045,0,TAU);ctx.fill();ctx.shadowBlur=0;ctx.globalAlpha=1;}
    // sun
    if(c<600){const p=c/600,sx=lerp(-60,w+60,p),sy=h*.62-Math.sin(p*Math.PI)*h*.5,r=h*.05*(1+A.bass*.15);
      g=ctx.createRadialGradient(sx,sy,0,sx,sy,r*5);g.addColorStop(0,`rgba(255,250,210,${d})`);g.addColorStop(.2,`rgba(255,220,140,${.6*d})`);g.addColorStop(1,'rgba(255,200,120,0)');
      ctx.fillStyle=g;ctx.fillRect(sx-r*5,sy-r*5,r*10,r*10);ctx.fillStyle=`rgba(255,248,220,${d})`;ctx.beginPath();ctx.arc(sx,sy,r,0,TAU);ctx.fill();}
    // clouds
    ctx.fillStyle=`rgba(255,255,255,${.75*d})`;for(const cl of clouds){cl.x+=cl.v*dt;if(cl.x>w+150)cl.x=-150;const s=cl.s*h*.03;
      for(let i=0;i<5;i++){ctx.beginPath();ctx.arc(cl.x+i*s*1.3,cl.y+Math.sin(i*2)*s*.4,s*(1.1+Math.sin(i*1.3)*.4),0,TAU);ctx.fill();}}
    // hills with flower dots
    for(const L of hills){
      const ry=x=>L.base-L.amp*(.6*Math.sin(x*L.f1+L.ph)+.4*Math.sin(x*L.f2+L.ph*2))-L.amp;
      ctx.beginPath();ctx.moveTo(0,h);for(let x=0;x<=w+8;x+=8)ctx.lineTo(x,ry(x));ctx.lineTo(w,h);ctx.closePath();
      const lt=(22+L.k*7)*(.25+.75*d);g=ctx.createLinearGradient(0,L.base-L.amp*2,0,h);g.addColorStop(0,`hsl(${105-L.k*4},${40+L.k*5}%,${lt}%)`);g.addColorStop(1,`hsl(${120},45%,${lt*.5}%)`);ctx.fillStyle=g;ctx.fill();
      for(let ci=0;ci<PAL.length;ci++){ctx.beginPath();
        for(const p of L.dots){if(p.ci!==ci)continue;const x=p.u*w,y=ry(x)+3+p.dv*h*.32,v=A.bins[4+Math.floor(p.u*48)];if(y>h+4)continue;const r=p.r*(1+v*.9);ctx.moveTo(x+r,y);ctx.arc(x,y,r,0,TAU);}
        ctx.fillStyle=`hsl(${PAL[ci]},${85-L.k*0}%,${(55+L.k*4)*(.35+.65*d)}%)`;ctx.fill();}
    }
    // foreground flowers
    for(const f of fl){const v=A.bins[f.b],sw=Math.sin(t*1.1+f.x*.01)*.07+v*Math.sin(t*9+f.ph)*.12;
      const hx=f.x+Math.sin(sw)*f.sh,hy=f.by-f.sh*(1+v*.08);
      ctx.strokeStyle=`hsl(120,50%,${28*(.3+.7*d)}%)`;ctx.lineWidth=2*h/900+1;ctx.beginPath();ctx.moveTo(f.x,f.by);ctx.quadraticCurveTo(f.x,f.by-f.sh*.5,hx,hy);ctx.stroke();
      ctx.fillStyle=`hsl(118,45%,${32*(.3+.7*d)}%)`;ctx.beginPath();ctx.ellipse(f.x+(hx-f.x)*.3+6,f.by-f.sh*.35,f.sz*.7,f.sz*.25,-.5,0,TAU);ctx.fill();
      const ps=f.sz*(1+v*.6);ctx.save();ctx.translate(hx,hy);ctx.rotate(t*.15*(f.ph>3?1:-1)+v*.5);
      ctx.fillStyle=`hsl(${f.hue},90%,${(60+v*15)*(.35+.65*d)+(1-d)*v*25}%)`;
      for(let i=0;i<f.pet;i++){ctx.rotate(TAU/f.pet);ctx.beginPath();ctx.ellipse(ps*.7,0,ps*.7,ps*.32,0,0,TAU);ctx.fill();}
      ctx.fillStyle=`hsl(45,95%,${55*(.4+.6*d)+v*20}%)`;ctx.beginPath();ctx.arc(0,0,ps*.3,0,TAU);ctx.fill();ctx.restore();}
    // magical dandelions: sprout, bloom, turn to puffballs, scatter glowing seeds, then move to a new patch
    if(!patch||patch.full&&dan.filter(q=>q.p===patch.id).every(q=>q.blown)){patch={id:(patch?patch.id+1:1),x:rand(w*.15,w*.85),r:rand(w*.08,w*.16),full:false};}
    const SPR=6,FLW=9,CLS=2,PUF=6;
    nextSprout-=dt*(1+A.pulse);
    const mine=dan.filter(q=>q.p===patch.id&&!q.dead).length;
    if(!patch.full&&nextSprout<=0&&mine<4){dan.push({p:patch.id,x:patch.x+rand(-patch.r,patch.r),y:h*rand(.8,.99),hgt:h*rand(.12,.22),age:0,ph:rand(TAU),b:Math.floor(rand(3,50))});nextSprout=rand(1.2,2.6);}
    if(mine>34)patch.full=true;
    for(let i=dan.length-1;i>=0;i--){const q=dan[i];q.age+=dt;
      if(q.p!==patch.id&&!q.dead&&q.blown&&q.age>SPR+FLW+CLS+PUF+4){q.dead=true;q.da=0;}
      if(q.dead){q.da+=dt;if(q.da>3){dan.splice(i,1);continue;}}
      const v=A.bins[q.b],a=q.age,grow=clamp(a/SPR,0,1),sway=Math.sin(t*1.3+q.ph)*.08+v*Math.sin(t*8+q.ph)*.06,fade=q.dead?1-q.da/3:1;
      const hx=q.x+Math.sin(sway)*q.hgt*grow,hy=q.y-q.hgt*grow;
      ctx.globalAlpha=fade;ctx.strokeStyle=`hsl(110,45%,${30*(.35+.65*d)}%)`;ctx.lineWidth=Math.max(1,h/500);ctx.beginPath();ctx.moveTo(q.x,q.y);ctx.quadraticCurveTo(q.x,q.y-q.hgt*grow*.5,hx,hy);ctx.stroke();
      ctx.fillStyle=`hsl(115,45%,${32*(.35+.65*d)}%)`;for(const sg of[-1,1]){ctx.beginPath();ctx.ellipse(q.x+sg*h*.012,q.y-h*.01,h*.016*grow,h*.004,sg*-.6,0,TAU);ctx.fill();}
      const R=h*.026*(1+v*.35);
      if(a>SPR&&a<SPR+FLW+CLS){const op=a<SPR+1?a-SPR:a>SPR+FLW?1-(a-SPR-FLW)/CLS*.7:1;
        ctx.save();ctx.translate(hx,hy);ctx.rotate(t*.3+q.ph);ctx.globalCompositeOperation='lighter';const g=ctx.createRadialGradient(0,0,0,0,0,R*2.6);g.addColorStop(0,`rgba(255,230,90,${.5*op})`);g.addColorStop(1,'rgba(255,200,40,0)');ctx.fillStyle=g;ctx.beginPath();ctx.arc(0,0,R*2.6,0,TAU);ctx.fill();ctx.restore();
        ctx.save();ctx.translate(hx,hy);ctx.fillStyle=`hsl(${48+v*8},100%,${(52+v*18)*(.45+.55*d)+ (1-d)*20}%)`;for(let k=0;k<22;k++){const an=k/22*TAU+q.ph;ctx.beginPath();ctx.ellipse(Math.cos(an)*R*.55*op,Math.sin(an)*R*.55*op,R*.5*op,R*.12,an,0,TAU);ctx.fill();}ctx.fillStyle=`hsl(40,100%,${40*(.5+.5*d)}%)`;ctx.beginPath();ctx.arc(0,0,R*.3,0,TAU);ctx.fill();ctx.restore();}
      else if(a>=SPR+FLW+CLS&&!q.blown){const k=clamp((a-SPR-FLW-CLS)/1.2,0,1);
        ctx.save();ctx.translate(hx,hy);ctx.globalCompositeOperation='lighter';const g=ctx.createRadialGradient(0,0,0,0,0,R*2.4);g.addColorStop(0,`rgba(255,255,255,${.35*k})`);g.addColorStop(1,'rgba(220,240,255,0)');ctx.fillStyle=g;ctx.beginPath();ctx.arc(0,0,R*2.4,0,TAU);ctx.fill();
        ctx.strokeStyle=`rgba(255,255,255,${.75*k})`;ctx.lineWidth=.8;for(let j=0;j<26;j++){const an=j/26*TAU+q.ph;ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(Math.cos(an)*R*1.35*k,Math.sin(an)*R*1.35*k);ctx.stroke();}ctx.restore();
        if(a>SPR+FLW+CLS+PUF||(A.beat&&A.pulse>.8&&a>SPR+FLW+CLS+2&&Math.random()<.25)){q.blown=true;for(let j=0;j<26;j++){const an=j/26*TAU;seeds.push({x:hx+Math.cos(an)*R,y:hy+Math.sin(an)*R,vx:rand(-10,30),vy:rand(-40,-12),l:rand(5,10),ph:rand(TAU),p:q.p});}}}
      ctx.globalAlpha=1;}
    ctx.save();ctx.globalCompositeOperation='lighter';
    for(let i=seeds.length-1;i>=0;i--){const z=seeds[i];z.l-=dt;z.vx+=(Math.sin(t*.6+z.ph)*14+8-z.vx)*dt*.6;z.vy+=(Math.sin(t*1.1+z.ph)*6-z.vy*.3)*dt;z.x+=z.vx*dt;z.y+=z.vy*dt;
      if(z.l<=0||z.x>w+20||z.y<-20){ if(z.l<=0&&z.p===patch.id&&!patch.full&&Math.random()<.12&&dan.length<90)dan.push({p:patch.id,x:clamp(z.x,patch.x-patch.r*1.4,patch.x+patch.r*1.4),y:h*rand(.8,.99),hgt:h*rand(.12,.22),age:0,ph:rand(TAU),b:Math.floor(rand(3,50))});seeds.splice(i,1);continue;}
      const al=Math.min(1,z.l/2)*(.55+(1-d)*.45);ctx.strokeStyle=`rgba(255,255,255,${al})`;ctx.lineWidth=.8;ctx.beginPath();ctx.moveTo(z.x,z.y);ctx.lineTo(z.x,z.y+5);ctx.stroke();
      ctx.fillStyle=`rgba(${230+(1-d)*25|0},255,${200+d*55|0},${al})`;ctx.beginPath();ctx.arc(z.x,z.y,2.8+Math.sin(t*4+z.ph)*.8,0,TAU);ctx.fill();}
    ctx.restore();
    // night glow + fireflies
    if(d<1){ctx.save();ctx.globalCompositeOperation='lighter';
      for(const f of fl){const v=A.bins[f.b];const hx=f.x+Math.sin(Math.sin(t*1.1+f.x*.01)*.07)*f.sh,hy=f.by-f.sh;ctx.fillStyle=`hsla(${f.hue},100%,60%,${(1-d)*v*.5})`;ctx.beginPath();ctx.arc(hx,hy,f.sz*1.6,0,TAU);ctx.fill();}
      for(const ff of flies){ff.x+=Math.sin(t*.7+ff.p)*20*dt;ff.y+=Math.cos(t*.9+ff.p*2)*14*dt;ctx.fillStyle=`rgba(220,255,120,${(1-d)*(.4+.6*Math.abs(Math.sin(t*2+ff.p)))})`;ctx.shadowColor='#dfff7a';ctx.shadowBlur=10;ctx.beginPath();ctx.arc(ff.x,ff.y,2,0,TAU);ctx.fill();}
      ctx.restore();}
    const left=c<600?600-c:CYC-c,mm=Math.floor(left/60),ss=Math.floor(left%60).toString().padStart(2,'0');
    this.sub=(c<600?`\u2600 Day \u00b7 night falls in ${mm}:${ss}`:`\u263e Night \u00b7 dawn in ${mm}:${ss}`)+'  \u00b7  press N to skip to dusk';
    ctx.font=`500 ${Math.max(12,h*.016)}px "Share Tech Mono", monospace`;ctx.textAlign='left';ctx.textBaseline='top';ctx.fillStyle=d>.5?'rgba(20,40,60,.8)':'rgba(220,240,255,.85)';
    ctx.fillText(c<600?`\u2600 night in ${mm}:${ss}`:`\u263e dawn in ${mm}:${ss}`,16,14);
    bloom(ctx,.1+(1-d)*.55+A.level*.2);
  }};
}

/* 8. THE GRAND GALLERY */
const HAIKU=[
 ['Upstream, then upstream','the salmon knows the river','by the way it hums'],
 ['Neon tide rising','every bass note lifts the sea','a little closer'],
 ['Gallery at dusk','a paper fish stops to read','the light on the frame'],
 ['Orange highlights','along the edge of the dark','the song remembers'],
 ['Fins in perfect time','the fish say nothing at all','but they hear the drums'],
 ['Static waterfall','between two late-night songs','I can hear the creek'],
 ['A wave, brushed and hung','caught mid-crash on a gold nail','still smelling of salt'],
 ['Shuffle the playlist','the river never plays twice','the same song for you'],
 ['Tissue-paper scales','the red bleeds into the blue','the way a chorus does'],
 ['Headphones in the dark','somewhere a small aquarium','is dancing for me'],
 ['Chandeliers flicker','the bass line climbs the staircase','the paintings lean in'],
 ['Northern lights hum low','green ribbons tune the mountains','to an old love song'],
 ['One more track, one more','the fish refuse to go home','until the last chord'],
 ['Flowers hear the drum','a whole hillside nodding yes','to a song in May'],
 ['Light cycles circle','never touching, always close','like an old duet'],
 ['Rain on the window','the storm has a melody','salmon know the words'],
];
const TITLES=['Orange Highlight','Salt Horizon','Grid of Small Rooms','Sunset Target','Neon Salmon','Brush Weather','Aurora Study'];
/* the real Orange Highlights art from likethefish.ca (only when FISHAMP runs on the site) */
let OH_ART=null,OH_LOADING=false;
function loadOHArt(){if(OH_ART||OH_LOADING||!/likethefish\.ca$/.test(location.hostname))return;OH_LOADING=true;
  fetch('/wp-json/wp/v2/categories?slug=orange-highlights&_fields=id').then(r=>r.json()).then(c=>{const id=c&&c[0]&&c[0].id;if(!id)throw 0;
    return Promise.all([1,2].map(pg=>fetch(`/wp-json/wp/v2/posts?categories=${id}&per_page=100&page=${pg}&_fields=title,link,jetpack_featured_media_url,excerpt`).then(r=>r.ok?r.json():[]).catch(()=>[])));})
  .then(ps=>{const tmp=document.createElement('div');OH_ART=[].concat(...ps).filter(p=>p.jetpack_featured_media_url).map(p=>{tmp.innerHTML=p.title.rendered;const t=tmp.textContent;tmp.innerHTML=p.excerpt.rendered;const b=tmp.textContent.trim();
      return{title:t,blurb:b,url:p.jetpack_featured_media_url.split('?')[0]+'?w=560&ssl=1'};});if(!OH_ART.length)OH_ART=null;}).catch(()=>{OH_LOADING=false;});}
function Gallery(){
  let w,h,bayW,cam=0,cache=new Map(),fish=[],notes=[];
  const FP=['#e63946','#f4a261','#2a9d8f','#264653','#e9c46a','#3a86ff','#8338ec','#ff006e','#06d6a0','#ffbe0b','#118ab2','#7cb518'];
  function collageFish(seed){const r=mulberry(seed),W=240,H=140,c=mk(W,H),x=c.getContext('2d');const base=FP[Math.floor(r()*FP.length)];
    const body=()=>{x.beginPath();x.moveTo(228,72);x.bezierCurveTo(205,8,90,10,62,58);x.lineTo(14,22);x.quadraticCurveTo(30,72,14,122);x.lineTo(62,86);x.bezierCurveTo(90,134,205,136,228,72);x.closePath();};
    // fins (outside body)
    x.fillStyle=FP[Math.floor(r()*FP.length)];x.beginPath();x.moveTo(110,26);x.quadraticCurveTo(135,-4,170,22);x.closePath();x.fill();
    x.beginPath();x.moveTo(120,116);x.quadraticCurveTo(140,140,165,118);x.closePath();x.fill();
    body();x.save();x.clip();x.fillStyle=base;x.fillRect(0,0,W,H);
    for(let i=0;i<34;i++){x.globalAlpha=.45+r()*.45;x.fillStyle=FP[Math.floor(r()*FP.length)];const cx=r()*W,cy=r()*H,rad=10+r()*38;x.beginPath();
      for(let k=0;k<=9;k++){const a=k/9*TAU,rr=rad*(.7+r()*.5);k?x.lineTo(cx+Math.cos(a)*rr,cy+Math.sin(a)*rr*.8):x.moveTo(cx+Math.cos(a)*rr,cy+Math.sin(a)*rr*.8);}x.fill();}
    x.globalAlpha=.18;for(let i=0;i<500;i++){x.strokeStyle=r()<.5?'#fff':'#000';x.lineWidth=r()*1.6;const sx=r()*W,sy=r()*H,a=r()*.6-.3;x.beginPath();x.moveTo(sx,sy);x.lineTo(sx+Math.cos(a)*(4+r()*14),sy+Math.sin(a)*(4+r()*14));x.stroke();}
    x.globalAlpha=.35;x.strokeStyle='#1b1b2f';x.lineWidth=2;for(let gx=80;gx<210;gx+=16)for(let gy=30;gy<120;gy+=16){x.beginPath();x.arc(gx+(gy/16%2)*8,gy,9,-.9,.9);x.stroke();}
    x.restore();x.globalAlpha=1;
    x.fillStyle='#fff';x.beginPath();x.arc(196,58,11,0,TAU);x.fill();x.fillStyle='#111';x.beginPath();x.arc(199,58,5.5,0,TAU);x.fill();
    x.strokeStyle='rgba(0,0,0,.4)';x.lineWidth=3;x.beginPath();x.moveTo(176,40);x.quadraticCurveTo(166,72,178,102);x.stroke();
    return c;}
  function painting(i){if(cache.has(i))return cache.get(i);const r=mulberry(i*7919+3),pw=Math.round(bayW*(w<h?.74:.5)),ph=Math.round(w<h?Math.min(h*.3,bayW*.8):h*.34),c=mk(pw,ph),x=c.getContext('2d');const st=((i%7)+7)%7;
    if(st===0){x.fillStyle='#120a08';x.fillRect(0,0,pw,ph);for(let k=0;k<26;k++){x.strokeStyle=`hsla(${20+r()*25},100%,${50+r()*25}%,${.4+r()*.6})`;x.lineWidth=1+r()*6;x.beginPath();x.arc(r()*pw,r()*ph,10+r()*pw*.4,r()*TAU,r()*TAU);x.stroke();}
      x.fillStyle='#ff7a1a';x.shadowColor='#ff9a3a';x.shadowBlur=30;x.beginPath();x.arc(pw*.6,ph*.45,ph*.14,0,TAU);x.fill();}
    else if(st===1){const g=x.createLinearGradient(0,0,0,ph);g.addColorStop(0,'#f7c59f');g.addColorStop(.5,'#ef8354');g.addColorStop(.52,'#2d6a8a');g.addColorStop(1,'#0b2840');x.fillStyle=g;x.fillRect(0,0,pw,ph);
      x.fillStyle='#fff3c4';x.beginPath();x.arc(pw*(.3+r()*.4),ph*.4,ph*.09,0,TAU);x.fill();for(let k=0;k<160;k++){x.strokeStyle=`rgba(255,255,255,${r()*.35})`;x.lineWidth=1+r()*2;const yy=ph*(.53+r()*.45);x.beginPath();x.moveTo(r()*pw,yy);x.lineTo(r()*pw,yy+r()*2);x.stroke();}}
    else if(st===2){x.fillStyle='#f4f1e8';x.fillRect(0,0,pw,ph);const cols=['#d62828','#1d4ed8','#f7c600','#f4f1e8','#f4f1e8','#111'];
      const xs=[0,...Array.from({length:3},()=>r()*pw).sort((a,b)=>a-b),pw],ys=[0,...Array.from({length:3},()=>r()*ph).sort((a,b)=>a-b),ph];
      for(let a=0;a<xs.length-1;a++)for(let b=0;b<ys.length-1;b++){x.fillStyle=cols[Math.floor(r()*cols.length)];x.fillRect(xs[a],ys[b],xs[a+1]-xs[a],ys[b+1]-ys[b]);}
      x.fillStyle='#111';xs.forEach(v=>x.fillRect(v-4,0,8,ph));ys.forEach(v=>x.fillRect(0,v-4,pw,8));}
    else if(st===3){const cx=pw*(.3+r()*.4),cy=ph*(.4+r()*.2);for(let k=14;k>0;k--){x.fillStyle=`hsl(${(k*22+r()*40)%360},75%,${40+k*2}%)`;x.beginPath();x.arc(cx,cy,k*Math.max(pw,ph)*.06,0,TAU);x.fill();}}
    else if(st===4){x.fillStyle='#02101c';x.fillRect(0,0,pw,ph);x.strokeStyle='rgba(0,234,255,.5)';x.lineWidth=2;for(let k=0;k<6;k++){x.beginPath();for(let xx=0;xx<=pw;xx+=8)x.lineTo(xx,ph*(.7+k*.05)+Math.sin(xx*.05+k)*4);x.stroke();}
      drawSalmon(x,pw*.5,ph*.42,ph*.22,-.25,1,'#ff7a59');}
    else if(st===5){x.fillStyle=`hsl(${r()*360},40%,88%)`;x.fillRect(0,0,pw,ph);for(let k=0;k<14;k++){x.strokeStyle=`hsla(${r()*360},70%,50%,.8)`;x.lineWidth=6+r()*22;x.lineCap='round';x.beginPath();x.moveTo(r()*pw,r()*ph);x.bezierCurveTo(r()*pw,r()*ph,r()*pw,r()*ph,r()*pw,r()*ph);x.stroke();}}
    else{const g=x.createLinearGradient(0,0,0,ph);g.addColorStop(0,'#02040c');g.addColorStop(1,'#0a2a3c');x.fillStyle=g;x.fillRect(0,0,pw,ph);
      for(let k=0;k<pw;k+=3){x.fillStyle=`rgba(60,255,160,${.15+.25*noise1(k*.02+i)})`;x.fillRect(k,ph*(.15+.1*noise1(k*.01+i*3)),3,ph*.3*noise1(k*.03+i));}
      x.fillStyle='#0b1520';x.beginPath();x.moveTo(0,ph);for(let k=0;k<=pw;k+=6)x.lineTo(k,ph*(.75-.25*Math.pow(fbm1(k*.012+i,3),1.6)));x.lineTo(pw,ph);x.fill();}
    const out={c,title:TITLES[st],hk:HAIKU[((i%HAIKU.length)+HAIKU.length)%HAIKU.length]};cache.set(i,out);
    if(OH_ART&&((i%3)+3)%3!==2){const a=OH_ART[Math.floor(hr(i*1.37+.5)*OH_ART.length)];out.title=a.title;out.art=a;out.hk=null;
      const im=new Image();im.decoding='async';im.onload=()=>{let ph2=Math.round(h*(w<h?.3:.4)),pw2=Math.round(ph2*im.naturalWidth/im.naturalHeight);const mx=bayW*(w<h?.8:.62);if(pw2>mx){pw2=Math.round(mx);ph2=Math.round(pw2*im.naturalHeight/im.naturalWidth);}
        const c2=mk(pw2,ph2),x2=c2.getContext('2d');x2.fillStyle='#f4efe4';x2.fillRect(0,0,pw2,ph2);x2.drawImage(im,0,0,pw2,ph2);out.c=c2;out.lines=null;};im.src=a.url;}
    if(cache.size>40){for(const k of cache.keys()){if(Math.abs(k-i)>20)cache.delete(k);}}
    return out;}
  return{name:'THE GRAND GALLERY',sub:'Collage fish stroll the halls, reading haiku',
  init(W,H){w=W;h=H;bayW=w<h?clamp(w*.96,280,700):clamp(h*.8,420,780);cache.clear();loadOHArt();
    fish=Array.from({length:7},(_,i)=>({spr:collageFish(i*31+7),x:cam+rand(-100,w),y:rand(h*.15,h*.45),tb:Math.floor((cam+rand(0,w))/bayW),st:'swim',tm:0,sz:rand(.28,.45)*h/700,ph:rand(TAU),face:1,off:rand(-.35,.35),hy:rand(.12,.42),vx:0,vy:0}));},
  draw(ctx,t,dt,A){
    cam+=dt*(36+A.level*18);
    const ceil=h*.1,floorY=h*.8,wain=h*.66;
    ctx.fillStyle='#3d0f17';ctx.fillRect(0,0,w,h);
    ctx.save();ctx.globalAlpha=.08;ctx.fillStyle='#000';const so=(cam*1)%28;for(let x=-so;x<w;x+=28)ctx.fillRect(x,ceil,12,wain-ceil);ctx.restore();
    ctx.fillStyle='rgba(255,215,140,.06)';for(let x=-((cam)%56);x<w;x+=56)for(let y=ceil+30;y<wain;y+=56){ctx.beginPath();ctx.moveTo(x+28,y-10);ctx.lineTo(x+36,y);ctx.lineTo(x+28,y+10);ctx.lineTo(x+20,y);ctx.fill();}
    // ceiling
    let g=ctx.createLinearGradient(0,0,0,ceil);g.addColorStop(0,'#120608');g.addColorStop(1,'#2a1410');ctx.fillStyle=g;ctx.fillRect(0,0,w,ceil);
    ctx.strokeStyle='#c99a3b';ctx.lineWidth=1.5;for(let x=-((cam)%(bayW/2));x<w;x+=bayW/2)ctx.strokeRect(x+10,ceil*.2,bayW/2-20,ceil*.6);
    ctx.fillStyle='#d4a548';ctx.fillRect(0,ceil-4,w,6);ctx.fillStyle='#8a5f1d';ctx.fillRect(0,ceil+2,w,3);
    // wainscot
    g=ctx.createLinearGradient(0,wain,0,floorY);g.addColorStop(0,'#2b1208');g.addColorStop(1,'#170904');ctx.fillStyle=g;ctx.fillRect(0,wain,w,floorY-wain);
    ctx.fillStyle='#c99a3b';ctx.fillRect(0,wain-3,w,5);ctx.strokeStyle='rgba(201,154,59,.6)';ctx.lineWidth=1.5;
    for(let x=-((cam)%(bayW/3));x<w;x+=bayW/3)ctx.strokeRect(x+12,wain+12,bayW/3-24,floorY-wain-24);
    // floor
    {const rowsN=6,T=64,sc=v=>1+v*.9,yv=v=>floorY+Math.pow(v,1.25)*(h-floorY),X=(u,v)=>w/2+(u-cam-w/2)*sc(v);
      for(let r=0;r<rowsN;r++){const v0=r/rowsN,v1=(r+1)/rowsN,y0=yv(v0),y1=yv(v1);
        const k0=Math.floor((cam-w*.6)/T)-1,k1=Math.ceil((cam+w*1.6)/T)+1;
        for(let k=k0;k<=k1;k++){const a=X(k*T,v0),b=X((k+1)*T,v0),c2=X((k+1)*T,v1),d2=X(k*T,v1);if(Math.max(b,c2)<0||Math.min(a,d2)>w)continue;
          ctx.fillStyle=((k+r)&1)?'#e9e3d6':'#171414';ctx.beginPath();ctx.moveTo(a,y0);ctx.lineTo(b,y0);ctx.lineTo(c2,y1+.5);ctx.lineTo(d2,y1+.5);ctx.fill();}}}
    g=ctx.createLinearGradient(0,floorY,0,h);g.addColorStop(0,'rgba(255,220,160,.18)');g.addColorStop(1,'rgba(0,0,0,.25)');ctx.fillStyle=g;ctx.fillRect(0,floorY,w,h-floorY);
    // bays
    const first=Math.floor(cam/bayW)-1,last=Math.floor((cam+w)/bayW)+1;const ptop=h*.2;
    for(let i=first;i<=last;i++){const bx=i*bayW-cam,P=painting(i),pw=P.c.width,ph=P.c.height,px=bx+(bayW-pw)/2;
      // spotlight
      ctx.save();ctx.globalCompositeOperation='lighter';g=ctx.createLinearGradient(0,ceil,0,ptop+ph);g.addColorStop(0,`rgba(255,230,170,${.16+A.level*.18})`);g.addColorStop(1,'rgba(255,230,170,0)');
      ctx.fillStyle=g;ctx.beginPath();ctx.moveTo(bx+bayW/2-12,ceil);ctx.lineTo(bx+bayW/2+12,ceil);ctx.lineTo(px+pw+30,ptop+ph+30);ctx.lineTo(px-30,ptop+ph+30);ctx.fill();ctx.restore();
      // frame
      const fw=Math.max(12,pw*.05);ctx.shadowColor='rgba(0,0,0,.7)';ctx.shadowBlur=20;ctx.shadowOffsetY=10;
      g=ctx.createLinearGradient(px-fw,ptop-fw,px+pw+fw,ptop+ph+fw);g.addColorStop(0,'#7a5512');g.addColorStop(.3,'#f5d27a');g.addColorStop(.55,'#b8862b');g.addColorStop(.8,'#ffe6a3');g.addColorStop(1,'#6b4a10');
      ctx.fillStyle=g;ctx.fillRect(px-fw,ptop-fw,pw+fw*2,ph+fw*2);ctx.shadowColor='transparent';ctx.shadowBlur=0;ctx.shadowOffsetY=0;
      ctx.strokeStyle='#5a3d0c';ctx.lineWidth=2;ctx.strokeRect(px-fw*.5,ptop-fw*.5,pw+fw,ph+fw);
      ctx.fillStyle='#d9ad52';for(const[cx,cy]of[[px-fw*.5,ptop-fw*.5],[px+pw+fw*.5,ptop-fw*.5],[px-fw*.5,ptop+ph+fw*.5],[px+pw+fw*.5,ptop+ph+fw*.5]]){ctx.beginPath();ctx.arc(cx,cy,fw*.55,0,TAU);ctx.fill();}
      ctx.drawImage(P.c,px,ptop);
      // glint
      const gp=((t*.25+i*.37)%1.6)-.3;if(gp>0&&gp<1){ctx.save();ctx.beginPath();ctx.rect(px,ptop,pw,ph);ctx.clip();ctx.globalCompositeOperation='lighter';const gx=px+gp*pw*1.4-pw*.2;
        g=ctx.createLinearGradient(gx-40,0,gx+40,0);g.addColorStop(0,'rgba(255,255,255,0)');g.addColorStop(.5,`rgba(255,255,255,${.1+A.pulse*.2})`);g.addColorStop(1,'rgba(255,255,255,0)');ctx.fillStyle=g;ctx.fillRect(gx-40,ptop,80,ph);ctx.restore();}
      // plaque
      const plW=Math.min(Math.max(pw*1.05,w<h?bayW*.84:0),360),plH=Math.max(80,h*.125),plx=bx+bayW/2-plW/2,ply=ptop+ph+fw+h*.025;
      g=ctx.createLinearGradient(0,ply,0,ply+plH);g.addColorStop(0,'#e8c776');g.addColorStop(1,'#a57a2a');ctx.fillStyle=g;ctx.fillRect(plx,ply,plW,plH);ctx.strokeStyle='#6b4a10';ctx.lineWidth=1.5;ctx.strokeRect(plx+3,ply+3,plW-6,plH-6);
      const fs=Math.max(10,plH*.15);ctx.fillStyle='#2b1a05';ctx.textAlign='center';ctx.textBaseline='top';
      ctx.font=`600 ${fs*1.05}px "Cormorant Garamond", Georgia, serif`;ctx.fillText(`No. ${((i%999)+999)%999+1} \u2014 ${P.title}`,plx+plW/2,ply+fs*.45);
      ctx.font=`italic 500 ${fs}px "Cormorant Garamond", Georgia, serif`;
      if(P.hk)P.hk.forEach((l,k)=>ctx.fillText(l,plx+plW/2,ply+fs*1.75+k*fs*1.15));
      else{if(!P.lines||P.lw!==plW){P.lw=plW;P.lines=[];let line='';for(const wd of (P.art.blurb||'Orange Highlights \u00b7 likethefish.ca').split(/\s+/)){const tst=line?line+' '+wd:wd;if(ctx.measureText(tst).width>plW-24){P.lines.push(line);line=wd;}else line=tst;}if(line)P.lines.push(line);if(P.lines.length>3){P.lines=P.lines.slice(0,3);P.lines[2]=P.lines[2].replace(/\s*\S*$/,'\u2026');}}
        P.lines.forEach((l,k)=>ctx.fillText(l,plx+plW/2,ply+fs*1.75+k*fs*1.15));}
      // column
      const cw=Math.max(26,bayW*.07),cxx=bx-cw/2;g=ctx.createLinearGradient(cxx,0,cxx+cw,0);g.addColorStop(0,'#9d9a92');g.addColorStop(.35,'#f4f1ea');g.addColorStop(.7,'#d8d4ca');g.addColorStop(1,'#7f7b72');
      ctx.fillStyle=g;ctx.fillRect(cxx,ceil+16,cw,floorY-ceil-30);ctx.strokeStyle='rgba(0,0,0,.12)';ctx.lineWidth=1;for(let k=1;k<5;k++){ctx.beginPath();ctx.moveTo(cxx+cw*k/5,ceil+24);ctx.lineTo(cxx+cw*k/5,floorY-20);ctx.stroke();}
      ctx.fillStyle='#d4a548';ctx.fillRect(cxx-8,ceil+4,cw+16,14);ctx.fillRect(cxx-6,floorY-18,cw+12,18);
      // velvet rope
      ctx.strokeStyle='#8b0f1f';ctx.lineWidth=5;ctx.beginPath();ctx.moveTo(bx+bayW*.18,floorY+h*.06);ctx.quadraticCurveTo(bx+bayW/2,floorY+h*.11,bx+bayW*.82,floorY+h*.06);ctx.stroke();
      ctx.fillStyle='#c99a3b';for(const sx of[bx+bayW*.18,bx+bayW*.82]){ctx.fillRect(sx-3,floorY+h*.05,6,h*.1);ctx.beginPath();ctx.arc(sx,floorY+h*.05,6,0,TAU);ctx.fill();}
    }
    // chandeliers (over columns)
    for(let i=first;i<=last+1;i++){const bx=i*bayW-cam,cy=ceil+h*.07;ctx.strokeStyle='#8a5f1d';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(bx,ceil);ctx.lineTo(bx,cy);ctx.stroke();
      ctx.strokeStyle='#d4a548';ctx.lineWidth=3;ctx.beginPath();ctx.ellipse(bx,cy+8,bayW*.07,10,0,0,Math.PI);ctx.stroke();
      ctx.save();ctx.globalCompositeOperation='lighter';
      for(let k=-2;k<=2;k++){const fx=bx+k*bayW*.033,fy=cy+4-Math.abs(k)*2,v=A.bins[8+Math.abs(k)*6+(i&3)];const rr=10+v*26+A.pulse*10;
        g=ctx.createRadialGradient(fx,fy,0,fx,fy,rr);g.addColorStop(0,'rgba(255,240,200,.9)');g.addColorStop(.3,'rgba(255,190,90,.35)');g.addColorStop(1,'rgba(255,160,60,0)');ctx.fillStyle=g;ctx.fillRect(fx-rr,fy-rr,rr*2,rr*2);}
      ctx.restore();}
    // fish
    for(const f of fish){
      const center=f.tb*bayW+bayW/2;let tx,ty;
      if(f.st==='swim'){tx=center+f.off*bayW*.5;ty=h*f.hy;if(Math.hypot(tx-f.x,ty-f.y)<30){f.st='look';f.tm=rand(4,8);f.wpT=0;}}
      else{f.tm-=dt;f.wpT-=dt;
        if(f.wpT<=0){f.side=-(f.side||1);f.wx=center+f.side*bayW*rand(.1,.3);f.wy=h*rand(.12,.48);f.wpT=rand(1.4,2.8);}
        tx=f.wx;ty=f.wy;if(A.beat&&Math.random()<.2)notes.push({x:f.x-cam,y:f.y-30,l:1.6});
        if(f.tm<0){f.st='swim';f.tb=Math.floor((cam+rand(w*.35,w*1.05))/bayW);f.off=rand(-.4,.4);f.hy=rand(.12,.42);}}
      if(f.x<cam-260){f.x=cam-200;f.tb=Math.floor((cam+rand(w*.2,w*.8))/bayW);f.st='swim';}
      const dx=tx-f.x,dy=ty-f.y,dd=Math.hypot(dx,dy)||1,sp=(70+A.level*60)*Math.min(1,dd/50+.25),k=Math.min(1,dt*2.2);
      f.vx+=(dx/dd*sp-f.vx)*k;f.vy+=(dy/dd*sp*.85-f.vy)*k;f.x+=f.vx*dt;f.y+=f.vy*dt;
      if(f.vx>10)f.face=1;else if(f.vx<-10)f.face=-1;
      const tilt=clamp(Math.atan2(f.vy,Math.abs(f.vx)+25),-.45,.45);
      const sx=f.x-cam,sy=f.y+Math.sin(t*1.6+f.ph)*5,s=f.sz*(1+A.bins[10]*.06);
      ctx.save();ctx.translate(sx,sy);ctx.rotate(f.face>0?tilt:-tilt);ctx.scale(f.face*s,s);ctx.transform(1,0,Math.sin(t*5+f.ph)*.06*(1+A.mid*2),1,0,Math.sin(t*5+f.ph)*3);
      ctx.shadowColor='rgba(0,0,0,.35)';ctx.shadowBlur=18;ctx.shadowOffsetY=14;ctx.drawImage(f.spr,-120,-70);ctx.restore();}
    ctx.font=`${Math.max(14,h*.025)}px serif`;ctx.textAlign='center';
    for(let i=notes.length-1;i>=0;i--){const n=notes[i];n.l-=dt;n.y-=24*dt;if(n.l<=0){notes.splice(i,1);continue;}ctx.globalAlpha=clamp(n.l,0,1);ctx.fillStyle='#ffe6a3';ctx.fillText(i%2?'\u266a':'\u266b',n.x+Math.sin(n.l*4)*6,n.y);}ctx.globalAlpha=1;
    const vg=ctx.createRadialGradient(w/2,h/2,Math.min(w,h)*.35,w/2,h/2,Math.max(w,h)*.75);vg.addColorStop(0,'rgba(0,0,0,0)');vg.addColorStop(1,'rgba(0,0,0,.5)');ctx.fillStyle=vg;ctx.fillRect(0,0,w,h);
    bloom(ctx,.18+A.level*.25);
  }};
}

/* ================= PLAYER ================= */
const SCENES=[Aquarium,Storm,Starry,Jungle,Tron,Aurora,Flowers,Gallery];
let tracks=[{name:'Salmon Run (built-in demo)',demo:true}],cur=0,shuffle=false,repeat=false;
const list=$('#list');
function renderList(){list.innerHTML='';tracks.forEach((tr,i)=>{const li=document.createElement('li');if(i===cur)li.className='cur';
  li.innerHTML=`<span class="n">${String(i+1).padStart(2,'0')}</span><span class="nm"></span><span>${tr.demo?'\u221e':(typeof tr.dur==='string'?tr.dur:tr.dur?fmt(tr.dur):'')}</span>${tr.demo?'':'<span class="x" title="Remove">\u2715</span>'}`;
  li.querySelector('.nm').textContent=tr.name;li.onclick=e=>{if(e.target.classList.contains('x')){removeTrack(i);e.stopPropagation();return;}play(i);};list.appendChild(li);});
  $('#plCount').textContent=`${tracks.length} track${tracks.length>1?'s':''}`;}
function removeTrack(i){const tr=tracks[i];if(i===cur&&isPlaying)stop();if(tr.url)URL.revokeObjectURL(tr.url);tracks.splice(i,1);if(cur>=i&&cur>0)cur--;renderList();setMarq();}
const fmt=s=>{s=Math.max(0,Math.floor(s||0));return`${String(Math.floor(s/60)).padStart(2,'0')}:${String(s%60).padStart(2,'0')}`;};
function setMarq(){const tr=tracks[cur];const txt=tr?(tr.gm?`${cur+1}. ${tr.gm.ticker}  \u2605  `:`${cur+1}. ${tr.name}  \u2605  LIKE THE FISH AMP  \u2605  `):'Like The Fish AMP';$('#marq').textContent=txt+txt;
  $('#srcChip').textContent=tr&&tr.demo?'DEMO':tr&&tr.gm?(tr.gm.src==='c64'?'C64':tr.gm.mg?'MOBY':'KEVIN'):'FILE';
  const nw=$('#gmNow');if(nw)nw.innerHTML='';if(tr&&tr.gm&&nw){const b=document.createElement('b');b.textContent='\u266b '+tr.gm.title;nw.appendChild(b);nw.appendChild(document.createTextNode(' \u00b7 '+tr.gm.credit));nw.appendChild(document.createElement('br'));}}
let loaded=-1;
function play(i){
  if(SP.ctrl&&SP.on)try{SP.ctrl.pause();}catch(e){}
  ensureAudio();if(ac.state==='suspended')ac.resume();
  if(i===undefined)i=cur;
  if(i!==loaded||(!isPlaying&&loaded===-1)){
    stopDemo();mediaEl.pause();if(gmEl)gmEl.pause();cur=i;loaded=i;const tr=tracks[i];
    if(tr.demo)startDemo();
    else if(tr.gm){ensureGm();gmEl.src=tr.gm.url;gmEl.play().catch(()=>{});try{if(window.LTFGM&&LTFGM.played)LTFGM.played(tr.gm);}catch(e){}}
    else{mediaEl.src=tr.url;mediaEl.play().catch(()=>{});}
  }else{const tr=tracks[cur];if(tr.demo){if(!demo)startDemo();}else if(tr.gm)gmEl.play().catch(()=>{});else mediaEl.play().catch(()=>{});}
  isPlaying=true;$('#st').textContent='\u25b6';renderList();setMarq();
}
function pause(){if(!ac||!isPlaying)return;const tr=tracks[cur];if(tr.demo){stopDemo();loaded=-1;}else if(tr.gm)gmEl.pause();else mediaEl.pause();isPlaying=false;$('#st').textContent='\u275a\u275a';}
function stop(){if(!ac)return;stopDemo();mediaEl.pause();try{mediaEl.currentTime=0}catch(e){}if(gmEl){gmEl.pause();try{gmEl.currentTime=0}catch(e){}}isPlaying=false;loaded=-1;$('#st').textContent='\u25a0';}
function next(auto){let n;if(shuffle&&tracks.length>1){do n=Math.floor(Math.random()*tracks.length);while(n===cur);}else n=cur+1;
  if(n>=tracks.length){if(repeat||!auto)n=0;else{stop();return;}}if(auto&&repeat&&!shuffle&&tracks.length===1)n=0;loaded=-1;play(n);}
const elOf=tr=>tr&&tr.gm?gmEl:mediaEl;
function prev(){const el=elOf(tracks[cur]);if(ac&&el&&!tracks[cur].demo&&el.currentTime>3){el.currentTime=0;return;}loaded=-1;play((cur-1+tracks.length)%tracks.length);}
$('#play').onclick=()=>play();$('#pause').onclick=()=>isPlaying?pause():play();$('#stop').onclick=stop;$('#next').onclick=()=>next(false);$('#prev').onclick=prev;
$('#shuf').onclick=e=>{shuffle=!shuffle;e.currentTarget.classList.toggle('on',shuffle);};
$('#rep').onclick=e=>{repeat=!repeat;e.currentTarget.classList.toggle('on',repeat);};
$('#vol').oninput=e=>{if(master)master.gain.value=e.target.value/100;if(gmEl)gmEl.volume=e.target.value/100;};
$('#eject').onclick=()=>$('#file').click();
$('#file').onchange=e=>{addFiles(e.target.files);e.target.value='';};
function addFiles(files){const before=tracks.length;let added=0;
  for(const f of files){if(!(f.type.startsWith('audio')||/\.(mp3|wav|ogg|m4a|flac|aac|opus)$/i.test(f.name)))continue;
    const tr={name:f.name.replace(/\.[^.]+$/,''),url:URL.createObjectURL(f)};tracks.push(tr);added++;
    const probe=new Audio();probe.preload='metadata';probe.src=tr.url;probe.onloadedmetadata=()=>{tr.dur=probe.duration;renderList();};}
  if(added&&tracks[0].demo&&before===1&&!isPlaying){tracks.shift();cur=0;loaded=-1;renderList();setMarq();play(0);}else renderList();}
document.addEventListener('dragover',e=>{e.preventDefault();document.getElementById('fishamp').classList.add('dragging');});
document.addEventListener('dragleave',e=>{if(!e.relatedTarget)document.getElementById('fishamp').classList.remove('dragging');});
document.addEventListener('drop',e=>{e.preventDefault();document.getElementById('fishamp').classList.remove('dragging');if(e.dataTransfer.files.length)addFiles(e.dataTransfer.files);});
const seek=$('#seek');let seeking=false;
seek.addEventListener('input',()=>{seeking=true;});
seek.addEventListener('change',()=>{seeking=false;const el=elOf(tracks[cur]);if(ac&&el&&!tracks[cur].demo&&el.duration)el.currentTime=seek.value/1000*el.duration;});

/* game music: the same C64 remix, Kevin MacLeod and MOBYGRATIS lists as RetroAmp (shared LTFGM loader) */
const GM_SRC=/site-assets\/fishamp\/fishamp\.js/.test(ME_SRC)?ME_SRC.replace(/fishamp\/fishamp\.js.*$/,'rko/gm.js'):'https://cdn.jsdelivr.net/gh/nathancliffordsalmon-sketch/crossfader@main/site-assets/rko/gm.js';
(function gmInit(){
  const row=$('#gmRow'),coll=$('#gmColl'),sub=$('#gmSub'),cred=$('#gmCred');
  function fillSub(){sub.innerHTML='';const o=LTFGM.subOptions(coll.value);o.forEach(([v,t])=>{const op=document.createElement('option');op.value=v;op.textContent=t;sub.appendChild(op);});sub.style.display=o.length?'':'none';}
  function ready(){LTFGM.load().then(()=>{coll.innerHTML='';LTFGM.collections.forEach(c=>{const op=document.createElement('option');op.value=c.key;op.textContent=c.label;coll.appendChild(op);});
    try{const k=localStorage.getItem('fishamp.gm');if(k&&LTFGM.collections.some(c=>c.key===k))coll.value=k;}catch(e){}
    fillSub();row.classList.add('on');cred.classList.add('on');}).catch(()=>{});}
  coll.onchange=()=>{try{localStorage.setItem('fishamp.gm',coll.value);}catch(e){}fillSub();};
  $('#gmGo').onclick=()=>{if(!window.LTFGM)return;const items=LTFGM.items(coll.value,sub.value).sort(()=>Math.random()-.5);if(!items.length)return;
    if(isPlaying)stop();tracks=tracks.filter(t=>!t.gm);const first=tracks.length;
    items.forEach(it=>tracks.push({name:it.title+(it.by&&it.by!=='mobygratis'?' \u2014 '+it.by:''),gm:it,dur:it.len}));
    cur=first;loaded=-1;renderList();play(first);};
  if(window.LTFGM)return ready();
  addEventListener('ltfgm-ready',ready,{once:true});
  const s=document.createElement('script');s.src=GM_SRC;s.onerror=()=>{};document.head.appendChild(s);
})();

/* Spotify: embedded player (playlists from the Like the Fish site), beat-model visuals, optional tab capture or mic for real-sound visuals */
(function spInit(){
  const sel=$('#spSel'),msg=t=>{$('#spMsg').textContent=t;};
  let lists=[['Singing','0Bxvmnd4tPBXrr8Adj47CL'],['Orange Highlight','4af8gcTcBRwY5N9g4VKgMW'],['Collective Soul Famous','2ENuj7uvlXGgoZdw594Kuk'],['Nova Scotia','3bsHXvDpP5NnP9D5RDTbfh'],['Video Games','4KvLmylCkqYL0BBmgxVawD'],['Retro Remix Rad','5m4MjIJ4owHjsYzj3ucfNo']];
  function fill(){while(sel.options.length>1)sel.remove(1);lists.forEach(([n,id])=>{const o=document.createElement('option');o.value=id;o.textContent=n;sel.appendChild(o);});}
  fill();
  if(window.PQ_PLAYLISTS&&window.PQ_PLAYLISTS.length){lists=window.PQ_PLAYLISTS;fill();}
  else fetch('/wp-json/wp/v2/pages?slug=phantasea-sessions&_fields=content').then(r=>r.json()).then(j=>{const h=j&&j[0]&&j[0].content&&j[0].content.rendered||'';const m=h.match(/PQ_PLAYLISTS\s*=\s*(\[[\s\S]*?\]\]);/);if(m){const a=JSON.parse(m[1].replace(/&#8221;|&#8220;|&#8243;/g,'"'));if(a.length){lists=a;fill();}}}).catch(()=>{});
  const toUri=t=>{t=(t||'').trim();if(/^spotify:/.test(t))return t;const m=t.match(/open\.spotify\.com\/(?:intl-[a-z]{2}\/)?(track|album|playlist|episode|show|artist)\/([A-Za-z0-9]+)/);return m?`spotify:${m[1]}:${m[2]}`:null;};
  function title(uri){const m=uri&&uri.match(/spotify:track:(\w+)/);if(!m)return;fetch('https://open.spotify.com/oembed?url='+encodeURIComponent('https://open.spotify.com/track/'+m[1])).then(r=>r.json()).then(j=>{if(j&&j.title){SP.title=j.title;if(SP.on)spMarq();}}).catch(()=>{});}
  function spMarq(){const t=(SP.title?SP.title+'  \u2605  ':'')+'SPOTIFY  \u2605  LIKE THE FISH AMP  \u2605  ';$('#marq').textContent=t+t;$('#srcChip').textContent='SPOTIFY';}
  function setOn(on){if(on&&!SP.on){SP.t0=performance.now();SP.bpm=96+Math.random()*40;if(isPlaying)pause();}SP.on=on;$('#st').textContent=on?'\u25b6':$('#st').textContent;if(on)spMarq();}
  function load(uri){
    const make=()=>{const host=$('#spEmbed');host.innerHTML='';const el=document.createElement('div');host.appendChild(el);
      SP.api.createController(el,{uri,width:'100%',height:uri.includes(':track:')?152:352},c=>{SP.ctrl=c;
        c.addListener('playback_started',e=>{const u=e&&e.data&&e.data.playingURI;if(u&&u!==SP.uri){SP.uri=u;SP.title='';title(u);SP.t0=performance.now();SP.bpm=96+Math.random()*40;}setOn(true);});
        c.addListener('playback_update',e=>{const d=(e&&e.data)||{};setOn(!d.isPaused&&!d.isBuffering);});});};
    if(SP.api)return make();
    window.onSpotifyIframeApiReady=a=>{SP.api=a;make();};
    const s=document.createElement('script');s.src='https://open.spotify.com/embed/iframe-api/v1';s.async=true;s.onerror=()=>msg('The Spotify player could not load here. Open FISHAMP on likethefish.ca/fishamp/ to use Spotify.');document.head.appendChild(s);
  }
  sel.onchange=()=>{if(sel.value)load('spotify:playlist:'+sel.value);};
  $('#spRand').onclick=()=>{const p=lists[Math.floor(Math.random()*lists.length)];sel.value=p[1];load('spotify:playlist:'+p[1]);};
  $('#spLoad').onclick=()=>{const u=toUri($('#spUrl').value);if(u)load(u);else msg('That doesn\u2019t look like a Spotify link. In Spotify use Share \u2192 Copy link, then paste it here.');};
  function stopCap(){if(capStream)capStream.getTracks().forEach(t=>t.stop());capStream=null;capOn=false;$('#spCap').classList.remove('on');$('#spMic').classList.remove('on');}
  function useStream(s,btn,label){ensureAudio();if(ac.state==='suspended')ac.resume();stopCap();capStream=s;
    if(!capAn){capAn=ac.createAnalyser();capAn.fftSize=2048;capAn.smoothingTimeConstant=.75;}
    const src=ac.createMediaStreamSource(new MediaStream(s.getAudioTracks()));src.connect(capAn);capOn=true;btn.classList.add('on');
    s.getAudioTracks()[0].addEventListener('ended',()=>{stopCap();msg('Sound sharing ended. The visuals are back on the beat model.');});msg(label);}
  $('#spCap').onclick=async()=>{if(capOn&&capStream&&$('#spCap').classList.contains('on')){stopCap();msg('Stopped syncing.');return;}
    const md=navigator.mediaDevices;if(!md||!md.getDisplayMedia){msg('Syncing to the tab\u2019s sound needs desktop Chrome or Edge. On a phone or tablet, try \ud83c\udfa4 Mic Visualizer.');return;}
    try{const s=await md.getDisplayMedia({video:true,audio:{echoCancellation:false,noiseSuppression:false,autoGainControl:false,suppressLocalAudioPlayback:false},preferCurrentTab:true,selfBrowserSurface:'include',systemAudio:'include'});
      if(!s.getAudioTracks().length){s.getTracks().forEach(t=>t.stop());msg('No sound was shared. Pick \u201cThis tab\u201d (or the Spotify tab) and turn on \u201cAlso share tab audio\u201d.');return;}
      s.getVideoTracks().forEach(t=>{t.enabled=false;});useStream(s,$('#spCap'),'Synced! The visuals now follow the real sound of the tab.');}
    catch(e){msg(e&&e.name==='NotAllowedError'?'Sharing was cancelled.':'Could not share the tab\u2019s sound: '+(e&&e.message));}};
  $('#spMic').onclick=async()=>{if(capOn&&$('#spMic').classList.contains('on')){stopCap();msg('Mic off.');return;}
    const md=navigator.mediaDevices;if(!md||!md.getUserMedia){msg('This browser can\u2019t use the microphone here. If you opened this inside another app, open it in Safari or Chrome.');return;}
    try{const s=await md.getUserMedia({audio:{echoCancellation:false,noiseSuppression:false,autoGainControl:false}});useStream(s,$('#spMic'),'Mic Visualizer is listening. Play music on a speaker, TV or another device and the fish will follow it.');}
    catch(e){msg(e&&e.name==='NotAllowedError'?'Microphone access was blocked. Allow the microphone for this site and try again.':'Could not start the mic: '+(e&&e.message));}};
})();

/* \ud83d\udcfa share to TV (shared helper in site-assets/home/ltf-cast.js) */
function openCast(){if(window.LTFCast)return LTFCast.open();const s=document.createElement('script');s.src=(/site-assets\/fishamp\/fishamp\.js/.test(ME_SRC)?ME_SRC.replace(/fishamp\/fishamp\.js.*$/,'home/ltf-cast.js'):'https://cdn.jsdelivr.net/gh/nathancliffordsalmon-sketch/crossfader@main/site-assets/home/ltf-cast.js');s.onload=()=>window.LTFCast&&LTFCast.open();document.head.appendChild(s);}
$('#castBtn').onclick=openCast;$('#fsCast').onclick=e=>{e.stopPropagation();openCast();};
/* quick play: random Spotify playlist or any game-music collection */
(function qpInit(){const sel=$('#qpSel');
  function fill(){if(!window.LTFGM||!LTFGM.collections)return;while(sel.options.length>1)sel.remove(1);LTFGM.collections.forEach(c=>{const o=document.createElement('option');o.value=c.key;o.textContent=c.label;sel.appendChild(o);});
    /* phones and tablets default to game music (C64, MOBYGRATIS\u2026); computers default to Spotify */
    const touch=window.matchMedia&&(matchMedia('(pointer:coarse)').matches||matchMedia('(hover:none)').matches);
    if(touch&&!sel.dataset.picked){const pref=LTFGM.collections.map(c=>c.key).filter(k=>/^c64$|^mobygratis/.test(k));const all=LTFGM.collections.map(c=>c.key);const pool=pref.length?pref:all;sel.value=pool[Math.floor(Math.random()*pool.length)];}}
  sel.addEventListener('change',()=>{sel.dataset.picked='1';});
  addEventListener('ltfgm-ready',()=>{if(window.LTFGM)LTFGM.load().then(fill).catch(()=>{});});
  let n=0;(function wait(){if(window.LTFGM&&LTFGM.collections&&$('#gmRow').classList.contains('on'))return fill();if(++n<60)setTimeout(wait,250);})();
  $('#qpGo').onclick=()=>{const v=sel.value;
    if(v==='sp'){$('#spRand').click();setTimeout(()=>{try{SP.ctrl&&SP.ctrl.play();}catch(e){}},1800);$('#spRow').scrollIntoView({behavior:'smooth',block:'center'});return;}
    const coll=$('#gmColl');if(!window.LTFGM)return;coll.value=v;coll.dispatchEvent(new Event('change'));const sub=$('#gmSub');if(sub.options.length)sub.value='*';$('#gmGo').click();};
})();

/* scene chips */
const sc=$('#scenes');SCENES.forEach((S,i)=>{const b=document.createElement('button');b.textContent=S().name;b.onclick=()=>openFS(i);sc.appendChild(b);});

/* ================= CANVASES ================= */
const DPR=()=>Math.min(window.devicePixelRatio||1,1.5);
const aqC=$('#aq'),aqX=aqC.getContext('2d');let aqViz=Aquarium(),aqW=0,aqH=0;
function fitAq(){const r=aqC.getBoundingClientRect(),d=DPR();aqW=Math.max(200,r.width);aqH=300;aqC.width=Math.round(aqW*d);aqC.height=Math.round(aqH*d);aqX.setTransform(d,0,0,d,0,0);aqViz.init(aqW,aqH);}
const fs=$('#fs'),fsC=$('#fsc'),fsX=fsC.getContext('2d');let fsOpen=false,sceneI=0,viz=null,fw=0,fh=0;
function fitFS(){const d=DPR();fw=innerWidth;fh=innerHeight;fsC.width=Math.round(fw*d);fsC.height=Math.round(fh*d);fsX.setTransform(d,0,0,d,0,0);if(viz)viz.init(fw,fh);}
function setScene(i){sceneI=(i+SCENES.length)%SCENES.length;viz=SCENES[sceneI]();fsX.setTransform(DPR(),0,0,DPR(),0,0);fsX.globalAlpha=1;fsX.globalCompositeOperation='source-over';viz.init(fw,fh);
  $('#fsName').textContent=`${sceneI+1}/${SCENES.length} \u00b7 ${viz.name}`;$('#fsSub').textContent=viz.sub;
  const to=$('#toast');to.textContent=viz.name;to.classList.add('show');clearTimeout(setScene.tt);setScene.tt=setTimeout(()=>to.classList.remove('show'),1400);wake();}
function openFS(i=sceneI){fsOpen=true;fs.classList.add('open');document.body.style.overflow='hidden';fitFS();setScene(i);
  try{const p=fs.requestFullscreen?fs.requestFullscreen({navigationUI:'hide'}):fs.webkitRequestFullscreen?fs.webkitRequestFullscreen():null;if(p&&p.catch)p.catch(()=>{});}catch(e){}
  if(!isPlaying)play();}
function closeFS(){fsOpen=false;fs.classList.remove('open');document.body.style.overflow='';viz=null;if(document.fullscreenElement){try{document.exitFullscreen()}catch(e){}}}
$('#tank').onclick=()=>openFS(sceneI);$('#dive').onclick=()=>openFS(sceneI);
fs.addEventListener('click',e=>{if(e.target.closest('.top'))return;setScene(sceneI+1);});
$('#fsClose').onclick=e=>{e.stopPropagation();closeFS();};
$('#fsNext').onclick=e=>{e.stopPropagation();setScene(sceneI+1);};
$('#fsPlay').onclick=e=>{e.stopPropagation();isPlaying?pause():play();};
document.addEventListener('fullscreenchange',()=>{if(!document.fullscreenElement&&fsOpen)closeFS();setTimeout(()=>{if(fsOpen)fitFS();},60);});
let idleT;function wake(){fs.classList.remove('idle');clearTimeout(idleT);idleT=setTimeout(()=>fs.classList.add('idle'),3000);}
fs.addEventListener('mousemove',wake);
addEventListener('keydown',e=>{if(e.target.tagName==='INPUT'&&e.target.type!=='range')return;
  if(e.code==='Space'){e.preventDefault();isPlaying?pause():play();}
  else if(e.key==='f'||e.key==='F'){fsOpen?closeFS():openFS();}
  else if(e.key==='Escape'&&fsOpen)closeFS();
  else if(fsOpen&&e.key==='ArrowRight')setScene(sceneI+1);
  else if(fsOpen&&e.key==='ArrowLeft')setScene(sceneI-1);
  else if((e.key==='n'||e.key==='N')&&fsOpen&&viz&&viz.name==='FLOWER HILLS'){const c=(performance.now()/1000+flowerSkip)%630;flowerSkip+=(c<575?575-c:0);}
});
addEventListener('resize',()=>{fitAq();if(fsOpen)fitFS();});

/* ================= LOOP ================= */
let lastT=performance.now()/1000,uiT=0;
function frame(){
  const t=performance.now()/1000,dt=clamp(t-lastT,0,.05);lastT=t;
  updateAudio(t,dt);
  if(fsOpen&&viz){fsX.save();viz.draw(fsX,t,dt,A);fsX.restore();if(viz.name==='FLOWER HILLS')$('#fsSub').textContent=viz.sub;}
  else{aqX.save();aqViz.draw(aqX,t,dt,A);aqX.restore();}
  uiT-=dt;if(uiT<0){uiT=.1;
    let el=0,du=0;if(ac){const tr=tracks[cur];if(tr&&tr.demo&&demo)el=ac.currentTime-demo.start;else if(tr&&tr.gm&&gmEl){el=gmEl.currentTime;du=gmEl.duration||0;}else if(tr&&!tr.demo){el=mediaEl.currentTime;du=mediaEl.duration||0;}}
    $('#time').textContent=fmt(el);if(!seeking)seek.value=du?el/du*1000:0;seek.disabled=!du;
    $('#beatChip').classList.toggle('on',A.pulse>.5);}
  requestAnimationFrame(frame);
}
renderList();setMarq();fitAq();requestAnimationFrame(frame);
})();
