const kits = [
  {
    name: 'Night Vision',
    track: '#1',
    beats: [
      { label: 'Night Vision Beat 01', href: 'beats/night-vision-01.mp3' },
      { label: 'Night Vision Beat 02', href: 'beats/night-vision-02.mp3' },
      { label: 'Night Vision Beat 03', href: 'beats/night-vision-03.mp3' },
    ],
  },
  {
    name: 'MetalSlugX',
    track: '#2',
    beats: [
      { label: 'MetalSlugX Beat 01', href: 'beats/metalslugx-01.mp3' },
      { label: 'MetalSlugX Beat 02', href: 'beats/metalslugx-02.mp3' },
      { label: 'MetalSlugX Beat 03', href: 'beats/metalslugx-03.mp3' },
    ],
  },
  {
    name: 'Armored Core',
    track: '#3',
    beats: [
      { label: 'Armored Core Beat 01', href: 'beats/armored-core-01.mp3' },
      { label: 'Armored Core Beat 02', href: 'beats/armored-core-02.mp3' },
      { label: 'Armored Core Beat 03', href: 'beats/armored-core-03.mp3' },
    ],
  },
  {
    name: 'Free Kits',
    track: '#4',
    beats: [
      { label: 'Free Kit Beat 01', href: 'beats/free-kit-01.mp3' },
      { label: 'Free Kit Beat 02', href: 'beats/free-kit-02.mp3' },
      { label: 'Free Kit Beat 03', href: 'beats/free-kit-03.mp3' },
    ],
  },
];

const screens = {
  menu: document.getElementById('screenMenu'),
  beats: document.getElementById('screenBeats'),
  signup: document.getElementById('screenSignup'),
};

const kitList = document.getElementById('kitList');
const beatsList = document.getElementById('beatsList');
const beatsLabel = document.getElementById('beatsLabel');
const trackIndicator = document.getElementById('trackIndicator');
const menuToggle = document.getElementById('menuToggle');
const baseButton = document.getElementById('baseButton');
const backToMenu = document.getElementById('backToMenu');
const playBtn = document.getElementById('playBtn');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const kitButtonTemplate = document.getElementById('kitButtonTemplate');
const beatButtonTemplate = document.getElementById('beatButtonTemplate');

let activeKitIndex = 0;

function showScreen(name) {
  Object.entries(screens).forEach(([screenName, element]) => {
    element.classList.toggle('active', screenName === name);
  });
}

function updateTrackLabel(text) {
  trackIndicator.textContent = `• Track ${text}`;
}

function renderKits() {
  kitList.innerHTML = '';

  kits.forEach((kit, index) => {
    const button = kitButtonTemplate.content.firstElementChild.cloneNode(true);
    button.textContent = kit.name;
    button.addEventListener('click', () => {
      activeKitIndex = index;
      renderBeats();
      updateTrackLabel(kit.track);
      showScreen('beats');
    });
    kitList.appendChild(button);
  });
}

function renderBeats() {
  const kit = kits[activeKitIndex];
  beatsList.innerHTML = '';
  beatsLabel.textContent = `${kit.name} Beats`;

  kit.beats.forEach((beat) => {
    const link = beatButtonTemplate.content.firstElementChild.cloneNode(true);
    link.textContent = beat.label;
    link.href = beat.href;
    beatsList.appendChild(link);
  });
}

menuToggle.addEventListener('click', () => {
  showScreen('menu');
  updateTrackLabel(kits[activeKitIndex].track);
});

baseButton.addEventListener('click', () => {
  showScreen('signup');
  updateTrackLabel('#1');
});

backToMenu.addEventListener('click', () => {
  showScreen('menu');
  updateTrackLabel(kits[activeKitIndex].track);
});

playBtn.addEventListener('click', () => {
  renderBeats();
  showScreen('beats');
  updateTrackLabel(kits[activeKitIndex].track);
});

prevBtn.addEventListener('click', () => {
  activeKitIndex = (activeKitIndex - 1 + kits.length) % kits.length;
  renderBeats();
  showScreen('beats');
  updateTrackLabel(kits[activeKitIndex].track);
});

nextBtn.addEventListener('click', () => {
  activeKitIndex = (activeKitIndex + 1) % kits.length;
  renderBeats();
  showScreen('beats');
  updateTrackLabel(kits[activeKitIndex].track);
});

renderKits();
renderBeats();
updateTrackLabel(kits[0].track);
showScreen('menu');
