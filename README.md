# Kpop Songs Tracker

A web-based application to track and rate your favorite Kpop songs. This tracker allows you to mark songs as listened/not listened and rate them on a 5-star scale, with all data stored locally in your browser.

## Features

- **100 Kpop Songs Database**: Pre-loaded with 100 popular Kpop songs including details like artist, group, album, and release date
- **Local Storage**: All your ratings and listening status are saved in your browser's local storage
- **Star Rating System**: Rate songs from 1 to 5 stars
- **Listen Status Tracking**: Mark songs as listened or not listened
- **Search Functionality**: Search songs by title, artist, album, or group
- **Filter Options**:
  - All songs
  - Listened songs only
  - Not listened songs only
  - Rated songs only
- **Sort Options**:
  - Default order
  - By title
  - By artist
  - By release date (newest/oldest)
  - By rating
- **Statistics Dashboard**: View total songs, listened count, not listened count, and average rating

## How to Use

1. Open `index.html` in your web browser
2. Browse through the 100 Kpop songs
3. Rate songs by clicking on the stars (1-5 stars)
4. Mark songs as "Listened" or "Not Listened" using the buttons
5. Use the search bar to find specific songs
6. Filter and sort songs using the controls
7. Reset individual songs using the "Reset" button

## Files

- `index.html` - Main HTML structure
- `styles.css` - Styling and layout
- `app.js` - JavaScript functionality and local storage management
- `songs.json` - Database of 100 Kpop songs

## Technologies Used

- HTML5
- CSS3 (with modern gradients and responsive design)
- Vanilla JavaScript (ES6+)
- Local Storage API

## Features in Detail

### Rating System
Click on any star to rate a song from 1 to 5 stars. Your rating is immediately saved to local storage.

### Listen Status
- **Mark as Listened**: Green border on the left side of the card
- **Not Listened**: Orange border on the left side of the card
- **Reset**: Clears both the rating and listen status

### Data Persistence
All your ratings and listen statuses are stored in your browser's local storage, so your data persists even after closing the browser.

## Browser Compatibility

Works on all modern browsers that support:
- ES6 JavaScript
- CSS Grid
- Flexbox
- Local Storage API

## License

This project is open source and available for educational purposes.
