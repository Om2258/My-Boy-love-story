const CONFIG = {
  herName: "my princess 🥰",
  yourName: "Om Barve",
  birthdayDate: "2026-08-18T00:00:00",
  unlockPattern: [7, 4, 1, 5, 3, 6, 9],
  lockMessage: "Draw our little love pattern to open your birthday surprise.",
  lockHint: "my whole world 🌎 starts with",
  wishGateTitle: "Blow the candles, my love",
  wishGateMessage:
    "Close your eyes for a second. This cake is for the wish your heart wants most.",
  wishQuestionTitle: "What do you want most in life?",
  wishQuestionText:
    "Make your wish here. I hope life brings it to you beautifully.",
  heroMessage:
    "Today is all about you, your laugh, your heart, and every beautiful little thing that makes you unforgettable.",
  letter: [
    "Happy birthday, my babudiiii❤️ . I wanted to make something that feels like a small n special but walk through the memories💭 that  never fade from  you .",
    "You know Mahiiii❤️ you  make ordinary days feel warmer. You make my soul  feel peaceful. You make happiness feel easy. You are the sweetest soul I ever met in my life.   ",
    "I wish this year brings,every dream being true like bali anad that wishes you have been quietly carrying in your heart🫀 . You know Mahiii❤️ no matter How many chances are given to me, I still want to see you Again and Again you know why , Just bxxecause where you are, Is where I should be always ..", 
    "Thank you for being you. I am so lucky to love you."
  ], 
  wishes: [
    "you know Mahiiii❤️ your smile😊 can change the mood of my whole day that decide that how my will go . ",
    "You care in ways that are rare and beautiful for me that I  can't imagine in anyone .",
    "You make small moments feel like memories .",
    "Your laugh is my favorite sound 😌😌.",
    "You are , soft, funny, and magic all at once.",
    "Life feels better with you ."
  ],
  photos: [
    {
      src: "assets/photos/photo1.jpg",
      caption: "Our beautiful day together"
    },
    {
      src: "assets/photos/photo2.jpg",
      caption: "A blessed memory with you"
    },
    {
      src: "assets/photos/photo3.jpg",
      caption: "My favorite smile"
    },
    {
      src: "assets/photos/photo4.jpg",
      caption: "Your sweetest little beginning"
    },
    {
      src: "assets/photos/photo5.jpg",
      caption: "In your arms, I am home."
    },
    {
      src: "assets/photos/photo6.jpg",
      caption: "Us, choosing each other every day."
    }
  ]
};

const fallbackPhotos = [
  "linear-gradient(135deg, #e84d75, #f4b34a)",
  "linear-gradient(135deg, #325a8a, #8fd6c2)",
  "linear-gradient(135deg, #a92951, #fff1f4)",
  "linear-gradient(135deg, #241e22, #e84d75)",
  "linear-gradient(135deg, #8fd6c2, #f4b34a)",
  "linear-gradient(135deg, #75676f, #325a8a)"
];

let activePhoto = 0;
let selectedPattern = [];
let isDrawingPattern = false;

const $ = (selector) => document.querySelector(selector);

function setText(selector, text) {
  const element = $(selector);
  if (element) element.textContent = text;
}

function setupCopy() {
  setText("#mainTitle", `Happy Birthday, ${CONFIG.herName}`);
  setText("#heroMessage", CONFIG.heroMessage);
  setText("#letterTitle", `To ${CONFIG.herName}`);
  setText("#lockMessage", CONFIG.lockMessage);
  setText("#lockHint", CONFIG.lockHint);
  setText("#wishGateTitle", CONFIG.wishGateTitle);
  setText("#wishGateMessage", CONFIG.wishGateMessage);
  setText("#wishQuestionTitle", CONFIG.wishQuestionTitle);
  setText("#wishQuestionText", CONFIG.wishQuestionText);

  const letterText = $("#letterText");
  letterText.innerHTML = "";
  CONFIG.letter.forEach((paragraph) => {
    const p = document.createElement("p");
    p.textContent = paragraph;
    letterText.appendChild(p);
  });

  const wishGrid = $("#wishGrid");
  wishGrid.innerHTML = "";
  CONFIG.wishes.forEach((wish, index) => {
    const card = document.createElement("article");
    card.className = "wish";
    card.innerHTML = `<span>${index + 1}</span><p>${wish}</p>`;
    wishGrid.appendChild(card);
  });
}

function setupLetterCurtains() {
  const stage = $("#letterStage");
  const button = $("#openLetterButton");
  const heartBurst = $("#letterHeartBurst");

  if (!stage || !button || !heartBurst) return;

  button.addEventListener("click", () => {
    if (stage.classList.contains("is-open")) return;

    stage.classList.add("is-open");
    button.setAttribute("aria-expanded", "true");
    heartBurst.innerHTML = "";

    for (let index = 0; index < 34; index += 1) {
      const heart = document.createElement("span");
      const angle = (Math.PI * 2 * index) / 34 + (Math.random() - 0.5) * 0.3;
      const distance = 90 + Math.random() * 170;
      heart.textContent = "♥";
      heart.style.setProperty("--heart-x", `${Math.cos(angle) * distance}px`);
      heart.style.setProperty("--heart-y", `${Math.sin(angle) * distance - 55}px`);
      heart.style.setProperty("--heart-turn", `${-55 + Math.random() * 110}deg`);
      heart.style.setProperty("--heart-size", `${1 + Math.random() * 1.4}rem`);
      heart.style.setProperty("--heart-delay", `${Math.random() * 260}ms`);
      heart.style.setProperty(
        "--heart-color",
        ["#ff9abc", "#ffe0eb", "#f4b34a", "#e84d75"][index % 4]
      );
      heartBurst.appendChild(heart);
    }

    window.setTimeout(() => {
      heartBurst.innerHTML = "";
    }, 1800);
  });
}

function setupPatternLock() {
  const lock = $("#loveLock");
  const board = $("#patternLock");
  const trail = $("#patternTrail");
  const status = $("#lockStatus");
  const dots = [...document.querySelectorAll(".pattern-dot")];

  function updateTrail() {
    trail.innerHTML = "";
    if (selectedPattern.length < 2) return;

    const boardBox = board.getBoundingClientRect();
    trail.setAttribute("viewBox", `0 0 ${boardBox.width} ${boardBox.height}`);
    const points = selectedPattern
      .map((number) => {
        const dot = board.querySelector(`[data-dot="${number}"]`);
        const dotBox = dot.getBoundingClientRect();
        const x = dotBox.left + dotBox.width / 2 - boardBox.left;
        const y = dotBox.top + dotBox.height / 2 - boardBox.top;
        return `${x},${y}`;
      })
      .join(" ");

    const line = document.createElementNS("http://www.w3.org/2000/svg", "polyline");
    line.setAttribute("points", points);
    trail.appendChild(line);
  }

  function addDot(dot) {
    const number = Number(dot.dataset.dot);
    if (selectedPattern.includes(number)) return;

    selectedPattern.push(number);
    dot.classList.add("is-active");
    updateTrail();
  }

  function resetPattern(message = "") {
    selectedPattern = [];
    dots.forEach((dot) => dot.classList.remove("is-active"));
    board.classList.remove("is-wrong");
    trail.innerHTML = "";
    status.textContent = message;
  }

  function unlock() {
    status.textContent = "Unlocked with love.";
    lock.classList.add("is-unlocked");
    showWishGate();
    window.setTimeout(() => lock.remove(), 560);
  }

  function finishPattern() {
    if (!isDrawingPattern) return;

    isDrawingPattern = false;
    const attempt = selectedPattern.join("-");
    const correctPattern = CONFIG.unlockPattern.join("-");

    if (attempt === correctPattern) {
      unlock();
      return;
    }

    board.classList.add("is-wrong");
    status.textContent = "Almost, my love. Try once more.";
    window.setTimeout(() => resetPattern(), 850);
  }

  function dotFromPoint(event) {
    const element = document.elementFromPoint(event.clientX, event.clientY);
    return element?.closest?.(".pattern-dot");
  }

  dots.forEach((dot) => {
    dot.addEventListener("pointerdown", (event) => {
      event.preventDefault();
      isDrawingPattern = true;
      resetPattern();
      addDot(dot);
      dot.setPointerCapture?.(event.pointerId);
    });

    dot.addEventListener("pointerenter", () => {
      if (isDrawingPattern) addDot(dot);
    });
  });

  board.addEventListener("pointermove", (event) => {
    if (!isDrawingPattern) return;

    const dot = dotFromPoint(event);
    if (dot) addDot(dot);
  });

  window.addEventListener("pointermove", (event) => {
    if (!isDrawingPattern) return;

    const dot = dotFromPoint(event);
    if (dot) addDot(dot);
  });

  window.addEventListener("pointerup", finishPattern);
  window.addEventListener("resize", updateTrail);
}

function showWishGate() {
  const wishGate = $("#wishGate");

  wishGate.hidden = false;
  window.setTimeout(() => wishGate.classList.add("is-visible"), 40);
}

function openBirthdaySite() {
  const wishGate = $("#wishGate");

  wishGate.classList.add("is-open");
  document.body.classList.remove("is-locked");
  window.playBirthdayMusic?.();
  window.launchBirthdayConfetti?.();
  window.setTimeout(() => wishGate.remove(), 560);
}

function setupWishGate() {
  const wishGate = $("#wishGate");
  const blowButton = $("#blowCandlesButton");
  const question = $("#wishQuestion");
  const openButton = $("#openBirthdayButton");
  const wishInput = $("#lifeWish");

  blowButton.addEventListener("click", () => {
    wishGate.classList.add("are-candles-out");
    blowButton.hidden = true;
    question.hidden = false;
    window.launchBirthdayConfetti?.();
    window.setTimeout(() => wishInput.focus(), 260);
  });

  openButton.addEventListener("click", openBirthdaySite);
}

function imageExists(src) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = src;
  });
}

async function setupPhotos() {
  const heroPhoto = $("#heroPhoto");
  const galleryGrid = $("#galleryGrid");
  galleryGrid.innerHTML = "";

  for (let index = 0; index < CONFIG.photos.length; index += 1) {
    const photo = CONFIG.photos[index];
    const hasPhoto = await imageExists(photo.src);
    const card = document.createElement("figure");
    card.className = "memory-card";

    if (hasPhoto) {
      const img = document.createElement("img");
      img.src = photo.src;
      img.alt = photo.caption;
      card.appendChild(img);
    } else {
      card.style.background = fallbackPhotos[index % fallbackPhotos.length];
    }

    const caption = document.createElement("figcaption");
    caption.className = "memory-card__caption";
    caption.textContent = photo.caption;
    card.appendChild(caption);
    galleryGrid.appendChild(card);

    if (index === 0) {
      const heroBackground = hasPhoto
        ? `url("${photo.src}")`
        : fallbackPhotos[0];
      heroPhoto.style.setProperty("--hero-image", heroBackground);
    }
  }

  renderSlider();
}

function renderSlider() {
  const photo = CONFIG.photos[activePhoto];
  const img = $("#sliderPhoto");
  const caption = $("#sliderCaption");

  img.src = photo.src;
  img.alt = photo.caption;
  caption.textContent = photo.caption;

  imageExists(photo.src).then((hasPhoto) => {
    const frame = document.querySelector(".slider__frame");
    if (!hasPhoto) {
      img.removeAttribute("src");
      img.alt = "";
      frame.style.background = fallbackPhotos[activePhoto % fallbackPhotos.length];
    } else {
      frame.style.background = "#f4e7eb";
    }
  });
}

function setupSlider() {
  $("#prevPhoto").addEventListener("click", () => {
    activePhoto =
      (activePhoto - 1 + CONFIG.photos.length) % CONFIG.photos.length;
    renderSlider();
  });

  $("#nextPhoto").addEventListener("click", () => {
    activePhoto = (activePhoto + 1) % CONFIG.photos.length;
    renderSlider();
  });
}

function setupCountdown() {
  const birthday = new Date(CONFIG.birthdayDate).getTime();

  function updateCountdown() {
    const now = Date.now();
    const gap = Math.max(birthday - now, 0);

    const days = Math.floor(gap / (1000 * 60 * 60 * 24));
    const hours = Math.floor((gap / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((gap / (1000 * 60)) % 60);
    const seconds = Math.floor((gap / 1000) % 60);

    setText("#days", String(days).padStart(2, "0"));
    setText("#hours", String(hours).padStart(2, "0"));
    setText("#minutes", String(minutes).padStart(2, "0"));
    setText("#seconds", String(seconds).padStart(2, "0"));
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);
}

function setupMusic() {
  const music = $("#birthdayMusic");
  const button = $("#musicButton");

  function updateButton(isPlaying) {
    button.classList.toggle("is-playing", isPlaying);
    button.setAttribute("aria-label", isPlaying ? "Pause music" : "Play music");
  }

  async function playMusic() {
    try {
      await music.play();
      updateButton(true);
    } catch {
      updateButton(false);
    }
  }

  window.playBirthdayMusic = playMusic;

  button.addEventListener("click", () => {
    if (music.paused) {
      playMusic();
    } else {
      music.pause();
      updateButton(false);
    }
  });
}

function setupConfetti() {
  const canvas = $("#confettiCanvas");
  const context = canvas.getContext("2d");
  const pieces = [];
  const colors = ["#e84d75", "#f4b34a", "#8fd6c2", "#325a8a", "#ffffff"];
  let animationFrame;

  function resize() {
    canvas.width = window.innerWidth * window.devicePixelRatio;
    canvas.height = window.innerHeight * window.devicePixelRatio;
    context.setTransform(window.devicePixelRatio, 0, 0, window.devicePixelRatio, 0, 0);
  }

  function makePiece() {
    return {
      x: Math.random() * window.innerWidth,
      y: -20 - Math.random() * window.innerHeight,
      size: 7 + Math.random() * 9,
      speed: 1.8 + Math.random() * 4.2,
      drift: -1.2 + Math.random() * 2.4,
      spin: Math.random() * Math.PI,
      color: colors[Math.floor(Math.random() * colors.length)]
    };
  }

  function draw() {
    context.clearRect(0, 0, window.innerWidth, window.innerHeight);

    pieces.forEach((piece) => {
      piece.y += piece.speed;
      piece.x += piece.drift;
      piece.spin += 0.08;

      context.save();
      context.translate(piece.x, piece.y);
      context.rotate(piece.spin);
      context.fillStyle = piece.color;
      context.fillRect(-piece.size / 2, -piece.size / 2, piece.size, piece.size * 0.55);
      context.restore();
    });

    for (let index = pieces.length - 1; index >= 0; index -= 1) {
      if (pieces[index].y > window.innerHeight + 30) {
        pieces.splice(index, 1);
      }
    }

    if (pieces.length > 0) {
      animationFrame = requestAnimationFrame(draw);
    } else {
      cancelAnimationFrame(animationFrame);
    }
  }

  function burst() {
    for (let index = 0; index < 160; index += 1) {
      pieces.push(makePiece());
    }
    cancelAnimationFrame(animationFrame);
    draw();
  }

  resize();
  window.addEventListener("resize", resize);
  $("#confettiButton").addEventListener("click", burst);
  window.launchBirthdayConfetti = burst;
}

setupCopy();
setupLetterCurtains();
setupPatternLock();
setupWishGate();
setupPhotos();
setupSlider();
setupCountdown();
setupMusic();
setupConfetti();
