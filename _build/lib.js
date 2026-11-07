// Shared slide templates for the Python Programming for Cyber Security decks.
// Same design as the No-Code Low-Code decks: plain white background, navy text,
// one coral accent, icons in circles as the motif. Workflow slides are replaced
// by demo slides (code panel + output panel).
const pptxgen = require("pptxgenjs");
const React = require("react");
const ReactDOMServer = require("react-dom/server");
const sharp = require("sharp");
const fa = require("react-icons/fa");
const NAMES = require("./names");

// Demo folder name for a session: Session-<n>-Demos-<name>
function demoDir(n) {
  return `Session-${n}-Demos-${NAMES[n]}`;
}

const AUTHOR = "Atul Kahate";
const LINKEDIN = "https://www.linkedin.com/in/atulkahate/";
const COURSE = "PGCP-CSF  ·  Module 6: Python Programming for Cyber Security";
const SHORT = "Python for Cyber Security";

const C = {
  navy: "1F2A44",
  coral: "EA4B71",
  teal: "1A7F8E",
  purple: "6B4FBB",
  gray: "5B6475",
  muted: "8A93A3",
  light: "F4F6FA",
  line: "D5DAE3",
  white: "FFFFFF",
  codeComment: "9FB0CC",
};
const HEAD = "Calibri";
const BODY = "Calibri";
const MONO = "Courier New";
const MONO_W = 0.64; // Courier New glyph width as a fraction of the point size
const LH = 1.3;    // PowerPoint line height for Courier New, as a multiple of the point size

// ---------- icons ----------
const iconCache = new Map();
function I(name) {
  const comp = fa[name];
  if (!comp) throw new Error("Unknown icon: " + name);
  return comp;
}
async function iconData(name, color, size = 256) {
  const key = name + color;
  if (!iconCache.has(key)) {
    const svg = ReactDOMServer.renderToStaticMarkup(
      React.createElement(I(name), { color: "#" + color, size: String(size) })
    );
    const buf = await sharp(Buffer.from(svg)).png().toBuffer();
    iconCache.set(key, "image/png;base64," + buf.toString("base64"));
  }
  return iconCache.get(key);
}
async function iconCircle(s, name, x, y, d, fill, fg = C.white) {
  s.addShape("ellipse", { x, y, w: d, h: d, fill: { color: fill }, line: { color: fill } });
  const pad = d * 0.26;
  s.addImage({ data: await iconData(name, fg), x: x + pad, y: y + pad, w: d - 2 * pad, h: d - 2 * pad });
}

// ---------- text helpers ----------
// Inline markup: `code` -> mono coral, **bold** -> bold.
function runs(str, base = {}) {
  const out = [];
  const re = /(`[^`]+`|\*\*[^*]+\*\*)/g;
  let last = 0, m;
  while ((m = re.exec(str))) {
    if (m.index > last) out.push({ text: str.slice(last, m.index), options: { ...base } });
    const tok = m[0];
    if (tok.startsWith("`")) out.push({ text: tok.slice(1, -1), options: { ...base, fontFace: MONO, color: C.coral, bold: true } });
    else out.push({ text: tok.slice(2, -2), options: { ...base, bold: true } });
    last = m.index + tok.length;
  }
  if (last < str.length) out.push({ text: str.slice(last), options: { ...base } });
  return out;
}
// Several paragraphs -> one text array with line breaks between them.
function paras(list, base = {}, bullet = false) {
  const out = [];
  list.forEach((p, i) => {
    const r = typeof p === "string" ? runs(p, base) : p;
    if (bullet && r.length) r[0].options.bullet = { indent: 14 };
    if (i < list.length - 1) r[r.length - 1].options.breakLine = true;
    out.push(...r);
  });
  return out;
}
function tb(s, text, o) {
  s.addText(text, { fontFace: BODY, color: C.navy, margin: 0, valign: "top", isTextBox: true, ...o });
}
// Largest mono font size (<= wanted) at which `lines` fit in w x maxH (inches).
function monoFit(lines, w, maxH, wanted) {
  const longest = Math.max(1, ...lines.map((l) => l.length));
  let fs = Math.min(wanted, (w - 0.3) / (longest * MONO_W / 72));
  if (maxH) fs = Math.min(fs, (maxH - 0.3) / (lines.length * LH / 72));
  fs = Math.floor(fs * 2) / 2;
  if (fs < 8) throw new Error(`Code too big for panel (needs ${fs}pt): ${lines[0]}`);
  return fs;
}

// ---------- deck ----------
class Deck {
  constructor(n, title) {
    this.n = n;
    this.title = title;
    this.pres = new pptxgen();
    this.pres.layout = "LAYOUT_16x9"; // 10 x 5.625 in
    this.pres.title = `Session ${n}: ${title}`;
    this.pres.author = AUTHOR;
    this.page = 0;
  }
  slide(notes) {
    const s = this.pres.addSlide();
    s.background = { color: C.white };
    this.page++;
    if (this.page > 1) {
      tb(s, `${SHORT} · Session ${this.n}  |  ${this.page}`, {
        x: 0.5, y: 5.25, w: 9, h: 0.25, fontSize: 9, color: C.muted, align: "right",
      });
    }
    if (notes) s.addNotes(notes);
    return s;
  }
  heading(s, title, sub) {
    tb(s, title, { x: 0.5, y: 0.3, w: 9, h: 0.6, fontFace: HEAD, fontSize: 28, bold: true, valign: "middle" });
    if (sub) tb(s, sub, { x: 0.5, y: 0.88, w: 9, h: 0.35, fontSize: 14, color: C.gray });
  }
  async save(file) {
    await this.pres.writeFile({ fileName: file });
    console.log("wrote", file, `(${this.page} slides)`);
  }

  // ---- 1. Title ----
  async titleSlide({ title, subtitle, flow, notes }) {
    const s = this.slide(notes);
    tb(s, `SESSION ${this.n}`, { x: 0.6, y: 0.8, w: 5, h: 0.35, fontSize: 14, bold: true, color: C.coral, charSpacing: 4 });
    tb(s, title, { x: 0.6, y: 1.2, w: 5.5, h: 1.5, fontFace: HEAD, fontSize: 32, bold: true });
    tb(s, subtitle, { x: 0.6, y: 2.75, w: 5.0, h: 0.8, fontSize: 15, color: C.gray });
    tb(s, "AUTHOR", { x: 0.6, y: 3.7, w: 3, h: 0.25, fontSize: 10, bold: true, color: C.coral, charSpacing: 3 });
    tb(s, AUTHOR, { x: 0.6, y: 3.95, w: 4, h: 0.38, fontFace: HEAD, fontSize: 18, bold: true });
    tb(s, [{ text: LINKEDIN, options: { hyperlink: { url: LINKEDIN } } }],
      { x: 0.6, y: 4.4, w: 5, h: 0.28, fontSize: 11, color: C.teal });
    tb(s, COURSE, { x: 0.6, y: 4.85, w: 6, h: 0.3, fontSize: 11, color: C.muted });
    const x0 = 6.35, gap = 4.2 / flow.length, d = 0.62;
    const y0 = 0.6 + (gap - d) / 2;
    for (let i = 0; i < flow.length; i++) {
      const [icon, name, desc, col] = flow[i];
      const y = y0 + i * gap;
      await iconCircle(s, icon, x0, y, d, col);
      tb(s, [
        { text: name, options: { bold: true, fontSize: 14, breakLine: true } },
        { text: desc, options: { color: C.gray, fontSize: 11 } },
      ], { x: x0 + 0.8, y: y - 0.02, w: 2.6, h: 0.66, valign: "middle" });
      if (i < flow.length - 1) {
        s.addShape("line", { x: x0 + d / 2, y: y + d + 0.04, w: 0, h: gap - d - 0.08, line: { color: C.line, width: 1.5, endArrowType: "triangle" } });
      }
    }
  }

  // ---- 2. Goals & agenda (no timings). Items starting "D1  " get a coral demo tag ----
  async goalsAgenda({ sub, goals, agenda, notes }) {
    const s = this.slide(notes);
    this.heading(s, "Today's Goals & Agenda", sub);
    for (let i = 0; i < goals.length; i++) {
      const y = 1.5 + i * 0.85;
      await iconCircle(s, goals[i][0], 0.5, y, 0.5, C.navy);
      tb(s, runs(goals[i][1]), { x: 1.15, y, w: 3.4, h: 0.5, fontSize: 14, valign: "middle" });
    }
    s.addShape("roundRect", { x: 5.0, y: 1.4, w: 4.5, h: 3.65, fill: { color: C.light }, line: { color: C.light }, rectRadius: 0.1 });
    tb(s, "AGENDA", { x: 5.25, y: 1.55, w: 2, h: 0.25, fontSize: 10, bold: true, color: C.gray, charSpacing: 3 });
    const step = Math.min(0.44, 3.0 / agenda.length);
    agenda.forEach((item, i) => {
      const y = 1.9 + i * step;
      const demo = /^D\d/.test(item);
      if (demo) {
        const [tag, ...rest] = item.split("  ");
        s.addShape("roundRect", { x: 5.25, y: y + 0.04, w: 0.55, h: 0.27, fill: { color: C.coral }, line: { color: C.coral }, rectRadius: 0.05 });
        tb(s, tag, { x: 5.25, y: y + 0.04, w: 0.55, h: 0.27, fontSize: 10, bold: true, color: C.white, align: "center", valign: "middle" });
        tb(s, rest.join("  "), { x: 5.95, y, w: 3.4, h: 0.35, fontSize: 13, bold: true, valign: "middle" });
      } else {
        s.addShape("ellipse", { x: 5.46, y: y + 0.12, w: 0.11, h: 0.11, fill: { color: C.muted }, line: { color: C.muted } });
        tb(s, item, { x: 5.95, y, w: 3.4, h: 0.35, fontSize: 13, valign: "middle" });
      }
    });
  }

  // ---- 3 cards side by side, optional lines below ----
  async cards3({ title, sub, cards, below, notes }) {
    const s = this.slide(notes);
    this.heading(s, title, sub);
    const w = 2.8, gap = 0.3, y = 1.45, h = below ? 2.45 : 3.4;
    for (let i = 0; i < cards.length; i++) {
      const { icon, color, head, body } = cards[i];
      const x = 0.5 + i * (w + gap);
      s.addShape("roundRect", { x, y, w, h, fill: { color: C.light }, line: { color: C.light }, rectRadius: 0.1 });
      await iconCircle(s, icon, x + 0.25, y + 0.25, 0.55, color);
      tb(s, head, { x: x + 0.95, y: y + 0.25, w: w - 1.1, h: 0.55, fontFace: HEAD, fontSize: 16, bold: true, valign: "middle" });
      tb(s, paras(body), { x: x + 0.25, y: y + 0.95, w: w - 0.45, h: h - 1.1, fontSize: 12, paraSpaceAfter: 6 });
    }
    if (below) tb(s, paras(below), { x: 0.5, y: 4.05, w: 9, h: 1.05, fontSize: 12, paraSpaceAfter: 5 });
    return s;
  }

  // ---- 4 or 5 blocks in a flow, each with a two-part card ----
  async flowBlocks({ title, sub, blocks, notes }) {
    const s = this.slide(notes);
    this.heading(s, title, sub);
    const n = blocks.length, gap = 0.2, w = (9 - gap * (n - 1)) / n, y = 1.5;
    for (let i = 0; i < n; i++) {
      const b = blocks[i];
      const x = 0.5 + i * (w + gap);
      const col = b.color || (i % 2 === 0 ? C.navy : C.coral);
      await iconCircle(s, b.icon, x + (w - 0.7) / 2, y, 0.7, col);
      tb(s, b.name, { x, y: y + 0.8, w, h: 0.35, fontFace: HEAD, fontSize: 16, bold: true, align: "center" });
      tb(s, b.what, { x, y: y + 1.13, w, h: 0.3, fontSize: 11, color: C.gray, align: "center" });
      if (i < n - 1) {
        s.addShape("line", { x: x + w / 2 + 0.42, y: y + 0.35, w: w + gap - 0.84, h: 0, line: { color: C.line, width: 1.5, endArrowType: "triangle" } });
      }
      s.addShape("roundRect", { x, y: y + 1.6, w, h: 1.45, fill: { color: C.light }, line: { color: C.light }, rectRadius: 0.08 });
      tb(s, [
        { text: b.k1, options: { fontSize: 9, bold: true, color: C.teal, charSpacing: 2, breakLine: true } },
        ...runs(b.v1, { fontSize: 12, bold: true, breakLine: true }),
        { text: b.k2, options: { fontSize: 9, bold: true, color: C.coral, charSpacing: 2, breakLine: true } },
        ...runs(b.v2, { fontSize: 11 }),
      ], { x: x + 0.12, y: y + 1.7, w: w - 0.24, h: 1.3, paraSpaceAfter: 3 });
    }
    return s;
  }

  // ---- icon rows, optional code panel on the right ----
  async iconRows({ title, sub, rows, panel, notes }) {
    const s = this.slide(notes);
    this.heading(s, title, sub);
    const w = panel ? 4.9 : 9;
    const step = Math.min(0.78, 3.6 / rows.length);
    for (let i = 0; i < rows.length; i++) {
      const { icon, color, head, text } = rows[i];
      const y = 1.45 + i * step;
      await iconCircle(s, icon, 0.5, y + 0.02, 0.48, color || C.navy);
      const h = runs(head, { bold: true, fontSize: 14 });
      h[h.length - 1].options.breakLine = true;
      tb(s, [...h, ...runs(text, { fontSize: 12, color: C.gray })], { x: 1.15, y, w: w - 0.65, h: step - 0.05 });
    }
    if (panel) this.codePanel(s, panel, 5.75, 1.45, 3.75, 5.1 - 1.45);
    return s;
  }

  // Dark code panel. Lines starting with # are comments. Font shrinks to fit w (and maxH).
  codePanel(s, { caption, lines, fontSize = 10.5 }, x, y, w, maxH) {
    let top = y;
    if (caption) {
      tb(s, caption, { x, y, w, h: 0.3, fontSize: 12, bold: true, color: C.gray });
      top += 0.35;
    }
    const fs = monoFit(lines, w, maxH ? maxH - (top - y) : 0, fontSize);
    const lh = fs / 72 * LH;
    const h = lines.length * lh + 0.3;
    s.addShape("roundRect", { x, y: top, w, h, fill: { color: C.navy }, line: { color: C.navy }, rectRadius: 0.06 });
    tb(s, lines.map((l, i) => ({
      text: l === "" ? " " : l,
      options: { color: l.trim().startsWith("#") ? C.codeComment : C.white, breakLine: i < lines.length - 1 },
    })), { x: x + 0.15, y: top + 0.15, w: w - 0.3, h: h - 0.3, fontFace: MONO, fontSize: fs });
    return top + h;
  }

  // Light output (console) panel.
  outputPanel(s, { caption = "Output", lines, fontSize = 10 }, x, y, w, maxH) {
    tb(s, caption, { x, y, w, h: 0.3, fontSize: 12, bold: true, color: C.gray });
    const top = y + 0.35;
    const fs = monoFit(lines, w, maxH ? maxH - 0.35 : 0, fontSize);
    const h = lines.length * fs / 72 * LH + 0.3;
    s.addShape("roundRect", { x, y: top, w, h, fill: { color: C.light }, line: { color: C.line, width: 0.75 }, rectRadius: 0.06 });
    tb(s, lines.map((l, i) => ({
      text: l === "" ? " " : l,
      options: { color: l.startsWith(">") || l.startsWith("PS ") ? C.teal : C.navy, bold: l.startsWith(">") || l.startsWith("PS "), breakLine: i < lines.length - 1 },
    })), { x: x + 0.15, y: top + 0.15, w: w - 0.3, h: h - 0.3, fontFace: MONO, fontSize: fs });
    return top + h;
  }

  // ---- 2 x 2 grid ----
  async grid4({ title, sub, cells, notes }) {
    const s = this.slide(notes);
    this.heading(s, title, sub);
    const w = 4.4, h = 1.7;
    for (let i = 0; i < cells.length; i++) {
      const { icon, color, head, text } = cells[i];
      const x = 0.5 + (i % 2) * (w + 0.2), y = 1.45 + Math.floor(i / 2) * (h + 0.2);
      s.addShape("roundRect", { x, y, w, h, fill: { color: C.light }, line: { color: C.light }, rectRadius: 0.08 });
      await iconCircle(s, icon, x + 0.22, y + 0.22, 0.5, color || C.navy);
      tb(s, runs(head), { x: x + 0.9, y: y + 0.22, w: w - 1.1, h: 0.5, fontFace: HEAD, fontSize: 15, bold: true, valign: "middle" });
      tb(s, paras(Array.isArray(text) ? text : [text], { fontSize: 12 }), { x: x + 0.22, y: y + 0.82, w: w - 0.44, h: h - 0.9, paraSpaceAfter: 3 });
    }
    return s;
  }

  // ---- table ----
  table(s, head, rows, { x = 0.5, y = 1.45, w = 9, colW, fontSize = 11, firstBold = true } = {}) {
    const hdr = head.map((t) => ({ text: t, options: { bold: true, color: C.white, fill: { color: C.navy } } }));
    const body = rows.map((r, ri) => r.map((cell, ci) => ({
      text: runs(cell, { bold: firstBold && ci === 0 }),
      options: { fill: { color: ri % 2 ? C.light : C.white } },
    })));
    s.addTable([hdr, ...body], {
      x, y, w, colW, fontFace: BODY, fontSize, color: C.navy, valign: "middle",
      border: { type: "solid", pt: 0.75, color: C.line }, margin: [4, 6, 4, 6],
    });
  }
  async tableSlide({ title, sub, head, rows, colW, below, belowY = 4.55, fontSize, notes }) {
    const s = this.slide(notes);
    this.heading(s, title, sub);
    this.table(s, head, rows, { colW, fontSize });
    if (below) tb(s, paras(below), { x: 0.5, y: belowY, w: 9, h: 5.1 - belowY, fontSize: 12, paraSpaceAfter: 4 });
    return s;
  }

  // ---- table on the left, code panel on the right ----
  async tableCode({ title, sub, head, rows, colW, fontSize = 11, panel, notes }) {
    const s = this.slide(notes);
    this.heading(s, title, sub);
    const tw = colW.reduce((a, b) => a + b, 0);
    this.table(s, head, rows, { colW, fontSize, w: tw });
    const px = 0.5 + tw + 0.3;
    this.codePanel(s, panel, px, 1.45, 9.5 - px, 5.1 - 1.45);
    return s;
  }

  // ---- two code panels side by side, optional line below ----
  async twoPanels({ title, sub, left, right, below, notes }) {
    const s = this.slide(notes);
    this.heading(s, title, sub);
    const maxH = below ? 2.75 : 3.6;
    const e1 = this.codePanel(s, left, 0.5, 1.45, 4.35, maxH);
    const e2 = right.output ? this.outputPanel(s, right, 5.15, 1.45, 4.35, maxH)
      : this.codePanel(s, right, 5.15, 1.45, 4.35, maxH);
    if (below) {
      const by = Math.min(4.4, Math.max(e1, e2) + 0.35);
      s.addShape("roundRect", { x: 0.5, y: by, w: 9, h: 0.7, fill: { color: C.light }, line: { color: C.light }, rectRadius: 0.06 });
      tb(s, [{ text: "Key idea  ", options: { bold: true, color: C.teal } }, ...runs(below)], { x: 0.7, y: by, w: 8.6, h: 0.7, fontSize: 12, valign: "middle" });
    }
    return s;
  }

  // ---- two operating systems side by side: icon + name over a code panel each ----
  async osSetup({ title, sub, left, right, below, notes }) {
    const s = this.slide(notes);
    this.heading(s, title, sub);
    const ends = [];
    for (const [i, col] of [left, right].entries()) {
      const x = 0.5 + i * 4.65;
      await iconCircle(s, col.icon, x, 1.4, 0.42, col.color);
      tb(s, col.os, { x: x + 0.55, y: 1.4, w: 3.8, h: 0.42, fontFace: HEAD, fontSize: 15, bold: true, valign: "middle" });
      ends.push(this.codePanel(s, { lines: col.lines, fontSize: 10 }, x, 1.95, 4.35, 2.4));
    }
    if (below) {
      const by = Math.min(4.45, Math.max(...ends) + 0.2);
      s.addShape("roundRect", { x: 0.5, y: by, w: 9, h: 0.65, fill: { color: C.light }, line: { color: C.light }, rectRadius: 0.06 });
      tb(s, [{ text: "Key idea  ", options: { bold: true, color: C.teal } }, ...runs(below)], { x: 0.7, y: by, w: 8.6, h: 0.65, fontSize: 12, valign: "middle" });
    }
    return s;
  }

  // ---- numbered steps + code panel ----
  async stepsCode({ title, sub, steps, panel, notes }) {
    const s = this.slide(notes);
    this.heading(s, title, sub);
    const step = Math.min(0.72, 3.6 / steps.length);
    for (let i = 0; i < steps.length; i++) {
      const y = 1.45 + i * step;
      s.addShape("ellipse", { x: 0.5, y: y + 0.02, w: 0.38, h: 0.38, fill: { color: C.coral }, line: { color: C.coral } });
      tb(s, String(i + 1), { x: 0.5, y: y + 0.02, w: 0.38, h: 0.38, fontSize: 13, bold: true, color: C.white, align: "center", valign: "middle" });
      tb(s, runs(steps[i]), { x: 1.05, y, w: 3.7, h: step - 0.04, fontSize: 12.5, valign: "middle" });
    }
    this.codePanel(s, panel, 5.05, 1.45, 4.45, 5.1 - 1.45);
    return s;
  }

  // ---- demo: heading with coral tag ----
  demoHeading(s, tag, name, part) {
    s.addShape("roundRect", { x: 0.5, y: 0.42, w: 0.62, h: 0.34, fill: { color: C.coral }, line: { color: C.coral }, rectRadius: 0.05 });
    tb(s, tag, { x: 0.5, y: 0.42, w: 0.62, h: 0.34, fontSize: 12, bold: true, color: C.white, align: "center", valign: "middle" });
    tb(s, [
      { text: name, options: { bold: true, color: C.navy } },
      { text: `  ·  ${part}`, options: { color: C.muted } },
    ], { x: 1.25, y: 0.3, w: 8.25, h: 0.6, fontFace: HEAD, fontSize: 24, valign: "middle" });
  }

  // ---- demo: code on the left, output + "watch for" on the right ----
  // code/output are arrays of lines; codeW sets the split (default 5.3 in).
  async demo({ tag, name, part = "Live demo", file, code, output, watch, codeW = 5.3, run, notes }) {
    const s = this.slide(notes);
    this.demoHeading(s, tag, name, part);
    const cmd = run || `python ${file}`;
    s.addImage({ data: await iconData("FaTerminal", C.teal), x: 0.5, y: 0.93, w: 0.22, h: 0.22 });
    tb(s, [
      { text: cmd, options: { fontFace: MONO, bold: true, color: C.teal } },
      { text: `   ${demoDir(this.n)}/${file}`, options: { color: C.muted } },
    ], { x: 0.82, y: 0.9, w: 8.6, h: 0.28, fontSize: 10, valign: "middle" });
    const top = 1.35, maxH = 5.1 - top;
    this.codePanel(s, { caption: "Code (excerpt)", lines: code, fontSize: 10 }, 0.5, top, codeW, maxH);
    const rx = 0.5 + codeW + 0.3, rw = 9.5 - rx;
    const outMax = watch ? maxH - watch.length * 0.28 - 0.5 : maxH;
    const end = this.outputPanel(s, { lines: output, fontSize: 10 }, rx, top, rw, outMax);
    if (watch) {
      tb(s, "WATCH FOR", { x: rx, y: end + 0.15, w: rw, h: 0.25, fontSize: 10, bold: true, color: C.coral, charSpacing: 3 });
      tb(s, paras(watch, { fontSize: 11.5 }, true), { x: rx, y: end + 0.42, w: rw, h: 5.1 - end - 0.42, paraSpaceAfter: 3 });
    }
    return s;
  }

  // ---- troubleshooting grid (problem -> fix) ----
  async troubleshoot({ items, notes }) {
    const s = this.slide(notes);
    this.heading(s, "Troubleshooting", "The errors students hit most often, and how to fix them");
    const w = 4.4, h = 1.1;
    for (let i = 0; i < items.length; i++) {
      const [problem, fix] = items[i];
      const x = 0.5 + (i % 2) * (w + 0.2), y = 1.4 + Math.floor(i / 2) * (h + 0.14);
      s.addShape("roundRect", { x, y, w, h, fill: { color: C.light }, line: { color: C.light }, rectRadius: 0.06 });
      s.addImage({ data: await iconData("FaExclamationTriangle", C.coral), x: x + 0.18, y: y + 0.16, w: 0.26, h: 0.26 });
      tb(s, runs(problem, { bold: true }), { x: x + 0.55, y: y + 0.1, w: w - 0.7, h: 0.38, fontSize: 12, valign: "middle" });
      tb(s, runs(fix), { x: x + 0.55, y: y + 0.48, w: w - 0.7, h: 0.58, fontSize: 11, color: C.gray });
    }
  }

  // ---- challenge ----
  async challenge({ items, notes }) {
    const s = this.slide(notes);
    this.heading(s, "Challenge", "Try these before the lab session");
    const w = 2.8, gap = 0.3, y = 1.45, h = 3.6;
    const cols = [C.teal, C.navy, C.coral];
    for (let i = 0; i < items.length; i++) {
      const { level, head, text, hint } = items[i];
      const x = 0.5 + i * (w + gap);
      s.addShape("roundRect", { x, y, w, h, fill: { color: C.light }, line: { color: C.light }, rectRadius: 0.1 });
      s.addShape("roundRect", { x: x + 0.25, y: y + 0.25, w: 0.95, h: 0.3, fill: { color: cols[i] }, line: { color: cols[i] }, rectRadius: 0.05 });
      tb(s, level, { x: x + 0.25, y: y + 0.25, w: 0.95, h: 0.3, fontSize: 10, bold: true, color: C.white, align: "center", valign: "middle" });
      tb(s, head, { x: x + 0.25, y: y + 0.7, w: w - 0.5, h: 0.65, fontFace: HEAD, fontSize: 15, bold: true });
      tb(s, runs(text), { x: x + 0.25, y: y + 1.4, w: w - 0.5, h: 1.3, fontSize: 12 });
      tb(s, [{ text: "Hint: ", options: { bold: true, color: C.teal } }, ...runs(hint, { color: C.gray })],
        { x: x + 0.25, y: y + 2.7, w: w - 0.5, h: 0.8, fontSize: 11 });
    }
  }

  // ---- summary ----
  async summary({ built, takeaways, next, nextLabel = "NEXT SESSION", notes }) {
    const s = this.slide(notes);
    this.heading(s, `Session ${this.n} Summary`, "What you ran today");
    const step = Math.min(0.95, 3.65 / built.length);
    for (let i = 0; i < built.length; i++) {
      const [tag, name, desc] = built[i];
      const y = 1.45 + i * step;
      s.addShape("roundRect", { x: 0.5, y, w: 0.62, h: 0.34, fill: { color: C.coral }, line: { color: C.coral }, rectRadius: 0.05 });
      tb(s, tag, { x: 0.5, y, w: 0.62, h: 0.34, fontSize: 12, bold: true, color: C.white, align: "center", valign: "middle" });
      tb(s, [
        { text: name, options: { bold: true, fontSize: 13, breakLine: true } },
        ...runs(desc, { fontSize: 11, color: C.gray }),
      ], { x: 1.3, y: y - 0.04, w: 3.6, h: step - 0.05 });
    }
    s.addShape("roundRect", { x: 5.2, y: 1.4, w: 4.3, h: next ? 2.35 : 3.6, fill: { color: C.light }, line: { color: C.light }, rectRadius: 0.1 });
    tb(s, "KEY TAKEAWAYS", { x: 5.45, y: 1.55, w: 3, h: 0.25, fontSize: 10, bold: true, color: C.teal, charSpacing: 3 });
    tb(s, paras(takeaways, { fontSize: 12.5 }, true), { x: 5.45, y: 1.9, w: 3.85, h: next ? 1.8 : 3.0, paraSpaceAfter: 5 });
    if (next) {
      s.addShape("roundRect", { x: 5.2, y: 3.95, w: 4.3, h: 1.1, fill: { color: C.navy }, line: { color: C.navy }, rectRadius: 0.1 });
      tb(s, [
        { text: nextLabel, options: { fontSize: 10, bold: true, color: C.coral, charSpacing: 3, breakLine: true } },
        ...runs(next, { fontSize: 13, color: C.white, bold: true }),
      ], { x: 5.45, y: 4.07, w: 3.85, h: 0.9 });
    }
    return s;
  }
}

module.exports = { Deck, C, HEAD, BODY, MONO, runs, paras, tb, iconCircle, iconData };
