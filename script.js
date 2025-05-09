/* Simon Game – v4 with countdown and styled Game Over */
const order = [];
let playing = false, step = 0, level = 0;

const scoreSpan   = document.getElementById('score');
const overlay     = document.getElementById('overlay');
const finalScore  = document.getElementById('finalScore');
const countdownEl = document.getElementById('countdown');
const countNum    = document.getElementById('countNum');
const startBtn    = document.getElementById('startBtn');

const pads = ['green','red','yellow','blue'];

/* ---- Audio ---- */
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
const freqs = { green:164.81, red:220.00, yellow:277.18, blue:329.63 };
function beep(freq, dur=380){
  const o = audioCtx.createOscillator();
  const g = audioCtx.createGain();
  o.type = 'square';
  o.frequency.value = freq;
  o.connect(g); g.connect(audioCtx.destination);
  const now = audioCtx.currentTime;
  g.gain.setValueAtTime(0,now);
  g.gain.linearRampToValueAtTime(0.25, now+0.01);
  g.gain.linearRampToValueAtTime(0.22, now+dur/1000*0.7);
  g.gain.exponentialRampToValueAtTime(0.0001, now+dur/1000);
  o.start(now); o.stop(now+dur/1000+0.05);
}

/* ---- Visual flash ---- */
function flash(color){
  const el = document.getElementById(color);
  el.classList.add('lit');
  beep(freqs[color]);
  setTimeout(()=>el.classList.remove('lit'), 300);
}

/* ---- Computer sequence ---- */
function playSequence(){
  playing = false;
  let i=0;
  const inter = setInterval(()=>{
    flash(order[i]); i++;
    if(i>=order.length){ clearInterval(inter); playing=true; }
  }, Math.max(650-level*25,300));
}

/* ---- Game progression ---- */
function nextRound(){
  level++;
  scoreSpan.textContent = level;
  order.push(pads[Math.floor(Math.random()*4)]);
  step = 0;
  playSequence();
}

/* ---- Game Over ---- */
function gameOver(){
  playing = false;
  finalScore.textContent = level;
  overlay.classList.remove('hidden');
}

/* ---- Countdown ---- */
function startCountdown(callback){
  let count = 3;
  countNum.textContent = count;
  countdownEl.classList.remove('hidden');
  const timer = setInterval(()=>{
    count--;
    if(count === 0){
      clearInterval(timer);
      countdownEl.classList.add('hidden');
      callback();
    } else {
      countNum.textContent = count;
    }
  }, 1000);
}

/* ---- Starting the game ---- */
function startGame(){
  order.length = 0;
  level = 0;
  scoreSpan.textContent = 0;
  overlay.classList.add('hidden');
  startCountdown(nextRound);
}

/* ---- Pad click ---- */
pads.forEach(color=>{
  document.getElementById(color).addEventListener('click', ()=>{
    if(!playing) return;
    flash(color);
    if(color === order[step]){
      step++;
      if(step === order.length) setTimeout(nextRound, 750);
    } else {
      gameOver();
    }
  });
});

/* ---- Start button ---- */
startBtn.addEventListener('click', ()=>{
  if(audioCtx.state === 'suspended') audioCtx.resume();
  startGame();
});
