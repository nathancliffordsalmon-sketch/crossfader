// electron-builder afterPack hook: put the fish icon and app name into the Windows .exe
// (done in JavaScript with resedit, since this build machine has no Windows tools).
const path = require('path');
const fs = require('fs');
const ResEdit = require('resedit');

exports.default = async function afterPack(ctx) {
  if (ctx.electronPlatformName !== 'win32') return;
  // When electron-builder signs the app it also sets the icon itself (on Windows); nothing to do here.
  if (ctx.packager.platformSpecificBuildOptions.signAndEditExecutable) return;
  const product = ctx.packager.appInfo.productName;
  const version = ctx.packager.appInfo.version;
  const exe = path.join(ctx.appOutDir, `${ctx.packager.appInfo.productFilename}.exe`);
  const data = fs.readFileSync(exe);
  const pe = ResEdit.NtExecutable.from(data, { ignoreCert: true });
  const res = ResEdit.NtExecutableResource.from(pe);
  const ico = ResEdit.Data.IconFile.from(fs.readFileSync(path.join(__dirname, 'icon.ico')));
  const groups = ResEdit.Resource.IconGroupEntry.fromEntries(res.entries);
  const id = groups.length ? groups[0].id : 1, lang = groups.length ? groups[0].lang : 1033;
  ResEdit.Resource.IconGroupEntry.replaceIconsForResource(res.entries, id, lang, ico.icons.map((i) => i.data));
  const vi = ResEdit.Resource.VersionInfo.fromEntries(res.entries)[0];
  if (vi) {
    const v = version.split('.').map(Number);
    vi.setFileVersion(v[0], v[1], v[2], 0, 1033); vi.setProductVersion(v[0], v[1], v[2], 0, 1033);
    vi.setStringValues({ lang: 1033, codepage: 1200 }, {
      FileDescription: product, ProductName: product, InternalName: product, OriginalFilename: path.basename(exe), CompanyName: 'Nathan Salmon'
    });
    vi.outputToResourceEntries(res.entries);
  }
  res.outputResource(pe);
  fs.writeFileSync(exe, Buffer.from(pe.generate()));
  console.log(`  • fish icon + name written into ${path.basename(exe)}`);
};
