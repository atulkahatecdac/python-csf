// Builds the decks into the parent folder: node build-all.js [N ...]  (default: every deckN.js)
const fs = require("fs");
const path = require("path");
const JSZip = require("jszip");
const NAMES = require("./names");

// pptxgenjs writes directory entries into the zip; cloud viewers (OneDrive/SharePoint) dislike them.
async function stripFolderEntries(file) {
  const zip = await JSZip.loadAsync(fs.readFileSync(file));
  const out = new JSZip();
  for (const [name, entry] of Object.entries(zip.files)) {
    if (!entry.dir) out.file(name, await entry.async("uint8array"), { createFolders: false });
  }
  fs.writeFileSync(file, await out.generateAsync({ type: "nodebuffer", compression: "DEFLATE", createFolders: false }));
}

const all = fs.readdirSync(__dirname).map((f) => (f.match(/^deck(\d+)\.js$/) || [])[1]).filter(Boolean).sort((a, b) => a - b);
const which = process.argv.slice(2).length ? process.argv.slice(2) : all;
(async () => {
  for (const n of which) {
    const file = path.join(__dirname, "..", `python-cyber-session-${n}-${NAMES[n]}.pptx`);
    await require(`./deck${n}.js`)(file);
    await stripFolderEntries(file);
  }
})().catch((e) => { console.error(e); process.exit(1); });
