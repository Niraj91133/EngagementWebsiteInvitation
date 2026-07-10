// Main JavaScript for Engagement Invitation (Alok & Akanksha)

document.addEventListener('DOMContentLoaded', () => {
  setupGateCover();
});

/* 1. Gate-Fold Cover & Music System */
function setupGateCover() {
  const cover = document.getElementById('cover');
  const openBtn = document.getElementById('open-btn');
  const mainContent = document.getElementById('main-content');
  const bgMusic = document.getElementById('bg-music');
  const musicBtn = document.getElementById('music-btn');

  // Open the gate cover on seal click
  openBtn.addEventListener('click', () => {
    // 1. Play Background Music
    playMusic();

    // 2. Add animation class to split covers
    cover.classList.add('open');

    // 3. Remove cover completely after slide transitions finish (1.8s)
    setTimeout(() => {
      cover.classList.add('hidden');
      musicBtn.style.display = 'flex'; // Show floating music control
    }, 1800);
  });

  // Music toggle control
  musicBtn.addEventListener('click', () => {
    if (bgMusic.paused) {
      playMusic();
    } else {
      pauseMusic();
    }
  });

  function playMusic() {
    bgMusic.play().then(() => {
      musicBtn.classList.add('playing');
    }).catch(err => {
      console.log('Audio autoplay prevented: User must interact first.', err);
    });
  }

  function pauseMusic() {
    bgMusic.pause();
    musicBtn.classList.remove('playing');
  }
}




