# Releasing Like The Fish's Crossfader

Two versions build from this folder:

| | Public edition | Personal edition |
|---|---|---|
| Who it's for | Anyone, downloaded from likethefish.ca | You |
| File | `Like-The-Fishs-Crossfader-Setup-<version>.exe` (installer) | `Like-The-Fishs-Crossfader-Personal-<version>-win.zip` |
| YouTube player | Shown as YouTube made it (its controls and logo stay) | App's own look, player chrome hidden |
| Bass / vocal / reverb | — | ✓ |
| Side visualizers | From the PC's sound output (Windows) + thumbnail colours | From the player audio + video colours |
| Caption styling | YouTube's own ⚙ menu | App's caption fonts and looks |
| Mix tracklists | Only with a YouTube Data API key (optional, step 6) | ✓ |
| YouTube sign-in | — | ✓ |
| My playlists, crossfades, facts, intro, fonts, CC on/off | ✓ | ✓ |

Settings for each live in `editions/public.json` and `editions/personal.json`.

---

## 1. Put the project on GitHub (free)

(Already done for you if Claude set up the repository — skip to step 2.)


1. Create a free account at github.com if you don't have one.
2. New repository → name it `crossfader` → **Private** → Create.
3. On the new repo page click **uploading an existing file** and drag in everything from this folder
   (not `node_modules` or `dist`). Commit.

## 2. Get your code-signing identity from Microsoft (about $9.99 US / month)

This is what turns "Unknown publisher" into **Nathan Salmon** on the install screen.

1. Sign in to portal.azure.com (create a pay-as-you-go account if needed).
2. Search **Artifact Signing** (formerly *Trusted Signing*) → **Create** an account.
   - Region: **East US** (if you pick another region, change `endpoint` in `editions/public.json`
     to that region's endpoint, e.g. `https://wus.codesigning.azure.net/`).
   - Pricing tier: **Basic**.
3. In the new account open **Identity validation** → **New identity** → **Public** → **Individual**.
   Microsoft checks your government photo ID; approval usually takes from a few hours to a few days.
   Your validated name is what Windows will show as the publisher.
4. When validated, open **Certificate profiles** → **Create** → **Public Trust**, pick your identity,
   name it e.g. `likethefish`.

## 3. Let GitHub sign on your behalf

1. In the Azure portal search **Microsoft Entra ID** → **App registrations** → **New registration**,
   name `crossfader-signing` → Register. Note the **Application (client) ID** and **Directory (tenant) ID**.
2. In that app: **Certificates & secrets** → **New client secret** → copy the **Value** right away.
3. Back on your Artifact Signing account: **Access control (IAM)** → **Add role assignment** →
   role **Artifact Signing Certificate Profile Signer** (older name: *Trusted Signing Certificate Profile
   Signer*) → assign to `crossfader-signing`.
4. In your GitHub repo: **Settings → Secrets and variables → Actions → New repository secret**, add:
   - `AZURE_TENANT_ID` — the directory (tenant) ID
   - `AZURE_CLIENT_ID` — the application (client) ID
   - `AZURE_CLIENT_SECRET` — the secret value
5. Edit `editions/public.json` in GitHub and fill in the `signing` section:
   - `codeSigningAccountName` — your Artifact Signing account name
   - `certificateProfileName` — the profile name from step 2.4
   - `publisherName` — your name **exactly** as Microsoft validated it

## 4. Build and publish the installer

- For a release: bump `"version"` in `package.json`, then create a tag like `v1.7.4`
  (Releases → Draft a new release → choose a new tag → Publish). The **Build installer** workflow runs on a
  Windows machine at GitHub (about 10 minutes) and attaches the installer to that release.
- Without the Azure secrets the installer is unsigned; once the secrets from step 3 are in place, it's signed
  automatically (and the build fails on purpose if signing was set up but didn't work).
- Every release also carries `Like-The-Fishs-Crossfader-Setup.exe`, so this link always downloads the newest
  version — use it for the website's download button:
  `https://github.com/<your-username>/crossfader/releases/latest/download/Like-The-Fishs-Crossfader-Setup.exe`

## 5. Your website (likethefish.ca)

Ready-to-paste text is in the `website/` folder:

- `download-page.md` → a page at **likethefish.ca/crossfader** with the download button and your PayPal button
  (the app's "♥ Support the fish" button opens this page).
- `privacy.md` → **likethefish.ca/crossfader/privacy** (linked from the app and installer — YouTube requires
  apps that use its player to have one).
- `terms.md` → optional terms page.
- `latest.json` → upload so it's reachable at **likethefish.ca/crossfader/latest.json**. When you release a new
  version, change its `version`; older copies of the app then show "Version x is available — Get it".
  (If WordPress won't accept .json uploads, put it in the GitHub repo instead and change `updateUrl` in
  `editions/public.json` to its "Raw" link.)

The installer is ~120 MB. If your WordPress host won't take a file that big, link the download button to the
installer on your GitHub Release instead (make the repo public, or use a separate public repo just for releases).

**Tips:** in PayPal, create a PayPal.me link or a "Pay"/"Donate" button and put it on the download page.
(PayPal's Donate button is aimed at charities and causes — check which PayPal offers your account.)
Tips for software are income, not charitable donations, so keep a record of them.

**Selling instead of tips:** set `"sponsorblock": false` in `editions/public.json` before building a paid
version — SponsorBlock's data is licensed for non-commercial use only. Everything else can be sold.

## 6. Optional: tracklists for long mixes in the public edition

The public edition only reads video descriptions through YouTube's official Data API.

1. console.cloud.google.com → new project → **APIs & Services → Library → YouTube Data API v3 → Enable**.
2. **Credentials → Create credentials → API key** → restrict it to *YouTube Data API v3*.
3. Paste it into `youtubeApiKey` in `editions/public.json`.
   Free quota is 10,000 units/day; each mix lookup uses 1.

## 7. The Windows "protected your PC" screen

Signing removes "Unknown publisher" straight away, but Windows SmartScreen can still show its blue screen for a
brand-new app until enough people have downloaded it safely. To speed that up, submit the signed installer at
microsoft.com/wdsi/filesubmission (choose *Software developer*). Users can always click **More info → Run anyway**.

## Building without GitHub (unsigned, for testing)

```
npm install
npm run dist:public      # installer → dist/
npm run dist:personal    # your full version → dist/
```
