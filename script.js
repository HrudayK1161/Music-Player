const audio = document.getElementById('audio');
const playPauseBtn = document.getElementById('playPause');
const prevBtn = document.getElementById('prev');
const nextBtn = document.getElementById('next');
const back10Btn = document.getElementById('back10');
const forward10Btn = document.getElementById('forward10');
const title = document.getElementById('title');
const artist = document.getElementById('artist');
const cover = document.getElementById('cover');
const timeBar = document.getElementById('time-bar');
const currentTimeDisplay = document.getElementById('current-time');
const durationDisplay = document.getElementById('duration');
const artistsContainer = document.getElementById('artists');
const lyricsDisplay = document.getElementById('lyrics');

const songs = [
    {
        title: 'One Big Rush',
        artist: 'Joe Satriani',
        src: 'songs/Joe Satriani - One Big Rush.mp3',
        cover: 'cover_art/joe-satriani-cover.jpg',
        lyricsFile: 'lyrics/Joe Satriani - One Big Rush.txt'
    },
    {
        title: 'Halo on Fire',
        artist: 'Metallica',
        src: 'songs/Metallica - Halo On Fire (1).mp3',
        cover: 'cover_art/metallica-cover.jpg',
        lyricsFile: 'lyrics/Metallica - Halo On Fire.txt'
    },
    {
        title: 'Crazy Train',
        artist: 'Ozzy Osbourne',
        src: 'songs/Ozzy Osbourne - Crazy Train.mp3',
        cover: 'cover_art/ozzy-osbourne-cover.jpg',
        lyricsFile: 'lyrics/Ozzy Osbourne - Crazy Train.txt'
    }
];

let currentSongIndex = 0;

function loadSong(song) {
    title.textContent = song.title;
    artist.textContent = song.artist;
    audio.src = song.src;
    cover.src = song.cover || 'cover_art/default-cover.jpg'; // Set to default cover if no cover specified
    fetchLyrics(song.lyricsFile);
}

function fetchLyrics(filePath) {
    fetch(filePath)
        .then(response => response.text())
        .then(text => {
            // Replace line breaks with <br> for HTML formatting
            lyricsDisplay.innerHTML = text.replace(/\n/g, '<br>');
        })
        .catch(error => {
            console.error('Error fetching lyrics:', error);
            lyricsDisplay.textContent = 'Lyrics not available';
        });
}


function playSong() {
    audio.play();
    playPauseBtn.textContent = 'Pause';
}

function pauseSong() {
    audio.pause();
    playPauseBtn.textContent = 'Play';
}

function updateProgress() {
    const { duration, currentTime } = audio;
    const progress = (currentTime / duration) * 100;
    timeBar.value = progress;
    timeBar.style.background = `linear-gradient(to right, #6b056b ${progress}%, #d8a1d8 ${progress}%)`;
    
    const minutes = Math.floor(currentTime / 60);
    const seconds = Math.floor(currentTime % 60).toString().padStart(2, '0');
    currentTimeDisplay.textContent = `${minutes}:${seconds}`;
    
    if (duration) {
        const totalMinutes = Math.floor(duration / 60);
        const totalSeconds = Math.floor(duration % 60).toString().padStart(2, '0');
        durationDisplay.textContent = `${totalMinutes}:${totalSeconds}`;
    } else {
        durationDisplay.textContent = '0:00';
    }
}

playPauseBtn.addEventListener('click', () => {
    if (audio.paused) {
        playSong();
    } else {
        pauseSong();
    }
});

prevBtn.addEventListener('click', () => {
    currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length;
    loadSong(songs[currentSongIndex]);
    playSong();
});

nextBtn.addEventListener('click', () => {
    currentSongIndex = (currentSongIndex + 1) % songs.length;
    loadSong(songs[currentSongIndex]);
    playSong();
});

back10Btn.addEventListener('click', () => {
    audio.currentTime = Math.max(audio.currentTime - 10, 0);
});

forward10Btn.addEventListener('click', () => {
    audio.currentTime = Math.min(audio.currentTime + 10, audio.duration);
});

timeBar.addEventListener('input', () => {
    const { duration } = audio;
    audio.currentTime = (timeBar.value / 100) * duration;
});

audio.addEventListener('timeupdate', updateProgress);

// Group songs by artist and sort
const groupedSongs = songs.reduce((acc, song) => {
    if (!acc[song.artist]) {
        acc[song.artist] = [];
    }
    acc[song.artist].push(song);
    return acc;
}, {});

Object.keys(groupedSongs).sort().forEach(artist => {
    const artistDiv = document.createElement('div');
    artistDiv.classList.add('artist-group');

    const artistName = document.createElement('div');
    artistName.classList.add('artist-name');
    artistName.textContent = artist;

    const songList = document.createElement('div');
    songList.classList.add('song-list');
    songList.innerHTML = `<ul>${groupedSongs[artist].map(song => `<li onclick="loadSong(songs[${songs.indexOf(song)}])">${song.title}</li>`).join('')}</ul>`;

    artistDiv.appendChild(artistName);
    artistDiv.appendChild(songList);
    artistsContainer.appendChild(artistDiv);
});

// Load the first song initially
loadSong(songs[currentSongIndex]);
