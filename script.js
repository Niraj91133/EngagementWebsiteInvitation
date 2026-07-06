// Main JavaScript for Engagement Invitation (Alok & Akanksha)

document.addEventListener('DOMContentLoaded', () => {
  setupGateCover();
  setupScratchCards();
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

/* 2. Date Reveal Scratch Card System */
function setupScratchCards() {
  const cards = [
    { id: 'canvas-day', label: '14' },
    { id: 'canvas-month', label: 'July' },
    { id: 'canvas-year', label: '2026' }
  ];

  let revealedCount = 0;
  const totalCards = cards.length;
  const ceremonyText = document.getElementById('ceremony-text');

  cards.forEach(card => {
    const canvas = document.getElementById(card.id);
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let isDrawing = false;
    let isRevealed = false;

    // Resize canvas based on client display to prevent pixelation
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;

    // Draw the scratch overlay (Champagne gold gradient with glitter dots)
    function drawOverlay() {
      // 1. Warm Gold Linear Gradient
      const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      grad.addColorStop(0, '#EAD5C3');
      grad.addColorStop(0.5, '#FAF1DB');
      grad.addColorStop(1, '#C5A880');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // 2. Add fine textures (glitter effect)
      ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
      for (let i = 0; i < 60; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        const r = Math.random() * 1.5;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();
      }

      // 3. Add soft gold dots
      ctx.fillStyle = 'rgba(197, 168, 128, 0.3)';
      for (let i = 0; i < 40; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        const r = Math.random() * 2;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();
      }

      // 4. Draw helper text "Scratch"
      ctx.fillStyle = '#7E919C'; // Soft contrast slate-blue
      ctx.font = '500 12px Montserrat, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('SCRATCH', canvas.width / 2, canvas.height / 2);
    }

    drawOverlay();

    // Event Listeners for scratching
    function startDrawing(e) {
      if (isRevealed) return;
      isDrawing = true;
      scratch(e);
    }

    function stopDrawing() {
      if (!isDrawing) return;
      isDrawing = false;
      checkScratchPercentage();
    }

    function scratch(e) {
      if (!isDrawing || isRevealed) return;

      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      const rect = canvas.getBoundingClientRect();
      const x = clientX - rect.left;
      const y = clientY - rect.top;

      // Use destination-out to erase the cover layer
      ctx.globalCompositeOperation = 'destination-out';
      ctx.beginPath();
      ctx.arc(x, y, 16, 0, Math.PI * 2); // Scratch brush radius
      ctx.fill();
    }

    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', scratch);
    window.addEventListener('mouseup', stopDrawing);

    canvas.addEventListener('touchstart', startDrawing, { passive: true });
    canvas.addEventListener('touchmove', scratch, { passive: true });
    window.addEventListener('touchend', stopDrawing);

    // Calculate percentage scratched to automatically trigger fully revealed state
    function checkScratchPercentage() {
      if (isRevealed) return;

      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imgData.data;
      let transparentPixels = 0;

      // Check alpha values (data is in [r, g, b, a] layout)
      for (let i = 3; i < data.length; i += 4) {
        if (data[i] === 0) {
          transparentPixels++;
        }
      }

      const percentage = (transparentPixels / (canvas.width * canvas.height)) * 100;

      // If scratched area > 45%, auto-reveal the whole card
      if (percentage > 45) {
        revealCard();
      }
    }

    function revealCard() {
      isRevealed = true;
      canvas.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
      canvas.style.opacity = '0';
      canvas.style.transform = 'scale(0.8)';
      
      // Fully clear the canvas so there's no hover blocks
      setTimeout(() => {
        canvas.style.display = 'none';
      }, 800);

      revealedCount++;
      if (revealedCount === totalCards) {
        triggerSuccessReveal();
      }
    }
  });

  // Confetti explosion and celebration state
  function triggerSuccessReveal() {
    // 1. Show underlying details card
    ceremonyText.classList.add('visible');

    // 2. Play flash overlay effect
    const flash = document.getElementById('tdr-flash');
    flash.classList.add('active');
    setTimeout(() => {
      flash.classList.remove('active');
    }, 800);

    // 3. Trigger premium gold and white confetti
    const duration = 2.5 * 1000;
    const end = Date.now() + duration;

    (function frame() {
      confetti({
        particleCount: 4,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.8 },
        colors: ['#C5A880', '#FAF1DB', '#AFCFF1', '#7EBBFA']
      });
      confetti({
        particleCount: 4,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.8 },
        colors: ['#C5A880', '#FAF1DB', '#AFCFF1', '#7EBBFA']
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    }());
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
