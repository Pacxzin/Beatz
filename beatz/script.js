// ─── CONFIGURAÇÃO ───────────────────────────────────────────────
// Edite aqui: seu número de WhatsApp (com DDI) e seu @ do Instagram
const WHATSAPP = "5515999999999";
const INSTAGRAM = "seuperfil";

// ─── SEUS BEATS ─────────────────────────────────────────────────
// Edite os campos abaixo com os seus beats reais.
// - name: nome do beat
// - bpm: batidas por minuto
// - key: tom (ex: "A min", "C# maj")
// - tags: até 2 tags (primeiro aparece no card)
// - price: preço da licença não-exclusiva (R$)
// - exclusive: preço da licença exclusiva (R$)
// - src: caminho pro arquivo de áudio (ex: "audio/night-crawler.mp3")
const beats = [
  { id: 1,  name: "W ACAPELLA", bpm: 140, key: "F# min", tags: ["trap", "dark"],    price: 80,  exclusive: 350, src: "beats/beaTZZZZ.mp3"},
  { id: 1,  name: "HOODRICH", bpm: 140, key: "F# min", tags: ["trap", "dark"],    price: 80,  exclusive: 350, src: "beats/chave_demaisssssssssss_automation_clip.mp3"},
  { id: 1,  name: "VVS", bpm: 140, key: "F# min", tags: ["trap", "dark"],    price: 80,  exclusive: 350, src: "beats/Melhor_beat_da_minha_vida_type_nink.mp3"},
  { id: 1,  name: "GRIFE", bpm: 140, key: "F# min", tags: ["trap", "dark"],    price: 80,  exclusive: 350, src: ""},
  { id: 1,  name: "BALLA", bpm: 140, key: "F# min", tags: ["trap", "dark"],    price: 80,  exclusive: 350, src: ""},
  { id: 2,  name: "BLOOD MOON",    bpm: 145, key: "A min",  tags: ["drill", "hard"],   price: 90,  exclusive: 400, src: "" },
  { id: 3,  name: "PARANOIA",      bpm: 138, key: "D min",  tags: ["trap", "melodic"], price: 70,  exclusive: 300, src: "" },
  { id: 4,  name: "SÉQUENCIA",     bpm: 150, key: "G min",  tags: ["trap", "bounce"],  price: 85,  exclusive: 380, src: "" },
  { id: 5,  name: "ÚLTIMO AVISO",  bpm: 142, key: "C min",  tags: ["drill", "uk"],     price: 90,  exclusive: 400, src: "" },


];

// ─── ESTADO ─────────────────────────────────────────────────────
let currentBeatIdx = null;
let isPlaying = false;
let progressInterval;

const audio = document.getElementById('audio-player');

// ─── INIT ────────────────────────────────────────────────────────
document.getElementById('beat-count').textContent = beats.length;
document.getElementById('count-label').textContent = beats.length + ' beats';
renderBeats();
simulateProgress();

document.getElementById('modal').addEventListener('click', function(e) {
  if (e.target === this) closeModal();
});

// ─── RENDER ──────────────────────────────────────────────────────
function generateWaveform(seed) {
  let bars = '';
  for (let i = 0; i < 32; i++) {
    const h = 20 + Math.abs(Math.sin(seed * i * 0.7 + i) * 28);
    bars += `<div class="waveform-bar${i < 8 ? ' active' : ''}" style="height:${h}px"></div>`;
  }
  return bars;
}

function renderBeats() {
  const grid = document.getElementById('beats-grid');
  grid.innerHTML = beats.map((b, idx) => `
    <div class="beat-card" id="card-${idx}" onclick="selectBeat(${idx})">
      <div class="beat-top">
        <span class="beat-num">${String(b.id).padStart(2, '0')}</span>
        <span class="beat-tag">${b.tags[0]}</span>
      </div>
      <div class="beat-name">${b.name}</div>
      <div class="beat-meta">
        <span>${b.bpm} BPM</span>
        <span>${b.key}</span>
      </div>
      <div class="waveform">${generateWaveform(b.id)}</div>
      <div class="beat-controls">
        <button class="play-btn" id="play-${idx}" onclick="event.stopPropagation(); togglePlay(${idx})">
          <svg viewBox="0 0 12 12"><path id="play-icon-${idx}" d="M2 1l9 5-9 5V1z"/></svg>
        </button>
        <span class="beat-price">R$ ${b.price}</span>
        <button class="buy-btn" onclick="event.stopPropagation(); openModal(${idx})">Comprar</button>
      </div>
    </div>
  `).join('');
}

// ─── PLAYER ──────────────────────────────────────────────────────
function selectBeat(idx) {
  togglePlay(idx);
}

function togglePlay(idx) {
  if (currentBeatIdx === idx && isPlaying) {
    audio.pause();
    isPlaying = false;
    updatePlayIcons();
    updateGPIcon();
    return;
  }

  if (currentBeatIdx !== idx) {
    document.getElementById('card-' + currentBeatIdx)?.classList.remove('playing');
    currentBeatIdx = idx;
    audio.src = beats[idx].src || '';
    if (beats[idx].src) audio.play();
  }

  isPlaying = true;
  updatePlayIcons();
  updateGPIcon();
  updateGlobalPlayer();
  document.getElementById('card-' + idx)?.classList.add('playing');
  document.getElementById('global-player').classList.add('visible');
}

function toggleGlobalPlay() {
  if (currentBeatIdx === null) return;
  isPlaying = !isPlaying;

  if (isPlaying && beats[currentBeatIdx].src) audio.play();
  else audio.pause();

  updatePlayIcons();
  updateGPIcon();
  document.getElementById('card-' + currentBeatIdx)?.classList.toggle('playing', isPlaying);
}

function prevBeat() {
  if (currentBeatIdx === null) return;
  const idx = (currentBeatIdx - 1 + beats.length) % beats.length;
  document.getElementById('card-' + currentBeatIdx)?.classList.remove('playing');
  currentBeatIdx = idx;
  isPlaying = true;
  audio.src = beats[idx].src || '';
  if (beats[idx].src) audio.play();
  updatePlayIcons();
  updateGPIcon();
  updateGlobalPlayer();
  document.getElementById('card-' + idx)?.classList.add('playing');
}

function nextBeat() {
  if (currentBeatIdx === null) { togglePlay(0); return; }
  const idx = (currentBeatIdx + 1) % beats.length;
  document.getElementById('card-' + currentBeatIdx)?.classList.remove('playing');
  currentBeatIdx = idx;
  isPlaying = true;
  audio.src = beats[idx].src || '';
  if (beats[idx].src) audio.play();
  updatePlayIcons();
  updateGPIcon();
  updateGlobalPlayer();
  document.getElementById('card-' + idx)?.classList.add('playing');
}

function updatePlayIcons() {
  beats.forEach((_, i) => {
    const icon = document.getElementById('play-icon-' + i);
    if (!icon) return;
    icon.setAttribute('d', i === currentBeatIdx && isPlaying
      ? 'M2 1h3v10H2zM7 1h3v10H7z'
      : 'M2 1l9 5-9 5V1z'
    );
  });
}

function updateGPIcon() {
  const icon = document.getElementById('gp-play-icon');
  icon.setAttribute('d', isPlaying
    ? 'M2 1h3v10H2zM7 1h3v10H7z'
    : 'M2 1l9 5-9 5V1z'
  );
}

function updateGlobalPlayer() {
  if (currentBeatIdx === null) return;
  const b = beats[currentBeatIdx];
  document.getElementById('gp-name').textContent = b.name;
  document.getElementById('gp-meta').textContent = `${b.bpm} BPM · ${b.key} · ${b.tags.join(', ')}`;
}

// ─── PROGRESS BAR ────────────────────────────────────────────────
function seekTo(e) {
  const bar = document.getElementById('progress-bar');
  const pct = e.offsetX / bar.offsetWidth;
  document.getElementById('progress-fill').style.width = (pct * 100) + '%';
  if (beats[currentBeatIdx]?.src && audio.duration) {
    audio.currentTime = audio.duration * pct;
  }
}

function simulateProgress() {
  clearInterval(progressInterval);
  let pct = 0;
  progressInterval = setInterval(() => {
    if (!isPlaying) return;

    if (beats[currentBeatIdx]?.src && audio.duration) {
      pct = (audio.currentTime / audio.duration) * 100;
      document.getElementById('gp-current').textContent = fmt(Math.round(audio.currentTime));
      document.getElementById('gp-duration').textContent = fmt(Math.round(audio.duration));
    } else {
      pct += 0.3;
      if (pct > 100) pct = 0;
      const total = 185;
      document.getElementById('gp-current').textContent = fmt(Math.round(total * pct / 100));
      document.getElementById('gp-duration').textContent = fmt(total);
    }

    document.getElementById('progress-fill').style.width = pct + '%';
  }, 300);
}

function fmt(s) {
  return Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0');
}

// ─── MODAL ───────────────────────────────────────────────────────
function openModal(idx) {
  const b = beats[idx];
  document.getElementById('modal-beat-name').textContent = b.name;

  const msgBasic = encodeURIComponent(`Oi! Vi seu site e quero comprar o beat "${b.name}". Pode me passar os detalhes?`);
  const msgExclusive = encodeURIComponent(`Oi! Tenho interesse na EXCLUSIVIDADE do beat "${b.name}". Podemos negociar?`);

  document.getElementById('modal-options').innerHTML = `
    <a class="modal-option" href="https://wa.me/${WHATSAPP}?text=${msgBasic}" target="_blank">
      <div class="option-info">
        <span class="option-name">Licença não-exclusiva</span>
        <span class="option-desc">MP3 320k · uso comercial limitado · 1 artista</span>
      </div>
      <span class="option-price">R$ ${b.price}</span>
    </a>
    <a class="modal-option" href="https://wa.me/${WHATSAPP}?text=${msgExclusive}" target="_blank">
      <div class="option-info">
        <span class="option-name">Licença exclusiva</span>
        <span class="option-desc">WAV + MP3 · exclusividade total · beat sai do catálogo</span>
      </div>
      <span class="option-price">R$ ${b.exclusive}</span>
    </a>
  `;

  document.getElementById('modal').classList.add('open');
}

function openModalForCurrent() {
  if (currentBeatIdx !== null) openModal(currentBeatIdx);
}

function closeModal() {
  document.getElementById('modal').classList.remove('open');
}