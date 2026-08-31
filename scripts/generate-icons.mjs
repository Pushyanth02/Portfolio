/**
 * generate-icons.mjs — renders the portfolio infinity glyph into a complete
 * browser icon set with ZERO external dependencies:
 *
 *   favicon.ico            (16 + 32 + 48, PNG-compressed ICO entries)
 *   icon-16/32/48/192/512.png  (transparent background)
 *   apple-touch-icon.png   (180×180, solid cream — iOS hates transparency)
 *   icon-512-maskable.png  (solid cream, glyph inside the 80% safe zone)
 *
 * PNG encoding is hand-rolled (zlib deflate + CRC32), and the ∞ glyph is
 * drawn parametrically as a lemniscate of Bernoulli with soft-disc stamps,
 * supersampled 2× then box-filtered down.
 *
 * Usage: bun scripts/generate-icons.mjs
 */
import fs from "fs";
import path from "path";
import zlib from "zlib";

const OUT_DIR = path.join("public");
const CREAM = [245, 239, 227]; // #F5EFE3
const CORAL = [232, 96, 60]; // #E8603C

// ---------------- PNG encoder ----------------
const CRC_TABLE = (() => {
  const t = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c >>> 0;
  }
  return t;
})();

function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) c = CRC_TABLE[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const body = Buffer.concat([Buffer.from(type, "ascii"), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(body), 0);
  return Buffer.concat([len, body, crc]);
}

function encodePNG(width, height, rgba) {
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // colour type RGBA
  const stride = width * 4;
  const raw = Buffer.alloc((stride + 1) * height);
  for (let y = 0; y < height; y++) {
    raw[y * (stride + 1)] = 0; // filter: none
    rgba.copy(raw, y * (stride + 1) + 1, y * stride, (y + 1) * stride);
  }
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk("IHDR", ihdr),
    chunk("IDAT", zlib.deflateSync(raw, { level: 9 })),
    chunk("IEND", Buffer.alloc(0)),
  ]);
}

// ---------------- glyph rendering ----------------
function stampDisc(buf, S, x, y, r, col) {
  const x0 = Math.max(0, Math.floor(x - r - 1));
  const x1 = Math.min(S - 1, Math.ceil(x + r + 1));
  const y0 = Math.max(0, Math.floor(y - r - 1));
  const y1 = Math.min(S - 1, Math.ceil(y + r + 1));
  for (let py = y0; py <= y1; py++) {
    for (let px = x0; px <= x1; px++) {
      const d = Math.hypot(px + 0.5 - x, py + 0.5 - y);
      let cov = d <= r ? 1 : d >= r + 1 ? 0 : r + 1 - d; // 1px soft edge
      if (cov <= 0) continue;
      const idx = (py * S + px) * 4;
      const da = buf[idx + 3] / 255;
      const outA = cov + da * (1 - cov);
      if (outA <= 0) continue;
      for (let c = 0; c < 3; c++) {
        buf[idx + c] = Math.round(
          (col[c] * cov + buf[idx + c] * da * (1 - cov)) / outA
        );
      }
      buf[idx + 3] = Math.round(outA * 255);
    }
  }
}

function downsample(buf, S, f) {
  const D = S / f;
  const out = Buffer.alloc(D * D * 4);
  for (let dy = 0; dy < D; dy++) {
    for (let dx = 0; dx < D; dx++) {
      let r = 0, g = 0, b = 0, a = 0;
      for (let sy = 0; sy < f; sy++) {
        for (let sx = 0; sx < f; sx++) {
          const idx = ((dy * f + sy) * S + (dx * f + sx)) * 4;
          r += buf[idx]; g += buf[idx + 1]; b += buf[idx + 2]; a += buf[idx + 3];
        }
      }
      const n = f * f;
      const o = (dy * D + dx) * 4;
      out[o] = Math.round(r / n); out[o + 1] = Math.round(g / n);
      out[o + 2] = Math.round(b / n); out[o + 3] = Math.round(a / n);
    }
  }
  return out;
}

/**
 * Render the ∞ glyph (lemniscate of Bernoulli) at `size` px.
 * background: null → transparent, or [r,g,b]
 * glyphSpan: fraction of canvas the glyph width occupies
 */
function renderGlyph(size, { background = null, glyphSpan = 0.82 } = {}) {
  const SS = 2; // supersample factor
  const S = size * SS;
  const buf = Buffer.alloc(S * S * 4);
  for (let i = 0; i < S * S; i++) {
    const bg = background ?? [0, 0, 0];
    buf[i * 4] = bg[0]; buf[i * 4 + 1] = bg[1]; buf[i * 4 + 2] = bg[2];
    buf[i * 4 + 3] = background ? 255 : 0;
  }

  const cx = S / 2;
  const cy = S / 2;
  const a = (S * glyphSpan) / 2; // bernoulli half-width
  const rStroke = a * 0.118; // stroke radius ≈ the SVG's 2.4/20 weight
  const steps = Math.max(1200, Math.floor(a * 40));

  for (let i = 0; i <= steps; i++) {
    const t = (i / steps) * Math.PI * 2;
    const den = 1 + Math.sin(t) ** 2;
    const x = cx + (a * Math.cos(t)) / den;
    const y = cy + (a * Math.sin(t) * Math.cos(t)) / den;
    stampDisc(buf, S, x, y, rStroke, CORAL);
  }
  return downsample(buf, S, SS);
}

// ---------------- ICO builder (PNG-compressed entries) ----------------
function buildICO(entries) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // type: icon
  header.writeUInt16LE(entries.length, 4);
  const dirSize = 16 * entries.length;
  let offset = 6 + dirSize;
  const dirs = [];
  for (const e of entries) {
    const d = Buffer.alloc(16);
    d[0] = e.size & 0xff; // width (≤255)
    d[1] = e.size & 0xff; // height
    d[2] = 0; // palette
    d[3] = 0; // reserved
    d.writeUInt16LE(1, 4); // planes
    d.writeUInt16LE(32, 6); // bpp
    d.writeUInt32LE(e.data.length, 8);
    d.writeUInt32LE(offset, 12);
    offset += e.data.length;
    dirs.push(d);
  }
  return Buffer.concat([header, ...dirs, ...entries.map((e) => e.data)]);
}

// ---------------- run ----------------
fs.mkdirSync(OUT_DIR, { recursive: true });
const write = (name, bytes) => {
  fs.writeFileSync(path.join(OUT_DIR, name), bytes);
  console.log("✓", name, `${bytes.length} bytes`);
};

for (const s of [16, 32, 48, 192, 512]) {
  write(`icon-${s}.png`, encodePNG(s, s, renderGlyph(s)));
}
write("apple-touch-icon.png", encodePNG(180, 180, renderGlyph(180, { background: CREAM })));
write(
  "icon-512-maskable.png",
  encodePNG(512, 512, renderGlyph(512, { background: CREAM, glyphSpan: 0.62 }))
);
write(
  "favicon.ico",
  buildICO([16, 32, 48].map((s) => ({ size: s, data: encodePNG(s, s, renderGlyph(s)) })))
);
console.log("Icon set generated.");
