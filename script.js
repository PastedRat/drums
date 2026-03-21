const kits = [
  {
    id: 'night-vision',
    name: 'Night Vision',
    track: '#1',
    theme: 'Noir synth haze',
    tempo: '142 BPM',
    mood: 'Cold / cinematic',
    signal: 94,
    description: 'Shadowy melodies, dark atmosphere, and wide-space drum textures for moody late-night sessions.',
    beatsDescription: 'A dark submenu of drifting melodies, metallic drums, and moonlit trap textures.',
    beats: [
      { title: 'Night Vision Beat 01', path: 'beats/night-vision-01.mp3', hint: 'Opens the first Night Vision beat file.' },
      { title: 'Night Vision Beat 02', path: 'beats/night-vision-02.mp3', hint: 'Opens the second Night Vision beat file.' },
      { title: 'Night Vision Beat 03', path: 'beats/night-vision-03.mp3', hint: 'Opens the third Night Vision beat file.' },
      { title: 'Night Vision Beat 04', path: 'beats/night-vision-04.mp3', hint: 'Reserve slot for another dark beat.' },
    ],
  },
  {
    id: 'metalslugx',
    name: 'MetalSlugX',
    track: '#2',
    theme: 'Industrial arcade rush',
    tempo: '155 BPM',
    mood: 'Aggressive / sharp',
    signal: 88,
    description: 'Industrial percussion, hard transients, and metallic movement built for futuristic bounce.',
    beatsDescription: 'A harder submenu with machine-like grooves and aggressive percussive attacks.',
    beats: [
      { title: 'MetalSlugX Beat 01', path: 'beats/metalslugx-01.mp3', hint: 'Direct file link for MetalSlugX beat one.' },
      { title: 'MetalSlugX Beat 02', path: 'beats/metalslugx-02.mp3', hint: 'Direct file link for MetalSlugX beat two.' },
      { title: 'MetalSlugX Beat 03', path: 'beats/metalslugx-03.mp3', hint: 'Direct file link for MetalSlugX beat three.' },
      { title: 'MetalSlugX Beat 04', path: 'beats/metalslugx-04.mp3', hint: 'Placeholder path for an additional beat.' },
    ],
  },
  {
    id: 'armored-core',
    name: 'Armored Core',
    track: '#3',
    theme: 'Mech pressure zone',
    tempo: '148 BPM',
    mood: 'Heavy / colossal',
    signal: 91,
    description: 'Massive low end, armored textures, and battle-ready rhythm sections with mechanical grit.',
    beatsDescription: 'A heavy submenu loaded with huge hits, robotic accents, and armored energy.',
    beats: [
      { title: 'Armored Core Beat 01', path: 'beats/armored-core-01.mp3', hint: 'Direct file link for Armored Core beat one.' },
      { title: 'Armored Core Beat 02', path: 'beats/armored-core-02.mp3', hint: 'Direct file link for Armored Core beat two.' },
      { title: 'Armored Core Beat 03', path: 'beats/armored-core-03.mp3', hint: 'Direct file link for Armored Core beat three.' },
      { title: 'Armored Core Beat 04', path: 'beats/armored-core-04.mp3', hint: 'Placeholder path for an extra battle theme.' },
    ],
  },
  {
    id: 'free-kits',
    name: 'Free Kits',
    track: '#4',
    theme: 'Starter loot cache',
    tempo: '130 BPM',
    mood: 'Open / ready',
    signal: 97,
    description: 'A free-entry station for starter packs, easier loops, and quick-access sounds.',
    beatsDescription: 'A utility submenu with free beat links and starter-ready paths in the repo.',
    beats: [
      { title: 'Free Kit Beat 01', path: 'beats/free-kit-01.mp3', hint: 'Direct file link for free beat one.' },
      { title: 'Free Kit Beat 02', path: 'beats/free-kit-02.mp3', hint: 'Direct file link for free beat two.' },
      { title: 'Free Kit Beat 03', path: 'beats/free-kit-03.mp3', hint: 'Direct file link for free beat three.' },
      { title: 'Free Kit Beat 04', path: 'beats/free-kit-04.mp3', hint: 'Placeholder path for another free beat.' },
    ],
  },
];

const views = {
  menu: document.getElementById('screenMenu'),
  beats: document.getElementById('screenBeats'),
  signup: document.getElementById('screenSignup'),
  lore: document.getElementById('screenLore'),
};

const kitList = document.getElementById('kitList');
const beatsList = document.getElementById('beatsList');
const kitButtonTemplate = document.getElementById('kitButtonTemplate');
const beatButtonTemplate = document.getElementById('beatButtonTemplate');

const previewTitle = document.getElementById('previewTitle');
const previewDescription = document.getElementById('previewDescription');
const previewTheme = document.getElementById('previewTheme');
const previewTempo = document.getElementById('previewTempo');
const previewMood = document.getElementById('previewMood');

const beatsKicker = document.getElementById('beatsKicker');
const beatsTitle = document.getElementById('beatsTitle');
const beatsDescription = document.getElementById('beatsDescription');
const pathDisplay = document.getElementById('pathDisplay');

const trackIndicator = document.getElementById('trackIndicator');
const signalPercent = document.getElementById('signalPercent');
const signalBar = document.getElementById('signalBar');
const activePackName = document.getElementById('activePackName');
const beatCount = document.getElementById('beatCount');
const screenName = document.getElementById('screenName');
const currentBeatTitle = document.getElementById('currentBeatTitle');
const currentBeatHint = document.getElementById('currentBeatHint');
const beatBadge = document.getElementById('beatBadge');

const menuToggle = document.getElementById('menuToggle');
const prevBtn = document.getElementById('prevBtn');
const playBtn = document.getElementById('playBtn');
const nextBtn = document.getElementById('nextBtn');
const backToMenu = document.getElementById('backToMenu');
const baseButton = document.getElementById('baseButton');
const showLore = document.getElementById('showLore');
const showMenuBottom = document.getElementById('showMenuBottom');
const showBeatsBottom = document.getElementById('showBeatsBottom');
const openSignupFromBeats = document.getElementById('openSignupFromBeats');

let activeKitIndex = 0;
let activeScreen = 'menu';

function setScreen(screenKey) {
  activeScreen = screenKey;

  Object.entries(views).forEach(([key, element]) => {
    element.classList.toggle('screen-view--active', key === screenKey);
  });

  const labels = {
    menu: 'Menu',
    beats: 'Beats',
    signup: 'Stash Kit',
    lore: 'Lore',
  };

  screenName.textContent = labels[screenKey] || screenKey;
}

function setTrackLabel(track) {
  trackIndicator.textContent = `• Track ${track}`;
}

function updateSidebarMetrics(kit) {
  signalPercent.textContent = `${kit.signal}%`;
  signalBar.style.width = `${kit.signal}%`;
  activePackName.textContent = kit.name;
  beatCount.textContent = String(kit.beats.length).padStart(2, '0');
}

function updatePreviewPanel(kit) {
  previewTitle.textContent = kit.name;
  previewDescription.textContent = kit.description;
  previewTheme.textContent = kit.theme;
  previewTempo.textContent = kit.tempo;
  previewMood.textContent = kit.mood;
  currentBeatTitle.textContent = kit.beats[0].title;
  currentBeatHint.textContent = kit.beats[0].hint;
  beatBadge.textContent = '01';
}

function renderKitButtons() {
  kitList.innerHTML = '';

  kits.forEach((kit, index) => {
    const button = kitButtonTemplate.content.firstElementChild.cloneNode(true);
    const title = button.querySelector('.menu-option__title');
    const meta = button.querySelector('.menu-option__meta');

    title.textContent = kit.name;
    meta.textContent = `${kit.theme} // ${kit.tempo} // ${kit.track}`;

    if (index === activeKitIndex) {
      button.classList.add('is-selected');
    }

    button.addEventListener('mouseenter', () => {
      updatePreviewPanel(kit);
      updateSidebarMetrics(kit);
      setTrackLabel(kit.track);
    });

    button.addEventListener('focus', () => {
      updatePreviewPanel(kit);
      updateSidebarMetrics(kit);
      setTrackLabel(kit.track);
    });

    button.addEventListener('click', () => {
      activeKitIndex = index;
      renderKitButtons();
      renderBeatButtons();
      updatePreviewPanel(kit);
      updateSidebarMetrics(kit);
      setTrackLabel(kit.track);
      setScreen('beats');
    });

    kitList.appendChild(button);
  });
}

function renderBeatButtons() {
  const kit = kits[activeKitIndex];
  beatsList.innerHTML = '';
  beatsKicker.textContent = `${kit.name} menu`;
  beatsTitle.textContent = `${kit.name} Beats`;
  beatsDescription.innerHTML = `${kit.beatsDescription} Put the real files into <code>beats/</code> and keep the paths synced in <code>script.js</code>.`;
  pathDisplay.textContent = kit.beats[0].path;
  currentBeatTitle.textContent = kit.beats[0].title;
  currentBeatHint.textContent = kit.beats[0].hint;
  beatBadge.textContent = '01';

  kit.beats.forEach((beat, index) => {
    const link = beatButtonTemplate.content.firstElementChild.cloneNode(true);
    const name = link.querySelector('.beat-option__name');
    const path = link.querySelector('.beat-option__path');

    name.textContent = `${String(index + 1).padStart(2, '0')} // ${beat.title}`;
    path.textContent = beat.path;
    link.href = beat.path;

    link.addEventListener('mouseenter', () => {
      pathDisplay.textContent = beat.path;
      currentBeatTitle.textContent = beat.title;
      currentBeatHint.textContent = beat.hint;
      beatBadge.textContent = String(index + 1).padStart(2, '0');
    });

    link.addEventListener('focus', () => {
      pathDisplay.textContent = beat.path;
      currentBeatTitle.textContent = beat.title;
      currentBeatHint.textContent = beat.hint;
      beatBadge.textContent = String(index + 1).padStart(2, '0');
    });

    beatsList.appendChild(link);
  });
}

function syncAllPanels() {
  const kit = kits[activeKitIndex];
  updatePreviewPanel(kit);
  updateSidebarMetrics(kit);
  setTrackLabel(kit.track);
  renderKitButtons();
  renderBeatButtons();
}

menuToggle.addEventListener('click', () => {
  setScreen('menu');
});

prevBtn.addEventListener('click', () => {
  activeKitIndex = (activeKitIndex - 1 + kits.length) % kits.length;
  syncAllPanels();
  setScreen('beats');
});

playBtn.addEventListener('click', () => {
  syncAllPanels();
  setScreen('beats');
});

nextBtn.addEventListener('click', () => {
  activeKitIndex = (activeKitIndex + 1) % kits.length;
  syncAllPanels();
  setScreen('beats');
});

backToMenu.addEventListener('click', () => {
  setScreen('menu');
});

baseButton.addEventListener('click', () => {
  setScreen('signup');
});

openSignupFromBeats.addEventListener('click', () => {
  setScreen('signup');
});

showLore.addEventListener('click', () => {
  setScreen('lore');
});

showMenuBottom.addEventListener('click', () => {
  setScreen('menu');
});

showBeatsBottom.addEventListener('click', () => {
  setScreen('beats');
});

syncAllPanels();
setScreen(activeScreen);
