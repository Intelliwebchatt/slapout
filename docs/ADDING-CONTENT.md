# Adding albums, artwork, and notes

The site intentionally has two album templates:

- **Case-file template:** The Warning, The Fall, and Welcome to the Woods. Use this for most new albums.
- **Glass Rose template:** Reserved for The Glass Rose Sessions and its recognizable glitch/venue effects.

## Change an album cover

1. Upload the replacement image to the repository.
2. Keep the same filename if you want a straight replacement, such as `warning-cover.jpg`.
3. If the filename changes, update the album's `art` line in `data/albums/`.
4. Square artwork works best on Android and other lock screens.

A song can have its own lock-screen image later by adding this beside its `file` line:

```js
art: "/song-name-cover.jpg"
```

Without that line, the song uses the album cover.

## Add or edit album tracks

Album titles, MP3 filenames, Field Notes, and optional song artwork live in:

- `data/albums/warning.js`
- `data/albums/glass-rose.js`
- `data/albums/fall.js`
- `data/albums/woods.js`

The three case-file albums share `js/casefile-player.js`. Glass Rose uses `js/glass-player.js`. Avoid putting track lists back into the HTML pages.

## Add a Dirt Road note

Open `data/notes.js` and add one object inside the list. Example:

```js
{
  type: "photo",
  who: "Ryder",
  date: "Jul 2026",
  img: "/new-photo.jpg",
  text: "Your caption here."
}
```

Supported types are `photo`, `note`, `quote`, and `lyric`.

## Add a new album

For the normal style, copy the structure of `warning.html`, give the page its own artwork and text, then create one new file in `data/albums/`. Add the new page once in `js/site-nav.js`. The shared player handles playback, lock-screen controls, track progress, downloads, and remembered playback.

Keep all albums in this repository. Separate repositories would make the shared navigation and cross-page player harder to maintain.
