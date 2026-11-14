/* FISHAMP buttons: styles for the header button (desktop) and a phone-only
   retro-window block placed under the EXPERIENCE block on the home page. */
(function(){
  if(window.__ltfFaBtn)return;window.__ltfFaBtn=1;
  var BASE=(document.currentScript&&document.currentScript.src||'').replace(/fishamp-btn\.js.*$/,'');
  var css=[
  "@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@900&display=swap');",
  /* Header button: compact stack, small FISH label above the fish-school AMP badge. */
  ".ltf-fa-btn{display:inline-flex;flex-direction:column;align-items:center;gap:3px;flex:0 0 auto;background:#05070c;border-radius:9px;padding:4px 6px 5px;text-decoration:none!important;line-height:1;",
  "box-shadow:0 0 0 1.5px #0b1220,0 0 0 3px #00eaff,0 0 12px rgba(0,234,255,.5),3px 4px 0 3px #2b1055;transition:transform .15s,box-shadow .15s}",
  ".ltf-fa-btn:hover{transform:translate(-1px,-2px);box-shadow:0 0 0 1.5px #0b1220,0 0 0 3px #5ff6ff,0 0 22px rgba(0,234,255,.9),5px 6px 0 3px #2b1055}",
  ".ltf-fa-btn .ltf-fa-fish{font:900 10px/1 Orbitron,'Press Start 2P',sans-serif;letter-spacing:.32em;padding-left:.32em;color:#e9fdff;text-shadow:0 0 5px #00eaff,0 0 10px #00eaff}",
  ".ltf-fa-btn .ltf-fa-amp{padding:2px 5px;border-radius:6px}",
  ".ltf-fa-btn .ltf-fa-amp img{height:19px}",
  ".ltf-fa-amp{display:block;border-radius:8px;padding:4px 7px;background:radial-gradient(ellipse at 50% 25%,#d6fcff,#3fe3ff 45%,#0096c7);box-shadow:inset 0 0 10px rgba(0,60,90,.55),0 0 12px rgba(0,234,255,.7);animation:ltfFaTide 3.2s ease-in-out infinite}",
  ".ltf-fa-amp img{display:block;height:30px;width:auto}",
  ".ltf-fa-btn:hover .ltf-fa-amp{animation-duration:.8s}",
  "@keyframes ltfFaTide{50%{background-position:0 0;box-shadow:inset 0 0 14px rgba(0,60,90,.35),0 0 20px rgba(0,234,255,.95)}}",
  "@media (max-width:781px),(max-height:520px) and (pointer:coarse){.ltf-fa-btn{display:none!important}}",
  ".ltf-fa-mob{display:none;margin:0 0 22px;border:1.6px solid #11131a;border-radius:6px;background:#23232e;box-shadow:inset 0 0 0 2px #6b7080,5px 5px 0 #2b1055;overflow:hidden;text-decoration:none!important}",
  ".ltf-fa-mob .bar{display:flex;justify-content:space-between;align-items:center;padding:5px 8px;background:linear-gradient(90deg,#00eaff,#ff7a59 70%,#3a3a48 70%);font:10px/1 'Press Start 2P',monospace;color:#1b1d24}",
  ".ltf-fa-mob .bar i{display:inline-block;width:9px;height:9px;margin-left:5px;background:#9aa0b4;border:1px solid #11131a}",
  ".ltf-fa-mob .in{display:flex;gap:12px;align-items:center;margin:8px;padding:10px 12px;background:#05070a;border-radius:3px;box-shadow:inset 1px 1px 0 #000,inset -1px -1px 0 #444}",
  ".ltf-fa-mob .ltf-fa-amp img{height:34px}",
  ".ltf-fa-mob .t1{font:12px/1.5 'Press Start 2P',monospace;color:#5ff6ff;text-shadow:0 0 6px rgba(0,234,255,.7)}",
  ".ltf-fa-mob .t2{font:17px/1.15 VT323,monospace;color:#ffd36a;margin-top:6px}",
  "@media (max-width:781px),(max-height:520px) and (pointer:coarse){.ltf-fa-mob{display:block}}",
  "@media (prefers-reduced-motion:reduce){.ltf-fa-amp{animation:none}}"
  ].join('\n');
  if(!window.LTFCast&&BASE){var cs=document.createElement('script');cs.src=BASE.replace(/fishamp\/$/,'home/')+'ltf-cast.js';cs.async=true;document.head.appendChild(cs);}
  var st=document.createElement('style');st.id='ltf-fishamp-btn-css';st.textContent=css;document.head.appendChild(st);
  function mob(){
    if(document.querySelector('.ltf-fa-mob'))return;
    var anchor=document.querySelector('.ltf-xpw')||document.getElementById('ltf-xp-cards')||document.querySelector('.ltf-xp-list');
    if(!anchor)return;
    var a=document.createElement('a');a.className='ltf-fa-mob';a.href='/fishamp/';
    a.setAttribute('aria-label','FISHAMP: the neon fish music player with full-screen visualizers');
    a.innerHTML='<div class="bar"><span>FISHAMP</span><span><i></i><i></i><i></i></span></div>'+
      '<div class="in"><span class="ltf-fa-amp"><img src="'+BASE+'amp-school.svg" alt="" width="72" height="34"></span>'+
      '<div><div class="t1">\u25b6 FISHAMP</div><div class="t2">Neon fish music player: aquarium tides, storms, light cycles and more.</div></div></div>';
    anchor.parentNode.insertBefore(a,anchor.nextSibling);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',mob);else mob();
})();
