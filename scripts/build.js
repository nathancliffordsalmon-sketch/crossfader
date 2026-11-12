#!/usr/bin/env node
// Build one edition of Like The Fish's Crossfader.
//   node scripts/build.js public            → dist/…Setup-<version>.exe  (installer, unsigned)
//   node scripts/build.js public --sign     → same, signed with Azure Artifact Signing (run on Windows / GitHub Actions)
//   node scripts/build.js personal          → dist/…Personal-<version>-win.zip  (your full version)
const fs = require('fs');
const path = require('path');
const { build, Platform } = require('electron-builder');

const root = path.join(__dirname, '..');
const which = process.argv[2] || 'public';
const sign = process.argv.includes('--sign');
const ed = JSON.parse(fs.readFileSync(path.join(root, 'editions', `${which}.json`), 'utf8'));
const pkg = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
const editionFile = path.join(root, 'app', 'edition.json');
const original = fs.readFileSync(editionFile, 'utf8');

const { signing, appId, ...runtime } = ed;
fs.writeFileSync(editionFile, JSON.stringify(runtime, null, 2));

const isPublic = ed.edition === 'public';
const fileBase = ed.productName.replace(/'/g, '').replace(/[()]/g, '').trim().replace(/\s+/g, '-');
const config = {
  ...pkg.build,
  appId,
  productName: ed.productName,
  publish: [],
  artifactName: isPublic ? `${fileBase}-Setup-\${version}.\${ext}` : `${fileBase}-\${version}-win.\${ext}`,
  win: {
    icon: 'build/icon.ico',
    target: [{ target: isPublic ? 'nsis' : 'zip', arch: ['x64'] }],
    // When signing, electron-builder edits the exe (icon, name) itself and then signs it.
    signAndEditExecutable: sign,
    ...(sign ? { azureSignOptions: { ...signing } } : {})
  },
  nsis: {
    oneClick: false,
    perMachine: false,
    allowToChangeInstallationDirectory: true,
    createDesktopShortcut: true,
    createStartMenuShortcut: true,
    shortcutName: ed.productName,
    installerIcon: 'build/icon.ico',
    uninstallerIcon: 'build/icon.ico',
    license: 'build/license.txt',
    deleteAppDataOnUninstall: false
  }
};
if (sign && JSON.stringify(signing || {}).includes('FILL-IN')) {
  console.error('Fill in the "signing" values in editions/public.json first (see RELEASE-GUIDE.md).');
  fs.writeFileSync(editionFile, original); process.exit(1);
}

build({ targets: Platform.WINDOWS.createTarget(), config })
  .then((files) => { console.log('\nBuilt:\n  ' + files.filter((f) => /\.(exe|zip)$/.test(f)).join('\n  ')); })
  .catch((e) => { console.error(e); process.exitCode = 1; })
  .finally(() => fs.writeFileSync(editionFile, original));
