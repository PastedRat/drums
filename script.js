const kits = [
  {
    name: 'Night Vision',
    track: '#1',
    beatsDescription: 'Dark melodies and moody bounce inside the TV player.',
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

const menuToggle = document.getElementById('menuToggle');
const prevBtn = document.getElementById('prevBtn');
const playBtn = document.getElementById('playBtn');
const nextBtn = document.getElementById('nextBtn');
const backToMenu = document.getElementById('backToMenu');
const baseButton = document.getElementById('baseButton');
const beatPrevBtn = document.getElementById('beatPrevBtn');
const beatPlayBtn = document.getElementById('beatPlayBtn');
const beatNextBtn = document.getElementById('beatNextBtn');

const trackIndicator = document.getElementById('trackIndicator');
const activePackName = document.getElementById('activePackName');
const fmTrackTitle = document.getElementById('fmTrackTitle');
const fmState = document.getElementById('fmState');

const beatAudio = document.getElementById('beatAudio');
const fmAudio = document.getElementById('fmAudio');
const ambientAudio = document.getElementById('ambientAudio');
fmAudio.volume = 0.9;

let activeScreen = 'menu';
let activeKitIndex = 0;
let activeBeatIndex = 0;
let activeFmIndex = 0;
let beatButtons = [];
let kitButtons = [];


function setupAmbientTrack() {
  ambientAudio.src = 'video.mp3';
  ambientAudio.volume = 0.28;

  const tryPlayAmbient = () => {
    ambientAudio.play().then(() => {
      document.body.classList.add('ambient-on');
    }).catch(() => {
      document.body.classList.remove('ambient-on');
    });
  };

  tryPlayAmbient();

  ['click', 'keydown', 'touchstart'].forEach((eventName) => {
    window.addEventListener(eventName, tryPlayAmbient, { once: true });
  });
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
  activePackName.textContent = kit.name;

  kit.beats.forEach((beat, index) => {
    const button = beatButtonTemplate.content.firstElementChild.cloneNode(true);
    button.querySelector('.beat-button__title').textContent = beat.title;
    button.querySelector('.beat-button__path').textContent = beat.path;

    button.addEventListener('mouseenter', () => {
      pathDisplay.textContent = beat.path;
      currentBeatHint.textContent = beat.hint;
    });

    button.addEventListener('focus', () => {
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
});

beatAudio.addEventListener('pause', () => {
  beatPlayBtn.textContent = 'Play Beat';
  monitorShell.classList.remove('is-playing');
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

renderKits();
renderBeats();
loadBeat(0, false);
setupAmbientTrack();
loadFmTrack(0, false);
showScreen(activeScreen);
