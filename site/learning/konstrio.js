/* ============================================================
   KONSTRIO : Compagnon-tuteur & chatbot IA (v2)
   <konstrio-buddy emotion message context [inline] [collapsed] [chat] [show-hint] [show-why] [endpoint]>
   - Avatar robot voxel SVG animé (12 émotions, expressions yeux + antenne + bouche parlante)
   - Bulle repliable (réduire / agrandir), aria-live, sous-titres
   - Voix conversationnelle GRATUITE (Web Speech API, fr-FR) : désactivable
   - Chatbot : el.ask(prompt) → window.claude.complete OU endpoint Workers AI OU évènement 'ask'
   - Contextualisé par zone (attribut context) pour toute la suite Konstrio
   - API rétro-compatible : emotion, message, say(t,e,{speak}), celebrate(), toggle(), muted
   - Évènements : 'hint', 'why', 'mute-change', 'ask', 'voice-change'
   - Respecte prefers-reduced-motion.
   ============================================================ */
(function () {
  const REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const synth = window.speechSynthesis || null;

  function eyes(e) {
    const L = 56, R = 94, Y = 74, cyan = '#0B1A3A', glow = 'filter:drop-shadow(0 0 2px rgba(255,255,255,.9));';
    const arc = (cx) => `<path d="M${cx-11} ${Y-2} Q${cx} ${Y+9} ${cx+11} ${Y-2}" fill="none" stroke="${cyan}" stroke-width="5" stroke-linecap="round" style="${glow}"/>`;
    const dot = (cx, r=6) => `<circle cx="${cx}" cy="${Y}" r="${r}" fill="${cyan}" style="${glow}"/>`;
    const oval = (cx, rx=6, ry=9) => `<ellipse cx="${cx}" cy="${Y}" rx="${rx}" ry="${ry}" fill="${cyan}" style="${glow}"/>`;
    const line = (cx) => `<rect x="${cx-10}" y="${Y-2.5}" width="20" height="5" rx="2.5" fill="${cyan}" style="${glow}"/>`;
    const dash = (cx) => `<rect x="${cx-9}" y="${Y-2}" width="18" height="4" rx="2" fill="#3FC8E0" style="${glow}"/>`;
    const heart = (cx) => `<path d="M${cx} ${Y+5} C${cx-9} ${Y-4} ${cx-4} ${Y-9} ${cx} ${Y-4} C${cx+4} ${Y-9} ${cx+9} ${Y-4} ${cx} ${Y+5}z" fill="${cyan}" style="${glow}"/>`;
    switch (e) {
      case 'joyeux': case 'fier': case 'rassurant': return arc(L) + arc(R);
      case 'neutre': return dash(L) + dash(R);
      case 'concentre': return line(L) + line(R);
      case 'pensif': return dot(L,5) + dot(R,5) + `<circle cx="${L}" cy="${Y-7}" r="2.4" fill="${cyan}" opacity=".7"/><circle cx="${R}" cy="${Y-7}" r="2.4" fill="${cyan}" opacity=".7"/>`;
      case 'enthousiaste': return oval(L,7,10) + oval(R,7,10);
      case 'curieux': return dot(L,7) + dot(R,5);
      case 'surpris': return `<circle cx="${L}" cy="${Y}" r="9" fill="none" stroke="${cyan}" stroke-width="4.5" style="${glow}"/><circle cx="${R}" cy="${Y}" r="9" fill="none" stroke="${cyan}" stroke-width="4.5" style="${glow}"/>`;
      case 'clin': return arc(L) + oval(R,6,9);
      case 'amour': return heart(L) + heart(R);
      case 'idee': return dot(L) + dot(R) + `<circle cx="${(L+R)/2}" cy="22" r="6" fill="#FFD24A" style="filter:drop-shadow(0 0 6px #FFD24A)"/>`;
      case 'celebration': return `<path d="M${L-11} ${Y+4} L${L} ${Y-8} L${L+11} ${Y+4}" fill="none" stroke="${cyan}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" style="${glow}"/><path d="M${R-11} ${Y+4} L${R} ${Y-8} L${R+11} ${Y+4}" fill="none" stroke="${cyan}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" style="${glow}"/>`;
      case 'idle': return `<path d="M${L-10} ${Y} Q${L} ${Y+6} ${L+10} ${Y}" fill="none" stroke="#39B7D6" stroke-width="4.5" stroke-linecap="round"/><path d="M${R-10} ${Y} Q${R} ${Y+6} ${R+10} ${Y}" fill="none" stroke="#39B7D6" stroke-width="4.5" stroke-linecap="round"/>`;
      default: return dot(L) + dot(R);
    }
  }
  const ledColor = { celebration:'#F5A623', fier:'#29B6E0', surpris:'#E63329', curieux:'#9B2BB0', idle:'#465', enthousiaste:'#29B6E0', amour:'#E63329', idee:'#FFD24A' };

  function avatarSVG(e, speaking) {
    // Opale : une opale taillée, aux reflets d'aurore boréale, avec de grands
    // yeux de manga et une étincelle. Même API que l'ancien avatar.
    const led = ledColor[e] || '#46E3FF';
    const mouth = speaking
      ? `<g class="kb-mouth"><rect x="62" y="96" width="4" height="7" rx="2" fill="#0B1A3A" opacity=".8"/><rect x="69" y="93" width="4" height="12" rx="2" fill="#0B1A3A" opacity=".8"/><rect x="76" y="95" width="4" height="9" rx="2" fill="#0B1A3A" opacity=".8"/><rect x="83" y="97" width="4" height="6" rx="2" fill="#0B1A3A" opacity=".8"/></g>`
      : `<path d="M66 97 Q75 104 84 97" fill="none" stroke="#0B1A3A" stroke-width="3" stroke-linecap="round" opacity=".75"/>`;
    return `
    <svg class="kb-svg" viewBox="0 0 150 168" width="100%" height="100%" aria-hidden="true">
      <defs>
        <linearGradient id="kb-opale" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#7FF0C8"/><stop offset=".45" stop-color="#2BB5A0"/><stop offset=".75" stop-color="#2A7FA6"/><stop offset="1" stop-color="#C79CE6"/></linearGradient>
        <linearGradient id="kb-facette" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffffff" stop-opacity=".85"/><stop offset="1" stop-color="#ffffff" stop-opacity=".15"/></linearGradient>
        <radialGradient id="kb-halo" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stop-color="${led}" stop-opacity=".55"/><stop offset="1" stop-color="${led}" stop-opacity="0"/></radialGradient>
      </defs>
      <circle cx="75" cy="88" r="72" fill="url(#kb-halo)"/>
      <g class="kb-body">
        <path d="M75 8 L132 66 L75 160 L18 66 Z" fill="url(#kb-opale)"/>
        <path d="M75 8 L132 66 L18 66 Z" fill="url(#kb-facette)"/>
        <path d="M18 66 L75 76 L75 160 Z" fill="#0B1A3A" opacity=".18"/>
        <path d="M30 60 C 50 40, 64 70, 82 52 S 112 38, 122 50" fill="none" stroke="#ffffff" stroke-width="5" stroke-linecap="round" opacity=".45"/>
      </g>
      <g class="kb-eyes">${eyes(e)}</g>
      ${mouth}
      <path class="kb-led" fill="${led}" d="M126 6c.6 4 1.6 6.2 3.4 7.5 1.4 1.1 3.4 1.7 6.7 2.3-3.3.6-5.3 1.2-6.7 2.3-1.8 1.3-2.8 3.5-3.4 7.5-.6-4-1.6-6.2-3.4-7.5-1.4-1.1-3.4-1.7-6.7-2.3 3.3-.6 5.3-1.2 6.7-2.3 1.8-1.3 2.8-3.5 3.4-7.5Z"/>
      <circle cx="22" cy="130" r="3" fill="#fff" opacity=".7"/><circle cx="134" cy="112" r="2" fill="#fff" opacity=".6"/>
    </svg>`;
  }

  const CONTEXT_INTRO = {
    espace:"Salut ! Je suis Opale, ta copilote de l'espace. Demande-moi tout sur les planètes, étoiles et galaxies.",
    sciences:"Salut ! Opale à ton service pour explorer le vivant et les sciences.",
    learning:"Salut ! Moi c'est Opale, ta tutrice. Choisis un jeu et je t'accompagne pas à pas.",
    default:"Salut ! Moi c'est Opale. Pose-moi une question quand tu veux !"
  };

  const css = `
  :host { position: fixed; right: 20px; bottom: 20px; z-index: 70; font-family: 'Manrope', system-ui, sans-serif; }
  :host([inline]) { position: static; right:auto; bottom:auto; }
  * { box-sizing: border-box; }
  .wrap { display:flex; flex-direction:column; align-items:flex-end; gap:10px; max-width:340px; }
  .bubble { background:var(--surface,#fff); color:var(--fg,#13142B); border:1px solid var(--border,#E7E9F3); border-radius:16px 16px 4px 16px; box-shadow:var(--shadow-lg,0 18px 48px rgba(19,20,43,.16)); padding:0; width:100%; overflow:hidden; animation:kb-pop .3s cubic-bezier(.22,1,.36,1) both; }
  .bubble[hidden]{ display:none; }
  .hdr { display:flex; align-items:center; gap:7px; padding:9px 12px 4px; }
  .hdr .nm { font-family:'Archivo',sans-serif; font-weight:800; font-size:12px; letter-spacing:.02em; color:var(--accent-text,#5B57F0); display:flex; align-items:center; gap:6px; flex:1; }
  .hdr .nm b { width:7px; height:7px; border-radius:2px; background:var(--accent,#6E6BFF); }
  .hdr .ctx { font-family:'Space Mono',monospace; font-size:9px; color:var(--fg-muted,#888); text-transform:uppercase; }
  .hdr .min { width:22px; height:22px; border:none; border-radius:6px; background:var(--surface-2,#eef); color:var(--fg-muted,#888); cursor:pointer; font-size:13px; line-height:1; }
  .msg { font-size:14.5px; line-height:1.45; font-weight:500; padding:0 12px 4px; min-height:8px; }
  .row { display:flex; gap:6px; padding:8px 12px 12px; flex-wrap:wrap; }
  .mini { font:inherit; font-size:12.5px; font-weight:700; cursor:pointer; border:1px solid var(--border,#E7E9F3); background:var(--surface-2,#F3F4FF); color:var(--fg,#13142B); border-radius:999px; padding:7px 12px; min-height:36px; display:inline-flex; align-items:center; gap:5px; transition:transform .12s,background .2s; }
  .mini:hover { transform:translateY(-1px); background:var(--accent-weak,#ECEBFF); }
  .mini:focus-visible { outline:none; box-shadow:var(--ring,0 0 0 3px rgba(110,107,255,.45)); }
  .mini[aria-pressed="true"] { background:var(--accent,#6E6BFF); border-color:var(--accent,#6E6BFF); color:#fff; }
  .chat { display:flex; gap:6px; padding:0 12px 12px; }
  .chat input { flex:1; font:inherit; font-size:13px; border:1px solid var(--border,#E7E9F3); border-radius:999px; padding:8px 12px; background:var(--surface-2,#F3F4FF); color:var(--fg,#13142B); outline:none; }
  .chat input:focus { box-shadow:var(--ring,0 0 0 3px rgba(110,107,255,.45)); }
  .chat button { border:none; border-radius:999px; width:38px; background:var(--accent,#6E6BFF); color:#fff; cursor:pointer; font-size:16px; }
  .avatar-btn { border:none; background:none; padding:0; cursor:pointer; width:92px; height:104px; filter:drop-shadow(0 10px 20px rgba(19,20,43,.22)); transition:transform .2s; }
  .avatar-btn:hover { transform:scale(1.04); }
  .avatar-btn:focus-visible { outline:none; box-shadow:var(--ring); border-radius:18px; }
  .kb-body { animation:kb-bounce 3.4s ease-in-out infinite; transform-origin:75px 130px; }
  .kb-led { animation:kb-blink 2.2s ease-in-out infinite; }
  .kb-eyes { animation:kb-eye 5s ease-in-out infinite; transform-origin:75px 60px; }
  .kb-mouth rect { animation:kb-talk .35s ease-in-out infinite alternate; transform-origin:center bottom; }
  .kb-mouth rect:nth-child(2){animation-delay:.08s} .kb-mouth rect:nth-child(3){animation-delay:.16s} .kb-mouth rect:nth-child(4){animation-delay:.24s}
  @keyframes kb-pop { from{opacity:0;transform:translateY(8px) scale(.96)} to{opacity:1;transform:none} }
  @keyframes kb-bounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-3px)} }
  @keyframes kb-blink { 0%,92%,100%{opacity:1} 96%{opacity:.35} }
  @keyframes kb-eye { 0%,90%,100%{transform:scaleY(1)} 94%{transform:scaleY(.15)} }
  @keyframes kb-talk { from{transform:scaleY(.5)} to{transform:scaleY(1.3)} }
  .confetti { position:fixed; inset:0; pointer-events:none; z-index:200; overflow:hidden; }
  .confetti i { position:absolute; width:9px; height:14px; top:-20px; border-radius:2px; animation:kb-fall linear forwards; }
  @keyframes kb-fall { to{ transform:translateY(110vh) rotate(720deg); opacity:.2; } }
  @media (prefers-reduced-motion: reduce){ .kb-body,.kb-led,.kb-eyes,.kb-mouth rect{animation:none!important} .bubble{animation:none} }`;

  class KonstrioBuddy extends HTMLElement {
    static get observedAttributes() { return ['emotion','message','collapsed','context']; }
    constructor() { super(); this.attachShadow({ mode:'open' }); this._muted = localStorage.getItem('konstrio-muted')==='1'; this._voice = localStorage.getItem('konstrio-voice')==='1'; this._speaking=false; this._frVoice=null; this._initVoices(); }
    _initVoices(){ if(!synth)return; const pick=()=>{ const vs=synth.getVoices(); this._frVoice = vs.find(v=>/fr-FR/i.test(v.lang)) || vs.find(v=>/fr/i.test(v.lang)) || null; }; pick(); synth.onvoiceschanged=pick; }
    connectedCallback(){ this.render(); }
    attributeChangedCallback(){ if(this.shadowRoot.childElementCount) this.update(); }
    get emotion(){ return this.getAttribute('emotion')||'joyeux'; } set emotion(v){ this.setAttribute('emotion',v); }
    get message(){ return this.getAttribute('message')||''; } set message(v){ this.setAttribute('message',v); }
    get context(){ return this.getAttribute('context')||'default'; }
    get muted(){ return this._muted; }

    render(){
      const showHint=this.hasAttribute('show-hint'), showWhy=this.hasAttribute('show-why'), chat=this.hasAttribute('chat');
      this.shadowRoot.innerHTML = `
        <style>${css}</style>
        <div class="wrap">
          <div class="bubble" part="bubble" ${this.hasAttribute('collapsed')||!this.message?'hidden':''}>
            <div class="hdr"><span class="nm"><b></b> Opale ${this.context!=='default'?'<span class="ctx">'+this.context+'</span>':''}</span><button class="min" data-act="min" title="Réduire" aria-label="Réduire">▾</button></div>
            <div class="msg" aria-live="polite"></div>
            <div class="row">
              ${showHint?'<button class="mini" data-act="hint">💡 Indice</button>':''}
              ${showWhy?'<button class="mini" data-act="why">Pourquoi&nbsp;?</button>':''}
              <button class="mini" data-act="voice" aria-pressed="${this._voice}" title="Voix">${this._voice?'🗣️ Voix':'🔈 Voix'}</button>
              <button class="mini" data-act="mute" aria-pressed="${this._muted}" title="Son">${this._muted?'🔇 Son':'🔊 Son'}</button>
            </div>
            ${chat?'<div class="chat"><input type="text" placeholder="Pose ta question…" aria-label="Question" /><button data-act="send" aria-label="Envoyer">➤</button></div>':''}
          </div>
          <button class="avatar-btn" aria-label="Opale, ton tuteur. Cliquer pour l'aide.">${avatarSVG(this.emotion,false)}</button>
        </div>`;
      this.shadowRoot.querySelector('.avatar-btn').addEventListener('click',()=>this.toggle());
      this.shadowRoot.querySelectorAll('.mini,.min').forEach(b=>b.addEventListener('click',(ev)=>{ ev.stopPropagation(); const a=b.dataset.act;
        if(a==='mute'){ this._muted=!this._muted; localStorage.setItem('konstrio-muted',this._muted?'1':'0'); this.dispatchEvent(new CustomEvent('mute-change',{detail:this._muted,bubbles:true})); this.update(); }
        else if(a==='voice'){ this._voice=!this._voice; localStorage.setItem('konstrio-voice',this._voice?'1':'0'); this.dispatchEvent(new CustomEvent('voice-change',{detail:this._voice,bubbles:true})); if(this._voice&&this.message) this.speak(this.message); else if(synth) synth.cancel(); this.update(); }
        else if(a==='min'){ this.setAttribute('collapsed',''); this.update(); }
        else this.dispatchEvent(new CustomEvent(a,{bubbles:true}));
      }));
      const input=this.shadowRoot.querySelector('.chat input');
      if(input){ const send=()=>{ const v=input.value.trim(); if(v){ input.value=''; this.ask(v); } }; input.addEventListener('keydown',e=>{ if(e.key==='Enter')send(); }); this.shadowRoot.querySelector('[data-act="send"]').addEventListener('click',send); }
      this.update();
    }
    update(){
      const btn=this.shadowRoot.querySelector('.avatar-btn'); if(btn) btn.innerHTML=avatarSVG(this.emotion,this._speaking);
      const msg=this.shadowRoot.querySelector('.msg'); if(msg) msg.textContent=this.message;
      const bubble=this.shadowRoot.querySelector('.bubble'); if(bubble) bubble.hidden=this.hasAttribute('collapsed')||!this.message;
      const mb=this.shadowRoot.querySelector('[data-act="mute"]'); if(mb){ mb.textContent=this._muted?'🔇 Son':'🔊 Son'; mb.setAttribute('aria-pressed',this._muted); }
      const vb=this.shadowRoot.querySelector('[data-act="voice"]'); if(vb){ vb.textContent=this._voice?'🗣️ Voix':'🔈 Voix'; vb.setAttribute('aria-pressed',this._voice); }
    }
    toggle(){ if(this.hasAttribute('collapsed')) this.removeAttribute('collapsed'); else this.setAttribute('collapsed',''); }
    say(text, emotion, opts){ opts=opts||{}; if(emotion) this.setAttribute('emotion',emotion); this.setAttribute('message',text); this.removeAttribute('collapsed'); if(this._voice && (opts.speak!==false)) this.speak(text); }
    speak(text){ if(!synth||this._muted)return; try{ synth.cancel(); const u=new SpeechSynthesisUtterance(String(text).replace(/<[^>]+>/g,'').replace(/&[a-z]+;/g,' ')); u.lang='fr-FR'; if(this._frVoice)u.voice=this._frVoice; u.rate=1.02; u.pitch=1.05; u.onstart=()=>{ this._speaking=true; this.update(); }; u.onend=()=>{ this._speaking=false; this.update(); }; synth.speak(u); }catch(e){} }
    _ctxPrompt(p){ const role="Tu es Opale, une tutrice pédagogique bienveillante pour l'espace de cours Opaline. Réponds en français, de façon claire, courte et adaptée à un élève. "; const z=this.context!=='default'?("Contexte/zone : "+this.context+". "):''; return role+z+"Question : "+p; }
    async ask(prompt){
      this.say('Hmm, laisse-moi réfléchir…','concentre',{speak:false});
      let answer;
      try {
        if(window.claude && typeof window.claude.complete==='function'){ answer = await window.claude.complete(this._ctxPrompt(prompt)); }
        else if(this.getAttribute('endpoint')){ const r=await fetch(this.getAttribute('endpoint'),{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({prompt,context:this.context})}); const j=await r.json(); answer=j.answer||j.response||j.result||''; }
        else { this.dispatchEvent(new CustomEvent('ask',{detail:{prompt},bubbles:true})); answer="Bonne question ! Je suis prêt à y répondre dès que je serai connecté à l'IA Konstrio (Workers AI)."; }
      } catch(e){ answer="Oups, je n'ai pas réussi à répondre. Réessaie dans un instant !"; }
      this.say(answer||'…','enthousiaste',{speak:true});
      return answer;
    }
    celebrate(){ this.say(this.message||'Bravo, tu as réussi !','celebration'); if(REDUCED)return; const c=document.createElement('div'); c.className='confetti'; const cols=['#6E6BFF','#1B82E0','#29B6E0','#1E8C7A','#9B2BB0','#F5A623','#E63329']; for(let i=0;i<80;i++){ const p=document.createElement('i'); p.style.left=Math.random()*100+'vw'; p.style.background=cols[i%cols.length]; p.style.animationDuration=(1.6+Math.random()*1.6)+'s'; p.style.animationDelay=(Math.random()*.4)+'s'; c.appendChild(p); } this.shadowRoot.appendChild(c); setTimeout(()=>c.remove(),3600); }
  }
  if(!customElements.get('konstrio-buddy')) customElements.define('konstrio-buddy', KonstrioBuddy);
})();
