const dropZone = document.getElementById("drop-zone");
const fileInput = document.getElementById("file-input");
const audioPlayer = document.getElementById("audio-player");
const songName = document.getElementById("scrolling-text");
const playPauseButton = document.getElementById("play-pause");
const seekBar = document.getElementById("seek-bar");
const volumeControl = document.getElementById("volume-control");
const muteButton = document.getElementById("mute-button");
const seekBarValue = document.getElementById("seek-bar-value");

let isMuted = false;

dropZone.addEventListener("dragover", (event) => {
  event.preventDefault();
  dropZone.classList.add("drop-zone-hover");
});

dropZone.addEventListener("dragleave", () => {
  dropZone.classList.remove("drop-zone-hover");
});

dropZone.addEventListener("drop", (event) => {
  event.preventDefault();
  dropZone.classList.remove("drop-zone-hover");
  const files = event.dataTransfer.files;
  if (files.length > 0) {
    handleFile(files[0]);
  }
});

fileInput.addEventListener("change", (event) => {
  const files = event.target.files;
  if (files.length > 0) {
    handleFile(files[0]);
  }
});

function handleFile(file) {
  const url = URL.createObjectURL(file);
  audioPlayer.src = url;
  audioPlayer.load();
  audioPlayer.play();
  playPauseButton.innerHTML = '<i class="fas fa-pause"></i>'; // Cambia a ícono de pausa
  updateSeekBar();
  songName.textContent = file.name;
}

playPauseButton.addEventListener("click", () => {
  if (audioPlayer.paused) {
    audioPlayer.play();
    playPauseButton.innerHTML = '<i class="fas fa-pause"></i>';
  } else {
    audioPlayer.pause();
    playPauseButton.innerHTML = '<i class="fas fa-play"></i>';
  }
});

audioPlayer.addEventListener("timeupdate", () => {
  updateSeekBar();
});

function updateSeekBar() {
  const currentMinutes = Math.floor(audioPlayer.currentTime / 60);
  const currentSeconds = Math.floor(audioPlayer.currentTime % 60);

  let totalMinutes = 0;
  let totalSeconds = 0;
  if (!isNaN(audioPlayer.duration) && isFinite(audioPlayer.duration)) {
    totalMinutes = Math.floor(audioPlayer.duration / 60);
    totalSeconds = Math.floor(audioPlayer.duration % 60);
  }

  const currentTimeFormatted = `${currentMinutes}:${
    currentSeconds < 10 ? "0" : ""
  }${currentSeconds}`;
  const totalTimeFormatted = `${totalMinutes}:${
    totalSeconds < 10 ? "0" : ""
  }${totalSeconds}`;

  seekBar.value = (audioPlayer.currentTime / audioPlayer.duration) * 100 || 0;
  seekBarValue.textContent = `${currentTimeFormatted} / ${totalTimeFormatted}`;
  updateSliderProgress();
}

seekBar.addEventListener("input", () => {
  audioPlayer.currentTime = (seekBar.value / 100) * audioPlayer.duration;
});

volumeControl.addEventListener("input", () => {
  audioPlayer.volume = volumeControl.value;
  updateVolumeIcon();
  updateSliderProgress();
});

muteButton.addEventListener("click", () => {
  isMuted = !isMuted;
  if (isMuted) {
    audioPlayer.volume = 0;
  } else {
    audioPlayer.volume = volumeControl.value;
  }
  updateVolumeIcon();
});

function updateVolumeIcon() {
  if (isMuted || audioPlayer.volume === 0) {
    muteButton.innerHTML = '<i class="fas fa-volume-mute"></i>';
  } else if (audioPlayer.volume > 0.5) {
    muteButton.innerHTML = '<i class="fas fa-volume-up"></i>';
  } else {
    muteButton.innerHTML = '<i class="fas fa-volume-down"></i>';
  }
}

// Background and theme management
const backgroundImages = [
  "./assets/chanchita.jpg",
  "./assets/girlie-chanchita.png"
];

const themes = [
  "blue-theme",
  "girlie-theme"
];

let currentBackgroundIndex = 0;
let currentThemeIndex = 0;

const prevButton = document.getElementById("prev-bg");
const nextButton = document.getElementById("next-bg");

function changeBackground(direction) {
  // Always change theme regardless of number of images
  changeTheme();
  
  // If there are multiple images, also change the background
  if (backgroundImages.length > 1) {
    if (direction === "next") {
      currentBackgroundIndex = (currentBackgroundIndex + 1) % backgroundImages.length;
    } else {
      currentBackgroundIndex = (currentBackgroundIndex - 1 + backgroundImages.length) % backgroundImages.length;
    }
    
    document.body.style.backgroundImage = `url("${backgroundImages[currentBackgroundIndex]}")`;
    
    // Update the background-specific class
    const backgroundName = backgroundImages[currentBackgroundIndex].split('/').pop().split('.')[0];
    document.body.classList.remove(...Array.from(document.body.classList).filter(c => c.includes('-bg')));
    document.body.classList.add(`${themes[currentThemeIndex]}-${backgroundName}-bg`);
  }
}

function changeTheme() {
  // Remove current theme
  document.body.classList.remove(themes[currentThemeIndex]);
  
  // Move to next theme
  currentThemeIndex = (currentThemeIndex + 1) % themes.length;
  
  // Add new theme
  document.body.classList.add(themes[currentThemeIndex]);
  
  // Add background-specific class for more specific styling
  const backgroundName = backgroundImages[currentBackgroundIndex].split('/').pop().split('.')[0];
  document.body.classList.remove(...document.body.classList.value.split(' ').filter(c => c.includes('-bg')));
  document.body.classList.add(`${themes[currentThemeIndex]}-${backgroundName}-bg`);
  
  // Update slider colors
  updateSliderProgress();
}

// Event listeners for navigation buttons
nextButton.addEventListener("click", () => {
  changeBackground("next");
});

prevButton.addEventListener("click", () => {
  changeBackground("prev");
});

function updateSliderProgress() {
  const seekProgress = (audioPlayer.currentTime / audioPlayer.duration) * 100 || 0;
  const volumeProgress = volumeControl.value * 100;
  
  // Get current theme color
  let themeColor = 'rgba(56, 96, 178, 0.6)'; // default blue
  if (document.body.classList.contains('red-theme')) {
    themeColor = 'rgba(178, 56, 56, 0.6)';
  } else if (document.body.classList.contains('green-theme')) {
    themeColor = 'rgba(56, 178, 96, 0.6)';
  } else if (document.body.classList.contains('purple-theme')) {
    themeColor = 'rgba(128, 56, 178, 0.6)';
  } else if (document.body.classList.contains('girlie-theme')) {
    themeColor = 'rgba(228, 141, 142, 0.6)';
  }
  
  // Update seek bar progress
  seekBar.style.background = `linear-gradient(to right, ${themeColor} 0%, ${themeColor} ${seekProgress}%, #ddd ${seekProgress}%, #ddd 100%)`;
  
  // Update volume control progress
  volumeControl.style.background = `linear-gradient(to right, ${themeColor} 0%, ${themeColor} ${volumeProgress}%, #ddd ${volumeProgress}%, #ddd 100%)`;
}

// Initialize slider colors on page load
document.addEventListener('DOMContentLoaded', () => {
  updateSliderProgress();
  
  // Set initial background-specific class
  const backgroundName = backgroundImages[currentBackgroundIndex].split('/').pop().split('.')[0];
  document.body.classList.add(`${themes[currentThemeIndex]}-${backgroundName}-bg`);
});
