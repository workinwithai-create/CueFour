const CDN = "https://cdn.jsdelivr.net/gh/workinwithai-create/PreEight@main/public/samples";
const STEPS = 16;
const CUE = 4;
const SECTION = 8;
const TOTAL = CUE + SECTION;

const recipes = [
  { id:"kit-click", name:"Kit click", blurb:"Rim and stick on the ands of bar 4. Section lands on the next 1." },
  { id:"bass-root", name:"Bass root", blurb:"Upright holds the tonic. Space is the point. No walk yet." },
  { id:"nylon-figure", name:"Nylon figure", blurb:"Short nylon pick-up that yields on the section downbeat." },
  { id:"piano-door", name:"Piano door", blurb:"Piano voicings open then thin so the section has room." },
  { id:"count-in", name:"Count in", blurb:"Kick on 2 and 4 of bar 4. Snare on the and of 4. Classic cue." },
  { id:"hat-open", name:"Hat open", blurb:"Closed hats die on bar 4. Open hat on the last eighth." },
  { id:"brass-call", name:"Brass call", blurb:"Trumpet on bar 3, then silence. The section answers." },
  { id:"violin-hold", name:"Violin hold", blurb:"Violin sustains the 5, resolves into the section root." },
  { id:"half-hush", name:"Half hush", blurb:"Half-time pocket for two bars, full pocket on 3–4." },
  { id:"stop-hit", name:"Stop hit", blurb:"Bar 4 is air until beat 4. Section lands on the next 1." }
];

function bar(symbol, piano, guitar, bass){ return { symbol, piano, guitar, bass }; }

const grooves = [
  { id:"amber", name:"Amber Walk", bpm:98, key:"A minor",
    cue:[bar("Am",[45,48,52,57],[45,52,57],33),bar("F",[41,45,48,53],[41,48,53],41),bar("G",[43,47,50,55],[43,47,50],31),bar("Am",[45,48,52,57],[45,52,57],33)],
    section:[bar("Am",[45,48,52,57],[45,52,57],33),bar("F",[41,45,48,53],[41,48,53],41),bar("C",[48,52,55,60],[48,52,55],36),bar("G",[43,47,50,55],[43,47,50],31),bar("Am",[45,48,52,57],[45,52,57],33),bar("F",[41,45,48,53],[41,48,53],41),bar("C",[48,52,55,60],[48,52,55],36),bar("G",[43,47,50,55],[43,47,50],31)] },
  { id:"porch", name:"Porch Climb", bpm:86, key:"E major",
    cue:[bar("E",[40,44,47,52],[40,47,52],28),bar("B",[35,39,42,47],[35,42,47],23),bar("A",[33,37,40,45],[33,40,45],33),bar("E",[40,44,47,52],[40,47,52],28)],
    section:[bar("E",[40,44,47,52],[40,47,52],28),bar("B",[35,39,42,47],[35,42,47],23),bar("C#m",[44,47,51,56],[44,51,56],32),bar("A",[33,37,40,45],[33,40,45],33),bar("E",[40,44,47,52],[40,47,52],28),bar("B",[35,39,42,47],[35,42,47],23),bar("C#m",[44,47,51,56],[44,51,56],32),bar("A",[33,37,40,45],[33,40,45],33)] },
  { id:"fold", name:"Fold Radio", bpm:104, key:"D minor",
    cue:[bar("Dm",[38,41,45,50],[38,45,50],26),bar("Bb",[34,38,41,46],[34,41,46],34),bar("C",[36,40,43,48],[36,43,48],24),bar("Dm",[38,41,45,50],[38,45,50],26)],
    section:[bar("Dm",[38,41,45,50],[38,45,50],26),bar("Bb",[34,38,41,46],[34,41,46],34),bar("F",[41,45,48,53],[41,48,53],29),bar("C",[36,40,43,48],[36,43,48],24),bar("Dm",[38,41,45,50],[38,45,50],26),bar("Bb",[34,38,41,46],[34,41,46],34),bar("F",[41,45,48,53],[41,48,53],29),bar("C",[36,40,43,48],[36,43,48],24)] }
];

let ctx, bus, buffers = {};
const state = {
  groove: grooves[0],
  recipe: recipes[0],
  playing: false,
  mode: null,
  bar: -1
};

async function load() {
  ctx = new AudioContext();
  bus = ctx.createGain(); bus.gain.value = 0.35; bus.connect(ctx.destination);
  const files = [
    ["kick",`${CDN}/drums/kick.mp3`],["snare",`${CDN}/drums/snare.mp3`],["hat",`${CDN}/drums/hihat.mp3`],["crash",`${CDN}/drums/crash.mp3`],
    ["pC3",`${CDN}/piano/C3.mp3`],["pC4",`${CDN}/piano/C4.mp3`],["pA3",`${CDN}/piano/A3.mp3`],
    ["bE1",`${CDN}/bass/E1.mp3`],["bA1",`${CDN}/bass/A1.mp3`],["bC2",`${CDN}/bass/C2.mp3`],
    ["gE2",`${CDN}/guitar/E2.mp3`],["gA2",`${CDN}/guitar/A2.mp3`],["gE3",`${CDN}/guitar/E3.mp3`],
    ["tC4",`${CDN}/trumpet/C4.mp3`],["vA3",`${CDN}/violin/A3.mp3`]
  ];
  let loaded = 0;
  const status = document.getElementById("status");
  for (const [id, url] of files) {
    try {
      const res = await fetch(url);
      const ab = await res.arrayBuffer();
      buffers[id] = await ctx.decodeAudioData(ab);
    } catch (e) {
      console.warn("sample miss", id, e);
    }
    loaded++;
    status.textContent = `Seating chairs… ${Math.round(loaded/files.length*100)}%`;
  }
  status.textContent = "Chairs seated. Space plays B.";
}

function playBuf(id, when, rate = 1, gain = 0.4) {
  const buf = buffers[id];
  if (!buf) return;
  const src = ctx.createBufferSource();
  src.buffer = buf;
  src.playbackRate.value = rate;
  const g = ctx.createGain(); g.gain.value = gain; src.connect(g); g.connect(bus); src.start(when);
}

function rateFromMidi(midi, baseMidi){ return Math.pow(2, (midi-baseMidi)/12); }

function chordAt(i){
  if (i < CUE) return state.groove.cue[i];
  return state.groove.section[i - CUE];
}

function zone(i){ return i < CUE ? "cue" : "section"; }

function scheduleBar(barIndex, t0, stepDur){
  const ch = chordAt(barIndex);
  const z = zone(barIndex);
  const rec = state.recipe.id;
  const onCue = z === "cue";

  for (let s = 0; s < STEPS; s++) {
    const when = t0 + s * stepDur;

    // Kit
    if (s === 0) playBuf("kick", when, 1, onCue && rec === "half-hush" && barIndex < 2 ? 0.35 : 0.7);
    if (s === 8 && !(onCue && (rec === "stop-hit" || rec === "half-hush") && barIndex === 3)) playBuf("snare", when, 1, 0.45);
    if (s % 4 === 0) playBuf("hat", when, 1, onCue && rec === "hat-open" && barIndex === 3 ? 0.02 : 0.09);
    if (onCue && rec === "hat-open" && barIndex === 3 && s === 14) playBuf("hat", when, 1, 0.22);
    if (onCue && rec === "kit-click" && barIndex === 3 && (s === 6 || s === 10 || s === 14)) playBuf("snare", when, 1, 0.18);
    if (onCue && rec === "count-in" && barIndex === 3) {
      if (s === 4 || s === 12) playBuf("kick", when, 1, 0.55);
      if (s === 14) playBuf("snare", when, 1, 0.5);
    }
    if (onCue && rec === "stop-hit" && barIndex === 3 && s < 12) continue;

    // Chairs on 1
    if (s === 0) {
      const pGain = onCue && rec === "piano-door" && barIndex === 3 ? 0.12 : 0.28;
      playBuf("pC4", when, rateFromMidi(ch.piano[2] || 60, 60), pGain);
      playBuf("pA3", when, rateFromMidi(ch.piano[1] || 57, 57), pGain * 0.8);
      const bGain = onCue && rec === "bass-root" ? 0.55 : 0.45;
      playBuf("bA1", when, rateFromMidi(ch.bass, 33), bGain);
      const gGain = onCue && rec === "nylon-figure" && barIndex >= 2 ? 0.32 : 0.18;
      playBuf("gA2", when, rateFromMidi(ch.guitar[0] || 45, 45), gGain);
    }

    // Recipe-specific
    if (onCue && rec === "brass-call" && barIndex === 2 && (s === 0 || s === 8)) {
      playBuf("tC4", when, rateFromMidi(ch.piano[3] || 69, 60), 0.32);
    }
    if (onCue && rec === "violin-hold" && s === 0) {
      playBuf("vA3", when, rateFromMidi(ch.piano[2] || 60, 57), 0.2);
    }
    if (onCue && rec === "nylon-figure" && barIndex === 3 && s === 8) {
      playBuf("gE3", when, rateFromMidi((ch.guitar[1] || 52) + 5, 52), 0.28);
    }
  }
}

let timer = null;
function stop(){
  state.playing = false;
  state.mode = null;
  if (timer) clearTimeout(timer);
  timer = null;
  paintBars();
}

async function play(mode){
  if (!ctx) await load();
  if (ctx.state === "suspended") await ctx.resume();
  stop();
  state.playing = true;
  state.mode = mode;
  const startBar = mode === "eight" ? 0 : (mode === "loop" ? CUE : 0);
  const endBar = mode === "eight" ? CUE : (mode === "loop" ? TOTAL : TOTAL);
  const stepDur = 60 / state.groove.bpm / 4;
  let barIndex = startBar;
  const tick = () => {
    if (!state.playing) return;
    if (barIndex >= endBar) {
      if (mode === "loop") barIndex = startBar;
      else { stop(); return; }
    }
    state.bar = barIndex;
    paintBars();
    scheduleBar(barIndex, ctx.currentTime + 0.02, stepDur);
    barIndex += 1;
    timer = setTimeout(tick, STEPS * stepDur * 1000);
  };
  tick();
}

function punch(){
  const g = state.groove, r = state.recipe;
  return `CueFour punch list\n${g.name} · ${g.bpm} BPM · ${g.key} · ${r.name}\n\nThe problem: generators and unfinished stems dump cold into the first downbeat. The section does not land as a unit.\nThe move: ${r.blurb}\n\nCue (bars 1–4) — ${r.name}\n${g.cue.map((b,i)=>`  ${i+1}. ${b.symbol}`).join("\n")}\n\nSection (bars 5–12)\n${g.section.map((b,i)=>`  ${i+5}. ${b.symbol}`).join("\n")}\n\nLive chairs only. Distinct from OpenFour (song intro), LiftTwo (pre-hook climb), TagFour (last-line tag), PreEight, AfterHook, EndEight, LastHook.\nDrop the WAV on bars 1–4 of the target section. Do not loop the cue.`;
}

function paintGrooves(){
  const el = document.getElementById("grooves"); el.innerHTML = "";
  grooves.forEach(g => {
    const b = document.createElement("button");
    b.className = "card" + (state.groove.id === g.id ? " on" : "");
    b.innerHTML = `<b>${g.name}</b><span>${g.bpm} BPM · ${g.key}</span>`;
    b.onclick = () => { state.groove = g; render(); };
    el.appendChild(b);
  });
}

function paintRecipes(){
  const el = document.getElementById("recipes"); el.innerHTML = "";
  recipes.forEach(r => {
    const b = document.createElement("button");
    b.className = "card" + (state.recipe.id === r.id ? " on" : "");
    b.innerHTML = `<b>${r.name}</b><span>${r.blurb}</span>`;
    b.onclick = () => { state.recipe = r; render(); };
    el.appendChild(b);
  });
}

function paintBars(){
  const el = document.getElementById("bars"); el.innerHTML = "";
  for (let i = 0; i < TOTAL; i++) {
    const ch = chordAt(i);
    const d = document.createElement("div");
    d.className = "bar" + (i < CUE ? " cue" : "") + (state.playing && state.bar === i ? " active" : "");
    d.innerHTML = `<div class="n">${i+1} · ${i < CUE ? "Q" : "S"}</div><div class="c">${ch.symbol}</div>`;
    el.appendChild(d);
  }
}

function render(){
  paintGrooves();
  paintRecipes();
  paintBars();
  document.getElementById("punch").textContent = punch();
}

document.getElementById("playA").onclick = () => play("loop");
document.getElementById("playB").onclick = () => play("cut");
document.getElementById("play8").onclick = () => play("eight");
document.getElementById("stop").onclick = stop;
document.getElementById("copy").onclick = () => navigator.clipboard.writeText(punch());

document.addEventListener("keydown", (e) => {
  if (e.code === "Space" && e.target.tagName !== "BUTTON" && e.target.tagName !== "PRE") {
    e.preventDefault();
    play("cut");
  }
  if (e.code === "Escape") stop();
});

render();
load();
