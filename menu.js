const menuBtn = document.getElementById("menuBtn");
const menuBox = document.getElementById("menuBox");

menuBtn.addEventListener("click", () => {
    menuBox.classList.toggle("show");
});

// Get song data from localStorage
let currentSong = JSON.parse(localStorage.getItem('currentSong'));
let currentIndex = parseInt(localStorage.getItem('currentSongIndex')) || 0;
let playlist = JSON.parse(localStorage.getItem('currentPlaylist')) || [];
let isPlaying = false;

// Get all elements with DOT (.)
const audioPlayer = document.getElementById("audioPlayer");
const songTitle = document.getElementById("songTitle");
const lyricsText = document.getElementById("lyricsText");
const playButton = document.querySelector('.playButton');      // ✅ DOT ထည့်ပါ
const pauseButton = document.querySelector('.pauseButton');    // ✅ DOT ထည့်ပါ
const nextButton = document.querySelector('.nextButton');
const previousButton = document.querySelector('.previousButton');
const currentAndTotalTime = document.querySelector('.currentAndTotalTime');
const currentProgress = document.getElementById('currentProgress');
const progressBar = document.getElementById('progressBar');

// Load song function
function loadSong(song) {
    if (song) {
        console.log("Loading:", song.title); // Debug
        audioPlayer.src = song.trackId;
        songTitle.textContent = song.title;
        lyricsText.textContent = song.lyrics || "Lyrics not available";
    }
}

// Play song
function playSong() {
    audioPlayer.play();
    isPlaying = true;
    playButton.style.display = 'none';
    pauseButton.style.display = 'inline-block';
    console.log("Playing..."); // Debug
}

// Pause song
function pauseSong() {
    audioPlayer.pause();
    isPlaying = false;
    playButton.style.display = 'inline-block';
    pauseButton.style.display = 'none';
    console.log("Paused..."); // Debug
}

// Next song
function nextSong() {
    currentIndex++;
    if (currentIndex >= playlist.length) {
        currentIndex = 0;
    }
    currentSong = playlist[currentIndex];
    localStorage.setItem('currentSong', JSON.stringify(currentSong));
    localStorage.setItem('currentSongIndex', currentIndex);
    loadSong(currentSong);
    if (isPlaying) {
        playSong();
    }
}

// Previous song
function previousSong() {
    currentIndex--;
    if (currentIndex < 0) {
        currentIndex = playlist.length - 1;
    }
    currentSong = playlist[currentIndex];
    localStorage.setItem('currentSong', JSON.stringify(currentSong));
    localStorage.setItem('currentSongIndex', currentIndex);
    loadSong(currentSong);
    if (isPlaying) {
        playSong();
    }
}

// Update time and progress
function updateProgress() {
    const currentTime = audioPlayer.currentTime;
    const duration = audioPlayer.duration;

    if (!isNaN(duration)) {
        const currentMinutes = Math.floor(currentTime / 60);
        const currentSeconds = Math.floor(currentTime % 60);
        const totalMinutes = Math.floor(duration / 60);
        const totalSeconds = Math.floor(duration % 60);

        currentAndTotalTime.textContent = 
            `${currentMinutes}:${currentSeconds < 10 ? '0' : ''}${currentSeconds} / ${totalMinutes}:${totalSeconds < 10 ? '0' : ''}${totalSeconds}`;

        const progressPercent = (currentTime / duration) * 100;
        currentProgress.style.width = progressPercent + '%';
    }
}

// Click on progress bar
progressBar.addEventListener('click', (e) => {
    const width = progressBar.clientWidth;
    const clickX = e.offsetX;
    const duration = audioPlayer.duration;
    audioPlayer.currentTime = (clickX / width) * duration;
});

// Event listeners
playButton.addEventListener('click', playSong);
pauseButton.addEventListener('click', pauseSong);
nextButton.addEventListener('click', nextSong);
previousButton.addEventListener('click', previousSong);
audioPlayer.addEventListener('timeupdate', updateProgress);

// Auto play next song
audioPlayer.addEventListener('ended', nextSong);

// Initial load
if (currentSong) {
    loadSong(currentSong);
} else {
    console.log("No song selected!"); // Debug
}

// Initial button state
pauseButton.style.display = 'none';