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
}

seekBar.addEventListener("input", () => {
  audioPlayer.currentTime = (seekBar.value / 100) * audioPlayer.duration;
});

volumeControl.addEventListener("input", () => {
  audioPlayer.volume = volumeControl.value;
  updateVolumeIcon();
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
