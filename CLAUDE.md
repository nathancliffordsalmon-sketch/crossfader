# Notes for Claude sessions working on this repo

## Rule: every Like the Fish music experience offers the same music sources

Any new music experience, game or visualizer for likethefish.ca (and any you rework) must offer all of these:

1. **Spotify**: a Like The Fish playlist picker plus a random playlist button and a paste-a-link box, using the Spotify iFrame embed API. Playlist list: `window.PQ_PLAYLISTS` (copy it from the Phantasea Sessions page, id 1385).
2. **Mic**: "dance to the room" / listen through the microphone (getUserMedia + AnalyserNode).
3. **Game music**, loaded through the shared module `site-assets/rko/gm.js` (`window.LTFGM`), with all of its collections:
   - C64 remixes (Remix.Kwed.Org), with the C64 sub-list dropdown (`LTFGM.subOptions('c64')`)
   - Kevin MacLeod moods: Relaxing, Encapsulating, Insanity (CC BY 4.0)
   - MOBYGRATIS: Glow and Drive
   Build the dropdown from `LTFGM.collections`; never hard-code the list, so new collections appear everywhere.
4. Nice to have where it fits: Apple Music embed tab and a "Type my songs" tab (see island/island.js or phantasea/phantasea.js).

Also add a slim **Quick Play** bar at the top (Random Spotify playlist / C64 / Relaxing / Encapsulating / Insanity / MOBYGRATIS Glow / MOBYGRATIS Drive, then ▶ Play).

### How to wire game music
- Load `gm.js` from the same jsDelivr commit as your own script (it finds its data files next to itself).
- `await LTFGM.load()`, then `LTFGM.items(key, sub)` gives tracks with `url`, `title`, `credit`, `bpm`, `mg` (true for MOBYGRATIS).
- Call `LTFGM.played(item)` once when each track starts. It shows the THANK YOU, MOBYGRATIS! card and counts MOBYGRATIS plays (the site emails the admin as plays near the 10,000-stream licence limit).
- The C64 and incompetech files are hotlinked without CORS headers, so WebAudio can't analyse them: drive visuals from a beat model (bpm from the item or a random one), not an AnalyserNode. MOBYGRATIS files are on likethefish.ca, so they can be analysed.

### Credits (required)
- C64: name the remixer, the original composer and link Remix.Kwed.Org.
- Kevin MacLeod: "music by Kevin MacLeod (incompetech.com), licensed under Creative Commons: By Attribution 4.0" with links.
- MOBYGRATIS: credit only "mobygratis" / "Thank you, MOBYGRATIS!" with a link to mobygratis.com. Never name or picture the artist behind it.

### Reference implementations
- `site-assets/island/island.js` (Island Sessions): all sources, quick play bar, full screen.
- `site-assets/rko/fishing-gm.js`: adding game music to an existing page as an add-on.

### Fishing hook
The Fishing page's inline game (base64 in `#cif-src`) calls `window.cifHook({ctx, lvl, fish, beat, t, floor, solid, note, parts, texts})` every frame just before drawing the HUD. `site-assets/rko/fishing-blaster.js` (the Boombox Kid) uses it. Keep that call if you rebuild the Fishing game.
