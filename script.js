// Main JavaScript for Engagement Invitation (Alok & Akanksha)

document.addEventListener('DOMContentLoaded', () => {
  setupGateCover();
  setupRSVPModal();
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



/* 3. RSVP Modal Popup and Form Processing */
function setupRSVPModal() {
  const openBtn = document.getElementById('rsvp-open-btn');
  const modal = document.getElementById('rsvp-modal');
  const closeBtn = document.getElementById('rsvp-close-btn');
  const form = document.getElementById('rsvp-form');
  const formState = document.getElementById('rsvp-form-state');
  const successState = document.getElementById('rsvp-success-state');
  const successMsg = document.getElementById('success-message');
  const radioLabels = document.querySelectorAll('.form-radio-label');

  // Radio selection visual toggle
  const radios = document.querySelectorAll('input[name="attendance"]');
  radios.forEach(radio => {
    radio.addEventListener('change', () => {
      radioLabels.forEach(label => {
        const input = label.querySelector('input');
        if (input.checked) {
          label.classList.add('checked');
        } else {
          label.classList.remove('checked');
        }
      });
    });
  });

  // Open modal
  openBtn.addEventListener('click', () => {
    modal.classList.add('active');
  });

  // Close modal on close button click
  closeBtn.addEventListener('click', closeModal);

  // Close modal on clicking outside the container
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });

  function closeModal() {
    modal.classList.remove('active');
    // Reset state after transition finishes (0.5s)
    setTimeout(() => {
      formState.style.display = 'block';
      successState.style.display = 'none';
      form.reset();
      radioLabels.forEach(label => label.classList.remove('checked'));
    }, 500);
  }

  // Handle Form Submit
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('guest-name').value;
    const attendance = document.querySelector('input[name="attendance"]:checked').value;
    const dietary = document.getElementById('food-diet').value;

    // Simulate saving response (can print/save locally)
    console.log('RSVP Received:', { name, attendance, dietary });

    // Store RSVP details locally
    const rsvps = JSON.parse(localStorage.getItem('rsvp_invites') || '[]');
    rsvps.push({ name, attendance, dietary, date: new Date().toISOString() });
    localStorage.setItem('rsvp_invites', JSON.stringify(rsvps));

    // Customize success response text
    let displayMsg = 'We look forward to seeing you!';
    if (attendance === 'no') {
      displayMsg = 'We will miss you! Thank you for letting us know.';
    } else if (attendance === 'later') {
      displayMsg = "Thank you! We'll stay in touch.";
    }

    successMsg.textContent = `${displayMsg}`;

    // Transition form to success screen
    formState.style.display = 'none';
    successState.style.display = 'block';
  });
}
