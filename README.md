# Like The Fish's Crossfader

**Be your own Video Disc Jockey.** Paste a YouTube playlist and it plays like a real DJ set: every song
crossfades into the next — sound and picture — full screen on any monitor.

**Download:** https://likethefish.ca/crossfader

- Smooth crossfades, skipping talking intros, outros and dead air
- One playlist or two, and **My playlists** to remember them
- Winamp-style side visualizers, "Did you know?" song-fact ticker, retro fonts and a startup intro
- Videos play in YouTube's own embedded player (not affiliated with YouTube or Google)

Made by Nathan Salmon · [likethefish.ca](https://likethefish.ca)

---

# Like The Fish's Crossfader

Plays a YouTube playlist (or two) as one continuous mix: each song crossfades (audio and video)
into the next, full screen on whichever monitor you pick.

## Run it (Windows)
1. Unzip `Like-The-Fishs-Crossfader-1.6.0-win.zip` anywhere (e.g. Documents).
2. Double-click `Like The Fish's Crossfader.exe`.
   Windows SmartScreen may warn because the app isn't signed: click **More info → Run anyway**.

## Use it
1. Optional: click **Sign in** to use your YouTube account (Premium removes ads; unlisted playlists work).
   Sign-in is remembered. If Google says the browser isn't secure, close the window and try once more.
2. Choose **One playlist** (songs blend into each other in order) or **Two playlists**
   (blends back and forth between them), then paste the link(s) — anything with `list=` in it.
3. Choose the crossfade length, which monitor to use, and what to skip.
4. Click **Start the mix**. Settings are remembered for next time.

## Keyboard controls
| Key | Action |
|---|---|
| Space | Pause / resume |
| R | Restart the current song |
| Home or B | Back to the start of the playlist |
| Mouse | Move it to show the on-screen buttons |
| → or N | Crossfade to next song now |
| Shift + → | Quick 1.5 s cut to next song |
| ← / Shift + ← | Back / forward 10 s |
| ↑ / ↓ | Volume |
| I or click | Show song info |
| T | Show the next song fact |
| C | Closed captions on / off |
| E | Open / close the sound panel (bass, vocals, reverb) |
| D | Move to next monitor |
| F or double-click | Toggle full screen |
| Esc | Stop, back to settings |

## Sound effects
Bass boost, vocal boost and reverb, with presets (Bass boost, Vocal boost, Party, Concert hall).
Set them in settings or live from the sliders button on the control bar (or press E).
A soft limiter stops the boosts from distorting. With everything at "off", the audio is untouched.

## Look and feel
- **Time:** move the mouse to see elapsed / total time and how much is left.
- **Font style:** Neon 80s, Arcade pixels, Groovy 70s or Clean modern (Display settings).
- **Side visualizers:** on 4:3 videos (or 16:9 videos with black bars built in) the empty sides become
  Winamp-style spectrum panels, with a countdown and a scrolling song title, coloured from the video
  itself. Choose "Classic green-yellow-red" or "Off" in Display settings.
- **Captions:** tick "Show closed captions" or press C during the mix (only for videos that have them).

## Startup intro
A short Sierra-style "SALMON presents" intro plays when the app opens. Click or press any key to skip,
or turn it off in Display settings.

## Caption style
Pick the caption font (including the retro fonts), size and look (dark box, outline, neon glow,
yellow, or karaoke colours from the visualizer) in Display settings; the preview shows the result.

## Song facts
During each song a "Did you know?" card can show facts about the song and artist (Wikipedia),
plus news and music events from the year it came out (release year from MusicBrainz).
Choose which kinds and how often in settings, or press T for the next fact.
Facts are looked up from the video title, so the odd song will have none or a mismatch.
- **Remixes, covers, edits, live and acoustic versions** are recognised; facts are about the original
  song and artist, and the year is when the original came out.
- **Long mixes / megamixes** with a timestamped tracklist in the video description ("0:00 Artist - Song")
  are followed track by track: the info panel shows "In the mix · track 3 of 12" and the facts switch to
  each original song as the mix reaches it.

## How the gap trimming works
- **Silence detection (Windows)** listens to the PC's sound output. When a song goes quiet at the
  end, the next one starts right away; silent starts are skipped in 3-second jumps.
  Other sounds playing on the PC at the same time can confuse it — turn it off if so.
- **SponsorBlock data** (community-marked timestamps) is checked for each video. Talking or skit
  intros are skipped, the fade-out starts where the outro/credits begin, and marked talking
  sections in the middle are jumped over.
- Videos nobody has marked use your **Skip first / End early by** seconds instead.
- **Max song length** caps very long videos (e.g. 10-minute extended cuts).

## Limits
- YouTube only exposes the first ~200 videos of a playlist to embedded players.
- Videos whose owners block embedding are skipped automatically.
- Without YouTube Premium, ads appear. The app lets them play as a break between songs and
  starts the song as soon as the ad ends.

## Running from source (any OS)
Install Node.js, then in this folder: `npm install` and `npm start`.
Build a Mac or Linux version with `npm run dist:mac` or `npm run dist:linux`.

## If something goes wrong
While loading, the screen shows what it's doing; press **Esc** to cancel at any time.
If it stops with an error, click **Open log** on the settings screen and send me the file.
The log is also at `%APPDATA%\Playlist Crossfader\log.txt (settings and sign-in live in the same folder)`.
