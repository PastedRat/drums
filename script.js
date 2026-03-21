const toggle = document.getElementById('playToggle');

if (toggle) {
  let playing = false;

  toggle.addEventListener('click', () => {
    playing = !playing;
    toggle.textContent = playing ? 'Pause preview' : 'Play preview';
    document.body.classList.toggle('is-playing', playing);
  });
}
