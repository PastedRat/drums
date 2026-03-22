const kits = [
  {
    name: 'Night Vision',
    track: '#1',
    beatsDescription: 'Dark melodies and moody bounce inside the TV player.',
    buyLabel: 'Buy Night Vision',
    beats: [
      { title: 'Night Vision Beat 01', path: 'beats/night-vision-01.mp3', hint: 'Loads Night Vision beat 01 inside the player.' },
      { title: 'Night Vision Beat 02', path: 'beats/night-vision-02.mp3', hint: 'Loads Night Vision beat 02 inside the player.' },
      { title: 'Night Vision Beat 03', path: 'beats/night-vision-03.mp3', hint: 'Loads Night Vision beat 03 inside the player.' },
      { title: 'Night Vision Beat 04', path: 'beats/night-vision-04.mp3', hint: 'Loads Night Vision beat 04 inside the player.' },
    ],
  },
  {
    name: 'MetalSlugX',
    track: '#2',
    beatsDescription: 'Harder industrial beats with faster attack and brighter metal textures.',
    buyLabel: 'Buy MetalSlugX',
    beats: [
      { title: 'MetalSlugX Beat 01', path: 'beats/metalslugx-01.mp3', hint: 'Loads MetalSlugX beat 01 inside the player.' },
      { title: 'MetalSlugX Beat 02', path: 'beats/metalslugx-02.mp3', hint: 'Loads MetalSlugX beat 02 inside the player.' },
      { title: 'MetalSlugX Beat 03', path: 'beats/metalslugx-03.mp3', hint: 'Loads MetalSlugX beat 03 inside the player.' },
      { title: 'MetalSlugX Beat 04', path: 'beats/metalslugx-04.mp3', hint: 'Loads MetalSlugX beat 04 inside the player.' },
    ],
  },
  {
    name: 'Armored Core',
    track: '#3',
    beatsDescription: 'Heavy battle-ready beats with huge low end and mechanical atmosphere.',
    buyLabel: 'Buy Armored Core',
    beats: [
      { title: 'Armored Core Beat 01', path: 'beats/armored-core-01.mp3', hint: 'Loads Armored Core beat 01 inside the player.' },
      { title: 'Armored Core Beat 02', path: 'beats/armored-core-02.mp3', hint: 'Loads Armored Core beat 02 inside the player.' },
      { title: 'Armored Core Beat 03', path: 'beats/armored-core-03.mp3', hint: 'Loads Armored Core beat 03 inside the player.' },
      { title: 'Armored Core Beat 04', path: 'beats/armored-core-04.mp3', hint: 'Loads Armored Core beat 04 inside the player.' },
    ],
  },
  {
    name: 'Free Kits',
    track: '#4',
    beatsDescription: 'Simple free beats and starter-ready sounds loaded right into the TV.',
    buyLabel: 'Get Free Kits',
    beats: [
      { title: 'Free Kit Beat 01', path: 'beats/free-kit-01.mp3', hint: 'Loads Free Kit beat 01 inside the player.' },
      { title: 'Free Kit Beat 02', path: 'beats/free-kit-02.mp3', hint: 'Loads Free Kit beat 02 inside the player.' },
      { title: 'Free Kit Beat 03', path: 'beats/free-kit-03.mp3', hint: 'Loads Free Kit beat 03 inside the player.' },
      { title: 'Free Kit Beat 04', path: 'beats/free-kit-04.mp3', hint: 'Loads Free Kit beat 04 inside the player.' },
    ],
  },
];

const fmTracks = Array.from({ length: 8 }, (_, index) => ({
  title: `FM Track ${index + 1}`,
  path: `fm/track${index + 1}.mp3`,
}));

const views = {
  menu: document.getElementById('screenMenu'),
  beats: document.getElementById('screenBeats'),
  signup: document.getElementById('screenSignup'),
};

const monitorShell = document.getElementById('monitorShell');
const monitorScreen = document.getElementById('monitorScreen');
const cursorGlow = document.getElementById('cursorGlow');

const kitList = document.getElementById('kitList');
const beatsList = document.getElementById('beatsList');
const kitButtonTemplate = document.getElementById('kitButtonTemplate');
const beatButtonTemplate = document.getElementById('beatButtonTemplate');

const beatsKicker = document.getElementById('beatsKicker');
const beatsTitle = document.getElementById('beatsTitle');
const beatsDescription = document.getElementById('beatsDescription');
const beatNowPlaying = document.getElementById('beatNowPlaying');
const pathDisplay = document.getElementById('pathDisplay');
const currentBeatHint = document.getElementById('currentBeatHint');
const beatTimeCurrent = document.getElementById('beatTimeCurrent');
const beatTimeDuration = document.getElementById('beatTimeDuration');
const beatProgressBar = document.getElementById('beatProgressBar');
const beatSpectrum = document.getElementById('beatSpectrum');

const menuToggle = document.getElementById('menuToggle');
const prevBtn = document.getElementById('prevBtn');
const playBtn = document.getElementById('playBtn');
const nextBtn = document.getElementById('nextBtn');
const backToMenu = document.getElementById('backToMenu');
const baseButton = document.getElementById('baseButton');
const beatPrevBtn = document.getElementById('beatPrevBtn');
const beatPlayBtn = document.getElementById('beatPlayBtn');
const beatNextBtn = document.getElementById('beatNextBtn');
const beatInfoBtn = document.getElementById('beatInfoBtn');
const beatBuyBtn = document.getElementById('beatBuyBtn');
const beatMenuBtn = document.getElementById('beatMenuBtn');

const trackIndicator = document.getElementById('trackIndicator');
const activePackName = document.getElementById('activePackName');
const fmTrackTitle = document.getElementById('fmTrackTitle');
const fmState = document.getElementById('fmState');

const beatAudio = document.getElementById('beatAudio');
const fmAudio = document.getElementById('fmAudio');
const backgroundVideo = document.getElementById('backgroundVideo');
const siteBoot = document.getElementById('siteBoot');
fmAudio.volume = 0.9;

let activeScreen = 'menu';
let activeKitIndex = 0;
let activeBeatIndex = 0;
let activeFmIndex = 0;
let previewBeatIndex = 0;
let beatButtons = [];
let kitButtons = [];

let audioContext;
let analyser;
let analyserData;
let beatSourceNode;
let spectrumFrame;

function setupSpectrum() {
  if (!beatSpectrum) return;

  beatSpectrum.innerHTML = '';
  for (let index = 0; index < 18; index += 1) {
    const bar = document.createElement('span');
    beatSpectrum.appendChild(bar);
  }
}

function connectBeatAudioAnalyzer() {
  if (beatSourceNode || !window.AudioContext) return;

  audioContext = new window.AudioContext();
  analyser = audioContext.createAnalyser();
  analyser.fftSize = 64;
  analyserData = new Uint8Array(analyser.frequencyBinCount);
  beatSourceNode = audioContext.createMediaElementSource(beatAudio);
  beatSourceNode.connect(analyser);
  analyser.connect(audioContext.destination);
}

function updateSpectrum() {
  if (!analyser || !beatSpectrum) return;

  analyser.getByteFrequencyData(analyserData);
  const bars = beatSpectrum.children;
  for (let index = 0; index < bars.length; index += 1) {
    const value = analyserData[index % analyserData.length] || 0;
    const scaled = Math.max(10, Math.round((value / 255) * 56));
    bars[index].style.height = `${scaled}px`;
  }

  spectrumFrame = requestAnimationFrame(updateSpectrum);
}

function startSpectrum() {
  if (!beatSpectrum) return;
  connectBeatAudioAnalyzer();
  if (audioContext && audioContext.state === 'suspended') {
    audioContext.resume();
  }
  cancelAnimationFrame(spectrumFrame);
  document.body.classList.add('beat-active');
  updateSpectrum();
}

function stopSpectrum() {
  cancelAnimationFrame(spectrumFrame);
  document.body.classList.remove('beat-active');
  if (!beatSpectrum) return;
  Array.from(beatSpectrum.children).forEach((bar, index) => {
    bar.style.height = `${10 + (index % 4) * 4}px`;
  });
}



function playBootAnimation() {
  document.body.classList.add('is-booting');
  window.setTimeout(() => {
    document.body.classList.remove('is-booting');
    if (siteBoot) {
      siteBoot.style.opacity = '0';
    }
  }, 1400);
}

function setupBackgroundVideo() {
  if (!backgroundVideo) return;

  const markPlaying = () => document.body.classList.add('video-on');
  const markFallback = () => document.body.classList.remove('video-on');

  backgroundVideo.muted = true;
  backgroundVideo.defaultMuted = true;
  backgroundVideo.setAttribute('src', 'video.mp4');
  backgroundVideo.play().then(markPlaying).catch(markFallback);
  backgroundVideo.addEventListener('playing', markPlaying);
  backgroundVideo.addEventListener('error', markFallback);
}

function formatTime(value) {
  if (!Number.isFinite(value)) return '0:00';
  const minutes = Math.floor(value / 60);
  const seconds = Math.floor(value % 60);
  return `${minutes}:${String(seconds).padStart(2, '0')}`;
}

function showScreen(name) {
  activeScreen = name;
  Object.entries(views).forEach(([key, element]) => {
    element.classList.toggle('view--active', key === name);
  });
}

function getActiveKit() {
  return kits[activeKitIndex];
}

function getActiveBeat() {
  return getActiveKit().beats[activeBeatIndex];
}

function getPreviewBeat() {
  return getActiveKit().beats[previewBeatIndex];
}

function syncKitSelection() {
  kitButtons.forEach((button, index) => {
    button.classList.toggle('is-selected', index === activeKitIndex);
  });
}

function syncBeatSelection() {
  beatButtons.forEach((button, index) => {
    button.classList.toggle('is-selected', index === activeBeatIndex);
  });
}

function renderKits() {
  kitList.innerHTML = '';
  kitButtons = [];

  kits.forEach((kit, index) => {
    const button = kitButtonTemplate.content.firstElementChild.cloneNode(true);
    button.querySelector('.kit-button__title').textContent = kit.name;

    button.addEventListener('mouseenter', () => {
      activePackName.textContent = kit.name;
    });

    button.addEventListener('focus', () => {
      activePackName.textContent = kit.name;
    });

    button.addEventListener('click', () => {
      activeKitIndex = index;
      activeBeatIndex = 0;
      previewBeatIndex = 0;
      renderBeats();
      loadBeat(0, false);
      syncKitSelection();
      showScreen('beats');
    });

    kitButtons.push(button);
    kitList.appendChild(button);
  });

  syncKitSelection();
}

function renderBeats() {
  const kit = getActiveKit();
  beatsList.innerHTML = '';
  beatButtons = [];
  beatsKicker.textContent = `${kit.name} Menu`;
  beatsTitle.textContent = `${kit.name} Beats`;
  beatsDescription.textContent = kit.beatsDescription;
  beatBuyBtn.textContent = kit.buyLabel;
  activePackName.textContent = kit.name;

  kit.beats.forEach((beat, index) => {
    const button = beatButtonTemplate.content.firstElementChild.cloneNode(true);
    button.querySelector('.beat-button__title').textContent = beat.title;
    button.querySelector('.beat-button__path').textContent = beat.path;

    button.addEventListener('mouseenter', () => {
      previewBeatIndex = index;
      pathDisplay.textContent = beat.path;
      currentBeatHint.textContent = beat.hint;
    });

    button.addEventListener('focus', () => {
      previewBeatIndex = index;
      pathDisplay.textContent = beat.path;
      currentBeatHint.textContent = beat.hint;
    });

    button.addEventListener('click', () => {
      loadBeat(index, true);
    });

    beatButtons.push(button);
    beatsList.appendChild(button);
  });

  syncBeatSelection();
}

function updateBeatInfo() {
  const beat = getActiveBeat();
  beatNowPlaying.textContent = beat.title;
  pathDisplay.textContent = beat.path;
  currentBeatHint.textContent = beat.hint;
  syncBeatSelection();
}

function loadBeat(index, autoplay = false) {
  activeBeatIndex = index;
  previewBeatIndex = index;
  const beat = getActiveBeat();

  if (beatAudio.src !== new URL(beat.path, window.location.href).href) {
    beatAudio.src = beat.path;
    beatAudio.load();
  }

  updateBeatInfo();

  if (autoplay) {
    beatAudio.play().then(() => {
      beatPlayBtn.textContent = 'Pause Beat';
    }).catch(() => {
      beatPlayBtn.textContent = 'Play Beat';
    });
  }
}

function loadFmTrack(index, autoplay = false) {
  activeFmIndex = (index + fmTracks.length) % fmTracks.length;
  const track = fmTracks[activeFmIndex];

  if (fmAudio.src !== new URL(track.path, window.location.href).href) {
    fmAudio.src = track.path;
    fmAudio.load();
  }

  fmTrackTitle.textContent = track.title;
  trackIndicator.textContent = `• ${track.title}`;

  if (autoplay) {
    fmState.textContent = 'Loading';
    fmAudio.play().then(() => {
      playBtn.textContent = '❚❚';
      fmState.textContent = 'Playing';
    }).catch(() => {
      playBtn.textContent = '▷';
      fmState.textContent = 'Tap Play';
    });
  }
}

function toggleBeatPlayback() {
  if (previewBeatIndex !== activeBeatIndex) {
    loadBeat(previewBeatIndex, true);
    return;
  }

  if (!beatAudio.src) {
    loadBeat(activeBeatIndex, true);
    return;
  }

  if (beatAudio.paused) {
    beatAudio.play().then(() => {
      beatPlayBtn.textContent = 'Pause Beat';
    }).catch(() => {
      beatPlayBtn.textContent = 'Play Beat';
    });
  } else {
    beatAudio.pause();
  }
}

function toggleFmPlayback() {
  if (!fmAudio.src) {
    loadFmTrack(activeFmIndex, true);
    return;
  }

  if (fmAudio.paused) {
    fmAudio.play().then(() => {
      playBtn.textContent = '❚❚';
      fmState.textContent = 'Playing';
    }).catch(() => {
      playBtn.textContent = '▷';
      fmState.textContent = 'Idle';
    });
  } else {
    fmAudio.pause();
  }
}

menuToggle.addEventListener('click', () => {
  showScreen('menu');
});

backToMenu.addEventListener('click', () => {
  showScreen('menu');
});

baseButton.addEventListener('click', () => {
  showScreen('signup');
});

beatInfoBtn.addEventListener('click', () => {
  const kit = getActiveKit();
  const beat = getPreviewBeat();
  beatsDescription.textContent = `${kit.beatsDescription} ${beat.hint}`;
});

beatBuyBtn.addEventListener('click', () => {
  showScreen('signup');
});

beatMenuBtn.addEventListener('click', () => {
  showScreen('menu');
});

prevBtn.addEventListener('click', () => {
  loadFmTrack(activeFmIndex - 1, true);
});

playBtn.addEventListener('click', () => {
  toggleFmPlayback();
});

nextBtn.addEventListener('click', () => {
  loadFmTrack(activeFmIndex + 1, true);
});

beatPrevBtn.addEventListener('click', () => {
  const count = getActiveKit().beats.length;
  loadBeat((activeBeatIndex - 1 + count) % count, true);
});

beatPlayBtn.addEventListener('click', () => {
  toggleBeatPlayback();
});

beatNextBtn.addEventListener('click', () => {
  const count = getActiveKit().beats.length;
  loadBeat((activeBeatIndex + 1) % count, true);
});

beatAudio.addEventListener('play', () => {
  beatPlayBtn.textContent = 'Pause Beat';
  monitorShell.classList.add('is-playing');
  startSpectrum();
});

beatAudio.addEventListener('pause', () => {
  beatPlayBtn.textContent = 'Play Beat';
  monitorShell.classList.remove('is-playing');
  stopSpectrum();
});

beatAudio.addEventListener('timeupdate', () => {
  const duration = beatAudio.duration || 0;
  const current = beatAudio.currentTime || 0;
  const progress = duration ? (current / duration) * 100 : 0;
  beatProgressBar.style.width = `${progress}%`;
  beatTimeCurrent.textContent = formatTime(current);
  beatTimeDuration.textContent = formatTime(duration);
});

beatAudio.addEventListener('loadedmetadata', () => {
  beatTimeDuration.textContent = formatTime(beatAudio.duration);
});

beatAudio.addEventListener('ended', () => {
  const count = getActiveKit().beats.length;
  loadBeat((activeBeatIndex + 1) % count, true);
});

fmAudio.addEventListener('play', () => {
  playBtn.textContent = '❚❚';
  fmState.textContent = 'Playing';
  document.body.classList.add('fm-active');
});

fmAudio.addEventListener('pause', () => {
  playBtn.textContent = '▷';
  fmState.textContent = 'Paused';
  document.body.classList.remove('fm-active');
});

fmAudio.addEventListener('loadeddata', () => {
  if (fmAudio.paused) {
    fmState.textContent = 'Ready';
  }
});

fmAudio.addEventListener('error', () => {
  fmState.textContent = 'Missing FM file';
  playBtn.textContent = '▷';
  document.body.classList.remove('fm-active');
});

fmAudio.addEventListener('ended', () => {
  loadFmTrack(activeFmIndex + 1, true);
});

monitorScreen.addEventListener('mousemove', (event) => {
  const rect = monitorScreen.getBoundingClientRect();
  const x = (event.clientX - rect.left) / rect.width;
  const y = (event.clientY - rect.top) / rect.height;
  const rotateY = (x - 0.5) * 8;
  const rotateX = (0.5 - y) * 8;

  monitorShell.style.setProperty('--tilt-x', `${rotateX}deg`);
  monitorShell.style.setProperty('--tilt-y', `${rotateY}deg`);
  cursorGlow.style.setProperty('--cursor-x', `${x * 100}%`);
  cursorGlow.style.setProperty('--cursor-y', `${y * 100}%`);
});

monitorScreen.addEventListener('mouseleave', () => {
  monitorShell.style.setProperty('--tilt-x', '0deg');
  monitorShell.style.setProperty('--tilt-y', '0deg');
  cursorGlow.style.setProperty('--cursor-x', '50%');
  cursorGlow.style.setProperty('--cursor-y', '50%');
});

setupSpectrum();
playBootAnimation();
renderKits();
renderBeats();
loadBeat(0, false);
setupBackgroundVideo();
loadFmTrack(0, false);
showScreen(activeScreen);
