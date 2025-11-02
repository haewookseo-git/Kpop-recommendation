// Global variables
let allSongs = [];
let currentFilter = 'all';
let currentSort = 'default';
let searchTerm = '';

// Local Storage keys
const STORAGE_KEY = 'kpop-tracker-data';

// Load data from local storage
function loadFromStorage() {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : {};
}

// Save data to local storage
function saveToStorage(data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

// Get song data from storage
function getSongData(songId) {
    const storage = loadFromStorage();
    return storage[songId] || { listened: false, rating: 0 };
}

// Update song data in storage
function updateSongData(songId, data) {
    const storage = loadFromStorage();
    storage[songId] = { ...storage[songId], ...data };
    saveToStorage(storage);
}

// Load songs from JSON file
async function loadSongs() {
    try {
        const response = await fetch('songs.json');
        allSongs = await response.json();
        renderSongs();
        updateStats();
    } catch (error) {
        console.error('Error loading songs:', error);
        document.getElementById('songsContainer').innerHTML =
            '<p style="color: white; text-align: center; font-size: 1.2rem;">Error loading songs. Please make sure songs.json is available.</p>';
    }
}

// Render songs
function renderSongs() {
    const container = document.getElementById('songsContainer');
    let filteredSongs = filterSongs();
    filteredSongs = sortSongs(filteredSongs);

    if (filteredSongs.length === 0) {
        container.innerHTML = '<p style="color: white; text-align: center; font-size: 1.2rem; grid-column: 1/-1;">No songs found.</p>';
        return;
    }

    container.innerHTML = filteredSongs.map(song => createSongCard(song)).join('');

    // Add event listeners
    attachEventListeners();
}

// Filter songs based on current filter and search term
function filterSongs() {
    return allSongs.filter(song => {
        const songData = getSongData(song.id);
        const matchesSearch = searchTerm === '' ||
            song.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            song.artist.toLowerCase().includes(searchTerm.toLowerCase()) ||
            song.album.toLowerCase().includes(searchTerm.toLowerCase()) ||
            song.group.toLowerCase().includes(searchTerm.toLowerCase());

        if (!matchesSearch) return false;

        switch (currentFilter) {
            case 'listened':
                return songData.listened === true;
            case 'not-listened':
                return songData.listened === false;
            case 'rated':
                return songData.rating > 0;
            default:
                return true;
        }
    });
}

// Sort songs
function sortSongs(songs) {
    const sorted = [...songs];

    switch (currentSort) {
        case 'title':
            return sorted.sort((a, b) => a.title.localeCompare(b.title));
        case 'artist':
            return sorted.sort((a, b) => a.artist.localeCompare(b.artist));
        case 'date-new':
            return sorted.sort((a, b) => new Date(b.releaseDate) - new Date(a.releaseDate));
        case 'date-old':
            return sorted.sort((a, b) => new Date(a.releaseDate) - new Date(b.releaseDate));
        case 'rating':
            return sorted.sort((a, b) => {
                const ratingA = getSongData(a.id).rating || 0;
                const ratingB = getSongData(b.id).rating || 0;
                return ratingB - ratingA;
            });
        default:
            return sorted;
    }
}

// Create song card HTML
function createSongCard(song) {
    const songData = getSongData(song.id);
    const listenedClass = songData.listened ? 'listened' : 'not-listened';
    const statusBadge = songData.listened
        ? '<span class="status-badge status-listened">Listened</span>'
        : '<span class="status-badge status-not-listened">Not Listened</span>';

    const formattedDate = new Date(song.releaseDate).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    return `
        <div class="song-card ${listenedClass}" data-song-id="${song.id}">
            <div class="song-header">
                <div class="song-title">${song.title}</div>
                <div class="song-artist">${song.artist}</div>
                <div class="song-group">${song.group}</div>
            </div>

            <div class="song-details">
                <div class="detail-row">
                    <span class="detail-label">Album:</span>
                    <span class="detail-value">${song.album}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Released:</span>
                    <span class="detail-value">${formattedDate}</span>
                </div>
            </div>

            <div class="song-rating">
                <div class="rating-label">Your Rating:</div>
                <div class="stars" data-song-id="${song.id}">
                    ${createStars(songData.rating)}
                </div>
            </div>

            <div class="song-actions">
                <button class="action-btn listen-btn" data-action="listen" data-song-id="${song.id}">
                    Mark as Listened
                </button>
                <button class="action-btn not-listen-btn" data-action="not-listen" data-song-id="${song.id}">
                    Not Listened
                </button>
                <button class="action-btn reset-btn" data-action="reset" data-song-id="${song.id}">
                    Reset
                </button>
            </div>

            ${statusBadge}
        </div>
    `;
}

// Create stars HTML
function createStars(rating) {
    let html = '';
    for (let i = 1; i <= 5; i++) {
        const filled = i <= rating ? 'filled' : '';
        html += `<span class="star ${filled}" data-rating="${i}">★</span>`;
    }
    return html;
}

// Attach event listeners
function attachEventListeners() {
    // Star rating
    document.querySelectorAll('.stars').forEach(starsContainer => {
        const stars = starsContainer.querySelectorAll('.star');
        const songId = parseInt(starsContainer.dataset.songId);

        stars.forEach(star => {
            star.addEventListener('click', () => {
                const rating = parseInt(star.dataset.rating);
                updateSongData(songId, { rating });
                renderSongs();
                updateStats();
            });

            star.addEventListener('mouseenter', () => {
                const rating = parseInt(star.dataset.rating);
                stars.forEach((s, index) => {
                    if (index < rating) {
                        s.classList.add('filled');
                    } else {
                        s.classList.remove('filled');
                    }
                });
            });
        });

        starsContainer.addEventListener('mouseleave', () => {
            const currentRating = getSongData(songId).rating;
            stars.forEach((s, index) => {
                if (index < currentRating) {
                    s.classList.add('filled');
                } else {
                    s.classList.remove('filled');
                }
            });
        });
    });

    // Action buttons
    document.querySelectorAll('.action-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const action = btn.dataset.action;
            const songId = parseInt(btn.dataset.songId);

            switch (action) {
                case 'listen':
                    updateSongData(songId, { listened: true });
                    break;
                case 'not-listen':
                    updateSongData(songId, { listened: false });
                    break;
                case 'reset':
                    updateSongData(songId, { listened: false, rating: 0 });
                    break;
            }

            renderSongs();
            updateStats();
        });
    });
}

// Update statistics
function updateStats() {
    const totalSongs = allSongs.length;
    let listenedCount = 0;
    let totalRating = 0;
    let ratedCount = 0;

    allSongs.forEach(song => {
        const data = getSongData(song.id);
        if (data.listened) listenedCount++;
        if (data.rating > 0) {
            totalRating += data.rating;
            ratedCount++;
        }
    });

    const notListenedCount = totalSongs - listenedCount;
    const avgRating = ratedCount > 0 ? (totalRating / ratedCount).toFixed(1) : '0.0';

    document.getElementById('totalSongs').textContent = totalSongs;
    document.getElementById('listenedSongs').textContent = listenedCount;
    document.getElementById('notListenedSongs').textContent = notListenedCount;
    document.getElementById('avgRating').textContent = avgRating;
}

// Search functionality
document.getElementById('searchInput').addEventListener('input', (e) => {
    searchTerm = e.target.value;
    renderSongs();
});

// Filter buttons
document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentFilter = btn.dataset.filter;
        renderSongs();
    });
});

// Sort functionality
document.getElementById('sortBy').addEventListener('change', (e) => {
    currentSort = e.target.value;
    renderSongs();
});

// Initialize app
loadSongs();
